// Advanced Service Worker for VanaMap v2.0
const CACHE_NAME = 'vanamap-v5-mobile-fix';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/logo.png',
    '/manifest.json'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching core assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control immediately
});

// Fetch: Strategies
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Navigation (HTML): Network First
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // 2. API & Static Assets: Stale-While-Revalidate
    // Strategy: Serve cached content right away (fast), update cache in background.
    if (url.pathname.startsWith('/api') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2)$/)
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Update cache
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Network failed
                        return cachedResponse;
                    });

                    // Return cache if available, else wait for network
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // 3. Default: Network Only
    event.respondWith(fetch(event.request));
});

// --- PUSH NOTIFICATIONS ---
self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('[SW] Push Received:', data);

    const options = {
        body: data.body,
        icon: data.icon || '/logo.png',
        badge: '/logo.png',
        data: { url: data.url || '/' },
        vibrate: [100, 50, 100],
        actions: [
            { action: 'explore', title: 'View Details' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'VanaMap Update', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            const url = event.notification.data.url;
            // Focus existing window if open
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
