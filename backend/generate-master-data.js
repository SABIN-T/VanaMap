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
    { name: "Pansy", sci: "Viola tricolor", type: "outdoor", life: "2 Years", medicinal: ["Expectorant"], advantages: ["Winter/Spring color", "Edible flowers"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 10, light: "Sun / Part Shade", ac: "N/A (Outdoor)" },
    // --- NEW SEED BANK: 50 INDIAN INDOOR PLANTS ---
    { name: "Tulsi (Holy Basil)", sci: "Ocimum tenuiflorum", type: "indoor", life: "1-3 Years", medicinal: ["Immunity booster", "Stress relief"], advantages: ["Sacred plant", "Medicinal"], bloom: "Verticillaster", vein: "Reticulate", inflo: "Raceme", oxygen: 40, light: "Bright Spot (1000+ Lux)", ac: "Low tolerance" },
    { name: "Curry Leaf (Potted)", sci: "Murraya koenigii", type: "indoor", life: "10-50 Years", medicinal: ["Digestion aid", "Hair health"], advantages: ["Aromatic cooking", "Pest repellent"], bloom: "Corymb", vein: "Pinnate", inflo: "Cyme", oxygen: 35, light: "Sunny Window (2000 Lux)", ac: "Low tolerance" },
    { name: "Bamboo Palm", sci: "Chamaedorea seifrizii", type: "indoor", life: "10-15 Years", medicinal: ["Air toxin removal"], advantages: ["Pet friendly", "Tropical vibe"], bloom: "Panicle", vein: "Parallel", inflo: "Spadix", oxygen: 50, light: "Indirect (500-1500 Lux)", ac: "High tolerance" },
    { name: "Lady Palm", sci: "Rhapis excelsa", type: "indoor", life: "20+ Years", medicinal: ["None"], advantages: ["Elegant fans", "Slow growing"], bloom: "Panicle", vein: "Parallel", inflo: "Spadix", oxygen: 45, light: "Low-Medium (300-1000 Lux)", ac: "High tolerance" },
    { name: "Aglaonema (Chinese Evergreen)", sci: "Aglaonema commutatum", type: "indoor", life: "10+ Years", medicinal: ["Air purification"], advantages: ["Colorful leaves", "Hardy"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 30, light: "Low (200-800 Lux)", ac: "High tolerance" },
    { name: "Arrowhead Plant", sci: "Syngonium podophyllum", type: "indoor", life: "5-10 Years", medicinal: ["Air cleaning"], advantages: ["Fast grower", "Changing leaf shape"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 28, light: "Medium (500-1500 Lux)", ac: "Medium tolerance" },
    { name: "Dragon Tree", sci: "Dracaena marginata", type: "indoor", life: "15-20 Years", medicinal: ["Formaldehyde removal"], advantages: ["Modern look", "Slim profile"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 32, light: "Medium-Bright (800-2000 Lux)", ac: "High tolerance" },
    { name: "Corn Plant", sci: "Dracaena fragrans", type: "indoor", life: "20-50 Years", medicinal: ["Toxin removal"], advantages: ["Thick trunk", "Fragrant flowers (rare)"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 35, light: "Low-Indirect", ac: "Medium tolerance" },
    { name: "Song of India", sci: "Dracaena reflexa", type: "indoor", life: "20+ Years", medicinal: ["Air purifying"], advantages: ["Ornamental", "Flexible stems"], bloom: "Cluster", vein: "Parallel", inflo: "Raceme", oxygen: 30, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Lucky Bamboo", sci: "Dracaena sanderiana", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Grows in water", "Feng Shui luck"], bloom: "None", vein: "Parallel", inflo: "None", oxygen: 15, light: "Low (100-1000 Lux)", ac: "High tolerance" },
    { name: "Croton", sci: "Codiaeum variegatum", type: "indoor", life: "10-15 Years", medicinal: ["Purgative (Toxic usage)"], advantages: ["Vibrant colors", "Bushy"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 35, light: "High (Bright Window)", ac: "Low tolerance" },
    { name: "Coleus", sci: "Plectranthus scutellarioides", type: "indoor", life: "1 Year", medicinal: ["Ayurvedic uses"], advantages: ["Leaf patterns", "Fast growth"], bloom: "Raceme", vein: "Reticulate", inflo: "Verticillaster", oxygen: 20, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Weeping Fig", sci: "Ficus benjamina", type: "indoor", life: "20-50 Years", medicinal: ["Antimicrobial"], advantages: ["Tree-like", "Braided trunks"], bloom: "Syconium", vein: "Pinnate", inflo: "Syconium", oxygen: 55, light: "Bright Indirect", ac: "Low (Drops leaves)" },
    { name: "Satin Pothos", sci: "Scindapsus pictus", type: "indoor", life: "10+ Years", medicinal: ["Air cleaning"], advantages: ["Silver spots", "Velvety"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 22, light: "Low-Medium", ac: "High tolerance" },
    { name: "Philodendron Birkin", sci: "Philodendron 'Birkin'", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["White pinstripes", "Compact"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 25, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Philodendron Xanadu", sci: "Thaumatophyllum xanadu", type: "indoor", life: "15+ Years", medicinal: ["Air purifying"], advantages: ["Bushy habit", "Lobed leaves"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 40, light: "Medium-Shade", ac: "Medium tolerance" },
    { name: "Pink Princess", sci: "Philodendron erubescens", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Rare pink variegation", "Collector item"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 28, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Monstera Adansonii", sci: "Monstera adansonii", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Swiss cheese holes", "Vining"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 30, light: "Medium-Bright", ac: "High tolerance" },
    { name: "Mini Monstera", sci: "Rhaphidophora tetrasperma", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Fast climbing", "Small space split-leaf"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 28, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Begonia Rex", sci: "Begonia rex-cultorum", type: "indoor", life: "2-5 Years", medicinal: ["None"], advantages: ["Metallic foliage", "Dramatic colors"], bloom: "Cyme", vein: "Palmate", inflo: "Cyme", oxygen: 18, light: "Medium-Shade", ac: "Low (Needs humidity)" },
    { name: "Polka Dot Begonia", sci: "Begonia maculata", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Silver dots", "Red undersides"], bloom: "Cyme", vein: "Palmate", inflo: "Cyme", oxygen: 20, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Nerve Plant", sci: "Fittonia albivenis", type: "indoor", life: "2-3 Years", medicinal: ["None"], advantages: ["Neon veins", "Terrarium suitability"], bloom: "Spike", vein: "Reticulate", inflo: "Spike", oxygen: 12, light: "Low-Medium", ac: "Low (Needs humidity)" },
    { name: "Polka Dot Plant", sci: "Hypoestes phyllostachya", type: "indoor", life: "1-2 Years", medicinal: ["None"], advantages: ["Splashed patterns", "Compact"], bloom: "Spike", vein: "Reticulate", inflo: "Cyme", oxygen: 15, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Baby Rubber Plant", sci: "Peperomia obtusifolia", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Succulent-like", "Pet friendly"], bloom: "Spike", vein: "Pinnate", inflo: "Spike", oxygen: 20, light: "Medium Light", ac: "High tolerance" },
    { name: "Watermelon Peperomia", sci: "Peperomia argyreia", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Leaves look like watermelon", "Compact"], bloom: "Spike", vein: "Peltate", inflo: "Spike", oxygen: 18, light: "Medium Light", ac: "Medium tolerance" },
    { name: "String of Turtles", sci: "Peperomia prostrata", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Turtle shell patterns", "Tiny trailing"], bloom: "Spike", vein: "Reticulate", inflo: "Spike", oxygen: 10, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "String of Hearts", sci: "Ceropegia woodii", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Heart leaves", "Trailing"], bloom: "Umbel", vein: "Reticulate", inflo: "Umbel", oxygen: 12, light: "Bright Light", ac: "High tolerance" },
    { name: "Wandering Jew", sci: "Tradescantia zebrina", type: "indoor", life: "Perennial", medicinal: ["Antioxidant (tea)"], advantages: ["Purple-Silver leaves", "Fast growing"], bloom: "Cyme", vein: "Parallel", inflo: "Cyme", oxygen: 25, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Purple Heart", sci: "Tradescantia pallida", type: "indoor", life: "Perennial", medicinal: ["Air cleaning"], advantages: ["Deep purple foliage", "Very hardy"], bloom: "Cyme", vein: "Parallel", inflo: "Cyme", oxygen: 22, light: "High Light", ac: "High tolerance" },
    { name: "Cast Iron Plant", sci: "Aspidistra elatior", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Investructible", "Deep shade"], bloom: "Rare basal", vein: "Parallel", inflo: "Solitary", oxygen: 30, light: "Deep Shade", ac: "High tolerance" },
    { name: "Asparagus Fern", sci: "Asparagus setaceus", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Lacy texture", "Airy feel"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 25, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Foxtail Fern", sci: "Asparagus densiflorus", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Plume-like stems", "Hardy"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 28, light: "Bright Light", ac: "High tolerance" },
    { name: "Parlor Palm", sci: "Chamaedorea elegans", type: "indoor", life: "10-15 Years", medicinal: ["Air purification"], advantages: ["Pet friendly", "Compact palm"], bloom: "Panicle", vein: "Parallel", inflo: "Spadix", oxygen: 30, light: "Low Light", ac: "High tolerance" },
    { name: "Fishtail Palm", sci: "Caryota mitis", type: "indoor", life: "20+ Years", medicinal: ["None"], advantages: ["Unique leaf shape", "Tall"], bloom: "Panicle", vein: "Parallel", inflo: "Spadix", oxygen: 55, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Ponytail Palm", sci: "Beaucarnea recurvata", type: "indoor", life: "40+ Years", medicinal: ["None"], advantages: ["Bulbous trunk", "Drought tolerant"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 35, light: "Bright Sun", ac: "High tolerance" },
    { name: "Sago Palm", sci: "Cycas revoluta", type: "indoor", life: "50+ Years", medicinal: ["Toxic (Do not use)"], advantages: ["Prehistoric look", "Symmetrical"], bloom: "Cone", vein: "Parallel", inflo: "Cone", oxygen: 40, light: "Bright Light", ac: "High tolerance" },
    { name: "Yucca Cane", sci: "Yucca elephantipes", type: "indoor", life: "20+ Years", medicinal: ["None"], advantages: ["Architectural", "Tough"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 45, light: "Full Sun", ac: "High tolerance" },
    { name: "Zebra Plant", sci: "Aphelandra squarrosa", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Striped leaves", "Yellow flowers"], bloom: "Spike", vein: "Pinnate", inflo: "Spike", oxygen: 25, light: "Bright Indirect", ac: "Low (Humidity needed)" },
    { name: "Calathea Roseopicta", sci: "Goeppertia roseopicta", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Painted foliage", "Sleep movement"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 22, light: "Medium (No Direct)", ac: "Low tolerance" },
    { name: "Rattlesnake Plant", sci: "Goeppertia insignis", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Wavy leaves", "Patterned"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 20, light: "Medium Light", ac: "Low tolerance" },
    { name: "Stromanthe Triostar", sci: "Stromanthe sanguinea", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Pink/Green/White", "Dramatic"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 20, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Money Tree", sci: "Pachira aquatica", type: "indoor", life: "10+ Years", medicinal: ["Edible nuts (rarely indoors)"], advantages: ["Braided trunk", "Good luck"], bloom: "Solitary", vein: "Palmate", inflo: "Solitary", oxygen: 40, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Elephant Ear", sci: "Colocasia esculenta", type: "indoor", life: "Perennial", medicinal: ["Edible tuber"], advantages: ["Giant leaves", "Tropical"], bloom: "Spadix", vein: "Pinnate", inflo: "Spadix", oxygen: 60, light: "Bright Light", ac: "High tolerance" },
    { name: "Sweetheart Hoya", sci: "Hoya kerrii", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Heart shaped leaf", "Succulent"], bloom: "Umbel", vein: "None", inflo: "Umbel", oxygen: 15, light: "Bright Light", ac: "High tolerance" },
    { name: "Wax Plant", sci: "Hoya carnosa", type: "indoor", life: "10-20 Years", medicinal: ["None"], advantages: ["Fragrant porcelain flowers", "Vining"], bloom: "Umbel", vein: "Pinnate", inflo: "Umbel", oxygen: 20, light: "Bright Indirect", ac: "High tolerance" },
    { name: "African Violet", sci: "Saintpaulia ionantha", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Continuous blooming", "Fuzzy leaves"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 10, light: "East Window", ac: "Medium tolerance" },
    { name: "Kalanchoe", sci: "Kalanchoe blossfeldiana", type: "indoor", life: "3-7 Years", medicinal: ["None"], advantages: ["Bright flowers", "Succulent"], bloom: "Corymb", vein: "None", inflo: "Cyme", oxygen: 18, light: "Sunny Window", ac: "High tolerance" },
    { name: "Crown of Thorns", sci: "Euphorbia milii", type: "indoor", life: "10+ Years", medicinal: ["None (Sap toxic)"], advantages: ["Blooms year round", "Tough"], bloom: "Cyathium", vein: "Pinnate", inflo: "Cyme", oxygen: 20, light: "Direct Sun", ac: "High tolerance" },
    { name: "Pencil Cactus", sci: "Euphorbia tirucalli", type: "indoor", life: "20+ Years", medicinal: ["Traditional fracture healing"], advantages: ["Unique stick shape", "Fast growing"], bloom: "Cyathium", vein: "None", inflo: "Cluster", oxygen: 25, light: "Direct Sun", ac: "High tolerance" },

    // --- NEW SEED BANK: 50 INDIAN OUTDOOR PLANTS ---
    { name: "Neem", sci: "Azadirachta indica", type: "outdoor", life: "100+ Years", medicinal: ["Antiseptic", "Skin cure"], advantages: ["Miracle tree", "Air cooling"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 150, light: "Full Sun", ac: "N/A" },
    { name: "Ashoka Tree", sci: "Saraca asoca", type: "outdoor", life: "50+ Years", medicinal: ["Gynaecological health"], advantages: ["Sacred tree", "Beautiful flowers"], bloom: "Corymb", vein: "Pinnate", inflo: "Corymb", oxygen: 100, light: "Full Sun / Part Shade", ac: "N/A" },
    { name: "Gulmohar (Flame of Forest)", sci: "Delonix regia", type: "outdoor", life: "40-60 Years", medicinal: ["Gum used for pain"], advantages: ["Stunning red canopy", "Shade"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 180, light: "Full Sun", ac: "N/A" },
    { name: "Peepal (Bodhi Tree)", sci: "Ficus religiosa", type: "outdoor", life: "1000+ Years", medicinal: ["Asthma", "Diabetes trade"], advantages: ["Produces O2 24/7 (myth/high output)", "Sacred"], bloom: "Syconium", vein: "Reticulate", inflo: "Syconium", oxygen: 200, light: "Full Sun", ac: "N/A" },
    { name: "Banyan", sci: "Ficus benghalensis", type: "outdoor", life: "200+ Years", medicinal: ["Hair tonic", "Teeth care"], advantages: ["National Tree of India", "Huge shade"], bloom: "Syconium", vein: "Reticulate", inflo: "Syconium", oxygen: 220, light: "Full Sun", ac: "N/A" },
    { name: "Mango", sci: "Mangifera indica", type: "outdoor", life: "100+ Years", medicinal: ["Leaves regulate insulin"], advantages: ["King of Fruits", "Dense shade"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 140, light: "Full Sun", ac: "N/A" },
    { name: "Guava", sci: "Psidium guajava", type: "outdoor", life: "30-40 Years", medicinal: ["Stomach health"], advantages: ["Vitamin C rich fruit", "Hardy"], bloom: "Solitary", vein: "Pinnate", inflo: "Cyme", oxygen: 80, light: "Full Sun", ac: "N/A" },
    { name: "Pomegranate", sci: "Punica granatum", type: "outdoor", life: "20-30 Years", medicinal: ["Heart health", "Antioxidant"], advantages: ["Beautiful flowers", "Healthy fruit"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 60, light: "Full Sun", ac: "N/A" },
    { name: "Lemon", sci: "Citrus limon", type: "outdoor", life: "50+ Years", medicinal: ["Vitamin C", "Digestion"], advantages: ["Daily kitchen use", "Fragrant leaves"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 50, light: "Full Sun", ac: "N/A" },
    { name: "Papaya", sci: "Carica papaya", type: "outdoor", life: "3-4 Years", medicinal: ["Leaf juice for Dengue"], advantages: ["Fast fruit", "Digestive enzyme"], bloom: "Panicle", vein: "Palmate", inflo: "Panicle", oxygen: 60, light: "Full Sun", ac: "N/A" },
    { name: "Banana", sci: "Musa acominata", type: "outdoor", life: "1-2 Years (Regrows)", medicinal: ["Stem juice for kidney stones"], advantages: ["Fruit", "Leaves as plates"], bloom: "Spadix", vein: "Parallel", inflo: "Spadix", oxygen: 100, light: "Full Sun", ac: "N/A" },
    { name: "Coconut", sci: "Cocos nucifera", type: "outdoor", life: "60-80 Years", medicinal: ["Water is electrolyte rich"], advantages: ["Kalpavriksha (Gives everything)", "Coastal"], bloom: "Panicle", vein: "Parallel", inflo: "Spadix", oxygen: 120, light: "Full Sun", ac: "N/A" },
    { name: "Champa (Plumeria)", sci: "Plumeria rubra", type: "outdoor", life: "40+ Years", medicinal: ["Rheumatism (Bark)"], advantages: ["Temple flower", "Divine scent"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 50, light: "Full Sun", ac: "N/A" },
    { name: "Parijat (Night Jasmine)", sci: "Nyctanthes arbor-tristis", type: "outdoor", life: "20 Years", medicinal: ["Sciatica", "Arthritis"], advantages: ["Night fragrance", "Carpet of flowers"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 40, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Raat Ki Rani", sci: "Cestrum nocturnum", type: "outdoor", life: "10-15 Years", medicinal: ["None"], advantages: ["Extreme fragrance at night", "Fast growth"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 35, light: "Part Shade", ac: "N/A" },
    { name: "Mogra (Arabian Jasmine)", sci: "Jasminum sambac", type: "outdoor", life: "10 Years", medicinal: ["Cooling effect", "Eye wash"], advantages: ["Perfume", "Garlands"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Vinca (Sadabahar)", sci: "Catharanthus roseus", type: "outdoor", life: "Perennial", medicinal: ["Cancer fighting alkaloids", "Diabetes"], advantages: ["Blooms daily", "Drought resistant"], bloom: "Solitary", vein: "Pinnate", inflo: "Cyme", oxygen: 20, light: "Full Sun", ac: "N/A" },
    { name: "Oleander (Kaner)", sci: "Nerium oleander", type: "outdoor", life: "20+ Years", medicinal: ["Toxic (used carefully in cardiac meds)"], advantages: ["Roadside hardy", "Colorful"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Bougainvillea", sci: "Bougainvillea spectabilis", type: "outdoor", life: "20+ Years", medicinal: ["Cough syrup"], advantages: ["Paper flowers", "Security hedge"], bloom: "Cyme", vein: "Reticulate", inflo: "Cyme", oxygen: 40, light: "Full Sun", ac: "N/A" },
    { name: "Rangoon Creeper", sci: "Combretum indicum", type: "outdoor", life: "20+ Years", medicinal: ["Parasite worms"], advantages: ["Fragrant color changing flowers", "Vine"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 50, light: "Full Sun", ac: "N/A" },
    { name: "Aparajita (Butterfly Pea)", sci: "Clitoria ternatea", type: "outdoor", life: "Perennial", medicinal: ["Memory booster", "Blue tea"], advantages: ["Nitrogen fixer", "Holy flower"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Ixora (Rugmini)", sci: "Ixora coccinea", type: "outdoor", life: "10+ Years", medicinal: ["Root for fever"], advantages: ["Hedge plant", "Neon flowers"], bloom: "Corymb", vein: "Pinnate", inflo: "Corymb", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Red Hibiscus", sci: "Hibiscus rosa-sinensis", type: "outdoor", life: "15 Years", medicinal: ["Hair oil", "Tea"], advantages: ["Offering to Ganesha", "Edible"], bloom: "Solitary", vein: "Palmate", inflo: "Solitary", oxygen: 45, light: "Full Sun", ac: "N/A" },
    { name: "Allamanda", sci: "Allamanda cathartica", type: "outdoor", life: "10+ Years", medicinal: ["Laxative (Toxic)"], advantages: ["Large yellow bells", "Climber"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Tecoma (Yellow Bells)", sci: "Tecoma stans", type: "outdoor", life: "10-20 Years", medicinal: ["Diabetes control"], advantages: ["Attracts bees", "Year round bloom"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 40, light: "Full Sun", ac: "N/A" },
    { name: "Rajnigandha (Tuberose)", sci: "Polianthes tuberosa", type: "outdoor", life: "Perennial", medicinal: ["Calming"], advantages: ["Best fragrance", "Cut flowers"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 20, light: "Full Sun", ac: "N/A" },
    { name: "Canna Lily", sci: "Canna indica", type: "outdoor", life: "Perennial", medicinal: ["Root starch"], advantages: ["Tropical foliage", "Tall"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Spider Lily", sci: "Hymenocallis littoralis", type: "outdoor", life: "Perennial", medicinal: ["Wound healing"], advantages: ["Unique white spidery flowers", "Rain lover"], bloom: "Umbel", vein: "Parallel", inflo: "Umbel", oxygen: 25, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Rain Lily", sci: "Zephyranthes", type: "outdoor", life: "Perennial", medicinal: ["None"], advantages: ["Blooms after rain", "Ground cover"], bloom: "Solitary", vein: "Parallel", inflo: "Scape", oxygen: 10, light: "Full Sun", ac: "N/A" },
    { name: "Curtain Creeper", sci: "Vernonia elaeagnifolia", type: "outdoor", life: "10+ Years", medicinal: ["None"], advantages: ["Natural screen", "Privacy"], bloom: "Cluster", vein: "Pinnate", inflo: "Corymb", oxygen: 45, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Passion Flower (Krishna Kamal)", sci: "Passiflora incarnata", type: "outdoor", life: "5-7 Years", medicinal: ["Insomnia", "Anxiety"], advantages: ["Complex flower structure", "Mythology"], bloom: "Solitary", vein: "Palmate", inflo: "Solitary", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Duranta (Golden Dewdrop)", sci: "Duranta erecta", type: "outdoor", life: "15 Years", medicinal: ["None"], advantages: ["Gold foliage hedge", "Blue flowers"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Lantana", sci: "Lantana camara", type: "outdoor", life: "Perennial", medicinal: ["Antiseptic (Traditional)"], advantages: ["Butterfly magnet", "Hardy"], bloom: "Umbell", vein: "Reticulate", inflo: "Corymb", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Portulaca (9 O'Clock)", sci: "Portulaca grandiflora", type: "outdoor", life: "1 Year", medicinal: ["Burns"], advantages: ["Colorful carpet", "Succulent"], bloom: "Solitary", vein: "None", inflo: "Cyme", oxygen: 15, light: "Full Sun", ac: "N/A" },
    { name: "Balsam", sci: "Impatiens balsamina", type: "outdoor", life: "1 Year", medicinal: ["Cooling burns"], advantages: ["Traditional playing flower", "Self seeding"], bloom: "Solitary", vein: "Pinnate", inflo: "Axillary", oxygen: 18, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Gomphrena", sci: "Gomphrena globosa", type: "outdoor", life: "1 Year", medicinal: ["Cough"], advantages: ["Button flowers", "Long lasting"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 15, light: "Full Sun", ac: "N/A" },
    { name: "Cockscomb", sci: "Celosia argentea", type: "outdoor", life: "1 Year", medicinal: ["Mouth sores"], advantages: ["Velvet texture", "Unique shape"], bloom: "Spike", vein: "Pinnate", inflo: "Spike", oxygen: 20, light: "Full Sun", ac: "N/A" },
    { name: "Kochia", sci: "Bassia scoparia", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Foliage ball", "Green to Red"], bloom: "Insignificant", vein: "Linear", inflo: "Spike", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Morning Glory", sci: "Ipomoea purpurea", type: "outdoor", life: "1 Year", medicinal: ["Laxative (seeds toxic)"], advantages: ["Fast climber", "Morning blooms"], bloom: "Solitary", vein: "Palmate", inflo: "Cyme", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Cypress Vine", sci: "Ipomoea quamoclit", type: "outdoor", life: "1 Year", medicinal: ["Cooling"], advantages: ["Star flowers", "Feathery leaves"], bloom: "Solitary", vein: "Pinnate", inflo: "Cyme", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Bleeding Heart Vine", sci: "Clerodendrum thomsoniae", type: "outdoor", life: "10+ Years", medicinal: ["None"], advantages: ["Bicolor flowers", "Shade climber"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 30, light: "Part Shade", ac: "N/A" },
    { name: "Bottle Brush", sci: "Callistemon", type: "outdoor", life: "40+ Years", medicinal: ["Antimicrobial"], advantages: ["Unique red bristles", "Bird attractor"], bloom: "Spike", vein: "Linear", inflo: "Spike", oxygen: 60, light: "Full Sun", ac: "N/A" },
    { name: "Indian Almond", sci: "Terminalia catappa", type: "outdoor", life: "60+ Years", medicinal: ["Leaf for fish tank", "Astringent"], advantages: ["Shade", "Fall colors in tropics"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 150, light: "Full Sun", ac: "N/A" },
    { name: "Jackfruit", sci: "Artocarpus heterophyllus", type: "outdoor", life: "100+ Years", medicinal: ["Leaves for diabetes"], advantages: ["Largest fruit", "Timber"], bloom: "Spadix", vein: "Pinnate", inflo: "Head", oxygen: 180, light: "Full Sun", ac: "N/A" },
    { name: "Amaltas (Golden Shower)", sci: "Cassia fistula", type: "outdoor", life: "50 Years", medicinal: ["Laxative (Fruit pulp)"], advantages: ["Yellow rain flowers", "Ornamental"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 90, light: "Full Sun", ac: "N/A" },
    { name: "Pride of India", sci: "Lagerstroemia speciosa", type: "outdoor", life: "50 Years", medicinal: ["Diabetes tea"], advantages: ["Purple finish", "Roadside beauty"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 85, light: "Full Sun", ac: "N/A" },
    { name: "Sitaphal (Custard Apple)", sci: "Annona squamosa", type: "outdoor", life: "20 Years", medicinal: ["Leaves antimicrobial"], advantages: ["Tasty fruit", "Small tree"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 50, light: "Full Sun", ac: "N/A" },
    { name: "Chiku (Sapodilla)", sci: "Manilkara zapota", type: "outdoor", life: "100 Years", medicinal: ["Bark Astringent"], advantages: ["Sweet fruit", "Dense canopy"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 110, light: "Full Sun", ac: "N/A" },
    { name: "Drumstick (Moringa)", sci: "Moringa oleifera", type: "outdoor", life: "20 Years", medicinal: ["Superfood"], advantages: ["Fastest growing", "Nutritious"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 100, light: "Full Sun", ac: "N/A" },

    // --- NEW SEED BANK: 50 GLOBAL INDOOR FAVORITES ---
    { name: "Calathea Orbifolia", sci: "Goeppertia orbifolia", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Massive round leaves", "Air purifying"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 28, light: "Low-Medium", ac: "Low tolerance" },
    { name: "Bird's Nest Fern", sci: "Asplenium nidus", type: "indoor", life: "10-15 Years", medicinal: ["None"], advantages: ["Ripple leaves", "Pet friendly"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 30, light: "Medium Indirect", ac: "Medium tolerance" },
    { name: "Staghorn Fern", sci: "Platycerium", type: "indoor", life: "20+ Years", medicinal: ["None"], advantages: ["Mounted art", "Epiphyte"], bloom: "None", vein: "Forked", inflo: "None", oxygen: 35, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Maidenhair Fern", sci: "Adiantum", type: "indoor", life: "5-10 Years", medicinal: ["Respiratory aid"], advantages: ["Delicate foliage", "Soft texture"], bloom: "None", vein: "Forked", inflo: "None", oxygen: 25, light: "Indirect Shade", ac: "Low (Needs humidity)" },
    { name: "Hoya Hindu Rope", sci: "Hoya carnosa 'Compacta'", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Twisted leaves", "Living sculpture"], bloom: "Umbel", vein: "None", inflo: "Umbel", oxygen: 15, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Lipstick Plant", sci: "Aeschynanthus radicans", type: "indoor", life: "5-7 Years", medicinal: ["None"], advantages: ["Red tube flowers", "Hanging basket"], bloom: "Cluster", vein: "Pinnate", inflo: "Axillary", oxygen: 20, light: "Medium-Bright", ac: "Medium tolerance" },
    { name: "Goldfish Plant", sci: "Columnea gloriosa", type: "indoor", life: "10 Years", medicinal: ["None"], advantages: ["Fish shaped flowers", "Trailing"], bloom: "Solitary", vein: "Pinnate", inflo: "Axillary", oxygen: 20, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Zebra Haworthia", sci: "Haworthiopsis fasciata", type: "indoor", life: "50 Years", medicinal: ["None"], advantages: ["White stripes", "Succulent"], bloom: "Raceme", vein: "None", inflo: "Raceme", oxygen: 10, light: "Bright Light", ac: "High tolerance" },
    { name: "Burro's Tail", sci: "Sedum morganianum", type: "indoor", life: "6-10 Years", medicinal: ["None"], advantages: ["Trailing stems", "Plump leaves"], bloom: "Cyme", vein: "None", inflo: "Cyme", oxygen: 12, light: "Full Sun", ac: "High tolerance" },
    { name: "Panda Plant", sci: "Kalanchoe tomentosa", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Fuzzy leaves", "Chocolate tips"], bloom: "Cyme", vein: "None", inflo: "Cyme", oxygen: 15, light: "Sunny Window", ac: "High tolerance" },
    { name: "Lithops (Living Stone)", sci: "Lithops", type: "indoor", life: "50+ Years", medicinal: ["None"], advantages: ["Looks like rocks", "Super drought tolerant"], bloom: "Solitary", vein: "None", inflo: "Solitary", oxygen: 5, light: "Direct Sun", ac: "High tolerance" },
    { name: "Pilea Glauca", sci: "Pilea glauca", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Silver dust leaves", "Trailing"], bloom: "Cyme", vein: "Reticulate", inflo: "Cyme", oxygen: 15, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Aluminum Plant", sci: "Pilea cadierei", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Metallic silver patterns", "Fast grower"], bloom: "Cyme", vein: "Reticulate", inflo: "Cyme", oxygen: 25, light: "Medium Light", ac: "Medium tolerance" },
    { name: "Friendship Plant", sci: "Pilea involucrata", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Quilted leaves", "Bronze tint"], bloom: "Cyme", vein: "Reticulate", inflo: "Cyme", oxygen: 20, light: "Low-Medium", ac: "Low tolerance" },
    { name: "Strawberry Begonia", sci: "Saxifraga stolonifera", type: "indoor", life: "5 Years", medicinal: ["Teas"], advantages: ["Runners like strawberry", "Fuzzy"], bloom: "Panicle", vein: "Palmate", inflo: "Panicle", oxygen: 18, light: "Cool Shade", ac: "Low tolerance" },
    { name: "False Aralia", sci: "Plerandra elegantissima", type: "indoor", life: "10-15 Years", medicinal: ["None"], advantages: ["Serrated dark leaves", "Elegant"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel", oxygen: 30, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Ming Aralia", sci: "Polyscias fruticosa", type: "indoor", life: "20+ Years", medicinal: ["Anti-inflammatory"], advantages: ["Bonsai look", "Feathery"], bloom: "Umbel", vein: "Pinnate", inflo: "Umbel", oxygen: 35, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Flamingo Flower", sci: "Anthurium scherzerianum", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Curled spadix", "Durable blooms"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 22, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Velvet Anthurium", sci: "Anthurium clarinervium", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Velvet texture", "White veins"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 25, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Crystal Anthurium", sci: "Anthurium crystallinum", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Shimmering veins", "Heart shape"], bloom: "Spadix", vein: "Reticulate", inflo: "Spadix", oxygen: 24, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Rabbit's Foot Fern", sci: "Davallia fejeensis", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Fuzzy rhizomes", "Lacy fronds"], bloom: "None", vein: "Forked", inflo: "None", oxygen: 28, light: "Medium Light", ac: "Low tolerance" },
    { name: "Button Fern", sci: "Pellaea rotundifolia", type: "indoor", life: "5-8 Years", medicinal: ["None"], advantages: ["Round leaflets", "Compact"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 20, light: "Medium Light", ac: "Medium tolerance" },
    { name: "Blue Star Fern", sci: "Phlebodium aureum", type: "indoor", life: "10+ Years", medicinal: ["Skin conditions (traditional)"], advantages: ["Blue-green color", "Unique shape"], bloom: "None", vein: "Forked", inflo: "None", oxygen: 30, light: "Low-Medium", ac: "High tolerance" },
    { name: "Crocodile Fern", sci: "Microsorum musifolium", type: "indoor", life: "10+ Years", medicinal: ["None"], advantages: ["Croc skin texture", "Glossy"], bloom: "None", vein: "Reticulate", inflo: "None", oxygen: 35, light: "Indirect", ac: "Low tolerance" },
    { name: "Lemon Button Fern", sci: "Nephrolepis cordifolia", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Lemon scent crushed", "Small"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 25, light: "Indirect", ac: "Low tolerance" },
    { name: "Moth Orchid", sci: "Phalaenopsis", type: "indoor", life: "10-15 Years", medicinal: ["None"], advantages: ["Longest lasting flower", "Elegant"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 18, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Dendrobium Orchid", sci: "Dendrobium", type: "indoor", life: "10-20 Years", medicinal: ["TCM tonic"], advantages: ["Cane stems", "Many blooms"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 20, light: "Bright Light", ac: "Medium tolerance" },
    { name: "Cattleya Orchid", sci: "Cattleya", type: "indoor", life: "10-20 Years", medicinal: ["None"], advantages: ["Corsage flower", "Fragrant"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 15, light: "Bright Light", ac: "Medium tolerance" },
    { name: "Oncidium (Dancing Lady)", sci: "Oncidium", type: "indoor", life: "10-15 Years", medicinal: ["None"], advantages: ["Many small flowers", "Yellow sprays"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 18, light: "Bright Light", ac: "Medium tolerance" },
    { name: "Vanilla Orchid", sci: "Vanilla planifolia", type: "indoor", life: "20+ Years", medicinal: ["Flavoring", "Aphrodisiac"], advantages: ["Produces vanilla bean", "Vining"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 25, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Bromeliad Guzmania", sci: "Guzmania", type: "indoor", life: "3-4 Years (Pups follow)", medicinal: ["None"], advantages: ["Colorful bracts", "Tropical"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 30, light: "Medium Light", ac: "High tolerance" },
    { name: "Bromeliad Aechmea", sci: "Aechmea fasciata", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Silver urn plant", "Pink flower"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 28, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Air Plant (Xerographica)", sci: "Tillandsia xerographica", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["King of Air Plants", "Silver curls"], bloom: "Spike", vein: "Linear", inflo: "Spike", oxygen: 10, light: "Bright Light", ac: "High tolerance" },
    { name: "Air Plant (Ionantha)", sci: "Tillandsia ionantha", type: "indoor", life: "2-5 Years", medicinal: ["None"], advantages: ["Blushes red", "Tiny"], bloom: "Solitary", vein: "Linear", inflo: "Solitary", oxygen: 5, light: "Filtered Sun", ac: "High tolerance" },
    { name: "Spanish Moss", sci: "Tillandsia usneoides", type: "indoor", life: "Perennial", medicinal: ["Stuffing material"], advantages: ["Drapes beautifully", "No soil"], bloom: "Solitary", vein: "Linear", inflo: "Solitary", oxygen: 15, light: "Bright Indirect", ac: "High tolerance" },
    { name: "Sensitive Plant", sci: "Mimosa pudica", type: "indoor", life: "1-2 Years", medicinal: ["Wound healing"], advantages: ["Closes when touched", "Interactive"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 20, light: "Bright Light", ac: "Low tolerance" },
    { name: "Purple Shamrock", sci: "Oxalis triangularis", type: "indoor", life: "Perennial Bulb", medicinal: ["Edible (sour)"], advantages: ["Purple leaves", "Moves day/night"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel", oxygen: 18, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Fishtail Fern", sci: "Cyrtomium falcatum", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Holly-like leaves", "Tough"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 30, light: "Shade-Medium", ac: "High tolerance" },
    { name: "Kangaroo Paw Fern", sci: "Microsorum diversifolium", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Shiny leaves", "Spreads"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 30, light: "Medium Light", ac: "Medium tolerance" },
    { name: "Mahogany Fern", sci: "Didymochlaena truncatula", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Red young fronds", "Tree-like"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 35, light: "Shade", ac: "Low tolerance" },
    { name: "Silver Brake Fern", sci: "Pteris ensiformis", type: "indoor", life: "3-5 Years", medicinal: ["None"], advantages: ["Variegated", "Compact"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 25, light: "Medium Light", ac: "Low tolerance" },
    { name: "Autumn Fern", sci: "Dryopteris erythrosora", type: "indoor", life: "5-10 Years", medicinal: ["None"], advantages: ["Copper color", "Hardy"], bloom: "None", vein: "Pinnate", inflo: "None", oxygen: 28, light: "Shade", ac: "High tolerance" },
    { name: "Coffee Plant", sci: "Coffea arabica", type: "indoor", life: "20-50 Years", medicinal: ["Caffeine source"], advantages: ["Glossy leaves", "Real beans possible"], bloom: "Cluster", vein: "Pinnate", inflo: "Axillary", oxygen: 40, light: "Bright Indirect", ac: "Low tolerance" },
    { name: "Tea Plant", sci: "Camellia sinensis", type: "indoor", life: "50+ Years", medicinal: ["Tea", "Antioxidant"], advantages: ["Edible leaves", "White flowers"], bloom: "Solitary", vein: "Pinnate", inflo: "Axillary", oxygen: 45, light: "Bright Indirect", ac: "Medium tolerance" },
    { name: "Cardamom", sci: "Elettaria cardamomum", type: "indoor", life: "10-15 Years", medicinal: ["Digestion"], advantages: ["Scented leaves", "Spice"], bloom: "Panicle", vein: "Parallel", inflo: "Panicle", oxygen: 35, light: "Medium Light", ac: "Low tolerance" },
    { name: "Ginger", sci: "Zingiber officinale", type: "indoor", life: "1 Year", medicinal: ["Anti-nausea"], advantages: ["Edible root", "Bamboo-like stems"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 30, light: "Indirect", ac: "Medium tolerance" },
    { name: "Turmeric", sci: "Curcuma longa", type: "indoor", life: "1 Year", medicinal: ["Anti-inflammatory"], advantages: ["Superfood root", "Large leaves"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 35, light: "Indirect", ac: "Medium tolerance" },
    { name: "Patchouli", sci: "Pogostemon cablin", type: "indoor", life: "3-5 Years", medicinal: ["Antidepressant"], advantages: ["Perfume scent", "Fuzzy leaves"], bloom: "Spike", vein: "Reticulate", inflo: "Spike", oxygen: 25, light: "Medium Light", ac: "Low tolerance" },
    { name: "Stevia", sci: "Stevia rebaudiana", type: "indoor", life: "2-3 Years", medicinal: ["Sweetener"], advantages: ["Sugar substitute", "Easy herb"], bloom: "Corymb", vein: "Reticulate", inflo: "Cyme", oxygen: 20, light: "Sun", ac: "Medium tolerance" },
    { name: "Gotu Kola", sci: "Centella asiatica", type: "indoor", life: "Perennial", medicinal: ["Memory", "Skin"], advantages: ["Medicinal herb", "Ground cover"], bloom: "Umbel", vein: "Palmate", inflo: "Umbel", oxygen: 22, light: "Low-Medium", ac: "Medium tolerance" },

    // --- NEW SEED BANK: 50 GLOBAL OUTDOOR FAVORITES ---
    { name: "Wisteria", sci: "Wisteria sinensis", type: "outdoor", life: "50+ Years", medicinal: ["None"], advantages: ["Cascading flowers", "Stunning purple"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 80, light: "Full Sun", ac: "N/A" },
    { name: "Clematis", sci: "Clematis", type: "outdoor", life: "20-50 Years", medicinal: ["Anti-inflammatory (History)"], advantages: ["Queen of Climbers", "Diverse colors"], bloom: "Solitary", vein: "Pinnate", inflo: "Cyme", oxygen: 40, light: "Sun (Roots shade)", ac: "N/A" },
    { name: "Honeysuckle", sci: "Lonicera", type: "outdoor", life: "20+ Years", medicinal: ["Cooling herb"], advantages: ["Heavenly scent", "Pollinator magnet"], bloom: "Cyme", vein: "Pinnate", inflo: "Cyme", oxygen: 50, light: "Full Sun", ac: "N/A" },
    { name: "Black Eyed Susan", sci: "Rudbeckia hirta", type: "outdoor", life: "2-3 Years", medicinal: ["Immune boost root"], advantages: ["Bright yellow", "Native beauty"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Coneflower", sci: "Echinacea purpurea", type: "outdoor", life: "3-5 Years", medicinal: ["Cold remedy"], advantages: ["Medicinal tea", "Butterfly fave"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Bleeding Heart", sci: "Lamprocapnos spectabilis", type: "outdoor", life: "Perennial", medicinal: ["None"], advantages: ["Heart shaped flower", "Shade lover"], bloom: "Raceme", vein: "Ternate", inflo: "Raceme", oxygen: 25, light: "Shade", ac: "N/A" },
    { name: "Astilbe", sci: "Astilbe", type: "outdoor", life: "15+ Years", medicinal: ["None"], advantages: ["Feathery plumes", "Fern-like foliage"], bloom: "Panicle", vein: "Ternate", inflo: "Panicle", oxygen: 30, light: "Shade", ac: "N/A" },
    { name: "Hosta", sci: "Hosta", type: "outdoor", life: "30+ Years", medicinal: ["Edible shoots"], advantages: ["Foliage king", "Shade tolerant"], bloom: "Raceme", vein: "Parallel", inflo: "Raceme", oxygen: 40, light: "Shade", ac: "N/A" },
    { name: "Coral Bells", sci: "Heuchera", type: "outdoor", life: "3-5 Years", medicinal: ["Astringent root"], advantages: ["Colorful leaves", "Evergreen"], bloom: "Panicle", vein: "Palmate", inflo: "Panicle", oxygen: 25, light: "Part Shade", ac: "N/A" },
    { name: "Foxglove", sci: "Digitalis purpurea", type: "outdoor", life: "2 Years (Biennial)", medicinal: ["Heart medicine (Toxic)"], advantages: ["Tall spikes", "Cottage garden"], bloom: "Raceme", vein: "Reticulate", inflo: "Raceme", oxygen: 35, light: "Part Shade", ac: "N/A" },
    { name: "Delphinium", sci: "Delphinium", type: "outdoor", life: "3-5 Years", medicinal: ["None (Toxic)"], advantages: ["True blue color", "Tall spikes"], bloom: "Raceme", vein: "Palmate", inflo: "Raceme", oxygen: 40, light: "Full Sun", ac: "N/A" },
    { name: "Snapdragon", sci: "Antirrhinum majus", type: "outdoor", life: "1 Year", medicinal: ["Anti-inflammatory"], advantages: ["Dragon mouth flowers", "Kids love"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 20, light: "Full Sun", ac: "N/A" },
    { name: "Zinnia", sci: "Zinnia elegans", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Cut flowers", "Butterfly magnet"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Cosmos", sci: "Cosmos bipinnatus", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Airy foliage", "Daisy like"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 28, light: "Full Sun", ac: "N/A" },
    { name: "Sweet Pea", sci: "Lathyrus odoratus", type: "outdoor", life: "1 Year", medicinal: ["None"], advantages: ["Fragrance", "Climber"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Nasturtium", sci: "Tropaeolum majus", type: "outdoor", life: "1 Year", medicinal: ["Antibiotic"], advantages: ["Edible flowers/leaves", "Peppery"], bloom: "Solitary", vein: "Peltate", inflo: "Solitary", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Dahlia", sci: "Dahlia pinnata", type: "outdoor", life: "Perennial Tuber", medicinal: ["Insulin source (historical)"], advantages: ["Showy blooms", "Variety"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 45, light: "Full Sun", ac: "N/A" },
    { name: "Gladiolus", sci: "Gladiolus", type: "outdoor", life: "Perennial Corm", medicinal: ["Drawing out thorns"], advantages: ["Tall sword flower", "Cut flower"], bloom: "Spike", vein: "Parallel", inflo: "Spike", oxygen: 30, light: "Full Sun", ac: "N/A" },
    { name: "Calla Lily", sci: "Zantedeschia aethiopica", type: "outdoor", life: "Perennial", medicinal: ["None (Toxic)"], advantages: ["Elegant trumpet", "Wet soil"], bloom: "Spadix", vein: "Parallel", inflo: "Spadix", oxygen: 35, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Daylily", sci: "Hemerocallis", type: "outdoor", life: "Perennial", medicinal: ["Edible flower buds"], advantages: ["Tough", "Blooms for one day"], bloom: "Cyme", vein: "Parallel", inflo: "Scape", oxygen: 30, light: "Sun", ac: "N/A" },
    { name: "Iris", sci: "Iris germanica", type: "outdoor", life: "Perennial", medicinal: ["Orris root (perfume)"], advantages: ["Bearded flowers", "Sword leaves"], bloom: "Solitary", vein: "Parallel", inflo: "Rhipidium", oxygen: 32, light: "Full Sun", ac: "N/A" },
    { name: "Camellia", sci: "Camellia japonica", type: "outdoor", life: "50+ Years", medicinal: ["Oil for hair"], advantages: ["Winter blooms", "Rose-like"], bloom: "Solitary", vein: "Pinnate", inflo: "Axillary", oxygen: 55, light: "Part Shade", ac: "N/A" },
    { name: "Gardenia", sci: "Gardenia jasminoides", type: "outdoor", life: "20-40 Years", medicinal: ["Chinese medicine"], advantages: ["Intense fragrance", "White blooms"], bloom: "Solitary", vein: "Pinnate", inflo: "Solitary", oxygen: 40, light: "Part Shade", ac: "N/A" },
    { name: "Rhododendron", sci: "Rhododendron ferrugineum", type: "outdoor", life: "50+ Years", medicinal: ["None (Toxic)"], advantages: ["Spectacular spring", "Evergreen"], bloom: "Umbel", vein: "Pinnate", inflo: "Corymb", oxygen: 60, light: "Part Shade", ac: "N/A" },
    { name: "Forsythia", sci: "Forsythia suspensa", type: "outdoor", life: "40+ Years", medicinal: ["Detox"], advantages: ["First yellow of spring", "Hardy"], bloom: "Solitary", vein: "Pinnate", inflo: "Axillary", oxygen: 45, light: "Full Sun", ac: "N/A" },
    { name: "Weigela", sci: "Weigela florida", type: "outdoor", life: "30+ Years", medicinal: ["None"], advantages: ["Tubular flowers", "Hummingbirds"], bloom: "Cyme", vein: "Pinnate", inflo: "Corymb", oxygen: 40, light: "Full Sun", ac: "N/A" },
    { name: "Spirea", sci: "Spiraea japonica", type: "outdoor", life: "20+ Years", medicinal: ["Aspirin source (Salicylic acid)"], advantages: ["Easy shrub", "Pink/White"], bloom: "Corymb", vein: "Pinnate", inflo: "Corymb", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Holly", sci: "Ilex aquifolium", type: "outdoor", life: "50+ Years", medicinal: ["None (Berries toxic)"], advantages: ["Winter red berries", "Security"], bloom: "Cyme", vein: "Pinnate", inflo: "Axillary", oxygen: 55, light: "Sun/Part Shade", ac: "N/A" },
    { name: "Juniper", sci: "Juniperus communis", type: "outdoor", life: "100+ Years", medicinal: ["Gin flavoring", "Antiseptic"], advantages: ["Evergreen", "Berries"], bloom: "Cone", vein: "Linear", inflo: "Cone", oxygen: 70, light: "Full Sun", ac: "N/A" },
    { name: "Yew", sci: "Taxus baccata", type: "outdoor", life: "500+ Years", medicinal: ["Taxol (Cancer drug)"], advantages: ["Long lived", "Hedge"], bloom: "Cone", vein: "Linear", inflo: "Cone", oxygen: 80, light: "Shade/Sun", ac: "N/A" },
    { name: "Arborvitae", sci: "Thuja occidentalis", type: "outdoor", life: "50+ Years", medicinal: ["Vitamin C tea"], advantages: ["Privacy screen", "Evergreen"], bloom: "Cone", vein: "Scale", inflo: "Cone", oxygen: 90, light: "Full Sun", ac: "N/A" },
    { name: "Japanese Maple", sci: "Acer palmatum", type: "outdoor", life: "50-100 Years", medicinal: ["Eye wash"], advantages: ["Stunning foliage", "Form"], bloom: "Corymb", vein: "Palmate", inflo: "Corymb", oxygen: 120, light: "Part Shade", ac: "N/A" },
    { name: "Dogwood", sci: "Cornus florida", type: "outdoor", life: "50+ Years", medicinal: ["Fever bark"], advantages: ["Spring bracts", "Fall color"], bloom: "Head", vein: "Pinnate", inflo: "Umbel", oxygen: 110, light: "Part Shade", ac: "N/A" },
    { name: "Redbud", sci: "Cercis canadensis", type: "outdoor", life: "50 Years", medicinal: ["Astringent"], advantages: ["Pink stems", "Heart leaves"], bloom: "Cluster", vein: "Palmate", inflo: "Fascicle", oxygen: 100, light: "Part Shade", ac: "N/A" },
    { name: "Crape Myrtle", sci: "Lagerstroemia indica", type: "outdoor", life: "50+ Years", medicinal: ["None"], advantages: ["Summer blooms", "Peeling bark"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 95, light: "Full Sun", ac: "N/A" },
    { name: "Ginkgo", sci: "Ginkgo biloba", type: "outdoor", life: "1000+ Years", medicinal: ["Memory"], advantages: ["Living fossil", "Yellow fall"], bloom: "Catkin", vein: "Fan", inflo: "Catkin", oxygen: 250, light: "Full Sun", ac: "N/A" },
    { name: "Birch", sci: "Betula pendula", type: "outdoor", life: "40-60 Years", medicinal: ["Sap wine", "Skin"], advantages: ["White bark", "Elegant"], bloom: "Catkin", vein: "Pinnate", inflo: "Catkin", oxygen: 180, light: "Full Sun", ac: "N/A" },
    { name: "Willow", sci: "Salix babylonica", type: "outdoor", life: "30-50 Years", medicinal: ["Aspirin source"], advantages: ["Weeping form", "Water loving"], bloom: "Catkin", vein: "Pinnate", inflo: "Catkin", oxygen: 160, light: "Full Sun", ac: "N/A" },
    { name: "Oak", sci: "Quercus robur", type: "outdoor", life: "500+ Years", medicinal: ["Astringent bark"], advantages: ["Wildlife support", "Strength"], bloom: "Catkin", vein: "Pinnate", inflo: "Catkin", oxygen: 300, light: "Full Sun", ac: "N/A" },
    { name: "Maple", sci: "Acer saccharum", type: "outdoor", life: "200+ Years", medicinal: ["Syrup"], advantages: ["Fall color", "Syrup"], bloom: "Corymb", vein: "Palmate", inflo: "Corymb", oxygen: 280, light: "Full Sun", ac: "N/A" },
    { name: "Pine", sci: "Pinus strobus", type: "outdoor", life: "200+ Years", medicinal: ["Needle tea (Vit C)"], advantages: ["Evergreen", "Scent"], bloom: "Cone", vein: "Needle", inflo: "Cone", oxygen: 260, light: "Full Sun", ac: "N/A" },
    { name: "Palm (Fan)", sci: "Washingtonia robusta", type: "outdoor", life: "50-100 Years", medicinal: ["None"], advantages: ["Skyline accent", "Drought"], bloom: "Panicle", vein: "Palmate", inflo: "Spadix", oxygen: 150, light: "Full Sun", ac: "N/A" },
    { name: "Olive", sci: "Olea europaea", type: "outdoor", life: "1000+ Years", medicinal: ["Leaf extract", "Oil"], advantages: ["Peace symbol", "Fruit"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 120, light: "Full Sun", ac: "N/A" },
    { name: "Fig", sci: "Ficus carica", type: "outdoor", life: "50+ Years", medicinal: ["Latex for warts"], advantages: ["Edible fruit", "Leaves"], bloom: "Syconium", vein: "Palmate", inflo: "Syconium", oxygen: 100, light: "Full Sun", ac: "N/A" },
    { name: "Grapevine", sci: "Vitis vinifera", type: "outdoor", life: "50-100 Years", medicinal: ["Antioxidant seeds"], advantages: ["Wine/Jam", "Shade arbor"], bloom: "Panicle", vein: "Palmate", inflo: "Panicle", oxygen: 90, light: "Full Sun", ac: "N/A" },
    { name: "Strawberry", sci: "Fragaria x ananassa", type: "outdoor", life: "3 Years", medicinal: ["Teeth whitening (fruit)"], advantages: ["Delicious", "Ground cover"], bloom: "Cyme", vein: "Ternate", inflo: "Cyme", oxygen: 25, light: "Full Sun", ac: "N/A" },
    { name: "Blueberry", sci: "Vaccinium corymbosum", type: "outdoor", life: "40+ Years", medicinal: ["Superfood"], advantages: ["Berries", "Fall red leaves"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 40, light: "Full Sun", ac: "N/A" },
    { name: "Raspberry", sci: "Rubus idaeus", type: "outdoor", life: "10+ Years", medicinal: ["Leaf tea for labor"], advantages: ["Fruit", "Easy grow"], bloom: "Raceme", vein: "Pinnate", inflo: "Raceme", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Blackberry", sci: "Rubus fruticosus", type: "outdoor", life: "10+ Years", medicinal: ["Antioxidant"], advantages: ["Fruit", "Aggressive"], bloom: "Panicle", vein: "Pinnate", inflo: "Panicle", oxygen: 35, light: "Full Sun", ac: "N/A" },
    { name: "Sunflower (Giant)", sci: "Helianthus giganteus", type: "outdoor", life: "1 Year", medicinal: ["Seeds"], advantages: ["12ft tall", "Competitions"], bloom: "Head", vein: "Pinnate", inflo: "Capitulum", oxygen: 80, light: "Full Sun", ac: "N/A" },
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
