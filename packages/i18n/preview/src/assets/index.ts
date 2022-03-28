import { I18nAsset } from "@ftdr/react-native-i18n";
import { ImageRequireSource } from "react-native";

/**
 * TODO: Add "en" as required
 */
export type LocalizedImage = Record<"en" | string, ImageRequireSource>;
export type LocalizedImages = Record<string, LocalizedImage>;
export type Languages = Record<string, I18nAsset>;
export interface Assets {
  images: LocalizedImages;
  languages: Languages;
}

const images: LocalizedImages = {
  A250: {
    en: require("./images/250.png"),
    es: require("./images/250_es.png"),
  },
  A270: {
    es: require("./images/250.png"),
  },
};

const languages: Languages = {
  en: require("./languages/en.lang"),
  es: require("./languages/es.lang"),
  pl: require("./languages/pl.lang"),
};

const assets: Assets = {
  images,
  languages,
};

const { A250, A270 } = images;

export { A250, A270, assets };
