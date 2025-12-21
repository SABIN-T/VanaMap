import { useState, useEffect, useCallback } from 'react';
import {
    fetchVendors, fetchPlants, fetchUsers
} from '../services/api';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight,
    Plus, Zap, Settings, Shield, LogOut,
    Store, Edit, Database, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';


export const Admin = () => {
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });


    const navigate = useNavigate();



    const loadData = useCallback(async () => {
        try {

            const [vendors, plants, users] = await Promise.all([fetchVendors(), fetchPlants(), fetchUsers()]);

            setStats({
                vendors: vendors.length,
                plants: plants.length,
                users: users.length
            });


        } catch (err) {
            console.error(err);
        }
    }, [fetchPlants, fetchUsers, fetchVendors]);

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
                        <button className={styles.actionBtn} onClick={() => navigate('/admin/notifications')}>
                            <Bell size={24} className="text-orange-400" />
                            <span>Notifications</span>
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
