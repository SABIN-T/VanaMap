import { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, ShieldAlert, CreditCard } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button';
import { sendAiChat } from '../../../services/api';

export const DoctorAIModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
        { sender: 'ai', text: 'Hello! I am Doctor AI. I can analyze your plant environment. Ask me anything!' }
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

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const data = await sendAiChat(user.email, userMsg);

            if (data.limitReached && !localStorage.getItem('premium_unlocked')) {
                setLimitReached(true);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting to the mycelial network. Try again?" }]);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        // Mock Payment
        setTimeout(() => {
            localStorage.setItem('premium_unlocked', 'true');
            setLimitReached(false);
            setMessages(prev => [...prev, { sender: 'ai', text: "Premium Unlocked! Thanks for the Rs. 20. I'm ready to help forever." }]);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '450px', height: '600px', maxHeight: '90vh',
                background: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '1.5rem',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Doctor AI</h3>
                            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Botanical Expert</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            padding: '0.8rem 1.2rem',
                            borderRadius: '1rem',
                            borderBottomLeftRadius: m.sender === 'ai' ? '0' : '1rem',
                            borderBottomRightRadius: m.sender === 'user' ? '0' : '1rem',
                            background: m.sender === 'user' ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                            color: m.sender === 'user' ? '#0f172a' : '#e2e8f0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            {m.text}
                        </div>
                    ))}

                    {limitReached && (
                        <div style={{
                            margin: '1rem 0', padding: '1.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '1rem', textAlign: 'center'
                        }}>
                            <ShieldAlert size={32} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Free Limit Reached</h4>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                You've used your 5 free chats. Subscribe to continue your botanical journey.
                            </p>
                            <Button onClick={handlePayment} style={{ width: '100%', background: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <CreditCard size={18} /> Pay Rs. 20 / Month
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.8rem', marginLeft: '1rem' }}>
                            Computing photosynthesis parameters...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', gap: '0.75rem'
                }}>
                    <input
                        type="text"
                        placeholder={limitReached ? "Subscription required..." : "Ask about your plants..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={limitReached || loading}
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={limitReached || loading}
                        style={{
                            width: '45px',
                            borderRadius: '0.75rem',
                            background: limitReached ? '#64748b' : '#38bdf8',
                            border: 'none',
                            color: limitReached ? '#94a3b8' : '#0f172a',
                            cursor: limitReached ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
