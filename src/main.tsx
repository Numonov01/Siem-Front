import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import { TranslationProvider } from './layouts/app/TranslationContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <TranslationProvider> */}
    <App />
    {/* </TranslationProvider> */}
  </React.StrictMode>
);
