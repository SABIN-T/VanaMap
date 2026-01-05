import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Store, Star, Trash2, ShieldCheck, AlertCircle, MapPin, Search, X, Lock } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchVendors, updateVendor, deleteVendor } from '../../services/api';
import type { Vendor } from '../../types';
import styles from './ManageVendors.module.css';

export const ManageVendors = () => {
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Password Reset State
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedVendorForReset, setSelectedVendorForReset] = useState<Vendor | null>(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => { loadVendors(); }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredVendors(allVendors);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredVendors(allVendors.filter(v =>
                v.name?.toLowerCase().includes(query) ||
                v.address?.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, allVendors]);

    const loadVendors = async () => {
        const data = await fetchVendors();
        setAllVendors(data);
        setFilteredVendors(data);
    };

    const toggleVerification = async (v: Vendor) => {
        const newStatus = !v.verified;
        const tid = toast.loading(newStatus ? "Verifying Partner..." : "Revoking Status...");
        try {
            await updateVendor(v.id, { verified: newStatus });
            toast.success(newStatus ? "Partner Verified" : "Verification Revoked", { id: tid });
            loadVendors();
        } catch { toast.error("Status Update Failed", { id: tid }); }
    };

    const toggleRecommendation = async (v: Vendor) => {
        const newStatus = !v.highlyRecommended;
        try {
            await updateVendor(v.id, { highlyRecommended: newStatus });
            if (newStatus) toast.success("Marked as Top Partner!", { icon: '🌟' });
            loadVendors();
        } catch { toast.error("Promotion Failed"); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Permanently delete this partner account?")) return;
        const tid = toast.loading("Removing Partner...");
        try {
            await deleteVendor(id);
            toast.success("Partner Removed", { id: tid });
            loadVendors();
        } catch { toast.error("Deletion failed", { id: tid }); }
    };

    const handlePasswordResetClick = (vendor: Vendor) => {
        setSelectedVendorForReset(vendor);
        setShowResetModal(true);
        setNewPassword("");
    };

    const submitPasswordReset = async () => {
        if (!selectedVendorForReset) return;
        const tid = toast.loading("Resetting password...");
        try {
            const { adminResetPassword } = await import('../../services/api');
            // Assuming the Vendor ID matches the User ID for signed-up vendors
            await adminResetPassword(selectedVendorForReset.id, newPassword || '123456');
            toast.success("Password Reset Successfully!", { id: tid });
            setShowResetModal(false);
        } catch {
            toast.error("Failed to reset password. Is this a linked account?", { id: tid });
        }
    };

    return (
        <AdminLayout title="Partner Network">
            <div className={styles.pageContainer}>

                {/* Password Reset Modal */}
                {showResetModal && selectedVendorForReset && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 2000,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setShowResetModal(false)}>
                        <div style={{
                            background: '#1e293b', padding: '2rem', borderRadius: '1rem',
                            border: '1px solid #334155', minWidth: '350px'
                        }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Reset Password for {selectedVendorForReset.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                Enter a new secure password for this partner account.
                            </p>
                            <input
                                type="text"
                                placeholder="New Password (default: 123456)"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem', marginBottom: '1rem',
                                    borderRadius: '0.5rem', border: '1px solid #475569',
                                    background: '#0f172a', color: 'white'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowResetModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'transparent', color: '#cbd5e1', border: '1px solid #475569', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={submitPasswordReset} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reset Now</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={22} />
                    <input
                        type="text"
                        placeholder="Search partners by name or address..."
                        className={styles.searchBar}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className={styles.clearButton}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                {filteredVendors.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Store size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No Partners Found</h3>
                        <p>Try refining your search query or add a new vendor.</p>
                    </div>
                ) : (
                    <div className={styles.listLayout}>
                        {filteredVendors.map((vendor, idx) => (
                            <div key={vendor.id} className={styles.card} style={{ animationDelay: `${idx * 50}ms`, animationName: 'slideIn' }}>

                                {/* Info Block */}
                                <div className={styles.infoSection}>
                                    <div className={`${styles.iconBox} ${vendor.verified ? styles.verifiedIconBox : styles.pendingIconBox}`}>
                                        <Store size={28} strokeWidth={1.5} />
                                    </div>

                                    <div className={styles.details}>
                                        <div className={styles.nameRow}>
                                            <h3 className={styles.vendorName}>{vendor.name}</h3>

                                            {/* Badges */}
                                            {vendor.verified ? (
                                                <span className={`${styles.badge} ${styles.verifiedBadge}`}>
                                                    <ShieldCheck size={10} /> Verified
                                                </span>
                                            ) : (
                                                <span className={`${styles.badge} ${styles.pendingBadge}`}>
                                                    <AlertCircle size={10} /> Pending
                                                </span>
                                            )}

                                            {vendor.highlyRecommended && (
                                                <span className={`${styles.badge} ${styles.hotBadge}`}>
                                                    <Star size={10} fill="currentColor" /> Top Rated
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-start gap-1.5 text-slate-400">
                                            <MapPin size={14} className="mt-0.5 shrink-0" />
                                            <p className={styles.address}>{vendor.address || "No physical address listed"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Block */}
                                <div className={styles.actionSection}>
                                    <button
                                        onClick={() => toggleVerification(vendor)}
                                        className={`${styles.actionBtn} ${vendor.verified ? styles.btnRevoke : styles.btnVerify}`}
                                    >
                                        {vendor.verified ? 'Revoke Status' : 'Approve Partner'}
                                    </button>

                                    <button
                                        onClick={() => toggleRecommendation(vendor)}
                                        className={`${styles.actionBtn} ${vendor.highlyRecommended ? styles.btnStarActive : styles.btnStar}`}
                                        title={vendor.highlyRecommended ? "Remove from Top Rated" : "Mark as Top Rated"}
                                    >
                                        <Star size={16} fill={vendor.highlyRecommended ? "currentColor" : "none"} />
                                        {vendor.highlyRecommended && <span className="text-xs">Featured</span>}
                                    </button>

                                    {/* Generic Reset Password Button */}
                                    <button
                                        onClick={() => handlePasswordResetClick(vendor)}
                                        className={`${styles.actionBtn}`}
                                        style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}
                                        title="Reset Password"
                                    >
                                        <Lock size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(vendor.id)}
                                        className={`${styles.actionBtn} ${styles.btnDelete}`}
                                        title="Delete Account"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
