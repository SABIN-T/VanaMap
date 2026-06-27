import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getLocation } from '../utils/getLocation';

interface LocationData {
    lat: number;
    lng: number;
    city: string;
    state: string;
    country: string;
}

export const useLocationCapture = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);

    const detectLocation = async (): Promise<LocationData | null> => {
        setIsDetecting(true);
        const tid = toast.loading('Detecting your location...');

        try {
            const result = await getLocation({
                useCache: false,
                useIPFallback: true,
                highAccuracyTimeout: 10000,
                lowAccuracyTimeout: 8000
            });

            // Reverse geocode to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.latitude}&lon=${result.longitude}`
                );
                const data = await response.json();

                const locationData: LocationData = {
                    lat: result.latitude,
                    lng: result.longitude,
                    city: data.address?.city || data.address?.town || data.address?.village || result.city || '',
                    state: data.address?.state || '',
                    country: data.address?.country || ''
                };

                setLocation(locationData);

                if (result.source === 'gps' || result.source === 'cache') {
                    toast.success('Location detected!', { id: tid });
                } else if (result.source === 'ip') {
                    toast.success('Approximate location detected!', { id: tid });
                } else {
                    toast.success('Using default location', { id: tid });
                }

                setIsDetecting(false);
                return locationData;
            } catch (error) {
                console.error('Geocoding error:', error);
                // Even if geocoding fails, we still have coordinates
                const locationData: LocationData = {
                    lat: result.latitude,
                    lng: result.longitude,
                    city: result.city || '',
                    state: '',
                    country: ''
                };
                setLocation(locationData);
                toast.success('Location coordinates captured!', { id: tid });
                setIsDetecting(false);
                return locationData;
            }
        } catch (error) {
            console.error('Location detection error:', error);
            toast.error('Failed to detect location. Please try again.', { id: tid });
            setIsDetecting(false);
            return null;
        }
    };

    // Auto-detect location on mount (silent, no toast)
    useEffect(() => {
        const autoDetect = async () => {
            if (!location) {
                try {
                    const result = await getLocation({
                        useCache: true,
                        useIPFallback: true,
                        highAccuracyTimeout: 5000,
                        lowAccuracyTimeout: 5000
                    });

                    // Try reverse geocode silently
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.latitude}&lon=${result.longitude}`
                        );
                        const data = await response.json();

                        const locationData: LocationData = {
                            lat: result.latitude,
                            lng: result.longitude,
                            city: data.address?.city || data.address?.town || data.address?.village || result.city || '',
                            state: data.address?.state || '',
                            country: data.address?.country || ''
                        };

                        setLocation(locationData);
                        console.log('[Location] Auto-detected:', locationData);
                    } catch {
                        // Silently ignore geocoding errors during auto-detect
                        setLocation({
                            lat: result.latitude,
                            lng: result.longitude,
                            city: result.city || '',
                            state: '',
                            country: ''
                        });
                    }
                } catch (error) {
                    console.log('[Location] Auto-detect failed:', error);
                }
            }
        };

        autoDetect();
    }, []);

    return {
        location,
        detectLocation,
        isDetecting,
        setLocation
    };
};
