import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, MapPin, Thermometer, Wind, ArrowDown, Sparkles, Search, AlertCircle, Heart, Sun, Activity, GraduationCap, ShoppingBag, PlusCircle, MoveRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
// Lazy load modal for performance
const PlantDetailsModal = lazy(() => import('../components/features/plants/PlantDetailsModal').then(module => ({ default: module.PlantDetailsModal })));
import { PlantSkeleton } from '../components/features/plants/PlantSkeleton';
import styles from './Home.module.css';

export const Home = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [lightFilter, setLightFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [weather, setWeather] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [plantsLoading, setPlantsLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);
    const [isSlowLoading, setIsSlowLoading] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [citySearch, setCitySearch] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(() => window.innerWidth < 768 ? 4 : 10);

    const plantsSectionRef = useRef<HTMLDivElement>(null);
    const filterSectionRef = useRef<HTMLDivElement>(null);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = () => {
            setSelectedPlant(null);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        const cachedPlants = localStorage.getItem('vanamap_plants_cache');
        if (cachedPlants) {
            try {
                const parsed = JSON.parse(cachedPlants);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPlants(parsed);
                    setPlantsLoading(false);
                    setIsFromCache(true);
                }
            } catch (e) {
                console.error("Cache corrupted");
            }
        }

        const loadFreshData = async () => {
            const timer = setTimeout(() => {
                if (plantsLoading) setIsSlowLoading(true);
            }, 3500);

            try {
                const data = await fetchPlants();
                if (data.length === 0) {
                    const { PLANTS } = await import('../data/mocks');
                    await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                    const newData = await fetchPlants();
                    setPlants(newData);
                    localStorage.setItem('vanamap_plants_cache', JSON.stringify(newData));
                } else {
                    if (!isFromCache || JSON.stringify(data) !== localStorage.getItem('vanamap_plants_cache')) {
                        setPlants(data);
                        localStorage.setItem('vanamap_plants_cache', JSON.stringify(data));
                    }
                }
                setIsFromCache(false);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setPlantsLoading(false);
                setIsSlowLoading(false);
                clearTimeout(timer);
            }
        };

        loadFreshData();
    }, []);

    const scrollToPlants = () => {
        setTimeout(() => {
            plantsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    const scrollToFilters = () => {
        setTimeout(() => {
            filterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (citySearch.length > 2 && !weather && showSuggestions) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(citySearch)}&limit=5`);
                    const data = await response.json();
                    setSuggestions(data);
                } catch (e) {
                    console.error("Suggestion fetch failed", e);
                }
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [citySearch, weather, showSuggestions]);

    const handleCitySearch = async (overrideCity?: string) => {
        const query = overrideCity || citySearch;
        if (!query) return;
        setLocationLoading(true);
        const result = await geocodeCity(query);
        if (result) {
            const weatherData = await getWeather(result.lat, result.lng);
            if (weatherData) {
                const cityName = query.split(',')[0].trim();
                const cleanName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
                setWeather({ ...weatherData, locationName: cleanName });
                toast.success(`Synced location: ${cleanName}`);
                scrollToFilters();
                setSuggestions([]);
            } else {
                toast.error("Data unavailable.");
            }
        } else {
            toast.error("City not found.");
        }
        setLocationLoading(false);
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            const toastId = toast.loading("Finding your location...");
            const options = { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 };
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await getWeather(latitude, longitude);
                    if (weatherData) {
                        setWeather({ ...weatherData, locationName: "Detected Location" });
                        toast.success("Location set!", { id: toastId });
                        scrollToFilters();
                    } else {
                        toast.error("Sync failed.", { id: toastId });
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Network error.", { id: toastId });
                } finally {
                    setLocationLoading(false);
                }
            }, (err) => {
                console.error(err);
                setLocationLoading(false);
                toast.error("GPS access denied.", { id: toastId });
            }, options);
        } else {
            toast.error("GPS not supported.");
            setLocationLoading(false);
        }
    };

    const handleAddToCart = (plant: Plant) => {
        addToCart(plant);
    };

    const openDetails = (plant: Plant) => {
        window.history.pushState({ modal: 'plantDetails' }, document.title);
        setSelectedPlant(plant);
    };

    const getPollutionStatus = (aqi: number = 0) => {
        if (aqi <= 20) return { label: 'Excellent', color: '#10b981', desc: 'Fresh Air' };
        if (aqi <= 50) return { label: 'Good', color: '#facc15', desc: 'Air is Okay' };
        if (aqi <= 100) return { label: 'Moderate', color: '#fb923c', desc: 'Not very Clean' };
        return { label: 'High Pollution', color: '#f87171', desc: 'You need plants!' };
    };

    const displayedPlants = useMemo(() => {
        const processed = [...plants]
            .filter(p => {
                const matchesType = filter === 'all' ? true : p.type === filter;
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesLight = lightFilter === 'all' ? true : (() => {
                    const s = p.sunlight.toLowerCase();
                    if (lightFilter === 'low') return s.includes('low') || s.includes('shade') || s.includes('shadow');
                    if (lightFilter === 'medium') return s.includes('indirect') || s.includes('partial') || s.includes('medium');
                    if (lightFilter === 'high') return s.includes('full') || s.includes('high') || s.includes('direct') || s.includes('bright');
                    return false;
                })();
                return matchesType && matchesSearch && matchesLight;
            })
            .map(p => {
                if (!weather) return { ...p, score: 0 };
                return { ...p, score: calculateAptness(p, weather.avgTemp30Days, weather.air_quality?.aqi, weather.avgHumidity30Days) };
            })
            .sort((a, b) => (weather ? b.score - a.score : 0));

        if (weather && processed.length > 0) {
            const topScore = processed[0].score;
            if (topScore > 0) {
                processed.forEach(p => {
                    p.score = Math.round((p.score / topScore) * 100);
                });
            }
        }
        return processed;
    }, [plants, filter, searchQuery, lightFilter, weather]);

    return (
        <div className={styles.homeContainer}>
            {selectedPlant && (
                <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(10px)' }}>Starting Simulation...</div>}>
                    <PlantDetailsModal
                        plant={selectedPlant}
                        weather={weather}
                        onClose={() => window.history.back()}
                    />
                </Suspense>
            )}

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <Sparkles size={16} /> Home Ecosystem Intelligence
                    </div>

                    <div className={styles.heroMainStack}>
                        <h1 className={styles.heroTitle}>BRING NATURE<br />HOME</h1>
                        <p className={styles.heroSubtitle}>
                            Transform your living space into a high-performance sanctuary.
                            <strong> Start by detecting your location</strong> to see what grows best in your ecosystem.
                        </p>
                    </div>

                    {!weather ? (
                        <div id="location-action-area" className={styles.heroActionArea}>
                            <div className={styles.actionContainer}>
                                <Button
                                    variant="primary"
                                    onClick={handleGetLocation}
                                    className={styles.gpsBtn}
                                    disabled={locationLoading}
                                >
                                    <MapPin size={22} className={locationLoading ? "animate-spin" : "animate-bounce"} style={{ marginRight: '12px' }} />
                                    {locationLoading ? "DETERMINING CLIMATE..." : "Auto-Detect Local Climate"}
                                </Button>

                                <div className={styles.divider}>
                                    <span>OR SEARCH MANUALLY</span>
                                </div>

                                <div className={styles.searchBox}>
                                    <Search size={22} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Enter your city..."
                                        value={citySearch}
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                                        className={styles.searchInput}
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <ul className={styles.suggestionsList}>
                                            {suggestions.map((place: any, i) => (
                                                <li key={i} className={styles.suggestionItem} onClick={() => {
                                                    const cityName = place.display_name.split(',')[0];
                                                    setCitySearch(cityName);
                                                    setShowSuggestions(false);
                                                    handleCitySearch(cityName);
                                                }}>
                                                    <MapPin size={16} style={{ marginRight: '12px', color: '#10b981' }} />
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.display_name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <Button variant="ghost" size="sm" onClick={() => navigate('/nearby')} style={{ color: '#64748b', marginTop: '1rem' }}>
                                    <Sprout size={16} style={{ marginRight: '8px' }} /> Find Nearby Shop Instead
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.weatherDashboard}>
                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                    <MapPin size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>LOCATION</span>
                                    <div className={styles.statValue} style={{ fontSize: '1.1rem' }}>
                                        {weather.locationName || weather.city || 'Local Zone'}
                                    </div>
                                    <button onClick={() => setWeather(null)} className={styles.changeLocationBtn}>
                                        Change Location
                                    </button>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15' }}>
                                    <Thermometer size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>AVG TEMPERATURE</span>
                                    <div className={styles.statValue}>
                                        {weather.avgTemp30Days.toFixed(1)}°C
                                    </div>
                                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>30-Day Mean</span>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <div className={`${styles.statIcon}`} style={{
                                    background: `${getPollutionStatus(weather.air_quality?.aqi).color}15`,
                                    color: getPollutionStatus(weather.air_quality?.aqi).color
                                }}>
                                    <Activity size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>AIR QUALITY (AQI)</span>
                                    <div className={styles.statValue}>
                                        {weather.air_quality?.aqi || 'N/A'}
                                    </div>
                                    <span style={{ color: getPollutionStatus(weather.air_quality?.aqi).color, fontSize: '0.7rem', fontWeight: 800 }}>
                                        {getPollutionStatus(weather.air_quality?.aqi).label.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className={styles.intelligenceSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>CORE CAPABILITIES</span>
                    <h2 className={styles.sectionTitle}>Built for Deep Biological Insights</h2>
                    <p className={styles.sectionSubtitle}>VanaMap bridges the gap between atmospheric science and interior design.</p>
                </div>
                <div className={styles.onboardingGrid} style={{ marginTop: '4rem' }}>
                    <div className={styles.capabilityCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
                            <Sparkles size={32} />
                        </div>
                        <h3>Smart Match</h3>
                        <p>Precision scoring system based on local thermo-regulatory data from multiple sensors.</p>
                    </div>
                    <div className={styles.capabilityCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                            <Wind size={32} />
                        </div>
                        <h3>Oxygen Analytics</h3>
                        <p>Calculate O2 output per specimen for optimized sanctuary respiration and sleep quality.</p>
                    </div>
                    <div className={styles.capabilityCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                            <Sprout size={32} />
                        </div>
                        <h3>Specimen Care</h3>
                        <p>Curated survival guides for rare and common tropical species adapted to your home.</p>
                    </div>
                </div>
            </div>

            <section className={styles.onboardingSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>WHO ARE YOU?</span>
                    <h2 className={styles.sectionTitle}>Designed for our Community</h2>
                    <p className={styles.sectionSubtitle}>Discover how VanaMap empowers different roles in our green ecosystem.</p>
                </div>

                <div className={styles.onboardingGrid}>
                    <div className={styles.onboardingCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                            <GraduationCap size={32} />
                        </div>
                        <h3>For Students</h3>
                        <p>Learn plant biology, analyze local weather effects, and use our oxygen simulation for your research projects.</p>
                        <span className={styles.onboardingMeta}>Educational Mode</span>
                    </div>

                    <div className={styles.onboardingCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15' }}>
                            <ShoppingBag size={32} />
                        </div>
                        <h3>For Vendors</h3>
                        <p>Register your nursery, list rare specimens, and connect with local plant lovers in your area instantly.</p>
                        <span className={styles.onboardingMeta}>Business Portal</span>
                    </div>

                    <div className={styles.onboardingCard}>
                        <div className={styles.onboardingIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <Heart size={32} />
                        </div>
                        <h3>For Plant Lovers</h3>
                        <p>Find the perfect match for your home, track your collection, and learn how to care for your green companions.</p>
                        <span className={styles.onboardingMeta}>Social Collector</span>
                    </div>
                </div>
            </section>

            <div className="container" id="plant-grid" style={{ scrollMarginTop: '2rem' }}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>PLANT DISCOVERY</span>
                    <h2 className={styles.sectionTitle}>{weather ? 'SMART MATCHES FOR YOU' : 'GLOBAL SPECIES ARCHIVE'}</h2>
                    <p className={styles.sectionSubtitle}>{weather ? 'Biologically optimized for your current atmospheric zone.' : 'Browse our scientific collection of air-purifying plants.'}</p>
                </div>

                <div className={styles.filterDiscoverySection} ref={filterSectionRef} style={{ scrollMarginTop: '100px' }}>
                    <div className={styles.searchBarWrapper}>
                        <Search className={styles.searchIcon} size={22} />
                        <input
                            type="text"
                            placeholder="Search by species name, genus, or air benefit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchSpeciesInput}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        <h3 className={styles.filterQuestion}>Which plant are you looking for?</h3>
                        <div className={styles.categorySelectionList}>
                            <div
                                className={`${styles.categoryCard} ${filter === 'indoor' ? styles.categoryCardActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'indoor' ? 'all' : 'indoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.categoryIcon}>🏠</div>
                                <div className={styles.categoryText}>
                                    <h3 className={styles.categoryName}>Indoor Collection</h3>
                                    <p className={styles.categoryDesc}>Air-purifying specimens for your room.</p>
                                </div>
                            </div>

                            <div
                                className={`${styles.categoryCard} ${filter === 'outdoor' ? styles.categoryCardActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'outdoor' ? 'all' : 'outdoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.categoryIcon}>🌿</div>
                                <div className={styles.categoryText}>
                                    <h3 className={styles.categoryName}>Outdoor Nature</h3>
                                    <p className={styles.categoryDesc}>Resilient varieties for your garden.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.filterChipGroup}>
                            <span className={styles.statLabel} style={{ fontSize: '0.7rem', marginBottom: '0.5rem', display: 'block' }}>PRECISE SUNLIGHT FILTER</span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['all', 'low', 'medium', 'high'].map((l) => (
                                    <button
                                        key={l}
                                        className={`${styles.suggestionBtn} ${lightFilter === l ? styles.categoryCardActive : ''}`}
                                        onClick={() => setLightFilter(l as any)}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    >
                                        <Sun size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
                                        {l.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.grid} ref={plantsSectionRef} style={{ scrollMarginTop: '80px' }}>
                    {plantsLoading ? (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {isSlowLoading && (
                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <h3 style={{ color: '#facc15', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={20} /> Loading Plants...
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Getting fresh data from the server...</p>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: 'inherit', gap: 'inherit', width: '100%' }}>
                                {[...Array(10)].map((_, i) => <PlantSkeleton key={i} />)}
                            </div>
                        </div>
                    ) : (
                        displayedPlants.slice(0, visibleLimit).map((plant: Plant, index: number) => (
                            <div
                                key={plant.id}
                                onClick={() => openDetails(plant)}
                                className={styles.fadeIn}
                                style={{
                                    animationDelay: isFromCache ? '0s' : `${Math.min(index * 0.05, 1)}s`,
                                    cursor: 'pointer'
                                }}
                            >
                                <PlantCard
                                    plant={plant}
                                    onAdd={handleAddToCart}
                                    score={weather ? plant.score : undefined}
                                    isTopMatch={weather ? index === 0 && (plant.score || 0) > 0 : false}
                                />
                            </div>
                        ))
                    )}
                </div>

                {!plantsLoading && displayedPlants.length > visibleLimit && (
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Button
                            onClick={() => setVisibleLimit(displayedPlants.length)}
                            variant="primary"
                            size="lg"
                            className={styles.pulseBtn}
                        >
                            View More Plants <ArrowDown size={18} />
                        </Button>
                    </div>
                )}

                <div className={styles.suggestionButtonSection}>
                    <Button onClick={() => navigate('/support')} className={styles.suggestionBtn}>
                        <PlusCircle size={18} style={{ marginRight: '8px' }} /> Don't see a plant? Suggest it here
                    </Button>
                </div>

                <div className={styles.sponsorCTA}>
                    <div className={styles.sponsorContent}>
                        <div className={styles.sponsorIcon}>
                            <Heart size={32} fill="#facc15" color="#facc15" />
                        </div>
                        <div className={styles.sponsorText}>
                            <h3>Support the Green Future</h3>
                            <p>Partner with VanaMap to help us grow our ecosystem database.</p>
                        </div>
                        <Button onClick={() => navigate('/sponsor')} className={styles.sponsorButton}>
                            Become a Sponsor <MoveRight size={20} style={{ marginLeft: '12px' }} />
                        </Button>
                    </div>
                </div>

                <footer style={{
                    marginTop: '6rem',
                    padding: '4rem 2rem 2rem',
                    borderTop: '1px solid var(--color-border)',
                    background: 'var(--color-bg-alt)',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>Get it on Mobile</p>
                            <div style={{ padding: '0.75rem', background: 'white', border: '1px solid var(--color-border)', borderRadius: '1rem', display: 'inline-block' }}>
                                <QRCodeSVG value="https://www.vanamap.online" size={120} />
                            </div>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>Ecosystem</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li><a href="/support" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Suggestions</a></li>
                                <li><a href="/sponsor" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Sponsorship</a></li>
                                <li><a href="/vendor" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>For Vendors</a></li>
                                <li><a href="/about" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>© 2025 VanaMap - Earth's Digital Botanical Archive</p>
                </footer>
            </div>
        </div>
    );
};
