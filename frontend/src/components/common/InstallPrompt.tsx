import { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

        if (isIosDevice && !isInStandaloneMode) {
            setIsIOS(true);
            // Show iOS prompt after a delay for effect
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }

        // Check for standard PWA install support (Android/Desktop)
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
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
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'white',
            animation: 'fadeInUp 0.5s ease-out'
        }}>
            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translate(-50%, 20px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                `}
            </style>

            <div style={{
                background: '#10b981',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Smartphone size={24} color="white" />
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Install VanaMap App</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {isIOS ? 'Tap "Share" → "Add to Home Screen"' : 'Add to Home Screen for the best experience'}
                </p>
            </div>

            {isIOS ? (
                <button onClick={() => setIsVisible(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}>
                    <X size={20} />
                </button>
            ) : (
                <button
                    onClick={handleInstallClick}
                    style={{
                        background: '#38bdf8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Download size={14} /> Install
                </button>
            )}
            {!isIOS && <button onClick={() => setIsVisible(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', marginLeft: '-4px' }}><X size={18} /></button>}
        </div>
    );
};
