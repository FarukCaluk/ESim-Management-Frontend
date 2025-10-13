import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enUsers from './locales/en/users.json';
import enSimcards from './locales/en/simcards.json';

// Import German translations
import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deUsers from './locales/de/users.json';
import deSimcards from './locales/de/simcards.json';

/**
 * i18n configuration for the application
 * Supports English (en) and German (de)
 * Translation files are organized by module for better maintainability
 */
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        users: enUsers,
        simcards: enSimcards,
      },
      de: {
        common: deCommon,
        auth: deAuth,
        users: deUsers,
        simcards: deSimcards,
      },
    },
    fallbackLng: 'en', // Fallback language
    defaultNS: 'common', // Default namespace
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Language detection order
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
