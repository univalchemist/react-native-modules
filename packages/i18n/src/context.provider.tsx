import { ResourceKey } from "i18next";
import React, { ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizationStateContext } from "./context";
import { AvailableLanguage, LocalizationResource } from "./types";

export interface LocalizationStateProviderProps {
  localizationResource: LocalizationResource;
  children?: ReactNode;
}

export const LocalizationStateProvider = ({
  localizationResource,
  children,
}: LocalizationStateProviderProps) => {
  const { namespaces, languages, combinedTranslations } = localizationResource;
  const { i18n } = useTranslation();

  const addResource = (
    language: string,
    namespace: string,
    key: string,
    value: string
  ) => {
    i18n.addResource(language, namespace, key, value);
    i18n.emit("loaded");
  };

  const addResources = (
    language: string,
    namespace: string,
    resources: ResourceKey
  ) => {
    i18n.addResources(language, namespace, resources);
    i18n.emit("loaded");
  };

  const addResourceBundle = (
    language: string,
    namespace: string,
    resources: ResourceKey
  ) => {
    i18n.addResourceBundle(language, namespace, resources, true, true);
    i18n.emit("loaded");
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getLoadedLanguages = (): string[] => {
    return (
      languages?.reduce((prev: string[], item: AvailableLanguage) => {
        if (!!i18n.getDataByLanguage(item.lng)) {
          prev.push(item.lng);
        }
        return prev;
      }, []) ?? []
    );
  };

  useEffect(() => {
    const initialize = () => {
      if (namespaces) {
        i18n.loadNamespaces(namespaces);
      }
      if (combinedTranslations) {
        const languageCodes = Object.keys(combinedTranslations);

        languageCodes.forEach((code) => {
          const namespacesPerLanguage = Object.keys(combinedTranslations[code]);

          if (namespacesPerLanguage?.length > 0) {
            namespacesPerLanguage.forEach((key) => {
              const keyValues = combinedTranslations[code][key] as ResourceKey;
              addResourceBundle(code, key, keyValues);
            });
          }
        });
      }
    };

    initialize();
  }, []);

  const contextValues = useMemo(
    () => ({
      availableLanguages: languages,
      addResource,
      addResources,
      changeLanguage,
      getLoadedLanguages,
      language: i18n.language,
    }),
    [languages, i18n.language]
  );

  return (
    <LocalizationStateContext.Provider value={contextValues}>
      {children}
    </LocalizationStateContext.Provider>
  );
};
