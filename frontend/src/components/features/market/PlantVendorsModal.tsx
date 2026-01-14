import { useState, useEffect } from 'react';
import { MapPin, Star, ShieldCheck, X, TrendingUp, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Plant, Vendor } from '../../../types';
import { fetchVendors } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { useCart } from '../../../context/CartContext';
import { VendorDetailsModal } from './VendorDetailsModal';
import styles from './PlantVendorsModal.module.css';

interface PlantVendorsModalProps {
    plant: Plant;
    onClose: () => void;
}

export const PlantVendorsModal = ({ plant, onClose }: PlantVendorsModalProps) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

    const handleQuickBuy = (e: React.MouseEvent, v: any) => {
        e.stopPropagation();
        addToCart(plant, v.id, v.currentPrice);
        onClose();
        navigate('/cart');
    };

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



    const availableVendors = vendors
        .map(v => {
            const invItem = v.inventory?.find(i => i.plantId === plant.id && i.inStock);
            const legacyMatch = v.inventoryIds?.includes(plant.id);
            let price = plant.price || 0;
            if (invItem) price = invItem.price;
            else if (legacyMatch) price = plant.price || 0;
            else return null;

            const distance = v.distance || 9999;

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
                        <div className={styles.optionsHeader}>
                            <TrendingUp size={12} /> Best Options Found
                        </div>
                        <h2 className={styles.title}>Purchase Options</h2>
                        <div className={styles.plantNameRow}>
                            <p className={styles.subtitle}>{plant.name}</p>
                            <span className={styles.searchRadius}>
                                Searching: 50km radius
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.vendorList}>
                    {loading ? (
                        <div className={styles.statusMsg}>Scanning marketplace...</div>
                    ) : availableVendors.length === 0 ? (
                        <div className={styles.statusMsg}>
                            This specimen is currently unavailable in local nurseries.
                        </div>
                    ) : (
                        availableVendors.map(vendor => (
                            <div
                                key={vendor.id}
                                className={`${styles.vendorCard} ${vendor.highlyRecommended ? styles.recommended : ''}`}
                                onClick={() => setSelectedVendor(vendor)}
                                style={{ cursor: 'pointer' }}
                            >
                                {vendor.highlyRecommended && (
                                    <div className={styles.badgeRecommended}>
                                        <Star size={10} fill="currentColor" /> Premier Partner
                                    </div>
                                )}

                                <div className={styles.cardContent}>
                                    {/* Left: Shop Avatar */}
                                    {vendor.shopImage && (
                                        <div className={styles.shopAvatarWrapper}>
                                            <img
                                                src={vendor.shopImage}
                                                alt={vendor.name}
                                                className={styles.shopAvatar}
                                            />
                                        </div>
                                    )}

                                    {/* Middle: Info */}
                                    <div className={styles.vendorCoreInfo}>
                                        <div className={styles.vendorNameRow}>
                                            <h3 className={styles.vendorName}>{vendor.name}</h3>
                                            {vendor.verified && <ShieldCheck size={14} color="#3b82f6" />}
                                        </div>
                                        <div className={styles.metaRow}>
                                            <span className={styles.distanceText}>
                                                <MapPin size={12} /> {vendor.realDistance < 999 ? `${vendor.realDistance.toFixed(1)} km` : 'Regional'}
                                            </span>
                                        </div>
                                        <div className={styles.sellingDetails}>
                                            <span className={styles.modeBadge}>
                                                {vendor.sellingMode === 'online' ? '🚚 Online' :
                                                    vendor.sellingMode === 'offline' ? '🏪 Shop' : '🔄 Both'}
                                            </span>
                                            {vendor.quantity > 0 && <span className={styles.stockStatus}>In Stock</span>}
                                        </div>
                                    </div>

                                    {/* Right: Price & Quick Buy */}
                                    <div className={styles.actionSection}>
                                        <div className={styles.quickPrice}>{formatCurrency(vendor.currentPrice)}</div>
                                        <button
                                            className={styles.premiumBuyBtn}
                                            onClick={(e) => handleQuickBuy(e, vendor)}
                                        >
                                            <ShoppingCart size={14} />
                                            <span>Buy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Vendor Details Modal */}
            {selectedVendor && (
                <VendorDetailsModal
                    vendor={selectedVendor}
                    plant={plant}
                    onClose={onClose}
                    onBack={() => setSelectedVendor(null)}
                />
            )}
        </div>
    );
};
