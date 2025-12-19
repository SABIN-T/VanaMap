import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Cart = () => {
    const { items, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();



    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-text-main)' }}>Your Cart</h2>
                </div>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                        <h3>Nothing is in cart</h3>
                        <p>Looks like you haven't added any plants yet.</p>
                        <Button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                            Browse Plants
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {items.map((item) => (
                                <div key={item.plant.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'var(--glass-bg)',
                                    borderRadius: '0.5rem',
                                    border: 'var(--glass-border)'
                                }}>
                                    <img src={item.plant.imageUrl} alt={item.plant.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{item.plant.name}</h3>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            Quantity: {item.quantity}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.plant.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: 'none',
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            {!user && (
                                <div style={{
                                    background: 'rgba(56, 189, 248, 0.05)',
                                    border: '1px solid rgba(56, 189, 248, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: '0 0 1rem 0', color: '#38bdf8', fontSize: '0.9rem', fontWeight: 600 }}>
                                        💡 Tip: Sign in to sync your selections across devices and access verified botanical guidance.
                                    </p>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                                        Sign In / Create Account
                                    </Button>
                                </div>
                            )}
                            <Button size="lg" onClick={() => navigate('/nearby', { state: { tab: 'all' } })} style={{ width: '100%', maxWidth: '300px' }}>
                                Find Nearby Shops & Contact
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
