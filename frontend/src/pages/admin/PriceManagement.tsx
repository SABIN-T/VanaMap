import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { fetchPlants, fetchVendors, updateVendor } from '../../services/api';
import type { Plant, Vendor } from '../../types';
import { Search, Edit2, Trash2, Save, X, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './PriceManagement.module.css';

export const PriceManagement = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Editing State
    const [editingItem, setEditingItem] = useState<{ vendorId: string, plantId: string, price: number } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pData, vData] = await Promise.all([fetchPlants(), fetchVendors()]);
            setPlants(pData);
            setVendors(vData);
        } catch (err) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Vendor Price Management">
                <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="pre-loader-pulse" />
                </div>
            </AdminLayout>
        );
    }

    // Flatten Inventory
    const allPrices = vendors.flatMap(v => {
        const items = v.inventory || [];
        return items.map(item => {
            const plant = plants.find(p => p.id === item.plantId);
            return {
                uniqueKey: `${v.id}-${item.plantId}`,
                vendor: v,
                plantId: item.plantId,
                plantName: plant ? plant.name : 'Unknown Plant',
                plantImage: plant?.imageUrl,
                price: item.price,
                inStock: item.inStock
            };
        });
    });

    const filteredItems = allPrices.filter(item =>
        item.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        if (!editingItem) return;

        const vendor = vendors.find(v => v.id === editingItem.vendorId);
        if (!vendor) return;

        const updatedInventory = (vendor.inventory || []).map(i => {
            if (i.plantId === editingItem.plantId) {
                return { ...i, price: Number(editingItem.price) };
            }
            return i;
        });

        const tid = toast.loading("Updating price...");
        try {
            await updateVendor(vendor.id, { inventory: updatedInventory });
            toast.success("Price updated", { id: tid });
            setEditingItem(null);
            loadData(); // Refresh to ensure sync
        } catch (err) {
            toast.error("Failed to update", { id: tid });
        }
    };

    const handleRemove = async (vendorId: string, plantId: string) => {
        if (!confirm("Are you sure you want to remove this price listing?")) return;

        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        const updatedInventory = (vendor.inventory || []).filter(i => i.plantId !== plantId);

        const tid = toast.loading("Removing listing...");
        try {
            await updateVendor(vendor.id, { inventory: updatedInventory });
            toast.success("Listing removed", { id: tid });
            loadData();
        } catch (err) {
            toast.error("Failed to remove", { id: tid });
        }
    };

    // Calculate Stats
    const totalListings = filteredItems.length;
    const activeVendors = new Set(filteredItems.map(i => i.vendor.id)).size;
    const avgPrice = totalListings > 0
        ? Math.round(filteredItems.reduce((acc, curr) => acc + curr.price, 0) / totalListings)
        : 0;

    return (
        <AdminLayout title="Capital Control">
            <div className={styles.container}>

                {/* Header & Stats */}
                <div className={styles.headerGroup}>
                    <div>
                        <h1 className={styles.title}>Price Management</h1>
                        <p className={styles.subtitle}>Monitor and regulate market rates across the vendor network.</p>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}><Store size={48} /></div>
                        <div className={styles.statValue}>{activeVendors}</div>
                        <div className={styles.statLabel}>Active Vendors</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}><Edit2 size={48} /></div>
                        <div className={styles.statValue}>{totalListings}</div>
                        <div className={styles.statLabel}>Price Listings</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}><Save size={48} /></div>
                        <div className={styles.statValue}>₹{avgPrice}</div>
                        <div className={styles.statLabel}>Avg. Market Rate</div>
                    </div>
                </div>

                {/* Controls */}
                <div className={styles.controlsBar}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by vendor, plant, or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Vendor / Shop</th>
                                <th>Plant Details</th>
                                <th>Market Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => (
                                <tr key={item.uniqueKey}>
                                    <td>
                                        <div className={styles.vendorCell}>
                                            <div className={styles.vendorAvatar}>
                                                {item.vendor.name.charAt(0)}
                                            </div>
                                            <div className={styles.vendorInfo}>
                                                <h4>{item.vendor.name}</h4>
                                                <p>{item.vendor.address || 'Online Vendor'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.plantCell}>
                                            <img
                                                src={item.plantImage || 'https://via.placeholder.com/48'}
                                                className={styles.plantImg}
                                                alt=""
                                            />
                                            <span className={styles.plantName}>{item.plantName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {editingItem?.vendorId === item.vendor.id && editingItem?.plantId === item.plantId ? (
                                            <div className={styles.editWrapper}>
                                                <span className={styles.currency}>₹</span>
                                                <input
                                                    type="number"
                                                    value={editingItem.price}
                                                    onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                                    className={styles.editInput}
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <div className={styles.priceDisplay}>
                                                ₹ {item.price}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            {editingItem?.vendorId === item.vendor.id && editingItem?.plantId === item.plantId ? (
                                                <>
                                                    <button
                                                        onClick={handleSave}
                                                        className={`${styles.iconBtn} ${styles.btnSave}`}
                                                        title="Save Changes"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingItem(null)}
                                                        className={`${styles.iconBtn} ${styles.btnCancel}`}
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setEditingItem({ vendorId: item.vendor.id, plantId: item.plantId, price: item.price })}
                                                        className={`${styles.iconBtn} ${styles.btnEdit}`}
                                                        title="Edit Price"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(item.vendor.id, item.plantId)}
                                                        className={`${styles.iconBtn} ${styles.btnDelete}`}
                                                        title="Remove Listing"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className={styles.emptyState}>
                                        <Store size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                        <p>No price listings found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};
