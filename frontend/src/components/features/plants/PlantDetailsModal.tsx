import { useState } from 'react';
import { X, Droplets, Sun, Activity, Info, Heart } from 'lucide-react';
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
    const currentTemp = weather?.avgTemp30Days || 25; // Default to 25 if no sim

    // Interactive Simulation State
    const [numPeople, setNumPeople] = useState(1);

    // Simulation Constants
    const HUMAN_O2_NEED_LITERS = 550; // Daily requirement
    // Estimate Plant output based on level
    const PLANT_O2_OUTPUT = plant.oxygenLevel === 'very-high' ? 100 : plant.oxygenLevel === 'high' ? 60 : 30;

    const plantsNeeded = Math.ceil((numPeople * HUMAN_O2_NEED_LITERS) / PLANT_O2_OUTPUT);

    const getWateringSchedule = () => {
        if (currentTemp > 25) return "Frequent (Every 2-3 days)";
        if (currentTemp < 15) return "Sparse (Every 10-14 days)";
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
                    <img src={plant.imageUrl} alt={plant.name} className={styles.image} />
                    <div className={styles.titleSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h2>{plant.name}</h2>
                                <p className="text-gradient">{plant.scientificName}</p>
                            </div>
                            <button onClick={handleFavorite} style={{ color: isFavorite ? '#ef4444' : '#666', transition: '0.2s' }}>
                                <Heart fill={isFavorite ? '#ef4444' : 'none'} size={28} />
                            </button>
                        </div>

                        <div className={styles.badges}>
                            <span className={styles.badge}>{plant.oxygenLevel} Oxygen</span>
                            <span className={styles.badge}>{plant.sunlight} Light</span>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Advanced Simulation Section */}
                    <div className={styles.simulationContainer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3><Activity size={20} /> Live Ecosystem Simulator</h3>
                            {weather && <span style={{ fontSize: '0.8rem', color: '#00ff9d' }}>• Local Weather Active</span>}
                        </div>

                        {/* Interactive Slider */}
                        <div style={{ marginBottom: '1.5rem', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Simulating for <strong>{numPeople} People</strong>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={numPeople}
                                onChange={(e) => setNumPeople(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                        </div>

                        <div className={styles.simVisual}>
                            <div className={styles.simCol}>
                                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>CO2 Output</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(numPeople > 3 ? 8 : 4)].map((_, i) => (
                                        <div key={i} className="sim-particle-co2" style={{ animationDelay: `${i * 0.3}s` }}>↓ CO2</div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.plantIcon} style={{ fontSize: '3rem' }}>🌿</div>
                            <div className={styles.simCol}>
                                <span style={{ color: '#4ade80', fontSize: '0.8rem' }}>O2 Production</span>
                                <div className={styles.particleContainer}>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="sim-particle-o2" style={{ animationDelay: `${i * 0.4}s` }}>↑ O2</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.simStats}>
                            <div className={styles.statBox}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{plantsNeeded}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Plants Required</div>
                            </div>
                            <div className={styles.statBox}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{Math.round(currentTemp)}°C</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Avg Environment</div>
                            </div>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                            *Based on {HUMAN_O2_NEED_LITERS}L O2/day human consumption vs plant efficiency.
                        </p>
                    </div>

                    {/* Light Simulation */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: '1rem', width: '100%' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sun size={20} color="#facc15" /> Light Analysis
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Required Sunlight</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{plant.sunlight} Intensity</div>
                                <div style={{
                                    height: '8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    marginTop: '0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: plant.sunlight === 'low' ? '30%' : plant.sunlight === 'medium' ? '60%' : '100%',
                                        height: '100%',
                                        background: '#facc15',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Your Room (Estimated)</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Based on Normal Layout</div>
                                <div style={{
                                    height: '8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    marginTop: '0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: '50%',
                                        height: '100%',
                                        background: '#fff',
                                        borderRadius: '4px',
                                        opacity: 0.5
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className={styles.grid}>
                        <div className={styles.section}>
                            <h4><Droplets size={18} /> Watering Schedule</h4>
                            <p>{getWateringSchedule()}</p>
                        </div>

                        <div className={styles.section}>
                            <h4><Info size={18} /> Medicinal Values</h4>
                            <ul>
                                {plant.medicinalValues.map((v, i) => <li key={i}>{v}</li>)}
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h4><Sun size={18} /> Advantages</h4>
                            <ul>
                                {plant.advantages.map((v, i) => <li key={i}>{v}</li>)}
                            </ul>
                        </div>
                    </div>

                    <Button style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>Close Simulation</Button>
                </div>
            </div>
        </div>
    );
};
