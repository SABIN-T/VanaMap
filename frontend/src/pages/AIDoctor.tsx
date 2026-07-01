import { useState, useRef, useEffect, useCallback, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download, Calendar, Camera, Mic, Volume2, VolumeX, Zap, Loader2, Settings, X, Stethoscope, CloudSun, ScrollText, CheckCircle2, AlertCircle } from 'lucide-react';
import { chatWithDrFlora, API_URL, fetchPlants, fetchVendors } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './AIDoctor.module.css';
import remarkGfm from 'remark-gfm';
import { mlCache } from '../utils/mlCache';
import { Helmet } from 'react-helmet-async';
import { useAIDoctorStream } from '../hooks/useAIDoctorStream';

// Lazy load ReactMarkdown for faster mobile load
const ReactMarkdown = lazy(() => import('react-markdown'));

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    image?: string;
    images?: string[]; // Support for multiple AI models (Flux & SDXL)
}

const ImageLoader = ({ idx }: { idx: number }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(old => {
                if (old >= 95) return old;
                // Random jump to simulate network traffic
                const jump = Math.floor(Math.random() * 5) + 1;
                return Math.min(old + jump, 95);
            });
        }, 300); // Update every 300ms
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 5,
            transition: 'opacity 0.3s'
        }}>
            <div style={{ animation: 'spin 1.5s linear infinite', display: 'flex', color: '#059669' }}>
                <Loader2 size={42} />
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>
                    {idx === 0 ? 'Painting Botanical Art...' : 'Developing Photo...'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Estimated Progress: {progress}%
                </div>
                {/* Visual Progress Bar */}
                <div style={{
                    width: '120px',
                    height: '4px',
                    background: '#e2e8f0',
                    borderRadius: '2px',
                    marginTop: '8px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#10b981',
                        transition: 'width 0.3s ease-out'
                    }} />
                </div>
            </div>
        </div>
    );
};

export const AIDoctor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "🌿 Hello! I'm Dr. Flora, your AI Plant Doctor. I have extensive knowledge about plant care, diseases, and treatments. How can I help your plants thrive today?",
            timestamp: new Date()
        }
    ]);
    const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
    const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeDossiers, setActiveDossiers] = useState<any[]>([]);
    
    // --- CART & SUPPLIES RECOMMENDATION STATES ---
    const { addToCart } = useCart();
    const [careProducts, setCareProducts] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            try {
                const [plantsList, vendorsList] = await Promise.all([
                    fetchPlants(),
                    fetchVendors()
                ]);
                setCareProducts(plantsList.filter((p: any) => p.type === 'care'));
                setVendors(vendorsList);
            } catch (e) {
                console.error("Error loading products/vendors for AI Doctor:", e);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (messages.length === 0 || careProducts.length === 0) return;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== 'assistant') return;

        const content = lastMessage.content.toLowerCase();
        const matched: any[] = [];

        if (content.includes('pest') || content.includes('mite') || content.includes('aphid') || content.includes('mealybug') || content.includes('insect') || content.includes('bug')) {
            const neem = careProducts.find(p => p.id === 'care_neem_oil');
            if (neem) matched.push(neem);
        }
        if (content.includes('fertilizer') || content.includes('npk') || content.includes('nutrient') || content.includes('nitrogen') || content.includes('growth') || content.includes('yellow leaf') || content.includes('yellowing')) {
            const npk = careProducts.find(p => p.id === 'care_npk_fertilizer');
            if (npk) matched.push(npk);
        }
        if (content.includes('fung') || content.includes('fungus') || content.includes('mildew') || content.includes('rust') || content.includes('mold') || content.includes('rot') || content.includes('spot')) {
            const fungicide = careProducts.find(p => p.id === 'care_fungicide');
            if (fungicide) matched.push(fungicide);
        }
        if (content.includes('soil') || content.includes('potting') || content.includes('repot') || content.includes('mix') || content.includes('compost')) {
            const soil = careProducts.find(p => p.id === 'care_soil_mix');
            if (soil) matched.push(soil);
        }

        setSuggestedProducts(matched);
    }, [messages, careProducts]);

    const handleAddCareToCart = (product: any) => {
        // Find the first vendor that has this product in their inventory
        const seller = vendors.find(v => v.inventory?.some((i: any) => i.plantId === product.id));
        const sellerId = seller ? seller.id : undefined;
        const sellerPrice = seller?.inventory?.find((i: any) => i.plantId === product.id)?.price || product.price;
        addToCart(product, sellerId, sellerPrice);
    };

    // --- GROWTH SIMULATOR STATES ---
    const [showGrowthSim, setShowGrowthSim] = useState(false);
    const [simPlant, setSimPlant] = useState('Monstera Deliciosa');
    const [simMonths, setSimMonths] = useState(6); // 1, 3, 6, 12, 24
    const [simLight, setSimLight] = useState('Medium'); // Low, Medium, High
    const [simWater, setSimWater] = useState('Medium'); // Low, Medium, High
    const [simImageLoading, setSimImageLoading] = useState(false);
    const [simImageUrl, setSimImageUrl] = useState('');

    useEffect(() => {
        if (!showGrowthSim) return;
        setSimImageLoading(true);
        const seed = 42;
        const monthsText = simMonths === 1 ? '1 month sprout' :
                           simMonths === 3 ? '3 months young sprout' :
                           simMonths === 6 ? '6 months young plant' :
                           simMonths === 12 ? '12 months established plant' : '24 months mature plant';
        
        const envText = `${simLight} sunlight conditions, watered ${simWater.toLowerCase()}`;
        const prompt = `A professional close up botanical studio photo of a ${simPlant} at ${monthsText} stage, grown under ${envText}, healthy glossy leaves, in a modern ceramic pot, solid clean background, studio lighting`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&model=flux&seed=${seed}&nologo=true`;
        
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setSimImageUrl(url);
            setSimImageLoading(false);
        };
        img.onerror = () => {
            setSimImageUrl(url);
            setSimImageLoading(false);
        };
    }, [simPlant, simMonths, simLight, simWater, showGrowthSim]);

    const getGrowthDetails = () => {
        const heightEstimates: Record<string, Record<number, string>> = {
            'Monstera Deliciosa': { 1: '10-15 cm', 3: '20-30 cm', 6: '40-60 cm', 12: '80-120 cm (leaf splits starting)', 24: '150-200 cm (large fenestrations)' },
            'Snake Plant': { 1: '15-20 cm', 3: '25-35 cm', 6: '40-50 cm', 12: '60-80 cm (compact clusters)', 24: '90-120 cm (tall sword leaves)' },
            'Pothos': { 1: '15-25 cm (vines)', 3: '30-50 cm', 6: '60-100 cm (trailing)', 12: '120-180 cm', 24: '200-300 cm (lush waterfall)' },
            'Peace Lily': { 1: '12-18 cm', 3: '20-25 cm', 6: '30-40 cm', 12: '45-60 cm (white spathes blooming)', 24: '70-90 cm (dense clumps)' }
        };
        
        const defaultHeight: Record<number, string> = { 1: '8-12 cm', 3: '15-25 cm', 6: '30-40 cm', 12: '50-80 cm', 24: '100-150 cm' };
        const pHeights = heightEstimates[simPlant] || defaultHeight;
        const predictedHeight = pHeights[simMonths];
        
        let healthAdvice = "Ensure balanced care. Avoid overwatering.";
        if (simWater === 'Frequent') {
            healthAdvice = "⚠️ Warning: Watering too frequently can cause root rot. Let top soil dry.";
        } else if (simWater === 'Low' && simMonths > 6) {
            healthAdvice = "Plant might grow slower due to dry conditions. Mist foliage.";
        } else if (simLight === 'Low' && simPlant === 'Monstera Deliciosa') {
            healthAdvice = "Low light will limit leaf splits (fenestrations). Move to indirect bright light.";
        } else if (simLight === 'High') {
            healthAdvice = "Watch out for direct sun scorching. Ensure filtered light.";
        }
        
        return {
            height: predictedHeight,
            advice: healthAdvice,
            foliage: simMonths <= 3 ? "Young sprouting leaves" : simMonths <= 12 ? "Lush, expanding foliage" : "Matured adult foliage, full growth"
        };
    };

    // WebSocket streaming
    const { isConnected: wsConnected, isStreaming, sendMessage: sendWsMessage } = useAIDoctorStream();

    // --- IMAGE UPLOAD (Plant Diagnosis) ---
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleScanClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image too large. Please select an image under 5MB.");
                return;
            }
            const url = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewUrl(url);
            toast.success("Image added! Type your question and send.");
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastSpokenMessageIdRef = useRef<string | null>(null);


    const [neuralMeta, setNeuralMeta] = useState<{ current: number; max: number } | null>(() => {
        const saved = localStorage.getItem('drflora_neural_meta');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    });

    // Proactive check: If Neural Energy is 0, we track it locally
    const [isAnalysisLimited, setIsAnalysisLimited] = useState(false);

    useEffect(() => {
        if (neuralMeta && neuralMeta.current <= 0) {
            setIsAnalysisLimited(true);
        } else {
            setIsAnalysisLimited(false);
        }
    }, [neuralMeta]);


    const [showLimitInfo, setShowLimitInfo] = useState(false);

    // --- SPECIALTY PERSONA SYSTEM ---
    const [persona, setPersona] = useState<'flora' | 'geneticist' | 'ayurvedic'>(() => {
        return (localStorage.getItem('drflora_persona') as any) || 'flora';
    });

    // --- GARDEN CLINIC (MEDICAL RECORDS) ---
    const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
    const [showClinic, setShowClinic] = useState(false);
    const [clinicLoading, setClinicLoading] = useState(false);

    // --- CLIMATE AWARENESS ---
    const [weather, setWeather] = useState<any>(null);

    const fetchWeather = async () => {
        try {
            // Simplified: User geolocation or default city? 
            // In a real app, we'd use navigator.geolocation
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.city) {
                // Mocking weather for demo context - in production we'd call OpenWeather
                setWeather({ city: data.city, avgTemp30Days: 28, humidity: 65 });
            }
        } catch (e) {
            console.warn('Weather fetch failed');
        }
    };

    const fetchMedicalRecords = async () => {
        if (!user) return;
        setClinicLoading(true);
        try {
            const res = await fetch(`${API_URL}/user/medical-records`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setMedicalRecords(data);
        } catch (e) {
            console.error('Failed to fetch records');
        } finally {
            setClinicLoading(false);
        }
    };

    const handlePersonaChange = async (p: 'flora' | 'geneticist' | 'ayurvedic') => {
        setPersona(p);
        localStorage.setItem('drflora_persona', p);
        if (user) {
            try {
                await fetch(`${API_URL}/user/persona`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ persona: p })
                });
            } catch (e) { /* silent fail */ }
        }
        toast.success(`Specialist changed to: ${p.toUpperCase()}`, { icon: '🎓' });
    };

    useEffect(() => {
        fetchWeather();
        if (user) fetchMedicalRecords();
    }, [user]);

    const handleUpdateRecordStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`${API_URL}/user/medical-records/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setMedicalRecords(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
            toast.success(`Plant marked as ${newStatus}! 🎉`, { icon: '🌿' });
        } catch (e) {
            toast.error("Failed to update status");
        }
    };


    // Optimized scroll for mobile
    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages, scrollToBottom]);

    // Web Search for Scientific Plant Data

    const handleSend = async (contentOverride?: string) => {
        stopSpeaking();
        const textToSend = typeof contentOverride === 'string' ? contentOverride : input;

        if (!textToSend.trim() && !selectedImage) return;

        const messageContent = textToSend || "What plant is this?";
        let base64Image: string | null = null;

        if (selectedImage) {
            try {
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedImage);
                });
            } catch {
                toast.error("Failed to process image");
                return;
            }
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date(),
            image: base64Image || undefined
        };

        if (base64Image && isAnalysisLimited) {
            toast.error("🎨 Neural analysis limit reached! Switching to text-only mode.", { icon: '📊' });
            base64Image = null;
            userMessage.image = undefined;
            userMessage.content = textToSend || "Please help me with this plant (limit reached, sending text only)";
        }

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        clearImage();

        // Check ML Cache first (text-only queries)
        if (!base64Image) {
            const cachedResponse = mlCache.findSimilar(messageContent);
            if (cachedResponse) {
                console.log('[ML Cache] ✅ Cache HIT - Reusing response');
                const cachedMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: cachedResponse.response + '\n\n_💡 Instant response from learned knowledge_',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, cachedMessage]);
                setLoading(false);
                toast.success('⚡ Instant response (saved API call!)', { duration: 2000, icon: '🧠' });
                return;
            }
        }

        const conversationHistory = [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
            image: m.image
        }));

        // Try WebSocket streaming for text-only queries
        if (wsConnected && !base64Image) {
            console.log('[AI Doctor] Using WebSocket streaming');

            const streamingMessageId = (Date.now() + 1).toString();
            const placeholderMessage: Message = {
                id: streamingMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, placeholderMessage]);

            let accumulatedContent = '';

            sendWsMessage({
                messages: conversationHistory,
                userContext: {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    city: weather?.city,
                    weather: weather
                },
                image: base64Image,
                persona: persona,
                onMetadata: (metadata: any) => {
                    if (metadata && Array.isArray(metadata) && metadata.length > 0) {
                        setActiveDossiers(metadata);
                    }
                },
                onChunk: (chunk: string) => {
                    accumulatedContent += chunk;
                    setMessages(msgs => msgs.map(m =>
                        m.id === streamingMessageId
                            ? { ...m, content: accumulatedContent }
                            : m
                    ));
                },
                onComplete: (fullMessage: string) => {
                    setLoading(false);

                    if (messageContent && fullMessage) {
                        mlCache.add(messageContent, fullMessage);
                        console.log('[ML Cache] 💾 Response cached for future use');
                    }

                    if (user && (fullMessage.includes('DIAGNOSIS:') || fullMessage.includes('TREATMENT:'))) {
                        setTimeout(fetchMedicalRecords, 3000);
                    }
                },
                onError: (error: string) => {
                    console.error('[WebSocket] Error:', error);
                    setLoading(false);
                    setMessages(prev => prev.filter(m => m.id !== streamingMessageId));

                    console.log('[AI Doctor] Falling back to REST API');
                    handleSendREST(conversationHistory, base64Image, messageContent);
                }
            });
            return;
        }

        // Use REST API for images or when WebSocket unavailable
        console.log('[AI Doctor] Using REST API');
        await handleSendREST(conversationHistory, base64Image, messageContent);
    };

    const handleSendREST = async (conversationHistory: any[], base64Image: string | null, messageContent: string) => {
        try {
            const response = await chatWithDrFlora(
                conversationHistory,
                {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    city: weather?.city,
                    weather: weather
                },
                base64Image,
                persona
            );

            console.log('[AI Doctor] Raw API Response:', response);

            if (response.matchedFlora && Array.isArray(response.matchedFlora) && response.matchedFlora.length > 0) {
                setActiveDossiers(response.matchedFlora);
            }

            if (response.usageMeta) {
                const remaining = parseInt(response.usageMeta.remaining || '0') || 0;
                const limit = parseInt(response.usageMeta.limit || '100000') || 100000;
                const newMeta = { current: remaining, max: limit };
                setNeuralMeta(newMeta);
                localStorage.setItem('drflora_neural_meta', JSON.stringify(newMeta));

                if (remaining <= 0) {
                    setIsAnalysisLimited(true);
                    toast("🚫 Neural capacity reached for today. Basic text mode active.", { icon: '⚠️' });
                } else if (remaining < 20000) {
                    toast("⚠️ Neural Energy Low!", { icon: '⚡' });
                }
            }

            let aiText = response.choices?.[0]?.message?.content;

            if (!aiText) {
                if (response.refusal) {
                    aiText = `I cannot answer that: ${response.refusal}`;
                } else if (base64Image) {
                    aiText = "I apologize, but I couldn't process this photo. **Please give a proper image to analyze**.";
                } else {
                    aiText = "I apologize, I'm having trouble connecting right now. Please try asking again.";
                }
                console.warn('[AI Doctor] Empty content received', response);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiText,
                image: response.choices?.[0]?.message?.image,
                images: response.choices?.[0]?.message?.images,
                timestamp: new Date()
            };

            console.log('[AI Doctor] 📦 Full API Response:', {
                hasChoices: !!response.choices,
                choicesLength: response.choices?.length,
                messageContent: response.choices?.[0]?.message?.content?.substring(0, 100) + '...',
                hasImage: !!response.choices?.[0]?.message?.image,
                hasImages: !!response.choices?.[0]?.message?.images,
                imageUrl: response.choices?.[0]?.message?.image,
                imagesArray: response.choices?.[0]?.message?.images
            });

            if (assistantMessage.images || assistantMessage.image) {
                console.log('[AI Doctor] 🎨 Images detected in response:');
                console.log('  - Single image:', assistantMessage.image);
                console.log('  - Multiple images:', assistantMessage.images);
                console.log('  - Total images:', assistantMessage.images?.length || (assistantMessage.image ? 1 : 0));
            } else {
                console.log('[AI Doctor] ℹ️ No images in this response');
                console.log('[AI Doctor] 🔍 Checking for GENERATE tag in content:', aiText?.includes('[GENERATE'));
            }


            setMessages(prev => [...prev, assistantMessage]);

            if (user && (aiText.includes('DIAGNOSIS:') || aiText.includes('TREATMENT:'))) {
                setTimeout(fetchMedicalRecords, 3000);
            }

            const isErrorMessage = aiText.includes("trouble connecting") || aiText.includes("AI Service Unavailable");
            if (!base64Image && aiText && messageContent && !isErrorMessage) {
                mlCache.add(messageContent, aiText);
                console.log('[ML Cache] 💾 Response cached for future use');
            }

        } catch (error: any) {
            console.error('[AI Doctor] Error:', error);

            if (base64Image && !isAnalysisLimited) {
                console.log('[AI Doctor] Image analysis failed, attempting Text-Only fallback...');
                setIsAnalysisLimited(true);
                try {
                    const fallbackResponse = await chatWithDrFlora(
                        messages.map(m => ({ role: m.role, content: m.content })),
                        { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                        null
                    );

                    const fallbackMessage: Message = {
                        id: (Date.now() + 2).toString(),
                        role: 'assistant',
                        content: `⚠️ **I had trouble with that photo.** Please **give a proper image to analyze**.\n\n${fallbackResponse.choices?.[0]?.message?.content}`,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, fallbackMessage]);
                    setLoading(false);
                    return;
                } catch {
                    console.error("Text fallback failed");
                }
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "⚠️ **Dr. Flora is momentarily offline.** I'm undergoing a neural recalibration. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleCareCalendar = () => {
        let prompt = "Please create a detailed weekly care calendar (watering, light, fertilizer) for my plants.";

        // Smart Context: Use cart items if available
        // Assuming 'user' is available in the component's scope, e.g., from a context or prop
        // For this example, 'user' is not defined in the provided snippet, so this part might need adjustment
        // based on your actual application structure.

        if (user?.cart && user.cart.length > 0) {
            const plantNames = user.cart.map((i: any) => i.name || "plants").join(", ");
            prompt = `Please create a detailed weekly care calendar for these plants: ${plantNames}. Include specific days for watering.`;
        }

        handleSend(prompt);
    };

    const downloadImage = async (base64OrUrl: string, messageId: string) => {
        try {
            setDownloadingIds(prev => new Set(prev).add(messageId));
            toast.loading("Preparing high-quality PNG...", { id: `dl-${messageId}` });

            // Robust URL resolution
            let urlToFetch = base64OrUrl;
            if (base64OrUrl.startsWith('/')) {
                const baseUrl = API_URL.replace(/\/api$/, '');
                urlToFetch = `${baseUrl}${base64OrUrl}`;
            }

            // Check if it's base64 data
            if (urlToFetch.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = urlToFetch;
                link.download = `DrFlora_Scan_${messageId}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                completeDownload(messageId);
                return;
            }

            // For http/https URLs (including our backend generated ones), fetch as Blob
            const response = await fetch(urlToFetch);
            if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `DrFlora_Botanical_${messageId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            window.URL.revokeObjectURL(blobUrl);
            completeDownload(messageId);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(messageId);
                return next;
            });
            toast.error('Download failed. Opening in new tab...', { id: `dl-${messageId}` });
            window.open(base64OrUrl, '_blank');
        }
    };

    const completeDownload = (messageId: string) => {
        setDownloadingIds(prev => {
            const next = new Set(prev);
            next.delete(messageId);
            return next;
        });
        toast.success("Image saved! ✅", { id: `dl-${messageId}` });
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

    // --- ELEVENLABS VOICE ASSISTANT ---
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>('XB0fDUnXU5powFXDhCwa'); // Default: Charlotte
    const [availableVoices, setAvailableVoices] = useState<any[]>([]);
    const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fetch available voices on mount
    useEffect(() => {
        const fetchVoices = async () => {
            try {
                const res = await fetch(`${API_URL}/chat/voices`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailableVoices(data);
                }
            } catch (err) {
                console.error("Failed to load voices:", err);
            }
        };
        fetchVoices();

        // Load saved voice preference
        const savedVoice = localStorage.getItem('drflora_voice_id');
        if (savedVoice) setSelectedVoiceId(savedVoice);
    }, []);

    // Helper: Clean text for natural speech (Remove markdown, emojis, system jargon)
    const cleanTextForSpeech = (text: string) => {
        if (!text) return "";
        let clean = text;

        // 1. Remove Markdown structure but keep the text
        clean = clean.replace(/#{1,6}\s?/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/!\[.*?\]/g, ''); // Remove images completely

        // 2. Remove URLs
        clean = clean.replace(/https?:\/\/\S+/g, 'link');

        // 3. Remove Emojis
        clean = clean.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');

        // 4. Remove Specific System Tags & Jargon
        const systemRegex = /\[(?:GENERATE|Image description|ID|SCIENTIFIC DOSSIER|USER PROFILE):.*?\]/gi;
        clean = clean.replace(systemRegex, "");

        const systemPhrases = [
            "Response from learned knowledge",
            "Expert 1:", "Expert 2:", "Expert 3:",
            "DeepSeek says:",
            "Response from memory",
            "Here is the generated image:",
            "GENERATE:",
            "Image description:",
            "DIAGNOSIS:",
            "TREATMENT:",
            "Plant:",
            "Scientific Name:"
        ];
        systemPhrases.forEach(phrase => {
            const re = new RegExp(phrase, "gi");
            clean = clean.replace(re, "");
        });

        // 5. Cleanup "Dr." Stuttering & Common TTS Jargon
        clean = clean.replace(/\bDr\.\b/gi, 'Doctor');

        // Remove repetitive words like "is is"
        clean = clean.replace(/\b(\w+)\s+\1\b/gi, '$1');

        // 6. Cleanup whitespace and punctuation for flow
        clean = clean.replace(/\s+/g, ' ').trim();

        // Add a small pause after sentences if missing by ending with period
        if (clean && !clean.endsWith('.') && !clean.endsWith('?') && !clean.endsWith('!')) {
            clean += '.';
        }

        return clean;
    };

    const stopSpeaking = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const speak = useCallback(async (text: string, overrideVoiceId?: string) => {
        if (!voiceEnabled) return;

        stopSpeaking();
        setIsSpeaking(true);

        const targetVoiceId = overrideVoiceId || selectedVoiceId;
        const cleanText = cleanTextForSpeech(text);
        if (!cleanText) return;

        try {
            const response = await fetch(`${API_URL}/chat/speak`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: cleanText,
                    voiceId: targetVoiceId
                })
            });

            if (!response.ok) throw new Error("Voice synthesis failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();

        } catch (error) {
            console.warn("High-quality voice service failed, using browser fallback.", error);
            setIsSpeaking(false);

            // Inform user about fallback
            toast("Synthesizer Offline: Using Basic Voice", { icon: '🤖', duration: 2000 });

            const utterance = new SpeechSynthesisUtterance(cleanText);
            // Try to find a better sounding browser voice if possible
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [voiceEnabled, selectedVoiceId, stopSpeaking]);

    const handleVoiceSelect = (voiceId: string) => {
        setSelectedVoiceId(voiceId);
        localStorage.setItem('drflora_voice_id', voiceId);
        setIsVoiceSelectorOpen(false);
        toast.success("Voice updated! 🎙️");

        // Preview with the NEW voice ID immediately
        speak("Hello, do you like my new voice?", voiceId);
    };

    const toggleVoice = () => {
        if (voiceEnabled) {
            stopSpeaking();
            setVoiceEnabled(false);
            toast("Voice Assistant Disabled", { icon: '🔇' });
        } else {
            stopSpeaking(); // Stop any pending or lingering audio
            setVoiceEnabled(true);
            toast("Dr. Flora's Voice Enabled! 🎧", { icon: '🗣️' });
        }
    };

    // Auto-speak new AI messages
    useEffect(() => {
        if (!messages.length) return;
        const lastMsg = messages[messages.length - 1];

        if (voiceEnabled && lastMsg.role === 'assistant' && lastMsg.id !== '1') {
            if (lastSpokenMessageIdRef.current !== lastMsg.id) {
                lastSpokenMessageIdRef.current = lastMsg.id;

                // Only speak if there's actual content after cleaning
                const cleanText = cleanTextForSpeech(lastMsg.content);
                if (cleanText.trim()) {
                    speak(lastMsg.content);
                }
            }
        }
    }, [messages, voiceEnabled, speak]);

    // Fetch personalized agent greeting with contextual memory on mount
    useEffect(() => {
        let isMounted = true;
        const fetchProactiveGreeting = async () => {
            const token = localStorage.getItem('token');
            if (!token) return; // Keep default welcome if not logged in

            try {
                const res = await fetch(`${API_URL}/chat/greet`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) return;
                const data = await res.json();
                if (isMounted && data.greeting) {
                    const newGreetMsg = {
                        id: 'greet-' + Date.now(),
                        role: 'assistant' as const,
                        content: data.greeting,
                        timestamp: new Date()
                    };
                    
                    setMessages(prev => {
                        // Only replace if the only message is the initial default one
                        if (prev.length === 1 && prev[0].id === '1') {
                            return [newGreetMsg];
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch proactive greeting:", err);
            }
        };

        fetchProactiveGreeting();
        return () => {
            isMounted = false;
        };
    }, [user?.id]);


    // --- SPEECH RECOGNITION (Microphone Input) ---
    const [isListening, setIsListening] = useState(false);
    // Use a ref to keep track of the recognition instance
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Your browser doesn't support speech recognition. Try Chrome or Edge!");
            return;
        }

        const recognition = new SpeechRecognition();

        // Enhanced Configuration for Better Recognition
        recognition.continuous = false; // Stop after one phrase
        recognition.interimResults = true; // Show real-time results

        // Auto-detect user's language or use browser default
        // Supports: en-US, hi-IN, es-ES, fr-FR, de-DE, ja-JP, zh-CN, ar-SA, etc.
        const userLang = navigator.language || 'en-US';
        recognition.lang = userLang;

        console.log(`[Voice Input] Using language: ${userLang}`);

        recognition.onstart = () => {
            setIsListening(true);
            stopSpeaking(); // Ensure AI stops speaking when user starts
            toast(`🎤 Listening in ${userLang}...`, {
                icon: '👂',
                duration: 3000,
                style: {
                    background: '#10b981',
                    color: 'white'
                }
            });
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            // Only process FINAL results to avoid duplication
            const lastResult = event.results[event.results.length - 1];

            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript.trim();

                if (transcript) {
                    // Replace input entirely with final transcript (no appending)
                    setInput(transcript);

                    toast.success(`Heard: "${transcript}"`, {
                        icon: '✅',
                        duration: 2000
                    });
                }
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);

            // User-friendly error messages
            switch (event.error) {
                case 'not-allowed':
                case 'permission-denied':
                    toast.error("🚫 Microphone access denied. Please allow microphone in browser settings.");
                    break;
                case 'no-speech':
                    toast("No speech detected. Please try again.", { icon: '🤔' });
                    break;
                case 'network':
                    toast.error("Network error. Check your internet connection.");
                    break;
                case 'language-not-supported':
                    toast.error(`Language ${userLang} not supported. Switching to English.`);
                    recognition.lang = 'en-US';
                    break;
                default:
                    toast.error(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (error) {
            console.error("Failed to start recognition:", error);
            toast.error("Could not start voice recognition. Please try again.");
            setIsListening(false);
        }
    };



    return (
        <div className={styles.container}>
            <Helmet>
                <title>Dr. Flora AI - Plant Disease Diagnosis & Care | VanaMap</title>
                <meta name="description" content="Chat with Dr. Flora, your personal AI plant doctor. Diagnose plant diseases from photos, get care schedules, and voice-guided gardening advice." />
                <link rel="canonical" href="https://www.vanamap.online/ai-doctor" />
            </Helmet>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <button
                        onClick={() => navigate('/')}
                        className={styles.actionBtn}
                        style={{ marginRight: '0.5rem' }}
                        title="Go Home"
                    >
                        <X size={20} />
                    </button>

                    <div className={styles.logoIcon}>
                        <Bot size={24} />
                    </div>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>Dr. Flora AI</h1>
                        <span className={styles.subtitle}>{persona === 'flora' ? 'Botanical Soul' : persona === 'geneticist' ? 'Molecular Specialist' : 'Herbal Wisdom'}</span>
                    </div>

                    {/* Climate Awareness Badge - Hide on tiny screens */}
                    {weather && (
                        <div className={`${styles.climateBadge} hide-on-mobile`}>
                            <CloudSun size={14} />
                            <span>{weather.city}: {weather.avgTemp30Days}°C</span>
                        </div>
                    )}

                    {/* WebSocket Streaming Status */}
                    {wsConnected && (
                        <div className={`${styles.climateBadge} hide-on-mobile`} style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#10b981',
                                animation: 'pulse 2s infinite'
                            }} />
                            <span>Live</span>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {/* Neural Energy Display */}
                        {neuralMeta && (
                            <div
                                onClick={() => setShowLimitInfo(true)}
                                className={styles.climateBadge}
                                style={{
                                    background: (neuralMeta.current < 20000 || isAnalysisLimited) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: (neuralMeta.current < 20000 || isAnalysisLimited) ? '#ef4444' : '#10b981',
                                    border: `1px solid ${(neuralMeta.current < 20000 || isAnalysisLimited) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                    cursor: 'pointer'
                                }}
                            >
                                <Zap size={14} fill={(neuralMeta.current < 20000 || isAnalysisLimited) ? "#ef4444" : "#10b981"} />
                                <span className="hide-on-mobile">{isAnalysisLimited ? "RECHARGE" : `${(neuralMeta.current / 1000).toFixed(1)}k Ops`}</span>
                            </div>
                        )}

                        <button
                            className={`${styles.actionBtn} ${showClinic ? styles.active : ''}`}
                            onClick={() => setShowClinic(!showClinic)}
                            title="Garden Clinic"
                        >
                            <div style={{ position: 'relative' }}>
                                <Stethoscope size={20} />
                                {medicalRecords.length > 0 && <span className={styles.recordBadge}>{medicalRecords.length}</span>}
                            </div>
                        </button>

                        <button
                            className={styles.actionBtn}
                            onClick={toggleVoice}
                            style={voiceEnabled ? { color: '#10b981', borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.1)' } : {}}
                            title="Voice Mode"
                        >
                            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        <button
                            className={`${styles.actionBtn} ${showGrowthSim ? styles.active : ''}`}
                            onClick={() => setShowGrowthSim(true)}
                            title="Growth Simulator"
                        >
                            <Calendar size={20} />
                        </button>

                        {/* Extra Actions Menu - Unified */}
                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsVoiceSelectorOpen(true)}
                            title="Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Council of Experts (Horizontal Persona Bar) */}
            <div className={styles.councilBar}>
                <button
                    className={`${styles.expertBtn} ${persona === 'flora' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('flora')}
                >
                    <Bot size={18} />
                    <span>Flora</span>
                </button>
                <button
                    className={`${styles.expertBtn} ${persona === 'geneticist' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('geneticist')}
                >
                    <Zap size={18} />
                    <span>Geneticist</span>
                </button>
                <button
                    className={`${styles.expertBtn} ${persona === 'ayurvedic' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('ayurvedic')}
                >
                    <Leaf size={18} />
                    <span>Ayurvedic</span>
                </button>
            </div>

            {/* Garden Clinic Side Panel */}
            {showClinic && (
                <div className={styles.clinicOverlay} onClick={() => setShowClinic(false)}>
                    <div className={styles.clinicPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.clinicHeader}>
                            <h3 className={styles.clinicTitle}>
                                <Stethoscope size={22} className="text-primary" />
                                Patient Records
                            </h3>
                            <button onClick={() => setShowClinic(false)} className={styles.closeClinic}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.clinicContent}>
                            {clinicLoading ? (
                                <div className={styles.clinicLoading}>
                                    <Loader2 className="animate-spin" size={32} />
                                    <span>Accessing secure medical database...</span>
                                </div>
                            ) : medicalRecords.length === 0 ? (
                                <div className={styles.emptyClinic}>
                                    <ScrollText size={56} opacity={0.3} />
                                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>No plants currently under observation.</p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Start a diagnosis with a photo to create records.</p>
                                </div>
                            ) : (
                                <div className={styles.recordsList}>
                                    {medicalRecords.map((record) => (
                                        <div key={record._id} className={styles.recordItem}>
                                            <div className={styles.recordMain}>
                                                <div>
                                                    <h4 className={styles.recordPlantName}>{record.plantName}</h4>
                                                    <p className={styles.recordScientific}>{record.scientificName}</p>
                                                </div>
                                                <div className={`${styles.recordSeverity} ${styles[record.severity]}`}>
                                                    {record.severity}
                                                </div>
                                            </div>
                                            <div className={styles.recordDiagnosInfo}>
                                                <strong>Condition:</strong> {record.diagnosis}
                                            </div>
                                            <div className={styles.recordTreatment}>
                                                <strong>Prescription:</strong> {record.treatment}
                                            </div>
                                            <div className={styles.recordMeta}>
                                                <div
                                                    className={`${styles.statusBadge} ${styles[record.status]}`}
                                                    style={{ cursor: record.status === 'active' ? 'pointer' : 'default' }}
                                                    onClick={() => record.status === 'active' && handleUpdateRecordStatus(record._id, 'resolved')}
                                                >
                                                    {record.status === 'active' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                                                    {record.status}
                                                    {record.status === 'active' && <span style={{ fontSize: '0.6rem', marginLeft: '4px', opacity: 0.7 }}>(Click to Resolve)</span>}
                                                </div>
                                                <span style={{ marginLeft: 'auto' }}>
                                                    {new Date(record.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Voice Pack Modal */}
            {isVoiceSelectorOpen && (
                <div className={styles.overlay} onClick={() => setIsVoiceSelectorOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Mic size={24} className="text-primary" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Voice Personalities</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Choose how Dr. Flora sounds</p>
                                </div>
                            </div>
                            <button onClick={() => setIsVoiceSelectorOpen(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                                {availableVoices.map((voice) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => handleVoiceSelect(voice.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '1.25rem',
                                            background: selectedVoiceId === voice.id ? 'var(--flora-primary)' : 'var(--flora-card)',
                                            border: '1px solid var(--flora-border)',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            width: '100%',
                                            textAlign: 'left',
                                            color: selectedVoiceId === voice.id ? 'white' : 'var(--flora-text)'
                                        }}
                                    >
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '15px',
                                            background: selectedVoiceId === voice.id ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Mic size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{voice.name}</div>
                                            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{voice.style} • {voice.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button className={styles.expertBtn} onClick={() => { setIsVoiceSelectorOpen(false); setShowGrowthSim(true); }} style={{ flex: 1 }}>
                                    <Calendar size={18} /> Growth Simulator
                                </button>
                                <button className={styles.expertBtn} onClick={handleCareCalendar} style={{ flex: 1 }}>
                                    <ScrollText size={18} /> Generate Schedule
                                </button>
                                <button className={styles.expertBtn} onClick={handleExport} style={{ flex: 1 }}>
                                    <Download size={18} /> Save Transcript
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Theatre */}
            <div className={styles.chatContainer}>
                <div className={styles.messagesWrapper}>
                    {messages.map((message, index) => (
                        <div key={message.id} className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                            <div className={styles.messageIcon}>
                                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageSender}>
                                    {message.role === 'user' ? 'You' : 'Dr. Flora AI'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                {((message.images && message.images.length > 0) || message.image) && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: (message.images && message.images.length > 1) ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
                                        gap: '12px',
                                        marginBottom: '1rem',
                                        width: '100%'
                                    }}>
                                        {(message.images && message.images.length > 0 ? message.images : (message.image ? [message.image] : [])).map((imgUrl, idx) => {
                                            const imageKey = `${message.id}-${idx}`;
                                            return (
                                                <div key={imageKey} className={styles.recordItem} style={{ position: 'relative', padding: '6px', overflow: 'hidden', minHeight: '300px' }}>
                                                    <img
                                                        src={(() => {
                                                            if (!imgUrl) return '';
                                                            if (imgUrl.startsWith('data:')) return imgUrl;
                                                            if (imgUrl.startsWith('http')) return imgUrl;
                                                            return `${API_URL.replace(/\/api$/, '')}/${imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl}`;
                                                        })()}
                                                        alt="Patient Scan"
                                                        className={styles.revealAnimation}
                                                        onLoad={() => setLoadedImageIds(prev => new Set(prev).add(imageKey))}
                                                        style={{ width: '100%', maxHeight: '500px', borderRadius: '16px', objectFit: 'cover' }}
                                                    />

                                                    <div style={{
                                                        position: 'absolute', top: '15px', left: '15px',
                                                        background: 'var(--flora-primary)', color: 'white',
                                                        padding: '4px 12px', borderRadius: '30px',
                                                        fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                    }}>
                                                        {idx === 0 ? 'NEURAL ART' : 'HD DIAGNOSIS'}
                                                    </div>

                                                    <button
                                                        onClick={() => downloadImage(imgUrl!, imageKey)}
                                                        disabled={downloadingIds.has(imageKey)}
                                                        className={styles.sendBtn}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '15px',
                                                            right: '15px',
                                                            width: 'auto',
                                                            padding: '0 15px',
                                                            gap: '8px',
                                                            opacity: downloadingIds.has(imageKey) ? 0.7 : 1,
                                                            cursor: downloadingIds.has(imageKey) ? 'wait' : 'pointer'
                                                        }}
                                                    >
                                                        {downloadingIds.has(imageKey) ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Download size={16} />
                                                        )}
                                                        <span>{downloadingIds.has(imageKey) ? 'Saving...' : 'Save PNG'}</span>
                                                    </button>

                                                    {!loadedImageIds.has(imageKey) && <ImageLoader idx={idx} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className={styles.messageText}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>

                                {message.role === 'assistant' && index === messages.length - 1 && suggestedProducts.length > 0 && (
                                    <div className={styles.suggestionsContainer}>
                                        <div className={styles.suggestionsHeader}>
                                            <Sparkles size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                            <span>Recommended Care Treatments</span>
                                        </div>
                                        <div className={styles.suggestionsCarousel}>
                                            {suggestedProducts.map((prod) => {
                                                const seller = vendors.find(v => v.inventory?.some((i: any) => i.plantId === prod.id));
                                                const sellerPrice = seller?.inventory?.find((i: any) => i.plantId === prod.id)?.price || prod.price || 199;
                                                return (
                                                    <div key={prod.id} className={styles.suggestionCard}>
                                                        <img src={prod.imageUrl} alt={prod.name} className={styles.suggestionImg} />
                                                        <div className={styles.suggestionInfo}>
                                                            <h4 className={styles.suggestionTitle}>{prod.name}</h4>
                                                            <p className={styles.suggestionPrice}>₹{sellerPrice}</p>
                                                            <button
                                                                onClick={() => handleAddCareToCart(prod)}
                                                                className={styles.addToCartBtn}
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(loading || isStreaming) && (
                        <div className={`${styles.message} ${styles.assistantMessage}`}>
                            <div className={styles.messageIcon}><Bot size={20} /></div>
                            <div className={styles.messageContent}>
                                {isStreaming ? (
                                    <div style={{
                                        padding: '12px',
                                        background: 'rgba(16, 185, 129, 0.05)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem',
                                        color: '#059669'
                                    }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Dr. Flora is typing...
                                    </div>
                                ) : (
                                    <div className={`${styles.messageText} ${styles.typing}`}>
                                        <span></span><span></span><span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Premium Command Prism (Input) */}
            <div className={styles.inputContainer}>
                {activeDossiers && activeDossiers.length > 0 && (
                    <div className={styles.dossierPanel}>
                        <div className={styles.dossierHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                                <ScrollText size={18} />
                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Active Botanical Dossier
                                </h3>
                            </div>
                            <button className={styles.dossierCloseBtn} onClick={() => setActiveDossiers([])} title="Clear Dossier">
                                <X size={16} />
                            </button>
                        </div>
                        <div className={styles.dossierList}>
                            {activeDossiers.map((dossier, idx) => {
                                const isToxic = dossier.toxicity && dossier.toxicity.toLowerCase().includes('toxic') && !dossier.toxicity.toLowerCase().includes('non-toxic');
                                const temp = weather?.avgTemp30Days ? parseFloat(weather.avgTemp30Days) : 22;
                                const humidity = weather?.humidity ? parseFloat(weather.humidity) : 60;
                                const et0 = (0.015 * temp + 0.15) * (1 - humidity / 100);
                                const dailyWaterLoss = et0 * (dossier.cropCoefficient || 0.5) * 100;

                                return (
                                    <div key={idx} className={styles.dossierCard}>
                                        <div className={styles.dossierCardTitle}>
                                            <Leaf size={16} style={{ color: '#10b981' }} />
                                            <span className={styles.scientificName}>{dossier.scientificName}</span>
                                            {dossier.commonName && dossier.commonName !== dossier.scientificName && (
                                                <span className={styles.commonName}>({dossier.commonName})</span>
                                            )}
                                        </div>
                                        <div className={styles.dossierBadgeGrid}>
                                            <div className={`${styles.dossierBadge} ${isToxic ? styles.badgeToxic : styles.badgeSafe}`}>
                                                {isToxic ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                                <span>{isToxic ? 'Toxic to Pets' : 'Pet Safe'}</span>
                                            </div>
                                            {dossier.npkRatio && (
                                                <div className={`${styles.dossierBadge} ${styles.badgeNpk}`}>
                                                    <Zap size={12} />
                                                    <span>NPK: {dossier.npkRatio}</span>
                                                </div>
                                            )}
                                            {dossier.soilPH && (
                                                <div className={`${styles.dossierBadge} ${styles.badgePH}`}>
                                                    <Settings size={12} />
                                                    <span>pH: {dossier.soilPH}</span>
                                                </div>
                                            )}
                                            <div className={`${styles.dossierBadge} ${styles.badgeWater}`}>
                                                <CloudSun size={12} />
                                                <span>Transpiration: {dailyWaterLoss.toFixed(1)}%/day</span>
                                            </div>
                                        </div>
                                        <div className={styles.dossierDetailText}>
                                            <strong>Care Info:</strong> {dossier.wateringInstructions || 'No custom watering instructions.'} 
                                            {dossier.lightRequirement && ` Light: ${dossier.lightRequirement}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className={styles.inputDock}>
                    <button className={styles.toolBtn} onClick={handleScanClick}>
                        <Camera size={24} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                    <button
                        className={styles.toolBtn}
                        onClick={toggleListening}
                        style={isListening ? { color: 'white', background: '#ef4444' } : {}}
                    >
                        <Mic size={24} className={isListening ? 'animate-pulse' : ''} />
                    </button>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {previewUrl && (
                            <div className={styles.previewArea}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <div className={styles.previewBadge}>
                                        <img src={previewUrl} className={styles.previewThumb} alt="Scan Preview" />
                                        <span>Bio-Analysis Ready</span>
                                        <button onClick={clearImage} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <button
                                        className={styles.expertBtn}
                                        onClick={() => handleSend("Please perform a complete diagnostic scan on this plant. Identify any signs of disease, pests, or nutrient deficiencies, and provide a treatment plan.")}
                                        style={{ padding: '6px 14px', borderRadius: '14px', fontSize: '0.8rem', width: 'auto' }}
                                        disabled={loading}
                                    >
                                        <Stethoscope size={14} style={{ color: '#ef4444' }} />
                                        <span>Diagnose Plant Disease</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        <textarea
                            className={styles.textInput}
                            placeholder="Ask Dr. Flora anything..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (isSpeaking) stopSpeaking();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!loading) handleSend();
                                }
                            }}
                            disabled={loading}
                            rows={1}
                        />
                    </div>

                    <button
                        className={styles.sendBtn}
                        onClick={() => handleSend()}
                        disabled={loading || (!input.trim() && !selectedImage)}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                    </button>
                </div>
            </div>

            {/* Styled Modal CSS for extra effects */}
            <style>{`
                .hide-on-mobile {
                    display: flex;
                }
                @media (max-width: 600px) {
                    .hide-on-mobile { display: none; }
                }
                .animate-pulse {
                    animation: pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* Neural Insights Modal */}
            {showLimitInfo && (
                <div className={styles.overlay} onClick={() => setShowLimitInfo(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                <Zap size={24} className="text-primary" fill="var(--flora-primary)" />
                                Neural Core Status
                            </h2>
                            <button className={styles.closeBtn} onClick={() => setShowLimitInfo(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalContent}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '24px', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800 }}>
                                    <span>Remaining Processing Energy</span>
                                    <span style={{ color: 'var(--flora-primary)' }}>{((neuralMeta?.current || 0) / (neuralMeta?.max || 1) * 100).toFixed(0)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${((neuralMeta?.current || 0) / (neuralMeta?.max || 1) * 100)}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #10b981, #059669)',
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div className={styles.climateBadge} style={{ justifyContent: 'flex-start', background: 'transparent' }}>
                                    <Bot size={18} /> Daily Reset at Midnight UTC
                                </div>
                                <div className={styles.climateBadge} style={{ justifyContent: 'flex-start', background: 'transparent' }}>
                                    <Leaf size={18} /> Premium users get 10x capacity
                                </div>
                            </div>

                            {!user?.isPremium && (
                                <button
                                    onClick={() => window.location.href = '/premium'}
                                    className={styles.sendBtn}
                                    style={{ width: '100%', height: '54px', marginTop: '2rem', borderRadius: '18px', gap: '10px' }}
                                >
                                    <Sparkles size={20} /> Upgrade to Infinite Neural Credits
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Growth Simulator Modal */}
            {showGrowthSim && (
                <div className={styles.overlay} onClick={() => setShowGrowthSim(false)}>
                    <div className={styles.simModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={24} className="text-primary" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Botanical Growth Simulator</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Time-lapse growth prediction & environmental simulation</p>
                                </div>
                            </div>
                            <button onClick={() => setShowGrowthSim(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.simGrid}>
                                
                                {/* Controls */}
                                <div className={styles.simControls}>
                                    <div className={styles.controlGroup}>
                                        <label className={styles.controlLabel}>Select Plant Species</label>
                                        <select 
                                            className={styles.selectInput} 
                                            value={simPlant} 
                                            onChange={e => setSimPlant(e.target.value)}
                                        >
                                            <option value="Monstera Deliciosa">Monstera Deliciosa (Split-leaf Philodendron)</option>
                                            <option value="Snake Plant">Snake Plant (Sansevieria Trifasciata)</option>
                                            <option value="Pothos">Devil's Ivy (Pothos/Epipremnum)</option>
                                            <option value="Peace Lily">Peace Lily (Spathiphyllum)</option>
                                        </select>
                                    </div>
        
                                    <div className={styles.controlGroup}>
                                        <label className={styles.controlLabel}>Growth Timeline</label>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="5" 
                                            step="1"
                                            value={
                                                simMonths === 1 ? 1 : 
                                                simMonths === 3 ? 2 : 
                                                simMonths === 6 ? 3 : 
                                                simMonths === 12 ? 4 : 5
                                            }
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                if (val === 1) setSimMonths(1);
                                                else if (val === 2) setSimMonths(3);
                                                else if (val === 3) setSimMonths(6);
                                                else if (val === 4) setSimMonths(12);
                                                else setSimMonths(24);
                                            }}
                                            className={styles.sliderInput}
                                        />
                                        <div className={styles.sliderLabel}>
                                            <span>1 Month</span>
                                            <span>3M</span>
                                            <span>6M</span>
                                            <span>1 Year</span>
                                            <span>2 Years</span>
                                        </div>
                                    </div>
        
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div className={styles.controlGroup}>
                                            <label className={styles.controlLabel}>Sunlight</label>
                                            <select 
                                                className={styles.selectInput} 
                                                value={simLight} 
                                                onChange={e => setSimLight(e.target.value)}
                                            >
                                                <option value="Low">Low Light</option>
                                                <option value="Medium">Medium Indirect</option>
                                                <option value="High">Bright Direct</option>
                                            </select>
                                        </div>
                                        <div className={styles.controlGroup}>
                                            <label className={styles.controlLabel}>Watering</label>
                                            <select 
                                                className={styles.selectInput} 
                                                value={simWater} 
                                                onChange={e => setSimWater(e.target.value)}
                                            >
                                                <option value="Low">Low (Dry)</option>
                                                <option value="Medium">Moderate</option>
                                                <option value="Frequent">Frequent (Moist)</option>
                                            </select>
                                        </div>
                                    </div>
        
                                    {/* Stats card */}
                                    <div className={styles.simStatsCard}>
                                        <div className={styles.simStatItem}>
                                            <strong>Expected Height:</strong>
                                            <span>{getGrowthDetails().height}</span>
                                        </div>
                                        <div className={styles.simStatItem}>
                                            <strong>Foliage State:</strong>
                                            <span>{getGrowthDetails().foliage}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--flora-text)', marginTop: '8px', lineHeight: '1.4' }}>
                                            <strong>Growth Tip:</strong> {getGrowthDetails().advice}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Visual render */}
                                <div className={styles.simVisual}>
                                    {simImageUrl ? (
                                        <img 
                                            src={simImageUrl} 
                                            alt="Growth Simulation" 
                                            className={styles.simImage}
                                            style={{ opacity: simImageLoading ? 0.3 : 1 }}
                                        />
                                    ) : (
                                        <div style={{ color: 'var(--flora-text-muted)', fontSize: '0.9rem' }}>Preparing simulation...</div>
                                    )}
                                    {simImageLoading && (
                                        <div style={{ position: 'absolute', display: 'flex', color: 'var(--flora-primary)', animation: 'spin 1s linear infinite' }}>
                                            <Loader2 size={36} />
                                        </div>
                                    )}
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
