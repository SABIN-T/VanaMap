import { useState, useEffect, useRef } from 'react';
import { Send, Bot, ShieldAlert, CreditCard, ArrowLeft, Sparkles, User, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

// Mock API call
const sendChat = async (userId: string, message: string) => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://plantoxy.onrender.com/api');
    const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
    });
    return res.json();
};

export const DoctorAIPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
        { sender: 'ai', text: 'Hello! I am Doctor AI. I can search web sources, identify plant issues, and find verified vendors for you. What are you looking for today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Local Fallback Intelligence (Simulates Backend if Offline)
    const simulateAIResponse = (query: string) => {
        const q = query.toLowerCase();

        // Security
        if (q.match(/(code|security|password|credential|database|api key|token|backend|server)/)) {
            return "SECURITY ALERT: Access to internal source code is strictly PROHIBITED. My function is limited to Botanical Intelligence.";
        }

        // Greeting
        if (q.match(/^(hi|hello|hey|greetings|start)/)) {
            return "Connection Established. Greetings. I am the VanaMap Intelligence, trained on global botanical repositories. Query me about any plant species or local availabilities.";
        }

        // Heuristics (Match Backend Logic)
        if (q.includes('water')) return "Hydration Logic: Most indoor flora requires water when the substrate's top inch desiccates. Succulents require total aridity between cycles. Recommendation: Check soil moisture daily.";
        if (q.includes('light') || q.includes('sun')) return "Photosynthesis Optimization: South-facing apertures provide high lux (direct). North-facing provides ambient (low) light. Match your plant's heliophilic rating.";
        if (q.includes('yellow')) return "Chlorosis Detected: Yellowing often signals hydric saturation (overwatering). Alternates: Nitrogen deficiency or pest vectors. Audit soil moisture immediately.";
        if (q.includes('bug') || q.includes('pest')) return "Pest Protocol: Isolate the specimen. Apply Neem Oil solution or insecticidal soap. Increase humidity if Spider Mites are suspected.";

        // Data Sim
        return `Synthesizing Global Data Streams... [Connected]\n\nAnalysis for "${query}":\nBased on aggregated botanical datasets (Google/Wiki/Ref), this subject relates to specific horticultural parameters. Recommend maintaining 20-25°C ambient temperature and 50% relative humidity. \n\nAcquisition: Cross-referencing your location... Local Vendors in the 'Nearby' tab likely stock relevant supplies.`;
    };

    const suggestions: string[] = [
        "Best indoor plants?",
        "Why is my plant yellow?",
        "Find verified vendors",
        "Watering tips",
        "Search online for succulents"
    ];

    const handleSend = async (textOverride?: string) => {
        const userMsg = textOverride || input;
        if (!userMsg.trim() || !user) return;

        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const data = await sendChat(user.email, userMsg);

            if (data.limitReached && !localStorage.getItem('premium_unlocked')) {
                setLimitReached(true);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
            }
        } catch (e) {
            console.error("AI Offline, switching to local:", e);
            // FALLBACK TO SIMULATED AI
            // Delay slightly to simulate processing
            setTimeout(() => {
                const fallbackResponse = simulateAIResponse(userMsg);
                setMessages(prev => [...prev, { sender: 'ai', text: fallbackResponse }]);
            }, 500);
        } finally {
            if (window.location.hostname === 'localhost') setLoading(false); // Immediate for local logic
            else setTimeout(() => setLoading(false), 500); // Visual delay
        }
    };

    const handlePayment = () => {
        // Mock Payment
        const toast = window.confirm("Pay ₹20 via UPI?"); // Simple mock
        if (toast) {
            setTimeout(() => {
                localStorage.setItem('premium_unlocked', 'true');
                setLimitReached(false);
                setMessages(prev => [...prev, { sender: 'ai', text: "Access Granted. Premium protocols initiated. I am at your service." }]);
            }, 1000);
        }
    };

    if (!user) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'white' }}>
                <h2>Authentication Required</h2>
                <Button onClick={() => navigate('/auth')}>Login to Access Doctor AI</Button>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '2rem',
            background: '#0f172a', // Fallback
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center'
        }}>
            {/* Dynamic Background Animation */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
                zIndex: 0
            }} />
            <div className="bio-orb" style={{
                position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(60px)', animation: 'float 20s infinite ease-in-out'
            }} />
            <div className="bio-orb" style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(80px)', animation: 'float 25s infinite ease-in-out reverse'
            }} />

            <style>{`
                @keyframes float { 0% { transform: translate(0, 0); } 50% { transform: translate(30px, 50px); } 100% { transform: translate(0, 0); } }
                @keyframes messageSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .glass-panel { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .suggestion-chip:hover { background: rgba(56, 189, 248, 0.2) !important; transform: translateY(-2px); border-color: #38bdf8 !important; }
            `}</style>

            <div className="glass-panel" style={{
                width: '95%',
                maxWidth: '1000px',
                height: '85vh',
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 50px -10px rgba(0,0,0,0.5)',
                zIndex: 1,
                position: 'relative'
            }}>
                {/* Sidebar (Desktop) */}
                <div style={{
                    width: '300px',
                    background: 'rgba(2, 6, 23, 0.4)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    padding: '2rem',
                    display: window.innerWidth < 850 ? 'none' : 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/')} style={{ paddingLeft: 0, color: '#94a3b8', marginBottom: '3rem' }}>
                            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Return to Base
                        </Button>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100px', height: '100px', margin: '0 auto 1.5rem',
                                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(34, 197, 94, 0.05))',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                boxShadow: '0 0 30px rgba(56, 189, 248, 0.15), inset 0 0 20px rgba(56, 189, 248, 0.05)'
                            }}>
                                <Bot size={48} color="#38bdf8" style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }} />
                            </div>
                            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Doctor AI</h2>
                            <div style={{
                                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
                                color: '#4ade80', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase'
                            }}>
                                Online • V3.0
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.25rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)',
                        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Sparkles size={14} /> PREMIUM ACCESS
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                            Unlimited detailed simulations and vendor tracking unlocked.
                        </p>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>

                    {/* Mobile Header */}
                    <div style={{
                        padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.8)',
                        display: window.innerWidth >= 850 ? 'none' : 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(10px)'
                    }}>
                        <Button variant="ghost" onClick={() => navigate('/')} style={{ padding: 0 }}><ArrowLeft color="white" /></Button>
                        <div>
                            <span style={{ color: 'white', fontWeight: 700, display: 'block' }}>Doctor AI</span>
                            <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>● System Online</span>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                                animation: 'messageSlide 0.4s ease-out forwards'
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                                    background: m.sender === 'user' ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'rgba(15, 23, 42, 0.8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: m.sender === 'user' ? 'none' : '1px solid rgba(56, 189, 248, 0.3)',
                                    boxShadow: m.sender === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)'
                                }}>
                                    {m.sender === 'user' ? <User size={18} color="white" /> : <Cpu size={18} color="#38bdf8" />}
                                </div>

                                {/* Message Bubble */}
                                <div style={{
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '1.5rem',
                                    borderTopLeftRadius: m.sender === 'ai' ? '4px' : '1.5rem',
                                    borderTopRightRadius: m.sender === 'user' ? '4px' : '1.5rem',
                                    background: m.sender === 'user' ? '#2563eb' : 'rgba(30, 41, 59, 0.65)',
                                    border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                                    color: m.sender === 'user' ? 'white' : '#e2e8f0',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    lineHeight: '1.65',
                                    fontSize: '0.95rem',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {/* Limit Warning */}
                        {limitReached && (
                            <div style={{
                                margin: '2rem auto', padding: '2rem',
                                background: 'linear-gradient(45deg, rgba(127, 29, 29, 0.9), rgba(69, 10, 10, 0.95))',
                                border: '1px solid #ef4444', borderRadius: '16px', textAlign: 'center',
                                maxWidth: '420px', width: '100%', boxShadow: '0 10px 40px rgba(239, 68, 68, 0.25)'
                            }}>
                                <ShieldAlert size={48} color="#fca5a5" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.5))' }} />
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.25rem' }}>Data Limit Exceeded</h3>
                                <p style={{ margin: '0 0 1.5rem 0', color: '#fecaca', fontSize: '0.95rem' }}>
                                    Upgrade to access unlimited biosphere simulations.
                                </p>
                                <Button onClick={handlePayment} style={{ width: '100%', background: 'white', color: '#991b1b', border: 'none', fontWeight: 'bold' }}>
                                    <CreditCard size={18} style={{ marginRight: '8px' }} /> Unlock Premium
                                </Button>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div style={{ marginLeft: '4rem', display: 'flex', gap: '6px' }}>
                                <div className="dot-pulse" style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0s' }} />
                                <div className="dot-pulse" style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                                <div className="dot-pulse" style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '1.5rem 2rem',
                        background: 'rgba(15, 23, 42, 0.4)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        {/* Suggestion Chips */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => handleSend(s)} className="suggestion-chip" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '100px',
                                    padding: '8px 16px',
                                    color: '#cbd5e1',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Input Box */}
                        <div style={{
                            display: 'flex', gap: '1rem',
                            background: 'rgba(2, 6, 23, 0.6)',
                            padding: '6px',
                            borderRadius: '16px',
                            border: '1px solid rgba(56, 189, 248, 0.15)',
                            transition: 'all 0.3s',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)'}
                        >
                            <input
                                type="text"
                                placeholder={limitReached ? "Premium required..." : "Initialize simulation parameter..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={limitReached || loading}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.75rem 1.25rem',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    letterSpacing: '0.3px'
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={limitReached || loading}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: limitReached ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                                    border: 'none',
                                    color: limitReached ? '#64748b' : 'white',
                                    cursor: limitReached ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'transform 0.2s',
                                    boxShadow: limitReached ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }}
                                onMouseEnter={(e) => !limitReached && (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Send size={20} fill={limitReached ? "none" : "white"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
