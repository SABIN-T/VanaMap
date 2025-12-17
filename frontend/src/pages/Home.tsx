import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, CloudRain, Sun, MapPin, Thermometer, Wind } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PlantDetailsModal } from '../components/features/plants/PlantDetailsModal';
import styles from './Home.module.css';

export const Home = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [weather, setWeather] = useState<any>(null); // TODO: Define proper type
    const [locationLoading, setLocationLoading] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [citySearch, setCitySearch] = useState('');

    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlants().then(async (data: Plant[]) => {
            // Only seed if database is COMPLETELY empty
            if (data.length === 0) {
                console.log("Database empty. Initializing with mocks...");
                const { PLANTS } = await import('../data/mocks');
                await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                const newData = await fetchPlants();
                setPlants(newData);
            } else {
                setPlants(data);
            }
        });
    }, []);

    // Removed misplaced import

    // ... (existing imports)

    const handleCitySearch = async () => {
        if (!citySearch) return;
        setLocationLoading(true);
        const result = await geocodeCity(citySearch);
        if (result) {
            const weatherData = await getWeather(result.lat, result.lng);
            if (weatherData) {
                setWeather(weatherData);
                toast.success(`Weather found for ${citySearch}`);
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

    // Sort by aptness if weather exists
    const displayedPlants = [...plants]
        .filter(p => filter === 'all' ? true : p.type === filter)
        .map(p => {
            if (!weather) return { ...p, score: 0 };
            // Use the simulated 30-day avg for aptness
            return { ...p, score: calculateAptness(p, weather.avgTemp30Days) };
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

            {/* Modern Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 255, 157, 0.1)', color: '#00ff9d', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem', border: '1px solid rgba(0, 255, 157, 0.2)' }}>
                        <Sprout size={16} /> AI-Powered Plant Finder
                    </div>

                    <h1 className={styles.heroTitle}>FIND THE PERFECT<br />PLANT FOR YOUR SPACE</h1>
                    <p className={styles.heroSubtitle} style={{ color: 'var(--color-text-muted)' }}>
                        Stop guessing. Our AI analyzes your local weather humidity and oxygen needs
                        to scientifically recommend plants that will actually thrive in your home.
                    </p>

                    {/* Weather Widget / Action Buttons */}
                    {!weather ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '0.5rem', border: 'var(--glass-border)' }}>
                                <input
                                    type="text"
                                    placeholder="Enter City Name (e.g. London)"
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCitySearch()}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', padding: '0.5rem', outline: 'none', minWidth: '200px' }}
                                />
                                <Button onClick={handleCitySearch} size="sm">{locationLoading ? 'Searching...' : 'Search'}</Button>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', alignSelf: 'center' }}>- OR -</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Button size="lg" variant="outline" onClick={handleGetLocation}>
                                    <MapPin size={20} /> Detect My GPS Location
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/nearby')}>
                                    Find Nearby Shops
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1.5rem',
                            padding: '1.5rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '2rem',
                            maxWidth: '100%'
                        }}>
                            <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '0.2rem' }}>LOCATION</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>Detected Area</div>
                                <button onClick={() => setWeather(null)} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', border: 'none', background: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
                            </div>

                            <div className={styles.weatherDivider}></div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className={styles.weatherIconCircle}>
                                    <Thermometer size={20} color="#facc15" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{weather.avgTemp30Days.toFixed(1)}°C</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>30-Day Avg</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className={styles.weatherIconCircle} style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
                                    <Wind size={20} color="#38bdf8" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{weather.current_weather.windspeed} km/h</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Wind Speed</div>
                                </div>
                            </div>

                            <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '800' }}>✓ AI ANALYSIS LIVE</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tailored results below</div>
                            </div>
                        </div>
                    )}

                    {/* Features Row */}
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sun size={24} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Simulated Growth</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>We calculate average temperatures to predict plant happiness scores.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><CloudRain size={24} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Water Smart</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Get specific hydration needs based on your local humidity levels.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sprout size={24} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>O₂ Optimization</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Maximize air quality with plants matched to your room size.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container" id="plants-grid">

                {/* Filter Tabs */}
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Plants
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'indoor' ? styles.active : ''}`}
                        onClick={() => setFilter('indoor')}
                    >
                        Indoor
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'outdoor' ? styles.active : ''}`}
                        onClick={() => setFilter('outdoor')}
                    >
                        Outdoor
                    </button>
                </div>

                {/* Plant Grid */}
                <div className={styles.grid}>
                    {displayedPlants.map((plant, index) => (
                        <div
                            key={plant.id}
                            onClick={() => openDetails(plant)}
                            className={styles.fadeIn}
                            style={{
                                cursor: 'pointer',
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <PlantCard
                                plant={plant}
                                onAdd={handleAddToCart}
                                score={weather ? plant.score : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
