// Register Service Worker for offline support and fast loading
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
};

// Preload critical images for instant display
export const preloadCriticalImages = async (imageUrls: string[]) => {
    const promises = imageUrls.slice(0, 6).map((url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(url); // Don't fail, just continue
            img.src = url;
        });
    });

    await Promise.all(promises);
    console.log('✅ Critical images preloaded');
};

// Preload map tiles for current location
export const preloadMapTiles = (lat: number, lng: number, zoom: number = 13) => {
    const numTiles = Math.pow(2, zoom);

    // Calculate tile coordinates
    const xtile = Math.floor(((lng + 180) / 360) * numTiles);
    const ytile = Math.floor(
        ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * numTiles
    );

    // Preload center tile and surrounding tiles
    const tilesToLoad = [
        [xtile, ytile],
        [xtile - 1, ytile],
        [xtile + 1, ytile],
        [xtile, ytile - 1],
        [xtile, ytile + 1],
    ];

    tilesToLoad.forEach(([x, y]) => {
        const img = new Image();
        img.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
    });

    console.log('✅ Map tiles preloading...');
};

// Request persistent storage for better caching
export const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
    }
};
