import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, MapPin, Heart, ArrowRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const UserDashboard = () => {
    const { items, removeFromCart } = useCart();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

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
                        Welcome back, {user.name}! Manage your plant selection and wishlist.
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

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {/* Wishlist Section */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: 'var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShoppingBag color="var(--color-primary)" /> Your Wishlist
                        </h2>
                        <span style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            {items.length} Items
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <ShoppingBag size={48} opacity={0.2} />
                            </div>
                            <p style={{ marginBottom: '1.5rem' }}>Your wishlist is currently empty.</p>
                            <Link to="/">
                                <Button variant="outline">Browse Plants</Button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {items.map(({ plant, quantity }) => (
                                <div key={plant.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'transform 0.2s ease'
                                }} className="item-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={plant.imageUrl} alt={plant.name} style={{ width: '70px', height: '70px', borderRadius: '0.75rem', objectFit: 'cover' }} />
                                            <div style={{
                                                position: 'absolute', top: -5, right: -5,
                                                background: 'var(--color-primary)', color: 'black',
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.7rem', fontWeight: '800'
                                            }}>
                                                {quantity}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{plant.name}</h3>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>{plant.scientificName}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(plant.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: 'none',
                                            padding: '0.6rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                background: 'rgba(0, 255, 157, 0.05)',
                                borderRadius: '1rem',
                                border: '1px dashed var(--color-primary)',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                                    💡 Tip: Contact vendors via the "Nearby" map for current pricing.
                                </p>
                            </div>

                            <Link to="/nearby" style={{ textDecoration: 'none' }}>
                                <Button style={{ width: '100%', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <MapPin size={20} /> Find Vendors Near Me <ArrowRight size={18} />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Account & Favorites Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Heart color="#ef4444" fill="#ef4444" size={20} /> Saved Favorites
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                            You have {user?.favorites?.length || 0} plants saved as favorites.
                            These will be prioritized in your recommendations.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--gradient-primary)', color: 'black' }}>
                        <h3 style={{ margin: 0 }}>Oxygen Goal</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0.5rem 0 1.5rem' }}>
                            Based on your selection, you are improving air quality in your space.
                        </p>
                        <div style={{ background: 'rgba(0,0,0,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ background: 'black', width: '65%', height: '100%' }}></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '800', marginTop: '0.5rem', textAlign: 'right' }}>65% Towards Fresh Air Goal</p>
                    </div>
                </div>
            </div>

            <style>{`
                .item-card:hover {
                    transform: translateX(5px);
                    background: rgba(255,255,255,0.05) !important;
                }
            `}</style>
        </div>
    );
};
