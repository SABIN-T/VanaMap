import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download } from 'lucide-react';
import { fetchPlants } from '../../services/api';
import toast from 'react-hot-toast';
import styles from './AIDoctor.module.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const AIDoctor = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "🌿 Hello! I'm Dr. Flora, your AI Plant Doctor. I have extensive knowledge about plant care, diseases, and treatments. How can I help your plants thrive today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [plants, setPlants] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);
        } catch (e) {
            console.error('Failed to load plant database', e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateAIResponse = async (userMessage: string): Promise<string> => {
        // Check if question is about a specific plant in our database
        const plantMatch = plants.find(p =>
            userMessage.toLowerCase().includes(p.name.toLowerCase()) ||
            userMessage.toLowerCase().includes(p.scientificName?.toLowerCase())
        );

        if (plantMatch) {
            return `🌱 **${plantMatch.name}** (${plantMatch.scientificName || 'Scientific name not available'})

📋 **Plant Profile:**
${plantMatch.description || 'A beautiful plant species.'}

🌡️ **Ideal Conditions:**
- Temperature: ${plantMatch.idealTempMin || 18}°C - ${plantMatch.idealTempMax || 28}°C
- Humidity: ${plantMatch.minHumidity || 40}%+
- Sunlight: ${plantMatch.sunlight || 'Moderate indirect light'}

💨 **Air Purification:**
- Oxygen Production: ${plantMatch.oxygenLevel || 'Moderate'}
${plantMatch.medicinalValues?.length ? `\n💊 **Medicinal Benefits:**\n${plantMatch.medicinalValues.map((v: string) => `- ${v}`).join('\n')}` : ''}
${plantMatch.advantages?.length ? `\n✨ **Advantages:**\n${plantMatch.advantages.map((a: string) => `- ${a}`).join('\n')}` : ''}

🌿 **Care Tips:**
- Water when top 2 inches of soil are dry
- Ensure good drainage to prevent root rot
- Fertilize monthly during growing season
- Prune dead leaves regularly

Would you like to know more about this plant or ask about any specific care concerns?`;
        }

        // Use free Hugging Face API for general plant questions
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `You are Dr. Flora, an expert plant doctor. Answer this plant-related question professionally and helpfully: ${userMessage}`,
                    parameters: {
                        max_length: 500,
                        temperature: 0.7
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data[0]?.generated_text || generateFallbackResponse(userMessage);
            }
        } catch (e) {
            console.error('AI API error:', e);
        }

        return generateFallbackResponse(userMessage);
    };

    const generateFallbackResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes('disease') || lowerMsg.includes('sick') || lowerMsg.includes('dying')) {
            return `🔬 **Plant Disease Diagnosis**

Based on your description, here are common issues and solutions:

**Common Symptoms & Treatments:**

🍂 **Yellow Leaves:**
- Overwatering (most common)
- Nutrient deficiency
- Solution: Check soil moisture, reduce watering, add fertilizer

🦠 **Brown Spots:**
- Fungal infection
- Sunburn
- Solution: Remove affected leaves, improve air circulation, adjust light

🐛 **Pest Infestation:**
- Spider mites, aphids, mealybugs
- Solution: Neem oil spray, insecticidal soap, isolate plant

💧 **Wilting:**
- Under/overwatering
- Root rot
- Solution: Check roots, adjust watering schedule

For accurate diagnosis, please describe:
1. What symptoms do you see?
2. How long has this been happening?
3. Recent changes in care routine?`;
        }

        if (lowerMsg.includes('water') || lowerMsg.includes('watering')) {
            return `💧 **Watering Guide**

**General Rules:**
- Check soil moisture before watering
- Water thoroughly until it drains
- Empty saucer after 30 minutes

**Frequency by Plant Type:**
- Succulents: Every 2-3 weeks
- Tropical plants: 1-2 times per week
- Ferns: Keep consistently moist
- Snake plants: Every 2-4 weeks

**Signs of Overwatering:**
- Yellow leaves
- Mushy stems
- Moldy soil

**Signs of Underwatering:**
- Crispy brown edges
- Drooping leaves
- Dry soil

💡 **Pro Tip:** Stick your finger 2 inches into soil. If dry, water. If moist, wait!`;
        }

        if (lowerMsg.includes('light') || lowerMsg.includes('sun')) {
            return `☀️ **Light Requirements Guide**

**Light Levels:**

🌞 **Bright Direct Light (6+ hours):**
- Cacti, succulents
- Jade plant, aloe vera
- Place near south-facing window

🌤️ **Bright Indirect Light (4-6 hours):**
- Monstera, pothos
- Fiddle leaf fig, rubber plant
- Place near east/west window with sheer curtain

⛅ **Medium Light (2-4 hours):**
- Snake plant, ZZ plant
- Philodendron, dracaena
- Place 3-5 feet from window

🌙 **Low Light (< 2 hours):**
- Pothos, peace lily
- Cast iron plant
- North-facing window or interior room

**Signs of Too Much Light:**
- Bleached/pale leaves
- Brown scorched spots

**Signs of Too Little Light:**
- Leggy growth
- Small new leaves
- Leaning toward light source`;
        }

        if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrients')) {
            return `🌱 **Fertilizer & Nutrition Guide**

**NPK Basics:**
- N (Nitrogen): Leaf growth
- P (Phosphorus): Root & flower development
- K (Potassium): Overall health

**Fertilizing Schedule:**
- Growing season (Spring/Summer): Every 2-4 weeks
- Dormant season (Fall/Winter): Monthly or skip

**Types of Fertilizer:**
- Liquid: Fast-acting, easy to control
- Granular: Slow-release, long-lasting
- Organic: Compost, worm castings

**Common Deficiencies:**
- Yellow leaves: Nitrogen deficiency
- Purple tint: Phosphorus deficiency
- Brown edges: Potassium deficiency

⚠️ **Important:** Always dilute to half strength. More is NOT better!`;
        }

        return `🌿 **Dr. Flora's General Plant Care Advice**

I'm here to help with:
- 🔬 Disease diagnosis & treatment
- 💧 Watering schedules
- ☀️ Light requirements
- 🌱 Fertilizer recommendations
- 🐛 Pest control
- 🌡️ Temperature & humidity
- 🪴 Repotting guidance
- ✂️ Pruning techniques

**Quick Tips:**
1. Most plants die from overwatering, not underwatering
2. Consistency is key - stick to a routine
3. Observe your plant daily for early problem detection
4. When in doubt, less is more (water, fertilizer, etc.)

Please ask me a specific question about your plant's care, and I'll provide detailed guidance!

You can also ask about specific plants like "How do I care for a snake plant?" or "Why are my monstera leaves turning yellow?"`;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const aiResponse = await generateAIResponse(input);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            toast.error('Failed to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: "🌿 Chat cleared! How can I help your plants today?",
            timestamp: new Date()
        }]);
        toast.success('Conversation cleared');
    };

    const handleExport = () => {
        const transcript = messages.map(m =>
            `[${m.timestamp.toLocaleTimeString()}] ${m.role === 'user' ? 'You' : 'Dr. Flora'}: ${m.content}`
        ).join('\n\n');

        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plant-consultation-${Date.now()}.txt`;
        a.click();
        toast.success('Conversation exported!');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoIcon}>
                            <Bot size={32} />
                        </div>
                        <div>
                            <h1 className={styles.title}>AI Plant Doctor</h1>
                            <p className={styles.subtitle}>Expert botanical consultation powered by AI</p>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={handleExport} title="Export Chat">
                            <Download size={18} />
                        </button>
                        <button className={styles.actionBtn} onClick={handleClear} title="Clear Chat">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.chatContainer}>
                <div className={styles.messagesWrapper}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                        >
                            <div className={styles.messageIcon}>
                                {message.role === 'user' ? <User size={20} /> : <Leaf size={20} />}
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageHeader}>
                                    <span className={styles.messageSender}>
                                        {message.role === 'user' ? 'You' : 'Dr. Flora'}
                                    </span>
                                    <span className={styles.messageTime}>
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={styles.messageText}>
                                    {message.content.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className={`${styles.message} ${styles.assistantMessage}`}>
                            <div className={styles.messageIcon}>
                                <Leaf size={20} />
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.typing}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Ask about plant care, diseases, or specific plants..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                        disabled={loading}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? <Sparkles size={20} className={styles.sparkle} /> : <Send size={20} />}
                    </button>
                </div>
                <p className={styles.disclaimer}>
                    💡 AI-powered advice based on botanical science and your plant database
                </p>
            </div>
        </div>
    );
};
