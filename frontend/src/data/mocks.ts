import type { Plant, Vendor } from '../types';

// Real Data Source mirroring the Backend Logic
const REAL_PLANTS_DATA = [
    { name: "Snake Plant", sci: "Sansevieria trifasciata", life: "10-25 Years", medicinal: ["Air purification", "Stress reduction"], advantages: ["Easiest to grow", "Drought tolerant"], type: 'indoor' },
    { name: "Peace Lily", sci: "Spathiphyllum wallisii", life: "3-5 Years", medicinal: ["Removes ammonia", "Removes benzene"], advantages: ["Flowering indoor", "Visual watering signal"], type: 'indoor' },
    { name: "Spider Plant", sci: "Chlorophytum comosum", life: "20-50 Years", medicinal: ["Safe for pets", "Oxygen production"], advantages: ["Easy propagation", "Non-toxic"], type: 'indoor' },
    { name: "Fiddle Leaf Fig", sci: "Ficus lyrata", life: "25-50 Years", medicinal: ["Visual stress relief", "Dust collection"], advantages: ["Architectural structure", "Trendy aesthetic"], type: 'indoor' },
    { name: "Aloe Vera", sci: "Aloe barbadensis miller", life: "5-20 Years", medicinal: ["Heals burns", "Skin care"], advantages: ["Releases oxygen at night", "Low maintenance"], type: 'indoor' },
    { name: "Rubber Plant", sci: "Ficus elastica", life: "15-25 Years", medicinal: ["Removes formaldehyde", "Removes bacteria"], advantages: ["Large foliage", "Robust stem"], type: 'indoor' },
    { name: "Monstera", sci: "Monstera deliciosa", life: "10-50 Years", medicinal: ["Mood booster", "Air purifying"], advantages: ["Statement piece", "Fast grower"], type: 'indoor' },
    { name: "Pothos", sci: "Epipremnum aureum", life: "5-10 Years", medicinal: ["Removes pollutants", "Eye relaxation"], advantages: ["Trailing beauty", "Propagates easily in water"], type: 'indoor' },
    { name: "ZZ Plant", sci: "Zamioculcas zamiifolia", life: "5-10 Years", medicinal: ["Air purification", "Stress reduction"], advantages: ["Thrives on neglect", "Modern look"], type: 'indoor' },
    { name: "Boston Fern", sci: "Nephrolepis exaltata", life: "2-5 Years", medicinal: ["Natural humidifier", "Clean air"], advantages: ["Lush foliage", "Pet friendly"], type: 'indoor' },
    { name: "Jade Plant", sci: "Crassula ovata", life: "50-70 Years", medicinal: ["Skin irritant (Sap)", "Symbolism only"], advantages: ["Long lived", "Easy bonsai"], type: 'indoor' },
    { name: "Chinese Money Plant", sci: "Pilea peperomioides", life: "5-10 Years", medicinal: ["None known"], advantages: ["Cute appearance", "Easy to share pups"], type: 'indoor' },
    { name: "Areca Palm", sci: "Dypsis lutescens", life: "10-15 Years", medicinal: ["Humidifier", "Removes Xylene"], advantages: ["Pet friendly", "Tropical look"], type: 'indoor' },
    { name: "Bird of Paradise", sci: "Strelitzia reginae", life: "50-100 Years", medicinal: ["None known"], advantages: ["Statement plant", "Exotic flowers"], type: 'indoor' },
    { name: "Cast Iron Plant", sci: "Aspidistra elatior", life: "50+ Years", medicinal: ["None known"], advantages: ["Indestructible", "Low light tolerant"], type: 'indoor' },

    // Outdoors
    { name: "Lavender", sci: "Lavandula angustifolia", life: "10-15 Years", medicinal: ["Calming", "Sleep aid", "Antiseptic"], advantages: ["Fragrant", "Bee friendly", "Drought tolerant"], type: 'outdoor' },
    { name: "Rose Bush", sci: "Rosa", life: "15-20 Years", medicinal: ["Vitamin C (Hips)", "Aromatherapy"], advantages: ["Beautiful blooms", "Fragrance", "Cut flowers"], type: 'outdoor' },
    { name: "Hydrangea", sci: "Hydrangea macrophylla", life: "50+ Years", medicinal: ["Diuretic (Root - Caution)"], advantages: ["Showy flowers", "Color change pH"], type: 'outdoor' },
    { name: "Sunflower", sci: "Helianthus annuus", life: "Annual (1 Year)", medicinal: ["Nutritious seeds", "Skin oil"], advantages: ["Rapid growth", "Pollinator magnet"], type: 'outdoor' },
    { name: "Tulip", sci: "Tulipa", life: "Perennial (3-5 Years)", medicinal: ["None specific"], advantages: ["Vibrant spring colors", "Variety"], type: 'outdoor' },
    { name: "Oak Tree", sci: "Quercus", life: "100+ Years", medicinal: ["Astringent (Bark)"], advantages: ["Shade", "Wildlife habitat", "Long lived"], type: 'outdoor' },
    { name: "Maple Tree", sci: "Acer", life: "80-100 Years", medicinal: ["Syrup (Sap)"], advantages: ["Fall color", "Shade", "Wood"], type: 'outdoor' },
    { name: "Peony", sci: "Paeonia", life: "50-100 Years", medicinal: ["Anti-inflammatory (Root)"], advantages: ["Huge flowers", "Long lived"], type: 'outdoor' },
    { name: "Marigold", sci: "Tagetes", life: "Annual (1 Year)", medicinal: ["Antiseptic", "Eye health (Lutein)"], advantages: ["Repels pests", "Edible petals"], type: 'outdoor' },
    { name: "Basil", sci: "Ocimum basilicum", life: "Annual (1 Year)", medicinal: ["Anti-inflammatory", "Digestive aid"], advantages: ["Delicious", "Fast growing", "Aromatic"], type: 'outdoor' },
    { name: "Tomato", sci: "Solanum lycopersicum", life: "Annual (1 Year)", medicinal: ["Antioxidant (Lycopene)"], advantages: ["Edible fruit", "Productive"], type: 'outdoor' },
    { name: "Boxwood", sci: "Buxus", life: "20-30 Years", medicinal: ["Febrifuge (Historical)"], advantages: ["Evergreen", "Shapeable hedge"], type: 'outdoor' }
];

export const PLANTS: Plant[] = REAL_PLANTS_DATA.map((data, index) => {
    const isIndoor = data.type === 'indoor';
    return {
        id: `mock_${index + 1}`,
        name: data.name,
        scientificName: data.sci,
        description: `The ${data.name} (${data.sci}) is a beautiful ${data.type} specimen known for its ${data.life} lifespan. It thrives in ${isIndoor ? "controlled indoor" : "natural outdoor"} environments.`,
        imageUrl: isIndoor
            ? 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80' // Indoor placeholder
            : 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80', // Outdoor placeholder
        idealTempMin: 15,
        idealTempMax: 30,
        minHumidity: 40,
        sunlight: isIndoor ? 'medium' : 'high',
        oxygenLevel: 'high',
        medicinalValues: data.medicinal,
        advantages: data.advantages,
        price: 25,
        type: data.type as 'indoor' | 'outdoor',
        lifespan: data.life
    };
});

// Use more specific images for top plants to look good
const IMAGE_MAP: Record<string, string> = {
    "Snake Plant": "https://images.unsplash.com/photo-1593482886870-920274697157?auto=format&fit=crop&q=80",
    "Aloe Vera": "https://images.unsplash.com/photo-1635905165993-9c5123514a6e?auto=format&fit=crop&q=80",
    "Monstera": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80",
    "Fiddle Leaf Fig": "https://images.unsplash.com/photo-1614594801127-14e4b518596f?auto=format&fit=crop&q=80",
    "Pothos": "https://images.unsplash.com/photo-1596726214532-d8205f95031b?auto=format&fit=crop&q=80",
    "Lavender": "https://images.unsplash.com/photo-1565043589221-1a6a89324021?auto=format&fit=crop&q=80",
    "Sunflower": "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80",
    "Tulip": "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80"
};

PLANTS.forEach(p => {
    if (IMAGE_MAP[p.name]) {
        p.imageUrl = IMAGE_MAP[p.name];
    }
});

// --- MOCK VENDORS ---
export const VENDORS: Vendor[] = [
    {
        id: 'v1',
        name: 'Green Thumb Nursery',
        latitude: 28.6139,
        longitude: 77.2090, // Delhi
        address: '123 Green Way, New Delhi',
        phone: '9876543210',
        whatsapp: '9876543210',
        website: 'https://greenthumb.com',
        inventoryIds: ['mock_1', 'mock_2', 'mock_3', 'mock_6', 'mock_30'],
        verified: true,
        highlyRecommended: true,
        inventory: [
            { plantId: 'mock_1', price: 200, status: 'approved', inStock: true },
            { plantId: 'mock_2', price: 150, status: 'approved', inStock: true }
        ]
    },
    {
        id: 'v2',
        name: 'Urban Jungle Store',
        latitude: 19.0760,
        longitude: 72.8777, // Mumbai
        address: '456 Urban St, Mumbai',
        phone: '9123456780',
        whatsapp: '9123456780',
        inventoryIds: ['mock_8', 'mock_9', 'mock_32', 'mock_15'],
        verified: true,
        inventory: [
            { plantId: 'mock_8', price: 180, status: 'approved', inStock: true }
        ]
    }
];

// --- MOCK USERS ---
export const USERS = [
    {
        name: "Sabin Thapa",
        email: "sabin@example.com",
        password: "password123",
        role: "admin",
        favorites: ['mock_1', 'mock_6'],
        cart: []
    }
];
