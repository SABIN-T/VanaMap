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
 * Seeded Random Number Generator (Mulberry32)
 * Produces deterministic pseudo-random numbers for consistent simulation results
 */
function seededRandom(seed: number) {
    return function () {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generate a deterministic seed from plant and environment data
 */
function generateSeed(plant: Plant, baseTemp: number, baseHumidity: number, aqi: number): number {
    const plantStr = plant.id + plant.scientificName + plant.name;
    let hash = 0;
    for (let i = 0; i < plantStr.length; i++) {
        hash = ((hash << 5) - hash) + plantStr.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Incorporate environmental data (rounded to avoid floating point precision issues)
    const envHash = Math.round(baseTemp * 10) + Math.round(baseHumidity * 10) + Math.round(aqi);
    return Math.abs(hash + envHash);
}

/**
 * Monte Carlo Aptness Calculation - DETERMINISTIC VERSION
 * Simulates a stochastic 7-day (168-hour) environmental period.
 * Uses a cumulative Life-Energy model to determine exact ecosystem fit.
 * Now produces CONSISTENT results for the same plant + environment combination.
 */
export const calculateAptnessMC = (
    plant: Plant,
    baseTemp: number,
    aqi: number = 20,
    baseHumidity: number = 50,
    iterations: number = 150
): number => {
    // Create deterministic random number generator
    const seed = generateSeed(plant, baseTemp, baseHumidity, aqi);
    const random = seededRandom(seed);

    // Mobile optimization: Reduce iterations on mobile devices for 2x faster performance
    // This maintains deterministic results while improving speed
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const optimizedIterations = isMobile ? Math.min(iterations, 75) : iterations;

    let energySamples: number[] = [];

    for (let i = 0; i < optimizedIterations; i++) {
        let cumulativeEnergy = 0;
        const simulationHours = 720; // 30-day simulation (30 * 24 hours)

        for (let h = 0; h < simulationHours; h++) {
            const hourOfDay = h % 24;
            const dayOfMonth = Math.floor(h / 24);

            // Diurnal Temperature Swing (Sine wave: colder at night, warmer at day)
            const diurnalDelta = Math.sin((hourOfDay - 8) * (Math.PI / 12)) * 6;

            // Weekly weather variation (simulates weather patterns over 30 days)
            const weeklyVariation = Math.sin((dayOfMonth / 7) * Math.PI) * 3;

            // Deterministic stochastic weather noise using seeded random
            const randomJitter = (random() - 0.5) * 5;

            const jitterTemp = baseTemp + diurnalDelta + weeklyVariation + randomJitter;
            const jitterHumidity = baseHumidity + (random() - 0.5) * 25;

            // Calculate exact efficiency (0.0 to 1.0) for this specific hour
            const efficiency = calculateBiologicalEfficiency(plant, jitterTemp, jitterHumidity);

            cumulativeEnergy += efficiency;
        }

        // Normalize energy to a base 100 scale
        const iterationScore = (cumulativeEnergy / simulationHours) * 100;
        energySamples.push(iterationScore);
    }

    // Average energy across all Monte Carlo iterations
    const rawAvg = energySamples.reduce((a, b) => a + b, 0) / optimizedIterations;

    // Final result is high-precision (float)
    // Removed genetic differentiation to allow tied scores for identical species specs
    let modifier = 1.0;
    const desc = (plant.description || "").toLowerCase();

    // Hardy plants have a higher baseline "Resilience Energy"
    if (desc.includes('hardy') || desc.includes('tough')) modifier += 0.05;

    const isPurifier = plant.medicinalValues?.includes('Air purification') ||
        plant.advantages?.some(a => a.toLowerCase().includes('purif'));

    // Environmental synergies with AQI
    if (aqi > 100 && isPurifier) modifier += 0.1;
    else if (aqi > 150 && !isPurifier) modifier -= 0.15;

    return Math.round(rawAvg * modifier * 10) / 10;
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
    if (maxScore === 0) return scores.map(() => 0);

    // Scaling the top to exactly 100.0
    // Others are scaled proportionally. No forced floor.
    // This allows multiple plants to hit 100 if they tie for max.
    return scores.map(s => {
        const normalized = (s / maxScore) * 100;
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
