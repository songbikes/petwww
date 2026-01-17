import { getLanguageFromRegion } from "@/constants/Languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de";
import enGB from "./locales/en-GB";
import enUS from "./locales/en-US";
import es from "./locales/es";
import fr from "./locales/fr";
import ja from "./locales/ja";
import ko from "./locales/ko";
import pt from "./locales/pt";
import th from "./locales/th";
import tr from "./locales/tr";
import zhHans from "./locales/zh-Hans";
import zhHant from "./locales/zh-Hant";

const STORE_LANGUAGE_KEY = "settings.lang";

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  init: () => {},
  detect: async function (
    callback: (lng: string | readonly string[] | undefined) => void | undefined,
  ) {
    try {
      const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (language) {
        callback(language);
        return language;
      } else {
        const locales = Localization.getLocales();
        // Use region-based detection as per requirement
        // "If the user location matches one of the country in the language selector..."
        const regionCode = locales[0]?.regionCode;
        const detectedLang = getLanguageFromRegion(regionCode);

        callback(detectedLang);
        return detectedLang;
      }
    } catch (error) {
      console.log("Error reading language", error);
      callback("en-US");
      return "en-US";
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.log("Error caching language", error);
    }
  },
};

const resources = {
  "en-US": { translation: enUS },
  "en-GB": { translation: enGB },
  "zh-Hans": { translation: zhHans },
  "zh-Hant": { translation: zhHant },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  pt: { translation: pt },
  th: { translation: th },
  tr: { translation: tr },
  ko: { translation: ko },
  ja: { translation: ja },
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
