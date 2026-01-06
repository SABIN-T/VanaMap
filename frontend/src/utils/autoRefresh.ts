// Auto-refresh utility for failed image/map loads
let failedLoadCount = 0;
const MAX_RETRIES = 2;
const RETRY_KEY = 'vanamap_auto_refresh_count';

/**
 * Track failed image loads and auto-refresh if needed
 */
export const handleImageLoadError = (imageUrl: string, retryCallback?: () => void) => {
    console.warn(`[AutoRefresh] Image failed to load: ${imageUrl}`);

    // Try callback first (retry loading the image)
    if (retryCallback) {
        setTimeout(() => {
            console.log('[AutoRefresh] Retrying image load...');
            retryCallback();
        }, 1000);
        return;
    }

    // If no callback, consider hard refresh
    failedLoadCount++;

    if (failedLoadCount >= 3) {
        triggerAutoRefresh('Multiple images failed to load');
    }
};

/**
 * Track failed map tile loads and auto-refresh if needed
 */
export const handleMapTileError = () => {
    console.warn('[AutoRefresh] Map tiles failed to load');

    const mapFailures = parseInt(sessionStorage.getItem('map_tile_failures') || '0');
    sessionStorage.setItem('map_tile_failures', String(mapFailures + 1));

    if (mapFailures >= 5) {
        triggerAutoRefresh('Map tiles failed to load');
        sessionStorage.removeItem('map_tile_failures');
    }
};

/**
 * Trigger automatic hard refresh
 */
const triggerAutoRefresh = (reason: string) => {
    const refreshCount = parseInt(sessionStorage.getItem(RETRY_KEY) || '0');

    if (refreshCount >= MAX_RETRIES) {
        console.error('[AutoRefresh] Max retries reached. Manual refresh required.');
        showRefreshPrompt(reason);
        return;
    }

    console.log(`[AutoRefresh] Triggering hard refresh (${refreshCount + 1}/${MAX_RETRIES}): ${reason}`);
    sessionStorage.setItem(RETRY_KEY, String(refreshCount + 1));

    // Clear all caches and reload
    clearCachesAndReload();
};

/**
 * Clear all caches and perform hard reload
 */
const clearCachesAndReload = async () => {
    try {
        // Clear service worker caches
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
        }

        // Clear browser caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        // Clear localStorage (except important data)
        const userdata = localStorage.getItem('user');
        localStorage.clear();
        if (userdata) localStorage.setItem('user', userdata);

        // Hard reload
        window.location.reload();
    } catch (error) {
        console.error('[AutoRefresh] Cache clear failed:', error);
        window.location.reload();
    }
};

/**
 * Show manual refresh prompt to user
 */
const showRefreshPrompt = (reason: string) => {
    const existingPrompt = document.getElementById('refresh-prompt');
    if (existingPrompt) return;

    const prompt = document.createElement('div');
    prompt.id = 'refresh-prompt';
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        z-index: 999999;
        max-width: 400px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        animation: slideIn 0.3s ease-out;
    `;

    prompt.innerHTML = `
        <style>
            @keyframes slideIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        </style>
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔄</div>
            <h2 style="margin: 0 0 0.5rem; color: #fff; font-size: 1.5rem;">Refresh Needed</h2>
            <p style="margin: 0 0 1.5rem; color: #94a3b8; font-size: 0.95rem;">
                ${reason}. Please refresh the page to reload content.
            </p>
            <button id="manual-refresh-btn" style="
                background: #10b981;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 8px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                Refresh Now
            </button>
        </div>
    `;

    document.body.appendChild(prompt);

    document.getElementById('manual-refresh-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem(RETRY_KEY);
        clearCachesAndReload();
    });
};

/**
 * Reset refresh counter on successful load
 */
export const resetRefreshCounter = () => {
    sessionStorage.removeItem(RETRY_KEY);
    sessionStorage.removeItem('map_tile_failures');
    failedLoadCount = 0;
};

/**
 * Setup global image error handler
 */
export const setupGlobalImageErrorHandler = () => {
    // Reset counter on page load
    window.addEventListener('load', resetRefreshCounter);

    // Monitor image load errors
    document.addEventListener('error', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            handleImageLoadError(img.src, () => {
                // Retry loading the image once
                const originalSrc = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'retry=' + Date.now();
                }, 500);
            });
        }
    }, true);

    console.log('[AutoRefresh] Global error handler initialized');
};
