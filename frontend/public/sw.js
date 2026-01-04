// Service Worker for VanaMap PWA
// Version: 3.1.0
// Advanced caching strategies with offline support

const CACHE_VERSION = 'vanamap-v3.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/plants',
    '/api/vendors',
    '/api/user'
];

// Maximum cache sizes
const MAX_CACHE_SIZE = {
    images: 50,
    dynamic: 30,
    api: 20
};

// Cache duration (in milliseconds)
const CACHE_DURATION = {
    api: 5 * 60 * 1000, // 5 minutes
    images: 7 * 24 * 60 * 60 * 1000, // 7 days
    dynamic: 24 * 60 * 60 * 1000 // 24 hours
};

// ============================================
// INSTALL EVENT - Cache static assets
// ============================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v3.1.0...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

// ============================================
// ACTIVATE EVENT - Clean up old caches
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v3.1.0...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return cacheName.startsWith('vanamap-') &&
                                cacheName !== STATIC_CACHE &&
                                cacheName !== DYNAMIC_CACHE &&
                                cacheName !== IMAGE_CACHE &&
                                cacheName !== API_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// ============================================
// FETCH EVENT - Intelligent caching strategies
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extensions and other protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // API requests - Network First with Cache Fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request, API_CACHE));
        return;
    }

    // Images - Cache First with Network Fallback
    if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
        event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
        return;
    }

    // Static assets (JS, CSS) - Network First (CHANGED from Stale While Revalidate)
    // This ensures users always get the latest version after deployment
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        /\.(js|css)$/i.test(url.pathname)) {
        event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // HTML pages - Network First with Cache Fallback
    if (request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
        return;
    }

    // Default - Network First
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Network First Strategy
 * Try network first, fall back to cache if offline
 */
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        // Clone response for caching
        const responseToCache = networkResponse.clone();

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, responseToCache);
            await limitCacheSize(cacheName, MAX_CACHE_SIZE[getCacheType(cacheName)]);
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for HTML requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }

        // Return offline fallback response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Cache First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Check if cache is still fresh
        const cacheDate = new Date(cachedResponse.headers.get('date'));
        const now = new Date();
        const age = now - cacheDate;

        if (age < CACHE_DURATION[getCacheType(cacheName)]) {
            return cachedResponse;
        }
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, networkResponse.clone());
            await limitCacheSize(cacheName, MAX_CACHE_SIZE[getCacheType(cacheName)]);
        }

        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return placeholder image for failed image requests
        if (request.destination === 'image') {
            return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect fill="#e2e8f0" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="18">Image Unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }

        throw error;
    }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update cache in background
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(cacheName);
            cache.then((c) => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxSize) {
        const keysToDelete = keys.slice(0, keys.length - maxSize);
        await Promise.all(keysToDelete.map((key) => cache.delete(key)));
        console.log(`[SW] Trimmed ${cacheName} cache to ${maxSize} items`);
    }
}

/**
 * Get cache type from cache name
 */
function getCacheType(cacheName) {
    if (cacheName.includes('images')) return 'images';
    if (cacheName.includes('api')) return 'api';
    return 'dynamic';
}

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }

    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavorites());
    }
});

async function syncCart() {
    try {
        // Get pending cart updates from IndexedDB
        const db = await openDB();
        const pendingUpdates = await db.getAll('pendingCartUpdates');

        // Sync each update
        for (const update of pendingUpdates) {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update.data)
            });

            await db.delete('pendingCartUpdates', update.id);
        }

        console.log('[SW] Cart synced successfully');
    } catch (error) {
        console.error('[SW] Cart sync failed:', error);
        throw error; // Retry sync
    }
}

async function syncFavorites() {
    try {
        const db = await openDB();
        const pendingUpdates = await db.getAll('pendingFavoriteUpdates');

        for (const update of pendingUpdates) {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update.data)
            });

            await db.delete('pendingFavoriteUpdates', update.id);
        }

        console.log('[SW] Favorites synced successfully');
    } catch (error) {
        console.error('[SW] Favorites sync failed:', error);
        throw error;
    }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    const data = event.data ? event.data.json() : {};

    const title = data.title || 'VanaMap';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        image: data.image,
        vibrate: [200, 100, 200],
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [
            { action: 'open', title: 'Open App', icon: '/icons/action-open.png' },
            { action: 'close', title: 'Dismiss', icon: '/icons/action-close.png' }
        ],
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }

                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// ============================================
// PERIODIC BACKGROUND SYNC (Experimental)
// ============================================
self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync triggered:', event.tag);

    if (event.tag === 'update-plant-data') {
        event.waitUntil(updatePlantData());
    }
});

async function updatePlantData() {
    try {
        const response = await fetch('/api/plants?limit=50');
        const plants = await response.json();

        const cache = await caches.open(API_CACHE);
        await cache.put('/api/plants', new Response(JSON.stringify(plants)));

        console.log('[SW] Plant data updated in background');
    } catch (error) {
        console.error('[SW] Failed to update plant data:', error);
    }
}

// ============================================
// INDEXEDDB HELPER
// ============================================
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VanaMapDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('pendingCartUpdates')) {
                db.createObjectStore('pendingCartUpdates', { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains('pendingFavoriteUpdates')) {
                db.createObjectStore('pendingFavoriteUpdates', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// ============================================
// MESSAGE HANDLER
// ============================================
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }

    if (event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(
            getCacheSize().then((size) => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
            })
        );
    }
});

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
    }

    return totalSize;
}

console.log('[SW] Service Worker script loaded successfully');
