import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from './AdminLayout';
import {
    User, Store, Sprout, Clock, Search, DollarSign, CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Notifications.module.css';
import { fetchAdminNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';

interface Notification {
    _id: string;
    type: 'user' | 'vendor' | 'plant' | 'price' | 'suggestion';
    message: string;
    details: any;
    date: string;
    read: boolean;
}

export const Notifications = () => {
    const [allNotifs, setAllNotifs] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchAdminNotifications();
            setAllNotifs(data);
        } catch (err) {
            console.error("Failed to load notifications", err);
        } finally {
            setLoading(false);
        }
    };



    const handleItemClick = async (notif: Notification) => {
        if (!notif.read) {
            try {
                await markNotificationRead(notif._id);
                setAllNotifs(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
            } catch (e) {
                console.error("Failed to mark read", e);
            }
        }

        // Navigate based on type
        if (notif.type === 'user') navigate('/admin/manage-users');
        if (notif.type === 'vendor') navigate('/admin/manage-vendors');
        if (notif.type === 'plant') navigate('/admin/manage-plants');
        if (notif.type === 'price') navigate('/admin/price-management');
        if (notif.type === 'suggestion') navigate('/admin/suggestions');
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        loadData();
    }

    const filteredNotifs = useMemo(() =>
        allNotifs.filter(n => n.message.toLowerCase().includes(searchQuery.toLowerCase())),
        [allNotifs, searchQuery]);

    const userNotifs = filteredNotifs.filter(n => n.type === 'user');
    const vendorNotifs = filteredNotifs.filter(n => n.type === 'vendor');
    const plantNotifs = filteredNotifs.filter(n => n.type === 'plant');
    const priceNotifs = filteredNotifs.filter(n => n.type === 'price');

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 60000; // mins

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${Math.floor(diff)}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const renderCard = (title: string, icon: any, items: Notification[], colorClass: string) => (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${colorClass}`}>
                    {icon}
                </div>
                <span className={styles.sectionTitle}>{title}</span>
                <span className="text-xs text-slate-500 ml-auto">{items.filter(i => !i.read).length} new</span>
            </div>
            <div className={styles.scrollArea}>
                {items.length > 0 ? items.map(item => (
                    <button
                        key={item._id}
                        className={`${styles.item} ${!item.read ? styles.unread : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className={styles.content}>
                            <div className={styles.mainText}>
                                {item.message}
                            </div>
                            <div className={styles.subText}>
                                {item.type === 'price' && item.details?.location ? `Shop: ${item.details.location}` : ''}
                            </div>
                            <span className={styles.time}>
                                <Clock size={10} className="inline mr-1" />{formatTime(item.date)}
                            </span>
                        </div>
                    </button>
                )) : (
                    <div className="text-center py-10 text-slate-600 text-sm italic">No updates</div>
                )}
            </div>
        </div>
    );

    if (loading) return (
        <AdminLayout title="System Notifications">
            <div className="p-8 text-center text-slate-500">Loading...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="System Notifications">
            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
                        <CheckCheck size={16} /> Mark All Read
                    </button>
                </header>

                <div className={styles.grid4}>
                    {renderCard("New Users", <User size={20} />, userNotifs, styles.userIcon)}
                    {renderCard("Vendor Joins", <Store size={20} />, vendorNotifs, styles.vendorIcon)}
                    {renderCard("Plant Updates", <Sprout size={20} />, plantNotifs, styles.plantIcon)}
                    {renderCard("Price Alerts", <DollarSign size={20} />, priceNotifs, styles.priceIcon)}
                </div>
            </div>
        </AdminLayout>
    );
};
