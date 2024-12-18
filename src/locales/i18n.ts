import i18next from "i18next";
import en from "./locales.en.json";
import de from "./locales.de.json";
import deAT from "./locales.de-AT.json";
import deCH from "./locales.de-CH.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const resources = {
  "de-CH": {
    translation: deCH,
  },
  "de-AT": {
    translation: deAT,
  },
  de: {
    translation: de,
  },
  en: {
    translation: en,
  },
} as const;

i18next
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["de", "de-AT", "de-CH", "en"],
    resources,
    defaultNS: "translation",
  });
