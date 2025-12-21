import { useState, useEffect, useCallback } from 'react';
import {
    fetchVendors, fetchPlants, fetchUsers
} from '../services/api';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight,
    Plus, Zap, Settings, Shield, LogOut,
    Store, Edit, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';
import { ActivityFeed, type ActivityItem } from './admin/ActivityFeed';

export const Admin = () => {
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getTimestampFromId = (id: string) => {
        try {
            return new Date(parseInt(id.substring(0, 8), 16) * 1000);
        } catch (e) {
            return new Date();
        }
    };

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [vendors, plants, users] = await Promise.all([fetchVendors(), fetchPlants(), fetchUsers()]);

            setStats({
                vendors: vendors.length,
                plants: plants.length,
                users: users.length
            });

            // Process Real Data for Activity Feed
            const plantActivities: ActivityItem[] = plants.map((p: any) => ({
                id: p.id || p._id,
                type: 'plant',
                title: `New Plant Added`,
                description: `${p.name} (${p.scientificName || 'Species'}) was added to the catalog.`,
                timestamp: p.createdAt || getTimestampFromId(p.id || p._id),
                meta: p.type
            }));

            const vendorActivities: ActivityItem[] = vendors.map((v: any) => ({
                id: v.id || v._id,
                type: 'vendor',
                title: `New Partner Joined`,
                description: `${v.name} registered as a ${v.category || 'Vendor'} in ${v.district || 'Unknown Location'}.`,
                timestamp: v.createdAt || getTimestampFromId(v.id || v._id),
                meta: v.verified ? 'Verified' : 'Pending'
            }));

            const userActivities: ActivityItem[] = users.map((u: any) => ({
                id: u.id || u._id,
                type: 'user',
                title: `New User Registration`,
                description: `${u.name || 'User'} joined the platform.`,
                timestamp: u.createdAt || getTimestampFromId(u.id || u._id),
                meta: u.role
            }));

            // Merge and Sort by Date Descending
            const allActivities = [...plantActivities, ...vendorActivities, ...userActivities]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 50); // Limit to last 50 actions

            setActivities(allActivities);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem('adminAuthenticated')) navigate('/admin-login');
        else loadData();
    }, [navigate, loadData]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Command Center</h1>
                    <div className={styles.subtitle}>
                        <Shield size={14} className="text-emerald-500" /> System Secure • {new Date().toLocaleDateString()}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Activity size={20} />
                    </button>
                    <button onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} className="px-6 py-3 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-sm transition-all flex items-center gap-2">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div className={styles.dashboardGrid}>
                {/* STAT CARDS */}
                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Total Users</span>
                        <Users size={20} className="text-indigo-400" />
                    </div>
                    <div className={styles.cardValue}>{stats.users}</div>
                    <div className={styles.cardTrend}>
                        <span className={styles.trendUp}><ArrowUpRight size={14} /> Live</span> Count
                    </div>
                </div>

                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Active Plants</span>
                        <Sprout size={20} className="text-emerald-400" />
                    </div>
                    <div className={styles.cardValue}>{stats.plants}</div>
                    <div className={styles.cardTrend}>
                        <span className={styles.trendUp}><ArrowUpRight size={14} /> Catalog</span> Size
                    </div>
                </div>

                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Partners</span>
                        <MapPin size={20} className="text-amber-400" />
                    </div>
                    <div className={styles.cardValue}>{stats.vendors}</div>
                    <div className={styles.cardTrend}>
                        <span className={styles.trendNeutral}><ArrowUpRight size={14} /> Network</span> Reach
                    </div>
                </div>

                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>System Load</span>
                        <Zap size={20} className="text-blue-400" />
                    </div>
                    <div className={styles.cardValue}>4%</div>
                    <div className={styles.cardTrend}>
                        <span className={`${styles.trendUp} text-emerald-500`}>Optimal</span> performance
                    </div>
                </div>

                {/* LARGE ACTIVITY FEED */}
                <div className={`${styles.card} ${styles.cardLarge}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Live Activity Feed</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                    </div>
                    <div className={styles.activityList}>
                        <ActivityFeed activities={activities} isLoading={loading} />
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className={`${styles.card} ${styles.cardTall}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Quick Actions</span>
                    </div>
                    <div className={styles.actionGrid}>
                        <button onClick={() => navigate('/admin/add-plant')} className={styles.actionBtn}>
                            <Plus size={24} className="text-emerald-400" />
                            <span>Add Plant</span>
                        </button>
                        <button onClick={() => navigate('/admin/add-vendor')} className={styles.actionBtn}>
                            <MapPin size={24} className="text-amber-400" />
                            <span>Add Vendor</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/manage-plants')}>
                            <Edit size={24} className="text-pink-400" />
                            <span>Manage Plants</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/manage-vendors')}>
                            <Store size={24} className="text-purple-400" />
                            <span>Manage Vendors</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/manage-users')}>
                            <Users size={24} className="text-indigo-400" />
                            <span>Manage Users</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/diag')}>
                            <Activity size={24} className="text-blue-400" />
                            <span>Run Diag</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/settings')}>
                            <Settings size={24} className="text-slate-400" />
                            <span>Settings</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/all-plants')}>
                            <Database size={24} className="text-teal-400" />
                            <span>All Plants</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
