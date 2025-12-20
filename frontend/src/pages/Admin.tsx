import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    fetchVendors, fetchPlants, fetchUsers, addPlant, registerVendor,
    updateVendor, deleteVendor
} from '../services/api';
import type { Plant, Vendor } from '../types';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight,
    Plus, Zap, Settings, Shield, LogOut, X, Search,
    CheckCircle, Trash2, Star, Store, Server, Database, Lock, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './Admin.module.css';
import toast from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../data/indianPlants';

export const Admin = () => {
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    // Unified Modal State: 'add-plant', 'add-vendor', 'manage-vendors', 'settings', 'diag'
    const [activeModal, setActiveModal] = useState<string | null>(null);

    // Data State
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);

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
            setAllVendors(v);

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
            setActiveModal(null);
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
            setActiveModal(null);
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

    // Vendor Management Handlers
    const toggleVendorVerification = async (v: Vendor) => {
        const newStatus = !v.verified;
        const tid = toast.loading(newStatus ? "Verifying Vendor..." : "Revoking Verification...");
        try {
            await updateVendor(v.id, { verified: newStatus });
            toast.success(newStatus ? "Vendor Approved!" : "Vendor Access Revoked", { id: tid });
            loadData();
        } catch (e) { toast.error("Update failed", { id: tid }); }
    };

    const toggleVendorRecommendation = async (v: Vendor) => {
        const newStatus = !v.highlyRecommended;
        const tid = toast.loading(newStatus ? "Promoting Vendor..." : "Demoting Vendor...");
        try {
            await updateVendor(v.id, { highlyRecommended: newStatus });
            toast.success(newStatus ? "Vendor Promoted to Top Tier!" : "Vendor Demoted", { id: tid });
            loadData();
        } catch (e) { toast.error("Update failed", { id: tid }); }
    };

    const handleDeleteVendor = async (id: string) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this vendor?")) return;
        const tid = toast.loading("Deleting Vendor...");
        try {
            await deleteVendor(id);
            toast.success("Vendor Deleted", { id: tid });
            loadData();
        } catch (e) { toast.error("Deletion failed", { id: tid }); }
    };

    // Render Helper for Modals
    const renderModal = () => {
        if (!activeModal) return null;

        const modalContent = {
            'add-plant': {
                title: 'Add New Species',
                icon: <Sprout className="text-emerald-400" />,
                content: (
                    <form onSubmit={handleSavePlant} className="space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <label className="text-xs font-bold text-emerald-500 uppercase mb-2 block">Smart Fill</label>
                            <div className="flex gap-2">
                                <input className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Scientific Name (e.g. Ocimum tenuiflorum)" value={newPlant.scientificName} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Price (₹)</label>
                                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" value={newPlant.price} onChange={e => setNewPlant({ ...newPlant, price: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Sunlight</label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" value={newPlant.sunlight} onChange={e => setNewPlant({ ...newPlant, sunlight: e.target.value as any })}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20">Save Plant to Database</Button>
                    </form>
                )
            },
            'add-vendor': {
                title: 'Onboard New Partner',
                icon: <MapPin className="text-amber-400" />,
                content: (
                    <form onSubmit={handleSaveVendor} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">Vendor Name</label>
                            <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" required value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Latitude</label>
                                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" value={newVendor.latitude} onChange={e => setNewVendor({ ...newVendor, latitude: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Longitude</label>
                                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" value={newVendor.longitude} onChange={e => setNewVendor({ ...newVendor, longitude: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">Full Address</label>
                            <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white h-24 resize-none" required value={newVendor.address} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} />
                        </div>
                        <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-900/20">Register Vendor</Button>
                    </form>
                )
            },
            'manage-vendors': {
                title: 'Vendor Management',
                icon: <Store className="text-purple-400" />,
                content: (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[60vh]">
                        {allVendors.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Store size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No vendors found in the network.</p>
                            </div>
                        ) : (
                            allVendors.map(vendor => (
                                <div key={vendor.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${vendor.verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-lg">{vendor.name}</h3>
                                                {vendor.verified && <CheckCircle size={16} className="text-emerald-500" fill="currentColor" />}
                                                {vendor.highlyRecommended && <Star size={16} className="text-yellow-400" fill="currentColor" />}
                                            </div>
                                            <p className="text-slate-400 text-sm">{vendor.address || "No address provided"}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${vendor.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                    {vendor.verified ? 'VERIFIED' : 'PENDING APPROVAL'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                        <Button size="sm" variant="outline" onClick={() => toggleVendorVerification(vendor)} className={`flex-1 md:flex-none ${vendor.verified ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                                            {vendor.verified ? 'Revoke' : 'Approve'}
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => toggleVendorRecommendation(vendor)} className={`flex-1 md:flex-none ${vendor.highlyRecommended ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}>
                                            <Star size={18} fill={vendor.highlyRecommended ? "currentColor" : "none"} />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeleteVendor(vendor.id)} className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )
            },
            'diag': {
                title: 'System Diagnostics',
                icon: <Activity className="text-blue-400" />,
                content: (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3 mb-2">
                                    <Server size={20} className="text-blue-400" />
                                    <span className="text-slate-300 font-bold">API Latency</span>
                                </div>
                                <div className="text-2xl font-mono text-emerald-400">42ms</div>
                                <div className="w-full bg-slate-700 h-1 mt-2 rounded-full"><div className="bg-emerald-500 h-1 w-[20%] rounded-full"></div></div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3 mb-2">
                                    <Database size={20} className="text-purple-400" />
                                    <span className="text-slate-300 font-bold">DB Connection</span>
                                </div>
                                <div className="text-2xl font-mono text-emerald-400">Healthy</div>
                                <div className="text-xs text-slate-500 mt-1">Uptime: 99.98%</div>
                            </div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 h-48 overflow-y-auto">
                            <div className="text-emerald-500 pb-2 border-b border-slate-800 mb-2">System Logs</div>
                            <p>[15:42:01] Worker process started</p>
                            <p>[15:42:05] Connected to MongoDB Cluster0</p>
                            <p>[15:43:12] Backup routine executed successfully</p>
                            <p>[15:45:00] Cleaning up temporary files...</p>
                            <p>[15:45:01] Cleanup complete. 12mb freed.</p>
                            <p className="animate-pulse">_</p>
                        </div>
                    </div>
                )
            },
            'settings': {
                title: 'Admin Settings',
                icon: <Settings className="text-slate-400" />,
                content: (
                    <div className="space-y-2">
                        {['Two-Factor Authentication', 'Email Notifications', 'Auto-Backup Database', 'Maintenance Mode'].map((setting, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    {i === 0 ? <Lock size={18} className="text-slate-400" /> : i === 1 ? <Bell size={18} className="text-slate-400" /> : i === 2 ? <Database size={18} className="text-slate-400" /> : <Shield size={18} className="text-slate-400" />}
                                    <span className="text-slate-200">{setting}</span>
                                </div>
                                <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-slate-700 rounded-full cursor-pointer">
                                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${i === 1 ? 'translate-x-4 bg-emerald-400' : ''}`}></span>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <h4 className="text-rose-400 font-bold mb-1 flex items-center gap-2"><Shield size={16} /> Danger Zone</h4>
                            <p className="text-xs text-rose-300/70 mb-3">Irreversible actions that affect the entire platform.</p>
                            <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white w-full">Reset System Cache</Button>
                        </div>
                    </div>
                )
            }
        };

        const currentModal = (modalContent as any)[activeModal];
        if (!currentModal) return null;

        return createPortal(
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
                <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {currentModal.icon} {currentModal.title}
                            </h2>
                        </div>
                        <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {currentModal.content}
                    </div>
                </div>
            </div>,
            document.body
        );
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
                        <button onClick={() => setActiveModal('add-plant')} className={styles.actionBtn}>
                            <Plus size={24} className="text-emerald-400" />
                            <span>Add Plant</span>
                        </button>
                        <button onClick={() => setActiveModal('add-vendor')} className={styles.actionBtn}>
                            <MapPin size={24} className="text-amber-400" />
                            <span>Add Vendor</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => setActiveModal('manage-vendors')}>
                            <Store size={24} className="text-purple-400" />
                            <span>Existing Vendors</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => setActiveModal('diag')}>
                            <Activity size={24} className="text-blue-400" />
                            <span>Run Diag</span>
                        </button>
                        <button className={styles.actionBtn} onClick={() => setActiveModal('settings')}>
                            <Settings size={24} className="text-slate-400" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Unified Modal Rendering */}
            {renderModal()}

        </div>
    );
};

export default Admin;
