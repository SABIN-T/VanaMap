import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
    CreditCard, Users, Gift, Lock, Unlock,
    CheckCircle, XCircle, Calculator, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Premium.module.css';

interface Payment {
    _id: string;
    userName: string;
    amount: number;
    plan: string;
    status: string;
    date: string;
    orderId: string;
}

interface PremiumUser {
    _id: string;
    name: string;
    email: string;
    premiumType: string;
    premiumExpiry: string;
}

export const Premium = () => {
    const { user } = useAuth();
    const token = user?.token;
    const [payments, setPayments] = useState<Payment[]>([]);
    const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [restrictedPages, setRestrictedPages] = useState<string[]>([]);
    const [config, setConfig] = useState({ price: 10, isFree: false, freeStart: '', freeEnd: '' });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const loadData = async () => {
        try {
            const [payRes, settingsRes, configRes] = await Promise.all([
                fetch(`${API_URL}/admin/payments`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/admin/settings/restricted-pages`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/admin/settings/premium`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const payData = await payRes.json();
            const setData = await settingsRes.json();
            const configData = await configRes.json();

            setPayments(payData.payments || []);
            setPremiumUsers(payData.premiumUsers || []);
            setRestrictedPages(setData.pages || []);
            setConfig(configData);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    const handleSaveConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/settings/premium`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Pricing & Automated Settings Saved! 🚀");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (err) {
            toast.error("Network error saving config");
        }
    };

    const handleRenew = async (userId: string) => {
        if (!confirm("Gift 1 Year Premium to this user?")) return;
        try {
            const res = await fetch(`${API_URL}/admin/premium/renew`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Premium Renewed/Gifted Successfully! 🎁");
                loadData();
            } else {
                toast.error("Failed to renew");
            }
        } catch (err) {
            toast.error("Error renewing subscription");
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <AdminLayout title="Premium Management">
            <div className={styles.container}>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading Premium Data...</p>
                    </div>
                ) : (
                    <>
                        {/* Highlights Grid */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={`${styles.statIconBox} ${styles.iconPurple}`}>
                                    <Users size={32} />
                                </div>
                                <div className={styles.statContent}>
                                    <h3>Active Subscribers</h3>
                                    <div className={styles.statValue}>{premiumUsers.length}</div>
                                </div>
                                {/* Decorative orb */}
                                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(168,85,247,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={`${styles.statIconBox} ${styles.iconEmerald}`}>
                                    <CreditCard size={32} />
                                </div>
                                <div className={styles.statContent}>
                                    <h3>Total Revenue</h3>
                                    <div className={styles.statValue}>
                                        ₹{payments.reduce((acc, curr) => acc + (curr.amount || 0), 0)}
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(16,185,129,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={`${styles.statIconBox} ${styles.iconAmber}`}>
                                    <Gift size={32} />
                                </div>
                                <div className={styles.statContent}>
                                    <h3>Gifted Plans</h3>
                                    <div className={styles.statValue}>
                                        {premiumUsers.filter(u => u.premiumType === 'gift').length}
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(245,158,11,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                            </div>
                        </div>

                        {/* CONFIG PANEL (NEW) */}
                        <div className={styles.sectionPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>
                                    <Calculator size={20} className="text-cyan-400" />
                                    <span>Pricing & Automation</span>
                                </h2>
                                <button onClick={handleSaveConfig} className={styles.actionBtn} style={{ background: '#0891b2', border: 'none', color: '#fff' }}>
                                    <Save size={16} /> Save Settings
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem', padding: '0.5rem' }}>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Subscription Price (₹)</label>
                                    <input
                                        type="number"
                                        value={config.price}
                                        onChange={e => setConfig({ ...config, price: parseInt(e.target.value) })}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Current live price for new users</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Promo Status</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: config.isFree ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                                        <input
                                            type="checkbox"
                                            checked={config.isFree}
                                            onChange={e => setConfig({ ...config, isFree: e.target.checked })}
                                            style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                                        />
                                        <span style={{ color: config.isFree ? '#10b981' : '#cbd5e1', fontWeight: 600 }}>
                                            {config.isFree ? 'FREE MODE ACTIVE' : 'Standard Paid Mode'}
                                        </span>
                                    </label>
                                </div>

                                {config.isFree && (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Promo Start Date</label>
                                            <input
                                                type="date"
                                                value={config.freeStart ? config.freeStart.split('T')[0] : ''}
                                                onChange={e => setConfig({ ...config, freeStart: e.target.value })}
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff', colorScheme: 'dark' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Promo End Date</label>
                                            <input
                                                type="date"
                                                value={config.freeEnd ? config.freeEnd.split('T')[0] : ''}
                                                onChange={e => setConfig({ ...config, freeEnd: e.target.value })}
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff', colorScheme: 'dark' }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Control Deck */}
                        <div className={styles.sectionPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>
                                    <Lock size={20} className="text-orange-400" />
                                    <span>Access Control Deck</span>
                                </h2>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Click to toggle specific page restrictions</span>
                            </div>

                            <div className={styles.controlGrid}>
                                {[
                                    { name: 'Heaven', path: '/heaven' },
                                    { name: 'Shops Global', path: '/shops' },
                                    { name: 'AI Diagnostics', path: '/make-it-real' },
                                    { name: 'Leaderboard', path: '/leaderboard' },
                                    { name: 'Nearby GPS', path: '/nearby' }
                                ].map(page => {
                                    const isLocked = restrictedPages.includes(page.path);
                                    return (
                                        <div
                                            key={page.path}
                                            onClick={async () => {
                                                const newList = isLocked
                                                    ? restrictedPages.filter(p => p !== page.path)
                                                    : [...restrictedPages, page.path];

                                                setRestrictedPages(newList);
                                                try {
                                                    await fetch(`${API_URL}/admin/settings/restricted-pages`, {
                                                        method: 'POST',
                                                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ pages: newList })
                                                    });
                                                    toast.success(`${page.name} is now ${isLocked ? 'Unlocked' : 'Locked'}`);
                                                } catch (e) {
                                                    toast.error("Failed to save setting");
                                                }
                                            }}
                                            className={`${styles.controlCard} ${isLocked ? styles.locked : ''}`}
                                        >
                                            <span className={styles.cardName}>{page.name}</span>
                                            {isLocked
                                                ? <Lock size={20} className="text-orange-500" />
                                                : <Unlock size={20} className="text-emerald-500" />
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Subscribers */}
                        <div className={styles.sectionPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>
                                    <Users size={20} className="text-indigo-400" />
                                    <span>Premium Subscribers</span>
                                </h2>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Plan Type</th>
                                            <th>Expires</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {premiumUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className={styles.userCell}>
                                                        <span className={styles.userName}>{user.name}</span>
                                                        <span className={styles.userEmail}>{user.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${styles.badge} ${user.premiumType === 'gift' ? styles.badgeGift : styles.badgeStandard}`}>
                                                        {user.premiumType}
                                                    </span>
                                                </td>
                                                <td>{formatDate(user.premiumExpiry)}</td>
                                                <td>
                                                    <button onClick={() => handleRenew(user._id)} className={styles.actionBtn}>
                                                        <Gift size={14} /> Gift Renew
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {premiumUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No active subscribers found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className={styles.sectionPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>
                                    <CreditCard size={20} className="text-emerald-400" />
                                    <span>Transaction History</span>
                                </h2>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>User</th>
                                            <th>Order ID</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(pay => (
                                            <tr key={pay._id}>
                                                <td style={{ color: '#94a3b8' }}>{formatDate(pay.date)}</td>
                                                <td style={{ fontWeight: 500 }}>{pay.userName}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#64748b' }}>{pay.orderId || 'PROMO-FREE'}</td>
                                                <td style={{ fontWeight: 700, color: '#f1f5f9' }}>₹{pay.amount}</td>
                                                <td>
                                                    {pay.status === 'paid' ? (
                                                        <span className={`${styles.badge} ${styles.badgePaid}`}>
                                                            <CheckCircle size={12} /> PAID
                                                        </span>
                                                    ) : (
                                                        <span className={`${styles.badge} ${styles.badgeFailed}`}>
                                                            <XCircle size={12} /> FAILED
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No transaction history available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </AdminLayout>
    );
};
