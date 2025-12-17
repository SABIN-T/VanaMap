import type { Plant } from '../types';

export const calculateAptness = (plant: Plant, currentTemp: number, aqi: number = 20): number => {
    // 1. Temperature Base Score (Max 70 points)
    let tempScore = 70;
    if (currentTemp < plant.idealTempMin || currentTemp > plant.idealTempMax) {
        let diff = 0;
        if (currentTemp < plant.idealTempMin) {
            diff = plant.idealTempMin - currentTemp;
        } else {
            diff = currentTemp - plant.idealTempMax;
        }
        tempScore = Math.max(0, 70 - (diff * 5));
    }

    // 2. Air Purification/Pollution Boost (Max 30 points)
    // If AQI is high (>50), boost plants that are mentioned as air purifying
    let pollutionBoost = 0;
    const isAirPurifying =
        plant.advantages?.some(adv => adv.toLowerCase().includes('purifying')) ||
        plant.description?.toLowerCase().includes('air quality') ||
        plant.description?.toLowerCase().includes('oxygen');

    if (aqi > 50 && isAirPurifying) {
        // High pollution area: increase priority for air cleaners
        // Scale boost based on pollution severity
        pollutionBoost = Math.min(30, (aqi - 30) * 0.5);
    } else if (isAirPurifying) {
        pollutionBoost = 10; // Base appreciation for air cleaners
    }

    return Math.min(100, Math.round(tempScore + pollutionBoost));
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
