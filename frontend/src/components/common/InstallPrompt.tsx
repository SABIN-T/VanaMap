import { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share, PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';

// ... (Keep existing helper functions if needed, or re-implement if they were just for push - strictly speaking push logic was mixed in here, I should preserve the push subscription logic if it was relevant, but the file name implies InstallPrompt. The previous code had `subscribeUser` mixed in. I will keep the subscription logic but clean up the UI.)

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
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
    const [isIOS, setIsIOS] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

        if (isIosDevice && !isInStandaloneMode) {
            setIsIOS(true);
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
    }, []);

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
            bottom: isMobile ? '20px' : '40px',
            left: isMobile ? '50%' : 'auto',
            right: isMobile ? 'auto' : '40px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
            zIndex: 10000,
            width: isMobile ? 'calc(100% - 32px)' : '420px',
            maxWidth: '450px',
            perspective: '1000px',
            animation: 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style>{`
                @keyframes slideUpFade {
                    from { opacity: 0; transform: ${isMobile ? 'translate(-50%, 50px)' : 'translateY(50px)'}; }
                    to { opacity: 1; transform: ${isMobile ? 'translate(-50%, 0)' : 'translateY(0)'}; }
                }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.85); /* Slate 900 with opacity */
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 
                        0 20px 40px -5px rgba(0, 0, 0, 0.4),
                        0 10px 20px -5px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
            `}</style>

            <div className="glass-panel" style={{
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow Effect */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '150%',
                    height: '200%',
                    background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08), transparent 60%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1, gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
                        }}>
                            <Smartphone size={28} color="white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                Get the VanaMap App
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.4 }}>
                                Browse 2x faster with the native experience.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Body */}
                <div style={{ zIndex: 1 }}>
                    {!isIOS ? (
                        <button
                            onClick={handleInstallClick}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '16px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 20px -4px rgba(14, 165, 233, 0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
                                transition: 'transform 0.2s active'
                            }}
                        >
                            <Download size={20} className="animate-bounce" /> Install Now
                        </button>
                    ) : (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '16px',
                            padding: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px' }}><Share size={16} /></div>
                                <span>1. Tap simple <strong style={{ color: '#38bdf8' }}>Share</strong> button below</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px' }}><PlusSquare size={16} /></div>
                                <span>2. Select <strong style={{ color: '#38bdf8' }}>Add to Home Screen</strong></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

