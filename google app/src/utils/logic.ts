import type { Plant } from '../types';

export const calculateAptness = (plant: Plant, currentTemp: number, aqi: number = 20, avgHumidity: number = 50): number => {
    // 1. Temperature Base Score (Max 50 points)
    let tempScore = 50;
    if (currentTemp < plant.idealTempMin || currentTemp > plant.idealTempMax) {
        let diff = 0;
        if (currentTemp < plant.idealTempMin) {
            diff = plant.idealTempMin - currentTemp;
        } else {
            diff = currentTemp - plant.idealTempMax;
        }
        tempScore = Math.max(0, 50 - (diff * 5));
    }

    // 2. Humidity Matching (Max 20 points)
    // Most plants want at least their minHumidity. If it's too dry, penalize.
    let humidityScore = 20;
    if (avgHumidity < plant.minHumidity) {
        const hDiff = plant.minHumidity - avgHumidity;
        humidityScore = Math.max(0, 20 - (hDiff * 0.8));
    }

    // 3. Air Purification/Pollution Boost (Max 30 points)
    let pollutionBoost = 0;
    const isAirPurifying =
        plant.advantages?.some(adv => adv.toLowerCase().includes('purifying')) ||
        plant.description?.toLowerCase().includes('air quality') ||
        plant.description?.toLowerCase().includes('oxygen');

    if (aqi > 50 && isAirPurifying) {
        // High pollution area: focus on air cleaners
        pollutionBoost = Math.min(30, (aqi - 30) * 0.5);
    } else if (isAirPurifying) {
        pollutionBoost = 10;
    }

    return Math.min(100, Math.round(tempScore + humidityScore + pollutionBoost));
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
