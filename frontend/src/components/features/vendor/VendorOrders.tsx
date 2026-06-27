import { useState, useEffect } from 'react';
import { fetchVendorOrders, updateVendorOrderStatus, resendVendorOrderOTP } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { Search, MapPin, Clock, Package, Truck, CheckCircle, AlertTriangle, ShieldCheck, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './VendorOrders.module.css';
import type { Vendor } from '../../../types';

interface VendorOrdersProps {
    vendor: Vendor;
}

export const VendorOrders = ({ vendor }: VendorOrdersProps) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'shipped' | 'delivered'>('all');
    const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchVendorOrders();
            setOrders(data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [vendor.id]);

    const handleStatusUpdate = async (orderId: string, newStatus: string, otp?: string) => {
        setSubmittingId(orderId);
        const tid = toast.loading(`Updating order to ${newStatus === 'completed' ? 'Packed' : newStatus}...`);
        try {
            await updateVendorOrderStatus(orderId, newStatus, otp);
            toast.success(
                newStatus === 'completed' 
                    ? 'Order marked as Packed successfully!' 
                    : newStatus === 'shipped' 
                    ? 'Order marked as Shipped! Delivery OTP sent to customer.'
                    : 'Order delivered and verified successfully!',
                { id: tid }
            );
            // Clear OTP input if successful
            if (otp) {
                setOtpInputs(prev => {
                    const copy = { ...prev };
                    delete copy[orderId];
                    return copy;
                });
            }
            loadOrders();
        } catch (err: any) {
            toast.error(err.message || "Failed to update order status", { id: tid });
        } finally {
            setSubmittingId(null);
        }
    };

    const handleOtpChange = (orderId: string, value: string) => {
        // Only allow numbers, max length 6
        const numericVal = value.replace(/\D/g, '').substring(0, 6);
        setOtpInputs(prev => ({
            ...prev,
            [orderId]: numericVal
        }));
    };

    const handleResendOtp = async (orderId: string) => {
        setResendingIds(prev => {
            const next = new Set(prev);
            next.add(orderId);
            return next;
        });
        const tid = toast.loading("Generating and resending OTP to buyer...");
        try {
            await resendVendorOrderOTP(orderId);
            toast.success("New OTP code sent to customer successfully!", { id: tid });
        } catch (err: any) {
            toast.error(err.message || "Failed to resend OTP", { id: tid });
        } finally {
            setResendingIds(prev => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    const filteredOrders = orders.filter(order => {
        // Tab Filter
        if (activeTab !== 'all' && order.status !== activeTab) return false;

        // Search Filter
        if (search.trim()) {
            const query = search.toLowerCase();
            const orderId = `INV-${order._id.substring(18).toUpperCase()}`;
            const plantName = (order.plantName || '').toLowerCase();
            const customerName = (order.userName || order.userInfo?.name || '').toLowerCase();
            return plantName.includes(query) || customerName.includes(query) || orderId.toLowerCase().includes(query);
        }

        return true;
    });

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return { text: 'Pending (Placed)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={12} /> };
            case 'completed': return { text: 'Packed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <Package size={12} /> };
            case 'shipped': return { text: 'Shipped', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: <Truck size={12} /> };
            case 'delivered': return { text: 'Delivered & Verified', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: <CheckCircle size={12} /> };
            default: return { text: status, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: <Clock size={12} /> };
        }
    };

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by Order ID, plant name, or buyer..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.tabs}>
                    {(['all', 'pending', 'completed', 'shipped', 'delivered'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                        >
                            {tab === 'all' ? 'All Orders' : tab === 'completed' ? 'Packed' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Feed */}
            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 className={styles.spinner} />
                    <p>Fetching shop orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className={styles.emptyState}>
                    <AlertTriangle size={36} color="#facc15" />
                    <h3>No orders matching criteria</h3>
                    <p>Ensure your filters are correct, or wait for customer checkout activities.</p>
                </div>
            ) : (
                <div className={styles.ordersGrid}>
                    {filteredOrders.map(order => {
                        const labelCfg = getStatusLabel(order.status);
                        const isSubmitting = submittingId === order._id;
                        const otpVal = otpInputs[order._id] || '';

                        return (
                            <div key={order._id} className={styles.orderCard}>
                                {/* Card Header */}
                                <div className={styles.cardHeader}>
                                    <div>
                                        <span className={styles.orderId}>INV-{order._id.substring(18).toUpperCase()}</span>
                                        <div className={styles.dateLabel}>
                                            <Calendar size={12} />
                                            {new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span 
                                        className={styles.statusBadge} 
                                        style={{ color: labelCfg.color, background: labelCfg.bg }}
                                    >
                                        {labelCfg.icon}
                                        {labelCfg.text}
                                    </span>
                                </div>

                                {/* Content Details */}
                                <div className={styles.cardContent}>
                                    <div className={styles.plantBlock}>
                                        <h4 className={styles.plantName}>{order.plantName}</h4>
                                        <div className={styles.pricingDetails}>
                                            <span>{order.quantity}x @ {formatCurrency(order.price)}</span>
                                            <strong className={styles.totalPrice}>{formatCurrency(order.price * order.quantity)}</strong>
                                        </div>
                                        {order.deliveryFee > 0 && (
                                            <div className={styles.feeBreakdown}>
                                                <span>Delivery Fee:</span>
                                                <span>{formatCurrency(order.deliveryFee)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Buyer Details */}
                                    <div className={styles.buyerBlock}>
                                        <h5>Customer & Delivery Info</h5>
                                        <div className={styles.infoLine}>
                                            <Phone size={12} />
                                            <span>{order.userName || order.userInfo?.name || 'Valued Customer'} {order.userInfo?.phone ? `(${order.userInfo.phone})` : ''}</span>
                                        </div>
                                        {order.userInfo?.email && (
                                            <div className={styles.infoLine}>
                                                <Mail size={12} />
                                                <span>{order.userInfo.email}</span>
                                            </div>
                                        )}
                                        {order.deliveryAddress?.address ? (
                                            <div className={styles.infoLine} style={{ alignItems: 'flex-start' }}>
                                                <MapPin size={12} style={{ marginTop: '2px' }} />
                                                <span>{order.deliveryAddress.address}, {order.deliveryAddress.city || ''} {order.deliveryAddress.state || ''}</span>
                                            </div>
                                        ) : (
                                            <div className={styles.infoLine}>
                                                <MapPin size={12} />
                                                <span style={{ fontStyle: 'italic' }}>Local Nursery Pickup</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Block */}
                                <div className={styles.cardActions}>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'completed')}
                                            disabled={isSubmitting}
                                            className={styles.actionBtn}
                                            style={{ background: '#10b981', color: '#fff' }}
                                        >
                                            📦 Mark as Packed
                                        </button>
                                    )}

                                    {order.status === 'completed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                            disabled={isSubmitting}
                                            className={styles.actionBtn}
                                            style={{ background: '#3b82f6', color: '#fff' }}
                                        >
                                            🚚 Ship Order (Send OTP)
                                        </button>
                                    )}

                                    {order.status === 'shipped' && (
                                        <div className={styles.deliveryForm}>
                                            <div className={styles.otpInputWrapper}>
                                                <ShieldCheck size={16} className={styles.otpIcon} />
                                                <input
                                                    type="text"
                                                    className={styles.otpInput}
                                                    placeholder="Enter 6-digit OTP code"
                                                    value={otpVal}
                                                    onChange={e => handleOtpChange(order._id, e.target.value)}
                                                    maxLength={6}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, 'delivered', otpVal)}
                                                disabled={isSubmitting || otpVal.length < 6}
                                                className={styles.actionBtn}
                                                style={{ background: '#10b981', color: '#fff', opacity: otpVal.length < 6 ? 0.6 : 1 }}
                                            >
                                                ✅ Complete Delivery
                                            </button>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                                                <button
                                                    onClick={() => handleResendOtp(order._id)}
                                                    disabled={isSubmitting || resendingIds.has(order._id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--color-primary, #10b981)',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline',
                                                        opacity: (isSubmitting || resendingIds.has(order._id)) ? 0.6 : 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    📬 {resendingIds.has(order._id) ? 'Resending OTP...' : 'Resend OTP to Customer'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {order.status === 'delivered' && (
                                        <div className={styles.completedBanner}>
                                            <ShieldCheck size={16} />
                                            <span>Delivery verified and closed successfully</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
