import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { Store, MessageCircle, Info, Locate, BadgeCheck, ShoppingBag, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor, fetchVendorAnalytics } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import type { LatLng } from 'leaflet';
import type { Vendor } from '../types';
import { VendorInventory } from '../components/features/vendor/VendorInventory';
import { MarketInsights } from '../components/features/vendor/MarketInsights';
import { VendorPortalLayout } from './VendorPortalLayout';
import styles from './VendorPortal.module.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
                    if (marker != null) { setPos(marker.getLatLng()); toast.success("Location updated!"); }
                },
            }}
            position={pos}
        >
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
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [markerPos, setMarkerPos] = useState<L.LatLng>(new L.LatLng(20.5937, 78.9629));
    const [isEditing, setIsEditing] = useState(false);
    const [existingVendorId, setExistingVendorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);

    const [formData, setFormData] = useState({ shopName: '', phone: '', whatsapp: '', address: '' });

    const activeSection = useMemo(() => {
        const path = location.pathname;
        if (path.endsWith('/inventory')) return 'inventory';
        if (path.endsWith('/insights')) return 'insights';
        if (path.endsWith('/profile')) return 'profile';
        return 'overview';
    }, [location.pathname]);

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
            if (myVendor.latitude && myVendor.longitude) setMarkerPos(new L.LatLng(myVendor.latitude, myVendor.longitude));

            // Fetch real-time analytics
            try {
                const stats = await fetchVendorAnalytics(myVendor.id);
                setAnalytics(stats);
            } catch (e) { console.error(e); }
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === 'vendor' || user?.role === 'admin') loadVendorData();
    }, [user, loadVendorData]);

    const handleAutoLocate = useCallback(() => {
        if (isLocating) return;
        setIsLocating(true);
        const tid = toast.loading("Accessing GPS...");
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported", { id: tid });
            setIsLocating(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
                setMarkerPos(newPos);
                toast.success("Location captured!", { id: tid });
                setIsLocating(false);
            },
            () => { toast.error("GPS failed. Pin manually.", { id: tid }); setIsLocating(false); },
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
            verified: isEditing
        };
        try {
            if (isEditing && existingVendorId) {
                await updateVendor(existingVendorId, vendorData);
                toast.success("Profile Updated!");
            } else {
                const result = await registerVendor(vendorData);
                if (result) { toast.success("Shop Registered!"); setIsEditing(true); }
            }
        } catch (err) { toast.error("Process failed."); }
        finally { setLoading(false); }
    };

    const getTitle = () => {
        switch (activeSection) {
            case 'inventory': return 'Catalog Manager';
            case 'insights': return 'Performance Data';
            case 'profile': return 'Shop Settings';
            default: return 'Partner Overview';
        }
    };

    return (
        <VendorPortalLayout title={getTitle()}>
            <div className={styles.portalContainer}>
                {/* SECTION: OVERVIEW */}
                {activeSection === 'overview' && (
                    <>
                        {!isEditing ? (
                            <div className={styles.formCard} style={{ textAlign: 'center', padding: '3rem' }}>
                                <Store size={48} style={{ color: '#facc15', margin: '0 auto 1.5rem' }} />
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Welcome to Partner Network</h2>
                                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 2rem' }}>
                                    Register your nursery to start showcasing your plant collection to thousands of local enthusiasts.
                                </p>
                                <Button onClick={() => window.location.href = '/vendor/profile'} style={{ background: '#facc15', color: '#000', fontWeight: 800 }}>
                                    Start Registration
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <div className={styles.statValue}>{currentVendor?.inventory?.length || 0}</div>
                                            <div className={styles.statLabel}>Added Plants</div>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15' }}>
                                            <ShoppingCart size={24} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <div className={styles.statValue}>{analytics?.itemsSold || 0}</div>
                                            <div className={styles.statLabel}>Purchased Units</div>
                                        </div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                            <DollarSign size={24} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <div className={styles.statValue}>₹{analytics?.revenue?.toLocaleString() || 0}</div>
                                            <div className={styles.statLabel}>Total Earnings</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.verifiedBanner}>
                                    <div className={styles.verifiedInfo}>
                                        <div className={styles.verifiedIconBox}><BadgeCheck size={20} /></div>
                                        <div>
                                            <div className={styles.verifiedTitle}>Legacy Status: {currentVendor?.verified ? 'Verified Partner' : 'Verification Under Review'}</div>
                                            <p className={styles.verifiedText}>Complete your inventory to boost your visibility score.</p>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => window.open('https://wa.me/9188773534', '_blank')} style={{ background: '#25D366', border: 'none' }}>
                                        <MessageCircle size={16} /> WhatsApp Support
                                    </Button>
                                </div>

                                <div className={styles.earningsChartCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>Your Catalog Highlights</h3>
                                        <button onClick={() => navigate('/vendor/inventory')} className={styles.viewAllBtn}>
                                            Manage All <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <div className={styles.catalogGrid}>
                                        {currentVendor?.inventory?.slice(0, 4).map((item: any, idx: number) => (
                                            <div key={idx} className={styles.miniPlantCard}>
                                                <div className={styles.miniThumbBox}>
                                                    <div className={styles.miniPlantId}>#{item.plantId.slice(-4)}</div>
                                                </div>
                                                <div className={styles.miniPlantInfo}>
                                                    <div className={styles.miniPlantPrice}>₹{item.price}</div>
                                                    <div className={item.inStock ? styles.miniStockIn : styles.miniStockOut}>
                                                        {item.inStock ? 'In Stock' : 'Sold Out'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!currentVendor?.inventory || currentVendor.inventory.length === 0) && (
                                            <div className={styles.emptyCatalog}>
                                                No plants added yet. <span onClick={() => navigate('/vendor/inventory')}>Start listing →</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <MarketInsights vendorId={currentVendor?.id || ''} />
                            </>
                        )}
                    </>
                )}

                {/* SECTION: INVENTORY */}
                {activeSection === 'inventory' && currentVendor && (
                    <VendorInventory vendor={currentVendor} onUpdate={loadVendorData} />
                )}

                {/* SECTION: INSIGHTS */}
                {activeSection === 'insights' && (
                    <div className={styles.insightsWrapper}>
                        <MarketInsights vendorId={currentVendor?.id || ''} />
                    </div>
                )}

                {/* SECTION: PROFILE / SETTINGS */}
                {activeSection === 'profile' && (
                    <div className={styles.formGrid}>
                        <form onSubmit={handleSubmit} className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <Store size={20} />
                                <h2>Shop Profile</h2>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nursery Name</label>
                                <input type="text" required className={styles.input} value={formData.shopName} onChange={e => setFormData({ ...formData, shopName: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone</label>
                                    <input type="tel" className={styles.input} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>WhatsApp</label>
                                    <input type="tel" className={styles.input} value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Address</label>
                                <textarea rows={2} className={styles.textarea} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className={styles.coordsBox}>
                                <div className={styles.coordValue}>{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}</div>
                                <button type="button" onClick={handleAutoLocate} disabled={isLocating} className={styles.gpsBtn}>
                                    <Locate size={14} /> {isLocating ? '...' : 'Use GPS'}
                                </button>
                            </div>
                            <Button type="submit" disabled={loading} style={{ width: '100%', borderRadius: '0.85rem' }}>
                                {loading ? 'Syncing...' : 'Save Profile Changes'}
                            </Button>
                        </form>

                        <div className={styles.mapWrapper}>
                            <div className={styles.mapContainer}>
                                <MapContainer center={markerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <DraggableMarker pos={markerPos} setPos={setMarkerPos} />
                                    <RecenterMap center={markerPos} />
                                </MapContainer>
                            </div>
                            <div className={styles.formCard} style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                                    <Info size={14} />
                                    <span>Drag marker to your shop's main entrance for precision navigation.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VendorPortalLayout>
    );
};
