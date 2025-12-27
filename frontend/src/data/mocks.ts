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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
        "oxygenLevel": "high",
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
