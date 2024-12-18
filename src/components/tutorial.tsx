import { useCallback, useState } from "react";
import { acknowledgeTutorial, isTutorialAcknowledged } from "../constants";
import { LanguageButtons } from "./controls/language-picker";
import { useTranslation } from "react-i18next";
import { SetLocationIcon } from "../icons/set-location";
import { GlobalSearchIcon } from "../icons/global-search";
import { GpsIcon } from "../icons/gps";
import { LayersIcon } from "../icons/layers";

export const Tutorial = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(!isTutorialAcknowledged());

  const close = useCallback(() => setShow(false), [setShow]);
  const acknowledge = useCallback(() => {
    setShow(false);
    acknowledgeTutorial();
  }, [setShow]);

  return (
    <div
      className={`modal ${show ? "is-active" : ""}`}
      style={{ zIndex: 9999999 }}
    >
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="is-size-3 mr-1">{t("tutorial.title")}</span>{" "}
            <span className="is-size-5">{t("tutorial.attribution")}</span>
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={close}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="block">{t("tutorial.body.description")}</div>
          <ol className="content ml-4">
            <li>
              <b>{t("tutorial.body.selectPlayArea")}</b>
              <p>{t("tutorial.body.selectPlayAreaDescription")}</p>

              <p>{t("tutorial.body.selectTools")}</p>
              <div>
                <div className="is-flex is-align-items-center is-gap-1 ml-2">
                  <div width="30px">
                    <GlobalSearchIcon />
                  </div>
                  {t("tutorial.body.selectToolsSearch")}
                </div>
                <div className="is-flex is-align-items-center is-gap-1 ml-2">
                  <div width="30px">
                    <GpsIcon />
                  </div>
                  {t("tutorial.body.selectToolsGps")}
                </div>
                <div className="is-flex is-align-items-center is-gap-1 ml-2">
                  <div width="30px">
                    <SetLocationIcon />
                  </div>
                  {t("tutorial.body.selectToolsSetSelection")}
                </div>
                <div className="is-flex is-align-items-center is-gap-1 ml-2">
                  <div width="30px">
                    <LayersIcon />
                  </div>
                  {t("tutorial.body.selectToolsLayers")}
                </div>
              </div>
            </li>
            <li>
              <b>{t("tutorial.body.startGame")}</b>
              <p>{t("tutorial.body.startGameDescription")}</p>
            </li>
            <li>
              <b>{t("tutorial.body.guessName")}</b>
              <p>{t("tutorial.body.guessNameDescription")}</p>
            </li>
          </ol>
        </section>
        <footer className="modal-card-foot">
          <div
            className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
            style={{ width: "100%" }}
          >
            <div className="block">
              <LanguageButtons height="40px" hide={() => {}} />
            </div>
            <div className="block">
              <div className="buttons">
                <button className="button" onClick={acknowledge}>
                  {t("tutorial.doNotShowAgain")}
                </button>
                <button className="button is-success" onClick={close}>
                  {t("tutorial.close")}
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
