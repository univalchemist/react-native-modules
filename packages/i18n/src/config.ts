import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as basicResource from "./resources/basic.json";

/**
 * HINT: For easy testing—setting `lng` to 'cimode' will cause the t function to always return the key.
 */

const i18nConfig = {
  lng: "en",
  fallbackLng: "en",
  ns: ["basic"],
  interpolation: {
    escapeValue: false,
  },
  resources: basicResource,
  react: {
    bindI18n: "languageChanged loaded",
  },
  debug: true, // TODO:
};

i18n.use(initReactI18next).init(i18nConfig);
