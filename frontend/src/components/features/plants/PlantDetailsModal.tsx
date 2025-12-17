import { useState, useMemo } from 'react';
import { X, Droplets, Sun, Activity, Heart, Wind, Users, Zap } from 'lucide-react';
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
    const currentTemp = weather?.avgTemp30Days || 25;
    const currentHumidity = weather?.avgHumidity30Days || 50;

    // Interactive Simulation State
    const [numPeople, setNumPeople] = useState(1);

    // Simulation Constants
    const HUMAN_O2_NEED_LITERS = 550; // Daily requirement
    const PLANT_O2_OUTPUT = useMemo(() => {
        const base = plant.oxygenLevel === 'very-high' ? 120 : plant.oxygenLevel === 'high' ? 80 : 40;
        // Apply slight weather boost/penalty
        const tempMultiplier = currentTemp > 20 && currentTemp < 30 ? 1.1 : 0.9;
        return Math.round(base * tempMultiplier);
    }, [plant.oxygenLevel, currentTemp]);

    const plantsNeeded = Math.ceil((numPeople * HUMAN_O2_NEED_LITERS) / PLANT_O2_OUTPUT);
    const fluxRate = Math.min(100, Math.round((PLANT_O2_OUTPUT / 550) * 100));

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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: 800 }}>
                                <Activity size={20} color="var(--color-primary)" /> AI ECOSYSTEM ENGINE
                            </h3>
                            {weather && <span className={styles.liveIndicator}>Climate Synced</span>}
                        </div>

                        {/* Interactive Slider */}
                        <div className={styles.sliderControl}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} color="var(--color-text-muted)" />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>OCCUPANCY LOAD</span>
                                </div>
                                <span style={{ color: 'var(--color-primary)', fontWeight: '900', fontSize: '1.1rem' }}>{numPeople} User{numPeople > 1 ? 's' : ''}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={numPeople}
                                onChange={(e) => setNumPeople(Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.simVisual}>
                            <div className={styles.simCol}>
                                <span style={{ color: '#ef4444', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}>↑ CO₂ FLUX</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(Math.min(8, numPeople * 2))].map((_, i) => (
                                        <div key={i} className="sim-particle co2" style={{ animationDelay: `${i * 0.4}s`, left: `${Math.random() * 80}%` }}>.</div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.plantIconWrapper}>
                                <div className={styles.plantGlow}></div>
                                <div className={styles.fluxRing}>
                                    <Zap size={32} color="var(--color-primary)" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-20px', fontSize: '0.6rem', color: 'var(--color-primary)', fontWeight: 800 }}>{fluxRate}% EFFICIENCY</div>
                            </div>
                            <div className={styles.simCol}>
                                <span style={{ color: '#4ade80', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}>↓ O₂ OUTPUT</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="sim-particle o2" style={{ animationDelay: `${i * 0.5}s`, right: `${Math.random() * 80}%` }}>.</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.simStats}>
                            <div className={styles.statBox}>
                                <div className={styles.statVal} style={{ color: 'var(--color-primary)' }}>{plantsNeeded}</div>
                                <div className={styles.statLabel}>Target Count</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{Math.round(currentTemp)}°C</div>
                                <div className={styles.statLabel}>Ambient Temp</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{Math.round(currentHumidity)}%</div>
                                <div className={styles.statLabel}>Rel. Humidity</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Droplets size={16} color="#38bdf8" /> HYDRATION PLAN</div>
                            <div className={styles.tileBody}>{getWateringSchedule()}</div>
                        </div>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Activity size={16} color="#ef4444" /> VITALITY CHECK</div>
                            <div className={styles.tileBody}>
                                {plant.medicinalValues[0] || "Oxygen Focus"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.listsGrid}>
                        <div className={styles.listSection}>
                            <h4>MEDICINAL PROFILE</h4>
                            <div className={styles.listContainer}>
                                {plant.medicinalValues.slice(0, 3).map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.listSection}>
                            <h4>SYSTEM BENEFITS</h4>
                            <div className={styles.listContainer}>
                                {plant.advantages.slice(0, 3).map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem', fontWeight: 800 }} onClick={onClose}>
                        DISMISS SIMULATION
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
