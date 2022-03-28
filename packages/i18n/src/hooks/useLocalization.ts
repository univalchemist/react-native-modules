import { useContext } from "react";
import { LocalizationStateContext } from "..";

export const useLocalization = () => {
  const localizationState = useContext(LocalizationStateContext);

  if (!localizationState) {
    throw new Error("LocalizationStateContext not initialized");
  }

  return localizationState;
};
