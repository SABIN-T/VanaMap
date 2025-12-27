// Extended Plant Data Module
const indoorPlants = [
    {
        "id": "p_in_1000",
        "name": "Snake Plant",
        "scientificName": "Sansevieria trifasciata",
        "description": "The Snake Plant (Sansevieria trifasciata) is a beautiful indoor specimen known for its 10-25 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2071648721?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 33,
        "minHumidity": 77,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Air purification",
            "Stress reduction"
        ],
        "advantages": [
            "Easiest to grow",
            "Drought tolerant"
        ],
        "price": 197,
        "type": "indoor",
        "lifespan": "10-25 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1001",
        "name": "Peace Lily",
        "scientificName": "Spathiphyllum wallisii",
        "description": "The Peace Lily (Spathiphyllum wallisii) is a beautiful indoor specimen known for its 3-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5186277651?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 29,
        "minHumidity": 69,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes ammonia",
            "Removes benzene"
        ],
        "advantages": [
            "Flowering indoor",
            "Visual watering signal"
        ],
        "price": 158,
        "type": "indoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1002",
        "name": "Spider Plant",
        "scientificName": "Chlorophytum comosum",
        "description": "The Spider Plant (Chlorophytum comosum) is a beautiful indoor specimen known for its 20-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6624711456?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 59,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Safe for pets",
            "Oxygen production"
        ],
        "advantages": [
            "Easy propagation",
            "Non-toxic"
        ],
        "price": 50,
        "type": "indoor",
        "lifespan": "20-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1003",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "The Fiddle Leaf Fig (Ficus lyrata) is a beautiful indoor specimen known for its 25-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9319490272?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 25,
        "minHumidity": 59,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Visual stress relief",
            "Dust collection"
        ],
        "advantages": [
            "Architectural structure",
            "Trendy aesthetic"
        ],
        "price": 92,
        "type": "indoor",
        "lifespan": "25-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1004",
        "name": "Aloe Vera",
        "scientificName": "Aloe barbadensis miller",
        "description": "The Aloe Vera (Aloe barbadensis miller) is a beautiful indoor specimen known for its 5-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2451141193?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 32,
        "minHumidity": 39,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Heals burns",
            "Skin care"
        ],
        "advantages": [
            "Releases oxygen at night",
            "Low maintenance"
        ],
        "price": 10,
        "type": "indoor",
        "lifespan": "5-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1005",
        "name": "Rubber Plant",
        "scientificName": "Ficus elastica",
        "description": "The Rubber Plant (Ficus elastica) is a beautiful indoor specimen known for its 15-25 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7773019632?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 26,
        "minHumidity": 70,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Removes formaldehyde",
            "Removes bacteria"
        ],
        "advantages": [
            "Large foliage",
            "Robust stem"
        ],
        "price": 117,
        "type": "indoor",
        "lifespan": "15-25 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1006",
        "name": "Monstera",
        "scientificName": "Monstera deliciosa",
        "description": "The Monstera (Monstera deliciosa) is a beautiful indoor specimen known for its 10-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9274497144?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 32,
        "minHumidity": 36,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Mood booster",
            "Air purifying"
        ],
        "advantages": [
            "Statement piece",
            "Fast grower"
        ],
        "price": 110,
        "type": "indoor",
        "lifespan": "10-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1007",
        "name": "Pothos",
        "scientificName": "Epipremnum aureum",
        "description": "The Pothos (Epipremnum aureum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1929076109?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Removes pollutants",
            "Eye relaxation"
        ],
        "advantages": [
            "Trailing beauty",
            "Propagates easily in water"
        ],
        "price": 142,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1008",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "The ZZ Plant (Zamioculcas zamiifolia) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3946976293?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 32,
        "minHumidity": 68,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air purification",
            "Stress reduction"
        ],
        "advantages": [
            "Thrives on neglect",
            "Modern look"
        ],
        "price": 24,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1009",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "The Boston Fern (Nephrolepis exaltata) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4226595128?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 27,
        "minHumidity": 74,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Natural humidifier",
            "Clean air"
        ],
        "advantages": [
            "Lush foliage",
            "Pet friendly"
        ],
        "price": 185,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1010",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "The Jade Plant (Crassula ovata) is a beautiful indoor specimen known for its 50-70 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1026357961?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 27,
        "minHumidity": 43,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Skin irritant (Sap)",
            "Symbolism only"
        ],
        "advantages": [
            "Long lived",
            "Easy bonsai"
        ],
        "price": 32,
        "type": "indoor",
        "lifespan": "50-70 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1011",
        "name": "Chinese Money Plant",
        "scientificName": "Pilea peperomioides",
        "description": "The Chinese Money Plant (Pilea peperomioides) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4162701601?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 31,
        "minHumidity": 59,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Cute appearance",
            "Easy to share pups"
        ],
        "price": 102,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1012",
        "name": "Areca Palm",
        "scientificName": "Dypsis lutescens",
        "description": "The Areca Palm (Dypsis lutescens) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5189093678?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 29,
        "minHumidity": 58,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Humidifier",
            "Removes Xylene"
        ],
        "advantages": [
            "Pet friendly",
            "Tropical look"
        ],
        "price": 172,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1013",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia reginae",
        "description": "The Bird of Paradise (Strelitzia reginae) is a beautiful indoor specimen known for its 50-100 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6100572673?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 32,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Statement plant",
            "Exotic flowers"
        ],
        "price": 35,
        "type": "indoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1014",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "The Cast Iron Plant (Aspidistra elatior) is a beautiful indoor specimen known for its 50+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1508332815?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 33,
        "minHumidity": 65,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Indestructible",
            "Low light tolerant"
        ],
        "price": 51,
        "type": "indoor",
        "lifespan": "50+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1015",
        "name": "Philodendron Green",
        "scientificName": "Philodendron hederaceum",
        "description": "The Philodendron Green (Philodendron hederaceum) is a beautiful indoor specimen known for its 10+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7197172857?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 35,
        "minHumidity": 53,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air scrubbing"
        ],
        "advantages": [
            "Tolerates dark corners",
            "Fast growth"
        ],
        "price": 141,
        "type": "indoor",
        "lifespan": "10+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1016",
        "name": "Majesty Palm",
        "scientificName": "Ravenea rivularis",
        "description": "The Majesty Palm (Ravenea rivularis) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8665808281?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 27,
        "minHumidity": 64,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Large size",
            "Elegant fronds"
        ],
        "price": 44,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1017",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "The Dumb Cane (Dieffenbachia seguine) is a beautiful indoor specimen known for its 3-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9174572975?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 25,
        "minHumidity": 47,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Toxic Sap (Warning)"
        ],
        "advantages": [
            "Bushy growth",
            "Striking patterns"
        ],
        "price": 191,
        "type": "indoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1018",
        "name": "English Ivy",
        "scientificName": "Hedera helix",
        "description": "The English Ivy (Hedera helix) is a beautiful indoor specimen known for its 10-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2513669719?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 35,
        "minHumidity": 34,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Mold reduction",
            "Air cleaning"
        ],
        "advantages": [
            "Climbs trellises",
            "Classic look"
        ],
        "price": 105,
        "type": "indoor",
        "lifespan": "10-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1019",
        "name": "Calathea Rattlesnake",
        "scientificName": "Goeppertia insignis",
        "description": "The Calathea Rattlesnake (Goeppertia insignis) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5968618260?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 32,
        "minHumidity": 30,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Patterned foliage",
            "Pet Safe"
        ],
        "price": 186,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1020",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "The Prayer Plant (Maranta leuconeura) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2390373838?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 31,
        "minHumidity": 49,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Circadian rhythm helper"
        ],
        "advantages": [
            "Dynamic movement",
            "Stunning patterns"
        ],
        "price": 60,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1021",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "The Ponytail Palm (Beaucarnea recurvata) is a beautiful indoor specimen known for its 50-100 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9974448766?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 75,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Unique trunk",
            "Drought tolerant"
        ],
        "price": 80,
        "type": "indoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1022",
        "name": "String of Pearls",
        "scientificName": "Curio rowleyanus",
        "description": "The String of Pearls (Curio rowleyanus) is a beautiful indoor specimen known for its 3-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4583164312?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 43,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Visual interest"
        ],
        "advantages": [
            "Hanging basket favorite",
            "Unique texture"
        ],
        "price": 166,
        "type": "indoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1023",
        "name": "African Violet",
        "scientificName": "Saintpaulia ionantha",
        "description": "The African Violet (Saintpaulia ionantha) is a beautiful indoor specimen known for its 50+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3315630035?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 29,
        "minHumidity": 64,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Continuous Color",
            "Small Size"
        ],
        "price": 113,
        "type": "indoor",
        "lifespan": "50+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1024",
        "name": "Air Plant",
        "scientificName": "Tillandsia",
        "description": "The Air Plant (Tillandsia) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1370372680?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 34,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Soil-free",
            "Mountable anywhere"
        ],
        "price": 28,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1025",
        "name": "Lucky Bamboo",
        "scientificName": "Dracaena sanderiana",
        "description": "The Lucky Bamboo (Dracaena sanderiana) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4467397387?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 25,
        "minHumidity": 51,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Feng Shui"
        ],
        "advantages": [
            "Water Culture",
            "Symbolic"
        ],
        "price": 133,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1026",
        "name": "Christmas Cactus",
        "scientificName": "Schlumbergera buckleyi",
        "description": "The Christmas Cactus (Schlumbergera buckleyi) is a beautiful indoor specimen known for its 20-30 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3526309645?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 31,
        "minHumidity": 52,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Winter bloom",
            "Non-toxic"
        ],
        "price": 120,
        "type": "indoor",
        "lifespan": "20-30 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1027",
        "name": "Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "The Croton (Codiaeum variegatum) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9163891437?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 34,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Vibrant colors",
            "Bushy"
        ],
        "price": 31,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1028",
        "name": "Anthurium",
        "scientificName": "Anthurium andraeanum",
        "description": "The Anthurium (Anthurium andraeanum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4061415310?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 32,
        "minHumidity": 58,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Removes toluene"
        ],
        "advantages": [
            "Continuous color",
            "Exotic look"
        ],
        "price": 140,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1029",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "The Parlor Palm (Chamaedorea elegans) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7638207404?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 77,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Benzene Removal"
        ],
        "advantages": [
            "Pet Safe",
            "Low Light Tolerant"
        ],
        "price": 37,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1030",
        "name": "Yucca",
        "scientificName": "Yucca elephantipes",
        "description": "The Yucca (Yucca elephantipes) is a beautiful indoor specimen known for its 20-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1792903616?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 26,
        "minHumidity": 54,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Edible Flowers (Wild)"
        ],
        "advantages": [
            "Indestructible",
            "Modern Look"
        ],
        "price": 80,
        "type": "indoor",
        "lifespan": "20-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1031",
        "name": "Corn Plant",
        "scientificName": "Dracaena fragrans",
        "description": "The Corn Plant (Dracaena fragrans) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4562563724?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 32,
        "minHumidity": 67,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Toxin Removal"
        ],
        "advantages": [
            "Height",
            "Easy Care"
        ],
        "price": 137,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1032",
        "name": "Hoya Heart",
        "scientificName": "Hoya kerrii",
        "description": "The Hoya Heart (Hoya kerrii) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5209433853?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 27,
        "minHumidity": 35,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Heart shape",
            "Novelty"
        ],
        "price": 183,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1033",
        "name": "Bunny Ear Cactus",
        "scientificName": "Opuntia microdasys",
        "description": "The Bunny Ear Cactus (Opuntia microdasys) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3996027077?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 29,
        "minHumidity": 32,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Fun shape",
            "Low water"
        ],
        "price": 164,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1034",
        "name": "Haworthia",
        "scientificName": "Haworthia attenuata",
        "description": "The Haworthia (Haworthia attenuata) is a beautiful indoor specimen known for its 40-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7585739196?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 33,
        "minHumidity": 76,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Pet Safe",
            "Compact"
        ],
        "price": 66,
        "type": "indoor",
        "lifespan": "40-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1035",
        "name": "Polka Dot Plant",
        "scientificName": "Hypoestes phyllostachya",
        "description": "The Polka Dot Plant (Hypoestes phyllostachya) is a beautiful indoor specimen known for its Annual/Short-lived lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7630344419?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 34,
        "minHumidity": 51,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Terrarium friendly",
            "Colorful"
        ],
        "price": 186,
        "type": "indoor",
        "lifespan": "Annual/Short-lived",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1036",
        "name": "Nerve Plant",
        "scientificName": "Fittonia albivenis",
        "description": "The Nerve Plant (Fittonia albivenis) is a beautiful indoor specimen known for its 2-3 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6809630378?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 31,
        "minHumidity": 62,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Terrarium Plant",
            "Colorful veins"
        ],
        "price": 130,
        "type": "indoor",
        "lifespan": "2-3 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1037",
        "name": "Peperomia",
        "scientificName": "Peperomia obtusifolia",
        "description": "The Peperomia (Peperomia obtusifolia) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6808455543?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 29,
        "minHumidity": 33,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Pet Safe",
            "Desk Plant"
        ],
        "price": 67,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1038",
        "name": "Sago Palm",
        "scientificName": "Cycas revoluta",
        "description": "The Sago Palm (Cycas revoluta) is a beautiful indoor specimen known for its 50-100 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1667691909?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 26,
        "minHumidity": 33,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Prehistoric look",
            "Hardy"
        ],
        "price": 177,
        "type": "indoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1039",
        "name": "Asparagus Fern",
        "scientificName": "Asparagus setaceus",
        "description": "The Asparagus Fern (Asparagus setaceus) is a beautiful indoor specimen known for its 10+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1428638899?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 32,
        "minHumidity": 54,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Feathery texture",
            "Fast filler"
        ],
        "price": 142,
        "type": "indoor",
        "lifespan": "10+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1040",
        "name": "Begonia Maculata",
        "scientificName": "Begonia maculata",
        "description": "The Begonia Maculata (Begonia maculata) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2314551644?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Unique Pattern",
            "Flowering"
        ],
        "price": 161,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1041",
        "name": "Swiss Cheese Vine",
        "scientificName": "Monstera adansonii",
        "description": "The Swiss Cheese Vine (Monstera adansonii) is a beautiful indoor specimen known for its 10+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5391014434?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 25,
        "minHumidity": 76,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Vining holes",
            "Fast growth"
        ],
        "price": 15,
        "type": "indoor",
        "lifespan": "10+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1042",
        "name": "Flamingo Flower",
        "scientificName": "Anthurium scherzerianum",
        "description": "The Flamingo Flower (Anthurium scherzerianum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4140090090?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 31,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Air Purification"
        ],
        "advantages": [
            "Continuous Bloom",
            "Showy"
        ],
        "price": 122,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1043",
        "name": "Dragon Tree",
        "scientificName": "Dracaena marginata",
        "description": "The Dragon Tree (Dracaena marginata) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4102591002?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 31,
        "minHumidity": 67,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Toxin Removal"
        ],
        "advantages": [
            "Modern look",
            "Durable"
        ],
        "price": 84,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1044",
        "name": "Weeping Fig",
        "scientificName": "Ficus benjamina",
        "description": "The Weeping Fig (Ficus benjamina) is a beautiful indoor specimen known for its 20-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1094381393?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 31,
        "minHumidity": 32,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Tree-like",
            "Elegant"
        ],
        "price": 155,
        "type": "indoor",
        "lifespan": "20-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1045",
        "name": "Silver Satin Pothos",
        "scientificName": "Scindapsus pictus",
        "description": "The Silver Satin Pothos (Scindapsus pictus) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4654584626?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 31,
        "minHumidity": 39,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Remove Formaldehyde"
        ],
        "advantages": [
            "Silver Variegation",
            "Drought Tolerant"
        ],
        "price": 182,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1046",
        "name": "Kentia Palm",
        "scientificName": "Howea forsteriana",
        "description": "The Kentia Palm (Howea forsteriana) is a beautiful indoor specimen known for its 50+ Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9577667026?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 34,
        "minHumidity": 54,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Elegant arching",
            "Shade tolerant"
        ],
        "price": 50,
        "type": "indoor",
        "lifespan": "50+ Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1047",
        "name": "Zebra Plant",
        "scientificName": "Aphelandra squarrosa",
        "description": "The Zebra Plant (Aphelandra squarrosa) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5844234330?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 26,
        "minHumidity": 36,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Striped leaves",
            "Yellow flower"
        ],
        "price": 183,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1048",
        "name": "Bromeliad",
        "scientificName": "Guzmania",
        "description": "The Bromeliad (Guzmania) is a beautiful indoor specimen known for its 2-4 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4447370410?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 33,
        "minHumidity": 49,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Exotic Color",
            "Pet Safe"
        ],
        "price": 170,
        "type": "indoor",
        "lifespan": "2-4 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1049",
        "name": "Orchid Moth",
        "scientificName": "Phalaenopsis",
        "description": "The Orchid Moth (Phalaenopsis) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2389914853?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 29,
        "minHumidity": 35,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Stress relief"
        ],
        "advantages": [
            "Long blooming",
            "Elegant"
        ],
        "price": 146,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1050",
        "name": "Elephant Ear",
        "scientificName": "Colocasia esculenta",
        "description": "The Elephant Ear (Colocasia esculenta) is a beautiful indoor specimen known for its Annual (Bulb) lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6935022664?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 26,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Traditional Medicine"
        ],
        "advantages": [
            "Statement Size",
            "Tropical"
        ],
        "price": 67,
        "type": "indoor",
        "lifespan": "Annual (Bulb)",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1051",
        "name": "Aluminum Plant",
        "scientificName": "Pilea cadierei",
        "description": "The Aluminum Plant (Pilea cadierei) is a beautiful indoor specimen known for its 1-4 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6204800533?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 31,
        "minHumidity": 48,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Silver patterns",
            "Bushy"
        ],
        "price": 185,
        "type": "indoor",
        "lifespan": "1-4 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1052",
        "name": "Arrowhead Plant",
        "scientificName": "Syngonium podophyllum",
        "description": "The Arrowhead Plant (Syngonium podophyllum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1509052340?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 26,
        "minHumidity": 45,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Voc Removal"
        ],
        "advantages": [
            "Fast growing",
            "Variety of colors"
        ],
        "price": 186,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1053",
        "name": "Baby Rubber Plant",
        "scientificName": "Peperomia obtusifolia",
        "description": "The Baby Rubber Plant (Peperomia obtusifolia) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8028690016?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 25,
        "minHumidity": 71,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Pet Safe",
            "Easy care"
        ],
        "price": 116,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1054",
        "name": "Burro's Tail",
        "scientificName": "Sedum morganianum",
        "description": "The Burro's Tail (Sedum morganianum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3872202266?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 32,
        "minHumidity": 65,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Trailing succulent",
            "Unique texture"
        ],
        "price": 132,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1055",
        "name": "Caladium",
        "scientificName": "Caladium bicolor",
        "description": "The Caladium (Caladium bicolor) is a beautiful indoor specimen known for its Annual (Bulb) lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8294934102?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 26,
        "minHumidity": 69,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Stunning colors",
            "Shade lover"
        ],
        "price": 116,
        "type": "indoor",
        "lifespan": "Annual (Bulb)",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1056",
        "name": "Cyclamen",
        "scientificName": "Cyclamen persicum",
        "description": "The Cyclamen (Cyclamen persicum) is a beautiful indoor specimen known for its 3-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4559215019?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 30,
        "minHumidity": 39,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Cool weather bloom",
            "Compact"
        ],
        "price": 151,
        "type": "indoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1057",
        "name": "Dracaena Lemon Lime",
        "scientificName": "Dracaena warneckii",
        "description": "The Dracaena Lemon Lime (Dracaena warneckii) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7245963670?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 26,
        "minHumidity": 56,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Neon color",
            "Low light"
        ],
        "price": 174,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1058",
        "name": "Fern Arum",
        "scientificName": "Zamioculcas",
        "description": "The Fern Arum (Zamioculcas) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8390196113?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 34,
        "minHumidity": 66,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Tough",
            "Glossy"
        ],
        "price": 172,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1059",
        "name": "Garden Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "The Garden Croton (Codiaeum variegatum) is a beautiful indoor specimen known for its 2-4 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1967362712?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 25,
        "minHumidity": 43,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Colorful foliage",
            "Structure"
        ],
        "price": 182,
        "type": "indoor",
        "lifespan": "2-4 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1060",
        "name": "Gloxinia",
        "scientificName": "Sinningia speciosa",
        "description": "The Gloxinia (Sinningia speciosa) is a beautiful indoor specimen known for its Annual (Bulb) lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5178885670?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 33,
        "minHumidity": 49,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Huge flowers",
            "Velvety leaves"
        ],
        "price": 161,
        "type": "indoor",
        "lifespan": "Annual (Bulb)",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1061",
        "name": "Grape Ivy",
        "scientificName": "Cissus rhombifolia",
        "description": "The Grape Ivy (Cissus rhombifolia) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8708581169?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 32,
        "minHumidity": 67,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Vining",
            "Low light"
        ],
        "price": 61,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1062",
        "name": "Hens and Chicks",
        "scientificName": "Sempervivum tectorum",
        "description": "The Hens and Chicks (Sempervivum tectorum) is a beautiful indoor specimen known for its 3-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1756542365?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Skin soothing (Sap)"
        ],
        "advantages": [
            "Cold hardy",
            "Geometry"
        ],
        "price": 23,
        "type": "indoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1063",
        "name": "Hoya Carnosa",
        "scientificName": "Hoya carnosa",
        "description": "The Hoya Carnosa (Hoya carnosa) is a beautiful indoor specimen known for its 10-30 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1913359016?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 31,
        "minHumidity": 35,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Fragrant Blooms",
            "Long Lived"
        ],
        "price": 174,
        "type": "indoor",
        "lifespan": "10-30 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1064",
        "name": "Kalanchoe",
        "scientificName": "Kalanchoe blossfeldiana",
        "description": "The Kalanchoe (Kalanchoe blossfeldiana) is a beautiful indoor specimen known for its 2-5 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8806080447?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 28,
        "minHumidity": 80,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Wound Healing (Some species)"
        ],
        "advantages": [
            "Flowering Succulent",
            "Drought Tolerant"
        ],
        "price": 174,
        "type": "indoor",
        "lifespan": "2-5 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1065",
        "name": "Living Stone",
        "scientificName": "Lithops",
        "description": "The Living Stone (Lithops) is a beautiful indoor specimen known for its 40-50 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8642285982?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 75,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Curiosity",
            "Tiny"
        ],
        "price": 53,
        "type": "indoor",
        "lifespan": "40-50 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1066",
        "name": "Maidenhair Fern",
        "scientificName": "Adiantum raddianum",
        "description": "The Maidenhair Fern (Adiantum raddianum) is a beautiful indoor specimen known for its 5-10 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1516872259?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 27,
        "minHumidity": 56,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Respiratory aid (Syrup)"
        ],
        "advantages": [
            "Delicate texture",
            "Soft"
        ],
        "price": 96,
        "type": "indoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1067",
        "name": "Money Tree",
        "scientificName": "Pachira aquatica",
        "description": "The Money Tree (Pachira aquatica) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6424484850?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 32,
        "minHumidity": 61,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Good Luck Symbol",
            "Pet Safe"
        ],
        "price": 196,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1068",
        "name": "Moth Orchid",
        "scientificName": "Phalaenopsis",
        "description": "The Moth Orchid (Phalaenopsis) is a beautiful indoor specimen known for its 10-15 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8965790783?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 30,
        "minHumidity": 45,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Easy orchid",
            "Long bloom"
        ],
        "price": 116,
        "type": "indoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    },
    {
        "id": "p_in_1069",
        "name": "Norfolk Island Pine",
        "scientificName": "Araucaria heterophylla",
        "description": "The Norfolk Island Pine (Araucaria heterophylla) is a beautiful indoor specimen known for its 10-20 Years lifespan. It thrives in controlled indoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3288765346?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 27,
        "minHumidity": 41,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Mini Christmas tree",
            "Soft needles"
        ],
        "price": 50,
        "type": "indoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Glossy/Smooth",
        "leafShape": "Ovate-Elliptical",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Interior Adapted",
            "Smooth Edges"
        ]
    }
];

const outdoorPlants = [
    {
        "id": "p_out_1000",
        "name": "Lavender",
        "scientificName": "Lavandula angustifolia",
        "description": "The Lavender (Lavandula angustifolia) is a beautiful outdoor specimen known for its 10-15 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8157233096?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 68,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Calming",
            "Sleep aid",
            "Antiseptic"
        ],
        "advantages": [
            "Fragrant",
            "Bee friendly",
            "Drought tolerant"
        ],
        "price": 130,
        "type": "outdoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1001",
        "name": "Rose Bush",
        "scientificName": "Rosa",
        "description": "The Rose Bush (Rosa) is a beautiful outdoor specimen known for its 15-20 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2282568333?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 30,
        "minHumidity": 31,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Vitamin C (Hips)",
            "Aromatherapy"
        ],
        "advantages": [
            "Beautiful blooms",
            "Fragrance",
            "Cut flowers"
        ],
        "price": 156,
        "type": "outdoor",
        "lifespan": "15-20 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1002",
        "name": "Hydrangea",
        "scientificName": "Hydrangea macrophylla",
        "description": "The Hydrangea (Hydrangea macrophylla) is a beautiful outdoor specimen known for its 50+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2068468188?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 28,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Diuretic (Root - Caution)"
        ],
        "advantages": [
            "Showy flowers",
            "Color change pH"
        ],
        "price": 158,
        "type": "outdoor",
        "lifespan": "50+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1003",
        "name": "Sunflower",
        "scientificName": "Helianthus annuus",
        "description": "The Sunflower (Helianthus annuus) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5844947370?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 39,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Nutritious seeds",
            "Skin oil"
        ],
        "advantages": [
            "Rapid growth",
            "Pollinator magnet"
        ],
        "price": 46,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1004",
        "name": "Tulip",
        "scientificName": "Tulipa",
        "description": "The Tulip (Tulipa) is a beautiful outdoor specimen known for its Perennial (3-5 Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8231694025?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 29,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None specific"
        ],
        "advantages": [
            "Vibrant spring colors",
            "Variety"
        ],
        "price": 123,
        "type": "outdoor",
        "lifespan": "Perennial (3-5 Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1005",
        "name": "Oak Tree",
        "scientificName": "Quercus",
        "description": "The Oak Tree (Quercus) is a beautiful outdoor specimen known for its 100+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4435923207?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 80,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Astringent (Bark)"
        ],
        "advantages": [
            "Shade",
            "Wildlife habitat",
            "Long lived"
        ],
        "price": 35,
        "type": "outdoor",
        "lifespan": "100+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1006",
        "name": "Maple Tree",
        "scientificName": "Acer",
        "description": "The Maple Tree (Acer) is a beautiful outdoor specimen known for its 80-100 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9891854189?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Syrup (Sap)"
        ],
        "advantages": [
            "Fall color",
            "Shade",
            "Wood"
        ],
        "price": 151,
        "type": "outdoor",
        "lifespan": "80-100 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1007",
        "name": "Peony",
        "scientificName": "Paeonia",
        "description": "The Peony (Paeonia) is a beautiful outdoor specimen known for its 50-100 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4762037162?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 35,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Anti-inflammatory (Root)"
        ],
        "advantages": [
            "Huge flowers",
            "Long lived"
        ],
        "price": 36,
        "type": "outdoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1008",
        "name": "Marigold",
        "scientificName": "Tagetes",
        "description": "The Marigold (Tagetes) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9254846908?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 35,
        "minHumidity": 45,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Antiseptic",
            "Eye health (Lutein)"
        ],
        "advantages": [
            "Repels pests",
            "Edible petals"
        ],
        "price": 83,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1009",
        "name": "Basil",
        "scientificName": "Ocimum basilicum",
        "description": "The Basil (Ocimum basilicum) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3844296796?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 31,
        "minHumidity": 56,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Anti-inflammatory",
            "Digestive aid"
        ],
        "advantages": [
            "Delicious",
            "Fast growing",
            "Aromatic"
        ],
        "price": 107,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1010",
        "name": "Tomato",
        "scientificName": "Solanum lycopersicum",
        "description": "The Tomato (Solanum lycopersicum) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8023318610?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 31,
        "minHumidity": 68,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antioxidant (Lycopene)"
        ],
        "advantages": [
            "Edible fruit",
            "Productive"
        ],
        "price": 124,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1011",
        "name": "Boxwood",
        "scientificName": "Buxus",
        "description": "The Boxwood (Buxus) is a beautiful outdoor specimen known for its 20-30 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4747050209?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 75,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Febrifuge (Historical)"
        ],
        "advantages": [
            "Evergreen",
            "Shapeable hedge"
        ],
        "price": 92,
        "type": "outdoor",
        "lifespan": "20-30 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1012",
        "name": "Azalea",
        "scientificName": "Rhododendron",
        "description": "The Azalea (Rhododendron) is a beautiful outdoor specimen known for its 20-50 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1181829751?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 34,
        "minHumidity": 52,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Spring bloom",
            "Shade tolerant"
        ],
        "price": 31,
        "type": "outdoor",
        "lifespan": "20-50 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1013",
        "name": "Daffodil",
        "scientificName": "Narcissus",
        "description": "The Daffodil (Narcissus) is a beautiful outdoor specimen known for its Perennial (10+ Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2659667415?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 33,
        "minHumidity": 33,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Deer resistant",
            "Early bloom"
        ],
        "price": 75,
        "type": "outdoor",
        "lifespan": "Perennial (10+ Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1014",
        "name": "Daylily",
        "scientificName": "Hemerocallis",
        "description": "The Daylily (Hemerocallis) is a beautiful outdoor specimen known for its Perennial (10+ Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8609971407?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 28,
        "minHumidity": 32,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Edible buds"
        ],
        "advantages": [
            "Roadside Tough",
            "Vast Variety"
        ],
        "price": 13,
        "type": "outdoor",
        "lifespan": "Perennial (10+ Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1015",
        "name": "Hostas",
        "scientificName": "Hosta",
        "description": "The Hostas (Hosta) is a beautiful outdoor specimen known for its 30+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4349359906?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 29,
        "minHumidity": 35,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Shade foliage",
            "Textured leaves"
        ],
        "price": 85,
        "type": "outdoor",
        "lifespan": "30+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1016",
        "name": "Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "The Coneflower (Echinacea purpurea) is a beautiful outdoor specimen known for its 2-4 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7289990572?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 26,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Immune Support",
            "Cold Relief"
        ],
        "advantages": [
            "Pollinator Magnet",
            "Drought Tolerant"
        ],
        "price": 124,
        "type": "outdoor",
        "lifespan": "2-4 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1017",
        "name": "Black-Eyed Susan",
        "scientificName": "Rudbeckia hirta",
        "description": "The Black-Eyed Susan (Rudbeckia hirta) is a beautiful outdoor specimen known for its 2-3 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1410858168?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 34,
        "minHumidity": 51,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Immune Stimulant (Roots)"
        ],
        "advantages": [
            "Long Blooming",
            "Hardy"
        ],
        "price": 176,
        "type": "outdoor",
        "lifespan": "2-3 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1018",
        "name": "Lilac Bush",
        "scientificName": "Syringa vulgaris",
        "description": "The Lilac Bush (Syringa vulgaris) is a beautiful outdoor specimen known for its 75+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9397674382?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 27,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Fragrance",
            "Cold Hardy"
        ],
        "price": 22,
        "type": "outdoor",
        "lifespan": "75+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1019",
        "name": "Magnolia Tree",
        "scientificName": "Magnolia grandiflora",
        "description": "The Magnolia Tree (Magnolia grandiflora) is a beautiful outdoor specimen known for its 80-120 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4161886402?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 31,
        "minHumidity": 69,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Anxiety relief (Bark)"
        ],
        "advantages": [
            "Grand flowers",
            "Evergreen leaves"
        ],
        "price": 29,
        "type": "outdoor",
        "lifespan": "80-120 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1020",
        "name": "Japanese Cherry",
        "scientificName": "Prunus serrulata",
        "description": "The Japanese Cherry (Prunus serrulata) is a beautiful outdoor specimen known for its 15-20 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6437574431?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 32,
        "minHumidity": 61,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Symbolism"
        ],
        "advantages": [
            "Spring blossom",
            "Ornamental"
        ],
        "price": 114,
        "type": "outdoor",
        "lifespan": "15-20 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1021",
        "name": "Wisteria",
        "scientificName": "Wisteria sinensis",
        "description": "The Wisteria (Wisteria sinensis) is a beautiful outdoor specimen known for its 50-100 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6814885841?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 28,
        "minHumidity": 45,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Cascading flowers",
            "Fragrance"
        ],
        "price": 140,
        "type": "outdoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1022",
        "name": "Bougainvillea",
        "scientificName": "Bougainvillea glabra",
        "description": "The Bougainvillea (Bougainvillea glabra) is a beautiful outdoor specimen known for its 20-30 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5021976135?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 33,
        "minHumidity": 63,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Drought hardy",
            "Massive color"
        ],
        "price": 71,
        "type": "outdoor",
        "lifespan": "20-30 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1023",
        "name": "Gardenia",
        "scientificName": "Gardenia jasminoides",
        "description": "The Gardenia (Gardenia jasminoides) is a beautiful outdoor specimen known for its 15-25 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2237042728?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 25,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Traditional medicine"
        ],
        "advantages": [
            "Perfume scent",
            "Glossy leaves"
        ],
        "price": 24,
        "type": "outdoor",
        "lifespan": "15-25 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1024",
        "name": "Camellia",
        "scientificName": "Camellia japonica",
        "description": "The Camellia (Camellia japonica) is a beautiful outdoor specimen known for its 50-100 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4242596589?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 35,
        "minHumidity": 51,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Tea oil (Seeds)"
        ],
        "advantages": [
            "Winter bloom",
            "Evergreen"
        ],
        "price": 40,
        "type": "outdoor",
        "lifespan": "50-100 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1025",
        "name": "Rhododendron",
        "scientificName": "Rhododendron ferrugineum",
        "description": "The Rhododendron (Rhododendron ferrugineum) is a beautiful outdoor specimen known for its 50+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7747122273?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 30,
        "minHumidity": 46,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Showy flowers",
            "Woodland plant"
        ],
        "price": 56,
        "type": "outdoor",
        "lifespan": "50+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1026",
        "name": "Jasmine Vine",
        "scientificName": "Jasminum officinale",
        "description": "The Jasmine Vine (Jasminum officinale) is a beautiful outdoor specimen known for its 10-20 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4497198452?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 35,
        "minHumidity": 51,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Stress relief",
            "Tea"
        ],
        "advantages": [
            "Incredible scent",
            "Climbing habit"
        ],
        "price": 50,
        "type": "outdoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1027",
        "name": "Hibiscus",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "The Hibiscus (Hibiscus rosa-sinensis) is a beautiful outdoor specimen known for its 5-10 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3630580304?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 31,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Blood pressure tea"
        ],
        "advantages": [
            "Tropical vibe",
            "Vibrant colors"
        ],
        "price": 95,
        "type": "outdoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1028",
        "name": "Petunia",
        "scientificName": "Petunia hybrida",
        "description": "The Petunia (Petunia hybrida) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9170424234?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 32,
        "minHumidity": 77,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Constant color",
            "Fragrance (some)"
        ],
        "price": 162,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1029",
        "name": "Geranium",
        "scientificName": "Pelargonium",
        "description": "The Geranium (Pelargonium) is a beautiful outdoor specimen known for its 1-3 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4665989519?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 31,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Skin oil"
        ],
        "advantages": [
            "Mosquito repelling",
            "Resilient"
        ],
        "price": 127,
        "type": "outdoor",
        "lifespan": "1-3 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1030",
        "name": "Chrysanthemum",
        "scientificName": "Chrysanthemum morifolium",
        "description": "The Chrysanthemum (Chrysanthemum morifolium) is a beautiful outdoor specimen known for its Perennial (3-5 Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4459760416?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 31,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Tea (specific types)"
        ],
        "advantages": [
            "Fall color",
            "Air cleaning"
        ],
        "price": 150,
        "type": "outdoor",
        "lifespan": "Perennial (3-5 Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1031",
        "name": "Pansy",
        "scientificName": "Viola tricolor",
        "description": "The Pansy (Viola tricolor) is a beautiful outdoor specimen known for its Biennial (2 Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1260868106?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 32,
        "minHumidity": 39,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Expectorant"
        ],
        "advantages": [
            "Edible",
            "Winter Color"
        ],
        "price": 175,
        "type": "outdoor",
        "lifespan": "Biennial (2 Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1032",
        "name": "Snapdragon",
        "scientificName": "Antirrhinum majus",
        "description": "The Snapdragon (Antirrhinum majus) is a beautiful outdoor specimen known for its Annual (1 Year) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5370144347?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 33,
        "minHumidity": 77,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Fun for kids",
            "Cut flowers"
        ],
        "price": 14,
        "type": "outdoor",
        "lifespan": "Annual (1 Year)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1033",
        "name": "Foxglove",
        "scientificName": "Digitalis purpurea",
        "description": "The Foxglove (Digitalis purpurea) is a beautiful outdoor specimen known for its Biennial (2 Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5622274303?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 28,
        "minHumidity": 36,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Heart medication (Toxic)"
        ],
        "advantages": [
            "Tall spikes",
            "Cottage garden"
        ],
        "price": 59,
        "type": "outdoor",
        "lifespan": "Biennial (2 Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1034",
        "name": "Bleeding Heart",
        "scientificName": "Lamprocapnos spectabilis",
        "description": "The Bleeding Heart (Lamprocapnos spectabilis) is a beautiful outdoor specimen known for its Perennial (5-10 Years) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1409560060?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 35,
        "minHumidity": 41,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Unique Flower",
            "Early Bloomer"
        ],
        "price": 97,
        "type": "outdoor",
        "lifespan": "Perennial (5-10 Years)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1035",
        "name": "Coral Bells",
        "scientificName": "Heuchera",
        "description": "The Coral Bells (Heuchera) is a beautiful outdoor specimen known for its 3-5 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1920190113?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 34,
        "minHumidity": 48,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Astringent (Root)"
        ],
        "advantages": [
            "Foliage Color",
            "Compact"
        ],
        "price": 181,
        "type": "outdoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1036",
        "name": "Astilbe",
        "scientificName": "Astilbe chinensis",
        "description": "The Astilbe (Astilbe chinensis) is a beautiful outdoor specimen known for its 10+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3977523128?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 28,
        "minHumidity": 33,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Shade color",
            "Texture"
        ],
        "price": 200,
        "type": "outdoor",
        "lifespan": "10+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1037",
        "name": "Bee Balm",
        "scientificName": "Monarda didyma",
        "description": "The Bee Balm (Monarda didyma) is a beautiful outdoor specimen known for its 3-5 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8554638509?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 53,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Antiseptic (Tea)"
        ],
        "advantages": [
            "Hummingbirds",
            "Tea"
        ],
        "price": 197,
        "type": "outdoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1038",
        "name": "Butterfly Bush",
        "scientificName": "Buddleja davidii",
        "description": "The Butterfly Bush (Buddleja davidii) is a beautiful outdoor specimen known for its 10-20 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2099626477?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 33,
        "minHumidity": 48,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Wildlife Magnet",
            "Long Bloom"
        ],
        "price": 90,
        "type": "outdoor",
        "lifespan": "10-20 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1039",
        "name": "Juniper Bush",
        "scientificName": "Juniperus",
        "description": "The Juniper Bush (Juniperus) is a beautiful outdoor specimen known for its 30-70 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5795221130?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 29,
        "minHumidity": 38,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Diuretic (Berry)"
        ],
        "advantages": [
            "Evergreen",
            "Tough"
        ],
        "price": 110,
        "type": "outdoor",
        "lifespan": "30-70 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1040",
        "name": "Holly Bush",
        "scientificName": "Ilex aquifolium",
        "description": "The Holly Bush (Ilex aquifolium) is a beautiful outdoor specimen known for its 100+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8328460209?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 29,
        "minHumidity": 61,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None (Toxic berries)"
        ],
        "advantages": [
            "Winter interest",
            "Security hedge"
        ],
        "price": 56,
        "type": "outdoor",
        "lifespan": "100+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1041",
        "name": "Pampas Grass",
        "scientificName": "Cortaderia selloana",
        "description": "The Pampas Grass (Cortaderia selloana) is a beautiful outdoor specimen known for its 10-15 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6285698384?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 25,
        "minHumidity": 71,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Screening",
            "Plumes"
        ],
        "price": 12,
        "type": "outdoor",
        "lifespan": "10-15 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1042",
        "name": "Bamboo",
        "scientificName": "Bambusa vulgaris",
        "description": "The Bamboo (Bambusa vulgaris) is a beautiful outdoor specimen known for its 20-100 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6340899064?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 26,
        "minHumidity": 31,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Silica source"
        ],
        "advantages": [
            "Screening",
            "Fast growth"
        ],
        "price": 44,
        "type": "outdoor",
        "lifespan": "20-100 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1043",
        "name": "Agave",
        "scientificName": "Agave americana",
        "description": "The Agave (Agave americana) is a beautiful outdoor specimen known for its 10-30 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3324238233?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 44,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Syrup/Sweetener"
        ],
        "advantages": [
            "Architectural",
            "Drought proof"
        ],
        "price": 98,
        "type": "outdoor",
        "lifespan": "10-30 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1044",
        "name": "Prickly Pear",
        "scientificName": "Opuntia ficus-indica",
        "description": "The Prickly Pear (Opuntia ficus-indica) is a beautiful outdoor specimen known for its 20+ Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7894178128?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 29,
        "minHumidity": 43,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Lower blood sugar"
        ],
        "advantages": [
            "Edible fruit/pad",
            "Barrier"
        ],
        "price": 181,
        "type": "outdoor",
        "lifespan": "20+ Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1045",
        "name": "Rosemary",
        "scientificName": "Salvia rosmarinus",
        "description": "The Rosemary (Salvia rosmarinus) is a beautiful outdoor specimen known for its 15-20 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5347255527?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 33,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Memory boost",
            "Digestion"
        ],
        "advantages": [
            "Edible",
            "Drought resistant"
        ],
        "price": 117,
        "type": "outdoor",
        "lifespan": "15-20 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1046",
        "name": "Thyme",
        "scientificName": "Thymus vulgaris",
        "description": "The Thyme (Thymus vulgaris) is a beautiful outdoor specimen known for its 5-10 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8792752344?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 26,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Cough relief",
            "Antiseptic"
        ],
        "advantages": [
            "Groundcover",
            "Edible"
        ],
        "price": 35,
        "type": "outdoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1047",
        "name": "Mint",
        "scientificName": "Mentha",
        "description": "The Mint (Mentha) is a beautiful outdoor specimen known for its Perennial (Invasive) lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1525658380?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 34,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Digestion",
            "Headache"
        ],
        "advantages": [
            "Tea",
            "Fast growing"
        ],
        "price": 102,
        "type": "outdoor",
        "lifespan": "Perennial (Invasive)",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1048",
        "name": "Sage",
        "scientificName": "Salvia officinalis",
        "description": "The Sage (Salvia officinalis) is a beautiful outdoor specimen known for its 5-10 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-4015725694?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 35,
        "minHumidity": 54,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Sore throat",
            "Memory"
        ],
        "advantages": [
            "Edible",
            "Grey foliage"
        ],
        "price": 92,
        "type": "outdoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1049",
        "name": "Strawberry",
        "scientificName": "Fragaria x ananassa",
        "description": "The Strawberry (Fragaria x ananassa) is a beautiful outdoor specimen known for its 3-5 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7153829149?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 35,
        "minHumidity": 41,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Vitamin C"
        ],
        "advantages": [
            "Delicious fruit",
            "Groundcover"
        ],
        "price": 72,
        "type": "outdoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1050",
        "name": "Creeping Phlox",
        "scientificName": "Phlox subulata",
        "description": "The Creeping Phlox (Phlox subulata) is a beautiful outdoor specimen known for its 5-10 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2264063385?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 57,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Carpet of color",
            "Spring bloom"
        ],
        "price": 33,
        "type": "outdoor",
        "lifespan": "5-10 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1051",
        "name": "Lamb's Ear",
        "scientificName": "Stachys byzantina",
        "description": "The Lamb's Ear (Stachys byzantina) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8802418591?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 31,
        "minHumidity": 49,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Antimicrobial Bandage"
        ],
        "advantages": [
            "Texture",
            "Drought Tolerant"
        ],
        "price": 138,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1052",
        "name": "Lantana",
        "scientificName": "Lantana camara",
        "description": "The Lantana (Lantana camara) is a beautiful outdoor specimen known for its Annual/Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5840469103?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 30,
        "minHumidity": 76,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic berries)"
        ],
        "advantages": [
            "Butterfly Magnet",
            "Heat Proof"
        ],
        "price": 157,
        "type": "outdoor",
        "lifespan": "Annual/Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1053",
        "name": "Moonflower",
        "scientificName": "Ipomoea alba",
        "description": "The Moonflower (Ipomoea alba) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8134517057?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 25,
        "minHumidity": 54,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Night bloom",
            "Fragrance"
        ],
        "price": 173,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1054",
        "name": "Morning Glory",
        "scientificName": "Ipomoea",
        "description": "The Morning Glory (Ipomoea) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8676430795?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 71,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic seeds)"
        ],
        "advantages": [
            "Fast climber",
            "Daily blooms"
        ],
        "price": 139,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1055",
        "name": "Moss Rose",
        "scientificName": "Portulaca grandiflora",
        "description": "The Moss Rose (Portulaca grandiflora) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-6047041116?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 27,
        "minHumidity": 31,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Heat lover",
            "Succulent"
        ],
        "price": 105,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1056",
        "name": "Nasturtium",
        "scientificName": "Tropaeolum majus",
        "description": "The Nasturtium (Tropaeolum majus) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3346931143?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 31,
        "minHumidity": 53,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Antibiotic"
        ],
        "advantages": [
            "Edible flower/leaf",
            "Fast"
        ],
        "price": 133,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1057",
        "name": "Periwinkle",
        "scientificName": "Vinca minor",
        "description": "The Periwinkle (Vinca minor) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7968453057?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 26,
        "minHumidity": 42,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Circulatory aid"
        ],
        "advantages": [
            "Shade cover",
            "Evergreen"
        ],
        "price": 193,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1058",
        "name": "Poppy",
        "scientificName": "Papaver somniferum",
        "description": "The Poppy (Papaver somniferum) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-7367124358?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 35,
        "minHumidity": 48,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Pain relief (Opium)"
        ],
        "advantages": [
            "Showy",
            "Self sowing"
        ],
        "price": 184,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1059",
        "name": "Primrose",
        "scientificName": "Primula vulgaris",
        "description": "The Primrose (Primula vulgaris) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-3386857878?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 32,
        "minHumidity": 73,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Early spring color",
            "Shade"
        ],
        "price": 196,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1060",
        "name": "Ranunculus",
        "scientificName": "Ranunculus asiaticus",
        "description": "The Ranunculus (Ranunculus asiaticus) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8664259104?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 32,
        "minHumidity": 33,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Rose-like flowers",
            "Cut flower"
        ],
        "price": 185,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1061",
        "name": "Salvia",
        "scientificName": "Salvia splendens",
        "description": "The Salvia (Salvia splendens) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9785716165?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 35,
        "minHumidity": 33,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Red spikes",
            "Hummingbirds"
        ],
        "price": 126,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1062",
        "name": "Sedum",
        "scientificName": "Hylotelephium spectabile",
        "description": "The Sedum (Hylotelephium spectabile) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8053030342?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 67,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Burn soothing"
        ],
        "advantages": [
            "Late bloom",
            "Succulent"
        ],
        "price": 102,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1063",
        "name": "Shasta Daisy",
        "scientificName": "Leucanthemum x superbum",
        "description": "The Shasta Daisy (Leucanthemum x superbum) is a beautiful outdoor specimen known for its 3-5 Years lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-5773675209?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 28,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None known"
        ],
        "advantages": [
            "Classic white",
            "Cut flower"
        ],
        "price": 17,
        "type": "outdoor",
        "lifespan": "3-5 Years",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1064",
        "name": "Sweet Alyssum",
        "scientificName": "Lobularia maritima",
        "description": "The Sweet Alyssum (Lobularia maritima) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-9535040551?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 33,
        "minHumidity": 41,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Honey scent",
            "Edging"
        ],
        "price": 166,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1065",
        "name": "Sweet Pea",
        "scientificName": "Lathyrus odoratus",
        "description": "The Sweet Pea (Lathyrus odoratus) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2908331424?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 27,
        "minHumidity": 53,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Scent",
            "Climber"
        ],
        "price": 195,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1066",
        "name": "Verbena",
        "scientificName": "Verbena bonariensis",
        "description": "The Verbena (Verbena bonariensis) is a beautiful outdoor specimen known for its Annual/Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8331763968?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 34,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "Relaxant"
        ],
        "advantages": [
            "Airy habit",
            "Pollinators"
        ],
        "price": 59,
        "type": "outdoor",
        "lifespan": "Annual/Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1067",
        "name": "Yarrow",
        "scientificName": "Achillea millefolium",
        "description": "The Yarrow (Achillea millefolium) is a beautiful outdoor specimen known for its Perennial lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-1431829108?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 80,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Stops bleeding"
        ],
        "advantages": [
            "Native",
            "Tough"
        ],
        "price": 125,
        "type": "outdoor",
        "lifespan": "Perennial",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1068",
        "name": "Zinnia",
        "scientificName": "Zinnia elegans",
        "description": "The Zinnia (Zinnia elegans) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-8719282511?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 33,
        "minHumidity": 55,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bright colors",
            "Cut flower"
        ],
        "price": 25,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    },
    {
        "id": "p_out_1069",
        "name": "Cosmos",
        "scientificName": "Cosmos bipinnatus",
        "description": "The Cosmos (Cosmos bipinnatus) is a beautiful outdoor specimen known for its Annual lifespan. It thrives in natural outdoor environments and brings a touch of nature to your space.",
        "imageUrl": "https://images.unsplash.com/photo-2209265171?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 28,
        "minHumidity": 41,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Feathery",
            "Easy from seed"
        ],
        "price": 32,
        "type": "outdoor",
        "lifespan": "Annual",
        "foliageTexture": "Matte/Textured",
        "leafShape": "Lanceolateish/Compound",
        "stemStructure": "Woody/Semi-Woody",
        "overallHabit": "Spreading/Climbing",
        "biometricFeatures": [
            "Sun Hardy",
            "Outdoor Adapted"
        ]
    }
];

module.exports = { indoorPlants, outdoorPlants };
