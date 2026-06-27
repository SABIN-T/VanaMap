import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import {
    ShoppingBag, MapPin, Heart, ArrowRight, Loader2,
    Shield, Lock, Trophy, Zap, Wind, CheckCircle, Store, Package, Truck, CheckCircle2, XCircle, Clock, Trash2
} from 'lucide-react';
import { VerificationModal } from '../components/auth/VerificationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants, fetchVendors, updateVendor, changePassword, fetchLeaderboard, updateLocation, fetchUserOrders } from '../services/api';
import { formatCurrency } from '../utils/currency';
import type { Plant, Vendor } from '../types';
import toast from 'react-hot-toast';
import styles from './UserDashboard.module.css';
import { UserDashboardLayout } from './UserDashboardLayout';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getLocation } from '../utils/getLocation';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const UserDashboard = () => {
    const { user, toggleFavorite, loading, logout } = useAuth();
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
    const [vendorForm, setVendorForm] = useState<{ name: string, phone: string, whatsapp: string, address: string, latitude: number | null, longitude: number | null }>({
        name: '', phone: '', whatsapp: '', address: '', latitude: null, longitude: null
    });
    const [detectingLoc, setDetectingLoc] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [myOrders, setMyOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [locForm, setLocForm] = useState({ city: '', state: '' });

    // Verification State
    const [verStatus, setVerStatus] = useState({ email: false, phone: false });
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const isFullyVerified = verStatus.email && verStatus.phone;

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState<'initial' | 'otp'>('initial');
    const [deleteOtp, setDeleteOtp] = useState('');
    const [requestingDelete, setRequestingDelete] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

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
                try {
                    const result = await getLocation({
                        useCache: true,
                        useIPFallback: true,
                        highAccuracyTimeout: 5000,
                        lowAccuracyTimeout: 5000
                    });

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.latitude}&lon=${result.longitude}`
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
            };

            // Delay auto-detect by 500ms
            const timer = setTimeout(autoDetect, 500);
            return () => clearTimeout(timer);
        }
    }, [showLocationModal, locForm.city, locForm.state]);

    useEffect(() => {
        const loadVendorData = async () => {
            // Check for vendor existence for ALL users (even if role is 'user', they might be pending)
            if (user) {
                try {
                    const vendors = await fetchVendors();
                    const vendor = vendors.find(v =>
                        v.ownerEmail === user.email ||
                        v.id === user.id ||
                        v.userId === (user as any)._id ||
                        v.userId === user.id
                    );
                    if (vendor) {
                        setMyVendor(vendor);
                        setVendorForm({
                            name: vendor.name,
                            phone: vendor.phone || '',
                            whatsapp: vendor.whatsapp || '',
                            address: vendor.address || '',
                            latitude: vendor.latitude || null,
                            longitude: vendor.longitude || null
                        });
                    }
                } catch (error) {
                    console.error("Failed to load vendor profile", error);
                }
            }
        };
        loadVendorData();
    }, [user, navigate]);

    const detectLocation = async () => {
        setDetectingLoc(true);
        try {
            const result = await getLocation({
                useCache: false,
                useIPFallback: true,
                highAccuracyTimeout: 10000,
                lowAccuracyTimeout: 8000
            });

            setVendorForm(prev => ({
                ...prev,
                latitude: result.latitude,
                longitude: result.longitude
            }));

            if (result.source === 'gps' || result.source === 'cache') {
                toast.success("GPS Location detected!");
            } else if (result.source === 'ip') {
                toast.success(`Detected approx location: ${result.city || "Success"}!`);
            } else {
                toast.success("Using default location. You can adjust on the map.");
            }
        } catch {
            toast.error("Location detection failed. Please enter coordinates manually.");
        } finally {
            setDetectingLoc(false);
        }
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

    const requestDeleteOTP = async () => {
        if (!user) return;
        setRequestingDelete(true);
        const tid = toast.loading(`Sending security code to ${user.email}...`);
        try {
            const savedUser = localStorage.getItem('user');
            const token = savedUser ? JSON.parse(savedUser).token : null;
            if (!token) throw new Error("No authorization token");

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/request-delete-account`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send code");

            toast.success("Security code sent successfully!", { id: tid });
            setDeleteStep('otp');
        } catch (error: any) {
            toast.error(error.message || "Failed to request code", { id: tid });
        } finally {
            setRequestingDelete(false);
        }
    };

    const confirmDeleteAccount = async () => {
        if (!deleteOtp.trim()) {
            toast.error("Please enter the verification code");
            return;
        }
        setConfirmingDelete(true);
        const tid = toast.loading("Confirming verification code...");
        try {
            const savedUser = localStorage.getItem('user');
            const token = savedUser ? JSON.parse(savedUser).token : null;
            if (!token) throw new Error("No authorization token");

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/confirm-delete-account`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp: deleteOtp.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to confirm deletion");

            toast.success("Account permanently deleted", { id: tid });
            setShowDeleteModal(false);
            logout();
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP code", { id: tid });
        } finally {
            setConfirmingDelete(false);
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

                {/* Danger Zone Card */}
                <div className={styles.actionCard} style={{ borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                    <div className={styles.actionHeader}>
                        <div className={styles.actionIconBox} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' }}>
                            <Trash2 size={18} />
                        </div>
                        <div className={styles.actionContent}>
                            <h4 className={styles.actionTitle}>Danger Zone</h4>
                            <p className={styles.actionDesc}>Delete Account</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            setDeleteStep('initial');
                            setDeleteOtp('');
                            setShowDeleteModal(true);
                        }}
                        size="sm"
                        className={styles.actionBtn}
                        style={{ background: '#ef4444', color: 'white', border: 'none' }}
                    >
                        Delete Account
                    </Button>
                </div>
            </div>

            {/* 4. QUICK ACCESS GRID */}
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Quick Navigation</h2>
            <div className={styles.quickGrid}>
                {(user.role === 'vendor' || myVendor) && (
                    <div onClick={() => navigate('/vendor')} className={styles.quickCard} style={{ background: 'rgba(250, 204, 21, 0.05)', borderColor: 'rgba(250, 204, 21, 0.2)' }}>
                        <Store style={{ color: '#facc15' }} size={24} />
                        <div>
                            <strong>Vendor Portal</strong>
                            <p>{user.role === 'vendor' ? 'Manage Shop' : 'Application Status'}</p>
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

                <div onClick={async () => {
                    setShowOrdersModal(true);
                    setLoadingOrders(true);
                    try {
                        const data = await fetchUserOrders();
                        setMyOrders(data);
                    } catch (e) {
                        console.error('Failed to load orders', e);
                    } finally {
                        setLoadingOrders(false);
                    }
                }} className={styles.quickCard} style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                    <Package style={{ color: '#a855f7' }} size={24} />
                    <div>
                        <strong>My Orders</strong>
                        <p>Order History</p>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {showVendorModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard} style={{ maxWidth: '500px' }}>
                        <h2 className={styles.modalTitle} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Shop Profile</h2>
                        <div className={styles.modalForm}>
                            <input className={styles.modalInput} value={vendorForm.name} onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} placeholder="Shop Name" />
                            <input className={styles.modalInput} value={vendorForm.phone} onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })} placeholder="Phone" />
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
                <div className={styles.modalOverlay} style={{ zIndex: 1001 }}>
                    <div className={styles.modalCard} style={{ maxWidth: '400px' }}>
                        <h2 className={styles.modalTitle}>Update Password</h2>
                        <form onSubmit={handlePasswordChange} className={styles.modalForm}>
                            <input type="password" placeholder="Current Password" value={pwdForm.old} onChange={e => setPwdForm({ ...pwdForm, old: e.target.value })} className={styles.modalInput} />
                            <input type="password" placeholder="New Password" value={pwdForm.new} onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })} className={styles.modalInput} />
                            <input type="password" placeholder="Confirm Password" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} className={styles.modalInput} />
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
                        <h2 className={styles.modalTitle}>Hall of Fame</h2>
                        <p className={styles.modalSubtitle}>
                            Join your local city ranking and earn badges.
                        </p>

                        <div className={styles.modalForm} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current City</label>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const tid = toast.loading("Detecting location...");
                                            try {
                                                const result = await getLocation({
                                                    useCache: true,
                                                    useIPFallback: true,
                                                    highAccuracyTimeout: 8000,
                                                    lowAccuracyTimeout: 5000
                                                });

                                                const response = await fetch(
                                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.latitude}&lon=${result.longitude}`
                                                );
                                                const data = await response.json();

                                                if (data.address) {
                                                    const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                                    const stateVal = data.address.state || '';

                                                    if (cityVal) setLocForm({ city: cityVal, state: stateVal });
                                                    toast.success("Location detected!", { id: tid });
                                                } else {
                                                    toast.error("Could not resolve address", { id: tid });
                                                }
                                            } catch {
                                                toast.error("Failed to detect location", { id: tid });
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
                <div className={styles.modalOverlay} style={{ zIndex: 1001 }} onClick={() => setShowGuide(false)}>
                    <div className={styles.modalCard} style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle} style={{ marginBottom: '1.5rem' }}>Level Up Guide</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ color: '#ccc', textAlign: 'center' }}>Earn points by adding favorites, visiting daily, and completing profile.</p>
                            <Button onClick={() => setShowGuide(false)}>Got it!</Button>
                        </div>
                    </div>
                </div>
            )}

            {showCollectionModal && (
                <div className={styles.fullScreenModal}>
                    <div className={styles.modalHeader}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Heart fill="#f43f5e" stroke="none" /> My Collection
                        </h2>
                        <button onClick={() => setShowCollectionModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {loadingFavs ? (
                            <div className={styles.loadingBox}><Loader2 className="animate-spin" /></div>
                        ) : favoritePlants.length === 0 ? (
                            <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
                                <Heart size={48} style={{ color: '#f43f5e', marginBottom: '1.25rem', opacity: 0.8 }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#f1f5f9' }}>Your Collection is Empty</h3>
                                <p style={{ margin: '0 0 1.75rem', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.5 }}>
                                    Discovered any favorite plants yet? Add them to your collection to easily track them.
                                </p>
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

            {showOrdersModal && (
                <div className={styles.fullScreenModal}>
                    <div className={styles.modalHeader}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Package color="#a855f7" /> My Orders
                        </h2>
                        <button onClick={() => setShowOrdersModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {loadingOrders ? (
                            <div className={styles.loadingBox}><Loader2 className="animate-spin" /></div>
                        ) : myOrders.length === 0 ? (
                            <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
                                <Package size={48} style={{ color: '#a855f7', marginBottom: '1.25rem', opacity: 0.8 }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#f1f5f9' }}>No Orders Yet</h3>
                                <p style={{ margin: '0 0 1.75rem', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.5 }}>
                                    You haven't placed any orders yet. Explore our green catalog and make your first purchase!
                                </p>
                                <Button onClick={() => { setShowOrdersModal(false); navigate('/'); }}>Browse Plants</Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {myOrders.map((order: any) => {
                                    const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
                                        pending: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={14} /> },
                                        completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle size={14} /> },
                                        shipped: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: <Truck size={14} /> },
                                        delivered: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: <CheckCircle2 size={14} /> },
                                        cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <XCircle size={14} /> }
                                    };
                                    const sc = statusConfig[order.status] || statusConfig.pending;
                                    
                                    const isExpanded = expandedOrderId === order._id;
                                    const customerLat = order.deliveryAddress?.latitude;
                                    const customerLng = order.deliveryAddress?.longitude;
                                    const vendorLat = order.vendorInfo?.latitude;
                                    const vendorLng = order.vendorInfo?.longitude;
                                    const hasRoute = !!(customerLat && customerLng && vendorLat && vendorLng);

                                    const steps = [
                                        { label: 'Placed', active: !order.status || ['pending', 'completed', 'shipped', 'delivered'].includes(order.status) },
                                        { label: 'Packed', active: ['completed', 'shipped', 'delivered'].includes(order.status) },
                                        { label: 'Shipped', active: ['shipped', 'delivered'].includes(order.status) },
                                        { label: 'Delivered', active: ['delivered'].includes(order.status) }
                                    ];

                                    return (
                                        <div key={order._id} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '1rem',
                                            padding: '1rem 1.25rem',
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                                                        {order.plantName}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                                                        {order.quantity > 1 ? `${order.quantity}x · ` : ''}
                                                        from <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{order.vendorInfo?.name || 'Unknown'}</span>
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                                                        {formatCurrency(order.price * (order.quantity || 1))}
                                                    </div>
                                                    <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                        padding: '0.2rem 0.5rem', borderRadius: '999px',
                                                        background: sc.bg, color: sc.color,
                                                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                                        marginTop: '0.3rem'
                                                    }}>
                                                        {sc.icon} {order.status}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>
                                                    {order.deliveryAddress?.address ? (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <MapPin size={11} style={{ flexShrink: 0 }} /> {order.deliveryAddress.address}{order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontStyle: 'italic' }}>No address</span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                                                        {new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedOrderId(isExpanded ? null : order._id);
                                                        }}
                                                        style={{
                                                            background: isExpanded ? 'rgba(255,255,255,0.1)' : 'rgba(168, 85, 247, 0.1)',
                                                            border: 'none',
                                                            borderRadius: '0.4rem',
                                                            padding: '0.25rem 0.5rem',
                                                            color: isExpanded ? '#fff' : '#a855f7',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {isExpanded ? 'Hide Tracker' : 'Track Route'}
                                                    </button>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div style={{ marginTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                                    {/* Timeline Tracker */}
                                                    {order.status === 'cancelled' ? (
                                                        <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <XCircle size={16} /> This order was cancelled.
                                                        </div>
                                                    ) : (
                                                        <div style={{ marginBottom: '1.25rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 0.5rem' }}>
                                                                {/* Background line */}
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '12px',
                                                                    left: '5%',
                                                                    right: '5%',
                                                                    height: '2px',
                                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                                    zIndex: 0
                                                                }} />
                                                                {/* Progress line */}
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '12px',
                                                                    left: '5%',
                                                                    width: `${
                                                                        order.status === 'delivered' ? '90%' :
                                                                        order.status === 'shipped' ? '60%' :
                                                                        order.status === 'completed' ? '30%' : '0%'
                                                                    }`,
                                                                    height: '2px',
                                                                    background: '#10b981',
                                                                    zIndex: 0,
                                                                    transition: 'width 0.4s ease'
                                                                }} />

                                                                {steps.map((step, idx) => (
                                                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '25%' }}>
                                                                        <div style={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            borderRadius: '50%',
                                                                            background: step.active ? '#10b981' : '#1e293b',
                                                                            border: `2px solid ${step.active ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}`,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: step.active ? '#000' : 'rgba(255, 255, 255, 0.4)',
                                                                            fontSize: '10px',
                                                                            fontWeight: 800,
                                                                            transition: 'all 0.3s ease'
                                                                        }}>
                                                                            {step.active ? '✓' : idx + 1}
                                                                        </div>
                                                                        <span style={{
                                                                            marginTop: '0.4rem',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: step.active ? 700 : 500,
                                                                            color: step.active ? '#fff' : 'rgba(255, 255, 255, 0.4)'
                                                                        }}>
                                                                            {step.label}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Delivery Routing Map */}
                                                    {hasRoute ? (
                                                        <div style={{ height: '220px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden', marginTop: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1 }}>
                                                            <MapContainer
                                                                center={[(customerLat + vendorLat) / 2, (customerLng + vendorLng) / 2]}
                                                                zoom={12}
                                                                style={{ height: '100%', width: '100%' }}
                                                                zoomControl={false}
                                                            >
                                                                <TileLayer
                                                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                                                />
                                                                <Marker position={[vendorLat, vendorLng]}>
                                                                    <Popup>
                                                                        <div style={{ color: '#000', fontSize: '0.8rem' }}>
                                                                            <strong>Shop:</strong> {order.vendorInfo?.name || 'Vendor Shop'}<br/>
                                                                            <span>Store Pickup Point</span>
                                                                        </div>
                                                                    </Popup>
                                                                </Marker>
                                                                <Marker position={[customerLat, customerLng]}>
                                                                    <Popup>
                                                                        <div style={{ color: '#000', fontSize: '0.8rem' }}>
                                                                            <strong>Delivery Location</strong><br/>
                                                                            <span>{order.deliveryAddress?.address}</span>
                                                                        </div>
                                                                    </Popup>
                                                                </Marker>
                                                                <Polyline
                                                                    positions={[[vendorLat, vendorLng], [customerLat, customerLng]]}
                                                                    pathOptions={{
                                                                        color: '#10b981',
                                                                        dashArray: '8, 8',
                                                                        weight: 4,
                                                                        opacity: 0.8
                                                                    }}
                                                                />
                                                            </MapContainer>
                                                        </div>
                                                    ) : (
                                                        <div style={{
                                                            background: 'rgba(245, 158, 11, 0.05)',
                                                            border: '1px solid rgba(245, 158, 11, 0.15)',
                                                            borderRadius: '0.75rem',
                                                            padding: '0.75rem',
                                                            marginTop: '1.25rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.8rem',
                                                            color: '#f59e0b'
                                                        }}>
                                                            <MapPin size={16} />
                                                            <span>Delivery map routing unavailable: shop or delivery coordinates missing.</span>
                                                        </div>
                                                    )}

                                                    {/* Invoice Download Action */}
                                                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const token = JSON.parse(localStorage.getItem('user') || '{}').token;
                                                                window.open(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/orders/${order._id}/invoice?token=${token}`, '_blank');
                                                            }}
                                                            style={{
                                                                background: 'rgba(16, 185, 129, 0.15)',
                                                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                                                color: '#10b981',
                                                                borderRadius: '0.5rem',
                                                                padding: '0.4rem 0.8rem',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
                                                        >
                                                            📄 Download Invoice
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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

            {showDeleteModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 3000,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
                                <Trash2 size={32} />
                            </div>
                        </div>
                        
                        {deleteStep === 'initial' ? (
                            <>
                                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Delete Account?</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5', textAlign: 'center', marginBottom: '1.75rem' }}>
                                    Warning: Deleting your account is <span style={{ color: '#ef4444', fontWeight: 700 }}>permanent</span>. All your point scores, plants collection, orders, and premium access will be lost forever.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)} style={{ flex: 1 }}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={requestDeleteOTP} 
                                        disabled={requestingDelete}
                                        style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff' }}
                                    >
                                        {requestingDelete ? 'Sending...' : 'Send OTP'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Enter Deletion Code</h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5', textAlign: 'center', marginBottom: '1.5rem' }}>
                                    We've sent a 6-digit security key to <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{user.email}</span>. Use it to confirm your deletion.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP" 
                                        value={deleteOtp} 
                                        onChange={e => setDeleteOtp(e.target.value.replace(/\D/g, ''))}
                                        style={{ 
                                            padding: '0.85rem', 
                                            borderRadius: '0.75rem', 
                                            background: 'rgba(255,255,255,0.03)', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: '1.25rem',
                                            letterSpacing: '4px',
                                            fontWeight: 700,
                                            outline: 'none'
                                        }} 
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        <button 
                                            type="button"
                                            onClick={requestDeleteOTP}
                                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button type="button" variant="outline" onClick={() => setDeleteStep('initial')} style={{ flex: 1 }}>
                                        Back
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={confirmDeleteAccount}
                                        disabled={confirmingDelete}
                                        style={{ flex: 1, background: '#dc2626', border: 'none', color: '#fff', fontWeight: 800 }}
                                    >
                                        {confirmingDelete ? 'Deleting...' : 'Confirm Purge'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </UserDashboardLayout>
    );
};
