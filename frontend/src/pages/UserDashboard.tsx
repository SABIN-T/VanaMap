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
                        String(v.id) === String((user as any)._id) ||
                        String((v as any)._id) === String(user.id)
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
                        <Zap size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{(user as any).points || 0}</span>
                        <span className={styles.statLabel}>Chlorophyll Points</span>
                        <div className={styles.statTrend} style={{ color: '#10b981' }}>
                            <TrendingUp size={12} /> +12% this week
                        </div>
                    </div>
                </div>

                {/* Rank Card */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', color: 'black' }}>
                        <Trophy size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>#{(user as any).points > 0 ? '4' : 'N/A'}</span>
                        <span className={styles.statLabel}>Global Ranking</span>
                        <div className={styles.statTrend} style={{ color: '#facc15' }}>
                            <Award size={12} /> Top {(user as any).points > 100 ? '5%' : 'Elite'}
                        </div>
                    </div>
                </div>

                {/* Impact Card */}
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                        <Wind size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{((favoritePlants.length || items.length) * 1.2).toFixed(1)} L</span>
                        <span className={styles.statLabel}>Daily Oxygen Production</span>
                        <div className={styles.statTrend} style={{ color: '#3b82f6' }}>
                            Net Positive Impact
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.dashboardTitle}>
                        Eco Dashboard
                    </h1>
                    <p className={styles.subtitle}>
                        Welcome back, {user.name}! You are making the world greener.
                    </p>
                </div>

                <div className={styles.actionGroup}>
                    <Button onClick={() => setShowPasswordModal(true)} variant="outline" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                        <Lock size={18} /> Update Security
                    </Button>

                    <Button onClick={() => navigate('/leaderboard')} variant="outline" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                        <Trophy size={18} /> Hall of Fame
                    </Button>

                    {user.role === 'vendor' && (
                        <Button onClick={() => navigate('/vendor')} variant="outline" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <Store size={18} /> Shop Portal
                        </Button>
                    )}

                    {user.role === 'admin' && (
                        <button
                            onClick={() => navigate('/admin')}
                            style={{
                                background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
                                color: 'black',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '14px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px rgba(234, 179, 8, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(234, 179, 8, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(234, 179, 8, 0.2)';
                            }}
                        >
                            <Shield size={20} />
                            ADMIN HUB
                        </button>
                    )}
                </div>
            </div>

            {user.role === 'admin' && (
                <div style={{
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: 'rgba(250, 204, 21, 0.05)',
                    border: '1px solid rgba(250, 204, 21, 0.2)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    animation: 'fadeInSlide 0.6s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#facc15', margin: 0 }}>System Management Active</h2>
                            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>You are currently authenticated as a global administrator.</p>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            ONLINE
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <Button
                            onClick={() => navigate('/admin')}
                            variant="primary"
                            style={{
                                background: '#facc15',
                                color: 'black',
                                fontWeight: 800,
                                height: '60px',
                                fontSize: '1rem'
                            }}
                        >
                            <Shield size={20} style={{ marginRight: '8px' }} /> Enter Admin Panel
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/manage-plants')}
                            variant="outline"
                            style={{ height: '60px', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            Manage Catalog
                        </Button>
                    </div>
                </div>
            )}

            <div className={styles.section}>
                {/* FAVORITES SECTION */}
                <section>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                            <Heart size={24} fill="#ef4444" />
                        </div>
                        <h2 className={styles.sectionTitle}>My Favorites</h2>
                        <span className={styles.badge} style={{ color: '#ef4444' }}>
                            {user.favorites?.length || 0}
                        </span>
                    </div>

                    {loadingFavs ? (
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem' }}>
                            <Loader2 className="animate-spin" /> Loading favorites...
                        </div>
                    ) : favoritePlants.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.5rem', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Heart size={48} color="#cbd5e1" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>No favorites yet</h3>
                            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>Heart plants as you browse to save them here.</p>
                            <Link to="/"><Button variant="outline">Browse Plants</Button></Link>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {favoritePlants.map(plant => (
                                <div key={plant.id} className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img src={plant.imageUrl} alt={plant.name} />
                                        <button
                                            onClick={() => handleRemoveFavorite(plant.id)}
                                            title="Remove from favorites"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'white',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            <Heart size={16} fill="#ef4444" color="#ef4444" />
                                        </button>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{plant.name}</h3>
                                        <p className={styles.cardSubtitle}>{plant.scientificName}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                                {(plant as any).waterNeeds || "Moderate"} Water
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className={styles.sideGrid}>
                    {/* WISHLIST / CART SECTION */}
                    <section>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                <ShoppingBag size={24} />
                            </div>
                            <h2 className={styles.sectionTitle}>Shopping List</h2>
                            <span className={styles.badge} style={{ color: '#38bdf8' }}>
                                {items.length}
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-muted)' }}>Your cart is empty.</p>
                                <Link to="/" style={{ display: 'inline-block', marginTop: '1rem' }}><Button variant="outline" size="sm">Add Items</Button></Link>
                            </div>
                        ) : (
                            <div className={styles.cartScrollBox} style={{ display: 'grid', gap: '1rem' }}>
                                {items.map(({ plant, quantity }) => (
                                    <div key={plant.id} className="glass-panel" style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '1rem', borderRadius: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img src={plant.imageUrl} alt={plant.name} style={{ width: '60px', height: '60px', borderRadius: '0.75rem', objectFit: 'cover' }} />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{plant.name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Qty: {quantity}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" style={{ background: '#ef4444', border: 'none', color: 'white' }} onClick={() => removeFromCart(plant.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                    <Link to="/cart"><Button variant="primary">Go to Cart <ArrowRight size={16} /></Button></Link>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Nearby Shops Section */}
                    <section>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon} style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15' }}>
                                <MapPin size={24} />
                            </div>
                            <h2 className={styles.sectionTitle}>Nearby Shops</h2>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                            <div style={{ background: 'url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80)', height: '150px', borderRadius: '1rem', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', borderRadius: '1rem', display: 'flex', alignItems: 'end', padding: '1rem' }}>
                                    <p style={{ margin: 0, fontWeight: 700 }}>Find Verified Nurseries</p>
                                </div>
                            </div>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                                Locate the best plant shops in your area with our interactive map integration.
                            </p>
                            <Link to="/nearby">
                                <Button variant="outline" style={{ width: '100%' }}>Open Map</Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
