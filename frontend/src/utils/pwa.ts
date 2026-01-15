/**
 * PWA Registration and Management
 * Handles service worker registration, updates, and lifecycle events
 */

// Declare gtag as optional global
declare const gtag: ((...args: any[]) => void) | undefined;

interface PWAConfig {
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onOffline?: () => void;
    onOnline?: () => void;
}

class PWAManager {
    private registration: ServiceWorkerRegistration | null = null;
    private config: PWAConfig;

    constructor(config: PWAConfig = {}) {
        this.config = config;
    }

    /**
     * Register the service worker
     */
    async register(): Promise<void> {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA] Service Workers are not supported in this browser');
            return;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none' // Always check for updates
            });

            console.log('[PWA] Service Worker registered successfully');

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                this.handleUpdate();
            });

            // Check for updates every hour
            setInterval(() => {
                this.checkForUpdates();
            }, 60 * 60 * 1000);

            // Initial update check
            await this.checkForUpdates();

            // Setup connection monitoring
            this.setupConnectionMonitoring();

            // Setup install prompt
            this.setupInstallPrompt();

            // Notify success
            if (this.config.onSuccess) {
                this.config.onSuccess(this.registration);
            }

        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    }

    /**
     * Handle service worker updates
     */
    private handleUpdate(): void {
        if (!this.registration) return;

        const newWorker = this.registration.installing;
        if (!newWorker) return;

        console.log('[PWA] New Service Worker installing...');

        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New Service Worker installed, update available');

                // Notify user about update
                if (this.config.onUpdate && this.registration) {
                    this.config.onUpdate(this.registration);
                } else {
                    this.showUpdateNotification();
                }
            }
        });
    }

    /**
     * Check for service worker updates
     */
    async checkForUpdates(): Promise<void> {
        if (!this.registration) return;

        try {
            await this.registration.update();
            console.log('[PWA] Checked for updates');
        } catch (error) {
            console.error('[PWA] Update check failed:', error);
        }
    }

    /**
     * Show update notification to user
     */
    private showUpdateNotification(): void {
        const updateBanner = document.createElement('div');
        updateBanner.id = 'pwa-update-banner';
        updateBanner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideUp 0.3s ease-out;
        max-width: 90%;
      ">
        <div style="flex: 1;">
          <strong>Update Available!</strong>
          <p style="margin: 0.25rem 0 0; font-size: 0.9rem; opacity: 0.9;">
            A new version of VanaMap is ready.
          </p>
        </div>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #059669;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        ">
          Reload
        </button>
        <button onclick="this.parentElement.remove()" style="
          background: transparent;
          color: white;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1.2rem;
        ">
          ✕
        </button>
      </div>
      <style>
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      </style>
    `;

        document.body.appendChild(updateBanner);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            updateBanner.remove();
        }, 30000);
    }

    /**
     * Setup connection monitoring
     */
    private setupConnectionMonitoring(): void {
        window.addEventListener('online', () => {
            console.log('[PWA] Connection restored');
            this.showConnectionStatus('online');

            if (this.config.onOnline) {
                this.config.onOnline();
            }

            // Trigger background sync
            this.triggerBackgroundSync();
        });

        window.addEventListener('offline', () => {
            console.log('[PWA] Connection lost');
            this.showConnectionStatus('offline');

            if (this.config.onOffline) {
                this.config.onOffline();
            }
        });
    }

    /**
     * Show connection status notification
     */
    private showConnectionStatus(status: 'online' | 'offline'): void {
        const existingBanner = document.getElementById('connection-status-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.id = 'connection-status-banner';
        banner.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 600;
      ${status === 'online'
                ? 'background: #10b981; color: white;'
                : 'background: #ef4444; color: white;'}
    `;

        banner.textContent = status === 'online'
            ? '✓ Back Online'
            : '✗ You\'re Offline';

        document.body.appendChild(banner);

        setTimeout(() => {
            banner.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => banner.remove(), 300);
        }, 3000);
    }

    /**
     * Trigger background sync
     */
    private async triggerBackgroundSync(): Promise<void> {
        if (!this.registration || !('sync' in this.registration)) {
            console.warn('[PWA] Background Sync not supported');
            return;
        }

        try {
            await (this.registration as any).sync.register('sync-cart');
            await (this.registration as any).sync.register('sync-favorites');
            console.log('[PWA] Background sync registered');
        } catch (error) {
            console.error('[PWA] Background sync registration failed:', error);
        }
    }

    /**
     * Setup install prompt
     */
    private setupInstallPrompt(): void {
        let deferredPrompt: any = null;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('[PWA] Install prompt available');

            // Show custom install button
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            deferredPrompt = null;

            // Track installation
            this.trackInstallation();
        });
    }

    /**
     * Show install button
     */
    private showInstallButton(deferredPrompt: any): void {
        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed-v2');
        if (dismissed) return;

        const installButton = document.createElement('div');
        installButton.id = 'pwa-install-button';
        installButton.innerHTML = `
      <div style="
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        z-index: 9999;
        animation: slideUpFade 0.4s ease-out;
        max-width: calc(100vw - 2rem);
        width: auto;
      ">
        <div style="display: flex; align-items: center; gap: 0.75rem; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 0.9rem; white-space: nowrap;">Install VanaMap</div>
              <div style="font-size: 0.75rem; opacity: 0.9; white-space: nowrap;">Quick access</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="install-btn" style="
              background: white;
              color: #4f46e5;
              border: none;
              padding: 0.5rem 0.875rem;
              border-radius: 10px;
              font-weight: 700;
              font-size: 0.85rem;
              cursor: pointer;
              white-space: nowrap;
            ">
              Install
            </button>
            <button id="dismiss-install" style="
              background: transparent;
              color: white;
              border: none;
              padding: 0.25rem;
              cursor: pointer;
              font-size: 1.25rem;
              line-height: 1;
              opacity: 0.8;
            ">
              ✕
            </button>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideUpFade {
          from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 640px) {
          #pwa-install-button > div {
            bottom: 80px !important;
            padding: 0.625rem 0.875rem !important;
          }
        }
      </style>
    `;

        document.body.appendChild(installButton);

        // Install button click
        document.getElementById('install-btn')?.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            deferredPrompt.prompt();
            const result: any = await deferredPrompt.userChoice;

            console.log('[PWA] Install prompt outcome:', result.outcome);

            if (result.outcome === 'accepted') {
                console.log('[PWA] User accepted install');
            } else {
                console.log('[PWA] User dismissed install');
            }

            deferredPrompt = null;
            installButton.remove();
        });

        // Dismiss button click
        document.getElementById('dismiss-install')?.addEventListener('click', () => {
            localStorage.setItem('pwa-install-dismissed-v2', 'true');
            installButton.remove();
        });

        // Auto-dismiss removed to ensure visibility
        /* 
        setTimeout(() => {
            if (document.getElementById('pwa-install-button')) {
                installButton.style.animation = 'slideUpFade 0.3s ease-out reverse';
                setTimeout(() => installButton.remove(), 300);
            }
        }, 15000); 
        */
    }

    /**
     * Track installation
     */
    private trackInstallation(): void {
        // Send analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'engagement',
                event_label: 'PWA Installation'
            });
        }

        // Store installation status
        localStorage.setItem('pwa-installed', 'true');
    }

    /**
     * Request push notification permission
     */
    async requestNotificationPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('[PWA] Notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    /**
     * Subscribe to push notifications
     */
    async subscribeToPush(): Promise<PushSubscription | null> {
        if (!this.registration) {
            console.error('[PWA] Service Worker not registered');
            return null;
        }

        const hasPermission = await this.requestNotificationPermission();
        if (!hasPermission) {
            console.warn('[PWA] Notification permission denied');
            return null;
        }

        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
                ) as any
            });

            console.log('[PWA] Push subscription created');

            // Send subscription to backend
            await this.sendSubscriptionToBackend(subscription);

            return subscription;
        } catch (error) {
            console.error('[PWA] Push subscription failed:', error);
            return null;
        }
    }

    /**
     * Send subscription to backend
     */
    private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
        try {
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(subscription)
            });

            console.log('[PWA] Subscription sent to backend');
        } catch (error) {
            console.error('[PWA] Failed to send subscription:', error);
        }
    }

    /**
     * Convert VAPID key
     */
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    /**
     * Get cache size
     */
    async getCacheSize(): Promise<number> {
        if (!navigator.serviceWorker.controller) return 0;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();

            messageChannel.port1.onmessage = (event) => {
                if (event.data.type === 'CACHE_SIZE') {
                    resolve(event.data.size);
                }
            };

            navigator.serviceWorker.controller!.postMessage(
                { type: 'GET_CACHE_SIZE' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Clear all caches
     */
    async clearCache(): Promise<void> {
        if (!navigator.serviceWorker.controller) return;

        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        console.log('[PWA] Cache clear requested');
    }

    /**
     * Unregister service worker
     */
    async unregister(): Promise<void> {
        if (!this.registration) return;

        const success = await this.registration.unregister();
        if (success) {
            console.log('[PWA] Service Worker unregistered');
            this.registration = null;
        }
    }
}

// Export singleton instance
export const pwaManager = new PWAManager({
    onSuccess: () => {
        console.log('[PWA] ✓ PWA initialized successfully');
    },
    onUpdate: () => {
        console.log('[PWA] ⚡ Update available');
    },
    onOffline: () => {
        console.log('[PWA] 📵 App is offline');
    },
    onOnline: () => {
        console.log('[PWA] 📶 App is online');
    }
});

// Auto-register on load
if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
        pwaManager.register();
    });
}

export default pwaManager;

