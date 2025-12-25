import { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share, PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';

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

        // Fetch key dynamically
        const publicKey = await getVapidKey();
        if (!publicKey) return;

        // Check existing
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            console.log("Already subscribed to push.");
            return;
        }

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
        console.error("Failed to subscribe push", e);
        // Do not alert user on background failures
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

    useEffect(() => {
        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

        if (isIosDevice && !isInStandaloneMode) {
            setIsIOS(true);
            // Show iOS prompt after a delay to respect Onboarding flow
            const timer = setTimeout(() => setIsVisible(true), 8000);
            return () => clearTimeout(timer);
        }

        // If installed (Standalone), ask for Permissions (Notify + GPS)
        if (isInStandaloneMode || window.matchMedia('(display-mode: standalone)').matches) {
            const askPermissions = async () => {
                // 1. Notifications
                if (Notification.permission === 'default') {
                    await Notification.requestPermission();
                }
                if (Notification.permission === 'granted') subscribeUser();

                // 2. Geolocation (GPS)
                if (navigator.geolocation) {
                    // Directly request position to trigger the browser permission prompt
                    // This works universally (Chrome, Safari, Firefox) whereas permissions.query is spotty
                    navigator.geolocation.getCurrentPosition(
                        () => {
                            toast.success("Location access granted! 🌍");
                        },
                        (err) => {
                            console.log("Location access deferred/denied", err);
                        },
                        { timeout: 5000, maximumAge: 0 }
                    );
                }
            };

            setTimeout(askPermissions, 3000);
        }

        // Check for standard PWA install support (Android)
        // Disable on Desktop (width > 1024) to keep UI clean
        const handler = (e: Event) => {
            if (window.innerWidth > 1024) return;
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Delay showing the prompt so it feels like a 'smart suggestion' after partial usage
            setTimeout(() => setIsVisible(true), 8000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: isIOS ? '40px' : 'auto', // Bottom for iOS to be nearer to nav
            top: isIOS ? 'auto' : '20px', // Top for Android
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: isIOS ? 'column' : 'row',
            alignItems: isIOS ? 'flex-start' : 'center',
            gap: '16px',
            color: 'white',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translate(-50%, 20px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                `}
            </style>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                <div style={{
                    background: isIOS ? 'linear-gradient(135deg, #007AFF, #0056b3)' : '#10b981',
                    padding: '12px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <Smartphone size={24} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                        {isIOS ? 'Install VanaMap App' : 'Get the VanaMap App'}
                    </h4>
                    {!isIOS && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Browse 2x Faster with the native app!
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '4px' }}
                    aria-label="Close install prompt"
                >
                    <X size={20} />
                </button>
            </div>

            {isIOS ? (
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span style={{ background: '#334155', borderRadius: '6px', padding: '4px' }}><Share size={14} /></span>
                        <span>1. Tap the <strong style={{ color: '#38bdf8' }}>Share</strong> button</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                        <span style={{ background: '#334155', borderRadius: '6px', padding: '4px' }}><PlusSquare size={14} /></span>
                        <span>2. Select <strong style={{ color: '#38bdf8' }}>Add to Home Screen</strong></span>
                    </div>
                    <div style={{
                        marginTop: '12px',
                        width: '0',
                        height: '0',
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '10px solid rgba(255,255,255,0.05)',
                        margin: '12px auto 0'
                    }} />
                </div>
            ) : (
                <button
                    onClick={handleInstallClick}
                    style={{
                        width: '100%',
                        background: '#38bdf8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '0'
                    }}
                    aria-label="Install VanaMap App"
                >
                    <Download size={16} /> Install Now
                </button>
            )}
        </div>
    );
};
