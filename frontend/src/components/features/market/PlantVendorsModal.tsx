import { useState, useEffect } from 'react';
import { MapPin, Phone, Star, ShieldCheck, ShoppingCart, X, Navigation } from 'lucide-react';
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
        const allVendors = await fetchVendors();
        setVendors(allVendors);
        setLoading(false);
    };

    const enableGPS = () => {
        if (!navigator.geolocation) {
            setGpsError("Geolocation not supported by this browser.");
            return;
        }

        setIsLocating(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setIsLocating(false);
            },
            (error) => {
                console.warn(error);
                let msg = "Location lookup failed.";
                if (error.code === 1) msg = "Location permission denied.";
                else if (error.code === 2) msg = "Position unavailable.";
                else if (error.code === 3) msg = "Location timed out.";
                setGpsError(msg);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Calculate distance in km (Haversine)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    // FILTER & SORT LOGIC
    const availableVendors = vendors
        .map(v => {
            // Find inventory item for this plant
            const invItem = v.inventory?.find(i => i.plantId === plant.id && i.inStock);
            // Fallback for legacy data (simple inventoryIds check)
            const legacyMatch = v.inventoryIds?.includes(plant.id);

            // If we have detailed inventory, use that price. If only legacy, use plant base price or estimate.
            // Requirement says "vendors... can add their price". If no specific price, maybe skip or show base?
            // Let's support both for robustness.
            let price = plant.price || 0;
            if (invItem) {
                price = invItem.price;
            } else if (legacyMatch) {
                price = plant.price || 0; // Fallback
            } else {
                return null; // Not sold here
            }

            // Distance
            let distance = 9999;
            if (userLocation) {
                distance = getDistance(userLocation.lat, userLocation.lng, v.latitude, v.longitude);
            } else {
                // If no GPS, maybe fallback to v.distance default or just high number
                distance = v.distance || 9999;
            }

            return { ...v, currentPrice: price, realDistance: distance };
        })
        .filter((v): v is (Vendor & { currentPrice: number, realDistance: number }) => v !== null)
        .filter(v => {
            if (!userLocation) return true; // Show all if no GPS
            return v.realDistance <= 50; // 50km Radius
        })
        .sort((a, b) => {
            // 1. Highly Recommended First
            if (a.highlyRecommended && !b.highlyRecommended) return -1;
            if (!a.highlyRecommended && b.highlyRecommended) return 1;

            // 2. Verified Second
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;

            // 3. Price Low to High
            return a.currentPrice - b.currentPrice;
        });

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                <div className={styles.header}>
                    <img src={plant.imageUrl} alt={plant.name} className={styles.plantThumb} />
                    <div>
                        <h2 className={styles.title}>Buying Options</h2>
                        <p className={styles.subtitle}>{plant.name}</p>
                    </div>
                </div>

                {!userLocation && (
                    <div className={styles.gpsPrompt}>
                        <MapPin size={24} className="text-emerald-400 mb-2" />
                        <p className="mb-3 text-center text-sm text-slate-300">
                            Find verified shops within 50km of your location.
                        </p>
                        <button onClick={enableGPS} className={styles.gpsBtn} disabled={isLocating}>
                            {isLocating ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Locating...
                                </>
                            ) : (
                                <>
                                    <Navigation size={16} /> Enable GPS
                                </>
                            )}
                        </button>
                        {gpsError && <p className="text-xs text-red-400 mt-2">{gpsError}</p>}
                    </div>
                )}

                <div className={styles.listContainer}>
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Finding best rates...</div>
                    ) : availableVendors.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No vendors found nearby with this plant in stock.
                            {!userLocation && <br />}{!userLocation && "Try enabling GPS to filter by location."}
                        </div>
                    ) : (
                        <div className={styles.vendorList}>
                            {availableVendors.map(vendor => (
                                <div key={vendor.id} className={`${styles.vendorCard} ${vendor.highlyRecommended ? styles.recommended : ''}`}>
                                    {vendor.highlyRecommended && (
                                        <div className={styles.badgeRecommended}><Star size={10} fill="currentColor" /> Highly Recommended</div>
                                    )}

                                    <div className={styles.cardContent}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={styles.vendorName}>{vendor.name}</h3>
                                                {vendor.verified && <ShieldCheck size={14} className="text-blue-400" />}
                                            </div>
                                            <div className={styles.metaRow}>
                                                <span className={styles.distance}>
                                                    <MapPin size={12} /> {vendor.realDistance < 1000 ? `${vendor.realDistance.toFixed(1)} km` : 'Online'}
                                                </span>
                                                <span className={styles.phone}>
                                                    <Phone size={12} /> {vendor.phone}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className={styles.price}>{formatCurrency(vendor.currentPrice)}</div>
                                            <button
                                                className={styles.addToCartBtn}
                                                onClick={() => addToCart(plant, vendor.id, vendor.currentPrice)}
                                            >
                                                <ShoppingCart size={16} /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
