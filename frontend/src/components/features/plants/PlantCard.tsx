import type { Plant } from '../../../types';
import { Button } from '../../common/Button';
import { ShoppingCart, Heart, Sun, Wind, ShieldCheck } from 'lucide-react';
import styles from './PlantCard.module.css';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface PlantCardProps {
    plant: Plant;
    onAdd: (plant: Plant) => void;
    score?: number;
    isTopMatch?: boolean;
}

export const PlantCard = ({ plant, onAdd, score, isTopMatch }: PlantCardProps) => {
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
            ...(isTopMatch ? { border: '2px solid #facc15', boxShadow: '0 0 30px rgba(250, 204, 21, 0.2)' } : {}),
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s ease'
        }}>
            <div className={styles.imageContainer}>
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className={styles.image}
                    loading="lazy"
                />

                <div className={styles.overlayTop}>
                    {score && score > 80 && (
                        <div className={styles.matchBadge} style={{ background: 'linear-gradient(135deg, #facc15, #fbbf24)', color: 'black', fontWeight: 800 }}>
                            {score.toFixed(0)}% MATCH
                        </div>
                    )}
                    <button onClick={handleHeartClick} className={styles.favBtn}>
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "rgba(0,0,0,0.5)"} color={isFavorite ? "#ef4444" : "white"} />
                    </button>
                </div>

                {/* Kid/Pet Friendly Badges */}
                <div style={{
                    position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap'
                }}>
                    {isPetFriendly && (
                        <span style={{
                            background: 'white', color: '#10b981', fontSize: '0.7rem', fontWeight: 800,
                            padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            🐾 Pet Safe
                        </span>
                    )}
                    {plant.oxygenLevel === 'very-high' && (
                        <span style={{
                            background: 'white', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 800,
                            padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            🚀 Super Air
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h3 className={styles.title} style={{ fontSize: '1.1rem', fontWeight: 700 }}>{plant.name}</h3>
                        {/* Type Icon */}
                        <div style={{ opacity: 0.5 }}>
                            {plant.type.toLowerCase() === 'indoor' ? <ShieldCheck size={14} /> : <Sun size={14} />}
                        </div>
                    </div>
                    <p className={styles.scientific} style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#94a3b8' }}>{plant.scientificName}</p>
                </div>

                {/* Simplified Specs for Quick Scan */}
                <div className={styles.specs} style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div className={styles.specItem} style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        <Sun size={12} color="#f59e0b" /> {plant.sunlight}
                    </div>
                    <div className={styles.specItem} style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        <Wind size={12} color="#3b82f6" /> {plant.oxygenLevel} O₂
                    </div>
                </div>

                <Button
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(plant);
                    }}
                    style={{
                        width: '100%',
                        marginTop: 'auto',
                        borderRadius: '0.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                    }}
                >
                    <ShoppingCart size={16} style={{ marginRight: '0.5rem' }} /> Add to Cart
                </Button>
            </div>
        </div>
    );
};
