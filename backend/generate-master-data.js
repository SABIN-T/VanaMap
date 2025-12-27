const fs = require('fs');
const path = require('path');

// Helper for random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 1. DEFINE REAL PLANT DATA ---
const REAL_PLANTS_SOURCE = [
    // INDOOR PLANTS (30+)
    { name: "Snake Plant", sci: "Sansevieria trifasciata", type: "indoor", life: "10-25 Years", medicinal: ["Air purification", "Stress reduction"], advantages: ["Hard to kill", "Low light tolerant"], bloom: "Raceme", vein: "Parallel", inflo: "Simple" },
    { name: "Peace Lily", sci: "Spathiphyllum wallisii", type: "indoor", life: "3-5 Years", medicinal: ["Removes pollutants", "Air cleaning"], advantages: ["Visual watering signal", "Blooms indoors"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix" },
    { name: "Spider Plant", sci: "Chlorophytum comosum", type: "indoor", life: "20-50 Years", medicinal: ["None (Safe for pets)", "Oxygen"], advantages: ["Easy to propagate", "Pet safe"], bloom: "Panicle", vein: "Parallel", inflo: "Raceme" },
    { name: "Fiddle Leaf Fig", sci: "Ficus lyrata", type: "indoor", life: "25-50 Years", medicinal: ["Visual stress relief"], advantages: ["Statement piece", "Large leaves"], bloom: "Syconium", vein: "Pinnate", inflo: "Syconium" },
    { name: "Aloe Vera", sci: "Aloe barbadensis", type: "indoor", life: "5-20 Years", medicinal: ["Heals burns", "Skin care"], advantages: ["Succulent", "Medicinal gel"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme" },
    { name: "Rubber Plant", sci: "Ficus elastica", type: "indoor", life: "15-25 Years", medicinal: ["Removes formaldehyde"], advantages: ["Glossy leaves", "Robust"], bloom: "Syconium", vein: "Pinnate", inflo: "Syconium" },
    { name: "Monstera", sci: "Monstera deliciosa", type: "indoor", life: "10-50 Years", medicinal: ["Mood booster"], advantages: ["Tropical feel", "Fast growing"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix" },
    { name: "Pothos", sci: "Epipremnum aureum", type: "indoor", life: "5-10 Years", medicinal: ["Air scrubbing"], advantages: ["Best for beginners", "Trailing vine"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix" },
    { name: "ZZ Plant", sci: "Zamioculcas zamiifolia", type: "indoor", life: "5-10 Years", medicinal: ["Air purification"], advantages: ["Thrives in dark", "Drought tolerant"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix" },
    { name: "Boston Fern", sci: "Nephrolepis exaltata", type: "indoor", life: "2-5 Years", medicinal: ["Humidifier"], advantages: ["Lush Hanging Plant", "Pet Safe"], bloom: "None (Spores)", vein: "Forked", inflo: "None" },
    { name: "Jade Plant", sci: "Crassula ovata", type: "indoor", life: "50-70 Years", medicinal: ["None"], advantages: ["Symbol of luck", "Long lived"], bloom: "Corymb", vein: "None", inflo: "Thyrse" },
    { name: "Chinese Money Plant", sci: "Pilea peperomioides", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Cute round leaves", "Pass-along plant"], bloom: "Cyme", vein: "Peltate", inflo: "Cyme" },
    { name: "Areca Palm", sci: "Dypsis lutescens", type: "indoor", life: "10-15 Years", medicinal: ["Removes toxins"], advantages: ["Tropical look", "Pet safe"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle" },
    { name: "Bird of Paradise", sci: "Strelitzia reginae", type: "indoor", life: "50-100 Years", medicinal: ["None"], advantages: ["Exotic flowers", "Large leaves"], bloom: "Cyme", vein: "Parallel", inflo: "Cyme" },
    { name: "Cast Iron Plant", sci: "Aspidistra elatior", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Indestructible", "Deep shade"], bloom: "Solitary", vein: "Parallel", inflo: "Solitary" },
    { name: "English Ivy", sci: "Hedera helix", type: "indoor", life: "10-50 Years", medicinal: ["Mold reduction"], advantages: ["Climbing", "Fast covering"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel" },
    { name: "Philodendron", sci: "Philodendron hederaceum", type: "indoor", life: "10+ Years", medicinal: ["Air cleaning"], advantages: ["Heart shaped leaves", "Easy care"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix" },
    { name: "Majesty Palm", sci: "Ravenea rivularis", type: "indoor", life: "10-20 Years", medicinal: ["Air cleaning"], advantages: ["Big palm", "Inexpensive"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle" },
    { name: "Dumb Cane", sci: "Dieffenbachia seguine", type: "indoor", life: "3-5 Years", medicinal: ["None (Toxic)"], advantages: ["Patterned leaves", "Bushy"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix" },
    { name: "Prayer Plant", sci: "Maranta leuconeura", type: "indoor", life: "2-5 Years", medicinal: ["Sleep cycle helper"], advantages: ["Leaves move at night", "Colorful"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme" },
    { name: "Calathea", sci: "Calathea makoyana", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Peacock patterns", "Pet safe"], bloom: "Spike", vein: "Parallel", inflo: "Spike" },
    { name: "Ponytail Palm", sci: "Beaucarnea recurvata", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Fun shape", "Drought proof"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle" },
    { name: "String of Pearls", sci: "Senecio rowleyanus", type: "indoor", life: "3-5 Years", medicinal: ["Visual interest"], advantages: ["Unique beads", "Hanging"], bloom: "Capitulum", vein: "None", inflo: "Cyme" },
    { name: "African Violet", sci: "Saintpaulia ionantha", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Purple flowers", "Small"], bloom: "Cyme", vein: "Unknown", inflo: "Cyme" },
    { name: "Air Plant", sci: "Tillandsia", type: "indoor", life: "2-5 Years", medicinal: ["None"], advantages: ["No soil needed", "Unique"], bloom: "Spike", vein: "Parallel", inflo: "Spike" },
    { name: "Lucky Bamboo", sci: "Dracaena sanderiana", type: "indoor", life: "5-10 Years", medicinal: ["Feng Shui"], advantages: ["Grows in water", "Office plant"], bloom: "Umbell", vein: "Parallel", inflo: "Umbell" },
    { name: "Christmas Cactus", sci: "Schlumbergera", type: "indoor", life: "20-30 Years", medicinal: ["None"], advantages: ["Winter bloom", "Non-toxic"], bloom: "Solitary", vein: "None", inflo: "Solitary" },
    { name: "Croton", sci: "Codiaeum variegatum", type: "indoor", life: "2-5 Years", medicinal: ["None"], advantages: ["Super colorful", "Autumn vibes"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme" },
    { name: "Anthurium", sci: "Anthurium andraeanum", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Red flowers", "Waxy leaves"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix" },
    { name: "Parlor Palm", sci: "Chamaedorea elegans", type: "indoor", life: "10-20 Years", medicinal: ["None"], advantages: ["Pet safe", "Compact palm"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle" },

    // OUTDOOR PLANTS (30+)
    { name: "Lavender", sci: "Lavandula angustifolia", type: "outdoor", life: "10-15 Years", medicinal: ["Sleep aid", "Calming oil"], advantages: ["Fragrance", "Pollinators"], bloom: "Verticillaster", vein: "Parallel", inflo: "Spike" },
    { name: "Rose", sci: "Rosa", type: "outdoor", life: "15-20 Years", medicinal: ["Vitamin C (Hips)"], advantages: ["Classic beauty", "Scent"], bloom: "Solitary", vein: "Pinnate", inflo: "Corymb" },
    { name: "Sunflower", sci: "Helianthus annuus", type: "outdoor", life: "1 Year", medicinal: ["Nutritious seeds"], advantages: ["Fast growth", "Happy look"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head" },
    { name: "Hydrangea", sci: "Hydrangea macrophylla", type: "outdoor", life: "50+ Years", medicinal: ["None"], advantages: ["Huge flower heads", "Color changing"], bloom: "Corymb", vein: "Pinnate", inflo: "Corymb" },
    { name: "Tulip", sci: "Tulipa", type: "outdoor", life: "Perennial", medicinal: ["None"], advantages: ["Spring color", "Variety"], bloom: "Solitary", vein: "Parallel", inflo: "Solitary" },
    { name: "Marigold", sci: "Tagetes", type: "outdoor", life: "1 Year", medicinal: ["Antiseptic"], advantages: ["Pest repellant", "Bright orange"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head" },
    { name: "Basil", sci: "Ocimum basilicum", type: "outdoor", life: "1 Year", medicinal: ["Digestion aid"], advantages: ["Edible", "Aromatic"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme" },
    { name: "Tomato", sci: "Solanum lycopersicum", type: "outdoor", life: "1 Year", medicinal: ["Antioxidant"], advantages: ["Edible fruit", "Productive"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme" },
    { name: "Peony", sci: "Paeonia", type: "outdoor", life: "50-100 Years", medicinal: ["Anti-inflammatory"], advantages: ["Massive blooms", "Long lived"], bloom: "Solitary", vein: "Biternate", inflo: "Solitary" },
    { name: "Daffodil", sci: "Narcissus", type: "outdoor", life: "Perennial", medicinal: ["None"], advantages: ["Early spring bloom", "Deer resistant"], bloom: "Solitary", vein: "Parallel", inflo: "Umbel" },
    { name: "Oak Tree", sci: "Quercus", type: "outdoor", life: "100+ Years", medicinal: ["Astringent"], advantages: ["Shade", "Wildlife home"], bloom: "Catkin", vein: "Pinnate", inflo: "Catkin" },
    { name: "Maple Tree", sci: "Acer", type: "outdoor", life: "80+ Years", medicinal: ["Maple syrup"], advantages: ["Fall color", "Shade"], bloom: "Corymb", vein: "Palmate", inflo: "Corymb" },
    { name: "Coneflower", sci: "Echinacea purpurea", type: "outdoor", life: "2-4 Years", medicinal: ["Immune booster"], advantages: ["Native", "Pollinators"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head" },
    { name: "Black-Eyed Susan", sci: "Rudbeckia hirta", type: "outdoor", life: "2-3 Years", medicinal: ["None"], advantages: ["Long blooming", "Tough"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head" },
    { name: "Lilac", sci: "Syringa vulgaris", type: "outdoor", life: "75+ Years", medicinal: ["Aromatherapy"], advantages: ["Best scent", "Cold hardy"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle" },
    { name: "Hostas", sci: "Hosta", type: "outdoor", life: "30+ Years", medicinal: ["None"], advantages: ["Shade lover", "Lush leaves"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme" },
    { name: "Rosemary", sci: "Salvia rosmarinus", type: "outdoor", life: "15-20 Years", medicinal: ["Memory"], advantages: ["Edible", "Evergreen"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme" },
    { name: "Mint", sci: "Mentha", type: "outdoor", life: "Perennial", medicinal: ["Stomach relief"], advantages: ["Fast tea", "Smell"], bloom: "Verticillaster", vein: "Reticulate", inflo: "Spike" },
    { name: "Petunia", sci: "Petunia", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Continuous color", "Hanging basket"], bloom: "Solitary", vein: "Reticulate", inflo: "Solitary" },
    { name: "Geranium", sci: "Pelargonium", type: "outdoor", life: "1-3 Years", medicinal: ["Skin oil"], advantages: ["Bright red", "Mosquito repellent"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel" },
    { name: "Hibiscus", sci: "Hibiscus rosa-sinensis", type: "outdoor", life: "5-10 Years", medicinal: ["Tea"], advantages: ["Tropical", "Huge flower"], bloom: "Solitary", vein: "Palmate", inflo: "Solitary" },
    { name: "Jasmine", sci: "Jasminum", type: "outdoor", life: "10-20 Years", medicinal: ["Stress relief"], advantages: ["Perfume scent", "Climber"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme" },
    { name: "Azalea", sci: "Rhododendron", type: "outdoor", life: "20-50 Years", medicinal: ["None"], advantages: ["Spring show", "Shade"], bloom: "Umbell", vein: "Pinnate", inflo: "Umbell" },
    { name: "Boxwood", sci: "Buxus", type: "outdoor", life: "20-30 Years", medicinal: ["None"], advantages: ["Formal hedge", "Evergreen"], bloom: "Glomerule", vein: "Pinnate", inflo: "Glomerule" },
    { name: "Magnolia", sci: "Magnolia grandiflora", type: "outdoor", life: "80+ Years", medicinal: ["Anxiety"], advantages: ["Southern charm", "Glossy leaves"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary" },
    { name: "Wisteria", sci: "Wisteria", type: "outdoor", life: "50+ Years", medicinal: ["None"], advantages: ["Cascading flowers", "Scent"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme" },
    { name: "Chrysanthemum", sci: "Chrysanthemum", type: "outdoor", life: "3-5 Years", medicinal: ["Tea"], advantages: ["Fall classic", "Many colors"], bloom: "Capitulum", vein: "Lobed", inflo: "Head" },
    { name: "Pansy", sci: "Viola tricolor", type: "outdoor", life: "2 Years", medicinal: ["None"], advantages: ["Winter color", "Edible"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary" },
    { name: "Snapdragon", sci: "Antirrhinum", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Vertical spikes", "Kid favorite"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme" },
    { name: "Bleeding Heart", sci: "Lamprocapnos", type: "outdoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Unique shape", "Shade"], bloom: "Raceme", vein: "Biternate", inflo: "Raceme" }
];

// --- 2. GENERATE BACKEND DATA (plant-data.js) ---
const generateBackendData = () => {
    // Generate data objects (NO escaped backticks here)
    const indoor = REAL_PLANTS_SOURCE.filter(p => p.type === 'indoor').map((p, i) => ({
        id: `p_in_${1000 + i}`,
        name: p.name,
        scientificName: p.sci,
        description: `The ${p.name} (${p.sci}) is a widely loved ${p.type} plant. Known for its ${p.life} lifespan, it is perfect for anyone looking to add ${p.advantages[0].toLowerCase()} to their life.`,
        imageUrl: `https://images.unsplash.com/photo-${randomInt(1000000000, 9999999999)}?auto=format&fit=crop&w=800&q=80`,
        idealTempMin: 15,
        idealTempMax: 30,
        minHumidity: 40,
        sunlight: "medium",
        oxygenLevel: "high",
        medicinalValues: p.medicinal,
        advantages: p.advantages,
        price: randomInt(15, 150),
        type: 'indoor',
        lifespan: p.life,
        foliageTexture: "Smooth",
        leafShape: "Ovate",
        stemStructure: "Herbaceous",
        overallHabit: "Upright",
        biometricFeatures: ["Domesticated", "Pot-friendly"]
    }));

    const outdoor = REAL_PLANTS_SOURCE.filter(p => p.type === 'outdoor').map((p, i) => ({
        id: `p_out_${2000 + i}`,
        name: p.name,
        scientificName: p.sci,
        description: `The ${p.name} (${p.sci}) is a classic garden staple. With a lifespan of ${p.life}, it offers ${p.advantages[0].toLowerCase()} and is perfect for natural settings.`,
        imageUrl: `https://images.unsplash.com/photo-${randomInt(1000000000, 9999999999)}?auto=format&fit=crop&w=800&q=80`,
        idealTempMin: 5,
        idealTempMax: 35,
        minHumidity: 30,
        sunlight: "high",
        oxygenLevel: "moderate",
        medicinalValues: p.medicinal,
        advantages: p.advantages,
        price: randomInt(5, 80),
        type: 'outdoor',
        lifespan: p.life,
        foliageTexture: "Textured",
        leafShape: "Lanceolate",
        stemStructure: "Woody",
        overallHabit: "Spreading",
        biometricFeatures: ["Hardy", "Weather resistant"]
    }));

    // For writing the file content, we DO need to construct a string representation of the objects.
    // JSON.stringify handles this perfectly.
    const content = `// MASTER PLANT DATA (Generated)
const indoorPlants = ${JSON.stringify(indoor, null, 4)};
const outdoorPlants = ${JSON.stringify(outdoor, null, 4)};

module.exports = { indoorPlants, outdoorPlants };
`;

    fs.writeFileSync(path.join(__dirname, 'plant-data.js'), content);
    console.log("Backend plant-data.js generated.");
};

// --- 3. GENERATE FRONTEND TYPESCRIPT MOCKS (mocks.ts) ---
const generateFrontendMocks = () => {
    const allPlants = REAL_PLANTS_SOURCE.map((p, i) => {
        const isIndoor = p.type === 'indoor';
        return {
            id: `mock_${i + 1}`,
            name: p.name,
            scientificName: p.sci,
            description: `The ${p.name} is a user-friendly ${p.type} plant. It brings ${p.advantages[0].toLowerCase()} to your environment.`,
            imageUrl: isIndoor
                ? 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80',
            idealTempMin: 10,
            idealTempMax: 30,
            minHumidity: 40,
            sunlight: isIndoor ? 'medium' : 'high',
            oxygenLevel: 'high',
            medicinalValues: p.medicinal,
            advantages: p.advantages,
            price: 25,
            type: p.type,
            lifespan: p.life
        };
    });

    const content = `import type { Plant, Vendor } from '../types';

export const PLANTS: Plant[] = ${JSON.stringify(allPlants, null, 4)};

export const VENDORS: Vendor[] = [];
export const USERS = [];
`;
    const frontendPath = path.join(__dirname, '../frontend/src/data/mocks.ts');
    fs.writeFileSync(frontendPath, content);
    console.log("Frontend mocks.ts generated.");
};

// --- 4. GENERATE SIMULATION DATA (worldFlora.ts) ---
const generateSimulationData = () => {
    const flora = REAL_PLANTS_SOURCE.map((p, i) => ({
        id: `wf_${1000 + i}`,
        scientificName: p.sci,
        commonName: p.name,
        flowerType: p.bloom,
        leafVenation: p.vein,
        inflorescencePattern: p.inflo,
        rarityIndex: randomInt(1, 90)
    }));

    const content = `export interface WorldFloraSpecimen {
    id: string;
    scientificName: string;
    commonName: string;
    flowerType: string;
    leafVenation: string;
    inflorescencePattern: string;
    rarityIndex: number;
}

export const worldFlora: WorldFloraSpecimen[] = ${JSON.stringify(flora, null, 4)};
`;
    const simPath = path.join(__dirname, '../frontend/src/data/worldFlora.ts');
    fs.writeFileSync(simPath, content);
    console.log("Frontend worldFlora.ts generated.");
};

// RUN ALL
generateBackendData();
generateFrontendMocks();
generateSimulationData();

console.log("ALL DATA REGENERATED SUCCESSFULLY.");
