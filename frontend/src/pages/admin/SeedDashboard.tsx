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
        if (!confirm("Are you sure you want to DEPLOY ALL new plants to production? Existing live plants will be preserved.")) return;
        setLoading(true);
        try {
            const res = await deployAllPlants();
            await loadData();

            if (res.added > 0) {
                toast.success(`Deployment Success: ${res.added} New Plants Added. (${res.skipped} Skipped)`);
            } else {
                toast.success(`System Synced: All ${res.skipped} plants are already live.`);
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
            p.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const renderCard = (plant: any) => {
        const sciName = plant.scientificName?.toLowerCase().trim();
        const isDeployed = sciName && liveScientificMap.has(sciName);
        const isProcessing = deploying === plant.id;

        return (
            <div key={plant.id} className={`${styles.card} ${isDeployed ? styles.isLive : ''}`}>
                {isDeployed && (
                    <div className={styles.deployedBadge}>
                        <Check size={12} /> LIVE
                    </div>
                )}
                <img src={plant.imageUrl} alt={plant.name} className={styles.cardImage} loading="lazy" />

                <div className={styles.cardContent}>
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

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                            className={styles.iconButton}
                            onClick={() => handleToggleType(plant)}
                            title="Switch Indoor/Outdoor"
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#f3f4f6', border: 'none', cursor: 'pointer' }}
                        >
                            <ArrowLeftRight size={16} color="#4b5563" />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={() => handleDeleteSeed(plant)}
                            title="Delete from Seed Bank"
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#fee2e2', border: 'none', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </button>
                    </div>

                    {isDeployed ? (
                        <button
                            className={styles.removeButton}
                            onClick={() => handleRemove(plant)}
                            disabled={isProcessing || loading}
                            style={{ marginTop: '8px', width: '100%' }}
                        >
                            <X size={14} /> REMOVE LIVE
                        </button>
                    ) : (
                        <button
                            className={styles.pushButton}
                            onClick={() => handlePush(plant)}
                            disabled={isProcessing || loading}
                            style={{ marginTop: '8px', width: '100%' }}
                        >
                            {isProcessing ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <><Rocket size={14} /> PUSH TO LIVE</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const filteredIndoor = filterPlants(seedData.indoor);
    const filteredOutdoor = filterPlants(seedData.outdoor);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h1>Biology Databank</h1>
                    <p><Database size={16} /> Secure Seed Vault v9.0</p>
                </div>
                <button className={styles.deployAllBtn} onClick={handleDeployAll} disabled={loading}>
                    <CloudUpload size={20} />
                    DEPLOY ALL SYSTEMS
                </button>
            </div>

            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by name, species or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <ShieldCheck size={24} className="text-emerald-400" />
                    Indoor Specimens
                    <span className={styles.sectionBadge}>{filteredIndoor.length} Available</span>
                </div>
                <div className={styles.grid}>
                    {filteredIndoor.map(renderCard)}
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <Sprout size={24} className="text-amber-400" />
                    Outdoor Ecosystems
                    <span className={styles.sectionBadge}>{filteredOutdoor.length} Available</span>
                </div>
                <div className={styles.grid}>
                    {filteredOutdoor.map(renderCard)}
                </div>
            </div>
        </div>
    );
};
