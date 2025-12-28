import { useState, useEffect } from 'react';
import styles from './SeedDashboard.module.css';
import { fetchSeedData, seedSinglePlant, deployAllPlants, fetchPlants, deletePlant, toggleSeedType, deleteSeedPlant } from '../../services/api';
import { Database, CloudUpload, Check, Rocket, ShieldCheck, Sprout, Search, Trash2, ArrowLeftRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const SeedDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [seedData, setSeedData] = useState<{ indoor: any[], outdoor: any[] }>({ indoor: [], outdoor: [] });
    // Map of Lowercase Scientific Name -> Live Database ID
    const [liveScientificMap, setLiveScientificMap] = useState<Map<string, string>>(new Map());
    const [deploying, setDeploying] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'all' | 'indoor' | 'outdoor'>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [seeds, livePlants] = await Promise.all([fetchSeedData(), fetchPlants()]);
            setSeedData(seeds);

            // Build Map: Scientific Name (lower) -> Mongo ID
            const newMap = new Map<string, string>();
            livePlants.forEach((p: any) => {
                if (p.scientificName) {
                    newMap.set(p.scientificName.toLowerCase().trim(), p.id);
                }
            });
            setLiveScientificMap(newMap);
        } catch (error) {
            toast.error("Failed to load databank");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePush = async (plant: any) => {
        // Validation: Check if scientific name exists
        const sciName = plant.scientificName?.toLowerCase().trim();
        if (sciName && liveScientificMap.has(sciName)) {
            toast.error(`Action Blocked: "${plant.scientificName}" already exists in the live database.`);
            return;
        }

        setDeploying(plant.id);
        try {
            // Ideally response contains the new plant ID, but if not we can reload or rely on name matching logic for next render if we re-fetch
            const res = await seedSinglePlant(plant.id);

            // If response has the new plant object, update map immediately
            if (res && res.id && sciName) {
                setLiveScientificMap(prev => new Map(prev).set(sciName, res.id));
                toast.success(`${plant.name} deployed to Live!`);
            } else {
                // Fallback: Reload all to get the new ID
                toast.success(`${plant.name} deployed! Syncing...`);
                await loadData();
            }
        } catch (error: any) {
            toast.error(error.message || "Deployment failed");
        } finally {
            setDeploying(null);
        }
    };

    const handleRemove = async (plant: any) => {
        const sciName = plant.scientificName?.toLowerCase().trim();
        const liveId = liveScientificMap.get(sciName);

        if (!liveId) {
            toast.error("Could not find live record ID for removal.");
            return;
        }

        if (!confirm(`Are you sure you want to REMOVE ${plant.name} from the live database?`)) return;

        try {
            await deletePlant(liveId);
            setLiveScientificMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(sciName);
                return newMap;
            });
            toast.success(`${plant.name} removed from Live Database.`);
        } catch (error: any) {
            toast.error(error.message || "Removal failed");
        }
    };

    const handleToggleType = async (plant: any) => {
        setLoading(true);
        try {
            const data = await toggleSeedType(plant.id);
            setSeedData({ indoor: data.indoor, outdoor: data.outdoor });
            toast.success(`Switched ${plant.name} to ${plant.type === 'indoor' ? 'Outdoor' : 'Indoor'}`);
        } catch (e: any) {
            toast.error(e.message || "Switch failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSeed = async (plant: any) => {
        if (!confirm(`Warning: This will permanently DELETE ${plant.name} from the Seed Bank file. This cannot be undone.`)) return;
        setLoading(true);
        try {
            const data = await deleteSeedPlant(plant.id);
            setSeedData({ indoor: data.indoor, outdoor: data.outdoor });
            toast.success(`${plant.name} erased from Seed Bank.`);
        } catch (e: any) {
            toast.error(e.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeployAll = async () => {
        const type = viewMode === 'all' ? undefined : viewMode;
        const typeLabel = viewMode === 'all' ? 'ALL' : viewMode.toUpperCase();

        if (!confirm(`Are you sure you want to DEPLOY ${typeLabel} new plants to production? Existing live plants will be preserved.`)) return;
        setLoading(true);
        try {
            const res = await deployAllPlants(type);
            await loadData();

            if (res.added > 0) {
                toast.success(`Deployment Success: ${res.added} New ${typeLabel} Plants Added. (${res.skipped} Skipped)`);
            } else {
                toast.success(`System Synced: All ${res.skipped} ${typeLabel} plants are already live.`);
            }
        } catch (e: any) {
            toast.error(e.message || "Mass deployment failed");
        } finally {
            setLoading(false);
        }
    };

    const filterPlants = (plants: any[]) => {
        return plants.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    if (loading) return <div className={styles.loading}>Loading Seed Bank...</div>;

    const filteredIndoor = filterPlants(seedData.indoor);
    const filteredOutdoor = filterPlants(seedData.outdoor);

    const renderCard = (plant: any) => {
        const sciName = plant.scientificName?.toLowerCase().trim();
        const isDeployed = sciName && liveScientificMap.has(sciName);

        return (
            <div key={plant.id} className={`${styles.card} ${isDeployed ? styles.isLive : ''}`}>
                <div className={styles.cardHeader}>
                    {isDeployed ? (
                        <div className={styles.statusLive}>
                            <Check size={14} /> Live
                        </div>
                    ) : (
                        <div className={styles.statusSeed}>
                            <Sprout size={14} /> Seed
                        </div>
                    )}
                    <div className={styles.actions}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => handleToggleType(plant)}
                            title="Switch Type (Indoor/Outdoor)"
                        >
                            <ArrowLeftRight size={14} />
                        </button>
                        <button
                            className={styles.iconBtn}
                            onClick={() => handleDeleteSeed(plant)}
                            title="Delete from File"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <div className={styles.cardContent}>
                    <img src={plant.imageUrl} alt={plant.name} className={styles.plantImage} />
                    <div>
                        <h3 className={styles.plantName}>{plant.name}</h3>
                        <p className={styles.scientificName}>{plant.scientificName}</p>

                        <div className={styles.stats}>
                            <span className={styles.stat}>{plant.type}</span>
                            <span className={styles.stat}>${plant.price}</span>
                        </div>

                        <div className={styles.verifiedSource} title={plant.verifiedSource}>
                            <ShieldCheck size={12} />
                            {plant.verifiedSource || "Gene Bank verified"}
                        </div>
                    </div>

                    <div className={styles.deployAction}>
                        {!isDeployed ? (
                            <button
                                className={styles.pushBtn}
                                onClick={() => handlePush(plant)}
                                disabled={deploying === plant.id}
                            >
                                {deploying === plant.id ? '...' : (
                                    <>
                                        <CloudUpload size={14} /> Push to Live
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemove(plant)}
                            >
                                <X size={14} /> Remove Live
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Database size={28} className={styles.headerIcon} />
                    <div>
                        <h1>Seed Data Bank</h1>
                        <p>Master Source File Control (v2.0 Verified)</p>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${viewMode === 'all' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('all')}
                        >
                            All Systems
                        </button>
                        <button
                            className={`${styles.tabBtn} ${viewMode === 'indoor' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('indoor')}
                        >
                            Indoor Specimen
                        </button>
                        <button
                            className={`${styles.tabBtn} ${viewMode === 'outdoor' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('outdoor')}
                        >
                            Outdoor Ecosystems
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchContainer}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search seed bank..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <button onClick={handleDeployAll} className={styles.deployAllBtn}>
                    <Rocket size={18} />
                    DEPLOY {viewMode === 'all' ? 'ALL SYSTEMS' : viewMode.toUpperCase()}
                </button>
            </div>

            <div className={styles.content}>
                {(viewMode === 'all' || viewMode === 'indoor') && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            Inside Sanctuary ({filteredIndoor.length})
                        </div>
                        <div className={styles.grid}>
                            {filteredIndoor.map(renderCard)}
                        </div>
                    </div>
                )}

                {(viewMode === 'all' || viewMode === 'outdoor') && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>
                            Outside World ({filteredOutdoor.length})
                        </div>
                        <div className={styles.grid}>
                            {filteredOutdoor.map(renderCard)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
