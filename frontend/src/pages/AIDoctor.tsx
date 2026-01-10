import { useState, useRef, useEffect, useCallback, lazy } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download, Calendar, Camera, Mic, Volume2, VolumeX, Zap, Loader2, Settings, X, Stethoscope, CloudSun, ScrollText, CheckCircle2, AlertCircle } from 'lucide-react';
import { chatWithDrFlora, API_URL } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './AIDoctor.module.css';
import remarkGfm from 'remark-gfm';
import { mlCache } from '../utils/mlCache';
import { Helmet } from 'react-helmet-async';

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
        stopSpeaking(); // Stop speaking when sending a message
        const textToSend = typeof contentOverride === 'string' ? contentOverride : input;

        if (!textToSend.trim() && !selectedImage) return;

        const messageContent = textToSend || "What plant is this?"; // Default question if only image
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

        // Proactive Guard: Check if user is trying an expensive operation (Image/Analysis) while limited
        if (base64Image && isAnalysisLimited) {
            toast.error("🎨 Neural analysis limit reached! Switching to text-only mode.", { icon: '📊' });
            // Remove image but keep text
            base64Image = null;
            userMessage.image = undefined;
            userMessage.content = textToSend || "Please help me with this plant (limit reached, sending text only)";
        }

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);


        clearImage();

        try {
            // 🤖 ML CACHE CHECK - Try to find similar past response
            // Only check cache for text-only queries (not images)
            if (!base64Image) {
                const cachedResponse = mlCache.findSimilar(messageContent);

                if (cachedResponse) {
                    // Cache hit! Reuse past response
                    console.log('[ML Cache] ✅ Cache HIT - Reusing response');

                    const cachedMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: cachedResponse.response + '\n\n_💡 Instant response from learned knowledge_',
                        timestamp: new Date()
                    };

                    setMessages(prev => [...prev, cachedMessage]);
                    setLoading(false);

                    toast.success('⚡ Instant response (saved API call!)', {
                        duration: 2000,
                        icon: '🧠'
                    });

                    return; // Skip API call entirely!
                }

                console.log('[ML Cache] ❌ Cache MISS - Calling API');
            }

            // Include the new user message in the API call
            // We ensure that if there's an image, it's sent along with the history
            const conversationHistory = [...messages, userMessage].map(m => ({
                role: m.role,
                content: m.content,
                // VISION CONTINUITY: Pass the image back in history so the AI remembers it
                image: m.image
            }));

            const response = await chatWithDrFlora(
                conversationHistory,
                {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    city: weather?.city,
                    weather: weather
                },
                base64Image, // Current turn image
                persona
            );

            console.log('[AI Doctor] Raw API Response:', response); // Debugging

            // --- Update Neural Energy Levels ---
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
                // Context-aware Fallbacks
                if (response.refusal) {
                    aiText = `I cannot answer that: ${response.refusal}`;
                } else if (base64Image) {
                    aiText = "I apologize, but I couldn't process this photo. **Please give a proper image to analyze** (ensure the plant is well-lit and clearly visible).";
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
                images: response.choices?.[0]?.message?.images, // CAPTURE BOTH FLUX & SDXL
                timestamp: new Date()
            };

            // Enhanced debug logging for image generation
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
                // Refresh medical records if a new diagnosis was made
                setTimeout(fetchMedicalRecords, 3000);
            }

            // 🤖 ML CACHE STORAGE - Save response for future reuse
            // Only cache text-only responses (not image-based)
            const isErrorMessage = aiText.includes("trouble connecting to my knowledge base") ||
                aiText.includes("AI Service Unavailable");

            if (!base64Image && aiText && messageContent && !isErrorMessage) {
                mlCache.add(messageContent, aiText);
                console.log('[ML Cache] 💾 Response cached for future use');
            }

        } catch (error: any) {
            console.error('[AI Doctor] Error:', error);

            // AUTO-RECOVERY: If it failed with an image, try one last time WITHOUT image (TEXT-ONLY)
            if (base64Image && !isAnalysisLimited) {
                console.log('[AI Doctor] Image analysis failed, attempting Text-Only fallback...');
                setIsAnalysisLimited(true); // Don't try again this session
                setLoading(true);
                try {
                    const fallbackResponse = await chatWithDrFlora(
                        messages.map(m => ({ role: m.role, content: m.content })),
                        { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                        null // No image
                    );

                    const fallbackAssistantMessage: Message = {
                        id: (Date.now() + 2).toString(),
                        role: 'assistant',
                        content: `⚠️ **I had trouble with that photo.** Please **give a proper image to analyze** for a better diagnosis. In the meantime, I've used my text-only knowledge to help you:\n\n${fallbackResponse.choices?.[0]?.message?.content}`,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, fallbackAssistantMessage]);
                    setLoading(false);
                    return;
                    // Don't add text, just store image
                } catch {
                    console.error("Text fallback failed");
                }

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "⚠️ **Dr. Flora is momentarily offline.** I'm undergoing a neural recalibration. Please try again with simple text or check back in a few minutes.",
                    timestamp: new Date()
                }]);
            }
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

        // 1. Remove Markdown headers, bold, italics
        clean = clean.replace(/#{1,6}\s?/g, '') // Remove headlines
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italics
            .replace(/\[.*?\]/g, '') // Remove links/tags [text]
            .replace(/\(.*?\)/g, '') // Remove link URLs (url) if inside [] but regex above covers strict MD links usually. Let's be careful not to remove (tips).
            .replace(/!\[.*?\]/g, ''); // Remove images

        // 2. Remove URLs
        clean = clean.replace(/https?:\/\/\S+/g, 'link');

        // 3. Remove Emojis (Ranges for many common emoji sets)
        // clean = clean.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, ''); 
        // More robust standard emoji regex or just general symbol cleanup if prefered.
        clean = clean.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');

        // 4. Remove Specific System Phrases
        const systemPhrases = [
            "Response from learned knowledge",
            "Expert 1:", "Expert 2:", "Expert 3:",
            "DeepSeek says:",
            "Response from memory",
            "Here is the generated image:",
            "GENERATE:",
            "Image description:"
        ];
        systemPhrases.forEach(phrase => {
            const re = new RegExp(phrase, "gi");
            clean = clean.replace(re, "");
        });

        // 5. Cleanup whitespace
        clean = clean.replace(/\s+/g, ' ').trim();

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
            console.error("Voice Error:", error);
            setIsSpeaking(false);
            const utterance = new SpeechSynthesisUtterance(text);
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

        // Ensure we only speak if:
        // 1. Voice is enabled
        // 2. It's an assistant message
        // 3. It's NOT the initial welcome message (id '1')
        // 4. We haven't spoken it yet
        if (voiceEnabled && lastMsg.role === 'assistant' && lastMsg.id !== '1') {
            if (lastSpokenMessageIdRef.current !== lastMsg.id) {
                lastSpokenMessageIdRef.current = lastMsg.id;
                lastSpokenMessageIdRef.current = lastMsg.id;
                // Use the robust cleaner
                const cleanText = cleanTextForSpeech(lastMsg.content);
                if (cleanText.trim()) {
                    speak(lastMsg.content); // speak function now cleans it internally!, but wait, passing raw content to speak allows speak() to clean it. 
                    // Actually, if I clean it here, speak() cleans it again. Efficient?
                    // Let's pass the raw content and let speak() handle it to avoid duplication or pass cleaned.
                    // speak() calls cleanTextForSpeech. So passing raw is fine.
                    // BUT: The original logic passed 'cleanText' to speak.
                    // My replacement for speak() adds cleaning. 
                    // To be safe, let's just pass raw content to speak() and let IT do the work.
                    speak(lastMsg.content);
                }
            }
        }
    }, [messages, voiceEnabled, speak]);


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
                    <div className={styles.logoIcon}>
                        <Bot size={20} />
                    </div>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>Dr. Flora</h1>
                        <span className={styles.subtitle}>{persona === 'flora' ? 'Botanical Soul' : persona === 'geneticist' ? 'Molecular Specialist' : 'Herbal Wisdom'} • VanaMap</span>
                    </div>

                    {/* Climate Awareness Badge */}
                    {weather && (
                        <div className={styles.climateBadge}>
                            <CloudSun size={14} />
                            <span>{weather.city}: {weather.avgTemp30Days}°C</span>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {/* Neural Energy Display */}
                        {neuralMeta && (
                            <div
                                onClick={() => setShowLimitInfo(true)}
                                style={{
                                    fontSize: 'clamp(10px, 2vw, 12px)',
                                    padding: '4px 10px',
                                    background: (neuralMeta.current < 20000 || isAnalysisLimited) ? '#fef2f2' : 'rgba(255,255,255,0.6)',
                                    color: (neuralMeta.current < 20000 || isAnalysisLimited) ? '#ef4444' : '#10b981',
                                    borderRadius: '99px',
                                    border: `1px solid ${(neuralMeta.current < 20000 || isAnalysisLimited) ? '#fecaca' : '#bbf7d0'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600,
                                    marginRight: '8px',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }} title={`Click to see how to increase limits`}>
                                <Zap size={14} fill={(neuralMeta.current < 20000 || isAnalysisLimited) ? "#ef4444" : "#10b981"} />
                                <span>{isAnalysisLimited ? "LIMIT REACHED" : `${(neuralMeta.current / 1000).toFixed(1)}k Ops`}</span>
                            </div>
                        )}
                        {/* Garden Clinic Button */}
                        <button
                            className={`${styles.actionBtn} ${showClinic ? styles.active : ''}`}
                            onClick={() => setShowClinic(!showClinic)}
                            title="Garden Clinic (Medical Records)"
                        >
                            <Stethoscope size={18} />
                            {medicalRecords.length > 0 && <span className={styles.recordBadge}>{medicalRecords.length}</span>}
                        </button>

                        <button
                            className={styles.actionBtn}
                            onClick={toggleVoice}
                            style={voiceEnabled ? { color: '#10b981', borderColor: '#bbf7d0', background: '#f0fdf4', boxShadow: isSpeaking ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none' } : {}}
                            title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
                        >
                            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>

                        {/* Voice Settings Button */}
                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsVoiceSelectorOpen(true)}
                            title="Change Voice Pack"
                        >
                            <Settings size={18} />
                        </button>

                        <button className={styles.actionBtn} onClick={handleCareCalendar} title="Care Calendar">
                            <Calendar size={18} />
                        </button>

                        <button className={styles.actionBtn} onClick={handleExport} title="Export Chat">
                            <Download size={18} />
                        </button>

                        {/* Stop Speaking Button (only shows when AI is speaking) */}
                        {isSpeaking && (
                            <button
                                className={styles.actionBtn}
                                onClick={stopSpeaking}
                                style={{
                                    color: '#ef4444',
                                    borderColor: '#fecaca',
                                    background: '#fef2f2',
                                    animation: 'pulse 2s infinite'
                                }}
                                title="Stop Speaking"
                            >
                                <VolumeX size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Council of Experts Selector (Personas) */}
            <div className={styles.councilBar}>
                <button
                    className={`${styles.expertBtn} ${persona === 'flora' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('flora')}
                >
                    <Bot size={16} />
                    <span>Flora</span>
                </button>
                <button
                    className={`${styles.expertBtn} ${persona === 'geneticist' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('geneticist')}
                >
                    <Zap size={16} />
                    <span>Geneticist</span>
                </button>
                <button
                    className={`${styles.expertBtn} ${persona === 'ayurvedic' ? styles.expertActive : ''}`}
                    onClick={() => handlePersonaChange('ayurvedic')}
                >
                    <Leaf size={16} />
                    <span>Ayurvedic</span>
                </button>
            </div>

            {/* Garden Clinic Side Panel (Medical Records) */}
            {showClinic && (
                <div className={styles.clinicOverlay} onClick={() => setShowClinic(false)}>
                    <div className={styles.clinicPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.clinicHeader}>
                            <h3 className={styles.clinicTitle}>
                                <Stethoscope size={20} />
                                Garden Clinic
                            </h3>
                            <button onClick={() => setShowClinic(false)} className={styles.closeClinic}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.clinicContent}>
                            {clinicLoading ? (
                                <div className={styles.clinicLoading}>
                                    <Loader2 className="animate-spin" />
                                    <span>Reviewing plant health records...</span>
                                </div>
                            ) : medicalRecords.length === 0 ? (
                                <div className={styles.emptyClinic}>
                                    <ScrollText size={48} />
                                    <p>No medical records yet. Ask for a diagnosis!</p>
                                </div>
                            ) : (
                                <div className={styles.recordsList}>
                                    {medicalRecords.map((record) => (
                                        <div key={record._id} className={styles.recordItem}>
                                            <div className={styles.recordMain}>
                                                <div className={styles.recordInfo}>
                                                    <h4 className={styles.recordPlantName}>{record.plantName}</h4>
                                                    <p className={styles.recordScientific}>{record.scientificName}</p>
                                                </div>
                                                <div className={`${styles.recordSeverity} ${styles[record.severity]}`}>
                                                    {record.severity.toUpperCase()}
                                                </div>
                                            </div>
                                            <div className={styles.recordDiagnosInfo}>
                                                <strong>Diagnosis:</strong> {record.diagnosis}
                                            </div>
                                            <div className={styles.recordTreatment}>
                                                <strong>Dr. Flora's Treatment:</strong> {record.treatment}
                                            </div>
                                            <div className={styles.recordMeta}>
                                                <Calendar size={12} />
                                                <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                                                <div className={`${styles.statusBadge} ${styles[record.status]}`}
                                                    style={{ cursor: record.status === 'active' ? 'pointer' : 'default' }}
                                                    onClick={() => record.status === 'active' && handleUpdateRecordStatus(record._id, 'resolved')}>
                                                    {record.status === 'active' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                                    {record.status.toUpperCase()}
                                                    {record.status === 'active' && <span style={{ fontSize: '0.6rem', marginLeft: '4px', opacity: 0.7 }}>(Click to Resolve)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Voice Selector Modal */}
            {isVoiceSelectorOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#ffffff',
                        padding: '24px',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '420px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '4px solid #dcfce7'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#064e3b', fontSize: '1.4rem', fontWeight: 800 }}>Voice of Nature</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Choose Dr. Flora's personality</p>
                            </div>
                            <button onClick={() => setIsVoiceSelectorOpen(false)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                            {availableVoices.map((voice) => (
                                <button
                                    key={voice.id}
                                    onClick={() => handleVoiceSelect(voice.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        background: selectedVoiceId === voice.id ? '#ecfdf5' : '#ffffff',
                                        border: selectedVoiceId === voice.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        width: '100%',
                                        textAlign: 'left',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: selectedVoiceId === voice.id ? '#10b981' : '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {selectedVoiceId === voice.id ? <Sparkles size={20} color="white" /> : <Mic size={20} color="#94a3b8" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>{voice.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>{voice.style}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>{voice.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* Chat Area */}
            <div className={styles.chatContainer}>
                <div className={styles.messagesWrapper}>
                    {messages.map((message) => (
                        <div key={message.id} className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                            <div className={styles.messageIcon}>
                                {message.role === 'user' ? <User size={16} /> : <Leaf size={16} />}
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageSender}>
                                    {message.role === 'user' ? 'You' : 'Dr. Flora'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {/* Display uploaded image if present */}
                                {((message.images && message.images.length > 0) || message.image) && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: (message.images && message.images.length > 1) ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
                                        gap: '12px',
                                        marginBottom: '0.75rem',
                                        width: '100%'
                                    }}>
                                        {(message.images && message.images.length > 0 ? message.images : (message.image ? [message.image] : [])).map((imgUrl, idx) => {
                                            const imageKey = `${message.id}-${idx}`;
                                            return (
                                                <div key={imageKey} style={{
                                                    position: 'relative',
                                                    background: message.role === 'assistant' ? '#f8fafc' : 'rgba(0,0,0,0.1)',
                                                    borderRadius: '16px',
                                                    padding: '4px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    overflow: 'hidden',
                                                    minHeight: '200px'
                                                }}>
                                                    <img
                                                        src={(() => {
                                                            if (!imgUrl) return '';
                                                            if (imgUrl.startsWith('data:')) return imgUrl; // Handle Base64 User Uploads
                                                            if (imgUrl.startsWith('http')) return imgUrl;
                                                            // Robust URL cleaning
                                                            const cleanBase = API_URL.replace(/\/+$/, '').replace(/\/api$/, '');
                                                            const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
                                                            return `${cleanBase}${cleanPath}`;
                                                        })()}
                                                        alt={`Plant view ${idx + 1}`}
                                                        onLoad={() => setLoadedImageIds(prev => new Set(prev).add(imageKey))}
                                                        onError={(e) => {
                                                            console.warn("Primary image load failed. Attempting fallback...");
                                                            setLoadedImageIds(prev => new Set(prev).add(imageKey));
                                                            e.currentTarget.style.opacity = '1';

                                                            // Auto-fallback to direct Pollinations URL if backend proxy fails
                                                            const src = e.currentTarget.src;
                                                            if (src.includes('/api/generate-image')) {
                                                                try {
                                                                    const url = new URL(src);
                                                                    const params = new URLSearchParams(url.search);
                                                                    const prompt = params.get('prompt');
                                                                    const model = params.get('model') || 'flux';
                                                                    const seed = params.get('seed') || '42';

                                                                    if (prompt) {
                                                                        const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&width=896&height=896&nologo=true`;
                                                                        e.currentTarget.src = directUrl;
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Fallback failed", err);
                                                                }
                                                            }
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '400px',
                                                            borderRadius: '12px',
                                                            objectFit: 'contain',
                                                            display: 'block',
                                                            opacity: 1,
                                                            transition: 'none',
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                                        }}
                                                    />

                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        background: 'rgba(5, 150, 105, 0.9)',
                                                        color: 'white',
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                        backdropFilter: 'blur(8px)',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                                        zIndex: 8,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {idx === 0 ? '🎨 Botanical Art (Flux)' : '📸 Ultra-Realism (Pro)'}
                                                    </div>

                                                    <button
                                                        onClick={() => downloadImage(imgUrl!, imageKey)}
                                                        disabled={downloadingIds.has(imageKey)}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '12px',
                                                            right: '12px',
                                                            background: '#059669',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '30px',
                                                            padding: '8px 14px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: downloadingIds.has(imageKey) ? 'wait' : 'pointer',
                                                            boxShadow: '0 6px 15px rgba(5, 150, 105, 0.4)',
                                                            zIndex: 10,
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {downloadingIds.has(imageKey) ? (
                                                            <div style={{ animation: 'spin 1s linear infinite', display: 'flex' }}>
                                                                <Loader2 size={16} />
                                                            </div>
                                                        ) : (
                                                            <Download size={16} />
                                                        )}
                                                        <span>Save PNG</span>
                                                    </button>

                                                    {(!loadedImageIds.has(imageKey)) && (
                                                        <ImageLoader idx={idx} />
                                                    )}
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
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className={`${styles.message} ${styles.assistantMessage}`}>
                            <div className={styles.messageIcon}><Leaf size={16} /></div>
                            <div className={styles.messageContent}>
                                <div className={`${styles.messageText} ${styles.typing}`}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Dock */}
            <div className={styles.inputContainer}>
                <div className={styles.inputDock}>
                    <button
                        className={styles.toolBtn}
                        onClick={handleScanClick}
                        title="Identify Plant (Scan)"
                    >
                        <Camera size={20} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    <button
                        className={styles.toolBtn}
                        onClick={toggleListening}
                        style={isListening ? { color: '#ef4444', background: '#fef2f2' } : {}}
                        title="Voice Input"
                    >
                        <Mic size={20} />
                    </button>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {previewUrl && (
                            <div className={styles.previewArea}>
                                <div className={styles.previewBadge}>
                                    <img src={previewUrl} className={styles.previewThumb} alt="Scan" />
                                    <span>Image attached</span>
                                    <button onClick={clearImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0284c7', marginLeft: 'auto' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                        <textarea
                            className={styles.textInput}
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (isSpeaking) stopSpeaking(); // Stop speaking when user types
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!loading) handleSend();
                                }
                            }}
                            disabled={loading}
                            rows={1}
                            style={{ height: 'auto', minHeight: '44px' }}
                        />
                    </div>

                    <button
                        className={styles.sendBtn}
                        onClick={() => handleSend()}
                        disabled={loading || (!input.trim() && !selectedImage)}
                    >
                        {loading ? <Sparkles size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </div>

            {/* Neural Energy & Settings Overlay (Tooltip/Modal) */}
            {
                showLimitInfo && (
                    <div className={styles.overlay} onClick={() => setShowLimitInfo(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.15rem' }}>
                                    <Zap size={20} color="#10b981" fill="#10b981" />
                                    Neural Energy Insights
                                </h2>
                                <button className={styles.closeBtn} onClick={() => setShowLimitInfo(false)}>&times;</button>
                            </div>
                            <div className={styles.modalContent}>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    Dr. Flora's advanced botanical reasoning and image analysis require significant "Neural Energy". Daily limits help us maintain service for all gardeners.
                                </p>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    border: '1px solid #e2e8f0',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 700 }}>Daily Capacity:</span>
                                        <span style={{ color: isAnalysisLimited ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                                            {isAnalysisLimited ? "Neural Exhausted" : `${((neuralMeta?.current || 0) / (neuralMeta?.max || 1) * 100).toFixed(1)}%`}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${((neuralMeta?.current || 0) / (neuralMeta?.max || 1) * 100)}%`,
                                            height: '100%',
                                            background: isAnalysisLimited ? '#ef4444' : '#10b981',
                                            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }} />
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Sparkles size={12} />
                                        Resets every 24 hours at midnight UTC.
                                    </p>
                                </div>

                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem' }}>How to increase your limit?</h3>
                                <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.825rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    <li><strong>✨ Upgrade to Premium</strong>: Instant 10x capacity boost and priority analysis.</li>
                                    <li><strong>🛍️ Shopping Activity</strong>: Active buyers earn "Energy Credits" over time.</li>
                                    <li><strong>🌿 Patience</strong>: Limits reset daily. Small gardens grow best with time!</li>
                                </ul>

                                {!user?.isPremium && (
                                    <button
                                        className={styles.premiumBtn}
                                        onClick={() => {
                                            window.location.href = '/premium';
                                        }}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <Sparkles size={18} />
                                        Experience Infinite Wisdom
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
