import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome',
        logout: 'Logout',
        users: 'Users',
        simcards: 'SIM Cards',
        hideSidebar: 'Hide Sidebar',
        showSidebar: 'Show Sidebar',
        table: {
          id: 'ID',
          avatar: 'Avatar',
          name: 'Name',
          email: 'Email',
          verified: 'Verified',
          language: 'Language',
          currency: 'Currency',
          type: 'Type',
          credits: 'Credits',
          totalOrders: 'Total Orders',
          phone: 'Phone',
          lastGiftOrder: 'Last Gift Order',
          simcardId: 'ID',
          iccid: 'ICCID',
          userId: 'User ID',
          providerId: 'Provider ID',
          orderId: 'Order ID',
          comment: 'Comment',
          reserved: 'Reserved',
          expiration: 'Expiration',
          yes: 'Yes',
          no: 'No',
        },
      },
    },
    bs: {
      translation: {
        welcome: 'Dobrodošli',
        logout: 'Odjava',
        users: 'Korisnici',
        simcards: 'SIM kartice',
        hideSidebar: 'Sakrij meni',
        showSidebar: 'Prikaži meni',
        table: {
          id: 'ID',
          avatar: 'Avatar',
          name: 'Ime',
          email: 'Email',
          verified: 'Verifikovan',
          language: 'Jezik',
          currency: 'Valuta',
          type: 'Tip',
          credits: 'Krediti',
          totalOrders: 'Ukupno narudžbi',
          phone: 'Telefon',
          lastGiftOrder: 'Zadnja poklon narudžba',
          simcardId: 'ID',
          iccid: 'ICCID',
          userId: 'ID korisnika',
          providerId: 'ID provajdera',
          orderId: 'ID narudžbe',
          comment: 'Komentar',
          reserved: 'Rezervisana',
          expiration: 'Ističe',
          yes: 'Da',
          no: 'Ne',
        },
      },
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
