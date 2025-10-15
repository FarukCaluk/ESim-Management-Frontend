import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enUsers from './locales/en/users.json';
import enSimcards from './locales/en/simcards.json';
import enPackages from './locales/en/packages.json';
import enCollections from './locales/en/collections.json';
import enPlans from './locales/en/plans.json';
import enDashboard from './locales/en/dashboard.json';
import bsCommon from './locales/bs/common.json';
import bsUsers from './locales/bs/users.json';
import bsSimcards from './locales/bs/simcards.json';
import bsPackages from './locales/bs/packages.json';
import bsCollections from './locales/bs/collections.json';
import bsPlans from './locales/bs/plans.json';
import bsDashboard from './locales/bs/dashboard.json';

i18n.use(initReactI18next).init({
  resources: {
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
    bs: {
      translation: {
        ...bsCommon,
        ...bsUsers,
        ...bsSimcards,
        ...bsPackages,
        ...bsCollections,
        ...bsPlans,
        ...bsDashboard,
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
