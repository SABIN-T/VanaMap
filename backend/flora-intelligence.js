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
            .map(m => {
                if (typeof m.content === 'string') return m.content;
                if (Array.isArray(m.content)) {
                    return m.content
                        .filter(c => c.type === 'text')
                        .map(c => c.text)
                        .join(' ');
                }
                return '';
            })
            .join(' ')
            .toLowerCase();

        // Find matches in World Flora Index
        const matches = worldFlora.filter(plant => {
            const sciName = plant.scientificName.toLowerCase();
            const comName = plant.commonName.toLowerCase();
            const words = comName.split(' ').concat(sciName.split(' ')).filter(w => w.length > 3);

            // 1. Direct inclusion (Strong match)
            if (fullText.includes(sciName) || fullText.includes(comName)) return true;

            // 2. Keyword inclusion (Fuzzy match)
            return words.some(word => fullText.includes(word));
        }).slice(0, 8); // Limit to top 8 matches to keep context window manageable

        if (matches.length === 0) return { context: "", matches: [] };

        const context = `\n\n🔬 SCIENTIFIC DATA FROM WORLD FLORA INDEX (Matched for this conversation):\n${matches.map(p =>
            `- ${p.scientificName} (${p.commonName}): Flower: ${p.flowerType}, Venation: ${p.leafVenation}, Oxygen: ${p.oxygenOutput}ml/h, Light: ${p.lightRequirement}, Source: ${p.verifiedSource}`
        ).join('\n')}`;

        return { context, matches };
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
        let enhanced = userPrompt;

        // Base style for maximum realism and clarity
        const realismKeywords = "Hyper-realistic cinematic photography, shot on 35mm lens, f/1.8, bokeh background, macro details, ultra-high resolution, 8k, highly detailed textures, realistic lighting, subsurface scattering, professional botanical photography, National Geographic style.";

        let selectedPlant = null;

        // SMART MATCHING: Don't just take the first plant. Check which plant is actually in the prompt.
        if (matchedFlora && matchedFlora.length > 0) {
            const lowerPrompt = userPrompt.toLowerCase();

            // Find the best match in the batch that is actually mentioned in the prompt
            selectedPlant = matchedFlora.find(p => {
                const sciName = p.scientificName.toLowerCase();
                const comName = p.commonName.toLowerCase();
                return lowerPrompt.includes(sciName) || lowerPrompt.includes(comName) || lowerPrompt.includes(comName.split(' ')[0]);
            });

            // If no specific match found in prompt, but we have a strong single context (only 1-2 matches), trust the context
            if (!selectedPlant && matchedFlora.length <= 2) {
                selectedPlant = matchedFlora[0];
            }
        }

        if (selectedPlant) {
            enhanced = `${realismKeywords} A real-life close-up of ${selectedPlant.scientificName} (${selectedPlant.commonName}). 
            Botanical accuracy: ${selectedPlant.flowerType} flowers, ${selectedPlant.leafVenation} leaf venation. 
            The plant is in its natural environment, sun-drenched, with dew drops on leaves, sharp focus on the textures. 
            Detailed Description: ${userPrompt}`;
        } else {
            // Fallback for when we can't find specific scientific data but still want high quality
            enhanced = `${realismKeywords} Real-life professional photography of a plant or garden. 
            Subject analysis: ${userPrompt}. 
            Cinematic lighting, sharp details, extreme realism.`;
        }

        return enhanced;
    }
};

module.exports = FloraIntelligence;
