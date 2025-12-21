import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Navigation, Store, CheckCircle, Globe, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AdminPageLayout } from './AdminPageLayout';
import { registerVendor } from '../../services/api';
import type { Vendor } from '../../types';
import styles from './AddVendor.module.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to center map when coords change
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

// Sub-component to handle clicks
const LocationMarker = ({ position, setPosition }: { position: [number, number], setPosition: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
        },
    });
    return position === null ? null : (
        <Marker position={position} />
    );
};

export const AddVendor = () => {
    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
        latitude: 28.61,
        longitude: 77.23,
        verified: true,
        address: '',
        name: ''
    });

    const [isLocating, setIsLocating] = useState(false);

    const handleSaveVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Onboarding Partner...");
        try {
            await registerVendor(newVendor);
            toast.success("Partner Onboarded Successfully", { id: tid, icon: '🤝' });
            setNewVendor({ latitude: 28.61, longitude: 77.23, verified: true, address: '', name: '' });
        } catch (err) {
            toast.error("Failed to register vendor", { id: tid });
        }
    };

    const handleGPS = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setNewVendor(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
                setIsLocating(false);
                toast.success("Location Updated");
            },
            (err) => {
                toast.error("Location access denied");
                setIsLocating(false);
            }
        );
    };

    const updateCoords = (lat: number, lng: number) => {
        setNewVendor(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    return (
        <AdminPageLayout title="Onboard Partner">
            <div className={styles.pageContainer}>

                <div className={styles.mainCard}>
                    <div className={styles.header}>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-500/20 rounded-full text-amber-500">
                                <Store size={40} />
                            </div>
                        </div>
                        <h1 className={styles.title}>Register New Vendor</h1>
                        <p className={styles.subtitle}>Add a verified garden center or nursery to the network.</p>
                    </div>

                    {/* --- GPS ACTION --- */}
                    <div className="absolute top-8 right-8 z-[20]">
                        <button
                            type="button"
                            onClick={handleGPS}
                            disabled={isLocating}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-900/40 relative z-50"
                        >
                            <Crosshair size={16} className={isLocating ? 'animate-spin' : ''} />
                            {isLocating ? 'Locating...' : 'Use GPS'}
                        </button>
                    </div>

                    <form onSubmit={handleSaveVendor}>
                        {/* 1. Identity Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <CheckCircle size={16} /> Partner Identity
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Business Name</label>
                                <input
                                    className={styles.glassInput}
                                    value={newVendor.name || ''}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                    placeholder="e.g. Green Earth Nursery"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Visual Location Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Globe size={16} /> Location & Mapping
                            </div>

                            <div className="mb-4 text-xs text-slate-400 flex items-center gap-2">
                                <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Tip</span>
                                Click on the map to pinpoint the exact location.
                            </div>

                            {/* --- INTERACTIVE MAP --- */}
                            <div className={styles.mapContainer}>
                                <MapContainer
                                    center={[newVendor.latitude || 28.61, newVendor.longitude || 77.23]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    className="h-full w-full"
                                    style={{ height: '100%', background: '#0f172a' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                                    />
                                    <MapUpdater center={[newVendor.latitude || 28.61, newVendor.longitude || 77.23]} />
                                    <LocationMarker
                                        position={[newVendor.latitude || 28.61, newVendor.longitude || 77.23]}
                                        setPosition={updateCoords}
                                    />
                                </MapContainer>
                            </div>

                            <div className={styles.coordGrid}>
                                <div>
                                    <label className={styles.label}>Latitude</label>
                                    <input
                                        className={styles.glassInput}
                                        type="number"
                                        step="any"
                                        value={newVendor.latitude || ''}
                                        onChange={e => setNewVendor({ ...newVendor, latitude: Number(e.target.value) })}
                                        placeholder="28.61"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Longitude</label>
                                    <input
                                        className={styles.glassInput}
                                        type="number"
                                        step="any"
                                        value={newVendor.longitude || ''}
                                        onChange={e => setNewVendor({ ...newVendor, longitude: Number(e.target.value) })}
                                        placeholder="77.23"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Address Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Navigation size={16} /> Physical Address
                            </div>

                            <div>
                                <label className={styles.label}>Full Street Address</label>
                                <textarea
                                    className={styles.glassTextarea}
                                    value={newVendor.address || ''}
                                    onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                                    placeholder="Enter the complete address for navigation purposes..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button type="submit" className={styles.submitBtn}>
                                <MapPin size={20} />
                                Confirm Registration
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AdminPageLayout>
    );
};
