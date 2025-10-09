import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enUsers from './locales/en/users.json';
import enSimcards from './locales/en/simcards.json';
import enPackages from './locales/en/packages.json';
import bsCommon from './locales/bs/common.json';
import bsUsers from './locales/bs/users.json';
import bsSimcards from './locales/bs/simcards.json';
import bsPackages from './locales/bs/packages.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...enCommon,
        ...enUsers,
        ...enSimcards,
        ...enPackages,
      },
    },
    bs: {
      translation: {
        ...bsCommon,
        ...bsUsers,
        ...bsSimcards,
        ...bsPackages,
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
