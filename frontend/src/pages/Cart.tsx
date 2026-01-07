import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, MessageCircle, MapPin, Store, Lock, ShieldCheck, Info, Phone, Smartphone, RefreshCw, CheckCircle2, CloudRain } from 'lucide-react';
import { Button } from '../components/common/Button';
import { fetchVendors, completePurchase } from '../services/api';
import { formatCurrency } from '../utils/currency';
import type { Vendor, CartItem } from '../types';
import styles from './Cart.module.css';

export const Cart = () => {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { user, loading } = useAuth();
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

    // Auth Gate for Cart
    if (loading) return <div className={styles.container}><div style={{ textAlign: 'center', color: 'white' }}>Loading Cart...</div></div>;

    if (!user) {
        return (
            <div className={styles.lockContainer}>
                <div className={styles.sky}>
                    <CloudRain size={120} className={styles.cloud} style={{ top: '10%', left: '-10%', opacity: 0.4 }} />
                    <CloudRain size={80} className={styles.cloud} style={{ top: '20%', animationDelay: '5s', opacity: 0.3 }} />
                </div>
                <div className={styles.lockOverlay}>
                    <div className={styles.lockCard}>
                        <div className={styles.lockIcon}><ShoppingCart size={40} /></div>
                        <h1 className={styles.lockTitle}>Secure Bag 🛒</h1>
                        <p className={styles.lockDesc}>
                            Please <strong>sign in</strong> to manage your orders, sync your cart across devices, and arrange WhatsApp delivery.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <Smartphone className={styles.featureIcon} size={24} />
                                <span>Sync Cart Across All Devices</span>
                            </div>
                            <div className={styles.featureItem}>
                                <RefreshCw className={styles.featureIcon} size={24} />
                                <span>Real-time Stock Updates</span>
                            </div>
                            <div className={styles.featureItem}>
                                <CheckCircle2 className={styles.featureIcon} size={24} />
                                <span>Secure WhatsApp Checkout</span>
                            </div>
                        </div>

                        <div className={styles.authButtons}>
                            <button onClick={() => navigate('/auth?view=login')} className={styles.loginBtn}>Login Here</button>
                            <button onClick={() => navigate('/auth?view=signup')} className={styles.signupBtn}>Create Account</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
        let msg = `Hi, I am ${user.name}. I found your shop on VanaMap and would like to place an order.\n\n*Order Details:*\n`;
        let total = 0;
        vItems.forEach(i => {
            const isCustomPot = i.plant.id.startsWith('cp_');
            if (!isCustomPot) {
                const price = i.vendorPrice || i.plant.price || 0;
                msg += `- ${i.plant.name} (Qty: ${i.quantity}) @ ${formatCurrency(price)}\n`;
                total += price * i.quantity;
            } else {
                msg += `- ${i.plant.name} (Qty: ${i.quantity}) [Price TBD]\n`;
            }
        });
        if (total > 0) {
            msg += `\n*Total Estimated Value: ${formatCurrency(total)}*\n`;
        }
        msg += `\nPlease confirm stock availability and delivery timeline.`;

        // Open WhatsApp
        const waNumber = vendor.whatsapp || vendor.phone;
        const cleanNumber = waNumber.replace(/[^0-9]/g, '');
        const url = `https://wa.me/${cleanNumber.length < 10 ? '91' + cleanNumber : cleanNumber}?text=${encodeURIComponent(msg)}`;

        // Background award points and track sale
        const purchaseData = vItems.map(i => ({
            plantId: i.plant.id,
            vendorId: vendor.id,
            quantity: i.quantity,
            price: i.vendorPrice || i.plant.price || 0,
            plantName: i.plant.name
        }));
        completePurchase(purchaseData).catch(console.error);

        window.open(url, '_blank');

        // Note: We don't automatically remove items to allow user to retry if WA fails, 
        // or we could prompt "Did you complete the order?". For now, keep them.
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

                {/* Multi-Vendor Alert */}
                {Object.keys(groupedItems).length > 1 && (
                    <div className={styles.multiVendorAlert}>
                        <Info size={20} />
                        <span>Your cart contains items from multiple sellers. Please checkout from each seller separately to ensure separate delivery.</span>
                    </div>
                )}

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
                            Browse Market
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Iterating Groups */}
                        {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                            const isVanaMap = vendorId === 'vanamap';
                            const vendor = vendors[vendorId];
                            const totalPrice = cartItems.reduce((sum, i) => {
                                const isCustomPot = i.plant.id.startsWith('cp_');
                                if (isCustomPot) return sum;
                                return sum + ((i.vendorPrice || i.plant.price || 0) * i.quantity);
                            }, 0);

                            // If vendor data is missing (async load), show skeleton or placeholder
                            const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');

                            return (
                                <div key={vendorId} className={styles.vendorGroup}>
                                    {/* Group Header */}
                                    <div className={styles.groupHeader}>
                                        <div className={styles.vendorInfoWrapper}>
                                            <div className={styles.vendorTitleRow}>
                                                <Store size={22} className={isVanaMap ? "text-emerald-400" : "text-amber-400"} />
                                                <div className={styles.vendorName}>
                                                    {vendorName}
                                                </div>
                                                {isVanaMap ? (
                                                    <span className={styles.officialBadge}><ShieldCheck size={12} /> Official</span>
                                                ) : (
                                                    <span className={styles.partnerBadge}>Partner</span>
                                                )}
                                            </div>

                                            {!isVanaMap && vendor && (
                                                <div className={styles.vendorMeta}>
                                                    {vendor.address && (
                                                        <div className={styles.metaItem}>
                                                            <MapPin size={12} /> {vendor.address}
                                                        </div>
                                                    )}
                                                    {vendor.phone && (
                                                        <div className={styles.metaItem}>
                                                            <Phone size={12} /> {vendor.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.headerRight}>
                                            {user ? (
                                                <button
                                                    className={styles.whatsappBtn}
                                                    onClick={() => handleWhatsAppCheckout(vendorId)}
                                                >
                                                    <MessageCircle size={18} /> Checkout via WhatsApp
                                                </button>
                                            ) : (
                                                <div className={styles.loginPrompt}>
                                                    <Lock size={14} /> Login to Order
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className={styles.itemsList}>
                                        {cartItems.map((item) => {
                                            const isCustomPot = item.plant.id.startsWith('cp_');
                                            return (
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

                                                        {isCustomPot && (
                                                            <div className={styles.comingSoonBadge}>
                                                                <Info size={12} /> Stay tuned! This buying option is coming soon 🚀
                                                            </div>
                                                        )}

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
                                            );
                                        })}
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
                        <p>Prices are set by individual vendors. Delivery terms and final availability are confirmed upon order via WhatsApp.</p>
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
