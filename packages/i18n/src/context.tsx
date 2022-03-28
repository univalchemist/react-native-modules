import { ResourceKey } from "i18next";
import { createContext } from "react";
import { AvailableLanguage } from "./types";
export interface LocalizationStateContextValue {
  addResources: (
    language: string,
    namespace: string,
    resources: ResourceKey
  ) => void;
  addResource: (
    language: string,
    namespace: string,
    key: string,
    value: string
  ) => void;
  changeLanguage: (language: string) => void;
  getLoadedLanguages: () => Array<string>;
  availableLanguages?: Array<AvailableLanguage>;
  language: string;
}

export const LocalizationStateContext = createContext<
  LocalizationStateContextValue | undefined
>(undefined);
LocalizationStateContext.displayName = "LocalizationStateContext";
