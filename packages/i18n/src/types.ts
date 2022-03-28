import { Resource } from "i18next";

export interface AvailableLanguage {
  lng: string;
  title: string;
}

export interface I18nAsset {
  lng: string;
  title: string;
  namespaces: string[];
  translations: Resource;
}

export interface LocalizationResource {
  languages: AvailableLanguage[];
  namespaces: string[];
  combinedTranslations: Resource;
}
