// Comprehensive Real-World Plant Database
// Dictionary of Validated Species with accurate biometric and horticultural data.

const indoorPlants = [
    {
        "id": "p_in_01",
        "name": "Snake Plant",
        "scientificName": "Dracaena trifasciata",
        "description": "Architectural succulent with stiff, upright, sword-like leaves. Extremely tolerant of low light and irregular watering.",
        "imageUrl": "https://images.unsplash.com/photo-1593482886870-9202a88e2c40",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air Purification (Benzene/Formaldehyde)",
            "Nighttime Oxygen Release"
        ],
        "advantages": [
            "Drought Tolerant",
            "Indestructible"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Waxy/Smooth",
        "leafShape": "Linear/Lanceolate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Upright/Rosette",
        "biometricFeatures": [
            "Horizontal Banding",
            "Sharp Apex"
        ]
    },
    {
        "id": "p_in_02",
        "name": "Monstera Deliciosa",
        "scientificName": "Monstera deliciosa",
        "description": "Iconic tropical climber known for its large, perforated (fenestrated) leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast Climber",
            "Statement Foliage"
        ],
        "price": 45,
        "type": "indoor",
        "foliageTexture": "Glossy/Coriaceous",
        "leafShape": "Cordate (Fenestrated)",
        "stemStructure": "Vining/Aerial Roots",
        "overallHabit": "Climbing/Spreading",
        "biometricFeatures": [
            "Natural Leaf Holes",
            "Thick Aerial Roots"
        ]
    },
    {
        "id": "p_in_03",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "Tall indoor tree with very large, heavily veined, violin-shaped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1597054232360-1e5b85e05a5a",
        "idealTempMin": 16,
        "idealTempMax": 24,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Dramatic Height",
            "Structural"
        ],
        "price": 80,
        "type": "indoor",
        "foliageTexture": "Leathery/Veined",
        "leafShape": "Pandurate (Violin-shaped)",
        "stemStructure": "Woody Trunk",
        "overallHabit": "Tree-like/Upright",
        "biometricFeatures": [
            "Prominent Venation",
            "Large Leaf Surface"
        ]
    },
    {
        "id": "p_in_04",
        "name": "Peace Lily",
        "scientificName": "Spathiphyllum wallisii",
        "description": "Bushy plant with dark green leaves and distinctive white spathe flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1593691509543-c55ce32e01b5",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Mold Spore Removal",
            "Air Cleaning"
        ],
        "advantages": [
            "Visual Thirst Indicator",
            "Low Light Bloomer"
        ],
        "price": 30,
        "type": "indoor",
        "foliageTexture": "Glossy/Ribbed",
        "leafShape": "Lanceolate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "White Spathe",
            "Drooping when dry"
        ]
    },
    {
        "id": "p_in_05",
        "name": "Golden Pothos",
        "scientificName": "Epipremnum aureum",
        "description": "Hardy vine with heart-shaped green leaves splashed with yellow variegation.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "VOC Removal"
        ],
        "advantages": [
            "Fast Growing",
            "Propagates Easily"
        ],
        "price": 15,
        "type": "indoor",
        "foliageTexture": "Smooth/Waxy",
        "leafShape": "Cordate",
        "stemStructure": "Vining",
        "overallHabit": "Trailing/Climbing",
        "biometricFeatures": [
            "Yellow Variegation",
            "Aerial Root Nubs"
        ]
    },
    {
        "id": "p_in_06",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "Prehistoric-looking plant with thick, fleshy stalks and glossy leaflets.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 15,
        "idealTempMax": 26,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air Purification"
        ],
        "advantages": [
            "Drought Resistant",
            "Low Light"
        ],
        "price": 35,
        "type": "indoor",
        "foliageTexture": "High Gloss",
        "leafShape": "Ovate/Pinnate",
        "stemStructure": "Succulent Petioles",
        "overallHabit": "Upright/Vase",
        "biometricFeatures": [
            "Bulbous Rhizomes",
            "Reflective Surface"
        ]
    },
    {
        "id": "p_in_07",
        "name": "Spider Plant",
        "scientificName": "Chlorophytum comosum",
        "description": "Rosette-forming plant that produces hanging 'babies' on long stems.",
        "imageUrl": "https://images.unsplash.com/photo-1572688484279-a9e8f75ebe0c",
        "idealTempMin": 13,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Formaldehyde Removal"
        ],
        "advantages": [
            "Pet Safe",
            "Self-Propagating"
        ],
        "price": 20,
        "type": "indoor",
        "foliageTexture": "Smooth/Grass-like",
        "leafShape": "Linear",
        "stemStructure": "Stoloniferous",
        "overallHabit": "Arching",
        "biometricFeatures": [
            "Central Stripe",
            "Plantlets"
        ]
    },
    {
        "id": "p_in_08",
        "name": "Rubber Plant",
        "scientificName": "Ficus elastica",
        "description": "Sturdy tree with thick, glossy, dark green or burgundy leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Toxin Removal"
        ],
        "advantages": [
            "Rapid Growth",
            "Bold Color"
        ],
        "price": 40,
        "type": "indoor",
        "foliageTexture": "Glossy/Thick",
        "leafShape": "Elliptic/Oval",
        "stemStructure": "Woody Single Stem",
        "overallHabit": "Tree-like",
        "biometricFeatures": [
            "Red Sheath (Stipule)",
            "White Sap"
        ]
    },
    {
        "id": "p_in_09",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "Full, bushy fern with sword-shaped fronds that arch gracefully.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air Humidification"
        ],
        "advantages": [
            "Lush Texture",
            "Non-Toxic"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Feathery/Soft",
        "leafShape": "Pinnate Frond",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Mounding/Arching",
        "biometricFeatures": [
            "Sori on underside",
            "Dense Leaflets"
        ]
    },
    {
        "id": "p_in_10",
        "name": "Aloe Vera",
        "scientificName": "Aloe barbadensis miller",
        "description": "Succulent known for the healing gel inside its fleshy, serrated leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1567331140054-3839d67562f8",
        "idealTempMin": 13,
        "idealTempMax": 27,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Burn Healing",
            "Skin Care"
        ],
        "advantages": [
            "Medicinal",
            "Drought Tolerant"
        ],
        "price": 15,
        "type": "indoor",
        "foliageTexture": "Smooth/Fleshy",
        "leafShape": "Lanceolate (Succulent)",
        "stemStructure": "Rosette",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Serrated Margins",
            "Internal Gel"
        ]
    },
    {
        "id": "p_in_11",
        "name": "Chinese Evergreen",
        "scientificName": "Aglaonema commutatum",
        "description": "Durable plant with patterned leaves in silver, green, and red hues.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 24,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air Purification"
        ],
        "advantages": [
            "Low Light Color",
            "Slow Growing"
        ],
        "price": 35,
        "type": "indoor",
        "foliageTexture": "Matte/Patterned",
        "leafShape": "Elliptic",
        "stemStructure": "Short/Cane-like",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Variegated Patterns",
            "Sheathed Petioles"
        ]
    },
    {
        "id": "p_in_12",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia nicolai",
        "description": "Large, tropical plant with banana-like leaves. brings a jungle feel.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 55,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge Leaves",
            "Verticality"
        ],
        "price": 65,
        "type": "indoor",
        "foliageTexture": "Leathery/Large",
        "leafShape": "Oblong/Paddle",
        "stemStructure": "Basal",
        "overallHabit": "Upright/Arching",
        "biometricFeatures": [
            "Split Leaves (Wind)",
            "Thick Petioles"
        ]
    },
    {
        "id": "p_in_13",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "Named for its ability to survive deep shade, neglect, and temperature fluctuation.",
        "imageUrl": "https://images.unsplash.com/photo-1611211232932-da3113c5b960",
        "idealTempMin": 7,
        "idealTempMax": 29,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Indestructible",
            "Pet Safe"
        ],
        "price": 45,
        "type": "indoor",
        "foliageTexture": "Leathery/Ribbed",
        "leafShape": "Lanceolate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Dark Green",
            "Long Petioles"
        ]
    },
    {
        "id": "p_in_14",
        "name": "Majesty Palm",
        "scientificName": "Ravenea rivularis",
        "description": "A robust palm with long, arching green fronds. Loves water.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tropical Look",
            "Pet Safe"
        ],
        "price": 40,
        "type": "indoor",
        "foliageTexture": "Feathery",
        "leafShape": "Pinnate",
        "stemStructure": "Trunk-forming",
        "overallHabit": "Upright/Vase",
        "biometricFeatures": [
            "Symmetrical Fronds",
            "Thick Base"
        ]
    },
    {
        "id": "p_in_15",
        "name": "Areca Palm",
        "scientificName": "Dypsis lutescens",
        "description": "Bamboo-like clustering palm with soft fronds.",
        "imageUrl": "https://images.unsplash.com/photo-1628169225700-1d8f58b8d96d",
        "idealTempMin": 16,
        "idealTempMax": 24,
        "minHumidity": 55,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Xylene Removal"
        ],
        "advantages": [
            "Fine Texture",
            "Privacy Screen"
        ],
        "price": 55,
        "type": "indoor",
        "foliageTexture": "Soft/Fine",
        "leafShape": "Pinnate",
        "stemStructure": "Clumping Canes",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Yellowish Stems",
            "Multiple Trunks"
        ]
    },
    {
        "id": "p_in_16",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "Low-growing plant with striking patterned leaves that fold up at night.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Active Movement",
            "Pet Safe"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Velvety/Patterned",
        "leafShape": "Elliptic/Oval",
        "stemStructure": "Trailing",
        "overallHabit": "Spreading",
        "biometricFeatures": [
            "Red Veins",
            "Nyctinasty (Movement)"
        ]
    },
    {
        "id": "p_in_17",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "Trailing succulent with spherical, pea-like leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique Shape",
            "Hanging Basket"
        ],
        "price": 20,
        "type": "indoor",
        "foliageTexture": "Smooth",
        "leafShape": "Spherical",
        "stemStructure": "Trailing",
        "overallHabit": "Cascading",
        "biometricFeatures": [
            "Translucent 'Window'",
            "Pea-like"
        ]
    },
    {
        "id": "p_in_18",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "Long-lived succulent bonsai with thick woody stems and oval leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1509304388383-ed5808ce4913",
        "idealTempMin": 10,
        "idealTempMax": 29,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Symbol of Luck"
        ],
        "advantages": [
            "Longevity",
            "Easy Propagation"
        ],
        "price": 22,
        "type": "indoor",
        "foliageTexture": "Smooth/Fleshy",
        "leafShape": "Obovate",
        "stemStructure": "Woody/Succulent",
        "overallHabit": "Tree-like",
        "biometricFeatures": [
            "Red Edges in Sun",
            "Opposite Leaves"
        ]
    },
    {
        "id": "p_in_19",
        "name": "Philodendron Brasil",
        "scientificName": "Philodendron hederaceum",
        "description": "Vining plant with heart-shaped leaves featuring a lime green center stripe.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 16,
        "idealTempMax": 29,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast Growth",
            "Easy Care"
        ],
        "price": 18,
        "type": "indoor",
        "foliageTexture": "Smooth/Glossy",
        "leafShape": "Cordate",
        "stemStructure": "Vining",
        "overallHabit": "Trailing",
        "biometricFeatures": [
            "Central Lime Stripe",
            "Pinkish Stipules"
        ]
    },
    {
        "id": "p_in_20",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia seguine",
        "description": "Lush plant with large, speckled, creamy-white and green leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None (Toxic Sap)"
        ],
        "advantages": [
            "Showy Foliage",
            "Air Purifying"
        ],
        "price": 30,
        "type": "indoor",
        "foliageTexture": "Matte/Smooth",
        "leafShape": "Oblong/Ovate",
        "stemStructure": "Cane-like",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Speckled Patterns",
            "Thick Stem"
        ]
    },
    {
        "id": "p_in_21",
        "name": "Swiss Cheese Plant (Adansonii)",
        "scientificName": "Monstera adansonii",
        "description": "Vinining cousin of the Deliciosa, with many holes in smaller leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 29,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Textural",
            "Climbing"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Textured/Thin",
        "leafShape": "Ovate (Fenestrated)",
        "stemStructure": "Vining",
        "overallHabit": "Trailing/Climbing",
        "biometricFeatures": [
            "Fully Perforated",
            "Rapid Runner"
        ]
    },
    {
        "id": "p_in_22",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "Fun plant with a swollen, bulbous trunk base and curly, hair-like leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Water Storage (Caudex)",
            "Non-Toxic"
        ],
        "price": 45,
        "type": "indoor",
        "foliageTexture": "Rough/Grass-like",
        "leafShape": "Linear",
        "stemStructure": "Caudiciform",
        "overallHabit": "Tree-like",
        "biometricFeatures": [
            "Bulbous Base",
            "Recurved Leaves"
        ]
    },
    {
        "id": "p_in_23",
        "name": "Alocasia Polly",
        "scientificName": "Alocasia amazonica",
        "description": "Striking 'African Mask' plant with dark leaves and bold white veins.",
        "imageUrl": "https://images.unsplash.com/photo-1601903673322-c35cb58bd61f",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Exotic",
            "Sculptural"
        ],
        "price": 35,
        "type": "indoor",
        "foliageTexture": "Glossy/Leathery",
        "leafShape": "Arrowhead/Sagittate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Scalloped Edges",
            "Contrasting Veins"
        ]
    },
    {
        "id": "p_in_24",
        "name": "Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "Shrub with thick leathery leaves in fiery colors of red, orange, and yellow.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 29,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Vibrant Color",
            "Tropical"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Leathery/Glossy",
        "leafShape": "Varied (Lobed/Oval)",
        "stemStructure": "Woody",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Multicolor Variegation",
            "Stiff Leaves"
        ]
    },
    {
        "id": "p_in_25",
        "name": "Calathea Orbifolia",
        "scientificName": "Goeppertia orbifolia",
        "description": "Features massive, round, silver-green striped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 65,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet Safe",
            "Designer Favorite"
        ],
        "price": 50,
        "type": "indoor",
        "foliageTexture": "Smooth/Ribbed",
        "leafShape": "Orbicular",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Silver Stripes",
            "Large Surface Area"
        ]
    },
    {
        "id": "p_in_50",
        "name": "Bird's Nest Fern",
        "scientificName": "Asplenium nidus",
        "description": "Epiphytic fern with large, simple fronds resembling a bird's nest. Needs high humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1619898239324-406c8cb81561",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet Safe",
            "Unique Form"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Glossiers/Waxy",
        "leafShape": "Lanceolate (Entire)",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Rosette",
        "biometricFeatures": [
            "Undulating Margins",
            "Dark Midrib"
        ]
    },
    {
        "id": "p_in_51",
        "name": "Pilea Peperomioides",
        "scientificName": "Pilea peperomioides",
        "description": "The 'Cinese Money Plant' has coin-shaped leaves on long petioles. Very popular.",
        "imageUrl": "https://images.unsplash.com/photo-1628169225700-1d8f58b8d96d",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Easy to Propagate",
            "Fast Growth"
        ],
        "price": 15,
        "type": "indoor",
        "foliageTexture": "Smooth/Fleshy",
        "leafShape": "Orbicular (Peltate)",
        "stemStructure": "Succulent",
        "overallHabit": "Upright/Clumping",
        "biometricFeatures": [
            "Peltate Leaf Attachment",
            "Coin Shape"
        ]
    },
    {
        "id": "p_in_52",
        "name": "Satin Pothos",
        "scientificName": "Scindapsus pictus",
        "description": "Vining plant with matte green leaves splashed with shimmering silver.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 18,
        "idealTempMax": 29,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Remove Formaldehyde"
        ],
        "advantages": [
            "Silver Variegation",
            "Drought Tolerant"
        ],
        "price": 20,
        "type": "indoor",
        "foliageTexture": "Matte/Velvety",
        "leafShape": "Cordate (Asymmetric)",
        "stemStructure": "Vining",
        "overallHabit": "Trailing",
        "biometricFeatures": [
            "Silver Blotch Patterns",
            "Curled tips when dry"
        ]
    },
    {
        "id": "p_in_53",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "Compact palm that has been a houseplant staple since the Victorian era.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Benzene Removal"
        ],
        "advantages": [
            "Pet Safe",
            "Low Light Tolerant"
        ],
        "price": 15,
        "type": "indoor",
        "foliageTexture": "Feathery",
        "leafShape": "Pinnate",
        "stemStructure": "Single Stem (clustered)",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Thin Leaflets",
            "Ringed Stems (Old)"
        ]
    },
    {
        "id": "p_in_54",
        "name": "Umbrella Tree",
        "scientificName": "Schefflera arboricola",
        "description": "Fast-growing shrub with whorls of glossy green leaves resembling an umbrella.",
        "imageUrl": "https://images.unsplash.com/photo-1597054232360-1e5b85e05a5a",
        "idealTempMin": 15,
        "idealTempMax": 24,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tough",
            "Can be Braided"
        ],
        "price": 35,
        "type": "indoor",
        "foliageTexture": "Glossy/Leathery",
        "leafShape": "Palmate (Compound)",
        "stemStructure": "Woody",
        "overallHabit": "Tree/Shrub",
        "biometricFeatures": [
            "7-9 Leaflets per stalk",
            "Whorled Arrangement"
        ]
    },
    {
        "id": "p_in_55",
        "name": "Nerve Plant",
        "scientificName": "Fittonia albivenis",
        "description": "Low-growing creeper with intricate white, pink, or red veins. Needs high humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1628169225700-1d8f58b8d96d",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 70,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Terrarium Plant",
            "Colorful"
        ],
        "price": 10,
        "type": "indoor",
        "foliageTexture": "Papery/Soft",
        "leafShape": "Ovate",
        "stemStructure": "Creeping",
        "overallHabit": "Mat-forming",
        "biometricFeatures": [
            "Contrasting Veins",
            "Dramatic Wilting"
        ]
    },
    {
        "id": "p_in_56",
        "name": "Elephant Ear",
        "scientificName": "Alocasia macrorrhizos",
        "description": "Giant upright leaves shaped like arrows or hearts.",
        "imageUrl": "https://images.unsplash.com/photo-1601903673322-c35cb58bd61f",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Traditional Medicine (Rhizome)"
        ],
        "advantages": [
            "Statement Size",
            "Tropical"
        ],
        "price": 60,
        "type": "indoor",
        "foliageTexture": "Glossy/Thick",
        "leafShape": "Sagittate (Arrow)",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Upwards pointing leaves",
            "Thick Trunk"
        ]
    },
    {
        "id": "p_in_57",
        "name": "Begonia Maculata",
        "scientificName": "Begonia maculata",
        "description": "Polka Dot Begonia with angel-wing shaped leaves and red undersides.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 22,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique Pattern",
            "Flowering"
        ],
        "price": 30,
        "type": "indoor",
        "foliageTexture": "Smooth/Spotted",
        "leafShape": "Asymmetric (Angel Wing)",
        "stemStructure": "Cane-like",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Silver Dots",
            "Deep Red Underside"
        ]
    },
    {
        "id": "p_in_58",
        "name": "Air Plant",
        "scientificName": "Tillandsia ionantha",
        "description": "Epiphytes that absorb water and nutrients through their leaves, needing no soil.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 10,
        "idealTempMax": 32,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Soil-free",
            "Mountable anywhere"
        ],
        "price": 8,
        "type": "indoor",
        "foliageTexture": "Fuzzy (Trichomes)",
        "leafShape": "Linear/Tapered",
        "stemStructure": "Reduced/Acauiescent",
        "overallHabit": "Rosette",
        "biometricFeatures": [
            "Silver Trichomes",
            "Red blush on bloom"
        ]
    },
    {
        "id": "p_in_60",
        "name": "Money Tree",
        "scientificName": "Pachira aquatica",
        "description": "Braided trunk tree with palm-like leaves, believed to bring financial luck.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 16,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Good Luck Symbol",
            "Pet Safe"
        ],
        "price": 45,
        "type": "indoor",
        "foliageTexture": "Glossy/Thin",
        "leafShape": "Palmate (Compound)",
        "stemStructure": "Woody (Braided)",
        "overallHabit": "Tree",
        "biometricFeatures": [
            "5-7 Leaflets",
            "Swollen Base"
        ]
    },
    {
        "id": "p_in_61",
        "name": "African Violet",
        "scientificName": "Saintpaulia ionantha",
        "description": "Compact fuzzy plant that blooms largely year-round in purple, pink, or white.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": 18,
        "idealTempMax": 24,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Continuous Color",
            "Small Size"
        ],
        "price": 12,
        "type": "indoor",
        "foliageTexture": "Pubescent (Hairy)",
        "leafShape": "Orbicular/Cordate",
        "stemStructure": "Short/Rosette",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Fuzzy Leaves",
            "Fleshy Petioles"
        ]
    },
    {
        "id": "p_in_62",
        "name": "Lucky Bamboo",
        "scientificName": "Dracaena sanderiana",
        "description": "Water-grown stalks often twisted into spiral shapes. Feng Shui staple.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Water Culture",
            "Symbolic"
        ],
        "price": 10,
        "type": "indoor",
        "foliageTexture": "Smooth",
        "leafShape": "Lanceolate",
        "stemStructure": "Segmented Cane",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Yellow/Green Striping",
            "Nodes"
        ]
    },
    {
        "id": "p_in_63",
        "name": "String of Hearts",
        "scientificName": "Ceropegia woodii",
        "description": "Delicate vine with heart-shaped, mottled leaves. Produces distinctive tubers.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast Trailing",
            "Unique Pattern"
        ],
        "price": 18,
        "type": "indoor",
        "foliageTexture": "Succulent/Smooth",
        "leafShape": "Cordate",
        "stemStructure": "Vining (Wire-like)",
        "overallHabit": "Cascading",
        "biometricFeatures": [
            "Mottled Pattern",
            "Aerial Tubers"
        ]
    },
    {
        "id": "p_in_64",
        "name": "Corn Plant",
        "scientificName": "Dracaena fragrans",
        "description": "Tall, woody stems topped with arching leaves that look like corn stalks.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 26,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Toxin Removal"
        ],
        "advantages": [
            "Height",
            "Easy Care"
        ],
        "price": 40,
        "type": "indoor",
        "foliageTexture": "Glossy",
        "leafShape": "Lanceolate (Broad)",
        "stemStructure": "Woody Cane",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Central Yellow Stripe",
            "Fragrant Flowers (Rare)"
        ]
    },
    {
        "id": "p_in_65",
        "name": "Yucca Cane",
        "scientificName": "Yucca elephantipes",
        "description": "Drought-tolerant plant with sword-like leaves on thick, woody trunks.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 20,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Edible Flowers (Wild)"
        ],
        "advantages": [
            "Indestructible",
            "Modern Look"
        ],
        "price": 55,
        "type": "indoor",
        "foliageTexture": "Rough/Leathery",
        "leafShape": "Ensiform (Sword)",
        "stemStructure": "Woody Trunk",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Sharp tips",
            "Serrated margin check"
        ]
    },
    {
        "id": "p_in_66",
        "name": "Hoya Carnosa",
        "scientificName": "Hoya carnosa",
        "description": "Wax plant with thick leaves and clusters of star-shaped, porcelain-like flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fragrant Blooms",
            "Long Lived"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Waxy/Succulent",
        "leafShape": "Ovate/Elliptic",
        "stemStructure": "Vining",
        "overallHabit": "Climbing",
        "biometricFeatures": [
            "Opposite Leaves",
            "Peduncles"
        ]
    },
    {
        "id": "p_in_67",
        "name": "Peperomia Obtusifolia",
        "scientificName": "Peperomia obtusifolia",
        "description": "Baby Rubber Plant. Compact, bushy plant with thick, spoon-shaped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet Safe",
            "Desk Plant"
        ],
        "price": 12,
        "type": "indoor",
        "foliageTexture": "Rubber-like/Smooth",
        "leafShape": "Obovate/Spatulate",
        "stemStructure": "Succulent Stems",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Thick Leaves",
            "Insignificant Spikes"
        ]
    },
    {
        "id": "p_in_68",
        "name": "Calathea Medallion",
        "scientificName": "Goeppertia veitchiana",
        "description": " Stunning round leaves with a feather pattern on top and purple underneath.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 65,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Ornate Foliage",
            "Pet Safe"
        ],
        "price": 35,
        "type": "indoor",
        "foliageTexture": "Smooth/Patterned",
        "leafShape": "Orbicular",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Purple Underside",
            "Leaf Folding"
        ]
    },
    {
        "id": "p_in_69",
        "name": "Lipstick Plant",
        "scientificName": "Aeschynanthus radicans",
        "description": "Trailing epiphyte named for its tubular red flowers emerging from dark calyxes.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Showy Flowers",
            "Hanging Basket"
        ],
        "price": 22,
        "type": "indoor",
        "foliageTexture": "Leathery",
        "leafShape": "Lanceolate",
        "stemStructure": "Vining",
        "overallHabit": "Trailing",
        "biometricFeatures": [
            "Tubular Flowers",
            "Fleshy Leaves"
        ]
    },
    {
        "id": "p_in_70",
        "name": "Staghorn Fern",
        "scientificName": "Platycerium bifurcatum",
        "description": "Epiphytic fern with two types of fronds: shield fronds and antler-like fertile fronds.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Living Art",
            "Unique"
        ],
        "price": 45,
        "type": "indoor",
        "foliageTexture": "Fuzzy/Leathery",
        "leafShape": "Lobed (Antler)",
        "stemStructure": "Rhizome (Hidden)",
        "overallHabit": "Epiphytic Clump",
        "biometricFeatures": [
            "Shield Fronds",
            "Forked Tips"
        ]
    },
    {
        "id": "p_in_71",
        "name": "Bromeliad (Guzmania)",
        "scientificName": "Guzmania lingulata",
        "description": "Tropical plant with long lasting, colorful flower bracts in red, orange, or yellow.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 55,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Exotic Color",
            "Pet Safe"
        ],
        "price": 25,
        "type": "indoor",
        "foliageTexture": "Smooth/Stiff",
        "leafShape": "Linear",
        "stemStructure": "Rosette",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Central Tank",
            "Colored Bracts"
        ]
    },
    {
        "id": "p_in_72",
        "name": "Tradescantia Zebrina",
        "scientificName": "Tradescantia zebrina",
        "description": "Inch Plant. Fast-growing trailer with purple and silver striped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antioxidant (Tea)"
        ],
        "advantages": [
            "Fast Growth",
            "Colorful"
        ],
        "price": 10,
        "type": "indoor",
        "foliageTexture": "Glistening",
        "leafShape": "Ovate-Acute",
        "stemStructure": "Succulent/Jointed",
        "overallHabit": "Trailing",
        "biometricFeatures": [
            "Sparkling Cells",
            "Purple Color"
        ]
    },
    {
        "id": "p_in_73",
        "name": "Kalanchoe",
        "scientificName": "Kalanchoe blossfeldiana",
        "description": "Succulent with scalloped leaves and clusters of long-lasting flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1509304388383-ed5808ce4913",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Wound Healing (Some species)"
        ],
        "advantages": [
            "Flowering Succulent",
            "Drought Tolerant"
        ],
        "price": 12,
        "type": "indoor",
        "foliageTexture": "Waxy/Thick",
        "leafShape": "Ovate (Scalloped)",
        "stemStructure": "Succulent",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Crenate Margins",
            "Dense Flower Corymbs"
        ]
    },
    {
        "id": "p_in_74",
        "name": "Aglaonema Silver Bay",
        "scientificName": "Aglaonema commutatum 'Silver Bay'",
        "description": "Full, lush variety with silver-centered green leaves. incredibly low-light tolerant.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Office Plant",
            "Easy Care"
        ],
        "price": 30,
        "type": "indoor",
        "foliageTexture": "Sheen/Smooth",
        "leafShape": "Lanceolate",
        "stemStructure": "Short Cane",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Silver Center",
            "Acute Tip"
        ]
    },
    {
        "id": "p_in_75",
        "name": "Cyclamen",
        "scientificName": "Cyclamen persicum",
        "description": "Winter-blooming tuberous plant with swept-back petals and patterned leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": 10,
        "idealTempMax": 20,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Cool weather bloom",
            "Compact"
        ],
        "price": 15,
        "type": "indoor",
        "foliageTexture": "Matte/Patterned",
        "leafShape": "Cordate",
        "stemStructure": "Tuberous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Reflexed Petals",
            "Silver Marbling"
        ]
    }
];

const outdoorPlants = [
    {
        "id": "p_out_01",
        "name": "English Lavender",
        "scientificName": "Lavandula angustifolia",
        "description": "Aromatic herb with purple flower spikes and silvery foliage. Loves sun and dry soil.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -5,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Relaxation",
            "Antiseptic"
        ],
        "advantages": [
            "Pollinator Friendly",
            "Drought Tolerant"
        ],
        "price": 15,
        "type": "outdoor",
        "foliageTexture": "Soft/Fuzzy",
        "leafShape": "Linear",
        "stemStructure": "Woody Base",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Square Stems",
            "Fragrant Oil Glands"
        ]
    },
    {
        "id": "p_out_02",
        "name": "Garden Rose",
        "scientificName": "Rosa hybrids",
        "description": "Classic flowering shrub known for fragrant, multi-petaled blooms.",
        "imageUrl": "https://images.unsplash.com/photo-1518698544840-7815610e199f",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Vitamin C (Hips)",
            "Skin Oil"
        ],
        "advantages": [
            "Fragrance",
            "Cut Flowers"
        ],
        "price": 35,
        "type": "outdoor",
        "foliageTexture": "Serrated/Matte",
        "leafShape": "Pinnate",
        "stemStructure": "Woody/Thorny",
        "overallHabit": "Shrub/Climber",
        "biometricFeatures": [
            "Thorns (Prickles)",
            "Stipules at base"
        ]
    },
    {
        "id": "p_out_03",
        "name": "Hydrangea",
        "scientificName": "Hydrangea macrophylla",
        "description": "Deciduous shrub with huge flower heads that can change color based on soil pH.",
        "imageUrl": "https://images.unsplash.com/photo-1502444330663-89cd249f3e58",
        "idealTempMin": -5,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Massive Blooms",
            "Long Flowering"
        ],
        "price": 40,
        "type": "outdoor",
        "foliageTexture": "Broad/Serrated",
        "leafShape": "Ovate",
        "stemStructure": "Woody",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Opposite Leaves",
            "Corymb Blooms"
        ]
    },
    {
        "id": "p_out_04",
        "name": "Japanese Maple",
        "scientificName": "Acer palmatum",
        "description": "Elegant deciduous tree with delicate, palm-shaped leaves turning brilliant red in fall.",
        "imageUrl": "https://images.unsplash.com/photo-1542278917-76856c3fa536",
        "idealTempMin": -15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Focal Point",
            "Seasonal Color"
        ],
        "price": 120,
        "type": "outdoor",
        "foliageTexture": "Delicate/Papery",
        "leafShape": "Palmate (Lobed)",
        "stemStructure": "Woody Tree",
        "overallHabit": "Vase/Weeping",
        "biometricFeatures": [
            "5-7 Lobes",
            "Opposite Branching"
        ]
    },
    {
        "id": "p_out_05",
        "name": "Sunflower",
        "scientificName": "Helianthus annuus",
        "description": "Tall annual with massive yellow flower heads that track the sun.",
        "imageUrl": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Seeds (Nutrients)"
        ],
        "advantages": [
            "Fast Growth",
            "Edible Seeds"
        ],
        "price": 10,
        "type": "outdoor",
        "foliageTexture": "Rough/Hairy",
        "leafShape": "Cordate",
        "stemStructure": "Herbaceous/Stiff",
        "overallHabit": "Upright (Single Stem)",
        "biometricFeatures": [
            "Hirsute Stem",
            "Ray & Disc Florets"
        ]
    },
    {
        "id": "p_out_06",
        "name": "Boxwood",
        "scientificName": "Buxus sempervirens",
        "description": "Dense evergreen shrub with small leaves, perfect for hedging and topiary.",
        "imageUrl": "https://images.unsplash.com/photo-1588631189912-88741369527f",
        "idealTempMin": -20,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Winter Interest",
            "Deer Resistant"
        ],
        "price": 30,
        "type": "outdoor",
        "foliageTexture": "Smooth/Leathery",
        "leafShape": "Elliptic/Small",
        "stemStructure": "Woody",
        "overallHabit": "Rounded/Compact",
        "biometricFeatures": [
            "Opposite Leaves",
            "Square young stems"
        ]
    },
    {
        "id": "p_out_07",
        "name": "Peony",
        "scientificName": "Paeonia lactiflora",
        "description": "Herbaceous perennial with massive, fluffy, fragrant blooms in spring.",
        "imageUrl": "https://images.unsplash.com/photo-1560717278-f7b57bf4b534",
        "idealTempMin": -20,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Anti-inflammatory (Root)"
        ],
        "advantages": [
            "Long Lived (50+ yrs)",
            "Spectacular Bloom"
        ],
        "price": 45,
        "type": "outdoor",
        "foliageTexture": "Deeply Lobed",
        "leafShape": "Biternate",
        "stemStructure": "Herbaceous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Compound Leaves",
            "Ants on buds"
        ]
    },
    {
        "id": "p_out_08",
        "name": "Hosta",
        "scientificName": "Hosta spp.",
        "description": "Shade-loving perennial grown for its lush, variegated foliage.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": -30,
        "idealTempMax": 28,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shade Garden Staple",
            "Ground Cover"
        ],
        "price": 15,
        "type": "outdoor",
        "foliageTexture": "Ribbed/Waxy",
        "leafShape": "Cordate/Broad",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Parallel Venation",
            "Raceme Flower Spike"
        ]
    },
    {
        "id": "p_out_09",
        "name": "Tomato",
        "scientificName": "Solanum lycopersicum",
        "description": "The most popular vegetable garden plant, producing juicy red edible fruit.",
        "imageUrl": "https://images.unsplash.com/photo-1592841200221-a6898f307baa",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Lycopene (Antioxidant)"
        ],
        "advantages": [
            "Edible",
            "Productive"
        ],
        "price": 8,
        "type": "outdoor",
        "foliageTexture": "Hairy/Odoriferous",
        "leafShape": "Pinnate (Compound)",
        "stemStructure": "Vining/Bush",
        "overallHabit": "Sprawling",
        "biometricFeatures": [
            "Glandular Hairs",
            "Yellow Flowers"
        ]
    },
    {
        "id": "p_out_10",
        "name": "Azalea",
        "scientificName": "Rhododendron spp.",
        "description": "Flowering shrub that erupts in color in spring. Loves acidic soil.",
        "imageUrl": "https://images.unsplash.com/photo-1589539129532-61a156e5428a",
        "idealTempMin": -15,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Spring Color",
            "Evergreen varieties"
        ],
        "price": 35,
        "type": "outdoor",
        "foliageTexture": "Hairy/Small",
        "leafShape": "Elliptic/Obovate",
        "stemStructure": "Woody",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Pubescent Leaves",
            "Funnel Flowers"
        ]
    },
    {
        "id": "p_out_11",
        "name": "Rosemary",
        "scientificName": "Salvia rosmarinus",
        "description": "Woody perennial herb with fragrant, needle-like leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1594582969248-8e8e7c10b713",
        "idealTempMin": -5,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Memory Boost",
            "Culinary"
        ],
        "advantages": [
            "Deer Resistant",
            "Drought Hardy"
        ],
        "price": 12,
        "type": "outdoor",
        "foliageTexture": "Needle-like",
        "leafShape": "Linear",
        "stemStructure": "Woody",
        "overallHabit": "Upright/Spreading",
        "biometricFeatures": [
            "White underside",
            "Resinous Scent"
        ]
    },
    {
        "id": "p_out_12",
        "name": "Tulip",
        "scientificName": "Tulipa gesneriana",
        "description": "Spring-blooming bulb with large, cup-shaped vibrant flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1520763185298-1b434c919102",
        "idealTempMin": -20,
        "idealTempMax": 20,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Iconic Spring Flower",
            "Variety"
        ],
        "price": 5,
        "type": "outdoor",
        "foliageTexture": "Smooth/Glaucous",
        "leafShape": "Broadly Linear",
        "stemStructure": "Bulbous/Scaped",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Tunicated Bulb",
            "6 Tepals"
        ]
    },
    {
        "id": "p_out_13",
        "name": "Magnolia",
        "scientificName": "Magnolia grandiflora",
        "description": "Grand tree with glossy evergreen leaves and massive, lemon-scented white blooms.",
        "imageUrl": "https://images.unsplash.com/photo-1588350552726-0610b78df426",
        "idealTempMin": -10,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Bark (Anxiety)"
        ],
        "advantages": [
            "Year-round Foliage",
            "Showstopper"
        ],
        "price": 150,
        "type": "outdoor",
        "foliageTexture": "Leathery/Indumentum",
        "leafShape": "Elliptic",
        "stemStructure": "Woody Tree",
        "overallHabit": "Pyramidal",
        "biometricFeatures": [
            "Rusty Underside",
            "Aggregate Fruit"
        ]
    },
    {
        "id": "p_out_14",
        "name": "Bamboo",
        "scientificName": "Phyllostachys aurea",
        "description": "Fast-growing grass with woody stems (culms). Excellent for privacy screens.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": -10,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Silica source"
        ],
        "advantages": [
            "Fastest Growing",
            "Sustainable Material"
        ],
        "price": 60,
        "type": "outdoor",
        "foliageTexture": "Papery/Rough",
        "leafShape": "Linear-Lanceolate",
        "stemStructure": "Jointed Culm",
        "overallHabit": "Clumping/Running",
        "biometricFeatures": [
            "Nodes/Internodes",
            "Hollow Stem"
        ]
    },
    {
        "id": "p_out_15",
        "name": "Marigold",
        "scientificName": "Tagetes erecta",
        "description": "Bright orange/yellow annuals that repel garden pests.",
        "imageUrl": "https://images.unsplash.com/photo-1603529323380-6e4f1a239922",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Skin Healing",
            "Eye Health (Lutein)"
        ],
        "advantages": [
            "Pest Repellent",
            "Continuous Bloom"
        ],
        "price": 6,
        "type": "outdoor",
        "foliageTexture": "Fern-like",
        "leafShape": "Pinnatisect",
        "stemStructure": "Herbaceous",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Pungent Scent",
            "Composite Flower"
        ]
    },
    {
        "id": "p_out_16",
        "name": "Thyme",
        "scientificName": "Thymus vulgaris",
        "description": "Low-growing woody herb with tiny aromatic leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1616790875220-4318c41d1a93",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 20,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antimicrobial",
            "Respiratory"
        ],
        "advantages": [
            "Ground Cover",
            "Edible"
        ],
        "price": 8,
        "type": "outdoor",
        "foliageTexture": "Tiny/Hard",
        "leafShape": "Ovate/Tiny",
        "stemStructure": "Woody Subshrub",
        "overallHabit": "Mat-forming",
        "biometricFeatures": [
            "Square Stem",
            "Opposite Leaves"
        ]
    },
    {
        "id": "p_out_17",
        "name": "Bougainvillea",
        "scientificName": "Bougainvillea glabra",
        "description": "Thorny vine with vibrant papery bracts in magenta, purple, or red.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": 5,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Drought Tolerant",
            "Intense Color"
        ],
        "price": 45,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Ovate-Acuminate",
        "stemStructure": "Woody Climber",
        "overallHabit": "Scandent",
        "biometricFeatures": [
            "Colorful Bracts",
            "Axillary Thorns"
        ]
    },
    {
        "id": "p_out_18",
        "name": "Fern (Outdoor)",
        "scientificName": "Polystichum munitum",
        "description": "Western Sword Fern. Hardy evergreen fern for shady spots.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": -15,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Traditional Pain Relief"
        ],
        "advantages": [
            "Erosion Control",
            "Winter Greenery"
        ],
        "price": 20,
        "type": "outdoor",
        "foliageTexture": "Leathery",
        "leafShape": "Pinnate",
        "stemStructure": "Rhizome",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Sori rows",
            "Chaffy scales"
        ]
    },
    {
        "id": "p_out_19",
        "name": "Dahlia",
        "scientificName": "Dahlia pinnata",
        "description": "Tuberous plant producing complex, geometric flowers in rainbow colors.",
        "imageUrl": "https://images.unsplash.com/photo-1595133642352-7b3c27150a58",
        "idealTempMin": 10,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Insulin (Historical)"
        ],
        "advantages": [
            "Cut Flower",
            "Diverse Forms"
        ],
        "price": 12,
        "type": "outdoor",
        "foliageTexture": "Rough",
        "leafShape": "Pinnate/Serrated",
        "stemStructure": "Hollow Herbaceous",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Tuberous Roots",
            "Composite Head"
        ]
    },
    {
        "id": "p_out_20",
        "name": "Wisteria",
        "scientificName": "Wisteria sinensis",
        "description": "Vigorous woody vine dripping with cascading clusters of purple flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -20,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Romantic Aesthetic",
            "Fragrance"
        ],
        "price": 55,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Pinnate (Compound)",
        "stemStructure": "Woody Liana",
        "overallHabit": "Climbing/Twining",
        "biometricFeatures": [
            "Velvety Pods",
            "Raceme Inflorescence"
        ]
    },
    {
        "id": "p_out_21",
        "name": "Juniper",
        "scientificName": "Juniperus chinensis",
        "description": "Coniferous evergreen shrub/tree with berry-like cones. Tough and hardy.",
        "imageUrl": "https://images.unsplash.com/photo-1588631189912-88741369527f",
        "idealTempMin": -30,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Antiseptic (Berries)"
        ],
        "advantages": [
            "Screening",
            "Bird Habitat"
        ],
        "price": 40,
        "type": "outdoor",
        "foliageTexture": "Scale-like/Needle",
        "leafShape": "Awl/Scale",
        "stemStructure": "Woody",
        "overallHabit": "Pyramidal/Spreading",
        "biometricFeatures": [
            "Blue 'Berries' (Cones)",
            "Aromatic foliage"
        ]
    },
    {
        "id": "p_out_22",
        "name": "Agave",
        "scientificName": "Agave americana",
        "description": "Large succulent rosette with sharp spines. Monocarpic (blooms once then dies).",
        "imageUrl": "https://images.unsplash.com/photo-1567331140054-3839d67562f8",
        "idealTempMin": -5,
        "idealTempMax": 40,
        "minHumidity": 10,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Sweetener (Nectar)",
            "Antiseptic"
        ],
        "advantages": [
            "Xeriscaping",
            "Structural"
        ],
        "price": 50,
        "type": "outdoor",
        "foliageTexture": "Smooth/Tough",
        "leafShape": "Lanceolate (Thick)",
        "stemStructure": "Basal Rosette",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Terminal Spine",
            "Imprint patterns"
        ]
    },
    {
        "id": "p_out_23",
        "name": "Morning Glory",
        "scientificName": "Ipomoea purpurea",
        "description": "Fast-growing annual vine with trumpet flowers that open in the morning.",
        "imageUrl": "https://images.unsplash.com/photo-1594582969248-8e8e7c10b713",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Quick Cover",
            "Pollinators"
        ],
        "price": 5,
        "type": "outdoor",
        "foliageTexture": "Hairy",
        "leafShape": "Cordate (Heart)",
        "stemStructure": "Twining Herbaceous",
        "overallHabit": "Climbing",
        "biometricFeatures": [
            "Funnel Flower",
            "Twining Stem"
        ]
    },
    {
        "id": "p_out_24",
        "name": "Hibiscus",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "Tropical shrub with huge, trumpet-shaped flowers and prominent stamen.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 10,
        "idealTempMax": 32,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Tea (Blood Pressure)"
        ],
        "advantages": [
            "Tropical Flair",
            "Edible Flowers"
        ],
        "price": 35,
        "type": "outdoor",
        "foliageTexture": "Glossy/Serrated",
        "leafShape": "Ovate",
        "stemStructure": "Woody",
        "overallHabit": "Bushy",
        "biometricFeatures": [
            "Prominent Stamen Column",
            "5 Petals"
        ]
    },
    {
        "id": "p_out_25",
        "name": "Hostas (Blue)",
        "scientificName": "Hosta sieboldiana",
        "description": "Large, blue-green corrugated leaves. The king of the shade garden.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": -30,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Texture",
            "Cool Color"
        ],
        "price": 25,
        "type": "outdoor",
        "foliageTexture": "Corrugated/Waxy",
        "leafShape": "Broadly Ovate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Glaucous coating",
            "Parallel veins"
        ]
    },
    {
        "id": "p_out_26",
        "name": "Bleeding Heart",
        "scientificName": "Lamprocapnos spectabilis",
        "description": "Graceful shade perennial with heart-shaped pink flowers dangling from arching stems.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -30,
        "idealTempMax": 20,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique Flower",
            "Early Bloomer"
        ],
        "price": 20,
        "type": "outdoor",
        "foliageTexture": "Soft/Fern-like",
        "leafShape": "Compound",
        "stemStructure": "Fleshy/Herbaceous",
        "overallHabit": "Arching",
        "biometricFeatures": [
            "Pendant Flowers",
            "Dissected Leaves"
        ]
    },
    {
        "id": "p_out_27",
        "name": "Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "Tough prairie native with purple daisylike flowers and orange cones. Medicinal powerhouse.",
        "imageUrl": "https://images.unsplash.com/photo-1595133642352-7b3c27150a58",
        "idealTempMin": -30,
        "idealTempMax": 35,
        "minHumidity": 30,
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
        "price": 15,
        "type": "outdoor",
        "foliageTexture": "Rough/Hairy",
        "leafShape": "Lanceolate",
        "stemStructure": "Stiff Herbaceous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Spiky Cone",
            "Reflexed Ray Florets"
        ]
    },
    {
        "id": "p_out_28",
        "name": "Black-Eyed Susan",
        "scientificName": "Rudbeckia hirta",
        "description": "Cheerful yellow wildflowers with dark brown centers.",
        "imageUrl": "https://images.unsplash.com/photo-1603529323380-6e4f1a239922",
        "idealTempMin": -30,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Immune Stimulant (Roots)"
        ],
        "advantages": [
            "Long Blooming",
            "Hardy"
        ],
        "price": 10,
        "type": "outdoor",
        "foliageTexture": "Hairy/Rough",
        "leafShape": "Ovate/Lanceolate",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright",
        "biometricFeatures": [
            "Hirsute Stems",
            "Composite Flower"
        ]
    },
    {
        "id": "p_out_29",
        "name": "Japanese Pachysandra",
        "scientificName": "Pachysandra terminalis",
        "description": "Evergreen groundcover for deep shade. Forms a dense green carpet.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": -30,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shade Solution",
            "Deer Resistant"
        ],
        "price": 8,
        "type": "outdoor",
        "foliageTexture": "Glossy/Leathery",
        "leafShape": "Obovate (Toothed)",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Spreading Carpet",
        "biometricFeatures": [
            "Whorled Leaves",
            "Terminal Spikes"
        ]
    },
    {
        "id": "p_out_30",
        "name": "Forsythia",
        "scientificName": "Forsythia x intermedia",
        "description": "Deciduous shrub that announces spring with a burst of bright yellow flowers before leaves appear.",
        "imageUrl": "https://images.unsplash.com/photo-1628169225700-1d8f58b8d96d",
        "idealTempMin": -25,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antiviral (Fruit)"
        ],
        "advantages": [
            "Early Color",
            "Fast Growing"
        ],
        "price": 30,
        "type": "outdoor",
        "foliageTexture": "Smooth/Serrated",
        "leafShape": "Ovate-Lanceolate",
        "stemStructure": "Woody Cane",
        "overallHabit": "Arching Shrub",
        "biometricFeatures": [
            "Lenticels on bark",
            "Square stems"
        ]
    },
    {
        "id": "p_out_31",
        "name": "Lilac",
        "scientificName": "Syringa vulgaris",
        "description": "Old-fashioned shrub famous for its heavily scented purple or white conical blooms.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -40,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Fragrance",
            "Cold Hardy"
        ],
        "price": 45,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Cordate",
        "stemStructure": "Woody",
        "overallHabit": "Upright Shrub",
        "biometricFeatures": [
            "Panicle Blooms",
            "Opposite Leaves"
        ]
    },
    {
        "id": "p_out_32",
        "name": "Butterfly Bush",
        "scientificName": "Buddleja davidii",
        "description": "Fast growing shrub with long flower spikes that attract butterflies and hummingbirds.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -20,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Wildlife Magnet",
            "Long Bloom"
        ],
        "price": 25,
        "type": "outdoor",
        "foliageTexture": "Gray-Green/Felted",
        "leafShape": "Lanceolate",
        "stemStructure": "Woody/Cane",
        "overallHabit": "Arching",
        "biometricFeatures": [
            "Square Stems",
            "Honey Scent"
        ]
    },
    {
        "id": "p_out_33",
        "name": "Daylily",
        "scientificName": "Hemerocallis",
        "description": "Rugged perennial with trumpet flowers that last only one day, but produced in succession.",
        "imageUrl": "https://images.unsplash.com/photo-1595133642352-7b3c27150a58",
        "idealTempMin": -35,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Edible buds"
        ],
        "advantages": [
            "Roadside Tough",
            "Vast Variety"
        ],
        "price": 12,
        "type": "outdoor",
        "foliageTexture": "Grass-like",
        "leafShape": "Linear (Keel)",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Tuberous Roots",
            "Fan arrangement"
        ]
    },
    {
        "id": "p_out_34",
        "name": "Lamb's Ear",
        "scientificName": "Stachys byzantina",
        "description": "Grown for its incredibly soft, fuzzy, silver-gray foliage. Children love it.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": -30,
        "idealTempMax": 30,
        "minHumidity": 20,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antimicrobial Bandage"
        ],
        "advantages": [
            "Texture",
            "Drought Tolerant"
        ],
        "price": 10,
        "type": "outdoor",
        "foliageTexture": "Woolly/Velvet",
        "leafShape": "Oblong",
        "stemStructure": "Herbaceous",
        "overallHabit": "Mat-forming",
        "biometricFeatures": [
            "Dense Trichomes",
            "Square Stem"
        ]
    },
    {
        "id": "p_out_35",
        "name": "Yew",
        "scientificName": "Taxus baccata",
        "description": "Dense evergreen conifer often used for formal hedges. Long lived but toxic.",
        "imageUrl": "https://images.unsplash.com/photo-1588631189912-88741369527f",
        "idealTempMin": -25,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Taxol (Cancer Drug) - warning toxic"
        ],
        "advantages": [
            "Shade Tolerant Evergreen",
            "Clippable"
        ],
        "price": 50,
        "type": "outdoor",
        "foliageTexture": "Needle (Flat)",
        "leafShape": "Linear",
        "stemStructure": "Woody",
        "overallHabit": "Broad/Upright",
        "biometricFeatures": [
            "Red Arils",
            "Spiral arrangement"
        ]
    },
    {
        "id": "p_out_36",
        "name": "Coral Bells",
        "scientificName": "Heuchera",
        "description": "Mounding perennial grown for its colorful foliage in purple, caramel, lime, and red.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": -30,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Astringent (Root)"
        ],
        "advantages": [
            "Foliage Color",
            "Compact"
        ],
        "price": 18,
        "type": "outdoor",
        "foliageTexture": "Lobed/Ruffled",
        "leafShape": "Cordate/Orbicular",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Mounding",
        "biometricFeatures": [
            "Long Petioles",
            "Tiny Bell Flowers"
        ]
    },
    {
        "id": "p_out_37",
        "name": "Lantana",
        "scientificName": "Lantana camara",
        "description": "Heat-loving shrub/groundcover with clusters of multicolor flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1603529323380-6e4f1a239922",
        "idealTempMin": -5,
        "idealTempMax": 40,
        "minHumidity": 20,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic berries)"
        ],
        "advantages": [
            "Butterfly Magnet",
            "Heat Proof"
        ],
        "price": 15,
        "type": "outdoor",
        "foliageTexture": "Rough/Sandpaper",
        "leafShape": "Ovate",
        "stemStructure": "Woody Subshrub",
        "overallHabit": "Spreading",
        "biometricFeatures": [
            "Aromatic Leaves",
            "Square Stem"
        ]
    },
    {
        "id": "p_out_38",
        "name": "Crape Myrtle",
        "scientificName": "Lagerstroemia indica",
        "description": "Summer-blooming tree with peeling bark and crinkled flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": -15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Summer Color",
            "Beautiful Bark"
        ],
        "price": 75,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Elliptic/Obovate",
        "stemStructure": "Multi-trunk Tree",
        "overallHabit": "Vase",
        "biometricFeatures": [
            "Exfoliating Bark",
            "Panicle Bloom"
        ]
    },
    {
        "id": "p_out_39",
        "name": "Snapdragon",
        "scientificName": "Antirrhinum majus",
        "description": "Cool-season annual with tall spikes of dragon-faced flowers that open when squeezed.",
        "imageUrl": "https://images.unsplash.com/photo-1595133642352-7b3c27150a58",
        "idealTempMin": -5,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fun for Kids",
            "Cut Flower"
        ],
        "price": 6,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Lanceolate",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright Spike",
        "biometricFeatures": [
            "Bilabiate Flower",
            "Opposite/Alternate"
        ]
    },
    {
        "id": "p_out_40",
        "name": "Ornamental Grass (Maiden)",
        "scientificName": "Miscanthus sinensis",
        "description": "Tall, graceful grass with feathery plumes in autumn.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": -25,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Movement",
            "Winter Interest"
        ],
        "price": 25,
        "type": "outdoor",
        "foliageTexture": "Rough Edge",
        "leafShape": "Linear",
        "stemStructure": "Culm",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Midrib Silver",
            "Plumes"
        ]
    },
    {
        "id": "p_out_41",
        "name": "Clematis",
        "scientificName": "Clematis",
        "description": "Queen of the climbers. Vines with diverse, showy flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -30,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Vertical Color",
            "Diverse"
        ],
        "price": 35,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Compound (Leaflet)",
        "stemStructure": "Climbing Liana",
        "overallHabit": "Vining",
        "biometricFeatures": [
            "Twining Petioles",
            "Opposite Leaves"
        ]
    },
    {
        "id": "p_out_42",
        "name": "Hellebore",
        "scientificName": "Helleborus orientalis",
        "description": "Lenten Rose. Blooms in late winter/early spring with nodding, cup-shaped flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -20,
        "idealTempMax": 20,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Evergreen",
            "Shade Tolerant"
        ],
        "price": 25,
        "type": "outdoor",
        "foliageTexture": "Leathery/Toothed",
        "leafShape": "Palmate/Pedate",
        "stemStructure": "Rhizomatous",
        "overallHabit": "Clumping",
        "biometricFeatures": [
            "Sepals not petals",
            "Dark foliage"
        ]
    },
    {
        "id": "p_out_43",
        "name": "Sedum 'Autumn Joy'",
        "scientificName": "Hylotelephium telephium",
        "description": "Upright succulent perennial with flat flower heads that turn pink-bronze in fall.",
        "imageUrl": "https://images.unsplash.com/photo-1509304388383-ed5808ce4913",
        "idealTempMin": -30,
        "idealTempMax": 35,
        "minHumidity": 20,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Vulnerary (Leaf juice)"
        ],
        "advantages": [
            "Pollinators",
            "Winter Skeleton"
        ],
        "price": 15,
        "type": "outdoor",
        "foliageTexture": "Fleshy/Smooth",
        "leafShape": "Ovate/Toothed",
        "stemStructure": "Succulent",
        "overallHabit": "Clump",
        "biometricFeatures": [
            "Glaucous leaves",
            "Corymb"
        ]
    },
    {
        "id": "p_out_44",
        "name": "Fuchsia",
        "scientificName": "Fuchsia magellanica",
        "description": "Shrub or hanging plant with exotic, two-tone pendant flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": 5,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Hummingbirds",
            "Shade Color"
        ],
        "price": 20,
        "type": "outdoor",
        "foliageTexture": "Smooth/Serrated",
        "leafShape": "Lanceolate",
        "stemStructure": "Woody",
        "overallHabit": "Arching",
        "biometricFeatures": [
            "Pendant Bloom",
            "Red Stems"
        ]
    },
    {
        "id": "p_out_45",
        "name": "Weigela",
        "scientificName": "Weigela florida",
        "description": "Old-fashioned shrub with trumpet-shaped flowers in pink or red.",
        "imageUrl": "https://images.unsplash.com/photo-1589539129532-61a156e5428a",
        "idealTempMin": -25,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spring Bloom",
            "Easy"
        ],
        "price": 30,
        "type": "outdoor",
        "foliageTexture": "Rough",
        "leafShape": "Elliptic",
        "stemStructure": "Woody",
        "overallHabit": "Arching",
        "biometricFeatures": [
            "Opposite Leaves",
            "Funnel Flower"
        ]
    },
    {
        "id": "p_out_46",
        "name": "Zinnia",
        "scientificName": "Zinnia elegans",
        "description": "Easy annual with dahlia-like blooms in every color except blue.",
        "imageUrl": "https://images.unsplash.com/photo-1595133642352-7b3c27150a58",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cut Flower",
            "Butterfly Magnet"
        ],
        "price": 5,
        "type": "outdoor",
        "foliageTexture": "Sandpaper-like",
        "leafShape": "Ovate/Lanceolate",
        "stemStructure": "Herbaceous",
        "overallHabit": "Upright/Bushy",
        "biometricFeatures": [
            "Opposite/Sessile",
            "Ray Florets"
        ]
    },
    {
        "id": "p_out_47",
        "name": "Gardenia",
        "scientificName": "Gardenia jasminoides",
        "description": "Finicky shrub with glossy dark leaves and intensely fragrant wax-white flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1588350552726-0610b78df426",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Fruit (Traditional Medicine)"
        ],
        "advantages": [
            "Scent",
            "Elegant"
        ],
        "price": 40,
        "type": "outdoor",
        "foliageTexture": "Glossy/Leathery",
        "leafShape": "Lanceolate/Obovate",
        "stemStructure": "Woody",
        "overallHabit": "Rounded Shrub",
        "biometricFeatures": [
            "Whorled leaves",
            "Waxy Bloom"
        ]
    },
    {
        "id": "p_out_48",
        "name": "Pansy",
        "scientificName": "Viola x wittrockiana",
        "description": "Cool-weather favorite with flat, face-like flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1563217684-28b9d2423e80",
        "idealTempMin": -5,
        "idealTempMax": 20,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Expectorant (Viola)"
        ],
        "advantages": [
            "Edible",
            "Winter Color (Mild climates)"
        ],
        "price": 4,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Ovate/Crenate",
        "stemStructure": "Herbaceous",
        "overallHabit": "Low/Clump",
        "biometricFeatures": [
            "Stipules",
            "5 Petals (2 up, 3 down)"
        ]
    },
    {
        "id": "p_out_49",
        "name": "Elephant Ear (Colocasia)",
        "scientificName": "Colocasia esculenta",
        "description": "Tropical tuber grown for its massive, downward-hanging foliage.",
        "imageUrl": "https://images.unsplash.com/photo-1601903673322-c35cb58bd61f",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Edible Tuber (Taro - cooked)"
        ],
        "advantages": [
            "Jungle Look",
            "Wet Soil Tolerant"
        ],
        "price": 25,
        "type": "outdoor",
        "foliageTexture": "Velvety/Matte",
        "leafShape": "Peltate/Sagittate",
        "stemStructure": "Tuberous",
        "overallHabit": "Upright Clump",
        "biometricFeatures": [
            "Hanging leaves",
            "Peltate attachment"
        ]
    },
    {
        "id": "p_out_50",
        "name": "Sweet Potato Vine",
        "scientificName": "Ipomoea batatas",
        "description": "Ornamental vine meant for foliage in chartreuse, purple, or bronze.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Edible Tuber (but bred for looks)"
        ],
        "advantages": [
            "Trailer",
            "Heat Loving"
        ],
        "price": 8,
        "type": "outdoor",
        "foliageTexture": "Smooth",
        "leafShape": "Cordate/Lobed",
        "stemStructure": "Vining",
        "overallHabit": "Spreading",
        "biometricFeatures": [
            "Palmate Lobes",
            "Milky Sap"
        ]
    }
];

module.exports = { indoorPlants, outdoorPlants };
