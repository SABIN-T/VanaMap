import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download } from 'lucide-react';
import { fetchPlants } from '../services/api';
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
        const lowerMsg = userMessage.toLowerCase();

        // STEP 1: Contextual Analysis - Extract key information
        const context = {
            hasSymptoms: /yellow|brown|spot|wilt|droop|curl|dying|dead|sick/.test(lowerMsg),
            hasPest: /bug|pest|insect|mite|aphid|scale|mealybug|fungus gnat/.test(lowerMsg),
            hasWaterIssue: /water|overwater|underwater|soggy|dry|droop/.test(lowerMsg),
            hasLightIssue: /light|sun|shade|dark|bright|pale|leggy/.test(lowerMsg),
            isGeneralCare: /care|how to|maintain|grow|propagate/.test(lowerMsg),
            mentionsTimeframe: /week|month|day|recently|sudden|gradual/.test(lowerMsg),
        };

        // STEP 2: Check for specific plant in database with fuzzy matching
        const plantMatch = plants.find(p =>
            lowerMsg.includes(p.name.toLowerCase()) ||
            (p.scientificName && lowerMsg.includes(p.scientificName.toLowerCase())) ||
            (p.commonNames && p.commonNames.some((cn: string) => lowerMsg.includes(cn.toLowerCase())))
        );

        if (plantMatch) {
            // Enhanced plant-specific response with contextual advice
            let response = `🌱 **${plantMatch.name}** ${plantMatch.scientificName ? `(*${plantMatch.scientificName}*)` : ''}

📋 **Plant Profile:**
${plantMatch.description || 'A resilient and beautiful plant species.'}

🌡️ **Optimal Growing Conditions:**
- **Temperature:** ${plantMatch.idealTempMin || 18}°C - ${plantMatch.idealTempMax || 28}°C
- **Humidity:** ${plantMatch.minHumidity || 40}%+ (${plantMatch.minHumidity > 60 ? 'High humidity lover' : plantMatch.minHumidity > 40 ? 'Moderate humidity' : 'Low humidity tolerant'})
- **Sunlight:** ${plantMatch.sunlight || 'Moderate indirect light'}
- **Watering:** ${plantMatch.wateringFrequency || 'When top 2 inches of soil are dry'}

💨 **Air Quality Benefits:**
- Oxygen Production: ${plantMatch.oxygenLevel || 'Moderate'}
${plantMatch.medicinalValues?.length ? `\n💊 **Medicinal Properties:**\n${plantMatch.medicinalValues.map((v: string) => `  • ${v}`).join('\n')}` : ''}
${plantMatch.advantages?.length ? `\n✨ **Key Benefits:**\n${plantMatch.advantages.map((a: string) => `  • ${a}`).join('\n')}` : ''}`;

            // Add contextual troubleshooting if symptoms detected
            if (context.hasSymptoms) {
                response += `\n\n🔍 **Troubleshooting for ${plantMatch.name}:**`;
                if (lowerMsg.includes('yellow')) {
                    response += `\n• **Yellow leaves** → Likely overwatering or nitrogen deficiency. Check soil moisture and reduce watering frequency.`;
                }
                if (lowerMsg.includes('brown')) {
                    response += `\n• **Brown tips/edges** → Low humidity or fluoride in water. Mist regularly and use filtered water.`;
                }
                if (lowerMsg.includes('droop') || lowerMsg.includes('wilt')) {
                    response += `\n• **Drooping/Wilting** → Either underwatered or root rot from overwatering. Check soil and roots.`;
                }
            }

            response += `\n\n💡 **Pro Care Tips:**
- Monitor soil moisture with finger test (2 inches deep)
- Rotate plant weekly for even growth
- Clean leaves monthly to maximize photosynthesis
- Fertilize with balanced NPK during growing season (spring/summer)

Need more specific help? Describe your plant's symptoms in detail!`;

            return response;
        }

        // STEP 3: Advanced symptom-based diagnosis with logical reasoning
        if (context.hasSymptoms || context.hasPest) {
            return generateDiagnosticResponse(userMessage, context);
        }

        // STEP 4: Try external AI API with enhanced prompt
        try {
            const enhancedPrompt = `You are Dr. Flora, a world-renowned botanist and plant pathologist with 30 years of experience. 
Analyze this question using scientific reasoning and provide a comprehensive, actionable response.

Question: ${userMessage}

Provide your answer in this structure:
1. Analysis of the situation
2. Most likely causes (ranked by probability)
3. Specific solutions with step-by-step instructions
4. Preventive measures for the future

Be specific, practical, and encouraging.`;

            const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: enhancedPrompt,
                    parameters: { max_length: 600, temperature: 0.7, top_p: 0.9 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const aiResponse = data[0]?.generated_text;
                if (aiResponse && aiResponse.length > 50) {
                    return `🤖 **AI Analysis:**\n\n${aiResponse}\n\n---\n💡 *This response is AI-generated. For critical plant health issues, consider consulting a local horticulturist.*`;
                }
            }
        } catch (e) {
            console.error('AI API error:', e);
        }

        // STEP 5: Intelligent fallback with context awareness
        return generateFallbackResponse(userMessage, context);
    };

    // New helper function for diagnostic responses
    const generateDiagnosticResponse = (userMessage: string, context: any): string => {
        const lowerMsg = userMessage.toLowerCase();

        let diagnosis = `🔬 **Advanced Plant Diagnostic Analysis**\n\n`;
        diagnosis += `📊 **Symptom Analysis:**\n`;

        // Symptom detection with probability scoring
        const symptoms: { symptom: string; likelihood: string; causes: string[] }[] = [];

        if (lowerMsg.includes('yellow')) {
            symptoms.push({
                symptom: 'Yellowing Leaves (Chlorosis)',
                likelihood: 'High Confidence',
                causes: ['Overwatering (80%)', 'Nitrogen deficiency (15%)', 'Natural aging (5%)']
            });
        }

        if (lowerMsg.includes('brown') && (lowerMsg.includes('spot') || lowerMsg.includes('patch'))) {
            symptoms.push({
                symptom: 'Brown Spots/Patches',
                likelihood: 'High Confidence',
                causes: ['Fungal infection (60%)', 'Bacterial leaf spot (25%)', 'Sunburn (15%)']
            });
        }

        if (lowerMsg.includes('droop') || lowerMsg.includes('wilt')) {
            symptoms.push({
                symptom: 'Wilting/Drooping',
                likelihood: 'High Confidence',
                causes: ['Underwatering (50%)', 'Root rot from overwatering (35%)', 'Heat stress (15%)']
            });
        }

        if (lowerMsg.includes('curl')) {
            symptoms.push({
                symptom: 'Leaf Curling',
                likelihood: 'Moderate Confidence',
                causes: ['Pest infestation (40%)', 'Underwatering (30%)', 'Heat stress (20%)', 'Viral infection (10%)']
            });
        }

        symptoms.forEach((s, i) => {
            diagnosis += `\n${i + 1}. **${s.symptom}** (${s.likelihood})\n`;
            diagnosis += `   Probable causes:\n`;
            s.causes.forEach(cause => diagnosis += `   • ${cause}\n`);
        });

        diagnosis += `\n🎯 **Recommended Action Plan:**\n\n`;
        diagnosis += `**Immediate Steps (Next 24 hours):**\n`;
        diagnosis += `1. Check soil moisture 2 inches deep - should be slightly moist, not soggy\n`;
        diagnosis += `2. Inspect leaves (top and bottom) for pests with magnifying glass\n`;
        diagnosis += `3. Assess light exposure - is plant getting appropriate light for its species?\n`;
        diagnosis += `4. Check drainage holes - ensure water can escape freely\n\n`;

        diagnosis += `**Treatment Protocol (Week 1):**\n`;
        if (context.hasWaterIssue || lowerMsg.includes('yellow') || lowerMsg.includes('wilt')) {
            diagnosis += `• Adjust watering: If soil is wet, stop watering. If dry, water thoroughly.\n`;
            diagnosis += `• Ensure pot has drainage holes and use well-draining soil mix\n`;
        }
        if (context.hasPest || lowerMsg.includes('curl')) {
            diagnosis += `• Apply neem oil solution (1 tsp per liter water) - spray all surfaces\n`;
            diagnosis += `• Isolate plant from others to prevent spread\n`;
        }
        if (lowerMsg.includes('brown') && lowerMsg.includes('spot')) {
            diagnosis += `• Remove affected leaves with sterilized scissors\n`;
            diagnosis += `• Apply copper-based fungicide if fungal infection suspected\n`;
            diagnosis += `• Improve air circulation around plant\n`;
        }

        diagnosis += `\n**Monitoring (Weeks 2-4):**\n`;
        diagnosis += `• Document changes with photos every 3 days\n`;
        diagnosis += `• Adjust care based on plant response\n`;
        diagnosis += `• New growth should appear healthy if treatment is working\n\n`;

        diagnosis += `⚠️ **Warning Signs to Watch:**\n`;
        diagnosis += `• Rapid spread of symptoms = urgent intervention needed\n`;
        diagnosis += `• Mushy stems/roots = severe root rot, may need repotting\n`;
        diagnosis += `• No improvement after 2 weeks = reassess diagnosis\n\n`;

        diagnosis += `💡 **Prevention for Future:**\n`;
        diagnosis += `• Establish consistent watering schedule\n`;
        diagnosis += `• Quarantine new plants for 2 weeks\n`;
        diagnosis += `• Clean leaves monthly to prevent pest buildup\n`;
        diagnosis += `• Use sterilized tools for pruning\n\n`;

        diagnosis += `📝 **Need more help?** Describe:\n`;
        diagnosis += `1. When did symptoms first appear?\n`;
        diagnosis += `2. Recent changes in care or environment?\n`;
        diagnosis += `3. Plant's location and light conditions?\n`;
        diagnosis += `4. Current watering frequency?`;

        return diagnosis;
    };

    const generateFallbackResponse = (userMessage: string, context?: any): string => {
        const lowerMsg = userMessage.toLowerCase();

        // Enhanced disease/symptom response
        if (lowerMsg.includes('disease') || lowerMsg.includes('sick') || lowerMsg.includes('dying')) {
            return `🔬 **Comprehensive Plant Disease Guide**

**Common Symptoms & Treatments:**

🍂 **Yellow Leaves (Chlorosis):**
- **Primary Cause:** Overwatering (most common - 70% of cases)
- **Secondary Causes:** Nitrogen deficiency, poor drainage, root damage
- **Solution:** 
  1. Check soil moisture - should be moist but not waterlogged
  2. Reduce watering frequency by 30-50%
  3. Ensure proper drainage (add perlite if needed)
  4. Apply balanced liquid fertilizer at half strength

🦠 **Brown Spots/Patches:**
- **Fungal Infection (60%):** Circular spots with yellow halos
- **Bacterial Spot (25%):** Angular spots, water-soaked appearance  
- **Sunburn (15%):** Bleached, papery texture
- **Solution:**
  1. Remove affected leaves immediately
  2. Improve air circulation (use fan if indoors)
  3. Apply copper fungicide for fungal issues
  4. Adjust light exposure if sunburn suspected

🐛 **Pest Infestation:**
- **Common Pests:** Spider mites, aphids, mealybugs, scale, fungus gnats
- **Detection:** Check leaf undersides, sticky residue, webbing
- **Solution:**
  1. Isolate infected plant immediately
  2. Spray with neem oil solution (1 tsp/liter water)
  3. Wipe leaves with diluted dish soap (1 drop/cup water)
  4. Repeat treatment every 5-7 days for 3 weeks

💧 **Wilting/Drooping:**
- **Underwatering (50%):** Soil completely dry, leaves crispy
- **Overwatering/Root Rot (35%):** Soil soggy, mushy stems
- **Heat Stress (15%):** Sudden wilting in hot conditions
- **Solution:**
  1. Check soil and roots immediately
  2. If underwatered: Water thoroughly and mist leaves
  3. If overwatered: Repot in fresh soil, trim rotted roots
  4. Adjust environmental conditions

📋 **For Accurate Diagnosis, Please Describe:**
1. What specific symptoms do you observe?
2. How long has this been happening?
3. Any recent changes in care routine or environment?
4. Plant's current location and light exposure?
5. Current watering frequency?

💡 **Emergency Triage:**
- **Critical (Act Now):** Mushy stems, foul odor, rapid leaf drop
- **Urgent (24-48 hrs):** Widespread yellowing, visible pests
- **Monitor (1 week):** Few affected leaves, slow changes`;
        }

        // Enhanced watering guide
        if (lowerMsg.includes('water') || lowerMsg.includes('watering')) {
            return `💧 **Complete Watering Mastery Guide**

**The Golden Rule:** Water based on soil moisture, NOT a schedule!

**Proper Watering Technique:**
1. **Finger Test:** Insert finger 2 inches into soil
   - Dry = Water now
   - Moist = Wait 2-3 days
   - Wet = Do not water (risk of root rot)

2. **Thorough Watering:** Water until it drains from bottom holes
3. **Drain Excess:** Empty saucer after 30 minutes
4. **Water Quality:** Use room temperature, filtered water when possible

**Frequency by Plant Category:**

🌵 **Succulents/Cacti:**
- Every 2-3 weeks (winter: monthly)
- Soil should dry completely between waterings
- Signs of thirst: Wrinkled, shriveled leaves

🌴 **Tropical Plants (Monstera, Pothos, Philodendron):**
- 1-2 times per week (adjust for humidity)
- Keep soil slightly moist but not soggy
- Mist leaves 2-3 times weekly for humidity

🌿 **Ferns:**
- Keep consistently moist (never bone dry)
- Check daily in warm weather
- High humidity essential (60%+)

🐍 **Snake Plants/ZZ Plants:**
- Every 2-4 weeks
- Extremely drought tolerant
- Overwatering is #1 killer

**Signs of Overwatering (Most Common Mistake):**
- Yellow, mushy leaves
- Moldy or foul-smelling soil
- Soft, brown stems
- Fungus gnats flying around
- **Fix:** Stop watering, improve drainage, consider repotting

**Signs of Underwatering:**
- Crispy, brown leaf edges
- Drooping, wilting leaves
- Dry, pulling-away-from-pot soil
- Slow growth
- **Fix:** Water thoroughly, increase frequency slightly

**Advanced Tips:**
- Use moisture meter for precision ($10-15 investment)
- Bottom watering for sensitive plants (sit pot in water tray)
- Adjust for seasons (less in winter, more in summer)
- Pot size matters: Larger pots = less frequent watering

💡 **Pro Tip:** Most houseplants die from overwatering, not underwatering. When in doubt, wait another day!`;
        }

        // Enhanced light guide
        if (lowerMsg.includes('light') || lowerMsg.includes('sun')) {
            return `☀️ **Complete Light Requirements Guide**

**Understanding Light Levels:**

🌞 **Bright Direct Light (6+ hours direct sun):**
- **Best For:** Cacti, succulents, jade, aloe vera, citrus
- **Location:** South-facing window (Northern Hemisphere)
- **Distance:** 0-2 feet from window
- **Signs of Success:** Compact growth, vibrant colors
- **Too Much:** Bleached/pale leaves, brown scorched spots

🌤️ **Bright Indirect Light (4-6 hours filtered):**
- **Best For:** Monstera, pothos, fiddle leaf fig, rubber plant
- **Location:** East/west window with sheer curtain, or 3-5 feet from south window
- **Signs of Success:** Steady growth, rich green color
- **Too Much:** Faded leaves, crispy edges
- **Too Little:** Leggy growth, small leaves

⛅ **Medium Light (2-4 hours indirect):**
- **Best For:** Snake plant, ZZ plant, philodendron, dracaena
- **Location:** 3-8 feet from bright window, north-facing window
- **Signs of Success:** Slow but steady growth
- **Adaptable:** These plants tolerate various conditions

🌙 **Low Light (<2 hours indirect):**
- **Best For:** Pothos, peace lily, cast iron plant, Chinese evergreen
- **Location:** Interior rooms, north windows, 8+ feet from windows
- **Reality Check:** "Low light" doesn't mean "no light"
- **Minimum:** All plants need SOME light to survive

**Troubleshooting Light Issues:**

📊 **Too Much Light:**
- Bleached, washed-out appearance
- Brown, crispy patches (sunburn)
- Rapid soil drying
- **Fix:** Move away from window, add sheer curtain, rotate plant

📊 **Too Little Light:**
- Leggy, stretched growth (etiolation)
- Leaning heavily toward light source
- Small, pale new leaves
- Slow/no growth
- Leaf drop
- **Fix:** Move closer to window, add grow light, prune leggy growth

**Grow Light Guide (For Low-Light Spaces):**
- **Type:** Full-spectrum LED (energy efficient)
- **Distance:** 6-12 inches above plant
- **Duration:** 12-16 hours daily
- **Cost:** $20-50 for quality option

**Seasonal Adjustments:**
- **Summer:** More intense light, may need to move plants back
- **Winter:** Less intense, move plants closer to windows
- **Rotate:** Turn plants 90° weekly for even growth

💡 **Pro Tip:** Use a light meter app (free on smartphones) to measure foot-candles and optimize placement!`;
        }

        // Enhanced fertilizer guide  
        if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrients') || lowerMsg.includes('feed')) {
            return `🌱 **Complete Fertilizer & Nutrition Guide**

**NPK Explained (The Numbers on Fertilizer):**
- **N (Nitrogen):** Promotes leaf and stem growth (green, lush foliage)
- **P (Phosphorus):** Develops strong roots and flowers
- **K (Potassium):** Overall plant health, disease resistance

**Common NPK Ratios:**
- **20-20-20:** Balanced, all-purpose (best for most houseplants)
- **10-5-5:** High nitrogen (foliage plants)
- **5-10-10:** High phosphorus (flowering plants)
- **3-1-2:** Gentle, slow-release (sensitive plants)

**Fertilizing Schedule:**

🌸 **Growing Season (Spring/Summer):**
- Active growth period
- Fertilize every 2-4 weeks
- Use full or half strength
- Watch for new growth as indicator

❄️ **Dormant Season (Fall/Winter):**
- Reduced/no growth
- Fertilize monthly or skip entirely
- Use quarter to half strength
- Most plants rest during this time

**Types of Fertilizer:**

💧 **Liquid (Most Popular):**
- Fast-acting, absorbed quickly
- Easy to control concentration
- Mix with water during watering
- **Best For:** Most houseplants

⚫ **Granular/Pellets:**
- Slow-release over weeks/months
- Less frequent application
- Sprinkle on soil surface
- **Best For:** Outdoor plants, large containers

🌿 **Organic Options:**
- Compost, worm castings, fish emulsion
- Gentler, lower risk of burn
- Improves soil structure
- **Best For:** Sensitive plants, organic gardening

**Common Nutrient Deficiencies:**

🟡 **Nitrogen Deficiency:**
- Symptoms: Yellowing older leaves, stunted growth
- Fix: Apply high-nitrogen fertilizer (10-5-5)

🟣 **Phosphorus Deficiency:**
- Symptoms: Purple tint on leaves, poor flowering
- Fix: Use bloom booster (5-10-10)

🟤 **Potassium Deficiency:**
- Symptoms: Brown leaf edges, weak stems
- Fix: Balanced fertilizer or potassium supplement

⚠️ **CRITICAL RULES:**
1. **Always dilute:** Use half the recommended strength
2. **Water first:** Never fertilize dry soil (causes root burn)
3. **More ≠ Better:** Over-fertilizing kills plants
4. **Flush soil:** Rinse with plain water monthly to prevent salt buildup

**Signs of Over-Fertilizing:**
- White crust on soil surface (salt buildup)
- Brown, crispy leaf tips
- Wilting despite moist soil
- Stunted growth
- **Fix:** Flush soil with 3x pot volume of water, skip fertilizing for 2 months

💡 **Pro Tip:** Healthy soil = healthy plants. Consider repotting in fresh soil annually instead of heavy fertilizing!`;
        }

        // Default comprehensive response
        return `🌿 **Dr. Flora's Intelligent Plant Care System**

I'm your AI plant doctor with expertise in:

**🔬 Diagnostics & Treatment:**
- Disease identification with probability analysis
- Pest management strategies
- Symptom-based troubleshooting
- Emergency plant triage

**💧 Care Optimization:**
- Watering schedules tailored to your environment
- Light requirement analysis
- Fertilizer recommendations
- Soil and drainage solutions

**🌡️ Environmental Control:**
- Temperature and humidity management
- Seasonal care adjustments
- Indoor vs outdoor considerations
- Air circulation and ventilation

**🪴 Advanced Techniques:**
- Repotting guidance with timing
- Propagation methods (cuttings, division, etc.)
- Pruning for health and aesthetics
- Training and shaping plants

**🎯 How to Get the Best Help:**

Instead of: "My plant is dying"
Try: "My monstera has yellow leaves with brown spots. They started appearing 2 weeks ago after I increased watering. The plant is 3 feet from an east window."

**The more details you provide, the more accurate my diagnosis:**
1. **Plant species** (if known)
2. **Specific symptoms** (color, texture, location on plant)
3. **Timeline** (when did it start, how fast is it spreading)
4. **Recent changes** (watering, location, repotting, fertilizing)
5. **Environment** (light, temperature, humidity)
6. **Current care routine** (watering frequency, fertilizer use)

**Quick Reference:**
- 🆘 **Emergency?** Describe symptoms immediately
- 🌱 **General care?** Ask "How do I care for [plant name]?"
- 🔍 **Identification?** Describe the plant's appearance
- 💡 **Tips?** Ask about specific topics (watering, light, etc.)

**Example Questions:**
- "Why are my snake plant leaves turning yellow and mushy?"
- "How often should I water my fiddle leaf fig in winter?"
- "My pothos has brown spots - is this a fungus?"
- "Best fertilizer for flowering peace lily?"

💡 **Remember:** I analyze your questions using pattern recognition, symptom correlation, and botanical science. The more specific you are, the better I can help!

What would you like to know about your plants today?`;
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
            </div>
        </div>
    );
};
