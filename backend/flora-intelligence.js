const worldFlora = require('./worldFlora');
const { User, Plant } = require('./models');

/**
 * Advanced AI Intelligence Layer for Dr. Flora
 */
const FloraIntelligence = {
    /**
     * Searches 5,839 World Flora records for plants mentioned in the user's query.
     * Uses fuzzy-ish matching against scientific and common names.
     */
    async getRelevantFloraContext(userMessages) {
        const fullText = userMessages
            .map(m => (typeof m.content === 'string' ? m.content : m.content.map(c => c.text).join(' ')))
            .join(' ')
            .toLowerCase();

        // Find matches in World Flora Index
        const matches = worldFlora.filter(plant => {
            const sciName = plant.scientificName.toLowerCase();
            const comName = plant.commonName.toLowerCase();

            // Check if scientific or common name is in user query (min 4 chars for safety)
            return (sciName.length > 3 && fullText.includes(sciName)) ||
                (comName.length > 3 && fullText.includes(comName));
        }).slice(0, 8); // Limit to top 8 matches to keep context window manageable

        if (matches.length === 0) return "";

        return `\n\n🔬 SCIENTIFIC DATA FROM WORLD FLORA INDEX (Matched for this conversation):\n${matches.map(p =>
            `- ${p.scientificName} (${p.commonName}): Flower: ${p.flowerType}, Venation: ${p.leafVenation}, Oxygen: ${p.oxygenOutput}ml/h, Light: ${p.lightRequirement}, Source: ${p.verifiedSource}`
        ).join('\n')
            }`;
    },

    /**
     * Fetches user's saved plants, favorites, and cart for personalized advice.
     */
    async getUserPersonalContext(userId) {
        if (!userId) return "";

        try {
            const user = await User.findById(userId).lean();
            if (!user) return "";

            let context = `\n\n👤 USER PROFILE & GARDEN MEMORY:`;
            context += `\nName: ${user.name}`;
            context += `\nCity: ${user.city || 'Unknown'}`;

            if (user.favorites && user.favorites.length > 0) {
                const favPlants = await Plant.find({ id: { $in: user.favorites } }).select('name').lean();
                context += `\nFavorite Plants: ${favPlants.map(p => p.name).join(', ')}`;
            }

            if (user.cart && user.cart.length > 0) {
                const cartPlants = await Plant.find({ id: { $in: user.cart.map(i => i.plantId) } }).select('name').lean();
                context += `\nPlants they are considering buying: ${cartPlants.map(p => p.name).join(', ')}`;
            }

            return context;
        } catch (err) {
            console.error('[Flora Intelligence] Error fetching user context:', err);
            return "";
        }
    },

    /**
     * Generates an advanced scientific prompt for Flux.1 image generation.
     */
    enhanceGenerationPrompt(userPrompt, matchedFlora) {
        // If we matched a specific plant, we can inject scientific details into the Flux prompt
        let enhanced = userPrompt;

        if (matchedFlora && matchedFlora.length > 0) {
            const bestMatch = matchedFlora[0];
            enhanced = `A scientifically accurate botanical illustration of ${bestMatch.scientificName} (${bestMatch.commonName}). 
            Features: ${bestMatch.flowerType} flowers, ${bestMatch.leafVenation} leaf venation. 
            Style: Cinematic photorealistic, professional botanical photography, sharp focus, 8k resolution, micro-details. ${userPrompt}`;
        } else {
            enhanced = `Realistic botanical photography, high-end garden design, ${userPrompt}, 8k, cinematic lighting, sharp details.`;
        }

        return enhanced;
    }
};

module.exports = FloraIntelligence;
