import type { Plant } from '../../../types';
import { Heart, Sun, Wind } from 'lucide-react';
import styles from './PlantCard.module.css';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface PlantCardProps {
    plant: Plant;
    onAdd?: (plant: Plant) => void; // Made optional
    score?: number;
    isTopMatch?: boolean;
}

export const PlantCard = ({ plant, score, isTopMatch }: PlantCardProps) => {
    const { user, toggleFavorite } = useAuth();
    const isFavorite = user?.favorites.includes(plant.id);
    const isPetFriendly = (plant as any).petFriendly;

    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Sign in to save favorites!");
            return;
        }
        toggleFavorite(plant.id);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    };

    return (
        <div className={styles.card} style={{
            ...(isTopMatch ? { border: '2px solid rgba(250, 204, 21, 0.5)', boxShadow: '0 0 40px rgba(250, 204, 21, 0.15)' } : {}),
        }}>
            <div className={styles.imageContainer}>
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className={styles.image}
                    loading="lazy"
                />

                <div className={styles.overlayTop}>
                    {score !== undefined && (
                        <div className={styles.matchBadge} style={{
                            background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                score >= 50 ? 'linear-gradient(135deg, #facc15, #fbbf24)' :
                                    'linear-gradient(135deg, #f87171, #ef4444)',
                            color: score >= 50 && score < 80 ? '#000' : '#fff',
                        }}>
                            {score}% APTNESS
                        </div>
                    )}
                    <button onClick={handleHeartClick} className={styles.favBtn}>
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "rgba(0,0,0,0.2)"} color={isFavorite ? "#ef4444" : "white"} />
                    </button>
                </div>

                <div className={styles.overlayBottom}>
                    <div style={{
                        background: plant.type === 'indoor' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {plant.type === 'indoor' ? 'Indoor Specimen' : 'Outdoor Nature'}
                    </div>
                </div>

                {/* Kid/Pet Friendly Badges */}
                <div style={{
                    position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap', zIndex: 3
                }}>
                    {isPetFriendly && (
                        <span style={{
                            background: 'rgba(255,255,255,0.95)', color: '#10b981', fontSize: '0.65rem', fontWeight: 800,
                            padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            Pet Safe 🐾
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div style={{ marginBottom: '0.25rem' }}>
                    <h3 className={styles.title}>{plant.name}</h3>
                    <p className={styles.scientific}>{plant.scientificName}</p>
                </div>

                {/* Simplified Specs */}
                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <Sun size={14} className="text-amber-400" /> {plant.sunlight}
                    </div>
                    <div className={styles.specItem}>
                        <Wind size={14} className="text-blue-400" /> {plant.oxygenLevel} O₂
                    </div>
                </div>


            </div>
        </div>
    );
};
