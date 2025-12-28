import { useState, useEffect } from 'react';
import styles from './SeedDashboard.module.css';
import { fetchSeedData, seedSinglePlant, deployAllPlants, fetchPlants, deletePlant } from '../../services/api';
import { Database, CloudUpload, Check, Rocket, ShieldCheck, Sprout, Search, Trash2 } from 'lucide-react';
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

    const handleDeployAll = async () => {
        if (!confirm("Are you sure you want to DEPLOY ALL plants to production?")) return;
        setLoading(true);
        try {
            await deployAllPlants();
            await loadData();
            toast.success("SYSTEM OVERHAUL COMPLETE: All plants deployed.");
        } catch (e) {
            toast.error("Mass deployment failed");
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
                    </div>

                    {isDeployed ? (
                        <button
                            className={styles.removeButton}
                            onClick={() => handleRemove(plant)}
                            disabled={isProcessing || loading}
                        >
                            <Trash2 size={14} /> REMOVE
                        </button>
                    ) : (
                        <button
                            className={styles.pushButton}
                            onClick={() => handlePush(plant)}
                            disabled={isProcessing || loading}
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
