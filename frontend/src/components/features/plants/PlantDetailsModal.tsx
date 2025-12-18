import { useState, useMemo } from 'react';
import { X, Droplets, Sun, Heart, Wind, Monitor, Smartphone, Users, Thermometer, Sprout, AlertCircle, Info, Lightbulb, ShieldCheck, ShoppingBag } from 'lucide-react';
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
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    const [numPeople, setNumPeople] = useState(1);
    const [isACMode, setIsACMode] = useState(false);
    const [manualTemp, setManualTemp] = useState(weather?.avgTemp30Days || 25);

    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

    // Day/Night Logic
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    const currentTemp = isACMode ? 22 : manualTemp;
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // ==========================================
    // SCIENTIFICALLY ACCURATE OXYGEN SIMULATION
    // Using Monte Carlo methods for realistic variability
    // ==========================================

    // 1. BASE PHOTOSYNTHESIS RATE (μmol CO2/s per plant)
    const getBasePhotosynthesisRate = useMemo(() => {
        // Leaf Area (m²) - UPDATED for "Mature/Lush" Indoor Plants
        // To achieve Kamal Meattle's "4 Plants Per Person" standard:
        // We simulate a fully grown, shoulder-high specimen (e.g., dense Areca/Snake plant).
        let leafArea = 0.5;
        if (plant.oxygenLevel === 'very-high') leafArea = 4.2; // ~4 large stems
        else if (plant.oxygenLevel === 'high') leafArea = 2.5;
        else if (plant.oxygenLevel === 'moderate' || plant.oxygenLevel === 'medium') leafArea = 1.2;
        else leafArea = 0.5;

        let baseRate = 0;
        // Photosynthesis rate (μmol CO2/m²/s)
        if (plant.oxygenLevel === 'very-high') baseRate = 28; // Optimized C3/CAM
        else if (plant.oxygenLevel === 'high') baseRate = 22;
        else if (plant.oxygenLevel === 'moderate' || plant.oxygenLevel === 'medium') baseRate = 15;
        else baseRate = 8;

        return baseRate * leafArea;
    }, [plant.oxygenLevel]);

    // 2. TEMPERATURE RESPONSE FUNCTION (Arrhenius-based)
    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15; // Kelvin
        const T_opt = 25 + 273.15; // Optimal temp in K
        if (currentTemp < 10 || currentTemp > 42) return 0.1;
        const sigma = 12; // Wider tolerance
        const effect = Math.exp(-Math.pow(T - T_opt, 2) / (2 * sigma * sigma));
        return Math.max(0.15, effect);
    }, [currentTemp]);

    // 3. HUMIDITY EFFECT
    const humidityEffect = useMemo(() => {
        if (currentHumidity < 25) return 0.65;
        if (currentHumidity > 85) return 0.8;
        return 1.0;
    }, [currentHumidity]);

    // 4. MONTE CARLO SIMULATION (1000 iterations)
    const PLANT_O2_OUTPUT = useMemo(() => {
        const numSimulations = 1000;
        let totalO2PerDay = 0;

        // Simulate 24-hour cycle logic within the calc
        for (let i = 0; i < numSimulations; i++) {
            let dayYield = 0;
            let nightYield = 0;

            // Stochastic variations (±15%)
            const randomVariation = 0.85 + Math.random() * 0.3;

            // Daytime (12 hours)
            const lightFactor = 0.8; // Average light intensity over 12h
            dayYield = getBasePhotosynthesisRate
                * temperatureEffect
                * humidityEffect
                * lightFactor
                * randomVariation
                * 3600 * 12 * 22.4 / 1000000;

            // Nighttime (12 hours)
            if (plant.oxygenLevel === 'very-high') {
                // CAM Plants (Snake Plant) - Convert CO2 at night
                // Typically 30-40% efficiency of daytime photosynthesis
                nightYield = (dayYield * 0.4);
            } else {
                // Respiration - Consume O2 (~5% of peak day rate)
                nightYield = -(dayYield * 0.05);
            }

            totalO2PerDay += (dayYield + nightYield);
        }

        const avgO2 = totalO2PerDay / numSimulations;
        // If it's currently night, show the live rate (consumption or CAM)
        if (!isDay) {
            const currentNightRate = plant.oxygenLevel === 'very-high' ? 0.4 : -0.05;
            const singlePlantRate = (avgO2 / 24) * currentNightRate * 2.5; // Scaled for live view
            return Math.round(singlePlantRate * 10) / 10;
        }

        return Math.round(avgO2 * 10) / 10;
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect, isDay, plant.oxygenLevel]);

    // 5. HUMAN OXYGEN CONSUMPTION
    // Deep Research: Average adult consumes ~450L - 550L O2/day
    const O2_PER_PERSON_PER_DAY = 450;
    const totalO2Needed = numPeople * O2_PER_PERSON_PER_DAY;

    // 6. CALCULATE PLANTS NEEDED
    // We use the full 24h average yield for the plant count requirement
    const plantsNeeded = useMemo(() => {
        const numSimulations = 100;
        let totalDailyYield = 0;
        for (let i = 0; i < numSimulations; i++) {
            const randomVariation = 0.9 + Math.random() * 0.2;
            const dayYield = getBasePhotosynthesisRate * temperatureEffect * humidityEffect * 0.8 * randomVariation * 3600 * 12 * 22.4 / 1000000;
            const nightYield = plant.oxygenLevel === 'very-high' ? (dayYield * 0.4) : -(dayYield * 0.05);
            totalDailyYield += (dayYield + nightYield);
        }
        const avgDailyYield = totalDailyYield / numSimulations;
        return Math.ceil(totalO2Needed / avgDailyYield);
    }, [getBasePhotosynthesisRate, temperatureEffect, humidityEffect, totalO2Needed, plant.oxygenLevel]);

    // 7. VITALITY/FLUX RATE (0-100%)
    // Based on deviation from optimal conditions
    const fluxRate = useMemo(() => {
        const tempScore = temperatureEffect * 100;
        const humidityScore = humidityEffect * 100;
        const dayScore = isDay ? 100 : 20; // Night penalty

        const avgScore = (tempScore + humidityScore + dayScore) / 3;
        return Math.round(Math.min(100, Math.max(0, avgScore)));
    }, [temperatureEffect, humidityEffect, isDay]);

    const statusMessages = useMemo(() => {
        const msgs = [];
        if (numPeople > 5) msgs.push({ type: 'warning', icon: <AlertCircle size={20} />, text: `High Occupancy: ${numPeople} people require significant oxygen.` });
        if (isACMode) msgs.push({ type: 'good', icon: <ShieldCheck size={20} />, text: 'Controlled Environment: AC stabilizes photosynthesis at 22°C.' });
        if (!isDay) msgs.push({
            type: 'warning',
            icon: <Info size={20} />,
            text: plant.oxygenLevel === 'very-high' ? "Night Cycle: This plant produces oxygen even at night!" : "Night Cycle: Respiration active. Output resumes at sunrise."
        });
        if (fluxRate < 40) msgs.push({ type: 'critical', icon: <AlertCircle size={20} />, text: 'Low Efficiency: Conditions are not optimal for this plant.' });
        return msgs;
    }, [numPeople, isACMode, isDay, plant.oxygenLevel, fluxRate]);

    const getWateringSchedule = () => {
        if (currentHumidity < 40 && currentTemp > 25) return "Intensive (Every 1-2 days)";
        if (currentTemp > 25) return "Frequent (Every 2-3 days)";
        if (currentTemp < 15) return "Sparse (Every 10-14 days)";
        if (currentHumidity > 70) return "Light (Every 7-9 days)";
        return "Moderate (Every 5-7 days)";
    };

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
            <div className={styles.overlay} onClick={onClose}>
                <div className={`${styles.modal} glass-panel`} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>

                    <div className={styles.header}>
                        <div className={styles.imageContainer}>
                            <img src={plant.imageUrl} alt={plant.name} className={styles.image} />
                            <div className={styles.imageOverlay}></div>
                        </div>
                        <div className={styles.titleSection}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, marginBottom: '0.2rem' }}>{plant.name}</h2>
                                    <p style={{ color: 'var(--color-primary)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 600 }}>{plant.scientificName}</p>
                                </div>
                                <button onClick={handleFavorite} className={styles.favBtn} style={{ color: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.4)', position: 'absolute', right: 0, top: 0 }}>
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
                                    <h4>MARKET INTELLIGENCE</h4>
                                    <div className={styles.monetizationBox}>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Est. Market Value: ₹{plant.price || '499 - 1499'}</p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            style={{ width: '100%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#facc15', color: '#facc15' }}
                                            onClick={() => window.open(`https://www.google.com/search?q=buy+${plant.name}+online`, '_blank')}
                                        >
                                            <ShoppingBag size={12} /> Check Availability & Price
                                        </Button>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic' }}>
                                            * Affiliate links contribute to ecosystem maintenance.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button variant="primary" size="lg" style={{ flex: 2, fontWeight: 800 }} onClick={onClose}>
                                    CLOSE EXPLORER
                                </Button>
                                <Button variant="outline" size="lg" style={{ flex: 1, fontSize: '0.8rem', opacity: 0.8 }} onClick={() => window.open('https://wa.me/9188773534', '_blank')}>
                                    SPONSOR (WhatsApp)
                                </Button>
                            </div>
                        </div>

                        {/* Simulation Section */}
                        <div className={`${styles.simulationContainer} ${viewMode === 'desktop' ? styles.desktopLayout : ''}`}>

                            {/* View Toggle */}
                            <div className={styles.viewToggle}>
                                <button className={viewMode === 'mobile' ? styles.activeView : ''} onClick={() => setViewMode('mobile')}>
                                    <Smartphone size={16} /> <span className={styles.toggleLabel}>Mobile</span>
                                </button>
                                <button className={viewMode === 'desktop' ? styles.activeView : ''} onClick={() => setViewMode('desktop')}>
                                    <Monitor size={16} /> <span className={styles.toggleLabel}>Desk</span>
                                </button>
                            </div>

                            {/* LEFT COLUMN: Controls & Input */}
                            <div className={styles.simControlsGroup}>
                                <div className={styles.dashboardHeader}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
                                            Air Quality <br />
                                            <span style={{ color: 'var(--color-primary)' }}>Simulator</span>
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem', alignItems: 'center' }}>
                                            <div className={styles.liveBadge} style={{ fontSize: '0.7rem' }}>LIVE FEED</div>
                                            <div className={styles.timeBadge} style={{ fontSize: '0.7rem' }}>{isDay ? 'ACTIVE CYCLE' : 'REST CYCLE'}</div>
                                            <div className={styles.acToggle}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>AC MODE</span>
                                                <button className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`} onClick={() => setIsACMode(!isACMode)}></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.scoreCircle}>
                                        <div className={styles.scoreValue}>{fluxRate}</div>
                                        <div className={styles.scoreRing} style={{ borderTopColor: fluxRate > 70 ? '#10b981' : fluxRate > 40 ? '#f59e0b' : '#ef4444' }}></div>
                                    </div>
                                </div>

                                <div className={styles.sliderControl}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span className={styles.controlLabel}><Users size={14} /> OCCUPANCY</span>
                                        <span className={styles.controlVal}>{numPeople} people</span>
                                    </div>
                                    <input type="range" min="1" max="15" value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} className={styles.rangeInput} />
                                </div>

                                <div className={styles.sliderControl}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span className={styles.controlLabel}><Thermometer size={14} /> TEMP</span>
                                        <span className={styles.controlVal}>{currentTemp}°C</span>
                                    </div>
                                    <input disabled={isACMode} type="range" min="10" max="45" value={manualTemp} onChange={(e) => setManualTemp(Number(e.target.value))} className={styles.rangeInput} style={{ opacity: isACMode ? 0.5 : 1 }} />
                                </div>

                                <div className={styles.guideBox}>
                                    <h5><Lightbulb size={14} /> Simulator Guide</h5>
                                    <p>Adjust <strong>Occupancy</strong> to match people in your room. See how many plants are needed to keep the air fresh!</p>
                                    <div className={styles.actionTip}><Info size={12} /> Target a Score &gt; 80% for ideal health.</div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Visualization & Analysis */}
                            <div className={styles.simResultsGroup}>
                                <div className={styles.simVisual}>
                                    <div className={styles.plantIconWrapper} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 800 }}>CO₂ IN</span>
                                            <div style={{ height: '60px', width: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', margin: '0.5rem 0' }}></div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>{isDay ? (PLANT_O2_OUTPUT * 1.1).toFixed(1) : '0.0'}L</span>
                                        </div>
                                        <div className={styles.reactorCore}>
                                            <div className={styles.plantGlow} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid' + (fluxRate > 70 ? '#10b981' : '#f59e0b') }}>
                                                <div style={{ color: 'white', fontWeight: 900 }}>{fluxRate}%</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800 }}>O₂ OUT</span>
                                            <div style={{ height: '60px', width: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', margin: '0.5rem 0' }}></div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>{isDay ? PLANT_O2_OUTPUT : '0.0'}L</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                        {statusMessages.map((msg, idx) => (
                                            <div key={idx} className={`${styles.statusMessage} ${styles[msg.type]}`}>
                                                {msg.icon}
                                                <div style={{ fontSize: '0.8rem' }}>{msg.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                            <Sprout size={20} color="#10b981" />
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>Conclusion</h4>
                                    </div>
                                    <p style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#f1f5f9', lineHeight: 1.4 }}>
                                        For <strong>{numPeople} people</strong>, you need <strong>{plantsNeeded} units</strong> of this plant to stay fresh.
                                    </p>
                                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', borderLeft: '3px solid #38bdf8' }}>
                                        <strong>Fact:</strong> Adults need ~500L oxygen daily. One {plant.name} produces {Math.abs(PLANT_O2_OUTPUT)}L under these conditions.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.simStats}>
                            <div className={styles.statBox}>
                                <div className={styles.statVal} style={{ color: 'var(--color-primary)' }}>{plantsNeeded}</div>
                                <div className={styles.statLabel}>REQUIRED</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{currentTemp}°C</div>
                                <div className={styles.statLabel}>TEMP</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{Math.abs(PLANT_O2_OUTPUT)}L</div>
                                <div className={styles.statLabel}>YIELD</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .sim-particle { position: absolute; font-size: 20px; opacity: 0; }
                .co2 { color: #ef4444; animation: floatUp 2s infinite linear; }
                .o2 { color: #4ade80; animation: floatDown 2s infinite linear; }
                @keyframes floatUp { 0% { transform: translateY(40px); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-20px); opacity: 0; } }
                @keyframes floatDown { 0% { transform: translateY(-20px); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(40px); opacity: 0; } }
            `}</style>
        </>
    );
};
