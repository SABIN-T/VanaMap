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

  // Optional: Request notification permission after user interaction
  // pwaManager.requestNotificationPermission();
}).catch((error) => {
  console.warn('[App] PWA Manager failed to load:', error);
});

// Global handler for Vite dynamic import errors (Mismatch after new deployment)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'ChunkLoadError' ||
    (event.reason?.message && event.reason.message.includes('Failed to fetch dynamically imported module'))) {
    console.warn("Chunk load failed. Latest system assets could not be retrieved automatically.");
    // window.location.reload(); // Disabled to prevent infinite reload loops
  }
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
