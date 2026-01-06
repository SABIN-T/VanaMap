import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { ShoppingBag, MapPin, Heart, ArrowRight, Loader2, Store, Shield, Lock, Trophy, Zap, TrendingUp, Wind, Award, HelpCircle, CheckCircle } from 'lucide-react';
import { VerificationModal } from '../components/auth/VerificationModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants, fetchVendors, updateVendor, changePassword, fetchLeaderboard } from '../services/api';
import type { Plant, Vendor } from '../types';
import toast from 'react-hot-toast';
import styles from './UserDashboard.module.css';

export const UserDashboard = () => {
    const { user, toggleFavorite, loading } = useAuth(); // Restored loading from context
    const { items } = useCart(); // Only items needed from CartContext
    const navigate = useNavigate();

    const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    // Favorites & Data State
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(false);
    const [rank, setRank] = useState<number | null>(null);

    // Vendor Onboarding State
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [myVendor, setMyVendor] = useState<Vendor | null>(null);
    const [vendorForm, setVendorForm] = useState<{ name: string, phone: string, address: string, latitude: number | null, longitude: number | null }>({
        name: '', phone: '', address: '', latitude: null, longitude: null
    });
    const [detectingLoc, setDetectingLoc] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);

    // Verification State
    // Verification State
    const [verStatus, setVerStatus] = useState({ email: false, phone: false });
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const isFullyVerified = verStatus.email && verStatus.phone;

    // Check verification status
    useEffect(() => {
        const checkVerification = async () => {
            if (!user) return;
            try {
                const savedUser = localStorage.getItem('user');
                const token = savedUser ? JSON.parse(savedUser).token : null;
                if (!token) return;

                const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/verification-status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                console.log("[VERIFY DEBUG] Status:", data);

                // If Google Auth, assume email is verified
                const emailVerified = data.emailVerified || (user as any).googleAuth;
                setVerStatus({ email: !!emailVerified, phone: !!data.phoneVerified });
            } catch (e) {
                console.error("Failed to check verification", e);
            }
        };
        checkVerification();
    }, [user]);

    // Redirect if not logged in - Handle purely with useEffect to avoid conditional returns before hooks
    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Fetch Rank
    useEffect(() => {
        const getRank = async () => {
            if (!user) return;
            try {
                const leaderboard = await fetchLeaderboard();
                if (Array.isArray(leaderboard)) {
                    // Sort descending just to be safe, though backend might already do it
                    const sorted = leaderboard.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
                    const myRankIndex = sorted.findIndex((u: any) => u.id === user.id || u._id === user.id);
                    if (myRankIndex !== -1) {
                        setRank(myRankIndex + 1);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch rank", error);
            }
        };
        getRank();
    }, [user]);

    useEffect(() => {
        const loadVendorData = async () => {
            if (user?.role === 'vendor') {
                try {
                    const vendors = await fetchVendors();
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
                            latitude: vendor.latitude || 0, // Fallback to 0 if undefined
                            longitude: vendor.longitude || 0
                        }));

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
    }, [user, navigate]);

    const detectLocation = () => {
        setDetectingLoc(true);
        const performIPFallback = async (reason: string) => {
            console.warn(`Dashboard GPS fail: ${reason}. Trying IP fallback...`);
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.latitude && data.longitude) {
                    setVendorForm(prev => ({
                        ...prev,
                        latitude: data.latitude,
                        longitude: data.longitude
                    }));
                    toast.success(`Detected approx location: ${data.city || "Success"}!`);
                } else {
                    toast.error("Could not detect location automatically.");
                }
            } catch {
                toast.error("Location detection failed. Please enter coordinates manually.");
            } finally {
                setDetectingLoc(false);
            }
        };

        if (!navigator.geolocation) {
            performIPFallback("GPS not supported");
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
                toast.success("GPS Location detected!");
            },
            (err) => {
                let msg = "GPS access denied.";
                if (err.code === 3) msg = "Location timeout.";
                if (err.code === 2) msg = "Location unavailable.";
                performIPFallback(msg);
            }
        );
    };

    const submitVendorProfile = async () => {
        if (!myVendor) return;
        const tid = toast.loading("Updating shop profile...");
        try {
            // Fix type mismatch: Convert null to undefined for Vendor type
            const updatePayload: Partial<Vendor> = {
                ...vendorForm,
                latitude: vendorForm.latitude ?? undefined,
                longitude: vendorForm.longitude ?? undefined,
                verified: false
            };

            const updated = await updateVendor(myVendor.id, updatePayload);

            if (updated) {
                toast.success("Profile submitted! Awaiting Admin verification.", { id: tid });
                setShowVendorModal(false);
            } else {
                toast.error("Failed to update profile", { id: tid });
            }
        } catch {
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
    }, [user]); // Only reload if user email changes, simplified dependency

    // Compute favorites from allPlants based on user.favorites IDs
    const favoritePlants = allPlants.filter(p => user?.favorites?.includes(p.id));

    const handleRemoveFavorite = (plantId: string) => {
        if (!user) return;
        toggleFavorite(plantId); // Context handles optimistic update & API
    };

    // Gamification Logic - Always Active

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
        } catch {
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

    if (!user) return null;

    return (
        <div className={styles.container}>
            {/* GAMIFICATION NOTICE BANNER - PERMANENT */}
            <div style={{
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                position: 'relative',
                animation: 'slideDown 0.4s ease-out'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: '#facc15', padding: '0.4rem', borderRadius: '50%', color: 'black' }}>
                            <Trophy size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Grow Your Impact!</h3>
                    </div>
                    {/* Close button removed for permanent display */}
                </div>

                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Welcome back! Here is how your stats work:
                    <br />
                    <span style={{ color: '#facc15' }}>• Points:</span> Earned by visiting & collecting plants.
                    <br />
                    <span style={{ color: '#38bdf8' }}>• Ranking:</span> Increases automatically as you gain points.
                    <br />
                    <span style={{ color: '#10b981' }}>• Oxygen:</span> Directly tied to the "Air Purifying" efficiency of your plant collection.
                </p>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowGuide(true)}
                    style={{ alignSelf: 'flex-start', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                    View Full Level-Up Guide <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </Button>
            </div>

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
                        <div className={styles.statValue}>{rank ? `#${rank}` : 'N/A'}</div>
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

                {/* Permissions Card */}
                <div className={styles.statCard} onClick={() => window.dispatchEvent(new CustomEvent('toggleVanaPermissions'))} style={{ cursor: 'pointer', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)', color: 'white' }}>
                        <Shield size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue} style={{ fontSize: '0.9rem' }}>Privacy</div>
                        <div className={styles.statLabel}>System Access</div>
                    </div>
                    <div className={styles.statTrend} style={{ color: '#10b981' }}>
                        Manage
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

                    {isFullyVerified ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            padding: '0.6rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 600,
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            <CheckCircle size={16} /> Verified
                        </div>
                    ) : (
                        <Button
                            onClick={() => setShowVerifyModal(true)}
                            variant="primary"
                            size="sm"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                padding: '0.6rem 1rem',
                                fontSize: '0.85rem'
                            }}
                        >
                            Verify {verStatus.email ? 'Phone' : 'Account'} ⚠️
                        </Button>
                    )}

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

                    <button onClick={() => setShowGuide(true)} className={styles.iconActionBtn} title="How to Level Up?" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.1)' }}>
                        <HelpCircle size={18} />
                    </button>
                </div>
            </div>

            {/* GAMIFICATION GUIDE MODAL */}
            {showGuide && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1001,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setShowGuide(false)}>
                    <div className="glass-panel" style={{
                        width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Zap className="text-yellow-400" /> Level Up Guide
                            </h2>
                            <button onClick={() => setShowGuide(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><span style={{ fontSize: '1.5rem' }}>×</span></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#facc15', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={16} /> How to earn Points?</h3>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    <li>Add plants to your <strong>Favorites</strong> (+10 pts)</li>
                                    <li>Add items to your <strong>Cart</strong> (+5 pts)</li>
                                    <li>Visit the app daily (+2 pts)</li>
                                    <li>Complete your profile (+50 pts)</li>
                                </ul>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={16} /> Ranking System</h3>
                                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Your rank is determined by your total points.
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', fontSize: '0.8rem' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>0-100: Seed</span>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>100+: Sprout</span>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15' }}>500+: Elite</span>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wind size={16} /> Increasing Oxygen</h3>
                                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    The Oxygen level represents the cumulative air-purifying impact of your plant collection.
                                    <br /><br />
                                    <strong>Tip:</strong> Add high-oxygen plants like <em>Clean Air</em> varieties to boost this stat massively!
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Button variant="primary" onClick={() => setShowGuide(false)} style={{ width: '100%' }}>Got it! Time to Grow 🌱</Button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* MAIN ACTION GRID (Cleaned up from lists) */}
            <div className={styles.actionGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

                {/* 1. HALL OF FAME BUTTON */}
                <div onClick={() => navigate('/leaderboard')} className={styles.actionCard} style={{
                    background: 'linear-gradient(145deg, rgba(250, 204, 21, 0.1), rgba(0,0,0,0.2))',
                    border: '1px solid rgba(250, 204, 21, 0.2)',
                    padding: '1.5rem', borderRadius: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                }}>
                    <div style={{ background: 'rgba(250, 204, 21, 0.2)', padding: '1rem', borderRadius: '50%', color: '#facc15' }}>
                        <Trophy size={28} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>Hall of Fame</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>View Top Rankers</p>
                    </div>
                </div>

                {/* 2. COLLECTION BUTTON */}
                <div onClick={() => setShowCollectionModal(true)} className={styles.actionCard} style={{
                    background: 'linear-gradient(145deg, rgba(244, 63, 94, 0.1), rgba(0,0,0,0.2))',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    padding: '1.5rem', borderRadius: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                }}>
                    <div style={{ background: 'rgba(244, 63, 94, 0.2)', padding: '1rem', borderRadius: '50%', color: '#f43f5e' }}>
                        <Heart size={28} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>Collection</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{user.favorites?.length || 0} Saved Items</p>
                    </div>
                </div>

                {/* 3. CART BUTTON */}
                <div onClick={() => navigate('/cart')} className={styles.actionCard} style={{
                    background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.1), rgba(0,0,0,0.2))',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    padding: '1.5rem', borderRadius: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '50%', color: '#38bdf8' }}>
                        <ShoppingBag size={28} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>My Cart</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{items.length} Items Pending</p>
                    </div>
                </div>
            </div>

            {/* NEARBY SHOPS PREVIEW - PRESERVED BUT FULL WIDTH */}
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

            {/* COLLECTION MODAL (WINDOW) */}
            {showCollectionModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1005,
                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)',
                    display: 'flex', flexDirection: 'column',
                    animation: 'fadeIn 0.2s'
                }}>
                    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Heart fill="#f43f5e" stroke="none" /> My Collection
                        </h2>
                        <button onClick={() => setShowCollectionModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', paddingBottom: '150px' }}>
                        {loadingFavs ? (
                            <div className={styles.loadingBox}><Loader2 className="animate-spin" /></div>
                        ) : favoritePlants.length === 0 ? (
                            <div className={styles.emptyState} style={{ height: '50vh' }}>
                                <Heart size={48} style={{ opacity: 0.5 }} />
                                <p style={{ fontSize: '1.1rem' }}>Your collection is empty.</p>
                                <Button variant="primary" onClick={() => { setShowCollectionModal(false); navigate('/'); }}>Start Exploring</Button>
                            </div>
                        ) : (
                            <div className={styles.compactGrid}>
                                {favoritePlants.map(plant => (
                                    <div key={plant.id} className={styles.compactCard}>
                                        <div className={styles.compactCardImage}>
                                            <img src={plant.imageUrl} alt={plant.name} />
                                            <button onClick={() => handleRemoveFavorite(plant.id)} className={styles.removeFavBtn}>
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
                    </div>
                </div>
            )}

            {/* VERIFICATION MODAL */}
            {showVerifyModal && (
                <VerificationModal
                    onSuccess={() => {
                        window.location.reload();
                        toast.success("Account Verified Successfully!");
                    }}
                    onClose={() => setShowVerifyModal(false)}
                />
            )}

        </div>
    );
};
