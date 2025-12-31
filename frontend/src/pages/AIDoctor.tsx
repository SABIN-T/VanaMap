import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Leaf, Bot, User, Trash2, Download, Calendar, Globe, Camera, Mic, ShoppingCart, Check, Droplets, Sun, AlertTriangle, X } from 'lucide-react';
import { fetchPlants, sendAiChat } from '../services/api';
import { useTranslation } from '../services/translation';
import { SmartResponseEngine } from '../utils/smartResponseEngine';
import toast from 'react-hot-toast';
import styles from './AIDoctor.module.css';

// Import Advanced Services
import { useVoice } from '../services/voice';
import { useImageRecognition, type PlantDiagnosis, type PlantIdentification } from '../services/imageRecognition';
import { useCareCalendar } from '../services/careCalendar';
import { useShoppingAssistant } from '../services/shoppingAssistant';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type: 'text' | 'diagnosis' | 'calendar' | 'products' | 'loading';
    data?: any;
    timestamp: Date;
}

export const AIDoctor = () => {
    // --- Advanced Service Hooks ---
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        clearTranscript,
        speak
    } = useVoice();

    const {
        diagnosePlant,
        isProcessing: isVisionProcessing
    } = useImageRecognition();

    const {
        todaysTasks,
        upcomingTasks
    } = useCareCalendar();

    const {
        loadBestDeals
    } = useShoppingAssistant();

    const { changeLanguage, currentLanguage, supportedLanguages } = useTranslation();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const [plants, setPlants] = useState<any[]>([]);

    useEffect(() => {
        fetchPlants().then(p => setPlants(p)).catch(console.error);
    }, []);

    // --- State ---
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "SYSTEM INITIALIZED. Dr. Flora Cortex v2.0 online. \nI am ready to analyze biological assets, manage maintenance schedules, and optimize procurement. Awaiting input.",
            type: 'text',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync Voice Transcript to Input
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, isVisionProcessing]);

    // --- Feature Handlers ---

    // 1. Voice Handler
    const toggleVoice = () => {
        if (isListening) {
            stopListening();
            if (transcript.trim()) {
                handleSend(transcript);
                clearTranscript();
            }
        } else {
            startListening();
            toast.success('Voice Module Active', { icon: '🎙️' });
        }
    };

    // 2. Image Handler
    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Analyzing visual data: ${file.name}...`,
            type: 'text',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const health = await diagnosePlant(file, plants);
            const identity = health.identification;

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Visual analysis complete.`,
                type: 'diagnosis',
                data: { identity, health },
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

            const name = identity?.name || 'specimen';
            const status = health.healthScore > 80 ? 'optimal' : 'requires attention';
            speak(`Analysis complete for ${name}. Status: ${status}.`);

        } catch (err) {
            toast.error('Analysis Failed');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Error processing visual data. Input unclear.",
                type: 'text',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 3. Calendar Handler
    const showCalendar = () => {
        const tasks = [...todaysTasks, ...upcomingTasks].slice(0, 5);
        if (tasks.length === 0) {
            toast('Schedule Empty', { icon: '📅' });
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "No scheduled maintenance protocols found.",
                type: 'text',
                timestamp: new Date()
            }]);
            return;
        }

        const msg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "Retrieving maintenance protocol:",
            type: 'calendar',
            data: tasks,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
    };

    // 4. Shopping Handler
    const showDeals = async () => {
        setLoading(true);
        try {
            const deals = await loadBestDeals();
            const msg: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Scanning procurement channels:",
                type: 'products',
                data: deals,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, msg]);
        } catch (e) {
            toast.error('Procurement scan failed');
        } finally {
            setLoading(false);
        }
    };

    // Basic Text Handler
    const handleSend = async (overrideText?: string) => {
        const text = overrideText || input;
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            type: 'text',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const lower = text.toLowerCase();
            if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('remind')) {
                showCalendar();
                setLoading(false);
            } else if (lower.includes('buy') || lower.includes('shop') || lower.includes('deal') || lower.includes('price')) {
                await showDeals();
            } else {
                // Integration: Use SmartResponseEngine with LLM fallback
                const responseText = await SmartResponseEngine.generateResponse(
                    text,
                    plants,
                    async (query) => {
                        const aiRes = await sendAiChat('guest', query);
                        return aiRes.response || aiRes.content || aiRes.message || null;
                    }
                );

                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: responseText,
                    type: 'text',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMsg]);
                speak(responseText);
            }
        } catch (e) {
            console.error("AI Response Error:", e);
            toast.error("Cortex communication error.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        toast.success('Buffer Cleared');
    };

    const handleExport = () => {
        const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cortex-log-${Date.now()}.txt`;
        a.click();
    };

    // --- Widget Renderers ---

    const renderDiagnosisWidget = (data: { identity?: PlantIdentification, health: PlantDiagnosis }) => (
        <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
                <Sparkles size={18} className={styles.widgetIcon} />
                <span>BIO-SCAN RESULT</span>
            </div>

            {data.identity && (
                <div className={styles.diagnosisSection}>
                    <h4>Identified Specimen</h4>
                    <p className={styles.plantName}>{data.identity.name}</p>
                    <p className={styles.scientificName}>{data.identity.scientificName}</p>
                    <div className={styles.confidenceBadge}>MATCH: {(data.identity.confidence * 100).toFixed(0)}%</div>
                </div>
            )}

            <div className={styles.diagnosisSection}>
                <h4>Integrity Analysis</h4>
                <div className={styles.healthScore}>
                    <div className={styles.scoreCircle} style={{
                        borderColor: data.health.healthScore > 70 ? '#10b981' : data.health.healthScore > 40 ? '#facc15' : '#ef4444'
                    }}>
                        {data.health.healthScore.toFixed(0)}%
                    </div>
                    <span>VITALITY INDEX</span>
                </div>

                {data.health.issues.length > 0 ? (
                    <ul className={styles.issueList}>
                        {data.health.issues.map((issue, i) => (
                            <li key={i} className={styles.issueItem}>
                                <AlertTriangle size={14} color="#ef4444" />
                                <span>{issue.name} ({issue.severity.toUpperCase()})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={styles.healthyState}>
                        <Check size={16} color="#10b981" /> INTEGRITY 100% - NO ANOMALIES
                    </div>
                )}
            </div>
        </div>
    );

    const renderCalendarWidget = (tasks: any[]) => (
        <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
                <Calendar size={18} className={styles.widgetIcon} />
                <span>PROTOCOL SCHEDULE</span>
            </div>
            <ul className={styles.taskList}>
                {tasks.map((task, i) => (
                    <li key={i} className={styles.taskItem}>
                        <div className={styles.taskIcon}>
                            {task.type === 'water' ? <Droplets size={14} /> : <Sun size={14} />}
                        </div>
                        <div className={styles.taskInfo}>
                            <span className={styles.taskPlant}>{task.plantName}</span>
                            <span className={styles.taskAction}>{task.type.toUpperCase()}</span>
                        </div>
                        <span className={styles.taskDate}>
                            {new Date(task.nextDue).toLocaleDateString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderProductsWidget = (products: any[]) => (
        <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
                <ShoppingCart size={18} className={styles.widgetIcon} />
                <span>SUPPLY CHAIN DEALS</span>
            </div>
            <div className={styles.productGrid}>
                {products.slice(0, 4).map((product, i) => (
                    <div key={i} className={styles.productCard}>
                        <div className={styles.productImagePlaceholder} />
                        <div className={styles.productInfo}>
                            <span className={styles.productName}>{product.name}</span>
                            <div className={styles.productPrice}>
                                <span className={styles.currentPrice}>₹{product.price}</span>
                                {product.discount && <span className={styles.discount}>-{product.discount}%</span>}
                            </div>
                            <button className={styles.shopBtn}>ACQUIRE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLanguageModal = () => {
        if (!showLanguageModal) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowLanguageModal(false)}>
                <div className={styles.languageModal} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Select Interface Language</h3>
                        <button className={styles.closeBtn} onClick={() => setShowLanguageModal(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className={styles.languageGrid}>
                        {supportedLanguages.map(lang => (
                            <button
                                key={lang.code}
                                className={`${styles.languageOption} ${currentLanguage === lang.code ? styles.selected : ''}`}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setShowLanguageModal(false);
                                }}
                            >
                                <span className={styles.languageFlag}>{lang.flag}</span>
                                <span className={styles.languageName}>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.cortexDashboard}>
            <div className={styles.bgPulse} />

            {/* SIDEBAR NAVIGATION */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}><Bot size={28} /></div>
                    <span className={styles.brandName}>CORTEX OS</span>
                </div>

                <div className={styles.controlGroup}>
                    <span className={styles.groupLabel}>Modules</span>

                    <button className={styles.menuBtn} onClick={showCalendar}>
                        <Calendar size={18} /> Calendar Protocol
                    </button>

                    <button className={styles.menuBtn} onClick={showDeals}>
                        <ShoppingCart size={18} /> Procurement Scan
                    </button>

                    <button className={styles.menuBtn} onClick={handleCameraClick}>
                        <Camera size={18} /> Visual Diagnostics
                    </button>

                    <button className={`${styles.menuBtn} ${isListening ? styles.active : ''}`} onClick={toggleVoice}>
                        <Mic size={18} /> Voice Command
                    </button>

                    <button className={styles.menuBtn} onClick={() => setShowLanguageModal(true)}>
                        <Globe size={18} /> {supportedLanguages.find(l => l.code === currentLanguage)?.flag} Language
                    </button>
                </div>

                <div className={styles.controlGroup}>
                    <span className={styles.groupLabel}>Actions</span>
                    <button className={styles.menuBtn} onClick={handleExport}>
                        <Download size={18} /> Export Log
                    </button>
                    <button className={styles.menuBtn} onClick={handleClear}>
                        <Trash2 size={18} /> Purge Buffer
                    </button>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>V2.0</span>
                        <span className={styles.statLabel}>System Ver</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>Integrity</span>
                    </div>
                </div>

                {/* Hidden Inputs */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageFile}
                />
            </aside>

            {/* MAIN INTERFACE */}
            <main className={styles.mainViewport}>
                <div className={styles.chatFeed}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageRow} ${message.role === 'user' ? styles.user : styles.ai}`}
                        >
                            <div className={styles.avatar}>
                                {message.role === 'user' ? <User size={20} /> : <Leaf size={20} />}
                            </div>

                            <div className={styles.messageBubble}>
                                <span className={styles.senderName}>
                                    {message.role === 'user' ? 'Operator' : 'Dr. Flora / Cortex'}
                                </span>

                                <div className={styles.contentBody}>
                                    {message.content && message.content.split('\n').map((line, i) => (
                                        <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
                                    ))}
                                </div>

                                {message.type === 'diagnosis' && message.data && renderDiagnosisWidget(message.data)}
                                {message.type === 'calendar' && message.data && renderCalendarWidget(message.data)}
                                {message.type === 'products' && message.data && renderProductsWidget(message.data)}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className={`${styles.messageRow} ${styles.ai}`}>
                            <div className={styles.avatar}><Leaf size={20} /></div>
                            <div className={styles.messageBubble}>
                                <span className={styles.senderName}>System</span>
                                <div className={styles.sparkle}>Processing...</div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* OMNI BAR */}
                <div className={styles.omniArea}>
                    <div className={styles.omniWrapper}>
                        <input
                            type="text"
                            className={styles.omniInput}
                            placeholder={isListening ? "Listening..." : "Enter Command / Plant Inquiry..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                            disabled={loading || isListening}
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>

            {renderLanguageModal()}
        </div>
    );
};
