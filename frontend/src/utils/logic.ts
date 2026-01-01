import type { Plant } from '../types';

/**
 * COMPLETE APTNESS CALCULATION SYSTEM - SCIENTIFIC OVERHAUL
 * 
 * This system calculates plant compatibility based on:
 * 1. Temperature matching (50% weight) - Gaussian distribution
 * 2. Humidity requirements (30% weight) - Threshold-based
 * 3. Air quality interaction (20% weight) - Purifier bonus
 * 4. Plant characteristics - Type, maintenance, oxygen production
 * 
 * Output: 10% (incompatible) to 100% (perfect match)
 */

/**
 * Calculate temperature compatibility score (0-1)
 * Uses Gaussian distribution for optimal temperature matching
 */
const calculateTemperatureScore = (plant: Plant, avgTemp: number): number => {
    const idealMin = plant.idealTempMin || 15;
    const idealMax = plant.idealTempMax || 30;
    const optimalTemp = (idealMin + idealMax) / 2;
    const tolerance = (idealMax - idealMin) / 2;

    // Perfect score at optimal temperature, decreases with distance
    if (avgTemp >= idealMin && avgTemp <= idealMax) {
        // Within ideal range: 0.7 to 1.0
        const deviation = Math.abs(avgTemp - optimalTemp);
        const normalizedDeviation = deviation / tolerance;
        return 0.7 + (0.3 * (1 - normalizedDeviation));
    } else {
        // Outside ideal range: exponential decay
        const distance = avgTemp < idealMin ?
            (idealMin - avgTemp) : (avgTemp - idealMax);
        const penalty = Math.exp(-distance / 5); // Decay factor
        return penalty * 0.7; // Max 0.7 when just outside range
    }
};

/**
 * Calculate humidity compatibility score (0-1)
 */
const calculateHumidityScore = (plant: Plant, avgHumidity: number): number => {
    const minHumidity = plant.minHumidity || 40;
    const optimalHumidity = minHumidity + 20; // Optimal is 20% above minimum

    if (avgHumidity >= minHumidity) {
        // Above minimum: good to excellent
        if (avgHumidity <= optimalHumidity + 20) {
            // Within optimal range
            const deviation = Math.abs(avgHumidity - optimalHumidity);
            return 1.0 - (deviation / 40) * 0.3; // 0.7 to 1.0
        } else {
            // Too humid: gradual penalty
            const excess = avgHumidity - (optimalHumidity + 20);
            return Math.max(0.5, 1.0 - (excess / 30) * 0.3);
        }
    } else {
        // Below minimum: exponential penalty
        const deficit = minHumidity - avgHumidity;
        return Math.max(0.1, Math.exp(-deficit / 15));
    }
};

/**
 * Calculate air quality compatibility score (0-1)
 */
const calculateAQIScore = (plant: Plant, aqi: number): number => {
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    if (aqi <= 50) {
        // Excellent air quality: all plants thrive
        return 1.0;
    } else if (aqi <= 100) {
        // Moderate: purifiers get bonus, others slight penalty
        return isPurifier ? 1.1 : 0.9;
    } else if (aqi <= 150) {
        // Unhealthy for sensitive: purifiers excel, others struggle
        return isPurifier ? 1.2 : 0.7;
    } else {
        // Very unhealthy: only purifiers can help
        return isPurifier ? 1.3 : 0.4;
    }
};

/**
 * Calculate plant type bonus (indoor vs outdoor)
 */
const calculateTypeFactor = (plant: Plant): number => {
    // Indoor plants are generally more adaptable to controlled environments
    if (plant.type === 'indoor') return 1.1;
    if (plant.type === 'outdoor') return 0.95;
    return 1.0;
};

/**
 * Calculate maintenance difficulty factor
 */
const calculateMaintenanceFactor = (plant: Plant): number => {
    const maintenance = (plant as any).maintenance || 'medium';
    // Easier plants are more likely to thrive
    if (maintenance === 'low') return 1.1;
    if (maintenance === 'high') return 0.85;
    return 1.0;
};

/**
 * Calculate oxygen production factor
 */
const calculateOxygenFactor = (plant: Plant): number => {
    const oxygenLevel = plant.oxygenLevel || 'medium';
    // Higher oxygen producers are more vigorous
    if (oxygenLevel === 'very-high') return 1.15;
    if (oxygenLevel === 'high') return 1.1;
    if (oxygenLevel === 'medium') return 1.0;
    return 0.95;
};

/**
 * MAIN APTNESS CALCULATION
 * Combines all factors into a final compatibility score
 */
export const calculateAptnessMC = (
    plant: Plant,
    baseTemp: number,
    aqi: number = 20,
    baseHumidity: number = 50,
    _iterations: number = 150
): number => {
    // Core environmental compatibility scores (0-1 each)
    const tempScore = calculateTemperatureScore(plant, baseTemp);
    const humidityScore = calculateHumidityScore(plant, baseHumidity);
    const aqiScore = calculateAQIScore(plant, aqi);

    // Plant characteristic factors (multipliers)
    const typeFactor = calculateTypeFactor(plant);
    const maintenanceFactor = calculateMaintenanceFactor(plant);
    const oxygenFactor = calculateOxygenFactor(plant);

    // Weighted combination of environmental scores
    // Temperature is most important (50%), humidity (30%), AQI (20%)
    const environmentalScore = (
        tempScore * 0.5 +
        humidityScore * 0.3 +
        aqiScore * 0.2
    );

    // Apply plant characteristic multipliers
    const characteristicMultiplier = typeFactor * maintenanceFactor * oxygenFactor;

    // Final raw score (0-1.5 range due to multipliers)
    const rawScore = environmentalScore * characteristicMultiplier;

    // Convert to 0-100 scale
    // Cap at 100 for display purposes
    const finalScore = Math.min(100, rawScore * 100);

    return Math.round(finalScore * 10) / 10;
};

export const calculateAptness = (
    plant: Plant,
    currentTemp: number,
    aqi?: number,
    currentHumidity?: number,
    lightPercent?: number,
    useMonteCarlo: boolean = false,
    iterations?: number
): number => {
    if (useMonteCarlo) {
        return calculateAptnessMC(plant, currentTemp, aqi, currentHumidity, iterations);
    }
    // Fallback to Monte Carlo for compatibility
    return calculateAptnessMC(plant, currentTemp, aqi, currentHumidity);
};

export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    if (scores.length === 1) return [100.0];

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (maxScore === 0) return scores.map(() => 0);
    if (maxScore === minScore) return scores.map(() => 100.0);

    // Simple linear normalization: 100% to 10% scale
    // Top plant = 100%, Lowest plant = 10%, others scaled linearly
    return scores.map(s => {
        const normalized = ((s - minScore) / (maxScore - minScore)) * 90 + 10;
        return Math.round(normalized * 10) / 10;
    });
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
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Calculate O2 production
export const calculateO2Production = (
    plant: Plant,
    quantity: number = 1,
    hoursPerDay: number = 24
): { daily: number; hourly: number } => {
    let baseRate = 5;
    if (plant.oxygenLevel === 'very-high') baseRate = 15;
    else if (plant.oxygenLevel === 'high') baseRate = 10;
    else if (plant.oxygenLevel === 'medium') baseRate = 5;
    else baseRate = 3;

    const hourly = (baseRate * quantity) / 24;
    const daily = hourly * hoursPerDay;

    return { daily, hourly };
};

export const calculatePlantsNeeded = (
    plant: Plant,
    roomSize: number,
    hoursPerDay: number = 8,
    peopleCount: number = 1
): { plantsNeeded: number; totalO2: number; isLethal: boolean } => {
    const totalRequiredO2 = peopleCount * 550;
    const { daily: dailyO2PerPlant } = calculateO2Production(plant, 1, hoursPerDay);
    const plantsNeeded = Math.max(1, Math.ceil(totalRequiredO2 / Math.max(0.1, dailyO2PerPlant)));
    const totalO2 = dailyO2PerPlant * plantsNeeded;

    return {
        plantsNeeded,
        totalO2,
        isLethal: dailyO2PerPlant < 0
    };
};
