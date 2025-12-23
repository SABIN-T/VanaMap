import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, MessageCircle, MapPin, Store, Lock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { fetchVendors } from '../services/api';
import { formatCurrency } from '../utils/currency';
import type { Vendor, CartItem } from '../types';

export const Cart = () => {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<Record<string, Vendor>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVendors = async () => {
            const list = await fetchVendors();
            const map: Record<string, Vendor> = {};
            list.forEach(v => map[v.id] = v);
            setVendors(map);
            setLoading(false);
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

        const vendor = vendors[vendorId];
        const vItems = groupedItems[vendorId];
        if (!vendor || !vItems) return;

        let msg = `Hello ${vendor.name}, I would like to order the following from VanaMap:\n\n`;
        let total = 0;
        vItems.forEach(i => {
            const price = i.vendorPrice || i.plant.price || 0;
            msg += `🌱 ${i.plant.name} x${i.quantity} @ ${formatCurrency(price)}\n`;
            total += price * i.quantity;
        });
        msg += `\n💰 Total Estimate: ${formatCurrency(total)}\n`;
        msg += `\nPlease confirm availability. My User ID: ${user.name}`;

        const url = `https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container" style={{ padding: '8rem 1rem 4rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all border border-white/10"
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
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingCart size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl text-white font-bold mb-4">Your cart is empty</h2>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
                            Discover rare specimens and verified sellers in your area.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => navigate('/shops')} variant="primary" size="lg">
                                Browse Market
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Iterating Groups */}
                        {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                            const isVanaMap = vendorId === 'vanamap';
                            const vendor = vendors[vendorId];
                            const totalPrice = cartItems.reduce((sum, i) => sum + ((i.vendorPrice || i.plant.price || 0) * i.quantity), 0);

                            return (
                                <div key={vendorId} className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
                                    {/* Group Header */}
                                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {isVanaMap ? (
                                                <Store size={20} className="text-emerald-400" />
                                            ) : (
                                                <Store size={20} className="text-amber-400" />
                                            )}
                                            <span className="font-bold text-white text-lg">
                                                {isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Unknown Vendor')}
                                            </span>
                                            {!isVanaMap && vendor && (
                                                <div className="flex items-center gap-1 text-xs text-slate-400 ml-2">
                                                    <MapPin size={12} /> {vendor.address}
                                                </div>
                                            )}
                                        </div>
                                        {/* Vendor Action */}
                                        {!isVanaMap && (
                                            <div>
                                                {user ? (
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none flex items-center gap-2"
                                                        onClick={() => handleWhatsAppCheckout(vendorId)}
                                                    >
                                                        <MessageCircle size={16} /> Send Order via WhatsApp
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-amber-500 text-sm font-bold bg-amber-500/10 px-3 py-1 rounded-lg">
                                                        <Lock size={14} /> Login to Order
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div className="p-4 space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={`${item.plant.id}-${vendorId}`} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 transition-all hover:border-white/10">
                                                <img
                                                    src={item.plant.imageUrl}
                                                    className="w-20 h-20 rounded-lg object-cover border border-white/10 shadow-lg"
                                                    alt={item.plant.name}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">{item.plant.name}</h3>
                                                            <p className="text-sm text-slate-400 italic">{item.plant.scientificName}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-emerald-400 font-bold mb-1">
                                                                {formatCurrency(item.vendorPrice || item.plant.price || 0)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
                                                            <button
                                                                onClick={() => updateQuantity(item.plant.id, item.quantity - 1, vendorId === 'vanamap' ? undefined : vendorId)}
                                                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-white font-bold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.plant.id, item.quantity + 1, vendorId === 'vanamap' ? undefined : vendorId)}
                                                                className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.plant.id, vendorId === 'vanamap' ? undefined : vendorId)}
                                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Subtotal */}
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-white">
                                            <span className="text-slate-400 text-sm font-medium">Subtotal ({cartItems.length} items)</span>
                                            <span className="text-xl font-bold">{formatCurrency(totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Note */}
                {items.length > 0 && (
                    <div className="mt-8 text-center text-slate-500 text-sm">
                        <p>Prices are set by individual vendors. Delivery terms may vary.</p>
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
