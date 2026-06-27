import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a preference
        const preference = localStorage.getItem('vanamap_cookies_accepted');
        if (!preference) {
            // Show banner after 2 seconds
            const timer = setTimeout(() => setVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('vanamap_cookies_accepted', 'true');
        setVisible(false);
        toast.success("Preferences saved! Thank you.", { icon: '🛡️' });
    };

    const handleReject = () => {
        localStorage.setItem('vanamap_cookies_accepted', 'false');
        setVisible(false);
        toast.success("Preferences updated.");
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            right: '24px',
            maxWidth: '500px',
            background: 'var(--color-card-bg, #FFFFFF)',
            border: '1px solid var(--color-border, rgba(11, 93, 59, 0.15))',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                    background: 'rgba(11, 93, 59, 0.1)',
                    padding: '8px',
                    borderRadius: '10px',
                    color: 'var(--color-primary, #0B5D3B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <ShieldCheck size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h4 style={{
                        margin: '0 0 4px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--color-text-main, #123524)'
                    }}>Cookie & Privacy Settings</h4>
                    <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        color: 'var(--color-text-muted, #6B7280)'
                    }}>
                        We use essential storage identifiers (localStorage/cookies) to support authorization sessions and weather geo-caching. Read our <a href="/privacy" style={{ color: 'var(--color-primary, #0B5D3B)', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</a>.
                    </p>
                </div>
                <button 
                    onClick={() => setVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted, #6B7280)',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <X size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleReject}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--color-border, rgba(0, 0, 0, 0.1))',
                        color: 'var(--color-text-muted, #6B7280)',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-alt, #FAFAF7)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    Reject Optional
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        background: 'var(--color-primary, #0B5D3B)',
                        border: 'none',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(11, 93, 59, 0.2)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(11, 93, 59, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 93, 59, 0.2)';
                    }}
                >
                    Accept All
                </button>
            </div>
        </div>
    );
};
