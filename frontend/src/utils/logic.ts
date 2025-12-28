import type { Plant } from '../types';

/**
 * Calculates the biological efficiency of a plant (0.0 to 1.0) based on environmental parameters.
 */
export const calculateBiologicalEfficiency = (
    plant: Plant,
    temp: number,
    humidity: number,
    lightPercent: number = 70
): number => {
    // 1. Temperature Efficiency (Gaussian Curve centered at ideal midpoint)
    const tOpt = (plant.idealTempMin + plant.idealTempMax) / 2;
    const tRange = plant.idealTempMax - plant.idealTempMin;
    // Spread of the curve depends on the plant's stated tolerance range
    const sigma = Math.max(5, tRange / 1.5);

    let tempFactor = Math.exp(-Math.pow(temp - tOpt, 2) / (2 * Math.pow(sigma, 2)));

    // Extreme lethal thresholds
    if (temp < plant.idealTempMin - 12 || temp > plant.idealTempMax + 15) tempFactor = 0;
    else if (temp < plant.idealTempMin - 5 || temp > plant.idealTempMax + 8) tempFactor *= 0.5;

    // 2. Humidity Efficiency
    let humidityFactor = 1.0;
    if (humidity < plant.minHumidity) {
        const diff = plant.minHumidity - humidity;
        const isResilient = plant.stemStructure?.includes('Succulent') || plant.description?.toLowerCase().includes('cactus');
        humidityFactor = isResilient ? Math.max(0.4, 1 - (diff / 60)) : Math.max(0.1, 1 - (diff / 30));
    } else if (humidity > 85 && (plant.ecosystem?.toLowerCase().includes('desert') || plant.minHumidity < 30)) {
        // High humidity penalty for desert plants (rot risk)
        humidityFactor = 0.7;
    }

    // 3. Light Efficiency
    // We assume the input lightPercent (0-100) is relative to the plant's specific needs.
    // If the plant needs High light and we have 20%, it's bad.
    const lightFactor = Math.max(0.2, lightPercent / 100);

    return tempFactor * humidityFactor * lightFactor;
};

export const calculateAptness = (
    plant: Plant,
    currentTemp: number,
    aqi: number = 20,
    avgHumidity: number = 50,
    normalizationBase?: number
): number => {
    // === SCORING CONSTANTS ===
    // Total potential: 100 points

    // 1. Biological Match: 70 pts
    const bioEfficiency = calculateBiologicalEfficiency(plant, currentTemp, avgHumidity);
    let bioScore = bioEfficiency * 70;

    // 2. Resilience Bonus: 15 pts
    let resilienceScore = 0;
    const desc = (plant.description || "").toLowerCase();
    if (desc.includes('hardy') || desc.includes('tough') || desc.includes('low maintenance')) resilienceScore += 10;
    if (plant.idealTempMax - plant.idealTempMin > 18) resilienceScore += 5;

    // 3. Air Quality Relevance: 15 pts
    let aqiScore = 0;
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif')) ||
        desc.includes('toxin') || desc.includes('benzene');

    if (aqi > 100) {
        // In high pollution, purifiers are MORE apt (necessary)
        if (isPurifier) aqiScore = 15;
        else aqiScore = -10; // Sensitive plants suffer
    } else if (isPurifier) {
        aqiScore = 5 + (aqi / 20); // Slight boost as AQI worsens
    }

    // === FINAL AGGREGATION ===
    let totalRaw = bioScore + resilienceScore + aqiScore;

    // Clamp between 0 and 100
    totalRaw = Math.max(0, Math.min(100, totalRaw));

    if (normalizationBase && normalizationBase > 0) {
        return Math.round((totalRaw / normalizationBase) * 100);
    }

    return Math.round(totalRaw);
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
