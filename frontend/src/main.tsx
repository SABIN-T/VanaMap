import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import 'leaflet/dist/leaflet.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from './context/ThemeContext';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "480996649148-rkab0dbajc5n6q2lhvjjjkog2in6oh5u.apps.googleusercontent.com";

// Initialize PWA with advanced features
import('./utils/pwa').then(({ pwaManager }) => {
  // PWA will auto-register in production
  console.log('[App] PWA Manager loaded');

  // Store reference for potential future use
  (window as any).__pwaManager = pwaManager;
}).catch((error) => {
  console.warn('[App] PWA Manager failed to load:', error);
});

// Initialize offline support for fast loading on any network
import('./utils/offlineSupport').then(({ registerServiceWorker, requestPersistentStorage }) => {
  registerServiceWorker();
  requestPersistentStorage();
  console.log('[App] Offline support initialized');
}).catch((error) => {
  console.warn('[App] Offline support failed:', error);
});

// Initialize auto-refresh for failed images/maps
import('./utils/autoRefresh').then(({ setupGlobalImageErrorHandler }) => {
  setupGlobalImageErrorHandler();
  console.log('[App] Auto-refresh handler initialized');
}).catch((error) => {
  console.warn('[App] Auto-refresh setup failed:', error);
});

// Global handler for Vite dynamic import errors (Mismatch after new deployment)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'ChunkLoadError' ||
    (event.reason?.message && event.reason.message.includes('Failed to fetch dynamically imported module'))) {

    event.preventDefault(); // Prevent error from showing in console

    console.warn('[App] Dynamic import failed - clearing cache and reloading...');

    // Check if we've already tried reloading
    const reloadAttempts = parseInt(sessionStorage.getItem('vanamap_reload_attempts') || '0');

    if (reloadAttempts < 2) {
      // Increment reload counter
      sessionStorage.setItem('vanamap_reload_attempts', String(reloadAttempts + 1));

      // Clear service worker caches and reload
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          Promise.all(registrations.map(reg => reg.unregister())).then(() => {
            caches.keys().then((cacheNames) => {
              Promise.all(cacheNames.map(name => caches.delete(name))).then(() => {
                console.log('[App] Caches cleared, reloading...');
                window.location.reload();
              });
            });
          });
        });
      } else {
        // No service worker, just reload
        window.location.reload();
      }
    } else {
      // Too many reload attempts, show error to user
      console.error('[App] Failed to load after multiple attempts. Please clear your browser cache manually.');
      sessionStorage.removeItem('vanamap_reload_attempts');

      // Show user-friendly error
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 99999;
        max-width: 400px;
        text-align: center;
      `;
      errorDiv.innerHTML = `
        <h2 style="margin: 0 0 1rem; color: #dc2626;">Update Required</h2>
        <p style="margin: 0 0 1.5rem; color: #64748b;">
          VanaMap has been updated. Please clear your browser cache and refresh the page.
        </p>
        <button onclick="window.location.reload(true)" style="
          background: #10b981;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        ">
          Refresh Now
        </button>
      `;
      document.body.appendChild(errorDiv);
    }
  }
});

// Clear reload counter on successful load
window.addEventListener('load', () => {
  sessionStorage.removeItem('vanamap_reload_attempts');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// Remove pre-loader after first render
const loader = document.getElementById('pre-loader');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 250);
}
