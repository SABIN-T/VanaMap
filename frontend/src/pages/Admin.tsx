import { useState, useEffect } from 'react';
import { fetchVendors, updateVendor, deleteVendor } from '../services/api';
import type { Vendor } from '../types';
import { Check, X, Store, Trash2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuthenticated');
        if (!isAdmin) {
            navigate('/admin-login');
            return;
        }
        loadVendors();
    }, []);

    const loadVendors = async () => {
        const data = await fetchVendors();
        setVendors(data);
    };

    const handleVerify = async (id: string, status: boolean) => {
        const success = await updateVendor(id, { verified: status });
        if (success) {
            alert(`Vendor ${status ? 'verified' : 'unverified'} successfully!`);
            loadVendors();
        } else {
            alert('Failed to update vendor.');
        }
    };

    const handleRecommended = async (id: string, status: boolean) => {
        const success = await updateVendor(id, { highlyRecommended: status });
        if (success) {
            alert(`Vendor ${status ? 'marked' : 'unmarked'} as Top Rated!`);
            loadVendors();
        } else {
            alert('Failed to update recommendation status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to permanently DELETE this vendor?")) {
            const success = await deleteVendor(id);
            if (success) {
                alert('Vendor removed successfully.');
                loadVendors();
            } else {
                alert('Failed to delete vendor.');
            }
        }
    };

    const handleResetDatabase = async () => {
        if (confirm("WARNING: This will wipe all plants/vendors and reload fresh data from code. Continue?")) {
            try {
                const { PLANTS } = await import('../data/mocks');
                // Pass empty array for vendors to ensure we NEVER wipe real vendors (User Safety Request)
                await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                alert("Database Reset Complete! Reloading...");
                window.location.reload();
            } catch (e) {
                console.error(e);
                alert("Failed to reset database.");
            }
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button
                    onClick={handleResetDatabase}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                >
                    ⚠ Reset System Data
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Vendor Management</h2>

                {vendors.length === 0 ? (
                    <p>No vendors found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {vendors.map(vendor => (
                            <div key={vendor.id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: vendor.verified ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                                            <Store size={24} color={vendor.verified ? 'var(--color-primary)' : '#aaa'} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {vendor.name}
                                                {vendor.verified && <span style={{ fontSize: '0.7rem', background: 'var(--color-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>VERIFIED</span>}
                                                {vendor.highlyRecommended && <span style={{ fontSize: '0.7rem', background: '#facc15', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>TOP RATED</span>}
                                            </h3>
                                            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{vendor.address || 'No address provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Row */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                    {/* VERIFY TOGGLE */}
                                    {!vendor.verified ? (
                                        <button onClick={() => handleVerify(vendor.id, true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                            <Check size={14} /> Verify
                                        </button>
                                    ) : (
                                        <button onClick={() => handleVerify(vendor.id, false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                                            <X size={14} /> Un-Verify
                                        </button>
                                    )}

                                    {/* RECOMMEND TOGGLE */}
                                    {!vendor.highlyRecommended ? (
                                        <button onClick={() => handleRecommended(vendor.id, true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #facc15', color: '#facc15' }}>
                                            <Star size={14} /> Make Top Rated
                                        </button>
                                    ) : (
                                        <button onClick={() => handleRecommended(vendor.id, false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#facc15', color: '#000' }}>
                                            <Star size={14} fill="black" /> Remove Top Rated
                                        </button>
                                    )}

                                    {/* DELETE BUTTON */}
                                    <button onClick={() => handleDelete(vendor.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.5)', marginLeft: 'auto' }}>
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
