import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import 'leaflet/dist/leaflet.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { ThemeProvider } from './context/ThemeContext';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "480996649148-rkab0dbajc5n6q2lhvjjjkog2in6oh5u.apps.googleusercontent.com";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW Registered'))
      .catch(err => console.log('SW Registration failed', err));
  });
}

// Global handler for Vite dynamic import errors (Mismatch after new deployment)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.name === 'ChunkLoadError' ||
    (event.reason?.message && event.reason.message.includes('Failed to fetch dynamically imported module'))) {
    console.warn("Chunk load failed, forcing reload for latest system assets...");
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// Remove pre-loader after first render
const loader = document.getElementById('pre-loader');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 250);
}
