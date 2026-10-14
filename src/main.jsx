import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { prefetchRoute } from './components.jsx';
import './site.css';

const root = document.getElementById('root');
const app = (
  <HelmetProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HelmetProvider>
);

const initialPath = window.location.hash.startsWith('#/')
  ? window.location.hash.slice(1).split('?')[0]
  : '/';

if (root.querySelector('#main-content') && root.dataset.prerenderedRoute === initialPath) {
  prefetchRoute(initialPath).then(() => hydrateRoot(root, app));
} else {
  createRoot(root).render(app);
}
