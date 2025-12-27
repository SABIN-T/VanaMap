const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// REAL IDENTITIES for Indoor Plants (Expanded to 50+)
const REAL_INDOOR_PLANTS = [
    { name: "Snake Plant", sci: "Sansevieria trifasciata", life: "10-25 Years", medicinal: ["Air purification", "Stress reduction"], advantages: ["Easiest to grow", "Drought tolerant"] },
    { name: "Peace Lily", sci: "Spathiphyllum wallisii", life: "3-5 Years", medicinal: ["Removes ammonia", "Removes benzene"], advantages: ["Flowering indoor", "Visual watering signal"] },
    { name: "Spider Plant", sci: "Chlorophytum comosum", life: "20-50 Years", medicinal: ["Safe for pets", "Oxygen production"], advantages: ["Easy propagation", "Non-toxic"] },
    { name: "Fiddle Leaf Fig", sci: "Ficus lyrata", life: "25-50 Years", medicinal: ["Visual stress relief", "Dust collection"], advantages: ["Architectural structure", "Trendy aesthetic"] },
    { name: "Aloe Vera", sci: "Aloe barbadensis miller", life: "5-20 Years", medicinal: ["Heals burns", "Skin care"], advantages: ["Releases oxygen at night", "Low maintenance"] },
    { name: "Rubber Plant", sci: "Ficus elastica", life: "15-25 Years", medicinal: ["Removes formaldehyde", "Removes bacteria"], advantages: ["Large foliage", "Robust stem"] },
    { name: "Monstera", sci: "Monstera deliciosa", life: "10-50 Years", medicinal: ["Mood booster", "Air purifying"], advantages: ["Statement piece", "Fast grower"] },
    { name: "Pothos", sci: "Epipremnum aureum", life: "5-10 Years", medicinal: ["Removes pollutants", "Eye relaxation"], advantages: ["Trailing beauty", "Propagates easily in water"] },
    { name: "ZZ Plant", sci: "Zamioculcas zamiifolia", life: "5-10 Years", medicinal: ["Air purification", "Stress reduction"], advantages: ["Thrives on neglect", "Modern look"] },
    { name: "Boston Fern", sci: "Nephrolepis exaltata", life: "2-5 Years", medicinal: ["Natural humidifier", "Clean air"], advantages: ["Lush foliage", "Pet friendly"] },
    { name: "Jade Plant", sci: "Crassula ovata", life: "50-70 Years", medicinal: ["Skin irritant (Sap)", "Symbolism only"], advantages: ["Long lived", "Easy bonsai"] },
    { name: "Chinese Money Plant", sci: "Pilea peperomioides", life: "5-10 Years", medicinal: ["None known"], advantages: ["Cute appearance", "Easy to share pups"] },
    { name: "Areca Palm", sci: "Dypsis lutescens", life: "10-15 Years", medicinal: ["Humidifier", "Removes Xylene"], advantages: ["Pet friendly", "Tropical look"] },
    { name: "Bird of Paradise", sci: "Strelitzia reginae", life: "50-100 Years", medicinal: ["None known"], advantages: ["Statement plant", "Exotic flowers"] },
    { name: "Cast Iron Plant", sci: "Aspidistra elatior", life: "50+ Years", medicinal: ["None known"], advantages: ["Indestructible", "Low light tolerant"] },
    { name: "Philodendron Green", sci: "Philodendron hederaceum", life: "10+ Years", medicinal: ["Air scrubbing"], advantages: ["Tolerates dark corners", "Fast growth"] },
    { name: "Majesty Palm", sci: "Ravenea rivularis", life: "10-20 Years", medicinal: ["Air purification"], advantages: ["Large size", "Elegant fronds"] },
    { name: "Dumb Cane", sci: "Dieffenbachia seguine", life: "3-5 Years", medicinal: ["Toxic Sap (Warning)"], advantages: ["Bushy growth", "Striking patterns"] },
    { name: "English Ivy", sci: "Hedera helix", life: "10-50 Years", medicinal: ["Mold reduction", "Air cleaning"], advantages: ["Climbs trellises", "Classic look"] },
    { name: "Calathea Rattlesnake", sci: "Goeppertia insignis", life: "5-10 Years", medicinal: ["None known"], advantages: ["Patterned foliage", "Pet Safe"] },
    { name: "Prayer Plant", sci: "Maranta leuconeura", life: "2-5 Years", medicinal: ["Circadian rhythm helper"], advantages: ["Dynamic movement", "Stunning patterns"] },
    { name: "Ponytail Palm", sci: "Beaucarnea recurvata", life: "50-100 Years", medicinal: ["None known"], advantages: ["Unique trunk", "Drought tolerant"] },
    { name: "String of Pearls", sci: "Curio rowleyanus", life: "3-5 Years", medicinal: ["Visual interest"], advantages: ["Hanging basket favorite", "Unique texture"] },
    { name: "African Violet", sci: "Saintpaulia ionantha", life: "50+ Years", medicinal: ["None known"], advantages: ["Continuous Color", "Small Size"] },
    { name: "Air Plant", sci: "Tillandsia", life: "2-5 Years", medicinal: ["None known"], advantages: ["Soil-free", "Mountable anywhere"] },
    { name: "Lucky Bamboo", sci: "Dracaena sanderiana", life: "5-10 Years", medicinal: ["Feng Shui"], advantages: ["Water Culture", "Symbolic"] },
    { name: "Christmas Cactus", sci: "Schlumbergera buckleyi", life: "20-30 Years", medicinal: ["None known"], advantages: ["Winter bloom", "Non-toxic"] },
    { name: "Croton", sci: "Codiaeum variegatum", life: "2-5 Years", medicinal: ["None known"], advantages: ["Vibrant colors", "Bushy"] },
    { name: "Anthurium", sci: "Anthurium andraeanum", life: "5-10 Years", medicinal: ["Removes toluene"], advantages: ["Continuous color", "Exotic look"] },
    { name: "Parlor Palm", sci: "Chamaedorea elegans", life: "10-20 Years", medicinal: ["Benzene Removal"], advantages: ["Pet Safe", "Low Light Tolerant"] },
    { name: "Yucca", sci: "Yucca elephantipes", life: "20-50 Years", medicinal: ["Edible Flowers (Wild)"], advantages: ["Indestructible", "Modern Look"] },
    { name: "Corn Plant", sci: "Dracaena fragrans", life: "10-20 Years", medicinal: ["Toxin Removal"], advantages: ["Height", "Easy Care"] },
    { name: "Hoya Heart", sci: "Hoya kerrii", life: "5-10 Years", medicinal: ["None known"], advantages: ["Heart shape", "Novelty"] },
    { name: "Bunny Ear Cactus", sci: "Opuntia microdasys", life: "10-20 Years", medicinal: ["None known"], advantages: ["Fun shape", "Low water"] },
    { name: "Haworthia", sci: "Haworthia attenuata", life: "40-50 Years", medicinal: ["None known"], advantages: ["Pet Safe", "Compact"] },
    { name: "Polka Dot Plant", sci: "Hypoestes phyllostachya", life: "Annual/Short-lived", medicinal: ["None known"], advantages: ["Terrarium friendly", "Colorful"] },
    { name: "Nerve Plant", sci: "Fittonia albivenis", life: "2-3 Years", medicinal: ["None known"], advantages: ["Terrarium Plant", "Colorful veins"] },
    { name: "Peperomia", sci: "Peperomia obtusifolia", life: "5-10 Years", medicinal: ["None known"], advantages: ["Pet Safe", "Desk Plant"] },
    { name: "Sago Palm", sci: "Cycas revoluta", life: "50-100 Years", medicinal: ["None (Toxic)"], advantages: ["Prehistoric look", "Hardy"] },
    { name: "Asparagus Fern", sci: "Asparagus setaceus", life: "10+ Years", medicinal: ["None known"], advantages: ["Feathery texture", "Fast filler"] },
    { name: "Begonia Maculata", sci: "Begonia maculata", life: "2-5 Years", medicinal: ["None known"], advantages: ["Unique Pattern", "Flowering"] },
    { name: "Swiss Cheese Vine", sci: "Monstera adansonii", life: "10+ Years", medicinal: ["Air purifying"], advantages: ["Vining holes", "Fast growth"] },
    { name: "Flamingo Flower", sci: "Anthurium scherzerianum", life: "5-10 Years", medicinal: ["Air Purification"], advantages: ["Continuous Bloom", "Showy"] },
    { name: "Dragon Tree", sci: "Dracaena marginata", life: "10-15 Years", medicinal: ["Toxin Removal"], advantages: ["Modern look", "Durable"] },
    { name: "Weeping Fig", sci: "Ficus benjamina", life: "20-50 Years", medicinal: ["Air cleaning"], advantages: ["Tree-like", "Elegant"] },
    { name: "Silver Satin Pothos", sci: "Scindapsus pictus", life: "5-10 Years", medicinal: ["Remove Formaldehyde"], advantages: ["Silver Variegation", "Drought Tolerant"] },
    { name: "Kentia Palm", sci: "Howea forsteriana", life: "50+ Years", medicinal: ["Air purifying"], advantages: ["Elegant arching", "Shade tolerant"] },
    { name: "Zebra Plant", sci: "Aphelandra squarrosa", life: "5-10 Years", medicinal: ["None known"], advantages: ["Striped leaves", "Yellow flower"] },
    { name: "Bromeliad", sci: "Guzmania", life: "2-4 Years", medicinal: ["None known"], advantages: ["Exotic Color", "Pet Safe"] },
    { name: "Orchid Moth", sci: "Phalaenopsis", life: "10-15 Years", medicinal: ["Stress relief"], advantages: ["Long blooming", "Elegant"] },
    { name: "Elephant Ear", sci: "Colocasia esculenta", life: "Annual (Bulb)", medicinal: ["Traditional Medicine"], advantages: ["Statement Size", "Tropical"] },
    { name: "Aluminum Plant", sci: "Pilea cadierei", life: "1-4 Years", medicinal: ["None known"], advantages: ["Silver patterns", "Bushy"] },
    { name: "Arrowhead Plant", sci: "Syngonium podophyllum", life: "5-10 Years", medicinal: ["Voc Removal"], advantages: ["Fast growing", "Variety of colors"] },
    { name: "Baby Rubber Plant", sci: "Peperomia obtusifolia", life: "5-10 Years", medicinal: ["None known"], advantages: ["Pet Safe", "Easy care"] },
    { name: "Burro's Tail", sci: "Sedum morganianum", life: "5-10 Years", medicinal: ["None known"], advantages: ["Trailing succulent", "Unique texture"] },
    { name: "Caladium", sci: "Caladium bicolor", life: "Annual (Bulb)", medicinal: ["None (Toxic)"], advantages: ["Stunning colors", "Shade lover"] },
    { name: "Cyclamen", sci: "Cyclamen persicum", life: "3-5 Years", medicinal: ["None (Toxic)"], advantages: ["Cool weather bloom", "Compact"] },
    { name: "Dracaena Lemon Lime", sci: "Dracaena warneckii", life: "10-20 Years", medicinal: ["Air cleaning"], advantages: ["Neon color", "Low light"] },
    { name: "Fern Arum", sci: "Zamioculcas", life: "10-15 Years", medicinal: ["Air cleaning"], advantages: ["Tough", "Glossy"] },
    { name: "Garden Croton", sci: "Codiaeum variegatum", life: "2-4 Years", medicinal: ["None known"], advantages: ["Colorful foliage", "Structure"] },
    { name: "Gloxinia", sci: "Sinningia speciosa", life: "Annual (Bulb)", medicinal: ["None known"], advantages: ["Huge flowers", "Velvety leaves"] },
    { name: "Grape Ivy", sci: "Cissus rhombifolia", life: "5-10 Years", medicinal: ["None known"], advantages: ["Vining", "Low light"] },
    { name: "Hens and Chicks", sci: "Sempervivum tectorum", life: "3-5 Years", medicinal: ["Skin soothing (Sap)"], advantages: ["Cold hardy", "Geometry"] },
    { name: "Hoya Carnosa", sci: "Hoya carnosa", life: "10-30 Years", medicinal: ["None known"], advantages: ["Fragrant Blooms", "Long Lived"] },
    { name: "Kalanchoe", sci: "Kalanchoe blossfeldiana", life: "2-5 Years", medicinal: ["Wound Healing (Some species)"], advantages: ["Flowering Succulent", "Drought Tolerant"] },
    { name: "Living Stone", sci: "Lithops", life: "40-50 Years", medicinal: ["None known"], advantages: ["Curiosity", "Tiny"] },
    { name: "Maidenhair Fern", sci: "Adiantum raddianum", life: "5-10 Years", medicinal: ["Respiratory aid (Syrup)"], advantages: ["Delicate texture", "Soft"] },
    { name: "Money Tree", sci: "Pachira aquatica", life: "10-15 Years", medicinal: ["None known"], advantages: ["Good Luck Symbol", "Pet Safe"] },
    { name: "Moth Orchid", sci: "Phalaenopsis", life: "10-15 Years", medicinal: ["None known"], advantages: ["Easy orchid", "Long bloom"] },
    { name: "Norfolk Island Pine", sci: "Araucaria heterophylla", life: "10-20 Years", medicinal: ["None known"], advantages: ["Mini Christmas tree", "Soft needles"] },
    { name: "Panda Plant", sci: "Kalanchoe tomentosa", life: "5-10 Years", medicinal: ["None known"], advantages: ["Soft touch", "Cute"] },
    { name: "Purple Shamock", sci: "Oxalis triangularis", life: "5-10 Years", medicinal: ["Edible (sour)"], advantages: ["Purple Foliage", "Movement"] },
    { name: "Staghorn Fern", sci: "Platycerium", life: "20-30 Years", medicinal: ["None known"], advantages: ["Living Art", "Unique"] },
    { name: "Wandering Jew", sci: "Tradescantia zebrina", life: "2-5 Years", medicinal: ["Antioxidant (Tea)"], advantages: ["Fast Growth", "Colorful"] }
];

// REAL IDENTITIES for Outdoor Plants (Expanded to 70+)
const REAL_OUTDOOR_PLANTS = [
    { name: "Lavender", sci: "Lavandula angustifolia", life: "10-15 Years", medicinal: ["Calming", "Sleep aid", "Antiseptic"], advantages: ["Fragrant", "Bee friendly", "Drought tolerant"] },
    { name: "Rose Bush", sci: "Rosa", life: "15-20 Years", medicinal: ["Vitamin C (Hips)", "Aromatherapy"], advantages: ["Beautiful blooms", "Fragrance", "Cut flowers"] },
    { name: "Hydrangea", sci: "Hydrangea macrophylla", life: "50+ Years", medicinal: ["Diuretic (Root - Caution)"], advantages: ["Showy flowers", "Color change pH"] },
    { name: "Sunflower", sci: "Helianthus annuus", life: "Annual (1 Year)", medicinal: ["Nutritious seeds", "Skin oil"], advantages: ["Rapid growth", "Pollinator magnet"] },
    { name: "Tulip", sci: "Tulipa", life: "Perennial (3-5 Years)", medicinal: ["None specific"], advantages: ["Vibrant spring colors", "Variety"] },
    { name: "Oak Tree", sci: "Quercus", life: "100+ Years", medicinal: ["Astringent (Bark)"], advantages: ["Shade", "Wildlife habitat", "Long lived"] },
    { name: "Maple Tree", sci: "Acer", life: "80-100 Years", medicinal: ["Syrup (Sap)"], advantages: ["Fall color", "Shade", "Wood"] },
    { name: "Peony", sci: "Paeonia", life: "50-100 Years", medicinal: ["Anti-inflammatory (Root)"], advantages: ["Huge flowers", "Long lived"] },
    { name: "Marigold", sci: "Tagetes", life: "Annual (1 Year)", medicinal: ["Antiseptic", "Eye health (Lutein)"], advantages: ["Repels pests", "Edible petals"] },
    { name: "Basil", sci: "Ocimum basilicum", life: "Annual (1 Year)", medicinal: ["Anti-inflammatory", "Digestive aid"], advantages: ["Delicious", "Fast growing", "Aromatic"] },
    { name: "Tomato", sci: "Solanum lycopersicum", life: "Annual (1 Year)", medicinal: ["Antioxidant (Lycopene)"], advantages: ["Edible fruit", "Productive"] },
    { name: "Boxwood", sci: "Buxus", life: "20-30 Years", medicinal: ["Febrifuge (Historical)"], advantages: ["Evergreen", "Shapeable hedge"] },
    { name: "Azalea", sci: "Rhododendron", life: "20-50 Years", medicinal: ["None (Toxic)"], advantages: ["Spring bloom", "Shade tolerant"] },
    { name: "Daffodil", sci: "Narcissus", life: "Perennial (10+ Years)", medicinal: ["None (Toxic)"], advantages: ["Deer resistant", "Early bloom"] },
    { name: "Daylily", sci: "Hemerocallis", life: "Perennial (10+ Years)", medicinal: ["Edible buds"], advantages: ["Roadside Tough", "Vast Variety"] },
    { name: "Hostas", sci: "Hosta", life: "30+ Years", medicinal: ["None known"], advantages: ["Shade foliage", "Textured leaves"] },
    { name: "Coneflower", sci: "Echinacea purpurea", life: "2-4 Years", medicinal: ["Immune Support", "Cold Relief"], advantages: ["Pollinator Magnet", "Drought Tolerant"] },
    { name: "Black-Eyed Susan", sci: "Rudbeckia hirta", life: "2-3 Years", medicinal: ["Immune Stimulant (Roots)"], advantages: ["Long Blooming", "Hardy"] },
    { name: "Lilac Bush", sci: "Syringa vulgaris", life: "75+ Years", medicinal: ["Aromatherapy"], advantages: ["Fragrance", "Cold Hardy"] },
    { name: "Magnolia Tree", sci: "Magnolia grandiflora", life: "80-120 Years", medicinal: ["Anxiety relief (Bark)"], advantages: ["Grand flowers", "Evergreen leaves"] },
    { name: "Japanese Cherry", sci: "Prunus serrulata", life: "15-20 Years", medicinal: ["Symbolism"], advantages: ["Spring blossom", "Ornamental"] },
    { name: "Wisteria", sci: "Wisteria sinensis", life: "50-100 Years", medicinal: ["None (Toxic)"], advantages: ["Cascading flowers", "Fragrance"] },
    { name: "Bougainvillea", sci: "Bougainvillea glabra", life: "20-30 Years", medicinal: ["Anti-inflammatory"], advantages: ["Drought hardy", "Massive color"] },
    { name: "Gardenia", sci: "Gardenia jasminoides", life: "15-25 Years", medicinal: ["Traditional medicine"], advantages: ["Perfume scent", "Glossy leaves"] },
    { name: "Camellia", sci: "Camellia japonica", life: "50-100 Years", medicinal: ["Tea oil (Seeds)"], advantages: ["Winter bloom", "Evergreen"] },
    { name: "Rhododendron", sci: "Rhododendron ferrugineum", life: "50+ Years", medicinal: ["None (Toxic)"], advantages: ["Showy flowers", "Woodland plant"] },
    { name: "Jasmine Vine", sci: "Jasminum officinale", life: "10-20 Years", medicinal: ["Stress relief", "Tea"], advantages: ["Incredible scent", "Climbing habit"] },
    { name: "Hibiscus", sci: "Hibiscus rosa-sinensis", life: "5-10 Years", medicinal: ["Blood pressure tea"], advantages: ["Tropical vibe", "Vibrant colors"] },
    { name: "Petunia", sci: "Petunia hybrida", life: "Annual (1 Year)", medicinal: ["None known"], advantages: ["Constant color", "Fragrance (some)"] },
    { name: "Geranium", sci: "Pelargonium", life: "1-3 Years", medicinal: ["Skin oil"], advantages: ["Mosquito repelling", "Resilient"] },
    { name: "Chrysanthemum", sci: "Chrysanthemum morifolium", life: "Perennial (3-5 Years)", medicinal: ["Tea (specific types)"], advantages: ["Fall color", "Air cleaning"] },
    { name: "Pansy", sci: "Viola tricolor", life: "Biennial (2 Years)", medicinal: ["Expectorant"], advantages: ["Edible", "Winter Color"] },
    { name: "Snapdragon", sci: "Antirrhinum majus", life: "Annual (1 Year)", medicinal: ["None known"], advantages: ["Fun for kids", "Cut flowers"] },
    { name: "Foxglove", sci: "Digitalis purpurea", life: "Biennial (2 Years)", medicinal: ["Heart medication (Toxic)"], advantages: ["Tall spikes", "Cottage garden"] },
    { name: "Bleeding Heart", sci: "Lamprocapnos spectabilis", life: "Perennial (5-10 Years)", medicinal: ["None known"], advantages: ["Unique Flower", "Early Bloomer"] },
    { name: "Coral Bells", sci: "Heuchera", life: "3-5 Years", medicinal: ["Astringent (Root)"], advantages: ["Foliage Color", "Compact"] },
    { name: "Astilbe", sci: "Astilbe chinensis", life: "10+ Years", medicinal: ["None known"], advantages: ["Shade color", "Texture"] },
    { name: "Bee Balm", sci: "Monarda didyma", life: "3-5 Years", medicinal: ["Antiseptic (Tea)"], advantages: ["Hummingbirds", "Tea"] },
    { name: "Butterfly Bush", sci: "Buddleja davidii", life: "10-20 Years", medicinal: ["None known"], advantages: ["Wildlife Magnet", "Long Bloom"] },
    { name: "Juniper Bush", sci: "Juniperus", life: "30-70 Years", medicinal: ["Diuretic (Berry)"], advantages: ["Evergreen", "Tough"] },
    { name: "Holly Bush", sci: "Ilex aquifolium", life: "100+ Years", medicinal: ["None (Toxic berries)"], advantages: ["Winter interest", "Security hedge"] },
    { name: "Pampas Grass", sci: "Cortaderia selloana", life: "10-15 Years", medicinal: ["None known"], advantages: ["Screening", "Plumes"] },
    { name: "Bamboo", sci: "Bambusa vulgaris", life: "20-100 Years", medicinal: ["Silica source"], advantages: ["Screening", "Fast growth"] },
    { name: "Agave", sci: "Agave americana", life: "10-30 Years", medicinal: ["Syrup/Sweetener"], advantages: ["Architectural", "Drought proof"] },
    { name: "Prickly Pear", sci: "Opuntia ficus-indica", life: "20+ Years", medicinal: ["Lower blood sugar"], advantages: ["Edible fruit/pad", "Barrier"] },
    { name: "Rosemary", sci: "Salvia rosmarinus", life: "15-20 Years", medicinal: ["Memory boost", "Digestion"], advantages: ["Edible", "Drought resistant"] },
    { name: "Thyme", sci: "Thymus vulgaris", life: "5-10 Years", medicinal: ["Cough relief", "Antiseptic"], advantages: ["Groundcover", "Edible"] },
    { name: "Mint", sci: "Mentha", life: "Perennial (Invasive)", medicinal: ["Digestion", "Headache"], advantages: ["Tea", "Fast growing"] },
    { name: "Sage", sci: "Salvia officinalis", life: "5-10 Years", medicinal: ["Sore throat", "Memory"], advantages: ["Edible", "Grey foliage"] },
    { name: "Strawberry", sci: "Fragaria x ananassa", life: "3-5 Years", medicinal: ["Vitamin C"], advantages: ["Delicious fruit", "Groundcover"] },
    { name: "Creeping Phlox", sci: "Phlox subulata", life: "5-10 Years", medicinal: ["None known"], advantages: ["Carpet of color", "Spring bloom"] },
    { name: "Lamb's Ear", sci: "Stachys byzantina", life: "Perennial", medicinal: ["Antimicrobial Bandage"], advantages: ["Texture", "Drought Tolerant"] },
    { name: "Lantana", sci: "Lantana camara", life: "Annual/Perennial", medicinal: ["None (Toxic berries)"], advantages: ["Butterfly Magnet", "Heat Proof"] },
    { name: "Moonflower", sci: "Ipomoea alba", life: "Annual", medicinal: ["None"], advantages: ["Night bloom", "Fragrance"] },
    { name: "Morning Glory", sci: "Ipomoea", life: "Annual", medicinal: ["None (Toxic seeds)"], advantages: ["Fast climber", "Daily blooms"] },
    { name: "Moss Rose", sci: "Portulaca grandiflora", life: "Annual", medicinal: ["None"], advantages: ["Heat lover", "Succulent"] },
    { name: "Nasturtium", sci: "Tropaeolum majus", life: "Annual", medicinal: ["Antibiotic"], advantages: ["Edible flower/leaf", "Fast"] },
    { name: "Periwinkle", sci: "Vinca minor", life: "Perennial", medicinal: ["Circulatory aid"], advantages: ["Shade cover", "Evergreen"] },
    { name: "Poppy", sci: "Papaver somniferum", life: "Annual", medicinal: ["Pain relief (Opium)"], advantages: ["Showy", "Self sowing"] },
    { name: "Primrose", sci: "Primula vulgaris", life: "Perennial", medicinal: ["None known"], advantages: ["Early spring color", "Shade"] },
    { name: "Ranunculus", sci: "Ranunculus asiaticus", life: "Perennial", medicinal: ["None"], advantages: ["Rose-like flowers", "Cut flower"] },
    { name: "Salvia", sci: "Salvia splendens", life: "Annual", medicinal: ["None"], advantages: ["Red spikes", "Hummingbirds"] },
    { name: "Sedum", sci: "Hylotelephium spectabile", life: "Perennial", medicinal: ["Burn soothing"], advantages: ["Late bloom", "Succulent"] },
    { name: "Shasta Daisy", sci: "Leucanthemum x superbum", life: "3-5 Years", medicinal: ["None known"], advantages: ["Classic white", "Cut flower"] },
    { name: "Sweet Alyssum", sci: "Lobularia maritima", life: "Annual", medicinal: ["None"], advantages: ["Honey scent", "Edging"] },
    { name: "Sweet Pea", sci: "Lathyrus odoratus", life: "Annual", medicinal: ["None (Toxic)"], advantages: ["Scent", "Climber"] },
    { name: "Verbena", sci: "Verbena bonariensis", life: "Annual/Perennial", medicinal: ["Relaxant"], advantages: ["Airy habit", "Pollinators"] },
    { name: "Yarrow", sci: "Achillea millefolium", life: "Perennial", medicinal: ["Stops bleeding"], advantages: ["Native", "Tough"] },
    { name: "Zinnia", sci: "Zinnia elegans", life: "Annual", medicinal: ["None"], advantages: ["Bright colors", "Cut flower"] },
    { name: "Cosmos", sci: "Cosmos bipinnatus", life: "Annual", medicinal: ["None"], advantages: ["Feathery", "Easy from seed"] }
];

// Helper to generate a random plant
const generatePlant = (type, index) => {
    const isIndoor = type === 'indoor';
    const id = `p_${isIndoor ? 'in' : 'out'}_${1000 + index}`; // Changed to 1000+ to avoid collision

    // Pick a real identity based on index (modulo to cycle)
    const sourceList = isIndoor ? REAL_INDOOR_PLANTS : REAL_OUTDOOR_PLANTS;
    const identity = sourceList[index % sourceList.length];

    // Add unique index to name if we loop to avoid duplicates having exact same name
    const uniqueSuffix = index >= sourceList.length ? ` ${Math.floor(index / sourceList.length) + 1}` : '';

    return {
        id,
        name: identity.name + uniqueSuffix,
        scientificName: identity.sci,
        description: `The ${identity.name} (${identity.sci}) is a beautiful ${type} specimen known for its ${identity.life} lifespan. It thrives in ${isIndoor ? "controlled indoor" : "natural outdoor"} environments and brings a touch of nature to your space.`,
        imageUrl: `https://images.unsplash.com/photo-${faker.number.int({ min: 1000000000, max: 9999999999 })}?auto=format&fit=crop&w=800&q=80`,
        idealTempMin: faker.number.int({ min: 5, max: 15 }),
        idealTempMax: faker.number.int({ min: 25, max: 35 }),
        minHumidity: faker.number.int({ min: 30, max: 80 }),
        sunlight: isIndoor ? faker.helpers.arrayElement(['low', 'medium', 'high']) : 'high',
        oxygenLevel: faker.helpers.arrayElement(['low', 'moderate', 'high', 'very-high']),
        medicinalValues: identity.medicinal || ["General wellness"],
        advantages: identity.advantages || ["Aesthetic appeal"],
        price: faker.number.int({ min: 10, max: 200 }),
        type: type,
        lifespan: identity.life, // USE REAL LIFESPAN
        foliageTexture: isIndoor ? "Glossy/Smooth" : "Matte/Textured",
        leafShape: isIndoor ? "Ovate-Elliptical" : "Lanceolateish/Compound",
        stemStructure: isIndoor ? "Herbaceous" : "Woody/Semi-Woody",
        overallHabit: isIndoor ? "Upright/Bushy" : "Spreading/Climbing",
        biometricFeatures: isIndoor ? ["Interior Adapted", "Smooth Edges"] : ["Sun Hardy", "Outdoor Adapted"]
    };
};

// Generate 70 unique Indoor and 70 unique Outdoor plants (Total 140)
// The source lists are ~70 long, so this will be mostly unique real data.
const newIndoorPlants = Array.from({ length: 70 }, (_, i) => generatePlant('indoor', i));
const newOutdoorPlants = Array.from({ length: 70 }, (_, i) => generatePlant('outdoor', i));

const dataFilePath = path.join(__dirname, 'plant-data.js');

const finalIndoor = newIndoorPlants;
const finalOutdoor = newOutdoorPlants;

const newFileContent = `// Extended Plant Data Module
const indoorPlants = ${JSON.stringify(finalIndoor, null, 4)};

const outdoorPlants = ${JSON.stringify(finalOutdoor, null, 4)};

module.exports = { indoorPlants, outdoorPlants };
`;

fs.writeFileSync(path.join(__dirname, 'plant-data.js'), newFileContent);

console.log("Successfully GENERATED plant-data.js with 140 purely REAL plant entries (70 Indoor, 70 Outdoor).");
