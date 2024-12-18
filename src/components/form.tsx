import { useCallback, useMemo, useRef, useState } from "react";
import { CancelIcon } from "../icons/cancel";
import "./form.css";
import { random, useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { Trans, useTranslation } from "react-i18next";
import { TickIcon } from "../icons/tick";

export const Form = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [
    roads,
    isPlaying,
    isFinished,
    startDate,
    endDate,
    wrongGuesses,
    startGame,
    cancelGame,
    submitGuess,
  ] = useStore(
    useShallow((state) => [
      state.roads,
      state.isPlaying,
      state.isFinished,
      state.startDate,
      state.endDate,
      state.wrongGuesses,
      state.startGame,
      state.cancelGame,
      state.submitGuess,
    ]),
  );

  const score = useMemo(
    () => ({
      correct: roads.filter((r) => r.state === "correct").length,
      wrong: wrongGuesses,
      total: roads.length,
    }),
    [roads, wrongGuesses],
  );

  const successTooltipRef = useRef<TooltipRefProps | null>(null);
  const errorTooltipRef = useRef<TooltipRefProps | null>(null);

  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const onKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        const { result, road } = submitGuess(event.target.value);
        const fn = result ? setIsCorrect : setIsWrong;
        fn(true);
        setTimeout(() => fn(false), 1000);

        const tooltip = result ? successTooltipRef : errorTooltipRef;
        tooltip.current?.open({
          anchorSelect: "#guess-wrapper",
          content: result ? t(`success.${random(8).toString()}`) : road,
        });
        tooltip.current?.close({ delay: result ? 1000 : 5000 });

        event.target.value = "";
      }
    },
    [setIsCorrect, setIsWrong, submitGuess],
  );

  const start = useCallback(async () => {
    setIsLoading(true);
    try {
      await startGame();
    } catch (e) {}
    setIsLoading(false);
  }, [startGame, setIsLoading]);

  const elapsedMilliseconds = endDate - startDate;
  const elapsedSeconds = Math.floor(Math.abs(elapsedMilliseconds) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = Math.floor(elapsedSeconds % 60);

  return (
    <div
      className="p-5"
      style={{
        zIndex: 1000000,
        position: "absolute",
        bottom: "0",
        right: "0",
        left: "0",
      }}
    >
      {isFinished ? (
        <div className="box has-text-centered">
          <div className="block is-size-3">{t("controls.congratulations")}</div>
          <div className="block">
            <Trans
              i18nKey="controls.summary"
              values={{
                road: t("controls.roads", { count: roads.length }),
                time:
                  t("controls.time_minutes", { count: minutes }) +
                  t("controls.time_seconds", { count: seconds }),
                incorrect: t("controls.incorrect", { count: wrongGuesses }),
              }}
            />
          </div>
          <div className="block">
            <button className="button" onClick={cancelGame}>
              <span className="icon is-small">
                <TickIcon color="#fff" />
              </span>
              <span>Restart</span>
            </button>{" "}
          </div>
        </div>
      ) : isPlaying ? (
        <div>
          <p className="tag mb-4">
            {score.correct} / {score.total}
            {score.wrong ? ` (${score.wrong} wrong)` : ""}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <div id="guess-wrapper" style={{ width: "100%" }}>
              <input
                type="text"
                placeholder={t("controls.guess")}
                onKeyDown={onKeyDown}
                autoFocus
                className={`input text-input ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
              />
            </div>
            <button className="button" onClick={() => setIsCancelling(true)}>
              <span className="icon is-small">
                <CancelIcon color="#fff" />
              </span>
            </button>
          </div>
          <Tooltip ref={successTooltipRef} variant="success" className="box" />
          <Tooltip ref={errorTooltipRef} variant="error" className="box" />
        </div>
      ) : (
        <button
          className={`button is-fullwidth ${isLoading ? "is-loading" : ""}`}
          onClick={start}
        >
          {t("controls.start")}
        </button>
      )}

      <div className={`modal ${isCancelling ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              {t("controls.cancelModal.title")}
            </p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setIsCancelling(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            {t("controls.cancelModal.body")}
          </section>

          <footer className="modal-card-foot">
            <div className="buttons is-justify-content-space-between">
              <button
                className="button is-warning"
                onClick={() => {
                  setIsCancelling(false);
                  cancelGame();
                }}
              >
                {t("controls.cancelModal.cancel")}
              </button>
              <button className="button" onClick={() => setIsCancelling(false)}>
                {t("controls.cancelModal.continue")}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
