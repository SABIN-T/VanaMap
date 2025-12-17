import type { Plant } from '../../../types';
import { Button } from '../../common/Button';
import { ShoppingCart, Heart, Trophy, Sparkles } from 'lucide-react';
import styles from './PlantCard.module.css';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface PlantCardProps {
    plant: Plant;
    onAdd: (plant: Plant) => void;
    score?: number; // Optional aptness score
    isTopMatch?: boolean;
}

export const PlantCard = ({ plant, onAdd, score, isTopMatch }: PlantCardProps) => {
    const { user, toggleFavorite } = useAuth();
    const isFavorite = user?.favorites.includes(plant.id);

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
        <div className={styles.card} style={isTopMatch ? {
            border: '2px solid rgba(251, 191, 36, 0.6)',
            boxShadow: '0 0 50px rgba(251, 191, 36, 0.25)',
            transform: 'scale(1.03)',
            zIndex: 10
        } : {}}>
            <div className={styles.imageContainer}>
                {isTopMatch && (
                    <>
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                            color: '#000',
                            padding: '0.5rem 1.2rem',
                            borderRadius: '99px',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
                            zIndex: 20,
                            whiteSpace: 'nowrap',
                            letterSpacing: '1px',
                            border: '1px solid rgba(255, 255, 255, 0.4)'
                        }}>
                            <Trophy size={14} fill="black" strokeWidth={2} />
                            <span>BEST MATCH</span>
                            <Sparkles size={12} fill="black" />
                        </div>
                        <div style={{
                            position: 'absolute', inset: 0,
                            pointerEvents: 'none',
                            boxShadow: 'inset 0 0 30px rgba(251, 191, 36, 0.3)',
                            zIndex: 15
                        }} />
                    </>
                )}
                {/* ... existing image ... */}
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className={styles.image}
                />

                {/* Favorite Button */}
                <button
                    onClick={handleHeartClick}
                    className={styles.favBtn}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.4)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Heart
                        size={20}
                        color={isFavorite ? "#ef4444" : "#ffffff"}
                        fill={isFavorite ? "#ef4444" : "none"}
                    />
                </button>

                {/* Match Score Badge */}
                {score !== undefined && score > 0 && (
                    <div className={styles.matchBadge} style={{
                        color: score > 80 ? '#00ff9d' : score > 50 ? '#facc15' : '#ef4444',
                        borderColor: score > 80 ? '#00ff9d' : score > 50 ? '#facc15' : 'transparent'
                    }}>
                        {score.toFixed(0)}% Match
                    </div>
                )}

                <span className={styles.typeBadge}>
                    {plant.type}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{plant.name}</h3>
                <p className={styles.scientific}>{plant.scientificName}</p>

                <p className={styles.description}>
                    {plant.description}
                </p>

                <div className={styles.footer}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {plant.oxygenLevel === 'high' && (
                            <span title="High Oxygen" className={styles.tag} style={{ background: 'rgba(0, 255, 157, 0.1)', color: 'var(--color-primary)' }}>O₂</span>
                        )}
                        {plant.sunlight === 'low' && (
                            <span title="Low Light Friendly" className={styles.tag} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>☁️</span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd(plant);
                        }}
                        style={{ borderRadius: '99px', fontSize: '0.8rem' }}
                    >
                        <ShoppingCart size={14} style={{ marginRight: '0.25rem' }} /> Add
                    </Button>
                </div>
            </div>
        </div>
    );
};
