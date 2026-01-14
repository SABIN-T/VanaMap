
import { useState, useEffect } from 'react';
import { Search, Save, AlertCircle, CheckCircle, Package, DollarSign, Trash2, RefreshCw, Upload, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchPlants, updateVendor } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import type { Vendor, Plant } from '../../../types';
import styles from './VendorInventory.module.css';
import { EditPlantModal } from './EditPlantModal';

interface VendorInventoryProps {
    vendor: Vendor;
    onUpdate: () => void; // Callback to refresh parent data
}

export const VendorInventory = ({ vendor, onUpdate }: VendorInventoryProps) => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPlant, setEditingPlant] = useState<{ plant: Plant, item: any } | null>(null);
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
            const success = await updateVendor(vendor.id, { inventory: newInventory }, true);
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
            const success = await updateVendor(vendor.id, { inventory: newInventory }, true);
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

    const handleVerifyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        const tid = toast.loading("Uploading verification proof...");

        try {
            const savedUser = localStorage.getItem('user');
            const token = savedUser ? JSON.parse(savedUser).token : null;

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                await updateVendor(vendor.id, { shopImage: data.imageUrl }, true);
                toast.success("Uploaded! Please wait for approval.", { id: tid });
                onUpdate();
                setTimeout(() => window.location.reload(), 1000);
            } else throw new Error(data.error);
        } catch (err: any) {
            toast.error(err.message || "Upload failed", { id: tid });
        }
    };

    const handleSavePlant = async (updates: any) => {
        if (!editingPlant) return;

        const currentInventory = vendor.inventory || [];
        const updatedInventory = currentInventory.map(item => {
            if (item.plantId === editingPlant.plant.id) {
                return { ...item, ...updates };
            }
            return item;
        });

        const tid = toast.loading("Saving changes...");
        try {
            await updateVendor(vendor.id, { inventory: updatedInventory }, true);
            toast.success("Saved!", { id: tid });
            onUpdate();
            setEditingPlant(null);
        } catch {
            toast.error("Failed to save", { id: tid });
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
                <div style={{ marginTop: '2rem', width: '100%', maxWidth: '450px', background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed rgba(239, 68, 68, 0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>
                        <h3 style={{ color: '#f87171', fontWeight: 700, margin: 0 }}>Action Required: Shop Verification</h3>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                        To activate your shop immediately, please upload a photo of your storefront, signboard, or ID.
                    </p>

                    <label className={styles.primaryButton} style={{
                        background: '#ef4444', width: '100%', justifyContent: 'center', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', fontWeight: 600
                    }} >
                        <Upload size={18} />
                        <span>Upload Verification Photo</span>
                        <input type="file" hidden accept="image/*" onChange={handleVerifyUpload} />
                    </label>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('vanamap_api_cache');
                        window.location.reload();
                    }}
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <RefreshCw size={14} /> Refresh Status
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Shop Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '1rem', border: '1px solid #334155' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <img
                        src={vendor.shopImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.name)}&background=random`}
                        alt="Shop Logo"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                    />
                    <label style={{
                        position: 'absolute', bottom: -4, right: -4,
                        background: '#3b82f6', borderRadius: '50%', padding: '6px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '2px solid #1e293b'
                    }} title="Update Shop Logo">
                        <Upload size={14} color="white" />
                        <input type="file" hidden accept="image/*" onChange={handleVerifyUpload} />
                    </label>
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{vendor.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> VERIFIED
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>• {vendor.district || vendor.state || 'Location not set'}</span>
                    </div>
                </div>
            </div>

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
                        const displayImage = (invItem?.customImages && invItem.customImages.length > 0) ? invItem.customImages[0] : plant.imageUrl;

                        return (
                            <div key={plant.id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img src={displayImage} className={styles.image} alt={plant.name} style={{ objectFit: 'cover' }} />
                                    {invItem && (
                                        <div className={`${styles.statusBadge} ${isPending ? styles.statusPending : styles.statusLive} `}>
                                            {isPending ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                                            {isPending ? 'Pending' : 'Live'}
                                        </div>
                                    )}
                                    {invItem && (
                                        <button
                                            onClick={() => setEditingPlant({ plant, item: invItem })}
                                            style={{
                                                position: 'absolute', bottom: '8px', right: '8px',
                                                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                                                borderRadius: '50%', width: '32px', height: '32px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                                color: 'white'
                                            }}
                                            title="Edit Photos & Details"
                                        >
                                            <Edit2 size={16} />
                                        </button>
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

            {editingPlant && (
                <EditPlantModal
                    plant={editingPlant.plant}
                    inventoryItem={editingPlant.item}
                    onSave={handleSavePlant}
                    onClose={() => setEditingPlant(null)}
                />
            )}
        </div>
    );
};
