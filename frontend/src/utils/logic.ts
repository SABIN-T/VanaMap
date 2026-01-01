import type { Plant } from '../types';

/**
 * CORTEX OS - INDEPENDENT BIO-SIMULATION ENGINE
 * 
 * Separates "Aptness" (General Compatibility) from "Room Simulation" (Survival Physics).
 */

// ==========================================
// 1. APTNESS SCORING (For Match %)
// ==========================================

const getTempScore = (plant: Plant, avgTemp: number): number => {
    const min = plant.idealTempMin || 15;
    const max = plant.idealTempMax || 30;
    const optimal = (min + max) / 2;
    const sigma = 5;
    const diff = avgTemp - optimal;
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
};

const getHumidityScore = (plant: Plant, avgHumidity: number): number => {
    const min = plant.minHumidity || 40;
    const diff = avgHumidity - (min + 15);
    return 1 / (1 + Math.exp(-diff / 15));
};

const getLightScore = (plant: Plant, lightPercent: number): number => {
    const sun = (plant.sunlight || 'medium').toLowerCase();
    let target = 50;
    if (sun.includes('high') || sun.includes('direct') || sun.includes('bright')) target = 80;
    else if (sun.includes('low') || sun.includes('shade')) target = 30;

    // Standard matching curve for Aptness
    const diff = Math.abs(lightPercent - target);
    return Math.max(0.1, 1 - Math.pow(diff / 100, 1.5));
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

export const normalizeBatch = (scores: number[]): number[] => {
    if (scores.length === 0) return [];
    if (scores.length === 1) return [100.0];

    const indexed = scores.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => b.val - a.val);

    const count = scores.length;
    const finalScores = new Array(count);
    const minRaw = indexed[count - 1].val;
    const rawRange = indexed[0].val - minRaw || 1;

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
// 2. NEW INDEPENDENT ROOM SIMULATION
// ==========================================

// Calculates the "Stress" (Efficiency Loss) based on sliders
const calculateStressFactor = (plant: Plant, temp: number, light: number): number => {
    let stress = 0.0;

    // 1. Light Stress (Direct, Linear Penalty)
    const sun = (plant.sunlight || 'medium').toLowerCase();
    let idealLight = 50;
    if (sun.includes('high') || sun.includes('bright')) idealLight = 80;
    else if (sun.includes('low') || sun.includes('shade')) idealLight = 30;

    const lightDiff = Math.abs(light - idealLight);
    // Every 10% deviation adds 15% stress (Plant needs 15% more help)
    stress += (lightDiff / 10) * 0.15;

    // 2. Temperature Stress (AC Sensitivity Verified)
    const min = plant.idealTempMin || 15;
    const max = plant.idealTempMax || 30;

    // Logical Tolerance: 
    // Small deviations (1-2 degrees) are fine. Large ones scale quadratically.
    let tempDiff = 0;
    if (temp < min) tempDiff = min - temp;
    else if (temp > max) tempDiff = temp - max;

    // Curve: 2 degrees = 0.04 (4% stress). 5 degrees = 0.25 (25% stress). 10 degrees = 1.0 (Max).
    // Formula: (Diff^2) / 100
    if (tempDiff > 0) {
        stress += (tempDiff * tempDiff) / 100;
    }

    // Cap stress at 0.9 (90% efficiency loss), never 100% dead for UI sake
    return Math.min(0.9, stress);
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
    // 1. Calculate Standard Aptness (For display only)
    const aptness = calculateAptness(plant, avgTemp, aqi, avgHumidity, lightLevel);

    // 2. INDEPENDENT PLANT COUNT LOGIC

    // A. Base Demand (Wellness Standard)
    let basePlantsNeeded = Math.max(1, hoursPerDay * 0.4);

    // B. Room Buffer Logic (Scientific Freshness)
    // Uses roomSize (m2) -> Volume -> Safe Fresh Hours
    // 20m2 room ~ 2 hours safe. 40m2 room ~ 4 hours safe.
    const roomVolLiters = roomSize * 2.5 * 1000;
    // How many hours before CO2 > 1000ppm? (0.1% of volume)
    const safeHours = (roomVolLiters * 0.001) / (23 * Math.max(1, peopleCount));

    if (hoursPerDay < safeHours) {
        basePlantsNeeded = 1;
    }

    // C. Apply Plant Strength Multiplier
    let strengthMultiplier = 1.0;
    if (plant.oxygenLevel === 'very-high') strengthMultiplier = 0.6;
    else if (plant.oxygenLevel === 'high') strengthMultiplier = 0.8;
    else if (plant.oxygenLevel === 'low') strengthMultiplier = 1.2;

    let plantsBeforeStress = basePlantsNeeded * strengthMultiplier * peopleCount;

    // D. APPLY SLIDER STRESS (The Physics Engine)
    const stress = calculateStressFactor(plant, avgTemp, lightLevel);
    const efficiency = 1.0 - stress;

    // Calculate final needed
    const finalPlantsNeeded = Math.ceil(plantsBeforeStress / Math.max(0.1, efficiency));

    // E. Total Output (Visual Stat)
    // Just a scaling number for the UI graph
    const totalO2 = finalPlantsNeeded * 15 * hoursPerDay * efficiency;

    return {
        aptness,
        plantsNeeded: finalPlantsNeeded,
        totalO2,
        isLethal: false
    };
};

// ==========================================
// 3. UTILITIES
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
