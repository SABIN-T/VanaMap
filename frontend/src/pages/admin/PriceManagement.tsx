import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { fetchPlants, fetchVendors, updateVendor } from '../../services/api';
import type { Plant, Vendor } from '../../types';
import { Search, Edit2, Trash2, Save, X, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ManagePlants.module.css'; // Reusing similar styles

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

    return (
        <AdminLayout title="Vendor Price Management">
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={20} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search vendor or plant..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Vendor / Shop</th>
                            <th>Plant Details</th>
                            <th>Current Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.uniqueKey}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400">
                                            <Store size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{item.vendor.name}</div>
                                            <div className="text-xs text-slate-400">{item.vendor.address}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        {item.plantImage && (
                                            <img src={item.plantImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                        )}
                                        <span className="text-slate-200 font-medium">{item.plantName}</span>
                                    </div>
                                </td>
                                <td>
                                    {editingItem?.vendorId === item.vendor.id && editingItem?.plantId === item.plantId ? ( // Corrected check
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-500">Rs.</span>
                                            <input
                                                type="number"
                                                value={editingItem.price}
                                                onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                                className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white w-24"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-emerald-400 font-mono font-bold">Rs. {item.price}</span>
                                    )}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {editingItem?.vendorId === item.vendor.id && editingItem?.plantId === item.plantId ? (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30"
                                                    title="Save"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingItem(null)}
                                                    className="p-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                                                    title="Cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setEditingItem({ vendorId: item.vendor.id, plantId: item.plantId, price: item.price })}
                                                    className="p-2 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30"
                                                    title="Edit Price"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(item.vendor.id, item.plantId)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                                    title="Remove Listing"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    No price listings found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};
