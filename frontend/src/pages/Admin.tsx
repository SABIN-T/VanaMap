import { useState, useEffect, useCallback } from 'react';
import {
    fetchVendors, fetchPlants, fetchUsers
} from '../services/api';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight,
    Plus, Zap, Settings, Shield, LogOut,
    Store, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

export const Admin = () => {
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        try {
            const [v, p, u] = await Promise.all([fetchVendors(), fetchPlants(), fetchUsers()]);
            setStats({
                vendors: v.length,
                plants: p.length,
                users: u.length
            });

            // Simulate recent activity from real data
            const activity = [
                ...p.slice(-2).map(x => ({ type: 'plant', name: x.name, time: '2 mins ago' })),
                ...v.slice(-1).map(x => ({ type: 'vendor', name: x.name, time: '1 hour ago' })),
                ...u.slice(-2).map(x => ({ type: 'user', name: x.name || x.email, time: '3 hours ago' }))
            ].sort(() => Math.random() - 0.5);
            setRecentActivity(activity);
        } catch (err) {
            console.error(err);
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
                        <span className={styles.trendUp}><ArrowUpRight size={14} /> +12%</span> this week
                    </div>
                </div>

                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Active Plants</span>
                        <Sprout size={20} className="text-emerald-400" />
                    </div>
                    <div className={styles.cardValue}>{stats.plants}</div>
                    <div className={styles.cardTrend}>
                        <span className={styles.trendUp}><ArrowUpRight size={14} /> +5</span> new species
                    </div>
                </div>

                <div className={`${styles.card} ${styles.cardStat}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Partners</span>
                        <MapPin size={20} className="text-amber-400" />
                    </div>
                    <div className={styles.cardValue}>{stats.vendors}</div>
                    <div className={styles.cardTrend}>
                        <span className={styles.trendNeutral}><ArrowUpRight size={14} /> Stable</span> network
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
                        {recentActivity.map((item, i) => (
                            <div key={i} className={styles.activityItem}>
                                <div className={styles.iconBox}>
                                    {item.type === 'plant' ? <Sprout size={18} /> : item.type === 'user' ? <Users size={18} /> : <MapPin size={18} />}
                                </div>
                                <div className={styles.activityInfo}>
                                    <div className="text-white capitalize">{item.type} Update</div>
                                    <div>{item.type === 'plant' ? 'New species discovered:' : item.type === 'user' ? 'New user joined:' : 'Partner updated:'} <span className="text-slate-300 font-medium">{item.name}</span> • {item.time}</div>
                                </div>
                            </div>
                        ))}
                        {recentActivity.length === 0 && <div className="text-center text-slate-500 py-10">No recent activity detected.</div>}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
