import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download, Calendar, Globe, Camera, Mic, Volume2, VolumeX, Zap } from 'lucide-react';
import { chatWithDrFlora } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './AIDoctor.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

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
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastSpokenMessageIdRef = useRef<string | null>(null);

    const [neuralMeta, setNeuralMeta] = useState<{ current: number; max: number } | null>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Web Search for Scientific Plant Data

    const handleSend = async (contentOverride?: string | any) => {
        const textToSend = typeof contentOverride === 'string' ? contentOverride : input;

        if (!textToSend.trim() && !selectedImage) return;

        let messageContent = textToSend;
        let base64Image: string | null = null;

        if (selectedImage) {
            try {
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedImage);
                });
                messageContent += `\n\n[Attached Image]`;
            } catch (e) {
                toast.error("Failed to process image");
                return;
            }
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);


        clearImage();

        try {
            // Include the new user message in the API call
            const conversationHistory = [...messages, userMessage].map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await chatWithDrFlora(
                conversationHistory,
                { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                base64Image
            );

            console.log('[AI Doctor] Raw API Response:', response); // Debugging

            // --- Update Neural Energy Levels ---
            if (response.usageMeta) {
                const remaining = parseInt(response.usageMeta.remaining || '0') || 0;
                const limit = parseInt(response.usageMeta.limit || '100000') || 100000;
                setNeuralMeta({ current: remaining, max: limit });

                if (remaining > 0 && remaining < 20000) {
                    toast("⚠️ Neural Energy Low!", { icon: '⚡' });
                }
            }

            let aiText = response.choices?.[0]?.message?.content;

            if (!aiText) {
                // Context-aware Fallbacks
                if (response.refusal) {
                    aiText = `I cannot answer that: ${response.refusal}`;
                } else if (base64Image) {
                    aiText = "I couldn't analyze the image. Please ensure it's clear and contains a plant.";
                } else {
                    aiText = "I apologize, I'm having trouble connecting right now. Please try asking again.";
                }
                console.warn('[AI Doctor] Empty content received', response);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
            if (voiceEnabled) speak(aiText);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "⚠️ **Dr. Flora is offline.** Please check your connection or try again later.",
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

        if (voiceEnabled) {
            speak("I'd love to help! I'm analyzing your plants to create a personalized weekly care schedule for you.");
        }

        handleSend(prompt);
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

    // --- VOICE ASSISTANT (Dr. Flora's Voice) ---
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synth = window.speechSynthesis;

    // --- LANGUAGE SELECTION ---
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const languages = [
        'English', 'हिंदी (Hindi)', 'മലയാളം (Malayalam)', 'தமிழ் (Tamil)',
        'తెలుగు (Telugu)', 'ಕನ್ನಡ (Kannada)', 'বাংলা (Bengali)', 'মराठी (Marathi)',
        'ગુજરાતી (Gujarati)', 'ਪੰਜਾਬੀ (Punjabi)', 'Español', 'Français', 'Deutsch',
        '中文', '日本語', 'العربية'
    ];

    useEffect(() => {
        // Preload voices
        const loadVoices = () => {
            const voices = synth.getVoices();
            console.log("Available voices:", voices.map(v => v.name));
        };
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        return () => {
            synth.cancel(); // Stop speaking on unmount
        }
    }, []);

    const speak = (text: string) => {
        if (!voiceEnabled) return;

        // Cancel any current speech
        synth.cancel();

        // 1. Advanced Text Cleanup & Convert Emotions to Speakable Sounds
        let cleanText = text
            .replace(/\*/g, '') // Remove bold/italic markers
            .replace(/[#\-]/g, '') // Remove headers/lists
            .replace(/\[.*?\]/g, '') // Remove [Citation] or [Image] tags
            // Convert emotional expressions to speakable sounds
            .replace(/\*giggles\*/gi, 'hehe') // *giggles* → "hehe"
            .replace(/\*laughs\*/gi, 'haha') // *laughs* → "haha"
            .replace(/\*happy dance\*/gi, 'yay!') // *happy dance* → "yay!"
            .replace(/\*sighs\*/gi, 'hmm') // *sighs* → "hmm"
            .replace(/\*gasps\*/gi, 'oh!') // *gasps* → "oh!"
            .replace(/\*chuckles\*/gi, 'hehe') // *chuckles* → "hehe"
            // Keep natural interjections
            .replace(/haha+/gi, (match) => match.toLowerCase()) // Normalize "haha"
            .replace(/hehe+/gi, (match) => match.toLowerCase()) // Normalize "hehe"
            .replace(/aww+/gi, (match) => match.toLowerCase()) // Normalize "aww"
            .replace(/omg/gi, 'oh my gosh') // OMG → speakable
            .replace(/lol/gi, 'haha') // LOL → "haha"
            // Remove remaining emojis AFTER converting text emotions
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            // Fix common pronunciation issues
            .replace(/\bDr\.\s*/gi, 'Doctor ') // "Dr." → "Doctor"
            .replace(/\bMr\.\s*/gi, 'Mister ')
            .replace(/\bMs\.\s*/gi, 'Miss ')
            .replace(/\bMrs\.\s*/gi, 'Missus ')
            .replace(/\bSt\.\s*/gi, 'Saint ')
            .replace(/\bAve\.\s*/gi, 'Avenue ')
            .replace(/\betc\.\s*/gi, 'et cetera ')
            .replace(/\be\.g\.\s*/gi, 'for example ')
            .replace(/\bi\.e\.\s*/gi, 'that is ')
            // Add natural pauses and breathing patterns for human-like speech
            .replace(/([.!?])\s+/g, '$1 ')
            .replace(/,\s+/g, ', ')
            .replace(/:\s+/g, ': ')
            .replace(/;\s+/g, '; ')
            .replace(/\b(and|but|so|because|however|therefore)\b/gi, ' $1 ')
            .replace(/\b(well|um|uh|like|you know)\b/gi, '$1, ')
            .trim();

        // Split into SMALLER chunks (phrases) for natural breathing
        const phrases = cleanText.split(/([,.!?;:])/g);
        const speechUnits: string[] = [];

        for (let i = 0; i < phrases.length; i++) {
            let chunk = phrases[i]?.trim();
            if (!chunk) continue;

            // If the chunk is JUST punctuation, glue it to the PREVIOUS word chunk
            // This prevents the AI from reading symbols as words
            if (/^[,.!?;:]+$/.test(chunk)) {
                if (speechUnits.length > 0) {
                    speechUnits[speechUnits.length - 1] += chunk;
                }
                continue; // Skip pushing punctuation-only chunks
            }

            speechUnits.push(chunk);
        }

        // 2. Multi-Language Accent & Voice Selection
        const voices = synth.getVoices();

        // Detect language of the text
        const detectLanguage = (text: string) => {
            if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Hindi
            if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN'; // Chinese
            if (/[\u3040-\u30FF]/.test(text)) return 'ja-JP'; // Japanese
            if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA'; // Arabic
            if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU'; // Russian
            // Fallback to browser language if Latin-based, or default English
            return navigator.language || 'en-US';
        };

        const targetLang = detectLanguage(cleanText);
        const langCode = targetLang.split('-')[0];

        // Find the absolute best voice for this specific language/accent
        const preferredVoice =
            // 1. Natural/Neural for the specific language
            voices.find(v => v.lang.startsWith(langCode) && (v.name.includes("Natural") || v.name.includes("Neural")) && v.name.includes("Female")) ||
            voices.find(v => v.lang.startsWith(langCode) && (v.name.includes("Natural") || v.name.includes("Neural"))) ||
            // 2. High-quality platform specific triggers
            voices.find(v => v.lang.startsWith(langCode) && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
            // 3. Generic language match
            voices.find(v => v.lang.startsWith(langCode) && v.name.toLowerCase().includes("female")) ||
            voices.find(v => v.lang.startsWith(langCode)) ||
            // 4. Ultimate English fallback (if target lang not found)
            voices.find(v => v.name.includes("Natural") && v.name.includes("Female") && v.lang.startsWith("en")) ||
            voices.find(v => v.lang.startsWith("en-US")) ||
            voices.find(v => v.lang.startsWith("en"));

        if (preferredVoice) console.log(`[Voice System] Speaking in ${targetLang} accent using: ${preferredVoice.name}`);

        // 3. Detect Global Emotional Mood from the last user message
        const userMessages = messages.filter(m => m.role === 'user');
        const lastUserMsg = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

        let globalMood = 'natural';
        if (lastUserMsg.includes('sad') || lastUserMsg.includes('died') || lastUserMsg.includes('poor') || lastUserMsg.includes('help')) globalMood = 'concerned';
        if (lastUserMsg.includes('happy') || lastUserMsg.includes('yay') || lastUserMsg.includes('great')) globalMood = 'joyful';

        // 4. Speak Phrase-by-Phrase with EXTREME Expression
        speechUnits.forEach((unit: string, index: number) => {
            if (!unit.trim()) return;

            const utterance = new SpeechSynthesisUtterance(unit.trim());
            utterance.lang = targetLang; // Match browser engine to text language
            if (preferredVoice) utterance.voice = preferredVoice;

            // --- Human Imperfection & Texture Modulation ---
            const microPitch = (Math.random() - 0.5) * 0.12;
            const microRate = (Math.random() - 0.5) * 0.1;

            let basePitch = 1.2;
            let baseRate = 1.0;
            let baseVolume = 1.0;

            if (globalMood === 'joyful') {
                basePitch = 1.4; // Happier base
                baseRate = 1.1;
            } else if (globalMood === 'concerned') {
                basePitch = 1.0; // Sober base
                baseRate = 0.9;
            }

            const lowerUnit = unit.toLowerCase();

            // 💭 THINKING FILLER MODULATION
            if (lowerUnit.match(/\b(um|uh|well|hmm)\b/)) {
                basePitch *= 0.85; baseRate *= 0.8; baseVolume *= 0.8;
            }

            // 🤫 WHISPER / SOFT MODE
            if (lowerUnit.includes('(softly)') || lowerUnit.includes('shh')) {
                basePitch *= 0.82; baseRate *= 0.88; baseVolume *= 0.55;
            }

            // EXTREME EMOTIONAL TRIGGERS
            if (lowerUnit.includes('haha') || lowerUnit.includes('hehe') || lowerUnit.includes('lol')) {
                basePitch = 1.6; baseRate = 1.35; baseVolume = 1.15;
            }
            else if (lowerUnit.includes('wow') || lowerUnit.includes('yay') || lowerUnit.includes('!') || lowerUnit.includes('amazing')) {
                basePitch = 1.5; baseRate = 1.25; baseVolume = 1.2;
            }
            else if (lowerUnit.includes('sad') || lowerUnit.includes('died') || lowerUnit.includes('sorry') || lowerUnit.includes('poor')) {
                basePitch = 0.65; baseRate = 0.75; baseVolume = 0.85;
            }
            else if (lowerUnit.includes('worry') || lowerUnit.includes('fix') || lowerUnit.includes('together') || lowerUnit.includes('okay')) {
                basePitch = 1.1; baseRate = 0.85; baseVolume = 0.95;
            }

            // Questions - Rising excitement/curiosity
            if (unit.includes('?')) {
                basePitch += 0.25; baseRate -= 0.05;
            }

            utterance.pitch = basePitch + microPitch;
            utterance.rate = baseRate + microRate;
            utterance.volume = baseVolume;

            // Tracking speaking state
            if (index === 0) utterance.onstart = () => setIsSpeaking(true);
            if (index === speechUnits.length - 1) {
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
            }

            // Breath/Thought Pacing
            if (unit.length > 50 || unit.includes('.') || unit.includes('!')) {
                setTimeout(() => synth.speak(utterance), 20);
            } else {
                synth.speak(utterance);
            }
        });
    };

    const toggleVoice = () => {
        if (voiceEnabled) {
            synth.cancel();
            setVoiceEnabled(false);
            setIsSpeaking(false);
            toast("Voice Assistant Disabled", { icon: '🔇' });
        } else {
            setVoiceEnabled(true);
            toast("Dr. Flora's Voice Enabled! 🎧", { icon: '🗣️' });
            speak("Hi there! I'm listening."); // Test phrase
        }
    };

    // Auto-speak new AI messages
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (voiceEnabled && lastMsg.role === 'assistant' && lastMsg.id !== '1') {
            // Prevent repeating the same message ID
            if (lastSpokenMessageIdRef.current !== lastMsg.id) {
                lastSpokenMessageIdRef.current = lastMsg.id;
                speak(lastMsg.content);
            }
        }
    }, [messages, voiceEnabled]);


    // --- SPEECH RECOGNITION (Microphone Input) ---
    const [isListening, setIsListening] = useState(false);
    // Use a ref to keep track of the recognition instance
    const recognitionRef = useRef<any>(null);

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
            // Stop AI from speaking when user starts talking
            if (synth.speaking) {
                synth.cancel();
                setIsSpeaking(false);
            }
            toast(`🎤 Listening in ${userLang}...`, {
                icon: '👂',
                duration: 3000,
                style: {
                    background: '#10b981',
                    color: 'white'
                }
            });
        };

        recognition.onresult = (event: any) => {
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

        recognition.onerror = (event: any) => {
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

    // --- IMAGE UPLOAD (Plant Diagnosis) ---
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleScanClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file.");
                return;
            }

            // Validate file size (max 5MB)
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

    const clearImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logoIcon}>
                        <Bot size={20} />
                    </div>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>Dr. Flora</h1>
                        <span className={styles.subtitle}>AI Plant Specialist • VanaMap</span>
                    </div>

                    <div className={styles.actions}>
                        {/* Neural Energy Display */}
                        {neuralMeta && (
                            <div style={{
                                fontSize: 'clamp(10px, 2vw, 12px)',
                                padding: '4px 10px',
                                background: neuralMeta.current < 20000 ? '#fef2f2' : 'rgba(255,255,255,0.6)',
                                color: neuralMeta.current < 20000 ? '#ef4444' : '#10b981',
                                borderRadius: '99px',
                                border: `1px solid ${neuralMeta.current < 20000 ? '#fecaca' : '#bbf7d0'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 600,
                                marginRight: '8px',
                                backdropFilter: 'blur(4px)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }} title={`Daily Neural Operations Remaining: ${neuralMeta.current.toLocaleString()}`}>
                                <Zap size={14} fill={neuralMeta.current < 20000 ? "#ef4444" : "#10b981"} />
                                <span>{(neuralMeta.current / 1000).toFixed(1)}k Ops</span>
                            </div>
                        )}
                        <button
                            className={styles.actionBtn}
                            onClick={toggleVoice}
                            style={voiceEnabled ? { color: '#10b981', borderColor: '#bbf7d0', background: '#f0fdf4', boxShadow: isSpeaking ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none' } : {}}
                            title="Voice Output"
                        >
                            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>

                        {/* Stop Speaking Button (only shows when AI is speaking) */}
                        {isSpeaking && (
                            <button
                                className={styles.actionBtn}
                                onClick={() => {
                                    synth.cancel();
                                    setIsSpeaking(false);
                                    toast.success("Stopped speaking");
                                }}
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

                        {/* Language Toggle */}
                        <div style={{ position: 'relative' }}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                title={`Language: ${selectedLanguage}`}
                            >
                                <Globe size={18} />
                            </button>
                            {showLanguageMenu && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                                    padding: '4px', display: 'flex', flexDirection: 'column', gap: '2px',
                                    width: '160px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100
                                }}>
                                    {languages.map(lang => (
                                        <button key={lang} onClick={() => { setSelectedLanguage(lang); setShowLanguageMenu(false); }}
                                            style={{ textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '8px', color: '#334155' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className={styles.actionBtn} onClick={handleCareCalendar} title="Care Calendar">
                            <Calendar size={18} />
                        </button>

                        <button className={styles.actionBtn} onClick={handleExport} title="Export Chat">
                            <Download size={18} />
                        </button>
                        <button className={styles.actionBtn} onClick={handleClear} title="Clear">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </header>

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
                    {/* Tool Buttons */}
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
                            onChange={(e) => setInput(e.target.value)}
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
        </div>
    );
};
