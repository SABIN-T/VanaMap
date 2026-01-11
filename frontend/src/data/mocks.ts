import type { Plant, Vendor } from '../types';

export const PLANTS: Plant[] = [
    {
        "id": "mock_1",
        "name": "Snake Plant",
        "scientificName": "Sansevieria trifasciata",
        "description": "The Snake Plant is a user-friendly indoor plant. It brings produces oxygen at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 30,
        "sunlight": "Low to bright (250-2000 Lux)",
        "oxygenLevel": "30 L/day",
        "medicinalValues": ["Air purification", "Minor wound healing"],
        "advantages": ["Produces Oxygen at Night", "Hard to kill"],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-25 Years"
    },
    {
        "id": "mock_2",
        "name": "Spider Plant",
        "scientificName": "Chlorophytum comosum",
        "description": "The Spider Plant is a user-friendly indoor plant. It brings pet safe to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 13,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "Partial Shade (500-1500 Lux)",
        "oxygenLevel": "25 L/day",
        "medicinalValues": ["Air cleaning", "Non-toxic"],
        "advantages": ["Pet safe", "Easy propagation"],
        "price": 25,
        "type": "indoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_3",
        "name": "Peace Lily",
        "scientificName": "Spathiphyllum wallisii",
        "description": "The Peace Lily is a user-friendly indoor plant. It brings visual watering signal to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 55,
        "sunlight": "Shade (250-1000 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": ["Removes ammonia", "Air purifying"],
        "advantages": ["Visual watering signal", "blooms in shade"],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_4",
        "name": "Aloe Vera",
        "scientificName": "Aloe barbadensis",
        "description": "The Aloe Vera is a user-friendly indoor plant. It brings medicinal gel to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 13,
        "idealTempMax": 35,
        "minHumidity": 20,
        "sunlight": "Bright direct (2000+ Lux)",
        "oxygenLevel": "28 L/day",
        "medicinalValues": ["Burns healing", "Skin hydration"],
        "advantages": ["Medicinal gel", "Succulent"],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-20 Years"
    },
    {
        "id": "mock_5",
        "name": "Pothos",
        "scientificName": "Epipremnum aureum",
        "description": "The Pothos is a user-friendly indoor plant. It brings fast growing vine to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to bright (250-1500 Lux)",
        "oxygenLevel": "22 L/day",
        "medicinalValues": ["Formaldehyde removal"],
        "advantages": ["Fast growing vine", "Low maintenance"],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_6",
        "name": "Rubber Plant",
        "scientificName": "Ficus elastica",
        "description": "The Rubber Plant is a user-friendly indoor plant. It brings glossy large leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "Bright indirect (1000-2000 Lux)",
        "oxygenLevel": "45 L/day",
        "medicinalValues": ["Anti-inflammatory properties"],
        "advantages": ["Glossy large leaves", "Statement piece"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-25 Years"
    },
    {
        "id": "mock_7",
        "name": "Monstera",
        "scientificName": "Monstera deliciosa",
        "description": "The Monstera is a user-friendly indoor plant. It brings iconic split leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "Bright indirect (1000-2500 Lux)",
        "oxygenLevel": "50 L/day",
        "medicinalValues": ["Root used for snakebites (traditional)"],
        "advantages": ["Iconic split leaves", "Tropical vibe"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_8",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "The ZZ Plant is a user-friendly indoor plant. It brings thrives in darkness to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 30,
        "sunlight": "Low (100-1000 Lux)",
        "oxygenLevel": "18 L/day",
        "medicinalValues": ["Air purification"],
        "advantages": ["Thrives in darkness", "Drought tolerant"],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_9",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "The Boston Fern is a user-friendly indoor plant. It brings lush foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 24,
        "minHumidity": 65,
        "sunlight": "Bright indirect (1000-1500 Lux)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": ["Natural humidifier"],
        "advantages": ["Lush foliage", "Pet safe"],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_10",
        "name": "English Ivy",
        "scientificName": "Hedera helix",
        "description": "The English Ivy is a user-friendly indoor plant. It brings climbing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 21,
        "minHumidity": 45,
        "sunlight": "Medium (500-1500 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": ["Cough relief (extract)"],
        "advantages": ["Climbing", "Mold reduction"],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_11",
        "name": "Areca Palm",
        "scientificName": "Dypsis lutescens",
        "description": "The Areca Palm is a user-friendly indoor plant. It brings pet safe to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 24,
        "minHumidity": 55,
        "sunlight": "Bright filtered (1500-2500 Lux)",
        "oxygenLevel": "60 L/day",
        "medicinalValues": ["Toxin removal"],
        "advantages": ["Pet safe", "Tropical look"],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_12",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "The Fiddle Leaf Fig is a user-friendly indoor plant. It brings architectural shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 24,
        "minHumidity": 60,
        "sunlight": "Bright indirect (1500-3000 Lux)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": ["Air cleaning"],
        "advantages": ["Architectural shape", "Huge leaves"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "25-50 Years"
    },
    {
        "id": "mock_13",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "The Jade Plant is a user-friendly indoor plant. It brings symbol of luck to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 13,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "Direct Sun (3000+ Lux)",
        "oxygenLevel": "15 L/day",
        "medicinalValues": ["Wart removal (folk)"],
        "advantages": ["Symbol of luck", "Long lived"],
        "price": 25,
        "type": "indoor",
        "lifespan": "50-70 Years"
    },
    {
        "id": "mock_14",
        "name": "Chinese Money Plant",
        "scientificName": "Pilea peperomioides",
        "description": "The Chinese Money Plant is a user-friendly indoor plant. It brings unique round leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 24,
        "minHumidity": 50,
        "sunlight": "Bright indirect (1000 Lux)",
        "oxygenLevel": "18 L/day",
        "medicinalValues": ["Traditional TCM uses"],
        "advantages": ["Unique round leaves", "Easy to gift"],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_15",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia reginae",
        "description": "The Bird of Paradise is a user-friendly indoor plant. It brings exotic flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "High/Direct (3000+ Lux)",
        "oxygenLevel": "55 L/day",
        "medicinalValues": ["None suitable for home use"],
        "advantages": ["Exotic flowers", "Large leaves"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_16",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "The Dumb Cane is a user-friendly indoor plant. It brings beautiful patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "Low to Medium (500-1500 Lux)",
        "oxygenLevel": "30 L/day",
        "medicinalValues": ["None (Toxic)"],
        "advantages": ["Beautiful patterns", "Full foliage"],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_17",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "The Prayer Plant is a user-friendly indoor plant. It brings leaves move at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "Low/Shade (500 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": ["None"],
        "advantages": ["Leaves move at night", "Colorful veins"],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_18",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "The String of Pearls is a user-friendly indoor plant. It brings unique bead shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 13,
        "idealTempMax": 24,
        "minHumidity": 40,
        "sunlight": "Bright indirect (2000 Lux)",
        "oxygenLevel": "12 L/day",
        "medicinalValues": ["None"],
        "advantages": ["Unique bead shape", "Hanging visual"],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_19",
        "name": "Philodendron",
        "scientificName": "Philodendron hederaceum",
        "description": "The Philodendron is a user-friendly indoor plant. It brings heart shaped leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "Low to bright (250-1500 Lux)",
        "oxygenLevel": "25 L/day",
        "medicinalValues": ["Air cleaning"],
        "advantages": ["Heart shaped leaves", "Very hardy"],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_20",
        "name": "Anthurium",
        "scientificName": "Anthurium andraeanum",
        "description": "The Anthurium is a user-friendly indoor plant. It brings long lasting flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "Bright indirect (1500 Lux)",
        "oxygenLevel": "22 L/day",
        "medicinalValues": ["Air purification"],
        "advantages": ["Long lasting flowers", "Waxy look"],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_21",
        "name": "Lavender",
        "scientificName": "Lavandula angustifolia",
        "description": "The Lavender is a user-friendly outdoor plant. It brings fragrant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 24,
        "minHumidity": 30,
        "sunlight": "Full Sun (10,000+ Lux)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": ["Sleep aid", "Anxiety relief"],
        "advantages": ["Fragrant", "Attracts bees"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_22",
        "name": "Sunflower",
        "scientificName": "Helianthus annuus",
        "description": "The Sunflower is a user-friendly outdoor plant. It brings fast growth to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 20,
        "idealTempMax": 33,
        "minHumidity": 40,
        "sunlight": "Full Sun (10,000+ Lux)",
        "oxygenLevel": "60 L/day",
        "medicinalValues": ["seeds rich in Vitamin E"],
        "advantages": ["Fast growth", "Edible seeds"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_23",
        "name": "Rose",
        "scientificName": "Rosa",
        "description": "The Rose is a user-friendly outdoor plant. It brings classic beauty to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "Full Sun (6+ hours)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": ["Rose hips (Vitamin C)", "Skin toner"],
        "advantages": ["Classic beauty", "Fragrance"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-20 Years"
    },
    {
        "id": "mock_24",
        "name": "Marigold",
        "scientificName": "Tagetes",
        "description": "The Marigold is a user-friendly outdoor plant. It brings pest repellent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": ["Antiseptic", "Anti-inflammatory"],
        "advantages": ["Pest repellent", "Vibrant color"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_25",
        "name": "Basil",
        "scientificName": "Ocimum basilicum",
        "description": "The Basil is a user-friendly outdoor plant. It brings culinary herb to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": ["Digestion aid", "Anti-bacterial"],
        "advantages": ["Culinary herb", "Aromatic"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_26",
        "name": "Mint",
        "scientificName": "Mentha",
        "description": "The Mint is a user-friendly outdoor plant. It brings fast growing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 13,
        "idealTempMax": 24,
        "minHumidity": 60,
        "sunlight": "Partial Shade to Sun",
        "oxygenLevel": "22 L/day",
        "medicinalValues": ["Stomach relief", "Headache relief"],
        "advantages": ["Fast growing", "Tea ingredient"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_27",
        "name": "Rosemary",
        "scientificName": "Salvia rosmarinus",
        "description": "The Rosemary is a user-friendly outdoor plant. It brings evergreen shrub to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 30,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": ["Memory boost", "Hair growth"],
        "advantages": ["Evergreen shrub", "Culinary use"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-20 Years"
    },
    {
        "id": "mock_28",
        "name": "Tulip",
        "scientificName": "Tulipa",
        "description": "The Tulip is a user-friendly outdoor plant. It brings spring blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Skin poultice (traditional)"
        ],
        "advantages": [
            "Spring blooms",
            "Infinite colors"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_29",
        "name": "Daffodil",
        "scientificName": "Narcissus",
        "description": "The Daffodil is a user-friendly outdoor plant. It brings early spring color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None (Toxic bulb)"
        ],
        "advantages": [
            "Early spring color",
            "Deer resistant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_30",
        "name": "Hydrangea",
        "scientificName": "Hydrangea macrophylla",
        "description": "The Hydrangea is a user-friendly outdoor plant. It brings massive flower heads to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Morning Sun / Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Diuretic (root)"
        ],
        "advantages": [
            "Massive flower heads",
            "Color changes with pH"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_31",
        "name": "Peony",
        "scientificName": "Paeonia",
        "description": "The Peony is a user-friendly outdoor plant. It brings huge blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "38 L/day",
        "medicinalValues": [
            "Muscle relaxant (white peony)"
        ],
        "advantages": [
            "Huge blooms",
            "Long lifespan"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_32",
        "name": "Chrysanthemum",
        "scientificName": "Chrysanthemum",
        "description": "The Chrysanthemum is a user-friendly outdoor plant. It brings fall blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Tea for cooling",
            "Eye health"
        ],
        "advantages": [
            "Fall blooms",
            "Pest repellent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_33",
        "name": "Geranium",
        "scientificName": "Pelargonium",
        "description": "The Geranium is a user-friendly outdoor plant. It brings mosquito repellent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Skin healing oil"
        ],
        "advantages": [
            "Mosquito repellent",
            "Container friendly"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1-3 Years"
    },
    {
        "id": "mock_34",
        "name": "Hibiscus",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "The Hibiscus is a user-friendly outdoor plant. It brings tropical flair to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Lower blood pressure (tea)"
        ],
        "advantages": [
            "Tropical flair",
            "Edible flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_35",
        "name": "Jasmine",
        "scientificName": "Jasminum",
        "description": "The Jasmine is a user-friendly outdoor plant. It brings intense fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun to Part Shade",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Stress relief aroma"
        ],
        "advantages": [
            "Intense fragrance",
            "Climbing vine"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_36",
        "name": "Azalea",
        "scientificName": "Rhododendron",
        "description": "The Azalea is a user-friendly outdoor plant. It brings shade tolerant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 21,
        "minHumidity": 50,
        "sunlight": "Shade / Dappled Light",
        "oxygenLevel": "35 L/day",
        "medicinalValues": ["None (Toxic)"],
        "advantages": ["Shade tolerant", "Spring spectacle"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_37",
        "name": "Magnolia",
        "scientificName": "Magnolia grandiflora",
        "description": "The Magnolia is a user-friendly outdoor plant. It brings grand southern tree to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": ["Anxiety relief", "Weight loss aid"],
        "advantages": ["Grand Southern tree", "Glossy leaves"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "80+ Years"
    },
    {
        "id": "mock_38",
        "name": "Lilac",
        "scientificName": "Syringa vulgaris",
        "description": "The Lilac is a user-friendly outdoor plant. It brings nostalgic scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 7,
        "idealTempMax": 24,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": ["Aromatherapy"],
        "advantages": ["Nostalgic scent", "Cold hardy"],
        "price": 25,
        "type": "outdoor",
        "lifespan": "75+ Years"
    },
    {
        "id": "mock_39",
        "name": "Boxwood",
        "scientificName": "Buxus",
        "description": "The Boxwood is a user-friendly outdoor plant. It brings formal hedges to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun or Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Fever reducer (historic, risky)"
        ],
        "advantages": [
            "Formal hedges",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-30 Years"
    },
    {
        "id": "mock_40",
        "name": "Pansy",
        "scientificName": "Viola tricolor",
        "description": "The Pansy is a user-friendly outdoor plant. It brings winter/spring color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun / Part Shade",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "Expectorant"
        ],
        "advantages": [
            "Winter/Spring color",
            "Edible flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2 Years"
    },
    {
        "id": "mock_41",
        "name": "Tulsi (Holy Basil)",
        "scientificName": "Ocimum tenuiflorum",
        "description": "The Tulsi (Holy Basil) is a user-friendly indoor plant. It brings sacred plant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Spot (1000+ Lux)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Immunity booster",
            "Stress relief"
        ],
        "advantages": [
            "Sacred plant",
            "Medicinal"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1-3 Years"
    },
    {
        "id": "mock_42",
        "name": "Curry Leaf (Potted)",
        "scientificName": "Murraya koenigii",
        "description": "The Curry Leaf (Potted) is a user-friendly indoor plant. It brings aromatic cooking to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sunny Window (2000 Lux)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Digestion aid",
            "Hair health"
        ],
        "advantages": [
            "Aromatic cooking",
            "Pest repellent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_43",
        "name": "Bamboo Palm",
        "scientificName": "Chamaedorea seifrizii",
        "description": "The Bamboo Palm is a user-friendly indoor plant. It brings pet friendly to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect (500-1500 Lux)",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Air toxin removal"
        ],
        "advantages": [
            "Pet friendly",
            "Tropical vibe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_44",
        "name": "Lady Palm",
        "scientificName": "Rhapis excelsa",
        "description": "The Lady Palm is a user-friendly indoor plant. It brings elegant fans to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium (300-1000 Lux)",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Elegant fans",
            "Slow growing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_45",
        "name": "Aglaonema (Chinese Evergreen)",
        "scientificName": "Aglaonema commutatum",
        "description": "The Aglaonema (Chinese Evergreen) is a user-friendly indoor plant. It brings colorful leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low (200-800 Lux)",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Colorful leaves",
            "Hardy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_46",
        "name": "Arrowhead Plant",
        "scientificName": "Syngonium podophyllum",
        "description": "The Arrowhead Plant is a user-friendly indoor plant. It brings fast grower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium (500-1500 Lux)",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Fast grower",
            "Changing leaf shape"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_47",
        "name": "Dragon Tree",
        "scientificName": "Dracaena marginata",
        "description": "The Dragon Tree is a user-friendly indoor plant. It brings modern look to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium-Bright (800-2000 Lux)",
        "oxygenLevel": "32 L/day",
        "medicinalValues": [
            "Formaldehyde removal"
        ],
        "advantages": [
            "Modern look",
            "Slim profile"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-20 Years"
    },
    {
        "id": "mock_48",
        "name": "Corn Plant",
        "scientificName": "Dracaena fragrans",
        "description": "The Corn Plant is a user-friendly indoor plant. It brings thick trunk to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Toxin removal"
        ],
        "advantages": [
            "Thick trunk",
            "Fragrant flowers (rare)"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_49",
        "name": "Song of India",
        "scientificName": "Dracaena reflexa",
        "description": "The Song of India is a user-friendly indoor plant. It brings ornamental to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Ornamental",
            "Flexible stems"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_50",
        "name": "Lucky Bamboo",
        "scientificName": "Dracaena sanderiana",
        "description": "The Lucky Bamboo is a user-friendly indoor plant. It brings grows in water to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low (100-1000 Lux)",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Grows in water",
            "Feng Shui luck"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_51",
        "name": "Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "The Croton is a user-friendly indoor plant. It brings vibrant colors to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "High (Bright Window)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Purgative (Toxic usage)"
        ],
        "advantages": [
            "Vibrant colors",
            "Bushy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_52",
        "name": "Coleus",
        "scientificName": "Plectranthus scutellarioides",
        "description": "The Coleus is a user-friendly indoor plant. It brings leaf patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Ayurvedic uses"
        ],
        "advantages": [
            "Leaf patterns",
            "Fast growth"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_53",
        "name": "Weeping Fig",
        "scientificName": "Ficus benjamina",
        "description": "The Weeping Fig is a user-friendly indoor plant. It brings tree-like to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Antimicrobial"
        ],
        "advantages": [
            "Tree-like",
            "Braided trunks"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_54",
        "name": "Satin Pothos",
        "scientificName": "Scindapsus pictus",
        "description": "The Satin Pothos is a user-friendly indoor plant. It brings silver spots to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Silver spots",
            "Velvety"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_55",
        "name": "Philodendron Birkin",
        "scientificName": "Philodendron 'Birkin'",
        "description": "The Philodendron Birkin is a user-friendly indoor plant. It brings white pinstripes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "White pinstripes",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_56",
        "name": "Philodendron Xanadu",
        "scientificName": "Thaumatophyllum xanadu",
        "description": "The Philodendron Xanadu is a user-friendly indoor plant. It brings bushy habit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium-Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Bushy habit",
            "Lobed leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "15+ Years"
    },
    {
        "id": "mock_57",
        "name": "Pink Princess",
        "scientificName": "Philodendron erubescens",
        "description": "The Pink Princess is a user-friendly indoor plant. It brings rare pink variegation to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Rare pink variegation",
            "Collector item"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_58",
        "name": "Monstera Adansonii",
        "scientificName": "Monstera adansonii",
        "description": "The Monstera Adansonii is a user-friendly indoor plant. It brings swiss cheese holes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium-Bright",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Swiss cheese holes",
            "Vining"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_59",
        "name": "Mini Monstera",
        "scientificName": "Rhaphidophora tetrasperma",
        "description": "The Mini Monstera is a user-friendly indoor plant. It brings fast climbing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast climbing",
            "Small space split-leaf"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_60",
        "name": "Begonia Rex",
        "scientificName": "Begonia rex-cultorum",
        "description": "The Begonia Rex is a user-friendly indoor plant. It brings metallic foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium-Shade",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Metallic foliage",
            "Dramatic colors"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_61",
        "name": "Polka Dot Begonia",
        "scientificName": "Begonia maculata",
        "description": "The Polka Dot Begonia is a user-friendly indoor plant. It brings silver dots to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Silver dots",
            "Red undersides"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_62",
        "name": "Nerve Plant",
        "scientificName": "Fittonia albivenis",
        "description": "The Nerve Plant is a user-friendly indoor plant. It brings neon veins to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Neon veins",
            "Terrarium suitability"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-3 Years"
    },
    {
        "id": "mock_63",
        "name": "Polka Dot Plant",
        "scientificName": "Hypoestes phyllostachya",
        "description": "The Polka Dot Plant is a user-friendly indoor plant. It brings splashed patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Splashed patterns",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "1-2 Years"
    },
    {
        "id": "mock_64",
        "name": "Baby Rubber Plant",
        "scientificName": "Peperomia obtusifolia",
        "description": "The Baby Rubber Plant is a user-friendly indoor plant. It brings succulent-like to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Succulent-like",
            "Pet friendly"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_65",
        "name": "Watermelon Peperomia",
        "scientificName": "Peperomia argyreia",
        "description": "The Watermelon Peperomia is a user-friendly indoor plant. It brings leaves look like watermelon to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Leaves look like watermelon",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_66",
        "name": "String of Turtles",
        "scientificName": "Peperomia prostrata",
        "description": "The String of Turtles is a user-friendly indoor plant. It brings turtle shell patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Turtle shell patterns",
            "Tiny trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_67",
        "name": "String of Hearts",
        "scientificName": "Ceropegia woodii",
        "description": "The String of Hearts is a user-friendly indoor plant. It brings heart leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Heart leaves",
            "Trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_68",
        "name": "Wandering Jew",
        "scientificName": "Tradescantia zebrina",
        "description": "The Wandering Jew is a user-friendly indoor plant. It brings purple-silver leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Antioxidant (tea)"
        ],
        "advantages": [
            "Purple-Silver leaves",
            "Fast growing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_69",
        "name": "Purple Heart",
        "scientificName": "Tradescantia pallida",
        "description": "The Purple Heart is a user-friendly indoor plant. It brings deep purple foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "High Light",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Deep purple foliage",
            "Very hardy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_70",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "The Cast Iron Plant is a user-friendly indoor plant. It brings investructible to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Deep Shade",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Investructible",
            "Deep shade"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_71",
        "name": "Asparagus Fern",
        "scientificName": "Asparagus setaceus",
        "description": "The Asparagus Fern is a user-friendly indoor plant. It brings lacy texture to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Lacy texture",
            "Airy feel"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_72",
        "name": "Foxtail Fern",
        "scientificName": "Asparagus densiflorus",
        "description": "The Foxtail Fern is a user-friendly indoor plant. It brings plume-like stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Plume-like stems",
            "Hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_73",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "The Parlor Palm is a user-friendly indoor plant. It brings pet friendly to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low Light",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Pet friendly",
            "Compact palm"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_74",
        "name": "Fishtail Palm",
        "scientificName": "Caryota mitis",
        "description": "The Fishtail Palm is a user-friendly indoor plant. It brings unique leaf shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique leaf shape",
            "Tall"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_75",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "The Ponytail Palm is a user-friendly indoor plant. It brings bulbous trunk to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bulbous trunk",
            "Drought tolerant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_76",
        "name": "Sago Palm",
        "scientificName": "Cycas revoluta",
        "description": "The Sago Palm is a user-friendly indoor plant. It brings prehistoric look to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Toxic (Do not use)"
        ],
        "advantages": [
            "Prehistoric look",
            "Symmetrical"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_77",
        "name": "Yucca Cane",
        "scientificName": "Yucca elephantipes",
        "description": "The Yucca Cane is a user-friendly indoor plant. It brings architectural to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Architectural",
            "Tough"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_78",
        "name": "Zebra Plant",
        "scientificName": "Aphelandra squarrosa",
        "description": "The Zebra Plant is a user-friendly indoor plant. It brings striped leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Striped leaves",
            "Yellow flowers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_79",
        "name": "Calathea Roseopicta",
        "scientificName": "Goeppertia roseopicta",
        "description": "The Calathea Roseopicta is a user-friendly indoor plant. It brings painted foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium (No Direct)",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Painted foliage",
            "Sleep movement"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_80",
        "name": "Rattlesnake Plant",
        "scientificName": "Goeppertia insignis",
        "description": "The Rattlesnake Plant is a user-friendly indoor plant. It brings wavy leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Wavy leaves",
            "Patterned"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_81",
        "name": "Stromanthe Triostar",
        "scientificName": "Stromanthe sanguinea",
        "description": "The Stromanthe Triostar is a user-friendly indoor plant. It brings pink/green/white to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pink/Green/White",
            "Dramatic"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_82",
        "name": "Money Tree",
        "scientificName": "Pachira aquatica",
        "description": "The Money Tree is a user-friendly indoor plant. It brings braided trunk to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Edible nuts (rarely indoors)"
        ],
        "advantages": [
            "Braided trunk",
            "Good luck"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_83",
        "name": "Elephant Ear",
        "scientificName": "Colocasia esculenta",
        "description": "The Elephant Ear is a user-friendly indoor plant. It brings giant leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Edible tuber"
        ],
        "advantages": [
            "Giant leaves",
            "Tropical"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_84",
        "name": "Sweetheart Hoya",
        "scientificName": "Hoya kerrii",
        "description": "The Sweetheart Hoya is a user-friendly indoor plant. It brings heart shaped leaf to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Heart shaped leaf",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_85",
        "name": "Wax Plant",
        "scientificName": "Hoya carnosa",
        "description": "The Wax Plant is a user-friendly indoor plant. It brings fragrant porcelain flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fragrant porcelain flowers",
            "Vining"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_86",
        "name": "African Violet",
        "scientificName": "Saintpaulia ionantha",
        "description": "The African Violet is a user-friendly indoor plant. It brings continuous blooming to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "East Window",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Continuous blooming",
            "Fuzzy leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_87",
        "name": "Kalanchoe",
        "scientificName": "Kalanchoe blossfeldiana",
        "description": "The Kalanchoe is a user-friendly indoor plant. It brings bright flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sunny Window",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bright flowers",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-7 Years"
    },
    {
        "id": "mock_88",
        "name": "Crown of Thorns",
        "scientificName": "Euphorbia milii",
        "description": "The Crown of Thorns is a user-friendly indoor plant. It brings blooms year round to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None (Sap toxic)"
        ],
        "advantages": [
            "Blooms year round",
            "Tough"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_89",
        "name": "Pencil Cactus",
        "scientificName": "Euphorbia tirucalli",
        "description": "The Pencil Cactus is a user-friendly indoor plant. It brings unique stick shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Traditional fracture healing"
        ],
        "advantages": [
            "Unique stick shape",
            "Fast growing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_90",
        "name": "Neem",
        "scientificName": "Azadirachta indica",
        "description": "The Neem is a user-friendly outdoor plant. It brings miracle tree to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "Antiseptic",
            "Skin cure"
        ],
        "advantages": [
            "Miracle tree",
            "Air cooling"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_91",
        "name": "Ashoka Tree",
        "scientificName": "Saraca asoca",
        "description": "The Ashoka Tree is a user-friendly outdoor plant. It brings sacred tree to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun / Part Shade",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "Gynaecological health"
        ],
        "advantages": [
            "Sacred tree",
            "Beautiful flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_92",
        "name": "Gulmohar (Flame of Forest)",
        "scientificName": "Delonix regia",
        "description": "The Gulmohar (Flame of Forest) is a user-friendly outdoor plant. It brings stunning red canopy to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "180 L/day",
        "medicinalValues": [
            "Gum used for pain"
        ],
        "advantages": [
            "Stunning red canopy",
            "Shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40-60 Years"
    },
    {
        "id": "mock_93",
        "name": "Peepal (Bodhi Tree)",
        "scientificName": "Ficus religiosa",
        "description": "The Peepal (Bodhi Tree) is a user-friendly outdoor plant. It brings produces o2 24/7 (myth/high output) to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "Asthma",
            "Diabetes trade"
        ],
        "advantages": [
            "Produces O2 24/7 (myth/high output)",
            "Sacred"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000+ Years"
    },
    {
        "id": "mock_94",
        "name": "Banyan",
        "scientificName": "Ficus benghalensis",
        "description": "The Banyan is a user-friendly outdoor plant. It brings national tree of india to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "220 L/day",
        "medicinalValues": [
            "Hair tonic",
            "Teeth care"
        ],
        "advantages": [
            "National Tree of India",
            "Huge shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "200+ Years"
    },
    {
        "id": "mock_95",
        "name": "Mango",
        "scientificName": "Mangifera indica",
        "description": "The Mango is a user-friendly outdoor plant. It brings king of fruits to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "140 L/day",
        "medicinalValues": [
            "Leaves regulate insulin"
        ],
        "advantages": [
            "King of Fruits",
            "Dense shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_96",
        "name": "Guava",
        "scientificName": "Psidium guajava",
        "description": "The Guava is a user-friendly outdoor plant. It brings vitamin c rich fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "Stomach health"
        ],
        "advantages": [
            "Vitamin C rich fruit",
            "Hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30-40 Years"
    },
    {
        "id": "mock_97",
        "name": "Pomegranate",
        "scientificName": "Punica granatum",
        "description": "The Pomegranate is a user-friendly outdoor plant. It brings beautiful flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Heart health",
            "Antioxidant"
        ],
        "advantages": [
            "Beautiful flowers",
            "Healthy fruit"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-30 Years"
    },
    {
        "id": "mock_98",
        "name": "Lemon",
        "scientificName": "Citrus limon",
        "description": "The Lemon is a user-friendly outdoor plant. It brings daily kitchen use to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Vitamin C",
            "Digestion"
        ],
        "advantages": [
            "Daily kitchen use",
            "Fragrant leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_99",
        "name": "Papaya",
        "scientificName": "Carica papaya",
        "description": "The Papaya is a user-friendly outdoor plant. It brings fast fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Leaf juice for Dengue"
        ],
        "advantages": [
            "Fast fruit",
            "Digestive enzyme"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-4 Years"
    },
    {
        "id": "mock_100",
        "name": "Banana",
        "scientificName": "Musa acominata",
        "description": "The Banana is a user-friendly outdoor plant. It brings fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "Stem juice for kidney stones"
        ],
        "advantages": [
            "Fruit",
            "Leaves as plates"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1-2 Years (Regrows)"
    },
    {
        "id": "mock_101",
        "name": "Coconut",
        "scientificName": "Cocos nucifera",
        "description": "The Coconut is a user-friendly outdoor plant. It brings kalpavriksha (gives everything) to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "120 L/day",
        "medicinalValues": [
            "Water is electrolyte rich"
        ],
        "advantages": [
            "Kalpavriksha (Gives everything)",
            "Coastal"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "60-80 Years"
    },
    {
        "id": "mock_102",
        "name": "Champa (Plumeria)",
        "scientificName": "Plumeria rubra",
        "description": "The Champa (Plumeria) is a user-friendly outdoor plant. It brings temple flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Rheumatism (Bark)"
        ],
        "advantages": [
            "Temple flower",
            "Divine scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_103",
        "name": "Parijat (Night Jasmine)",
        "scientificName": "Nyctanthes arbor-tristis",
        "description": "The Parijat (Night Jasmine) is a user-friendly outdoor plant. It brings night fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Sciatica",
            "Arthritis"
        ],
        "advantages": [
            "Night fragrance",
            "Carpet of flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_104",
        "name": "Raat Ki Rani",
        "scientificName": "Cestrum nocturnum",
        "description": "The Raat Ki Rani is a user-friendly outdoor plant. It brings extreme fragrance at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Extreme fragrance at night",
            "Fast growth"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_105",
        "name": "Mogra (Arabian Jasmine)",
        "scientificName": "Jasminum sambac",
        "description": "The Mogra (Arabian Jasmine) is a user-friendly outdoor plant. It brings perfume to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Cooling effect",
            "Eye wash"
        ],
        "advantages": [
            "Perfume",
            "Garlands"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_106",
        "name": "Vinca (Sadabahar)",
        "scientificName": "Catharanthus roseus",
        "description": "The Vinca (Sadabahar) is a user-friendly outdoor plant. It brings blooms daily to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Cancer fighting alkaloids",
            "Diabetes"
        ],
        "advantages": [
            "Blooms daily",
            "Drought resistant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_107",
        "name": "Oleander (Kaner)",
        "scientificName": "Nerium oleander",
        "description": "The Oleander (Kaner) is a user-friendly outdoor plant. It brings roadside hardy to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Toxic (used carefully in cardiac meds)"
        ],
        "advantages": [
            "Roadside hardy",
            "Colorful"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_108",
        "name": "Bougainvillea",
        "scientificName": "Bougainvillea spectabilis",
        "description": "The Bougainvillea is a user-friendly outdoor plant. It brings paper flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Cough syrup"
        ],
        "advantages": [
            "Paper flowers",
            "Security hedge"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_109",
        "name": "Rangoon Creeper",
        "scientificName": "Combretum indicum",
        "description": "The Rangoon Creeper is a user-friendly outdoor plant. It brings fragrant color changing flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Parasite worms"
        ],
        "advantages": [
            "Fragrant color changing flowers",
            "Vine"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_110",
        "name": "Aparajita (Butterfly Pea)",
        "scientificName": "Clitoria ternatea",
        "description": "The Aparajita (Butterfly Pea) is a user-friendly outdoor plant. It brings nitrogen fixer to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Memory booster",
            "Blue tea"
        ],
        "advantages": [
            "Nitrogen fixer",
            "Holy flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_111",
        "name": "Ixora (Rugmini)",
        "scientificName": "Ixora coccinea",
        "description": "The Ixora (Rugmini) is a user-friendly outdoor plant. It brings hedge plant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Root for fever"
        ],
        "advantages": [
            "Hedge plant",
            "Neon flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_112",
        "name": "Red Hibiscus",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "The Red Hibiscus is a user-friendly outdoor plant. It brings offering to ganesha to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Hair oil",
            "Tea"
        ],
        "advantages": [
            "Offering to Ganesha",
            "Edible"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15 Years"
    },
    {
        "id": "mock_113",
        "name": "Allamanda",
        "scientificName": "Allamanda cathartica",
        "description": "The Allamanda is a user-friendly outdoor plant. It brings large yellow bells to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Laxative (Toxic)"
        ],
        "advantages": [
            "Large yellow bells",
            "Climber"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_114",
        "name": "Tecoma (Yellow Bells)",
        "scientificName": "Tecoma stans",
        "description": "The Tecoma (Yellow Bells) is a user-friendly outdoor plant. It brings attracts bees to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Diabetes control"
        ],
        "advantages": [
            "Attracts bees",
            "Year round bloom"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_115",
        "name": "Rajnigandha (Tuberose)",
        "scientificName": "Polianthes tuberosa",
        "description": "The Rajnigandha (Tuberose) is a user-friendly outdoor plant. It brings best fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Calming"
        ],
        "advantages": [
            "Best fragrance",
            "Cut flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_116",
        "name": "Canna Lily",
        "scientificName": "Canna indica",
        "description": "The Canna Lily is a user-friendly outdoor plant. It brings tropical foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Root starch"
        ],
        "advantages": [
            "Tropical foliage",
            "Tall"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_117",
        "name": "Spider Lily",
        "scientificName": "Hymenocallis littoralis",
        "description": "The Spider Lily is a user-friendly outdoor plant. It brings unique white spidery flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Wound healing"
        ],
        "advantages": [
            "Unique white spidery flowers",
            "Rain lover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_118",
        "name": "Rain Lily",
        "scientificName": "Zephyranthes",
        "description": "The Rain Lily is a user-friendly outdoor plant. It brings blooms after rain to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Blooms after rain",
            "Ground cover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_119",
        "name": "Curtain Creeper",
        "scientificName": "Vernonia elaeagnifolia",
        "description": "The Curtain Creeper is a user-friendly outdoor plant. It brings natural screen to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Natural screen",
            "Privacy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_120",
        "name": "Passion Flower (Krishna Kamal)",
        "scientificName": "Passiflora incarnata",
        "description": "The Passion Flower (Krishna Kamal) is a user-friendly outdoor plant. It brings complex flower structure to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Insomnia",
            "Anxiety"
        ],
        "advantages": [
            "Complex flower structure",
            "Mythology"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5-7 Years"
    },
    {
        "id": "mock_121",
        "name": "Duranta (Golden Dewdrop)",
        "scientificName": "Duranta erecta",
        "description": "The Duranta (Golden Dewdrop) is a user-friendly outdoor plant. It brings gold foliage hedge to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Gold foliage hedge",
            "Blue flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15 Years"
    },
    {
        "id": "mock_122",
        "name": "Lantana",
        "scientificName": "Lantana camara",
        "description": "The Lantana is a user-friendly outdoor plant. It brings butterfly magnet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Antiseptic (Traditional)"
        ],
        "advantages": [
            "Butterfly magnet",
            "Hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_123",
        "name": "Portulaca (9 O'Clock)",
        "scientificName": "Portulaca grandiflora",
        "description": "The Portulaca (9 O'Clock) is a user-friendly outdoor plant. It brings colorful carpet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Burns"
        ],
        "advantages": [
            "Colorful carpet",
            "Succulent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_124",
        "name": "Balsam",
        "scientificName": "Impatiens balsamina",
        "description": "The Balsam is a user-friendly outdoor plant. It brings traditional playing flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "Cooling burns"
        ],
        "advantages": [
            "Traditional playing flower",
            "Self seeding"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_125",
        "name": "Gomphrena",
        "scientificName": "Gomphrena globosa",
        "description": "The Gomphrena is a user-friendly outdoor plant. It brings button flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Cough"
        ],
        "advantages": [
            "Button flowers",
            "Long lasting"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_126",
        "name": "Cockscomb",
        "scientificName": "Celosia argentea",
        "description": "The Cockscomb is a user-friendly outdoor plant. It brings velvet texture to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Mouth sores"
        ],
        "advantages": [
            "Velvet texture",
            "Unique shape"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_127",
        "name": "Kochia",
        "scientificName": "Bassia scoparia",
        "description": "The Kochia is a user-friendly outdoor plant. It brings foliage ball to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Foliage ball",
            "Green to Red"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_128",
        "name": "Morning Glory",
        "scientificName": "Ipomoea purpurea",
        "description": "The Morning Glory is a user-friendly outdoor plant. It brings fast climber to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Laxative (seeds toxic)"
        ],
        "advantages": [
            "Fast climber",
            "Morning blooms"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_129",
        "name": "Cypress Vine",
        "scientificName": "Ipomoea quamoclit",
        "description": "The Cypress Vine is a user-friendly outdoor plant. It brings star flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Cooling"
        ],
        "advantages": [
            "Star flowers",
            "Feathery leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_130",
        "name": "Bleeding Heart Vine",
        "scientificName": "Clerodendrum thomsoniae",
        "description": "The Bleeding Heart Vine is a user-friendly outdoor plant. It brings bicolor flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bicolor flowers",
            "Shade climber"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_131",
        "name": "Bottle Brush",
        "scientificName": "Callistemon",
        "description": "The Bottle Brush is a user-friendly outdoor plant. It brings unique red bristles to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Antimicrobial"
        ],
        "advantages": [
            "Unique red bristles",
            "Bird attractor"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_132",
        "name": "Indian Almond",
        "scientificName": "Terminalia catappa",
        "description": "The Indian Almond is a user-friendly outdoor plant. It brings shade to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "Leaf for fish tank",
            "Astringent"
        ],
        "advantages": [
            "Shade",
            "Fall colors in tropics"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "60+ Years"
    },
    {
        "id": "mock_133",
        "name": "Jackfruit",
        "scientificName": "Artocarpus heterophyllus",
        "description": "The Jackfruit is a user-friendly outdoor plant. It brings largest fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "180 L/day",
        "medicinalValues": [
            "Leaves for diabetes"
        ],
        "advantages": [
            "Largest fruit",
            "Timber"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_134",
        "name": "Amaltas (Golden Shower)",
        "scientificName": "Cassia fistula",
        "description": "The Amaltas (Golden Shower) is a user-friendly outdoor plant. It brings yellow rain flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "Laxative (Fruit pulp)"
        ],
        "advantages": [
            "Yellow rain flowers",
            "Ornamental"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_135",
        "name": "Pride of India",
        "scientificName": "Lagerstroemia speciosa",
        "description": "The Pride of India is a user-friendly outdoor plant. It brings purple finish to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "85 L/day",
        "medicinalValues": [
            "Diabetes tea"
        ],
        "advantages": [
            "Purple finish",
            "Roadside beauty"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_136",
        "name": "Sitaphal (Custard Apple)",
        "scientificName": "Annona squamosa",
        "description": "The Sitaphal (Custard Apple) is a user-friendly outdoor plant. It brings tasty fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Leaves antimicrobial"
        ],
        "advantages": [
            "Tasty fruit",
            "Small tree"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_137",
        "name": "Chiku (Sapodilla)",
        "scientificName": "Manilkara zapota",
        "description": "The Chiku (Sapodilla) is a user-friendly outdoor plant. It brings sweet fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "110 L/day",
        "medicinalValues": [
            "Bark Astringent"
        ],
        "advantages": [
            "Sweet fruit",
            "Dense canopy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_138",
        "name": "Drumstick (Moringa)",
        "scientificName": "Moringa oleifera",
        "description": "The Drumstick (Moringa) is a user-friendly outdoor plant. It brings fastest growing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "Superfood"
        ],
        "advantages": [
            "Fastest growing",
            "Nutritious"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_139",
        "name": "Calathea Orbifolia",
        "scientificName": "Goeppertia orbifolia",
        "description": "The Calathea Orbifolia is a user-friendly indoor plant. It brings massive round leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Massive round leaves",
            "Air purifying"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_140",
        "name": "Bird's Nest Fern",
        "scientificName": "Asplenium nidus",
        "description": "The Bird's Nest Fern is a user-friendly indoor plant. It brings ripple leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Ripple leaves",
            "Pet friendly"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_141",
        "name": "Staghorn Fern",
        "scientificName": "Platycerium",
        "description": "The Staghorn Fern is a user-friendly indoor plant. It brings mounted art to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Mounted art",
            "Epiphyte"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_142",
        "name": "Maidenhair Fern",
        "scientificName": "Adiantum",
        "description": "The Maidenhair Fern is a user-friendly indoor plant. It brings delicate foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect Shade",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Respiratory aid"
        ],
        "advantages": [
            "Delicate foliage",
            "Soft texture"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_143",
        "name": "Hoya Hindu Rope",
        "scientificName": "Hoya carnosa 'Compacta'",
        "description": "The Hoya Hindu Rope is a user-friendly indoor plant. It brings twisted leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Twisted leaves",
            "Living sculpture"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_144",
        "name": "Lipstick Plant",
        "scientificName": "Aeschynanthus radicans",
        "description": "The Lipstick Plant is a user-friendly indoor plant. It brings red tube flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium-Bright",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red tube flowers",
            "Hanging basket"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-7 Years"
    },
    {
        "id": "mock_145",
        "name": "Goldfish Plant",
        "scientificName": "Columnea gloriosa",
        "description": "The Goldfish Plant is a user-friendly indoor plant. It brings fish shaped flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fish shaped flowers",
            "Trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_146",
        "name": "Zebra Haworthia",
        "scientificName": "Haworthiopsis fasciata",
        "description": "The Zebra Haworthia is a user-friendly indoor plant. It brings white stripes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "White stripes",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_147",
        "name": "Burro's Tail",
        "scientificName": "Sedum morganianum",
        "description": "The Burro's Tail is a user-friendly indoor plant. It brings trailing stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Trailing stems",
            "Plump leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "6-10 Years"
    },
    {
        "id": "mock_148",
        "name": "Panda Plant",
        "scientificName": "Kalanchoe tomentosa",
        "description": "The Panda Plant is a user-friendly indoor plant. It brings fuzzy leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sunny Window",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fuzzy leaves",
            "Chocolate tips"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_149",
        "name": "Lithops (Living Stone)",
        "scientificName": "Lithops",
        "description": "The Lithops (Living Stone) is a user-friendly indoor plant. It brings looks like rocks to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Looks like rocks",
            "Super drought tolerant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_150",
        "name": "Pilea Glauca",
        "scientificName": "Pilea glauca",
        "description": "The Pilea Glauca is a user-friendly indoor plant. It brings silver dust leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Silver dust leaves",
            "Trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_151",
        "name": "Aluminum Plant",
        "scientificName": "Pilea cadierei",
        "description": "The Aluminum Plant is a user-friendly indoor plant. It brings metallic silver patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Metallic silver patterns",
            "Fast grower"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_152",
        "name": "Friendship Plant",
        "scientificName": "Pilea involucrata",
        "description": "The Friendship Plant is a user-friendly indoor plant. It brings quilted leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Quilted leaves",
            "Bronze tint"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_153",
        "name": "Strawberry Begonia",
        "scientificName": "Saxifraga stolonifera",
        "description": "The Strawberry Begonia is a user-friendly indoor plant. It brings runners like strawberry to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Cool Shade",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "Teas"
        ],
        "advantages": [
            "Runners like strawberry",
            "Fuzzy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5 Years"
    },
    {
        "id": "mock_154",
        "name": "False Aralia",
        "scientificName": "Plerandra elegantissima",
        "description": "The False Aralia is a user-friendly indoor plant. It brings serrated dark leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Serrated dark leaves",
            "Elegant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_155",
        "name": "Ming Aralia",
        "scientificName": "Polyscias fruticosa",
        "description": "The Ming Aralia is a user-friendly indoor plant. It brings bonsai look to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Bonsai look",
            "Feathery"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_156",
        "name": "Flamingo Flower",
        "scientificName": "Anthurium scherzerianum",
        "description": "The Flamingo Flower is a user-friendly indoor plant. It brings curled spadix to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Curled spadix",
            "Durable blooms"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_157",
        "name": "Velvet Anthurium",
        "scientificName": "Anthurium clarinervium",
        "description": "The Velvet Anthurium is a user-friendly indoor plant. It brings velvet texture to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Velvet texture",
            "White veins"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_158",
        "name": "Crystal Anthurium",
        "scientificName": "Anthurium crystallinum",
        "description": "The Crystal Anthurium is a user-friendly indoor plant. It brings shimmering veins to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "24 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shimmering veins",
            "Heart shape"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_159",
        "name": "Rabbit's Foot Fern",
        "scientificName": "Davallia fejeensis",
        "description": "The Rabbit's Foot Fern is a user-friendly indoor plant. It brings fuzzy rhizomes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fuzzy rhizomes",
            "Lacy fronds"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_160",
        "name": "Button Fern",
        "scientificName": "Pellaea rotundifolia",
        "description": "The Button Fern is a user-friendly indoor plant. It brings round leaflets to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Round leaflets",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-8 Years"
    },
    {
        "id": "mock_161",
        "name": "Blue Star Fern",
        "scientificName": "Phlebodium aureum",
        "description": "The Blue Star Fern is a user-friendly indoor plant. It brings blue-green color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Skin conditions (traditional)"
        ],
        "advantages": [
            "Blue-green color",
            "Unique shape"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_162",
        "name": "Crocodile Fern",
        "scientificName": "Microsorum musifolium",
        "description": "The Crocodile Fern is a user-friendly indoor plant. It brings croc skin texture to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Croc skin texture",
            "Glossy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_163",
        "name": "Lemon Button Fern",
        "scientificName": "Nephrolepis cordifolia",
        "description": "The Lemon Button Fern is a user-friendly indoor plant. It brings lemon scent crushed to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Lemon scent crushed",
            "Small"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_164",
        "name": "Moth Orchid",
        "scientificName": "Phalaenopsis",
        "description": "The Moth Orchid is a user-friendly indoor plant. It brings longest lasting flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Longest lasting flower",
            "Elegant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_165",
        "name": "Dendrobium Orchid",
        "scientificName": "Dendrobium",
        "description": "The Dendrobium Orchid is a user-friendly indoor plant. It brings cane stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "TCM tonic"
        ],
        "advantages": [
            "Cane stems",
            "Many blooms"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_166",
        "name": "Cattleya Orchid",
        "scientificName": "Cattleya",
        "description": "The Cattleya Orchid is a user-friendly indoor plant. It brings corsage flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Corsage flower",
            "Fragrant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_167",
        "name": "Oncidium (Dancing Lady)",
        "scientificName": "Oncidium",
        "description": "The Oncidium (Dancing Lady) is a user-friendly indoor plant. It brings many small flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Many small flowers",
            "Yellow sprays"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_168",
        "name": "Vanilla Orchid",
        "scientificName": "Vanilla planifolia",
        "description": "The Vanilla Orchid is a user-friendly indoor plant. It brings produces vanilla bean to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Flavoring",
            "Aphrodisiac"
        ],
        "advantages": [
            "Produces vanilla bean",
            "Vining"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_169",
        "name": "Bromeliad Guzmania",
        "scientificName": "Guzmania",
        "description": "The Bromeliad Guzmania is a user-friendly indoor plant. It brings colorful bracts to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Colorful bracts",
            "Tropical"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-4 Years (Pups follow)"
    },
    {
        "id": "mock_170",
        "name": "Bromeliad Aechmea",
        "scientificName": "Aechmea fasciata",
        "description": "The Bromeliad Aechmea is a user-friendly indoor plant. It brings silver urn plant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Silver urn plant",
            "Pink flower"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_171",
        "name": "Air Plant (Xerographica)",
        "scientificName": "Tillandsia xerographica",
        "description": "The Air Plant (Xerographica) is a user-friendly indoor plant. It brings king of air plants to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "King of Air Plants",
            "Silver curls"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_172",
        "name": "Air Plant (Ionantha)",
        "scientificName": "Tillandsia ionantha",
        "description": "The Air Plant (Ionantha) is a user-friendly indoor plant. It brings blushes red to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Filtered Sun",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Blushes red",
            "Tiny"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_173",
        "name": "Spanish Moss",
        "scientificName": "Tillandsia usneoides",
        "description": "The Spanish Moss is a user-friendly indoor plant. It brings drapes beautifully to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Stuffing material"
        ],
        "advantages": [
            "Drapes beautifully",
            "No soil"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_174",
        "name": "Sensitive Plant",
        "scientificName": "Mimosa pudica",
        "description": "The Sensitive Plant is a user-friendly indoor plant. It brings closes when touched to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Light",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Wound healing"
        ],
        "advantages": [
            "Closes when touched",
            "Interactive"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "1-2 Years"
    },
    {
        "id": "mock_175",
        "name": "Purple Shamrock",
        "scientificName": "Oxalis triangularis",
        "description": "The Purple Shamrock is a user-friendly indoor plant. It brings purple leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "Edible (sour)"
        ],
        "advantages": [
            "Purple leaves",
            "Moves day/night"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial Bulb"
    },
    {
        "id": "mock_176",
        "name": "Fishtail Fern",
        "scientificName": "Cyrtomium falcatum",
        "description": "The Fishtail Fern is a user-friendly indoor plant. It brings holly-like leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade-Medium",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Holly-like leaves",
            "Tough"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_177",
        "name": "Kangaroo Paw Fern",
        "scientificName": "Microsorum diversifolium",
        "description": "The Kangaroo Paw Fern is a user-friendly indoor plant. It brings shiny leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shiny leaves",
            "Spreads"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_178",
        "name": "Mahogany Fern",
        "scientificName": "Didymochlaena truncatula",
        "description": "The Mahogany Fern is a user-friendly indoor plant. It brings red young fronds to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red young fronds",
            "Tree-like"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_179",
        "name": "Silver Brake Fern",
        "scientificName": "Pteris ensiformis",
        "description": "The Silver Brake Fern is a user-friendly indoor plant. It brings variegated to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Variegated",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_180",
        "name": "Autumn Fern",
        "scientificName": "Dryopteris erythrosora",
        "description": "The Autumn Fern is a user-friendly indoor plant. It brings copper color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Copper color",
            "Hardy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_181",
        "name": "Coffee Plant",
        "scientificName": "Coffea arabica",
        "description": "The Coffee Plant is a user-friendly indoor plant. It brings glossy leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Caffeine source"
        ],
        "advantages": [
            "Glossy leaves",
            "Real beans possible"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_182",
        "name": "Tea Plant",
        "scientificName": "Camellia sinensis",
        "description": "The Tea Plant is a user-friendly indoor plant. It brings edible leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Tea",
            "Antioxidant"
        ],
        "advantages": [
            "Edible leaves",
            "White flowers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_183",
        "name": "Cardamom",
        "scientificName": "Elettaria cardamomum",
        "description": "The Cardamom is a user-friendly indoor plant. It brings scented leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Digestion"
        ],
        "advantages": [
            "Scented leaves",
            "Spice"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_184",
        "name": "Ginger",
        "scientificName": "Zingiber officinale",
        "description": "The Ginger is a user-friendly indoor plant. It brings edible root to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Anti-nausea"
        ],
        "advantages": [
            "Edible root",
            "Bamboo-like stems"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_185",
        "name": "Turmeric",
        "scientificName": "Curcuma longa",
        "description": "The Turmeric is a user-friendly indoor plant. It brings superfood root to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Superfood root",
            "Large leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_186",
        "name": "Patchouli",
        "scientificName": "Pogostemon cablin",
        "description": "The Patchouli is a user-friendly indoor plant. It brings perfume scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Antidepressant"
        ],
        "advantages": [
            "Perfume scent",
            "Fuzzy leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_187",
        "name": "Stevia",
        "scientificName": "Stevia rebaudiana",
        "description": "The Stevia is a user-friendly indoor plant. It brings sugar substitute to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Sweetener"
        ],
        "advantages": [
            "Sugar substitute",
            "Easy herb"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-3 Years"
    },
    {
        "id": "mock_188",
        "name": "Gotu Kola",
        "scientificName": "Centella asiatica",
        "description": "The Gotu Kola is a user-friendly indoor plant. It brings medicinal herb to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Memory",
            "Skin"
        ],
        "advantages": [
            "Medicinal herb",
            "Ground cover"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_189",
        "name": "Wisteria",
        "scientificName": "Wisteria sinensis",
        "description": "The Wisteria is a user-friendly outdoor plant. It brings cascading flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cascading flowers",
            "Stunning purple"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_190",
        "name": "Clematis",
        "scientificName": "Clematis",
        "description": "The Clematis is a user-friendly outdoor plant. It brings queen of climbers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun (Roots shade)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Anti-inflammatory (History)"
        ],
        "advantages": [
            "Queen of Climbers",
            "Diverse colors"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_191",
        "name": "Honeysuckle",
        "scientificName": "Lonicera",
        "description": "The Honeysuckle is a user-friendly outdoor plant. It brings heavenly scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Cooling herb"
        ],
        "advantages": [
            "Heavenly scent",
            "Pollinator magnet"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_192",
        "name": "Black Eyed Susan",
        "scientificName": "Rudbeckia hirta",
        "description": "The Black Eyed Susan is a user-friendly outdoor plant. It brings bright yellow to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Immune boost root"
        ],
        "advantages": [
            "Bright yellow",
            "Native beauty"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2-3 Years"
    },
    {
        "id": "mock_193",
        "name": "Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "The Coneflower is a user-friendly outdoor plant. It brings medicinal tea to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Cold remedy"
        ],
        "advantages": [
            "Medicinal tea",
            "Butterfly fave"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_194",
        "name": "Bleeding Heart",
        "scientificName": "Lamprocapnos spectabilis",
        "description": "The Bleeding Heart is a user-friendly outdoor plant. It brings heart shaped flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Heart shaped flower",
            "Shade lover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_195",
        "name": "Astilbe",
        "scientificName": "Astilbe",
        "description": "The Astilbe is a user-friendly outdoor plant. It brings feathery plumes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Feathery plumes",
            "Fern-like foliage"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15+ Years"
    },
    {
        "id": "mock_196",
        "name": "Hosta",
        "scientificName": "Hosta",
        "description": "The Hosta is a user-friendly outdoor plant. It brings foliage king to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Edible shoots"
        ],
        "advantages": [
            "Foliage king",
            "Shade tolerant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30+ Years"
    },
    {
        "id": "mock_197",
        "name": "Coral Bells",
        "scientificName": "Heuchera",
        "description": "The Coral Bells is a user-friendly outdoor plant. It brings colorful leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Astringent root"
        ],
        "advantages": [
            "Colorful leaves",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_198",
        "name": "Foxglove",
        "scientificName": "Digitalis purpurea",
        "description": "The Foxglove is a user-friendly outdoor plant. It brings tall spikes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Heart medicine (Toxic)"
        ],
        "advantages": [
            "Tall spikes",
            "Cottage garden"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2 Years (Biennial)"
    },
    {
        "id": "mock_199",
        "name": "Delphinium",
        "scientificName": "Delphinium",
        "description": "The Delphinium is a user-friendly outdoor plant. It brings true blue color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "True blue color",
            "Tall spikes"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_200",
        "name": "Snapdragon",
        "scientificName": "Antirrhinum majus",
        "description": "The Snapdragon is a user-friendly outdoor plant. It brings dragon mouth flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Dragon mouth flowers",
            "Kids love"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_201",
        "name": "Zinnia",
        "scientificName": "Zinnia elegans",
        "description": "The Zinnia is a user-friendly outdoor plant. It brings cut flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cut flowers",
            "Butterfly magnet"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_202",
        "name": "Cosmos",
        "scientificName": "Cosmos bipinnatus",
        "description": "The Cosmos is a user-friendly outdoor plant. It brings airy foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Airy foliage",
            "Daisy like"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_203",
        "name": "Sweet Pea",
        "scientificName": "Lathyrus odoratus",
        "description": "The Sweet Pea is a user-friendly outdoor plant. It brings fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fragrance",
            "Climber"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_204",
        "name": "Nasturtium",
        "scientificName": "Tropaeolum majus",
        "description": "The Nasturtium is a user-friendly outdoor plant. It brings edible flowers/leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Antibiotic"
        ],
        "advantages": [
            "Edible flowers/leaves",
            "Peppery"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_205",
        "name": "Dahlia",
        "scientificName": "Dahlia pinnata",
        "description": "The Dahlia is a user-friendly outdoor plant. It brings showy blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Insulin source (historical)"
        ],
        "advantages": [
            "Showy blooms",
            "Variety"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial Tuber"
    },
    {
        "id": "mock_206",
        "name": "Gladiolus",
        "scientificName": "Gladiolus",
        "description": "The Gladiolus is a user-friendly outdoor plant. It brings tall sword flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Drawing out thorns"
        ],
        "advantages": [
            "Tall sword flower",
            "Cut flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial Corm"
    },
    {
        "id": "mock_207",
        "name": "Calla Lily",
        "scientificName": "Zantedeschia aethiopica",
        "description": "The Calla Lily is a user-friendly outdoor plant. It brings elegant trumpet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Elegant trumpet",
            "Wet soil"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_208",
        "name": "Daylily",
        "scientificName": "Hemerocallis",
        "description": "The Daylily is a user-friendly outdoor plant. It brings tough to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Edible flower buds"
        ],
        "advantages": [
            "Tough",
            "Blooms for one day"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_209",
        "name": "Iris",
        "scientificName": "Iris germanica",
        "description": "The Iris is a user-friendly outdoor plant. It brings bearded flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "32 L/day",
        "medicinalValues": [
            "Orris root (perfume)"
        ],
        "advantages": [
            "Bearded flowers",
            "Sword leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_210",
        "name": "Camellia",
        "scientificName": "Camellia japonica",
        "description": "The Camellia is a user-friendly outdoor plant. It brings winter blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Oil for hair"
        ],
        "advantages": [
            "Winter blooms",
            "Rose-like"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_211",
        "name": "Gardenia",
        "scientificName": "Gardenia jasminoides",
        "description": "The Gardenia is a user-friendly outdoor plant. It brings intense fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Chinese medicine"
        ],
        "advantages": [
            "Intense fragrance",
            "White blooms"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-40 Years"
    },
    {
        "id": "mock_212",
        "name": "Rhododendron",
        "scientificName": "Rhododendron ferrugineum",
        "description": "The Rhododendron is a user-friendly outdoor plant. It brings spectacular spring to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Spectacular spring",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_213",
        "name": "Forsythia",
        "scientificName": "Forsythia suspensa",
        "description": "The Forsythia is a user-friendly outdoor plant. It brings first yellow of spring to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Detox"
        ],
        "advantages": [
            "First yellow of spring",
            "Hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_214",
        "name": "Weigela",
        "scientificName": "Weigela florida",
        "description": "The Weigela is a user-friendly outdoor plant. It brings tubular flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tubular flowers",
            "Hummingbirds"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30+ Years"
    },
    {
        "id": "mock_215",
        "name": "Spirea",
        "scientificName": "Spiraea japonica",
        "description": "The Spirea is a user-friendly outdoor plant. It brings easy shrub to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Aspirin source (Salicylic acid)"
        ],
        "advantages": [
            "Easy shrub",
            "Pink/White"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_216",
        "name": "Holly",
        "scientificName": "Ilex aquifolium",
        "description": "The Holly is a user-friendly outdoor plant. It brings winter red berries to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None (Berries toxic)"
        ],
        "advantages": [
            "Winter red berries",
            "Security"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_217",
        "name": "Juniper",
        "scientificName": "Juniperus communis",
        "description": "The Juniper is a user-friendly outdoor plant. It brings evergreen to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "70 L/day",
        "medicinalValues": [
            "Gin flavoring",
            "Antiseptic"
        ],
        "advantages": [
            "Evergreen",
            "Berries"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_218",
        "name": "Yew",
        "scientificName": "Taxus baccata",
        "description": "The Yew is a user-friendly outdoor plant. It brings long lived to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade/Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "Taxol (Cancer drug)"
        ],
        "advantages": [
            "Long lived",
            "Hedge"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "500+ Years"
    },
    {
        "id": "mock_219",
        "name": "Arborvitae",
        "scientificName": "Thuja occidentalis",
        "description": "The Arborvitae is a user-friendly outdoor plant. It brings privacy screen to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "Vitamin C tea"
        ],
        "advantages": [
            "Privacy screen",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_220",
        "name": "Japanese Maple",
        "scientificName": "Acer palmatum",
        "description": "The Japanese Maple is a user-friendly outdoor plant. It brings stunning foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "120 L/day",
        "medicinalValues": [
            "Eye wash"
        ],
        "advantages": [
            "Stunning foliage",
            "Form"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_221",
        "name": "Dogwood",
        "scientificName": "Cornus florida",
        "description": "The Dogwood is a user-friendly outdoor plant. It brings spring bracts to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "110 L/day",
        "medicinalValues": [
            "Fever bark"
        ],
        "advantages": [
            "Spring bracts",
            "Fall color"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_222",
        "name": "Redbud",
        "scientificName": "Cercis canadensis",
        "description": "The Redbud is a user-friendly outdoor plant. It brings pink stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "Astringent"
        ],
        "advantages": [
            "Pink stems",
            "Heart leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_223",
        "name": "Crape Myrtle",
        "scientificName": "Lagerstroemia indica",
        "description": "The Crape Myrtle is a user-friendly outdoor plant. It brings summer blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "95 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Summer blooms",
            "Peeling bark"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_224",
        "name": "Ginkgo",
        "scientificName": "Ginkgo biloba",
        "description": "The Ginkgo is a user-friendly outdoor plant. It brings living fossil to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "250 L/day",
        "medicinalValues": [
            "Memory"
        ],
        "advantages": [
            "Living fossil",
            "Yellow fall"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000+ Years"
    },
    {
        "id": "mock_225",
        "name": "Birch",
        "scientificName": "Betula pendula",
        "description": "The Birch is a user-friendly outdoor plant. It brings white bark to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "180 L/day",
        "medicinalValues": [
            "Sap wine",
            "Skin"
        ],
        "advantages": [
            "White bark",
            "Elegant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40-60 Years"
    },
    {
        "id": "mock_226",
        "name": "Willow",
        "scientificName": "Salix babylonica",
        "description": "The Willow is a user-friendly outdoor plant. It brings weeping form to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "160 L/day",
        "medicinalValues": [
            "Aspirin source"
        ],
        "advantages": [
            "Weeping form",
            "Water loving"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30-50 Years"
    },
    {
        "id": "mock_227",
        "name": "Oak",
        "scientificName": "Quercus robur",
        "description": "The Oak is a user-friendly outdoor plant. It brings wildlife support to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "300 L/day",
        "medicinalValues": [
            "Astringent bark"
        ],
        "advantages": [
            "Wildlife support",
            "Strength"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "500+ Years"
    },
    {
        "id": "mock_228",
        "name": "Maple",
        "scientificName": "Acer saccharum",
        "description": "The Maple is a user-friendly outdoor plant. It brings fall color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "280 L/day",
        "medicinalValues": [
            "Syrup"
        ],
        "advantages": [
            "Fall color",
            "Syrup"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "200+ Years"
    },
    {
        "id": "mock_229",
        "name": "Pine",
        "scientificName": "Pinus strobus",
        "description": "The Pine is a user-friendly outdoor plant. It brings evergreen to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "260 L/day",
        "medicinalValues": [
            "Needle tea (Vit C)"
        ],
        "advantages": [
            "Evergreen",
            "Scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "200+ Years"
    },
    {
        "id": "mock_230",
        "name": "Palm (Fan)",
        "scientificName": "Washingtonia robusta",
        "description": "The Palm (Fan) is a user-friendly outdoor plant. It brings skyline accent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Skyline accent",
            "Drought"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_231",
        "name": "Olive",
        "scientificName": "Olea europaea",
        "description": "The Olive is a user-friendly outdoor plant. It brings peace symbol to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "120 L/day",
        "medicinalValues": [
            "Leaf extract",
            "Oil"
        ],
        "advantages": [
            "Peace symbol",
            "Fruit"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000+ Years"
    },
    {
        "id": "mock_232",
        "name": "Fig",
        "scientificName": "Ficus carica",
        "description": "The Fig is a user-friendly outdoor plant. It brings edible fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "Latex for warts"
        ],
        "advantages": [
            "Edible fruit",
            "Leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_233",
        "name": "Grapevine",
        "scientificName": "Vitis vinifera",
        "description": "The Grapevine is a user-friendly outdoor plant. It brings wine/jam to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "Antioxidant seeds"
        ],
        "advantages": [
            "Wine/Jam",
            "Shade arbor"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_234",
        "name": "Strawberry",
        "scientificName": "Fragaria x ananassa",
        "description": "The Strawberry is a user-friendly outdoor plant. It brings delicious to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Teeth whitening (fruit)"
        ],
        "advantages": [
            "Delicious",
            "Ground cover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3 Years"
    },
    {
        "id": "mock_235",
        "name": "Blueberry",
        "scientificName": "Vaccinium corymbosum",
        "description": "The Blueberry is a user-friendly outdoor plant. It brings berries to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Superfood"
        ],
        "advantages": [
            "Berries",
            "Fall red leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_236",
        "name": "Raspberry",
        "scientificName": "Rubus idaeus",
        "description": "The Raspberry is a user-friendly outdoor plant. It brings fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Leaf tea for labor"
        ],
        "advantages": [
            "Fruit",
            "Easy grow"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_237",
        "name": "Blackberry",
        "scientificName": "Rubus fruticosus",
        "description": "The Blackberry is a user-friendly outdoor plant. It brings fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Antioxidant"
        ],
        "advantages": [
            "Fruit",
            "Aggressive"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_238",
        "name": "Sunflower (Giant)",
        "scientificName": "Helianthus giganteus",
        "description": "The Sunflower (Giant) is a user-friendly outdoor plant. It brings 12ft tall to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "Seeds"
        ],
        "advantages": [
            "12ft tall",
            "Competitions"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_239",
        "name": "Alocasia Polly",
        "scientificName": "Alocasia amazonica",
        "description": "The Alocasia Polly is a user-friendly indoor plant. It brings african mask shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "African Mask shape",
            "Striking veins"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_240",
        "name": "Black Velvet Alocasia",
        "scientificName": "Alocasia reginula",
        "description": "The Black Velvet Alocasia is a user-friendly indoor plant. It brings dark velvet leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Dark velvet leaves",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_241",
        "name": "Dragon Scale Alocasia",
        "scientificName": "Alocasia baginda",
        "description": "The Dragon Scale Alocasia is a user-friendly indoor plant. It brings textured leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Textured leaves",
            "Dragon skin look"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_242",
        "name": "Zebrina Alocasia",
        "scientificName": "Alocasia zebrina",
        "description": "The Zebrina Alocasia is a user-friendly indoor plant. It brings zebra print stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Zebra print stems",
            "Arrowhead leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_243",
        "name": "Frydek Alocasia",
        "scientificName": "Alocasia micholitziana",
        "description": "The Frydek Alocasia is a user-friendly indoor plant. It brings green velvet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "32 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Green velvet",
            "White veins"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_244",
        "name": "Stingray Alocasia",
        "scientificName": "Alocasia macrorrhizos",
        "description": "The Stingray Alocasia is a user-friendly indoor plant. It brings looks like stingray to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Looks like stingray",
            "Tall"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_245",
        "name": "Jewel Orchid",
        "scientificName": "Ludisia discolor",
        "description": "The Jewel Orchid is a user-friendly indoor plant. It brings dark striped leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Dark striped leaves",
            "Terrestrial"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_246",
        "name": "Lightning Bolt Orchid",
        "scientificName": "Macodes petola",
        "description": "The Lightning Bolt Orchid is a user-friendly indoor plant. It brings gold glitter veins to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low-Medium",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Gold glitter veins",
            "Rare jewel"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_247",
        "name": "Medinilla Magnifica",
        "scientificName": "Medinilla magnifica",
        "description": "The Medinilla Magnifica is a user-friendly indoor plant. It brings huge pink blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge pink blooms",
            "Showstopper"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_248",
        "name": "Bat Flower",
        "scientificName": "Tacca chantrieri",
        "description": "The Bat Flower is a user-friendly indoor plant. It brings black bat flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Black bat flowers",
            "Long whiskers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-7 Years"
    },
    {
        "id": "mock_249",
        "name": "Corpse Flower (Amorphophallus)",
        "scientificName": "Amorphophallus titanium",
        "description": "The Corpse Flower (Amorphophallus) is a user-friendly indoor plant. It brings largest flower (smelly) to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Largest flower (smelly)",
            "Conversation"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "40 Years"
    },
    {
        "id": "mock_250",
        "name": "Voodoo Lily",
        "scientificName": "Sauromatum venosum",
        "description": "The Voodoo Lily is a user-friendly indoor plant. It brings spotted stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spotted stems",
            "Exotic"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_251",
        "name": "Monkey Cup (Pitcher Plant)",
        "scientificName": "Nepenthes",
        "description": "The Monkey Cup (Pitcher Plant) is a user-friendly indoor plant. It brings carnivorous to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Carnivorous",
            "Hanging pitchers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_252",
        "name": "Venus Flytrap",
        "scientificName": "Dionaea muscipula",
        "description": "The Venus Flytrap is a user-friendly indoor plant. It brings eats bugs to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Direct",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Eats bugs",
            "Moving parts"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_253",
        "name": "Sundew",
        "scientificName": "Drosera",
        "description": "The Sundew is a user-friendly indoor plant. It brings sticky drops to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Direct",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "Cough (Historically)"
        ],
        "advantages": [
            "Sticky drops",
            "Glistening"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_254",
        "name": "Butterwort",
        "scientificName": "Pinguicula",
        "description": "The Butterwort is a user-friendly indoor plant. It brings sticky leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "8 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Sticky leaves",
            "Pretty flowers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_255",
        "name": "Cobra Lily",
        "scientificName": "Darlingtonia californica",
        "description": "The Cobra Lily is a user-friendly indoor plant. It brings snake head shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Cool Sun",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Snake head shape",
            "Carnivorous"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_256",
        "name": "Bunny Ear Cactus",
        "scientificName": "Opuntia microdasys",
        "description": "The Bunny Ear Cactus is a user-friendly indoor plant. It brings polka dots to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Polka dots",
            "Flat pads"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_257",
        "name": "Old Man Cactus",
        "scientificName": "Cephalocereus senilis",
        "description": "The Old Man Cactus is a user-friendly indoor plant. It brings long white hair to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Long white hair",
            "Fuzzy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_258",
        "name": "Golden Barrel Cactus",
        "scientificName": "Echinocactus grusonii",
        "description": "The Golden Barrel Cactus is a user-friendly indoor plant. It brings perfect sphere to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Perfect sphere",
            "Golden spines"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_259",
        "name": "Fishbone Cactus",
        "scientificName": "Disocactus anguliger",
        "description": "The Fishbone Cactus is a user-friendly indoor plant. It brings zigzag leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Zigzag leaves",
            "Orchid cactus"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_260",
        "name": "Moon Cactus",
        "scientificName": "Gymnocalycium mihanovichii",
        "description": "The Moon Cactus is a user-friendly indoor plant. It brings neon colors to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "8 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Neon colors",
            "Grafted"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_261",
        "name": "Rat Tail Cactus",
        "scientificName": "Aporocactus flagelliformis",
        "description": "The Rat Tail Cactus is a user-friendly indoor plant. It brings trailing stems to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Heart tonic (Traditional)"
        ],
        "advantages": [
            "Trailing stems",
            "Pink flowers"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_262",
        "name": "String of Dolphins",
        "scientificName": "Senecio peregrinus",
        "description": "The String of Dolphins is a user-friendly indoor plant. It brings jumping dolphins to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Jumping dolphins",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_263",
        "name": "String of Bananas",
        "scientificName": "Senecio radicans",
        "description": "The String of Bananas is a user-friendly indoor plant. It brings fast grower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast grower",
            "Banana shape"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_264",
        "name": "String of Melons",
        "scientificName": "Curio herreanus",
        "description": "The String of Melons is a user-friendly indoor plant. It brings striped beads to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "14 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Striped beads",
            "Trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_265",
        "name": "Pickle Plant",
        "scientificName": "Delosperma echinatum",
        "description": "The Pickle Plant is a user-friendly indoor plant. It brings fuzzy pickles to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fuzzy pickles",
            "Cute"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_266",
        "name": "Bear's Paw",
        "scientificName": "Cotyledon tomentosa",
        "description": "The Bear's Paw is a user-friendly indoor plant. It brings fuzzy paws to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fuzzy paws",
            "Red claws"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_267",
        "name": "Gollum Jade",
        "scientificName": "Crassula ovata 'Gollum'",
        "description": "The Gollum Jade is a user-friendly indoor plant. It brings alien fingers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Alien fingers",
            "Trumpet shape"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_268",
        "name": "Propeller Plant",
        "scientificName": "Crassula falcata",
        "description": "The Propeller Plant is a user-friendly indoor plant. It brings grey propellers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Grey propellers",
            "Red blooms"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_269",
        "name": "Watch Chain",
        "scientificName": "Crassula muscosa",
        "description": "The Watch Chain is a user-friendly indoor plant. It brings zipper like to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Zipper like",
            "Scale texture"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_270",
        "name": "Spiral Aloe",
        "scientificName": "Aloe polyphylla",
        "description": "The Spiral Aloe is a user-friendly indoor plant. It brings perfect math spiral to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Perfect math spiral",
            "Rare"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_271",
        "name": "Climbing Aloe",
        "scientificName": "Aloiampelos ciliaris",
        "description": "The Climbing Aloe is a user-friendly indoor plant. It brings vining aloe to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Vining aloe",
            "Fast growth"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_272",
        "name": "Agave (Century Plant)",
        "scientificName": "Agave americana",
        "description": "The Agave (Century Plant) is a user-friendly indoor plant. It brings architectural to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Syrup",
            "Antiseptic"
        ],
        "advantages": [
            "Architectural",
            "Bloom once & die"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-25 Years"
    },
    {
        "id": "mock_273",
        "name": "Queen Victoria Agave",
        "scientificName": "Agave victoriae-reginae",
        "description": "The Queen Victoria Agave is a user-friendly indoor plant. It brings geometry to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Geometry",
            "White markings"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-30 Years"
    },
    {
        "id": "mock_274",
        "name": "Ponytail Palm (Variegated)",
        "scientificName": "Beaucarnea recurvata 'Variegata'",
        "description": "The Ponytail Palm (Variegated) is a user-friendly indoor plant. It brings pink/white stripes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pink/White stripes",
            "Curly"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40+ Years"
    },
    {
        "id": "mock_275",
        "name": "Banana Croton",
        "scientificName": "Codiaeum variegatum 'Banana'",
        "description": "The Banana Croton is a user-friendly indoor plant. It brings small yellow leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Small yellow leaves",
            "Bushy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_276",
        "name": "Mammy Croton",
        "scientificName": "Codiaeum variegatum 'Mammy'",
        "description": "The Mammy Croton is a user-friendly indoor plant. It brings twisted leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Twisted leaves",
            "Fire colors"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_277",
        "name": "Gold Dust Dracaena",
        "scientificName": "Dracaena surculosa",
        "description": "The Gold Dust Dracaena is a user-friendly indoor plant. It brings bamboo like to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Bamboo like",
            "Spotted"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "15 Years"
    },
    {
        "id": "mock_278",
        "name": "Janet Craig Dracaena",
        "scientificName": "Dracaena deremensis",
        "description": "The Janet Craig Dracaena is a user-friendly indoor plant. It brings dark green to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low Light",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Toxin removal"
        ],
        "advantages": [
            "Dark green",
            "Low light king"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_279",
        "name": "Lemon Lime Dracaena",
        "scientificName": "Dracaena warneckii",
        "description": "The Lemon Lime Dracaena is a user-friendly indoor plant. It brings neon stripes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "32 L/day",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Neon stripes",
            "Brightens rooms"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_280",
        "name": "Hawaiian Ti Plant",
        "scientificName": "Cordyline fruticosa",
        "description": "The Hawaiian Ti Plant is a user-friendly indoor plant. It brings pink/red leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Luck",
            "Cooking wrapper"
        ],
        "advantages": [
            "Pink/Red leaves",
            "Tropical"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_281",
        "name": "Polynesian Ivy",
        "scientificName": "Pellionia pulchra",
        "description": "The Polynesian Ivy is a user-friendly indoor plant. It brings watermelon skin pattern to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Shade",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Watermelon skin pattern",
            "Trailing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5 Years"
    },
    {
        "id": "mock_282",
        "name": "Creeping Fig",
        "scientificName": "Ficus pumila",
        "description": "The Creeping Fig is a user-friendly indoor plant. It brings covers walls to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Covers walls",
            "Small leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_283",
        "name": "Oakleaf Ivy",
        "scientificName": "Cissus rhombifolia",
        "description": "The Oakleaf Ivy is a user-friendly indoor plant. It brings grape like leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Grape like leaves",
            "Easy vine"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_284",
        "name": "Rex Begonia Escargot",
        "scientificName": "Begonia 'Escargot'",
        "description": "The Rex Begonia Escargot is a user-friendly indoor plant. It brings spiral snail shell to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Shade",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spiral snail shell",
            "Pattern"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_285",
        "name": "Iron Cross Begonia",
        "scientificName": "Begonia masoniana",
        "description": "The Iron Cross Begonia is a user-friendly indoor plant. It brings brown cross pattern to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Shade",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Brown cross pattern",
            "Textured"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_286",
        "name": "Peacock Begonia",
        "scientificName": "Begonia pavonina",
        "description": "The Peacock Begonia is a user-friendly indoor plant. It brings iridescent blue to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Deep Shade",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Iridescent blue",
            "Shade lover"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_287",
        "name": "Angel Wing Begonia",
        "scientificName": "Begonia coccinea",
        "description": "The Angel Wing Begonia is a user-friendly indoor plant. It brings cane stem to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cane stem",
            "Spotted wings"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_288",
        "name": "Eyelash Begonia",
        "scientificName": "Begonia bowerae",
        "description": "The Eyelash Begonia is a user-friendly indoor plant. It brings hairy edges to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium Light",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Hairy edges",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_289",
        "name": "Corpse Flower (Giant)",
        "scientificName": "Rafflesia arnoldii",
        "description": "The Corpse Flower (Giant) is a user-friendly outdoor plant. It brings worlds largest flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Jungle Floor",
        "oxygenLevel": "5 L/day",
        "medicinalValues": [
            "Fever (Traditional)"
        ],
        "advantages": [
            "Worlds largest flower",
            "Rare"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Parasitic"
    },
    {
        "id": "mock_290",
        "name": "Jade Vine",
        "scientificName": "Strongylodon macrobotrys",
        "description": "The Jade Vine is a user-friendly outdoor plant. It brings neon teal flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Neon teal flowers",
            "Vining"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_291",
        "name": "Ghost Orchid",
        "scientificName": "Dendrophylax lindenii",
        "description": "The Ghost Orchid is a user-friendly outdoor plant. It brings no leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Dappled Swamp",
        "oxygenLevel": "10 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "No leaves",
            "Floats in air"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_292",
        "name": "Chocolate Cosmos",
        "scientificName": "Cosmos atrosanguineus",
        "description": "The Chocolate Cosmos is a user-friendly outdoor plant. It brings smells like chocolate to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Smells like chocolate",
            "Dark red"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_293",
        "name": "Giant Water Lily",
        "scientificName": "Victoria amazonica",
        "description": "The Giant Water Lily is a user-friendly outdoor plant. It brings huge floating leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge floating leaves",
            "Support a child"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_294",
        "name": "Parrot's Beak",
        "scientificName": "Lotus berthelotii",
        "description": "The Parrot's Beak is a user-friendly outdoor plant. It brings orange claw flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Orange claw flowers",
            "Silver foliage"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_295",
        "name": "Kangaroo Paw",
        "scientificName": "Anigozanthos flavidus",
        "description": "The Kangaroo Paw is a user-friendly outdoor plant. It brings fuzzy paw flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fuzzy paw flowers",
            "Unique"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_296",
        "name": "Protea King",
        "scientificName": "Protea cynaroides",
        "description": "The Protea King is a user-friendly outdoor plant. It brings huge artichoke flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge artichoke flower",
            "Dinosaur era"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_297",
        "name": "Banksia",
        "scientificName": "Banksia",
        "description": "The Banksia is a user-friendly outdoor plant. It brings bottle brush cone to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Nectar source"
        ],
        "advantages": [
            "Bottle brush cone",
            "Fire hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_298",
        "name": "Waratah",
        "scientificName": "Telopea speciosissima",
        "description": "The Waratah is a user-friendly outdoor plant. It brings red emblem to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red emblem",
            "Structural"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_299",
        "name": "Bird of Paradise (Giant)",
        "scientificName": "Strelitzia nicolai",
        "description": "The Bird of Paradise (Giant) is a user-friendly outdoor plant. It brings 30ft tall to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "30ft tall",
            "White bird"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_300",
        "name": "Traveler's Palm",
        "scientificName": "Ravenala madagascariensis",
        "description": "The Traveler's Palm is a user-friendly outdoor plant. It brings east-west alignment to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "Water source"
        ],
        "advantages": [
            "East-West alignment",
            "Fan shape"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_301",
        "name": "Baobab",
        "scientificName": "Adansonia",
        "description": "The Baobab is a user-friendly outdoor plant. It brings tree of life to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "300 L/day",
        "medicinalValues": [
            "Superfruit",
            "Bark"
        ],
        "advantages": [
            "Tree of Life",
            "Water storage"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2000+ Years"
    },
    {
        "id": "mock_302",
        "name": "Dragon Blood Tree",
        "scientificName": "Dracaena cinnabari",
        "description": "The Dragon Blood Tree is a user-friendly outdoor plant. It brings ufo shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "180 L/day",
        "medicinalValues": [
            "Red resin (blood)"
        ],
        "advantages": [
            "UFO shape",
            "Rare"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "500+ Years"
    },
    {
        "id": "mock_303",
        "name": "Rainbow Eucalyptus",
        "scientificName": "Eucalyptus deglupta",
        "description": "The Rainbow Eucalyptus is a user-friendly outdoor plant. It brings multicolored bark to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "400 L/day",
        "medicinalValues": [
            "Oil"
        ],
        "advantages": [
            "Multicolored bark",
            "Fast growth"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_304",
        "name": "Jacaranda",
        "scientificName": "Jacaranda mimosifolia",
        "description": "The Jacaranda is a user-friendly outdoor plant. It brings purple canopy to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "Antibiotic"
        ],
        "advantages": [
            "Purple canopy",
            "Fern leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_305",
        "name": "Wollemi Pine",
        "scientificName": "Wollemia nobilis",
        "description": "The Wollemi Pine is a user-friendly outdoor plant. It brings living fossil (dino) to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Living fossil (Dino)",
            "Bubbly bark"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000+ Years"
    },
    {
        "id": "mock_306",
        "name": "Monkey Puzzle Tree",
        "scientificName": "Araucaria araucana",
        "description": "The Monkey Puzzle Tree is a user-friendly outdoor plant. It brings spiky puzzle to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "220 L/day",
        "medicinalValues": [
            "Edible seeds"
        ],
        "advantages": [
            "Spiky puzzle",
            "Ancient"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000+ Years"
    },
    {
        "id": "mock_307",
        "name": "Coast Redwood",
        "scientificName": "Sequoia sempervirens",
        "description": "The Coast Redwood is a user-friendly outdoor plant. It brings tallest tree to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Foggy Sun",
        "oxygenLevel": "1000 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tallest tree",
            "Fog lover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2000+ Years"
    },
    {
        "id": "mock_308",
        "name": "Giant Sequoia",
        "scientificName": "Sequoiadendron giganteum",
        "description": "The Giant Sequoia is a user-friendly outdoor plant. It brings largest tree volume to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "1200 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Largest tree volume",
            "Fire resistant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3000+ Years"
    },
    {
        "id": "mock_309",
        "name": "Bristlecone Pine",
        "scientificName": "Pinus longaeva",
        "description": "The Bristlecone Pine is a user-friendly outdoor plant. It brings oldest living thing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Oldest living thing",
            "Twisted"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5000+ Years"
    },
    {
        "id": "mock_310",
        "name": "Quaking Aspen",
        "scientificName": "Populus tremuloides",
        "description": "The Quaking Aspen is a user-friendly outdoor plant. It brings leaves shake to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "Aspirin"
        ],
        "advantages": [
            "Leaves shake",
            "Yellow fall"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years (Clone 80k)"
    },
    {
        "id": "mock_311",
        "name": "Franklin Tree",
        "scientificName": "Franklinia alatamaha",
        "description": "The Franklin Tree is a user-friendly outdoor plant. It brings extinct in wild to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Extinct in wild",
            "White flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_312",
        "name": "Dawn Redwood",
        "scientificName": "Metasequoia glyptostroboides",
        "description": "The Dawn Redwood is a user-friendly outdoor plant. It brings deciduous conifer to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "300 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Deciduous conifer",
            "Fast"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "600 Years"
    },
    {
        "id": "mock_313",
        "name": "Golden Chain Tree",
        "scientificName": "Laburnum anagyroides",
        "description": "The Golden Chain Tree is a user-friendly outdoor plant. It brings yellow hanging chains to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Yellow hanging chains",
            "Tunnel tree"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_314",
        "name": "Angel's Trumpet",
        "scientificName": "Brugmansia",
        "description": "The Angel's Trumpet is a user-friendly outdoor plant. It brings huge hanging bells to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "Hallucinogen (Toxic)"
        ],
        "advantages": [
            "Huge hanging bells",
            "Scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_315",
        "name": "Passion Fruit Vine",
        "scientificName": "Passiflora edulis",
        "description": "The Passion Fruit Vine is a user-friendly outdoor plant. It brings edible fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Sleep aid"
        ],
        "advantages": [
            "Edible fruit",
            "Alien flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "7 Years"
    },
    {
        "id": "mock_316",
        "name": "Kiwi Vine",
        "scientificName": "Actinidia deliciosa",
        "description": "The Kiwi Vine is a user-friendly outdoor plant. It brings fuzzy fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Vitamin C"
        ],
        "advantages": [
            "Fuzzy fruit",
            "Vigorous"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_317",
        "name": "Hops",
        "scientificName": "Humulus lupulus",
        "description": "The Hops is a user-friendly outdoor plant. It brings fast growth to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Sleep",
            "Beer"
        ],
        "advantages": [
            "Fast growth",
            "Cones"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20+ Years"
    },
    {
        "id": "mock_318",
        "name": "Virginia Creeper",
        "scientificName": "Parthenocissus quinquefolia",
        "description": "The Virginia Creeper is a user-friendly outdoor plant. It brings red fall color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Shade",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red fall color",
            "Native"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30+ Years"
    },
    {
        "id": "mock_319",
        "name": "Boston Ivy",
        "scientificName": "Parthenocissus tricuspidata",
        "description": "The Boston Ivy is a user-friendly outdoor plant. It brings covers universities to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Shade",
        "oxygenLevel": "70 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Covers universities",
            "Polished"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_320",
        "name": "Agapanthus",
        "scientificName": "Agapanthus africanus",
        "description": "The Agapanthus is a user-friendly outdoor plant. It brings lily of nile to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Lily of Nile",
            "Blue balls"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_321",
        "name": "Red Hot Poker",
        "scientificName": "Kniphofia",
        "description": "The Red Hot Poker is a user-friendly outdoor plant. It brings torch flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Torch flowers",
            "Hummingbirds"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_322",
        "name": "Sea Holly",
        "scientificName": "Eryngium",
        "description": "The Sea Holly is a user-friendly outdoor plant. It brings metallic blue to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Root edible"
        ],
        "advantages": [
            "Metallic blue",
            "Spiky"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_323",
        "name": "Globe Thistle",
        "scientificName": "Echinops",
        "description": "The Globe Thistle is a user-friendly outdoor plant. It brings perfect balls to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Perfect balls",
            "Bees love"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_324",
        "name": "Russian Sage",
        "scientificName": "Perovskia atriplicifolia",
        "description": "The Russian Sage is a user-friendly outdoor plant. It brings haze of blue to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Fever"
        ],
        "advantages": [
            "Haze of blue",
            "Tough"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_325",
        "name": "Butterfly Bush",
        "scientificName": "Buddleja davidii",
        "description": "The Butterfly Bush is a user-friendly outdoor plant. It brings pollinator magnet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pollinator magnet",
            "Honey scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_326",
        "name": "Smoke Bush",
        "scientificName": "Cotinus coggygria",
        "description": "The Smoke Bush is a user-friendly outdoor plant. It brings purple fog effect to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Yellow dye"
        ],
        "advantages": [
            "Purple fog effect",
            "Dark leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_327",
        "name": "Beautyberry",
        "scientificName": "Callicarpa",
        "description": "The Beautyberry is a user-friendly outdoor plant. It brings metallic purple berries to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Insect repellent"
        ],
        "advantages": [
            "Metallic purple berries",
            "Native"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30 Years"
    },
    {
        "id": "mock_328",
        "name": "Witch Hazel",
        "scientificName": "Hamamelis",
        "description": "The Witch Hazel is a user-friendly outdoor plant. It brings winter bloom to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Skin toner"
        ],
        "advantages": [
            "Winter bloom",
            "Spidery"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_329",
        "name": "Winter Sweet",
        "scientificName": "Chimonanthus praecox",
        "description": "The Winter Sweet is a user-friendly outdoor plant. It brings intense winter scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Oil"
        ],
        "advantages": [
            "Intense winter scent",
            "Translucent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_330",
        "name": "Edgeworthia (Paper Bush)",
        "scientificName": "Edgeworthia chrysantha",
        "description": "The Edgeworthia (Paper Bush) is a user-friendly outdoor plant. It brings yellow pom-poms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Paper making"
        ],
        "advantages": [
            "Yellow pom-poms",
            "Scented"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30 Years"
    },
    {
        "id": "mock_331",
        "name": "Harry Lauder's Walking Stick",
        "scientificName": "Corylus avellana 'Contorta'",
        "description": "The Harry Lauder's Walking Stick is a user-friendly outdoor plant. It brings twisted branches to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Nuts"
        ],
        "advantages": [
            "Twisted branches",
            "Winter interest"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_332",
        "name": "Pussy Willow",
        "scientificName": "Salix discolor",
        "description": "The Pussy Willow is a user-friendly outdoor plant. It brings fuzzy catkins to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Aspirin"
        ],
        "advantages": [
            "Fuzzy catkins",
            "Spring sign"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30 Years"
    },
    {
        "id": "mock_333",
        "name": "Mimosa Tree (Silk Tree)",
        "scientificName": "Albizia julibrissin",
        "description": "The Mimosa Tree (Silk Tree) is a user-friendly outdoor plant. It brings pink puffs to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "80 L/day",
        "medicinalValues": [
            "Calming tea"
        ],
        "advantages": [
            "Pink puffs",
            "Ferny"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20 Years"
    },
    {
        "id": "mock_334",
        "name": "Empress Tree",
        "scientificName": "Paulownia tomentosa",
        "description": "The Empress Tree is a user-friendly outdoor plant. It brings fastest growing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "150 L/day",
        "medicinalValues": [
            "Wood"
        ],
        "advantages": [
            "Fastest growing",
            "Purple flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "70 Years"
    },
    {
        "id": "mock_335",
        "name": "Tree Fern",
        "scientificName": "Dicksonia antarctica",
        "description": "The Tree Fern is a user-friendly outdoor plant. It brings prehistoric to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade/Wet",
        "oxygenLevel": "100 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Prehistoric",
            "Trunk is roots"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "500 Years"
    },
    {
        "id": "mock_336",
        "name": "Gunnera (Dino Food)",
        "scientificName": "Gunnera manicata",
        "description": "The Gunnera (Dino Food) is a user-friendly outdoor plant. It brings leaves usually 6ft wide to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Wet Sun",
        "oxygenLevel": "120 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Leaves usually 6ft wide",
            "Giant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_337",
        "name": "Rhubarb",
        "scientificName": "Rheum rhabarbarum",
        "description": "The Rhubarb is a user-friendly outdoor plant. It brings edible stalks to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Laxative root"
        ],
        "advantages": [
            "Edible stalks",
            "Huge leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_338",
        "name": "Artichoke",
        "scientificName": "Cynara cardunculus",
        "description": "The Artichoke is a user-friendly outdoor plant. It brings edible bud to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Liver health"
        ],
        "advantages": [
            "Edible bud",
            "Thistle flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5 Years"
    },
    {
        "id": "mock_339",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "The Prayer Plant is a user-friendly indoor plant. It brings leaves fold at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low/Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Leaves fold at night",
            "Patterned foliage"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_340",
        "name": "Fishbone Prayer Plant",
        "scientificName": "Ctenanthe burle-marxii",
        "description": "The Fishbone Prayer Plant is a user-friendly indoor plant. It brings herringbone pattern to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low/Indirect",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Herringbone pattern",
            "Air purifier"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_341",
        "name": "Triostar",
        "scientificName": "Stromanthe sanguinea",
        "description": "The Triostar is a user-friendly indoor plant. It brings pink variegation to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pink variegation",
            "Dramatic"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_342",
        "name": "Watermelon Peperomia",
        "scientificName": "Peperomia argyreia",
        "description": "The Watermelon Peperomia is a user-friendly indoor plant. It brings leaves look like watermelon to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Leaves look like watermelon",
            "Compact"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_343",
        "name": "Chinese Money Plant",
        "scientificName": "Pilea peperomioides",
        "description": "The Chinese Money Plant is a user-friendly indoor plant. It brings round coin leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Round coin leaves",
            "Good luck"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_344",
        "name": "Inch Plant",
        "scientificName": "Tradescantia zebrina",
        "description": "The Inch Plant is a user-friendly indoor plant. It brings fast growing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Anti-inflammatory (Folk)"
        ],
        "advantages": [
            "Fast growing",
            "Purple stripes"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_345",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "The Cast Iron Plant is a user-friendly indoor plant. It brings indestructible to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Indestructible",
            "Low light tolerant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_346",
        "name": "Raven ZZ",
        "scientificName": "Zamioculcas zamiifolia 'Raven'",
        "description": "The Raven ZZ is a user-friendly indoor plant. It brings black leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to Bright",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Black leaves",
            "Drought tolerant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_347",
        "name": "Chinese Evergreen",
        "scientificName": "Aglaonema modestum",
        "description": "The Chinese Evergreen is a user-friendly indoor plant. It brings variegated leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low/Medium",
        "oxygenLevel": "38 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Variegated leaves",
            "Beginner friendly"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_348",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "The Dumb Cane is a user-friendly indoor plant. It brings large tropical leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Toxic sap"
        ],
        "advantages": [
            "Large tropical leaves",
            "Air purifying"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_349",
        "name": "Philodendron Birkin",
        "scientificName": "Philodendron 'Birkin'",
        "description": "The Philodendron Birkin is a user-friendly indoor plant. It brings pinstripe variegation to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright Indirect",
        "oxygenLevel": "42 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Pinstripe variegation",
            "Self-heading"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_350",
        "name": "Velvet Leaf Philodendron",
        "scientificName": "Philodendron micans",
        "description": "The Velvet Leaf Philodendron is a user-friendly indoor plant. It brings velvety texture to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Velvety texture",
            "Bronze color"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_351",
        "name": "Neon Pothos",
        "scientificName": "Epipremnum aureum 'Neon'",
        "description": "The Neon Pothos is a user-friendly indoor plant. It brings bright neon color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium/Low",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Bright neon color",
            "Vining"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_352",
        "name": "Satin Pothos",
        "scientificName": "Scindapsus pictus",
        "description": "The Satin Pothos is a user-friendly indoor plant. It brings silver spots to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "36 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Silver spots",
            "Matte texture"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_353",
        "name": "Weeping Fig",
        "scientificName": "Ficus benjamina",
        "description": "The Weeping Fig is a user-friendly indoor plant. It brings tree-like to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "LatEx allergy warning"
        ],
        "advantages": [
            "Tree-like",
            "Elegant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40 Years"
    },
    {
        "id": "mock_354",
        "name": "Ruby Rubber Plant",
        "scientificName": "Ficus elastica 'Ruby'",
        "description": "The Ruby Rubber Plant is a user-friendly indoor plant. It brings pink/red variation to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "65 L/day",
        "medicinalValues": [
            "Latex"
        ],
        "advantages": [
            "Pink/Red variation",
            "Glossy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_355",
        "name": "Dragon Tree",
        "scientificName": "Dracaena marginata",
        "description": "The Dragon Tree is a user-friendly indoor plant. It brings spiky silhouette to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spiky silhouette",
            "Modern look"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40 Years"
    },
    {
        "id": "mock_356",
        "name": "Corn Plant",
        "scientificName": "Dracaena fragrans",
        "description": "The Corn Plant is a user-friendly indoor plant. It brings thick trunk to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Thick trunk",
            "Striped leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "40 Years"
    },
    {
        "id": "mock_357",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "The Ponytail Palm is a user-friendly indoor plant. It brings bulbous trunk to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bulbous trunk",
            "Curly leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_358",
        "name": "Spineless Yucca",
        "scientificName": "Yucca elephantipes",
        "description": "The Spineless Yucca is a user-friendly indoor plant. It brings architectural to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Edible flowers"
        ],
        "advantages": [
            "Architectural",
            "Hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "40 Years"
    },
    {
        "id": "mock_359",
        "name": "Norfolk Island Pine",
        "scientificName": "Araucaria heterophylla",
        "description": "The Norfolk Island Pine is a user-friendly indoor plant. It brings living christmas tree to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Living Christmas tree",
            "Soft needles"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "150 Years"
    },
    {
        "id": "mock_360",
        "name": "Thanksgiving Cactus",
        "scientificName": "Schlumbergera truncata",
        "description": "The Thanksgiving Cactus is a user-friendly indoor plant. It brings winter blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Indirect",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Winter blooms",
            "Epiphytic"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_361",
        "name": "Wax Plant",
        "scientificName": "Hoya carnosa",
        "description": "The Wax Plant is a user-friendly indoor plant. It brings porcelain flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Porcelain flowers",
            "Sweet scent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "30 Years"
    },
    {
        "id": "mock_362",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "The String of Pearls is a user-friendly indoor plant. It brings trailing beads to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Toxic if eaten"
        ],
        "advantages": [
            "Trailing beads",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10 Years"
    },
    {
        "id": "mock_363",
        "name": "Burro's Tail",
        "scientificName": "Sedum morganianum",
        "description": "The Burro's Tail is a user-friendly indoor plant. It brings trailing tails to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Trailing tails",
            "Succulent"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "15 Years"
    },
    {
        "id": "mock_364",
        "name": "Japanese Maple",
        "scientificName": "Acer palmatum",
        "description": "The Japanese Maple is a user-friendly outdoor plant. It brings red foliage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Traditional tonic"
        ],
        "advantages": [
            "Red foliage",
            "Bonsai favorite"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_365",
        "name": "Eastern Redbud",
        "scientificName": "Cercis canadensis",
        "description": "The Eastern Redbud is a user-friendly outdoor plant. It brings pink flowers on bark to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Astringent bark"
        ],
        "advantages": [
            "Pink flowers on bark",
            "Heart leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_366",
        "name": "Flowering Dogwood",
        "scientificName": "Cornus florida",
        "description": "The Flowering Dogwood is a user-friendly outdoor plant. It brings white bracts to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Quinine substitute"
        ],
        "advantages": [
            "White bracts",
            "Red berries"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "80 Years"
    },
    {
        "id": "mock_367",
        "name": "Southern Magnolia",
        "scientificName": "Magnolia grandiflora",
        "description": "The Southern Magnolia is a user-friendly outdoor plant. It brings giant white flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Part Shade",
        "oxygenLevel": "110 L/day",
        "medicinalValues": [
            "Bark tonic"
        ],
        "advantages": [
            "Giant white flowers",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "120 Years"
    },
    {
        "id": "mock_368",
        "name": "Tulip Poplar",
        "scientificName": "Liriodendron tulipifera",
        "description": "The Tulip Poplar is a user-friendly outdoor plant. It brings tulip-shaped flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "140 L/day",
        "medicinalValues": [
            "Root stimulant"
        ],
        "advantages": [
            "Tulip-shaped flowers",
            "Tailored leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "250 Years"
    },
    {
        "id": "mock_369",
        "name": "Live Oak",
        "scientificName": "Quercus virginiana",
        "description": "The Live Oak is a user-friendly outdoor plant. It brings massive canopy to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "Astringent galls"
        ],
        "advantages": [
            "Massive canopy",
            "Spanish moss host"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "500 Years"
    },
    {
        "id": "mock_370",
        "name": "Longleaf Pine",
        "scientificName": "Pinus palustris",
        "description": "The Longleaf Pine is a user-friendly outdoor plant. It brings long needles to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "130 L/day",
        "medicinalValues": [
            "Turpentine"
        ],
        "advantages": [
            "Long needles",
            "Fire resistant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "300 Years"
    },
    {
        "id": "mock_371",
        "name": "Bald Cypress",
        "scientificName": "Taxodium distichum",
        "description": "The Bald Cypress is a user-friendly outdoor plant. It brings knees (roots) to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Wet/Sun",
        "oxygenLevel": "125 L/day",
        "medicinalValues": [
            "Resin for wounds"
        ],
        "advantages": [
            "Knees (roots)",
            "Deciduous conifer"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "600 Years"
    },
    {
        "id": "mock_372",
        "name": "Maidenhair Tree",
        "scientificName": "Ginkgo biloba",
        "description": "The Maidenhair Tree is a user-friendly outdoor plant. It brings living fossil to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "90 L/day",
        "medicinalValues": [
            "Memory aid"
        ],
        "advantages": [
            "Living fossil",
            "Fan leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1000 Years"
    },
    {
        "id": "mock_373",
        "name": "Dawn Redwood",
        "scientificName": "Metasequoia glyptostroboides",
        "description": "The Dawn Redwood is a user-friendly outdoor plant. It brings ancient lineage to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "135 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Ancient lineage",
            "Fast growing"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "600 Years"
    },
    {
        "id": "mock_374",
        "name": "River Birch",
        "scientificName": "Betula nigra",
        "description": "The River Birch is a user-friendly outdoor plant. It brings peeling bark to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "65 L/day",
        "medicinalValues": [
            "Sap vinegar"
        ],
        "advantages": [
            "Peeling bark",
            "Wet soil lover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "70 Years"
    },
    {
        "id": "mock_375",
        "name": "Weeping Willow",
        "scientificName": "Salix babylonica",
        "description": "The Weeping Willow is a user-friendly outdoor plant. It brings dramatic sweep to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "85 L/day",
        "medicinalValues": [
            "Salicylic acid"
        ],
        "advantages": [
            "Dramatic sweep",
            "Water lover"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_376",
        "name": "Eastern Red Cedar",
        "scientificName": "Juniperus virginiana",
        "description": "The Eastern Red Cedar is a user-friendly outdoor plant. It brings aromatic wood to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "70 L/day",
        "medicinalValues": [
            "Gin flavoring"
        ],
        "advantages": [
            "Aromatic wood",
            "Blue berries"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "150 Years"
    },
    {
        "id": "mock_377",
        "name": "American Holly",
        "scientificName": "Ilex opaca",
        "description": "The American Holly is a user-friendly outdoor plant. It brings red berries to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun/Shade",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "Tea (Caution)"
        ],
        "advantages": [
            "Red berries",
            "Spiky evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_378",
        "name": "Bigleaf Hydrangea",
        "scientificName": "Hydrangea macrophylla",
        "description": "The Bigleaf Hydrangea is a user-friendly outdoor plant. It brings color changes w/ ph to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Diuretic root"
        ],
        "advantages": [
            "Color changes w/ pH",
            "Big balls"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_379",
        "name": "Oakleaf Hydrangea",
        "scientificName": "Hydrangea quercifolia",
        "description": "The Oakleaf Hydrangea is a user-friendly outdoor plant. It brings native to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "42 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Native",
            "Cone flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_380",
        "name": "Southern Azalea",
        "scientificName": "Rhododendron indicum",
        "description": "The Southern Azalea is a user-friendly outdoor plant. It brings spring show to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Shade",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Toxic"
        ],
        "advantages": [
            "Spring show",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_381",
        "name": "Camellia",
        "scientificName": "Camellia japonica",
        "description": "The Camellia is a user-friendly outdoor plant. It brings winter rose to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Tea oil"
        ],
        "advantages": [
            "Winter rose",
            "Glossy leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_382",
        "name": "Gardenia",
        "scientificName": "Gardenia jasminoides",
        "description": "The Gardenia is a user-friendly outdoor plant. It brings intense scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Part Sun",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Fruit dye"
        ],
        "advantages": [
            "Intense scent",
            "Creamy flowers"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_383",
        "name": "Crape Myrtle",
        "scientificName": "Lagerstroemia indica",
        "description": "The Crape Myrtle is a user-friendly outdoor plant. It brings summer bloom to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Summer bloom",
            "Peeling bark"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50 Years"
    },
    {
        "id": "mock_384",
        "name": "Chinese Wisteria",
        "scientificName": "Wisteria sinensis",
        "description": "The Chinese Wisteria is a user-friendly outdoor plant. It brings cascading purple to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "75 L/day",
        "medicinalValues": [
            "Toxic seeds"
        ],
        "advantages": [
            "Cascading purple",
            "Vigorous"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100 Years"
    },
    {
        "id": "mock_385",
        "name": "Passion Flower",
        "scientificName": "Passiflora incarnata",
        "description": "The Passion Flower is a user-friendly outdoor plant. It brings alien flower to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Calmative"
        ],
        "advantages": [
            "Alien flower",
            "Edible fruit"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_386",
        "name": "Coral Honeysuckle",
        "scientificName": "Lonicera sempervirens",
        "description": "The Coral Honeysuckle is a user-friendly outdoor plant. It brings hummingbird magnet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Hummingbird magnet",
            "Native"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_387",
        "name": "Carolina Jessamine",
        "scientificName": "Gelsemium sempervirens",
        "description": "The Carolina Jessamine is a user-friendly outdoor plant. It brings yellow trumpets to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "32 L/day",
        "medicinalValues": [
            "Toxic"
        ],
        "advantages": [
            "Yellow trumpets",
            "Early bloom"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_388",
        "name": "Purple Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "The Purple Coneflower is a user-friendly outdoor plant. It brings butterfly magnet to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Immune boost"
        ],
        "advantages": [
            "Butterfly magnet",
            "Native"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    }
,
    {
        "id":  "mock_389",
        "name":  "Calathea Ornata",
        "scientificName":  "Calathea ornata",
        "description":  "The Calathea Ornata is a stunning indoor plant with pink striped leaves that fold up at night.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Low to medium (500-1500 Lux)",
        "oxygenLevel":  "22 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Prayer plant movement",
                           "Decorative foliage"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "2-5 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_390",
        "name":  "Aglaonema",
        "scientificName":  "Aglaonema commutatum",
        "description":  "The Aglaonema is a hardy indoor plant known for its colorful variegated leaves and air-purifying qualities.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Low to medium (300-1500 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Formaldehyde removal",
                                "Benzene removal"
                            ],
        "advantages":  [
                           "Low light tolerant",
                           "Colorful foliage"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_391",
        "name":  "Peperomia",
        "scientificName":  "Peperomia obtusifolia",
        "description":  "The Peperomia is a compact indoor plant with thick, glossy leaves perfect for small spaces.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  24,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1000-2000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Compact size",
                           "Low maintenance"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_392",
        "name":  "Hoya Carnosa",
        "scientificName":  "Hoya carnosa",
        "description":  "The Hoya Carnosa is a wax plant with fragrant star-shaped flowers and trailing vines.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Fragrant flowers",
                           "Trailing vine"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-30 Years"
    },
    {
        "id":  "mock_393",
        "name":  "Schefflera",
        "scientificName":  "Schefflera arboricola",
        "description":  "The Schefflera is an umbrella plant with glossy compound leaves that adapts well to indoor conditions.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  24,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Air toxin removal"
                            ],
        "advantages":  [
                           "Fast growing",
                           "Bushy appearance"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-25 Years"
    },
    {
        "id":  "mock_394",
        "name":  "Croton",
        "scientificName":  "Codiaeum variegatum",
        "description":  "The Croton is a vibrant indoor plant with multicolored leaves in red, orange, yellow, and green.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "25 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Colorful foliage",
                           "Tropical look"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-8 Years"
    },
    {
        "id":  "mock_395",
        "name":  "Syngonium",
        "scientificName":  "Syngonium podophyllum",
        "description":  "The Syngonium is an arrowhead vine with arrow-shaped leaves that change form as they mature.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Low to bright (500-2000 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Formaldehyde removal"
                            ],
        "advantages":  [
                           "Versatile growth",
                           "Easy propagation"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-15 Years"
    },
    {
        "id":  "mock_396",
        "name":  "Nerve Plant",
        "scientificName":  "Fittonia albivenis",
        "description":  "The Nerve Plant is a small indoor plant with intricate vein patterns on its colorful leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Low to medium (500-1500 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Compact size",
                           "Unique patterns"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "2-5 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_397",
        "name":  "Parlor Palm",
        "scientificName":  "Chamaedorea elegans",
        "description":  "The Parlor Palm is an elegant indoor palm that thrives in low light conditions.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Low to medium (500-1500 Lux)",
        "oxygenLevel":  "40 L/day",
        "medicinalValues":  [
                                "Air purification",
                                "Formaldehyde removal"
                            ],
        "advantages":  [
                           "Low light tolerant",
                           "Pet safe"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-20 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_398",
        "name":  "Cast Iron Plant",
        "scientificName":  "Aspidistra elatior",
        "description":  "The Cast Iron Plant is nearly indestructible, tolerating neglect and low light.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Low (200-1000 Lux)",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Extremely hardy",
                           "Low light champion"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "20-50 Years"
    },
    {
        "id":  "mock_399",
        "name":  "Dracaena Marginata",
        "scientificName":  "Dracaena marginata",
        "description":  "The Dracaena Marginata is a dragon tree with thin red-edged leaves on woody stems.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  24,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "30 L/day",
        "medicinalValues":  [
                                "Benzene removal",
                                "Trichloroethylene removal"
                            ],
        "advantages":  [
                           "Architectural form",
                           "Air purifier"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-15 Years"
    },
    {
        "id":  "mock_400",
        "name":  "Kentia Palm",
        "scientificName":  "Howea forsteriana",
        "description":  "The Kentia Palm is a graceful indoor palm with arching fronds perfect for large spaces.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Low to bright (500-2000 Lux)",
        "oxygenLevel":  "55 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Elegant appearance",
                           "Low maintenance"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "40-100 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_401",
        "name":  "Yucca",
        "scientificName":  "Yucca elephantipes",
        "description":  "The Yucca is a drought-tolerant indoor plant with sword-like leaves on a woody trunk.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  30,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-4000 Lux)",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Drought tolerant",
                           "Architectural"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "20-50 Years"
    },
    {
        "id":  "mock_402",
        "name":  "Ponytail Palm",
        "scientificName":  "Beaucarnea recurvata",
        "description":  "The Ponytail Palm is a unique succulent with a bulbous trunk and cascading leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Drought tolerant",
                           "Unique appearance"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "20-100 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_403",
        "name":  "Tradescantia",
        "scientificName":  "Tradescantia zebrina",
        "description":  "The Tradescantia is a wandering jew plant with purple and silver striped trailing leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Fast growing",
                           "Colorful foliage"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "2-5 Years"
    },
    {
        "id":  "mock_404",
        "name":  "Oxalis",
        "scientificName":  "Oxalis triangularis",
        "description":  "The Oxalis is a shamrock plant with purple triangular leaves that fold at night.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  24,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Unique purple color",
                           "Delicate flowers"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_405",
        "name":  "Stromanthe",
        "scientificName":  "Stromanthe sanguinea",
        "description":  "The Stromanthe is a prayer plant with stunning pink and green variegated leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Medium (1000-2000 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Colorful undersides",
                           "Prayer movement"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-10 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_406",
        "name":  "Alocasia",
        "scientificName":  "Alocasia amazonica",
        "description":  "The Alocasia is an elephant ear plant with dramatic arrow-shaped leaves and white veins.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "28 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Dramatic foliage",
                           "Tropical look"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_407",
        "name":  "Begonia Rex",
        "scientificName":  "Begonia rex-cultorum",
        "description":  "The Begonia Rex is a painted-leaf begonia with spectacular multicolored foliage patterns.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Medium (1000-2000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Stunning foliage",
                           "Compact size"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "2-5 Years"
    },
    {
        "id":  "mock_408",
        "name":  "Columnea",
        "scientificName":  "Columnea gloriosa",
        "description":  "The Columnea is a goldfish plant with tubular orange flowers resembling goldfish.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique flowers",
                           "Trailing habit"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_409",
        "name":  "Ctenanthe",
        "scientificName":  "Ctenanthe burle-marxii",
        "description":  "The Ctenanthe is a fishbone prayer plant with herringbone patterned leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Medium (1000-2000 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique patterns",
                           "Prayer movement"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-8 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_410",
        "name":  "Pilea Cadierei",
        "scientificName":  "Pilea cadierei",
        "description":  "The Pilea Cadierei is an aluminum plant with silver-marked leaves creating a metallic effect.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Metallic appearance",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-5 Years"
    },
    {
        "id":  "mock_411",
        "name":  "Episcia",
        "scientificName":  "Episcia cupreata",
        "description":  "The Episcia is a flame violet with velvety leaves and bright tubular flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Medium (1000-2000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Colorful flowers",
                           "Trailing habit"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "2-5 Years"
    },
    {
        "id":  "mock_412",
        "name":  "Rhipsalis",
        "scientificName":  "Rhipsalis baccifera",
        "description":  "The Rhipsalis is a mistletoe cactus with trailing cylindrical stems and small berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique form",
                           "Low maintenance"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-20 Years"
    },
    {
        "id":  "mock_413",
        "name":  "Haworthia",
        "scientificName":  "Haworthia fasciata",
        "description":  "The Haworthia is a zebra plant succulent with white striped leaves in a rosette form.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Compact size",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-50 Years",
        "petFriendly":  true
    },
    {
        "id":  "mock_414",
        "name":  "Echeveria",
        "scientificName":  "Echeveria elegans",
        "description":  "The Echeveria is a hen and chicks succulent with rosette-shaped powdery blue-green leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Sculptural form",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-10 Years"
    },
    {
        "id":  "mock_415",
        "name":  "Sedum",
        "scientificName":  "Sedum morganianum",
        "description":  "The Sedum is a burro\u0027s tail succulent with trailing stems covered in plump leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Trailing habit",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_416",
        "name":  "Crassula Ovata Gollum",
        "scientificName":  "Crassula ovata \u0027Gollum\u0027",
        "description":  "The Crassula Ovata Gollum is a jade plant with tubular finger-like leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique form",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "20-70 Years"
    },
    {
        "id":  "mock_417",
        "name":  "Senecio Rowleyanus",
        "scientificName":  "Senecio rowleyanus",
        "description":  "The Senecio Rowleyanus is a string of pearls succulent with bead-like leaves on trailing stems.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  24,
        "minHumidity":  30,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Unique appearance",
                           "Trailing habit"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-5 Years"
    },
    {
        "id":  "mock_418",
        "name":  "Ceropegia Woodii",
        "scientificName":  "Ceropegia woodii",
        "description":  "The Ceropegia Woodii is a string of hearts with heart-shaped leaves on delicate trailing vines.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Romantic appearance",
                           "Easy propagation"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_419",
        "name":  "Lithops",
        "scientificName":  "Lithops species",
        "description":  "The Lithops are living stones that mimic pebbles with their unique succulent form.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  30,
        "minHumidity":  20,
        "sunlight":  "Bright direct (2500-4000 Lux)",
        "oxygenLevel":  "5 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Unique camouflage",
                           "Minimal care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-50 Years"
    },
    {
        "id":  "mock_420",
        "name":  "Kalanchoe Tomentosa",
        "scientificName":  "Kalanchoe tomentosa",
        "description":  "The Kalanchoe Tomentosa is a panda plant with fuzzy silver leaves edged in brown.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Fuzzy texture",
                           "Compact size"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_421",
        "name":  "Gasteria",
        "scientificName":  "Gasteria species",
        "description":  "The Gasteria is an ox tongue succulent with thick tongue-shaped leaves in a rosette.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Low light tolerant",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-30 Years"
    },
    {
        "id":  "mock_422",
        "name":  "Crassula Perforata",
        "scientificName":  "Crassula perforata",
        "description":  "The Crassula Perforata is a string of buttons succulent with stacked triangular leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Architectural form",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-15 Years"
    },
    {
        "id":  "mock_423",
        "name":  "Sempervivum",
        "scientificName":  "Sempervivum tectorum",
        "description":  "The Sempervivum is a houseleek succulent with rosettes that produce offsets freely.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Traditional wound healing"
                            ],
        "advantages":  [
                           "Cold hardy",
                           "Self-propagating"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "3-5 Years"
    },
    {
        "id":  "mock_424",
        "name":  "Aeonium",
        "scientificName":  "Aeonium arboreum",
        "description":  "The Aeonium is a tree houseleek with rosettes of fleshy leaves on branching stems.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Architectural form",
                           "Colorful varieties"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_425",
        "name":  "Graptoveria",
        "scientificName":  "Graptoveria \u0027Fred Ives\u0027",
        "description":  "The Graptoveria is a hybrid succulent with colorful rosettes that change with sun exposure.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Color changing",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_426",
        "name":  "Pachyphytum",
        "scientificName":  "Pachyphytum oviferum",
        "description":  "The Pachyphytum is a moonstones succulent with plump egg-shaped leaves covered in powder.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique appearance",
                           "Compact size"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_427",
        "name":  "Adromischus",
        "scientificName":  "Adromischus cristatus",
        "description":  "The Adromischus is a crinkle-leaf plant with wavy-edged succulent leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "8 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Unique texture",
                           "Compact size"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-15 Years"
    },
    {
        "id":  "mock_428",
        "name":  "Cotyledon",
        "scientificName":  "Cotyledon tomentosa",
        "description":  "The Cotyledon is a bear\u0027s paw succulent with fuzzy paw-shaped leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Adorable appearance",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_429",
        "name":  "Senecio Serpens",
        "scientificName":  "Senecio serpens",
        "description":  "The Senecio Serpens is a blue chalksticks succulent with cylindrical blue-gray leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Unique color",
                           "Spreading habit"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_430",
        "name":  "Portulacaria Afra",
        "scientificName":  "Portulacaria afra",
        "description":  "The Portulacaria Afra is an elephant bush with small round leaves on red stems.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Air purification",
                                "Carbon sequestration"
                            ],
        "advantages":  [
                           "Fast growing",
                           "Bonsai potential"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-30 Years"
    },
    {
        "id":  "mock_431",
        "name":  "Crassula Muscosa",
        "scientificName":  "Crassula muscosa",
        "description":  "The Crassula Muscosa is a watch chain succulent with tightly packed scale-like leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Air cleaning"
                            ],
        "advantages":  [
                           "Unique texture",
                           "Compact growth"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-15 Years"
    },
    {
        "id":  "mock_432",
        "name":  "Aloe Aristata",
        "scientificName":  "Aloe aristata",
        "description":  "The Aloe Aristata is a lace aloe with white-spotted leaves forming tight rosettes.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  13,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Compact size",
                           "Easy flowering"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-20 Years"
    },
    {
        "id":  "mock_433",
        "name":  "Sansevieria Cylindrica",
        "scientificName":  "Sansevieria cylindrica",
        "description":  "The Sansevieria Cylindrica is a cylindrical snake plant with round spear-like leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  30,
        "minHumidity":  30,
        "sunlight":  "Low to bright (250-2000 Lux)",
        "oxygenLevel":  "28 L/day",
        "medicinalValues":  [
                                "Air purification",
                                "Oxygen at night"
                            ],
        "advantages":  [
                           "Architectural form",
                           "Extremely hardy"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-25 Years"
    },
    {
        "id":  "mock_434",
        "name":  "Euphorbia Trigona",
        "scientificName":  "Euphorbia trigona",
        "description":  "The Euphorbia Trigona is an African milk tree with triangular stems and small leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  30,
        "sunlight":  "Bright direct (2000-3000 Lux)",
        "oxygenLevel":  "25 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Fast growing",
                           "Architectural"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-30 Years"
    },
    {
        "id":  "mock_435",
        "name":  "Zamioculcas Raven",
        "scientificName":  "Zamioculcas zamiifolia \u0027Raven\u0027",
        "description":  "The Zamioculcas Raven is a black ZZ plant with dark purple-black glossy leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  30,
        "minHumidity":  30,
        "sunlight":  "Low to bright (100-2000 Lux)",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Dramatic color",
                           "Extremely hardy"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_436",
        "name":  "Scindapsus Pictus",
        "scientificName":  "Scindapsus pictus",
        "description":  "The Scindapsus Pictus is a satin pothos with heart-shaped leaves splashed with silver.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Low to medium (500-1500 Lux)",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Silvery foliage",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_437",
        "name":  "Monstera Adansonii",
        "scientificName":  "Monstera adansonii",
        "description":  "The Monstera Adansonii is a Swiss cheese vine with perforated heart-shaped leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  18,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique fenestrations",
                           "Vining habit"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-40 Years"
    },
    {
        "id":  "mock_438",
        "name":  "Philodendron Birkin",
        "scientificName":  "Philodendron \u0027Birkin\u0027",
        "description":  "The Philodendron Birkin is a variegated philodendron with white pinstripes on dark green leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  16,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Bright indirect (1500-2500 Lux)",
        "oxygenLevel":  "25 L/day",
        "medicinalValues":  [
                                "Air purification"
                            ],
        "advantages":  [
                           "Unique variegation",
                           "Compact growth"
                       ],
        "price":  25,
        "type":  "indoor",
        "lifespan":  "10-20 Years"
    },
    {
        "id":  "mock_439",
        "name":  "Butterfly Bush",
        "scientificName":  "Buddleja davidii",
        "description":  "The Butterfly Bush is a flowering shrub that attracts butterflies with fragrant purple flower spikes.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun (6+ hours)",
        "oxygenLevel":  "45 L/day",
        "medicinalValues":  [
                                "Traditional wound healing"
                            ],
        "advantages":  [
                           "Butterfly magnet",
                           "Fragrant blooms"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "15-20 Years"
    },
    {
        "id":  "mock_440",
        "name":  "Forsythia",
        "scientificName":  "Forsythia × intermedia",
        "description":  "The Forsythia is an early spring bloomer with bright yellow flowers before leaves emerge.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "50 L/day",
        "medicinalValues":  [
                                "Anti-inflammatory (traditional)"
                            ],
        "advantages":  [
                           "Early spring color",
                           "Fast growing"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-30 Years"
    },
    {
        "id":  "mock_441",
        "name":  "Weigela",
        "scientificName":  "Weigela florida",
        "description":  "The Weigela is a flowering shrub with tubular pink flowers that attract hummingbirds.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "40 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Hummingbird attractor",
                           "Repeat bloomer"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-30 Years"
    },
    {
        "id":  "mock_442",
        "name":  "Spirea",
        "scientificName":  "Spiraea japonica",
        "description":  "The Spirea is a compact shrub with clusters of pink or white flowers and colorful foliage.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Traditional pain relief"
                            ],
        "advantages":  [
                           "Low maintenance",
                           "Colorful foliage"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "15-20 Years"
    },
    {
        "id":  "mock_443",
        "name":  "Viburnum",
        "scientificName":  "Viburnum opulus",
        "description":  "The Viburnum is a snowball bush with large white flower clusters and fall berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "55 L/day",
        "medicinalValues":  [
                                "Muscle relaxant (bark)"
                            ],
        "advantages":  [
                           "Fragrant flowers",
                           "Wildlife food"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-40 Years"
    },
    {
        "id":  "mock_444",
        "name":  "Potentilla",
        "scientificName":  "Potentilla fruticosa",
        "description":  "The Potentilla is a cinquefoil shrub with cheerful yellow flowers blooming all summer.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "30 L/day",
        "medicinalValues":  [
                                "Digestive aid (traditional)"
                            ],
        "advantages":  [
                           "Long blooming",
                           "Cold hardy"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "10-15 Years"
    },
    {
        "id":  "mock_445",
        "name":  "Deutzia",
        "scientificName":  "Deutzia gracilis",
        "description":  "The Deutzia is a slender shrub covered in white star-shaped flowers in spring.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Profuse blooms",
                           "Compact size"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "15-20 Years"
    },
    {
        "id":  "mock_446",
        "name":  "Mock Orange",
        "scientificName":  "Philadelphus coronarius",
        "description":  "The Mock Orange is a fragrant shrub with white flowers that smell like orange blossoms.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "50 L/day",
        "medicinalValues":  [
                                "Aromatherapy"
                            ],
        "advantages":  [
                           "Intense fragrance",
                           "Easy care"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-30 Years"
    },
    {
        "id":  "mock_447",
        "name":  "Ninebark",
        "scientificName":  "Physocarpus opulifolius",
        "description":  "The Ninebark is a native shrub with peeling bark and clusters of white or pink flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "45 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Four-season interest",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-30 Years"
    },
    {
        "id":  "mock_448",
        "name":  "Smokebush",
        "scientificName":  "Cotinus coggygria",
        "description":  "The Smokebush is a dramatic shrub with smoky pink plumes and purple foliage.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "40 L/day",
        "medicinalValues":  [
                                "Tannin source"
                            ],
        "advantages":  [
                           "Unique appearance",
                           "Fall color"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "30-50 Years"
    },
    {
        "id":  "mock_449",
        "name":  "Barberry",
        "scientificName":  "Berberis thunbergii",
        "description":  "The Barberry is a thorny shrub with colorful foliage and small red berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "30 L/day",
        "medicinalValues":  [
                                "Berberine compound"
                            ],
        "advantages":  [
                           "Deer resistant",
                           "Colorful foliage"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "15-20 Years"
    },
    {
        "id":  "mock_450",
        "name":  "Beautyberry",
        "scientificName":  "Callicarpa americana",
        "description":  "The Beautyberry is a native shrub with stunning purple berries in fall.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  50,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Insect repellent (traditional)"
                            ],
        "advantages":  [
                           "Purple berries",
                           "Wildlife food"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "10-15 Years"
    },
    {
        "id":  "mock_451",
        "name":  "Elderberry",
        "scientificName":  "Sambucus nigra",
        "description":  "The Elderberry is a fast-growing shrub with white flowers and edible dark berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  50,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "60 L/day",
        "medicinalValues":  [
                                "Immune support",
                                "Cold remedy"
                            ],
        "advantages":  [
                           "Edible berries",
                           "Medicinal"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "10-15 Years"
    },
    {
        "id":  "mock_452",
        "name":  "Serviceberry",
        "scientificName":  "Amelanchier canadensis",
        "description":  "The Serviceberry is a native tree with white spring flowers and edible berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "70 L/day",
        "medicinalValues":  [
                                "Antioxidant berries"
                            ],
        "advantages":  [
                           "Four-season beauty",
                           "Edible fruit"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-40 Years"
    },
    {
        "id":  "mock_453",
        "name":  "Redbud",
        "scientificName":  "Cercis canadensis",
        "description":  "The Redbud is a native tree with pink flowers blooming on bare branches in spring.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "80 L/day",
        "medicinalValues":  [
                                "Edible flowers"
                            ],
        "advantages":  [
                           "Early spring color",
                           "Heart-shaped leaves"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "50-70 Years"
    },
    {
        "id":  "mock_454",
        "name":  "Dogwood",
        "scientificName":  "Cornus florida",
        "description":  "The Dogwood is a flowering tree with showy white or pink bracts and red fall berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "90 L/day",
        "medicinalValues":  [
                                "Bark tonic (traditional)"
                            ],
        "advantages":  [
                           "Spring blooms",
                           "Fall color"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "80+ Years"
    },
    {
        "id":  "mock_455",
        "name":  "Crabapple",
        "scientificName":  "Malus species",
        "description":  "The Crabapple is a flowering tree with spring blossoms and small decorative fruits.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "100 L/day",
        "medicinalValues":  [
                                "Pectin source"
                            ],
        "advantages":  [
                           "Spring flowers",
                           "Wildlife food"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "30-70 Years"
    },
    {
        "id":  "mock_456",
        "name":  "Hawthorn",
        "scientificName":  "Crataegus monogyna",
        "description":  "The Hawthorn is a thorny tree with white flowers and red berries used medicinally.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "85 L/day",
        "medicinalValues":  [
                                "Heart health",
                                "Blood pressure"
                            ],
        "advantages":  [
                           "Medicinal berries",
                           "Wildlife habitat"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "100+ Years"
    },
    {
        "id":  "mock_457",
        "name":  "Japanese Maple",
        "scientificName":  "Acer palmatum",
        "description":  "The Japanese Maple is an ornamental tree with delicate lacy leaves in vibrant colors.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "75 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Stunning foliage",
                           "Compact varieties"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "60-100 Years"
    },
    {
        "id":  "mock_458",
        "name":  "Crepe Myrtle",
        "scientificName":  "Lagerstroemia indica",
        "description":  "The Crepe Myrtle is a summer-blooming tree with crinkled flowers and peeling bark.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  35,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "80 L/day",
        "medicinalValues":  [
                                "Diabetes management (research)"
                            ],
        "advantages":  [
                           "Long blooming",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "50+ Years"
    },
    {
        "id":  "mock_459",
        "name":  "Witch Hazel",
        "scientificName":  "Hamamelis virginiana",
        "description":  "The Witch Hazel is a native shrub with fragrant yellow flowers blooming in fall.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "45 L/day",
        "medicinalValues":  [
                                "Skin astringent",
                                "Anti-inflammatory"
                            ],
        "advantages":  [
                           "Medicinal extract",
                           "Fall bloomer"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "30-50 Years"
    },
    {
        "id":  "mock_460",
        "name":  "Sumac",
        "scientificName":  "Rhus typhina",
        "description":  "The Sumac is a staghorn shrub with fuzzy red fruit clusters and brilliant fall color.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "55 L/day",
        "medicinalValues":  [
                                "Antioxidant spice"
                            ],
        "advantages":  [
                           "Fall color",
                           "Drought tolerant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-30 Years"
    },
    {
        "id":  "mock_461",
        "name":  "Honeysuckle Vine",
        "scientificName":  "Lonicera periclymenum",
        "description":  "The Honeysuckle Vine is a climbing plant with fragrant tubular flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun to Part Shade",
        "oxygenLevel":  "40 L/day",
        "medicinalValues":  [
                                "Respiratory aid (traditional)"
                            ],
        "advantages":  [
                           "Fragrant flowers",
                           "Hummingbird attractor"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20+ Years"
    },
    {
        "id":  "mock_462",
        "name":  "Clematis",
        "scientificName":  "Clematis hybrids",
        "description":  "The Clematis is a flowering vine with large showy blooms in various colors.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Full Sun (roots shaded)",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "None (toxic)"
                            ],
        "advantages":  [
                           "Spectacular blooms",
                           "Vertical interest"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20-50 Years"
    },
    {
        "id":  "mock_463",
        "name":  "Wisteria",
        "scientificName":  "Wisteria sinensis",
        "description":  "The Wisteria is a vigorous vine with cascading purple flower clusters.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "60 L/day",
        "medicinalValues":  [
                                "None (toxic)"
                            ],
        "advantages":  [
                           "Dramatic blooms",
                           "Fragrant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "50-100 Years"
    },
    {
        "id":  "mock_464",
        "name":  "Trumpet Vine",
        "scientificName":  "Campsis radicans",
        "description":  "The Trumpet Vine is a vigorous climber with orange trumpet-shaped flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  35,
        "minHumidity":  40,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "50 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Hummingbird magnet",
                           "Fast growing"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20+ Years"
    },
    {
        "id":  "mock_465",
        "name":  "Virginia Creeper",
        "scientificName":  "Parthenocissus quinquefolia",
        "description":  "The Virginia Creeper is a native vine with five-leaflet leaves turning red in fall.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Sun to Shade",
        "oxygenLevel":  "45 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Fall color",
                           "Wildlife food"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20+ Years"
    },
    {
        "id":  "mock_466",
        "name":  "Boston Ivy",
        "scientificName":  "Parthenocissus tricuspidata",
        "description":  "The Boston Ivy is a clinging vine with three-lobed leaves and brilliant fall color.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  30,
        "minHumidity":  40,
        "sunlight":  "Sun to Part Shade",
        "oxygenLevel":  "50 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Wall coverage",
                           "Fall color"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "20+ Years"
    },
    {
        "id":  "mock_467",
        "name":  "Passionflower",
        "scientificName":  "Passiflora incarnata",
        "description":  "The Passionflower is an exotic vine with intricate purple and white flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  15,
        "idealTempMax":  30,
        "minHumidity":  50,
        "sunlight":  "Full Sun",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "Anxiety relief",
                                "Sleep aid"
                            ],
        "advantages":  [
                           "Unique flowers",
                           "Edible fruit"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "5-10 Years"
    },
    {
        "id":  "mock_468",
        "name":  "Climbing Hydrangea",
        "scientificName":  "Hydrangea anomala petiolaris",
        "description":  "The Climbing Hydrangea is a woody vine with white lace-cap flowers and peeling bark.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "55 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Shade tolerant",
                           "Fragrant flowers"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "50+ Years"
    },
    {
        "id":  "mock_469",
        "name":  "Coral Bells",
        "scientificName":  "Heuchera sanguinea",
        "description":  "The Coral Bells is a perennial with colorful foliage and delicate flower spikes.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Astringent (traditional)"
                            ],
        "advantages":  [
                           "Colorful foliage",
                           "Shade tolerant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "3-5 Years"
    },
    {
        "id":  "mock_470",
        "name":  "Hosta",
        "scientificName":  "Hosta species",
        "description":  "The Hosta is a shade-loving perennial with large decorative leaves and lavender flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "Edible shoots"
                            ],
        "advantages":  [
                           "Shade champion",
                           "Low maintenance"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_471",
        "name":  "Astilbe",
        "scientificName":  "Astilbe chinensis",
        "description":  "The Astilbe is a shade perennial with feathery plume-like flowers in pink or white.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Shade bloomer",
                           "Moisture loving"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_472",
        "name":  "Bleeding Heart",
        "scientificName":  "Lamprocapnos spectabilis",
        "description":  "The Bleeding Heart is a spring perennial with heart-shaped pink and white flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "20 L/day",
        "medicinalValues":  [
                                "None (toxic)"
                            ],
        "advantages":  [
                           "Unique flowers",
                           "Shade loving"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_473",
        "name":  "Columbine",
        "scientificName":  "Aquilegia species",
        "description":  "The Columbine is a woodland perennial with spurred flowers in various colors.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  40,
        "sunlight":  "Part Shade to Sun",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "None (toxic)"
                            ],
        "advantages":  [
                           "Hummingbird attractor",
                           "Self-seeding"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "3-5 Years"
    },
    {
        "id":  "mock_474",
        "name":  "Lungwort",
        "scientificName":  "Pulmonaria officinalis",
        "description":  "The Lungwort is a shade perennial with spotted leaves and pink-to-blue flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Respiratory aid (traditional)"
                            ],
        "advantages":  [
                           "Early bloomer",
                           "Spotted foliage"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_475",
        "name":  "Hellebore",
        "scientificName":  "Helleborus orientalis",
        "description":  "The Hellebore is a winter-blooming perennial with nodding cup-shaped flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "None (toxic)"
                            ],
        "advantages":  [
                           "Winter blooms",
                           "Evergreen"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_476",
        "name":  "Brunnera",
        "scientificName":  "Brunnera macrophylla",
        "description":  "The Brunnera is a Siberian bugloss with heart-shaped silver leaves and blue flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Silver foliage",
                           "Shade tolerant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_477",
        "name":  "Ferns (Mixed)",
        "scientificName":  "Various species",
        "description":  "Ferns are ancient shade-loving plants with delicate fronds in various forms.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  27,
        "minHumidity":  60,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "25 L/day",
        "medicinalValues":  [
                                "Some edible fiddleheads"
                            ],
        "advantages":  [
                           "Shade champion",
                           "Low maintenance"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_478",
        "name":  "Ligularia",
        "scientificName":  "Ligularia dentata",
        "description":  "The Ligularia is a bold perennial with large leaves and yellow daisy-like flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Part Shade",
        "oxygenLevel":  "30 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Bold foliage",
                           "Moisture loving"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_479",
        "name":  "Rodgersia",
        "scientificName":  "Rodgersia pinnata",
        "description":  "The Rodgersia is a dramatic perennial with large compound leaves and pink flower plumes.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "35 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Architectural foliage",
                           "Moisture loving"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_480",
        "name":  "Tiarella",
        "scientificName":  "Tiarella cordifolia",
        "description":  "The Tiarella is a foam flower with maple-like leaves and white flower spikes.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "Diuretic (traditional)"
                            ],
        "advantages":  [
                           "Groundcover",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_481",
        "name":  "Epimedium",
        "scientificName":  "Epimedium grandiflorum",
        "description":  "The Epimedium is a barrenwort with heart-shaped leaves and delicate spurred flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Libido enhancer (traditional)"
                            ],
        "advantages":  [
                           "Dry shade tolerant",
                           "Groundcover"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_482",
        "name":  "Solomon\u0027s Seal",
        "scientificName":  "Polygonatum biflorum",
        "description":  "The Solomon\u0027s Seal is a woodland perennial with arching stems and hanging white bells.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "Joint health (traditional)"
                            ],
        "advantages":  [
                           "Graceful form",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_483",
        "name":  "Trillium",
        "scientificName":  "Trillium grandiflorum",
        "description":  "The Trillium is a spring wildflower with three-petaled white flowers and three leaves.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  21,
        "minHumidity":  50,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Childbirth aid (traditional)"
                            ],
        "advantages":  [
                           "Native wildflower",
                           "Spring ephemeral"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_484",
        "name":  "Jack-in-the-Pulpit",
        "scientificName":  "Arisaema triphyllum",
        "description":  "The Jack-in-the-Pulpit is a unique woodland plant with a hooded flower and red berries.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "12 L/day",
        "medicinalValues":  [
                                "None (toxic raw)"
                            ],
        "advantages":  [
                           "Unique appearance",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_485",
        "name":  "Wild Ginger",
        "scientificName":  "Asarum canadense",
        "description":  "The Wild Ginger is a groundcover with heart-shaped leaves and hidden maroon flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Shade",
        "oxygenLevel":  "10 L/day",
        "medicinalValues":  [
                                "Ginger substitute (root)"
                            ],
        "advantages":  [
                           "Dense groundcover",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_486",
        "name":  "Bloodroot",
        "scientificName":  "Sanguinaria canadensis",
        "description":  "The Bloodroot is a spring ephemeral with white flowers and red-orange sap.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  7,
        "idealTempMax":  21,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "8 L/day",
        "medicinalValues":  [
                                "Dental health (traditional)"
                            ],
        "advantages":  [
                           "Early spring blooms",
                           "Native wildflower"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_487",
        "name":  "Virginia Bluebells",
        "scientificName":  "Mertensia virginica",
        "description":  "The Virginia Bluebells are spring ephemerals with pink buds opening to blue bell flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  21,
        "minHumidity":  50,
        "sunlight":  "Part Shade to Shade",
        "oxygenLevel":  "15 L/day",
        "medicinalValues":  [
                                "None"
                            ],
        "advantages":  [
                           "Spring color",
                           "Native wildflower"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    },
    {
        "id":  "mock_488",
        "name":  "Mayapple",
        "scientificName":  "Podophyllum peltatum",
        "description":  "The Mayapple is a woodland plant with umbrella-like leaves and hidden white flowers.",
        "imageUrl":  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format\u0026fit=crop\u0026q=80",
        "idealTempMin":  10,
        "idealTempMax":  24,
        "minHumidity":  60,
        "sunlight":  "Shade to Part Shade",
        "oxygenLevel":  "18 L/day",
        "medicinalValues":  [
                                "Cancer research compound"
                            ],
        "advantages":  [
                           "Groundcover",
                           "Native plant"
                       ],
        "price":  25,
        "type":  "outdoor",
        "lifespan":  "Perennial"
    }
];

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

