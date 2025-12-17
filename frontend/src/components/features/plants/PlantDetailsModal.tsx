import { useState, useMemo } from 'react';
import { X, Droplets, Sun, Activity, Heart, Wind, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PlantDetailsModalProps {
    plant: Plant;
    weather: any;
    onClose: () => void;
}

export const PlantDetailsModal = ({ plant, weather, onClose }: PlantDetailsModalProps) => {
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();
    const [numPeople, setNumPeople] = useState(1);
    const [isACMode, setIsACMode] = useState(false);
    const [manualTemp, setManualTemp] = useState(weather?.avgTemp30Days || 25);

    // Day/Night Logic
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18; // 6 AM to 6 PM

    const currentTemp = isACMode ? 22 : manualTemp;
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // Simulation logic (Accurate Daily Oxygen)
    const HUMAN_O2_NEED_LITERS = 550; // Daily requirement for 1 human
    const PLANT_O2_OUTPUT = useMemo(() => {
        // Base daily output per plant in Liters (simplified but grounded in botany)
        const base = plant.oxygenLevel === 'very-high' ? 60 : plant.oxygenLevel === 'high' ? 40 : 20;

        // Temperature efficiency curve (Plants breathe best between 18-28°C)
        let efficiency = 1.0;
        if (currentTemp >= 20 && currentTemp <= 26) efficiency = 1.25; // Peak efficiency (Like AC)
        else if (currentTemp > 26 && currentTemp < 32) efficiency = 1.1;
        else if (currentTemp >= 32 || currentTemp <= 15) efficiency = 0.7; // Stress zone

        let output = Math.round(base * efficiency);

        // Night-time Respiration Logic
        if (!isDay) {
            if (plant.isNocturnal) {
                // CAM Plants work best at night
                output = Math.round(output * 1.1);
            } else {
                // Regular plants consume O2 at night (Respiration)
                return -5; // Net loss
            }
        }

        return output;
    }, [plant.oxygenLevel, currentTemp, isDay, plant.isNocturnal]);

    const plantsNeeded = PLANT_O2_OUTPUT > 0 ? Math.ceil((numPeople * HUMAN_O2_NEED_LITERS) / PLANT_O2_OUTPUT) : 'N/A';
    const fluxRate = Math.min(100, Math.round((Math.abs(PLANT_O2_OUTPUT) / 60) * 100));

    // ... (existing getWateringSchedule) ...
    const getWateringSchedule = () => {
        if (currentHumidity < 40 && currentTemp > 25) return "Intensive (Every 1-2 days)";
        if (currentTemp > 25) return "Frequent (Every 2-3 days)";
        if (currentTemp < 15) return "Sparse (Every 10-14 days)";
        if (currentHumidity > 70) return "Light (Every 7-9 days)";
        return "Moderate (Every 5-7 days)";
    };
    // ...

    // ... (rest of imports)

    // ... return JSX modifications
    // In Simulation Container:
    /*
        Show Time Mode
        Show Warning if PLANT_O2_OUTPUT < 0
    */

    const isFavorite = user?.favorites?.includes(plant.id);

    const handleFavorite = () => {
        if (!user) {
            if (confirm("Login to save favorites?")) navigate('/auth');
            return;
        }
        toggleFavorite(plant.id);
    };

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} glass-panel`}>
                <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>

                <div className={styles.header}>
                    <div className={styles.imageContainer}>
                        <img src={plant.imageUrl} alt={plant.name} className={styles.image} />
                        <div className={styles.imageOverlay}></div>
                    </div>
                    <div className={styles.titleSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, marginBottom: '0.2rem' }}>{plant.name}</h2>
                                <p style={{ color: 'var(--color-primary)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 600 }}>{plant.scientificName}</p>
                            </div>
                            <button onClick={handleFavorite} className={styles.favBtn} style={{ color: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>
                                <Heart fill={isFavorite ? '#ef4444' : 'none'} size={28} />
                            </button>
                        </div>

                        <div className={styles.badges}>
                            <span className={styles.badge}><Wind size={14} /> {plant.oxygenLevel} O₂</span>
                            <span className={styles.badge}><Sun size={14} /> {plant.sunlight}</span>
                            <span className={styles.badge}><Droplets size={14} /> {plant.type}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.descriptionSection}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            {plant.description}
                        </p>
                    </div>

                    {/* Advanced Simulation Section */}
                    <div className={styles.simulationContainer}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            {/* Plant Image - Left Side */}
                            <img
                                src={plant.imageUrl}
                                alt={plant.name}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    border: '2px solid var(--color-primary)',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                    flexShrink: 0
                                }}
                            />

                            {/* Controls & Data - Right Side */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', flexDirection: 'column', fontSize: '1rem', fontWeight: 800 }}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Data</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Activity size={16} color="var(--color-primary)" /> SMART SIMULATOR
                                        </span>
                                    </h3>

                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '99px',
                                            background: isDay ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                            color: isDay ? '#fbbf24' : '#60a5fa',
                                            fontWeight: 800, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem'
                                        }}>
                                            {isDay ? <Sun size={12} /> : <span style={{ fontSize: '1.1em' }}>☾</span>}
                                            {isDay ? 'DAY' : 'NIGHT'}
                                        </div>

                                        <div className={styles.acToggle}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isACMode ? 'var(--color-primary)' : '#666' }}>AC</span>
                                            <button className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`} onClick={() => setIsACMode(!isACMode)}></button>
                                        </div>
                                    </div>
                                </div>

                                {/* CO2 Warning */}
                                {PLANT_O2_OUTPUT < 0 && (
                                    <div className={styles.instructionNotice} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                        <AlertTriangle size={14} />
                                        <span><strong>Night Respiration:</strong> This plant consumes O₂ at night. Ensure room ventilation or pair with snake plants!</span>
                                    </div>
                                )}

                                <div className={styles.sliderControl}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className={styles.controlLabel}>PEOPLE IN ROOM</span>
                                        <span className={styles.controlVal}>{numPeople}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="12"
                                        value={numPeople}
                                        onChange={(e) => setNumPeople(Number(e.target.value))}
                                        className={styles.rangeInput}
                                    />
                                </div>

                                {/* Temperature Notice */}
                                {!isACMode && (
                                    <div className={styles.instructionNotice} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                        <Sun size={14} />
                                        <span>Adjust temperature to match your office or home environment. Plants breathe best in cooler air!</span>
                                    </div>
                                )}

                                {!isACMode && (
                                    <div className={styles.sliderControl}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span className={styles.controlLabel}>ROOM TEMPERATURE</span>
                                            <span className={styles.controlVal}>{manualTemp}°C</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="15" max="40"
                                            value={manualTemp}
                                            onChange={(e) => setManualTemp(Number(e.target.value))}
                                            className={styles.rangeInput}
                                            style={{ '--accent': '#38bdf8' } as any}
                                        />
                                    </div>
                                )}

                                <div className={styles.simVisual}>
                                    <div className={styles.simCol}>
                                        <span style={{ color: '#ef4444', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}>CO₂ REMOVAL</span>
                                        <div className={styles.particleContainer}>
                                            {[...Array(Math.min(10, numPeople * 2))].map((_, i) => (
                                                <div key={i} className="sim-particle co2" style={{ animationDelay: `${i * 0.4}s`, left: `${Math.random() * 80}%` }}>.</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.plantIconWrapper}>
                                        <div className={styles.plantGlow} style={{ boxShadow: PLANT_O2_OUTPUT < 0 ? '0 0 30px rgba(239, 68, 68, 0.2)' : '' }}></div>
                                        <div className={styles.fluxRing} style={{ borderColor: PLANT_O2_OUTPUT < 0 ? '#ef4444' : 'var(--color-primary)' }}>
                                            <Zap size={32} color={PLANT_O2_OUTPUT < 0 ? "#ef4444" : "var(--color-primary)"} />
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '-20px', fontSize: '0.6rem', color: PLANT_O2_OUTPUT < 0 ? '#ef4444' : 'var(--color-primary)', fontWeight: 800 }}>VITALITY: {fluxRate}%</div>
                                    </div>
                                    <div className={styles.simCol}>
                                        <span style={{ color: PLANT_O2_OUTPUT < 0 ? '#ef4444' : '#4ade80', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}>
                                            {PLANT_O2_OUTPUT < 0 ? 'O₂ CONSUMPTION' : 'O₂ PRODUCTION'}
                                        </span>
                                        <div className={styles.particleContainer}>
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className={`sim-particle ${PLANT_O2_OUTPUT < 0 ? 'co2' : 'o2'}`} style={{ animationDelay: `${i * 0.5}s`, right: `${Math.random() * 80}%` }}>.</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.simStats}>
                                    <div className={styles.statBox}>
                                        <div className={styles.statVal} style={{ color: 'var(--color-primary)' }}>{plantsNeeded}</div>
                                        <div className={styles.statLabel}>Plants Needed</div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <div className={styles.statVal}>{currentTemp}°C</div>
                                        <div className={styles.statLabel}>Air Temp</div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <div className={styles.statVal}>{PLANT_O2_OUTPUT}L</div>
                                        <div className={styles.statLabel}>O₂ Per Plant</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Droplets size={16} color="#38bdf8" /> WATERING GUIDE</div>
                            <div className={styles.tileBody}>{getWateringSchedule()}</div>
                        </div>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Heart size={16} color="#ef4444" /> HEALTH FACT</div>
                            <div className={styles.tileBody}>
                                {plant.medicinalValues[0] || "Boosts indoor air quality"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.listsGrid}>
                        <div className={styles.listSection}>
                            <h4>MEDICINAL USES</h4>
                            <div className={styles.listContainer}>
                                {plant.medicinalValues.slice(0, 3).map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.listSection}>
                            <h4>KEY ADVANTAGES</h4>
                            <div className={styles.listContainer}>
                                {plant.advantages.slice(0, 3).map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem', fontWeight: 800 }} onClick={onClose}>
                        CLOSE EXPLORER
                    </Button>
                </div>
            </div>

            <style>{`
                .sim-particle {
                    position: absolute;
                    font-size: 20px;
                    opacity: 0;
                }
                .co2 {
                    color: #ef4444;
                    animation: floatUp 2s infinite linear;
                }
                .o2 {
                    color: #4ade80;
                    animation: floatDown 2s infinite linear;
                }
                @keyframes floatUp {
                    0% { transform: translateY(40px); opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-20px); opacity: 0; }
                }
                @keyframes floatDown {
                    0% { transform: translateY(-20px); opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(40px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
