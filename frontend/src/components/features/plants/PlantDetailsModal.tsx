import { useState, useMemo, useEffect } from 'react';
import { X, Sun, Wind, Thermometer, Activity, Droplet, ShoppingBag, Leaf, Zap, PersonStanding } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';

interface PlantDetailsModalProps {
    plant: Plant;
    weather: {
        avgTemp30Days?: number;
        avgHumidity30Days?: number;
        [key: string]: any;
    } | null;
    onClose: () => void;
}

export const PlantDetailsModal = ({ plant, weather, onClose }: PlantDetailsModalProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // UI States
    const [activeTab, setActiveTab] = useState<'overview' | 'simulation'>('overview');

    // Simulation States
    const [numPeople, setNumPeople] = useState(1);
    const [isACMode, setIsACMode] = useState(false);

    // Environment
    const currentTemp = isACMode ? 22 : (weather?.avgTemp30Days || 25);
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // ==========================================
    // SCIENTIFIC LOGIC
    // ==========================================
    const getBasePhotosynthesisRate = useMemo(() => {
        let leafArea = 0.5;
        // Map types safely
        const ox = plant.oxygenLevel || 'moderate';

        if (ox === 'very-high') leafArea = 4.2;
        else if (ox === 'high') leafArea = 2.5;
        else leafArea = 1.2;

        // C3 vs CAM Plant rates approx
        let baseRate = ox === 'very-high' ? 28 : (ox === 'high' ? 22 : 15);

        return baseRate * leafArea;
    }, [plant.oxygenLevel]);

    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15;
        const T_opt = 298.15; // 25C
        if (currentTemp < 10 || currentTemp > 42) return 0.1;
        const sigma = 12;
        return Math.max(0.15, Math.exp(-Math.pow(T - T_opt, 2) / (2 * sigma * sigma)));
    }, [currentTemp]);

    const humidityEffect = useMemo(() => {
        if (currentHumidity < 25) return 0.65;
        if (currentHumidity > 85) return 0.8;
        return 1.0;
    }, [currentHumidity]);

    const PLANT_O2_OUTPUT = useMemo(() => {
        const dayYield = getBasePhotosynthesisRate * temperatureEffect * humidityEffect * 0.8 * 3600 * 12 * 22.4 / 1000000;
        return (dayYield * 1000).toFixed(1);
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect]);

    const plantsNeeded = Math.max(1, Math.ceil((550 * numPeople) / (parseFloat(PLANT_O2_OUTPUT) || 50)));

    // ==========================================
    // COMPONENTS
    // ==========================================

    const renderVisualizer = () => (
        <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', border: '1px dashed rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, zIndex: 2 }}>RECOMMENDATION</div>

            {/* Dynamic Circles */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '8px', maxWidth: '80%', margin: '1rem 0', zIndex: 2 }}>
                {[...Array(Math.min(plantsNeeded, 12))].map((_, i) => (
                    <div key={i} className="pop-in" style={{
                        width: '32px', height: '32px', background: '#10b981', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
                        animationDelay: `${i * 0.05}s`
                    }}>
                        <Leaf size={14} fill="rgba(255,255,255,0.5)" color="white" />
                    </div>
                ))}
                {plantsNeeded > 12 && <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>+{plantsNeeded - 12}</div>}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '1.5rem', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
                    {plantsNeeded}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>Plants Needed</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>For {numPeople} People</div>
            </div>

            {/* Background Effect */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent 70%)' }}></div>
        </div>
    );

    // ==========================================
    // MOBILE VIEW (Restored "Old" Style)
    // ==========================================
    if (isMobile) {
        return (
            <div className={styles.overlay} onClick={onClose} style={{ zIndex: 9999, padding: '10px' }}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{
                    maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px',
                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {/* Header Image */}
                    <div style={{ height: '200px', position: 'relative' }}>
                        <img src={plant.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 100%)' }}></div>
                        <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 8, color: 'white', border: 'none' }}>
                            <X size={20} />
                        </button>
                        <div style={{ position: 'absolute', bottom: 10, left: 20 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>{plant.name}</h2>
                        </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                        {/* Dashboard Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.2rem' }}>
                                    <Wind size={20} /> Room Air Checker
                                </h3>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, border: '1px solid #10b981', padding: '2px 8px', borderRadius: '12px' }}>ACTIVE</div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Occupants</span>
                                    <span style={{ color: '#38bdf8' }}>{numPeople}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" value={numPeople}
                                    onChange={(e) => setNumPeople(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: '#38bdf8' }}
                                />
                            </div>

                            {/* AC Toggle */}
                            <div onClick={() => setIsACMode(!isACMode)} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Thermometer size={18} color={isACMode ? '#38bdf8' : '#94a3b8'} />
                                    <span style={{ color: '#cbd5e1' }}>AC Mode (22°C)</span>
                                </div>
                                <div style={{ width: 40, height: 20, background: isACMode ? '#38bdf8' : '#334155', borderRadius: 20, position: 'relative' }}>
                                    <div style={{ width: 16, height: 16, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: isACMode ? 22 : 2, transition: 'all 0.2s' }} />
                                </div>
                            </div>
                        </div>

                        {/* Visualizer */}
                        {renderVisualizer()}

                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 20 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>OXYGEN</div>
                                <div style={{ fontSize: '1rem', color: 'white', fontWeight: 700 }}>{PLANT_O2_OUTPUT}L</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TEMP</div>
                                <div style={{ fontSize: '1rem', color: 'white', fontWeight: 700 }}>{currentTemp}°C</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>RATING</div>
                                <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700 }}>A+</div>
                            </div>
                        </div>

                        <div style={{ marginTop: 30 }}>
                            <Button onClick={() => { }} size="lg" style={{ width: '100%', borderRadius: '16px' }}>
                                <ShoppingBag size={20} style={{ marginRight: 8 }} /> Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
                <style>{`
                    .pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                    @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
                `}</style>
            </div>
        );
    }

    // ==========================================
    // DESKTOP VIEW (New Split Layout)
    // ==========================================
    return (
        <div className={styles.overlay} onClick={onClose} style={{ zIndex: 9999 }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>

                    {/* LEFT: Image */}
                    <div style={{ flex: '0 0 45%', position: 'relative', background: '#0f172a' }}>
                        <img src={plant.imageUrl} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%, rgba(0,0,0,0.8))' }}></div>
                        <button onClick={onClose} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                            <X size={24} />
                        </button>
                        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', color: 'white' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{plant.name}</h1>
                        </div>
                    </div>

                    {/* RIGHT: Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e293b', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        {/* Header Tabs */}
                        <div style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
                                <button onClick={() => setActiveTab('overview')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'overview' ? '#334155' : 'transparent', color: activeTab === 'overview' ? 'white' : '#64748b', transition: 'all 0.2s' }}>Overview</button>
                                <button onClick={() => setActiveTab('simulation')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'simulation' ? '#334155' : 'transparent', color: activeTab === 'simulation' ? '#38bdf8' : '#64748b', transition: 'all 0.2s' }}>Simulation</button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                            {activeTab === 'overview' ? (
                                <div className="animate-fade-in">
                                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem', fontSize: '1.1rem' }}>{plant.description}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={statCardStyle}><Sun className="text-yellow-400" /> <div><div className="text-xs text-slate-400">Sunlight</div><div className="font-bold">{plant.sunlight}</div></div></div>
                                        <div style={statCardStyle}><Droplet className="text-blue-400" /> <div><div className="text-xs text-slate-400">Water</div><div className="font-bold">Weekly</div></div></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {renderVisualizer()}
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><label>Occupants</label><span>{numPeople}</span></div>
                                        <input type="range" min="1" max="10" value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '2rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.5)' }}>
                            <Button size="lg" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <ShoppingBag size={20} /> Add to Sanctuary
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{` .animate-fade-in { animation: fadeIn 0.4s ease-out; } `}</style>
        </div>
    );
};

const statCardStyle = {
    background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem'
};
