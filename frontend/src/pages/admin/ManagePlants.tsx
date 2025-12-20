import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, X, Image as ImageIcon, Save } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { fetchPlants, updatePlant, deletePlant } from '../../services/api';
import type { Plant } from '../../types';

export const ManagePlants = () => {
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [editForm, setEditForm] = useState<Partial<Plant>>({});

    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        const data = await fetchPlants();
        setAllPlants(data);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlants.map(plant => (
                    <div key={plant.id} className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden group hover:border-slate-500 transition-all shadow-lg hover:shadow-xl hover:bg-slate-800/60">
                        <div className="relative h-48 bg-slate-900 group">
                            <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <button onClick={() => handleEdit(plant)} className="p-2 bg-slate-900/80 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white backdrop-blur-sm shadow-lg transition-all"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(plant.id)} className="p-2 bg-slate-900/80 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white backdrop-blur-sm shadow-lg transition-all"><Trash2 size={16} /></button>
                            </div>

                            <div className="absolute bottom-2 left-4 right-4">
                                <h3 className="font-bold text-white text-lg truncate shadow-black drop-shadow-md">{plant.name}</h3>
                                <p className="text-emerald-300 text-xs italic truncate shadow-black drop-shadow-sm">{plant.scientificName}</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between bg-slate-800/50">
                            <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded">₹{plant.price}</span>
                            <span className="capitalize px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs border border-slate-600/50">{plant.type}</span>
                        </div>
                    </div>
                ))}
            </div>

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
