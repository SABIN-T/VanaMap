import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, MapPin, Thermometer, Wind, ArrowDown, Sparkles, Search, AlertCircle } from 'lucide-react';
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
    const [o2Filter, setO2Filter] = useState<'all' | 'high' | 'very-high'>('all');
    const [weather, setWeather] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [plantsLoading, setPlantsLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);
    const [isSlowLoading, setIsSlowLoading] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [citySearch, setCitySearch] = useState('');

    const plantsSectionRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Handle Android/Mobile Back Button for Modal
    useEffect(() => {
        const handlePopState = () => {
            // Check if we are closing the modal (state is null or different)
            setSelectedPlant(null);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        // Attempt to load from cache first for instant UX
        const cachedPlants = localStorage.getItem('vanamap_plants_cache');
        if (cachedPlants) {
            try {
                const parsed = JSON.parse(cachedPlants);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPlants(parsed);
                    setPlantsLoading(false);
                    setIsFromCache(true); // Don't animate staggered if from cache
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
                    setPlants(data);
                    localStorage.setItem('vanamap_plants_cache', JSON.stringify(data));
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

    const handleCitySearch = async () => {
        if (!citySearch) return;
        setLocationLoading(true);
        const result = await geocodeCity(citySearch);
        if (result) {
            const weatherData = await getWeather(result.lat, result.lng);
            if (weatherData) {
                setWeather(weatherData);
                toast.success(`Simulation synced for ${citySearch}`);
                scrollToPlants();
            } else {
                toast.error("Environment data unavailable.");
            }
        } else {
            toast.error("Zone not found.");
        }
        setLocationLoading(false);
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            const toastId = toast.loading("Syncing with satellite...");

            const options = {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 60000
            };

            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await getWeather(latitude, longitude);
                    if (weatherData) {
                        setWeather(weatherData);
                        toast.success("Ecosystem Locked!", { id: toastId });
                        scrollToPlants();
                    } else {
                        toast.error("Syncing failed.", { id: toastId });
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
                toast.error("Satellite access denied.", { id: toastId });
            }, options);
        } else {
            toast.error("GPS not supported.");
            setLocationLoading(false);
        }
    };

    const handleAddToCart = (plant: Plant) => {
        if (!user) {
            toast.error("Please login to purchase items.");
            navigate('/auth');
            return;
        }
        addToCart(plant);
        toast.success(`Added ${plant.name} to simulation inventory!`);
    };

    const openDetails = (plant: Plant) => {
        // Push state so back button closes modal instead of app
        window.history.pushState({ modal: 'plantDetails' }, document.title);
        setSelectedPlant(plant);
    };

    const getPollutionStatus = (aqi: number = 0) => {
        if (aqi <= 20) return { label: 'Excellent', color: '#00ff9d', desc: 'Fresh air detected (Live Data)' };
        if (aqi <= 50) return { label: 'Good', color: '#facc15', desc: 'Acceptable air quality' };
        if (aqi <= 100) return { label: 'Moderate', color: '#fb923c', desc: 'Atmospheric stress detected' };
        return { label: 'High Pollution', color: '#f87171', desc: 'Critical AQI: Oxygen-boosters simulated.' };
    };

    const displayedPlants = useMemo(() => {
        const processed = [...plants]
            .filter(p => {
                const matchesType = filter === 'all' ? true : p.type === filter;
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesO2 = o2Filter === 'all' ? true : p.oxygenLevel === o2Filter;
                return matchesType && matchesSearch && matchesO2;
            })
            .map(p => {
                if (!weather) return { ...p, score: 0 };
                return { ...p, score: calculateAptness(p, weather.avgTemp30Days, weather.air_quality?.aqi, weather.avgHumidity30Days) };
            })
            .sort((a, b) => (weather ? b.score - a.score : 0));

        // Normalize so top is 100%
        if (weather && processed.length > 0) {
            const topScore = processed[0].score;
            if (topScore > 0) {
                processed.forEach(p => {
                    p.score = Math.round((p.score / topScore) * 100);
                });
            }
        }
        return processed;
    }, [plants, filter, searchQuery, o2Filter, weather]);

    return (
        <div className={styles.homeContainer}>
            {selectedPlant && (
                <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(10px)' }}>Initializing Simulation Engine...</div>}>
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
                        <Sparkles size={16} /> Eco-Simulation Engine
                    </div>

                    <h1 className={styles.heroTitle}>SMART ECOSYSTEM<br />SIMULATOR</h1>
                    <p className={styles.heroSubtitle}>
                        Analyze your local atmosphere and simulate plant growth patterns.
                        Our engine uses live environmental data to predict which species will perfectly balance your oxygen levels.
                    </p>

                    {!weather ? (
                        <div className={styles.actionContainer}>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder="Enter Your City (e.g. New York)"
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCitySearch()}
                                    className={styles.searchInput}
                                />
                                <Button onClick={handleCitySearch} disabled={locationLoading}>
                                    {locationLoading ? 'Syncing...' : 'Simulate Zone'}
                                </Button>
                            </div>

                            <div className={styles.divider}>- OR -</div>

                            <div className={styles.buttonGroup}>
                                <Button variant="outline" size="lg" onClick={handleGetLocation} className={styles.gpsBtn}>
                                    <MapPin size={20} /> Use Satellite GPS
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => navigate('/nearby')}>
                                    Find Nearby Nurseries
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.weatherDisplay}>
                            <div className={styles.weatherCard}>
                                <div className={styles.weatherMain}>
                                    <div className={styles.locationInfo}>
                                        <span className={styles.label}>ATMOSPHERIC ZONE</span>
                                        <h3 className={styles.h3}>Live Environment</h3>
                                        <button onClick={() => setWeather(null)} className={styles.changeBtn}>Recalibrate Zone</button>
                                    </div>
                                    <div className={styles.vDivider}></div>
                                    <div className={styles.statGroup}>
                                        <div className={styles.iconCircle}><Thermometer size={20} color="#facc15" /></div>
                                        <div>
                                            <div className={styles.statVal}>{weather.avgTemp30Days.toFixed(1)}°C</div>
                                            <div className={styles.statSub}>Simulated Temp</div>
                                        </div>
                                    </div>
                                    <div className={styles.statGroup}>
                                        <div className={styles.iconCircle} style={{ background: `${getPollutionStatus(weather.air_quality?.aqi).color}15`, border: `1px solid ${getPollutionStatus(weather.air_quality?.aqi).color}30` }}>
                                            <Wind size={20} color={getPollutionStatus(weather.air_quality?.aqi).color} />
                                        </div>
                                        <div>
                                            <div className={styles.statVal}>AQI {weather.air_quality?.aqi || 'N/A'}</div>
                                            <div className={styles.statSub} style={{ color: getPollutionStatus(weather.air_quality?.aqi).color }}>{getPollutionStatus(weather.air_quality?.aqi).label}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.weatherFooter}>
                                    <div className={styles.footerMsg}>
                                        <span className={styles.liveTag}>CORE ANALYSIS ACTIVE</span>
                                        <p>{getPollutionStatus(weather.air_quality?.aqi).desc}</p>
                                    </div>
                                    <Button onClick={scrollToPlants} variant="primary" size="sm" className={styles.pulseBtn}>
                                        Analyze Recommendations <ArrowDown size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sparkles size={24} /></div>
                            <h3>AI Vitality</h3>
                            <p>Calculating species efficiency based on real-time atmospheric data.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Wind size={24} /></div>
                            <h3>O₂ Simulation</h3>
                            <p>Predicting oxygen flux for your specific room dimensions.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sprout size={24} /></div>
                            <h3>Growth Tracking</h3>
                            <p>Adapting simulation parameters as local weather patterns shift.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" id="plants-grid" ref={plantsSectionRef} style={{ scrollMarginTop: '2rem' }}>
                <div className={styles.sectionHeader}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{weather ? 'RANKED ECOSYSTEM MATCHES' : 'SIMULATION DATABASE'}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>{weather ? 'Scientifically ranked based on your atmosphere.' : 'Explore high-vitality species optimized for indoor simulation.'}</p>
                </div>

                {/* Integrated Search and Filtering */}
                <div className={styles.filterDiscoverySection}>
                    <div className={styles.searchBarWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Find a species (e.g. Snake Plant)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchSpeciesInput}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        <div className={styles.filterChipGroup}>
                            <span className={styles.groupLabel}>TYPE</span>
                            {['all', 'indoor', 'outdoor'].map((f) => (
                                <button
                                    key={f}
                                    className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                                    onClick={() => setFilter(f as any)}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className={styles.filterChipGroup}>
                            <span className={styles.groupLabel}>O₂ VITALITY</span>
                            {['all', 'high', 'very-high'].map((v) => (
                                <button
                                    key={v}
                                    className={`${styles.filterBtn} ${o2Filter === v ? styles.active : ''}`}
                                    onClick={() => setO2Filter(v as any)}
                                >
                                    {v.toUpperCase().replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {plantsLoading ? (
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {isSlowLoading && (
                                <div style={{
                                    background: 'rgba(251, 191, 36, 0.1)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    textAlign: 'center',
                                    animation: 'fadeIn 0.5s ease-out'
                                }}>
                                    <h3 style={{ color: '#facc15', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={20} /> Awakening Cloud Engines
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Our intelligence systems are spinning up. This may take up to 45 seconds on your first entry.
                                        Thank you for your patience while we synchronize the ecosystem.
                                    </p>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: 'inherit', gap: 'inherit', width: '100%' }}>
                                {[...Array(10)].map((_, i) => <PlantSkeleton key={i} />)}
                            </div>
                        </div>
                    ) : (
                        displayedPlants.map((plant: Plant, index: number) => (
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
            </div>

            {/* --- FOOTER SECTION --- */}
            <footer style={{
                marginTop: '6rem',
                padding: '4rem 2rem 2rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                    }}>
                        <QRCodeSVG
                            value="https://www.vanamap.online"
                            size={120}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                            includeMargin={false}
                        />
                    </div>
                    <div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Scan to Experience VanaMap on Mobile</p>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>© 2025 VanaMap Intelligence Systems</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
