export interface WorldFloraSpecimen {
    id: string;
    scientificName: string;
    commonName: string;
    flowerType: string;
    leafVenation: string;
    inflorescencePattern: string;
    rarityIndex: number;
    oxygenOutput: number; // ml/hour
    lightRequirement: string;
    acTolerance: string;
    peopleSupported: number; // calculated ratio
    aptness: number; // 0-100% Simulation Suitability Score
    verifiedSource: string;
    idealTempMin: number;
    idealTempMax: number;
    minHumidity: number;
    preferredSoil: 'loamy' | 'clayey' | 'sandy' | 'laterite' | 'red_black';
    annualRainfallRequirement: number; // mm/year
    climateZone: 'Tropical' | 'Arid' | 'Temperate' | 'Mediterranean' | 'Subtropical';
    type: 'indoor' | 'outdoor';
}

export const worldFlora: WorldFloraSpecimen[] = [];
