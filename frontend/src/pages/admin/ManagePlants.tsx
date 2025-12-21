import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, X, Image as ImageIcon, Save, Search, Leaf } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { fetchPlants, updatePlant, deletePlant } from '../../services/api';
import type { Plant } from '../../types';
import styles from './ManagePlants.module.css';

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

    // Helper for Badge Classes
    const getBadgeClass = (type: string) => {
        switch (type) {
            case 'indoor': return styles.badgeIndoor;
            case 'outdoor': return styles.badgeOutdoor;
            default: return styles.badgeOther;
        }
    };

    return (
        <AdminPageLayout title="Manage Flora Registry">
            <div className={styles.pageContainer}>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={22} />
                    <input
                        type="text"
                        placeholder="Search botanical collection..."
                        className={styles.searchBar}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className={styles.clearButton}>
                            <X size={18} />
                        </button>
                    )}

                    {/* Stats & Quick Selection List */}
                    <div className={styles.statsContainer}>
                        <span>Total Flora</span>
                        <span className={styles.countHighlight}>{allPlants.length} SPECIMENS</span>
                    </div>

                    {searchQuery && (
                        <div className={styles.quickList}>
                            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between border-b border-slate-700/50 mb-1">
                                <span>Quick Selection (A-Z)</span>
                                <span className="text-emerald-500">{filteredPlants.length} Matches</span>
                            </div>
                            {filteredPlants.length > 0 ? (
                                [...filteredPlants]
                                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                                    .map((plant) => (
                                        <div key={plant.id} className={styles.quickListItem}>
                                            <span>{plant.name}</span>
                                            <span className={styles.quickListItemIndex}>{plant.type}</span>
                                        </div>
                                    ))
                            ) : (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No plants align with your query
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Grid Content */}
                {filteredPlants.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <Leaf size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No specimens found</h3>
                        <p>Try refining your search query or add a new plant.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredPlants.map((plant, idx) => (
                            <div key={plant.id} className={styles.card} style={{ animationDelay: `${idx * 50}ms` }}>
                                {/* Image Area */}
                                <div className={styles.imageContainer}>
                                    <img src={plant.imageUrl} alt={plant.name} className={styles.image} loading="lazy" />
                                    <div className={styles.imageOverlay}></div>

                                    {/* Hover Actions */}
                                    <div className={styles.actions}>
                                        <button onClick={() => handleEdit(plant)} className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit Plant">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(plant.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Plant">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h3 className={styles.plantName} title={plant.name}>
                                            {plant.name}
                                        </h3>
                                        <p className={styles.scientificName}>{plant.scientificName}</p>
                                    </div>

                                    <div className={styles.footer}>
                                        <div>
                                            <span className={styles.priceLabel}>Price</span>
                                            <span className={styles.price}>₹{plant.price}</span>
                                        </div>
                                        <span className={`${styles.badge} ${getBadgeClass(plant.type || '')}`}>
                                            {plant.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal (Portal) */}
            {editingPlant && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setEditingPlant(null)}>
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit className="text-blue-400" size={20} /> Modify Specimen
                            </h3>
                            <button onClick={() => setEditingPlant(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleUpdatePlant} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Common Name</label>
                                        <input className={styles.glassInput} value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Scientific Name</label>
                                        <input className={`${styles.glassInput} italic`} value={editForm.scientificName || ''} onChange={e => setEditForm({ ...editForm, scientificName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Base Price (₹)</label>
                                        <input type="number" className={`${styles.glassInput} font-mono`} value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Visual Asset</label>
                                    <div className="border border-slate-700 rounded-xl overflow-hidden h-40 bg-slate-950 relative group shadow-inner">
                                        {editForm.imageUrl ? (
                                            <>
                                                <img src={editForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                                <button type="button" onClick={() => setEditForm({ ...editForm, imageUrl: '' })} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition backdrop-blur-sm"><X size={14} /></button>
                                            </>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-600 flex-col gap-2">
                                                <ImageIcon size={32} />
                                                <span className="text-xs">No Image Preview</span>
                                            </div>
                                        )}
                                    </div>
                                    <input className={`${styles.glassInput} text-xs`} placeholder="https://image-url.com..." value={editForm.imageUrl || ''} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-700/50 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setEditingPlant(null)}>Discard</Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 font-bold tracking-wide"><Save size={18} className="mr-2" /> Save Updates</Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminPageLayout>
    );
};
