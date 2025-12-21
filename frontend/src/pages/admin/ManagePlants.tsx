import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, X, Search, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminPageLayout } from './AdminPageLayout';
import { fetchPlants, deletePlant } from '../../services/api';
import type { Plant } from '../../types';
import styles from './ManagePlants.module.css';

export const ManagePlants = () => {
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

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
        navigate(`/admin/edit-plant/${plant.id}`);
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
                                <div className={styles.imageContainer}>
                                    <img src={plant.imageUrl} alt={plant.name} className={styles.image} loading="lazy" />
                                    <div className={styles.imageOverlay}></div>

                                    <div className={styles.actions}>
                                        <button onClick={() => handleEdit(plant)} className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit Plant">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(plant.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Plant">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

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
        </AdminPageLayout>
    );
};
