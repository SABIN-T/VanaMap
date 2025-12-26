import { X, Sun, Wind, Droplet, Leaf, Lightbulb, Fan, AlertTriangle, Sparkles, Stethoscope, BookOpen, GraduationCap, Hourglass } from 'lucide-react';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';
import { useState, useMemo, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

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
    const [targetTemp, setTargetTemp] = useState(22);
    const [lightLevel, setLightLevel] = useState(70);

    // Environment
    const currentTemp = isACMode ? targetTemp : (weather?.avgTemp30Days || 25);
    const currentHumidity = weather?.avgHumidity30Days || 50;


    // ==========================================
    // SCIENTIFIC LOGIC
    // ==========================================
    const getBasePhotosynthesisRate = useMemo(() => {
        let leafArea = 0.5;
        const ox = plant.oxygenLevel || 'moderate';

        if (ox === 'very-high') leafArea = 4.2;
        else if (ox === 'high') leafArea = 2.5;
        else leafArea = 1.2;

        let baseRate = ox === 'very-high' ? 28 : (ox === 'high' ? 22 : 15);
        return baseRate * leafArea;
    }, [plant.oxygenLevel]);

    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15;
        const T_opt = 298.15;
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
        const lightFactor = Math.max(0.1, lightLevel / 100);
        const dayYield = getBasePhotosynthesisRate * temperatureEffect * humidityEffect * lightFactor * 3600 * 12 * 22.4 / 1000000;
        return dayYield.toFixed(1);
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect, lightLevel]);

    const plantsNeeded = Math.max(1, Math.ceil((550 * numPeople) / (parseFloat(PLANT_O2_OUTPUT) || 50)));


    // Stop Propagation Helper
    const stopProp = (e: TouchEvent | MouseEvent) => e.stopPropagation();

    // ==========================================
    // SHARED COMPONENTS
    // ==========================================

    const renderControls = () => (
        <div className={styles.mobileControlsContainer}>
            {/* GPS Warning */}
            <div className={styles.instructionNotice}>
                <AlertTriangle size={16} className="text-yellow-500" style={{ marginTop: 2, flexShrink: 0 }} />
                <div><strong>Pro Tip:</strong> Enable GPS for accurate local climate simulation results.</div>
            </div>

            {/* People */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <span>Occupants</span>
                    <span className={styles.controlValue}>{numPeople}</span>
                </div>
                <input
                    type="range" min="1" max="10" value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                    className={styles.rangeInput}
                />
            </div>

            {/* Light */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lightbulb size={14} /> Light Level</span>
                    <span className={styles.controlValue} style={{ color: '#facc15' }}>{lightLevel}%</span>
                </div>
                <input
                    type="range" min="10" max="100" value={lightLevel}
                    onChange={(e) => setLightLevel(Number(e.target.value))}
                    className={styles.rangeInput}
                    style={{ '--thumb-color': '#facc15' } as any}
                />
            </div>

            {/* AC/Temp */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Fan size={14} /> AC Control</div>
                    <button
                        onClick={() => setIsACMode(!isACMode)}
                        className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`}
                    />
                </div>

                {isACMode ? (
                    <div className="animate-fade-in space-y-2 mt-2">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Target Temp</span>
                            <span className={styles.controlValue}>{targetTemp}°C</span>
                        </div>
                        <input
                            type="range" min="16" max="30" value={targetTemp}
                            onChange={(e) => setTargetTemp(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                        Using local weather: <strong style={{ color: '#94a3b8' }}>{weather?.avgTemp30Days || 25}°C</strong>
                    </div>
                )}
            </div>
        </div>
    );

    const renderVisualizer = () => (
        <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', border: '1px dashed rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, zIndex: 2 }}>RESULTS</div>
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
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>For {numPeople} People (Needs {numPeople * 550}L O₂)</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent 70%)' }}></div>
        </div>
    );

    // ==========================================
    // MOBILE VIEW
    // ==========================================
    if (isMobile) {
        return (
            <div
                className={`${styles.overlay} no-swipe`}
                onClick={onClose}
                onTouchStart={stopProp}
                onTouchMove={stopProp}
                onTouchEnd={stopProp}
                style={{ zIndex: 9999, padding: '10px' }}
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{
                    maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px',
                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                        <img src={plant.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 100%)' }}></div>
                        <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 8, color: 'white', border: 'none' }}>
                            <X size={20} />
                        </button>
                        <div style={{ position: 'absolute', bottom: 10, left: 20 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>{plant.name}</h2>
                            <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: 4 }}>{plant.oxygenLevel} O2</span>
                                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: 4 }}>{plant.sunlight}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className={styles.overviewContainer}>
                            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Overview</h3>
                            <p className={styles.descriptionText}>{plant.description}</p>

                            {/* Mobile Advantages & Medicine */}
                            <div className={styles.infoGrid}>
                                {plant.advantages && plant.advantages.length > 0 && (
                                    <div className={`${styles.infoCard} ${styles.cardGreen}`}>
                                        <div className={`${styles.cardHeader} ${styles.textGreen}`}>
                                            <Sparkles size={16} /> Key Advantages
                                        </div>
                                        <div className={styles.chipsContainer}>
                                            {plant.advantages.map((adv, i) => (
                                                <span key={i} className={`${styles.chip} ${styles.chipGreen}`}>
                                                    {adv}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {plant.medicinalValues && plant.medicinalValues.length > 0 && (
                                    <div className={`${styles.infoCard} ${styles.cardRose}`}>
                                        <div className={`${styles.cardHeader} ${styles.textRose}`}>
                                            <Stethoscope size={16} /> Medicinal Uses
                                        </div>
                                        <div className={styles.chipsContainer}>
                                            {plant.medicinalValues.map((med, i) => (
                                                <span key={i} className={`${styles.chip} ${styles.chipRose}`}>
                                                    {med}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Wind size={20} /> Room Lab
                                </h3>
                                <div className="text-xs text-emerald-400 font-bold border border-emerald-500 rounded px-2">ACTIVE</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {renderControls()}
                                {renderVisualizer()}
                            </div>
                        </div>

                    </div>
                </div>
                <style>{`
                    .pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                    @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
            </div>
        );
    }

    // ==========================================
    // DESKTOP VIEW
    // ==========================================
    return (
        <div
            className={`${styles.overlay} no-swipe`}
            onClick={onClose}
            onTouchStart={stopProp}
            onTouchMove={stopProp}
            onTouchEnd={stopProp}
            style={{ zIndex: 9999 }}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>

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

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e293b', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
                                <button onClick={() => setActiveTab('overview')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'overview' ? '#334155' : 'transparent', color: activeTab === 'overview' ? 'white' : '#64748b', transition: 'all 0.2s' }}>Overview</button>
                                <button onClick={() => setActiveTab('simulation')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'simulation' ? '#334155' : 'transparent', color: activeTab === 'simulation' ? '#38bdf8' : '#64748b', transition: 'all 0.2s' }}>Simulation</button>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                            {activeTab === 'overview' ? (
                                <div className={`${styles.overviewContainer} animate-fade-in`}>
                                    <p className={styles.descriptionText}>{plant.description}</p>

                                    {/* Desktop Advantages & Medicine */}
                                    <div className={styles.infoGrid}>
                                        {plant.advantages && plant.advantages.length > 0 && (
                                            <div className={`${styles.infoCard} ${styles.cardGreen}`}>
                                                <div className={`${styles.cardHeader} ${styles.textGreen}`}>
                                                    <Sparkles size={16} /> Key Advantages
                                                </div>
                                                <div className={styles.chipsContainer}>
                                                    {plant.advantages.map((adv, i) => (
                                                        <span key={i} className={`${styles.chip} ${styles.chipGreen}`}>
                                                            {adv}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {plant.medicinalValues && plant.medicinalValues.length > 0 && (
                                            <div className={`${styles.infoCard} ${styles.cardRose}`}>
                                                <div className={`${styles.cardHeader} ${styles.textRose}`}>
                                                    <Stethoscope size={16} /> Medicinal Uses
                                                </div>
                                                <div className={styles.chipsContainer}>
                                                    {plant.medicinalValues.map((med, i) => (
                                                        <span key={i} className={`${styles.chip} ${styles.chipRose}`}>
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.statsRow}>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Sun className="text-yellow-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Sunlight</span>
                                                <span className={styles.statValue}>{plant.sunlight}</span>
                                            </div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Droplet className="text-blue-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Water</span>
                                                <span className={styles.statValue}>Weekly</span>
                                            </div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Hourglass className="text-pink-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Life Exp.</span>
                                                <span className={styles.statValue}>{plant.lifespan || '3-5 Years'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🎓 Educational Deep Dive */}
                                    <div className={styles.educationalSection}>
                                        <div className={styles.eduHeader}>
                                            <GraduationCap size={20} color="#38bdf8" />
                                            <h3>Botanical Deep Dive</h3>
                                        </div>
                                        <div className={styles.eduGrid}>
                                            <div className={styles.eduCard}>
                                                <BookOpen size={16} />
                                                <h4>Scientific Trivia</h4>
                                                <p>Did you know? The {plant.name} uses CAM photosynthesis to purify air even during the nocturnal cycle.</p>
                                            </div>
                                            <div className={styles.eduCard}>
                                                <Sparkles size={16} />
                                                <h4>Beginner Friendly</h4>
                                                <p>Top tip: Avoid overwatering. This species thrives when the top 2 inches of soil are dry.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                    {renderVisualizer()}
                                    {renderControls()}
                                </div>
                            )}
                        </div>

                        {/* Desktop Footer Removed */}
                    </div>
                </div>
            </div>
            <style>{` .animate-fade-in { animation: fadeIn 0.4s ease-out; } `}</style>
        </div>
    );
};


