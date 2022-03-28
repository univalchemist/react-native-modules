import * as Localization from "expo-localization";
import { useEffect, useState } from "react";

export const useLocale = (defaultLocale = "en") => {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    async function getLocale() {
      try {
        const {
          locale: deviceLocale,
        } = await Localization.getLocalizationAsync();
        setLocale(deviceLocale);
      } catch (ex) {
        console.log("@ftdr/rn-i18n - cannot return device locale");
      }
    }
    getLocale();
  }, []);

  return { locale };
};
