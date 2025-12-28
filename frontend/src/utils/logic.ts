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
    normalizationBase?: number,
    isAbsolute?: boolean
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
        if (isPurifier) aqiScore = 15;
        else aqiScore = -10;
    } else if (isPurifier) {
        aqiScore = 5 + (aqi / 20);
    }

    // === FINAL AGGREGATION ===
    let totalRaw = bioScore + resilienceScore + aqiScore;

    // Clamp between 0 and 100
    totalRaw = Math.max(0, Math.min(100, totalRaw));

    // If absolute mode is requested, return raw score regardless of normalizationBase
    if (isAbsolute) return Math.round(totalRaw);

    if (normalizationBase && normalizationBase > 0) {
        // Robust Normalization: Only scale to 100 if the base is reasonably healthy
        // If the best plant only scores 30%, we shouldn't normalize it to 100% 
        // as that's misleading. We'll use a 60% threshold for "Confident Scaling".
        const confidenceThreshold = 60;
        const scaleFactor = normalizationBase < confidenceThreshold ? (normalizationBase / confidenceThreshold) : 1;

        return Math.round((totalRaw / normalizationBase) * 100 * scaleFactor);
    }

    return Math.round(totalRaw);
};

/**
 * Monte Carlo Room Simulation
 * Simulates a stochastic environment over a duration to determine oxygen balance.
 */
export const runRoomSimulationMC = (
    plant: Plant,
    numPeople: number,
    hours: number,
    baseTemp: number,
    baseHumidity: number,
    baseLight: number,
    iterations: number = 500
) => {
    // Constants
    const O2_NEED_PER_PERSON_HOURLY = 550 / 24; // ~23L/hr
    const totalRequiredO2 = O2_NEED_PER_PERSON_HOURLY * numPeople * hours;

    // Plant Base Hourly Output (scaled to hour from L/day)
    const baseHourlyOutput = (parseFloat(plant.oxygenLevel) || 20) / 24;
    const isCAM = plant.isNocturnal || plant.name.toLowerCase().includes('snake') || plant.name.toLowerCase().includes('aloe');

    let successResults: number[] = [];

    for (let i = 0; i < iterations; i++) {
        let totalPlantO2 = 0;

        for (let h = 0; h < hours; h++) {
            // Apply Stochastic Jitter (Normal Distribution approximations)
            const jitterTemp = baseTemp + (Math.random() - 0.5) * 4; // +/- 2 deg
            const jitterHumidity = baseHumidity + (Math.random() - 0.5) * 10; // +/- 5%

            // Light varies by hour (Assuming 8 AM to 8 PM is day)
            // If simulation starts now? Let's assume day/night cycle
            const currentHour = (new Date().getHours() + h) % 24;
            const isDaylight = currentHour >= 8 && currentHour <= 20;

            let hourlyLight = baseLight;
            if (!isDaylight) {
                hourlyLight = isCAM ? baseLight * 0.2 : 0; // CAM plants still work a bit at night
            } else {
                hourlyLight = baseLight * (1 + (Math.random() - 0.5) * 0.3); // +/- 15% flux
            }

            const efficiency = calculateBiologicalEfficiency(plant, jitterTemp, jitterHumidity, hourlyLight);

            // If it's night and NOT a CAM plant, the plant consumes O2 (respiration)
            // Respiration is usually ~5-10% of peak photosynthesis
            if (!isDaylight && !isCAM) {
                totalPlantO2 -= (baseHourlyOutput * 0.1);
            } else {
                totalPlantO2 += (baseHourlyOutput * efficiency);
            }
        }
        successResults.push(totalPlantO2);
    }

    // Sort and find a safe percentile (e.g., 5th percentile for "Worst Case" production)
    successResults.sort((a, b) => a - b);
    const pessimisticProduction = successResults[Math.floor(iterations * 0.05)];

    // Calculate plants needed to match the totalRequiredO2 based on pessimistic production
    const plantsNeeded = Math.max(1, Math.ceil(totalRequiredO2 / Math.max(0.1, pessimisticProduction)));

    return {
        plantsNeeded,
        avgProductionPerPlant: successResults.reduce((a, b) => a + b, 0) / iterations,
        isLethal: pessimisticProduction < 0
    };
};

export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    const maxScore = Math.max(...scores);
    if (maxScore === 0) return scores;

    // Proper Scientific Reasoning: 
    // Normalization should reflect "Relative Best Fit" within the context of the user's climate.
    // However, if the best fit is still scientifically poor (low efficiency), 
    // we must not present it as a "Perfect 100% Match".
    const confidenceThreshold = 60;
    const scaleFactor = maxScore < confidenceThreshold ? (maxScore / confidenceThreshold) : 1;

    return scores.map(s => Math.round((s / maxScore) * 100 * scaleFactor));
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
