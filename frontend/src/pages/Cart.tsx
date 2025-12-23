import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, MessageCircle, MapPin, Store, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { fetchVendors } from '../services/api';
import { formatCurrency } from '../utils/currency';
import type { Vendor, CartItem } from '../types';
import styles from './Cart.module.css';

export const Cart = () => {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<Record<string, Vendor>>({});

    useEffect(() => {
        const loadVendors = async () => {
            const list = await fetchVendors();
            const map: Record<string, Vendor> = {};
            list.forEach(v => map[v.id] = v);
            setVendors(map);
        };
        loadVendors();
    }, []);

    // Helper: Group items by vendor
    const groupedItems = items.reduce((acc, item) => {
        const vId = item.vendorId || 'vanamap';
        if (!acc[vId]) acc[vId] = [];
        acc[vId].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    const handleWhatsAppCheckout = (vendorId: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        let vendor = vendors[vendorId];
        const vItems = groupedItems[vendorId];

        // Handle VanaMap Official Case
        if (vendorId === 'vanamap') {
            vendor = {
                id: 'vanamap',
                name: 'VanaMap Official',
                whatsapp: '9188773534', // System Admin / Official support
                address: 'Headquarters',
                latitude: 0, longitude: 0,
                phone: '9188773534'
            } as Vendor;
        }

        if (!vendor || !vItems) return;

        // Construct Message
        let msg = `Hi, I am ${user.name}. I am happy to connect with you to buy plants.\n\nI would like to order the following:\n`;
        let total = 0;
        vItems.forEach(i => {
            const price = i.vendorPrice || i.plant.price || 0;
            msg += `- ${i.plant.name} (Qty: ${i.quantity}) @ ${formatCurrency(price)}\n`;
            total += price * i.quantity;
        });
        msg += `\nTotal Value: ${formatCurrency(total)}\n`;
        msg += `\nPlease confirm availability and delivery details.`;

        // Open WhatsApp
        const url = `https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

        // Remove items from cart
        vItems.forEach(i => removeFromCart(i.plant.id, vendorId === 'vanamap' ? undefined : vendorId));
    };

    return (
        <div className={styles.container}>
            <div className={styles.glassPanel}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button onClick={() => navigate(-1)} className={styles.backBtn}>
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className={styles.titleMain}>
                            <ShoppingCart size={32} className={styles.titleIcon} />
                            Your Garden Cart
                        </h1>
                    </div>
                    {items.length > 0 && <span className={styles.itemCount}>{items.length} items</span>}
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconBox}>
                            <ShoppingCart size={48} color="#10b981" />
                        </div>
                        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
                        <p className={styles.emptyDesc}>
                            Looks like you haven't discovered your perfect plant match yet. Explore our collection of air-purifying plants.
                        </p>
                        <Button onClick={() => navigate('/shops')} variant="primary" size="lg">
                            Brows Market
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Iterating Groups */}
                        {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                            const isVanaMap = vendorId === 'vanamap';
                            const vendor = vendors[vendorId];
                            const totalPrice = cartItems.reduce((sum, i) => sum + ((i.vendorPrice || i.plant.price || 0) * i.quantity), 0);

                            return (
                                <div key={vendorId} className={styles.vendorGroup}>
                                    {/* Group Header */}
                                    <div className={styles.groupHeader}>
                                        <div className={styles.vendorInfo}>
                                            <Store size={22} className={isVanaMap ? "text-emerald-400" : "text-amber-400"} />
                                            <div>
                                                <div className={styles.vendorName}>
                                                    {isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Unknown Vendor')}
                                                </div>
                                                {!isVanaMap && vendor && (
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                        <MapPin size={12} /> {vendor.address}
                                                    </div>
                                                )}
                                            </div>
                                            {isVanaMap ? (
                                                <span className={styles.officialBadge}><ShieldCheck size={12} /> Official</span>
                                            ) : (
                                                <span className={styles.partnerBadge}>Partner</span>
                                            )}
                                        </div>

                                        {/* Vendor Action */}
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {user ? (
                                                <button
                                                    className={styles.whatsappBtn}
                                                    onClick={() => handleWhatsAppCheckout(vendorId)}
                                                >
                                                    <MessageCircle size={18} /> Proceed to Order
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(251, 191, 36, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                                                    <Lock size={14} /> Login to Order
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className={styles.itemsList}>
                                        {cartItems.map((item) => (
                                            <div key={`${item.plant.id}-${vendorId}`} className={styles.itemCard}>
                                                <img
                                                    src={item.plant.imageUrl}
                                                    className={styles.itemThumb}
                                                    alt={item.plant.name}
                                                />
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemHeader}>
                                                        <div>
                                                            <h3 className={styles.itemName}>{item.plant.name}</h3>
                                                            <p className={styles.itemScientific}>{item.plant.scientificName}</p>
                                                        </div>
                                                        <div className={styles.itemPrice}>
                                                            {formatCurrency(item.vendorPrice || item.plant.price || 0)}
                                                        </div>
                                                    </div>

                                                    <div className={styles.controlsRow}>
                                                        <div className={styles.stepper}>
                                                            <button
                                                                onClick={() => updateQuantity(item.plant.id, item.quantity - 1, vendorId === 'vanamap' ? undefined : vendorId)}
                                                                className={styles.stepperBtn}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className={styles.quantityVal}>{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.plant.id, item.quantity + 1, vendorId === 'vanamap' ? undefined : vendorId)}
                                                                className={`${styles.stepperBtn} ${styles.add}`}
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.plant.id, vendorId === 'vanamap' ? undefined : vendorId)}
                                                            className={styles.removeBtn}
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={16} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Subtotal */}
                                    <div className={styles.groupFooter}>
                                        <span className={styles.subtotalLabel}>Subtotal ({cartItems.length} items)</span>
                                        <span className={styles.subtotalValue}>{formatCurrency(totalPrice)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Note */}
                {items.length > 0 && (
                    <div className={styles.footerNote}>
                        <p>Prices are set by individual vendors. Delivery terms and final availability are confirmed upon order.</p>
                        {!user && (
                            <Button variant="outline" className="mt-4" onClick={() => navigate('/auth')}>
                                Sign In / Register Account
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
