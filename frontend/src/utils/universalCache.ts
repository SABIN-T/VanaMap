/**
 * Universal API Cache System for VanaMap
 * Speeds up the entire website by caching API responses
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    hits: number;
    key: string;
}

interface CacheConfig {
    maxSize: number;
    ttl: number; // Time to live in milliseconds
    storageKey: string;
}

class UniversalCache<T = any> {
    private cache: Map<string, CacheEntry<T>> = new Map();
    private config: CacheConfig;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            maxSize: config.maxSize || 200,
            ttl: config.ttl || 30 * 60 * 1000, // 30 minutes default
            storageKey: config.storageKey || 'vanamap_universal_cache'
        };
        this.loadFromStorage();
    }

    /**
     * Generate cache key from request parameters
     */
    private generateKey(endpoint: string, params?: any): string {
        const paramStr = params ? JSON.stringify(params) : '';
        return `${endpoint}:${paramStr}`;
    }

    /**
     * Get cached data
     */
    get(endpoint: string, params?: any): T | null {
        const key = this.generateKey(endpoint, params);
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() - entry.timestamp > this.config.ttl) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }

        // Update hit count
        entry.hits++;
        this.saveToStorage();

        console.log(`[Cache] ✅ HIT: ${endpoint} (${entry.hits} hits)`);
        return entry.data;
    }

    /**
     * Set cached data
     */
    set(endpoint: string, data: T, params?: any): void {
        const key = this.generateKey(endpoint, params);

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            hits: 1,
            key
        });

        // Limit cache size
        if (this.cache.size > this.config.maxSize) {
            this.evictOldest();
        }

        this.saveToStorage();
        console.log(`[Cache] 💾 STORED: ${endpoint}`);
    }

    /**
     * Check if data exists and is fresh
     */
    has(endpoint: string, params?: any): boolean {
        return this.get(endpoint, params) !== null;
    }

    /**
     * Invalidate specific cache entry
     */
    invalidate(endpoint: string, params?: any): void {
        const key = this.generateKey(endpoint, params);
        this.cache.delete(key);
        this.saveToStorage();
        console.log(`[Cache] 🗑️ INVALIDATED: ${endpoint}`);
    }

    /**
     * Invalidate all entries matching a pattern
     */
    invalidatePattern(pattern: string): void {
        let count = 0;
        for (const [key] of this.cache) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                count++;
            }
        }
        this.saveToStorage();
        console.log(`[Cache] 🗑️ INVALIDATED ${count} entries matching: ${pattern}`);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.saveToStorage();
        console.log('[Cache] 🧹 CLEARED all cache');
    }

    /**
     * Remove oldest/least used entries
     */
    private evictOldest(): void {
        const entries = Array.from(this.cache.entries());

        // Sort by hits (ascending) and timestamp (oldest first)
        entries.sort((a, b) => {
            if (a[1].hits !== b[1].hits) {
                return a[1].hits - b[1].hits;
            }
            return a[1].timestamp - b[1].timestamp;
        });

        // Remove bottom 20%
        const toRemove = Math.floor(this.config.maxSize * 0.2);
        for (let i = 0; i < toRemove && i < entries.length; i++) {
            this.cache.delete(entries[i][0]);
        }
    }

    /**
     * Load cache from localStorage
     */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (!stored) return;

            const data = JSON.parse(stored);
            const now = Date.now();

            // Filter out expired entries
            Object.entries(data).forEach(([key, value]: [string, any]) => {
                if (now - value.timestamp < this.config.ttl) {
                    this.cache.set(key, value);
                }
            });

            console.log(`[Cache] 📂 Loaded ${this.cache.size} entries`);
        } catch (error) {
            console.error('[Cache] Failed to load:', error);
        }
    }

    /**
     * Save cache to localStorage
     */
    private saveToStorage(): void {
        try {
            const data = Object.fromEntries(this.cache);
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        } catch (error) {
            // If localStorage is full, clear old entries
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('[Cache] Storage full, clearing old entries');
                this.evictOldest();
                this.saveToStorage();
            } else {
                console.error('[Cache] Failed to save:', error);
            }
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const entries = Array.from(this.cache.values());
        const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
        const avgAge = entries.reduce((sum, entry) => sum + (Date.now() - entry.timestamp), 0) / entries.length;

        return {
            size: this.cache.size,
            maxSize: this.config.maxSize,
            totalHits,
            avgHits: entries.length > 0 ? totalHits / entries.length : 0,
            avgAge: avgAge / 1000 / 60, // in minutes
            hitRate: totalHits / entries.length || 0
        };
    }
}

// Create specialized cache instances for different data types
export const apiCache = new UniversalCache({
    maxSize: 200,
    ttl: 30 * 60 * 1000, // 30 minutes
    storageKey: 'vanamap_api_cache'
});

export const plantCache = new UniversalCache({
    maxSize: 100,
    ttl: 60 * 60 * 1000, // 1 hour (plants don't change often)
    storageKey: 'vanamap_plant_cache'
});

export const searchCache = new UniversalCache({
    maxSize: 50,
    ttl: 15 * 60 * 1000, // 15 minutes (searches change more frequently)
    storageKey: 'vanamap_search_cache'
});

export const translationCache = new UniversalCache({
    maxSize: 300,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days (translations never change)
    storageKey: 'vanamap_translation_cache'
});

export const locationCache = new UniversalCache({
    maxSize: 50,
    ttl: 60 * 60 * 1000, // 1 hour
    storageKey: 'vanamap_location_cache'
});

/**
 * Wrapper function to cache any API call
 */
export async function cachedFetch<T>(
    endpoint: string,
    options?: RequestInit,
    params?: any,
    cacheInstance: UniversalCache<T> = apiCache,
    forceRefresh: boolean = false
): Promise<T> {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
        const cached = cacheInstance.get(endpoint, params);
        if (cached !== null) {
            return cached;
        }
    }

    // Fetch from API
    const response = await fetch(endpoint, options);

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Store in cache
    cacheInstance.set(endpoint, data, params);

    return data;
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
    apiCache.clear();
    plantCache.clear();
    searchCache.clear();
    translationCache.clear();
    locationCache.clear();
    console.log('[Cache] 🧹 All caches cleared');
}

/**
 * Get combined statistics
 */
export function getAllCacheStats() {
    return {
        api: apiCache.getStats(),
        plants: plantCache.getStats(),
        search: searchCache.getStats(),
        translation: translationCache.getStats(),
        location: locationCache.getStats()
    };
}
