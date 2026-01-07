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
    const [editValues, setEditValues] = useState<Record<string, { price: string, quantity: string, inStock: boolean, sellingMode: 'online' | 'offline' | 'both' }>>({});

    useEffect(() => {
        const loadPlants = async () => {
            try {
                const data = await fetchPlants();
                setPlants(data);

                // Initialize edit values from existing inventory
                const initialEdits: Record<string, { price: string, quantity: string, inStock: boolean, sellingMode: 'online' | 'offline' | 'both' }> = {};
                if (vendor.inventory) {
                    vendor.inventory.forEach(item => {
                        initialEdits[item.plantId] = {
                            price: item.price.toString(),
                            quantity: (item.quantity || 0).toString(),
                            inStock: item.inStock,
                            sellingMode: item.sellingMode || 'offline'
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

        // Restore state after forced refresh
        const restoreState = sessionStorage.getItem('vendor_restore');
        if (restoreState) {
            const { query, scroll } = JSON.parse(restoreState);
            setSearchQuery(query);
            setTimeout(() => {
                window.scrollTo(0, scroll);
                toast.success("Data verified & synched from server!", { icon: '🔐' });
            }, 500); // Small delay to allow rendering
            sessionStorage.removeItem('vendor_restore');
        }
        loadPlants();
    }, []);

    // Auto-refresh: Sync local state when vendor data updates (e.g. after save)
    useEffect(() => {
        if (vendor.inventory && plants.length > 0) {
            const serverState: Record<string, { price: string, quantity: string, inStock: boolean, sellingMode: 'online' | 'offline' | 'both' }> = {};
            vendor.inventory.forEach(item => {
                serverState[item.plantId] = {
                    price: item.price.toString(),
                    quantity: (item.quantity || 0).toString(),
                    inStock: item.inStock,
                    sellingMode: item.sellingMode || 'offline'
                };
            });
            // Merge with existing to keep unsaved input, but overwrite saved ones
            setEditValues(prev => ({ ...prev, ...serverState }));
        }
    }, [vendor, plants]);

    const handleFieldChange = (plantId: string, field: 'price' | 'quantity' | 'sellingMode', val: any) => {
        setEditValues(prev => ({
            ...prev,
            [plantId]: {
                ...prev[plantId],
                [field]: val,
                inStock: prev[plantId]?.inStock ?? true,
                sellingMode: prev[plantId]?.sellingMode ?? 'offline'
            }
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
        const newQty = parseInt(edits.quantity || '0');
        const newMode = edits.sellingMode || 'offline';

        if (isNaN(newPrice) || newPrice <= 0) {
            toast.error("Invalid price entered");
            return;
        }

        // Prepare new inventory array
        const currentInventory = vendor.inventory || [];
        const existingIndex = currentInventory.findIndex(i => i.plantId === plant.id);

        const newInventory = [...currentInventory];
        const newItem = {
            plantId: plant.id,
            price: newPrice,
            quantity: newQty,
            status: 'approved' as const,
            inStock: edits.inStock,
            sellingMode: newMode
        };

        if (existingIndex >= 0) {
            newInventory[existingIndex] = newItem;
        } else {
            newInventory.push(newItem);
        }

        const tid = toast.loading("Securely saving...");
        try {
            const success = await updateVendor(vendor.id, { inventory: newInventory });
            if (success) {
                onUpdate();
                // FORCE REFRESH LOGIC
                sessionStorage.setItem('vendor_restore', JSON.stringify({
                    query: searchQuery,
                    scroll: window.scrollY
                }));
                window.location.reload();
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

        const tid = toast.loading("Removing...");
        try {
            const success = await updateVendor(vendor.id, { inventory: newInventory });
            if (success) {
                onUpdate();
                sessionStorage.setItem('vendor_restore', JSON.stringify({
                    query: searchQuery,
                    scroll: window.scrollY
                }));
                window.location.reload();
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

    if (!vendor.verified) {
        return (
            <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '3rem', borderRadius: '1rem', border: '1px dashed rgba(234, 179, 8, 0.3)' }}>
                    <AlertCircle size={48} color="#facc15" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#facc15', marginBottom: '1rem' }}>Account Verification Pending</h2>
                    <p style={{ color: '#94a3b8', maxWidth: '400px', lineHeight: '1.6' }}>
                        Your partner account is currently being reviewed by our administration team.
                        <br /><br />
                        Pricing and inventory controls will be unlocked as soon as your profile is verified by an admin.
                    </p>
                </div>
            </div>
        );
    }

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
                        const editState = editValues[plant.id] || { price: '', quantity: '0', inStock: true, sellingMode: 'offline' };
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
                                                    placeholder="Price"
                                                    value={editState.price}
                                                    onChange={e => handleFieldChange(plant.id, 'price', e.target.value)}
                                                    className={styles.priceInput}
                                                />
                                            </div>
                                            <div className={styles.priceInputWrapper} style={{ width: '80px', marginLeft: '0.5rem' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b', paddingLeft: '8px' }}>Qty:</span>
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={editState.quantity}
                                                    onChange={e => handleFieldChange(plant.id, 'quantity', e.target.value)}
                                                    className={styles.priceInput}
                                                    style={{ paddingLeft: '4px' }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSaveItem(plant)}
                                                className={styles.saveBtn}
                                                title="Save Row"
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

                                        <div className={styles.modeRow}>
                                            <span className={styles.modeLabel}>Selling Via:</span>
                                            <select
                                                className={styles.modeSelect}
                                                value={editState.sellingMode}
                                                onChange={e => handleFieldChange(plant.id, 'sellingMode', e.target.value)}
                                            >
                                                <option value="offline">Storefront (Offline)</option>
                                                <option value="online">Home Delivery (Online)</option>
                                                <option value="both">Both (Online + Offline)</option>
                                            </select>
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
