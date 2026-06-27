import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, ShoppingCart, MapPin, Store, Lock, ShieldCheck, Info, Phone, Smartphone, RefreshCw, CheckCircle2, CloudRain, CreditCard, Navigation, ChevronDown, ChevronUp, Clock, Truck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { fetchVendors, createCartOrder, verifyCartPayment, fetchSystemSetting, fetchUserOrders } from '../services/api';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import type { Vendor, CartItem } from '../types';
import styles from './Cart.module.css';
import { getLocation } from '../utils/getLocation';

// Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup } from 'react-leaflet';
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
    const [deliveryExpanded, setDeliveryExpanded] = useState(true);
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
        loadVendors();
        loadOrders();
    }, [loadOrders]);

    const renderActiveOrders = () => {
        const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered');
        if (!user || activeOrders.length === 0) return null;

        return (
            <div className={styles.activeOrdersSection}>
                <button
                    className={styles.activeOrdersToggle}
                    onClick={() => setActiveOrdersExpanded(!activeOrdersExpanded)}
                >
                    <div className={styles.activeOrdersToggleLeft}>
                        <Truck size={20} className={styles.activeOrdersIcon} />
                        <span className={styles.activeOrdersTitle}>My Active Orders ({activeOrders.length})</span>
                    </div>
                    {activeOrdersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeOrdersExpanded && (
                    <div className={styles.activeOrdersList}>
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
                                <div key={order._id} className={styles.activeOrderCard}>
                                    <div className={styles.activeOrderHeader}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 className={styles.activeOrderPlantName}>{order.plantName}</h4>
                                            <p className={styles.activeOrderVendorName}>
                                                from {order.vendorInfo?.name || 'VanaMap Official'}
                                            </p>
                                        </div>
                                        <div className={styles.activeOrderStatusBadge} style={{ color: sc.color, backgroundColor: sc.bg }}>
                                            {sc.icon} <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                                        </div>
                                    </div>

                                    <div className={styles.activeOrderTracker}>
                                        <div className={styles.trackerLineBg} />
                                        <div 
                                            className={styles.trackerLineProgress} 
                                            style={{
                                                width: order.status === 'shipped' ? '66%' :
                                                       order.status === 'completed' ? '33%' : '0%'
                                            }}
                                        />
                                        <div className={styles.trackerSteps}>
                                            {steps.map((step, idx) => (
                                                <div key={idx} className={styles.trackerStep}>
                                                    <div className={`${styles.stepDot} ${step.active ? styles.stepDotActive : ''}`}>
                                                        {step.active ? '✓' : idx + 1}
                                                    </div>
                                                    <span className={`${styles.stepLabel} ${step.active ? styles.stepLabelActive : ''}`}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.activeOrderMeta}>
                                        {order.deliveryAddress?.address ? (
                                            <div className={styles.activeOrderAddress}>
                                                <MapPin size={11} />
                                                <span>{order.deliveryAddress.address}, {order.deliveryAddress.city}</span>
                                            </div>
                                        ) : (
                                            <div className={styles.activeOrderAddress}>
                                                <MapPin size={11} />
                                                <span>Self pickup / No address</span>
                                            </div>
                                        )}
                                        <div className={styles.activeOrderDate}>
                                            {new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
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

        if (distance > deliveryRules.maxDistanceKm) {
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
            setDeliveryExpanded(true);
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
                        <div style={{ width: '100%', maxWidth: '600px', marginTop: '2rem' }}>
                            {renderActiveOrders()}
                        </div>
                    </div>
                ) : (
                    <div className={styles.cartContentLayout}>
                        {/* Left Column - Delivery Mapper & Items List */}
                        <div className={styles.cartMainCol}>
                            {/* Delivery Location Section */}
                            {user && (
                                <div className={styles.deliverySection}>
                                    <button
                                        className={styles.deliveryToggle}
                                        onClick={() => setDeliveryExpanded(!deliveryExpanded)}
                                        id="delivery-toggle"
                                    >
                                        <div className={styles.deliveryToggleLeft}>
                                            <MapPin size={20} className={styles.deliveryIcon} />
                                            <div>
                                                <span className={styles.deliveryTitle}>Delivery Location</span>
                                                {deliveryAddress.address && !deliveryExpanded && (
                                                    <span className={styles.deliveryPreview}>{deliveryAddress.address}</span>
                                                )}
                                            </div>
                                        </div>
                                        {deliveryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    {deliveryExpanded && (
                                        <div className={styles.deliveryForm}>
                                            <div className={styles.deliveryRow}>
                                                <div className={styles.deliveryField} style={{ flex: 2 }}>
                                                    <label>Full Address</label>
                                                    <input
                                                        type="text"
                                                        id="delivery-address"
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
                                                        id="delivery-city"
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
                                                        id="delivery-state"
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
                                                        id="delivery-pincode"
                                                        placeholder="PIN"
                                                        value={deliveryAddress.pincode}
                                                        onChange={e => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                                        className={styles.deliveryInput}
                                                        maxLength={6}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className={styles.locateBtn}
                                                onClick={handleUseMyLocation}
                                                disabled={locating}
                                                id="use-my-location"
                                            >
                                                <Navigation size={16} className={locating ? styles.spinning : ''} />
                                                {locating ? 'Locating...' : 'Use My Current Location'}
                                            </button>

                                            <div className={styles.miniMapContainer}>
                                                <MapContainer
                                                    center={mapCenter}
                                                    zoom={deliveryAddress.latitude ? 15 : 5}
                                                    style={{ height: '200px', width: '100%', borderRadius: '12px' }}
                                                    ref={mapRef}
                                                    scrollWheelZoom={false}
                                                >
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
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
                                                                    <Popup>
                                                                        <strong>{vendor.name}</strong>
                                                                        <br />
                                                                        Free Delivery: {deliveryRules.freeRadiusKm} km
                                                                        <br />
                                                                        Max Delivery Range: {deliveryRules.maxDistanceKm} km
                                                                    </Popup>
                                                                </Marker>
                                                                <Circle
                                                                    center={[vendor.latitude, vendor.longitude]}
                                                                    radius={deliveryRules.freeRadiusKm * 1000}
                                                                    pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15 }}
                                                                />
                                                                <Circle
                                                                    center={[vendor.latitude, vendor.longitude]}
                                                                    radius={deliveryRules.maxDistanceKm * 1000}
                                                                    pathOptions={{ color: '#ef4444', dashArray: '5, 5', fillOpacity: 0.02 }}
                                                                />
                                                            </Fragment>
                                                        );
                                                    })}
                                                </MapContainer>
                                                <p className={styles.mapHint}>📍 Click the map or drag the pin to set exact delivery location</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cart Item Cards grouped by vendor */}
                            <div className="space-y-6">
                                {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                                    const isVanaMap = vendorId === 'vanamap';
                                    const vendor = vendors[vendorId];
                                    const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');

                                    return (
                                        <div key={vendorId} className={styles.vendorGroup}>
                                            {/* Group Header */}
                                            <div className={styles.groupHeaderLeftOnly}>
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
                                                                            onClick={() => updateQuantity(item.plant.id, item.quantity - 1, item.vendorId)}
                                                                            className={styles.stepperBtn}
                                                                        >
                                                                            <Minus size={14} />
                                                                        </button>
                                                                        <span className={styles.quantityVal}>{item.quantity}</span>
                                                                        <button
                                                                            onClick={() => updateQuantity(item.plant.id, item.quantity + 1, item.vendorId)}
                                                                            className={`${styles.stepperBtn} ${styles.add}`}
                                                                        >
                                                                            <Plus size={14} />
                                                                        </button>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => removeFromCart(item.plant.id, item.vendorId)}
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column - Sticky Order Summaries & Checkout */}
                        <div className={styles.cartSidebarCol}>
                            <div className={styles.stickySidebar}>
                                <h2 className={styles.sidebarTitle}>Order Summary</h2>
                                {renderActiveOrders()}
                                {Object.entries(groupedItems).map(([vendorId, cartItems]) => {
                                    const isVanaMap = vendorId === 'vanamap';
                                    const vendor = vendors[vendorId];
                                    const totalPrice = cartItems.reduce((sum, i) => {
                                        const price = i.vendorPrice || i.plant.price || 0;
                                        return sum + (price * i.quantity);
                                    }, 0);
                                    const vendorName = isVanaMap ? 'VanaMap Official' : (vendor?.name || 'Loading Vendor...');
                                    const { fee, distance, outOfRange, pending } = getDeliveryDetails(vendorId);

                                    return (
                                        <div key={`summary-${vendorId}`} className={styles.summaryCard}>
                                            <div className={styles.summaryHeader}>
                                                <div className={styles.summaryVendorName}>{vendorName}</div>
                                                {isVanaMap ? (
                                                    <span className={styles.officialBadge}><ShieldCheck size={12} /> Official</span>
                                                ) : (
                                                    <span className={styles.partnerBadge}>Partner</span>
                                                )}
                                            </div>
                                            
                                            <div className={styles.summaryBody}>
                                                <div className={styles.summaryRow}>
                                                    <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                                                    <span>{formatCurrency(totalPrice)}</span>
                                                </div>
                                                {!pending && (
                                                    <>
                                                        <div className={styles.summaryRow}>
                                                            <span>Delivery Distance</span>
                                                            <span>{distance.toFixed(1)} km</span>
                                                        </div>
                                                        <div className={styles.summaryRow}>
                                                            <span>Delivery Fee</span>
                                                            <span>{fee > 0 ? formatCurrency(fee) : 'FREE'}</span>
                                                        </div>
                                                        {outOfRange ? (
                                                            <div className={styles.outOfRangeAlert}>
                                                                📍 Out of delivery range (Max: {deliveryRules.maxDistanceKm} km)
                                                            </div>
                                                        ) : (
                                                            fee === 0 && (
                                                                <div className={styles.freeDeliveryAlert}>
                                                                    🎉 Within free delivery radius!
                                                                </div>
                                                            )
                                                        )}
                                                        <div className={styles.summaryDivider} />
                                                        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                                                            <span>Grand Total</span>
                                                            <span>{formatCurrency(totalPrice + fee)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                {pending && (
                                                    <div className={styles.pendingAddressAlert}>
                                                        📍 Set delivery address to calculate delivery fee
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.summaryFooter}>
                                                {user ? (
                                                    <div className={styles.sidebarCheckoutButtons}>
                                                        <button
                                                            className={styles.payOnlineBtn}
                                                            onClick={() => handleRazorpayCheckout(vendorId)}
                                                            disabled={payingVendor === vendorId || outOfRange || pending}
                                                        >
                                                            <CreditCard size={18} />
                                                            {payingVendor === vendorId ? 'Processing...' : 'Pay Online'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={styles.loginPrompt}>
                                                        <Lock size={14} /> Login to Order
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className={styles.footerNote}>
                                    <p>Prices are set by individual vendors. Payments are securely processed via Razorpay.</p>
                                    {!user && (
                                        <Button variant="outline" className="mt-4" onClick={() => navigate('/auth')}>
                                            Sign In / Register Account
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};
