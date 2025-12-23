import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Check, X, Star, AlertCircle } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchVendors, updateVendor, fetchPlants } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import type { Vendor, Plant } from '../../types';
import styles from './PriceApproval.module.css';

export const PriceApproval = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<{ vendor: Vendor, plant: Plant, inventoryIndex: number, item: any } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [vData, pData] = await Promise.all([fetchVendors(), fetchPlants()]);
            setVendors(vData);
            setPlants(pData);
        } catch (err) {
            console.error("Failed to load approval queues", err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // Helper to get pending items
    const getPendingItems = () => {
        const pending: { vendor: Vendor, plant: Plant, inventoryIndex: number, item: any }[] = [];
        vendors.forEach(v => {
            if (v.inventory) {
                v.inventory.forEach((item, idx) => {
                    const plant = plants.find(p => p.id === item.plantId);
                    // Filter logic: Only simplified logic for now. 
                    // Assuming all items can be managed here, but strictly we highlight 'pending'.
                    if (item.status === 'pending' && plant) {
                        pending.push({ vendor: v, plant, inventoryIndex: idx, item });
                    }
                });
            }
        });
        return pending;
    };

    const handleApproval = async (action: 'approve' | 'reject' | 'recommend') => {
        if (!selectedItem) return;
        const { vendor, inventoryIndex } = selectedItem;
        const newInventory = [...(vendor.inventory || [])];
        const item = newInventory[inventoryIndex];

        if (action === 'approve') {
            item.status = 'approved';
        } else if (action === 'reject') {
            // Remove item or set to rejected? Removing for now as per usual flow
            newInventory.splice(inventoryIndex, 1);
        } else if (action === 'recommend') {
            // Toggle recommended on the vendor card level OR inventory specific? 
            // The prompt says "highly recommended will be above the list", implying vendor-level or item-level.
            // Let's assume item-level logic ideally, but Vendor type has global highlyRecommended.
            // Let's make the VENDOR highly recommended for this plant? 
            // Given Types: Vendor has highlyRecommended. Let's toggle that for the VENDOR.
            // Or maybe just item approval. The prompt says "highly recommended" button.
            // For now, let's just make the item 'approved' and flag the vendor as highlyRecommended.
            item.status = 'approved';

            // Note: highlyRecommended is currently a top-level Vendor property
            // We'll update the vendor property.
            await updateVendor(vendor.id, { highlyRecommended: true });
        }

        try {
            await updateVendor(vendor.id, { inventory: newInventory });
            toast.success(`Action ${action} successful`);
            setSelectedItem(null);
            loadData(); // resync
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const pendingItems = getPendingItems();

    return (
        <AdminLayout title="Marketplace Approvals">
            <div className={styles.container}>
                {loading ? (
                    <div className="flex justify-center p-20 text-slate-500 animate-pulse">Scanning pending submissions...</div>
                ) : (
                    <>
                        {/* Pending Queue Grid */}
                        <div className={styles.queueHeader}>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <AlertCircle className="text-amber-500" /> Pending Approvals ({pendingItems.length})
                            </h2>
                        </div>

                        {pendingItems.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Check size={48} className="text-emerald-500 mb-4" />
                                <h3 className="text-xl text-white font-bold">All caught up!</h3>
                                <p className="text-slate-400">No pending price submissions from vendors.</p>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {pendingItems.map((entry) => (
                                    <div
                                        key={`${entry.vendor.id}-${entry.item.plantId}`}
                                        className={`${styles.card} ${styles.cardPending}`}
                                        onClick={() => setSelectedItem(entry)}
                                    >
                                        <div className={styles.cardHeader}>
                                            <span className={styles.vendorName}>{entry.vendor.name}</span>
                                            <span className={styles.dateBadge}>New</span>
                                        </div>
                                        <div className={styles.cardImage}>
                                            <img src={entry.plant.imageUrl} alt={entry.plant.name} />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h4 className={styles.plantName}>{entry.plant.name}</h4>
                                            <div className={styles.priceRow}>
                                                <span className="text-slate-400 text-xs">Proposed Price</span>
                                                <span className={styles.priceHighlight}>{formatCurrency(entry.item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detail Modal/Page */}
                        {selectedItem && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modal}>
                                    <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
                                        <X size={24} />
                                    </button>

                                    <div className={styles.modalContent}>
                                        <div className={styles.previewSection}>
                                            <img src={selectedItem.plant.imageUrl} alt="Plant" className={styles.previewImage} />
                                            <div className={styles.previewBadge}>{selectedItem.plant.type}</div>
                                        </div>

                                        <div className={styles.detailsSection}>
                                            <h2 className={styles.modalTitle}>{selectedItem.plant.name}</h2>
                                            <p className={styles.scientific}>{selectedItem.plant.scientificName}</p>

                                            <div className={styles.vendorInfoBox}>
                                                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Vendor Details</div>
                                                <div className="text-xl text-white font-bold mb-1">{selectedItem.vendor.name}</div>
                                                <div className="text-sm text-slate-400">{selectedItem.vendor.address}</div>
                                                <div className="text-sm text-emerald-400 flex items-center gap-1 mt-2">
                                                    <Check size={14} /> WhatsApp Verified: {selectedItem.vendor.whatsapp}
                                                </div>
                                            </div>

                                            <div className={styles.priceComparision}>
                                                <div className={styles.priceBlock}>
                                                    <span className="label">System Price</span>
                                                    <span className="value">{formatCurrency(selectedItem.plant.price)}</span>
                                                </div>
                                                <div className={`${styles.priceBlock} ${styles.proposed}`}>
                                                    <span className="label">Vendor Price</span>
                                                    <span className="value">{formatCurrency(selectedItem.item.price)}</span>
                                                </div>
                                            </div>

                                            <div className={styles.actionGrid}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnApprove}`}
                                                    onClick={() => handleApproval('approve')}
                                                >
                                                    <Check size={18} /> Approve Listing
                                                </button>

                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnRecommend}`}
                                                    onClick={() => handleApproval('recommend')}
                                                >
                                                    <Star size={18} fill="currentColor" /> Approve & Highly Recommend
                                                </button>

                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnReject}`}
                                                    onClick={() => handleApproval('reject')}
                                                >
                                                    <X size={18} /> Reject / Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};
