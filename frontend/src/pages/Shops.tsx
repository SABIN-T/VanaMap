import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Plant, Vendor, KidsProduct } from '../types';
import { fetchPlants, fetchVendors, logSearch, fetchKidsProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react';
import { PlantVendorsModal } from '../components/features/market/PlantVendorsModal';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Shops.module.css';
import { plantCache, apiCache } from '../utils/universalCache'; // 🚀 Performance boost!
import { Helmet } from 'react-helmet-async';

interface ShopItemCardProps {
    item: Plant | KidsProduct;
    isKids: boolean;
    vendors: Vendor[];
    setSelectedPlant: (plant: Plant) => void;
    getStockStatus: (item: Plant | KidsProduct) => { inStock: boolean; count: number };
    getPriceInfo: (item: Plant | KidsProduct) => { display: string; value?: number; hasVendors: boolean; count: number };
}

const ShopItemCard = ({
    item,
    isKids,
    vendors,
    setSelectedPlant,
    getStockStatus,
    getPriceInfo
}: ShopItemCardProps) => {
    const kidItem = item as KidsProduct;
    const itemImages = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : []);
    const [currIndex, setCurrIndex] = useState(0);

    return (
        <div className={styles.card} onClick={() => !isKids && setSelectedPlant(item as Plant)}>
            {/* Image Area */}
            <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                    {itemImages.map((imgUrl, idx) => (
                        <img
                            key={idx}
                            src={(() => {
                                if (!imgUrl) return '';
                                if (imgUrl.includes('cloudinary.com') && !imgUrl.includes('f_auto')) {
                                    return imgUrl.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
                                }
                                return imgUrl;
                            })()}
                            alt={`${item.name} - ${idx}`}
                            className={`${styles.image} ${idx === currIndex ? styles.imageActive : styles.imageInactive}`}
                            loading="lazy"
                        />
                    ))}
                </div>

                {itemImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            className={styles.navArrowLeft}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrIndex((prev) => (prev === 0 ? itemImages.length - 1 : prev - 1));
                            }}
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            className={styles.navArrowRight}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrIndex((prev) => (prev === itemImages.length - 1 ? 0 : prev + 1));
                            }}
                        >
                            ›
                        </button>
                        <div className={styles.dotsContainer}>
                            {itemImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`${styles.dot} ${idx === currIndex ? styles.dotActive : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrIndex(idx);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {(() => {
                    const { inStock, count } = getStockStatus(item);
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
                    {isKids ? kidItem.category : (item as Plant).type}
                </div>
            </div>

            {/* Content Area */}
            <div className={styles.content}>
                <div style={{ marginBottom: 'auto' }}>
                    <h3 className={styles.title}>{item.name}</h3>
                    <p className={styles.scientific}>
                        {isKids ? `Age: ${kidItem.ageRange || 'All Ages'}` : (item as Plant).scientificName}
                    </p>

                    <div className={styles.tags}>
                        {isKids ? (
                            <>
                                <span className={styles.tag}>👦 Kid Friendly</span>
                                {kidItem.tags && kidItem.tags.slice(0, 2).map(t => (
                                    <span key={t} className={styles.tag}>{t}</span>
                                ))}
                            </>
                        ) : (
                            <>
                                <span className={styles.tag}>Air Purifying</span>
                                {(() => {
                                    const selling = vendors.filter(v => v.inventory?.some(i => i.plantId === item.id && i.inStock));
                                    const hasOnline = selling.some(v => v.inventory?.find(i => i.plantId === item.id)?.sellingMode !== 'offline');
                                    const hasOffline = selling.some(v => v.inventory?.find(i => i.plantId === item.id)?.sellingMode !== 'online');

                                    return (
                                        <>
                                            {hasOnline && <span className={styles.deliveryTag} title="Available for Home Delivery">🚚 Delivery</span>}
                                            {hasOffline && <span className={styles.storefrontTag} title="Available for Store Pickup">🏪 In-Store</span>}
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </div>

                {/* Price and Action */}
                <div className={styles.footer}>
                    <div className={styles.price}>
                        {(() => {
                            const info = getPriceInfo(item);
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
                    <button 
                        className={styles.btn}
                        onClick={(e) => {
                            if (isKids) {
                                e.stopPropagation();
                                import('react-hot-toast').then(({ default: toast }) => {
                                    toast.success(`🎉 Added ${item.name} to cart!`, { icon: '🛒' });
                                });
                            }
                        }}
                    >
                        {isKids ? 'Add to Cart' : 'View Options'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Shops = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [kidsProducts, setKidsProducts] = useState<KidsProduct[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
    const [audience, setAudience] = useState<'adult' | 'children'>('adult');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [isSlow, setIsSlow] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        const slowTimer = setTimeout(() => setIsSlow(true), 3000);

        try {
            // 🚀 CACHE CHECK - Try cache first
            const cachedPlants = plantCache.get('/api/plants', {});
            const cachedVendors = apiCache.get('/api/vendors', {});

            if (cachedPlants && cachedVendors) {
                // Cache HIT - Instant load!
                console.log('[Cache] ✅ Shops loaded from cache - instant!');
                setPlants(cachedPlants);
                setVendors(cachedVendors.filter((v: Vendor) => v.verified));
                
                // Fetch kids products in background
                fetchKidsProducts().then(setKidsProducts).catch(console.error);

                setLoading(false);
                setIsSlow(false);
                clearTimeout(slowTimer);

                // Check for auto-open request
                if (location.state && (location.state as any).openPlantId) {
                    const targetId = (location.state as any).openPlantId;
                    const found = cachedPlants.find((p: Plant) => p.id === targetId);
                    if (found) {
                        setSelectedPlant(found);
                        window.history.replaceState({}, document.title);
                    }
                }

                import('react-hot-toast').then(({ default: toast }) => {
                    toast.success('⚡ Loaded from cache!', {
                        duration: 1500,
                        icon: '🏪'
                    });
                });

                return;
            }

            // Cache MISS - Use PROGRESSIVE LOADING
            console.log('[Cache] ❌ Cache miss - using progressive loading for shops...');

            // 🚀 STEP 1: Fast initial load (12 plants, optimized)
            const { fetchPlantsLight } = await import('../services/api');
            const lightPlants = await fetchPlantsLight();

            if (lightPlants.length > 0) {
                console.log('[Progressive] ⚡ Showing first 12 products instantly!');
                setPlants(lightPlants);
                setLoading(false); // Show UI immediately!
                setIsSlow(false);
                clearTimeout(slowTimer);
            }

            // 🚀 STEP 2: Load full data in background
            const [plantsData, vendorsData, kidsProductsData] = await Promise.all([
                fetchPlants(),
                fetchVendors(),
                fetchKidsProducts()
            ]);

            // Store in cache for next time
            plantCache.set('/api/plants', plantsData, {});
            apiCache.set('/api/vendors', vendorsData, {});
            console.log('[Cache] 💾 Shops data cached for future use');

            setPlants(plantsData);
            setVendors(vendorsData.filter(v => v.verified));
            setKidsProducts(kidsProductsData);

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

        // Quest Check: Green Shopper (Action: shop)
        const activeQuest = sessionStorage.getItem('active_quest');
        if (activeQuest) {
            const quest = JSON.parse(activeQuest);
            if (quest.action === 'shop') {
                import('../services/api').then(({ addPoints }) => {
                    addPoints(quest.points).then(() => {
                        import('react-hot-toast').then(({ default: toast }) => {
                            toast.success(`Quest Complete: ${quest.title}! +${quest.points} CP`, { icon: '🏆', duration: 5000 });
                        });
                        sessionStorage.removeItem('active_quest'); // Clear quest
                    }).catch(console.error);
                });
            }
        }
    }, []);

    // Log search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) return;
        const timer = setTimeout(() => {
            const locationData = user ? {
                city: user.city,
                state: user.state,
                country: user.country
            } : undefined;
            logSearch(searchQuery, undefined, locationData);
        }, 1500);
        return () => clearTimeout(timer);
    }, [searchQuery, user]);

    const getStockStatus = useCallback((item: Plant | KidsProduct) => {
        if (audience === 'children') {
            const kidProd = item as KidsProduct;
            return { inStock: kidProd.inStock, count: kidProd.stockQuantity || 0 };
        }
        const selling = vendors.filter(v => v.inventory?.some(i => i.plantId === item.id && i.inStock));
        let count = 0;
        selling.forEach(v => {
            const invItem = v.inventory?.find(i => i.plantId === item.id);
            const qty = (invItem as any).quantity;
            count += (typeof qty === 'number' ? qty : 1);
        });
        return { inStock: count > 0, count };
    }, [vendors, audience]);

    const getPriceInfo = (item: Plant | KidsProduct) => {
        if (audience === 'children') {
            return {
                display: `Rs. ${item.price}`,
                value: item.price,
                hasVendors: false,
                count: 0
            };
        }
        
        // Collect all potential prices for plants
        const potentialPrices: number[] = [];

        vendors.forEach(v => {
            const invItem = v.inventory?.find(i => i.plantId === item.id && i.inStock);
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
        const base = (item as Plant).price || (((item as Plant).name.charCodeAt(0) % 5 + 1) * 150);
        return {
            display: `Approx Rs. ${base}`,
            value: base,
            hasVendors: false,
            count: 0
        };
    };

    const filteredItems = useMemo(() => {
        if (audience === 'children') {
            return kidsProducts.filter(p => {
                let matchesCategory = true;
                if (activeCategory === 'indoor') {
                    // "Fun Kits": toy, accessory, craft
                    matchesCategory = ['toy', 'accessory', 'craft'].includes(p.category);
                } else if (activeCategory === 'outdoor') {
                    // "Growing Sets": kit, seeds, educational
                    matchesCategory = ['kit', 'seeds', 'educational'].includes(p.category);
                }

                const q = searchQuery.toLowerCase();
                const matchesSearch = p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    (p.description?.toLowerCase().includes(q) ?? false);

                const matchesStock = stockFilter === 'all' 
                    ? true 
                    : (stockFilter === 'inStock' ? p.inStock : !p.inStock);

                return matchesCategory && matchesSearch && matchesStock;
            });
        }

        return plants.filter(p => {
            // Audience filter: show products matching selected audience or tagged as 'both'
            const plantAudience = p.audience || 'both';
            const matchesAudience = plantAudience === 'both' || plantAudience === audience;

            const matchesCategory = activeCategory === 'all' ? true : p.type === activeCategory;
            const q = searchQuery.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(q) ||
                (p.scientificName?.toLowerCase().includes(q) ?? false);

            const { inStock } = getStockStatus(p);
            const matchesStock = stockFilter === 'all' ? true : (stockFilter === 'inStock' ? inStock : !inStock);

            return matchesAudience && matchesCategory && matchesSearch && matchesStock;
        });
    }, [plants, kidsProducts, audience, activeCategory, searchQuery, stockFilter, getStockStatus]);

    return (
        <div className={styles.shopContainer}>
            <Helmet>
                <title>VanaMap Plant Market - Buy Verified Plants Online</title>
                <meta name="description" content="Shop verified, healthy plants from local nurseries delivered to your door. Filter by indoor, outdoor, air-purifying, and pet-friendly options." />
                <link rel="canonical" href="https://www.vanamap.online/shops" />
            </Helmet>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.badgeMain}>
                    <ShoppingBag size={16} /> OFFICIAL MARKET
                </div>
                <h1 className={styles.titleMain}>VANAMAP<br />MARKET</h1>
                <p className={styles.subtitleMain}>
                    {audience === 'children'
                        ? 'Fun gardening kits & toys for young explorers.'
                        : 'Curated specimens for your premium home ecosystem.'}
                </p>

                {/* Audience Toggle */}
                <div className={styles.audienceToggle} id="audience-toggle">
                    <button
                        className={audience === 'children' ? styles.audienceActive : ''}
                        onClick={() => { setAudience('children'); setActiveCategory('all'); }}
                    >
                        <span className={styles.audienceEmoji}>🌱</span> Children
                    </button>
                    <button
                        className={audience === 'adult' ? styles.audienceActive : ''}
                        onClick={() => { setAudience('adult'); setActiveCategory('all'); }}
                    >
                        <span className={styles.audienceEmoji}>🌿</span> Adult
                    </button>
                    <div className={`${styles.audienceSlider} ${audience === 'children' ? styles.sliderLeft : styles.sliderRight}`} />
                </div>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={audience === 'children' ? 'Search kits & toys...' : 'Search species...'}
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
                        <div className={styles.filterIcon}>{audience === 'children' ? '🎨' : '🏠'}</div>
                        <div className={styles.filterInfo}>
                            <span className={styles.filterName}>{audience === 'children' ? 'Fun Kits' : 'Indoor'}</span>
                            <span className={styles.filterDesc}>{audience === 'children' ? 'Garden playsets & kits' : 'Interior Species'}</span>
                        </div>
                    </div>

                    <div
                        className={`${styles.filterCard} ${activeCategory === 'outdoor' ? styles.active : ''}`}
                        onClick={() => setActiveCategory(activeCategory === 'outdoor' ? 'all' : 'outdoor')}
                    >
                        <div className={styles.filterIcon}>{audience === 'children' ? '🌱' : '🌲'}</div>
                        <div className={styles.filterInfo}>
                            <span className={styles.filterName}>{audience === 'children' ? 'Growing Sets' : 'Outdoor'}</span>
                            <span className={styles.filterDesc}>{audience === 'children' ? 'Watch it grow!' : 'Natural Resilience'}</span>
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
            ) : filteredItems.length === 0 ? (
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
                    {filteredItems.map(item => (
                        <ShopItemCard
                            key={item.id}
                            item={item}
                            isKids={audience === 'children'}
                            vendors={vendors}
                            setSelectedPlant={setSelectedPlant}
                            getStockStatus={getStockStatus}
                            getPriceInfo={getPriceInfo}
                        />
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
