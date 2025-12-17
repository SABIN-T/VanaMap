
interface PlantData {
    name: string;
    description: string;
    type: 'indoor' | 'outdoor';
    sunlight: 'low' | 'medium' | 'high' | 'direct';
    oxygenLevel: 'moderate' | 'high' | 'very-high';
    idealTempMin: number;
    idealTempMax: number;
    minHumidity: number;
    isNocturnal: boolean;
    medicinalValues: string[];
    advantages: string[];
}

const DEFAULT_DATA: PlantData = {
    name: "Unknown Species",
    description: "A unique specimen requiring specific simulation parameters. Please verify bio-metrics manually if unknown.",
    type: 'indoor',
    sunlight: 'medium',
    oxygenLevel: 'moderate',
    idealTempMin: 18,
    idealTempMax: 28,
    minHumidity: 50,
    isNocturnal: false,
    medicinalValues: ["Air purification"],
    advantages: ["Aesthetic appeal"]
};

// Knowledge Base of Botanical Genera and Species
// This acts as the "AI" brain for the simulation
export const analyzePlantSpecies = (scientificName: string): PlantData => {
    const term = scientificName.toLowerCase().trim();

    // 1. Sansevieria / Dracaena (Snake Plants)
    if (term.includes('sansevieria') || term.includes('trifasciata') || term.includes('cylindrica') || (term.includes('snake') && term.includes('plant'))) {
        return {
            name: "Snake Plant (Mother-in-Law's Tongue)",
            description: "A resilient succulent native to West Africa. It is famous for its unique ability to perform CAM photosynthesis, absorbing CO2 and releasing Oxygen at night, making it ideal for bedrooms.",
            type: 'indoor',
            sunlight: 'medium', // Tolerates low
            oxygenLevel: 'very-high',
            idealTempMin: 15,
            idealTempMax: 30,
            minHumidity: 30, // Dry tolerant
            isNocturnal: true,
            medicinalValues: ["Removes formaldehyde", "Night-time air freshening", "Filters benzene"],
            advantages: ["Impossible to kill", "Night Oxygen", "Drought tolerant"]
        };
    }

    // 2. Aloe Vera
    if (term.includes('aloe') || term.includes('barbadensis')) {
        return {
            name: "Aloe Vera",
            description: "A succulent plant species renowned for its medicinal gel and nocturnal oxygen production. It thrives in sunny, arid conditions and requires minimal watering.",
            type: 'indoor', // Close to window
            sunlight: 'high',
            oxygenLevel: 'high',
            idealTempMin: 18,
            idealTempMax: 32,
            minHumidity: 20,
            isNocturnal: true,
            medicinalValues: ["Heals burns", "Skin care", "Air purification"],
            advantages: ["Medicinal Gel", "Low water need", "Night O2"]
        };
    }

    // 3. Spathiphyllum (Peace Lily)
    if (term.includes('spathiphyllum') || term.includes('peace') || term.includes('wallisii')) {
        return {
            name: "Peace Lily",
            description: "A beautiful flowering plant that excels at breaking down toxic gases like carbon monoxide and formaldehyde. It prefers consistent moisture and shade.",
            type: 'indoor',
            sunlight: 'low',
            oxygenLevel: 'very-high',
            idealTempMin: 18,
            idealTempMax: 26,
            minHumidity: 60,
            isNocturnal: false,
            medicinalValues: ["Removes mold spores", "Filters acetone", "Humidifies air"],
            advantages: ["Visual warning for water (droops)", "Flowering indoor", "Low light king"]
        };
    }

    // 4. Epipremnum (Pothos / Money Plant)
    if (term.includes('epipremnum') || term.includes('aureum') || term.includes('pothos') || term.includes('money')) {
        return {
            name: "Golden Pothos (Money Plant)",
            description: "Known as 'Devil's Ivy', this hardy vine is a powerhouse for scrubbing indoor pollutants like formaldehyde, xylene, and toluene from the air.",
            type: 'indoor',
            sunlight: 'medium',
            oxygenLevel: 'moderate',
            idealTempMin: 15,
            idealTempMax: 30,
            minHumidity: 40,
            isNocturnal: false,
            medicinalValues: ["Removes VOCs", "Reduces eye irritation"],
            advantages: ["Fast growing", "Trailing vine aesthetic", "Hardy"]
        };
    }

    // 5. Chlorophytum (Spider Plant)
    if (term.includes('chlorophytum') || term.includes('comosum') || term.includes('spider')) {
        return {
            name: "Spider Plant",
            description: "A fast-growing plant that produces 'spiderette' offshoots. NASA studies identify it as a top air purifier for removing formaldehyde and carbon monoxide.",
            type: 'indoor',
            sunlight: 'medium',
            oxygenLevel: 'high',
            idealTempMin: 13,
            idealTempMax: 27,
            minHumidity: 45,
            isNocturnal: false,
            medicinalValues: ["Non-toxic to pets", "Removes CO", "Safe for kids"],
            advantages: ["Pet friendly", "Easy to propagate", "Air scrubber"]
        };
    }

    // 6. Ficus Lyrata (Fiddle Leaf Fig)
    if (term.includes('lyrata') || term.includes('fiddle')) {
        return {
            name: "Fiddle Leaf Fig",
            description: "A structural tree with large, violin-shaped leaves. It serves as a visual centerpiece and contributes to humidity regulation, though it can be temperamental.",
            type: 'indoor',
            sunlight: 'high',
            oxygenLevel: 'high', // Large surface area
            idealTempMin: 18,
            idealTempMax: 28,
            minHumidity: 60, // Likes humidity
            isNocturnal: false,
            medicinalValues: ["Dust trap (large leaves)", "Humidity regulation"],
            advantages: ["Statement piece", "High transpiration", "Vertical growth"]
        };
    }

    // 7. Ficus Elastica (Rubber Plant)
    if (term.includes('elastica') || term.includes('rubber')) {
        return {
            name: "Rubber Plant",
            description: "Characterized by glossy, dark leaves, this plant is excellent at absorbing airborne chemicals and bacteria. It adapts well to standard indoor temperatures.",
            type: 'indoor',
            sunlight: 'medium',
            oxygenLevel: 'high',
            idealTempMin: 16,
            idealTempMax: 29,
            minHumidity: 40,
            isNocturnal: false,
            medicinalValues: ["Eliminates bacteria", "Mold reduction"],
            advantages: ["Waxy leaves", "Bold dark color", "Low maintenance"]
        };
    }

    // 8. Monstera
    if (term.includes('monstera') || term.includes('deliciosa')) {
        return {
            name: "Monstera Deliciosa (Swiss Cheese)",
            description: "A tropical jungle giant famous for its fenestrated (split) leaves. It adds significant biomass and moisture to indoor environments.",
            type: 'indoor',
            sunlight: 'medium',
            oxygenLevel: 'high',
            idealTempMin: 18,
            idealTempMax: 30,
            minHumidity: 60,
            isNocturnal: false,
            medicinalValues: ["Mood enhancement", "Sound dampening"],
            advantages: ["Iconic aesthetic", "Climbing growth", "Pest resistant"]
        };
    }

    // 9. Areca Palm / Dypsis
    if (term.includes('dypsis') || term.includes('lutescens') || term.includes('areca') || term.includes('palm')) {
        return {
            name: "Areca Palm",
            description: "One of the most efficient natural humidifiers. It breathes moisture into dry air while scrubbing toxins, making it excellent for offices and living rooms.",
            type: 'indoor',
            sunlight: 'high', // Bright indirect
            oxygenLevel: 'very-high',
            idealTempMin: 18,
            idealTempMax: 26,
            minHumidity: 50,
            isNocturnal: false,
            medicinalValues: ["Natural humidifier", "Sinus relief"],
            advantages: ["Large coverage", "Tropical feel", "Non-toxic"]
        };
    }

    // 10. Ocimum (Tulsi/Basil)
    if (term.includes('ocimum') || term.includes('tenuiflorum') || term.includes('sanctum') || term.includes('tulsi')) {
        return {
            name: "Holy Basil (Tulsi)",
            description: "Revered in Ayurveda as the 'Queen of Herbs'. Uniquely, it is believed to emit oxygen for up to 20 hours a day and possesses strong medicinal properties.",
            type: 'outdoor', // Often grown outdoor or bright balcony
            sunlight: 'direct',
            oxygenLevel: 'very-high',
            idealTempMin: 20,
            idealTempMax: 35,
            minHumidity: 40,
            isNocturnal: true, // Pseudo-nocturnal effect in tradition
            medicinalValues: ["Adaptogen", "Immune booster", "Mosquito repellent"],
            advantages: ["Sacred herb", "Tea production", "Ozone emission"]
        };
    }

    // 10. Crassula (Jade)
    if (term.includes('crassula') || term.includes('ovata') || term.includes('jade')) {
        return {
            name: "Jade Plant",
            description: "A symbol of good luck and prosperity. As a succulent, it utilizes CAM photosynthesis to clean the air at night, suitable for bedrooms.",
            type: 'indoor',
            sunlight: 'medium',
            oxygenLevel: 'moderate',
            idealTempMin: 10,
            idealTempMax: 28,
            minHumidity: 30,
            isNocturnal: true,
            medicinalValues: ["Air quality", "Humidity balance"],
            advantages: ["Longevity (lives decades)", "Feng Shui", "Compact"]
        };
    }

    // Fallbacks
    if (term.includes('fern')) {
        return { ...DEFAULT_DATA, name: "Fern Species", description: "Ancient vascular plant. Loves humidity and shade.", type: 'indoor', sunlight: 'low', minHumidity: 70, medicinalValues: ["Humidity"], advantages: ["Lush Greenery"] };
    }
    if (term.includes('succulent') || term.includes('sedum') || term.includes('echeveria')) {
        return { ...DEFAULT_DATA, name: "Succulent Hybrid", description: "Water-retaining plant adapted for dry climates.", type: 'indoor', sunlight: 'high', minHumidity: 20, isNocturnal: true, medicinalValues: ["Low allergen"], advantages: ["Tiny footprint"] };
    }
    if (term.includes('cactus')) {
        return { ...DEFAULT_DATA, name: "Cactus Species", description: "Desert dweller. Extreme drought tolerance.", type: 'indoor', sunlight: 'direct', minHumidity: 10, isNocturnal: true, medicinalValues: ["EMF Mitigation (Folk)"], advantages: ["Structural shape"] };
    }

    return { ...DEFAULT_DATA, name: scientificName.split(' ')[0] + " Common" };
};
