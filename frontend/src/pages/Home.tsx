import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { fetchPlants } from '../services/api';
import { getWeather, geocodeCity } from '../services/weather';
import { calculateAptness } from '../utils/logic';
import type { Plant } from '../types';
import { Sprout, MapPin, Thermometer, Wind, ArrowDown, Sparkles, Search, AlertCircle, Heart, Sun, Activity, GraduationCap, ShoppingBag } from 'lucide-react';
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
    const [lightFilter, setLightFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all'); // New Light Filter
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
                    // Only update if data is different or we didn't have cache
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

    // Debounced Search for Suggestions
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
                // Formatting city name to be clean
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
                        // Reverse Geocoding would be ideal here, but for now we'll say "Current Location"
                        // Or if the API returned city, use it.
                        // Let's assume weatherData might have something, or we default.
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
        // Push state so back button closes modal instead of app
        window.history.pushState({ modal: 'plantDetails' }, document.title);
        setSelectedPlant(plant);
    };

    const getPollutionStatus = (aqi: number = 0) => {
        if (aqi <= 20) return { label: 'Excellent', color: '#00ff9d', desc: 'Fresh Air' };
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

                // Light Filter Logic
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
                    <div className={styles.heroTextContent}>
                        <div className={styles.heroBadge}>
                            <Sparkles size={16} /> Home Ecosystem App
                        </div>

                        <h1 className={styles.heroTitle}>BRING NATURE<br />HOME</h1>
                        <p className={styles.heroSubtitle}>
                            Transform your living space. <strong>Start by setting your location below</strong> to see what grows best in your ecosystem.
                        </p>
                    </div>

                    {!weather ? (
                        <div id="location-action-area" className={styles.actionContainer}>
                            <div className={styles.buttonGroup} style={{ width: '100%', justifyContent: 'center' }}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleGetLocation}
                                    className={styles.gpsBtn}
                                    style={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        padding: '1rem'
                                    }}
                                >
                                    <MapPin size={22} className="animate-bounce" style={{ marginRight: '8px' }} /> Auto-Detect Location
                                </Button>
                            </div>

                            <div className={styles.divider}>
                                <span>OR ENTER MANUALLY</span>
                            </div>

                            <div className={styles.searchBox} style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Enter City (e.g. Kathmandu)"
                                    value={citySearch}
                                    onChange={e => {
                                        setCitySearch(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onKeyDown={e => e.key === 'Enter' && handleCitySearch()}
                                    className={styles.searchInput}
                                />
                                <Button onClick={() => handleCitySearch()} disabled={locationLoading} variant="outline">
                                    {locationLoading ? '...' : 'Search'}
                                </Button>

                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className={styles.suggestionsList}>
                                        {suggestions.map((place: any, i) => (
                                            <li key={i} className={styles.suggestionItem} onClick={() => {
                                                const cityName = place.display_name.split(',')[0];
                                                setCitySearch(cityName);
                                                setShowSuggestions(false);
                                                handleCitySearch(cityName);
                                            }}>
                                                <MapPin size={16} />
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.display_name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={styles.nearbyBtnContainer}>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/nearby')} style={{ color: '#94a3b8' }}>
                                    Find Nearby Shop Instead
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.weatherDisplay}>
                            <div className={styles.weatherCard}>
                                <div className={styles.weatherMain}>
                                    <div className={styles.locationInfo}>
                                        <span className={styles.label}>YOUR ZONE</span>
                                        <h3 className={styles.h3}>
                                            {weather.locationName || weather.city || 'Live Environment'}
                                        </h3>
                                        <button onClick={() => setWeather(null)} className={styles.changeBtn}>Change Location</button>
                                    </div>
                                    <div className={styles.vDivider}></div>
                                    <div className={styles.statGroup}>
                                        <div className={styles.iconCircle}><Thermometer size={20} color="#facc15" /></div>
                                        <div>
                                            <div className={styles.statVal}>{weather.avgTemp30Days.toFixed(1)}°C</div>
                                            <div className={styles.statSub}>Avg Temp</div>
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
                                        <span className={styles.liveTag}>LIVE UPDATE</span>
                                        <p>{getPollutionStatus(weather.air_quality?.aqi).desc}</p>
                                    </div>
                                    <Button onClick={scrollToPlants} variant="primary" size="sm" className={styles.pulseBtn}>
                                        See Recommendations <ArrowDown size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sparkles size={24} /></div>
                            <h3>Smart Match</h3>
                            <p>We rate plants based on your local weather.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Wind size={24} /></div>
                            <h3>Fresh Air</h3>
                            <p>See how much oxygen a plant gives your room.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}><Sprout size={24} /></div>
                            <h3>Easy Care</h3>
                            <p>Find plants that are easy to keep alive.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🎯 Community Onboarding Hub */}
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
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{weather ? 'SMART MATCHES FOR YOU' : 'GLOBAL SPECIES ARCHIVE'}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>{weather ? 'Biologically optimized for your current atmospheric zone.' : 'Browse our scientific collection of air-purifying plants.'}</p>
                </div>

                {/* Integrated Search and Filtering */}
                <div className={styles.filterDiscoverySection} ref={filterSectionRef} style={{ scrollMarginTop: '100px' }}>
                    <div className={styles.searchBarWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search (e.g. Aloe Vera)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchSpeciesInput}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        {/* 1. Category Selection - High Prominence */}
                        <h3 className={styles.filterQuestion}>Which plant are you looking for?</h3>
                        <div className={styles.categorySelectionList}>
                            <div
                                className={`${styles.categoryCard} ${filter === 'indoor' ? styles.indoorActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'indoor' ? 'all' : 'indoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.categoryIcon}><Wind size={32} /></div>
                                <div className={styles.categoryText}>
                                    <h3 className={styles.categoryName}>Indoor Collection</h3>
                                    <p className={styles.categoryDesc}>Air-purifying laboratory-grade specimens for your room.</p>
                                </div>
                            </div>

                            <div
                                className={`${styles.categoryCard} ${filter === 'outdoor' ? styles.outdoorActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'outdoor' ? 'all' : 'outdoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.categoryIcon}><Sprout size={32} /></div>
                                <div className={styles.categoryText}>
                                    <h3 className={styles.categoryName}>Outdoor Nature</h3>
                                    <p className={styles.categoryDesc}>Resilient natural varieties for your garden and balcony.</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Sunlight Filter - Secondary */}
                        <div className={styles.filterChipGroup}>
                            <span className={styles.groupLabel}>PRECISE SUNLIGHT FILTER</span>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'low', 'medium', 'high'].map((l) => (
                                    <button
                                        key={l}
                                        className={`${styles.filterBtn} ${lightFilter === l ? styles.active : ''}`}
                                        onClick={() => setLightFilter(l as any)}
                                    >
                                        <Sun size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
                                        {l.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- APTNESS LEGEND NOTICE --- */}
                {weather && (
                    <div className={styles.aptnessLegend}>
                        <div className={styles.legendHeader}>
                            <Activity size={20} className="text-emerald-500" />
                            <h4 className={styles.legendTitle}>Aptness Intelligence Guide</h4>
                        </div>
                        <div className={styles.legendGrid}>
                            <div className={styles.legendCard}>
                                <div className={styles.tierLabel} style={{ color: '#10b981' }}>
                                    <span className={styles.statusIndicator} style={{ color: '#10b981' }} />
                                    Superior Match (80-100%)
                                </div>
                                <p className={styles.tierDesc}>
                                    Elite biological compatibility. These specimens will thrive effortlessly in your current climate conditions.
                                </p>
                            </div>
                            <div className={styles.legendCard}>
                                <div className={styles.tierLabel} style={{ color: '#f59e0b' }}>
                                    <span className={styles.statusIndicator} style={{ color: '#f59e0b' }} />
                                    Moderate Survival (50-79%)
                                </div>
                                <p className={styles.tierDesc}>
                                    Viable with maintenance. Requires careful monitoring of hydration and localized temperature adjustments.
                                </p>
                            </div>
                            <div className={styles.legendCard}>
                                <div className={styles.tierLabel} style={{ color: '#ef4444' }}>
                                    <span className={styles.statusIndicator} style={{ color: '#ef4444' }} />
                                    Critical Alert (0-49%)
                                </div>
                                <p className={styles.tierDesc}>
                                    Environmental mismatch. Artificial climate control (AC/Humidifiers) is mandatory for specimen longevity.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.grid} ref={plantsSectionRef} style={{ scrollMarginTop: '80px' }}>
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
                                        <AlertCircle size={20} /> Loading Plants...
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Getting fresh data from the server. Please wait...
                                    </p>
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

                {/* View More Button */}
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
                {/* Sponsor CTA */}
                <div className={styles.sponsorCTA}>
                    <div className={styles.sponsorContent}>
                        <div className={styles.sponsorIcon}>
                            <Heart size={32} fill="#facc15" color="#facc15" />
                        </div>
                        <div className={styles.sponsorText}>
                            <h3>Support the Green Future</h3>
                            <p>Partner with VanaMap to help us grow our ecosystem database and bring more nature into every home.</p>
                        </div>
                        <Button
                            onClick={() => navigate('/sponsor')}
                            className={styles.sponsorButton}
                        >
                            Become a Sponsor
                        </Button>
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
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>For Mobile Users</p>
                            <div style={{
                                padding: '0.75rem',
                                background: 'white',
                                borderRadius: '1rem',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
                                display: 'inline-block'
                            }}>
                                <QRCodeSVG
                                    value="https://www.vanamap.online"
                                    size={100}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"L"}
                                    includeMargin={false}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'left', minWidth: '200px' }}>
                            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li>
                                    <a href="/contact" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Heart size={14} fill="#10b981" /> Support Us
                                    </a>
                                </li>
                                <li>
                                    <a href="/vendor" style={{ color: '#facc15', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={14} /> Become a Partner
                                    </a>
                                </li>
                                <li>
                                    <a href="/about" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={14} /> About VanaMap
                                    </a>
                                </li>
                                <li>
                                    <a href="/auth" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Vendor Login</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', width: '100%' }}>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>© 2025 VanaMap - Green Earth Project</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};
