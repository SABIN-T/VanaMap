import { X, MapPin, Globe, ShoppingCart, Star, Shield, Package, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vendor, Plant } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { useCart } from '../../../context/CartContext';
import styles from './VendorDetailsModal.module.css';

interface VendorDetailsModalProps {
    vendor: Vendor & {
        currentPrice: number;
        realDistance: number;
        sellingMode: 'online' | 'offline' | 'both';
        quantity: number;
        customImages: string[];
    };
    plant: Plant;
    onClose: () => void;
    onBack: () => void;
}

export const VendorDetailsModal = ({ vendor, plant, onClose, onBack }: VendorDetailsModalProps) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Combine default plant image with custom images
    const allImages = vendor.customImages && vendor.customImages.length > 0
        ? vendor.customImages
        : [plant.imageUrl];

    const handlePurchase = () => {
        addToCart(plant, vendor.id, vendor.currentPrice);
        onClose();
        navigate('/cart');
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header with gradient */}
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={onBack}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className={styles.scrollContent}>
                    {/* Vendor Profile Section */}
                    <div className={styles.vendorProfile}>
                        <div className={styles.shopImageWrapper}>
                            {vendor.shopImage ? (
                                <img
                                    src={vendor.shopImage}
                                    alt={vendor.name}
                                    className={styles.shopImage}
                                />
                            ) : (
                                <div className={styles.shopImagePlaceholder}>
                                    {vendor.name.charAt(0)}
                                </div>
                            )}
                            {vendor.verified && (
                                <div className={styles.verifiedBadge}>
                                    <Shield size={12} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className={styles.vendorInfo}>
                            <h2 className={styles.vendorName}>{vendor.name}</h2>
                            <div className={styles.vendorMeta}>
                                <span className={styles.metaItem}>
                                    <MapPin size={14} />
                                    {vendor.realDistance < 999
                                        ? `${vendor.realDistance.toFixed(1)} km from center`
                                        : 'Region'}
                                </span>
                                {vendor.highlyRecommended && (
                                    <span className={styles.recommendedBadge}>
                                        <Star size={12} fill="currentColor" /> Premier
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.headerAction}>
                            <div className={styles.headerPrice}>{formatCurrency(vendor.currentPrice)}</div>
                            <button
                                className={styles.headerBuyBtn}
                                onClick={handlePurchase}
                                disabled={vendor.quantity === 0}
                            >
                                <ShoppingCart size={16} />
                                <span>Buy</span>
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery with Modern Carousel */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImage}>
                            <img
                                src={allImages[selectedImageIndex]}
                                alt={`${plant.name} - Image ${selectedImageIndex + 1}`}
                                className={styles.productImage}
                                key={selectedImageIndex} // Force re-render for animation
                            />

                            {/* Navigation Arrows - Only show if multiple images */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        className={`${styles.navBtn} ${styles.navBtnLeft}`}
                                        onClick={prevImage}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} strokeWidth={3} />
                                    </button>
                                    <button
                                        className={`${styles.navBtn} ${styles.navBtnRight}`}
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} strokeWidth={3} />
                                    </button>

                                    {/* Image Counter Badge */}
                                    <div className={styles.imageCounter}>
                                        <span className={styles.currentImage}>{selectedImageIndex + 1}</span>
                                        <span className={styles.counterDivider}>/</span>
                                        <span className={styles.totalImages}>{allImages.length}</span>
                                    </div>

                                    {/* Progress Dots */}
                                    <div className={styles.progressDots}>
                                        {allImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                className={`${styles.dot} ${idx === selectedImageIndex ? styles.dotActive : ''}`}
                                                onClick={() => setSelectedImageIndex(idx)}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Vendor Badge Overlay */}
                            {vendor.customImages && vendor.customImages.length > 0 && (
                                <div className={styles.realPhotoBadge}>
                                    📸 Real Photo
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip - Horizontal Scrollable */}
                        {allImages.length > 1 && (
                            <div className={styles.thumbnails}>
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.thumbnail} ${idx === selectedImageIndex ? styles.activeThumbnail : ''}`}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                                        {idx === selectedImageIndex && (
                                            <div className={styles.thumbnailOverlay}>
                                                <div className={styles.thumbnailCheck}>✓</div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className={styles.productDetails}>
                        <h3 className={styles.productName}>{plant.name}</h3>
                        <p className={styles.scientificName}>{plant.scientificName}</p>

                        <div className={styles.priceSection}>
                            <div className={styles.price}>{formatCurrency(vendor.currentPrice)}</div>
                            <div className={styles.stockInfo}>
                                {vendor.quantity > 0 ? (
                                    <span className={styles.inStock}>
                                        <Package size={14} /> {vendor.quantity} in stock
                                    </span>
                                ) : (
                                    <span className={styles.outOfStock}>Out of stock</span>
                                )}
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className={styles.deliveryOptions}>
                            <div className={styles.sectionTitle}>Availability</div>
                            <div className={styles.optionBadges}>
                                {(vendor.sellingMode === 'online' || vendor.sellingMode === 'both') && (
                                    <span className={styles.optionBadge}>
                                        🚚 Home Delivery
                                    </span>
                                )}
                                {(vendor.sellingMode === 'offline' || vendor.sellingMode === 'both') && (
                                    <span className={styles.optionBadge}>
                                        🏪 Store Pickup
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Vendor Location & Website */}
                        <div className={styles.contactSection}>
                            <div className={styles.sectionTitle}>Location & Website</div>
                            
                            {vendor.address && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <MapPin size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                                    <span>{vendor.address}</span>
                                </div>
                            )}

                            <div className={styles.contactGrid}>
                                {vendor.latitude !== undefined && vendor.longitude !== undefined && vendor.latitude !== null && vendor.longitude !== null && (
                                    <a
                                        href={`https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.contactBtn}
                                    >
                                        <Navigation size={16} />
                                        <span>View Location</span>
                                    </a>
                                )}
                                {vendor.website && (
                                    <a
                                        href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.contactBtn}
                                    >
                                        <Globe size={16} />
                                        <span>Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
