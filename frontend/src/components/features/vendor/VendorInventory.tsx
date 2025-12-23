import { useState, useEffect } from 'react';
import { Search, Save, AlertCircle, CheckCircle, Package, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchPlants, updateVendor } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import type { Plant, Vendor } from '../../../types';

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
            status: 'pending' as const, // Always 'pending' on update/create
            inStock: edits.inStock
        };

        if (existingIndex >= 0) {
            newInventory[existingIndex] = newItem;
        } else {
            newInventory.push(newItem);
        }

        // Optimistic UI update? No, let's wait for API
        const tid = toast.loading("Submitting for price approval...");
        try {
            const success = await updateVendor(vendor.id, { inventory: newInventory });
            if (success) {
                toast.success("Submitted! Info pending admin review.", { id: tid });
                onUpdate(); // Refresh parent to get latest backend state
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            toast.error("Failed to update inventory", { id: tid });
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
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="text-emerald-400" /> Inventory & Pricing
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage your catalog. Price changes require Admin approval.
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search species..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-slate-800 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse">Loading catalog...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlants.map(plant => {
                        const invItem = getInventoryItem(plant.id);
                        const editState = editValues[plant.id] || { price: '', inStock: true };
                        const isPending = invItem?.status === 'pending';

                        return (
                            <div key={plant.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all">
                                <div className="h-32 overflow-hidden relative">
                                    <img src={plant.imageUrl} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt={plant.name} />
                                    {invItem && (
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isPending ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                            {isPending ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                                            {isPending ? 'Pending' : 'Live'}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-white text-lg truncate">{plant.name}</h3>
                                    <p className="text-slate-400 text-xs italic mb-4">{plant.scientificName}</p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm text-slate-400 bg-slate-700/30 p-2 rounded-lg">
                                            <span>Market Guideline:</span>
                                            <span className="text-slate-200 font-mono">{formatCurrency(plant.price)}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="number"
                                                    placeholder="Your Price"
                                                    value={editState.price}
                                                    onChange={e => handlePriceChange(plant.id, e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSaveItem(plant)}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors"
                                                title="Save Price"
                                            >
                                                <Save size={18} />
                                            </button>
                                        </div>

                                        {invItem && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    id={`stock-${plant.id}`}
                                                    checked={editState.inStock}
                                                    onChange={() => toggleStock(plant.id)}
                                                    className="rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                                />
                                                <label htmlFor={`stock-${plant.id}`} className="text-sm text-slate-300 cursor-pointer select-none">
                                                    In Stock
                                                </label>
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
