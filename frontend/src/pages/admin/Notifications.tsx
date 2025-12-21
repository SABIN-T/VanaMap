import { useState, useEffect, useMemo } from 'react';
import { AdminPageLayout } from './AdminPageLayout';
import {
    User, Store, Sprout, Clock, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Notifications.module.css';
import { fetchUsers, fetchVendors, fetchPlants } from '../../services/api';

interface ActivityItem {
    id: string;
    type: 'user' | 'vendor' | 'plant';
    title: string;
    description: string;
    timestamp: Date;
    status: 'new' | 'update' | 'alert';
    isNewToAdmin?: boolean; // If within last 24 hours
}

export const Notifications = () => {
    const [userActivity, setUserActivity] = useState<ActivityItem[]>([]);
    const [vendorActivity, setVendorActivity] = useState<ActivityItem[]>([]);
    const [plantActivity, setPlantActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [users, vendors, plants] = await Promise.all([
                    fetchUsers(),
                    fetchVendors(),
                    fetchPlants()
                ]);

                const now = new Date();
                const oneDay = 24 * 60 * 60 * 1000;

                const uActs: ActivityItem[] = users.map((u: any, i) => {
                    // Use real createdAt if available, else fallback to random for demo
                    const ts = u.createdAt ? new Date(u.createdAt) : new Date(Date.now() - Math.random() * 86400000 * 3);
                    return {
                        id: u._id || `u-${i}`,
                        type: 'user' as const,
                        title: `New User: ${u.name || u.email.split('@')[0]}`,
                        description: `Joined using ${u.email}`,
                        timestamp: ts,
                        status: 'new' as const,
                        isNewToAdmin: (now.getTime() - ts.getTime()) < oneDay
                    };
                }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                const vActs: ActivityItem[] = vendors.map((v: any, i) => {
                    const ts = v.createdAt ? new Date(v.createdAt) : new Date(Date.now() - Math.random() * 86400000 * 5);
                    return {
                        id: v._id || `v-${i}`,
                        type: 'vendor' as const,
                        title: `Vendor: ${v.name}`,
                        description: `Location: ${v.address || 'Unknown'}`,
                        timestamp: ts,
                        status: (i % 3 === 0 ? 'update' : 'new') as 'update' | 'new',
                        isNewToAdmin: (now.getTime() - ts.getTime()) < oneDay
                    };
                }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                const pActs: ActivityItem[] = plants.map((p: any, i) => {
                    const ts = p.createdAt ? new Date(p.createdAt) : new Date(Date.now() - Math.random() * 86400000 * 7);
                    return {
                        id: p._id || `p-${i}`,
                        type: 'plant' as const,
                        title: `Plant: ${p.name}`,
                        description: `${p.price ? `$${p.price}` : 'Price unset'} • ${p.category || 'General'}`,
                        timestamp: ts,
                        status: (p.stock < 5 ? 'alert' : 'new') as 'alert' | 'new',
                        isNewToAdmin: (now.getTime() - ts.getTime()) < oneDay
                    };
                }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                setUserActivity(uActs);
                setVendorActivity(vActs);
                setPlantActivity(pActs);
            } catch (err) {
                console.error("Failed to load activity", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredUsers = useMemo(() =>
        userActivity.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ), [userActivity, searchQuery]);

    const filteredVendors = useMemo(() =>
        vendorActivity.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ), [vendorActivity, searchQuery]);

    const filteredPlants = useMemo(() =>
        plantActivity.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ), [plantActivity, searchQuery]);

    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const formatFullTimestamp = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleItemClick = (type: 'user' | 'vendor' | 'plant') => {
        if (type === 'user') navigate('/admin/manage-users');
        if (type === 'vendor') navigate('/admin/manage-vendors');
        if (type === 'plant') navigate('/admin/manage-plants');
    };

    if (loading) {
        return (
            <AdminPageLayout title="Notifications Center">
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    Loading system logs...
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Notifications Center">
            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search names, shops or plants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className={styles.grid}>
                    {/* USERS COLUMN */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconBox} ${styles.userIcon}`}>
                                <User size={20} />
                            </div>
                            <span className={styles.sectionTitle}>User Activity</span>
                            <span className="text-xs text-slate-500 ml-auto">{filteredUsers.length}</span>
                        </div>
                        <div className={styles.scrollArea}>
                            {filteredUsers.length > 0 ? filteredUsers.map(item => (
                                <button
                                    key={item.id}
                                    className={`${styles.item} ${item.isNewToAdmin ? styles.newItem : ''}`}
                                    onClick={() => handleItemClick('user')}
                                >
                                    <div className={styles.content}>
                                        <div className={styles.mainText}>
                                            <span className={item.isNewToAdmin ? styles.newBadgePulse : ''}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className={styles.subText}>{item.description}</div>
                                        <span className={styles.time}>
                                            <span className={styles.fullDate}>{formatFullTimestamp(item.timestamp)}</span>
                                            <Clock size={10} className="inline mr-1" />{formatRelativeTime(item.timestamp)}
                                        </span>
                                    </div>
                                </button>
                            )) : (
                                <div className="text-center py-10 text-slate-600 text-sm italic">No users found</div>
                            )}
                        </div>
                    </div>

                    {/* VENDORS COLUMN */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconBox} ${styles.vendorIcon}`}>
                                <Store size={20} />
                            </div>
                            <span className={styles.sectionTitle}>Vendor Updates</span>
                            <span className="text-xs text-slate-500 ml-auto">{filteredVendors.length}</span>
                        </div>
                        <div className={styles.scrollArea}>
                            {filteredVendors.length > 0 ? filteredVendors.map(item => (
                                <button
                                    key={item.id}
                                    className={`${styles.item} ${item.isNewToAdmin ? styles.newItem : ''}`}
                                    onClick={() => handleItemClick('vendor')}
                                >
                                    <div className={styles.content}>
                                        <div className={styles.mainText}>
                                            <span className={item.isNewToAdmin ? styles.newBadgePulse : ''}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className={styles.subText}>{item.description}</div>
                                        <span className={styles.time}>
                                            <span className={styles.fullDate}>{formatFullTimestamp(item.timestamp)}</span>
                                            <Clock size={10} className="inline mr-1" />{formatRelativeTime(item.timestamp)}
                                        </span>
                                    </div>
                                </button>
                            )) : (
                                <div className="text-center py-10 text-slate-600 text-sm italic">No vendors found</div>
                            )}
                        </div>
                    </div>

                    {/* PLANTS COLUMN */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconBox} ${styles.plantIcon}`}>
                                <Sprout size={20} />
                            </div>
                            <span className={styles.sectionTitle}>Plant Log</span>
                            <span className="text-xs text-slate-500 ml-auto">{filteredPlants.length}</span>
                        </div>
                        <div className={styles.scrollArea}>
                            {filteredPlants.length > 0 ? filteredPlants.map(item => (
                                <button
                                    key={item.id}
                                    className={`${styles.item} ${item.isNewToAdmin ? styles.newItem : ''}`}
                                    onClick={() => handleItemClick('plant')}
                                >
                                    <div className={styles.content}>
                                        <div className={styles.mainText}>
                                            <span className={item.isNewToAdmin ? styles.newBadgePulse : ''}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className={styles.subText}>{item.description}</div>
                                        <span className={styles.time}>
                                            <span className={styles.fullDate}>{formatFullTimestamp(item.timestamp)}</span>
                                            <Clock size={10} className="inline mr-1" />{formatRelativeTime(item.timestamp)}
                                        </span>
                                    </div>
                                </button>
                            )) : (
                                <div className="text-center py-10 text-slate-600 text-sm italic">No plants found</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminPageLayout>
    );
};
