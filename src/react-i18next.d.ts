import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: {
        appName: string;
        logout: string;
        loading: string;
        error: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        yes: string;
        no: string;
        notAvailable: string;
        hideSidebar: string;
        showSidebar: string;
      };
      auth: {
        loginTitle: string;
        email: string;
        emailPlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        loginButton: string;
        loginFailed: string;
        errorOccurred: string;
        unauthorized: string;
      };
      users: {
        title: string;
        loadingUsers: string;
        errorLoadingUsers: string;
        table: {
          id: string;
          avatar: string;
          name: string;
          email: string;
          verified: string;
          language: string;
          currency: string;
          type: string;
          credits: string;
          totalOrders: string;
          phone: string;
          lastGiftOrder: string;
        };
      };
      simcards: {
        title: string;
        simCards: string;
      };
    };
  }
}

