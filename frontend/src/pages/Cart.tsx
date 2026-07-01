import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, Store, Lock, ShieldCheck, Info, Smartphone, RefreshCw, CheckCircle2, CloudRain, CreditCard, Navigation, ChevronDown, ChevronUp, Clock, Truck, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { fetchVendors, createCartOrder, verifyCartPayment, fetchSystemSetting, fetchUserOrders, fetchPlants } from '../services/api';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import type { Vendor, CartItem, Plant } from '../types';
import styles from './Cart.module.css';
import { getLocation } from '../utils/getLocation';

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DeliveryAddress {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
}

// Draggable marker sub-component
const DraggableMarker = ({ position, onDrag }: { position: [number, number]; onDrag: (lat: number, lng: number) => void }) => {
    const markerRef = useRef<L.Marker>(null);

    useMapEvents({
        click(e) {
            onDrag(e.latlng.lat, e.latlng.lng);
        }
    });

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker) {
                const ll = marker.getLatLng();
                onDrag(ll.lat, ll.lng);
            }
        }
    };

    return <Marker draggable position={position} ref={markerRef} eventHandlers={eventHandlers} />;
};

export const Cart = () => {
    const { items, removeFromCart, removeItems, updateQuantity } = useCart();
    const { user, loading, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<Record<string, Vendor>>({});
    const [payingVendor, setPayingVendor] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: null,
        longitude: null
    });
    const mapRef = useRef<L.Map | null>(null);

    const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
    const [suggestions, setSuggestions] = useState<Plant[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeOrdersExpanded, setActiveOrdersExpanded] = useState(true);

    const loadOrders = useCallback(async () => {
        if (!user) return;
        try {
            const data = await fetchUserOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to load orders:", err);
        }
    }, [user]);

    useEffect(() => {
        const loadVendors = async () => {
            const list = await fetchVendors();
            const map: Record<string, Vendor> = {};
            list.forEach(v => map[v.id] = v);
            setVendors(map);
        };
        const loadSuggestions = async () => {
            try {
                const list = await fetchPlants();
                setSuggestions(list.slice(0, 6));
            } catch (err) {
                console.error("Failed to load suggestions:", err);
            }
        };
        loadVendors();
        loadOrders();
        loadSuggestions();
    }, [loadOrders]);

    const renderActiveOrders = () => {
        const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered');
        if (!user || activeOrders.length === 0) return null;

        return (
            <div className={styles.activeOrdersSection}>
                <button
                    className={styles.activeOrdersToggle}
                    onClick={() => setActiveOrdersExpanded(!activeOrdersExpanded)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginBottom: '1rem'
                    }}
                >
                    <div className={styles.activeOrdersToggleLeft} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={20} className={styles.activeOrdersIcon} style={{ color: '#10b981' }} />
                        <span className={styles.activeOrdersTitle}>Track Shipments ({activeOrders.length})</span>
                    </div>
                    {activeOrdersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeOrdersExpanded && (
                    <div className={styles.activeOrdersList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeOrders.map((order: any) => {
                            const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
                                pending: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={12} /> },
                                completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={12} /> },
                                shipped: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: <Truck size={12} /> }
                            };
                            const sc = statusConfig[order.status] || statusConfig.pending;
                            const steps = [
                                { label: 'Placed', active: true },
                                { label: 'Packed', active: ['completed', 'shipped'].includes(order.status) },
                                { label: 'Shipped', active: ['shipped'].includes(order.status) },
                                { label: 'Delivered', active: false }
                            ];

                            return (
                                <div key={order._id} className={styles.activeOrderCard} style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    padding: '1.25rem'
                                }}>
                                    <div className={styles.activeOrderHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 className={styles.activeOrderPlantName} style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>{order.plantName}</h4>
                                            <p className={styles.activeOrderVendorName} style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                from {order.vendorInfo?.name || 'VanaMap Official'}
                                            </p>
                                        </div>
                                        <div className={styles.activeOrderStatusBadge} style={{ 
                                            color: sc.color, 
                                            backgroundColor: sc.bg,
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {sc.icon} <span>{order.status}</span>
                                        </div>
                                    </div>

                                    {/* Estimated Delivery Date range */}
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.01)',
                                        border: '1px solid rgba(255, 255, 255, 0.03)',
                                        borderRadius: '8px',
                                        padding: '6px 10px',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.75rem'
                                    }}>
                                        <span style={{ color: '#cbd5e1' }}>Est. Delivery:</span>
                                        <span style={{ fontWeight: 800, color: '#10b981' }}>
                                            {(() => {
                                                const orderDate = new Date(order.timestamp);
                                                const minDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
                                                const maxDate = new Date(orderDate.getTime() + 48 * 60 * 60 * 1000);
                                                return `${minDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${maxDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
                                            })()}
                                        </span>
                                    </div>

                                    {/* Visual Stepper */}
                                    <div className={styles.activeOrderTracker} style={{ position: 'relative', margin: '1.25rem 0' }}>
                                        <div className={styles.trackerLineBg} style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                                        <div 
                                            className={styles.trackerLineProgress} 
                                            style={{
                                                position: 'absolute', top: '10px', left: '10%',
                                                width: order.status === 'shipped' ? '54%' :
                                                       order.status === 'completed' ? '27%' : '0%',
                                                height: '2px',
                                                background: '#10b981',
                                                zIndex: 0,
                                                transition: 'width 0.4s ease'
                                            }}
                                        />
                                        <div className={styles.trackerSteps} style={{ display: 'flex', justifyContent: 'space-between', zIndex: 1, position: 'relative' }}>
                                            {steps.map((step, idx) => (
                                                <div key={idx} className={styles.trackerStep} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
                                                    <div className={`${styles.stepDot} ${step.active ? styles.stepDotActive : ''}`} style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        background: step.active ? '#10b981' : '#1e293b',
                                                        border: `2px solid ${step.active ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: step.active ? '#000' : 'rgba(255,255,255,0.4)',
                                                        fontSize: '9px',
                                                        fontWeight: 900
                                                    }}>
                                                        {step.active ? '✓' : idx + 1}
                                                    </div>
                                                    <span className={`${styles.stepLabel} ${step.active ? styles.stepLabelActive : ''}`} style={{
                                                        fontSize: '0.7rem',
                                                        marginTop: '4px',
                                                        color: step.active ? '#fff' : 'rgba(255,255,255,0.4)',
                                                        fontWeight: step.active ? 800 : 500
                                                    }}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text-based status log */}
                                    <div style={{
                                        background: 'rgba(16, 185, 129, 0.03)',
                                        border: '1px solid rgba(16, 185, 129, 0.08)',
                                        borderRadius: '10px',
                                        padding: '8px 12px',
                                        fontSize: '0.75rem',
                                        color: '#cbd5e1',
                                        lineHeight: 1.4,
                                        marginTop: '1rem'
                                    }}>
                                        <span style={{ color: '#10b981', fontWeight: 800, display: 'block', marginBottom: '2px' }}>Logs:</span>
                                        {(() => {
                                            switch (order.status) {
                                                case 'shipped':
                                                    return "Package is in transit! A delivery driver is transporting your plant package directly to your pin.";
                                                case 'completed':
                                                    return "Nursery is preparing your plants. Stocks are selected, pruned, and secured with organic protective soil wraps.";
                                                default:
                                                    return "Order placed successfully. Nursery is checking stock availability and coordinating logistics pickup.";
                                            }
                                        })()}
                                    </div>

                                    {/* OTP verification banner */}
                                    {order.status === 'shipped' && order.deliveryOTP && (
                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            borderRadius: '12px',
                                            padding: '10px 12px',
                                            marginTop: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '8px'
                                        }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <Lock size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>Delivery Handoff OTP</div>
                                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.2 }}>
                                                        Provide driver this security code to verify package delivery.
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{
                                                background: 'rgba(245, 158, 11, 0.15)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                                fontSize: '1rem',
                                                fontWeight: 900,
                                                color: '#f59e0b',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {order.deliveryOTP}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const [deliveryRules, setDeliveryRules] = useState({
        freeRadiusKm: 3,
        baseFee: 40,
        chargeableLimitKm: 5,
        perKmFee: 10,
        maxDistanceKm: 25,
        hqLatitude: 10.008,
        hqLongitude: 76.315
    });

    useEffect(() => {
        const loadDeliveryRules = async () => {
            try {
                const res = await fetchSystemSetting('delivery_rules');
                if (res && res.value) {
                    setDeliveryRules(res.value);
                }
            } catch (err) {
                console.error("Failed to load delivery rules:", err);
            }
        };
        loadDeliveryRules();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getDeliveryDetails = (vendorId: string) => {
        if (!deliveryAddress.latitude || !deliveryAddress.longitude) {
            return { fee: 0, distance: 0, outOfRange: false, pending: true };
        }

        const isVanaMap = vendorId === 'vanamap';
        const vendor = isVanaMap 
            ? { latitude: deliveryRules.hqLatitude, longitude: deliveryRules.hqLongitude }
            : vendors[vendorId];

        if (!vendor || vendor.latitude === undefined || vendor.longitude === undefined) {
            return { fee: 0, distance: 0, outOfRange: false, pending: true };
        }

        const distance = calculateDistance(
            deliveryAddress.latitude,
            deliveryAddress.longitude,
            vendor.latitude,
            vendor.longitude
        );

        const maxRadius = (vendor && 'deliveryRadius' in vendor && vendor.deliveryRadius !== undefined) ? vendor.deliveryRadius : deliveryRules.maxDistanceKm;
        if (distance > maxRadius) {
            return { fee: 0, distance, outOfRange: true, pending: false };
        }

        let fee = 0;
        if (distance > deliveryRules.freeRadiusKm) {
            fee = deliveryRules.baseFee;
            if (distance > deliveryRules.chargeableLimitKm) {
                fee += Math.ceil((distance - deliveryRules.chargeableLimitKm) * deliveryRules.perKmFee);
            }
        }

        return { fee, distance, outOfRange: false, pending: false };
    };

    // Auto-fill from user location if available
    useEffect(() => {
        if (user && (user as any).latitude && (user as any).longitude) {
            setDeliveryAddress(prev => ({
                ...prev,
                latitude: prev.latitude || (user as any).latitude,
                longitude: prev.longitude || (user as any).longitude,
                city: prev.city || (user as any).city || '',
                state: prev.state || (user as any).state || ''
            }));
        }
    }, [user]);

    const handleUseMyLocation = useCallback(async () => {
        setLocating(true);

        try {
            const result = await getLocation({
                useCache: true,
                useIPFallback: true,
                highAccuracyTimeout: 10000,
                lowAccuracyTimeout: 8000
            });

            const lat = result.latitude;
            const lng = result.longitude;
            setDeliveryAddress(prev => ({ ...prev, latitude: lat, longitude: lng }));

            // Reverse geocode
            try {
                const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                const data = await resp.json();
                if (data.address) {
                    setDeliveryAddress(prev => ({
                        ...prev,
                        address: data.display_name?.split(',').slice(0, 3).join(', ') || prev.address,
                        city: data.address.city || data.address.town || data.address.village || prev.city,
                        state: data.address.state || prev.state,
                        pincode: data.address.postcode || prev.pincode
                    }));
                }
            } catch (e) {
                console.error('Reverse geocode failed:', e);
            }

            if (mapRef.current) {
                mapRef.current.setView([lat, lng], 15);
            }

            if (result.source === 'gps' || result.source === 'cache') {
                toast.success('Location captured!');
            } else if (result.source === 'ip') {
                toast.success('Approximate location detected. Adjust pin if needed.');
            } else {
                toast.success('Using default location. Please adjust the pin.');
            }
        } catch (error) {
            toast.error('Unable to get your location. Please enter manually.');
            console.error('Geolocation error:', error);
        } finally {
            setLocating(false);
        }
    }, []);

    const handleMarkerDrag = useCallback((lat: number, lng: number) => {
        setDeliveryAddress(prev => ({ ...prev, latitude: lat, longitude: lng }));
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
                        <h1 className={styles.lockTitle}>Secure Bag ðŸ›’</h1>
                        <p className={styles.lockDesc}>
                            Please <strong>sign in</strong> to manage your orders, sync your cart across devices, and securely complete payments.
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
                                <span>Secure Online Payment</span>
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

    // Get the delivery address data to send
    const getDeliveryData = () => {
        if (!deliveryAddress.address && !deliveryAddress.city) return undefined;
        return {
            address: deliveryAddress.address,
            city: deliveryAddress.city,
            state: deliveryAddress.state,
            pincode: deliveryAddress.pincode,
            latitude: deliveryAddress.latitude || undefined,
            longitude: deliveryAddress.longitude || undefined
        };
    };

    // --- Razorpay Helpers ---
    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayCheckout = async (vendorId: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        // Require delivery address
        if (!deliveryAddress.address || !deliveryAddress.city) {
            toast.error('Please enter your delivery address and city before checkout');
            setCheckoutStep(2);
            document.getElementById('delivery-address')?.focus();
            return;
        }

        const vItems = groupedItems[vendorId];
        if (!vItems || vItems.length === 0) return;

        const isVanaMap = vendorId === 'vanamap';
        const vendor = isVanaMap
            ? { id: 'vanamap', name: 'VanaMap Official' } as Vendor
            : vendors[vendorId];

        if (!vendor) {
            toast.error('Vendor information not loaded yet');
            return;
        }

        const totalPrice = vItems.reduce((sum, i) => {
            const price = i.vendorPrice || i.plant.price || 0;
            return sum + (price * i.quantity);
        }, 0);

        if (totalPrice <= 0) {
            toast.error('Cart total must be greater than ₹0');
            return;
        }

        const { fee, distance, outOfRange } = getDeliveryDetails(vendorId);
        if (outOfRange) {
            toast.error('Your delivery location is out of range for this vendor');
            return;
        }

        // Validate stock quantities
        if (!isVanaMap && vendor.inventory) {
            for (const item of vItems) {
                const invItem = vendor.inventory.find(i => i.plantId === item.plant.id);
                const stockQty = invItem?.quantity !== undefined ? invItem.quantity : 0;
                if (stockQty < item.quantity) {
                    toast.error(`Insufficient stock for ${item.plant.name}. Only ${stockQty} available.`);
                    return;
                }
            }
        }

        const totalWithDelivery = totalPrice + fee;

        setPayingVendor(vendorId);

        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
            toast.error('Razorpay SDK failed to load. Check your connection.');
            setPayingVendor(null);
            return;
        }

        const itemPayload = vItems.map((i, index) => ({
            plantId: i.plant.id,
            vendorId: vendor.id,
            vendorName: vendor.name,
            quantity: i.quantity,
            price: i.vendorPrice || i.plant.price || 0,
            plantName: i.plant.name,
            deliveryFee: index === 0 ? fee : 0,
            deliveryDistance: distance
        }));

        const delivery = getDeliveryData();

        try {
            const order = await createCartOrder(totalWithDelivery, itemPayload, delivery);

            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: 'VanaMap',
                description: `Order from ${vendor.name} (${vItems.length} items)`,
                image: '/logo.png',
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyData = await verifyCartPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            items: itemPayload,
                            totalAmount: totalWithDelivery,
                            deliveryAddress: delivery
                        });

                        if (verifyData.success) {
                            toast.success(`Payment successful! +${verifyData.pointsAwarded} CP earned 🌿`);
                            // Remove purchased items from cart
                            removeItems(vItems.map(i => ({ plantId: i.plant.id, vendorId: i.vendorId })));
                            await refreshUser();
                            await loadOrders();
                        } else {
                            toast.error('Payment verification failed. Contact support.');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        toast.error('Payment verification failed');
                    } finally {
                        setPayingVendor(null);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: (user as any)?.phone
                },
                theme: {
                    color: '#10b981'
                },
                modal: {
                    ondismiss: () => setPayingVendor(null)
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            console.error('Cart payment error:', err);
            if (err.message?.includes('503') || err.message?.includes('not configured')) {
                toast.error('Payment gateway unavailable. Please try again later.');
            } else {
                toast.error(err.message || 'Payment initiation failed');
            }
            setPayingVendor(null);
        }
    };

    const mapCenter: [number, number] = [
        deliveryAddress.latitude || (user as any)?.latitude || 10.0,
        deliveryAddress.longitude || (user as any)?.longitude || 76.3
    ];

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

                {/* Step Progress Stepper */}
                {items.length > 0 && (
                    <div className={styles.checkoutStepHeader}>
                        {[
                            { step: 1, label: 'Review Cart' },
                            { step: 2, label: 'Delivery Pin' },
                            { step: 3, label: 'Secure Checkout' }
                        ].map((s) => (
                            <div 
                                key={s.step} 
                                className={`${styles.stepIndicator} ${checkoutStep === s.step ? styles.stepIndicatorActive : ''} ${checkoutStep > s.step ? styles.stepIndicatorCompleted : ''}`}
                                onClick={() => {
                                    if (s.step < checkoutStep) setCheckoutStep(s.step as any);
                                }}
                            >
                                <div className={styles.stepNum}>{checkoutStep > s.step ? '✓' : s.step}</div>
                                <span className={styles.stepLabel}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Delivery Location Section & Items List */}
                {items.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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

                        {suggestions.length > 0 && (
                            <div style={{ width: '100%', maxWidth: '600px', marginTop: '2rem', padding: '0 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                    <Sparkles size={16} fill="#fbbf24" />
                                    <span>Recommended For You</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                                    {suggestions.map((prod) => (
                                        <div key={prod.id} style={{ flex: '0 0 160px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            <img src={prod.imageUrl} alt={prod.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'white', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4em' }}>{prod.name}</h4>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', margin: '4px 0 8px' }}>₹{prod.price}</div>
                                                <Button onClick={() => navigate('/shops')} variant="outline" size="sm" style={{ width: '100%', fontSize: '0.7rem', padding: '4px' }}>View Shop</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ width: '100%', maxWidth: '600px', marginTop: '3rem' }}>
                            {renderActiveOrders()}
                        </div>
                    </div>
                ) : (
                    <div className={styles.cartContentLayout}>
                        {/* Left Column - Dynamic based on checkoutStep */}
                        <div className={styles.cartMainCol}>
                            
                            {/* STEP 1: REVIEW CART ITEMS */}
                            {checkoutStep === 1 && (
                                <div className="space-y-6">
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Verify Cart Items</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Review and adjust item quantities from each nursery.</p>
                                    </div>

                                    {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                                        const isVanaMap = vendorId === 'vanamap';
                                        const vendor = vendors[vendorId];
                                        const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');

                                        return (
                                            <div key={vendorId} className={styles.vendorGroup}>
                                                <div className={styles.groupHeaderLeftOnly}>
                                                    <div className={styles.vendorInfoWrapper}>
                                                        <div className={styles.vendorTitleRow}>
                                                            <Store size={20} className={isVanaMap ? "text-emerald-400" : "text-amber-400"} />
                                                            <div className={styles.vendorName}>{vendorName}</div>
                                                            {isVanaMap ? (
                                                                <span className={styles.officialBadge}><ShieldCheck size={12} /> Official</span>
                                                            ) : (
                                                                <span className={styles.partnerBadge}>Partner</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.itemsList}>
                                                    {cartItems.map((item) => {
                                                        const isCustomPot = item.plant.id.startsWith('cp_');
                                                        return (
                                                            <div key={`${item.plant.id}-${vendorId}`} className={styles.itemCard}>
                                                                <img src={item.plant.imageUrl} className={styles.itemThumb} alt={item.plant.name} />
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
                                                                            <button onClick={() => updateQuantity(item.plant.id, item.quantity - 1, item.vendorId)} className={styles.stepperBtn}>
                                                                                <Minus size={14} />
                                                                            </button>
                                                                            <span className={styles.quantityVal}>{item.quantity}</span>
                                                                            <button onClick={() => updateQuantity(item.plant.id, item.quantity + 1, item.vendorId)} className={`${styles.stepperBtn} ${styles.add}`}>
                                                                                <Plus size={14} />
                                                                            </button>
                                                                        </div>
                                                                        <button onClick={() => removeFromCart(item.plant.id, item.vendorId)} className={styles.removeBtn}>
                                                                            <Trash2 size={16} /> Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* STEP 2: SHIPPING ADDRESS LOCATION */}
                            {checkoutStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Set Shipping Address</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Provide delivery location coordinates and address details.</p>
                                    </div>

                                    {user && (
                                        <div className={styles.deliverySection} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '20px', padding: '1.5rem' }}>
                                            <div className={styles.deliveryForm} style={{ padding: 0 }}>
                                                <div className={styles.deliveryRow}>
                                                    <div className={styles.deliveryField} style={{ flex: 2 }}>
                                                        <label>Full Address</label>
                                                        <input
                                                            type="text"
                                                            placeholder="House/Street/Area"
                                                            value={deliveryAddress.address}
                                                            onChange={e => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                                                            className={styles.deliveryInput}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.deliveryRow}>
                                                    <div className={styles.deliveryField}>
                                                        <label>City</label>
                                                        <input
                                                            type="text"
                                                            placeholder="City/Town"
                                                            value={deliveryAddress.city}
                                                            onChange={e => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                                                            className={styles.deliveryInput}
                                                        />
                                                    </div>
                                                    <div className={styles.deliveryField}>
                                                        <label>State</label>
                                                        <input
                                                            type="text"
                                                            placeholder="State"
                                                            value={deliveryAddress.state}
                                                            onChange={e => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                                                            className={styles.deliveryInput}
                                                        />
                                                    </div>
                                                    <div className={styles.deliveryField}>
                                                        <label>Pincode</label>
                                                        <input
                                                            type="text"
                                                            placeholder="PIN"
                                                            value={deliveryAddress.pincode}
                                                            onChange={e => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                                            className={styles.deliveryInput}
                                                            maxLength={6}
                                                        />
                                                    </div>
                                                </div>

                                                <button className={styles.locateBtn} onClick={handleUseMyLocation} disabled={locating}>
                                                    <Navigation size={16} className={locating ? styles.spinning : ''} />
                                                    {locating ? 'Locating...' : 'Use My Current Location'}
                                                </button>

                                                <div className={styles.miniMapContainer}>
                                                    <MapContainer
                                                        center={mapCenter}
                                                        zoom={deliveryAddress.latitude ? 15 : 5}
                                                        style={{ height: '220px', width: '100%', borderRadius: '12px' }}
                                                        ref={mapRef}
                                                        scrollWheelZoom={false}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; OSM'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />
                                                        {(deliveryAddress.latitude && deliveryAddress.longitude) && (
                                                            <DraggableMarker
                                                                position={[deliveryAddress.latitude, deliveryAddress.longitude]}
                                                                onDrag={handleMarkerDrag}
                                                            />
                                                        )}
                                                        {Object.keys(groupedItems).map(vendorId => {
                                                            const isVanaMap = vendorId === 'vanamap';
                                                            const vendor = isVanaMap
                                                                ? { latitude: deliveryRules.hqLatitude, longitude: deliveryRules.hqLongitude, name: 'VanaMap Official' }
                                                                : vendors[vendorId];
                                                            if (!vendor || vendor.latitude === undefined || vendor.longitude === undefined || vendor.latitude === null || vendor.longitude === null) {
                                                                return null;
                                                            }
                                                            return (
                                                                <Fragment key={vendorId}>
                                                                    <Marker position={[vendor.latitude, vendor.longitude]}>
                                                                        <Popup><strong>{vendor.name}</strong></Popup>
                                                                    </Marker>
                                                                </Fragment>
                                                            );
                                                        })}
                                                    </MapContainer>
                                                    <p className={styles.mapHint}>📍 Click or drag the map pin to mark exact coordinates</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: ORDER BILL REVIEW & PAYMENT */}
                            {checkoutStep === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Order Summary Details</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Review final quantities, delivery routes, and billing breakdown before secure payment.</p>
                                    </div>

                                    {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                                        const isVanaMap = vendorId === 'vanamap';
                                        const vendor = vendors[vendorId];
                                        const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');
                                        const { fee, distance } = getDeliveryDetails(vendorId);

                                        return (
                                            <div key={`checkout-group-${vendorId}`} style={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                borderRadius: '16px',
                                                padding: '1.25rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'white', fontSize: '0.9rem' }}>
                                                        <Store size={18} style={{ color: '#10b981' }} />
                                                        <span>{vendorName}</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>({cartItems.length} items)</span>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                                                    {cartItems.map((item) => (
                                                        <div key={item.plant.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                                            <span>{item.quantity}x {item.plant.name}</span>
                                                            <span>{formatCurrency((item.vendorPrice || item.plant.price || 0) * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Delivery Distance</span>
                                                        <span>{distance.toFixed(1)} km</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Delivery Fee</span>
                                                        <span>{fee > 0 ? formatCurrency(fee) : 'FREE'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>

                        {/* Right Column - Checkout Actions Banner */}
                        <div className={styles.cartSidebarCol}>
                            <div className={styles.stickySidebar}>
                                <h2 className={styles.sidebarTitle}>Order Summary</h2>
                                
                                {checkoutStep === 1 && (
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryBody}>
                                            <div className={styles.summaryRow}>
                                                <span>Subtotal Items</span>
                                                <span>{items.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                                            </div>
                                            <div className={styles.summaryRow}>
                                                <span>Cart Value</span>
                                                <span style={{ fontWeight: 800, color: '#10b981' }}>
                                                    {formatCurrency(items.reduce((sum, i) => sum + ((i.vendorPrice || i.plant.price || 0) * i.quantity), 0))}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', lineHeight: 1.4 }}>
                                                Shipping fees and delivery range limits will be calculated in the next step.
                                            </div>
                                        </div>
                                        <div className={styles.summaryFooter} style={{ padding: '1rem' }}>
                                            <button 
                                                className={styles.payOnlineBtn}
                                                style={{ width: '100%', background: '#10b981', display: 'flex', justifyContent: 'center', gap: '6px' }}
                                                onClick={() => setCheckoutStep(2)}
                                            >
                                                Proceed to Shipping Pin ➔
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {checkoutStep === 2 && (
                                    <div className={styles.summaryCard}>
                                        <div className={styles.summaryBody}>
                                            <div className={styles.summaryRow}>
                                                <span>Recipient Address</span>
                                                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '140px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                    {deliveryAddress.address || 'Not specified'}
                                                </span>
                                            </div>
                                            <div className={styles.summaryRow}>
                                                <span>GPS Coordinate Pin</span>
                                                <span style={{ fontSize: '0.8rem', color: deliveryAddress.latitude ? '#10b981' : '#ef4444' }}>
                                                    {deliveryAddress.latitude ? '✓ LOCKED' : '❌ MISSING'}
                                                </span>
                                            </div>
                                            
                                            {/* Geofence checks warning alerts */}
                                            {Object.entries(groupedItems).map(([vendorId, _]) => {
                                                const { distance, outOfRange } = getDeliveryDetails(vendorId);
                                                const vendor = vendors[vendorId];
                                                const maxRadius = (vendor && 'deliveryRadius' in vendor && vendor.deliveryRadius !== undefined) ? vendor.deliveryRadius : deliveryRules.maxDistanceKm;
                                                
                                                if (outOfRange) {
                                                    return (
                                                        <div key={vendorId} className={styles.outOfRangeAlert} style={{ marginTop: '8px', fontSize: '0.75rem', background: 'rgba(239,68,68,0.08)' }}>
                                                            ❌ {vendor?.name || 'Nursery'} exceeds range ({distance.toFixed(1)}km &gt; max {maxRadius}km)
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <div className={styles.summaryFooter} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button 
                                                className={styles.payOnlineBtn}
                                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '6px' }}
                                                disabled={
                                                    !deliveryAddress.latitude || 
                                                    !deliveryAddress.address || 
                                                    Object.keys(groupedItems).some(vendorId => getDeliveryDetails(vendorId).outOfRange)
                                                }
                                                onClick={() => setCheckoutStep(3)}
                                            >
                                                Proceed to Payment ➔
                                            </button>
                                            <button 
                                                style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', padding: '10px 0', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                                                onClick={() => setCheckoutStep(1)}
                                            >
                                                Back to Cart Items
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {checkoutStep === 3 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                                            const isVanaMap = vendorId === 'vanamap';
                                            const vendor = vendors[vendorId];
                                            const totalPrice = cartItems.reduce((sum, i) => sum + ((i.vendorPrice || i.plant.price || 0) * i.quantity), 0);
                                            const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');
                                            const { fee, outOfRange } = getDeliveryDetails(vendorId);

                                            return (
                                                <div key={`checkout-pay-${vendorId}`} className={styles.summaryCard}>
                                                    <div className={styles.summaryHeader}>
                                                        <div className={styles.summaryVendorName}>{vendorName}</div>
                                                    </div>
                                                    <div className={styles.summaryBody}>
                                                        <div className={styles.summaryRow}>
                                                            <span>Subtotal</span>
                                                            <span>{formatCurrency(totalPrice)}</span>
                                                        </div>
                                                        <div className={styles.summaryRow}>
                                                            <span>Shipping Charge</span>
                                                            <span>{fee > 0 ? formatCurrency(fee) : 'FREE'}</span>
                                                        </div>
                                                        <div className={styles.summaryDivider} />
                                                        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                                                            <span>Grand Total</span>
                                                            <span style={{ color: '#10b981', fontWeight: 900 }}>{formatCurrency(totalPrice + fee)}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.summaryFooter} style={{ padding: '1rem' }}>
                                                        <button
                                                            className={styles.payOnlineBtn}
                                                            onClick={() => handleRazorpayCheckout(vendorId)}
                                                            disabled={payingVendor === vendorId || outOfRange}
                                                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '6px' }}
                                                        >
                                                            <CreditCard size={16} />
                                                            <span>{payingVendor === vendorId ? 'Connecting Gateway...' : `Pay ₹${totalPrice + fee}`}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        <button 
                                            style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', padding: '10px 0', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                                            onClick={() => setCheckoutStep(2)}
                                        >
                                            Back to Shipping Pin
                                        </button>
                                    </div>
                                )}

                                <div className={styles.footerNote} style={{ marginTop: '1.5rem' }}>
                                    {renderActiveOrders()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};
