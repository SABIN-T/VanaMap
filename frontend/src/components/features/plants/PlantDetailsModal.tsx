import { useState } from 'react';
import { X, Droplets, Sun, Activity, Heart, Wind, Shovel } from 'lucide-react';
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
    // Estimate Plant output based on level
    const PLANT_O2_OUTPUT = plant.oxygenLevel === 'very-high' ? 100 : plant.oxygenLevel === 'high' ? 60 : 30;

    const plantsNeeded = Math.ceil((numPeople * HUMAN_O2_NEED_LITERS) / PLANT_O2_OUTPUT);

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
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{plant.name}</h2>
                                <p style={{ color: 'var(--color-primary)', fontSize: '1rem', fontStyle: 'italic', opacity: 0.9 }}>{plant.scientificName}</p>
                            </div>
                            <button onClick={handleFavorite} className={styles.favBtn} style={{ color: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.4)' }}>
                                <Heart fill={isFavorite ? '#ef4444' : 'none'} size={28} />
                            </button>
                        </div>

                        <div className={styles.badges}>
                            <span className={styles.badge}><Wind size={14} /> {plant.oxygenLevel} O₂</span>
                            <span className={styles.badge}><Sun size={14} /> {plant.sunlight} Light</span>
                            <span className={styles.badge}><Droplets size={14} /> {plant.type}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.descriptionSection}>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                            {plant.description}
                        </p>
                    </div>

                    {/* Advanced Simulation Section */}
                    <div className={styles.simulationContainer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem' }}>
                                <Activity size={20} color="var(--color-primary)" /> AI Ecosystem Simulation
                            </h3>
                            {weather && <span className={styles.liveIndicator}>Live Climate Applied</span>}
                        </div>

                        {/* Interactive Slider */}
                        <div className={styles.sliderControl}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Residents Being Simulated</label>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{numPeople} Person{numPeople > 1 ? 's' : ''}</span>
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
                                <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>CO₂ Build-up</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(numPeople > 3 ? 8 : 4)].map((_, i) => (
                                        <div key={i} className="sim-particle-co2" style={{ animationDelay: `${i * 0.3}s` }}>↓ CO₂</div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.plantIconWrapper}>
                                <div className={styles.plantGlow}></div>
                                <Shovel size={40} color="var(--color-primary)" />
                            </div>
                            <div className={styles.simCol}>
                                <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>O₂ Refresh</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="sim-particle-o2" style={{ animationDelay: `${i * 0.4}s` }}>↑ O₂</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.simStats}>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{plantsNeeded}</div>
                                <div className={styles.statLabel}>Plants Needed</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{Math.round(currentTemp)}°C</div>
                                <div className={styles.statLabel}>Avg Temp</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statVal}>{Math.round(currentHumidity)}%</div>
                                <div className={styles.statLabel}>Humidity</div>
                            </div>
                        </div>
                    </div>

                    {/* Fast info tiles */}
                    <div className={styles.infoGrid}>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Droplets size={18} color="#38bdf8" /> Hydration</div>
                            <div className={styles.tileBody}>{getWateringSchedule()}</div>
                        </div>
                        <div className={styles.infoTile}>
                            <div className={styles.tileHeader}><Activity size={18} color="#ef4444" /> Health Scan</div>
                            <div className={styles.tileBody}>
                                {plant.medicinalValues.slice(0, 2).join(", ") || "Beauty only"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.listsGrid}>
                        <div className={styles.listSection}>
                            <h4>Medicinal Uses</h4>
                            <div className={styles.listContainer}>
                                {plant.medicinalValues.map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.listSection}>
                            <h4>Top Advantages</h4>
                            <div className={styles.listContainer}>
                                {plant.advantages.map((v, i) => (
                                    <div key={i} className={styles.listItem}>• {v}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>
                        Exit Simulation
                    </Button>
                </div>
            </div>
        </div>
    );
};
