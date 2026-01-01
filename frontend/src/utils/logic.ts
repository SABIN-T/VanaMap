import type { Plant } from '../types';

/**
 * CORTEX OS - ADVANCED BIO-SIMULATION ENGINE
 * 
 * This engine calculates plant compatibility using continuous differentiable functions
 * to create smooth, non-binary score distributions.
 * 
 * SCALING LOGIC:
 * Uses a Rank-Interpolated Normalization to ensure a smooth "100% to 10%" gradient
 * regardless of raw score clustering.
 */

// ==========================================
// 1. CONTINUOUS SCORING FUNCTIONS (Smooth Curves)
// ==========================================

/**
 * Temperature Score: Gaussian Bell Curve
 * No sharp drop-offs. Smooth decay from optimal.
 */
const getTempScore = (plant: Plant, avgTemp: number): number => {
    const min = plant.idealTempMin || 15;
    const max = plant.idealTempMax || 30;
    const optimal = (min + max) / 2;
    // Standard deviation is roughly 1/4th of the range radius for a loose fit, 
    // or smaller for strict fit. We use a tolerant curve.
    const rangeRadius = (max - min) / 2;
    const sigma = Math.max(5, rangeRadius); // Minimum sigma to prevent too sharp peaks

    // Gaussian formula: e^(-(x-mu)^2 / (2*sigma^2))
    const diff = avgTemp - optimal;
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
};

/**
 * Humidity Score: Sigmoid-like Logistic Function
 * Smooth transition around requirements.
 */
const getHumidityScore = (plant: Plant, avgHumidity: number): number => {
    const min = plant.minHumidity || 40;
    // Ideal is somewhat higher than min
    const optimal = min + 15;

    // Calculate difference from optimal
    const diff = avgHumidity - optimal;

    // Use a logistic curve to map this difference to 0-1
    // A divisor of 30 stretches the curve for smoother transitions
    return 1 / (1 + Math.exp(-diff / 15));
};

/**
 * Light Score: Parabolic Match
 */
const getLightScore = (plant: Plant, lightPercent: number): number => {
    let target = 50;
    const req = (plant as any).lightReq || 'medium';
    if (req === 'low') target = 30;
    if (req === 'high') target = 80;

    // Quadratic penalty: 1 - k*(diff^2)
    const diff = Math.abs(lightPercent - target);
    // Normalize diff to 0-1 range (max diff is approx 70 or 80)
    const maxDiff = 100;

    // We want 1.0 at target, and ~0.2 at max distance
    return Math.max(0.1, 1 - Math.pow(diff / maxDiff, 1.5));
};

/**
 * AQI Score: Linear Bonus
 */
const getAQIScore = (plant: Plant, aqi: number): number => {
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    // If air is bad (AQI > 100)
    if (aqi > 100) {
        if (isPurifier) return 1.2; // Bonus!
        return Math.max(0.2, 1.0 - ((aqi - 100) / 300)); // Penalty for non-purifiers
    }
    return 1.0;
};

// ==========================================
// 2. MAIN CALCULATION
// ==========================================

export const calculateAptness = (
    plant: Plant,
    currentTemp: number,
    aqi: number = 20,
    currentHumidity: number = 50,
    lightPercent: number = 70,
    _unused: any = null, // Parameter kept for signature compatibility if needed
    _unused2: any = null
): number => {
    // 1. Calculate Component Scores (0.0 - 1.0+)
    const sTemp = getTempScore(plant, currentTemp);
    const sHum = getHumidityScore(plant, currentHumidity);
    const sLight = getLightScore(plant, lightPercent);
    const sAQI = getAQIScore(plant, aqi);

    // 2. Apply Weights
    // Temp 35%, Hum 25%, Light 25%, AQI 15%
    let raw = (sTemp * 0.35) + (sHum * 0.25) + (sLight * 0.25) + (sAQI * 0.15);

    // 3. Apply Multipliers (Maintenance, Type)
    // Small tweaks to create granularity between plants with identical bio-needs
    const type = plant.type || 'indoor';
    if (type === 'indoor') raw *= 1.05;

    const maint = (plant as any).maintenance || 'medium';
    if (maint === 'low') raw *= 1.05;
    if (maint === 'high') raw *= 0.95;

    // Return raw score (unbounded, typically 0.2 to 1.3)
    return raw;
};

/**
 * RANK-BASED SMOOTHING NORMALIZATION
 * This forces a beautiful distribution (100, 95, 90, 85...) regardless of clustering.
 */
export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    if (scores.length === 1) return [100.0];

    // 1. Create objects to preserve original indices
    const indexed = scores.map((val, idx) => ({ val, idx }));

    // 2. Sort by raw score descending
    indexed.sort((a, b) => b.val - a.val);

    // 3. Assign new scores based on Rank and Curve
    const count = scores.length;

    const finalScores = new Array(count);

    // We want the top plant to be 100%
    // We want the bottom plant to be ~10% (unless it's actually good)
    // We use a blend of Rank Position and Raw Value

    const maxRaw = indexed[0].val;
    const minRaw = indexed[count - 1].val;
    const rawRange = maxRaw - minRaw || 1; // prevent divide zero

    for (let i = 0; i < count; i++) {
        const item = indexed[i];

        // A. Rank Score (0 to 1): Strictly linear falloff based on position
        // Top rank = 1, Bottom rank = 0
        const rankPercent = 1 - (i / (count - 1));

        // B. Raw Score (0 to 1): Based on actual value range
        const rawPercent = (item.val - minRaw) / rawRange;

        // C. Combine
        // Weighting Rank heavily (70%) ensures the user sees the "step by step" difference they asked for
        // Weighting Raw (30%) keeps some truth (e.g. if the top 2 are essentially identical, scores stay close)
        const combined = (rankPercent * 0.7) + (rawPercent * 0.3);

        // Map 0-1 to 10-100
        const final = 10 + (combined * 90);

        finalScores[item.idx] = Math.round(final * 10) / 10;
    }

    return finalScores;
};

// ==========================================
// 3. UTILITIES
// ==========================================

export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// O2 Production Logic (Rate Based)
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

    // Hourly rate assuming photosynthesis window
    const hourlyRate = (baseRate / 12) * quantity;
    const daily = hourlyRate * Math.min(12, hoursPerDay); // capped at 12 eff. hours for basic calc

    return { daily, hourly: hourlyRate };
};

export const calculatePlantsNeeded = (
    plant: Plant,
    _roomSize: number,
    hoursPerDay: number = 8,
    peopleCount: number = 1
): { plantsNeeded: number; totalO2: number; isLethal: boolean } => {
    // 1 Human = ~23 Liters O2 / Hour
    const humanNeedHourly = 23 * peopleCount;

    // Plant output / Hour
    const { hourly: plantRate } = calculateO2Production(plant, 1, hoursPerDay);

    // Simple matching: Need enough plants to cover hourly consumption
    const plantsNeeded = Math.ceil(humanNeedHourly / Math.max(0.1, plantRate));

    // Total production over the specific duration
    const totalO2 = plantRate * plantsNeeded * hoursPerDay;

    return {
        plantsNeeded,
        totalO2,
        isLethal: false
    };
};

/**
 * ROOM SIMULATION (Cleaned)
 */
export const runRoomSimulationMC = (
    plant: Plant,
    roomSize: number,
    hoursPerDay: number,
    peopleCount: number,
    avgTemp: number,
    avgHumidity: number,
    aqi: number,
    lightLevel: number = 70 // Added parameter
) => {
    // We run the basic aptness check for the sim
    const aptness = calculateAptness(plant, avgTemp, aqi, avgHumidity, lightLevel);
    const { plantsNeeded, totalO2, isLethal } = calculatePlantsNeeded(plant, roomSize, hoursPerDay, peopleCount);

    return {
        aptness,
        plantsNeeded,
        totalO2,
        isLethal
    };
};

export const generatePlantInsights = (plant: Plant, avgTemp: number, avgHumidity: number, aqi: number = 20) => {
    // Temperature insights
    const idealMin = plant.idealTempMin || 15;
    const idealMax = plant.idealTempMax || 30;

    let prediction = '';
    let tip = '';

    if (avgTemp >= idealMin && avgTemp <= idealMax) {
        prediction = `Thriving! Your ${avgTemp}°C matches the ideal ${idealMin}-${idealMax}°C range nicely.`;
    } else if (avgTemp < idealMin) {
        prediction = `A bit chilly. It prefers ${idealMin}-${idealMax}°C, but might adapt slightly.`;
        tip = `Avoid drafts and consider a warmer spot.`;
    } else {
        prediction = `A bit warm. It prefers ${idealMin}-${idealMax}°C.`;
        tip = `Keep away from direct heat sources and mist to cool.`;
    }

    // Humidity insights
    const minHumidity = plant.minHumidity || 40;
    if (avgHumidity < minHumidity && !tip) {
        tip = `Humidity is low (${avgHumidity}%). This plant prefers >${minHumidity}%. Mist it!`;
    }

    // Air Quality insights
    if (!tip && aqi > 100) {
        const isPurifier = plant.medicinalValues?.includes('Air purification') ||
            plant.advantages?.some(a => a.toLowerCase().includes('purif'));

        if (isPurifier) {
            tip = `Excellent choice! This plant will help combat the current high AQI (${aqi}).`;
        }
    }

    if (!tip) {
        tip = `Great match for your space! Water when soil feels dry.`;
    }

    return {
        prediction,
        tip
    };
};
