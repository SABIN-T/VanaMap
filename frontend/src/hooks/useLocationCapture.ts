import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return null;
        }

        setIsDetecting(true);
        const tid = toast.loading('Detecting your location...');

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;

                        // Reverse geocode to get address
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        const locationData: LocationData = {
                            lat: latitude,
                            lng: longitude,
                            city: data.address?.city || data.address?.town || data.address?.village || '',
                            state: data.address?.state || '',
                            country: data.address?.country || ''
                        };

                        setLocation(locationData);
                        toast.success('Location detected!', { id: tid });
                        setIsDetecting(false);
                        resolve(locationData);
                    } catch (error) {
                        console.error('Geocoding error:', error);
                        toast.error('Failed to get address details', { id: tid });
                        setIsDetecting(false);
                        resolve(null);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    toast.error('Location access denied', { id: tid });
                    setIsDetecting(false);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    // Auto-detect location on mount (silent, no toast)
    useEffect(() => {
        const autoDetect = async () => {
            if (navigator.geolocation && !location) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );
                            const data = await response.json();

                            const locationData: LocationData = {
                                lat: latitude,
                                lng: longitude,
                                city: data.address?.city || data.address?.town || data.address?.village || '',
                                state: data.address?.state || '',
                                country: data.address?.country || ''
                            };

                            setLocation(locationData);
                            console.log('[Location] Auto-detected:', locationData);
                        } catch (error) {
                            console.log('[Location] Auto-detect failed:', error);
                        }
                    },
                    () => {
                        console.log('[Location] Auto-detect permission denied');
                    },
                    { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                );
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
