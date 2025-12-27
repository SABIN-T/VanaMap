import type { Plant, Vendor } from '../types';

export const PLANTS: Plant[] = [
    {
        "id": "mock_1",
        "name": "Snake Plant",
        "scientificName": "Sansevieria trifasciata",
        "description": "The Snake Plant is a user-friendly indoor plant. It brings hard to kill to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purification",
            "Stress reduction"
        ],
        "advantages": [
            "Hard to kill",
            "Low light tolerant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-25 Years"
    },
    {
        "id": "mock_2",
        "name": "Peace Lily",
        "scientificName": "Spathiphyllum wallisii",
        "description": "The Peace Lily is a user-friendly indoor plant. It brings visual watering signal to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes pollutants",
            "Air cleaning"
        ],
        "advantages": [
            "Visual watering signal",
            "Blooms indoors"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_3",
        "name": "Spider Plant",
        "scientificName": "Chlorophytum comosum",
        "description": "The Spider Plant is a user-friendly indoor plant. It brings easy to propagate to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None (Safe for pets)",
            "Oxygen"
        ],
        "advantages": [
            "Easy to propagate",
            "Pet safe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_4",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "The Fiddle Leaf Fig is a user-friendly indoor plant. It brings statement piece to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Visual stress relief"
        ],
        "advantages": [
            "Statement piece",
            "Large leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "25-50 Years"
    },
    {
        "id": "mock_5",
        "name": "Aloe Vera",
        "scientificName": "Aloe barbadensis",
        "description": "The Aloe Vera is a user-friendly indoor plant. It brings succulent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Heals burns",
            "Skin care"
        ],
        "advantages": [
            "Succulent",
            "Medicinal gel"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-20 Years"
    },
    {
        "id": "mock_6",
        "name": "Rubber Plant",
        "scientificName": "Ficus elastica",
        "description": "The Rubber Plant is a user-friendly indoor plant. It brings glossy leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes formaldehyde"
        ],
        "advantages": [
            "Glossy leaves",
            "Robust"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "15-25 Years"
    },
    {
        "id": "mock_7",
        "name": "Monstera",
        "scientificName": "Monstera deliciosa",
        "description": "The Monstera is a user-friendly indoor plant. It brings tropical feel to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Mood booster"
        ],
        "advantages": [
            "Tropical feel",
            "Fast growing"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_8",
        "name": "Pothos",
        "scientificName": "Epipremnum aureum",
        "description": "The Pothos is a user-friendly indoor plant. It brings best for beginners to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air scrubbing"
        ],
        "advantages": [
            "Best for beginners",
            "Trailing vine"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_9",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "The ZZ Plant is a user-friendly indoor plant. It brings thrives in dark to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Thrives in dark",
            "Drought tolerant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_10",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "The Boston Fern is a user-friendly indoor plant. It brings lush hanging plant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Humidifier"
        ],
        "advantages": [
            "Lush Hanging Plant",
            "Pet Safe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_11",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "The Jade Plant is a user-friendly indoor plant. It brings symbol of luck to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
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
        "id": "mock_12",
        "name": "Chinese Money Plant",
        "scientificName": "Pilea peperomioides",
        "description": "The Chinese Money Plant is a user-friendly indoor plant. It brings cute round leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cute round leaves",
            "Pass-along plant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_13",
        "name": "Areca Palm",
        "scientificName": "Dypsis lutescens",
        "description": "The Areca Palm is a user-friendly indoor plant. It brings tropical look to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes toxins"
        ],
        "advantages": [
            "Tropical look",
            "Pet safe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_14",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia reginae",
        "description": "The Bird of Paradise is a user-friendly indoor plant. It brings exotic flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
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
        "id": "mock_15",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "The Cast Iron Plant is a user-friendly indoor plant. It brings indestructible to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Indestructible",
            "Deep shade"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_16",
        "name": "English Ivy",
        "scientificName": "Hedera helix",
        "description": "The English Ivy is a user-friendly indoor plant. It brings climbing to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Mold reduction"
        ],
        "advantages": [
            "Climbing",
            "Fast covering"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-50 Years"
    },
    {
        "id": "mock_17",
        "name": "Philodendron",
        "scientificName": "Philodendron hederaceum",
        "description": "The Philodendron is a user-friendly indoor plant. It brings heart shaped leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Heart shaped leaves",
            "Easy care"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10+ Years"
    },
    {
        "id": "mock_18",
        "name": "Majesty Palm",
        "scientificName": "Ravenea rivularis",
        "description": "The Majesty Palm is a user-friendly indoor plant. It brings big palm to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Big palm",
            "Inexpensive"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_19",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "The Dumb Cane is a user-friendly indoor plant. It brings patterned leaves to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Patterned leaves",
            "Bushy"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_20",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "The Prayer Plant is a user-friendly indoor plant. It brings leaves move at night to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Sleep cycle helper"
        ],
        "advantages": [
            "Leaves move at night",
            "Colorful"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_21",
        "name": "Calathea",
        "scientificName": "Calathea makoyana",
        "description": "The Calathea is a user-friendly indoor plant. It brings peacock patterns to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Peacock patterns",
            "Pet safe"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_22",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "The Ponytail Palm is a user-friendly indoor plant. It brings fun shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fun shape",
            "Drought proof"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_23",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "The String of Pearls is a user-friendly indoor plant. It brings unique beads to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Visual interest"
        ],
        "advantages": [
            "Unique beads",
            "Hanging"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_24",
        "name": "African Violet",
        "scientificName": "Saintpaulia ionantha",
        "description": "The African Violet is a user-friendly indoor plant. It brings purple flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Purple flowers",
            "Small"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_25",
        "name": "Air Plant",
        "scientificName": "Tillandsia",
        "description": "The Air Plant is a user-friendly indoor plant. It brings no soil needed to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "No soil needed",
            "Unique"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_26",
        "name": "Lucky Bamboo",
        "scientificName": "Dracaena sanderiana",
        "description": "The Lucky Bamboo is a user-friendly indoor plant. It brings grows in water to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Feng Shui"
        ],
        "advantages": [
            "Grows in water",
            "Office plant"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_27",
        "name": "Christmas Cactus",
        "scientificName": "Schlumbergera",
        "description": "The Christmas Cactus is a user-friendly indoor plant. It brings winter bloom to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Winter bloom",
            "Non-toxic"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "20-30 Years"
    },
    {
        "id": "mock_28",
        "name": "Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "The Croton is a user-friendly indoor plant. It brings super colorful to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Super colorful",
            "Autumn vibes"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "2-5 Years"
    },
    {
        "id": "mock_29",
        "name": "Anthurium",
        "scientificName": "Anthurium andraeanum",
        "description": "The Anthurium is a user-friendly indoor plant. It brings red flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red flowers",
            "Waxy leaves"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_30",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "The Parlor Palm is a user-friendly indoor plant. It brings pet safe to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Compact palm"
        ],
        "price": 25,
        "type": "indoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_31",
        "name": "Lavender",
        "scientificName": "Lavandula angustifolia",
        "description": "The Lavender is a user-friendly outdoor plant. It brings fragrance to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Sleep aid",
            "Calming oil"
        ],
        "advantages": [
            "Fragrance",
            "Pollinators"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-15 Years"
    },
    {
        "id": "mock_32",
        "name": "Rose",
        "scientificName": "Rosa",
        "description": "The Rose is a user-friendly outdoor plant. It brings classic beauty to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Vitamin C (Hips)"
        ],
        "advantages": [
            "Classic beauty",
            "Scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-20 Years"
    },
    {
        "id": "mock_33",
        "name": "Sunflower",
        "scientificName": "Helianthus annuus",
        "description": "The Sunflower is a user-friendly outdoor plant. It brings fast growth to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Nutritious seeds"
        ],
        "advantages": [
            "Fast growth",
            "Happy look"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_34",
        "name": "Hydrangea",
        "scientificName": "Hydrangea macrophylla",
        "description": "The Hydrangea is a user-friendly outdoor plant. It brings huge flower heads to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge flower heads",
            "Color changing"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_35",
        "name": "Tulip",
        "scientificName": "Tulipa",
        "description": "The Tulip is a user-friendly outdoor plant. It brings spring color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spring color",
            "Variety"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_36",
        "name": "Marigold",
        "scientificName": "Tagetes",
        "description": "The Marigold is a user-friendly outdoor plant. It brings pest repellant to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Antiseptic"
        ],
        "advantages": [
            "Pest repellant",
            "Bright orange"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_37",
        "name": "Basil",
        "scientificName": "Ocimum basilicum",
        "description": "The Basil is a user-friendly outdoor plant. It brings edible to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Digestion aid"
        ],
        "advantages": [
            "Edible",
            "Aromatic"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_38",
        "name": "Tomato",
        "scientificName": "Solanum lycopersicum",
        "description": "The Tomato is a user-friendly outdoor plant. It brings edible fruit to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Antioxidant"
        ],
        "advantages": [
            "Edible fruit",
            "Productive"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_39",
        "name": "Peony",
        "scientificName": "Paeonia",
        "description": "The Peony is a user-friendly outdoor plant. It brings massive blooms to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Massive blooms",
            "Long lived"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50-100 Years"
    },
    {
        "id": "mock_40",
        "name": "Daffodil",
        "scientificName": "Narcissus",
        "description": "The Daffodil is a user-friendly outdoor plant. It brings early spring bloom to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Early spring bloom",
            "Deer resistant"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_41",
        "name": "Oak Tree",
        "scientificName": "Quercus",
        "description": "The Oak Tree is a user-friendly outdoor plant. It brings shade to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Astringent"
        ],
        "advantages": [
            "Shade",
            "Wildlife home"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "100+ Years"
    },
    {
        "id": "mock_42",
        "name": "Maple Tree",
        "scientificName": "Acer",
        "description": "The Maple Tree is a user-friendly outdoor plant. It brings fall color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Maple syrup"
        ],
        "advantages": [
            "Fall color",
            "Shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "80+ Years"
    },
    {
        "id": "mock_43",
        "name": "Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "The Coneflower is a user-friendly outdoor plant. It brings native to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Immune booster"
        ],
        "advantages": [
            "Native",
            "Pollinators"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2-4 Years"
    },
    {
        "id": "mock_44",
        "name": "Black-Eyed Susan",
        "scientificName": "Rudbeckia hirta",
        "description": "The Black-Eyed Susan is a user-friendly outdoor plant. It brings long blooming to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Long blooming",
            "Tough"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2-3 Years"
    },
    {
        "id": "mock_45",
        "name": "Lilac",
        "scientificName": "Syringa vulgaris",
        "description": "The Lilac is a user-friendly outdoor plant. It brings best scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Best scent",
            "Cold hardy"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "75+ Years"
    },
    {
        "id": "mock_46",
        "name": "Hostas",
        "scientificName": "Hosta",
        "description": "The Hostas is a user-friendly outdoor plant. It brings shade lover to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shade lover",
            "Lush leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "30+ Years"
    },
    {
        "id": "mock_47",
        "name": "Rosemary",
        "scientificName": "Salvia rosmarinus",
        "description": "The Rosemary is a user-friendly outdoor plant. It brings edible to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Memory"
        ],
        "advantages": [
            "Edible",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "15-20 Years"
    },
    {
        "id": "mock_48",
        "name": "Mint",
        "scientificName": "Mentha",
        "description": "The Mint is a user-friendly outdoor plant. It brings fast tea to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Stomach relief"
        ],
        "advantages": [
            "Fast tea",
            "Smell"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Perennial"
    },
    {
        "id": "mock_49",
        "name": "Petunia",
        "scientificName": "Petunia",
        "description": "The Petunia is a user-friendly outdoor plant. It brings continuous color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Continuous color",
            "Hanging basket"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_50",
        "name": "Geranium",
        "scientificName": "Pelargonium",
        "description": "The Geranium is a user-friendly outdoor plant. It brings bright red to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Skin oil"
        ],
        "advantages": [
            "Bright red",
            "Mosquito repellent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1-3 Years"
    },
    {
        "id": "mock_51",
        "name": "Hibiscus",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "The Hibiscus is a user-friendly outdoor plant. It brings tropical to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Tea"
        ],
        "advantages": [
            "Tropical",
            "Huge flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5-10 Years"
    },
    {
        "id": "mock_52",
        "name": "Jasmine",
        "scientificName": "Jasminum",
        "description": "The Jasmine is a user-friendly outdoor plant. It brings perfume scent to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Stress relief"
        ],
        "advantages": [
            "Perfume scent",
            "Climber"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "10-20 Years"
    },
    {
        "id": "mock_53",
        "name": "Azalea",
        "scientificName": "Rhododendron",
        "description": "The Azalea is a user-friendly outdoor plant. It brings spring show to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spring show",
            "Shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-50 Years"
    },
    {
        "id": "mock_54",
        "name": "Boxwood",
        "scientificName": "Buxus",
        "description": "The Boxwood is a user-friendly outdoor plant. It brings formal hedge to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Formal hedge",
            "Evergreen"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "20-30 Years"
    },
    {
        "id": "mock_55",
        "name": "Magnolia",
        "scientificName": "Magnolia grandiflora",
        "description": "The Magnolia is a user-friendly outdoor plant. It brings southern charm to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Anxiety"
        ],
        "advantages": [
            "Southern charm",
            "Glossy leaves"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "80+ Years"
    },
    {
        "id": "mock_56",
        "name": "Wisteria",
        "scientificName": "Wisteria",
        "description": "The Wisteria is a user-friendly outdoor plant. It brings cascading flowers to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cascading flowers",
            "Scent"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "50+ Years"
    },
    {
        "id": "mock_57",
        "name": "Chrysanthemum",
        "scientificName": "Chrysanthemum",
        "description": "The Chrysanthemum is a user-friendly outdoor plant. It brings fall classic to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Tea"
        ],
        "advantages": [
            "Fall classic",
            "Many colors"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "3-5 Years"
    },
    {
        "id": "mock_58",
        "name": "Pansy",
        "scientificName": "Viola tricolor",
        "description": "The Pansy is a user-friendly outdoor plant. It brings winter color to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Winter color",
            "Edible"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "2 Years"
    },
    {
        "id": "mock_59",
        "name": "Snapdragon",
        "scientificName": "Antirrhinum",
        "description": "The Snapdragon is a user-friendly outdoor plant. It brings vertical spikes to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Vertical spikes",
            "Kid favorite"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "1 Year"
    },
    {
        "id": "mock_60",
        "name": "Bleeding Heart",
        "scientificName": "Lamprocapnos",
        "description": "The Bleeding Heart is a user-friendly outdoor plant. It brings unique shape to your environment.",
        "imageUrl": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique shape",
            "Shade"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "5-10 Years"
    }
];

export const VENDORS: Vendor[] = [];
export const USERS = [];
