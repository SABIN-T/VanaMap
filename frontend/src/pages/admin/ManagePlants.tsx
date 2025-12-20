import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, X, Image as ImageIcon, Save, Search } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { fetchPlants, updatePlant, deletePlant } from '../../services/api';
import type { Plant } from '../../types';

export const ManagePlants = () => {
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [editForm, setEditForm] = useState<Partial<Plant>>({});

    useEffect(() => {
        loadPlants();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPlants(allPlants);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredPlants(allPlants.filter(p =>
                p.name?.toLowerCase().includes(query) ||
                p.scientificName?.toLowerCase().includes(query) ||
                p.type?.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, allPlants]);

    const loadPlants = async () => {
        const data = await fetchPlants();
        setAllPlants(data);
        setFilteredPlants(data);
    };

    const handleEdit = (plant: Plant) => {
        setEditingPlant(plant);
        setEditForm({ ...plant });
    };

    const handleUpdatePlant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlant) return;
        const tid = toast.loading("Updating Plant...");
        try {
            await updatePlant(editingPlant.id, editForm);
            toast.success("Plant Updated", { id: tid });
            setEditingPlant(null);
            loadPlants();
        } catch (err) {
            toast.error("Update failed", { id: tid });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Permanently delete this plant?")) return;
        const tid = toast.loading("Deleting...");
        try {
            await deletePlant(id);
            toast.success("Plant Deleted", { id: tid });
            loadPlants();
        } catch (err) {
            toast.error("Deletion failed", { id: tid });
        }
    };

    return (
        <AdminPageLayout title="Manage Flora Registry">
            {/* Search Bar */}
            <div className="mb-8 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-slate-500" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search plants by name, scientific name, or type..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pl-12 pr-6 text-white text-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg placeholder:text-slate-600 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {filteredPlants.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={40} className="opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No plants found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {filteredPlants.map((plant, idx) => (
                        <div key={plant.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-1" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="relative h-56 bg-slate-900 group overflow-hidden">
                                <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80"></div>

                                <div className="absolute top-3 right-3 flex gap-2 translate-x-12 opactiy-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button onClick={() => handleEdit(plant)} className="p-2.5 bg-slate-900/90 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white backdrop-blur-md shadow-lg transition-all hover:scale-105"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(plant.id)} className="p-2.5 bg-slate-900/90 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white backdrop-blur-md shadow-lg transition-all hover:scale-105"><Trash2 size={16} /></button>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 group-hover:translate-y-[-4px] transition-transform duration-300">
                                    <h3 className="font-bold text-white text-xl truncate shadow-black drop-shadow-md leading-tight">{plant.name}</h3>
                                    <p className="text-emerald-400 text-xs font-medium italic truncate mt-0.5">{plant.scientificName}</p>
                                </div>
                            </div>

                            <div className="p-5 flex items-center justify-between bg-slate-800/50 border-t border-slate-700/50">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Price</span>
                                    <span className="text-emerald-400 font-mono font-bold text-lg">₹{plant.price}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${plant.type === 'indoor' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : plant.type === 'outdoor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}`}>
                                    {plant.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal - Rendered via Portal */}
            {editingPlant && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setEditingPlant(null)}>
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit className="text-blue-400" size={20} /> Edit Plant
                            </h3>
                            <button onClick={() => setEditingPlant(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleUpdatePlant} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Name</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Scientific Name</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white italic" value={editForm.scientificName || ''} onChange={e => setEditForm({ ...editForm, scientificName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Price (₹)</label>
                                        <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono" value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Image Preview</label>
                                    <div className="border border-slate-700 rounded-xl overflow-hidden h-40 bg-slate-950 relative group">
                                        {editForm.imageUrl ? (
                                            <>
                                                <img src={editForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                                <button type="button" onClick={() => setEditForm({ ...editForm, imageUrl: '' })} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition"><X size={14} /></button>
                                            </>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-600"><ImageIcon size={32} /></div>
                                        )}
                                    </div>
                                    <input className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-xs" placeholder="Image URL..." value={editForm.imageUrl || ''} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setEditingPlant(null)}>Cancel</Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8"><Save size={18} className="mr-2" /> Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminPageLayout>
    );
};
