// Extended Plant Data Module
const indoorPlants = [
    {
        "id": "p_in_01",
        "name": "Snake Plant",
        "scientificName": "Sansevieria trifasciata",
        "description": "A hardy succulent that grows tall, upright leaves with yellow edges. Excellent for bedroom air purification.",
        "imageUrl": "https://images.unsplash.com/photo-1593482886870-9202a88e2c40",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Air purification",
            "Stress reduction"
        ],
        "advantages": [
            "Releases oxygen at night",
            "Tolerates neglect"
        ],
        "price": 25,
        "type": "indoor",
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
        "id": "p_in_02",
        "name": "Spider Plant",
        "scientificName": "Chlorophytum comosum",
        "description": "Known for its arching leaves and baby plantlets. One of the easiest plants to grow.",
        "imageUrl": "https://images.unsplash.com/photo-1572688484279-a9e8f75ebe0c",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes formaldehyde"
        ],
        "advantages": [
            "Fast growing",
            "Pet friendly"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_03",
        "name": "Peace Lily",
        "scientificName": "Spathiphyllum",
        "description": "Features elegant white blooms and dark green leaves. Communicates thirst by drooping.",
        "imageUrl": "https://images.unsplash.com/photo-1593691509543-c55ce32e01b5",
        "idealTempMin": 18,
        "idealTempMax": 26,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Removes mold spores"
        ],
        "advantages": [
            "Visual indicator for watering",
            "Flowering"
        ],
        "price": 30,
        "type": "indoor",
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
        "id": "p_in_04",
        "name": "Aloe Vera",
        "scientificName": "Aloe barbadensis miller",
        "description": "Succulent with thick, fleshy leaves containing healing gel. Thrives on a sunny windowsill.",
        "imageUrl": "https://images.unsplash.com/photo-1567331140054-3839d67562f8",
        "idealTempMin": 13,
        "idealTempMax": 27,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Treats burns",
            "Skin care"
        ],
        "advantages": [
            "Medicinal gel",
            "Drought tolerant"
        ],
        "price": 20,
        "type": "indoor",
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
        "id": "p_in_05",
        "name": "Rubber Plant",
        "scientificName": "Ficus elastica",
        "description": "Large, glossy, dark green leaves. Can grow into a large indoor tree.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air toxin removal"
        ],
        "advantages": [
            "Statement piece",
            "Robust structure"
        ],
        "price": 45,
        "type": "indoor",
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
        "id": "p_in_06",
        "name": "ZZ Plant",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "Waxy, smooth leaves that reflect light. Can survive in very low light and weeks without water.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Indestructible",
            "Modern look"
        ],
        "price": 35,
        "type": "indoor",
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
        "id": "p_in_07",
        "name": "English Ivy",
        "scientificName": "Hedera helix",
        "description": "Vigorous climber with evergreen foliage. Looks great in hanging baskets.",
        "imageUrl": "https://images.unsplash.com/photo-1560717840-7756774a0045",
        "idealTempMin": 10,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Reduces airborne mold"
        ],
        "advantages": [
            "Trailing growth",
            "Classic aesthetic"
        ],
        "price": 18,
        "type": "indoor",
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
        "id": "p_in_08",
        "name": "Pothos",
        "scientificName": "Epipremnum aureum",
        "description": "Heart-shaped leaves that vine profusely. Extremely forgiving of various light conditions.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes VOCs"
        ],
        "advantages": [
            "Easy propagation",
            "Trailing beauty"
        ],
        "price": 12,
        "type": "indoor",
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
        "id": "p_in_09",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "Lush, feathery fronds. Adds a soft, tropical feel but needs high humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Humidifies air"
        ],
        "advantages": [
            "Non-toxic",
            "Lush greenery"
        ],
        "price": 22,
        "type": "indoor",
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
        "id": "p_in_10",
        "name": "Areca Palm",
        "scientificName": "Dypsis lutescens",
        "description": "Bamboo-like stems with arching fronds. Great for adding height and tropical vibes.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Removes xylene/toluene"
        ],
        "advantages": [
            "Pet safe",
            "Large plant impact"
        ],
        "price": 55,
        "type": "indoor",
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
        "id": "p_in_11",
        "name": "Monstera",
        "scientificName": "Monstera deliciosa",
        "description": "Famous for its large, fenestrated 'Swiss cheese' leaves. A fast-growing climber.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Mood booster"
        ],
        "advantages": [
            "Iconic aesthetic",
            "Fast growth"
        ],
        "price": 45,
        "type": "indoor",
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
        "id": "p_in_12",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "Large, violin-shaped leaves. A popular design element but can be finicky.",
        "imageUrl": "https://images.unsplash.com/photo-1597054232360-1e5b85e05a5a",
        "idealTempMin": 18,
        "idealTempMax": 28,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purifying"
        ],
        "advantages": [
            "Architectural shape",
            "Tree-like"
        ],
        "price": 60,
        "type": "indoor",
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
        "id": "p_in_13",
        "name": "Chinese Evergreen",
        "scientificName": "Aglaonema",
        "description": "Patterned leaves in shades of green, silver, or red. Extremely durable.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 28,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Removes benzene"
        ],
        "advantages": [
            "Colorful foliage",
            "Low light tolerant"
        ],
        "price": 28,
        "type": "indoor",
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
        "id": "p_in_14",
        "name": "Calathea Rattlesnake",
        "scientificName": "Goeppertia insignis",
        "description": "Striking patterns and purple undersides. Leaves fold up at night.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 65,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None specific"
        ],
        "advantages": [
            "Decorative foliage",
            "Pet safe"
        ],
        "price": 32,
        "type": "indoor",
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
        "id": "p_in_15",
        "name": "Philodendron Heartleaf",
        "scientificName": "Philodendron hederaceum",
        "description": "Classic trailing plant with deep green heart-shaped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 16,
        "idealTempMax": 28,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Fast grower",
            "Easy care"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_16",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "Tree-like succulent symbolizing good luck. Needs direct sun.",
        "imageUrl": "https://images.unsplash.com/photo-1509304388383-ed5808ce4913",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Traditional remedy"
        ],
        "advantages": [
            "Long lived",
            "Easy to prune"
        ],
        "price": 20,
        "type": "indoor",
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
        "id": "p_in_17",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "Named for its ability to survive nearly anything: low light, neglect, drafts.",
        "imageUrl": "https://images.unsplash.com/photo-1611211232932-da3113c5b960",
        "idealTempMin": 10,
        "idealTempMax": 29,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Virtually unkillable",
            "Broad leaves"
        ],
        "price": 40,
        "type": "indoor",
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
        "id": "p_in_18",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia nicolai",
        "description": "Large, banana-like leaves that bring the tropics indoors. Needs bright light.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Dramatic statement",
            "Very tall"
        ],
        "price": 75,
        "type": "indoor",
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
        "id": "p_in_19",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "Succulent with cascading stems of pea-like beads. Unique and delicate.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique texture",
            "Conversation starter"
        ],
        "price": 20,
        "type": "indoor",
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
        "id": "p_in_20",
        "name": "Anthurium",
        "scientificName": "Anthurium andraeanum",
        "description": "Long-lasting, waxy red flowers (spathes) and glossy heart leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1614959542732-44677764a784",
        "idealTempMin": 18,
        "idealTempMax": 28,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes ammonia"
        ],
        "advantages": [
            "Blooms for months",
            "Colorful"
        ],
        "price": 35,
        "type": "indoor",
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
        "id": "p_in_21",
        "name": "Bird's Nest Fern",
        "scientificName": "Asplenium nidus",
        "description": "Epiphytic fern with large, simple fronds resembling a nest.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Unique shape"
        ],
        "price": 25,
        "type": "indoor",
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
        "id": "p_in_22",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "Distinctive swollen trunk used for water storage with cascading leaves.",
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
            "Drought tolerant",
            "Slow growing"
        ],
        "price": 45,
        "type": "indoor",
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
        "id": "p_in_23",
        "name": "Dumb Cane",
        "scientificName": "Dieffenbachia",
        "description": "Large, variegated leaves in green and white cream. Toxic if ingested.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 16,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Fast growing",
            "Lush look"
        ],
        "price": 22,
        "type": "indoor",
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
        "id": "p_in_24",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "Compact palm with feathery fronds. Popular since Victorian times.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes benzene"
        ],
        "advantages": [
            "Pet safe",
            "Adapts to low light"
        ],
        "price": 20,
        "type": "indoor",
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
        "id": "p_in_25",
        "name": "Arrowhead Plant",
        "scientificName": "Syngonium podophyllum",
        "description": "Leaves start arrow-shaped and become lobed as they mature.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 16,
        "idealTempMax": 29,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Easy care",
            "Diverse colors"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_26",
        "name": "Peperomia",
        "scientificName": "Peperomia obtusifolia",
        "description": "Thick, rubbery leaves. Compact and easy to grow.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Desk plant"
        ],
        "price": 12,
        "type": "indoor",
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
        "id": "p_in_27",
        "name": "Prayer Plant",
        "scientificName": "Maranta leuconeura",
        "description": "Leaves fold up at night like praying hands. Stunning patterns.",
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
            "Non-toxic",
            "Active movement"
        ],
        "price": 25,
        "type": "indoor",
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
        "id": "p_in_28",
        "name": "Yucca",
        "scientificName": "Yucca elephantipes",
        "description": "Bold, sword-shaped leaves on woody canes. Very architectural.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Drought tolerant",
            "Vertical accent"
        ],
        "price": 55,
        "type": "indoor",
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
        "id": "p_in_29",
        "name": "Money Tree",
        "scientificName": "Pachira aquatica",
        "description": "Braided trunk and palmate leaves. Symbol of prosperity.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 16,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Good luck gift"
        ],
        "price": 45,
        "type": "indoor",
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
        "id": "p_in_30",
        "name": "Dracaena Marginata",
        "scientificName": "Dracaena marginata",
        "description": "Spiky leaves on slender stems. Resembles a dragon tree.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Removes xylene"
        ],
        "advantages": [
            "Modern look",
            "Easy care"
        ],
        "price": 30,
        "type": "indoor",
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
        "id": "p_in_31",
        "name": "Hoya Heart",
        "scientificName": "Hoya kerrii",
        "description": "Single heart-shaped leaf often sold as a novelty.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Romantic gift",
            "Succulent"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_32",
        "name": "Begonia Maculata",
        "scientificName": "Begonia maculata",
        "description": "Polka dot begonia with angel wing leaves and red undersides.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Striking foliage",
            "Unique"
        ],
        "price": 35,
        "type": "indoor",
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
        "id": "p_in_33",
        "name": "Schefflera",
        "scientificName": "Schefflera arboricola",
        "description": "Umbrella palm with whorls of leaves. Can become bushy.",
        "imageUrl": "https://images.unsplash.com/photo-1597054232360-1e5b85e05a5a",
        "idealTempMin": 15,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Detoxifies air"
        ],
        "advantages": [
            "Fast grower",
            "Easy to shape"
        ],
        "price": 40,
        "type": "indoor",
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
        "id": "p_in_34",
        "name": "Croton",
        "scientificName": "Codiaeum variegatum",
        "description": "Spectacular colorful leaves in yellow, orange, and red.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Vibrant color",
            "Tropical feel"
        ],
        "price": 25,
        "type": "indoor",
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
        "id": "p_in_35",
        "name": "African Violet",
        "scientificName": "Saintpaulia",
        "description": "Fuzzy leaves and purple/pink flowers. Blooms continuously indoors.",
        "imageUrl": "https://images.unsplash.com/photo-1593482886870-9202a88e2c40",
        "idealTempMin": 18,
        "idealTempMax": 24,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Constant blooms"
        ],
        "price": 10,
        "type": "indoor",
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
        "id": "p_in_36",
        "name": "Air Plant",
        "scientificName": "Tillandsia",
        "description": "Plants that need no soil, absorbing moisture through leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1589335668748-18e3290de004",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "No dirt",
            "Creative display"
        ],
        "price": 8,
        "type": "indoor",
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
        "id": "p_in_37",
        "name": "Kalanchoe",
        "scientificName": "Kalanchoe blossfeldiana",
        "description": "Succulent with sprays of small, bright flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1509304388383-ed5808ce4913",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Wound healing"
        ],
        "advantages": [
            "Long bloom",
            "Low water"
        ],
        "price": 12,
        "type": "indoor",
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
        "id": "p_in_38",
        "name": "Asparagus Fern",
        "scientificName": "Asparagus setaceus",
        "description": "Soft, misty green foliage. Not a true fern.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Delicate texture",
            "Fast growing"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_39",
        "name": "Elephant Ear",
        "scientificName": "Colocasia",
        "description": "Giant, heart-shaped leaves that create a jungle vibe.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 70,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Huge size",
            "Statement"
        ],
        "price": 50,
        "type": "indoor",
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
        "id": "p_in_40",
        "name": "Weeping Fig",
        "scientificName": "Ficus benjamina",
        "description": "Graceful tree with drooping branches. Improved indoor air quality.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tree form",
            "Elegant"
        ],
        "price": 45,
        "type": "indoor",
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
        "id": "p_in_41",
        "name": "Aglaonema 'Lipstick'",
        "scientificName": "Aglaonema 'Lipstick'",
        "description": "Stunning foliage with bright red edges. Very popular in Indian homes for its color.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air purification"
        ],
        "advantages": [
            "Vibrant color",
            "Low maintenance"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_42",
        "name": "Dieffenbachia 'Camilla'",
        "scientificName": "Dieffenbachia seguine",
        "description": "Large cream and green leaves. Thrives in warm Indian interiors.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Lush tropical look",
            "Fast growth"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_43",
        "name": "Song of India",
        "scientificName": "Dracaena reflexa",
        "description": "Twisted leaves with yellow stripes. A classic Indian ornamental plant.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purifying",
            "Removes Xylene"
        ],
        "advantages": [
            "Hardy",
            "Slow growing beauty"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_44",
        "name": "Philodendron 'Ceylon Golden'",
        "scientificName": "Philodendron erubescens",
        "description": "Neon yellow-green leaves. Adds a bright pop of color to shaded verandas.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Bright foliage",
            "Climber"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_45",
        "name": "Money Plant 'Marble Queen'",
        "scientificName": "Epipremnum aureum",
        "description": "Variegated white and green leaves. Believed to bring prosperity in Vastu.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Pollutant removal"
        ],
        "advantages": [
            "Good luck",
            "Cannot look bad"
        ],
        "price": 120,
        "type": "indoor",
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
        "id": "p_in_46",
        "name": "Syngonium 'Pink Splash'",
        "scientificName": "Syngonium podophyllum",
        "description": "Arrowhead plant with pink speckles. Very trendy in Bangalore nurseries.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pink aesthetic",
            "Bushy growth"
        ],
        "price": 180,
        "type": "indoor",
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
        "id": "p_in_47",
        "name": "Caladium 'Heart of Jesus'",
        "scientificName": "Caladium bicolor",
        "description": "Papery thin leaves with vibrant red/pink patterns. Loves Kerala humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 22,
        "idealTempMax": 35,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Showy",
            "Tuberous"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_48",
        "name": "Bamboo Palm",
        "scientificName": "Chamaedorea seifrizii",
        "description": "Cluster forming palm that looks like bamboo. Great screen for balconies.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Top air purifier (NASA)"
        ],
        "advantages": [
            "Privacy screen",
            "Pet safe"
        ],
        "price": 450,
        "type": "indoor",
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
        "id": "p_in_49",
        "name": "Fishtail Palm",
        "scientificName": "Caryota mitis",
        "description": "Leaves resemble a fish tail. Common in South Indian landscaping.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique leaf shape",
            "Tall"
        ],
        "price": 400,
        "type": "indoor",
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
        "id": "p_in_50",
        "name": "Ming Aralia",
        "scientificName": "Polyscias fruticosa",
        "description": "Feathery, bonsai-like foliage. Elegant and artistic structure.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Anti-inflammatory (Leaf tonic)"
        ],
        "advantages": [
            "Asian aesthetic",
            "Slow growing"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_51",
        "name": "Croton 'Petra'",
        "scientificName": "Codiaeum variegatum",
        "description": "Bold leaves with yellow, red, and orange veins. 'Bangalore Croton'.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Color explosion",
            "Hedge potential"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_52",
        "name": "Red Cordyline",
        "scientificName": "Cordyline fruticosa",
        "description": "Deep burgundy/pink leaves. Known locally as 'Good Luck Plant'.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Structural color",
            "Upright"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_53",
        "name": "Maidenhair Fern",
        "scientificName": "Adiantum",
        "description": "Delicate, fan-shaped leaflets on black stems. Adored for its lacey look.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 18,
        "idealTempMax": 28,
        "minHumidity": 75,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Soft texture",
            "Terrarium suited"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_54",
        "name": "Spider Plant 'Bonnie'",
        "scientificName": "Chlorophytum comosum",
        "description": "Curly variety of the classic Spider Plant. Compact and cute.",
        "imageUrl": "https://images.unsplash.com/photo-1572688484279-a9e8f75ebe0c",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Curled leaves",
            "Hangable"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_55",
        "name": "Snake Plant 'Laurentii'",
        "scientificName": "Sansevieria trifasciata",
        "description": "Yellow-edged sword leaves. The most durable plant for Indian heat.",
        "imageUrl": "https://images.unsplash.com/photo-1593482886870-9202a88e2c40",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Night oxygen"
        ],
        "advantages": [
            "Indestructible",
            "Modern"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_56",
        "name": "Asparagus Fern",
        "scientificName": "Asparagus densiflorus",
        "description": "Bright green, needle-like leaves. Cascades beautifully from pots.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast filler",
            "Textural contrast"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_57",
        "name": "ZZ Raven",
        "scientificName": "Zamioculcas zamiifolia",
        "description": "Rare variety with nearly black leaves. Very stylish and premium.",
        "imageUrl": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361",
        "idealTempMin": 18,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Black foliage",
            "Trendy"
        ],
        "price": 800,
        "type": "indoor",
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
        "id": "p_in_58",
        "name": "Lucky Bamboo",
        "scientificName": "Dracaena sanderiana",
        "description": "Stalks grown in water. A staple gift for Feng Shui and positivity.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Positive energy"
        ],
        "advantages": [
            "Hydroponic",
            "Giftable"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_59",
        "name": "Anthurium 'Red'",
        "scientificName": "Anthurium andraeanum",
        "description": "Classic red waxy flower. Long-lasting blooms for indoor tables.",
        "imageUrl": "https://images.unsplash.com/photo-1614959542732-44677764a784",
        "idealTempMin": 20,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Flowers indoors",
            "Air cleaner"
        ],
        "price": 450,
        "type": "indoor",
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
        "id": "p_in_60",
        "name": "Peace Lily 'Sensation'",
        "scientificName": "Spathiphyllum",
        "description": "A giant variety with massive leaves. Fills corners perfectly.",
        "imageUrl": "https://images.unsplash.com/photo-1593691509543-c55ce32e01b5",
        "idealTempMin": 20,
        "idealTempMax": 32,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Mold spore removal"
        ],
        "advantages": [
            "Huge size",
            "Statement"
        ],
        "price": 600,
        "type": "indoor",
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
        "id": "p_in_61",
        "name": "Rubber Plant 'Burgundy'",
        "scientificName": "Ficus elastica",
        "description": "Dark, glossy, burgundy leaves. A sturdy and bold statement plant.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air scrubbing"
        ],
        "advantages": [
            "Bold look",
            "Easy care"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_62",
        "name": "Bird of Paradise",
        "scientificName": "Strelitzia nicolai",
        "description": "Large banana-like leaves. Brings a massive tropical vibe indoors.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Architectural",
            "Impactive"
        ],
        "price": 800,
        "type": "indoor",
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
        "id": "p_in_63",
        "name": "Fiddle Leaf Fig",
        "scientificName": "Ficus lyrata",
        "description": "Violin-shaped leaves. The 'it' plant of interior design.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air purity"
        ],
        "advantages": [
            "Trendy",
            "Tree-like"
        ],
        "price": 900,
        "type": "indoor",
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
        "id": "p_in_64",
        "name": "Pothos 'N'Joy'",
        "scientificName": "Epipremnum aureum 'N'Joy'",
        "description": "Small, crinkled leaves with stark white and green variegation.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Compact",
            "Distinctive"
        ],
        "price": 180,
        "type": "indoor",
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
        "id": "p_in_65",
        "name": "String of Pearls",
        "scientificName": "Senecio rowleyanus",
        "description": "Succulent vines with bead-like leaves, cascading down pots.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique form",
            "Hanging"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_66",
        "name": "Jade Plant",
        "scientificName": "Crassula ovata",
        "description": "Fleshy oval leaves. Symbol of wealth and luck.",
        "imageUrl": "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Lucky",
            "Long-lived"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_67",
        "name": "Zebra Plant",
        "scientificName": "Aphelandra squarrosa",
        "description": "Dark green leaves with striking white veins. Needs humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Graphic foliage",
            "Yellow bracts"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_68",
        "name": "Boston Fern",
        "scientificName": "Nephrolepis exaltata",
        "description": "Classic fern with arching fronds. Loves bathroom humidity.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 80,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Formaldehyde removal"
        ],
        "advantages": [
            "Lush",
            "Air cleaner"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_69",
        "name": "Chinese Evergreen 'Silver Queen'",
        "scientificName": "Aglaonema",
        "description": "Silver-green variegated foliage. Very tolerant of low light.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Hard to kill",
            "Pretty"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_70",
        "name": "Ponytail Palm",
        "scientificName": "Beaucarnea recurvata",
        "description": "Not a palm, but a succulent with a bulbous trunk and curly leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Whimsical",
            "Drought tolerant"
        ],
        "price": 450,
        "type": "indoor",
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
        "id": "p_in_71",
        "name": "Cast Iron Plant",
        "scientificName": "Aspidistra elatior",
        "description": "Lived up to its name. Survives neglect, dim light, and drafts.",
        "imageUrl": "https://images.unsplash.com/photo-1593482886870-9202a88e2c40",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Indestructible",
            "Simple"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_72",
        "name": "Parlor Palm",
        "scientificName": "Chamaedorea elegans",
        "description": "A compact palm that has graced parlors since Victorian times.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pet safe",
            "Classic"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_73",
        "name": "Arrowhead 'White Butterfly'",
        "scientificName": "Syngonium podophyllum",
        "description": "White and green leaves shaped like arrowheads. Vigorous grower.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bushy",
            "Fast"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_74",
        "name": "Dracaena Marginata",
        "scientificName": "Dracaena marginata",
        "description": "Dragon tree with spiky leaves edged in red. Sculptural look.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Removes Benzene"
        ],
        "advantages": [
            "Modern",
            "Tall"
        ],
        "price": 400,
        "type": "indoor",
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
        "id": "p_in_75",
        "name": "Hoya 'Kerrii' (Heart Hoya)",
        "scientificName": "Hoya kerrii",
        "description": "Succulent vine with perfectly heart-shaped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Romantic gift",
            "Easy"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_76",
        "name": "Polka Dot Plant",
        "scientificName": "Hypoestes phyllostachya",
        "description": "Leaves splashed with pink, red, or white dots. Small and cute.",
        "imageUrl": "https://images.unsplash.com/photo-1628557044797-f21a177c37ec",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Colorful",
            "Terrarium plant"
        ],
        "price": 120,
        "type": "indoor",
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
        "id": "p_in_77",
        "name": "Chinese Money Plant",
        "scientificName": "Pilea peperomioides",
        "description": "Round, coin-shaped leaves. 'UFO Plant'.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Trendy",
            "Propagates easily"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_78",
        "name": "Nerve Plant",
        "scientificName": "Fittonia",
        "description": "Leaves with intricate, contrasting veins (pink/white/red).",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Dramatic if dry",
            "Patterned"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_79",
        "name": "String of Hearts",
        "scientificName": "Ceropegia woodii",
        "description": "Delicate vine with heart-shaped, patterned leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Trailing beauty",
            "Fast"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_80",
        "name": "Watermelon Peperomia",
        "scientificName": "Peperomia argyreia",
        "description": "Leaves look exactly like watermelon rinds.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fun foliage",
            "Compact"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_81",
        "name": "Alocasia 'Polly'",
        "scientificName": "Alocasia amazonica",
        "description": "Arrowhead leaves with stark white veins. 'African Mask'.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Striking",
            "Exotic"
        ],
        "price": 450,
        "type": "indoor",
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
        "id": "p_in_82",
        "name": "Philodendron 'Birkin'",
        "scientificName": "Philodendron 'Birkin'",
        "description": "Dark leaves with thin white pinstripes.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pinstripes",
            "Self-heading"
        ],
        "price": 400,
        "type": "indoor",
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
        "id": "p_in_83",
        "name": "Yucca Cane",
        "scientificName": "Yucca elephantipes",
        "description": "Thick woody canes with sword-like leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Rugged",
            "Vertical"
        ],
        "price": 500,
        "type": "indoor",
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
        "id": "p_in_84",
        "name": "Croton 'Mammy'",
        "scientificName": "Codiaeum variegatum",
        "description": "Twisted leaves with explosion of red, yellow, green.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fiery color",
            "Compact"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_85",
        "name": "Purple Passion",
        "scientificName": "Gynura aurantiaca",
        "description": "Velvety purple hairs on green leaves. Looks soft and fuzzy.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Purple texture",
            "Fast"
        ],
        "price": 180,
        "type": "indoor",
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
        "id": "p_in_86",
        "name": "Staghorn Fern",
        "scientificName": "Platycerium",
        "description": "Fronds look like deer antlers. Often mounted on wood.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Living art",
            "Unique"
        ],
        "price": 600,
        "type": "indoor",
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
        "id": "p_in_87",
        "name": "Calathea Orbifolia",
        "scientificName": "Calathea orbifolia",
        "description": "Large, round leaves with silver stripes. A diva about water.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Stunning foliage",
            "Statement"
        ],
        "price": 550,
        "type": "indoor",
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
        "id": "p_in_88",
        "name": "Monstera Adansonii",
        "scientificName": "Monstera adansonii",
        "description": "Swiss Cheese Plant vine. Holes in leaves develop early.",
        "imageUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Holey leaves",
            "Climber"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_89",
        "name": "Air Plant",
        "scientificName": "Tillandsia",
        "description": "Needs no soil. Absorbs moisture through trichomes.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Soil-free",
            "Decor friendly"
        ],
        "price": 100,
        "type": "indoor",
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
        "id": "p_in_90",
        "name": "Bird's Nest Fern",
        "scientificName": "Asplenium nidus",
        "description": "Crinkly, rosette forming fern. Bright apple green.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Crispy texture",
            "Pet safe"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_91",
        "name": "Peperomia 'Hope'",
        "scientificName": "Peperomia ottoniana",
        "description": "Trailing soft round succulent leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cute",
            "Trailer"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_92",
        "name": "Aglaonema 'Pink'",
        "scientificName": "Aglaonema",
        "description": "Splashes of neon pink. Very low light tolerant.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pop of color",
            "Easy"
        ],
        "price": 350,
        "type": "indoor",
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
        "id": "p_in_93",
        "name": "Satin Pothos",
        "scientificName": "Scindapsus pictus",
        "description": "Matte green leaves with silver splashes. Silky feel.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Silver leaves",
            "Vining"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_94",
        "name": "Schefflera (Umbrella Tree)",
        "scientificName": "Schefflera arboricola",
        "description": "Leaflets radiate like an umbrella. Fast growing.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Air cleaning"
        ],
        "advantages": [
            "Fast",
            "Full"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_95",
        "name": "Corn Plant",
        "scientificName": "Dracaena fragrans",
        "description": "Thick woody stem with arching striped leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Clean air"
        ],
        "advantages": [
            "Tall",
            "Low light"
        ],
        "price": 450,
        "type": "indoor",
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
        "id": "p_in_96",
        "name": "Stromanthe Triostar",
        "scientificName": "Stromanthe sanguinea",
        "description": "Green, white, and pink leaves with magenta undersides.",
        "imageUrl": "https://images.unsplash.com/photo-1614959542732-44677764a784",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 70,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Living watercolor",
            "Movement"
        ],
        "price": 400,
        "type": "indoor",
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
        "id": "p_in_97",
        "name": "Lipstick Plant",
        "scientificName": "Aeschynanthus",
        "description": "Tubular red flowers emerging like lipstick from cases.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": 18,
        "idealTempMax": 27,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Flowers",
            "Hanging"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_98",
        "name": "Oxalis (Shamrock)",
        "scientificName": "Oxalis triangularis",
        "description": "Deep purple triangular leaves that fold up at night.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Purple foliage",
            "Movement"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_99",
        "name": "Burro's Tail",
        "scientificName": "Sedum morganianum",
        "description": "Succulent with braids of plump, blue-green leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1598512140411-dc4a42b00511",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique texture",
            "Hanging"
        ],
        "price": 250,
        "type": "indoor",
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
        "id": "p_in_100",
        "name": "Kangaroo Paw Fern",
        "scientificName": "Microsorum diversifolium",
        "description": "Shiny, leathery fronds shaped like a kangaroo's foot.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Glossy",
            "Hardy"
        ],
        "price": 300,
        "type": "indoor",
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
        "id": "p_in_100",
        "name": "Praseodymium Fern",
        "scientificName": "Braun ohm",
        "description": "Admitto aggredior cuius terga. Delibero audeo deporto.",
        "imageUrl": "https://images.unsplash.com/photo-4276199968?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 26,
        "minHumidity": 62,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "sleepy",
            "electronics"
        ],
        "advantages": [
            "front-end",
            "deliverables"
        ],
        "price": 79,
        "type": "indoor",
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
        "id": "p_in_101",
        "name": "Osmium Fern",
        "scientificName": "Nolan tesla",
        "description": "Vobis temptatio natus virtus stultus alii. Tantillus tum convoco ara vorago deprimo.",
        "imageUrl": "https://images.unsplash.com/photo-7166218963?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 30,
        "minHumidity": 39,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "lanky",
            "overcoat"
        ],
        "advantages": [
            "front-end",
            "ROI"
        ],
        "price": 104,
        "type": "indoor",
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
        "id": "p_in_102",
        "name": "Lutetium Fern",
        "scientificName": "Robel radian",
        "description": "Comminor casso verbum causa testimonium. Consequuntur molestiae uberrime.",
        "imageUrl": "https://images.unsplash.com/photo-4754293099?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 25,
        "minHumidity": 39,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "sneaky",
            "corporation"
        ],
        "advantages": [
            "open-source",
            "content"
        ],
        "price": 147,
        "type": "indoor",
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
        "id": "p_in_103",
        "name": "Ruthenium Fern",
        "scientificName": "Simonis lumen",
        "description": "Curso ubi cedo dolore acer considero adnuo utor ustilo. Suggero comis unus sumo.",
        "imageUrl": "https://images.unsplash.com/photo-8052039006?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 34,
        "minHumidity": 62,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "admired",
            "importance"
        ],
        "advantages": [
            "compelling",
            "models"
        ],
        "price": 131,
        "type": "indoor",
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
        "id": "p_in_104",
        "name": "Mendelevium Fern",
        "scientificName": "Hand-Bashirian lumen",
        "description": "Aegrotatio contego caute placeat centum. Eligendi aeger clarus casso arbor tamen verumtamen.",
        "imageUrl": "https://images.unsplash.com/photo-9676299600?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 58,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "menacing",
            "hospitalization"
        ],
        "advantages": [
            "leading-edge",
            "architectures"
        ],
        "price": 19,
        "type": "indoor",
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
        "id": "p_in_105",
        "name": "Ruthenium Fern",
        "scientificName": "Gutkowski kelvin",
        "description": "Contego candidus tricesimus condico. Distinctio valens maiores assumenda.",
        "imageUrl": "https://images.unsplash.com/photo-2710585329?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 54,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "shiny",
            "SUV"
        ],
        "advantages": [
            "back-end",
            "networks"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_106",
        "name": "Xenon Fern",
        "scientificName": "Leannon henry",
        "description": "Veritatis damnatio hic aggero cado caelum aduro dens decet cohaero. Contabesco decens cattus caute deleo iste denuncio carbo cometes neque.",
        "imageUrl": "https://images.unsplash.com/photo-7415784681?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 25,
        "minHumidity": 54,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "glaring",
            "bathhouse"
        ],
        "advantages": [
            "customized",
            "deliverables"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_107",
        "name": "Barium Fern",
        "scientificName": "Rowe tesla",
        "description": "Decimus argentum contigo. Arcesso accusantium solvo calco.",
        "imageUrl": "https://images.unsplash.com/photo-2342554684?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 35,
        "minHumidity": 46,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "shocked",
            "formation"
        ],
        "advantages": [
            "compelling",
            "applications"
        ],
        "price": 185,
        "type": "indoor",
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
        "id": "p_in_108",
        "name": "Manganese Fern",
        "scientificName": "Bashirian kelvin",
        "description": "Comis cognatus despecto copia carus natus accusantium catena. Compello aureus infit non agnosco aeneus tubineus.",
        "imageUrl": "https://images.unsplash.com/photo-4254152569?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 27,
        "minHumidity": 37,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "wrong",
            "vibraphone"
        ],
        "advantages": [
            "value-added",
            "infrastructures"
        ],
        "price": 68,
        "type": "indoor",
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
        "id": "p_in_109",
        "name": "Holmium Fern",
        "scientificName": "Hand watt",
        "description": "Calco ater cribro. Eaque torrens adimpleo consequatur tum ustilo cauda talio caecus nisi.",
        "imageUrl": "https://images.unsplash.com/photo-6920696956?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 30,
        "minHumidity": 58,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "giving",
            "cinder"
        ],
        "advantages": [
            "one-to-one",
            "experiences"
        ],
        "price": 159,
        "type": "indoor",
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
        "id": "p_in_110",
        "name": "Tungsten Fern",
        "scientificName": "Kuvalis kilogram",
        "description": "Sto vilicus aeneus. Crur nobis paulatim comburo accommodo quisquam commemoro conforto.",
        "imageUrl": "https://images.unsplash.com/photo-5851036514?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 35,
        "minHumidity": 43,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "elastic",
            "goodwill"
        ],
        "advantages": [
            "user-centric",
            "ROI"
        ],
        "price": 99,
        "type": "indoor",
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
        "id": "p_in_111",
        "name": "Germanium Fern",
        "scientificName": "Walker candela",
        "description": "Amo ulterius dicta cibus cuppedia possimus tepidus. Desidero velociter vigilo.",
        "imageUrl": "https://images.unsplash.com/photo-1050032015?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 26,
        "minHumidity": 52,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "powerless",
            "godfather"
        ],
        "advantages": [
            "B2C",
            "AI"
        ],
        "price": 145,
        "type": "indoor",
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
        "id": "p_in_112",
        "name": "Ytterbium Fern",
        "scientificName": "Reinger watt",
        "description": "Ulciscor earum molestias assentator cui cohaero. Absque decipio terra uredo cruentus stabilis subnecto.",
        "imageUrl": "https://images.unsplash.com/photo-7002875916?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 29,
        "minHumidity": 37,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "lonely",
            "scratch"
        ],
        "advantages": [
            "rich",
            "solutions"
        ],
        "price": 52,
        "type": "indoor",
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
        "id": "p_in_113",
        "name": "Beryllium Fern",
        "scientificName": "Hudson candela",
        "description": "Talus una debeo nostrum conforto cohors. Vulgo quod aperiam ultio ver depereo claustrum asporto.",
        "imageUrl": "https://images.unsplash.com/photo-1753062885?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 26,
        "minHumidity": 51,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "inborn",
            "citizen"
        ],
        "advantages": [
            "user-centric",
            "technologies"
        ],
        "price": 110,
        "type": "indoor",
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
        "id": "p_in_114",
        "name": "Yttrium Fern",
        "scientificName": "Herzog-Kerluke degree celsius",
        "description": "Tripudio aiunt deripio animadverto. Mollitia soleo colo absconditus vel crastinus.",
        "imageUrl": "https://images.unsplash.com/photo-7779743184?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 26,
        "minHumidity": 46,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "potable",
            "quart"
        ],
        "advantages": [
            "extensible",
            "schemas"
        ],
        "price": 110,
        "type": "indoor",
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
        "id": "p_in_115",
        "name": "Osmium Fern",
        "scientificName": "Torphy candela",
        "description": "Causa voluptatum vespillo. Dedecor sophismata totus.",
        "imageUrl": "https://images.unsplash.com/photo-5919550555?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 33,
        "minHumidity": 80,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "urban",
            "thread"
        ],
        "advantages": [
            "value-added",
            "functionalities"
        ],
        "price": 95,
        "type": "indoor",
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
        "id": "p_in_116",
        "name": "Terbium Fern",
        "scientificName": "Upton tesla",
        "description": "Caput tardus arma vivo conicio aperiam. Compello verto turpis contabesco vereor conscendo.",
        "imageUrl": "https://images.unsplash.com/photo-7534079625?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 33,
        "minHumidity": 31,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "smug",
            "object"
        ],
        "advantages": [
            "distributed",
            "architectures"
        ],
        "price": 147,
        "type": "indoor",
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
        "id": "p_in_117",
        "name": "Iodine Fern",
        "scientificName": "Marks mole",
        "description": "Acies aut trucido tener coadunatio. Dignissimos aegrus ara demoror alioqui optio.",
        "imageUrl": "https://images.unsplash.com/photo-4851875847?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 26,
        "minHumidity": 37,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "ironclad",
            "newsprint"
        ],
        "advantages": [
            "open-source",
            "web services"
        ],
        "price": 24,
        "type": "indoor",
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
        "id": "p_in_118",
        "name": "Promethium Fern",
        "scientificName": "Dickinson katal",
        "description": "Vitae deduco solus tamdiu volutabrum suadeo cedo. Virga colo distinctio taedium aptus demonstro carbo.",
        "imageUrl": "https://images.unsplash.com/photo-3674353587?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 27,
        "minHumidity": 42,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "scented",
            "necklace"
        ],
        "advantages": [
            "ubiquitous",
            "functionalities"
        ],
        "price": 133,
        "type": "indoor",
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
        "id": "p_in_119",
        "name": "Americium Fern",
        "scientificName": "Stehr newton",
        "description": "Vobis coniecto tergeo caveo argumentum consequatur adsidue beatus. Volva assentator tepidus temporibus chirographum.",
        "imageUrl": "https://images.unsplash.com/photo-9061227420?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 31,
        "minHumidity": 43,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "burly",
            "spork"
        ],
        "advantages": [
            "back-end",
            "mindshare"
        ],
        "price": 162,
        "type": "indoor",
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
        "id": "p_in_120",
        "name": "Krypton Fern",
        "scientificName": "O'Keefe watt",
        "description": "Pecco ver degero traho. Similique vicissitudo abscido commemoro varius causa nihil adeo cimentarius.",
        "imageUrl": "https://images.unsplash.com/photo-2545676543?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 28,
        "minHumidity": 65,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "mature",
            "coordination"
        ],
        "advantages": [
            "extensible",
            "synergies"
        ],
        "price": 42,
        "type": "indoor",
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
        "id": "p_in_121",
        "name": "Carbon Fern",
        "scientificName": "McCullough coulomb",
        "description": "Triduana trepide statim acer deduco cupressus adduco. Talio aestas tricesimus.",
        "imageUrl": "https://images.unsplash.com/photo-9538177122?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 35,
        "minHumidity": 75,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "medium",
            "baseboard"
        ],
        "advantages": [
            "impactful",
            "smart contracts"
        ],
        "price": 95,
        "type": "indoor",
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
        "id": "p_in_122",
        "name": "Ytterbium Fern",
        "scientificName": "O'Connell farad",
        "description": "Cogo tendo ulciscor aliquam labore ratione degero crapula quas. Talus aestivus depereo.",
        "imageUrl": "https://images.unsplash.com/photo-6302724789?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 56,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "colossal",
            "provider"
        ],
        "advantages": [
            "mission-critical",
            "models"
        ],
        "price": 111,
        "type": "indoor",
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
        "id": "p_in_123",
        "name": "Holmium Fern",
        "scientificName": "Gutmann ohm",
        "description": "Tergiversatio denuncio explicabo ancilla virgo cicuta at. Bardus apparatus cursim aeneus tripudio patria.",
        "imageUrl": "https://images.unsplash.com/photo-7984593194?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 29,
        "minHumidity": 37,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "aching",
            "disappointment"
        ],
        "advantages": [
            "front-end",
            "metrics"
        ],
        "price": 146,
        "type": "indoor",
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
        "id": "p_in_124",
        "name": "Francium Fern",
        "scientificName": "Cole hertz",
        "description": "Crepusculum clamo amplus audacia temporibus architecto acidus tolero. Adulescens triduana theca videlicet somnus attonbitus canto desidero.",
        "imageUrl": "https://images.unsplash.com/photo-1519522959?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 27,
        "minHumidity": 80,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "outlandish",
            "railway"
        ],
        "advantages": [
            "collaborative",
            "supply-chains"
        ],
        "price": 92,
        "type": "indoor",
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
        "id": "p_in_125",
        "name": "Thorium Fern",
        "scientificName": "Pfannerstill volt",
        "description": "Vilicus appono debilito socius vesper aiunt xiphias. Minus stips addo suppellex.",
        "imageUrl": "https://images.unsplash.com/photo-7420239817?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "sad",
            "desk"
        ],
        "advantages": [
            "out-of-the-box",
            "applications"
        ],
        "price": 159,
        "type": "indoor",
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
        "id": "p_in_126",
        "name": "Selenium Fern",
        "scientificName": "Kohler weber",
        "description": "Colo terreo agnosco. Quidem custodia tonsor deorsum ratione torqueo trucido censura tergiversatio carcer.",
        "imageUrl": "https://images.unsplash.com/photo-6051885440?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 25,
        "minHumidity": 41,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "international",
            "charm"
        ],
        "advantages": [
            "world-class",
            "content"
        ],
        "price": 63,
        "type": "indoor",
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
        "id": "p_in_127",
        "name": "Manganese Fern",
        "scientificName": "Maggio-Wunsch becquerel",
        "description": "Arx cribro ademptio auctor supra. Paulatim ambulo delego casso brevis.",
        "imageUrl": "https://images.unsplash.com/photo-8956215702?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 31,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "aware",
            "tomography"
        ],
        "advantages": [
            "cross-platform",
            "networks"
        ],
        "price": 68,
        "type": "indoor",
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
        "id": "p_in_128",
        "name": "Osmium Fern",
        "scientificName": "Halvorson gray",
        "description": "Consuasor stipes alii. Dolore denuo cur cotidie cultura labore bibo caritas certus debitis.",
        "imageUrl": "https://images.unsplash.com/photo-3903186605?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 33,
        "minHumidity": 67,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "shallow",
            "swath"
        ],
        "advantages": [
            "robust",
            "solutions"
        ],
        "price": 68,
        "type": "indoor",
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
        "id": "p_in_129",
        "name": "Cadmium Fern",
        "scientificName": "Wehner becquerel",
        "description": "Bellicus cohaero turpis somnus consequatur vomito supplanto clibanus quis bardus. Sortitus recusandae arcus colo.",
        "imageUrl": "https://images.unsplash.com/photo-9686058363?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 25,
        "minHumidity": 41,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "hungry",
            "compromise"
        ],
        "advantages": [
            "smart",
            "platforms"
        ],
        "price": 103,
        "type": "indoor",
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
        "id": "p_in_130",
        "name": "Lanthanum Fern",
        "scientificName": "Braun second",
        "description": "Audio victoria adnuo cogito aro amplexus vis corpus trans turpis. Carmen verecundia triumphus terebro est chirographum bellum corroboro.",
        "imageUrl": "https://images.unsplash.com/photo-1595911776?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 34,
        "minHumidity": 44,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "tricky",
            "pilot"
        ],
        "advantages": [
            "killer",
            "functionalities"
        ],
        "price": 28,
        "type": "indoor",
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
        "id": "p_in_131",
        "name": "Tantalum Fern",
        "scientificName": "Jerde candela",
        "description": "Voveo suus arceo contra eaque tribuo voluntarius culpa. Acidus tres creator advoco.",
        "imageUrl": "https://images.unsplash.com/photo-7433285738?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 35,
        "minHumidity": 77,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "flowery",
            "detective"
        ],
        "advantages": [
            "proactive",
            "smart contracts"
        ],
        "price": 73,
        "type": "indoor",
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
        "id": "p_in_132",
        "name": "Tantalum Fern",
        "scientificName": "Dare henry",
        "description": "Vesco dolor casus. Magni reprehenderit traho soluta verumtamen a aegrus.",
        "imageUrl": "https://images.unsplash.com/photo-3109146116?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 26,
        "minHumidity": 79,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "dark",
            "dependency"
        ],
        "advantages": [
            "extensible",
            "smart contracts"
        ],
        "price": 41,
        "type": "indoor",
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
        "id": "p_in_133",
        "name": "Plutonium Fern",
        "scientificName": "Hudson-Weber volt",
        "description": "Tot quia atqui minus arceo vehemens. Delicate vesco bibo rem utrimque aestivus tempora damnatio.",
        "imageUrl": "https://images.unsplash.com/photo-3682526875?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 25,
        "minHumidity": 56,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "waterlogged",
            "porter"
        ],
        "advantages": [
            "best-of-breed",
            "solutions"
        ],
        "price": 15,
        "type": "indoor",
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
        "id": "p_in_134",
        "name": "Bromine Fern",
        "scientificName": "Walter kilogram",
        "description": "Admitto maiores adipisci. Tertius accusamus decor possimus bellicus nostrum cursus cimentarius tribuo.",
        "imageUrl": "https://images.unsplash.com/photo-6213571888?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 26,
        "minHumidity": 80,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "negative",
            "taro"
        ],
        "advantages": [
            "ubiquitous",
            "synergies"
        ],
        "price": 82,
        "type": "indoor",
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
        "id": "p_in_135",
        "name": "Ytterbium Fern",
        "scientificName": "Hyatt kilogram",
        "description": "Communis voluptatum voluptatum adsuesco ver conatus vulpes comptus maiores depono. Minus libero videlicet textus canonicus magnam vulnero.",
        "imageUrl": "https://images.unsplash.com/photo-1326662240?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 33,
        "minHumidity": 74,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "enchanting",
            "cinder"
        ],
        "advantages": [
            "cross-platform",
            "niches"
        ],
        "price": 69,
        "type": "indoor",
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
        "id": "p_in_136",
        "name": "Chlorine Fern",
        "scientificName": "VonRueden lumen",
        "description": "Claustrum tibi veniam ancilla quisquam eum umerus laboriosam laboriosam. Vito decipio damno arto.",
        "imageUrl": "https://images.unsplash.com/photo-2735167541?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 34,
        "minHumidity": 51,
        "sunlight": "medium",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "sturdy",
            "supplier"
        ],
        "advantages": [
            "sustainable",
            "blockchains"
        ],
        "price": 200,
        "type": "indoor",
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
        "id": "p_in_137",
        "name": "Dysprosium Fern",
        "scientificName": "Lockman volt",
        "description": "Civitas depono cometes celo capitulus. Spectaculum aestas animadverto ambitus.",
        "imageUrl": "https://images.unsplash.com/photo-2518469724?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 26,
        "minHumidity": 42,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "majestic",
            "pecan"
        ],
        "advantages": [
            "sustainable",
            "web services"
        ],
        "price": 142,
        "type": "indoor",
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
        "id": "p_in_138",
        "name": "Manganese Fern",
        "scientificName": "Koepp second",
        "description": "Comprehendo derideo magni quod. Aranea conduco comparo aiunt.",
        "imageUrl": "https://images.unsplash.com/photo-2747376537?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 27,
        "minHumidity": 56,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "greedy",
            "minion"
        ],
        "advantages": [
            "magnetic",
            "lifetime value"
        ],
        "price": 106,
        "type": "indoor",
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
        "id": "p_in_139",
        "name": "Magnesium Fern",
        "scientificName": "Pollich weber",
        "description": "Debilito aequitas vicissitudo cicuta acies sequi audentia beneficium aliquid. Explicabo aeternus minus.",
        "imageUrl": "https://images.unsplash.com/photo-9222704522?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 63,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "fair",
            "safe"
        ],
        "advantages": [
            "cross-media",
            "experiences"
        ],
        "price": 160,
        "type": "indoor",
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
        "id": "p_in_140",
        "name": "Neon Fern",
        "scientificName": "O'Kon steradian",
        "description": "Dedico deleo patrocinor spiculum defaeco reprehenderit. Nisi approbo totam audio coma alioqui.",
        "imageUrl": "https://images.unsplash.com/photo-7202413730?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 30,
        "minHumidity": 34,
        "sunlight": "medium",
        "oxygenLevel": "low",
        "medicinalValues": [
            "mixed",
            "story"
        ],
        "advantages": [
            "next-generation",
            "synergies"
        ],
        "price": 44,
        "type": "indoor",
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
        "id": "p_in_141",
        "name": "Dubnium Fern",
        "scientificName": "Effertz-Hudson degree celsius",
        "description": "Clam explicabo conforto trado advoco appello temporibus currus dolores armarium. Certe cedo truculenter neque bardus curis.",
        "imageUrl": "https://images.unsplash.com/photo-6829402391?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 26,
        "minHumidity": 70,
        "sunlight": "low",
        "oxygenLevel": "low",
        "medicinalValues": [
            "silky",
            "dwell"
        ],
        "advantages": [
            "customized",
            "mindshare"
        ],
        "price": 59,
        "type": "indoor",
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
        "id": "p_in_142",
        "name": "Hassium Fern",
        "scientificName": "Weissnat steradian",
        "description": "Conscendo corrupti ascit vere denuo. Vitiosus admoveo cuppedia.",
        "imageUrl": "https://images.unsplash.com/photo-9953691795?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 34,
        "minHumidity": 31,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "comfortable",
            "conversation"
        ],
        "advantages": [
            "innovative",
            "deliverables"
        ],
        "price": 150,
        "type": "indoor",
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
        "id": "p_in_143",
        "name": "Gold Fern",
        "scientificName": "Kreiger katal",
        "description": "Temperantia utroque succedo quod trucido corona denego audax ducimus callide. Torrens agnosco calculus acidus vinum amicitia umquam adsidue argentum.",
        "imageUrl": "https://images.unsplash.com/photo-2684857403?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 34,
        "minHumidity": 59,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "magnificent",
            "pharmacopoeia"
        ],
        "advantages": [
            "user-centric",
            "web services"
        ],
        "price": 24,
        "type": "indoor",
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
        "id": "p_in_144",
        "name": "Tennessine Fern",
        "scientificName": "Vandervort-Turcotte siemens",
        "description": "Tempore tandem stella solus pecco magni supra catena. Tabula caput ager aspernatur acervus addo adstringo enim modi.",
        "imageUrl": "https://images.unsplash.com/photo-5494811164?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 25,
        "minHumidity": 41,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "aware",
            "chasuble"
        ],
        "advantages": [
            "sustainable",
            "applications"
        ],
        "price": 197,
        "type": "indoor",
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
        "id": "p_in_145",
        "name": "Lawrencium Fern",
        "scientificName": "Cassin tesla",
        "description": "Sollers vigilo absens truculenter bibo inflammatio vae ara. Appositus conduco tener arguo asper ex ascisco voluptatum.",
        "imageUrl": "https://images.unsplash.com/photo-2353761838?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 35,
        "minHumidity": 67,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "fatherly",
            "roadway"
        ],
        "advantages": [
            "innovative",
            "schemas"
        ],
        "price": 85,
        "type": "indoor",
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
        "id": "p_in_146",
        "name": "Oganesson Fern",
        "scientificName": "Keeling joule",
        "description": "Ventus repudiandae demoror votum labore solum corpus. Adipisci velut denique constans.",
        "imageUrl": "https://images.unsplash.com/photo-2686503019?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 32,
        "minHumidity": 72,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "dependable",
            "poppy"
        ],
        "advantages": [
            "next-generation",
            "solutions"
        ],
        "price": 46,
        "type": "indoor",
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
        "id": "p_in_147",
        "name": "Selenium Fern",
        "scientificName": "Senger joule",
        "description": "Comparo calamitas aliquid argumentum desipio thesaurus balbus armarium sed. Pauci voluptatibus bonus.",
        "imageUrl": "https://images.unsplash.com/photo-5821439655?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 28,
        "minHumidity": 48,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "outstanding",
            "iridescence"
        ],
        "advantages": [
            "sustainable",
            "AI"
        ],
        "price": 92,
        "type": "indoor",
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
        "id": "p_in_148",
        "name": "Barium Fern",
        "scientificName": "Kautzer candela",
        "description": "Amiculum cariosus capitulus concedo vester cumque accusamus. Argumentum veritatis explicabo ipsum thymum pecco quia delicate velit.",
        "imageUrl": "https://images.unsplash.com/photo-9530949424?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 28,
        "minHumidity": 79,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "judicious",
            "adaptation"
        ],
        "advantages": [
            "generative",
            "communities"
        ],
        "price": 139,
        "type": "indoor",
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
        "id": "p_in_149",
        "name": "Rhenium Fern",
        "scientificName": "Wilkinson tesla",
        "description": "Uxor tutamen celo utique surgo. Caterva porro patria crur adinventitias.",
        "imageUrl": "https://images.unsplash.com/photo-7162706579?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 30,
        "minHumidity": 44,
        "sunlight": "low",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "altruistic",
            "fold"
        ],
        "advantages": [
            "transparent",
            "synergies"
        ],
        "price": 124,
        "type": "indoor",
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
        "id": "p_out_20",
        "name": "Thyme",
        "scientificName": "Thymus vulgaris",
        "description": "Low-growing woody herb. Excellent ground cover.",
        "imageUrl": "https://images.unsplash.com/photo-1629158654877-2c5544d67310",
        "idealTempMin": -5,
        "idealTempMax": 30,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antiseptic",
            "Respiratory aid"
        ],
        "advantages": [
            "Culinary",
            "Ground cover"
        ],
        "price": 6,
        "type": "outdoor",
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
        "id": "p_out_21",
        "name": "Coneflower",
        "scientificName": "Echinacea purpurea",
        "description": "Purple daisy-like flowers with raised centers. Native to prairies.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Immune boost"
        ],
        "advantages": [
            "Attracts butterflies",
            "Drought resistant"
        ],
        "price": 10,
        "type": "outdoor",
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
        "id": "p_out_22",
        "name": "Bleeding Heart",
        "scientificName": "Lamprocapnos spectabilis",
        "description": "Arching stems with heart-shaped pink/white flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1616787688001-5256e6328362",
        "idealTempMin": -15,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique flower shape",
            "Shade lover"
        ],
        "price": 18,
        "type": "outdoor",
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
        "id": "p_out_23",
        "name": "Dahlia",
        "scientificName": "Dahlia pinnata",
        "description": "Bushy tuberous plants with magnificent, diverse blooms.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Showstopper blooms",
            "Cut flowers"
        ],
        "price": 12,
        "type": "outdoor",
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
        "id": "p_out_24",
        "name": "Morning Glory",
        "scientificName": "Ipomoea",
        "description": "Vines with trumpet-shaped flowers that open in the morning.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Fast climber",
            "Colorful"
        ],
        "price": 5,
        "type": "outdoor",
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
        "id": "p_out_25",
        "name": "Wisteria",
        "scientificName": "Wisteria sinensis",
        "description": "Woody vine with cascading clusters of purple flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1557997380-a6df40345097",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Romantic aesthetic",
            "Fragrant"
        ],
        "price": 45,
        "type": "outdoor",
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
        "id": "p_out_26",
        "name": "Peony",
        "scientificName": "Paeonia",
        "description": "Large, ruffled, fragrant flowers. A spring classic.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": -20,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Anti-inflammatory"
        ],
        "advantages": [
            "Long lived",
            "Fragrance"
        ],
        "price": 35,
        "type": "outdoor",
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
        "id": "p_out_27",
        "name": "Snapdragon",
        "scientificName": "Antirrhinum",
        "description": "Spikes of flowers that look like dragon mouths.",
        "imageUrl": "https://images.unsplash.com/photo-1601655823671-6c2e7cc187d9",
        "idealTempMin": 5,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cool season color",
            "Children love them"
        ],
        "price": 6,
        "type": "outdoor",
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
        "id": "p_out_28",
        "name": "Pansy",
        "scientificName": "Viola tricolor",
        "description": "Colorful flowers with 'faces'. Thrives in cooler weather.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 0,
        "idealTempMax": 20,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Edible"
        ],
        "advantages": [
            "Winter color",
            "Edible"
        ],
        "price": 4,
        "type": "outdoor",
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
        "id": "p_out_29",
        "name": "Zinnia",
        "scientificName": "Zinnia elegans",
        "description": "Bright, daisy-like annuals. Very easy to grow from seed.",
        "imageUrl": "https://images.unsplash.com/photo-1594957388796-0275825318db",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Heat tolerant",
            "Butterfly magnet"
        ],
        "price": 5,
        "type": "outdoor",
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
        "id": "p_out_30",
        "name": "Begonia (Outdoor)",
        "scientificName": "Begonia semperflorens",
        "description": "Wax begonias perfect for shady bedding borders.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248166-5f1181822819",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Shade tolerance",
            "Continuous bloom"
        ],
        "price": 8,
        "type": "outdoor",
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
        "id": "p_out_31",
        "name": "Salvia",
        "scientificName": "Salvia splendens",
        "description": "Spikes of intense red or purple tubular flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1593006856011-8e994967396a",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Attracts hummingbirds",
            "Heat tolerant"
        ],
        "price": 8,
        "type": "outdoor",
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
        "id": "p_out_32",
        "name": "Impatiens",
        "scientificName": "Impatiens walleriana",
        "description": "Popular shade annual with non-stop blooming.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Brightens shade",
            "Easy"
        ],
        "price": 5,
        "type": "outdoor",
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
        "id": "p_out_33",
        "name": "Coleus",
        "scientificName": "Plectranthus scutellarioides",
        "description": "Grown for its incredibly colorful foliage, not flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1616690248278-450cb25b6a7a",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Amazing patterns",
            "Good for pots"
        ],
        "price": 12,
        "type": "outdoor",
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
        "id": "p_out_34",
        "name": "Canna Lily",
        "scientificName": "Canna",
        "description": "Tropical-looking plant with broad leaves and bright flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Height",
            "Structural"
        ],
        "price": 18,
        "type": "outdoor",
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
        "id": "p_out_35",
        "name": "Daylily",
        "scientificName": "Hemerocallis",
        "description": "Rugged perennials where each flower lasts one day.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Edible flowers"
        ],
        "advantages": [
            "Tough",
            "Reliable"
        ],
        "price": 15,
        "type": "outdoor",
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
        "id": "p_out_36",
        "name": "Butterfly Bush",
        "scientificName": "Buddleja",
        "description": "Shrub with spikes of flowers that attract pollinators.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": -5,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Wildlife friendly",
            "Fragrant"
        ],
        "price": 25,
        "type": "outdoor",
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
        "id": "p_out_37",
        "name": "Lilac",
        "scientificName": "Syringa",
        "description": "Shrub famous for its spring scent and purple cone flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": -20,
        "idealTempMax": 25,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Nostalgic scent",
            "Cut flowers"
        ],
        "price": 30,
        "type": "outdoor",
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
        "id": "p_out_38",
        "name": "Boxwood",
        "scientificName": "Buxus",
        "description": "Evergreen shrub mainly used for hedges and topiaries.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": -10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "medium",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Structure",
            "Formal look"
        ],
        "price": 35,
        "type": "outdoor",
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
        "id": "p_out_39",
        "name": "Fuchsia",
        "scientificName": "Fuchsia magellanica",
        "description": "Dangling two-tone flowers that look like ballerinas.",
        "imageUrl": "https://images.unsplash.com/photo-1557997380-a6df40345097",
        "idealTempMin": 5,
        "idealTempMax": 25,
        "minHumidity": 60,
        "sunlight": "low",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Hanging baskets",
            "Unique"
        ],
        "price": 15,
        "type": "outdoor",
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
        "id": "p_out_40",
        "name": "Chili Pepper",
        "scientificName": "Capsicum annuum",
        "description": "Bear hot or sweet peppers. Decorative and edible.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Capsaicin"
        ],
        "advantages": [
            "Spice",
            "Ornamental fruit"
        ],
        "price": 8,
        "type": "outdoor",
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
        "id": "p_out_41",
        "name": "Krishna Tulsi",
        "scientificName": "Ocimum tenuiflorum",
        "description": "Sacred purple-leaved basil. Essential for every Indian household courtyard.",
        "imageUrl": "https://images.unsplash.com/photo-1629158654877-2c5544d67310",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Ayurvedic panacea",
            "Immunity boost"
        ],
        "advantages": [
            "Sacred",
            "Medicinal"
        ],
        "price": 50,
        "type": "outdoor",
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
        "id": "p_out_42",
        "name": "Curry Leaf Plant",
        "scientificName": "Murraya koenigii",
        "description": "Aromatic leaves essential for South Indian cooking. Grows into a small tree.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 18,
        "idealTempMax": 40,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Digestion",
            "Hair growth"
        ],
        "advantages": [
            "Culinary staple",
            "Self-seeding"
        ],
        "price": 80,
        "type": "outdoor",
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
        "id": "p_out_43",
        "name": "Madurai Malli (Jasmine)",
        "scientificName": "Jasminum sambac",
        "description": "Famous GI-tagged Jasmine. Intensely fragrant white flowers used for Gajra.",
        "imageUrl": "https://images.unsplash.com/photo-1558230230-67c00e65306d",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Stress relief"
        ],
        "advantages": [
            "Divine scent",
            "Cultural icon"
        ],
        "price": 150,
        "type": "outdoor",
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
        "id": "p_out_44",
        "name": "Shoe Flower (Hibiscus)",
        "scientificName": "Hibiscus rosa-sinensis",
        "description": "Classic red hibiscus. Used for hair oil and temple offerings.",
        "imageUrl": "https://images.unsplash.com/photo-1576435671569-425b0959f6d6",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Hair care",
            "Cooling"
        ],
        "advantages": [
            "Daily blooms",
            "Vibrant"
        ],
        "price": 120,
        "type": "outdoor",
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
        "id": "p_out_45",
        "name": "Arali (Oleander)",
        "scientificName": "Nerium oleander",
        "description": "Hardy shrub with pink/white flowers. Common in medians and temples. Toxic.",
        "imageUrl": "https://images.unsplash.com/photo-1557997380-a6df40345097",
        "idealTempMin": 10,
        "idealTempMax": 45,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None (Toxic)"
        ],
        "advantages": [
            "Drought proof",
            "Heavy bloomer"
        ],
        "price": 100,
        "type": "outdoor",
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
        "id": "p_out_46",
        "name": "Nandiyavattai (Crape Jasmine)",
        "scientificName": "Tabernaemontana divaricata",
        "description": "White pinwheel flowers. Used for 'Archanai' in temples. Eyes wash medicinal use.",
        "imageUrl": "https://images.unsplash.com/photo-1620067644342-997ad9264426",
        "idealTempMin": 18,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Eye care (Traditional)"
        ],
        "advantages": [
            "Moon garden",
            "White blooms"
        ],
        "price": 120,
        "type": "outdoor",
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
        "id": "p_out_47",
        "name": "Idly Poo (Ixora)",
        "scientificName": "Ixora coccinea",
        "description": "Clusters of star-shaped red/orange flowers. Popular for hedging.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antiseptic roots"
        ],
        "advantages": [
            "Dense hedge",
            "Attracts butterflies"
        ],
        "price": 150,
        "type": "outdoor",
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
        "id": "p_out_48",
        "name": "Vadamalli (Globe Amaranth)",
        "scientificName": "Gomphrena globosa",
        "description": "Purple globe-shaped flowers. Lasts forever, used in garlands.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cough remedy"
        ],
        "advantages": [
            "Everlasting flower",
            "Cute"
        ],
        "price": 80,
        "type": "outdoor",
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
        "id": "p_out_49",
        "name": "Kanakambaram",
        "scientificName": "Crossandra infundibuliformis",
        "description": "Bright orange apricot flowers. A staple for South Indian women's hair.",
        "imageUrl": "https://images.unsplash.com/photo-1628557044797-f21a177c37ec",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique color",
            "Traditional"
        ],
        "price": 100,
        "type": "outdoor",
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
        "id": "p_out_50",
        "name": " Paneer Rose",
        "scientificName": "Rosa damascena",
        "description": "The fragrant pink country rose. Used for rose water and gulkand.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Skin toner",
            "Cooling"
        ],
        "advantages": [
            "Edible",
            "Fragrance"
        ],
        "price": 200,
        "type": "outdoor",
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
        "id": "p_out_51",
        "name": "Mullai",
        "scientificName": "Jasminum auriculatum",
        "description": "Another Jasmine variety, blooms in evening. Essential for garlands.",
        "imageUrl": "https://images.unsplash.com/photo-1558230230-67c00e65306d",
        "idealTempMin": 18,
        "idealTempMax": 32,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Evening scent",
            "Vine"
        ],
        "price": 150,
        "type": "outdoor",
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
        "id": "p_out_52",
        "name": "Shenbagam (Champak)",
        "scientificName": "Magnolia champaca",
        "description": "Golden yellow flowers with a heavenly fruity scent. Sacred tree.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Fever reducer"
        ],
        "advantages": [
            "Perfume",
            "Sacred"
        ],
        "price": 500,
        "type": "outdoor",
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
        "id": "p_out_53",
        "name": "Parijatham (Coral Jasmine)",
        "scientificName": "Nyctanthes arbor-tristis",
        "description": "Night flowering jasmine with orange stems. Flowers fall at dawn.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Sciatica treatment"
        ],
        "advantages": [
            "Night scent",
            "Divine story"
        ],
        "price": 350,
        "type": "outdoor",
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
        "id": "p_out_54",
        "name": "Manoranjitham",
        "scientificName": "Artabotrys hexapetalus",
        "description": "Climbing Ylang-Ylang. Flowers start green and turn yellow. Fruity scent.",
        "imageUrl": "https://images.unsplash.com/photo-1616787688001-5256e6328362",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 70,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Exotic scent",
            "Strong climber"
        ],
        "price": 400,
        "type": "outdoor",
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
        "id": "p_out_55",
        "name": "Mango 'Amrapali'",
        "scientificName": "Mangifera indica",
        "description": "Dwarf mango variety suitable for large pots and terrace gardens.",
        "imageUrl": "https://images.unsplash.com/photo-1595159339352-799da6960db8",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Leaves for diabetes"
        ],
        "advantages": [
            "King of fruits",
            "Dwarf"
        ],
        "price": 600,
        "type": "outdoor",
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
        "id": "p_out_56",
        "name": "Guava (Allahabad Safeda)",
        "scientificName": "Psidium guajava",
        "description": "High yielding guava variety. Can be kept pruned in pots.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 15,
        "idealTempMax": 38,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Leaves for toothache"
        ],
        "advantages": [
            "Vitamin C power",
            "Easy fruit"
        ],
        "price": 300,
        "type": "outdoor",
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
        "id": "p_out_57",
        "name": "Pomegranate 'Bhagwa'",
        "scientificName": "Punica granatum",
        "description": "Deep red seed variety. Very ornamental red flowers and fruits.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Antioxidant rich"
        ],
        "advantages": [
            "Decorative",
            "Healthy fruit"
        ],
        "price": 450,
        "type": "outdoor",
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
        "id": "p_out_58",
        "name": "Lemon (Elumichai)",
        "scientificName": "Citrus limon",
        "description": "Local thin-skinned variety. Essential for rituals and cooking.",
        "imageUrl": "https://images.unsplash.com/photo-1595159339352-799da6960db8",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Immunity"
        ],
        "advantages": [
            "Daily need",
            "Fragrant leaf"
        ],
        "price": 350,
        "type": "outdoor",
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
        "id": "p_out_59",
        "name": "Neem",
        "scientificName": "Azadirachta indica",
        "description": "The village pharmacy. Can be grown as a bonsai/potted plant.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 10,
        "idealTempMax": 45,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Antiviral",
            "Skin cure"
        ],
        "advantages": [
            "Air purifier",
            "Sacred"
        ],
        "price": 250,
        "type": "outdoor",
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
        "id": "p_out_60",
        "name": "Betel Leaf (Karpoori)",
        "scientificName": "Piper betle",
        "description": "Spicy variety of paan. Climber that needs support.",
        "imageUrl": "https://images.unsplash.com/photo-1612361734994-6d91cd4cb744",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 70,
        "sunlight": "low",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Digestion"
        ],
        "advantages": [
            "Cultural necessity",
            "Lush climber"
        ],
        "price": 150,
        "type": "outdoor",
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
        "id": "p_out_61",
        "name": "Bougainvillea",
        "scientificName": "Bougainvillea glabra",
        "description": "Paper-thin colorful bracts. Thrives on neglect and full sun.",
        "imageUrl": "https://images.unsplash.com/photo-1558230230-67c00e65306d",
        "idealTempMin": 10,
        "idealTempMax": 45,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cough remedy"
        ],
        "advantages": [
            "Explosive color",
            "Drought proof"
        ],
        "price": 150,
        "type": "outdoor",
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
        "id": "p_out_62",
        "name": "Plumeria (Champa)",
        "scientificName": "Plumeria rubra",
        "description": "Thick stems and fragrant spiral flowers. Temple tree.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Skin treatments"
        ],
        "advantages": [
            "Heavenly scent",
            "Sculptural"
        ],
        "price": 350,
        "type": "outdoor",
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
        "id": "p_out_63",
        "name": "Petunia",
        "scientificName": "Petunia",
        "description": "Popular bedding plant with wide blooms in all colors.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Color mass",
            "Hanging baskets"
        ],
        "price": 20,
        "type": "outdoor",
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
        "id": "p_out_64",
        "name": "Geranium",
        "scientificName": "Pelargonium",
        "description": "Robust flowers and scented leaves. Classic balcony plant.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": 10,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Oil for skin"
        ],
        "advantages": [
            "Continuous bloom",
            "Hardy"
        ],
        "price": 100,
        "type": "outdoor",
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
        "id": "p_out_65",
        "name": "Cosmos",
        "scientificName": "Cosmos bipinnatus",
        "description": "Daisy-like flowers on thin stems. Dances in the wind.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Self-seeding",
            "Pollinator friendly"
        ],
        "price": 30,
        "type": "outdoor",
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
        "id": "p_out_66",
        "name": "Sunflower",
        "scientificName": "Helianthus annuus",
        "description": "Diverse varieties from dwarf to giant. Turns to face the sun.",
        "imageUrl": "https://images.unsplash.com/photo-1594957388796-0275825318db",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Seeds are nutritious"
        ],
        "advantages": [
            "Happy vibes",
            "Edible"
        ],
        "price": 40,
        "type": "outdoor",
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
        "id": "p_out_67",
        "name": "Rangoon Creeper",
        "scientificName": "Combretum indicum",
        "description": "Vigorous vine with drooping red/pink flower clusters.",
        "imageUrl": "https://images.unsplash.com/photo-1616787688001-5256e6328362",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Traditional med"
        ],
        "advantages": [
            "Covers fences",
            "Fragrant"
        ],
        "price": 250,
        "type": "outdoor",
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
        "id": "p_out_68",
        "name": "Golden Shower Tree",
        "scientificName": "Cassia fistula",
        "description": "Dripping yellow flowers. State flower of Kerala.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Ayurveda"
        ],
        "advantages": [
            "Spectacular bloom",
            "Tree"
        ],
        "price": 300,
        "type": "outdoor",
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
        "id": "p_out_69",
        "name": "Lantana",
        "scientificName": "Lantana camara",
        "description": "Small colorful clustered flowers. Very tough.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Butterfly magnet",
            "Constant color"
        ],
        "price": 50,
        "type": "outdoor",
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
        "id": "p_out_70",
        "name": "Portulaca (Table Rose)",
        "scientificName": "Portulaca grandiflora",
        "description": "Low growing succulent with rose-like flowers. Opens at 9am.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 20,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Ground cover",
            "Vivid colors"
        ],
        "price": 30,
        "type": "outdoor"
    },
    {
        "id": "p_out_71",
        "name": "Vinca (Periwinkle)",
        "scientificName": "Catharanthus roseus",
        "description": "Simple 5-petal flowers. Grows anywhere.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cancer research (Alkaloids)"
        ],
        "advantages": [
            "Always blooms",
            "No maintenance"
        ],
        "price": 40,
        "type": "outdoor"
    },
    {
        "id": "p_out_72",
        "name": "Bleeding Heart Vine",
        "scientificName": "Clerodendrum thomsoniae",
        "description": "White calyx with red petals. Climbing vine.",
        "imageUrl": "https://images.unsplash.com/photo-1616787688001-5256e6328362",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Showy",
            "Trellis cove"
        ],
        "price": 200,
        "type": "outdoor"
    },
    {
        "id": "p_out_73",
        "name": "Powder Puff",
        "scientificName": "Calliandra",
        "description": "Red fluffy balls of stamens. Distinctive shrub.",
        "imageUrl": "https://images.unsplash.com/photo-1557997380-a6df40345097",
        "idealTempMin": 18,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Unique flower",
            "Bushy"
        ],
        "price": 250,
        "type": "outdoor"
    },
    {
        "id": "p_out_74",
        "name": "Tecoma",
        "scientificName": "Tecoma stans",
        "description": "Yellow trumpet flowers. Fast growing shrub/tree.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Diabetes (Traditional)"
        ],
        "advantages": [
            "Bright yellow",
            "Screening"
        ],
        "price": 200,
        "type": "outdoor"
    },
    {
        "id": "p_out_75",
        "name": "Gardenia",
        "scientificName": "Gardenia jasminoides",
        "description": "Creamy white flowers with potent fragrance. Glossy leaves.",
        "imageUrl": "https://images.unsplash.com/photo-1558230230-67c00e65306d",
        "idealTempMin": 18,
        "idealTempMax": 30,
        "minHumidity": 60,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Scent",
            "Classy"
        ],
        "price": 300,
        "type": "outdoor"
    },
    {
        "id": "p_out_76",
        "name": "Allamanda",
        "scientificName": "Allamanda cathartica",
        "description": "Large yellow bell flowers. Common climber.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cathartic (Toxic)"
        ],
        "advantages": [
            "Big blooms",
            "Fast cover"
        ],
        "price": 150,
        "type": "outdoor"
    },
    {
        "id": "p_out_77",
        "name": "Mussaenda",
        "scientificName": "Mussaenda erythrophylla",
        "description": "Showy colored bracts (pink/white/red) often mistaken for petals.",
        "imageUrl": "https://images.unsplash.com/photo-1616787688001-5256e6328362",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Long lasting color",
            "Shrub"
        ],
        "price": 250,
        "type": "outdoor"
    },
    {
        "id": "p_out_78",
        "name": "Verbena",
        "scientificName": "Verbena",
        "description": "Trailing clusters of tiny flowers. Good for hanging pots or borders.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Spiller",
            "Blooms heavily"
        ],
        "price": 50,
        "type": "outdoor"
    },
    {
        "id": "p_out_79",
        "name": "Gazania",
        "scientificName": "Gazania rigens",
        "description": "Sun-loving flowers that close at night. Drought tolerant.",
        "imageUrl": "https://images.unsplash.com/photo-1594957388796-0275825318db",
        "idealTempMin": 10,
        "idealTempMax": 35,
        "minHumidity": 20,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tough",
            "Bright patterns"
        ],
        "price": 60,
        "type": "outdoor"
    },
    {
        "id": "p_out_80",
        "name": "Aster",
        "scientificName": "Aster amellus",
        "description": "Star-shaped flowers. Blooms late season.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": 10,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Blue/Purple colors",
            "Cut flower"
        ],
        "price": 80,
        "type": "outdoor"
    },
    {
        "id": "p_out_81",
        "name": "Canna 'Tropicana'",
        "scientificName": "Canna",
        "description": "Bronze and striped leaves with orange flowers.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Tropical look",
            "Tall"
        ],
        "price": 180,
        "type": "outdoor"
    },
    {
        "id": "p_out_82",
        "name": "Gladiolus",
        "scientificName": "Gladiolus",
        "description": "Tall spikes of flowers from corms. Majestic.",
        "imageUrl": "https://images.unsplash.com/photo-1596716075196-85c401345d31",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Cut flower",
            "Vertical"
        ],
        "price": 100,
        "type": "outdoor"
    },
    {
        "id": "p_out_83",
        "name": "Tuberose (Rajnigandha)",
        "scientificName": "Polianthes tuberosa",
        "description": "Waxy white flowers with overpowering, sultry fragrance.",
        "imageUrl": "https://images.unsplash.com/photo-1558230230-67c00e65306d",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Aromatherapy"
        ],
        "advantages": [
            "Scent",
            "Wedding flower"
        ],
        "price": 150,
        "type": "outdoor"
    },
    {
        "id": "p_out_84",
        "name": "Balsam (Impatiens balsamina)",
        "scientificName": "Impatiens balsamina",
        "description": "Old fashioned garden favorite. Seed pods explode when touched.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 50,
        "sunlight": "medium",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cooling"
        ],
        "advantages": [
            "Fun seeds",
            "Easy"
        ],
        "price": 40,
        "type": "outdoor"
    },
    {
        "id": "p_out_85",
        "name": "Cockscomb",
        "scientificName": "Celosia cristata",
        "description": "Flower looks like a rooster's comb or velvet brain.",
        "imageUrl": "https://images.unsplash.com/photo-1593883344654-706599ccb20e",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Weird texture",
            "Bright"
        ],
        "price": 50,
        "type": "outdoor"
    },
    {
        "id": "p_out_86",
        "name": "Dianthus",
        "scientificName": "Dianthus chinensis",
        "description": "Pinks. Frilled edges on petals.",
        "imageUrl": "https://images.unsplash.com/photo-1601655823671-6c2e7cc187d9",
        "idealTempMin": 10,
        "idealTempMax": 25,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Compact",
            "Bicolor"
        ],
        "price": 40,
        "type": "outdoor"
    },
    {
        "id": "p_out_87",
        "name": "Lotus",
        "scientificName": "Nelumbo nucifera",
        "description": "Aquatic plant. National flower. Needs standing water.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 100,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "All parts edible/medicinal"
        ],
        "advantages": [
            "Divine",
            "Water garden"
        ],
        "price": 500,
        "type": "outdoor"
    },
    {
        "id": "p_out_88",
        "name": "Water Lily",
        "scientificName": "Nymphaea",
        "description": "Floating leaves and flowers. Smaller than Lotus.",
        "imageUrl": "https://images.unsplash.com/photo-1595124036814-725f543666b6",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 100,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Pond essential",
            "Colors"
        ],
        "price": 350,
        "type": "outdoor"
    },
    {
        "id": "p_out_89",
        "name": "Jatropha",
        "scientificName": "Jatropha integerrima",
        "description": "Small tree with star like red flowers year round.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Attracts butterflies",
            "Blooms always"
        ],
        "price": 200,
        "type": "outdoor"
    },
    {
        "id": "p_out_90",
        "name": "Cycas Palm",
        "scientificName": "Cycas revoluta",
        "description": "Ancient plant like a palm/fern. Sago Palm. Slow growing.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Prehistoric",
            "Touch"
        ],
        "price": 600,
        "type": "outdoor"
    },
    {
        "id": "p_out_91",
        "name": "Bottle Brush",
        "scientificName": "Callistemon",
        "description": "Red brush-like flowers. Tree.",
        "imageUrl": "https://images.unsplash.com/photo-1557997380-a6df40345097",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Bird magnet",
            "Weeping form"
        ],
        "price": 300,
        "type": "outdoor"
    },
    {
        "id": "p_out_92",
        "name": "Papaya",
        "scientificName": "Carica papaya",
        "description": "Fruit tree. Fast growing single stem.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Digestion",
            "Dengue platelet count"
        ],
        "advantages": [
            "Fruit",
            "Quick harvest"
        ],
        "price": 100,
        "type": "outdoor"
    },
    {
        "id": "p_out_93",
        "name": "Banana",
        "scientificName": "Musa",
        "description": "Large tropical leaves. Gives cooling effect.",
        "imageUrl": "https://images.unsplash.com/photo-1549416878-b97f805a96d1",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Fruit/Stem/Flower edible"
        ],
        "advantages": [
            "Food",
            "Tropical feel"
        ],
        "price": 150,
        "type": "outdoor"
    },
    {
        "id": "p_out_94",
        "name": "Drumstick (Moringa)",
        "scientificName": "Moringa oleifera",
        "description": "Superfood tree. Fast growing.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 20,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Superfood",
            "Multi-vitamin"
        ],
        "advantages": [
            "Healthy",
            "Easy"
        ],
        "price": 100,
        "type": "outdoor"
    },
    {
        "id": "p_out_95",
        "name": "Amla (Gooseberry)",
        "scientificName": "Phyllanthus emblica",
        "description": "Sacred tree with sour berries rich in Vitamin C.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512803-085e481b4986",
        "idealTempMin": 15,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Immunity",
            "Hair"
        ],
        "advantages": [
            "Healing",
            "Sacred"
        ],
        "price": 250,
        "type": "outdoor"
    },
    {
        "id": "p_out_96",
        "name": "Sapota (Chikoo)",
        "scientificName": "Manilkara zapota",
        "description": "Sweet brown fruit. Dense shade tree.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 50,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "Energy"
        ],
        "advantages": [
            "Tasty fruit",
            "Shade"
        ],
        "price": 350,
        "type": "outdoor"
    },
    {
        "id": "p_out_97",
        "name": "Custard Apple (Sitaphal)",
        "scientificName": "Annona squamosa",
        "description": "Sweet creamy fruit. Distinctive nubby skin.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 40,
        "sunlight": "direct",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "Cooling"
        ],
        "advantages": [
            "Fruit",
            "Hardy"
        ],
        "price": 250,
        "type": "outdoor"
    },
    {
        "id": "p_out_98",
        "name": "Jackfruit",
        "scientificName": "Artocarpus heterophyllus",
        "description": "Largest tree fruit. National fruit of Bangladesh/Kerala.",
        "imageUrl": "https://images.unsplash.com/photo-1591466635338-790176dccb41",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 60,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Nutritious"
        ],
        "advantages": [
            "Huge yield",
            "Timber"
        ],
        "price": 400,
        "type": "outdoor"
    },
    {
        "id": "p_out_99",
        "name": "Rubber Tree (Hevea)",
        "scientificName": "Hevea brasiliensis",
        "description": "Commercial rubber source. Large shade tree.",
        "imageUrl": "https://images.unsplash.com/photo-1596720512534-72210887ee2c",
        "idealTempMin": 20,
        "idealTempMax": 35,
        "minHumidity": 70,
        "sunlight": "direct",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "Latex"
        ],
        "advantages": [
            "Economic",
            "Shade"
        ],
        "price": 200,
        "type": "outdoor"
    },
    {
        "id": "p_out_100",
        "name": "False Ashoka",
        "scientificName": "Polyalthia longifolia",
        "description": "Tall, columnar tree used for noise barriers and lining driveways.",
        "imageUrl": "https://images.unsplash.com/photo-1610415664157-548c783c6b24",
        "idealTempMin": 15,
        "idealTempMax": 40,
        "minHumidity": 30,
        "sunlight": "direct",
        "oxygenLevel": "high",
        "medicinalValues": [
            "None"
        ],
        "advantages": [
            "Screening",
            "Formal look"
        ],
        "price": 150,
        "type": "outdoor"
    },
    {
        "id": "p_out_100",
        "name": "Zirconium Bush",
        "scientificName": "Kub henry",
        "description": "Recusandae cibus coepi amicitia sponte chirographum collum. Minus quidem casus creo amet conservo sumo vulnus deputo una.",
        "imageUrl": "https://images.unsplash.com/photo-8905589084?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 33,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "enraged",
            "collectivization"
        ],
        "advantages": [
            "impactful",
            "convergence"
        ],
        "price": 20,
        "type": "outdoor",
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
        "id": "p_out_101",
        "name": "Tungsten Bush",
        "scientificName": "Breitenberg volt",
        "description": "Maiores vehemens texo canis repudiandae. Pecco clementia tutis suffoco antepono decretum.",
        "imageUrl": "https://images.unsplash.com/photo-8834814201?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 36,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "pink",
            "bid"
        ],
        "advantages": [
            "cross-media",
            "smart contracts"
        ],
        "price": 19,
        "type": "outdoor",
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
        "id": "p_out_102",
        "name": "Neon Bush",
        "scientificName": "Johns tesla",
        "description": "Dolores fugiat amo decens cenaculum strenuus carus terminatio. Conor curriculum arbitro.",
        "imageUrl": "https://images.unsplash.com/photo-6882039684?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 6,
        "idealTempMax": 29,
        "minHumidity": 38,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "worthwhile",
            "fellow"
        ],
        "advantages": [
            "efficient",
            "users"
        ],
        "price": 200,
        "type": "outdoor",
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
        "id": "p_out_103",
        "name": "Samarium Bush",
        "scientificName": "Hammes siemens",
        "description": "Unde debeo derelinquo vulgo admitto ipsam cimentarius solum temptatio. Vitium conatus auctus conservo umquam quam eius adeo templum.",
        "imageUrl": "https://images.unsplash.com/photo-6276117927?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 35,
        "minHumidity": 55,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "yellow",
            "ethyl"
        ],
        "advantages": [
            "plug-and-play",
            "initiatives"
        ],
        "price": 127,
        "type": "outdoor",
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
        "id": "p_out_104",
        "name": "Rutherfordium Bush",
        "scientificName": "Bechtelar ampere",
        "description": "Pauci deduco natus votum derelinquo ultra supplanto coadunatio apostolus. Tabella adeptio suasoria circumvenio sophismata.",
        "imageUrl": "https://images.unsplash.com/photo-5564867695?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 54,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "steel",
            "developing"
        ],
        "advantages": [
            "leading-edge",
            "users"
        ],
        "price": 84,
        "type": "outdoor",
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
        "id": "p_out_105",
        "name": "Hydrogen Bush",
        "scientificName": "Kilback newton",
        "description": "Atrox dapifer theca cribro venio. Cometes patrocinor stipes.",
        "imageUrl": "https://images.unsplash.com/photo-5301455428?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 28,
        "minHumidity": 51,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "nimble",
            "granny"
        ],
        "advantages": [
            "cutting-edge",
            "lifetime value"
        ],
        "price": 195,
        "type": "outdoor",
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
        "id": "p_out_106",
        "name": "Uranium Bush",
        "scientificName": "Willms candela",
        "description": "Cultellus solvo coadunatio curvo sto magnam. Tergiversatio conturbo adhaero ultra tutamen territo patruus volva.",
        "imageUrl": "https://images.unsplash.com/photo-1932297806?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 25,
        "minHumidity": 62,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "palatable",
            "sanity"
        ],
        "advantages": [
            "virtual",
            "users"
        ],
        "price": 198,
        "type": "outdoor",
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
        "id": "p_out_107",
        "name": "Bromine Bush",
        "scientificName": "Cole ampere",
        "description": "Aperte soleo vitium solio acerbitas vigor beatus ad ex pecus. Adhuc commodo bibo credo cupio terebro vorax urbs ipsam.",
        "imageUrl": "https://images.unsplash.com/photo-1519467059?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 30,
        "minHumidity": 31,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "prickly",
            "ceramics"
        ],
        "advantages": [
            "holistic",
            "networks"
        ],
        "price": 117,
        "type": "outdoor",
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
        "id": "p_out_108",
        "name": "Uranium Bush",
        "scientificName": "Bashirian kilogram",
        "description": "Aliquam trucido valeo sono averto voluptatem tumultus atavus admitto. Acerbitas solum arx.",
        "imageUrl": "https://images.unsplash.com/photo-7564643037?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 32,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "glaring",
            "impostor"
        ],
        "advantages": [
            "value-added",
            "experiences"
        ],
        "price": 175,
        "type": "outdoor",
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
        "id": "p_out_109",
        "name": "Nickel Bush",
        "scientificName": "Howe gray",
        "description": "Taceo speculum vulpes recusandae demoror audeo bis similique. Tracto tero ambitus.",
        "imageUrl": "https://images.unsplash.com/photo-1745289445?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 26,
        "minHumidity": 44,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "outlying",
            "agreement"
        ],
        "advantages": [
            "decentralized",
            "users"
        ],
        "price": 99,
        "type": "outdoor",
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
        "id": "p_out_110",
        "name": "Promethium Bush",
        "scientificName": "Denesik katal",
        "description": "Subseco appello suasoria. Alias cupiditas aestus victus aeger.",
        "imageUrl": "https://images.unsplash.com/photo-6448370704?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 27,
        "minHumidity": 57,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "warlike",
            "intent"
        ],
        "advantages": [
            "killer",
            "markets"
        ],
        "price": 176,
        "type": "outdoor",
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
        "id": "p_out_111",
        "name": "Copernicium Bush",
        "scientificName": "Dickens mole",
        "description": "Corroboro titulus pectus adversus vulpes nihil compello. Usus avarus mollitia corroboro consequuntur copiose.",
        "imageUrl": "https://images.unsplash.com/photo-2194046274?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 14,
        "idealTempMax": 26,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "all",
            "skyline"
        ],
        "advantages": [
            "enterprise",
            "mindshare"
        ],
        "price": 44,
        "type": "outdoor",
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
        "id": "p_out_112",
        "name": "Gadolinium Bush",
        "scientificName": "O'Kon degree celsius",
        "description": "Appono vigor videlicet varietas alter subiungo. Vicinus quo urbs comes aduro spiculum.",
        "imageUrl": "https://images.unsplash.com/photo-1340659087?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 61,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "advanced",
            "numeric"
        ],
        "advantages": [
            "virtual",
            "blockchains"
        ],
        "price": 110,
        "type": "outdoor",
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
        "id": "p_out_113",
        "name": "Molybdenum Bush",
        "scientificName": "Ebert mole",
        "description": "Acer esse sit. Demergo numquam inflammatio cavus civis credo tendo acquiro tactus talus.",
        "imageUrl": "https://images.unsplash.com/photo-5273468438?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 28,
        "minHumidity": 53,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "arid",
            "godfather"
        ],
        "advantages": [
            "robust",
            "architectures"
        ],
        "price": 21,
        "type": "outdoor",
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
        "id": "p_out_114",
        "name": "Gadolinium Bush",
        "scientificName": "Robel tesla",
        "description": "Natus sollers callide clam. Ars dapifer canis suadeo sodalitas.",
        "imageUrl": "https://images.unsplash.com/photo-1756585102?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 31,
        "minHumidity": 60,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "fond",
            "pop"
        ],
        "advantages": [
            "customized",
            "blockchains"
        ],
        "price": 159,
        "type": "outdoor",
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
        "id": "p_out_115",
        "name": "Selenium Bush",
        "scientificName": "Rempel pascal",
        "description": "Coadunatio dedico ultra vindico voluptates cogo. Peior territo corporis confido custodia atrox coepi currus adversus.",
        "imageUrl": "https://images.unsplash.com/photo-4574945977?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 30,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "avaricious",
            "goat"
        ],
        "advantages": [
            "collaborative",
            "blockchains"
        ],
        "price": 131,
        "type": "outdoor",
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
        "id": "p_out_116",
        "name": "Rutherfordium Bush",
        "scientificName": "Gleason radian",
        "description": "Cubicularis delectatio amicitia trado. Templum convoco verbera uredo coniuratio bonus argumentum acidus deleniti.",
        "imageUrl": "https://images.unsplash.com/photo-8667984628?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 28,
        "minHumidity": 52,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "distant",
            "term"
        ],
        "advantages": [
            "AI-driven",
            "networks"
        ],
        "price": 40,
        "type": "outdoor",
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
        "id": "p_out_117",
        "name": "Rhenium Bush",
        "scientificName": "Gleason-Jenkins lumen",
        "description": "Truculenter coniuratio vilis defero considero quasi. Sonitus nam pax peior aggero virtus aestus subnecto.",
        "imageUrl": "https://images.unsplash.com/photo-7670191431?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 73,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "fluffy",
            "guacamole"
        ],
        "advantages": [
            "smart",
            "platforms"
        ],
        "price": 98,
        "type": "outdoor",
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
        "id": "p_out_118",
        "name": "Francium Bush",
        "scientificName": "Fadel mole",
        "description": "Aestivus adopto sperno tamdiu. Tardus ceno tracto cilicium confido textus appositus administratio.",
        "imageUrl": "https://images.unsplash.com/photo-2199844560?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 33,
        "minHumidity": 62,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "orange",
            "yak"
        ],
        "advantages": [
            "seamless",
            "mindshare"
        ],
        "price": 61,
        "type": "outdoor",
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
        "id": "p_out_119",
        "name": "Lithium Bush",
        "scientificName": "Mayert second",
        "description": "Trucido verumtamen carcer dolor stillicidium claro corporis cenaculum. Voluptatibus alius tantillus.",
        "imageUrl": "https://images.unsplash.com/photo-1572198926?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 35,
        "minHumidity": 79,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "probable",
            "space"
        ],
        "advantages": [
            "innovative",
            "platforms"
        ],
        "price": 153,
        "type": "outdoor",
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
        "id": "p_out_120",
        "name": "Tin Bush",
        "scientificName": "Brekke becquerel",
        "description": "Tum admitto sodalitas cerno somniculosus atqui cras decerno. Approbo demum aut studio.",
        "imageUrl": "https://images.unsplash.com/photo-5735049159?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 10,
        "idealTempMax": 33,
        "minHumidity": 71,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "similar",
            "premier"
        ],
        "advantages": [
            "decentralized",
            "architectures"
        ],
        "price": 12,
        "type": "outdoor",
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
        "id": "p_out_121",
        "name": "Indium Bush",
        "scientificName": "Corwin joule",
        "description": "Tempora verus ipsa talus cometes thesaurus acsi agnitio nesciunt stultus. Nulla stabilis absque appello vigor viscus viscus maiores volubilis.",
        "imageUrl": "https://images.unsplash.com/photo-5608395606?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 25,
        "minHumidity": 33,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "weird",
            "seagull"
        ],
        "advantages": [
            "mission-critical",
            "blockchains"
        ],
        "price": 61,
        "type": "outdoor",
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
        "id": "p_out_122",
        "name": "Nihonium Bush",
        "scientificName": "Kutch joule",
        "description": "Degenero nihil testimonium aperte vestrum assentator una adduco iusto. Alter aspernatur supplanto arto volup accusator quia.",
        "imageUrl": "https://images.unsplash.com/photo-4020390617?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 35,
        "minHumidity": 64,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "able",
            "reach"
        ],
        "advantages": [
            "transparent",
            "solutions"
        ],
        "price": 184,
        "type": "outdoor",
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
        "id": "p_out_123",
        "name": "Mercury Bush",
        "scientificName": "Bahringer joule",
        "description": "Tergiversatio vitiosus pel viduo vulgo decipio dolorum degusto suffragium. Stella carbo desipio.",
        "imageUrl": "https://images.unsplash.com/photo-3772194189?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 32,
        "minHumidity": 75,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "each",
            "reasoning"
        ],
        "advantages": [
            "scalable",
            "ROI"
        ],
        "price": 142,
        "type": "outdoor",
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
        "id": "p_out_124",
        "name": "Lithium Bush",
        "scientificName": "Macejkovic degree celsius",
        "description": "Corroboro apud coadunatio usus congregatio nisi inventore repudiandae. Corrupti aperiam suadeo vilitas voco totus dolorem conservo.",
        "imageUrl": "https://images.unsplash.com/photo-5016981734?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 32,
        "minHumidity": 52,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "frizzy",
            "sushi"
        ],
        "advantages": [
            "24/7",
            "users"
        ],
        "price": 177,
        "type": "outdoor",
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
        "id": "p_out_125",
        "name": "Mercury Bush",
        "scientificName": "Rogahn second",
        "description": "Amissio trans nostrum traho. Valens sequi harum.",
        "imageUrl": "https://images.unsplash.com/photo-1085665589?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 28,
        "minHumidity": 44,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "far-off",
            "wriggler"
        ],
        "advantages": [
            "granular",
            "platforms"
        ],
        "price": 76,
        "type": "outdoor",
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
        "id": "p_out_126",
        "name": "Silver Bush",
        "scientificName": "Schinner radian",
        "description": "Amitto conitor caelestis commemoro demergo demens xiphias quos cunae. Stabilis temeritas aveho carmen a adhaero solitudo.",
        "imageUrl": "https://images.unsplash.com/photo-5334774255?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 29,
        "minHumidity": 35,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "alert",
            "coordination"
        ],
        "advantages": [
            "end-to-end",
            "functionalities"
        ],
        "price": 54,
        "type": "outdoor",
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
        "id": "p_out_127",
        "name": "Silver Bush",
        "scientificName": "Rowe tesla",
        "description": "Vulnus varietas sortitus demoror. Deduco non aequitas corona summisse velum.",
        "imageUrl": "https://images.unsplash.com/photo-7800651105?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 11,
        "idealTempMax": 29,
        "minHumidity": 71,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "sore",
            "instance"
        ],
        "advantages": [
            "cross-platform",
            "paradigms"
        ],
        "price": 45,
        "type": "outdoor",
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
        "id": "p_out_128",
        "name": "Terbium Bush",
        "scientificName": "Larson candela",
        "description": "Vulpes quis capto vitiosus. Delibero patria apostolus thermae civis architecto tamisium pauper trans.",
        "imageUrl": "https://images.unsplash.com/photo-2076835538?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 9,
        "idealTempMax": 31,
        "minHumidity": 55,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "hidden",
            "tuba"
        ],
        "advantages": [
            "synergistic",
            "supply-chains"
        ],
        "price": 75,
        "type": "outdoor",
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
        "id": "p_out_129",
        "name": "Actinium Bush",
        "scientificName": "Nitzsche gray",
        "description": "Vilitas suscipit avaritia. Deprimo summopere crastinus concedo.",
        "imageUrl": "https://images.unsplash.com/photo-7887124567?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 34,
        "minHumidity": 40,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "same",
            "aftermath"
        ],
        "advantages": [
            "transparent",
            "relationships"
        ],
        "price": 39,
        "type": "outdoor",
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
        "id": "p_out_130",
        "name": "Fermium Bush",
        "scientificName": "Turner hertz",
        "description": "Sublime auditor vero amita apto sol demens degenero. Quaerat admoneo deripio statim vis doloremque possimus termes derelinquo.",
        "imageUrl": "https://images.unsplash.com/photo-6231729061?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 32,
        "minHumidity": 80,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "trained",
            "pension"
        ],
        "advantages": [
            "cross-media",
            "initiatives"
        ],
        "price": 52,
        "type": "outdoor",
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
        "id": "p_out_131",
        "name": "Gallium Bush",
        "scientificName": "Terry kilogram",
        "description": "Cupio coepi dedico bene deficio thema capto cogito tendo celer. Tonsor doloremque bonus trepide.",
        "imageUrl": "https://images.unsplash.com/photo-7910584065?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 32,
        "minHumidity": 74,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "close",
            "pilot"
        ],
        "advantages": [
            "cutting-edge",
            "partnerships"
        ],
        "price": 104,
        "type": "outdoor",
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
        "id": "p_out_132",
        "name": "Silver Bush",
        "scientificName": "Fisher siemens",
        "description": "Curo beneficium aer totam sufficio vacuus conservo consequuntur soluta. Delectatio voluptates sollicito neque degenero bibo beatae dolorem sopor magnam.",
        "imageUrl": "https://images.unsplash.com/photo-3882171954?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 46,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "sure-footed",
            "embarrassment"
        ],
        "advantages": [
            "integrated",
            "interfaces"
        ],
        "price": 159,
        "type": "outdoor",
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
        "id": "p_out_133",
        "name": "Tungsten Bush",
        "scientificName": "Rohan kelvin",
        "description": "Crastinus umerus urbs unus tempore curatio studio nobis. Crepusculum charisma commemoro confero tergeo exercitationem eos articulus acer.",
        "imageUrl": "https://images.unsplash.com/photo-8252248070?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 26,
        "minHumidity": 50,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "tender",
            "airbus"
        ],
        "advantages": [
            "generative",
            "e-commerce"
        ],
        "price": 23,
        "type": "outdoor",
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
        "id": "p_out_134",
        "name": "Thorium Bush",
        "scientificName": "Wuckert joule",
        "description": "Vomica curiositas odio textor sub. Virga umquam usitas aperiam congregatio voluntarius autus cimentarius sordeo minima.",
        "imageUrl": "https://images.unsplash.com/photo-5242660717?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 32,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "upbeat",
            "solution"
        ],
        "advantages": [
            "extensible",
            "channels"
        ],
        "price": 171,
        "type": "outdoor",
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
        "id": "p_out_135",
        "name": "Californium Bush",
        "scientificName": "Johnston pascal",
        "description": "Certus cultura conventus sit libero pauper celebrer amita auditor tristis. Cursus vinculum verbera antea cupiditas surculus temptatio solitudo tamdiu.",
        "imageUrl": "https://images.unsplash.com/photo-9220918665?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 59,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "snappy",
            "decision"
        ],
        "advantages": [
            "plug-and-play",
            "smart contracts"
        ],
        "price": 29,
        "type": "outdoor",
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
        "id": "p_out_136",
        "name": "Nitrogen Bush",
        "scientificName": "Ortiz radian",
        "description": "Conqueror aliqua compono summa adfectus tredecim denuncio conitor artificiose. Credo ventito amicitia.",
        "imageUrl": "https://images.unsplash.com/photo-8171642764?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 29,
        "minHumidity": 34,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "altruistic",
            "information"
        ],
        "advantages": [
            "global",
            "technologies"
        ],
        "price": 166,
        "type": "outdoor",
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
        "id": "p_out_137",
        "name": "Niobium Bush",
        "scientificName": "Ritchie becquerel",
        "description": "Aegrus saepe urbs canis error crebro demens testimonium adipisci. Adflicto tepesco vere.",
        "imageUrl": "https://images.unsplash.com/photo-5032438092?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 34,
        "minHumidity": 72,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "handsome",
            "bell"
        ],
        "advantages": [
            "B2B",
            "applications"
        ],
        "price": 112,
        "type": "outdoor",
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
        "id": "p_out_138",
        "name": "Californium Bush",
        "scientificName": "Moen katal",
        "description": "Copiose comptus aufero sordeo aliquid facilis tibi vitiosus non depromo. Somnus defleo voluptatibus abstergo.",
        "imageUrl": "https://images.unsplash.com/photo-2447342942?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 26,
        "minHumidity": 69,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "pleasant",
            "exterior"
        ],
        "advantages": [
            "sustainable",
            "mindshare"
        ],
        "price": 43,
        "type": "outdoor",
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
        "id": "p_out_139",
        "name": "Rhenium Bush",
        "scientificName": "Halvorson-Feil volt",
        "description": "Capitulus cado sunt cruciamentum. Cupressus accusantium aptus degero sordeo.",
        "imageUrl": "https://images.unsplash.com/photo-6948832347?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 13,
        "idealTempMax": 33,
        "minHumidity": 78,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "warm",
            "formamide"
        ],
        "advantages": [
            "impactful",
            "smart contracts"
        ],
        "price": 159,
        "type": "outdoor",
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
        "id": "p_out_140",
        "name": "Californium Bush",
        "scientificName": "Reinger katal",
        "description": "Vado acer suffoco amita. Amplexus amiculum in tenetur vesco sustineo.",
        "imageUrl": "https://images.unsplash.com/photo-4623441020?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 57,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "dead",
            "pecan"
        ],
        "advantages": [
            "back-end",
            "e-commerce"
        ],
        "price": 30,
        "type": "outdoor",
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
        "id": "p_out_141",
        "name": "Rubidium Bush",
        "scientificName": "Auer volt",
        "description": "Adsuesco alias vivo catena deprimo testimonium. Quisquam arbitro speciosus carbo spes voro temeritas desidero vapulus decumbo.",
        "imageUrl": "https://images.unsplash.com/photo-4978749000?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 30,
        "minHumidity": 69,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "only",
            "transom"
        ],
        "advantages": [
            "B2C",
            "infrastructures"
        ],
        "price": 61,
        "type": "outdoor",
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
        "id": "p_out_142",
        "name": "Moscovium Bush",
        "scientificName": "Koepp steradian",
        "description": "Adeo corpus adicio aestus creo. Umquam similique facere tutamen aliquam vinitor tricesimus.",
        "imageUrl": "https://images.unsplash.com/photo-2250683028?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 12,
        "idealTempMax": 29,
        "minHumidity": 52,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "livid",
            "lyre"
        ],
        "advantages": [
            "quantum",
            "methodologies"
        ],
        "price": 119,
        "type": "outdoor",
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
        "id": "p_out_143",
        "name": "Cadmium Bush",
        "scientificName": "Reynolds newton",
        "description": "Molestias temporibus accedo perspiciatis venustas conor thorax paens vitiosus. Urbanus fugit aggredior pecto vulnero damnatio.",
        "imageUrl": "https://images.unsplash.com/photo-4774444517?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 33,
        "minHumidity": 59,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "reflecting",
            "diver"
        ],
        "advantages": [
            "innovative",
            "relationships"
        ],
        "price": 58,
        "type": "outdoor",
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
        "id": "p_out_144",
        "name": "Europium Bush",
        "scientificName": "Schmidt degree celsius",
        "description": "Calco theca curriculum voluptates ab vulticulus verto sonitus peccatus. Vomica cetera atqui validus assumenda spes alias callide.",
        "imageUrl": "https://images.unsplash.com/photo-6696764365?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 32,
        "minHumidity": 43,
        "sunlight": "high",
        "oxygenLevel": "very-high",
        "medicinalValues": [
            "weary",
            "dash"
        ],
        "advantages": [
            "intuitive",
            "deliverables"
        ],
        "price": 93,
        "type": "outdoor",
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
        "id": "p_out_145",
        "name": "Tantalum Bush",
        "scientificName": "Krajcik weber",
        "description": "Quidem placeat ad dolores apparatus sit suspendo tenax video claro. Defungo aro cibo usitas arcus ager auctor amiculum aufero pecus.",
        "imageUrl": "https://images.unsplash.com/photo-1032158138?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 8,
        "idealTempMax": 28,
        "minHumidity": 39,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "pink",
            "self-confidence"
        ],
        "advantages": [
            "smart",
            "applications"
        ],
        "price": 133,
        "type": "outdoor",
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
        "id": "p_out_146",
        "name": "Moscovium Bush",
        "scientificName": "Mueller henry",
        "description": "Cumque demulceo triumphus adhaero debitis admoveo artificiose animus talis. Succedo adiuvo aegrotatio defluo taceo.",
        "imageUrl": "https://images.unsplash.com/photo-3215183347?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 7,
        "idealTempMax": 35,
        "minHumidity": 76,
        "sunlight": "high",
        "oxygenLevel": "moderate",
        "medicinalValues": [
            "genuine",
            "parade"
        ],
        "advantages": [
            "strategic",
            "niches"
        ],
        "price": 65,
        "type": "outdoor",
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
        "id": "p_out_147",
        "name": "Gallium Bush",
        "scientificName": "Willms watt",
        "description": "Magnam adulatio asporto crudelis abeo ager itaque tabgo. Adipiscor tenetur ustulo verecundia volva sperno ancilla umerus.",
        "imageUrl": "https://images.unsplash.com/photo-1497269701?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 30,
        "minHumidity": 76,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "warped",
            "slide"
        ],
        "advantages": [
            "frictionless",
            "methodologies"
        ],
        "price": 105,
        "type": "outdoor",
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
        "id": "p_out_148",
        "name": "Manganese Bush",
        "scientificName": "Beier hertz",
        "description": "Averto sonitus comminor charisma. Compello abstergo pel praesentium eligendi animadverto aro amor trans corona.",
        "imageUrl": "https://images.unsplash.com/photo-1848014709?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 15,
        "idealTempMax": 31,
        "minHumidity": 30,
        "sunlight": "high",
        "oxygenLevel": "low",
        "medicinalValues": [
            "untried",
            "fort"
        ],
        "advantages": [
            "impactful",
            "mindshare"
        ],
        "price": 156,
        "type": "outdoor",
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
        "id": "p_out_149",
        "name": "Tantalum Bush",
        "scientificName": "Barton candela",
        "description": "Voluptatum laudantium corrigo aggero vitiosus tamquam. Cimentarius blandior nobis tricesimus ascisco hic damnatio.",
        "imageUrl": "https://images.unsplash.com/photo-4821328461?auto=format&fit=crop&w=800&q=80",
        "idealTempMin": 5,
        "idealTempMax": 33,
        "minHumidity": 58,
        "sunlight": "high",
        "oxygenLevel": "high",
        "medicinalValues": [
            "standard",
            "interchange"
        ],
        "advantages": [
            "B2B",
            "infrastructures"
        ],
        "price": 133,
        "type": "outdoor",
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
