import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, MapPin, Heart, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPlants } from '../services/api';
import type { Plant } from '../types';

export const UserDashboard = () => {
    const { items, removeFromCart } = useCart();
    const { user, loading, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    // Favorites State
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(true);

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

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
