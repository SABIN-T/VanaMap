import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Store, Star, Trash2, ShieldCheck, AlertCircle, MapPin, Search, X } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchVendors, updateVendor, deleteVendor } from '../../services/api';
import type { Vendor } from '../../types';
import styles from './ManageVendors.module.css';

export const ManageVendors = () => {
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        } catch (e) { toast.error("Status Update Failed", { id: tid }); }
    };

    const toggleRecommendation = async (v: Vendor) => {
        const newStatus = !v.highlyRecommended;
        try {
            await updateVendor(v.id, { highlyRecommended: newStatus });
            if (newStatus) toast.success("Marked as Top Partner!", { icon: '🌟' });
            loadVendors();
        } catch (e) { toast.error("Promotion Failed"); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Permanently delete this partner account?")) return;
        const tid = toast.loading("Removing Partner...");
        try {
            await deleteVendor(id);
            toast.success("Partner Removed", { id: tid });
            loadVendors();
        } catch (e) { toast.error("Deletion failed", { id: tid }); }
    };

    return (
        <AdminLayout title="Partner Network">
            <div className={styles.pageContainer}>

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
