import type { Plant } from '../types';

export const calculateAptness = (
    plant: Plant,
    currentTemp: number,
    aqi: number = 20,
    avgHumidity: number = 50,
    normalizationBase?: number
): number => {
    // === SCORING CONSTANTS ===
    // Total raw score potential: ~100 points without max capping, but we will clamp.
    // 1. Temperature: 40 pts
    // 2. Humidity: 30 pts
    // 3. Resilience/Bonus: 20 pts
    // 4. AQI Relevance: 10 pts

    // --- 1. Temperature Check (Critical) ---
    let tempScore = 40;
    // Buffer: Plants can usually survive 2-3 degrees outside "ideal" before strict penalty
    const buffer = 3;

    if (currentTemp < (plant.idealTempMin - buffer)) {
        // Cold stress is severe
        const diff = (plant.idealTempMin - buffer) - currentTemp;
        tempScore -= (diff * 4); // Lose 4 points per degree below safe min
    } else if (currentTemp > (plant.idealTempMax + buffer)) {
        // Heat stress
        const diff = currentTemp - (plant.idealTempMax + buffer);
        tempScore -= (diff * 3); // Lose 3 points per degree above safe max
    }
    // Boost for wide temperature tolerance
    if (plant.idealTempMax - plant.idealTempMin > 15) tempScore += 5;


    // --- 2. Humidity Check (Survival) ---
    let humidityScore = 30;
    if (avgHumidity < plant.minHumidity) {
        // Dry air stress
        const diff = plant.minHumidity - avgHumidity;
        const isSucculent = plant.stemStructure?.includes('Succulent') || plant.description?.toLowerCase().includes('cactus') || plant.foliageTexture?.includes('Waxy');

        // Succulents forgive dryness better
        const penaltyFactor = isSucculent ? 0.5 : 2;
        humidityScore -= (diff * penaltyFactor);
    } else {
        // Perfect humidity bonus
        if (avgHumidity >= plant.minHumidity + 10) humidityScore += 5;
    }


    // --- 3. Property & Resilience Bonuses ---
    let propertyScore = 0;
    const desc = (plant.description || "").toLowerCase();

    // Hardiness check
    if (desc.includes('hardy') || desc.includes('tough') || desc.includes('indestructible')) propertyScore += 10;
    // Drought tolerance
    if (desc.includes('drought') || plant.minHumidity < 35) propertyScore += 5;


    // --- 4. Air Quality Relevance ---
    let aqiScore = 0;
    const isPurifier = plant.medicinalValues?.includes('Air purification') || plant.advantages?.some(a => a.toLowerCase().includes('purif')) || desc.includes('toxin');

    if (aqi > 100) {
        // In high pollution, purifiers are MORE apt (necessary)
        if (isPurifier) aqiScore = 20;
        else aqiScore = -10; // Sensitive plants suffer
    } else if (aqi > 50 && isPurifier) {
        aqiScore = 10;
    }


    // === FINAL AGGREGATION ===
    let totalRaw = tempScore + humidityScore + propertyScore + aqiScore;

    // Critical Failure Checks (override scores to 0 if lethal conditions)
    if (currentTemp < (plant.idealTempMin - 10)) totalRaw = 0; // Frozen
    if (currentTemp > (plant.idealTempMax + 10)) totalRaw = 0; // Cooked
    if (avgHumidity < (plant.minHumidity - 30)) totalRaw = 0; // Dried out (unless cactus, handled by penalty factor but huge gap is bad)

    // Clamp between 0 and 100 (for raw)
    totalRaw = Math.max(0, Math.min(100, totalRaw));

    // Normalization logic
    // If a normalizationBase is provided (e.g., the highest raw score in the list), 
    // scale this plant's score so the best plant is 100%.
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
