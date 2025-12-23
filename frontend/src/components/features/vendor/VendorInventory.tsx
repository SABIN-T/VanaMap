import { useState, useEffect } from 'react';
import { Search, Save, AlertCircle, CheckCircle, Package, DollarSign, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchPlants, updateVendor } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import type { Plant, Vendor } from '../../../types';
import styles from './VendorInventory.module.css';

interface VendorInventoryProps {
    vendor: Vendor;
    onUpdate: () => void; // Callback to refresh parent data
}

export const VendorInventory = ({ vendor, onUpdate }: VendorInventoryProps) => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editValues, setEditValues] = useState<Record<string, { price: string, inStock: boolean }>>({});

    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);

            // Initialize edit values from existing inventory
            const initialEdits: Record<string, { price: string, inStock: boolean }> = {};
            if (vendor.inventory) {
                vendor.inventory.forEach(item => {
                    initialEdits[item.plantId] = {
                        price: item.price.toString(),
                        inStock: item.inStock
                    };
                });
            }
            setEditValues(initialEdits);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load plant catalog");
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (plantId: string, val: string) => {
        setEditValues(prev => ({
            ...prev,
            [plantId]: { ...prev[plantId], price: val, inStock: prev[plantId]?.inStock ?? true }
        }));
    };

    const toggleStock = (plantId: string) => {
        setEditValues(prev => ({
            ...prev,
            [plantId]: { ...prev[plantId], inStock: !prev[plantId]?.inStock }
        }));
    };

    const handleSaveItem = async (plant: Plant) => {
        const edits = editValues[plant.id];
        if (!edits || !edits.price) {
            toast.error("Please set a valid price");
            return;
        }

        const newPrice = parseFloat(edits.price);
        if (isNaN(newPrice) || newPrice <= 0) {
            toast.error("Invalid price entered");
            return;
        }

        // Prepare new inventory array
        const currentInventory = vendor.inventory || [];
        const existingIndex = currentInventory.findIndex(i => i.plantId === plant.id);

        let newInventory = [...currentInventory];
        const newItem = {
            plantId: plant.id,
            price: newPrice,
            status: 'approved' as const,
            inStock: edits.inStock
        };

        if (existingIndex >= 0) {
            newInventory[existingIndex] = newItem;
        } else {
            newInventory.push(newItem);
        }

        const tid = toast.loading("Updating inventory...");
        try {
            const success = await updateVendor(vendor.id, { inventory: newInventory });
            if (success) {
                toast.success("Inventory updated successfully!", { id: tid });
                onUpdate(); // Refresh parent to get latest backend state
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            toast.error("Failed to update inventory", { id: tid });
        }
    };

    const handleRemoveItem = async (plantId: string) => {
        if (!confirm("Remove this plant from your inventory?")) return;

        const currentInventory = vendor.inventory || [];
        const newInventory = currentInventory.filter(i => i.plantId !== plantId);

        const tid = toast.loading("Removing from inventory...");
        try {
            const success = await updateVendor(vendor.id, { inventory: newInventory });
            if (success) {
                toast.success("Removed successfully", { id: tid });

                // Clear local edit state for this item
                setEditValues(prev => {
                    const next = { ...prev };
                    if (next[plantId]) {
                        // Reset to empty/default if we want, or just delete the key
                        next[plantId] = { price: '', inStock: true };
                    }
                    return next;
                });
                onUpdate();
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            toast.error("Failed to remove item", { id: tid });
        }
    };


    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInventoryItem = (plantId: string) => {
        return vendor.inventory?.find(i => i.plantId === plantId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h2 className={styles.title}>
                        <Package className="text-emerald-400" /> Inventory & Pricing
                    </h2>
                    <p className={styles.subtitle}>
                        Manage your catalog and pricing.
                    </p>
                </div>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search species..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse">Loading catalog...</div>
            ) : (
                <div className={styles.grid}>
                    {filteredPlants.map(plant => {
                        const invItem = getInventoryItem(plant.id);
                        const editState = editValues[plant.id] || { price: '', inStock: true };
                        const isPending = invItem?.status === 'pending';

                        return (
                            <div key={plant.id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img src={plant.imageUrl} className={styles.image} alt={plant.name} />
                                    {invItem && (
                                        <div className={`${styles.statusBadge} ${isPending ? styles.statusPending : styles.statusLive}`}>
                                            {isPending ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                                            {isPending ? 'Pending' : 'Live'}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.plantName}>{plant.name}</h3>
                                    <p className={styles.scientificName}>{plant.scientificName}</p>

                                    <div className={styles.controls}>
                                        <div className={styles.guidelineRow}>
                                            <span>Market Guideline:</span>
                                            <span className={styles.guidelineValue}>{formatCurrency(plant.price)}</span>
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <div className={styles.priceInputWrapper}>
                                                <DollarSign size={14} className={styles.currencySymbol} />
                                                <input
                                                    type="number"
                                                    placeholder="Your Price"
                                                    value={editState.price}
                                                    onChange={e => handlePriceChange(plant.id, e.target.value)}
                                                    className={styles.priceInput}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSaveItem(plant)}
                                                className={styles.saveBtn}
                                                title="Save Price"
                                            >
                                                <Save size={18} />
                                            </button>
                                            {invItem && (
                                                <button
                                                    onClick={() => handleRemoveItem(plant.id)}
                                                    className={styles.deleteBtn}
                                                    title="Remove from Inventory"
                                                    style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>

                                        {invItem && (
                                            <div className={styles.stockToggle}>
                                                <label className={styles.switch}>
                                                    <input
                                                        type="checkbox"
                                                        checked={editState.inStock}
                                                        onChange={() => toggleStock(plant.id)}
                                                    />
                                                    <span className={styles.slider}></span>
                                                </label>
                                                <span className={styles.stockLabel}>
                                                    {editState.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
