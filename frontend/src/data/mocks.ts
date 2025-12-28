import type { Plant, Vendor } from '../types';

export const PLANTS: Plant[] = [
    {
        "id": "mock_1",
        "name": "Snake Plant",
        "scientificName": "Sansevieria trifasciata",
        "description": "The Snake Plant is a user-friendly indoor plant. It brings produces oxygen at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to bright (250-2000 Lux)",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Air purification",
            "Minor wound healing"
        ],
        "advantages": [
            "Produces Oxygen at Night",
            "Hard to kill"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Partial Shade (500-1500 Lux)",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Air cleaning",
            "Non-toxic"
        ],
        "advantages": [
            "Pet safe",
            "Easy propagation"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade (250-1000 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Removes ammonia",
            "Air purifying"
        ],
        "advantages": [
            "Visual watering signal",
            "blooms in shade"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright direct (2000+ Lux)",
        "oxygenLevel": "28 L/day",
        "medicinalValues": [
            "Burns healing",
            "Skin hydration"
        ],
        "advantages": [
            "Medicinal gel",
            "Succulent"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to bright (250-1500 Lux)",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Formaldehyde removal"
        ],
        "advantages": [
            "Fast growing vine",
            "Low maintenance"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1000-2000 Lux)",
        "oxygenLevel": "45 L/day",
        "medicinalValues": [
            "Anti-inflammatory properties"
        ],
        "advantages": [
            "Glossy large leaves",
            "Statement piece"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "15-25 Years"
    },
    {
        "id": "mock_7",
        "name": "Monstera",
        "scientificName": "Monstera deliciosa",
        "description": "The Monstera is a user-friendly indoor plant. It brings iconic split leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1000-2500 Lux)",
        "oxygenLevel": "50 L/day",
        "medicinalValues": [
            "Root used for snakebites (traditional)"
        ],
        "advantages": [
            "Iconic split leaves",
            "Tropical vibe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_8",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "The ZZ Plant is a user-friendly indoor plant. It brings thrives in darkness to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low (100-1000 Lux)",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Thrives in darkness",
            "Drought tolerant"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1000-1500 Lux)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Natural humidifier"
        ],
        "advantages": [
            "Lush foliage",
            "Pet safe"
        ],
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
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Medium (500-1500 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Cough relief (extract)"
        ],
        "advantages": [
            "Climbing",
            "Mold reduction"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright filtered (1500-2500 Lux)",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Toxin removal"
        ],
        "advantages": [
            "Pet safe",
            "Tropical look"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1500-3000 Lux)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Architectural shape",
            "Huge leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "25-50 Years"
    },
    {
        "id": "mock_13",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "The Jade Plant is a user-friendly indoor plant. It brings symbol of luck to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Direct Sun (3000+ Lux)",
        "oxygenLevel": "15 L/day",
        "medicinalValues": [
            "Wart removal (folk)"
        ],
        "advantages": [
            "Symbol of luck",
            "Long lived"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1000 Lux)",
        "oxygenLevel": "18 L/day",
        "medicinalValues": [
            "Traditional TCM uses"
        ],
        "advantages": [
            "Unique round leaves",
            "Easy to gift"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "High/Direct (3000+ Lux)",
        "oxygenLevel": "55 L/day",
        "medicinalValues": [
            "None suitable for home use"
        ],
        "advantages": [
            "Exotic flowers",
            "Large leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_16",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "The Dumb Cane is a user-friendly indoor plant. It brings beautiful patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to Medium (500-1500 Lux)",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Beautiful patterns",
            "Full foliage"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low/Shade (500 Lux)",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Leaves move at night",
            "Colorful veins"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (2000 Lux)",
        "oxygenLevel": "12 L/day",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique bead shape",
            "Hanging visual"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Low to bright (250-1500 Lux)",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Heart shaped leaves",
            "Very hardy"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Bright indirect (1500 Lux)",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Long lasting flowers",
            "Waxy look"
        ],
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
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun (10,000+ Lux)",
        "oxygenLevel": "40 L/day",
        "medicinalValues": [
            "Sleep aid",
            "Anxiety relief"
        ],
        "advantages": [
            "Fragrant",
            "Attracts bees"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun (10,000+ Lux)",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "seeds rich in Vitamin E"
        ],
        "advantages": [
            "Fast growth",
            "Edible seeds"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun (6+ hours)",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "Rose hips (Vitamin C)",
            "Skin toner"
        ],
        "advantages": [
            "Classic beauty",
            "Fragrance"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "25 L/day",
        "medicinalValues": [
            "Antiseptic",
            "Anti-inflammatory"
        ],
        "advantages": [
            "Pest repellent",
            "Vibrant color"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "20 L/day",
        "medicinalValues": [
            "Digestion aid",
            "Anti-bacterial"
        ],
        "advantages": [
            "Culinary herb",
            "Aromatic"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Partial Shade to Sun",
        "oxygenLevel": "22 L/day",
        "medicinalValues": [
            "Stomach relief",
            "Headache relief"
        ],
        "advantages": [
            "Fast growing",
            "Tea ingredient"
        ],
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
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "30 L/day",
        "medicinalValues": [
            "Memory boost",
            "Hair growth"
        ],
        "advantages": [
            "Evergreen shrub",
            "Culinary use"
        ],
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
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Shade / Dappled Light",
        "oxygenLevel": "35 L/day",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Shade tolerant",
            "Spring spectacle"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "200 L/day",
        "medicinalValues": [
            "Anxiety relief",
            "Weight loss aid"
        ],
        "advantages": [
            "Grand Southern tree",
            "Glossy leaves"
        ],
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
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "Full Sun",
        "oxygenLevel": "60 L/day",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Nostalgic scent",
            "Cold hardy"
        ],
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
        "type": "indoor",
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
