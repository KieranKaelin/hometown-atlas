import { useMap } from "react-leaflet";
import { useStore } from "../../store";
import React, { useCallback, useState } from "react";
import { GpsIcon } from "../../icons/gps";
import { useTranslation } from "react-i18next";
import { moveSelectionAroundPoint } from "./bbox";

export const LocateControl = () => {
  const { t } = useTranslation();

  const map = useMap();
  const setSelection = useStore((store) => store.setSelection);
  const [isLocating, setIsLocating] = useState(false);
  const [showError, setShowError] = useState(false);

  const onClick = useCallback(() => {
    setIsLocating(true);
    map.locate({ setView: false, maxZoom: 16 });
    map.on("locationfound", (event) => {
      setIsLocating(false);
      moveSelectionAroundPoint({ ...event.latlng, map, setSelection });
    });
    map.on("locationerror", () => {
      setIsLocating(false);
      setShowError(true);
    });
  }, [setIsLocating, setShowError, setSelection]);

  return (
    <>
      <div className="language-picker">
        <button
          className={`language-button button ${isLocating ? "is-loading" : ""}`}
          onClick={onClick}
        >
          {isLocating ? null : <GpsIcon />}
        </button>
      </div>

      <div
        className={`modal ${showError ? "is-active" : ""}`}
        style={{ zIndex: 9999999 }}
      >
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              {t("controls.locate.errorModal.title")}
            </p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setShowError(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            {t("controls.locate.errorModal.body")}
          </section>

          <footer className="modal-card-foot">
            <div className="buttons is-justify-content-space-between">
              <button className="button" onClick={() => setShowError(false)}>
                {t("controls.cancelModal.cancel")}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
