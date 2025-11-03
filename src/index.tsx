import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/index.css';
import App from './app/app';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
