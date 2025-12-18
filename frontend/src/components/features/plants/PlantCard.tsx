import type { Plant } from '../../../types';
import { Button } from '../../common/Button';
import { ShoppingCart, Heart, Sun, Wind } from 'lucide-react';
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
        <div className={styles.card} style={isTopMatch ? { border: '1px solid #facc15', boxShadow: '0 0 30px rgba(250, 204, 21, 0.15)' } : {}}>
            <div className={styles.imageContainer}>
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className={styles.image}
                    loading="lazy"
                />

                <div className={styles.overlayTop}>
                    {score && score > 80 && (
                        <div className={styles.matchBadge}>
                            {score.toFixed(0)}% Match
                        </div>
                    )}
                    <button onClick={handleHeartClick} className={styles.favBtn}>
                        <Heart size={18} fill={isFavorite ? "#ef4444" : "rgba(0,0,0,0.5)"} color={isFavorite ? "#ef4444" : "white"} />
                    </button>
                </div>

                <div className={styles.overlayBottom}>
                    <span className={styles.typeBadge}>{plant.type}</span>
                    <span className={styles.priceTag}>${plant.price}</span>
                </div>
            </div>

            <div className={styles.content}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <h3 className={styles.title}>{plant.name}</h3>
                    <p className={styles.scientific}>{plant.scientificName}</p>
                </div>

                <div className={styles.specs}>
                    <div className={styles.specItem}>
                        <Sun size={12} /> {plant.sunlight}
                    </div>
                    <div className={styles.specItem}>
                        <Wind size={12} /> {plant.oxygenLevel}
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
                        fontSize: '0.85rem'
                    }}
                >
                    <ShoppingCart size={14} style={{ marginRight: '0.5rem' }} /> Add to Cart
                </Button>
            </div>
        </div>
    );
};
