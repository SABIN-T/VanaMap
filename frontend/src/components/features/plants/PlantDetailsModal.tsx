import { useState, useMemo } from 'react';
import { X, Droplets, Sun, Activity, Heart, Wind, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    const isDay = hour >= 6 && hour < 18;

    const currentTemp = isACMode ? 22 : manualTemp;
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // ==========================================
    // SCIENTIFICALLY ACCURATE OXYGEN SIMULATION
    // Using Monte Carlo methods for realistic variability
    // ==========================================

    // 1. BASE PHOTOSYNTHESIS RATE (μmol CO2/m²/s)
    // Based on research: typical houseplant leaf area = 0.1-0.5 m²
    const getBasePhotosynthesisRate = useMemo(() => {
        const leafArea = 0.3; // m² (average houseplant)
        let baseRate = 0;

        // Photosynthesis rate varies by plant oxygen level
        // Research: C3 plants = 10-30 μmol CO2/m²/s
        if (plant.oxygenLevel === 'very-high') baseRate = 25; // Snake plant, Areca palm
        else if (plant.oxygenLevel === 'high') baseRate = 20; // Peace lily, Spider plant
        else if (plant.oxygenLevel === 'moderate' || plant.oxygenLevel === 'medium') baseRate = 15;
        else baseRate = 10; // Low light plants

        return baseRate * leafArea; // μmol CO2/s per plant
    }, [plant.oxygenLevel]);

    // 2. TEMPERATURE RESPONSE FUNCTION (Arrhenius-based)
    // Optimal photosynthesis: 20-30°C
    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15; // Kelvin
        const T_opt = 25 + 273.15; // Optimal temp in K

        if (currentTemp < 10 || currentTemp > 40) return 0.1; // Extreme stress

        // Gaussian-like response curve
        const sigma = 10; // Temperature tolerance
        const effect = Math.exp(-Math.pow(T - T_opt, 2) / (2 * sigma * sigma));

        return Math.max(0.1, effect);
    }, [currentTemp]);

    // 3. HUMIDITY EFFECT
    // Stomatal conductance increases with humidity (up to ~70%)
    const humidityEffect = useMemo(() => {
        if (currentHumidity < 30) return 0.7; // Stomata partially close
        if (currentHumidity > 80) return 0.85; // Risk of disease, slight reduction
        return 1.0; // Optimal range 30-80%
    }, [currentHumidity]);

    // 4. MONTE CARLO SIMULATION (1000 iterations)
    // Accounts for natural variability in photosynthesis
    const PLANT_O2_OUTPUT = useMemo(() => {
        if (!isDay) {
            // Night respiration: plants consume O2
            // Research: ~10% of daytime photosynthesis rate
            const respirationRate = getBasePhotosynthesisRate * 0.1;
            const respirationO2 = (respirationRate * 3600 * 12) / 1000; // 12 hours night, convert to L
            return -Math.round(respirationO2 * 10) / 10;
        }

        const numSimulations = 1000;
        let totalO2 = 0;

        for (let i = 0; i < numSimulations; i++) {
            // Stochastic variations (±15% random variation)
            const randomVariation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15

            // Light variation throughout the day (sine wave)
            const hourAngle = ((hour - 6) / 12) * Math.PI; // 0 to π during day
            const lightIntensity = Math.sin(hourAngle); // 0 to 1 to 0

            // Cloud cover simulation (random)
            const cloudFactor = 0.7 + Math.random() * 0.3; // 0.7 to 1.0

            // Combined photosynthesis rate
            let netRate = getBasePhotosynthesisRate
                * temperatureEffect
                * humidityEffect
                * lightIntensity
                * cloudFactor
                * randomVariation;

            // Convert μmol CO2/s to L O2/day
            // 1 mol CO2 → 1 mol O2 (photosynthesis)
            // 1 mol gas at STP = 22.4 L
            // Daytime = 12 hours
            const o2Liters = (netRate * 3600 * 12 * 22.4) / 1000000; // Convert to L/day

            totalO2 += o2Liters;
        }

        const avgO2 = totalO2 / numSimulations;
        return Math.round(avgO2 * 10) / 10;
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect, isDay, hour]);

    // 5. HUMAN OXYGEN CONSUMPTION
    // Research: Adult at rest = 250 mL O2/min = 360 L/day
    // Active/office work = 400-500 mL/min = 550-720 L/day
    const O2_PER_PERSON_PER_DAY = 550; // Conservative estimate for office/home
    const totalO2Needed = numPeople * O2_PER_PERSON_PER_DAY;

    // 6. CALCULATE PLANTS NEEDED
    const plantsNeeded = PLANT_O2_OUTPUT > 0
        ? Math.ceil(totalO2Needed / PLANT_O2_OUTPUT)
        : 'N/A';

    // 7. VITALITY/FLUX RATE (0-100%)
    // Based on deviation from optimal conditions
    const fluxRate = useMemo(() => {
        const tempScore = temperatureEffect * 100;
        const humidityScore = humidityEffect * 100;
        const dayScore = isDay ? 100 : 20; // Night penalty

        const avgScore = (tempScore + humidityScore + dayScore) / 3;
        return Math.round(Math.min(100, Math.max(0, avgScore)));
    }, [temperatureEffect, humidityEffect, isDay]);

    const getWateringSchedule = () => {
        if (currentHumidity < 40 && currentTemp > 25) return "Intensive (Every 1-2 days)";
        if (currentTemp > 25) return "Frequent (Every 2-3 days)";
        if (currentTemp < 15) return "Sparse (Every 10-14 days)";
        if (currentHumidity > 70) return "Light (Every 7-9 days)";
        return "Moderate (Every 5-7 days)";
    };

    // ... (rest of imports)

    const isFavorite = user?.favorites?.includes(plant.id);

    const handleFavorite = () => {
        if (!user) {
            toast.custom((t) => (
                <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                    border: '2px solid #10b981',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)',
                    maxWidth: '400px',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                            <Heart size={24} color="#fff" fill="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                Save to Favorites?
                            </h3>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
                                Login to save <strong>{plant.name}</strong> and access your favorites across devices
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                navigate('/auth');
                            }}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Login Now
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'transparent',
                                color: '#64748b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), {
                duration: 6000,
                position: 'top-center'
            });
            return;
        }
        toggleFavorite(plant.id);
    };

    return (
        <>
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
                        <div className={styles.detailsColumn}>
                            <div className={styles.descriptionSection}>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                    {plant.description}
                                </p>
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

                        {/* Simulation Section - Compact & Scrollable */}
                        <div className={styles.simulationContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                    <Activity size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                                    SMART SIMULATOR
                                </h3>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <div style={{
                                        padding: '0.2rem 0.6rem', borderRadius: '99px',
                                        background: isDay ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                        color: isDay ? '#fbbf24' : '#60a5fa',
                                        fontWeight: 800, fontSize: '0.6rem'
                                    }}>
                                        {isDay ? <Sun size={10} style={{ display: 'inline', marginRight: '0.2rem' }} /> : '☾'} {isDay ? 'DAY' : 'NIGHT'}
                                    </div>
                                    <div className={styles.acToggle}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>AC</span>
                                        <button className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`} onClick={() => setIsACMode(!isACMode)}></button>
                                    </div>
                                </div>
                            </div>

                            {PLANT_O2_OUTPUT < 0 && (
                                <div className={styles.instructionNotice} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem' }}>
                                    <AlertTriangle size={12} />
                                    <span>Night mode: Plants consume O₂. Ensure ventilation!</span>
                                </div>
                            )}

                            <div className={styles.sliderControl} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span className={styles.controlLabel} style={{ fontSize: '0.7rem' }}>PEOPLE IN ROOM</span>
                                    <span className={styles.controlVal} style={{ fontSize: '0.8rem' }}>{numPeople}</span>
                                </div>
                                <input type="range" min="1" max="12" value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} className={styles.rangeInput} />
                            </div>

                            {!isACMode && (
                                <>
                                    <div className={styles.instructionNotice} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.7rem', marginBottom: '1rem' }}>
                                        <Sun size={12} />
                                        <span>Adjust temp for your environment</span>
                                    </div>
                                    <div className={styles.sliderControl} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span className={styles.controlLabel} style={{ fontSize: '0.7rem' }}>TEMPERATURE</span>
                                            <span className={styles.controlVal} style={{ fontSize: '0.8rem' }}>{manualTemp}°C</span>
                                        </div>
                                        <input type="range" min="15" max="40" value={manualTemp} onChange={(e) => setManualTemp(Number(e.target.value))} className={styles.rangeInput} style={{ '--accent': '#38bdf8' } as any} />
                                    </div>
                                </>
                            )}

                            <div className={styles.simVisual} style={{ marginBottom: '1rem' }}>
                                <div className={styles.simCol}>
                                    <span style={{ color: '#ef4444', fontSize: '0.55rem', fontWeight: '900' }}>CO₂</span>
                                    <div className={styles.particleContainer}>
                                        {[...Array(Math.min(8, numPeople * 2))].map((_, i) => (
                                            <div key={i} className="sim-particle co2" style={{ animationDelay: `${i * 0.4}s`, left: `${Math.random() * 80}%` }}>.</div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.plantIconWrapper}>
                                    <div className={styles.plantGlow} style={{ boxShadow: PLANT_O2_OUTPUT < 0 ? '0 0 20px rgba(239, 68, 68, 0.2)' : '' }}></div>
                                    <div className={styles.fluxRing} style={{ borderColor: PLANT_O2_OUTPUT < 0 ? '#ef4444' : 'var(--color-primary)' }}>
                                        <Zap size={24} color={PLANT_O2_OUTPUT < 0 ? "#ef4444" : "var(--color-primary)"} />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '-18px', fontSize: '0.55rem', color: PLANT_O2_OUTPUT < 0 ? '#ef4444' : 'var(--color-primary)', fontWeight: 800 }}>
                                        {fluxRate}%
                                    </div>
                                </div>
                                <div className={styles.simCol}>
                                    <span style={{ color: PLANT_O2_OUTPUT < 0 ? '#ef4444' : '#4ade80', fontSize: '0.55rem', fontWeight: '900' }}>
                                        O₂
                                    </span>
                                    <div className={styles.particleContainer}>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`sim-particle ${PLANT_O2_OUTPUT < 0 ? 'co2' : 'o2'}`} style={{ animationDelay: `${i * 0.5}s`, right: `${Math.random() * 80}%` }}>.</div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.simStats}>
                                <div className={styles.statBox}>
                                    <div className={styles.statVal} style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{plantsNeeded}</div>
                                    <div className={styles.statLabel} style={{ fontSize: '0.65rem' }}>Plants</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statVal} style={{ fontSize: '1.1rem' }}>{currentTemp}°C</div>
                                    <div className={styles.statLabel} style={{ fontSize: '0.65rem' }}>Temp</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statVal} style={{ fontSize: '1.1rem' }}>{PLANT_O2_OUTPUT}L</div>
                                    <div className={styles.statLabel} style={{ fontSize: '0.65rem' }}>O₂/Plant</div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </>
    );
};
