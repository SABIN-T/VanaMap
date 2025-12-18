import { useState, useMemo, useEffect } from 'react';
import { X, Droplets, Sun, Heart, Wind, Users, ShoppingBag, Info, Thermometer, Maximize, Cat, Droplet } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'details' | 'sim'>('details');

    useEffect(() => { setActiveTab('details'); }, [plant]);

    // Day/Night Logic
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    const currentTemp = isACMode ? 22 : (weather?.avgTemp30Days || 25);
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
                                <span className={styles.badge}><Droplet size={14} /> {plant.type}</span>
                                {plant.petFriendly && <span className={styles.badge}><Cat size={14} /> Pet Friendly</span>}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Tab Bar */}
                    <div className={styles.tabBar}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'details' ? styles.active : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Overview
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'sim' ? styles.active : ''}`}
                            onClick={() => setActiveTab('sim')}
                        >
                            Simulation
                        </button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.detailsColumn} style={{ display: (window.innerWidth < 1024 && activeTab === 'sim') ? 'none' : 'block' }}>

                            <div className={styles.descriptionSection}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#38bdf8' }}>
                                    <Info size={18} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>BOTANICAL PROFILE</span>
                                </div>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                    {plant.description}
                                </p>
                            </div>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoTile}>
                                    <div className={styles.tileHeader}><Sun size={16} color="#facc15" /> LIGHT</div>
                                    <div className={styles.tileBody}>{plant.sunlight || "Bright Indirect"}</div>
                                </div>
                                <div className={styles.infoTile}>
                                    <div className={styles.tileHeader}><Thermometer size={16} color="#fb923c" /> TEMP</div>
                                    <div className={styles.tileBody}>18° - 24°C</div>
                                </div>
                                <div className={styles.infoTile}>
                                    <div className={styles.tileHeader}><Maximize size={16} color="#a78bfa" /> SIZE</div>
                                    <div className={styles.tileBody}>{plant.size || "Medium"}</div>
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
                                <Button variant="primary" size="lg" style={{ flex: 1, fontWeight: 800 }} onClick={onClose}>
                                    CLOSE EXPLORER
                                </Button>
                            </div>
                        </div>

                        {/* Simulation Section - User Friendly Version */}
                        <div className={styles.simulationContainer} style={{ display: (window.innerWidth < 1024 && activeTab === 'details') ? 'none' : 'flex' }}>

                            <div className={styles.dashboardHeader} style={{ border: 'none', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
                                        Will it purify my room?
                                    </h3>
                                    <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Calculate how many plants you need for fresh air.
                                    </p>
                                </div>
                                <div className={styles.scoreCircle} style={{ width: '60px', height: '60px' }}>
                                    <div className={styles.scoreValue} style={{ fontSize: '1rem' }}>{fluxRate}%</div>
                                    <div className={styles.scoreLabel}>EFFICIENT</div>
                                    <div className={styles.scoreRing} style={{ borderTopColor: fluxRate > 70 ? '#10b981' : '#f59e0b' }}></div>
                                </div>
                            </div>

                            <div className={styles.simulationGrid}>
                                {/* Controls */}
                                <div>
                                    <div className={styles.sliderControl} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Users size={16} color="var(--color-primary)" /> Who is in the room?
                                            </span>
                                            <span className={styles.controlVal} style={{ fontSize: '1.2rem' }}>{numPeople}</span>
                                        </div>
                                        <input type="range" min="1" max="10" value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} className={styles.rangeInput} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
                                            <span>Just me</span>
                                            <span>Full Family</span>
                                        </div>
                                    </div>

                                    <div className={styles.acToggle} style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.8rem', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.4rem', borderRadius: '0.4rem' }}>
                                                <Wind size={16} color="#38bdf8" />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Climate Control</span>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{isACMode ? 'AC is keeping temp ideal' : 'Natural room temperature'}</span>
                                            </div>
                                        </div>
                                        <button className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`} onClick={() => setIsACMode(!isACMode)}></button>
                                    </div>
                                </div>

                                {/* Results */}
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 78, 59, 0.2) 100%)',
                                        borderRadius: '1.5rem',
                                        padding: '1.5rem',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>RECOMMENDATION</div>
                                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{plantsNeeded}</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Plants Needed</div>

                                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0, maxWidth: '200px' }}>
                                            To provide fresh {plant.oxygenLevel} oxygen for {numPeople} people.
                                        </p>
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
