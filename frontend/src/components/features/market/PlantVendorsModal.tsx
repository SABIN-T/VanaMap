import { useState, useEffect } from 'react';
import { MapPin, Phone, Star, ShieldCheck, ShoppingCart, X, TrendingUp } from 'lucide-react';
import type { Plant, Vendor } from '../../../types';
import { fetchVendors } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { useCart } from '../../../context/CartContext';
import styles from './PlantVendorsModal.module.css';

interface PlantVendorsModalProps {
    plant: Plant;
    onClose: () => void;
}

export const PlantVendorsModal = ({ plant, onClose }: PlantVendorsModalProps) => {
    const { addToCart } = useCart();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLocating, setIsLocating] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const allVendors = await fetchVendors();
            setVendors(allVendors.filter(v => v.verified));
        } catch (e) {
            console.error("Failed to load vendors", e);
        } finally {
            setLoading(false);
        }
    };

    const enableGPS = () => {
        if (!navigator.geolocation) {
            setGpsError("Geolocation not supported.");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                setIsLocating(false);
            },
            () => {
                setGpsError("Permission denied.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const availableVendors = vendors
        .map(v => {
            const invItem = v.inventory?.find(i => i.plantId === plant.id && i.inStock);
            const legacyMatch = v.inventoryIds?.includes(plant.id);
            let price = plant.price || 0;
            if (invItem) price = invItem.price;
            else if (legacyMatch) price = plant.price || 0;
            else return null;

            let distance = 9999;
            if (userLocation) distance = getDistance(userLocation.lat, userLocation.lng, v.latitude, v.longitude);
            else distance = v.distance || 9999;

            const info = {
                ...v,
                currentPrice: price,
                realDistance: distance,
                sellingMode: (invItem?.sellingMode || 'offline') as 'online' | 'offline' | 'both',
                quantity: invItem?.quantity || 0,
                customImages: invItem?.customImages || []
            };
            return info;
        })
        .filter((v): v is (Vendor & { currentPrice: number, realDistance: number, sellingMode: 'online' | 'offline' | 'both', quantity: number, customImages: string[] }) => v !== null)
        .sort((a, b) => {
            if (a.highlyRecommended && !b.highlyRecommended) return -1;
            if (!a.highlyRecommended && b.highlyRecommended) return 1;
            return a.currentPrice - b.currentPrice;
        });

    return (
        <div className={`${styles.overlay} no-swipe`} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                <div className={styles.header}>
                    <img src={plant.imageUrl} alt={plant.name} className={styles.plantThumb} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <TrendingUp size={12} /> Best Options Found
                        </div>
                        <h2 className={styles.title}>Purchase Options</h2>
                        <p className={styles.subtitle}>{plant.name}</p>
                    </div>
                </div>

                {!userLocation && (
                    <div className={styles.gpsPrompt}>
                        <MapPin size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto 1rem' }}>
                            We found {availableVendors.length} sellers. Enable GPS to find the closest one to you.
                        </p>
                        <button onClick={enableGPS} className={styles.gpsBtn} disabled={isLocating}>
                            {isLocating ? 'Locating...' : 'Search Nearby'}
                        </button>
                        {gpsError && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.5rem' }}>{gpsError}</p>}
                    </div>
                )}

                <div className={styles.vendorList}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>Scanning marketplace...</div>
                    ) : availableVendors.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                            This specimen is currently unavailable in local nurseries.
                        </div>
                    ) : (
                        availableVendors.map(vendor => (
                            <div key={vendor.id} className={`${styles.vendorCard} ${vendor.highlyRecommended ? styles.recommended : ''}`}>
                                {vendor.highlyRecommended && (
                                    <div className={styles.badgeRecommended}>
                                        <Star size={10} fill="currentColor" /> Premier Partner
                                    </div>
                                )}

                                <div className={styles.cardContent}>
                                    {/* Shop Image Avatar */}
                                    {vendor.shopImage && (
                                        <div style={{ marginRight: '1rem', flexShrink: 0 }}>
                                            <img
                                                src={vendor.shopImage}
                                                alt={vendor.name}
                                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155' }}
                                            />
                                        </div>
                                    )}

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <h3 className={styles.vendorName}>{vendor.name}</h3>
                                            {vendor.verified && <ShieldCheck size={14} color="#3b82f6" />}
                                        </div>
                                        <div className={styles.metaRow}>
                                            <span>
                                                <MapPin size={12} /> {vendor.realDistance < 999 ? `${vendor.realDistance.toFixed(1)} km` : 'Regional'}
                                            </span>
                                            <span>
                                                <Phone size={12} /> Contact Info
                                            </span>
                                            {vendor.website && (
                                                <span onClick={() => window.open(vendor.website!.startsWith('http') ? vendor.website! : `https://${vendor.website}`, '_blank')} style={{ cursor: 'pointer', color: '#10b981' }}>
                                                    <Star size={12} /> Website
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.sellingDetails}>
                                            <span className={styles.modeBadge}>
                                                {vendor.sellingMode === 'online' ? '🚚 Delivery Only' :
                                                    vendor.sellingMode === 'offline' ? '🏪 Store Pickup' :
                                                        '🔄 Delivery & Pickup'}
                                            </span>
                                            {vendor.quantity > 0 && <span className={styles.qtyBadge}>In Stock: {vendor.quantity}</span>}
                                        </div>

                                        {/* Custom Plant Images */}
                                        {vendor.customImages && vendor.customImages.length > 0 && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                                {vendor.customImages.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt="Actual photo"
                                                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #475569' }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                        <div className={styles.price}>{formatCurrency(vendor.currentPrice)}</div>
                                        <button
                                            className={styles.addToCartBtn}
                                            onClick={() => {
                                                addToCart(plant, vendor.id, vendor.currentPrice);
                                                onClose();
                                            }}
                                        >
                                            <ShoppingCart size={16} /> Purchase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
