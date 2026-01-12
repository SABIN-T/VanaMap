import { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import toast from 'react-hot-toast';
import { PlantCard } from '../components/features/plants/PlantCard';
import { Button } from '../components/common/Button';
import { fetchPlants, fetchVendors } from '../services/api';
import { getWeather, geocodeCity, reverseGeocode } from '../services/weather';
import { calculateAptness, normalizeBatch } from '../utils/logic';
import type { Plant, Vendor } from '../types';
import { Sprout, MapPin, Thermometer, Wind, ArrowDown, Sparkles, Search, AlertCircle, Heart, Sun, Activity, GraduationCap, ShoppingBag, PlusCircle, MoveRight, MessageCircle, Droplets, Settings2, Download, X, Share, CheckCircle2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// Lazy load modal for performance
const PlantDetailsModal = lazy(() => import('../components/features/plants/PlantDetailsModal').then(module => ({ default: module.PlantDetailsModal })));
import { PlantSkeleton } from '../components/features/plants/PlantSkeleton';
import styles from './Home.module.css';
import { plantCache, apiCache } from '../utils/universalCache'; // 🚀 Performance boost!

export const Home = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');


    const [searchQuery, setSearchQuery] = useState('');
    const [lightFilter, setLightFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [weather, setWeather] = useState<any>(() => {
        const cached = localStorage.getItem('vanamap_weather');
        try {
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [plantsLoading, setPlantsLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);
    const [isSlowLoading, setIsSlowLoading] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [citySearch, setCitySearch] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(() => window.innerWidth < 768 ? 4 : 8); // Reduced for mobile
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);

    const plantsSectionRef = useRef<HTMLDivElement>(null);
    const filterSectionRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    // Mobile Card Logic
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    const toggleCard = (id: string) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const capabilities = [
        { id: 'cap-smart', title: 'Smart Match', icon: <Sparkles size={32} />, color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', desc: 'We score plants based on your local temperature and air quality to ensure they survive.' },
        { id: 'cap-oxygen', title: 'Oxygen Boost', icon: <Wind size={32} />, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', desc: 'See how much oxygen each plant produces to help you breathe better and sleep deeper.' }
    ];

    const personas = [
        { id: 'role-student', title: 'For Students', icon: <GraduationCap size={32} />, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', desc: 'Learn plant biology, analyze local weather effects, and use our oxygen simulation for your research projects.', meta: 'Educational Mode' },
        { id: 'role-vendor', title: 'For Vendors', icon: <ShoppingBag size={32} />, color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', desc: 'Register your nursery, list rare specimens, and connect with local plant lovers in your area instantly.', meta: 'Business Portal' },
        { id: 'role-lover', title: 'For Plant Lovers', icon: <Heart size={32} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', desc: 'Find the perfect match for your home, track your collection, and learn how to care for your green companions.', meta: 'Social Collector' }
    ];

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
            } catch {
                console.error("Cache corrupted");
            }
        }

        const loadFreshData = async () => {
            const timer = setTimeout(() => {
                if (plantsLoading) setIsSlowLoading(true);
            }, 3500);

            try {
                // 🚀 CACHE CHECK - Try cache first
                const cachedPlants = plantCache.get('/api/plants', {});
                const cachedVendors = apiCache.get('/api/vendors', {});

                if (cachedPlants && cachedVendors) {
                    // Cache HIT - Instant load!
                    console.log('[Cache] ✅ Using cached data - instant load!');
                    setPlants(cachedPlants);
                    setVendors(cachedVendors);
                    setPlantsLoading(false);
                    setIsSlowLoading(false);
                    clearTimeout(timer);

                    toast.success('⚡ Loaded from cache!', {
                        duration: 1500,
                        icon: '🚀'
                    });
                    return;
                }

                // Cache MISS - Use PROGRESSIVE LOADING for new users
                console.log('[Cache] ❌ Cache miss - using progressive loading...');

                // 🚀 STEP 1: Fast initial load (12 plants, optimized)
                const { fetchPlantsLight } = await import('../services/api');
                const lightPlants = await fetchPlantsLight();

                if (lightPlants.length > 0) {
                    console.log('[Progressive] ⚡ Showing first 12 plants instantly!');
                    setPlants(lightPlants);
                    setPlantsLoading(false); // Show UI immediately!
                    setIsSlowLoading(false);
                    clearTimeout(timer);
                }

                // 🚀 STEP 2: Load full data in background
                const [data, vendorData] = await Promise.all([
                    fetchPlants(),
                    fetchVendors()
                ]);

                // Store in cache for next time
                plantCache.set('/api/plants', data, {});
                apiCache.set('/api/vendors', vendorData, {});
                console.log('[Cache] 💾 Full data cached for future use');

                setVendors(vendorData);
                if (data.length === 0) {
                    const { PLANTS } = await import('../data/mocks');
                    await import('../services/api').then(api => api.seedDatabase(PLANTS, []));
                    const newData = await fetchPlants();
                    setPlants(newData);
                    plantCache.set('/api/plants', newData, {}); // Cache the seeded data
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

    const downloadShortcut = () => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        let content = "";
        let fileName = "VanaMap_Launcher.url";
        const type = "application/octet-stream";

        if (isMac) {
            content = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n\t<key>URL</key>\n\t<string>https://www.vanamap.online</string>\n</dict>\n</plist>`;
            fileName = "VanaMap.webloc";
        } else {
            content = `[InternetShortcut]\nURL=https://www.vanamap.online\nIconFile=https://www.vanamap.online/favicon.svg\nIconIndex=0`;
            fileName = "VanaMap_Launcher.url";
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallApp = async () => {
        // ALWAYS trigger a launcher download first to satisfy "automatic download"
        downloadShortcut();
        toast.success("VanaMap Launcher Downloaded! 🚀", { duration: 3000 });

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
        } else {
            // Show the high-end Setup Wizard instead of just a toast
            setShowInstallModal(true);
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (citySearch.length > 2 && showSuggestions) {
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
    }, [citySearch, showSuggestions]);

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

                // Quest Check: Morning Dew (Action: search)
                const activeQuest = sessionStorage.getItem('active_quest');
                if (activeQuest) {
                    const quest = JSON.parse(activeQuest);
                    if (quest.action === 'search') {
                        import('../services/api').then(({ addPoints }) => {
                            addPoints(quest.points).then(() => {
                                toast.success(`Quest Complete: ${quest.title}! +${quest.points} CP`, { icon: '🏆', duration: 5000 });
                                sessionStorage.removeItem('active_quest'); // Clear quest
                            }).catch(console.error);
                        });
                    }
                }

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
        const toastId = toast.loading("Finding your location...");

        const performIPFallback = async (reason: string) => {
            console.log(`GPS fail: ${reason}. Trying IP fallback...`);
            try {
                // IP Geolocation fallback (ipapi.co is free and reliable)
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                if (data.latitude && data.longitude) {
                    const { latitude, longitude, city, country_name } = data;
                    const weatherData = await getWeather(latitude, longitude);
                    if (weatherData) {
                        const locName = city ? `${city}, ${country_name}` : "Detected Location";
                        setWeather({ ...weatherData, locationName: locName });
                        toast.success(`Located: ${locName}`, { id: toastId });
                        scrollToFilters();
                    } else {
                        toast.error("Weather unavailable for your zone.", { id: toastId });
                    }
                } else {
                    toast.error("Could not detect location. Please search manually.", { id: toastId });
                }
            } catch (err) {
                console.error("IP fallback failed", err);
                toast.error("Location access failed. Please search manually.", { id: toastId });
            } finally {
                setLocationLoading(false);
            }
        };

        if (navigator.geolocation) {
            const options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const [weatherData, locationName] = await Promise.all([
                        getWeather(latitude, longitude),
                        reverseGeocode(latitude, longitude)
                    ]);

                    if (weatherData) {
                        setWeather({ ...weatherData, locationName: locationName });
                        toast.success(`Located: ${locationName}`, { id: toastId });
                        scrollToFilters();
                    } else {
                        toast.error("Weather data unavailable.", { id: toastId });
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Network error fetching weather.", { id: toastId });
                } finally {
                    setLocationLoading(false);
                }
            }, (err) => {
                let msg = "GPS access denied.";
                if (err.code === 3) msg = "Location timeout.";
                if (err.code === 2) msg = "Location unavailable.";
                performIPFallback(msg);
            }, options);
        } else {
            performIPFallback("GPS not supported.");
        }
    };

    useEffect(() => {
        if (weather) {
            localStorage.setItem('vanamap_weather', JSON.stringify(weather));
        }
    }, [weather]);

    // DISABLED: Auto-detect on mount
    // Location detection now only happens when user clicks the GPS button
    /*
    useEffect(() => {
        // Auto-detect on mount if nothing is cached
        const hasNoLocation = !localStorage.getItem('vanamap_weather');
        if (hasNoLocation) {
            const timer = setTimeout(() => {
                handleGetLocation();
            }, 1200);

            // Listen for permission changes to trigger detect immediately on 'allow'
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' as PermissionName }).then(status => {
                    status.onchange = () => {
                        if (status.state === 'granted') {
                            handleGetLocation();
                        }
                    };
                });
            }

            return () => clearTimeout(timer);
        }
    }, []);
    */

    const handleAddToCart = (plant: Plant) => {
        // Navigate to Shops page with the selected plant ID to open it immediately
        navigate('/shops', { state: { openPlantId: plant.id } });
    };

    const openDetails = (plant: Plant) => {
        window.history.pushState({ modal: 'plantDetails' }, document.title);
        setSelectedPlant(plant);
    };

    const getVendorStats = (plantId: string) => {
        const sellingVendors = vendors.filter(v => v.inventory?.some(i => i.plantId === plantId && i.inStock));

        let totalStock = 0;
        sellingVendors.forEach(v => {
            const item = v.inventory?.find(i => i.plantId === plantId);
            if (item) {
                const qty = (item as any).quantity;
                totalStock += (typeof qty === 'number' ? qty : 1);
            }
        });

        const prices = sellingVendors.map(v => v.inventory?.find(i => i.plantId === plantId)?.price || 99999);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;

        return { totalStock, minPrice, sellerCount: sellingVendors.length, hasStock: totalStock > 0 };
    };

    const getPollutionStatus = (aqi?: number) => {
        if (aqi === undefined || aqi === null) return { label: 'Unknown', color: '#94a3b8', desc: 'No Data' };
        if (aqi <= 20) return { label: 'Excellent', color: '#10b981', desc: 'Fresh Air' };
        if (aqi <= 50) return { label: 'Good', color: '#facc15', desc: 'Air is Okay' };
        if (aqi <= 100) return { label: 'Moderate', color: '#fb923c', desc: 'Not very Clean' };
        return { label: 'High Pollution', color: '#f87171', desc: 'You need plants!' };
    };

    const displayedPlants = useMemo(() => {
        const filtered = plants.filter(p => {
            const matchesType = filter === 'all' ? true : p.type === filter;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.scientificName || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLight = lightFilter === 'all' ? true : (() => {
                const s = p.sunlight?.toLowerCase() || '';
                if (lightFilter === 'low') return s.includes('low') || s.includes('shade') || s.includes('shadow');
                if (lightFilter === 'medium') return s.includes('indirect') || s.includes('partial') || s.includes('medium');
                if (lightFilter === 'high') return s.includes('full') || s.includes('high') || s.includes('direct') || s.includes('bright');
                return false;
            })();
            return matchesType && matchesSearch && matchesLight;
        });

        if (!weather) return filtered.map(p => ({ ...p, score: 0 }));

        // Simple biological simulation - instant for both mobile and desktop
        // 1. Calculate raw high-precision absolute scores
        const scoredRaw = filtered.map(p => {
            const rawScore = calculateAptness(p, weather.avgTemp30Days, weather.air_quality?.aqi, weather.avgHumidity30Days, undefined);
            return { ...p, rawScore };
        });

        // 2. Normalize the batch relative to the highest raw score
        const rawScores = scoredRaw.map(s => s.rawScore);
        const normalizedScores = normalizeBatch(rawScores);

        // 3. Map normalized scores back and sort
        return scoredRaw
            .map((p, i) => ({ ...p, score: normalizedScores[i] }))
            .sort((a, b) => b.score - a.score);
    }, [plants, filter, searchQuery, lightFilter, weather]);

    return (
        <div className={styles.homeContainer}>
            <Helmet>
                <title>{weather ? `Plants for ${weather.locationName || 'You'} | VanaMap` : 'VanaMap - Smart Plant Finder & AI Doctor'}</title>
                <meta name="description" content={weather ? `Discover optimal plants for ${weather.locationName} based on live weather data (${weather.avgTemp30Days}°C). Breathe better with VanaMap.` : "Find the perfect plants for your home using AI. Detect your climate, diagnose diseases, and chat with Dr. Flora."} />
                <link rel="canonical" href="https://www.vanamap.online/" />
            </Helmet>
            {/* Desktop Background Animations */}
            <div className={styles.desktopAnimationOverlay}>
                <div className={`${styles.floatingElement} ${styles.leaf1}`}><Sprout size={48} /></div>
                <div className={`${styles.floatingElement} ${styles.leaf2}`}><Leaf size={40} /></div>
                <div className={`${styles.floatingElement} ${styles.leaf3}`}><Activity size={56} /></div>
                <div className={`${styles.floatingElement} ${styles.leaf4}`}><Wind size={44} /></div>
                <div className={styles.glowingOrb1} />
                <div className={styles.glowingOrb2} />
            </div>

            {selectedPlant && (
                <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(10px)' }}>Starting Simulation...</div>}>
                    <PlantDetailsModal
                        plant={selectedPlant}
                        weather={weather}
                        onClose={() => window.history.back()}
                        onBuy={() => handleAddToCart(selectedPlant)}
                    />
                </Suspense>
            )}

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroMainStack}>
                        {/* Premium Instagram Icon */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <a
                                href="https://www.instagram.com/vanamap.online/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.instagramLink}
                                aria-label="Follow VanaMap on Instagram"
                            >
                                <div className={styles.instagramIcon}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                            fill="url(#instagramGradient)"
                                        />
                                        <defs>
                                            <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#f09433" />
                                                <stop offset="25%" stopColor="#e6683c" />
                                                <stop offset="50%" stopColor="#dc2743" />
                                                <stop offset="75%" stopColor="#cc2366" />
                                                <stop offset="100%" stopColor="#bc1888" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </a>

                            {/* Premium WhatsApp Icon */}
                            <a
                                href="https://wa.me/919188773534"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsappLink}
                                aria-label="Contact VanaMap on WhatsApp"
                            >
                                <div className={styles.whatsappIcon}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.06L0 24l6.117-1.605a11.782 11.782 0 005.925 1.585h.005c6.635 0 12.03-5.396 12.033-12.03a11.84 11.84 0 00-3.417-8.497"
                                            fill="url(#whatsappGradient)"
                                        />
                                        <defs>
                                            <linearGradient id="whatsappGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#25D366" />
                                                <stop offset="100%" stopColor="#128C7E" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </a>

                            {/* Premium X (Twitter) Icon */}
                            <a
                                href="https://x.com/VanaMap50945"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.twitterLink}
                                aria-label="Follow VanaMap on X"
                            >
                                <div className={styles.twitterIcon}>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.29 19.497h2.039L6.486 3.24H4.298l13.313 17.41z"
                                            fill="url(#twitterGradient)"
                                        />
                                        <defs>
                                            <linearGradient id="twitterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ffffff" />
                                                <stop offset="100%" stopColor="#94a3b8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </a>
                        </div>

                        <div className={styles.heroBadge}>
                            <Sparkles size={16} /> Home Ecosystem Intelligence
                        </div>
                        <h1 className={styles.heroTitle}>Bring Nature<br />Home</h1>
                        <p className={styles.heroSubtitle}>
                            Turn your home into a green sanctuary.
                            <strong> Detect your location</strong> to find plants that thrive in your space.
                        </p>
                    </div>

                    {!weather ? (
                        <div id="location-action-area" className={styles.heroActionArea}>
                            <div className={styles.actionContainer}>
                                <Button
                                    variant="primary"
                                    onClick={handleGetLocation}
                                    className={`${styles.gpsBtn} ${locationLoading ? styles.gpsBtnLoading : ''}`}
                                    disabled={locationLoading}
                                    aria-label="Detect current location for plant recommendations"
                                >
                                    <MapPin size={22} className={locationLoading ? "animate-spin" : "animate-bounce"} style={{ marginRight: '12px' }} />
                                    {locationLoading ? "🌍 DETERMINING CLIMATE..." : "Auto-Detect Local Climate"}
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
                                        aria-label="Search for a city manually"
                                    />
                                    {showSuggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
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

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/nearby')}
                                    className={styles.ghostBtn}
                                    disabled={showSuggestions && suggestions.length > 0}
                                >
                                    <Sprout size={16} style={{ marginRight: '8px' }} /> Find Nearby Shop Instead
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.weatherDashboard}>
                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                                    <MapPin size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>LOCATION</span>
                                    <div className={styles.statValue}>
                                        {weather.locationName || weather.city || 'Local Zone'}
                                    </div>
                                    <button onClick={() => {
                                        setWeather(null);
                                        localStorage.removeItem('vanamap_weather');
                                    }} className={styles.changeLocationBtn}>
                                        <Settings2 size={12} />
                                        Change Location
                                    </button>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15' }}>
                                    <Thermometer size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>LIVE TEMPERATURE</span>
                                    <div className={styles.statValue}>
                                        {typeof weather.avgTemp30Days === 'number' ? weather.avgTemp30Days.toFixed(1) : '--'}°C
                                    </div>
                                    <span className={styles.statDescription}>30-Day Simulation Base</span>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                                    <Droplets size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>LIVE HUMIDITY</span>
                                    <div className={styles.statValue}>
                                        {typeof weather.humidity === 'number' ? weather.humidity.toFixed(0) : '--'}%
                                    </div>
                                    <span className={styles.statDescription}>Current Moisture Level</span>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <div className={styles.statIcon} style={{
                                    background: `${getPollutionStatus(weather.air_quality?.aqi).color}25`,
                                    color: getPollutionStatus(weather.air_quality?.aqi).color
                                }}>
                                    <Activity size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>AIR QUALITY (AQI)</span>
                                    <div className={styles.statValue}>
                                        {weather.air_quality?.aqi ?? 'N/A'}
                                    </div>
                                    <span className={styles.statDescription} style={{ color: getPollutionStatus(weather.air_quality?.aqi).color, fontWeight: 800 }}>
                                        {getPollutionStatus(weather.air_quality?.aqi).label.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>



            {/* MOVED: Plant Grid (The Main Content) */}
            <div className="container" id="plant-grid" style={{ scrollMarginTop: '2rem' }}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>PLANT DISCOVERY</span>
                    <h2 className={styles.sectionTitle}>{weather ? 'SMART MATCHES FOR YOU' : 'GLOBAL SPECIES ARCHIVE'}</h2>
                    <p className={styles.sectionSubtitle}>{weather ? 'Biologically optimized for your current atmospheric zone.' : 'Browse our scientific collection of air-purifying plants.'}</p>
                </div>

                <div className={styles.filterDiscoverySection} ref={filterSectionRef} style={{ scrollMarginTop: '100px' }}>

                    <div className={styles.filterWrapper}>
                        <h3 className={styles.filterQuestion}>Which plant are you looking for?</h3>

                        {/* Column Layout Filter Cards - Matching Shops Design */}
                        <div className={styles.typeFilterContainer}>
                            <div
                                className={`${styles.typeFilterCard} ${filter === 'indoor' ? styles.typeFilterActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'indoor' ? 'all' : 'indoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.typeFilterIcon}>🏠</div>
                                <div className={styles.typeFilterInfo}>
                                    <span className={styles.typeFilterName}>Indoor</span>
                                    <span className={styles.typeFilterDesc}>Interior Species</span>
                                </div>
                            </div>

                            <div
                                className={`${styles.typeFilterCard} ${filter === 'outdoor' ? styles.typeFilterActive : ''}`}
                                onClick={() => {
                                    setFilter(filter === 'outdoor' ? 'all' : 'outdoor');
                                    scrollToPlants();
                                }}
                            >
                                <div className={styles.typeFilterIcon}>🌲</div>
                                <div className={styles.typeFilterInfo}>
                                    <span className={styles.typeFilterName}>Outdoor</span>
                                    <span className={styles.typeFilterDesc}>Natural Resilience</span>
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

                {/* Aptness Explanation Panel - Premium Glassmorphic Design */}
                <div className={styles.aptnessExplainer}>
                    <div className={styles.explainerGlass}>
                        <div className={styles.explainerHeader}>
                            <Sparkles size={16} className={styles.explainerIcon} />
                            <span className={styles.explainerTitle}>Understanding Aptness Scores</span>
                        </div>
                        <p className={styles.explainerText}>
                            A precision score calculated from your local climate (Temp, Light, Humidity)—<strong style={{ color: '#bae6fd' }}>100% means a perfect survival match</strong>.
                        </p>
                        <div className={styles.explainerLegend}>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}></div>
                                <span>90-100%: Optimal Match</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)' }}></div>
                                <span>75-89%: Resilient Fit</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #fb923c, #f97316)' }}></div>
                                <span>50-74%: Moderate Stress</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #f87171, #ef4444)' }}></div>
                                <span>&lt;50%: Non-Viable</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.searchBarWrapper} style={{ margin: '0 auto 3rem auto' }}>
                    <Search className={styles.searchIcon} size={22} />
                    <input
                        type="text"
                        placeholder="Search by species name, genus, or air benefit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchSpeciesInput}
                    />
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
                                    isTopMatch={weather ? (plant.score || 0) >= 100 : false}
                                    priority={window.innerWidth >= 768 && index < 6}
                                    stockStatus={getVendorStats(plant.id)}
                                    hideBuyBtn={true}
                                    hideStockBadge={true}
                                />
                            </div>
                        ))
                    )}
                </div>

                {!plantsLoading && displayedPlants.length > visibleLimit && (
                    <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Showing {visibleLimit} of {displayedPlants.length} specimens
                        </p>
                        <Button
                            onClick={() => setVisibleLimit(prev => prev + 12)}
                            variant="primary"
                            size="lg"
                            className={styles.pulseBtn}
                        >
                            Load More <ArrowDown size={18} />
                        </Button>
                    </div>
                )}

                <div className={styles.suggestionButtonSection} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Button onClick={() => navigate('/support')} className={styles.suggestionBtn}>
                        <PlusCircle size={18} style={{ marginRight: '8px' }} /> Don't see a plant? Suggest it here
                    </Button>
                </div>
            </div>

            {/* MOVED: Intelligence Section (Core Capabilities) */}
            <div className={styles.intelligenceSection} style={{ marginTop: '0', contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>CORE CAPABILITIES</span>
                    <h2 className={styles.sectionTitle}>Built for Deep Biological Insights</h2>
                    <p className={styles.sectionSubtitle}>VanaMap bridges the gap between atmospheric science and interior design.</p>
                </div>
                <div className={styles.onboardingGrid} style={{ marginTop: '4rem' }}>
                    {capabilities.map((cap: any) => (
                        <div
                            key={cap.id}
                            className={`${styles.capabilityCard} ${expandedCards[cap.id] ? styles.cardExpanded : ''}`}
                            onClick={() => toggleCard(cap.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.onboardingIcon} style={{ background: cap.bg, color: cap.color }}>
                                {cap.icon}
                            </div>
                            <h3>{cap.title}</h3>
                            <p>{cap.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* MOVED: Onboarding Section (Personas) */}
            <section className={styles.onboardingSection} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionBadge}>WHO ARE YOU?</span>
                    <h2 className={styles.sectionTitle}>Designed for our Community</h2>
                    <p className={styles.sectionSubtitle}>Discover how VanaMap empowers different roles in our green ecosystem.</p>
                </div>

                <div className={styles.onboardingGrid}>
                    {personas.map((p: any) => (
                        <div
                            key={p.id}
                            className={`${styles.onboardingCard} ${expandedCards[p.id] ? styles.cardExpanded : ''}`}
                            onClick={() => toggleCard(p.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className={styles.onboardingIcon} style={{ background: p.bg, color: p.color }}>
                                {p.icon}
                            </div>
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                            {expandedCards[p.id] && p.id === 'role-vendor' && (
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/auth?role=vendor&view=signup');
                                    }}
                                    style={{ marginTop: '1rem', width: '100%', background: p.color, color: 'black', fontWeight: 800 }}
                                >
                                    JOIN AS VENDOR
                                </Button>
                            )}
                            <span className={styles.onboardingMeta}>{p.meta}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Stuff */}
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

            <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--color-text-dim)', marginBottom: '1rem' }}>Need help with the app?</p>
                <Button
                    onClick={() => navigate('/contact')}
                    variant="ghost"
                    size="lg"
                    style={{ border: '1px solid var(--color-border)', borderRadius: '99px' }}
                >
                    <MessageCircle size={20} style={{ marginRight: '8px' }} /> Contact Support
                </Button>
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
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>Experience VanaMap Everywhere</p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleInstallApp}
                            style={{
                                borderRadius: '1rem',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <Download size={20} />
                            Download VanaMap App
                        </Button>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', marginTop: '1rem', opacity: 0.7 }}>
                            Desktop or Mobile • No Store Required
                        </p>
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

            {/* --- APP SETUP / INSTALLER MODAL --- */}
            {showInstallModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '440px',
                        background: 'var(--color-bg)',
                        borderRadius: '2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header Image/Pattern */}
                        <div style={{
                            height: '140px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'white',
                                borderRadius: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                zIndex: 1
                            }}>
                                <img src="/logo.png" alt="VanaMap" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                            </div>
                            <button
                                onClick={() => setShowInstallModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    zIndex: 2
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text-main)', marginBottom: '0.5rem', textAlign: 'center' }}>Install VanaMap App</h2>
                            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                Add VanaMap to your home screen for a fast, native experience with offline support.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Steps based on device */}
                                {(/iPad|iPhone|iPod/.test(navigator.userAgent)) ? (
                                    <>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Share size={18} color="#10b981" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Step 1</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tap the <span style={{ color: '#007AFF', fontWeight: 700 }}>Share</span> icon in Safari</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <PlusCircle size={18} color="#10b981" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Step 2</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Scroll down and select <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>'Add to Home Screen'</span></p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Settings2 size={18} color="#10b981" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Automatic Setup</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Open your browser menu and select <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>'Install App'</span> or use the download button below.</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'var(--color-bg-alt)',
                                    borderRadius: '1.25rem',
                                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <CheckCircle2 size={24} color="#10b981" />
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                                        <strong>Ready for Launch:</strong> A desktop/mobile launcher has been downloaded to your device automatically.
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setShowInstallModal(false)}
                                style={{ width: '100%', marginTop: '2rem', borderRadius: '1rem' }}
                            >
                                Got it, let's go!
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
