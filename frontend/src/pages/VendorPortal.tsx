import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { Store, Phone, MessageCircle, Info, Locate, AlertTriangle, BadgeCheck } from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import type { LatLng } from 'leaflet';
import type { Vendor } from '../types';
import { VendorInventory } from '../components/features/vendor/VendorInventory';
import { MarketInsights } from '../components/features/vendor/MarketInsights';
import styles from './VendorPortal.module.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when marker moves
const RecenterMap = ({ center }: { center: LatLng }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
    }, [center, map]);
    return null;
};

function DraggableMarker({ pos, setPos }: { pos: L.LatLng, setPos: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPos(e.latlng);
            toast.success("Location pinned!");
        },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    if (marker != null) {
                        setPos(marker.getLatLng());
                        toast.success("Location updated!");
                    }
                },
            }}
            position={pos}>
            <Popup>
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Shop Marker</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Move to exact warehouse/shop spot</span>
                </div>
            </Popup>
        </Marker>
    );
}

export const VendorPortal = () => {
    const { user } = useAuth();
    const [markerPos, setMarkerPos] = useState<L.LatLng>(new L.LatLng(20.5937, 78.9629));
    const [isEditing, setIsEditing] = useState(false);
    const [existingVendorId, setExistingVendorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);

    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        whatsapp: '',
        address: ''
    });

    const loadVendorData = useCallback(async () => {
        const vendors = await fetchVendors();
        if (!user) return;

        const myVendor = vendors.find(v => v.id === user.id || v.id === (user as any)._id);

        if (myVendor) {
            setCurrentVendor(myVendor);
            setIsEditing(true);
            setExistingVendorId(myVendor.id);
            setFormData({
                shopName: myVendor.name,
                phone: myVendor.phone || '',
                whatsapp: myVendor.whatsapp || '',
                address: myVendor.address || ''
            });
            if (myVendor.latitude && myVendor.longitude) {
                setMarkerPos(new L.LatLng(myVendor.latitude, myVendor.longitude));
            }
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === 'vendor' || user?.role === 'admin') {
            loadVendorData();
        }
    }, [user, loadVendorData]);



    const handleAutoLocate = useCallback(() => {
        if (isLocating) return;
        setIsLocating(true);
        const tid = toast.loading("Accessing GPS...");

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser", { id: tid });
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
                setMarkerPos(newPos);
                toast.success("Current location captured!", { id: tid });
                setIsLocating(false);
            },
            () => {
                toast.error("Failed to get location. Please pin manually.", { id: tid });
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [isLocating]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const vendorData = {
            id: existingVendorId || user?.id || Date.now().toString(),
            name: formData.shopName,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            address: formData.address,
            latitude: markerPos.lat,
            longitude: markerPos.lng,
            verified: isEditing // Keep verification status if editing
        };

        try {
            if (isEditing && existingVendorId) {
                const result = await updateVendor(existingVendorId, vendorData);
                if (result) toast.success("Shop details updated!");
                else throw new Error("Update failed");
            } else {
                const result = await registerVendor(vendorData);
                if (result) {
                    toast.success(`Shop "${formData.shopName}" registered!`);
                    setIsEditing(true);
                } else {
                    throw new Error("Registration failed");
                }
            }
        } catch (err) {
            toast.error("Process failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.portalContainer}>
            <div className={styles.header}>
                <h1 className={styles.portalTitle}>
                    {isEditing ? 'Shop Manager' : 'Register Shop'}
                </h1>
                <p className={styles.portalSubtitle}>
                    {isEditing ? `Managing: ${formData.shopName}` : 'Join our network of verified plant suppliers.'}
                </p>
            </div>

            {/* Verified Partner Banner */}
            {isEditing && (
                <div className={styles.verifiedBanner}>
                    <div className={styles.verifiedIconBox}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className={styles.verifiedContent}>
                        <div className={styles.verifiedTitle}>
                            <BadgeCheck size={18} />
                            Verified Partner Status
                        </div>
                        <p className={styles.verifiedText}>
                            Get Verified to rank higher in search results and gain customer trust. Your shop will be marked as "Verified Partner" across the platform.
                        </p>
                    </div>
                    <button
                        onClick={() => window.open('https://wa.me/9188773534', '_blank')}
                        className={styles.whatsappBtn}
                    >
                        <MessageCircle size={18} />
                        WhatsApp Support
                        <span>Contact Admin</span>
                    </button>
                </div>
            )}

            <div className={styles.portalGrid}>
                {/* Form Section */}
                <form onSubmit={handleSubmit} className={styles.formCard}>
                    <div className={styles.formSectionHeader}>
                        <Store size={20} />
                        <h2>Profile Settings</h2>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Official Shop Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Green Valley Nursery"
                            className={styles.input}
                            value={formData.shopName}
                            onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}><Phone size={12} /> Phone Number</label>
                            <input
                                type="tel"
                                required
                                className={styles.input}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}><MessageCircle size={12} /> WhatsApp</label>
                            <input
                                type="tel"
                                required
                                className={styles.input}
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Physical Address</label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Unit #, Street Name, City, Pincode"
                            className={styles.textarea}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className={styles.coordsBox}>
                        <div className={styles.coordsInfo}>
                            <h4>Global Pin</h4>
                            <div className={styles.coordsValue}>
                                {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutoLocate}
                            disabled={isLocating}
                            className={styles.gpsBtn}
                        >
                            <Locate size={14} /> {isLocating ? 'Capturing...' : 'Use GPS'}
                        </button>
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: '100%', borderRadius: '0.75rem', padding: '1rem', fontWeight: 800 }}>
                        {loading ? 'Propagating Changes...' : (isEditing ? 'Save Profile' : 'Register Now')}
                    </Button>
                </form>

                {/* Map & Notifications Section */}
                <div className={styles.mapWrapper}>
                    <div className={styles.mapHint}>
                        <h3><Info size={14} /> Precise Location Required</h3>
                        <p>
                            Nearby search results use your shop's coordinate. Move the marker to your entrance.
                        </p>
                    </div>

                    <div className={styles.mapContainer}>
                        <MapContainer center={markerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker pos={markerPos} setPos={setMarkerPos} />
                            <RecenterMap center={markerPos} />
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Inventory Section */}
            {isEditing && currentVendor && (
                <div style={{ marginTop: '4rem' }}>
                    <MarketInsights vendorId={currentVendor.id} />
                    <VendorInventory
                        vendor={currentVendor}
                        onUpdate={loadVendorData}
                    />
                </div>
            )}
        </div>
    );
};
