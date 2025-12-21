import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, MapPin, Heart, ArrowRight, Activity, Loader2, Store, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants, fetchVendors, updateVendor } from '../services/api';
import type { Plant, Vendor } from '../types';
import toast from 'react-hot-toast';

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

    useEffect(() => {
        const loadVendorData = async () => {
            if (user?.role === 'vendor') {
                try {
                    const vendors = await fetchVendors();
                    // Soft match on ID (mongo _id vs. string id)
                    const vendor = vendors.find(v => v.id === user.id || v.id === (user as any)._id);
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
                            setShowVendorModal(true);
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

            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        margin: 0,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        User Dashboard
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                        Welcome back, {user.name}!
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user.role === 'vendor' && (
                        <Button onClick={() => setShowVendorModal(true)} variant="outline" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <Store size={18} /> Edit Shop Details
                        </Button>
                    )}

                    {user.role === 'admin' && (
                        <Link to="/admin">
                            <Button style={{
                                background: '#facc15',
                                color: 'black',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Activity size={18} /> ADMIN PANEL
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {user.role === 'admin' && (
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '1rem', color: '#facc15' }}>
                                <Shield size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Admin Command Center</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#facc15' }}>System Management</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                                    Access full controls for plants, vendors, users, and system diagnostics.
                                </p>
                                <Link to="/admin">
                                    <Button style={{ width: '100%', background: '#facc15', color: 'black', fontWeight: 700 }}>
                                        Enter Admin Panel
                                    </Button>
                                </Link>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.5rem', opacity: 0.8 }}>
                                <h3 style={{ margin: '0 0 1rem 0' }}>Quick Stats</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>System Health</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ade80' }}>100%</div>
                                    </div>
                                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Latency</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>24ms</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAVORITES SECTION */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', color: '#ef4444' }}>
                            <Heart size={24} fill="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>My Favorites</h2>
                        <span style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.25rem 0.8rem',
                            borderRadius: '99px',
                            color: '#ef4444',
                            fontWeight: 600
                        }}>
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
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {favoritePlants.map(plant => (
                                <div key={plant.id} className="glass-panel" style={{
                                    padding: '0',
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s',
                                    position: 'relative'
                                }}>
                                    <div style={{ height: '180px', position: 'relative' }}>
                                        <img src={plant.imageUrl} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{plant.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>{plant.scientificName}</p>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                    {/* WISHLIST / CART SECTION */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem', color: '#38bdf8' }}>
                                <ShoppingBag size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Shopping List</h2>
                            <span style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '0.25rem 0.8rem',
                                borderRadius: '99px',
                                color: '#38bdf8',
                                fontWeight: 600
                            }}>
                                {items.length}
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-muted)' }}>Your cart is empty.</p>
                                <Link to="/" style={{ display: 'inline-block', marginTop: '1rem' }}><Button variant="outline" size="sm">Add Items</Button></Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
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
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <MapPin color="#facc15" /> Nearby Shops
                            </h2>
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
