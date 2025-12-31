import { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share, PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';

// ... (Keep existing helper functions if needed, or re-implement if they were just for push - strictly speaking push logic was mixed in here, I should preserve the push subscription logic if it was relevant, but the file name implies InstallPrompt. The previous code had `subscribeUser` mixed in. I will keep the subscription logic but clean up the UI.)

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getVapidKey = async () => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';
        const res = await fetch(`${API_URL}/notifications/vapid-key`);
        const data = await res.json();
        return data.publicKey;
    } catch (e) {
        console.error("Failed to fetch VAPID key", e);
        return null;
    }
};

const subscribeUser = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
        const registration = await navigator.serviceWorker.ready;
        const publicKey = await getVapidKey();
        if (!publicKey) return;

        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) return;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';
        await fetch(`${API_URL}/notifications/subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' }
        });
        toast.success("Notifications enabled! 🌿");
    } catch (e) {
        // Silent fail
    }
};

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Move detection to initial state to avoid cascading renders in useEffect
    const [isIOS] = useState(() => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !((window as unknown as { MSStream: any }).MSStream);
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as unknown as { standalone: boolean }).standalone;

        if (isIOS && !isInStandaloneMode) {
            setTimeout(() => setIsVisible(true), 5000);
        }

        if (isInStandaloneMode || window.matchMedia('(display-mode: standalone)').matches) {
            // Already installed - ask for perms silently/toast
            setTimeout(() => {
                if (Notification.permission === 'default') Notification.requestPermission();
                subscribeUser();
            }, 3000);
        } else {
            // Android/Desktop PWA
            const handler = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e as BeforeInstallPromptEvent);
                setTimeout(() => setIsVisible(true), 5000);
            };
            window.addEventListener('beforeinstallprompt', handler);
            return () => {
                window.removeEventListener('beforeinstallprompt', handler);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isIOS]);


    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (isIOS) return; // iOS handles viewing instructions
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
            subscribeUser();
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: isMobile ? '90px' : '40px',
            left: isMobile ? '50%' : 'auto',
            right: isMobile ? 'auto' : '40px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
            zIndex: 10000,
            width: isMobile ? 'calc(100% - 32px)' : '400px',
            maxWidth: '450px',
            perspective: '1000px',
            animation: 'cortexFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
                
                @keyframes cortexFadeUp {
                    from { opacity: 0; transform: ${isMobile ? 'translate(-50%, 40px)' : 'translateY(40px)'}; }
                    to { opacity: 1; transform: ${isMobile ? 'translate(-50%, 0)' : 'translateY(0)'}; }
                }
                @keyframes brainPulse {
                    0% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.1); }
                    50% { box-shadow: 0 0 40px rgba(0, 240, 255, 0.2); }
                    100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.1); }
                }
                .cortex-install-card {
                    background: rgba(5, 5, 5, 0.9);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(0, 240, 255, 0.2);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    animation: brainPulse 4s infinite ease-in-out;
                }
                .cortex-btn-primary {
                    background: linear-gradient(135deg, #00ffa3 0%, #00f0ff 100%);
                    color: #000;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-family: 'JetBrains Mono', monospace;
                    box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
                }
                .cortex-btn-primary:active { transform: scale(0.98); }
            `}</style>

            <div className="cortex-install-card">
                {/* Scanner Line Effect */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
                    opacity: 0.5,
                    animation: 'scanLine 3s infinite',
                }} />
                <style>{`
                    @keyframes scanLine {
                        0% { top: -2px; }
                        100% { top: 100%; }
                    }
                `}</style>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1, gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
                        }}>
                            <Smartphone size={24} color="#00f0ff" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                System Initialize
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
                                Deploy VanaMap to Home Screen for 2x neural speed.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div style={{ zIndex: 1 }}>
                    {!isIOS ? (
                        <button
                            onClick={handleInstallClick}
                            className="cortex-btn-primary"
                            style={{
                                width: '100%',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Download size={18} /> INSTALL PROTOCOL
                        </button>
                    ) : (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontFamily: 'JetBrains Mono, monospace'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                <div style={{ background: 'rgba(0, 240, 255, 0.1)', borderRadius: '6px', padding: '6px', border: '1px solid rgba(0, 240, 255, 0.2)' }}><Share size={14} color="#00f0ff" /></div>
                                <span>1. COMMAND <strong style={{ color: '#00f0ff' }}>SHARE</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                <div style={{ background: 'rgba(0, 255, 163, 0.1)', borderRadius: '6px', padding: '6px', border: '1px solid rgba(0, 255, 163, 0.2)' }}><PlusSquare size={14} color="#00ffa3" /></div>
                                <span>2. ACTION <strong style={{ color: '#00ffa3' }}>ADD TO HOME</strong></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

