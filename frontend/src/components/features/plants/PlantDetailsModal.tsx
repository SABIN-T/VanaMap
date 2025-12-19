import { useState, useMemo, useEffect } from 'react';
import { X, Sun, Heart, Wind, ShoppingBag, Thermometer, Maximize, Cat, Droplet, ArrowRight, Activity, Percent, BarChart3, Info } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    const { user, toggleFavorite } = useAuth(); // Assuming favorites removed for simplification or use user logic
    const navigate = useNavigate();

    // UI States
    const [activeTab, setActiveTab] = useState<'overview' | 'simulation'>('overview');
    const [isAnimating, setIsAnimating] = useState(false);

    // Simulation States
    const [numPeople, setNumPeople] = useState(1);
    const [isACMode, setIsACMode] = useState(false);

    // Environment
    const currentTemp = isACMode ? 22 : (weather?.avgTemp30Days || 25);
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // ==========================================
    // SCIENTIFIC LOGIC (Preserved & Optimized)
    // ==========================================

    // 1. BASE RATE
    const getBasePhotosynthesisRate = useMemo(() => {
        let leafArea = 0.5;
        if (plant.oxygenLevel === 'very-high') leafArea = 4.2;
        else if (plant.oxygenLevel === 'high') leafArea = 2.5;
        else if (plant.oxygenLevel === 'moderate' || plant.oxygenLevel === 'medium') leafArea = 1.2;

        let baseRate = plant.oxygenLevel === 'very-high' ? 28 :
            plant.oxygenLevel === 'high' ? 22 :
                plant.oxygenLevel === 'moderate' ? 15 : 8;

        return baseRate * leafArea;
    }, [plant.oxygenLevel]);

    // 2. TEMP EFFECT
    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15;
        const T_opt = 298.15; // 25C
        if (currentTemp < 10 || currentTemp > 42) return 0.1;
        const sigma = 12;
        return Math.max(0.15, Math.exp(-Math.pow(T - T_opt, 2) / (2 * sigma * sigma)));
    }, [currentTemp]);

    // 3. HUMIDITY EFFECT
    const humidityEffect = useMemo(() => {
        if (currentHumidity < 25) return 0.65;
        if (currentHumidity > 85) return 0.8;
        return 1.0;
    }, [currentHumidity]);

    // 4. OUTPUT CALCULATION
    const PLANT_O2_OUTPUT = useMemo(() => {
        // Simplified calc for UI speed
        const dayYield = getBasePhotosynthesisRate * temperatureEffect * humidityEffect * 0.8 * 3600 * 12 * 22.4 / 1000000;
        return (dayYield * 1000).toFixed(1); // Liters
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect]);

    const plantsNeeded = Math.max(1, Math.ceil((550 * numPeople) / (parseFloat(PLANT_O2_OUTPUT) || 50)));

    // ==========================================
    // RENDER HELPERS
    // ==========================================
    const renderOverview = () => (
        <div className="animate-fade-in" style={{ padding: '0 0.5rem' }}>
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Droplet size={18} className="text-blue-400" />
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Water</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>{plant.waterNeeds || 'Weekly'}</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Sun size={18} className="text-yellow-400" />
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Light</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>{plant.lightReq || 'Indirect'}</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Thermometer size={18} className="text-red-400" />
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Temp</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>18-28°C</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Wind size={18} className="text-emerald-400" />
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Air</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>Purifying</div>
                </div>
            </div>

            {/* Description */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>Botanist's Note</h3>
            <p style={{ lineHeight: '1.6', color: '#cbd5e1', marginBottom: '2rem', fontSize: '0.95rem' }}>
                {plant.description || `The ${plant.name} is a resilient selection for any indoor collection, known for its ${plant.oxygenLevel} oxygen production capabilities.`}
            </p>

            {/* AI Insight */}
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Activity size={16} className="text-sky-400" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px' }}>DR. AI ANALYSIS</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#bae6fd', margin: 0 }}>
                    This specimen is operating at <b>{Math.round(temperatureEffect * 100)}% efficiency</b> in your current weather.
                    {temperatureEffect < 0.5 ? ' Consider move indoors.' : ' Optimal growth conditions detected.'}
                </p>
            </div>
        </div>
    );

    const renderSimulation = () => (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Visualizer Header */}
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '16px', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>OXYGEN OUTPUT</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{PLANT_O2_OUTPUT}<span style={{ fontSize: '1rem', fontWeight: 500 }}> L/day</span></div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wind size={16} /> Supports {(parseFloat(PLANT_O2_OUTPUT) / 550).toFixed(2)} humans
                    </div>
                </div>
                <Wind style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.2 }} size={120} />
            </div>

            {/* Controls */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Occupants</label>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>{numPeople} People</span>
                </div>
                <input
                    type="range" min="1" max="10" value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#38bdf8', height: '6px', background: '#334155', borderRadius: '4px' }}
                />

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Recommendation</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
                        Buy {plantsNeeded} Plants
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>to purify this room fully</p>
                </div>
            </div>

            {/* AC Toggle */}
            <div onClick={() => setIsACMode(!isACMode)} style={{ cursor: 'pointer', background: isACMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)', border: isACMode ? '1px solid #38bdf8' : '1px solid transparent', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '8px', background: isACMode ? '#0ea5e9' : '#334155', borderRadius: '50%' }}>
                        <Thermometer size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: isACMode ? 'white' : '#94a3b8' }}>AC Mode</div>
                        <div style={{ fontSize: '0.75rem', color: isACMode ? '#bae6fd' : '#64748b' }}>Simulate 22°C indoor climate</div>
                    </div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isACMode ? '#38bdf8' : '#334155' }}></div>
            </div>
        </div>
    );

    return (
        <div className={styles.overlay} onClick={onClose} style={{ zIndex: 9999 }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ overflow: 'hidden', padding: 0 }}>
                {/* Desktop Split Layout */}
                <div style={{ display: 'flex', height: '100%', flexDirection: window.innerWidth > 1024 ? 'row' : 'column' }}>

                    {/* LEFT: Image */}
                    <div style={{
                        flex: window.innerWidth > 1024 ? '0 0 45%' : '0 0 300px',
                        position: 'relative',
                        background: '#0f172a'
                    }}>
                        <img
                            src={plant.image}
                            alt={plant.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%, rgba(0,0,0,0.8))' }}></div>

                        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                            <X size={20} />
                        </button>

                        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                            <div style={{ background: '#10b981', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Verified Stock
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{plant.name}</h1>
                        </div>
                    </div>

                    {/* RIGHT: Content */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#1e293b',
                        borderLeft: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        {/* Header Tabs */}
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    style={{
                                        padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                                        background: activeTab === 'overview' ? '#334155' : 'transparent',
                                        color: activeTab === 'overview' ? 'white' : '#64748b',
                                        transition: 'all 0.2s'
                                    }}
                                >Overview</button>
                                <button
                                    onClick={() => setActiveTab('simulation')}
                                    style={{
                                        padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                                        background: activeTab === 'simulation' ? '#334155' : 'transparent',
                                        color: activeTab === 'simulation' ? '#38bdf8' : '#64748b',
                                        transition: 'all 0.2s'
                                    }}
                                >Simulation</button>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>₹{plant.price}</div>
                        </div>

                        {/* Scrollable Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            {activeTab === 'overview' ? renderOverview() : renderSimulation()}
                        </div>

                        {/* Footer Actions */}
                        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.5)' }}>
                            <Button size="lg" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <ShoppingBag size={20} /> Add to Sanctuary
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Inline Styles Helpers */}
            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #334155; borderRadius: 3px; }
            `}</style>
        </div>
    );
};

const statCardStyle = {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid rgba(255,255,255,0.05)'
};
