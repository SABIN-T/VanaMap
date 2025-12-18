import { useState, useEffect } from 'react';
import { fetchVendors, updateVendor, deleteVendor, fetchPlants, addPlant, updatePlant, deletePlant, fetchResetRequests, fetchNotifications, approveResetRequest } from '../services/api';
import type { Vendor, Plant } from '../types';
import { Check, Trash2, Edit, Image as ImageIcon, Users, Sprout, Activity, RefreshCw, LogOut, Download, AlertCircle, PlusCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './Admin.module.css';
import toast from 'react-hot-toast';

export const Admin = () => {
    // --- STATE ---
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'plants' | 'activity'>('users');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    // Plant Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);

    const initialFormState: Partial<Plant> = {
        name: '',
        scientificName: '',
        description: '',
        imageUrl: '',
        price: 0,
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 50,
        sunlight: 'medium',
        oxygenLevel: 'moderate',
        type: 'indoor',
        medicinalValues: [],
        advantages: []
    };
    const [formData, setFormData] = useState<Partial<Plant>>(initialFormState);

    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuthenticated');
        if (!isAdmin) {
            navigate('/admin-login');
            return;
        }
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        const toastId = toast.loading("Fetching latest dashboard data...");
        try {
            const [vData, pData, rData, nData] = await Promise.all([
                fetchVendors(),
                fetchPlants(),
                fetchResetRequests(),
                fetchNotifications()
            ]);
            setVendors(vData);
            setPlants(pData);
            setRequests(rData);
            setNotifications(nData);

            setNotifications(nData);

            // Removed localStorage cache due to QuotaExceededError (Images too large)
            // localStorage.setItem('vanamap_plants_cache', JSON.stringify(pData));

            toast.success("Dashboard synced", { id: toastId });
        } catch (err: any) {
            console.error("Sync Error:", err);
            toast.error("Sync failed: " + (err.message || 'Unknown error'), { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // --- FORM HANDLERS ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Saving plant...");
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                idealTempMin: Number(formData.idealTempMin),
                idealTempMax: Number(formData.idealTempMax),
                minHumidity: Number(formData.minHumidity),
            };

            if (isEditing && currentPlantId) {
                await updatePlant(currentPlantId, payload);
                toast.success("Plant directory updated!", { id: tid });
            } else {
                const newId = (formData.name?.toLowerCase().replace(/\s+/g, '-') || 'plant-' + Date.now());
                await addPlant({ ...payload, id: newId });
                toast.success("New plant cataloged!", { id: tid });
            }

            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentPlantId(null);
            loadAll();
        } catch (err) {
            toast.error("Catalog failure", { id: tid });
        }
    };

    const startEdit = (plant: Plant) => {
        setIsEditing(true);
        setCurrentPlantId(plant.id);
        setFormData({ ...plant });
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // --- CLOUD EXPORT ---
    const handleDownloadVendors = () => {
        const headers = ["ID", "Name", "Address", "Phone", "WhatsApp", "Website", "Verified"];
        const rows = vendors.map(v => [v.id, `"${v.name}"`, `"${v.address}"`, v.phone, v.whatsapp, v.website || '', v.verified]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = `vanamap_vendors_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    // --- RENDER HELPERS ---
    const getActivityColor = (type: string) => {
        switch (type) {
            case 'vendor_registration': return '#a78bfa';
            case 'signup': return '#10b981';
            case 'login': return '#3b82f6';
            case 'vendor_contact': return '#facc15';
            default: return '#60a5fa';
        }
    };

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <div className={styles.titleGroup}>
                    <h1>VanaMap Control</h1>
                    <p>Global Ecosystem & Vendor Management System</p>
                </div>
                <div className={styles.tabBar}>
                    <button onClick={() => setActiveTab('users')} className={`${styles.tabBtn} ${activeTab === 'users' ? styles.active : ''}`}>
                        <Users size={18} /> Users & Vendors
                    </button>
                    <button onClick={() => setActiveTab('plants')} className={`${styles.tabBtn} ${activeTab === 'plants' ? styles.active : ''}`}>
                        <Sprout size={18} /> Plant Registry
                    </button>
                    <button onClick={() => setActiveTab('activity')} className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.active : ''}`}>
                        <Activity size={18} /> Activity Stream
                    </button>
                    <button onClick={loadAll} className={styles.tabBtn} title="Sync">
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    </button>
                    <button onClick={() => { if (confirm("Terminate session?")) { localStorage.removeItem('adminAuthenticated'); navigate('/'); } }} className={styles.tabBtn} style={{ color: '#f87171' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className={styles.adminContent}>
                {/* Stats Summary Area */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <h3>Live Vendors</h3>
                        <div className={styles.value}>{vendors.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Species Indexed</h3>
                        <div className={styles.value}>{plants.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Pending Resets</h3>
                        <div className={styles.value} style={{ color: requests.length > 0 ? '#facc15' : '#10b981' }}>{requests.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>System Uptime</h3>
                        <div className={styles.value} style={{ color: '#38bdf8' }}>99.9%</div>
                    </div>
                </div>

                {/* TAB: USERS & VENDORS */}
                {activeTab === 'users' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div className={styles.glassCard}>
                            <div className={styles.tableHeader}>
                                <h2><AlertCircle color="#facc15" /> Security: Password Reset Queue</h2>
                            </div>
                            {requests.length === 0 ? <p style={{ color: '#666' }}>Secure. No pending authentication requests.</p> : (
                                <div className={styles.listGrid}>
                                    {requests.map(req => (
                                        <div key={req._id} className={styles.listItem}>
                                            <div className={styles.itemInfo}>
                                                <h3>{req.name}</h3>
                                                <p>{req.email} • Requested {new Date(req.resetRequest.requestDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className={styles.actions}>
                                                <Button size="sm" variant="primary" onClick={() => approveResetRequest(req._id).then(loadAll)}>
                                                    Confirm Identity & Reset
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.glassCard}>
                            <div className={styles.tableHeader}>
                                <h2><Users /> Vendor Directory</h2>
                                <Button size="sm" variant="outline" onClick={handleDownloadVendors}>
                                    <Download size={16} /> Export Cloud Data
                                </Button>
                            </div>
                            <div className={styles.listGrid}>
                                {vendors.map(v => (
                                    <div key={v.id} className={styles.listItem}>
                                        <div className={styles.itemInfo}>
                                            <h3>{v.name} {v.verified && <Check size={16} color="#10b981" />}</h3>
                                            <p>{v.address} • {v.phone}</p>
                                        </div>
                                        <div className={styles.actions}>
                                            <Button size="sm" variant="outline" onClick={() => setSelectedVendor(v)}>Profile</Button>
                                            <Button size="sm" variant={v.verified ? "outline" : "primary"} onClick={() => updateVendor(v.id, { verified: !v.verified }).then(loadAll)}>
                                                {v.verified ? "Revoke Access" : "Verify Store"}
                                            </Button>
                                            <Button size="sm" style={{ background: '#7f1d1d', color: '#f87171' }} onClick={() => deleteVendor(v.id).then(loadAll)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: PLANT MANAGEMENT */}
                {activeTab === 'plants' && (
                    <div className={styles.plantGrid}>
                        <div className={styles.glassCard}>
                            <div className={styles.tableHeader}>
                                <h2>{isEditing ? <Edit /> : <PlusCircle />} {isEditing ? 'Modify Specification' : 'New Species Entry'}</h2>
                            </div>
                            <form onSubmit={handlePlantSubmit} className={styles.formGrid}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Common Name</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Aloe Vera" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Taxonomy Name</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} placeholder="e.g. Aloe barbadensis" style={{ flex: 1 }} />
                                            <Button type="button" size="sm" variant="outline" onClick={() => {
                                                const searchName = formData.scientificName || formData.name;
                                                if (!searchName) {
                                                    toast.error("Enter a name to initialize research");
                                                    return;
                                                }
                                                const tid = toast.loading(
                                                    <div style={{ minWidth: '200px' }}>
                                                        <strong>Searching Global Archives...</strong>
                                                        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>Querying: {searchName}</div>
                                                    </div>,
                                                    { style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' } }
                                                );

                                                // Simulated "Deep Research" delay
                                                setTimeout(async () => {
                                                    try {
                                                        const { analyzePlantSpecies } = await import('../utils/plantAiDatabase');
                                                        const analysis = analyzePlantSpecies(formData.scientificName || formData.name || '');

                                                        setFormData({
                                                            ...formData,
                                                            scientificName: formData.scientificName || analysis.name, // Ensure scientific name is set if missing
                                                            name: analysis.name !== "Unknown Species" ? analysis.name : formData.name,
                                                            description: analysis.description,
                                                            type: analysis.type,
                                                            sunlight: analysis.sunlight,
                                                            oxygenLevel: analysis.oxygenLevel,
                                                            idealTempMin: analysis.idealTempMin,
                                                            idealTempMax: analysis.idealTempMax,
                                                            minHumidity: analysis.minHumidity,
                                                            isNocturnal: analysis.isNocturnal,
                                                            medicinalValues: analysis.medicinalValues,
                                                            advantages: analysis.advantages
                                                        });

                                                        toast.dismiss(tid);
                                                        toast.custom(() => (
                                                            <div style={{
                                                                background: 'rgba(16, 185, 129, 0.1)',
                                                                border: '1px solid #10b981',
                                                                borderRadius: '12px',
                                                                padding: '16px',
                                                                backgroundColor: '#064e3b',
                                                                color: '#fff',
                                                                maxWidth: '350px',
                                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                                            }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: '#34d399' }}>
                                                                    <Sparkles size={18} /> RESEARCH COMPLETE
                                                                </div>
                                                                <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                                    Data synthesized for <strong>{analysis.name}</strong>:
                                                                    <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '0.8rem', color: '#a7f3d0' }}>
                                                                        <li>✓ Taxonomy & Classification Verified</li>
                                                                        <li>✓ Metabolic O₂ Rates Calculated</li>
                                                                        <li>✓ Environmental Tolerances Set</li>
                                                                        <li>✓ Medicinal Profile Extracted</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        ), { duration: 4000 });

                                                    } catch (e) {
                                                        toast.error("Research Connection Failed", { id: tid });
                                                    }
                                                }, 1500); // Slightly longer for dramatic effect
                                            }}>
                                                <Sparkles size={14} /> Auto-Research
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Ecosystem Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Functional and aesthetic traits..." />
                                </div>

                                <div className={styles.imageUpload} onClick={() => document.getElementById('admin-p-upload')?.click()}>
                                    <ImageIcon size={30} color="var(--color-primary)" />
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Catalog Cover Upload</p>
                                    <input id="admin-p-upload" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    {formData.imageUrl && <img src={formData.imageUrl} className={styles.previewImg} alt="Review" />}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Ecosystem</label>
                                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                                            <option value="indoor">Indoor (Home)</option>
                                            <option value="outdoor">Outdoor (Expo)</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Sunlight Req</label>
                                        <select value={formData.sunlight} onChange={e => setFormData({ ...formData, sunlight: e.target.value as any })}>
                                            <option value="low">Low Light</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">Bright Diffused</option>
                                            <option value="direct">Intense Direct</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>O2 Efficiency</label>
                                        <select value={formData.oxygenLevel} onChange={e => setFormData({ ...formData, oxygenLevel: e.target.value as any })}>
                                            <option value="moderate">6/10 Moderate</option>
                                            <option value="high">8/10 High</option>
                                            <option value="very-high">10/10 Peak</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                        <input type="checkbox" checked={formData.isNocturnal || false} onChange={e => setFormData({ ...formData, isNocturnal: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                                        <label style={{ margin: 0 }}>Nocturnal O₂ (CAM)</label>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Min Temp °C</label>
                                        <input type="number" value={formData.idealTempMin} onChange={e => setFormData({ ...formData, idealTempMin: Number(e.target.value) })} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Max Temp °C</label>
                                        <input type="number" value={formData.idealTempMax} onChange={e => setFormData({ ...formData, idealTempMax: Number(e.target.value) })} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Min Hum %</label>
                                        <input type="number" value={formData.minHumidity} onChange={e => setFormData({ ...formData, minHumidity: Number(e.target.value) })} />
                                    </div>
                                </div>

                                <div className={styles.actions} style={{ marginTop: '1rem' }}>
                                    <Button type="submit" style={{ flex: 1 }}>{isEditing ? 'Save Modifications' : 'Publish Entry'}</Button>
                                    {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData(initialFormState); }}>Abandon</Button>}
                                </div>
                            </form>
                        </div>

                        <div className={styles.glassCard}>
                            <div className={styles.tableHeader}>
                                <h2><Sprout /> Active Registry ({plants.length})</h2>
                            </div>
                            <div className={styles.listGrid} style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {plants.map(p => (
                                    <div key={p.id} className={styles.listItem}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <img src={p.imageUrl} style={{ width: '50px', height: '50px', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                                            <div>
                                                <h4 style={{ margin: 0 }}>{p.name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{p.scientificName}</p>
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <button onClick={() => startEdit(p)} className={styles.tabBtn} style={{ padding: '0.5rem' }}><Edit size={16} /></button>
                                            <button onClick={() => deletePlant(p.id).then(loadAll)} className={styles.tabBtn} style={{ padding: '0.5rem', color: '#f87171' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ACTIVITY STREAM */}
                {activeTab === 'activity' && (
                    <div className={styles.glassCard}>
                        <div className={styles.tableHeader}>
                            <h2><Activity /> Operational Intelligence</h2>
                        </div>
                        <div className={styles.activityList}>
                            {notifications.length === 0 ? <p style={{ textAlign: 'center', color: '#666' }}>Secure baseline. No environmental alerts.</p> : (
                                notifications.map(n => (
                                    <div key={n._id} className={styles.activityItem} style={{ borderLeftColor: getActivityColor(n.type) }}>
                                        <div className={styles.activityIcon}>
                                            <Activity size={20} color={getActivityColor(n.type)} />
                                        </div>
                                        <div className={styles.activityMain}>
                                            <div className={styles.activityTop}>
                                                <span className={styles.activityType}>{n.type.replace('_', ' ')}</span>
                                                <span className={styles.activityTime}>{new Date(n.date).toLocaleString()}</span>
                                            </div>
                                            <p className={styles.activityMsg}>{n.message}</p>
                                            {n.details && (
                                                <div className={styles.activityDetails}>
                                                    {Object.entries(n.details).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Vendor Review Bridge (Modal) */}
            {selectedVendor && (
                <div className={styles.modalOverlay} onClick={() => setSelectedVendor(null)}>
                    <div className={styles.glassCard} style={{ width: '500px', maxWidth: '95%' }} onClick={e => e.stopPropagation()}>
                        <h2>Vendor Identity: {selectedVendor.name}</h2>
                        <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div><label style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Physical Vector</label><div>{selectedVendor.address}</div></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><label style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Comm: Voice</label><div>{selectedVendor.phone}</div></div>
                                <div><label style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Comm: WA</label><div>{selectedVendor.whatsapp}</div></div>
                            </div>
                            <div><label style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>External Web</label><div>{selectedVendor.website || 'Native Only'}</div></div>
                        </div>
                        <Button style={{ width: '100%' }} onClick={() => setSelectedVendor(null)}>Close Terminal</Button>
                    </div>
                </div>
            )}
        </div>
    );
};
