import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import {
    Store, Locate, Info, ArrowRight, Package,
    ShoppingBag, ShoppingCart, DollarSign, ShieldCheck, ExternalLink,
    MessageCircle, CheckCircle, Clock, QrCode, BarChart2, TrendingUp, Shield
} from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor, fetchVendorAnalytics } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import type { LatLng } from 'leaflet';
import type { Vendor } from '../types';
import { VendorInventory } from '../components/features/vendor/VendorInventory';
import { MarketInsights } from '../components/features/vendor/MarketInsights';
import { GrowthTools } from '../components/features/vendor/GrowthTools';
import { PaymentSettings } from '../components/features/vendor/PaymentSettings';
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
        if (path.endsWith('/growth')) return 'growth';
        if (path.endsWith('/payments')) return 'payments';
        if (path.endsWith('/profile')) return 'profile';
        return 'overview';
    }, [location.pathname]);

    const loadVendorData = useCallback(async () => {
        try {
            const vendors = await fetchVendors();
            if (!user) return;

            // Match vendor by ownerEmail (primary) or fallback to ID matching
            const myVendor = vendors.find(v =>
                v.ownerEmail === user.email ||
                v.id === user.id ||
                v.id === (user as any)._id
            );

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
        } catch (error) {
            console.error("Failed to load vendor data:", error);
        }
    }, [user]);

    useEffect(() => {
        // Load data even if role is 'user', as they might be a pending vendor
        if (user) loadVendorData();
    }, [user, loadVendorData]);

    const fetchAnalytics = async () => {
        if (!existingVendorId) return;
        try {
            const data = await fetchVendorAnalytics(existingVendorId);
            setAnalytics(data);
        } catch (e) {
            console.error("Failed to load analytics", e);
        }
    };

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

    const [showSuccessStep, setShowSuccessStep] = useState(false);

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
            verified: isEditing,
            ownerEmail: user?.email
        };
        try {
            if (isEditing && existingVendorId) {
                await updateVendor(existingVendorId, vendorData, true); // true = self-update
                toast.success("Profile Updated!");
                setShowSuccessStep(true);
            } else {
                const result = await registerVendor(vendorData);
                if (result) {
                    toast.success("Shop Registered!");
                    setIsEditing(true);
                    setShowSuccessStep(true);
                }
            }
        } catch (err: any) {
            // Check if error is due to verification requirement
            if (err.response?.data?.requiresVerification) {
                toast.error(
                    err.response.data.message || "Please verify your email or phone before registering as a vendor",
                    { duration: 5000 }
                );
                // Optionally redirect to verification page
                navigate('/user?tab=verification');
            } else {
                toast.error(err.message || "Process failed.");
            }
        }
        finally { setLoading(false); }
    };

    // Reset success step on navigation
    useEffect(() => {
        setShowSuccessStep(false);
    }, [activeSection]);

    const getTitle = () => {
        switch (activeSection) {
            case 'inventory': return 'Catalog Manager';
            case 'insights': return 'Performance Data';
            case 'growth': return 'Growth Engine';
            case 'profile': return 'Shop Settings';
            default: return 'Partner Overview';
        }
    };

    return (
        <VendorPortalLayout title={getTitle()}>
            <div className={styles.portalContainer}>
                {/* SECTION: INVENTORY */}
                {activeSection === 'inventory' && currentVendor && (
                    <VendorInventory
                        vendor={currentVendor}
                        onUpdate={() => { loadVendorData(); fetchAnalytics(); }}
                    />
                )}

                {/* SECTION: INSIGHTS */}
                {activeSection === 'insights' && (
                    <MarketInsights analytics={analytics} />
                )}

                {/* SECTION: GROWTH TOOLS */}
                {activeSection === 'growth' && <GrowthTools vendorId={currentVendor?.id || ''} />}

                {/* SECTION: PAYMENTS */}
                {activeSection === 'payments' && <PaymentSettings vendorId={currentVendor?.id || ''} />}

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

                                {/* Verification Warning */}
                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '12px',
                                    padding: '1rem 1.5rem',
                                    margin: '0 auto 1.5rem',
                                    maxWidth: '500px',
                                    textAlign: 'left'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <Shield size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 700 }}>
                                                ⚠️ Verification Required
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                                                To register as a vendor, you must verify your <strong>email</strong> or <strong>phone number</strong> first.
                                                Email verification is recommended for receiving important notifications.
                                            </p>
                                            {user && !user.emailVerified && !user.phoneVerified && (
                                                <Button
                                                    onClick={() => navigate('/user?tab=verification')}
                                                    size="sm"
                                                    variant="outline"
                                                    style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}
                                                >
                                                    Verify Now →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={() => navigate('/vendor/profile')} style={{ background: '#facc15', color: '#000', fontWeight: 800 }}>
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
                                        <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                            <DollarSign size={24} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <div className={styles.statValue}>₹{analytics?.revenue?.toLocaleString() || 0}</div>
                                            <div className={styles.statLabel}>Total Earnings</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Navigation Grid */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                    gap: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem'
                                }}>
                                    {[
                                        { label: 'Inventory', icon: Package, path: '/vendor/inventory', color: '#3b82f6' },
                                        { label: 'Insights', icon: BarChart2, path: '/vendor/insights', color: '#a855f7' },
                                        { label: 'Growth', icon: TrendingUp, path: '/vendor/growth', color: '#facc15' },
                                        { label: 'Payments', icon: DollarSign, path: '/vendor/payments', color: '#10b981' },
                                        { label: 'Settings', icon: Store, path: '/vendor/profile', color: '#64748b' },
                                    ].map((action, i) => (
                                        <div
                                            key={i}
                                            onClick={() => navigate(action.path)}
                                            style={{
                                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                        >
                                            <div style={{ padding: '0.5rem', borderRadius: '50%', background: `${action.color}20`, color: action.color }}>
                                                <action.icon size={20} />
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{action.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.verifiedBanner}>
                                    <div className={styles.verifiedInfo}>
                                        <div className={styles.verifiedIcon}>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Verified Partner</h3>
                                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Your nursery is live and visible to local plant enthusiasts.</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/nearby')}
                                        style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', gap: '0.5rem' }}
                                    >
                                        <ExternalLink size={14} /> View Public Shop
                                    </Button>
                                    <Button size="sm" onClick={() => window.open('https://wa.me/9188773534', '_blank')} style={{ background: '#25D366', border: 'none' }}>
                                        <MessageCircle size={16} /> WhatsApp Support
                                    </Button>
                                </div>

                                {/* QR Code Quick Access */}
                                <div className={styles.verifiedBanner} style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
                                    <div className={styles.verifiedInfo}>
                                        <div className={styles.verifiedIcon} style={{ background: 'rgba(255,255,255,0.2)' }}>
                                            <QrCode size={20} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Physical Shop QR Code</h3>
                                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Download your official VanaMap signage for walk-in customers.</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => navigate('/vendor/growth')}
                                        style={{ background: 'white', color: '#4f46e5', fontWeight: 700 }}
                                    >
                                        Get QR Code
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

                                <MarketInsights analytics={analytics} />
                            </>
                        )}
                    </>
                )}

                {/* SECTION: PROFILE / SETTINGS */}
                {activeSection === 'profile' && (
                    <>
                        {showSuccessStep ? (
                            <div className={styles.successScreen}>
                                <div className={styles.successPulse}>
                                    <CheckCircle size={80} color="#10b981" />
                                </div>
                                <h2 className={styles.successTitle}>Profile Synchronized!</h2>
                                <p className={styles.successSubtitle}>
                                    Your shop data has been secured and broadcasted to our botanical network.
                                </p>

                                <div className={styles.roadmapCard}>
                                    <h3 className={styles.roadmapHeading}>🚀 Next Recommended Steps</h3>
                                    <div className={styles.roadmapList}>
                                        <div className={styles.roadmapItem}>
                                            <div className={styles.roadmapIcon}><Package size={18} /></div>
                                            <div className={styles.roadmapContent}>
                                                <strong>Add Your Catalog</strong>
                                                <p>Populate your inventory with at least 5 plant species to increase shop visibility.</p>
                                            </div>
                                        </div>
                                        <div className={styles.roadmapItem}>
                                            <div className={styles.roadmapIcon}><Locate size={18} /></div>
                                            <div className={styles.roadmapContent}>
                                                <strong>Geofence Verification</strong>
                                                <p>Ensure your GPS pin is accurate for "Nearby" search results in your city.</p>
                                            </div>
                                        </div>
                                        <div className={styles.roadmapItem}>
                                            <div className={styles.roadmapIcon}><Clock size={18} /></div>
                                            <div className={styles.roadmapContent}>
                                                <strong>Registration: Review Pending</strong>
                                                <p>Your shop details have been saved. You will receive an automated approval email at <strong>{user?.email}</strong> once verified by the VanaMap team.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate('/vendor/inventory')}
                                    style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 800, borderRadius: '1rem' }}
                                >
                                    Manage Inventory <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                                </Button>
                            </div>
                        ) : (
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
                    </>
                )}
            </div>
        </VendorPortalLayout>
    );
};
