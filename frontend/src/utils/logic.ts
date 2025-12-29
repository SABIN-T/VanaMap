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

/**
 * Monte Carlo Aptness Calculation
 * Instead of static averages, this simulates a 7-day period (168h) with stochastic weather.
 * Returns a score based on biological stability and resilience.
 */
export const calculateAptnessMC = (
    plant: Plant,
    baseTemp: number,
    aqi: number = 20,
    baseHumidity: number = 50,
    iterations: number = 200 // Faster iterations for batch processing
): number => {
    let totalScoreSum = 0;

    for (let i = 0; i < iterations; i++) {
        let biologicalStability = 0;
        const simulationWindow = 24; // Check a 24h cycle for ranking

        for (let h = 0; h < simulationWindow; h++) {
            // Apply Diurnal & Stochastic Jitter
            // Assume 6 degree diurnal swing + 3 degree random flux
            const hour = h % 24;
            const diurnalEffect = Math.sin((hour - 8) * (Math.PI / 12)) * 3;
            const jitterTemp = baseTemp + diurnalEffect + (Math.random() - 0.5) * 3;
            const jitterHumidity = baseHumidity + (Math.random() - 0.5) * 15;

            const efficiency = calculateBiologicalEfficiency(plant, jitterTemp, jitterHumidity);
            biologicalStability += efficiency;
        }

        const avgEfficiency = biologicalStability / simulationWindow;

        // Resilience Points (Static)
        let bonus = 0;
        const desc = (plant.description || "").toLowerCase();
        if (desc.includes('hardy') || desc.includes('tough')) bonus += 10;
        if (plant.idealTempMax - plant.idealTempMin > 18) bonus += 5;

        // AQI Points
        let aqiPoints = 0;
        const isPurifier = plant.medicinalValues?.includes('Air purification') ||
            plant.advantages?.some(a => a.toLowerCase().includes('purif'));
        if (aqi > 100) aqiPoints = isPurifier ? 15 : -10;
        else if (isPurifier) aqiPoints = 5;

        totalScoreSum += (avgEfficiency * 70) + bonus + aqiPoints;
    }

    return Math.max(0, Math.min(100, Math.round(totalScoreSum / iterations)));
};

export const calculateAptness = (
    plant: Plant,
    currentTemp: number,
    aqi: number = 20,
    avgHumidity: number = 50,
    normalizationBase?: number,
    isAbsolute?: boolean,
    iterations?: number
): number => {
    // We now point calculateAptness to the MC version for robustness
    const mcScore = calculateAptnessMC(plant, currentTemp, aqi, avgHumidity, iterations);

    // If absolute mode is requested, return raw score regardless of normalizationBase
    if (isAbsolute) return mcScore;

    if (normalizationBase && normalizationBase > 0) {
        const confidenceThreshold = 60;
        const scaleFactor = normalizationBase < confidenceThreshold ? (normalizationBase / confidenceThreshold) : 1;
        return Math.round((mcScore / normalizationBase) * 100 * scaleFactor);
    }

    return mcScore;
};

/**
 * Monte Carlo Room Simulation
 * Simulates a stochastic environment over a duration to determine oxygen balance.
 */
export const runRoomSimulationMC = (
    plant: Plant,
    numPeople: number,
    stayHours: number,
    baseTemp: number,
    baseHumidity: number,
    baseLight: number,
    iterations: number = 500
) => {
    const O2_NEED_PER_PERSON_HOURLY = 550 / 24;
    const totalRequiredO2 = O2_NEED_PER_PERSON_HOURLY * numPeople * stayHours;

    const baseHourlyOutput = (parseFloat(plant.oxygenLevel) || 20) / 24;
    const isCAM = plant.isNocturnal || plant.name.toLowerCase().includes('snake') || plant.name.toLowerCase().includes('aloe');

    let dailyProductionSamples: number[] = [];

    for (let i = 0; i < iterations; i++) {
        let totalDailyPlantO2 = 0;

        // Always simulate a full 24h cycle to find the "Daily Recharge Capacity"
        for (let h = 0; h < 24; h++) {
            const jitterTemp = baseTemp + (Math.random() - 0.5) * 4;
            const jitterHumidity = baseHumidity + (Math.random() - 0.5) * 10;

            // Assume a standard solar day for the "Recharge" calculation
            const isDaylight = h >= 8 && h <= 20;

            let hourlyLight = baseLight;
            if (!isDaylight) {
                hourlyLight = isCAM ? baseLight * 0.2 : 0;
            } else {
                hourlyLight = baseLight * (1 + (Math.random() - 0.5) * 0.3);
            }

            const efficiency = calculateBiologicalEfficiency(plant, jitterTemp, jitterHumidity, hourlyLight);

            if (!isDaylight && !isCAM) {
                totalDailyPlantO2 -= (baseHourlyOutput * 0.1);
            } else {
                totalDailyPlantO2 += (baseHourlyOutput * efficiency);
            }
        }
        dailyProductionSamples.push(totalDailyPlantO2);
    }

    dailyProductionSamples.sort((a, b) => a - b);
    const pessimisticDailyOutput = dailyProductionSamples[Math.floor(iterations * 0.05)];

    // Scientific Reasoning: 
    // If you stay for 1 hour, you only need to produce 1/24th of your daily requirement 
    // because the plant works for you even when you aren't there.
    // If you stay for 24 hours, you need the full rate.
    const plantsNeeded = Math.max(1, Math.ceil(totalRequiredO2 / Math.max(0.1, pessimisticDailyOutput)));

    return {
        plantsNeeded,
        avgProductionPerDay: dailyProductionSamples.reduce((a, b) => a + b, 0) / iterations,
        isLethal: pessimisticDailyOutput < 0
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
