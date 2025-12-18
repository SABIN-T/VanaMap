// Basic Service Worker for PWA Installability
const CACHE_NAME = 'vanamap-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/logo.svg',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    (event as any).waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    (event as any).respondWith(
        caches.match((event as any).request).then((response) => {
            return response || fetch((event as any).request);
        })
    );
});
