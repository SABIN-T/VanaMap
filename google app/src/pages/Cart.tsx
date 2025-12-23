import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, Info, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Cart = () => {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '8rem 1rem 4rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                display: 'flex',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <ShoppingCart size={28} className="text-emerald-400" /> Your Garden Cart
                        </h1>
                    </div>
                    {items.length > 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>{items.length} items</span>}
                </div>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <div style={{
                            width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
                        }}>
                            <ShoppingCart size={48} color="#10b981" />
                        </div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                            Looks like you haven't discovered your perfect plant match yet. Explore our collection of air-purifying plants.
                        </p>
                        <Button onClick={() => navigate('/')} variant="primary" size="lg">
                            Start Exploring
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                            {items.map((item) => (
                                <div key={item.plant.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    borderRadius: '1.5rem',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <img
                                        src={item.plant.imageUrl}
                                        alt={item.plant.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>{item.plant.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                background: 'rgba(15, 23, 42, 0.6)', padding: '6px 8px', borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.plant.id, item.quantity - 1)}
                                                    style={{
                                                        width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                                                        background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                                                    }}
                                                    className="hover:bg-white/20"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '1rem', color: 'white' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.plant.id, item.quantity + 1)}
                                                    style={{
                                                        width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                                                        background: '#10b981', color: 'black', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.plant.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            padding: '1rem',
                                            borderRadius: '1rem',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        title="Remove Item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            alignItems: 'center'
                        }}>
                            {!user && (
                                <div style={{
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    border: '1px solid rgba(56, 189, 248, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: '1.5rem',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: '#38bdf8', borderRadius: '50%', color: 'black' }}><Info size={20} /></div>
                                        <div>
                                            <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '1rem' }}>Save your cart?</h4>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Sign in to sync these items across your devices.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                                        Login Account
                                    </Button>
                                </div>
                            )}

                            <div style={{ width: '100%', background: 'rgba(16, 185, 129, 0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.15)', textAlign: 'center' }}>
                                <h3 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.2rem' }}>Ready to grow?</h3>
                                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Find local partner nurseries that have these plants in stock.</p>
                                <Button size="lg" onClick={() => navigate('/nearby', { state: { tab: 'all' } })} style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <MapPin size={20} /> Find Nearby Shops
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
