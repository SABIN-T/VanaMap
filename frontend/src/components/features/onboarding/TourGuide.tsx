import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Step {
    targetId: string;
    title: string;
    content: string;
}

const TOUR_STEPS: Step[] = [
    {
        targetId: 'nav-home',
        title: 'Welcome to VanaMap!',
        content: 'Your journey starts here. Browse our curated collection of plants customized for your environment.'
    },
    {
        targetId: 'plant-grid',
        title: 'Smart Plant Grid',
        content: 'Check out our scientifically accurate plant recommendations. Click any card to see its Oxygen Simulation!'
    },
    {
        targetId: 'nav-nearby',
        title: 'Find Local Shops',
        content: 'Need to buy? Locate the nearest verified plant shops and nurseries on our interactive map.'
    },
    {
        targetId: 'nav-guide',
        title: 'Plant Care Guide',
        content: 'Beginner? No worries. Access our comprehensive care guides to keep your plants thriving.'
    },
    {
        targetId: 'nav-cart',
        title: 'Wishlist & Cart',
        content: 'Save your favorites and prepare for your green transformation here.'
    }
];

export const TourGuide = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial check
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('vanamap_tour_complete');
        if (!hasSeenTour) {
            // Delay slightly to allow UI to load
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
                // Ensure visible
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetRect(rect);
            } else {
                // If element not found (e.g. mobile nav hidden), skip or use center fallback
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
        localStorage.setItem('vanamap_tour_complete', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            pointerEvents: 'none' // Allow clicks to pass through overlay generally, but block on tooltip
        }}>
            {/* Dark Overlay with cutout */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7)',
                // Clip path to create a "hole" (spotlight) if target exists
                clipPath: targetRect
                    ? `polygon(
                        0% 0%, 
                        0% 100%, 
                        100% 100%, 
                        100% 0%, 
                        ${targetRect.left}px 0%, 
                        ${targetRect.left}px ${targetRect.top}px, 
                        ${targetRect.right}px ${targetRect.top}px, 
                        ${targetRect.right}px ${targetRect.bottom}px, 
                        ${targetRect.left}px ${targetRect.bottom}px, 
                        ${targetRect.left}px 0%
                      )`
                    : undefined,
                transition: 'all 0.4s ease'
            }}></div>

            {/* Highlight Box Border (Visual Only) */}
            {targetRect && (
                <div style={{
                    position: 'absolute',
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                    border: '2px solid #38bdf8',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
                    transition: 'all 0.4s ease',
                    pointerEvents: 'none'
                }}></div>
            )}

            {/* Tooltip Card */}
            <div style={{
                position: 'absolute',
                top: targetRect ? Math.min(window.innerHeight - 200, Math.max(20, targetRect.bottom + 20)) : '50%',
                left: targetRect ? Math.min(window.innerWidth - 320, Math.max(20, targetRect.left)) : '50%',
                transform: targetRect ? 'none' : 'translate(-50%, -50%)',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '1rem',
                width: '300px',
                maxWidth: '90vw',
                color: 'white',
                pointerEvents: 'auto', // Re-enable clicks
                transition: 'all 0.4s ease',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <button
                    onClick={finishTour}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                    <X size={16} />
                </button>

                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#38bdf8' }}>
                        {step?.title || "Welcome"}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#e2e8f0' }}>
                        {step?.content || "Let's show you around."}
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {currentStep + 1} of {TOUR_STEPS.length}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: currentStep === 0 ? '#475569' : 'white',
                                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: 'var(--color-primary)',
                                border: 'none',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
