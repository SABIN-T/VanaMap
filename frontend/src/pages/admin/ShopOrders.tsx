import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from './AdminLayout';
import { fetchAdminOrders, fetchAdminOrdersMap, fetchVendors, updateOrderStatus } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import { Search, MapPin, List, Package, Users, ShoppingBag, Store, Calendar, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ShopOrders.module.css';
import type { Vendor } from '../../types';

// Leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Vendor color markers
const VENDOR_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const createColoredIcon = (color: string) => L.divIcon({
    className: '',
    html: `<div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

interface OrderItem {
    _id: string;
    vendorId: string;
    userId: string;
    userName: string;
    plantId: string;
    plantName: string;
    price: number;
    quantity: number;
    status: string;
    timestamp: string;
    deliveryAddress?: {
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        latitude?: number;
        longitude?: number;
    };
    vendorInfo?: {
        name?: string;
        address?: string;
        phone?: string;
    };
}

interface MapOrder {
    _id: string;
    plantName: string;
    userName: string;
    vendorName: string;
    vendorId: string;
    quantity: number;
    price: number;
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    timestamp: string;
    status: string;
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12);
        }
    }, [center, map]);
    return null;
};

export const ShopOrders = () => {
    const [view, setView] = useState<'table' | 'map'>('table');
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [mapOrders, setMapOrders] = useState<MapOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [vendorFilter, setVendorFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [vendorColorMap, setVendorColorMap] = useState<Record<string, string>>({});
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizedPath, setOptimizedPath] = useState<[number, number][]>([]);
    const [stopSequence, setStopSequence] = useState<MapOrder[]>([]);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Route Optimization TSP effect
    useEffect(() => {
        if (!isOptimizing || !vendorFilter) {
            setOptimizedPath([]);
            setStopSequence([]);
            return;
        }

        const activeVendor = vendors.find(v => v.id === vendorFilter);
        if (!activeVendor || activeVendor.latitude === undefined || activeVendor.longitude === undefined) {
            toast.error("Selected vendor does not have coordinates configured.");
            setIsOptimizing(false);
            return;
        }

        // Filter active map orders for this vendor
        const eligibleOrders = mapOrders.filter(o => 
            o.vendorId === vendorFilter && 
            o.lat && 
            o.lng && 
            ['pending', 'shipped', 'completed'].includes(o.status)
        );

        if (eligibleOrders.length === 0) {
            toast.error("No active orders with valid coordinates to optimize.");
            setIsOptimizing(false);
            return;
        }

        // Nearest Neighbor TSP algorithm
        const path: [number, number][] = [[activeVendor.latitude, activeVendor.longitude]];
        const sequence: MapOrder[] = [];
        const unvisited = [...eligibleOrders];
        let currentLat = activeVendor.latitude;
        let currentLng = activeVendor.longitude;

        while (unvisited.length > 0) {
            let nearestIdx = -1;
            let minDistance = Infinity;

            for (let i = 0; i < unvisited.length; i++) {
                const dist = getDistance(currentLat, currentLng, unvisited[i].lat, unvisited[i].lng);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestIdx = i;
                }
            }

            if (nearestIdx !== -1) {
                const nextStop = unvisited.splice(nearestIdx, 1)[0];
                path.push([nextStop.lat, nextStop.lng]);
                sequence.push(nextStop);
                currentLat = nextStop.lat;
                currentLng = nextStop.lng;
            } else {
                break;
            }
        }

        setOptimizedPath(path);
        setStopSequence(sequence);
        toast.success(`Optimized route with ${sequence.length} stops computed successfully!`);
    }, [isOptimizing, vendorFilter, mapOrders, vendors]);

    // Load vendors for filter dropdown
    useEffect(() => {
        fetchVendors().then(v => {
            setVendors(v);
            const colorMap: Record<string, string> = {};
            v.forEach((vv, i) => { colorMap[vv.id] = VENDOR_COLORS[i % VENDOR_COLORS.length]; });
            setVendorColorMap(colorMap);
        }).catch(console.error);
    }, []);

    // Load table data
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchAdminOrders({ search, status: statusFilter, vendorId: vendorFilter, page, limit: 30 });
                setOrders(data.orders || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            } catch (e) {
                console.error('Load orders error:', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [search, statusFilter, vendorFilter, page]);

    // Load map data
    useEffect(() => {
        if (view === 'map') {
            fetchAdminOrdersMap().then(data => setMapOrders(data || [])).catch(console.error);
        }
    }, [view]);

    const handleSearch = (val: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setSearch(val);
            setPage(1);
        }, 400);
    };

    // Stats
    const totalRevenue = orders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

    const formatDate = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const formatTime = (d: string) => {
        const date = new Date(d);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AdminLayout title="Shop Orders">
            <div className={styles.container}>
                {/* Stats */}
                <div className={styles.statsBar}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <span className={styles.statValue}>{total}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Revenue (Page)</span>
                        <span className={`${styles.statValue} ${styles.amber}`}>{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Customers (Page)</span>
                        <span className={`${styles.statValue} ${styles.blue}`}>{uniqueCustomers}</span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} color="#64748b" />
                        <input
                            className={styles.searchInput}
                            placeholder="Search by customer or plant name..."
                            onChange={e => handleSearch(e.target.value)}
                            id="orders-search"
                        />
                    </div>

                    <select
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        id="orders-status-filter"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={vendorFilter}
                        onChange={e => { setVendorFilter(e.target.value); setPage(1); }}
                        id="orders-vendor-filter"
                    >
                        <option value="">All Vendors</option>
                        {vendors.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>

                    {view === 'map' && (
                        <button
                            onClick={() => {
                                if (!vendorFilter) {
                                    toast.error("Please select a vendor filter first.");
                                    return;
                                }
                                setIsOptimizing(!isOptimizing);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                background: isOptimizing ? '#ef4444' : '#8b5cf6',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginRight: '0.5rem'
                            }}
                        >
                            <Navigation size={14} style={{ transform: 'rotate(45deg)' }} />
                            {isOptimizing ? 'Clear Optimized Route' : 'Optimize Delivery Route'}
                        </button>
                    )}

                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewBtn} ${view === 'table' ? styles.viewBtnActive : ''}`}
                            onClick={() => setView('table')}
                            id="view-table"
                        >
                            <List size={16} /> Table
                        </button>
                        <button
                            className={`${styles.viewBtn} ${view === 'map' ? styles.viewBtnActive : ''}`}
                            onClick={() => setView('map')}
                            id="view-map"
                        >
                            <MapPin size={16} /> Map
                        </button>
                    </div>
                </div>

                {/* Table View */}
                {view === 'table' && (
                    <>
                        {loading ? (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner} />
                                <p>Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}><ShoppingBag size={36} color="#10b981" /></div>
                                <h3 className={styles.emptyTitle}>No orders found</h3>
                                <p className={styles.emptyDesc}>Orders will appear here when customers complete purchases through the cart.</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.ordersTable}>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Plant</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Vendor</th>
                                                <th>Delivery Location</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td className={styles.dateCell}>
                                                        <div>{formatDate(order.timestamp)}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#475569' }}>{formatTime(order.timestamp)}</div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{order.userName || 'Unknown'}</div>
                                                    </td>
                                                    <td>
                                                        <div className={styles.plantCell}>
                                                            <span className={styles.plantName}>{order.plantName}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className={styles.qtyBadge}>×{order.quantity}</span></td>
                                                    <td className={styles.priceCell}>{formatCurrency(order.price)}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <Store size={14} color={vendorColorMap[order.vendorId] || '#94a3b8'} />
                                                            <span style={{ fontSize: '0.82rem' }}>{order.vendorInfo?.name || order.vendorId}</span>
                                                        </div>
                                                    </td>
                                                    <td className={styles.addressCell}>
                                                        {order.deliveryAddress?.address ? (
                                                            <>
                                                                <div>{order.deliveryAddress.address}</div>
                                                                <div className={styles.addressCity}>
                                                                    {[order.deliveryAddress.city, order.deliveryAddress.state].filter(Boolean).join(', ')}
                                                                    {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
                                                                </div>
                                                                {order.deliveryAddress.latitude && order.deliveryAddress.longitude && (
                                                                    <a
                                                                        href={`https://www.google.com/maps?q=${order.deliveryAddress.latitude},${order.deliveryAddress.longitude}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ fontSize: '0.7rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
                                                                    >
                                                                        <Navigation size={10} /> Open Map
                                                                    </a>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span style={{ color: '#475569', fontStyle: 'italic' }}>Not provided</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <select
                                                            className={`${styles.statusSelect} ${
                                                                order.status === 'completed' ? styles.statusCompleted :
                                                                order.status === 'shipped' ? styles.statusShipped :
                                                                order.status === 'delivered' ? styles.statusDelivered :
                                                                order.status === 'pending' ? styles.statusPending :
                                                                styles.statusCancelled
                                                            }`}
                                                            value={order.status}
                                                            onChange={async (e) => {
                                                                const newStatus = e.target.value;
                                                                try {
                                                                    await updateOrderStatus(order._id, newStatus);
                                                                    setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                                                                    toast.success(`Order updated to ${newStatus}`);
                                                                } catch (err) {
                                                                    toast.error('Failed to update status');
                                                                }
                                                            }}
                                                            id={`status-${order._id}`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            className={styles.pageBtn}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page <= 1}
                                        >
                                            ← Prev
                                        </button>
                                        <span className={styles.pageInfo}>Page {page} of {totalPages} ({total} orders)</span>
                                        <button
                                            className={styles.pageBtn}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page >= totalPages}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Map View */}
                {view === 'map' && (
                    <div style={{ position: 'relative' }}>
                        <div className={styles.mapContainer}>
                            <MapContainer
                                center={[20.5937, 78.9629]} // India center
                                zoom={5}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Auto-center on active vendor when optimizing */}
                                {isOptimizing && vendorFilter && (() => {
                                    const activeVendor = vendors.find(v => v.id === vendorFilter);
                                    if (activeVendor && activeVendor.latitude !== undefined && activeVendor.longitude !== undefined) {
                                        return <MapController center={[activeVendor.latitude, activeVendor.longitude]} />;
                                    }
                                    return null;
                                })()}

                                {/* Render Vendor HQ marker when optimizing */}
                                {isOptimizing && vendorFilter && (() => {
                                    const activeVendor = vendors.find(v => v.id === vendorFilter);
                                    if (activeVendor && activeVendor.latitude !== undefined && activeVendor.longitude !== undefined) {
                                        return (
                                            <Marker
                                                position={[activeVendor.latitude, activeVendor.longitude]}
                                                icon={L.divIcon({
                                                    className: '',
                                                    html: `<div style="
                                                        width: 32px;
                                                        height: 32px;
                                                        background: #8b5cf6;
                                                        border: 3px solid #fff;
                                                        border-radius: 50%;
                                                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        font-size: 14px;
                                                    ">🏠</div>`,
                                                    iconSize: [32, 32],
                                                    iconAnchor: [16, 16]
                                                })}
                                            >
                                                <Popup>
                                                    <div style={{ color: '#000', fontSize: '0.8rem' }}>
                                                        <strong>Start (HQ):</strong> {activeVendor.name}<br/>
                                                        <span>{activeVendor.address}</span>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Render Optimized routing line */}
                                {isOptimizing && optimizedPath.length > 0 && (
                                    <Polyline
                                        positions={optimizedPath}
                                        pathOptions={{
                                            color: '#8b5cf6',
                                            weight: 4,
                                            dashArray: '8, 8',
                                            opacity: 0.85
                                        }}
                                    />
                                )}

                                {/* Render Markers */}
                                {isOptimizing ? (
                                    stopSequence.map((stop, idx) => (
                                        <Marker
                                            key={stop._id}
                                            position={[stop.lat, stop.lng]}
                                            icon={L.divIcon({
                                                className: '',
                                                html: `<div style="
                                                    width: 28px;
                                                    height: 28px;
                                                    background: #8b5cf6;
                                                    border: 3px solid white;
                                                    border-radius: 50%;
                                                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    color: white;
                                                    font-size: 11px;
                                                    font-weight: 800;
                                                ">${idx + 1}</div>`,
                                                iconSize: [28, 28],
                                                iconAnchor: [14, 14]
                                            })}
                                        >
                                            <Popup>
                                                <div className={styles.mapPopup}>
                                                    <div className={styles.popupTitle}>Stop #${idx + 1}: {stop.plantName}</div>
                                                    <div className={styles.popupLine}><Users size={12} /> <strong>{stop.userName}</strong></div>
                                                    <div className={styles.popupLine}><Store size={12} /> {stop.vendorName}</div>
                                                    <div className={styles.popupLine}><Package size={12} /> Qty: {stop.quantity} × {formatCurrency(stop.price)}</div>
                                                    {stop.address && (
                                                        <div className={styles.popupLine}><MapPin size={12} /> {stop.address}</div>
                                                    )}
                                                    <div className={styles.popupLine}><Calendar size={12} /> {formatDate(stop.timestamp)}</div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))
                                ) : (
                                    mapOrders.map(order => (
                                        order.lat && order.lng ? (
                                            <Marker
                                                key={order._id}
                                                position={[order.lat, order.lng]}
                                                icon={createColoredIcon(vendorColorMap[order.vendorId] || '#10b981')}
                                            >
                                                <Popup>
                                                    <div className={styles.mapPopup}>
                                                        <div className={styles.popupTitle}>🌿 {order.plantName}</div>
                                                        <div className={styles.popupLine}><Users size={12} /> <strong>{order.userName}</strong></div>
                                                        <div className={styles.popupLine}><Store size={12} /> {order.vendorName}</div>
                                                        <div className={styles.popupLine}><Package size={12} /> Qty: {order.quantity} × {formatCurrency(order.price)}</div>
                                                        {order.address && (
                                                            <div className={styles.popupLine}><MapPin size={12} /> {order.address}</div>
                                                        )}
                                                        {(order.city || order.state) && (
                                                            <div className={styles.popupLine}>
                                                                <Navigation size={12} /> {[order.city, order.state].filter(Boolean).join(', ')} {order.pincode && `- ${order.pincode}`}
                                                            </div>
                                                        )}
                                                        <div className={styles.popupLine}><Calendar size={12} /> {formatDate(order.timestamp)}</div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ) : null
                                    ))
                                )}
                            </MapContainer>
                        </div>

                        {/* Floating Stop Sequence Overlay */}
                        {isOptimizing && stopSequence.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                zIndex: 1000,
                                width: '280px',
                                maxHeight: 'calc(100% - 2rem)',
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '1rem',
                                padding: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                overflowY: 'auto'
                            }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                                    <Navigation size={14} style={{ color: '#8b5cf6' }} />
                                    Optimized Stop Sequence
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {stopSequence.map((stop, idx) => (
                                        <div key={stop._id} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: '#8b5cf6',
                                                color: '#fff',
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {idx + 1}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {stop.userName}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {stop.plantName} (×{stop.quantity})
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {stop.address || stop.city}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Map Legend */}
                {view === 'map' && vendors.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
                        {vendors.map((v, i) => (
                            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: VENDOR_COLORS[i % VENDOR_COLORS.length],
                                    border: '2px solid rgba(255,255,255,0.2)'
                                }} />
                                {v.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
