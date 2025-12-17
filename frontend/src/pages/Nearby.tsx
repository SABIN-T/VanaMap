import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchVendors, seedDatabase, logVendorContact, fetchPlants } from '../services/api';
import { VENDORS as MOCK_VENDORS } from '../data/mocks';
import { getDistanceFromLatLonInKm, formatDistance } from '../utils/logic';
import type { Vendor, Plant } from '../types';
import { MessageCircle, MapPin, Search, Sprout, ExternalLink, RefreshCw, AlertCircle, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PlantCard } from '../components/features/plants/PlantCard';
import toast from 'react-hot-toast';
import styles from './Nearby.module.css';

// Leaflet icon setup
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export const Nearby = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified'>('verified');
    const hasInitialLocateRef = useRef(false);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [filterSun, setFilterSun] = useState<'all' | 'low' | 'medium' | 'high' | 'direct'>('all');
    const [filterO2, setFilterO2] = useState<'all' | 'moderate' | 'high' | 'very-high'>('all');

    const handleAddToCart = (plant: Plant) => {
        if (!user) {
            toast.error("Please sign in to add items to cart");
            return;
        }
        addToCart(plant);
        // Toast is already handled in CartContext alert or handled here if alert is removed
        // Actually CartContext uses alert, I might want to replace it with toast later.
    };

    const fetchAllData = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const plants = await fetchPlants();
            setAllPlants(plants);

            let allVendors = await fetchVendors();
            if (allVendors.length === 0) {
                await seedDatabase([], MOCK_VENDORS);
                allVendors = await fetchVendors();
            }
            const verifiedVendors = allVendors.filter(v => v.verified === true);

            const overpassQuery = `
[out:json];
(
    node["shop"~"plant_nursery|florist|garden_centre"](around: 50000, ${lat}, ${lng});
    node["landuse"~"plant_nursery"](around: 50000, ${lat}, ${lng});
);
out body;
>;
out skel qt;
`;

            let unverifiedVendors: Vendor[] = [];
            try {
                const osmRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
                const osmData = await osmRes.json();
                if (osmData.elements) {
                    unverifiedVendors = osmData.elements
                        .filter((el: any) => el.lat && el.lon)
                        .filter((el: any) => {
                            const tags = el.tags || {};
                            const name = (tags.name || "").toLowerCase();
                            const shopType = (tags.shop || "").toLowerCase();
                            const plantKeywords = ['nursery', 'garden', 'flora', 'sapling', 'horticulture', 'potted', 'botanical', 'vanapathi', 'tree house', 'bonsai', 'greenery', 'landscape', 'seeds', 'orchard', 'farm'];
                            const isPlantRelated = plantKeywords.some(word => name.includes(word)) || shopType.includes('garden_centre') || shopType.includes('plant_nursery');
                            if (!isPlantRelated) return false;
                            const blacklist = ['temple', 'pooja', 'store', 'mart', 'bakery', 'medical', 'pharmacy', 'hospital', 'clinic', 'school', 'atm', 'bank', 'restaurant', 'hotel', 'police', 'post office', 'supermarket', 'mall', 'gym', 'salon', 'boutique', 'mosque', 'church', 'mandir', 'library', 'office', 'hardware', 'furniture', 'electronics', 'gift', 'stationery', 'tailor', 'laundry', 'sweet', 'juice', 'liquor', 'wine', 'automotive', 'tyre', 'garage', 'cement', 'paint', 'tiles', 'educational', 'trust', 'sanitary', 'studio', 'optical'];
                            if (blacklist.some(word => name.includes(word))) return false;
                            if (shopType === 'florist' && !name.includes('nursery') && !name.includes('garden')) return false;
                            return name.length >= 3;
                        })
                        .map((el: any) => ({
                            id: `osm-${el.id}`,
                            name: el.tags.name,
                            latitude: el.lat,
                            longitude: el.lon,
                            address: el.tags["addr:full"] || el.tags["addr:street"] || el.tags["addr:city"] || "Local Public Listing",
                            phone: el.tags.phone || el.tags["contact:phone"] || "N/A",
                            whatsapp: "",
                            verified: false,
                            highlyRecommended: false,
                            inventoryIds: []
                        }));
                }
            } catch (err) { console.error("OSM Error", err); }

            const combined = [...verifiedVendors, ...unverifiedVendors];
            const nearby = combined.filter(v => getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) <= 50)
                .map(v => ({ ...v, distance: getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) }))
                .sort((a: any, b: any) => {
                    if (a.highlyRecommended && !b.highlyRecommended) return -1;
                    if (a.verified && !b.verified) return -1;
                    return (a.distance || 0) - (b.distance || 0);
                });

            setNearbyVendors(nearby);
        } finally {
            setLoading(false);
        }
    };

    const handleGetLocation = useCallback((isManual = false) => {
        if (loading) return;
        const tid = isManual ? toast.loading("Syncing with satellite...") : null;
        setLoading(true);

        if (!navigator.geolocation) {
            if (tid) toast.error("GPS Not Supported", { id: tid });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                if (tid) toast.success("Satellites locked!", { id: tid });
                await fetchAllData(latitude, longitude);
            },
            () => {
                if (tid) toast.error("Precision tracking failed", { id: tid });
                setPosition(prev => prev || [28.6139, 77.2090]); // Fallback
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }, [loading]);

    useEffect(() => {
        if (!hasInitialLocateRef.current) {
            hasInitialLocateRef.current = true;
            handleGetLocation(false);
        }
    }, [handleGetLocation]);

    // Plant Filtering Logic
    const filteredPlants = useMemo(() => {
        return allPlants.filter(plant => {
            const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || plant.type === filterType;
            const matchesSun = filterSun === 'all' || plant.sunlight === filterSun;
            const matchesO2 = filterO2 === 'all' || plant.oxygenLevel === filterO2;
            return matchesSearch && matchesType && matchesSun && matchesO2;
        });
    }, [allPlants, searchQuery, filterType, filterSun, filterO2]);

    const displayVendors = nearbyVendors.filter(v => activeTab === 'verified' ? v.verified : !v.verified);

    return (
        <div className={styles.nearbyContainer}>
            {/* Notice Banner */}
            <div className={styles.noticeBanner}>
                <AlertCircle className={styles.noticeIcon} size={24} />
                <div className={styles.noticeText}>
                    <span>Satellite Protocol Active:</span> For the most accurate local results, please <span>locate yourself</span> and <span>refresh plant listings</span>. This ensures we query the latest inventory from verified partner nurseries.
                </div>
                <Button variant="outline" size="sm" onClick={() => handleGetLocation(true)} disabled={loading} style={{ marginLeft: 'auto' }}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Now
                </Button>
            </div>

            <div className={styles.headerSection}>
                <h1 className={styles.title}>NEARBY GREENERY</h1>
                <p className={styles.subtitle}>Locate high-oxygen species being tracked within your 50km radius.</p>
            </div>

            {/* Map Preview */}
            <div className={styles.mapContainer}>
                {position ? (
                    <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <ChangeView center={position} />
                        <Marker position={position} icon={L.divIcon({
                            className: 'u-marker',
                            html: `<div style="background:#00ff9d00;width:30px;height:30px;display:flex;align-items:center;justify-content:center;"><div style="background:#00ff9d;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 15px #00ff9d"></div></div>`
                        })}><Popup>Origin point (You)</Popup></Marker>
                        {displayVendors.map(v => (
                            <Marker key={v.id} position={[v.latitude, v.longitude]}>
                                <Popup><strong>{v.name}</strong><br />{formatDistance((v.distance || 0) * 1000)} away</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div style={{ background: '#000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                        Initializing precision tracking...
                    </div>
                )}
            </div>

            {/* Plant Discovery Section */}
            <div className={styles.searchSection}>
                <div className={styles.searchHeader}>
                    <h2 className={styles.searchTitle}><Sprout color="var(--color-primary)" /> Discover Local Inventory</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Filtering {allPlants.length} active species</span>
                </div>

                <div className={styles.searchBarWrapper}>
                    <div className={styles.searchInputWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search species (e.g. Aloe Vera, Snake Plant...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterGroups}>
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Environment</span>
                        <div className={styles.chips}>
                            {['all', 'indoor', 'outdoor'].map(t => (
                                <button key={t} className={`${styles.chip} ${filterType === t ? styles.active : ''}`} onClick={() => setFilterType(t as any)}>
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Sunlight Efficiency</span>
                        <div className={styles.chips}>
                            {['all', 'low', 'medium', 'high', 'direct'].map(s => (
                                <button key={s} className={`${styles.chip} ${filterSun === s ? styles.active : ''}`} onClick={() => setFilterSun(s as any)}>
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Oxygen Flux</span>
                        <div className={styles.chips}>
                            {['all', 'moderate', 'high', 'very-high'].map(o => (
                                <button key={o} className={`${styles.chip} ${filterO2 === o ? styles.active : ''}`} onClick={() => setFilterO2(o as any)}>
                                    {o.replace('-', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vendor Display and Results Toggle */}
            <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Search Results ({displayVendors.length} Shops)</h3>
                    <div className={styles.tabGroup}>
                        <button className={`${styles.tabBtn} ${activeTab === 'verified' ? styles.active : ''}`} onClick={() => setActiveTab('verified')}>
                            <Star size={16} fill={activeTab === 'verified' ? 'black' : 'none'} /> Verified
                        </button>
                        <button className={`${styles.tabBtn} ${activeTab === 'unverified' ? styles.active : ''}`} onClick={() => setActiveTab('unverified')}>
                            <AlertCircle size={16} /> Public
                        </button>
                    </div>
                </div>

                {displayVendors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <MapPin size={48} color="#444" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#888' }}>No nurseries detected within scanning radius. Try syncing GPS.</p>
                    </div>
                ) : (
                    <div className={styles.vendorGrid}>
                        {displayVendors.map(vendor => (
                            <div key={vendor.id} className={styles.vendorCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h4 className={styles.vendorName}>{vendor.name}</h4>
                                    {vendor.verified && <Star size={18} fill="var(--color-primary)" color="var(--color-primary)" />}
                                </div>
                                <div className={styles.vendorDist}>{formatDistance((vendor.distance || 0) * 1000)} away</div>
                                <p className={styles.vendorAddr}>{vendor.address}</p>

                                <div className={styles.cardActions}>
                                    <Button variant="outline" size="sm" className={styles.actionBtn} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`)}>
                                        <ExternalLink size={14} /> Path
                                    </Button>
                                    {(vendor.whatsapp || vendor.phone !== 'N/A') && (
                                        <Button size="sm" className={styles.actionBtn} onClick={() => { logVendorContact({ vendorId: vendor.id, vendorName: vendor.name, userEmail: user?.email || 'guest', contactType: 'whatsapp' }); window.open(`https://wa.me/${(vendor.whatsapp || vendor.phone).replace(/[^0-9]/g, '')}`, '_blank'); }}>
                                            <MessageCircle size={14} /> Contact
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filtered Plant View (Integrated Search Results) */}
            {(searchQuery || filterType !== 'all' || filterSun !== 'all' || filterO2 !== 'all') && (
                <div style={{ marginTop: '4rem' }}>
                    <div className={styles.headerSection}>
                        <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 900 }}>Matching Species ({filteredPlants.length})</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>Available high-vitality species matching your discovery criteria.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem', marginTop: '2.5rem' }}>
                        {filteredPlants.map(plant => (
                            <PlantCard key={plant.id} plant={plant} onAdd={handleAddToCart} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
