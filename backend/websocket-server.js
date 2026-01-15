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
        const floraResult = await FloraIntelligence.getRelevantFloraContext(messages);
        const floraKnowledge = floraResult.context;

        // Build system prompt based on persona
        let systemPrompt = getSystemPrompt(persona, floraKnowledge, userContext);

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
                { type: 'text', text: lastMessage.content },
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
                temperature: 0.7,
                max_tokens: 2000,
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

    } catch (error) {
        console.error('[WS] Chat stream error:', error);
        ws.send(JSON.stringify({
            type: 'error',
            error: error.message
        }));
    }
}

// Get system prompt based on persona
function getSystemPrompt(persona, floraKnowledge, userContext) {
    const basePrompt = `You are Dr. Flora, an expert AI plant doctor. You help people care for their plants with scientific accuracy and friendly advice.

${floraKnowledge ? `Relevant plant knowledge:\n${floraKnowledge}\n` : ''}

${userContext?.city ? `User location: ${userContext.city}\n` : ''}
${userContext?.weather ? `Current weather: ${userContext.weather.avgTemp30Days}°C\n` : ''}

Provide helpful, actionable advice. Be warm and encouraging.`;

    if (persona === 'geneticist') {
        return basePrompt + '\n\nFocus on plant genetics, breeding, and molecular biology.';
    } else if (persona === 'ayurvedic') {
        return basePrompt + '\n\nEmphasize traditional Ayurvedic plant medicine and holistic healing.';
    }

    return basePrompt;
}

module.exports = { initializeWebSocket };
