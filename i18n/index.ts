import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  init: () => {},
  detect: async function (callback: (lng: string | readonly string[] | undefined) => void | undefined) {
    try {
      const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (language) {
        callback(language);
        return language;
      } else {
        const locales = Localization.getLocales();
        const detectedLang = locales[0]?.languageTag || 'en-US';
        callback(detectedLang);
        return detectedLang;
      }
    } catch (error) {
      console.log('Error reading language', error);
      callback('en-US');
      return 'en-US';
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
        console.log('Error caching language', error);
    }
  },
};

// Transform translations to i18next format
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = { 
    translation: translations[lang as keyof typeof translations] 
  };
  return acc;
}, {} as any);

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
    react: {
        useSuspense: false // avoiding suspense for simple loading
    }
  });

export default i18n;
