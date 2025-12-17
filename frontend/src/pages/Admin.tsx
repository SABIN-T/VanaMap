import { useState, useEffect } from 'react';
import { fetchVendors, updateVendor, deleteVendor, fetchPlants, addPlant, updatePlant, deletePlant } from '../services/api';
import type { Vendor, Plant } from '../types';
import { Check, X, Store, Trash2, Star, Edit, Plus, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Admin = () => {
    // --- STATE ---
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'plants'>('users');

    // Plant Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Plant>>({
        name: '', scientificName: '', description: '', imageUrl: '',
        price: '', minTemp: 0, maxTemp: 40, humidity: 50,
        sunlight: 'Partial', water: 'Moderate', oxygen: 'Moderate',
        type: 'Indoor', medicinalValues: [], advantages: []
    });

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
        const [vData, pData, rData] = await Promise.all([
            fetchVendors(),
            fetchPlants(),
            import('../services/api').then(api => api.fetchResetRequests().catch(() => []))
        ]);
        setVendors(vData);
        setPlants(pData);
        setRequests(rData);
    };

    // --- PLANT HANDLERS ---

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
        try {
            if (isEditing && currentPlantId) {
                // Update
                await updatePlant(currentPlantId, formData);
                alert("Plant Updated!");
            } else {
                // Create
                // Generate a simple ID if not present (Backend usually does _id but frontend uses string 'id')
                // Ideally backend handles 'id' creation. Let's send it.
                const newId = (formData.name?.toLowerCase().replace(/\s+/g, '-') || 'plant-' + Date.now());
                await addPlant({ ...formData, id: newId });
                alert("Plant Added!");
            }
            // Reset Form
            setFormData({
                name: '', scientificName: '', description: '', imageUrl: '',
                price: '', minTemp: 0, maxTemp: 40, humidity: 50,
                sunlight: 'Partial', water: 'Moderate', oxygen: 'Moderate',
                type: 'Indoor', medicinalValues: [], advantages: []
            });
            setIsEditing(false);
            setCurrentPlantId(null);
            loadAll();
        } catch (err) {
            alert("Operation failed. Check console.");
            console.error(err);
        }
    };

    const startEdit = (plant: Plant) => {
        setIsEditing(true);
        setCurrentPlantId(plant.id);
        setFormData({ ...plant });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePlant = async (id: string) => {
        if (confirm("Delete this plant permanently?")) {
            await deletePlant(id);
            loadAll();
        }
    };

    // --- VENDOR & REQUEST HANDLERS (Existing) ---
    const handleApproveReset = async (userId: string) => {
        if (confirm("Approve password reset for this user?")) {
            try {
                await import('../services/api').then(api => api.approveResetRequest(userId));
                alert("Request Approved.");
                loadAll();
            } catch (e) { alert("Failed to approve."); }
        }
    };

    const handleVerify = async (id: string, status: boolean) => {
        await updateVendor(id, { verified: status });
        loadAll();
    };

    const handleRecommended = async (id: string, status: boolean) => {
        await updateVendor(id, { highlyRecommended: status });
        loadAll();
    };

    const handleDeleteVendor = async (id: string) => {
        if (confirm("Delete this vendor?")) {
            await deleteVendor(id);
            loadAll();
        }
    };

    const handleResetDatabase = async () => {
        if (confirm("WARNING: This will wipe data!")) {
            try {
                const { PLANTS } = await import('../data/mocks');
                await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                window.location.reload();
            } catch (e) { alert("Failed."); }
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setActiveTab('users')} style={{ padding: '0.5rem 1rem', background: activeTab === 'users' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem', color: activeTab === 'users' ? 'black' : 'white', cursor: 'pointer' }}>
                        Users & Vendors
                    </button>
                    <button onClick={() => setActiveTab('plants')} style={{ padding: '0.5rem 1rem', background: activeTab === 'plants' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem', color: activeTab === 'plants' ? 'black' : 'white', cursor: 'pointer' }}>
                        Plant Management
                    </button>
                    <button onClick={handleResetDatabase} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        ⚠ Reset Data
                    </button>
                </div>
            </div>

            {/* ==================== USERS & VENDORS TAB ==================== */}
            {activeTab === 'users' && (
                <>
                    {/* RESET REQUESTS */}
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--color-primary)' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Password Reset Requests</h2>
                        {requests.length === 0 ? <p style={{ color: '#aaa' }}>No pending requests.</p> : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {requests.map(req => (
                                    <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                                        <div>
                                            <h3>{req.name}</h3>
                                            <p style={{ color: '#aaa' }}>{req.email}</p>
                                        </div>
                                        <div>
                                            {req.resetRequest.approved ? <span style={{ color: 'var(--color-primary)' }}>Approved</span> :
                                                <Button size="sm" onClick={() => handleApproveReset(req._id)}>Approve</Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* VENDOR MANAGEMENT */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2>Vendor Management</h2>
                        {vendors.length === 0 ? <p>No vendors.</p> : (
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {vendors.map(v => (
                                    <div key={v.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3>{v.name} {v.verified && '✅'}</h3>
                                            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{v.address}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {!v.verified ? <Button size="sm" onClick={() => handleVerify(v.id, true)}><Check size={14} /> Verify</Button> :
                                                <Button size="sm" variant="outline" onClick={() => handleVerify(v.id, false)}><X size={14} /> Unverify</Button>}
                                            <Button size="sm" style={{ background: '#ef4444' }} onClick={() => handleDeleteVendor(v.id)}><Trash2 size={14} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ==================== PLANT MANAGEMENT TAB ==================== */}
            {activeTab === 'plants' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* --- ADD/EDIT FORM --- */}
                    <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h2>{isEditing ? 'Edit Plant' : 'Add New Plant'}</h2>
                        <form onSubmit={handlePlantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input placeholder="Plant Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={inputStyle} />
                                <input placeholder="Scientific Name" value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} style={inputStyle} />
                            </div>

                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />

                            {/* Image Upload */}
                            <div style={{ border: '1px dashed #666', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <ImageIcon size={32} color="#aaa" />
                                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Click to Upload Image (PNG/JPG)</span>
                                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                                {formData.imageUrl && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ height: '100px', borderRadius: '0.5rem' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <select value={formData.sunlight} onChange={e => setFormData({ ...formData, sunlight: e.target.value })} style={inputStyle}>
                                    <option>Full Sun</option><option>Partial</option><option>Shade</option>
                                </select>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={inputStyle}>
                                    <option>Indoor</option><option>Outdoor</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="number" placeholder="Min Temp" value={formData.minTemp} onChange={e => setFormData({ ...formData, minTemp: Number(e.target.value) })} style={inputStyle} />
                                <input type="number" placeholder="Max Temp" value={formData.maxTemp} onChange={e => setFormData({ ...formData, maxTemp: Number(e.target.value) })} style={inputStyle} />
                            </div>

                            <input placeholder="Price (e.g. ₹500)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={inputStyle} />

                            {/* Comma Separated Arrays */}
                            <input placeholder="Medicinal Values (comma separated)" value={formData.medicinalValues?.join(', ')} onChange={e => setFormData({ ...formData, medicinalValues: e.target.value.split(',').map(s => s.trim()) })} style={inputStyle} />
                            <input placeholder="Advantages (comma separated)" value={formData.advantages?.join(', ')} onChange={e => setFormData({ ...formData, advantages: e.target.value.split(',').map(s => s.trim()) })} style={inputStyle} />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="submit" style={{ flex: 1 }}>{isEditing ? 'Update Plant' : 'Add Plant'}</Button>
                                {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentPlantId(null); setFormData({}); }}>Cancel</Button>}
                            </div>
                        </form>
                    </div>

                    {/* --- PLANT LIST --- */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2>Current Plants ({plants.length})</h2>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '800px', overflowY: 'auto' }}>
                            {plants.map(p => (
                                <div key={p.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                    <img src={p.imageUrl} style={{ width: '60px', height: '60px', borderRadius: '0.4rem', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0 }}>{p.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{p.scientificName}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <button onClick={() => startEdit(p)} style={{ background: 'none', border: 'none', color: '#facc15', cursor: 'pointer' }}><Edit size={16} /></button>
                                        <button onClick={() => handleDeletePlant(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'var(--glass-border)',
    background: 'var(--glass-bg)',
    color: 'var(--color-text-main)',
    outline: 'none',
    width: '100%'
};
