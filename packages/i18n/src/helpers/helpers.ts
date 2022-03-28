import { Resource } from "i18next";
import { AvailableLanguage, I18nAsset, LocalizationResource } from "../types";

/**
 *   takes an IETF BCP 47 language tag and retrieveing a two-character language code to remove optional script, region and variant codes
 * @param locale string as IETF BCP 47 language tag
 * @returns string as a two-character language code
 */
export const getLocaleLanguageCode = (locale: string): string =>
  locale && locale?.length > 1 ? locale?.substr(0, 2) : "en";

export const retrieveLanguagesList = (resource: Resource): string[] => {
  if (!resource || typeof resource !== "object") {
    return [];
  }

  return Object.keys(resource);
};

export const prepareI18nAssets = (
  listOfLanguages: I18nAsset[]
): LocalizationResource => {
  const namespaces: string[] = [];
  const languages: AvailableLanguage[] = [];
  const combinedTranslations: Resource = {};

  listOfLanguages.forEach((item) => {
    const { lng, title, namespaces, translations } = item;
    if (lng && title) {
      languages.push({ lng, title } as AvailableLanguage);
    }

    if (namespaces?.length > 0) {
      namespaces.push(...namespaces);
    }

    if (
      Object.keys(translations || {})?.length > 0 &&
      lng &&
      translations[lng]
    ) {
      combinedTranslations[lng] = translations[lng];
    }
  });

  if (__DEV__) {
    languages.push({
      lng: "cimode",
      title: "Debug mode",
    });
  }

  return {
    namespaces,
    languages,
    combinedTranslations,
  };
};
