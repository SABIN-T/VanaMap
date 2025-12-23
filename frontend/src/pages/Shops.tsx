import { useState, useEffect } from 'react';
import type { Plant, Vendor } from '../types';
import { fetchPlants, fetchVendors } from '../services/api';
import { Search, ShoppingBag } from 'lucide-react';
import { PlantVendorsModal } from '../components/features/market/PlantVendorsModal';
import styles from './Shops.module.css';

export const Shops = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [plantsData, vendorsData] = await Promise.all([
                    fetchPlants(),
                    fetchVendors()
                ]);
                setPlants(plantsData);
                setVendors(vendorsData);
            } catch (error) {
                console.error("Failed to load shop items", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredPlants = plants.filter(p => {
        const matchesCategory = activeCategory === 'all' ? true : p.type === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getPriceInfo = (plant: Plant) => {
        // Collect all potential prices
        const potentialPrices: number[] = [];

        vendors.forEach(v => {
            const invItem = v.inventory?.find(i => i.plantId === plant.id && i.inStock);
            if (invItem) {
                potentialPrices.push(invItem.price);
            }
        });

        if (potentialPrices.length > 0) {
            const minPrice = Math.min(...potentialPrices);
            return {
                display: `From Rs. ${minPrice}`,
                value: minPrice,
                hasVendors: true,
                count: potentialPrices.length
            };
        }

        // Fallback to base price
        const base = plant.price || ((plant.name.charCodeAt(0) % 5 + 1) * 150);
        return {
            display: `Approx Rs. ${base}`,
            value: base,
            hasVendors: false,
            count: 0
        };
    };

    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    return (
        <div className={styles.shopContainer}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.badgeMain}>
                    <ShoppingBag size={16} /> OFFICIAL MARKET
                </div>
                <h1 className={styles.titleMain}>VANAMAP<br />MARKET</h1>
                <p className={styles.subtitleMain}>Curated specimens for your premium home ecosystem.</p>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search species..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* New Premium Filter Section */}
                <div className={styles.filterContainer}>
                    <div
                        className={`${styles.filterCard} ${activeCategory === 'indoor' ? styles.active : ''}`}
                        onClick={() => setActiveCategory(activeCategory === 'indoor' ? 'all' : 'indoor')}
                    >
                        <div className={styles.filterIcon}>🏠</div>
                        <div className={styles.filterInfo}>
                            <span className={styles.filterName}>Indoor</span>
                            <span className={styles.filterDesc}>Interior Species</span>
                        </div>
                    </div>

                    <div
                        className={`${styles.filterCard} ${activeCategory === 'outdoor' ? styles.active : ''}`}
                        onClick={() => setActiveCategory(activeCategory === 'outdoor' ? 'all' : 'outdoor')}
                    >
                        <div className={styles.filterIcon}>🌲</div>
                        <div className={styles.filterInfo}>
                            <span className={styles.filterName}>Outdoor</span>
                            <span className={styles.filterDesc}>Natural Resilience</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Shop...</div>
            ) : (
                <div className={styles.grid}>
                    {filteredPlants.map(plant => (
                        <div key={plant.id} className={styles.card} onClick={() => setSelectedPlant(plant)}>
                            {/* Image Area */}
                            <div className={styles.imageContainer}>
                                <img
                                    src={plant.imageUrl}
                                    alt={plant.name}
                                    className={styles.image}
                                    loading="lazy"
                                />
                                <div className={styles.badge}>
                                    {plant.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className={styles.content}>
                                <div style={{ marginBottom: 'auto' }}>
                                    <h3 className={styles.title}>{plant.name}</h3>
                                    <p className={styles.scientific}>{plant.scientificName}</p>

                                    <div className={styles.tags}>
                                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                            Air Purifying
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className={styles.footer}>
                                    <div className={styles.price}>
                                        {(() => {
                                            const info = getPriceInfo(plant);
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{info.display}</span>
                                                    {info.hasVendors && (
                                                        <span style={{ fontSize: '0.7rem', color: '#10b981' }}>
                                                            {info.count} local seller{info.count !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <button className={styles.btn}>
                                        View Options
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPlant && (
                <PlantVendorsModal
                    plant={selectedPlant}
                    onClose={() => setSelectedPlant(null)}
                />
            )}
        </div>
    );
};
