import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, MapPin, Thermometer, Wind, ArrowDown, Sparkles, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PlantDetailsModal } from '../components/features/plants/PlantDetailsModal';
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
        setPlantsLoading(true);
        fetchPlants().then(async (data: Plant[]) => {
            if (data.length === 0) {
                const { PLANTS } = await import('../data/mocks');
                await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                const newData = await fetchPlants();
                setPlants(newData);
            } else {
                setPlants(data);
            }
            setPlantsLoading(false);
        }).catch(() => setPlantsLoading(false));
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
            });
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

    const normalizedPlants = [...plants]
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
    if (weather && normalizedPlants.length > 0) {
        const topScore = normalizedPlants[0].score;
        if (topScore > 0) {
            normalizedPlants.forEach(p => {
                p.score = Math.round((p.score / topScore) * 100);
            });
        }
    }

    const displayedPlants = normalizedPlants;

    return (
        <div className={styles.homeContainer}>
            {selectedPlant && (
                <PlantDetailsModal
                    plant={selectedPlant}
                    weather={weather}
                    onClose={() => window.history.back()}
                />
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
                        [...Array(6)].map((_, i) => <PlantSkeleton key={i} />)
                    ) : (
                        displayedPlants.map((plant, index) => (
                            <div
                                key={plant.id}
                                onClick={() => openDetails(plant)}
                                className={styles.fadeIn}
                                style={{ animationDelay: `${index * 0.05}s`, cursor: 'pointer' }}
                            >
                                <PlantCard
                                    plant={plant}
                                    onAdd={handleAddToCart}
                                    score={weather ? plant.score : undefined}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
