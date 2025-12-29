import { useState, useEffect } from 'react';
import type { Plant, Vendor } from '../types';
import { fetchPlants, fetchVendors, logSearch } from '../services/api';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react';
import { PlantVendorsModal } from '../components/features/market/PlantVendorsModal';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Shops.module.css';

export const Shops = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [isSlow, setIsSlow] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        const slowTimer = setTimeout(() => setIsSlow(true), 3000);

        try {
            const [plantsData, vendorsData] = await Promise.all([
                fetchPlants(),
                fetchVendors()
            ]);

            if (plantsData.length === 0) {
                // Potential silent fail or empty DB
                console.warn("No plants fetched from server");
            }

            setPlants(plantsData);
            setVendors(vendorsData.filter(v => v.verified));

            // Check for auto-open request from navigation
            if (location.state && (location.state as any).openPlantId) {
                const targetId = (location.state as any).openPlantId;
                const found = plantsData.find(p => p.id === targetId);
                if (found) {
                    setSelectedPlant(found);
                    window.history.replaceState({}, document.title);
                }
            }
        } catch (err) {
            console.error("Failed to load shop items", err);
            setError("The market systems are currently offline. Please try again in a moment.");
        } finally {
            clearTimeout(slowTimer);
            setLoading(false);
            setIsSlow(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Log search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) return;
        const timer = setTimeout(() => {
            logSearch(searchQuery);
        }, 1500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredPlants = plants.filter(p => {
        const matchesCategory = activeCategory === 'all' ? true : p.type === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) ||
            (p.scientificName?.toLowerCase().includes(q) ?? false);

        const { inStock } = getStockStatus(p);
        const matchesStock = stockFilter === 'all' ? true : (stockFilter === 'inStock' ? inStock : !inStock);

        return matchesCategory && matchesSearch && matchesStock;
    });

    const getStockStatus = (plant: Plant) => {
        const selling = vendors.filter(v => v.inventory?.some(i => i.plantId === plant.id && i.inStock));
        let count = 0;
        selling.forEach(v => {
            const item = v.inventory?.find(i => i.plantId === plant.id);
            const qty = (item as any).quantity;
            count += (typeof qty === 'number' ? qty : 1);
        });
        return { inStock: count > 0, count };
    };

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

                {/* Stock Filters */}
                <div className={styles.stockFilterContainer}>
                    <button
                        className={`${styles.stockBtn} ${stockFilter === 'inStock' ? styles.activeIn : ''}`}
                        onClick={() => setStockFilter(stockFilter === 'inStock' ? 'all' : 'inStock')}
                    >
                        {stockFilter === 'inStock' ? '✓ ' : ''}In Stock
                    </button>
                    <button
                        className={`${styles.stockBtn} ${stockFilter === 'outOfStock' ? styles.activeOut : ''}`}
                        onClick={() => setStockFilter(stockFilter === 'outOfStock' ? 'all' : 'outOfStock')}
                    >
                        {stockFilter === 'outOfStock' ? '✕ ' : ''}Out of Stock
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div className="pre-loader-pulse"></div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Syncing Market Data...</div>
                    {isSlow && <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Our servers are waking up, thank you for your patience.</p>}
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#ef4444' }}>
                    <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>{error}</p>
                    <button
                        onClick={() => loadData()}
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 2rem' }}
                    >
                        Retry Connection
                    </button>
                </div>
            ) : filteredPlants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#94a3b8' }}>
                    <Search size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No species matching your criteria.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Try adjusting your search or filters.</p>
                    {plants.length === 0 && (
                        <button
                            onClick={() => loadData()}
                            className="btn btn-outline"
                            style={{ marginTop: '2rem', padding: '0.8rem 2rem' }}
                        >
                            Force Reload
                        </button>
                    )}
                </div>
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

                                {(() => {
                                    const { inStock, count } = getStockStatus(plant);
                                    return (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '54px',
                                            left: '12px',
                                            zIndex: 10,
                                            background: inStock ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            letterSpacing: '0.5px',
                                            backdropFilter: 'blur(4px)',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}>
                                            {inStock ? (
                                                <>
                                                    <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }}></span>
                                                    IN STOCK ({count})
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={10} /> OUT OF STOCK
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}

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

            {/* Vendor CTA Section */}
            <div className={styles.vendorCTA}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                    <ShoppingBag size={32} color="#facc15" />
                </div>
                <h2 className={styles.vendorCTATitle}>Own a Plant Shop?</h2>
                <p className={styles.vendorCTADesc}>
                    Join our verified network of nurseries and start connecting with thousands of plant lovers in your area.
                </p>
                <button
                    onClick={() => navigate('/auth?role=vendor&view=signup')}
                    style={{
                        padding: '1.25rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '1.25rem',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(250, 204, 21, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(250, 204, 21, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(250, 204, 21, 0.3)';
                    }}
                >
                    REGISTER AS VENDOR
                </button>
            </div>

            {selectedPlant && (
                <PlantVendorsModal
                    plant={selectedPlant}
                    onClose={() => setSelectedPlant(null)}
                />
            )}
        </div>
    );
};
