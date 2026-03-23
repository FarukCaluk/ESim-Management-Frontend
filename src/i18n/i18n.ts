import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enUsers from './locales/en/users.json';
import enSimcards from './locales/en/simcards.json';
import enPackages from './locales/en/packages.json';
import enCollections from './locales/en/collections.json';
import enPlans from './locales/en/plans.json';
import enDashboard from './locales/en/dashboard.json';

// Supported languages in one place
export const SUPPORTED_LANGS = ['en'];

const resources = {
  en: {
    translation: {
      ...enCommon,
      ...enUsers,
      ...enSimcards,
      ...enPackages,
      ...enCollections,
      ...enPlans,
      ...enDashboard,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
