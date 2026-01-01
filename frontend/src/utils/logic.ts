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
 * Simple Aptness Calculation - ULTRA FAST
 * Direct biological efficiency calculation without Monte Carlo iterations
 * Deterministic and instant results for both mobile and desktop
 */
export const calculateAptnessMC = (
    plant: Plant,
    baseTemp: number,
    aqi: number = 20,
    baseHumidity: number = 50,
    _iterations: number = 150 // Kept for API compatibility but not used
): number => {
    // Calculate base biological efficiency
    const baseEfficiency = calculateBiologicalEfficiency(plant, baseTemp, baseHumidity);

    // Simulate day/night cycle impact (average of day and night efficiency)
    const dayTemp = baseTemp + 4; // Warmer during day
    const nightTemp = baseTemp - 4; // Cooler at night
    const dayEfficiency = calculateBiologicalEfficiency(plant, dayTemp, baseHumidity);
    const nightEfficiency = calculateBiologicalEfficiency(plant, nightTemp, baseHumidity);

    // Average efficiency across day/night cycle
    const avgEfficiency = (baseEfficiency * 0.5 + dayEfficiency * 0.25 + nightEfficiency * 0.25);

    // Convert to 0-100 scale
    let score = avgEfficiency * 100;

    // Apply biological modifiers with STRONGER differentiation
    let modifier = 1.0;
    const desc = (plant.description || "").toLowerCase();

    // Hardy plants have higher resilience
    if (desc.includes('hardy') || desc.includes('tough')) modifier += 0.1;

    // Air purification synergy with AQI
    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    if (aqi > 100 && isPurifier) modifier += 0.2;
    else if (aqi > 150 && !isPurifier) modifier -= 0.25;

    // STRONGER temperature stress penalties for better differentiation
    const tempMin = plant.idealTempMin || 15;
    const tempMax = plant.idealTempMax || 30;

    if (baseTemp < tempMin) {
        const coldStress = (tempMin - baseTemp);
        modifier -= Math.min(coldStress * 0.05, 0.5); // Up to 50% penalty
    } else if (baseTemp > tempMax) {
        const heatStress = (baseTemp - tempMax);
        modifier -= Math.min(heatStress * 0.05, 0.5); // Up to 50% penalty
    } else {
        // Bonus for being in ideal range
        const tempRange = tempMax - tempMin;
        const tempPosition = (baseTemp - tempMin) / tempRange;
        // Best at middle of range
        const idealBonus = 1 - Math.abs(tempPosition - 0.5) * 0.4;
        modifier += idealBonus * 0.1;
    }

    // STRONGER humidity stress penalties
    const minHumidity = plant.minHumidity || 40;
    const maxHumidity = 80; // Default max humidity

    if (baseHumidity < minHumidity) {
        const dryStress = (minHumidity - baseHumidity);
        modifier -= Math.min(dryStress * 0.02, 0.4); // Up to 40% penalty
    } else if (baseHumidity > maxHumidity) {
        const wetStress = (baseHumidity - maxHumidity);
        modifier -= Math.min(wetStress * 0.02, 0.3); // Up to 30% penalty
    }

    // Light requirement matching
    const lightReq = (plant as any).lightReq || 'medium';
    if (lightReq === 'high') modifier += 0.05; // High light plants are generally more vigorous
    if (lightReq === 'low') modifier -= 0.05; // Low light plants may be less vigorous

    // Maintenance level (easier plants score slightly higher)
    const maintenance = (plant as any).maintenance || 'medium';
    if (maintenance === 'low') modifier += 0.05;
    if (maintenance === 'high') modifier -= 0.05;

    // Ensure modifier doesn't go below 0.1 or above 1.5
    modifier = Math.max(0.1, Math.min(1.5, modifier));

    return Math.round(score * modifier * 10) / 10;
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
    if (scores.length === 1) return [100.0];

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (maxScore === 0) return scores.map(() => 0);
    if (maxScore === minScore) return scores.map(() => 100.0); // All identical

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
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

/**
 * Generates dynamic, scientifically accurate insights for a plant based on current environment.
 */
export const generatePlantInsights = (plant: Plant, temp: number, humidity: number) => {
    let prediction = "";
    let tip = "";

    const tMid = (plant.idealTempMin + plant.idealTempMax) / 2;
    const isHeatStress = temp > plant.idealTempMax;
    const isColdStress = temp < plant.idealTempMin;
    const isHumidityStress = humidity < plant.minHumidity;

    // 1. Growth Prediction
    if (!isHeatStress && !isColdStress && !isHumidityStress) {
        prediction = "High metabolic efficiency detected. Expect robust biomass accumulation and optimal leaf expansion speed.";
    } else if (isHeatStress) {
        prediction = "Thermal threshold exceeded. Growth rates will likely decelerate as the plant prioritizes cellular cooling and water retention.";
    } else if (isColdStress) {
        prediction = "Lower thermal limit reached. Metabolic processes are slowing down; expect minimal new growth until temperatures stabilize.";
    } else if (isHumidityStress) {
        prediction = "Transpiration-respiration imbalance detected. New leaf development may be stunted or show signs of tip-burn.";
    } else {
        prediction = "Moderate growth predicted. The specimen is adapting to sub-optimal atmospheric conditions.";
    }

    // 2. Environment Tip
    if (isHeatStress) {
        tip = "Critical: Move to a cooler, shaded location and increase irrigation frequency to prevent vascular collapse.";
    } else if (isColdStress) {
        tip = "Keep away from drafty windows and entryways. Consider a grow light to provide supplemental thermal energy.";
    } else if (isHumidityStress) {
        tip = "Atmospheric moisture is insufficient. Use a humidifier or mist the foliage daily to maintain stomatal health.";
    } else if (temp > tMid + 5) {
        tip = "Higher temperatures may trigger faster soil drying. Monitor moisture depth more frequently.";
    } else {
        tip = "Current conditions are stable. Maintain consistent light exposure for continued vitality.";
    }

    return { prediction, tip };
};
