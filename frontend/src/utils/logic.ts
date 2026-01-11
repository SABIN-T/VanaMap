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

    // Lux Parsing (if available)
    let target = 50;
    const luxMatch = sun.match(/(\d+)\s*lux/i);

    if (luxMatch) {
        // Map 0-10000 Lux to 0-100%
        const val = parseInt(luxMatch[1]);
        target = Math.min(100, Math.max(1, val / 100));
    } else {
        if (sun.includes('high') || sun.includes('direct') || sun.includes('bright')) target = 80;
        else if (sun.includes('low') || sun.includes('shade')) target = 30;
    }

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
    lightPercent: number = 70
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
    // 1. Light Stress (Every 10% deviation adds significant stress)
    const sun = (plant.sunlight || 'medium').toLowerCase();
    let idealLight = 50;

    const luxMatch = sun.match(/(\d+)\s*lux/i);
    if (luxMatch) {
        const val = parseInt(luxMatch[1]);
        idealLight = Math.min(100, Math.max(1, val / 100));
    } else {
        if (sun.includes('high') || sun.includes('bright')) idealLight = 80;
        else if (sun.includes('low') || sun.includes('shade')) idealLight = 30;
    }

    const lightDiff = Math.abs(light - idealLight);
    const lightStress = (lightDiff / 100) * 1.5; // Up to 150% stress for total darkness/over-exposure

    // 2. Temperature Stress (Biological Peak Model)
    // Instead of a flat range, plants have a peak performance temperature
    const min = plant.idealTempMin || 15;
    const max = plant.idealTempMax || 30;
    const optimal = (min + max) / 2;

    // Sensitivity: how quickly performance drops away from optimal
    // We use a tighter sigma (3.5) for simulation to make sliders more "playable"
    const sigma = 4.5;
    const tempDiff = temp - optimal;
    const thermalEfficiency = Math.exp(-(tempDiff * tempDiff) / (2 * sigma * sigma));

    // Combine stresses (Total efficiency is product of independent efficiencies)
    const totalEfficiency = (1.0 - Math.min(0.8, lightStress)) * thermalEfficiency;

    // Return inverted for Stress Factor
    return Math.max(0.1, 1.0 - totalEfficiency);
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
    const roomVolLiters = roomSize * 2.5 * 1000;
    const safeHours = (roomVolLiters * 0.001) / (23 * Math.max(1, peopleCount));

    if (hoursPerDay < safeHours) {
        basePlantsNeeded = 1;
    }

    // C. Apply Plant Strength Multipliers (Proper Data Parsing)
    let strengthMultiplier = 1.0;

    // PARSE EXPLICIT DATA: "300ml/h", "22L/day"
    const oxyStr = (plant.oxygenLevel || '').toLowerCase();
    const oxyMatch = oxyStr.match(/(\d+)\s*(ml\/h|l\/day|l\/h)/);

    if (oxyMatch) {
        const val = parseInt(oxyMatch[1]);
        const unit = oxyMatch[2];
        // Normalize to ml/h
        let rate = 500; // default baseline
        if (unit === 'ml/h') rate = val;
        else if (unit === 'l/h') rate = val * 1000;
        else if (unit === 'l/day') rate = (val * 1000) / 12; // 12h active

        // Higher rate = Lower Multiplier (Better plant)
        // Baseline 500ml/h = 1.0
        // 1000ml/h = 0.5
        strengthMultiplier = 500 / Math.max(50, rate);
    } else {
        // Fallback to Category
        if (plant.oxygenLevel === 'very-high') strengthMultiplier = 0.5;
        else if (plant.oxygenLevel === 'high') strengthMultiplier = 0.7;
        else if (plant.oxygenLevel === 'low') strengthMultiplier = 1.3;
    }

    // CAM / Nocturnal Bonus (Snake plants etc work at night)
    if (plant.isNocturnal) strengthMultiplier *= 0.7;

    const plantsBeforeStress = basePlantsNeeded * strengthMultiplier * peopleCount;

    // D. APPLY SLIDER STRESS (The Physics Engine)
    const stress = calculateStressFactor(plant, avgTemp, lightLevel);
    // Efficiency is what's left after environmental degradation
    const efficiency = 1.0 - stress;

    // Calculate final needed
    // We add a scaling factors to make the number more "human" (avoiding vast jumps but keeping it responsive)
    const rawPlantCount = plantsBeforeStress / Math.max(0.05, efficiency);
    const finalPlantsNeeded = Math.ceil(rawPlantCount);

    // E. Total Output (Visual Stat)
    // Total O2 output in Liters for the duration
    const totalO2 = finalPlantsNeeded * 12 * hoursPerDay * efficiency;

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
