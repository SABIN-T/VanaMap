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
    // Spread of the curve reflects the plant's tolerance. 
    // Dividing by 2.5 makes the curve tighter (more sensitive to mismatches).
    const sigma = Math.max(4, tRange / 2.5);

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
 * Simulates a stochastic 7-day (168-hour) environmental period.
 * Uses a cumulative Life-Energy model to determine exact ecosystem fit.
 * This provides "Minute Aptness" resolution.
 */
export const calculateAptnessMC = (
    plant: Plant,
    baseTemp: number,
    aqi: number = 20,
    baseHumidity: number = 50,
    iterations: number = 150
): number => {
    let energySamples: number[] = [];

    for (let i = 0; i < iterations; i++) {
        let cumulativeEnergy = 0;
        const simulationHours = 168; // 1 Week simulation

        for (let h = 0; h < simulationHours; h++) {
            const hourOfDay = h % 24;

            // Diurnal Temperature Swing (Sine wave: colder at night, warmer at day)
            const diurnalDelta = Math.sin((hourOfDay - 8) * (Math.PI / 12)) * 6;

            // Stochastic weather noise
            const randomJitter = (Math.random() - 0.5) * 5;

            const jitterTemp = baseTemp + diurnalDelta + randomJitter;
            const jitterHumidity = baseHumidity + (Math.random() - 0.5) * 25;

            // Calculate exact efficiency (0.0 to 1.0) for this specific hour
            const efficiency = calculateBiologicalEfficiency(plant, jitterTemp, jitterHumidity);

            cumulativeEnergy += efficiency;
        }

        // Normalize energy to a base 100 scale
        const iterationScore = (cumulativeEnergy / simulationHours) * 100;
        energySamples.push(iterationScore);
    }

    // Average energy across all Monte Carlo iterations
    const rawAvg = energySamples.reduce((a, b) => a + b, 0) / iterations;

    // Apply botanical multipliers (Toughness, Air Purification)
    let modifier = 1.0;
    const desc = (plant.description || "").toLowerCase();

    // Hardy plants have a higher baseline "Resilience Energy"
    if (desc.includes('hardy') || desc.includes('tough')) modifier += 0.05;

    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    // Environmental synergies
    if (aqi > 100 && isPurifier) modifier += 0.1;
    else if (aqi > 150 && !isPurifier) modifier -= 0.15;

    // Final result is high-precision (float)
    return Math.max(0, Math.min(100, rawAvg * modifier));
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
    // Point to the upgraded MC engine
    const mcScore = calculateAptnessMC(plant, currentTemp, aqi, avgHumidity, iterations);

    if (isAbsolute) return mcScore;

    if (normalizationBase && normalizationBase > 0) {
        // Normalization fix: Ensure we can reach 100% relative match
        // if the normalizationBase represents the "Ideal" score of the set
        return (mcScore / normalizationBase) * 100;
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

    // To satisfy "start from normalized to 100%", we scale the highest result to 100
    // and all others relative to it.
    return scores.map(s => Math.round((s / maxScore) * 100));
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
