import type { Plant } from '../types';

/**
 * COMPLETE APTNESS CALCULATION SYSTEM - SCIENTIFIC OVERHAUL
 * 
 * This system calculates plant compatibility based on:
 * 1. Temperature matching (40% weight) - Gaussian distribution
 * 2. Humidity requirements (25% weight) - Threshold-based
 * 3. Light Matching (25% weight) - New requirement
 * 4. Air quality interaction (10% weight) - Purifier bonus
 * 5. Plant characteristics - Type, maintenance, oxygen production
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
 * Calculate light compatibility score (0-1)
 */
const calculateLightScore = (plant: Plant, lightPercent: number): number => {
    // lightPercent is 0-100 (from slider)
    // Plant requirements: 'low', 'medium', 'high'
    // Map requirements to optimal percentages
    let optimalLight = 50; // medium
    let tolerance = 30;

    const req = (plant as any).lightReq || 'medium';
    if (req === 'low') { optimalLight = 30; tolerance = 20; }
    if (req === 'high') { optimalLight = 80; tolerance = 20; }

    // Gaussian-like curve for light matching
    if (Math.abs(lightPercent - optimalLight) <= tolerance) {
        return 1.0;
    } else {
        const diff = Math.abs(lightPercent - optimalLight) - tolerance;
        return Math.max(0.2, 1.0 - (diff / 40));
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
    lightPercent: number = 70, // Added light parameter
    _iterations: number = 150
): number => {
    // Core environmental compatibility scores (0-1 each)
    const tempScore = calculateTemperatureScore(plant, baseTemp);
    const humidityScore = calculateHumidityScore(plant, baseHumidity);
    const aqiScore = calculateAQIScore(plant, aqi);
    const lightScore = calculateLightScore(plant, lightPercent);

    // Plant characteristic factors (multipliers)
    const typeFactor = calculateTypeFactor(plant);
    const maintenanceFactor = calculateMaintenanceFactor(plant);
    const oxygenFactor = calculateOxygenFactor(plant);

    // Weighted combination of environmental scores
    // Temp (40%), Humidity (25%), Light (25%), AQI (10%)
    const environmentalScore = (
        tempScore * 0.40 +
        humidityScore * 0.25 +
        lightScore * 0.25 +
        aqiScore * 0.10
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
    aqi: number = 20,
    currentHumidity: number = 50,
    lightPercent: number = 70,
    _useMonteCarlo: boolean = false,
    iterations?: number
): number => {
    return calculateAptnessMC(plant, currentTemp, aqi, currentHumidity, lightPercent, iterations);
};

export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    if (scores.length === 1) return [100.0];

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (maxScore === 0) return scores.map(() => 0);
    if (maxScore === minScore) return scores.map(() => 100.0);

    // Hybrid Normalization Strategy
    // Combines relative ranking (best in list = 100%) with absolute quality
    // This creates better spread and doesn't force everything to extremes

    // Theoretical maximum raw score is around 1.5 due to bonus multipliers
    const THEORETICAL_MAX = 1.5;

    return scores.map(s => {
        // Absolute quality score (0-100)
        // Ensure it doesn't exceed 100
        const absoluteScore = Math.min(100, (s / THEORETICAL_MAX) * 100);

        // Relative rank score (10-100)
        const relativeScore = ((s - minScore) / (maxScore - minScore)) * 90 + 10;

        // Weighted average: 70% relative (to highlight best options), 30% absolute
        // This ensures the "best" available plant is emphasized, but absolute quality still keeps it grounded
        const final = (relativeScore * 0.7) + (absoluteScore * 0.3);

        // Clamp between 10 and 100
        return Math.round(Math.min(100, Math.max(10, final)) * 10) / 10;
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
    let baseRate = 5; // grams/Liters roughly per day baseline
    if (plant.oxygenLevel === 'very-high') baseRate = 15;
    else if (plant.oxygenLevel === 'high') baseRate = 10;
    else if (plant.oxygenLevel === 'medium') baseRate = 5;
    else baseRate = 3;

    // Adjust rate based on hours of light (photosynthesis active time)
    // Production is rate * hours (not constant/24)
    // But for "Hourly" capacity, we look at peak rate
    const hourlyRate = baseRate / 12; // Assuming baseRate is for a 12h day roughly

    // Total production for the given duration
    const totalProduction = hourlyRate * hoursPerDay * quantity;

    return { daily: totalProduction, hourly: hourlyRate * quantity };
};

export const calculatePlantsNeeded = (
    plant: Plant,
    _roomSize: number,
    hoursPerDay: number = 8,
    peopleCount: number = 1
): { plantsNeeded: number; totalO2: number; isLethal: boolean } => {
    // Human Consumption: ~550L per day => ~23L per hour
    const humanHourlyNeed = 23 * peopleCount;

    // Plant Production Rate (Liters per hour of active light)
    const { hourly: plantHourlyRate } = calculateO2Production(plant, 1, 24);

    // Rate Matching: How many plants to match the hourly consumption?
    // This keeps the number stable regardless of how long you stay
    const plantsNeeded = Math.ceil(humanHourlyNeed / Math.max(0.1, plantHourlyRate));

    // Total O2 generated over the specific duration
    const totalO2 = plantHourlyRate * plantsNeeded * hoursPerDay;

    return {
        plantsNeeded,
        totalO2,
        isLethal: plantHourlyRate < 0
    };
};

// Room simulation for plant details modal
export const runRoomSimulationMC = (
    plant: Plant,
    roomSize: number,
    hoursPerDay: number,
    peopleCount: number,
    avgTemp: number,
    avgHumidity: number,
    aqi: number
) => {
    // Note: Light is fixed at 70 for this quick sim, or could be passed through
    const aptness = calculateAptnessMC(plant, avgTemp, aqi, avgHumidity, 70);
    const { plantsNeeded, totalO2, isLethal } = calculatePlantsNeeded(plant, roomSize, hoursPerDay, peopleCount);

    return {
        aptness,
        plantsNeeded,
        totalO2,
        isLethal
    };
};

// Generate plant insights for details modal
export const generatePlantInsights = (plant: Plant, avgTemp: number, avgHumidity: number, aqi: number = 20) => {
    // Temperature insights
    const idealMin = plant.idealTempMin || 15;
    const idealMax = plant.idealTempMax || 30;

    let prediction = '';
    let tip = '';

    if (avgTemp >= idealMin && avgTemp <= idealMax) {
        prediction = `This plant will thrive in your current temperature (${avgTemp}°C). Expect healthy growth and vibrant foliage.`;
    } else if (avgTemp < idealMin) {
        prediction = `Temperature is ${idealMin - avgTemp}°C below ideal. Growth may be slower, but the plant can adapt with proper care.`;
        tip = `Consider moving to a warmer location or using a heat mat to maintain ${idealMin}-${idealMax}°C.`;
    } else {
        prediction = `Temperature is ${avgTemp - idealMax}°C above ideal. The plant may show signs of heat stress.`;
        tip = `Provide shade during peak hours and ensure adequate ventilation to cool the environment.`;
    }

    // Humidity insights
    const minHumidity = plant.minHumidity || 40;
    if (avgHumidity < minHumidity && !tip) {
        tip = `Humidity is below ${minHumidity}%. Use a humidifier or mist regularly to prevent leaf browning.`;
    }

    // Air quality insights
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));
    if (isPurifier && aqi > 100 && !tip) {
        tip = `This plant excels at purifying air. Perfect choice for your current AQI (${aqi}).`;
    }

    // Default tip if none set
    if (!tip) {
        if (plant.oxygenLevel === 'very-high' || plant.oxygenLevel === 'high') {
            tip = `High oxygen producer! Place in bedrooms or workspaces for maximum benefit.`;
        } else {
            tip = `Maintain consistent watering and monitor for pests to ensure healthy growth.`;
        }
    }

    return {
        prediction,
        tip
    };
};
