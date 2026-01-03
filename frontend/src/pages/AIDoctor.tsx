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

        // 1. Advanced Text Cleanup & Pronunciation Fixes
        let cleanText = text
            .replace(/\*/g, '') // Remove bold/italic markers
            .replace(/[#\-]/g, '') // Remove headers/lists
            .replace(/\[.*?\]/g, '') // Remove [Citation] or [Image] tags
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
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
            // Add natural pauses for better flow
            .replace(/([.!?])\s+/g, '$1 ... ') // Slight pause after sentences
            .replace(/,\s+/g, ', ') // Ensure comma spacing
            .trim();

        // Split into sentences for natural pausing
        const sentences = cleanText.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [cleanText];

        // 2. Premium Voice Selection - Prioritize Neural/Natural voices
        const voices = synth.getVoices();

        // Try to find the best quality voice in order of preference
        const preferredVoice =
            // Premium Neural voices (Edge, Chrome)
            voices.find(v => v.name.includes("Natural") && v.name.includes("Female") && v.lang.startsWith("en")) ||
            voices.find(v => v.name.includes("Neural") && v.lang.startsWith("en")) ||
            voices.find(v => v.name.includes("Natural") && v.lang.startsWith("en")) ||
            // High-quality platform voices
            voices.find(v => v.name.includes("Google UK English Female")) ||
            voices.find(v => v.name.includes("Google US English")) ||
            voices.find(v => v.name.includes("Samantha")) || // macOS - very natural
            voices.find(v => v.name.includes("Ava")) || // macOS premium
            voices.find(v => v.name.includes("Zira")) || // Windows
            // Fallback to any English female voice
            voices.find(v => v.name.toLowerCase().includes("female") && v.lang.startsWith("en")) ||
            voices.find(v => v.lang.startsWith("en-US")) ||
            voices.find(v => v.lang.startsWith("en"));

        // 3. Speak Sentence-by-Sentence with Dynamic Expression
        sentences.forEach((sentence, index) => {
            if (!sentence.trim()) return;

            const utterance = new SpeechSynthesisUtterance(sentence.trim());

            if (preferredVoice) utterance.voice = preferredVoice;

            // --- Enhanced Personality Tuning for Loveable Kindness & Warmth ---

            // Base settings for a warm, kind, nurturing voice (like a caring friend)
            let basePitch = 1.2;  // Sweet, friendly pitch
            let baseRate = 1.0;   // Calm, not rushed - gives time to absorb

            // Dynamic adjustments based on content and EMOTIONS
            const lowerSentence = sentence.toLowerCase();

            // LAUGHING/PLAYFUL - lighter, faster, higher
            if (lowerSentence.includes('haha') || lowerSentence.includes('lol') ||
                lowerSentence.includes('*giggles*') || lowerSentence.includes('😄') ||
                lowerSentence.includes('funny') || lowerSentence.includes('oops')) {
                basePitch = 1.28; // Higher, playful
                baseRate = 1.08;  // Faster, energetic
            }

            // EXCITEMENT/CELEBRATION - very high pitch & faster
            if (lowerSentence.includes('omg') || lowerSentence.includes('wow') ||
                lowerSentence.includes('yay') || lowerSentence.includes('🎉') ||
                lowerSentence.includes('amazing') || lowerSentence.includes('incredible') ||
                lowerSentence.includes('*happy dance*')) {
                basePitch = 1.3;  // Very cheerful!
                baseRate = 1.12;  // Excited pace
            }

            // General excitement/Important info
            if (lowerSentence.includes('!') || lowerSentence.includes('great') ||
                lowerSentence.includes('perfect') || lowerSentence.includes('excellent') ||
                lowerSentence.includes('wonderful')) {
                basePitch = 1.25; // Extra cheerful
                baseRate = 1.05;  // Energetic but not rushed
            }

            // Questions - gentle rising intonation
            if (sentence.includes('?')) {
                basePitch = 1.22; // Curious, inviting
                baseRate = 0.98;  // Slightly slower for clarity
            }

            // SADNESS/EMPATHY - lower, slower, gentle
            if (lowerSentence.includes('aww') || lowerSentence.includes('🥺') ||
                lowerSentence.includes('poor') || lowerSentence.includes('sad') ||
                lowerSentence.includes('died') || lowerSentence.includes('💔')) {
                basePitch = 1.05; // Lower, more somber
                baseRate = 0.9;   // Slower, more gentle
            }

            // Reassurance/Comfort - softer, slower, very gentle
            if (lowerSentence.includes('worry') || lowerSentence.includes('fix') ||
                lowerSentence.includes('help') || lowerSentence.includes('together') ||
                lowerSentence.includes('okay') || lowerSentence.includes('alright') ||
                lowerSentence.includes('🤗')) {
                basePitch = 1.15; // Softer, more soothing
                baseRate = 0.95;  // Slower, more comforting
            }

            // Empathy/Understanding - warm and gentle
            if (lowerSentence.includes('sorry') || lowerSentence.includes('unfortunately') ||
                lowerSentence.includes('understand') || lowerSentence.includes('i know')) {
                basePitch = 1.1;  // Lower, more empathetic
                baseRate = 0.93;  // Slower, more thoughtful
            }

            // Encouragement - uplifting and positive
            if (lowerSentence.includes('you can') || lowerSentence.includes('you got') ||
                lowerSentence.includes('doing great') || lowerSentence.includes('good job') ||
                lowerSentence.includes('proud')) {
                basePitch = 1.23; // Uplifting
                baseRate = 1.02;  // Confident pace
            }

            utterance.pitch = basePitch;
            utterance.rate = baseRate;
            utterance.volume = 1.0;

            // Tracking speaking state
            if (index === 0) utterance.onstart = () => setIsSpeaking(true);
            if (index === sentences.length - 1) {
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
            }

            synth.speak(utterance);
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
            // Check if it's a new message (simple check: logic handled by when messages update)
            speak(lastMsg.content);
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
            toast("🎤 Listening... Speak now!", {
                icon: '👂',
                duration: 3000,
                style: {
                    background: '#10b981',
                    color: 'white'
                }
            });
        };

        recognition.onresult = (event: any) => {
            let transcript = '';

            // Collect all results (interim + final)
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            // Update input field with recognized text
            if (transcript.trim()) {
                setInput((prev) => {
                    const newText = prev ? prev + ' ' + transcript : transcript;
                    return newText;
                });

                // Show what was recognized
                if (event.results[event.results.length - 1].isFinal) {
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
