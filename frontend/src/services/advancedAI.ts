// Advanced AI Service using Google Gemini (Free Tier)
// This provides GPT/Gemini-level intelligence for plant care

interface AIResponse {
    text: string;
    confidence: number;
}

export class AdvancedAIService {
    private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Using free tier - no API key required for basic usage
    // For production, get free API key from: https://makersuite.google.com/app/apikey

    static async getGeminiResponse(userMessage: string, context?: string): Promise<AIResponse | null> {
        try {
            const prompt = this.buildAdvancedPrompt(userMessage, context);

            // Try Gemini API (best quality)
            const geminiResponse = await this.tryGemini(prompt);
            if (geminiResponse) return geminiResponse;

            // Fallback to Hugging Face models
            const hfResponse = await this.tryHuggingFace(prompt);
            if (hfResponse) return hfResponse;

            return null;
        } catch (error) {
            console.error('AI Service error:', error);
            return null;
        }
    }

    private static buildAdvancedPrompt(userMessage: string, context?: string): string {
        return `You are Dr. Flora, an expert botanist AI assistant with deep knowledge of plant science, horticulture, and gardening.

${context ? `CONTEXT:\n${context}\n\n` : ''}USER QUESTION: "${userMessage}"

INSTRUCTIONS:
1. Analyze the question deeply - understand intent, urgency, and context
2. Provide accurate, science-based information
3. Be conversational and friendly, like Gemini or ChatGPT
4. If you don't know something, say so honestly
5. Give practical, actionable advice
6. Use examples and analogies when helpful
7. Keep responses concise but comprehensive (200-400 words)

Respond naturally and helpfully:`;
    }

    private static async tryGemini(prompt: string): Promise<AIResponse | null> {
        try {
            // Note: For production, add API key to environment variables
            // For now, using public endpoint (limited requests)
            const response = await fetch(this.GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 500,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE'
                        }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text && text.length > 50) {
                    return {
                        text: text.trim(),
                        confidence: 0.95
                    };
                }
            }
        } catch (error) {
            console.log('Gemini API unavailable, trying fallback...');
        }
        return null;
    }

    private static async tryHuggingFace(prompt: string): Promise<AIResponse | null> {
        const models = [
            'mistralai/Mistral-7B-Instruct-v0.2',
            'microsoft/DialoGPT-large',
            'facebook/blenderbot-400M-distill'
        ];

        for (const model of models) {
            try {
                const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 400,
                            temperature: 0.7,
                            top_p: 0.9,
                            do_sample: true,
                            return_full_text: false
                        },
                        options: {
                            wait_for_model: true,
                            use_cache: false
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    let text = '';

                    if (Array.isArray(data)) {
                        text = data[0]?.generated_text || data[0]?.text || '';
                    } else if (data.generated_text) {
                        text = data.generated_text;
                    }

                    text = text.trim();

                    // Clean up response
                    if (text.includes('USER QUESTION:')) {
                        const parts = text.split(/USER QUESTION:|Respond naturally/);
                        text = parts[parts.length - 1].trim();
                    }

                    if (text.length > 100 && text.length < 2000) {
                        return {
                            text,
                            confidence: 0.75
                        };
                    }
                }
            } catch (error) {
                continue;
            }
        }

        return null;
    }

    // Advanced conversation memory (for multi-turn conversations)
    static buildContextFromHistory(messages: Array<{ role: string, content: string }>): string {
        const recentMessages = messages.slice(-6); // Last 3 exchanges
        let context = 'CONVERSATION HISTORY:\n';

        recentMessages.forEach(msg => {
            context += `${msg.role === 'user' ? 'User' : 'Dr. Flora'}: ${msg.content.substring(0, 150)}...\n`;
        });

        return context + '\nUse this context to provide coherent, contextual responses.\n';
    }
}

// Helper function to format AI response like Gemini/GPT
export function formatAdvancedResponse(aiText: string): string {
    let formatted = `🌿 **Dr. Flora:**\n\n`;

    // Split into paragraphs
    const paragraphs = aiText.split('\n').filter(p => p.trim().length > 0);

    paragraphs.forEach((para, index) => {
        // Add contextual emojis
        if (para.toLowerCase().includes('water') && index === 0) {
            formatted += `💧 ${para}\n\n`;
        } else if (para.toLowerCase().includes('light') || para.toLowerCase().includes('sun')) {
            formatted += `☀️ ${para}\n\n`;
        } else if (para.toLowerCase().includes('important') || para.toLowerCase().includes('key')) {
            formatted += `⚠️ ${para}\n\n`;
        } else if (para.toLowerCase().includes('tip') || para.toLowerCase().includes('pro')) {
            formatted += `💡 ${para}\n\n`;
        } else {
            formatted += `${para}\n\n`;
        }
    });

    formatted += `---\n🌱 *Ask me anything else about your plants!*`;

    return formatted;
}
