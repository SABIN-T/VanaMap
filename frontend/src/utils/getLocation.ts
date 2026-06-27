/**
 * Robust Geolocation Utility
 * 
 * Provides reliable location detection with:
 * 1. Cascading accuracy (high → low accuracy fallback)
 * 2. IP-based fallback when GPS completely fails
 * 3. SessionStorage caching to avoid re-prompting
 * 4. Proper timeouts for mobile devices
 * 5. Friendly error messages
 */

export interface GeoResult {
    latitude: number;
    longitude: number;
    source: 'gps' | 'ip' | 'cache' | 'default';
    city?: string;
    accuracy?: number;
}

interface GetLocationOptions {
    /** Use cached location if available (default: true) */
    useCache?: boolean;
    /** Try IP fallback if GPS fails (default: true) */
    useIPFallback?: boolean;
    /** Timeout for high accuracy GPS in ms (default: 10000) */
    highAccuracyTimeout?: number;
    /** Timeout for low accuracy GPS in ms (default: 8000) */
    lowAccuracyTimeout?: number;
    /** Skip GPS entirely and go straight to IP (default: false) */
    ipOnly?: boolean;
}

const CACHE_KEY_LAT = 'user_latitude';
const CACHE_KEY_LNG = 'user_longitude';
const CACHE_KEY_TIME = 'user_location_time';
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached location from sessionStorage if still fresh
 */
function getCachedLocation(): GeoResult | null {
    try {
        const lat = sessionStorage.getItem(CACHE_KEY_LAT);
        const lng = sessionStorage.getItem(CACHE_KEY_LNG);
        const time = sessionStorage.getItem(CACHE_KEY_TIME);
        
        if (lat && lng && time) {
            const age = Date.now() - parseInt(time, 10);
            if (age < CACHE_MAX_AGE_MS) {
                return {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lng),
                    source: 'cache'
                };
            }
        }
    } catch {
        // sessionStorage not available
    }
    return null;
}

/**
 * Save location to sessionStorage
 */
function cacheLocation(lat: number, lng: number): void {
    try {
        sessionStorage.setItem(CACHE_KEY_LAT, lat.toString());
        sessionStorage.setItem(CACHE_KEY_LNG, lng.toString());
        sessionStorage.setItem(CACHE_KEY_TIME, Date.now().toString());
    } catch {
        // Ignore storage errors
    }
}

/**
 * Attempt GPS with specific options, wrapped in a Promise with proper timeout
 */
function tryGPS(highAccuracy: boolean, timeoutMs: number): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('GPS_NOT_SUPPORTED'));
            return;
        }

        // Safety net: if the browser doesn't fire the error callback within the timeout,
        // force-reject so the promise doesn't hang forever
        const safetyTimer = setTimeout(() => {
            reject(new Error('GPS_SAFETY_TIMEOUT'));
        }, timeoutMs + 3000);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(safetyTimer);
                resolve(pos);
            },
            (err) => {
                clearTimeout(safetyTimer);
                reject(err);
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: timeoutMs,
                maximumAge: highAccuracy ? 0 : 60000
            }
        );
    });
}

/**
 * IP-based location fallback using ipapi.co
 */
async function getIPLocation(): Promise<GeoResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
        const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`IP API returned ${response.status}`);
        }

        const data = await response.json();
        if (data.latitude && data.longitude) {
            return {
                latitude: data.latitude,
                longitude: data.longitude,
                source: 'ip',
                city: data.city || undefined
            };
        }
        throw new Error('IP API returned no coordinates');
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

/**
 * Main location detection function with cascading fallbacks:
 * 
 * 1. Check sessionStorage cache
 * 2. Try high-accuracy GPS (10s timeout)
 * 3. Retry with low-accuracy GPS (8s timeout) 
 * 4. Fall back to IP-based geolocation
 * 5. Return default location (Delhi) as last resort
 */
export async function getLocation(options: GetLocationOptions = {}): Promise<GeoResult> {
    const {
        useCache = true,
        useIPFallback = true,
        highAccuracyTimeout = 10000,
        lowAccuracyTimeout = 8000,
        ipOnly = false
    } = options;

    // Step 1: Check cache
    if (useCache) {
        const cached = getCachedLocation();
        if (cached) return cached;
    }

    // Step 2 & 3: Try GPS (unless ipOnly)
    if (!ipOnly && navigator.geolocation) {
        // Try high accuracy first
        try {
            const pos = await tryGPS(true, highAccuracyTimeout);
            const result: GeoResult = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                source: 'gps',
                accuracy: pos.coords.accuracy
            };
            cacheLocation(result.latitude, result.longitude);
            return result;
        } catch (highAccErr: any) {
            console.warn('[Location] High-accuracy GPS failed:', highAccErr.message || highAccErr.code);

            // If it's a permission denial, don't bother with low-accuracy retry
            if (highAccErr.code === 1 /* PERMISSION_DENIED */) {
                // Fall through to IP
            } else {
                // Try low accuracy as a fallback
                try {
                    const pos = await tryGPS(false, lowAccuracyTimeout);
                    const result: GeoResult = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        source: 'gps',
                        accuracy: pos.coords.accuracy
                    };
                    cacheLocation(result.latitude, result.longitude);
                    return result;
                } catch (lowAccErr: any) {
                    console.warn('[Location] Low-accuracy GPS also failed:', lowAccErr.message || lowAccErr.code);
                }
            }
        }
    }

    // Step 4: IP fallback
    if (useIPFallback) {
        try {
            const ipResult = await getIPLocation();
            cacheLocation(ipResult.latitude, ipResult.longitude);
            return ipResult;
        } catch (ipErr) {
            console.warn('[Location] IP fallback failed:', ipErr);
        }
    }

    // Step 5: Default location (Delhi, India)
    return {
        latitude: 28.6139,
        longitude: 77.2090,
        source: 'default'
    };
}

/**
 * Clear the location cache (use when user clicks "refresh location")
 */
export function clearLocationCache(): void {
    try {
        sessionStorage.removeItem(CACHE_KEY_LAT);
        sessionStorage.removeItem(CACHE_KEY_LNG);
        sessionStorage.removeItem(CACHE_KEY_TIME);
    } catch {
        // Ignore
    }
}

/**
 * Convert a GeolocationPositionError code into a user-friendly message
 */
export function friendlyGeoError(error: GeolocationPositionError | Error): string {
    if ('code' in error) {
        switch ((error as GeolocationPositionError).code) {
            case 1: return 'Location permission denied. Please enable location access in your browser settings.';
            case 2: return 'Location currently unavailable. GPS signal may be weak — try moving outdoors.';
            case 3: return 'Location request timed out. Please try again.';
            default: return 'Could not determine your location. Please try again.';
        }
    }
    if (error.message === 'GPS_NOT_SUPPORTED') {
        return 'Your browser does not support GPS. Using approximate location.';
    }
    if (error.message === 'GPS_SAFETY_TIMEOUT') {
        return 'GPS took too long to respond. Using approximate location.';
    }
    return 'Could not determine your location. Please try again.';
}
