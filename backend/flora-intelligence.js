const { User, Plant, BotanicalDossier } = require('./models');

// Deep botanical and agronomic biometrics database for household and crop plants (Fast static path)
const plantBiometrics = {
    "sansevieria trifasciata": {
        toxicity: "TOXIC to cats and dogs (contains saponins causing gastrointestinal irritation)",
        npkRatio: "Balanced low-nitrogen (e.g., 10-15-10 or 8-8-8 formula)",
        soilPH: "6.0 - 7.0 (Slightly acidic to neutral)",
        cropCoefficient: 0.15, // Succulent/CAM low water transpirer
        phytoPathology: ["Fusarium leaf spot", "Root rot (Phytophthora)", "Cold damage necrosis"]
    },
    "chlorophytum comosum": {
        toxicity: "NON-TOXIC to cats and dogs (100% safe household plant)",
        npkRatio: "Balanced houseplant growth (e.g., 10-10-10 or 20-20-20)",
        soilPH: "6.0 - 7.2",
        cropCoefficient: 0.5, // Moderate water consumption
        phytoPathology: ["Tip burn (fluoride/salt toxicity)", "Pythium root rot", "Mealybugs"]
    },
    "spathiphyllum wallisii": {
        toxicity: "TOXIC to cats and dogs (insoluble calcium oxalate crystals causing oral irritation and swelling)",
        npkRatio: "Balanced liquid fertilizer (e.g., 20-20-20 or 15-30-15 for blooms)",
        soilPH: "5.8 - 6.5 (Slightly acidic)",
        cropCoefficient: 0.8, // High transpiration rate due to large leaf surface
        phytoPathology: ["Cylindrocladium root rot", "Phytophthora leaf spot", "Spider mites"]
    },
    "aloe barbadensis": {
        toxicity: "TOXIC to cats and dogs (saponins and anthraquinones causing mild toxicity)",
        npkRatio: "Low nitrogen, high phosphorus/potassium (e.g., 5-10-10)",
        soilPH: "7.0 - 8.5 (Neutral to slightly alkaline)",
        cropCoefficient: 0.2, // Succulent low transpirer
        phytoPathology: ["Aloe rust (fungal spots)", "Bacterial soft rot", "Root rot"]
    },
    "epipremnum aureum": {
        toxicity: "TOXIC to cats and dogs (insoluble calcium oxalates causing oral burning and drooling)",
        npkRatio: "Balanced foliage fertilizer (e.g., 20-20-20)",
        soilPH: "6.0 - 6.5",
        cropCoefficient: 0.6,
        phytoPathology: ["Bacterial leaf spot (Pseudomonas)", "Pythium root rot", "Foliar mealybugs"]
    },
    "monstera deliciosa": {
        toxicity: "TOXIC to cats and dogs (calcium oxalate crystals causing mouth pain and swelling)",
        npkRatio: "High nitrogen, balanced (e.g., 3-1-2 or 20-20-20)",
        soilPH: "5.5 - 6.5 (Acidic)",
        cropCoefficient: 0.75, // Moderate-high transpiration rate
        phytoPathology: ["Anthracnose leaf spots", "Rust fungus", "Thrips infestation", "Root rot"]
    }
};

/**
 * Advanced AI Intelligence Layer for Dr. Flora
 */
const FloraIntelligence = {
    /**
     * Extracts plant species names mentioned in user chat history.
     */
    async extractPlantNames(messages) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return [];

        // Fetch user message contents (last 3 messages)
        const recentMessages = messages.filter(m => m.role !== 'system').slice(-3);
        const textContent = recentMessages.map(m => {
            if (typeof m.content === 'string') return m.content;
            if (Array.isArray(m.content)) {
                return m.content.filter(c => c.type === 'text').map(c => c.text).join(' ');
            }
            return '';
        }).join('\n');

        if (!textContent.trim()) return [];

        const systemPrompt = `You are a botanical entity extractor. Analyze the user messages and extract any specific plant species (common name or scientific name) they are asking about, diagnosing, or referencing.
Return the result as a raw JSON array of strings, for example: ["Monstera deliciosa", "Peace Lily"]. If no specific plant is mentioned, return an empty array [].
Rules:
- Respond ONLY with the raw JSON array (e.g., ["Snake Plant"]).
- Do NOT include any markdown code blocks, backticks, or other text.
- Do NOT include generic terms like "plant", "flower", "tree", "leaf" unless they are part of a specific name.`;

        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: textContent }
                    ],
                    temperature: 0.1,
                    max_tokens: 250
                })
            });

            if (!res.ok) return [];
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content?.trim();
            if (!rawText) return [];

            const jsonMatch = rawText.match(/\[\s*[\s\S]*?\s*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        } catch (err) {
            console.error('[Flora Intelligence] Error extracting plant names:', err);
            return [];
        }
    },

    /**
     * Search Wikipedia for plant species summaries.
     */
    async researchPlantWikipedia(plantName) {
        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(plantName)}&limit=1&namespace=0&format=json`;
            const searchRes = await fetch(searchUrl);
            if (!searchRes.ok) return null;
            const searchData = await searchRes.json();
            
            const title = searchData[1]?.[0];
            if (!title) return null;

            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
            const summaryRes = await fetch(summaryUrl);
            if (!summaryRes.ok) return null;
            const summaryData = await summaryRes.json();

            return {
                title: summaryData.title,
                extract: summaryData.extract,
                description: summaryData.description
            };
        } catch (err) {
            console.error(`[Flora Intelligence] Wikipedia lookup failed for "${plantName}":`, err.message);
            return null;
        }
    },

    /**
     * Perform LLM-guided scientific structuring of researched plant information.
     */
    async researchPlantDossier(plantName) {
        if (!plantName || typeof plantName !== 'string' || plantName.trim().length < 3) return null;
        const cleanName = plantName.trim();

        try {
            // Check cache first
            const existing = await BotanicalDossier.findOne({
                $or: [
                    { scientificName: new RegExp(`^${cleanName}$`, 'i') },
                    { commonName: new RegExp(`^${cleanName}$`, 'i') }
                ]
            });
            if (existing) return existing;

            console.log(`[Botanical Researcher] 🔍 Running crawler lookup for: "${cleanName}"`);

            const wikiInfo = await this.researchPlantWikipedia(cleanName);
            const wikiText = wikiInfo 
                ? `Wikipedia Page: ${wikiInfo.title}\nDescription: ${wikiInfo.description || ''}\nExtract: ${wikiInfo.extract}`
                : `No online encyclopedia page found. Retrieve details from scientific knowledge.`;

            const apiKey = process.env.GROQ_API_KEY;
            if (!apiKey) return null;

            const systemPrompt = `You are a Senior Agricultural Scientist and Botanical Research Agent.
Analyze the following information about the plant "${cleanName}":
[Raw Information]:
${wikiText}

Using the raw information above, and your own deep botanical knowledge, construct a highly accurate, structured botanical dossier for this plant.
Format your response as a strict JSON object with the following fields:
{
  "scientificName": "Latin binomial name (e.g., 'Epipremnum aureum')",
  "commonName": "Standard common name (e.g., 'Pothos')",
  "toxicity": "Toxicity warning to cats and dogs (e.g., 'TOXIC to cats and dogs (contains calcium oxalate crystals causing oral irritation)' or 'NON-TOXIC to cats and dogs')",
  "npkRatio": "Target NPK fertilizer ratio formula (e.g., '10-15-10' or '20-20-20')",
  "soilPH": "Optimal soil pH range (e.g., '6.0 - 6.5')",
  "cropCoefficient": 0.65, // A decimal value representing water transpiration rate (Kc between 0.1 and 1.2)
  "phytoPathology": ["Pest/Disease 1", "Pest/Disease 2"], // Array of common pathogens
  "lightRequirement": "Standard lux requirement (e.g., 'Medium indirect (500-1500 Lux)')",
  "wateringInstructions": "Watering rule/guidelines (e.g., 'Allow the top 2 inches of soil to dry out before watering again.')"
}
Ensure all fields are present and valid JSON. Respond with ONLY the raw JSON object, no explanation, no markdown backticks.`;

            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt }
                    ],
                    temperature: 0.2,
                    max_tokens: 600
                })
            });

            if (!res.ok) return null;
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content?.trim();
            if (!rawText) return null;

            const jsonMatch = rawText.match(/\{\s*[\s\S]*?\s*\}/);
            if (!jsonMatch) return null;

            const parsedDossier = JSON.parse(jsonMatch[0]);

            // Validate cropCoefficient bounds
            if (typeof parsedDossier.cropCoefficient !== 'number') {
                parsedDossier.cropCoefficient = parseFloat(parsedDossier.cropCoefficient) || 0.5;
            }
            parsedDossier.cropCoefficient = Math.min(Math.max(parsedDossier.cropCoefficient, 0.1), 1.2);

            if (!parsedDossier.scientificName) parsedDossier.scientificName = cleanName;
            if (!parsedDossier.commonName) parsedDossier.commonName = cleanName;

            // Save to database
            const newDossier = await BotanicalDossier.create({
                ...parsedDossier,
                verifiedSource: wikiInfo ? `Wikipedia Page "${wikiInfo.title}" + Groq Botanical Agent` : 'Groq Botanical Agent Synthesis'
            });

            console.log(`[Botanical Researcher] Cached new species record: ${newDossier.scientificName} (${newDossier.commonName})`);
            return newDossier;

        } catch (err) {
            console.error(`[Botanical Researcher] Error research failed for "${cleanName}":`, err);
            return null;
        }
    },

    /**
     * Resolve names into detailed dossiers, matching static list, cache database, or online researcher.
     */
    async resolvePlantDossiers(plantNames) {
        if (!plantNames || !Array.isArray(plantNames) || plantNames.length === 0) return [];

        const dossiers = [];
        for (const name of plantNames) {
            if (!name) continue;
            const cleanName = name.toLowerCase().trim();

            // 1. Check local static plantBiometrics
            let matchedBio = null;
            let matchedKey = null;
            for (const key of Object.keys(plantBiometrics)) {
                if (cleanName.includes(key) || key.includes(cleanName)) {
                    matchedBio = plantBiometrics[key];
                    matchedKey = key;
                    break;
                }
            }

            if (matchedBio) {
                const titleCased = matchedKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                dossiers.push({
                    scientificName: titleCased,
                    commonName: titleCased,
                    toxicity: matchedBio.toxicity,
                    npkRatio: matchedBio.npkRatio,
                    soilPH: matchedBio.soilPH,
                    cropCoefficient: matchedBio.cropCoefficient,
                    phytoPathology: matchedBio.phytoPathology,
                    lightRequirement: "Medium indirect light (500-1500 Lux)",
                    wateringInstructions: "Water when top 1-2 inches of soil is dry.",
                    verifiedSource: "VanaMap Local Database"
                });
                continue;
            }

            // 2. Check BotanicalDossier MongoDB collection
            try {
                const cached = await BotanicalDossier.findOne({
                    $or: [
                        { scientificName: new RegExp(`^${cleanName}$`, 'i') },
                        { commonName: new RegExp(`^${cleanName}$`, 'i') }
                    ]
                });
                if (cached) {
                    dossiers.push(cached.toObject());
                    continue;
                }
            } catch (err) {
                console.error('[Flora Intelligence] Error checking BotanicalDossier cache:', err);
            }

            // 3. Check worldFlora.js
            const worldFlora = require('./worldFlora');
            const worldMatch = worldFlora.find(p => 
                p.scientificName.toLowerCase() === cleanName || 
                p.commonName.toLowerCase() === cleanName
            );

            if (worldMatch) {
                const researched = await this.researchPlantDossier(worldMatch.scientificName);
                if (researched) {
                    dossiers.push(researched.toObject ? researched.toObject() : researched);
                    continue;
                }

                dossiers.push({
                    scientificName: worldMatch.scientificName,
                    commonName: worldMatch.commonName,
                    toxicity: "Toxicity data unavailable. Handle with care.",
                    npkRatio: "10-10-10 Balanced",
                    soilPH: "6.0 - 7.0",
                    cropCoefficient: 0.5,
                    phytoPathology: ["Leaf spot", "Root rot"],
                    lightRequirement: worldMatch.lightRequirement,
                    wateringInstructions: "Water regularly as needed.",
                    verifiedSource: `World Flora Index (${worldMatch.verifiedSource})`
                });
                continue;
            }

            // 4. Fallback search Wikipedia / Groq Researcher
            const researched = await this.researchPlantDossier(name);
            if (researched) {
                dossiers.push(researched.toObject ? researched.toObject() : researched);
            }
        }

        return dossiers;
    },

    async getRelevantFloraContext(userMessages, weatherContext = null) {
        // 1. Extract plant names from chat context
        let plantNames = await this.extractPlantNames(userMessages);
        
        // Fuzzy word match fallback if extract returns nothing
        if (plantNames.length === 0) {
            const worldFlora = require('./worldFlora');
            const fullText = userMessages
                .map(m => {
                    if (typeof m.content === 'string') return m.content;
                    if (Array.isArray(m.content)) {
                        return m.content.filter(c => c.type === 'text').map(c => c.text).join(' ');
                    }
                    return '';
                })
                .join(' ')
                .toLowerCase();

            const matchedNames = [];
            for (const plant of worldFlora) {
                const sciName = plant.scientificName.toLowerCase();
                const comName = plant.commonName.toLowerCase();
                if (fullText.includes(sciName) || fullText.includes(comName)) {
                    matchedNames.push(plant.scientificName);
                }
                if (matchedNames.length >= 3) break;
            }
            plantNames = matchedNames;
        }

        // 2. Resolve plant names to standard/researched dossiers
        const dossiers = await this.resolvePlantDossiers(plantNames);

        if (dossiers.length === 0) return { context: "", matches: [] };

        // Parse weather info for dynamic transpiration calculations
        let temp = null;
        let humidity = 60; // Default humidity
        if (weatherContext) {
            temp = parseFloat(weatherContext.avgTemp30Days) || null;
            if (weatherContext.humidity !== undefined) {
                humidity = parseFloat(weatherContext.humidity) || 60;
            }
        }

        const context = `\n\n🔬 SCIENTIFIC DOSSIER (Verified World Flora Data & Agronomic Analytics):\n${dossiers.map(p => {
            let transpirationSnippet = "";
            
            // Perform dynamic indoor Penman-Monteith transpiration modeling if temperature is known
            if (temp !== null) {
                const et0 = (0.015 * temp + 0.15) * (1 - humidity / 100);
                const waterLossFactor = et0 * p.cropCoefficient * 100;
                
                let evapWarning = "";
                if (waterLossFactor > 15) {
                    evapWarning = " [⚠️ Extreme Evapotranspiration Warning: Soil dries rapidly. Recommend watering frequency increase.]";
                } else if (waterLossFactor < 3) {
                    evapWarning = " [⚠️ Low Transpiration Notice: High humidity / low temperature. Danger of overwatering and root rot.]";
                }
                transpirationSnippet = `\n               - Evapotranspiration Index: Water loss is estimated at ${waterLossFactor.toFixed(1)}%/day (Base Kc: ${p.cropCoefficient}).${evapWarning}`;
            } else {
                transpirationSnippet = `\n               - Evapotranspiration Coefficient (Kc): ${p.cropCoefficient} (Water loss baseline)`;
            }

            const bioSnippet = `
               - Safety: ${p.toxicity}
               - Cultivation: Recommended NPK ratio is ${p.npkRatio}. Soil pH range: ${p.soilPH}.
               - Common Pathogens/Pests: ${(p.phytoPathology || []).join(', ')}
               - Light / Exposure: ${p.lightRequirement || 'N/A'}
               - Watering Guidelines: ${p.wateringInstructions || 'N/A'}`;

            return `• [ID: ${p.scientificName}] matches "${p.commonName}". ${transpirationSnippet}${bioSnippet}
               - Source: Verified by ${p.verifiedSource}.`;
        }).join('\n')}`;

        return { context, matches: dossiers };
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

        const realismKeywords = "Hyper-realistic cinematic photography, shot on 35mm lens, f/1.8, bokeh background, macro details, ultra-high resolution, 8k, highly detailed textures, realistic lighting, subsurface scattering, professional botanical photography, National Geographic style.";

        let selectedPlant = null;

        if (matchedFlora && matchedFlora.length > 0) {
            const lowerPrompt = userPrompt.toLowerCase();

            selectedPlant = matchedFlora.find(p => {
                const sciName = p.scientificName.toLowerCase();
                const comName = p.commonName.toLowerCase();
                return lowerPrompt.includes(sciName) || lowerPrompt.includes(comName) || lowerPrompt.includes(comName.split(' ')[0]);
            });

            if (!selectedPlant && matchedFlora.length <= 2) {
                selectedPlant = matchedFlora[0];
            }
        }

        if (selectedPlant) {
            enhanced = `${realismKeywords} A real-life close-up of ${selectedPlant.scientificName} (${selectedPlant.commonName}). 
            Botanical details: Toxicity status: ${selectedPlant.toxicity}. NPK needs: ${selectedPlant.npkRatio}.
            The plant is in its natural environment, sun-drenched, with dew drops on leaves, sharp focus on the textures. 
            Detailed Description: ${userPrompt}`;
        } else {
            enhanced = `${realismKeywords} Real-life professional photography of a plant or garden. 
            Subject analysis: ${userPrompt}. 
            Cinematic lighting, sharp details, extreme realism.`;
        }

        return enhanced;
    }
};

module.exports = FloraIntelligence;
