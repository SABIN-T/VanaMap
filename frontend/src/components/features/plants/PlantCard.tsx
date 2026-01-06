import type { Plant } from '../../../types';
import { Heart, Sun, Wind, ShoppingBag, AlertCircle, Clock, HelpCircle } from 'lucide-react';
import styles from './PlantCard.module.css';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface PlantCardProps {
    plant: Plant;
    onAdd?: (plant: Plant) => void;
    score?: number;
    isTopMatch?: boolean;
    priority?: boolean;
    stockStatus?: {
        totalStock: number;
        minPrice: number | null;
        hasStock: boolean;
    };
    hideBuyBtn?: boolean;
    hideStockBadge?: boolean;
}

export const PlantCard = ({ plant, score, isTopMatch, priority = false, onAdd, stockStatus, hideBuyBtn = false, hideStockBadge = false }: PlantCardProps) => {
    const { user, toggleFavorite } = useAuth();
    const isFavorite = user?.favorites.includes(plant.id);
    const isPetFriendly = plant.petFriendly;

    // Determine Price & Stock
    const displayPrice = stockStatus?.minPrice || plant.price || ((plant.name.charCodeAt(0) % 5 + 1) * 150);
    const inStock = stockStatus ? stockStatus.hasStock : true; // Default to true if no stats (mock)
    const stockCount = stockStatus?.totalStock || 0;

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
                    src={(() => {
                        if (!plant.imageUrl) return '';
                        // Mobile optimization: reduce quality and size for faster loading
                        const isMobile = window.innerWidth < 768;
                        if (plant.imageUrl.includes('cloudinary.com')) {
                            const transforms = isMobile
                                ? '/upload/f_auto,q_auto:low,w_400,c_limit/' // Mobile: lower quality, smaller size
                                : '/upload/f_auto,q_auto,w_600,c_limit/';    // Desktop: higher quality
                            return plant.imageUrl.replace('/upload/', transforms);
                        }
                        return plant.imageUrl;
                    })()}
                    alt={`${plant.name} - ${plant.scientificName} plant`}
                    className={styles.image}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    width="300"
                    height="300"
                    {...(priority ? { fetchPriority: "high" as const } : {})}
                />

                <div className={styles.overlayTop}>
                    {score !== undefined && (
                        <div
                            className={styles.matchBadge}
                            style={{
                                background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                    score >= 50 ? 'linear-gradient(135deg, #facc15, #fbbf24)' :
                                        'linear-gradient(135deg, #f87171, #ef4444)',
                                color: score >= 50 && score < 80 ? '#000' : '#fff',
                                display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toast(
                                    `🌱 ${score}% Aptness: Scientifically normalized fit based on your unique 30-day ecosystem profile. The top species is calibrated to 100%.`,
                                    { duration: 5000, style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }
                                );
                            }}
                        >
                            {score.toFixed(1)}% APTNESS <HelpCircle size={10} />
                        </div>
                    )}
                    <button onClick={handleHeartClick} className={styles.favBtn} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "rgba(0,0,0,0.2)"} color={isFavorite ? "#ef4444" : "white"} />
                    </button>
                </div>

                {/* Stock Badge - Stacked above Type Badge */}
                {stockStatus && !hideStockBadge && (
                    <div style={{
                        position: 'absolute',
                        bottom: '54px',
                        left: '12px',
                        zIndex: 10,
                        background: inStock ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        letterSpacing: '0.5px',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {inStock ? (
                            <>
                                <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }}></span>
                                IN STOCK ({stockCount})
                            </>
                        ) : (
                            <>
                                <AlertCircle size={10} /> OUT OF STOCK
                            </>
                        )}
                    </div>
                )}

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
                    {plant.lifespan && plant.lifespan !== 'Unknown' && (
                        <div className={styles.specItem}>
                            <Clock size={14} className="text-emerald-400" /> {plant.lifespan}
                        </div>
                    )}
                </div>

                {/* Shop Action - Premium UI */}
                {!hideBuyBtn && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // If onAdd exists, use it (Add to Cart logic)
                            if (onAdd) {
                                onAdd(plant);
                                // Toast handled in parent or here?
                                // toast.success(`Viewing ${plant.name} in shops`);
                            }
                        }}
                        className={styles.shopBtn}
                        aria-label={`Buy ${plant.name}`}
                        disabled={!inStock}
                        style={!inStock ? { opacity: 0.6, cursor: 'not-allowed', background: '#334155' } : {}}
                    >
                        <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>
                            <ShoppingBag size={16} /> Rs. {displayPrice} • {inStock ? 'BUY' : 'SOLD OUT'}
                        </span>
                        {/* Glossy sheen effect overlay via CSS is best, but inline simpler for now */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 60%)',
                            transform: 'skewX(-20deg)',
                            opacity: 0,
                            transition: 'opacity 0.3s'
                        }} className="hover-sheen"></div>
                    </button>
                )}
            </div>
        </div>
    );
};
