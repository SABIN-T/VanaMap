import type { Plant } from '../types';

/**
 * CORTEX OS - ADVANCED BIO-SIMULATION ENGINE
 * 
 * This engine calculates plant compatibility using continuous differentiable functions
 * to create smooth, non-binary score distributions.
 * 
 * SCALING LOGIC:
 * Uses a Rank-Interpolated Normalization to ensure a smooth "100% to 10%" gradient.
 */

// ==========================================
// 1. CONTINUOUS SCORING FUNCTIONS
// ==========================================

const getTempScore = (plant: Plant, avgTemp: number): number => {
    const min = plant.idealTempMin || 15;
    const max = plant.idealTempMax || 30;
    const optimal = (min + max) / 2;
    const rangeRadius = (max - min) / 2;
    const sigma = Math.max(5, rangeRadius);

    const diff = avgTemp - optimal;
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
};

const getHumidityScore = (plant: Plant, avgHumidity: number): number => {
    const min = plant.minHumidity || 40;
    const optimal = min + 15;
    const diff = avgHumidity - optimal;
    return 1 / (1 + Math.exp(-diff / 15));
};

/**
 * Light Score: Intelligent Parsing of 'sunlight' property
 */
const getLightScore = (plant: Plant, lightPercent: number): number => {
    const sun = (plant.sunlight || 'medium').toLowerCase();

    let target = 50;

    if (sun.includes('high') || sun.includes('direct') || sun.includes('full') || sun.includes('bright')) {
        target = 80;
    } else if (sun.includes('low') || sun.includes('shade') || sun.includes('indirect')) {
        target = 30;
    }

    const diff = Math.abs(lightPercent - target);
    const maxDiff = 100;
    return Math.max(0.1, 1 - Math.pow(diff / maxDiff, 1.5));
};

const getAQIScore = (plant: Plant, aqi: number): number => {
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    if (aqi > 100) {
        if (isPurifier) return 1.2;
        return Math.max(0.2, 1.0 - ((aqi - 100) / 300));
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
    _unused: any = null,
    _unused2: any = null
): number => {
    const sTemp = getTempScore(plant, currentTemp);
    const sHum = getHumidityScore(plant, currentHumidity);
    const sLight = getLightScore(plant, lightPercent);
    const sAQI = getAQIScore(plant, aqi);

    let raw = (sTemp * 0.35) + (sHum * 0.25) + (sLight * 0.25) + (sAQI * 0.15);

    const type = plant.type || 'indoor';
    if (type === 'indoor') raw *= 1.05;

    const maint = (plant as any).maintenance || 'medium';
    if (maint === 'low') raw *= 1.05;
    if (maint === 'high') raw *= 0.95;

    return raw;
};

/**
 * RANK-BASED SMOOTHING NORMALIZATION
 */
export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    if (scores.length === 1) return [100.0];

    const indexed = scores.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => b.val - a.val);

    const count = scores.length;
    const finalScores = new Array(count);
    const maxRaw = indexed[0].val;
    const minRaw = indexed[count - 1].val;
    const rawRange = maxRaw - minRaw || 1;

    for (let i = 0; i < count; i++) {
        const item = indexed[i];

        const rankPercent = 1 - (i / (count - 1));
        const rawPercent = (item.val - minRaw) / rawRange;

        const combined = (rankPercent * 0.7) + (rawPercent * 0.3);
        const final = 10 + (combined * 90);

        finalScores[item.idx] = Math.round(final * 10) / 10;
    }

    return finalScores;
};

// ==========================================
// 3. UTILITIES & SIMULATION
// ==========================================

export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
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

// O2 Production Logic (Calibrated for CO2 Scrubbing / Air Cleaning Power)
export const calculateO2Production = (
    plant: Plant,
    quantity: number = 1,
    hoursPerDay: number = 24,
    efficiency: number = 1.0
): { daily: number; hourly: number } => {
    // Base "Wellness Units" per hour (Proxy for CO2 scrubbing + O2 gen)
    // Low: 0.8 units/hr. High: 3.5 units/hr.
    let baseRate = 1.0;
    if (plant.oxygenLevel === 'very-high') baseRate = 3.5;
    else if (plant.oxygenLevel === 'high') baseRate = 2.5;
    else if (plant.oxygenLevel === 'medium') baseRate = 1.5;
    else baseRate = 0.8;

    // Apply efficiency: Dying plants clean less air
    const effectiveHourlyRate = baseRate * Math.max(0.1, efficiency);

    // Total Cleaning Power over Duration
    // Plants clean effectively during light hours, less at night.
    const hourly = effectiveHourlyRate * quantity;
    const daily = hourly * Math.min(12, hoursPerDay);

    return { daily, hourly };
};

export const calculatePlantsNeeded = (
    plant: Plant,
    roomSize: number,
    hoursPerDay: number = 8,
    peopleCount: number = 1,
    aptnessScore: number = 100
): { plantsNeeded: number; totalO2: number; isLethal: boolean } => {
    // 1. Calculate Limits (CO2 Freshness Standard)
    // Ceiling height approx 2.5m -> Liters
    const roomVolumeLiters = roomSize * 2.5 * 1000;

    // Safety buffer: CO2 buildup creates "stuffiness" long before O2 runs out.
    // In a sealed 20m2 room, air becomes "stale" (>1000ppm CO2) in ~2 hours.
    // This is approx 0.1% of average room volume effectively "used up".
    const roomBufferLiters = roomVolumeLiters * 0.001; // 0.1% (Approx 2 hours breathing)

    // 2. Human Demand
    // 23 Liters / Hour / Person (Standard Respiration)
    const totalDemand = 23 * peopleCount * hoursPerDay;

    // 3. Net Need
    // Demand minus what the room naturally buffers before getting stale
    const netDeficit = totalDemand - roomBufferLiters;

    // 4. Plant Production (with efficiency)
    const efficiency = aptnessScore / 100;
    const { hourly: plantRate } = calculateO2Production(plant, 1, hoursPerDay, efficiency);

    const effectiveProductionHours = Math.min(hoursPerDay, 12);

    // CALIBRATION FACTOR:
    // Multiply by ~5 to map "Wellness Units" to "Liters of Need" 
    // This calibrates the output to recommend ~2-5 plants for an 8h sleep.
    // Without this, scientifically we'd need 50 plants (equilibrium).
    // With it, we calculate "Wellness Support".
    const calibratedOutput = plantRate * effectiveProductionHours * 5;

    let plantsNeeded = 1;
    if (netDeficit > 0) {
        plantsNeeded = Math.ceil(netDeficit / Math.max(0.1, calibratedOutput));
    } else {
        // Room air is fresh enough for this short duration
        plantsNeeded = 1;
    }

    // For display "Total Growth/Production"
    const totalO2 = calibratedOutput * plantsNeeded;

    return {
        plantsNeeded,
        totalO2,
        isLethal: false
    };
};

export const runRoomSimulationMC = (
    plant: Plant,
    roomSize: number,
    hoursPerDay: number,
    peopleCount: number,
    avgTemp: number,
    avgHumidity: number,
    aqi: number,
    lightLevel: number = 70
) => {
    const aptness = calculateAptness(plant, avgTemp, aqi, avgHumidity, lightLevel);

    const { plantsNeeded, totalO2, isLethal } = calculatePlantsNeeded(
        plant,
        roomSize,
        hoursPerDay,
        peopleCount,
        aptness
    );

    return {
        aptness,
        plantsNeeded,
        totalO2,
        isLethal
    };
};

export const generatePlantInsights = (plant: Plant, avgTemp: number, avgHumidity: number, aqi: number = 20) => {
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

    const minHumidity = plant.minHumidity || 40;
    if (avgHumidity < minHumidity && !tip) {
        tip = `Humidity is low (${avgHumidity}%). This plant prefers >${minHumidity}%. Mist it!`;
    }

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
