import { useState, useEffect } from 'react';
import { fetchVendors, updateVendor, deleteVendor, fetchPlants, addPlant, updatePlant, deletePlant } from '../services/api';
import type { Vendor, Plant } from '../types';
import { Check, X, Store, Trash2, Star, Edit, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Admin = () => {
    // --- STATE ---
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'plants'>('users');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [resetHover, setResetHover] = useState(false);

    // Plant Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);

    // Default valid state strictly matching Plant interface
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
            // Ensure numeric values are numbers
            const payload = {
                ...formData,
                price: Number(formData.price),
                idealTempMin: Number(formData.idealTempMin),
                idealTempMax: Number(formData.idealTempMax),
                minHumidity: Number(formData.minHumidity),
            };

            if (isEditing && currentPlantId) {
                await updatePlant(currentPlantId, payload);
                alert("Plant Updated!");
            } else {
                const newId = (formData.name?.toLowerCase().replace(/\s+/g, '-') || 'plant-' + Date.now());
                await addPlant({ ...payload, id: newId });
                alert("Plant Added!");
            }

            setFormData(initialFormState);
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
                const { PLANTS, VENDORS, USERS } = await import('../data/mocks');
                await import('../services/api').then(api => api.seedDatabase(PLANTS, VENDORS, USERS));
                window.location.reload();
            } catch (e) { alert("Failed."); }
        }
    };

    const handleDownloadVendors = () => {
        const headers = ["ID", "Name", "Address", "Phone", "WhatsApp", "Website", "Latitude", "Longitude", "Verified", "Recommended"];
        const rows = vendors.map(v => [
            v.id,
            `"${v.name}"`, // Quote to handle commas
            `"${v.address}"`,
            v.phone,
            v.whatsapp,
            v.website,
            v.latitude,
            v.longitude,
            v.verified,
            v.highlyRecommended
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vendors_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <button
                        onClick={handleResetDatabase}
                        onMouseEnter={() => setResetHover(true)}
                        onMouseLeave={() => setResetHover(false)}
                        style={{
                            background: resetHover ? 'white' : '#ef4444',
                            color: resetHover ? 'black' : 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Vendor Management</h2>
                            <Button size="sm" onClick={handleDownloadVendors} variant="outline">
                                Download Excel (CSV)
                            </Button>
                        </div>
                        {vendors.length === 0 ? <p>No vendors.</p> : (
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {vendors.map(v => (
                                    <div key={v.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3>{v.name} {v.verified && '✅'}</h3>
                                            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{v.address}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button size="sm" variant="outline" onClick={() => setSelectedVendor(v)}>Details</Button>
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
                                <input placeholder="Plant Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={inputStyle} />
                                <input placeholder="Scientific Name" value={formData.scientificName || ''} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} style={inputStyle} />
                            </div>

                            <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />

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
                                {/* Sunlight Enum Mapping */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Sunlight</label>
                                    <select value={formData.sunlight || 'medium'} onChange={e => setFormData({ ...formData, sunlight: e.target.value as any })} style={inputStyle}>
                                        <option value="low">Low / Indirect</option>
                                        <option value="medium">Medium / Partial</option>
                                        <option value="high">High / Bright</option>
                                        <option value="direct">Direct Sunlight</option>
                                    </select>
                                </div>

                                {/* Oxygen Enum Mapping */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Oxygen Level</label>
                                    <select value={formData.oxygenLevel || 'moderate'} onChange={e => setFormData({ ...formData, oxygenLevel: e.target.value as any })} style={inputStyle}>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                        <option value="very-high">Very High</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {/* Type Enum Mapping */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Type</label>
                                    <select value={formData.type || 'indoor'} onChange={e => setFormData({ ...formData, type: e.target.value as any })} style={inputStyle}>
                                        <option value="indoor">Indoor</option>
                                        <option value="outdoor">Outdoor</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Min Humidity (%)</label>
                                    <input type="number" value={formData.minHumidity || 50} onChange={e => setFormData({ ...formData, minHumidity: Number(e.target.value) })} style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Min Temp (°C)</label>
                                    <input type="number" value={formData.idealTempMin || 0} onChange={e => setFormData({ ...formData, idealTempMin: Number(e.target.value) })} style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Max Temp (°C)</label>
                                    <input type="number" value={formData.idealTempMax || 40} onChange={e => setFormData({ ...formData, idealTempMax: Number(e.target.value) })} style={inputStyle} />
                                </div>
                            </div>

                            <input placeholder="Price (e.g. 500)" type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} style={inputStyle} />

                            {/* Comma Separated Arrays */}
                            <input placeholder="Medicinal Values (comma separated)" value={formData.medicinalValues?.join(', ') || ''} onChange={e => setFormData({ ...formData, medicinalValues: e.target.value.split(',').map(s => s.trim()) })} style={inputStyle} />
                            <input placeholder="Advantages (comma separated)" value={formData.advantages?.join(', ') || ''} onChange={e => setFormData({ ...formData, advantages: e.target.value.split(',').map(s => s.trim()) })} style={inputStyle} />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="submit" style={{ flex: 1 }}>{isEditing ? 'Update Plant' : 'Add Plant'}</Button>
                                {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentPlantId(null); setFormData(initialFormState); }}>Cancel</Button>}
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

            {/* Vendor Details Modal */}
            {selectedVendor && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '500px', maxWidth: '90%' }}>
                        <h2>Vendor Details: {selectedVendor.name}</h2>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <p><strong>ID:</strong> {selectedVendor.id}</p>
                            <p><strong>Address:</strong> {selectedVendor.address}</p>
                            <p><strong>Phone:</strong> {selectedVendor.phone}</p>
                            <p><strong>WhatsApp:</strong> {selectedVendor.whatsapp}</p>
                            <p><strong>Website:</strong> {selectedVendor.website || 'N/A'}</p>
                            <p><strong>Coordinates:</strong> {selectedVendor.latitude}, {selectedVendor.longitude}</p>
                            <p><strong>Verified:</strong> {selectedVendor.verified ? 'Yes' : 'No'}</p>
                            <p><strong>Recommended:</strong> {selectedVendor.highlyRecommended ? 'Yes' : 'No'}</p>
                        </div>
                        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                            <Button onClick={() => setSelectedVendor(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... inputStyle definition ...

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'var(--glass-border)',
    background: 'var(--glass-bg)',
    color: 'var(--color-text-main)',
    outline: 'none',
    width: '100%'
};
