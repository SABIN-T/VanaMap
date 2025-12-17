import { X, Droplets, Sun, Heart, Wind } from 'lucide-react';
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

    const currentTemp = weather?.avgTemp30Days || 25;
    const currentHumidity = weather?.avgHumidity30Days || 50;

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
