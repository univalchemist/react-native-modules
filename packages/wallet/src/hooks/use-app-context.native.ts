import { enTextTemplates } from "../assets/i18n/en-text-templates";

export const useAppContext = () => {
  return {
    appSettings: {
      localizedText: (text: keyof typeof enTextTemplates) =>
        enTextTemplates[text],
    },
  };
};
