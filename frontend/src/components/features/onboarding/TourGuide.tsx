import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MapPin, ShoppingBag, BookOpen, Leaf } from 'lucide-react';

interface Step {
    targetId: string;
    title: string;
    content: string;
    icon?: React.ReactNode;
}

const TOUR_STEPS: Step[] = [
    {
        targetId: 'nav-home',
        title: 'Welcome to VanaMap',
        content: 'Your smart botanist assistant. Let us guide you to the perfect plant for your space.',
        icon: <Leaf className="text-emerald-400" size={32} />
    },
    {
        targetId: 'plant-grid',
        title: 'Scientific Recommendations',
        content: 'Explore our AI-ranked species database. Click any plant to simulate its oxygen output in your room.',
        icon: <div className="text-blue-400">🧬</div>
    },
    {
        targetId: 'nav-nearby',
        title: 'Locate Nurseries',
        content: 'Find verified local shops and garden centers near you with our interactive map.',
        icon: <MapPin className="text-orange-400" size={32} />
    },
    {
        targetId: 'nav-guide',
        title: 'Expert Care Guides',
        content: 'Access detailed care instructions and maintenance tips to keep your green friends thriving.',
        icon: <BookOpen className="text-purple-400" size={32} />
    },
    {
        targetId: 'nav-cart',
        title: 'Your Green Wishlist',
        content: 'Save plants you love and manage your collection here.',
        icon: <ShoppingBag className="text-pink-400" size={32} />
    }
];

export const TourGuide = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial check
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('vanamap_tour_v2_complete');
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    // Update rect when step changes
    useEffect(() => {
        if (!isVisible) return;

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
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const finishTour = () => {
        setIsVisible(false);
        localStorage.setItem('vanamap_tour_v2_complete', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none',
            overflow: 'hidden'
        }}>
            {/* Spotlight Effect using Box Shadow */}
            {targetRect && (
                <div style={{
                    position: 'absolute',
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                    borderRadius: '12px',
                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.85)', // The dark overlay
                    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                    {/* Pulsing Border */}
                    <div className="tour-pulse" style={{
                        position: 'absolute',
                        inset: 0,
                        border: '2px solid #38bdf8',
                        borderRadius: '12px',
                        boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
                    }}></div>
                </div>
            )}

            {/* If no target (e.g. valid mobile mismatch), show full overlay */}
            {!targetRect && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)' }}></div>
            )}

            {/* Tooltip Card */}
            <div style={{
                position: 'absolute',
                top: targetRect ? Math.min(window.innerHeight - 250, Math.max(20, targetRect.bottom + 30)) : '50%',
                left: targetRect ? Math.min(window.innerWidth - 350, Math.max(20, targetRect.left - 20)) : '50%',
                transform: targetRect ? 'none' : 'translate(-50%, -50%)',
                width: '320px',
                maxWidth: '90vw',
                pointerEvents: 'auto',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            }}>
                <div className="glass-panel" style={{
                    padding: '0',
                    borderRadius: '1.5rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden'
                }}>
                    {/* Header Image/Icon */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0.0) 100%)',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#38bdf8'
                        }}>
                            {step?.icon || <Leaf size={24} />}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'white' }}>
                                {step?.title}
                            </h3>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                Step {currentStep + 1} of {TOUR_STEPS.length}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#cbd5e1' }}>
                            {step?.content}
                        </p>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={finishTour}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Skip Tour
                        </button>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: currentStep === 0 ? '#475569' : 'white',
                                    cursor: currentStep === 0 ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '99px',
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                {currentStep === TOUR_STEPS.length - 1 ? 'Start Exploring' : 'Next'}
                                {currentStep !== TOUR_STEPS.length - 1 && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
                }
                .tour-pulse {
                    animation: pulse-ring 2s infinite;
                }
            `}</style>
        </div>
    );
};
