import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import {
    ShoppingBag, MapPin, Heart, ArrowRight, Loader2,
    Shield, Lock, Trophy, Zap, Wind, CheckCircle, Store
} from 'lucide-react';
import { VerificationModal } from '../components/auth/VerificationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants, fetchVendors, updateVendor, changePassword, fetchLeaderboard, updateLocation } from '../services/api';
import type { Plant, Vendor } from '../types';
import toast from 'react-hot-toast';
import styles from './UserDashboard.module.css';
import { UserDashboardLayout } from './UserDashboardLayout';

export const UserDashboard = () => {
    const { user, toggleFavorite, loading } = useAuth();
    const { items } = useCart();
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
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locForm, setLocForm] = useState({ city: '', state: '' });

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

                // If Google Auth, assume email is verified
                const emailVerified = data.emailVerified || (user as any).googleAuth;
                setVerStatus({ email: !!emailVerified, phone: !!data.phoneVerified });
            } catch (e) {
                console.error("Failed to check verification", e);
            }
        };
        checkVerification();
    }, [user]);

    // Redirect if not logged in
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

    // Auto-detect location when Hall of Fame modal opens
    useEffect(() => {
        if (showLocationModal && !locForm.city && !locForm.state) {
            const autoDetect = async () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );
                            const data = await response.json();

                            if (data.address) {
                                const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                const stateVal = data.address.state || '';

                                if (cityVal) {
                                    setLocForm({ city: cityVal, state: stateVal });
                                    toast.success('📍 Location detected automatically!', { duration: 2000 });
                                }
                            }
                        } catch (error) {
                            console.log('Auto-detect failed silently');
                        }
                    }, () => {
                        console.log('Location permission not granted');
                    });
                }
            };

            // Delay auto-detect by 500ms
            const timer = setTimeout(autoDetect, 500);
            return () => clearTimeout(timer);
        }
    }, [showLocationModal, locForm.city, locForm.state]);

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
                            latitude: vendor.latitude || 0,
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
            toast.error(reason + " Trying IP fallback...");
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
            () => {
                performIPFallback("GPS access denied.");
            }
        );
    };

    const submitVendorProfile = async () => {
        if (!myVendor) return;
        const tid = toast.loading("Updating shop profile...");
        try {
            const updatePayload: Partial<Vendor> = {
                ...vendorForm,
                latitude: vendorForm.latitude ?? undefined,
                longitude: vendorForm.longitude ?? undefined,
                verified: false
            };

            const updated = await updateVendor(myVendor.id, updatePayload, true); // true = self-update
            if (updated) {
                toast.success("Profile submitted!", { id: tid });
                setShowVendorModal(false);
            } else {
                toast.error("Failed to update profile", { id: tid });
            }
        } catch (error: any) {
            toast.error(error.message || "Network error saving profile", { id: tid });
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
    }, [user]);

    const favoritePlants = allPlants.filter(p => user?.favorites?.includes(p.id));

    const handleRemoveFavorite = (plantId: string) => {
        if (!user) return;
        toggleFavorite(plantId);
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
        } catch {
            toast.error("System error updating password", { id: tid });
        }
    };

    const submitLocation = async () => {
        if (!locForm.city) {
            toast.error("Please enter a city name");
            return;
        }
        const tid = toast.loading("Joining local leaderboard...");
        try {
            const res = await updateLocation({ ...locForm });
            if (res.success) {
                toast.success("Welcome to " + locForm.city + " team!", { id: tid });
                setShowLocationModal(false);
                // Refresh user data (if needed, but usually redirect/reload helps)
                window.location.reload();
            } else {
                toast.error("Failed to update location", { id: tid });
            }
        } catch (e) {
            toast.error("Error connecting to ranking server", { id: tid });
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
        <UserDashboardLayout title="Overview">
            {/* 1. GAMIFICATION BANNER */}
            <div className={styles.gamificationBanner}>
                <div className={styles.bannerContent}>
                    <div className={styles.trophyCircle}>
                        <Trophy size={22} />
                    </div>
                    <div className={styles.bannerText}>
                        <h3>Welcome back, {user.name}!</h3>
                        <p>
                            You are a <span style={{ color: '#10b981', fontWeight: 700 }}>Seed Level</span> explorer.
                            {user.isPremium && <span style={{ marginLeft: '8px', color: '#fbbf24', fontWeight: 800 }}>✨ PREMIUM (2x CP BOOST)</span>}
                        </p>
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/leaderboard')}
                    className={styles.actionBtn}
                    style={{ width: 'auto' }}
                >
                    View Rankings <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </Button>
            </div>

            {/* LOCATION PROMPT - CLEANER ALERT */}
            {!user.city && (
                <div className={styles.actionCard} style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    marginBottom: '1.5rem',
                    animation: 'pulse-glow 3s infinite',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div className={styles.actionHeader}>
                        <div className={styles.actionIconBox} style={{ background: '#0ea5e9' }}>
                            <MapPin size={22} />
                        </div>
                        <div className={styles.actionContent}>
                            <h4 className={styles.actionTitle}>Missing Local Ranking</h4>
                            <p className={styles.actionDesc}>Set city to represent your zone in Hall of Fame</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setShowLocationModal(true)}
                        style={{ background: '#0ea5e9', border: 'none', fontWeight: 800, width: 'auto' }}
                    >
                        Set Location
                    </Button>
                </div>
            )}

            {/* 2. STATS OVERVIEW - HIGH DENSITY */}
            <div className={styles.statsBoard}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{user.points || 0}</div>
                        <div className={styles.statLabel}>Total Points</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', color: 'black' }}>
                        <Trophy size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{rank ? `#${rank}` : '-'}</div>
                        <div className={styles.statLabel}>Global Rank</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                        <Wind size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{((favoritePlants.length || items.length) * 1.2).toFixed(1)}L</div>
                        <div className={styles.statLabel}>Oxygen Impact</div>
                    </div>
                </div>
            </div>

            {/* 3. ALERTS & ACTIONS - GRID 3-COL */}
            <div className={styles.actionSection}>
                {/* Account Status Card */}
                <div className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                        <div className={styles.actionIconBox} style={{ background: isFullyVerified ? '#10b981' : '#ef4444' }}>
                            {isFullyVerified ? <CheckCircle size={18} /> : <Shield size={18} />}
                        </div>
                        <div className={styles.actionContent}>
                            <h4 className={styles.actionTitle}>Identity</h4>
                            <p className={styles.actionDesc}>{isFullyVerified ? 'Verified Account' : 'Action Required'}</p>
                        </div>
                    </div>
                    {!isFullyVerified && (
                        <Button
                            onClick={() => setShowVerifyModal(true)}
                            size="sm"
                            className={styles.actionBtn}
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                        >
                            Verify Identity
                        </Button>
                    )}
                </div>

                {/* Privacy/Security Card */}
                <div className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                        <div className={styles.actionIconBox} style={{ background: '#6366f1' }}>
                            <Lock size={18} />
                        </div>
                        <div className={styles.actionContent}>
                            <h4 className={styles.actionTitle}>Security</h4>
                            <p className={styles.actionDesc}>Manage Privacy</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowPasswordModal(true)} size="sm" variant="outline" className={styles.actionBtn}>
                        Change Key
                    </Button>
                </div>

                {/* Shop Center Card */}
                <div className={styles.actionCard}>
                    <div className={styles.actionHeader}>
                        <div className={styles.actionIconBox} style={{ background: '#facc15', color: '#000' }}>
                            <Store size={18} />
                        </div>
                        <div className={styles.actionContent}>
                            <h4 className={styles.actionTitle}>Partners</h4>
                            <p className={styles.actionDesc}>Shop Portal</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/vendor')}
                        size="sm"
                        className={styles.actionBtn}
                        style={{ background: '#facc15', color: '#000', border: 'none' }}
                    >
                        Visit Center
                    </Button>
                </div>
            </div>

            {/* 4. QUICK ACCESS GRID */}
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Quick Navigation</h2>
            <div className={styles.quickGrid}>
                {user.role === 'vendor' && (
                    <div onClick={() => navigate('/vendor')} className={styles.quickCard} style={{ background: 'rgba(250, 204, 21, 0.05)', borderColor: 'rgba(250, 204, 21, 0.2)' }}>
                        <Store style={{ color: '#facc15' }} size={24} />
                        <div>
                            <strong>Vendor Portal</strong>
                            <p>Manage Shop</p>
                        </div>
                    </div>
                )}

                {user.role === 'admin' && (
                    <div onClick={() => navigate('/admin')} className={styles.quickCard} style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <Shield style={{ color: '#ef4444' }} size={24} />
                        <div>
                            <strong>Admin Panel</strong>
                            <p>System Hub</p>
                        </div>
                    </div>
                )}

                <div onClick={() => setShowCollectionModal(true)} className={styles.quickCard}>
                    <Heart style={{ color: '#f43f5e' }} size={24} />
                    <div>
                        <strong>My Garden</strong>
                        <p>{user.favorites?.length || 0} Collected</p>
                    </div>
                </div>

                <div onClick={() => navigate('/nearby')} className={styles.quickCard}>
                    <MapPin style={{ color: '#10b981' }} size={24} />
                    <div>
                        <strong>Nearby</strong>
                        <p>Locate Shops</p>
                    </div>
                </div>

                <div onClick={() => navigate('/cart')} className={styles.quickCard}>
                    <ShoppingBag style={{ color: '#0ea5e9' }} size={24} />
                    <div>
                        <strong>Cart</strong>
                        <p>{items.length} Pending</p>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

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
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Shop Profile</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} placeholder="Shop Name" style={{ padding: '0.8rem', borderRadius: '0.5rem' }} />
                            <input value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} placeholder="Phone" style={{ padding: '0.8rem', borderRadius: '0.5rem' }} />
                            <Button onClick={detectLocation} disabled={detectingLoc}>{detectingLoc ? 'Locating...' : 'Auto-Detect Location'}</Button>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setShowVendorModal(false)} style={{ flex: 1 }}>Cancel</Button>
                            <Button onClick={submitVendorProfile} style={{ flex: 1 }}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. PASSWORD MODAL - (existing) */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1001,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '24px' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Update Password</h2>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="password" placeholder="Current Password" value={pwdForm.old} onChange={e => setPwdForm({ ...pwdForm, old: e.target.value })} style={{ padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            <input type="password" placeholder="New Password" value={pwdForm.new} onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })} style={{ padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            <input type="password" placeholder="Confirm Password" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} style={{ padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} style={{ flex: 1 }}>Cancel</Button>
                                <Button type="submit" style={{ flex: 1 }}>Update</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 7. LOCATION MODAL */}
            {showLocationModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard} style={{ maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1rem', borderRadius: '50%', color: '#0ea5e9' }}>
                                <MapPin size={32} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#f1f5f9' }}>Hall of Fame</h2>
                        <p style={{ margin: '0 0 2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Join your local city ranking and earn badges.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current City</label>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const tid = toast.loading("Detecting location...");
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(async (position) => {
                                                    try {
                                                        const { latitude, longitude } = position.coords;
                                                        const response = await fetch(
                                                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                                                        );
                                                        const data = await response.json();

                                                        if (data.address) {
                                                            const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                                            const stateVal = data.address.state || '';

                                                            if (cityVal) setLocForm({ city: cityVal, state: stateVal });
                                                            toast.success("Location detected!", { id: tid });
                                                        }
                                                    } catch {
                                                        toast.error("Failed to detect address", { id: tid });
                                                    }
                                                }, () => toast.error("Permission denied", { id: tid }));
                                            } else {
                                                toast.error("Geolocation not supported", { id: tid });
                                            }
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        📍 Auto-Detect
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. New Delhi"
                                    className={styles.modalInput}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem', color: 'white' }}
                                    value={locForm.city}
                                    onChange={e => setLocForm({ ...locForm, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State / Region</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Delhi"
                                    className={styles.modalInput}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem', color: 'white' }}
                                    value={locForm.state}
                                    onChange={e => setLocForm({ ...locForm, state: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button variant="outline" onClick={() => setShowLocationModal(false)} style={{ flex: 1 }}>Maybe Later</Button>
                            <Button onClick={submitLocation} style={{ flex: 1, background: '#0ea5e9', border: 'none' }}>Join Now</Button>
                        </div>
                    </div>
                </div>
            )}

            {showGuide && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1001,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setShowGuide(false)}>
                    <div className="glass-panel" style={{
                        width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1.5rem' }}>Level Up Guide</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ color: '#ccc' }}>Earn points by adding favorites, visiting daily, and completing profile.</p>
                            <Button onClick={() => setShowGuide(false)}>Got it!</Button>
                        </div>
                    </div>
                </div>
            )}

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
                        <button onClick={() => setShowCollectionModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white' }}>
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {loadingFavs ? (
                            <div className={styles.loadingBox}><Loader2 className="animate-spin" /></div>
                        ) : favoritePlants.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Your collection is empty.</p>
                                <Button onClick={() => { setShowCollectionModal(false); navigate('/'); }}>Start Exploring</Button>
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

            {showVerifyModal && (
                <VerificationModal
                    initialMethod={verStatus.email ? 'phone' : 'email'}
                    disableEmail={verStatus.email}
                    onSuccess={() => { window.location.reload(); toast.success("Verified!"); }}
                    onClose={() => setShowVerifyModal(false)}
                />
            )}

        </UserDashboardLayout>
    );
};
