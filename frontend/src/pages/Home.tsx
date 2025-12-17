import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, CloudRain, Sun, MapPin, Thermometer, Wind, ArrowDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PlantDetailsModal } from '../components/features/plants/PlantDetailsModal';
import { PlantSkeleton } from '../components/features/plants/PlantSkeleton';
import styles from './Home.module.css';

export const Home = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [weather, setWeather] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [plantsLoading, setPlantsLoading] = useState(true);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [citySearch, setCitySearch] = useState('');

    const plantsSectionRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

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
                toast.success(`Weather found for ${citySearch}`);
                scrollToPlants();
            } else {
                toast.error("Weather data unavailable for this city.");
            }
        } else {
            toast.error("City not found.");
        }
        setLocationLoading(false);
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            const toastId = toast.loading("Detecting location...");
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await getWeather(latitude, longitude);
                    if (weatherData) {
                        setWeather(weatherData);
                        toast.success("Location connected!", { id: toastId });
                        scrollToPlants();
                    } else {
                        toast.error("Weather data unavailable.", { id: toastId });
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Failed to fetch weather data.", { id: toastId });
                } finally {
                    setLocationLoading(false);
                }
            }, (err) => {
                console.error(err);
                setLocationLoading(false);
                toast.error("Location access denied.", { id: toastId });
            });
        } else {
            toast.error("Geolocation not supported.");
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
        toast.success(`Added ${plant.name} to cart!`);
    };

    const openDetails = (plant: Plant) => {
        setSelectedPlant(plant);
    };

    const getPollutionStatus = (aqi: number = 0) => {
        if (aqi <= 20) return { label: 'Excellent', color: '#00ff9d', desc: 'Fresh air detected (Live Data)' };
        if (aqi <= 50) return { label: 'Good', color: '#facc15', desc: 'Acceptable air quality' };
        if (aqi <= 100) return { label: 'Moderate', color: '#fb923c', desc: 'Slight pollution according to live records' };
        return { label: 'High Pollution', color: '#f87171', desc: 'High contamination! Oxygen-boosters simulated.' };
    };

    const displayedPlants = [...plants]
        .filter(p => filter === 'all' ? true : p.type === filter)
        .map(p => {
            if (!weather) return { ...p, score: 0 };
            return { ...p, score: calculateAptness(p, weather.avgTemp30Days, weather.air_quality?.aqi, weather.avgHumidity30Days) };
        })
        .sort((a, b) => (weather ? b.score - a.score : 0));

    return (
        <div>
            {selectedPlant && (
                <PlantDetailsModal
                    plant={selectedPlant}
                    weather={weather}
                    onClose={() => setSelectedPlant(null)}
                />
            )}

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <Sparkles size={16} /> AI-Powered Plant Finder
                    </div>

                    <h1 className={styles.heroTitle}>FIND THE PERFECT<br />PLANT FOR YOUR SPACE</h1>
                    <p className={styles.heroSubtitle}>
                        Stop guessing. Our AI analyzes your local weather, pollution levels (AQI),
                        and room oxygen needs to scientifically recommend plants that will actually thrive.
                    </p>

                    {!weather ? (
                        <div className={styles.actionContainer}>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder="Enter City Name (e.g. London)"
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCitySearch()}
                                    className={styles.searchInput}
                                />
                                <Button onClick={handleCitySearch} disabled={locationLoading}>
                                    {locationLoading ? 'Searching...' : 'Analyze My City'}
                                </Button>
                            </div>

                            <div className={styles.divider}>- OR -</div>

                            <div className={styles.buttonGroup}>
                                <Button variant="outline" size="lg" onClick={handleGetLocation} className={styles.gpsBtn}>
                                    <MapPin size={20} /> Detect My GPS Location
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => navigate('/nearby')}>
                                    Find Nearby Shops
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.weatherDisplay}>
                            <div className={styles.weatherCard}>
                                <div className={styles.weatherMain}>
                                    <div className={styles.locationInfo}>
                                        <span className={styles.label}>ANALYSIS ZONE</span>
                                        <h3 className={styles.h3}>Detected Environment</h3>
                                        <button onClick={() => setWeather(null)} className={styles.changeBtn}>Switch Location</button>
                                    </div>
                                    <div className={styles.vDivider}></div>
                                    <div className={styles.statGroup}>
                                        <div className={styles.iconCircle}><Thermometer size={20} color="#facc15" /></div>
                                        <div>
                                            <div className={styles.statVal}>{weather.avgTemp30Days.toFixed(1)}°C</div>
                                            <div className={styles.statSub}>Avg Temperature</div>
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
                                        <span className={styles.liveTag}>LIVE ANALYSIS ACTIVE</span>
                                        <p>{getPollutionStatus(weather.air_quality?.aqi).desc}</p>
                                    </div>
                                    <Button onClick={scrollToPlants} variant="primary" size="sm" className={styles.pulseBtn}>
                                        View Recommendations <ArrowDown size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sun size={24} /></div>
                            <h3>Simulated Growth</h3>
                            <p>We calculate average temperatures to predict plant happiness scores.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><CloudRain size={24} /></div>
                            <h3>Water Smart</h3>
                            <p>Get specific hydration needs based on your local humidity levels.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sprout size={24} /></div>
                            <h3>O₂ Optimization</h3>
                            <p>Maximize air quality with plants matched to your room size.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" id="plants-grid" ref={plantsSectionRef} style={{ scrollMarginTop: '2rem' }}>
                <div className={styles.sectionHeader}>
                    <h2>{weather ? 'Top AI Recommendations' : 'Curated Plant Collection'}</h2>
                    <p>{weather ? 'Scientifically ranked for your specific environmental data.' : 'Explore our high-oxygen species for a healthier living space.'}</p>
                </div>

                <div className={styles.filters}>
                    {['all', 'indoor', 'outdoor'].map((f) => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                            onClick={() => setFilter(f as any)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? 'Species' : ''}
                        </button>
                    ))}
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
