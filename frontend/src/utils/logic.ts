import type { Plant } from '../types';

export const calculateAptness = (plant: Plant, currentTemp: number): number => {
    // Simple algorithm:
    // 1. If within ideal range -> 100%
    // 2. If outside, subtract 5% for every degree off
    // 3. Minimum 0%

    // Note: ideally we'd use humidity too if available

    if (currentTemp >= plant.idealTempMin && currentTemp <= plant.idealTempMax) {
        return 100;
    }

    let diff = 0;
    if (currentTemp < plant.idealTempMin) {
        diff = plant.idealTempMin - currentTemp;
    } else {
        diff = currentTemp - plant.idealTempMax;
    }

    const score = 100 - (diff * 5);
    return Math.max(0, score);
};

export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};

// Haversine formula to calculate distance between two points
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
