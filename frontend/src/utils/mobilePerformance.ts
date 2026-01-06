// Mobile Performance Utilities for VanaMap

/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = (): boolean => {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detect if user is on slow connection
 */
export const isSlowConnection = (): boolean => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!connection) return false;

    // Slow if 2G or save-data is enabled
    return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.saveData === true;
};

/**
 * Get optimal image size based on device
 */
export const getOptimalImageSize = (): number => {
    const isMobile = isMobileDevice();
    const isSlow = isSlowConnection();

    if (isSlow) return 150; // Ultra-small for slow connections
    if (isMobile) return 200; // Small for mobile
    return 300; // Normal for desktop
};

/**
 * Preload critical images
 */
export const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
};

/**
 * Lazy load images with Intersection Observer
 */
export const setupLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before entering viewport
        });

        return imageObserver;
    }
    return null;
};

/**
 * Reduce motion for better mobile performance
 */
export const shouldReduceMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMobileDevice();
};

/**
 * Get optimal number of items to show initially
 */
export const getInitialItemCount = (): number => {
    const isMobile = isMobileDevice();
    const isSlow = isSlowConnection();

    if (isSlow) return 3; // Ultra-minimal for slow connections
    if (isMobile) return 4; // Minimal for mobile
    return 8; // More for desktop
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback);
    }
    return setTimeout(callback, 1);
};
