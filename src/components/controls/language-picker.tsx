import React, { useState } from "react";
import "./language-picker.css";
import { LanguageIcon } from "../../icons/language";
import { resources } from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import { UnitedKingdomIcon } from "../../icons/united-kingdom";
import { AustriaIcon } from "../../icons/austria";
import { SwitzerlandIcon } from "../../icons/switzerland";
import { GermanyIcon } from "../../icons/germany";

const ICONS: Record<keyof typeof resources, any> = {
  en: (
    <UnitedKingdomIcon style={{ borderRadius: "4px" }} height={20} width={30} />
  ),
  "de-AT": (
    <AustriaIcon style={{ borderRadius: "4px" }} height={20} width={30} />
  ),
  "de-CH": (
    <SwitzerlandIcon style={{ borderRadius: "4px" }} height={20} width={20} />
  ),
  de: <GermanyIcon style={{ borderRadius: "4px" }} height={20} width={30} />,
};

export const LanguageButtons = (props: {
  height: string;
  hide: () => void;
}) => {
  const { i18n } = useTranslation();

  return (
    <div className="buttons has-addons" style={{ marginBottom: 0 }}>
      {Object.keys(resources).map((language) => (
        <button
          key={language}
          onClick={() => {
            i18n.changeLanguage(language);
            props.hide();
          }}
          style={{ height: props.height }}
          className="button has-tooltip-arrow"
        >
          {ICONS[language]}
        </button>
      ))}
    </div>
  );
};

export const LanguagePicker = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ display: "flex", height: "30px", gap: "4px" }}>
      <button
        className="language-button button"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <LanguageIcon />
      </button>

      {showMenu && (
        <LanguageButtons height="30px" hide={() => setShowMenu(false)} />
      )}
    </div>
  );
};
