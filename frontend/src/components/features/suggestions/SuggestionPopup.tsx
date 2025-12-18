import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '../../common/Button';

export const SuggestionPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        // Trigger after 5 minutes (300,000 ms)
        // For testing, user might want to see it sooner, but request said 5 min.
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';
            await fetch(`${API_URL}/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    contact: localStorage.getItem('user_email') || 'Anonymous'
                })
            });
            setSent(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsVisible(false); // Hide permanently after sending?
            }, 3000);
        } catch (e) {
            console.error(e);
        }
    };

    if (!isVisible) return null;

    if (!isOpen) {
        return (
            <div style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 9990,
                animation: 'bounceIn 0.5s'
            }}>
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: '#22c55e', color: 'white',
                        border: 'none', borderRadius: '50%',
                        width: '60px', height: '60px',
                        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <MessageSquare size={28} />
                    <span style={{
                        position: 'absolute', top: -5, right: -5,
                        width: '15px', height: '15px',
                        background: 'red', borderRadius: '50%', border: '2px solid white'
                    }} />
                </button>
                <style>{`
                    @keyframes bounceIn {
                        0% { transform: scale(0); }
                        60% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(3px)'
        }}>
            <div className="glass-panel" style={{
                width: '90%', maxWidth: '400px',
                background: 'white',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem',
                padding: '0',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '1.5rem', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'start'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>We Value Your Feedback</h3>
                        <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                            Connect directly with our team on WhatsApp.
                        </p>
                    </div>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4ade80' }}>
                            <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>✓</div>
                            <h3>Message Sent!</h3>
                            <p style={{ color: '#94a3b8' }}>We'll reply to {localStorage.getItem('user_email')} shortly.</p>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tell us what you think or report an issue..."
                                style={{
                                    width: '100%', height: '120px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    color: 'white',
                                    resize: 'none',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    marginBottom: '1rem'
                                }}
                            />
                            <Button onClick={handleSubmit} style={{ width: '100%', background: '#22c55e', border: 'none', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <Send size={18} /> Send to WhatsApp
                            </Button>
                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
                                Sent to +91-88773534
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
