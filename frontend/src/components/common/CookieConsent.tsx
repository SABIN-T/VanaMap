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
        <div className="vanamapCookieBanner">
            <style>{`
                .vanamapCookieBanner {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    right: 24px;
                    max-width: 500px;
                    background: var(--color-bg-card, #0a1f18);
                    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    z-index: 10005;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    font-family: 'Inter', system-ui, sans-serif;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(16px);
                }

                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 768px) {
                    .vanamapCookieBanner {
                        bottom: 90px;
                        left: 16px;
                        right: 16px;
                        max-width: none;
                    }
                }

                .cookieBannerTitle {
                    margin: 0 0 4px;
                    fontSize: 0.95rem;
                    font-weight: 700;
                    color: var(--color-text-main, #f8fafc);
                }

                .cookieBannerDesc {
                    margin: 0;
                    font-size: 0.8rem;
                    line-height: 1.4;
                    color: var(--color-text-dim, #94a3b8);
                }

                .cookieBannerLink {
                    color: var(--color-primary, #10b981);
                    font-weight: 600;
                    text-decoration: underline;
                }

                .cookieBannerClose {
                    background: transparent;
                    border: none;
                    color: var(--color-text-dim, #94a3b8);
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justifyContent: center;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .cookieBannerClose:hover {
                    opacity: 1;
                }

                .cookieBtnReject {
                    background: transparent;
                    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
                    color: var(--color-text-main, #f8fafc);
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .cookieBtnReject:hover {
                    background: var(--color-bg-alt, rgba(255, 255, 255, 0.05));
                    border-color: var(--color-text-dim, #94a3b8);
                }

                .cookieBtnAccept {
                    background: var(--color-primary, #10b981);
                    border: none;
                    color: #000000;
                    padding: 8px 20px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
                    transition: all 0.2s;
                }

                .cookieBtnAccept:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
                }

                /* Text colors adapt dynamically when light mode is selected */
                :root[data-theme='light'] .cookieBtnAccept {
                    color: #ffffff;
                }
            `}</style>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '8px',
                    borderRadius: '10px',
                    color: 'var(--color-primary, #10b981)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <ShieldCheck size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h4 className="cookieBannerTitle">Cookie & Privacy Settings</h4>
                    <p className="cookieBannerDesc">
                        We use essential storage identifiers (localStorage/cookies) to support authorization sessions and weather geo-caching. Read our <a href="/privacy" className="cookieBannerLink">Privacy Policy</a>.
                    </p>
                </div>
                <button 
                    onClick={() => setVisible(false)}
                    className="cookieBannerClose"
                    aria-label="Close settings"
                >
                    <X size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleReject}
                    className="cookieBtnReject"
                >
                    Reject Optional
                </button>
                <button
                    onClick={handleAccept}
                    className="cookieBtnAccept"
                >
                    Accept All
                </button>
            </div>
        </div>
    );
};
