const fs = require('fs');
const path = require('path');

// Helper for random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 1. DEFINE REAL PLANT DATA (20 Indoor + 20 Outdoor) ---
// Added: oxygen (ml/h), light (lux/desc), ac (tolerance)
const REAL_PLANTS_SOURCE = [
    // --- 20 INDOOR PLANTS ---
    { name: "Snake Plant", sci: "Sansevieria trifasciata", type: "indoor", life: "10-25 Years", medicinal: ["Air purification", "Minor wound healing"], advantages: ["Produces Oxygen at Night", "Hard to kill"], bloom: "Raceme", vein: "Parallel", inflo: "Simple", oxygen: 30, light: "Low to bright (250-2000 Lux)", ac: "High tolerance" },
    { name: "Spider Plant", sci: "Chlorophytum comosum", type: "indoor", life: "20-50 Years", medicinal: ["Air cleaning", "Non-toxic"], advantages: ["Pet safe", "Easy propagation"], bloom: "Panicle", vein: "Parallel", inflo: "Raceme", oxygen: 25, light: "Partial Shade (500-1500 Lux)", ac: "Medium tolerance" },
    { name: "Peace Lily", sci: "Spathiphyllum wallisii", type: "indoor", life: "3-5 Years", medicinal: ["Removes ammonia", "Air purifying"], advantages: ["Visual watering signal", "blooms in shade"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 20, light: "Shade (250-1000 Lux)", ac: "Low (Needs humidity)" },
    { name: "Aloe Vera", sci: "Aloe barbadensis", type: "indoor", life: "5-20 Years", medicinal: ["Burns healing", "Skin hydration"], advantages: ["Medicinal gel", "Succulent"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 28, light: "Bright direct (2000+ Lux)", ac: "High tolerance" },
    { name: "Pothos", sci: "Epipremnum aureum", type: "indoor", life: "5-10 Years", medicinal: ["Formaldehyde removal"], advantages: ["Fast growing vine", "Low maintenance"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 22, light: "Low to bright (250-1500 Lux)", ac: "High tolerance" },
    { name: "Rubber Plant", sci: "Ficus elastica", type: "indoor", life: "15-25 Years", medicinal: ["Anti-inflammatory properties"], advantages: ["Glossy large leaves", "Statement piece"], bloom: "Syconium", vein: "Pinnate", inflo: "Syconium", oxygen: 45, light: "Bright indirect (1000-2000 Lux)", ac: "Medium tolerance" },
    { name: "Monstera", sci: "Monstera deliciosa", type: "indoor", life: "10-50 Years", medicinal: ["Root used for snakebites (traditional)"], advantages: ["Iconic split leaves", "Tropical vibe"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 50, light: "Bright indirect (1000-2500 Lux)", ac: "Medium (Draft sensitive)" },
    { name: "ZZ Plant", sci: "Zamioculcas zamiifolia", type: "indoor", life: "5-10 Years", medicinal: ["Air purification"], advantages: ["Thrives in darkness", "Drought tolerant"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 18, light: "Low (100-1000 Lux)", ac: "High tolerance" },
    { name: "Boston Fern", sci: "Nephrolepis exaltata", type: "indoor", life: "2-5 Years", medicinal: ["Natural humidifier"], advantages: ["Lush foliage", "Pet safe"], bloom: "None (Spores)", vein: "Forked", inflo: "None", oxygen: 35, light: "Bright indirect (1000-1500 Lux)", ac: "Low (Needs high humidity)" },
    { name: "English Ivy", sci: "Hedera helix", type: "indoor", life: "10-50 Years", medicinal: ["Cough relief (extract)"], advantages: ["Climbing", "Mold reduction"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel", oxygen: 20, light: "Medium (500-1500 Lux)", ac: "High tolerance" },
    { name: "Areca Palm", sci: "Dypsis lutescens", type: "indoor", life: "10-15 Years", medicinal: ["Toxin removal"], advantages: ["Pet safe", "Tropical look"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 60, light: "Bright filtered (1500-2500 Lux)", ac: "Medium tolerance" },
    { name: "Fiddle Leaf Fig", sci: "Ficus lyrata", type: "indoor", life: "25-50 Years", medicinal: ["Air cleaning"], advantages: ["Architectural shape", "Huge leaves"], bloom: "Syconium", vein: "Pinnate", inflo: "Syconium", oxygen: 40, light: "Bright indirect (1500-3000 Lux)", ac: "Low (Drops leaves in drafts)" },
    { name: "Jade Plant", sci: "Crassula ovata", type: "indoor", life: "50-70 Years", medicinal: ["Wart removal (folk)"], advantages: ["Symbol of luck", "Long lived"], bloom: "Corymb", vein: "None", inflo: "Thyrse", oxygen: 15, light: "Direct Sun (3000+ Lux)", ac: "High tolerance" },
    { name: "Chinese Money Plant", sci: "Pilea peperomioides", type: "indoor", life: "5-10 Years", medicinal: ["Traditional TCM uses"], advantages: ["Unique round leaves", "Easy to gift"], bloom: "Cyme", vein: "Peltate", inflo: "Cyme", oxygen: 18, light: "Bright indirect (1000 Lux)", ac: "Medium tolerance" },
    { name: "Bird of Paradise", sci: "Strelitzia reginae", type: "indoor", life: "50-100 Years", medicinal: ["None suitable for home use"], advantages: ["Exotic flowers", "Large leaves"], bloom: "Cyme", vein: "Parallel", inflo: "Cyme", oxygen: 55, light: "High/Direct (3000+ Lux)", ac: "Medium tolerance" },
    { name: "Dumb Cane", sci: "Dieffenbachia seguine", type: "indoor", life: "3-5 Years", medicinal: ["None (Toxic)"], advantages: ["Beautiful patterns", "Full foliage"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 30, light: "Low to Medium (500-1500 Lux)", ac: "Low (Likes warmth)" },
    { name: "Prayer Plant", sci: "Maranta leuconeura", type: "indoor", life: "2-5 Years", medicinal: ["None"], advantages: ["Leaves move at night", "Colorful veins"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 20, light: "Low/Shade (500 Lux)", ac: "Low (Needs humidity)" },
    { name: "String of Pearls", sci: "Senecio rowleyanus", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Unique bead shape", "Hanging visual"], bloom: "Capitulum", vein: "None", inflo: "Cyme", oxygen: 12, light: "Bright indirect (2000 Lux)", ac: "Medium tolerance" },
    { name: "Philodendron", sci: "Philodendron hederaceum", type: "indoor", life: "10+ Years", medicinal: ["Air cleaning"], advantages: ["Heart shaped leaves", "Very hardy"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 25, light: "Low to bright (250-1500 Lux)", ac: "High tolerance" },
    { name: "Anthurium", sci: "Anthurium andraeanum", type: "indoor", life: "5-10 Years", medicinal: ["Air purification"], advantages: ["Long lasting flowers", "Waxy look"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 22, light: "Bright indirect (1500 Lux)", ac: "Medium tolerance" },

    // --- 20 OUTDOOR PLANTS ---
    { name: "Lavender", sci: "Lavandula angustifolia", type: "outdoor", life: "10-15 Years", medicinal: ["Sleep aid", "Anxiety relief"], advantages: ["Fragrant", "Attracts bees"], bloom: "Verticillaster", vein: "Parallel", inflo: "Spike", oxygen: 40, light: "Full Sun (10,000+ Lux)", ac: "N/A (Outdoor)" },
    { name: "Sunflower", sci: "Helianthus annuus", type: "outdoor", life: "1 Year", medicinal: ["seeds rich in Vitamin E"], advantages: ["Fast growth", "Edible seeds"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head", oxygen: 60, light: "Full Sun (10,000+ Lux)", ac: "N/A (Outdoor)" },
    { name: "Rose", sci: "Rosa", type: "outdoor", life: "15-20 Years", medicinal: ["Rose hips (Vitamin C)", "Skin toner"], advantages: ["Classic beauty", "Fragrance"], bloom: "Solitary", vein: "Pinnate", inflo: "Corymb", oxygen: 35, light: "Full Sun (6+ hours)", ac: "N/A (Outdoor)" },
    { name: "Marigold", sci: "Tagetes", type: "outdoor", life: "1 Year", medicinal: ["Antiseptic", "Anti-inflammatory"], advantages: ["Pest repellent", "Vibrant color"], bloom: "Capitulum", vein: "Pinnate", inflo: "Head", oxygen: 25, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Basil", sci: "Ocimum basilicum", type: "outdoor", life: "1 Year", medicinal: ["Digestion aid", "Anti-bacterial"], advantages: ["Culinary herb", "Aromatic"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme", oxygen: 20, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Mint", sci: "Mentha", type: "outdoor", life: "Perennial", medicinal: ["Stomach relief", "Headache relief"], advantages: ["Fast growing", "Tea ingredient"], bloom: "Verticillaster", vein: "Reticulate", inflo: "Spike", oxygen: 22, light: "Partial Shade to Sun", ac: "N/A (Outdoor)" },
    { name: "Rosemary", sci: "Salvia rosmarinus", type: "outdoor", life: "15-20 Years", medicinal: ["Memory boost", "Hair growth"], advantages: ["Evergreen shrub", "Culinary use"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme", oxygen: 30, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Tulip", sci: "Tulipa", type: "outdoor", life: "Perennial", medicinal: ["Skin poultice (traditional)"], advantages: ["Spring blooms", "Infinite colors"], bloom: "Solitary", vein: "Parallel", inflo: "Solitary", oxygen: 15, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Daffodil", sci: "Narcissus", type: "outdoor", life: "Perennial", medicinal: ["None (Toxic bulb)"], advantages: ["Early spring color", "Deer resistant"], bloom: "Solitary", vein: "Parallel", inflo: "Umbel", oxygen: 15, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Hydrangea", sci: "Hydrangea macrophylla", type: "outdoor", life: "50+ Years", medicinal: ["Diuretic (root)"], advantages: ["Massive flower heads", "Color changes with pH"], bloom: "Corymb", vein: "Pinnate", inflo: "Corymb", oxygen: 40, light: "Morning Sun / Shade", ac: "N/A (Outdoor)" },
    { name: "Peony", sci: "Paeonia", type: "outdoor", life: "50-100 Years", medicinal: ["Muscle relaxant (white peony)"], advantages: ["Huge blooms", "Long lifespan"], bloom: "Solitary", vein: "Biternate", inflo: "Solitary", oxygen: 38, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Chrysanthemum", sci: "Chrysanthemum", type: "outdoor", life: "3-5 Years", medicinal: ["Tea for cooling", "Eye health"], advantages: ["Fall blooms", "Pest repellent"], bloom: "Capitulum", vein: "Lobed", inflo: "Head", oxygen: 25, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Geranium", sci: "Pelargonium", type: "outdoor", life: "1-3 Years", medicinal: ["Skin healing oil"], advantages: ["Mosquito repellent", "Container friendly"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel", oxygen: 20, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Hibiscus", sci: "Hibiscus rosa-sinensis", type: "outdoor", life: "5-10 Years", medicinal: ["Lower blood pressure (tea)"], advantages: ["Tropical flair", "Edible flowers"], bloom: "Solitary", vein: "Palmate", inflo: "Solitary", oxygen: 45, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Jasmine", sci: "Jasminum", type: "outdoor", life: "10-20 Years", medicinal: ["Stress relief aroma"], advantages: ["Intense fragrance", "Climbing vine"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 30, light: "Full Sun to Part Shade", ac: "N/A (Outdoor)" },
    { name: "Azalea", sci: "Rhododendron", type: "outdoor", life: "20-50 Years", medicinal: ["None (Toxic)"], advantages: ["Shade tolerant", "Spring spectacle"], bloom: "Umbell", vein: "Pinnate", inflo: "Umbell", oxygen: 35, light: "Shade / Dappled Light", ac: "N/A (Outdoor)" },
    { name: "Magnolia", sci: "Magnolia grandiflora", type: "outdoor", life: "80+ Years", medicinal: ["Anxiety relief", "Weight loss aid"], advantages: ["Grand Southern tree", "Glossy leaves"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 200, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Lilac", sci: "Syringa vulgaris", type: "outdoor", life: "75+ Years", medicinal: ["Aromatherapy"], advantages: ["Nostalgic scent", "Cold hardy"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 60, light: "Full Sun", ac: "N/A (Outdoor)" },
    { name: "Boxwood", sci: "Buxus", type: "outdoor", life: "20-30 Years", medicinal: ["Fever reducer (historic, risky)"], advantages: ["Formal hedges", "Evergreen"], bloom: "Glomerule", vein: "Pinnate", inflo: "Glomerule", oxygen: 40, light: "Sun or Shade", ac: "N/A (Outdoor)" },
    { name: "Pansy", sci: "Viola tricolor", type: "outdoor", life: "2 Years", medicinal: ["Expectorant"], advantages: ["Winter/Spring color", "Edible flowers"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 10, light: "Sun / Part Shade", ac: "N/A (Outdoor)" }
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
        sunlight: p.light,
        oxygenLevel: `${p.oxygen} L/day`, // Updated to specific Metric
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
        sunlight: p.light,
        oxygenLevel: `${p.oxygen} L/day`, // Updated to specific Metric
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
            sunlight: p.light,
            oxygenLevel: `${p.oxygen} L/day`,
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

// Default Admin for access
export const USERS = [
    {
        _id: 'mock_admin_1',
        name: 'Admin User',
        email: 'admin@plantoxy.com',
        password: 'admin', // Mock only
        role: 'admin',
        favorites: [],
        cart: []
    }
];
`;
    // Note: We are using a relative path that assumes this script is run from project root or backend dir.
    // __dirname is usually backend/ so ../frontend/... is correct.
    const frontendPath = path.join(__dirname, '../frontend/src/data/mocks.ts');
    fs.writeFileSync(frontendPath, content);
    console.log("Frontend mocks.ts generated (with Admin User).");
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
        rarityIndex: randomInt(1, 90),
        oxygenOutput: p.oxygen, // ml/h
        lightRequirement: p.light,
        acTolerance: p.ac,
        peopleSupported: Number((p.oxygen / 550).toFixed(4)) // Approx daily need (550L) -> Plants needed = 1 / ratio
    }));

    const content = `export interface WorldFloraSpecimen {
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

console.log("ALL DATA REGENERATED SUCCESSFULLY (20 Indoor + 20 Outdoor with Sim Data).");
