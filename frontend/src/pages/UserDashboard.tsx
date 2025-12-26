import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, MapPin, Heart, ArrowRight, Loader2, Store, Shield, Lock, Trophy, Zap, TrendingUp, Wind, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants, fetchVendors, updateVendor, changePassword } from '../services/api';
import type { Plant, Vendor } from '../types';
import toast from 'react-hot-toast';
import styles from './UserDashboard.module.css';

export const UserDashboard = () => {
    const { items, removeFromCart } = useCart();
    const { user, loading, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    // Favorites State
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(true);

    // Vendor Onboarding State
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [detectingLoc, setDetectingLoc] = useState(false);
    const [myVendor, setMyVendor] = useState<Vendor | null>(null);
    const [vendorForm, setVendorForm] = useState({
        name: '',
        address: '',
        phone: '',
        latitude: 0,
        longitude: 0
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });

    useEffect(() => {
        const loadVendorData = async () => {
            if (user?.role === 'vendor') {
                try {
                    const vendors = await fetchVendors();
                    // Soft match on ID (mongo _id vs. string id)
                    // Robust matching for different ID formats (mongo _id vs. string id)
                    const vendor = vendors.find(v =>
                        String(v.id) === String(user.id) ||
                        String(v.id) === String(user._id) ||
                        String(v._id) === String(user.id)
                    );
                    if (vendor) {
                        setMyVendor(vendor);
                        setVendorForm(prev => ({
                            ...prev,
                            name: vendor.name,
                            address: vendor.address || '',
                            phone: vendor.phone || '',
                            latitude: vendor.latitude || 0,
                            longitude: vendor.longitude || 0
                        }));

                        // Prompt if location missing (essential for Nearby Shops)
                        if (!vendor.latitude || !vendor.longitude) {
                            navigate('/vendor');
                        }
                    }
                } catch (e) {
                    console.error("Vendor check failed", e);
                }
            }
        };
        loadVendorData();
    }, [user]);

    const detectLocation = () => {
        setDetectingLoc(true);
        if (!navigator.geolocation) {
            toast.error("GPS not supported");
            setDetectingLoc(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setVendorForm(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
                setDetectingLoc(false);
                toast.success("Location detected!");
            },
            (err) => {
                console.error(err);
                toast.error("Could not fetch location");
                setDetectingLoc(false);
            }
        );
    };

    const submitVendorProfile = async () => {
        if (!myVendor) return;
        const tid = toast.loading("Updating shop profile...");
        try {
            const updated = await updateVendor(myVendor.id, {
                ...vendorForm,
                verified: false // Admin approval required now
            });

            if (updated) {
                toast.success("Profile submitted! Awaiting Admin verification.", { id: tid });
                setShowVendorModal(false);
            } else {
                toast.error("Failed to update profile", { id: tid });
            }
        } catch (e) {
            toast.error("Network error saving profile", { id: tid });
        }
    };



    useEffect(() => {
        const loadData = async () => {
            if (user) {
                setLoadingFavs(true);
                try {
                    const plants = await fetchPlants();
                    setAllPlants(plants);
                } catch (e) {
                    console.error("Failed to load plants", e);
                } finally {
                    setLoadingFavs(false);
                }
            }
        };
        loadData();
    }, [user?.email]); // Only reload if user email changes, simplified dependency

    // Compute favorites from allPlants based on user.favorites IDs
    const favoritePlants = allPlants.filter(p => user?.favorites?.includes(p.id));

    const handleRemoveFavorite = (plantId: string) => {
        if (!user) return;
        toggleFavorite(plantId); // Context handles optimistic update & API
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwdForm.new !== pwdForm.confirm) {
            toast.error("New passwords do not match!");
            return;
        }
        const tid = toast.loading("Updating security key...");
        try {
            const res = await changePassword(pwdForm.old, pwdForm.new);
            if (res.success) {
                toast.success("Password Updated Successfully!", { id: tid });
                setShowPasswordModal(false);
                setPwdForm({ old: '', new: '', confirm: '' });
            } else {
                toast.error(res.error || "Failed to update", { id: tid });
            }
        } catch (err) {
            toast.error("System error updating password", { id: tid });
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="pre-loader-pulse"></div>
            </div>
        );
    }

    if (!user) {
        navigate('/auth');
        return null;
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            {/* VENDOR ONBOARDING MODAL */}
            {showVendorModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        width: '100%', maxWidth: '500px',
                        background: 'var(--color-bg-card)', border: '1px solid var(--glass-border)',
                        borderRadius: '1.5rem', padding: '2rem',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                                <Store size={32} color="#facc15" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Register Your Shop</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                To appear on the "Nearby Shops" map, we need your exact location.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shop Name</label>
                                <input
                                    type="text"
                                    value={vendorForm.name}
                                    onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.8rem', borderRadius: '0.75rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        color: 'var(--color-text-main)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Phone / WhatsApp</label>
                                <input
                                    type="text"
                                    value={vendorForm.phone}
                                    placeholder="+91..."
                                    onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.8rem', borderRadius: '0.75rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        color: 'var(--color-text-main)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Store Coordinates (GPS)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Latitude"
                                        value={vendorForm.latitude || ''}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'var(--color-text-muted)' }}
                                    />
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Longitude"
                                        value={vendorForm.longitude || ''}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'var(--color-text-muted)' }}
                                    />
                                </div>
                                <Button
                                    onClick={detectLocation}
                                    disabled={detectingLoc}
                                    variant="outline"
                                    style={{
                                        width: '100%', marginTop: '0.5rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                    }}
                                >
                                    {detectingLoc ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                                    {vendorForm.latitude ? 'Update GPS Location' : 'Auto-Detect My Shop Location'}
                                </Button>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Address</label>
                                <textarea
                                    value={vendorForm.address}
                                    onChange={e => setVendorForm({ ...vendorForm, address: e.target.value })}
                                    placeholder="Street, City, Landmark..."
                                    style={{
                                        width: '100%', padding: '0.8rem', borderRadius: '0.75rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        color: 'var(--color-text-main)', minHeight: '80px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <Button
                                variant="outline"
                                onClick={() => setShowVendorModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={submitVendorProfile}
                                disabled={!vendorForm.latitude || !vendorForm.name}
                                style={{ flex: 2, background: 'var(--color-primary)', color: 'white' }}
                            >
                                Save & Go Live
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* PASSWORD RESET MODAL */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1001,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="glass-panel" style={{
                        width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div className={styles.passwordModalIcon}>
                                <Lock size={28} />
                            </div>
                            <h2 className={styles.passwordModalTitle}>Update Security</h2>
                            <p className={styles.passwordModalSubtitle}>Change your account password</p>
                        </div>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Current Password</label>
                                <input
                                    type="password" required
                                    value={pwdForm.old}
                                    onChange={e => setPwdForm({ ...pwdForm, old: e.target.value })}
                                    style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>New Password</label>
                                <input
                                    type="password" required
                                    value={pwdForm.new}
                                    onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })}
                                    style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Confirm New Password</label>
                                <input
                                    type="password" required
                                    value={pwdForm.confirm}
                                    onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                                    style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} style={{ flex: 1 }}>Cancel</Button>
                                <Button type="submit" variant="primary" style={{ flex: 2 }}>Update Now</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PREMIUM STATS BOARD */}
            <div className={styles.statsBoard}>
                {/* Points Card */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        <Zap size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{user.points || 0}</div>
                        <div className={styles.statLabel}>Points</div>
                    </div>
                    <div className={styles.statTrend} style={{ color: '#10b981' }}>
                        <TrendingUp size={12} /> +12%
                    </div>
                </div>

                {/* Rank Card */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', color: 'black' }}>
                        <Trophy size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{user.points && user.points > 0 ? '#4' : 'N/A'}</div>
                        <div className={styles.statLabel}>Ranking</div>
                    </div>
                    <div className={styles.statTrend} style={{ color: '#facc15' }}>
                        <Award size={12} /> Elite
                    </div>
                </div>

                {/* Impact Card */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                        <Wind size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{((favoritePlants.length || items.length) * 1.2).toFixed(1)}L</div>
                        <div className={styles.statLabel}>Oxygen</div>
                    </div>
                    <div className={styles.statTrend} style={{ color: '#3b82f6' }}>
                        Positive
                    </div>
                </div>
            </div>

            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <div className={styles.welcomeTag}>VANAMAP ECOSYSTEM</div>
                    <h1 className={styles.dashboardTitle}>
                        Hello, {user.name.split(' ')[0]}!
                    </h1>
                </div>

                <div className={styles.actionGroup}>
                    <button onClick={() => setShowPasswordModal(true)} className={styles.iconActionBtn} title="Security Settings">
                        <Lock size={18} />
                    </button>

                    <button onClick={() => navigate('/leaderboard')} className={styles.iconActionBtn} title="Leaderboard">
                        <Trophy size={18} />
                    </button>

                    {user.role === 'vendor' && (
                        <Button onClick={() => navigate('/vendor')} variant="primary" size="sm" style={{ padding: '0.6rem 1.2rem', borderRadius: '0.75rem' }}>
                            <Store size={18} /> Shop Portal
                        </Button>
                    )}

                    {user.role === 'admin' && (
                        <button
                            onClick={() => navigate('/admin')}
                            className={styles.adminHubBtn}
                        >
                            <Shield size={18} />
                            ADMIN
                        </button>
                    )}
                </div>
            </div>

            {user.role === 'admin' && (
                <div className={styles.adminMiniPanel}>
                    <div className={styles.adminMiniHeader}>
                        <div className={styles.adminStatus}>• System Root Active</div>
                        <Button onClick={() => navigate('/admin')} variant="outline" size="sm" style={{ fontSize: '0.7rem', height: '30px', padding: '0 12px' }}>
                            Open Panel
                        </Button>
                    </div>
                </div>
            )}

            <div className={styles.mainGrid}>
                {/* FAVORITES SECTION */}
                <section className={styles.dashboardSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Collection</h2>
                        <span className={styles.sectionCount}>{user.favorites?.length || 0}</span>
                    </div>

                    {loadingFavs ? (
                        <div className={styles.loadingBox}>
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : favoritePlants.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Heart size={32} />
                            <p>No favorites yet</p>
                            <Link to="/"><Button variant="outline" size="sm">Explore</Button></Link>
                        </div>
                    ) : (
                        <div className={styles.compactGrid}>
                            {favoritePlants.map(plant => (
                                <div key={plant.id} className={styles.compactCard}>
                                    <div className={styles.compactCardImage}>
                                        <img src={plant.imageUrl} alt={plant.name} />
                                        <button
                                            onClick={() => handleRemoveFavorite(plant.id)}
                                            className={styles.removeFavBtn}
                                        >
                                            <Heart size={14} fill="#ef4444" color="#ef4444" />
                                        </button>
                                    </div>
                                    <div className={styles.compactCardContent}>
                                        <h3>{plant.name}</h3>
                                        <p>{plant.scientificName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <aside className={styles.dashboardSidebar}>
                    {/* WISHLIST / CART SECTION */}
                    <section className={styles.dashboardSection} style={{ marginBottom: '2rem' }}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Cart Items</h2>
                            <span className={styles.sectionCount} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>{items.length}</span>
                        </div>

                        {items.length === 0 ? (
                            <div className={styles.emptySidebarState}>
                                <ShoppingBag size={24} />
                                <p>Cart is empty</p>
                            </div>
                        ) : (
                            <div className={styles.cartList}>
                                {items.slice(0, 3).map(({ plant }) => (
                                    <div key={plant.id} className={styles.cartItemMini}>
                                        <img src={plant.imageUrl} alt={plant.name} />
                                        <div className={styles.cartItemInfo}>
                                            <h4>{plant.name}</h4>
                                        </div>
                                        <button onClick={() => removeFromCart(plant.id)} className={styles.cartRemoveBtn}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {items.length > 3 && <p className={styles.moreItems}>+{items.length - 3} more items</p>}
                                <Link to="/cart" className={styles.sidebarActionLink}>
                                    View Full Cart <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Nearby Shops Section */}
                    <section className={styles.dashboardSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Nearby Shops</h2>
                        </div>
                        <div className={styles.shopPreviewCard}>
                            <div className={styles.shopPreviewImage}>
                                <div className={styles.shopPreviewOverlay}>
                                    <MapPin size={24} />
                                    <span>Find Nurseries</span>
                                </div>
                            </div>
                            <Link to="/nearby">
                                <Button variant="primary" style={{ width: '100%', borderRadius: '0.75rem' }}>Open interactive Map</Button>
                            </Link>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};
