import { useState, useEffect, useCallback } from 'react';
import {
    fetchVendors, fetchPlants, fetchUsers, addPlant, registerVendor
} from '../services/api';
import type { Plant, Vendor } from '../types';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight,
    Plus, Zap, Settings, Shield, LogOut, X, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './Admin.module.css';
import toast from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../data/indianPlants';

export const Admin = () => {
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [drawerOpen, setDrawerOpen] = useState<'plant' | 'vendor' | null>(null);

    // Form States
    const [newPlant, setNewPlant] = useState<Partial<Plant>>({
        price: 500, idealTempMin: 18, idealTempMax: 30, minHumidity: 50,
        sunlight: 'medium', oxygenLevel: 'moderate', type: 'indoor',
        medicinalValues: [], advantages: [], isNocturnal: false
    });
    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
        latitude: 28.61, longitude: 77.23, verified: true
    });

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
                ...u.slice(-2).map(x => ({ type: 'user', name: x.name, time: '3 hours ago' }))
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

    const handleSavePlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Adding to Registry...");
        try {
            await addPlant({
                ...newPlant,
                id: newPlant.name?.toLowerCase().replace(/\s+/g, '-') || `plant-${Date.now()}`,
                price: Number(newPlant.price)
            } as Plant);
            toast.success("Plant Added", { id: tid });
            setDrawerOpen(null);
            loadData();
        } catch (err) {
            toast.error("Failed to add plant", { id: tid });
        }
    };

    const handleSaveVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Onboarding Partner...");
        try {
            await registerVendor(newVendor);
            toast.success("Partner Onboarded", { id: tid });
            setDrawerOpen(null);
            loadData();
        } catch (err) {
            toast.error("Failed to add vendor", { id: tid });
        }
    };

    const smartFillPlant = () => {
        if (!newPlant.scientificName) return toast.error("Enter Scientific Name");
        const match = Object.values(INDIAN_PLANT_DB).find(p => (p as any).scientificName?.toLowerCase() === newPlant.scientificName?.toLowerCase());
        if (match) {
            setNewPlant(prev => ({ ...prev, ...match }));
            toast.success("Data Auto-Filled");
        } else {
            toast.error("Not found in database");
        }
    };

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
                        <button onClick={() => setDrawerOpen('plant')} className={styles.actionBtn}>
                            <Plus size={24} className="text-emerald-400" />
                            <span>Add Plant</span>
                        </button>
                        <button onClick={() => setDrawerOpen('vendor')} className={styles.actionBtn}>
                            <MapPin size={24} className="text-amber-400" />
                            <span>Add Vendor</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => toast('System scan initiated')}>
                            <Activity size={24} className="text-blue-400" />
                            <span>Run Diag</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => toast('Settings locked')}>
                            <Settings size={24} className="text-slate-400" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DRAWERS (Minimalist Overlay) */}
            {drawerOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end transition-all" onClick={() => setDrawerOpen(null)}>
                    <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">{drawerOpen === 'plant' ? 'Add New Species' : 'Onboard Partner'}</h2>
                            <button onClick={() => setDrawerOpen(null)}><X className="text-slate-400 hover:text-white" /></button>
                        </div>

                        {drawerOpen === 'plant' && (
                            <form onSubmit={handleSavePlant} className="space-y-6">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <label className="text-xs font-bold text-emerald-500 uppercase mb-2 block">Smart Fill</label>
                                    <div className="flex gap-2">
                                        <input className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Scientific Name..." value={newPlant.scientificName} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
                                        <Button type="button" size="sm" onClick={smartFillPlant}><Search size={16} /></Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Name</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" required value={newPlant.name} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Image URL</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" value={newPlant.imageUrl} onChange={e => setNewPlant({ ...newPlant, imageUrl: e.target.value })} />
                                </div>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl">Save Plant</Button>
                            </form>
                        )}

                        {drawerOpen === 'vendor' && (
                            <form onSubmit={handleSaveVendor} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Vendor Name</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" required value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Address</label>
                                    <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white h-24" required value={newVendor.address} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl">Onboard Vendor</Button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
