import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, ShoppingBag, BookOpen, Leaf, MoveHorizontal } from 'lucide-react';

interface Step {
    targetId: string;
    title: string;
    content: string;
    icon?: React.ReactNode;
}

const TOUR_STEPS: Step[] = [
    {
        targetId: 'nav-home',
        title: 'Hi! I\'m Sprout.',
        content: 'I\'ll be your eco-guide today! Let\'s find the perfect plants for your sanctuary.',
        icon: <Leaf className="text-emerald-400" size={24} />
    },
    {
        targetId: 'mobile-swipe',
        title: 'Swipe to Navigate',
        content: 'On mobile? Swipe left or right anywhere to quickly switch between Home, Shops, Dr. AI, and Cart! 📱',
        icon: <MoveHorizontal className="text-blue-400" size={24} />
    },
    {
        targetId: 'plant-grid',
        title: 'Science-Backed Picks',
        content: 'This grid ranks plants by how well they\'ll clean YOUR air. Tap any card to run a room simulation!',
        icon: <div className="text-blue-400">🧬</div>
    },
    {
        targetId: 'nav-nearby',
        title: 'Local Nurseries',
        content: 'Need to buy? I can show you verified shops right in your neighborhood.',
        icon: <MapPin className="text-orange-400" size={24} />
    },
    {
        targetId: 'nav-guide',
        title: 'Care Library',
        content: 'Don\'t panic! Our encyclopedia has every watering & light tip you need.',
        icon: <BookOpen className="text-purple-400" size={24} />
    },
    {
        targetId: 'nav-cart',
        title: 'Your Collection',
        content: 'Save your favorites here. Ready to start your journey?',
        icon: <ShoppingBag className="text-pink-400" size={24} />
    }
];

// Animated Mascot Component
const Mascot = ({ talking }: { talking: boolean }) => (
    <div style={{ position: 'relative', width: '80px', height: '80px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>
        <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Body/Pot */}
            <path d="M30 65 Q50 85 70 65 L65 90 Q50 95 35 90 Z" fill="#d97706" />
            <ellipse cx="50" cy="65" rx="20" ry="5" fill="#b45309" />

            {/* Face */}
            <circle cx="42" cy="75" r="3" fill="#1e293b" />
            <circle cx="58" cy="75" r="3" fill="#1e293b" />
            <path d={talking ? "M45 82 Q50 88 55 82" : "M48 82 Q50 84 52 82"} stroke="#1e293b" strokeWidth="2" fill="none">
                {talking && <animate attributeName="d" values="M45 82 Q50 88 55 82; M45 82 Q50 80 55 82; M45 82 Q50 88 55 82" dur="0.2s" repeatCount="indefinite" />}
            </path>
            <circle cx="38" cy="78" r="2" fill="#fda4af" opacity="0.6" />
            <circle cx="62" cy="78" r="2" fill="#fda4af" opacity="0.6" />

            {/* Stem & Leaves */}
            <g style={{ transformOrigin: '50% 65%', animation: 'sway 3s ease-in-out infinite' }}>
                <path d="M50 65 Q50 30 50 30" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                <path d="M50 30 Q30 10 10 20 Q30 30 50 30" fill="#4ade80" />
                <path d="M50 45 Q70 35 80 50 Q60 55 50 45" fill="#22c55e" />
            </g>
        </svg>
        <style>{`
            @keyframes sway {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
            }
        `}</style>
    </div>
);

export const TourGuide = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Initial check
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('vanamap_tour_v4_complete');
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 1500);
        }

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update rect
    useEffect(() => {
        if (!isVisible || isMobile) return; // Skip targeting on mobile

        const updatePosition = () => {
            const step = TOUR_STEPS[currentStep];
            if (!step) return;

            const element = document.getElementById(step.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetRect(rect);
            } else {
                setTargetRect(null);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStep, isVisible, isMobile]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishTour();
        }
    };

    const finishTour = () => {
        setIsVisible(false);
        localStorage.setItem('vanamap_tour_v4_complete', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden'
        }}>
            {/* Spotlight Overlay - DESKTOP ONLY */}
            {!isMobile && targetRect && (
                <div style={{
                    position: 'absolute',
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                    borderRadius: '16px',
                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.85)',
                    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        border: '2px solid #38bdf8', borderRadius: '16px',
                        animation: 'pulse-border 2s infinite'
                    }}></div>
                </div>
            )}

            {(!isMobile && !targetRect) && <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)' }}></div>}

            {/* Mobile simplified overlay */}
            {isMobile && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'none' }}></div>}

            {/* Speech Bubble / Dialog Box */}
            <div style={{
                position: isMobile ? 'fixed' : 'absolute',
                // Mobile: Stick to bottom, Desktop: Follow target
                bottom: isMobile ? 'auto' : (targetRect ? 'auto' : '50%'),
                top: isMobile ? '50%' : (targetRect ? Math.min(window.innerHeight - 250, Math.max(100, targetRect.bottom + 40)) : '50%'),
                left: isMobile ? '50%' : (targetRect ? Math.min(window.innerWidth - 350, Math.max(50, targetRect.left)) : '50%'),
                transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-50%)',
                width: isMobile ? '90vw' : '340px',
                pointerEvents: 'auto',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px'
            }}>
                {/* Mascot Avatar */}
                <div style={{ zIndex: 10, marginBottom: '-10px', transform: 'scale(1.2)' }}>
                    <Mascot talking={true} />
                </div>

                {/* Dialog Box */}
                <div className="glass-panel" style={{
                    flex: 1,
                    position: 'relative',
                    background: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1.5rem',
                    borderBottomLeftRadius: '0.2rem',
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
                    padding: '0',
                    color: 'white'
                }}>
                    {/* Top Controls */}
                    <div style={{
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {TOUR_STEPS.map((_, i) => (
                                <div key={i} style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: i === currentStep ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s'
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={finishTour} style={{ color: '#94a3b8', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>SKIP</button>
                            <button onClick={handleNext} style={{
                                background: 'var(--color-primary)',
                                border: 'none', borderRadius: '99px',
                                padding: '0.25rem 0.8rem',
                                color: 'white', fontSize: '0.75rem', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center'
                            }}>
                                {currentStep === TOUR_STEPS.length - 1 ? 'FINISH' : 'NEXT'} <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            {step?.icon}
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{step?.title}</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: '#cbd5e1' }}>
                            {step?.content}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
                }
            `}</style>
        </div>
    );
};
