import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Trash2, ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
    const { items, removeFromCart } = useCart();

    // Price removed per user request

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Garden Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Cart Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag /> Your Wishlist
                    </h2>

                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                            <p>Your cart is empty.</p>
                            <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Browse Plants</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {items.map(({ plant, quantity }) => (
                                <div key={plant.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={plant.imageUrl} alt={plant.name} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem' }}>{plant.name}</h3>
                                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Quantity: {quantity}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button onClick={() => removeFromCart(plant.id)} style={{ color: '#ef4444', opacity: 0.8 }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ color: '#aaa' }}>Contact vendors for pricing.</p>
                            </div>


                            <Link to="/nearby">
                                <Button style={{ width: '100%', marginTop: '1rem' }}>
                                    <MapPin size={18} /> Find Nearby Vendors
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions / Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Tips</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Prices are estimates. Use the "Nearby" map to find vendors and contact them directly via WhatsApp for verified current pricing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
