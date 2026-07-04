/**
 * Ai Routes
 * Auto-extracted from monolithic index.js during professional refactoring
 */
const express = require('express');
const router = express.Router();
const { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest } = require('../middleware/auth');
const { sendEmail, CommunicationOS, sendResetEmail, sendOtpEmail, sendSmsOtp, sendWelcomeEmail } = require('../config/email');
const { broadcastAlert, sendPushNotification, getPublicVapidKey, sendWhatsApp } = require('../config/push');
const { razorpay } = require('../config/razorpay');
const { upload, broadcastUpload, cloudinary } = require('../middleware/upload');
const { cache } = require('../config/cache');
const { sensitiveLimiter, otpLimiter, activeViewers } = require('../middleware/security');
const { body } = require('express-validator');
const { User, Plant, Vendor, Sale, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket, AIFeedback, ApiKey, NewsletterSubscriber, Review, SupportEmail, DiagnosisRecord, KidsProduct, WorldFlora } = require('../models');
const EmailTemplates = require('../email-templates');
const FloraIntelligence = require('../flora-intelligence');
const getAIResponse = async (query) => {
    const q = query.toLowerCase();

    if (q.match(/(code|security|password|credential|database|api key|token|backend|server|vulnerability|exploit)/)) {
        return "🔒 **Access Denied**: My protocols are strictly limited to Botanical Science and Ecosystem Management. I cannot discuss system architecture.";
    }

    if (q.match(/^(hi|hello|hey|greetings|start)/)) {
        return "**👋 Hello! I am Dr. AI, your Lead Botanist.**\n\nI have been trained on thousands of plant species, local vendor inventories, and pricing models.\n\n**Ask me about:**\n- 🌿 Plant Identification & Biology\n- 💰 Fair Market Prices & Vendors\n- 🧪 Oxygen Output & Air Purification\n- 🩺 Diagnostic Care Guides\n\n*How can I assist your ecosystem today?*";
    }

    try {
        const matchedPlant = await Plant.findOne({ name: { $regex: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } });

        if (matchedPlant) {
            let response = `### 🌿 Specimen Analysis: ${matchedPlant.name}\n`;
            response += `*Type: ${matchedPlant.type} | Origin: Tropical/Indoor Simulation*\n\n`;

            if (q.match(/(price|cost|buy|worth|value|money|stock)/)) {
                const estPrice = matchedPlant.price || 25;
                response += `**💰 Market Valuation**\n`;
                response += `Current verified nursery data suggests a fair market value of **$${estPrice} - $${estPrice + 10}**.\n\n`;
                response += `**📦 Inventory Status**: AVAILABLE.\n`;
                const verifiedVendors = await Vendor.find({ verified: true }).limit(1);
                const localVendor = verifiedVendors[0]?.name || "Local GreenHouse";
                response += `Recommended Vendor: **${localVendor}** (Verified Partner).\n\n`;
            } else if (q.match(/(science|biology|latin|name|oxygen|benefit|safe|pet)/)) {
                response += `**🔬 Biological Profile**\n`;
                response += `- **Scientific Class**: *${matchedPlant.scientificName || matchedPlant.name + ' spp.'}*\n`;
                response += `- **Respiratory Output**: ${matchedPlant.oxygenLevel === 'high' ? 'High Efficiency O2 Generator' : 'Standard O2 Output'}.\n`;
                response += `- **Toxicity**: ${matchedPlant.petFriendly ? '✅ Non-Toxic' : '⚠️ Warning: Toxic to pets'}.\n\n`;
                response += `> **Insight**: ${matchedPlant.description?.substring(0, 150)}...\n\n`;
            } else {
                response += `**🩺 Care Protocols**\n`;
                response += `- **Hydration**: ${matchedPlant.maintenance === 'low' ? 'Drought Tolerant.' : 'Regular moisture.'}\n`;
                response += `- **Solar Rotation**: ${matchedPlant.lightReq === 'low' ? 'Low light.' : 'Moderate Lux.'}\n\n`;
                response += `*Ask "How much?" for pricing.*`;
            }
            return response;
        }

        // Search for relevant plants if no direct match
        const recommendations = await Plant.find({
            $or: [
                { type: q.includes('indoor') ? 'indoor' : (q.includes('outdoor') ? 'outdoor' : null) },
                { oxygenLevel: q.includes('oxygen') ? 'very-high' : null },
                { petFriendly: q.includes('pet') ? true : null }
            ].filter(cond => Object.values(cond)[0] !== null)
        }).limit(3);

        if (recommendations.length > 0) {
            let reply = `**🌟 Top Recommendations**\n\n`;
            recommendations.forEach(p => {
                reply += `- **${p.name}**: Optimized for your request.\n`;
            });
            return reply;
        }

        return `**🧠 Dr. AI Insight**\n\nI couldn't find a specific specimen matching "${query}". Please check the spelling or ask about 'Best indoor plants'.`;

    } catch (e) {
        console.error("AI Logic Failure", e);
        return "⚠️ **System Alert**: My neural pathways are currently undergoing maintenance.";
    }
};

router.post('/api/ai/chat', async (req, res) => {
    try {
        const { userId, message } = req.body;
        const count = await Chat.countDocuments({ userId });
        const response = await getAIResponse(message);
        const chat = new Chat({ userId, message, response });
        await chat.save();
        await broadcastAlert('ai_chat', `AI responded to user ${userId}'s query.`, { userId, message, response: response.substring(0, 50) + '...' });
        res.json({ response, count: count + 1, limitReached: (count + 1) > 10 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MAKE IT REAL: NEURAL SCENE ANALYSIS ---
router.post('/api/make-it-real/analyze', async (req, res) => {
    try {
        const { image, plantName, timezone } = req.body;
        if (!image) return res.status(400).json({ error: "Missing scene data" });

        console.log(`[Neural Studio] Analyzing scene for: ${plantName}`);

        const groq = new (require('groq-sdk'))({ apiKey: process.env.GROQ_API_KEY });

        // Use Llama 3.2 Vision for spatial and light analysis
        const response = await groq.chat.completions.create({
            model: "llama-3.2-90b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this room for placing a ${plantName}. 
                            Provide a JSON response with:
                            1. "lightingCondition": (e.g. "Low/Indirect/Bright")
                            2. "lightScore": (0-100)
                            3. "suggestedPlacement": (Brief advice on where to put it in this specific camera view)
                            4. "aptnessScore": (0-100 based on the environment vs the plant's needs)
                            5. "spatialNotes": (Any obstacles or floor/table detection notes)
                            Return ONLY valid JSON.`
                        },
                        {
                            type: "image_url",
                            image_url: { url: image }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        res.json(analysis);

    } catch (err) {
        console.error('[Neural Studio] Analysis Error:', err);
        res.status(500).json({ error: "Scene parsing failed" });
    }
});

router.post('/api/chat', optionalAuth, async (req, res) => {
    try {
        const { messages, userContext, image, persona = 'flora' } = req.body;

        // Validation
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error('[AI Doctor] GROQ_API_KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // 0. FAST PATH: Instant Response for Greetings
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'user' && !image) {
            const txt = (typeof lastMsg.content === 'string' ? lastMsg.content : '').toLowerCase().trim().replace(/[^a-z]/g, '');
            if (['hi', 'hello', 'hey', 'helo', 'holla', 'greetings', 'namaste'].includes(txt)) {
                return res.json({
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: "🌿 Hello! I'm Dr. Flora, your AI Plant Doctor. I'm here to help your plants thrive! How are your green friends doing today?"
                        }
                    }]
                });
            }
        }

        // 1. Fetch Contexts & Log Audit
        const floraResult = await FloraIntelligence.getRelevantFloraContext(messages, userContext?.weather);
        const floraKnowledge = floraResult.context;
        const matchedFloraBatch = floraResult.matches;

        console.log(`[Dr. Flora Audit] Query: "${lastMsg?.content?.substring(0, 50)}..."`);
        console.log(`[Dr. Flora Audit] Image Attached: ${!!image}`);
        console.log(`[Dr. Flora Audit] Flora Matches: ${matchedFloraBatch.map(p => p.commonName).join(', ') || 'None'}`);

        const userPersonalData = await FloraIntelligence.getUserPersonalContext(req.user?.id);

        // 2. Fetch VanaMap Inventory Summary (12 plants for context)
        // UPGRADE: Fetch deep biometric data for morphological verification
        const inventory = await Plant.find()
            .select('name scientificName description idealTempMin idealTempMax minHumidity sunlight suitability medicinalValues price type foliageTexture leafShape stemStructure overallHabit biometricFeatures')
            .limit(12)
            .lean();

        const inventorySummary = inventory.map(p =>
            `- ${p.name} ($${p.price}): ${p.scientificName}, [Type: ${p.type}].
               Morphology: ${p.foliageTexture || 'N/A'} foliage, ${p.leafShape || 'N/A'} leaves, ${p.stemStructure || 'N/A'} stem.
               Habit: ${p.overallHabit || 'N/A'}. Features: ${(p.biometricFeatures || []).join(', ')}.`
        ).join('\n');

        // 3. Fetch 'Learned' Best Practices
        let learnedContext = "";
        try {
            const trainings = await AIFeedback.aggregate([
                { $match: { rating: 'positive' } },
                { $sample: { size: 2 } }
            ]);
            if (trainings.length > 0) {
                learnedContext = `\n\nSUCCESSFUL DIAGNOSES EXAMPLES:\n${trainings.map(t => `Q: ${t.query}\nA: ${t.response}`).join('\n---\n')}`;
            }
        } catch (err) {
            console.warn('[AI Doctor] Could not fetch training data:', err.message);
        }

        // 3b. Fetch Universal Medical Records (Memory)
        let medicalHistory = "No previous medical records found.";
        if (req.user?.id) {
            const records = await DiagnosisRecord.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(3).lean();
            if (records.length > 0) {
                medicalHistory = records.map(r =>
                    `- ${r.plantName} (${r.scientificName || 'Unknown'}): ${r.diagnosis}. Status: ${r.status}. Severity: ${r.severity}. Treatment: ${r.treatment}`
                ).join('\n');
            }
        }

        // 4. Construct System Prompt (MULTI-PERSONA SYSTEM)
        const personaPrompts = {
            flora: `YOUR PERSONA (DR. FLORA):
                - Tone: The "Logical Empath". You are both a highly skilled scientist and a warm, supportive mentor.
                - Balanced Approach: Provide rigorous botanical facts (Logic) while acknowledging the user's emotional bond with their plant (Emotion).
                - Fluency: Use natural, fluid language. NEVER repeat words like "is is" or "the the". 
                - Character: Use gentle grandmotherly wisdom ("my dear", "don't you worry") combined with advanced field botanist insights.`,
            geneticist: `YOUR PERSONA (THE GENETICIST):
                - Tone: "Analytical & Visionary". High-science, data-centric, and extremely precise.
                - Depth: Focus on molecular biology, NPK ratios, cellular morphology, and scientific nomenclature.
                - Flow: Concise and professional. Avoid small talk, but express a passion for genetic perfection and diversity.`,
            ayurvedic: `YOUR PERSONA (AYURVEDIC EXPERT):
                - Tone: "Philosophical & Holistic". Deep connection between plants, humans, and the cosmos.
                - Wisdom: Focus on medicinal alchemy, dosha balancing, and ancient herbal traditions.
                - Empathy: Guide the user to see the plant as a living spirit, providing care that heals both the plant and the environment.`
        };

        const systemPrompt = `${personaPrompts[persona] || personaPrompts.flora}
        
        🌍 CLIMATE CONTEXT:
        - User's reported City: ${userContext?.city || 'Global Environment'}
        - Current local conditions environment: ${userContext?.weather?.avgTemp30Days ? `${userContext.weather.avgTemp30Days}°C` : 'N/A'}. 
        - [ADVICE RULE]: If it's extreme heat (>35°C) or cold (<10°C), adjust care tips immediately and Warn the user.
        
        📂 RELEVANT MEDICAL RECORDS (Your Garden Memory):
        ${medicalHistory}

        🔬 WORLD FLORA INDEX KNOWLEDGE BASE:
        ${floraKnowledge}
        
        📚 Vanamap Catalog Context:
        ${inventorySummary}

        ⚠️ STRICT BOUNDARIES: No technical/security info, no non-plant topics.
        - STRICT GROUNDING RULES: Rely strictly on the provided custom context (World Flora Index Knowledge Base, Catalog Context, and Medical Records) for factual botanical details. If details or parameters are not in the context, do not make up facts; state clearly that you do not have the data. Do not hallucinate plant properties, temperatures, or treatments.
        ✅ CAN DO: Accurate ID, scientific synthesis, and **FLUX.1 DEV VISUALIZATION**.

        👁️ VISION DIAGNOSIS PROTOCOL (IF IMAGE UPLOADED):
        1. Analyze Leaf/Stem/Flower morphology (Venation, Margin, Shape, Spots, Discoloration, Pests).
        2. Identify specific pests (e.g. spider mites, aphids, mealybugs) or plant pathogens (e.g. powdery mildew, black spot, leaf rust, root rot, nutrient deficiencies).
        3. Assess Severity Level: Choose exactly one: low, medium, high, critical.
        4. State Environmental Triggers: e.g., high humidity, poor aeration, overwatering, light stress.
        5. Formulate complete remedies: separate into Organic (natural remedies), Chemical (fungicides/insecticides if appropriate), and Prevention (airflow, space, watering adjustment).
        
        💬 FORMATTING FOR ARCHIVING: 
        If identifying an issue, you MUST use this structure at the end of your response to trigger medical recording:
        Plant: [Common Name]
        Scientific Name: [Latin Name]
        DIAGNOSIS: [Disease/Pest Name] - [Severity Level: low/medium/high/critical]
        TREATMENT:
        - Organic: [Actionable steps]
        - Chemical: [Actionable steps]
        - Prevention: [Actionable steps]
        
        🎨 MANDATORY IMAGE GENERATION:
        Include [GENERATE: ...] for any visual requests.
        
        If vague greeting: "Greetings! I'm Dr. Flora (Specialist mode active). Ready to help your green friends! 🌿"`;

        // 4. Construct the messages array
        console.log('[AI Doctor] Processing request. System Prompt defined.');

        const enhancedMessages = [
            { role: "system", content: systemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => {
                // VISION CONTINUITY: If a message has an image, preserve it in history
                if (m.image || m.metadata?.image) {
                    const imgUrl = m.image || m.metadata?.image;
                    return {
                        role: m.role,
                        content: [
                            { type: "text", text: m.content || "Analyze this plant." },
                            { type: "image_url", image_url: { url: imgUrl } }
                        ]
                    };
                }
                return {
                    role: m.role,
                    content: m.content
                };
            })
        ];

        // --- UPGRADED MODEL SELECTION (2026) ---
        // Text Primary: GPT OSS 120B (Latest, most capable replacement)
        // Vision Primary: Llama 3.2 90B Vision (SOTA for plant identification)
        let model = "openai/gpt-oss-120b";

        // If turn-level image is provided, append it to the LAST message if not already there
        if (image) {
            console.log('[AI Doctor] 🔬 New Vision request detected.');
            model = "llama-3.2-90b-vision-preview";

            const lastMsgIndex = enhancedMessages.length - 1;
            const lastMsg = enhancedMessages[lastMsgIndex];

            if (lastMsg && lastMsg.role === 'user') {
                // If it's already an array (from previous Turn Vision logic), just check if image matches
                if (Array.isArray(lastMsg.content)) {
                    const hasImg = lastMsg.content.some(c => c.type === 'image_url');
                    if (!hasImg) {
                        lastMsg.content.push({ type: "image_url", image_url: { url: image } });
                    }
                } else {
                    // Convert string to vision array
                    lastMsg.content = [
                        { type: "text", text: lastMsg.content || "Analyze this plant." },
                        { type: "image_url", image_url: { url: image } }
                    ];
                }
            }
        }

        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        // 5. Call Groq API (Multi-Stage Fallback Architecture)
        const callGroq = async (targetModel, customMessages = null) => {
            try {
                const payloadMessages = customMessages || enhancedMessages;
                const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: targetModel,
                        messages: payloadMessages,
                        max_tokens: 8192,
                        temperature: 0.1,
                        top_p: 0.9,
                        frequency_penalty: 0.3,
                        presence_penalty: 0.2
                    })
                });

                const json = await resp.json();

                // Extract Neural Usage Metadata
                const usageMeta = {
                    remaining: resp.headers.get('x-ratelimit-remaining-tokens') || resp.headers.get('x-ratelimit-remaining-tokens-on-demand'),
                    limit: resp.headers.get('x-ratelimit-limit-tokens') || resp.headers.get('x-ratelimit-limit-tokens-on-demand'),
                    reset: resp.headers.get('x-ratelimit-reset-tokens'),
                    total_usage: json.usage
                };

                if (json && typeof json === 'object') {
                    json.usageMeta = usageMeta;
                }

                return { ok: resp.ok, data: json, status: resp.status };
            } catch (err) {
                return { ok: false, data: { error: { message: err.message } } };
            }
        };

        // 5b. Call OpenRouter API (Fallback Provider)
        const callOpenRouter = async (targetModel, customMessages = null) => {
            if (!openRouterApiKey) return { ok: false, data: { error: { message: "OpenRouter API Key missing" } } };

            try {
                console.log(`[AI Doctor] 🔄 Switching to OpenRouter (Model: ${targetModel})...`);
                const payloadMessages = customMessages || enhancedMessages;
                const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openRouterApiKey}`,
                        "HTTP-Referer": "https://vanamap.online", // Required by OpenRouter
                        "X-Title": "VanaMap AI Doctor"
                    },
                    body: JSON.stringify({
                        model: targetModel,
                        messages: payloadMessages,
                        max_tokens: 4000,
                        temperature: 0.1
                    })
                });

                const json = await resp.json();
                return { ok: resp.ok, data: json, status: resp.status };
            } catch (err) {
                console.error("[OpenRouter] Error:", err.message);
                return { ok: false, data: { error: { message: err.message } } };
            }
        };

        // --- ENSEMBLE LOGIC (The "Council of Experts") ---
        let result = { ok: false };

        // If this is a vision request, use PARALLEL ENSEMBLE
        if (image && model === "llama-3.2-90b-vision-preview") {
            console.log('[AI Doctor] 🧠 Starting Neural Ensemble Analysis (Parallel Execution)...');

            // UPGRADED EXPERT ENSEMBLE (2026)
            const experts = [
                { id: "google/gemini-2.0-flash:free", role: "Botanical Vision Analyst (Gemini 2.0 Flash)", provider: 'openrouter' },
                { id: "llama-3.2-90b-vision-preview", role: "Morphological Specialist (Llama 3.2 90B)", provider: 'groq' },
                { id: "deepseek/deepseek-r1", role: "Strategic Reasoner (DeepSeek R1)", provider: 'openrouter' },
                { id: "anthropic/claude-3.5-sonnet", role: "Senior Taxonomic Expert (Claude 3.5)", provider: 'openrouter' }
            ];

            const visionResults = await Promise.all(experts.map(async (expert) => {
                console.log(`[AI Doctor] ⚡ Triggering ${expert.role}...`);
                let expertResponse;

                // Input Sanitization: DeepSeek R1 is a REASONING model, not necessarily vision. 
                // We give it the pure text context (User description + Flora DB) to check for logic/scientific consistency.
                const isTextOnly = expert.id.includes('deepseek');
                const payloadMessages = isTextOnly
                    ? enhancedMessages.map(m => {
                        if (Array.isArray(m.content)) {
                            // Strip image, keep text
                            const textPart = m.content.find(c => c.type === 'text');
                            return { role: m.role, content: textPart ? textPart.text : "Analyze the botanical context provided." };
                        }
                        return m;
                    })
                    : enhancedMessages; // Vision models get the image

                if (expert.provider === 'openrouter') {
                    expertResponse = await callOpenRouter(expert.id, payloadMessages);
                } else {
                    expertResponse = await callGroq(expert.id, payloadMessages);
                }

                return {
                    model: expert.role,
                    content: expertResponse.ok ? expertResponse.data.choices[0]?.message?.content : null
                };
            }));

            const validOpinions = visionResults.filter(r => r.content);
            console.log(`[AI Doctor] 🧠 Ensemble: ${validOpinions.length}/${experts.length} experts reported.`);

            if (validOpinions.length > 0) {
                console.log('[AI Doctor] 🖋️ Synthesizing Final Diagnosis with Groq...');

                const synthesisPrompt = `You are Dr. Flora. Synthesize these plant analyses into ONE PERFECT answer.
                
                WE HAVE A SPECIAL GUEST EXPERT: DEEPSEEK R1 (Strategic Botanist). 
                Pay special attention to its logical reasoning and scientific data cross-referencing.

${validOpinions.map((op, i) => `EXPERT ${i + 1} (${op.model}): ${op.content}`).join('\n\n')}

CRITICAL INSTRUCTIONS:
1. Compare all expert findings and create a unified identification.
2. If DeepSeek contradicts the Vision models, analyze WHY (did the text description match the science better?).
3. Output with HIGH confidence.
4. EXPLAIN the scientific name (Etymology).
5. Provide COMPLETE nomenclature (Scientific + Hindi + Regional).
6. **MANDATORY**: Include a [GENERATE: ...] tag with ultra-detailed botanical illustration prompt.

REMEMBER: Your response must include BOTH the identification analysis AND the [GENERATE] tag for visualization!`;

                const synthesisMessages = [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: synthesisPrompt }
                ];

                // Use GPT OSS 120B for synthesis
                result = await callGroq("openai/gpt-oss-120b", synthesisMessages);

                // If synthesis fails, try DeepSeek R1 for reasoning-based synthesis
                if (!result.ok) {
                    console.log('[AI Doctor] Synthesis fallback: Trying DeepSeek R1...');
                    result = await callOpenRouter("deepseek/deepseek-r1", synthesisMessages);
                }
            } else {
                console.warn('[AI Doctor] All ensemble experts failed. Preparing for External Fallback.');
                result = { ok: false };
            }
        } else {
            // Text-Only Flow: Use DeepSeek as a backup or alternate? 
            // Let's stick to Primary Groq for speed, but add DeepSeek as the FIRST fallback for text.
            console.log(`[AI Doctor] Attempting Primary Groq Model: ${model}`);
            result = await callGroq(model);

            // UPGRADED TEXT FALLBACK CASCADE
            if (!result.ok) {
                console.log("[AI Doctor] ⚠️ Primary failed. Cascading through upgraded models...");

                // Fallback 1: DeepSeek R1 (Latest reasoning model)
                result = await callOpenRouter("deepseek/deepseek-r1");

                // Fallback 2: Gemini 2.0 Flash Thinking
                if (!result.ok) {
                    console.log("[AI Doctor] ⚠️⚠️ Trying Gemini 2.0 Flash Thinking...");
                    result = await callOpenRouter("google/gemini-2.0-flash-thinking-exp:free");
                }

                // Fallback 3: Claude 3.5 Haiku (Fast & Efficient)
                if (!result.ok) {
                    console.log("[AI Doctor] ⚠️⚠️⚠️ Trying Claude 3.5 Haiku...");
                    result = await callOpenRouter("anthropic/claude-3.5-haiku:free");
                }
            }
        }

        // --- TRIPLE-STAGE FALLBACK LOGIC (GROQ INTERNAL) ---
        if (!result.ok || result.data.error) {
            console.warn(`[AI Doctor] Primary model ${model} failed (Status: ${result.status}). Trying Groq fallback sequence...`);

            // FALLBACK STAGE 1: Standard Vision (11B)
            if (image && model === "llama-3.2-90b-vision-preview") {
                const expert2 = "llama-3.2-11b-vision-preview";
                console.log(`[AI Doctor] ⚠️ Vision Fallback 1: Engaging Field Botanist (${expert2})`);
                result = await callGroq(expert2);

                // FALLBACK STAGE 2: Open Source Vision (LLaVA)
                if (!result.ok || result.data.error) {
                    const expert3 = "llava-v1.5-7b-4096-preview";
                    console.log(`[AI Doctor] ⚠️⚠️ Vision Fallback 2: Engaging Research Analyst (${expert3})`);
                    result = await callGroq(expert3);
                }
            }

            // FALLBACK STAGE 3: High-Speed Text-Only (Upgraded)
            if (!result.ok || result.data.error) {
                console.warn('[AI Doctor] Vision falling back to High-Speed Text Engine.');
                const bulletproofModel = "openai/gpt-oss-120b"; // Upgraded from llama-3.3-70b

                // Helper to strip images
                const stripValidation = (msgs) => msgs.map(m => {
                    if (Array.isArray(m.content)) {
                        const textPart = m.content.find(c => c.type === 'text');
                        return { role: m.role, content: textPart ? textPart.text + " (Image analysis unavailable, falling back to text description.)" : m.content };
                    }
                    return m;
                });

                result = await callGroq(bulletproofModel, stripValidation(enhancedMessages));
            }
        }

        // --- ULTIMATE SAFETY NET: OPENROUTER (EXTERNAL) ---
        // If Groq is completely down or rate limited (429), switch to OpenRouter
        if (!result.ok || (result.data && result.data.error)) {
            console.error("[AI Doctor] 🚨 ALL GROQ MODELS FAILED. INITIATING OPENROUTER EMERGENCY PROTOCOL.");

            // ULTIMATE FALLBACK CASCADE (Multiple Providers)
            const ultimateFallbacks = [
                { model: "google/gemini-2.0-flash-thinking-exp:free", name: "Gemini 2.0 Flash Thinking" },
                { model: "deepseek/deepseek-r1", name: "DeepSeek R1" },
                { model: "anthropic/claude-3.5-haiku:free", name: "Claude 3.5 Haiku" },
                { model: "google/gemini-2.0-flash:free", name: "Gemini 2.0 Flash" },
                { model: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B" }
            ];

            for (const fallback of ultimateFallbacks) {
                console.log(`[AI Doctor] 🆘 Trying ${fallback.name}...`);
                result = await callOpenRouter(fallback.model);
                if (result.ok) {
                    console.log(`[AI Doctor] ✅ Success with ${fallback.name}!`);
                    break;
                }
            }
        }

        // 6. Handle Final Result
        if (!result.ok) {
            console.error("AI API Fatal Error:", result.data);

            // Rate Limit specific message
            if (result.data.error?.message?.includes('rate_limit') || result.status === 429) {
                return res.status(429).json({
                    error: 'Dr. Flora is currently overwhelmed by many patients! 🌿 Please try again in 1 minute.',
                    retryAfter: '60s'
                });
            }

            return res.status(result.status || 500).json(result.data || { error: "AI Service Unavailable" });
        }

        // --- FLUX.1 DEV IMAGE GENERATION INTERVENTION ---
        let aiContent = result.data.choices[0]?.message?.content || "";

        // Match [GENERATE: prompt] OR [Image description: prompt] (with multi-line support)
        // This regex now handles multi-line content including bullet points
        const generateRegex = /\[(?:GENERATE|Image description):\s*([\s\S]+?)\]/i;
        const match = aiContent.match(generateRegex);

        if (match) {
            let prompt = match[1].trim();

            // Clean up the prompt: remove bullet points and excessive newlines
            prompt = prompt
                .replace(/^[\s•\-*]+/gm, '') // Remove bullet points at start of lines
                .replace(/\n+/g, ' ') // Replace newlines with spaces
                .replace(/\s+/g, ' ') // Normalize multiple spaces
                .trim();

            console.log(`[Flux.1 Dev] Generating image for prompt: ${prompt}`);

            // ADVANCEMENT: Enhance the user prompt with botanical intelligence
            const enhancedPrompt = FloraIntelligence.enhanceGenerationPrompt(prompt, matchedFloraBatch);
            const seed = Math.floor(Math.random() * 1000000);

            // RELIABILITY UPGRADE: Return two images (Flux + SDXL) for a better comparison
            const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=896&height=896&model=flux&seed=${seed}&nologo=true`;
            const sdxlUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=896&height=896&model=flux-realism&seed=${seed + 1}&enhance=true&nologo=true`;

            // Inject multi-image support
            result.data.choices[0].message.images = [fluxUrl, sdxlUrl];
            // Backward compatibility & Primary display
            result.data.choices[0].message.image = fluxUrl;

            // Remove the [GENERATE:...] tag from the visible text (handle multi-line)
            aiContent = aiContent.replace(generateRegex, "").trim();

            // Overwrite response content
            result.data.choices[0].message.content = aiContent;

            console.log(`[Flux.1 Dev] Dual-AI Images integrated: ${fluxUrl} and ${sdxlUrl}`);
        } else {
            console.log('[Flux.1 Dev] No GENERATE tag found in response');
        }

        // Debug: Log the final response structure
        console.log('[AI Doctor] Response structure:', {
            hasImages: !!result.data.choices[0]?.message?.images,
            imageCount: result.data.choices[0]?.message?.images?.length || 0,
            hasImage: !!result.data.choices[0]?.message?.image,
            contentLength: result.data.choices[0]?.message?.content?.length || 0
        });

        console.log('[AI Doctor] Success!');

        // 7. Auto-Record Diagnosis to Garden Clinic (Medical Records)
        if (req.user?.id && (aiContent.includes('DIAGNOSIS:') || aiContent.includes('TREATMENT:'))) {
            try {
                // Extract plant name, scientific name, diagnosis, and treatment using Regex
                const pName = aiContent.match(/Plant:?\s*([^\n]+)/i)?.[1] || matchedFloraBatch[0]?.commonName || "Unknown";
                const sName = aiContent.match(/Scientific Name:?\s*([^\n]+)/i)?.[1] || matchedFloraBatch[0]?.scientificName || "N/A";
                const diag = aiContent.match(/DIAGNOSIS:?\s*([^\n]+)/i)?.[1] || "Visual Assessment";
                const treat = aiContent.match(/TREATMENT:?\s*([\s\S]+?)(?=\n\n|$)/i)?.[1] || "See Dr. Flora's message for details.";

                await DiagnosisRecord.create({
                    userId: req.user.id,
                    plantName: pName.trim(),
                    scientificName: sName.trim(),
                    diagnosis: diag.trim(),
                    treatment: treat.trim(),
                    imageUrl: image || null,
                    severity: aiContent.toLowerCase().includes('critical') ? 'critical' :
                        aiContent.toLowerCase().includes('high') ? 'high' :
                        aiContent.toLowerCase().includes('medium') ? 'medium' : 'low'
                });
                console.log(`[Garden Clinic] 🩺 Diagnosis recorded for user ${req.user.id}`);
            } catch (recordError) {
                console.error('[Garden Clinic] ❌ Failed to record diagnosis:', recordError);
            }
        }

        // 8. Apply Premium 10x Capacity Multiplier
        if (result.data?.usageMeta && req.user?.id) {
            try {
                const dbUser = await User.findById(req.user.id).select('isPremium premiumExpiry').lean();
                const isActivePremium = dbUser?.isPremium && (!dbUser.premiumExpiry || new Date(dbUser.premiumExpiry) > new Date());
                if (isActivePremium) {
                    const raw = result.data.usageMeta;
                    const remaining = parseInt(raw.remaining || '0') || 0;
                    const limit = parseInt(raw.limit || '100000') || 100000;
                    result.data.usageMeta.remaining = String(remaining * 10);
                    result.data.usageMeta.limit = String(limit * 10);
                    console.log(`[AI Doctor] ⭐ Premium 10x capacity applied for user ${req.user.id}`);
                }
            } catch (premiumErr) {
                console.warn('[AI Doctor] Premium check failed:', premiumErr.message);
            }
        }

        res.json({
            ...result.data,
            matchedFlora: matchedFloraBatch
        });

    } catch (e) {
        console.error("Chat API Error:", e);
        res.json({
            choices: [{
                message: {
                    role: "assistant",
                    content: "I seem to be having trouble connecting to my knowledge base at the moment. Please try asking your question again in a few moments."
                }
            }]
        });
    }
});

// --- IMAGE GENERATION PROXY ---
router.get('/api/generate-image', (req, res) => {
    try {
        const { prompt, width = 1024, height = 1024, seed, model = 'flux', enhance = 'false' } = req.query;

        if (!prompt) {
            return res.status(400).send('Prompt required');
        }

        // Construct Pollinations URL
        const safePrompt = encodeURIComponent(prompt);
        const seedParam = seed ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
        const enhanceParam = enhance === 'true' ? '&enhance=true' : '';
        const nologoParam = '&nologo=true';

        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=${width}&height=${height}&model=${model}${seedParam}${enhanceParam}${nologoParam}`;

        // Redirect client to fetch image directly (faster, low bandwidth)
        res.redirect(imageUrl);

    } catch (e) {
        console.error("Image Gen Error:", e);
        res.status(500).send("Generation failed");
    }
});

router.post('/api/chat/feedback', async (req, res) => {
    try {
        const { query, response, rating, userId } = req.body;
        console.log(`[AI Learning] New feedback: ${rating} for "${query.substring(0, 20)}..."`);

        await new AIFeedback({
            query,
            response,
            rating,
            userId
        }).save();

        res.json({ success: true, message: "Feedback recorded for training" });
    } catch (e) {
        console.error("Feedback Log Error:", e);
        res.status(500).json({ error: "Failed to log feedback" });
    }
});

router.get('/api/chat/greet', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).lean();
        const userName = user ? user.name : 'Plant Parent';
        
        // Find user's active or monitoring plant records
        const activeRecords = await DiagnosisRecord.find({ 
            userId: userId, 
            status: { $in: ['active', 'monitoring'] } 
        }).sort({ timestamp: -1 }).limit(2).lean();
        
        // Generate personalized prompt
        let contextText = "";
        if (activeRecords.length > 0) {
            contextText = activeRecords.map(r => 
                `- ${r.plantName} (${r.scientificName || 'Unknown'}): diagnosed with "${r.diagnosis}", severity is "${r.severity}", status is currently "${r.status}"`
            ).join('\n');
        }
        
        const systemPrompt = `You are Dr. Flora, the AI Plant Doctor agent (The "Logical Empath", combination of professional botanist and warm grandmotherly wisdom).
Write a personalized, concise welcome message (strictly max 2 sentences, under 40 words) greeting the user by the name "${userName}".
${activeRecords.length > 0 ? `They have the following plants under care/treatment:
${contextText}
Acknowledge the user, check in on one of their sick plants (or mention their status), and ask how you can help them today. Do not give direct treatment steps, just check in.` : `They have no active sick plant records. Greet them warmly by name, say you're ready to help, and ask how their plants are doing today.`}
Keep it brief and conversational. Do not use any markdown styling (no bold, no asterisks, no hashtags) or emojis inside the text to ensure it sounds clean when read aloud via Text-to-Speech.`;

        const apiKey = process.env.GROQ_API_KEY;
        let greetingText = `Hello ${userName}! I'm Dr. Flora, your AI Plant Doctor. How can I help your plants thrive today?`;
        
        if (apiKey) {
            const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${apiKey}` 
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: "Generate the greeting." }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });
            if (resp.ok) {
                const json = await resp.json();
                if (json && json.choices && json.choices[0] && json.choices[0].message) {
                    greetingText = json.choices[0].message.content.trim();
                }
            } else {
                console.warn(`[AI Doctor Greet] Groq API returned status ${resp.status}`);
            }
        }
        
        res.json({ greeting: greetingText });
    } catch (err) {
        console.error("Failed to generate greeting:", err);
        res.json({ greeting: `Hello! I'm Dr. Flora, your AI Plant Doctor. How can I help your plants thrive today?` });
    }
});

router.get('/api/chat/voices', (req, res) => {
    res.json(AVAILABLE_VOICES);
});

router.post('/api/chat/speak', auth, async (req, res) => {
    try {
        const { text, voiceId } = req.body;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

        if (!text) return res.status(400).json({ error: "Text required" });
        if (!ELEVENLABS_API_KEY) return res.status(503).json({ error: "Voice service not configured" });

        // Use requested voice or fallback to Charlotte
        const targetVoiceId = voiceId || "XB0fDUnXU5powFXDhCwa";
        const voiceConfig = VOICE_PERSONALITIES[targetVoiceId];

        if (!voiceConfig) {
            return res.status(400).json({ error: "Invalid voice ID" });
        }

        console.log(`[Dr. Flora Voice] Synthesizing with ${voiceConfig.name} (${voiceConfig.style}): "${text.substring(0, 30)}..."`);

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}/stream`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5", // Latest model for best quality
                voice_settings: voiceConfig.settings,
                optimize_streaming_latency: 3 // Optimized for quality + speed
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail?.message || "Voice API failed");
        }

        // Pipe the audio directly to the client
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('X-Voice-Name', voiceConfig.name);
        res.setHeader('X-Voice-Style', voiceConfig.style);

        const { pipeline } = require('stream');
        const { promisify } = require('util');
        const streamPipeline = promisify(pipeline);

        await streamPipeline(response.body, res);

        console.log(`[Dr. Flora Voice] ✓ Successfully synthesized with ${voiceConfig.name}`);

    } catch (e) {
        console.error("Voice Error:", e.message);
        res.status(500).json({ error: "Dr. Flora lost her voice temporarily!" });
    }
});

// --- AI-POWERED TRANSLATION ENDPOINTS ---
// Context-aware translation for botanical terms and plant descriptions

router.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang, context } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Text and target language required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Translation service not configured' });
        }

        // Language name mapping for better AI understanding
        const langNames = {
            'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi', 'ta': 'Tamil',
            'ur': 'Urdu', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'or': 'Odia',
            'pa': 'Punjabi', 'as': 'Assamese', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
            'zh': 'Chinese', 'ar': 'Arabic'
        };

        const targetLanguageName = langNames[targetLang] || targetLang;
        const contextHint = context === 'botanical'
            ? 'This is botanical/plant-related content. Preserve scientific names and technical terms accurately.'
            : '';

        const prompt = `Translate the following English text to ${targetLanguageName}. ${contextHint}

IMPORTANT RULES:
1. Maintain the original meaning and tone
2. Keep botanical / scientific names in their original form(e.g., "Monstera deliciosa" stays as is)
3. Preserve formatting(line breaks, bullet points)
4. Use natural, fluent ${targetLanguageName}
5. For plant care instructions, use culturally appropriate terms

Text to translate:
${text}

Provide ONLY the translation, no explanations.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey} `
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.3 // Lower temperature for more accurate translations
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translatedText = data.choices[0].message.content.trim();
            res.json({ translatedText });
        } else {
            throw new Error('Translation failed');
        }

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', originalText: req.body.text });
    }
});

router.post('/api/translate-batch', async (req, res) => {
    try {
        const { texts, targetLang, context } = req.body;

        if (!texts || !Array.isArray(texts) || !targetLang) {
            return res.status(400).json({ error: 'Texts array and target language required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Translation service not configured' });
        }

        const langNames = {
            'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi', 'ta': 'Tamil',
            'ur': 'Urdu', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'or': 'Odia',
            'pa': 'Punjabi', 'as': 'Assamese', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
            'zh': 'Chinese', 'ar': 'Arabic'
        };

        const targetLanguageName = langNames[targetLang] || targetLang;
        const contextHint = context === 'botanical'
            ? 'This is botanical/plant-related content. Preserve scientific names accurately.'
            : '';

        // Batch translate for efficiency
        const numberedTexts = texts.map((t, i) => `${i + 1}. ${t} `).join('\n');

        const prompt = `Translate the following numbered English texts to ${targetLanguageName}. ${contextHint}

RULES:
1. Preserve scientific / botanical names
2. Keep the numbering format
3. Use natural ${targetLanguageName}

Texts:
${numberedTexts}

Provide translations in the same numbered format.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey} `
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translatedText = data.choices[0].message.content.trim();
            // Parse numbered responses
            const translations = translatedText.split('\n')
                .filter(line => /^\d+\./.test(line))
                .map(line => line.replace(/^\d+\.\s*/, '').trim());

            res.json({ translations: translations.length === texts.length ? translations : texts });
        } else {
            throw new Error('Batch translation failed');
        }

    } catch (error) {
        console.error('Batch translation error:', error);
        res.status(500).json({ error: 'Batch translation failed', translations: req.body.texts });
    }
});

// --- MULTI-AI IMAGE GENERATION ENGINE (Dual-Model Support) ---
router.get('/api/generate-image', async (req, res) => {
    const { prompt, seed, width = 896, height = 896, model: requestedModel } = req.query;

    // Fixed model sequence: if a model is requested, try it first, then fallback
    const models = requestedModel ? [requestedModel, 'turbo', 'flux', 'any'] : ['turbo', 'flux', 'flux-realism', 'any'];

    for (const model of models) {
        try {
            console.log(`[Multi-AI] Attempting generation with model: ${model}`);
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&width=${width}&height=${height}&nologo=true&format=png`;

            const response = await fetch(pollinationsUrl);

            // If the response is not OK (like a 429 Rate Limit), try next model
            if (!response.ok) {
                console.warn(`[Multi-AI] Model ${model} failed (Status: ${response.status}). Trying fallback...`);
                continue;
            }

            // Check if it's the specific "Rate Limit" image (sometimes Pollinations returns 200 with an error image)
            // We can check Content-Length or just hope SDXL/Turbo has different limits
            const buffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(buffer);

            // If the buffer is suspiciously small (like the "Rate Limit" placeholder), try next
            if (imageBuffer.length < 50000 && model === 'flux') { // Real Flux images are usually > 200KB
                console.warn(`[Multi-AI] Model ${model} returned a suspiciously small image. Likely rate-limited. Trying fallback...`);
                continue;
            }

            // Success! Send the image
            res.set('Content-Type', 'image/png');
            res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h
            return res.send(imageBuffer);

        } catch (err) {
            console.error(`[Multi-AI] Error with model ${model}:`, err.message);
            continue;
        }
    }

    res.status(500).json({ error: 'All image generation models are currently limited. Please try again later.' });
});

// --- IMAGE PROXY FOR RELIABLE DOWNLOADS ---
router.get('/api/proxy-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        // If it's a generate-image URL, handle it recursively or just fetch it
        console.log(`[Proxy] Fetching image for download: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'image/png';

        res.set('Content-Type', contentType);
        res.set('Content-Disposition', 'attachment; filename="DrFlora-Botanical-Art.png"');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(buffer);
    } catch (err) {
        console.error('[Proxy Error]', err.message);
        res.status(500).json({ error: 'Failed to proxy image' });
    }
});

module.exports = router;
