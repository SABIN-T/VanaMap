const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// WebSocket Server for AI Doctor Streaming
function initializeWebSocket(server) {
    const wss = new WebSocket.Server({
        server,
        path: '/ws/chat'
    });

    console.log('✅ WebSocket Server initialized at /ws/chat');

    wss.on('connection', (ws, req) => {
        console.log('[WS] New client connected');

        // Optional: Authenticate via query params
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        let user = null;
        if (token) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
                console.log(`[WS] Authenticated user: ${user.email}`);
            } catch (e) {
                console.log('[WS] Invalid token, proceeding as guest');
            }
        }

        ws.user = user;
        ws.isAlive = true;

        // Heartbeat to detect dead connections
        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('[WS] Received:', message.type);

                if (message.type === 'chat') {
                    await handleChatStream(ws, message);
                } else if (message.type === 'ping') {
                    ws.send(JSON.stringify({ type: 'pong' }));
                }
            } catch (error) {
                console.error('[WS] Message handling error:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    error: error.message
                }));
            }
        });

        ws.on('close', () => {
            console.log('[WS] Client disconnected');
        });

        ws.on('error', (error) => {
            console.error('[WS] Connection error:', error);
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'connected',
            message: '🌿 Connected to Dr. Flora AI Doctor'
        }));
    });

    // Heartbeat interval to clean up dead connections
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                console.log('[WS] Terminating dead connection');
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000); // Every 30 seconds

    wss.on('close', () => {
        clearInterval(interval);
    });

    return wss;
}

// Handle streaming chat messages
async function handleChatStream(ws, message) {
    const { messages, userContext, image, persona = 'flora' } = message.data;

    if (!messages || !Array.isArray(messages)) {
        ws.send(JSON.stringify({
            type: 'error',
            error: 'Invalid messages format'
        }));
        return;
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        ws.send(JSON.stringify({
            type: 'error',
            error: 'AI service not configured'
        }));
        return;
    }

    try {
        // Send "thinking" status
        ws.send(JSON.stringify({
            type: 'status',
            status: 'thinking'
        }));

        // Prepare messages for Groq
        const FloraIntelligence = require('./flora-intelligence');
        const { DiagnosisRecord } = require('./models');

        const floraResult = await FloraIntelligence.getRelevantFloraContext(messages, userContext?.weather);
        const floraKnowledge = floraResult.context;
        const matchedFloraBatch = floraResult.matches;

        // Send matched flora metadata to client (for live dossier panel)
        ws.send(JSON.stringify({
            type: 'flora_metadata',
            matchedFlora: matchedFloraBatch
        }));

        // Fetch user medical history
        let medicalHistory = "No previous medical records found.";
        if (ws.user?.id) {
            const records = await DiagnosisRecord.find({ userId: ws.user.id }).sort({ timestamp: -1 }).limit(3).lean();
            if (records.length > 0) {
                medicalHistory = records.map(r =>
                    `- ${r.plantName} (${r.scientificName || 'Unknown'}): ${r.diagnosis}. Status: ${r.status}. Severity: ${r.severity}. Treatment: ${r.treatment}`
                ).join('\n');
            }
        }

        // Build system prompt based on persona
        let systemPrompt = getSystemPrompt(persona, floraKnowledge, userContext, medicalHistory);

        // Prepare API messages
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        ];

        // Add image if present
        if (image) {
            const lastMessage = apiMessages[apiMessages.length - 1];
            lastMessage.content = [
                { type: 'text', text: lastMessage.content || "Analyze this plant." },
                {
                    type: 'image_url',
                    image_url: { url: image }
                }
            ];
        }

        // Call Groq API with streaming
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: image ? 'llama-3.2-90b-vision-preview' : 'llama-3.3-70b-versatile',
                messages: apiMessages,
                temperature: 0.3,
                max_tokens: 4000,
                stream: true // Enable streaming!
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullMessage = '';

        ws.send(JSON.stringify({
            type: 'stream_start'
        }));

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                ws.send(JSON.stringify({
                    type: 'stream_end'
                }));
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);

                    if (data === '[DONE]') {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;

                        if (content) {
                            fullMessage += content;
                            // Send each chunk to the client
                            ws.send(JSON.stringify({
                                type: 'chunk',
                                content
                            }));
                        }
                    } catch (e) {
                        // Skip malformed JSON
                    }
                }
            }
        }

        // Auto-Record Diagnosis to Garden Clinic (Medical Records)
        if (ws.user?.id && (fullMessage.includes('DIAGNOSIS:') || fullMessage.includes('TREATMENT:'))) {
            try {
                const pName = fullMessage.match(/Plant:?\s*([^\n]+)/i)?.[1] || matchedFloraBatch[0]?.commonName || "Unknown";
                const sName = fullMessage.match(/Scientific Name:?\s*([^\n]+)/i)?.[1] || matchedFloraBatch[0]?.scientificName || "N/A";
                const diag = fullMessage.match(/DIAGNOSIS:?\s*([^\n]+)/i)?.[1] || "Visual Assessment";
                const treat = fullMessage.match(/TREATMENT:?\s*([\s\S]+?)(?=\n\n|$)/i)?.[1] || "See Dr. Flora's message for details.";

                await DiagnosisRecord.create({
                    userId: ws.user.id,
                    plantName: pName.trim(),
                    scientificName: sName.trim(),
                    diagnosis: diag.trim(),
                    treatment: treat.trim(),
                    imageUrl: image || null,
                    severity: fullMessage.toLowerCase().includes('critical') ? 'critical' :
                        fullMessage.toLowerCase().includes('high') ? 'high' :
                        fullMessage.toLowerCase().includes('medium') ? 'medium' : 'low'
                });
                console.log(`[Garden Clinic - WS] 🩺 Diagnosis recorded for user ${ws.user.id}`);
            } catch (recordError) {
                console.error('[Garden Clinic - WS] ❌ Failed to record diagnosis:', recordError);
            }
        }

    } catch (error) {
        console.error('[WS] Chat stream error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            error: error.message
        }));
    }
}

// Get system prompt based on persona
function getSystemPrompt(persona, floraKnowledge, userContext, medicalHistory) {
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

    ⚠️ STRICT BOUNDARIES: No technical/security info, no non-plant topics.
    
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
    - Prevention: [Actionable steps]`;

    return systemPrompt;
}

module.exports = { initializeWebSocket };
