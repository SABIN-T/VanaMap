import { useState, useEffect } from 'react';
import styles from './SeedDashboard.module.css';
import { fetchSeedData, seedSinglePlant, deployAllPlants, fetchPlants } from '../../services/api';
import { Database, CloudUpload, Check, Rocket, ShieldCheck, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

export const SeedDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [seedData, setSeedData] = useState<{ indoor: any[], outdoor: any[] }>({ indoor: [], outdoor: [] });
    const [deployedIds, setDeployedIds] = useState<Set<string>>(new Set());
    const [deploying, setDeploying] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [seeds, livePlants] = await Promise.all([fetchSeedData(), fetchPlants()]);
            setSeedData(seeds);
            setDeployedIds(new Set(livePlants.map((p: any) => p.id)));
        } catch (error) {
            toast.error("Failed to load databank");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePush = async (plant: any) => {
        setDeploying(plant.id);
        try {
            await seedSinglePlant(plant.id);
            setDeployedIds(prev => new Set(prev).add(plant.id));
            toast.success(`${plant.name} deployed to VanaMap Live!`);
        } catch (error) {
            toast.error("Deployment failed");
        } finally {
            setDeploying(null);
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

    const renderCard = (plant: any) => {
        const isDeployed = deployedIds.has(plant.id);
        const isProcessing = deploying === plant.id;

        return (
            <div key={plant.id} className={styles.card}>
                {isDeployed && (
                    <div className={styles.deployedBadge}>
                        <Check size={10} /> LIVE
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

                    <button
                        className={styles.pushButton}
                        onClick={() => handlePush(plant)}
                        disabled={isDeployed || isProcessing || loading}
                    >
                        {isProcessing ? (
                            <span className="animate-spin">⌛</span>
                        ) : isDeployed ? (
                            <>SYNCED</>
                        ) : (
                            <><Rocket size={14} /> PUSH TO LIVE</>
                        )}
                    </button>
                </div>
            </div>
        );
    };

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

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <ShieldCheck size={24} className="text-emerald-400" />
                    Indoor Specimens
                    <span className={styles.sectionBadge}>{seedData.indoor.length} Units</span>
                </div>
                <div className={styles.grid}>
                    {seedData.indoor.map(renderCard)}
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <Sprout size={24} className="text-amber-400" />
                    Outdoor Ecosystems
                    <span className={styles.sectionBadge}>{seedData.outdoor.length} Units</span>
                </div>
                <div className={styles.grid}>
                    {seedData.outdoor.map(renderCard)}
                </div>
            </div>
        </div>
    );
};
