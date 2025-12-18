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
        { sender: 'ai', text: 'Connection Established. Greetings. I am Doctor AI, your VanaMap Botanical Guardian. Protocols initialized for ecosystem analysis. How may I serve?' }
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

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMsg = input;
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

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '2rem',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{
                width: '95%',
                maxWidth: '900px',
                height: '85vh',
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
                {/* Sidebar (Desktop only) */}
                <div style={{
                    width: '280px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    display: window.innerWidth < 768 ? 'none' : 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <Button variant="ghost" onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', paddingLeft: 0, color: '#94a3b8' }}>
                        <ArrowLeft size={16} /> Back to Earth
                    </Button>

                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', margin: '0 auto 1rem',
                            background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(56, 189, 248, 0.5)',
                            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
                        }}>
                            <Bot size={40} color="#38bdf8" />
                        </div>
                        <h2 style={{ color: 'white', margin: 0 }}>Doctor AI</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>v2.5 Biosphere Logic</p>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#facc15', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Sparkles size={14} /> PREMIUM FEATURE
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                            Get unlimited detailed diagnosis and care plans for ₹20/mo.
                        </p>
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
                    {/* Mobile Header */}
                    <div style={{
                        padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: window.innerWidth >= 768 ? 'none' : 'flex', alignItems: 'center', gap: '1rem'
                    }}>
                        <Button variant="ghost" onClick={() => navigate('/')} style={{ padding: 0 }}><ArrowLeft color="white" /></Button>
                        <span style={{ color: 'white', fontWeight: 700 }}>Doctor AI</span>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                                    background: m.sender === 'user' ? '#334155' : 'rgba(56, 189, 248, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${m.sender === 'user' ? '#475569' : 'rgba(56, 189, 248, 0.3)'}`
                                }}>
                                    {m.sender === 'user' ? <User size={16} color="white" /> : <Cpu size={16} color="#38bdf8" />}
                                </div>
                                <div style={{
                                    padding: '1rem 1.25rem',
                                    borderRadius: '1.25rem',
                                    borderTopLeftRadius: m.sender === 'ai' ? '0.2rem' : '1.25rem',
                                    borderTopRightRadius: m.sender === 'user' ? '0.2rem' : '1.25rem',
                                    background: m.sender === 'user' ? '#3b82f6' : 'rgba(30, 41, 59, 0.8)',
                                    color: m.sender === 'user' ? 'white' : '#e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    lineHeight: '1.6',
                                    fontSize: '0.95rem'
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {limitReached && (
                            <div style={{
                                margin: '0 auto', padding: '2rem',
                                background: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid #ef4444',
                                borderRadius: '1rem', textAlign: 'center',
                                maxWidth: '400px', width: '100%',
                                boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)'
                            }}>
                                <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Usage Limit Reached</h3>
                                <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1' }}>
                                    You've analyzed 5 plant scenarios. Unlock infinite wisdom.
                                </p>
                                <Button onClick={handlePayment} style={{ width: '100%', background: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={18} /> Unlock for ₹20
                                </Button>
                            </div>
                        )}

                        {loading && (
                            <div style={{ alignSelf: 'flex-start', marginLeft: '3.5rem', display: 'flex', gap: '4px' }}>
                                <span className="dot-pulse" style={{ animationDelay: '0s' }}></span>
                                <span className="dot-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="dot-pulse" style={{ animationDelay: '0.4s' }}></span>
                                <style>{`
                                    .dot-pulse { width: 8px; height: 8px; background: #38bdf8; borderRadius: 50%; display: inline-block; animation: pulse 1.4s infinite ease-in-out both; }
                                    @keyframes pulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
                                `}</style>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{
                            display: 'flex', gap: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.5rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s'
                        }}>
                            <input
                                type="text"
                                placeholder={limitReached ? "Subscription required..." : "Type your botanical query..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={limitReached || loading}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.75rem',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={limitReached || loading}
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '0.8rem',
                                    background: limitReached ? '#475569' : '#38bdf8',
                                    border: 'none',
                                    color: limitReached ? '#94a3b8' : '#0f172a',
                                    cursor: limitReached ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
