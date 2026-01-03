import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download, Calendar, Globe, Camera, Mic, ShoppingCart, Volume2, VolumeX } from 'lucide-react';
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
            const response = await chatWithDrFlora(
                messages.map(m => ({ role: m.role, content: m.content })),
                { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
                base64Image
            );

            const aiText = response.choices?.[0]?.message?.content || "I couldn't analyze that. Please try again.";

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

        // Clean text for speech (remove markdown asterisks, emojis)
        const speechText = text.replace(/\*/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '');

        const utterance = new SpeechSynthesisUtterance(speechText);

        // Voice Selection Strategy: Sweet, Female, Friendly
        const voices = synth.getVoices();
        // Priority list for "Sweet/Girlish" voices
        const preferredVoices = [
            voices.find(v => v.name.includes("Google US English")), // Often best quality
            voices.find(v => v.name.includes("Samantha")), // macOS classic
            voices.find(v => v.name.includes("Zira")), // Windows default female
            voices.find(v => v.name.includes("Female")),
            voices.find(v => v.lang.startsWith("en")) // Fallback english
        ];

        const selectedVoice = preferredVoices.find(v => v !== undefined);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Tweak personality
        utterance.pitch = 1.2; // Slightly higher "girlish/sweet" pitch
        utterance.rate = 1.05; // "Talkative" / energetic pace
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
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
            toast.error("Your browser doesn't support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            if (voiceEnabled) speak("Listening...");
            toast("Listening...", { icon: '🎤' });
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                toast.error("Microphone access denied.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
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
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoIcon}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h1 className={styles.title}>AI Plant Doctor</h1>
                            <div className={styles.subtitle}>
                                Powered by Dr. Flora • VannaMap Intelligence
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${voiceEnabled ? styles.active : ''}`}
                            onClick={toggleVoice}
                            title={voiceEnabled ? "Mute Voice" : "Enable Voice Assistant"}
                            style={{
                                color: voiceEnabled ? '#10b981' : undefined,
                                borderColor: voiceEnabled ? '#10b981' : undefined,
                                boxShadow: isSpeaking ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
                                transform: isSpeaking ? 'scale(1.1)' : undefined
                            }}
                        >
                            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <button className={styles.actionBtn} onClick={handleClear} title="Clear Chat">
                            <Trash2 size={18} />
                        </button>
                        <button className={styles.actionBtn} onClick={handleExport} title="Save Diagnosis">
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Advanced Features Toolbar */}
            <div className={styles.featuresToolbar}>
                <div className={styles.featureButtons}>
                    <button
                        className={styles.featureBtn}
                        onClick={handleCareCalendar}
                        title="Care Calendar - Set plant care reminders"
                    >
                        <Calendar size={20} />
                        <span>Care Calendar</span>
                    </button>

                    <button
                        className={styles.featureBtn}
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        title="Multi-Language Support"
                        style={{ position: 'relative' }}
                    >
                        <Globe size={20} />
                        <span>{selectedLanguage.split(' ')[0]}</span>

                        {/* Language Dropdown */}
                        {showLanguageMenu && (
                            <div className={styles.languageDropdown}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        className={styles.langOption}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLanguage(lang);
                                            setShowLanguageMenu(false);
                                            toast.success(`Language set to ${lang.split(' ')[0]}`, { icon: '🌍' });
                                        }}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        )}
                    </button>

                    <button
                        className={styles.featureBtn}
                        onClick={handleScanClick}
                        title="Scan Plant - Diagnose from photos"
                    >
                        <Camera size={20} />
                        <span>Scan Plant</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    <button
                        className={styles.featureBtn}
                        onClick={() => toast('Voice Input - Coming Soon! Talk to Dr. Flora hands-free!', { icon: '🎤', duration: 4000 })}
                        title="Voice Input - Hands-free chat"
                    >
                        <Mic size={20} />
                        <span>Voice</span>
                    </button>

                    <button
                        className={styles.featureBtn}
                        onClick={() => toast('Shopping Assistant - Coming Soon! Find best deals on plants and supplies.', { icon: '🛒', duration: 4000 })}
                        title="Shopping Assistant - Find best deals"
                    >
                        <ShoppingCart size={20} />
                        <span>Shop</span>
                    </button>
                </div>
            </div>

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
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
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
                {previewUrl && (
                    <div className={styles.imagePreviewContainer} style={{
                        position: 'absolute',
                        bottom: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        background: '#1e293b',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <img src={previewUrl} alt="Upload Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Image selected</span>
                            <button
                                onClick={clearImage}
                                style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Trash2 size={12} /> Remove
                            </button>
                        </div>
                    </div>
                )}
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
                    <div className={styles.fileInputWrapper}>
                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        toast.error("Image too large. Max 5MB.");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        // Store file and preview
                                        // Note: We'll need state for this
                                        // For now, let's assume setUserImage and userImagePreview exist
                                        // We will add them in the component body next
                                        (window as any).setImageUpload(file, reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                    <button
                        className={styles.sendBtn}
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={loading}
                        title="Upload Plant Photo"
                    >
                        <Camera size={20} />
                    </button>
                    <button
                        className={styles.sendBtn}
                        onClick={toggleListening}
                        disabled={loading}
                        style={{
                            background: isListening ? '#ef4444' : undefined,
                            transition: 'all 0.3s ease',
                            animation: isListening ? 'pulse 1.5s infinite' : 'none'
                        }}
                        title={isListening ? "Stop Listening" : "Start Voice Input"}
                    >
                        <Mic size={20} />
                    </button>
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
