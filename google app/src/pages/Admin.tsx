import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchVendors, fetchPlants, fetchUsers
} from '../services/api';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from './admin/AdminLayout';
import styles from './Admin.module.css';

export const Admin = () => {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });

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
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            navigate('/auth', { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            loadData();
        }
    }, [user, loadData, authLoading]);

    if (authLoading || !user || user.role !== 'admin') {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
                <div className="pre-loader-pulse"></div>
            </div>
        );
    }

    return (
        <AdminLayout title="System Overview">
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

                {/* CENTRAL MONITOR */}
                <div className={`${styles.card} ${styles.cardLarge}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>System Pulse</span>
                        <Activity size={20} className="text-rose-500" />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
                        <Activity size={48} className="animate-pulse" />
                        <div className="text-center">
                            <h3 className="text-white font-bold">Real-time monitoring active</h3>
                            <p className="text-xs text-slate-400 max-w-xs">Connecting to secure stream... metrics will populate shortly.</p>
                        </div>
                    </div>
                </div>

                {/* SERVER STATUS */}
                <div className={`${styles.card} ${styles.cardTall}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Server Nodes</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'US-EAST-1', status: 'Online', color: '#10b981' },
                            { name: 'EU-WEST-2', status: 'Online', color: '#10b981' },
                            { name: 'AP-SOUTH-1', status: 'Healthy', color: '#10b981' },
                            { name: 'REPLICA-01', status: 'Syncing', color: '#3b82f6' }
                        ].map(node => (
                            <div key={node.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                                <span className="font-bold">{node.name}</span>
                                <span style={{ color: node.color }}>{node.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin;
