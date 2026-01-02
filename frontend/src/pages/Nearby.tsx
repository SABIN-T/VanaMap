import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchVendors, seedDatabase, logVendorContact } from '../services/api';
import { getDistanceFromLatLonInKm, formatDistance } from '../utils/logic';
import type { Vendor } from '../types';
import { MessageCircle, MapPin, ExternalLink, RefreshCw, AlertCircle, Star, Sparkles, Search, Zap } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Nearby.module.css';

interface OSMElement {
    id: number;
    lat: number;
    lon: number;
    tags?: {
        name?: string;
        shop?: string;
        landuse?: string;
        "addr:full"?: string;
        "addr:street"?: string;
        "addr:city"?: string;
        phone?: string;
        "contact:phone"?: string;
        "contact:whatsapp"?: string;
        [key: string]: string | undefined;
    };
}

// Leaflet icon setup
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
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
    const { items } = useCart();
    const location = useLocation(); // Hook usage
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [placeName, setPlaceName] = useState<string>("");
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize tab from navigation state or default to verified
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified' | 'all'>((location.state as { tab?: 'verified' | 'unverified' | 'all' })?.tab || 'all');

    const [manualSearchQuery, setManualSearchQuery] = useState('');
    const [searchRadius, setSearchRadius] = useState(50);
    const [isScanningPublic, setIsScanningPublic] = useState(false);
    const hasInitialLocateRef = useRef(false);

    const handleManualLocationSearch = async () => {
        if (!manualSearchQuery.trim()) return;
        setLoading(true);
        const tid = toast.loading(`Scanning satellite data for "${manualSearchQuery}"...`);

        try {
            // Forward Geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualSearchQuery)}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);

                setPosition([latitude, longitude]);
                setPlaceName(display_name.split(',')[0]); // Take safe first part
                toast.success("Target area locked!", { id: tid });

                await fetchAllData(latitude, longitude, searchRadius);
            } else {
                toast.error("Location signature not found.", { id: tid });
            }
        } catch (e) {
            console.error(e);
            toast.error("Network triangulation failed.", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllData = async (lat: number, lng: number, radiusKm: number) => {
        setLoading(true);
        setIsScanningPublic(true); // Start background scan tracker

        let verifiedVendors: Vendor[] = [];

        try {
            // Reverse Geocoding
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const geoData = await geoRes.json();
                if (geoData.address) {
                    const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.suburb || "Unknown Area";
                    setPlaceName(city);
                }
            } catch (e) {
                console.warn("Geocoding failed", e);
            }

            // 1. Fetch Backend Data (Fast)
            let allVendors = await fetchVendors();
            if (allVendors.length === 0) {
                const { VENDORS } = await import('../data/mocks');
                seedDatabase([], VENDORS);
                allVendors = await fetchVendors();
            }
            verifiedVendors = allVendors.filter(v => v.verified === true);

            // Initial Render with Verified Data ONLY
            const nearbyBackend = verifiedVendors
                .filter(v => getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) <= radiusKm)
                .map(v => ({ ...v, distance: getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) }))
                .sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setNearbyVendors(nearbyBackend);
            setLoading(false); // <--- UNBLOCK UI FOR VERIFIED VENDORS IMMEDIATELY

            // 2. Fetch OSM Data (Slower)
            const radiusMeters = radiusKm * 1000;
            const overpassQuery = `
[out:json][timeout:25];
(
    node["shop"="garden_centre"](around:${radiusMeters},${lat},${lng});
    node["shop"="garden"](around:${radiusMeters},${lat},${lng});
    node["leisure"="garden"](around:${radiusMeters},${lat},${lng});
    node["tourism"="botanical_garden"](around:${radiusMeters},${lat},${lng});
    node["landuse"="plant_nursery"]["name"](around:${radiusMeters},${lat},${lng});
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
                        .filter((el: OSMElement) => {
                            if (!el.lat || !el.lon) return false;
                            const tags = el.tags || {};
                            const name = tags.name || "Unknown Garden";
                            const nameLower = name.toLowerCase();
                            const excludeKeywords = ['hardware', 'supermarket', 'grocery', 'general store', 'convenience', 'department store'];
                            if (excludeKeywords.some(keyword => nameLower.includes(keyword))) return false;
                            return true;
                        })
                        .map((el: OSMElement) => {
                            const tags = el.tags || {};
                            let category = "Garden";
                            if (tags.shop === 'garden_centre' || tags.landuse === 'plant_nursery') {
                                category = "Plant Shop";
                            }

                            return {
                                id: `osm-${el.id}`,
                                name: tags.name || (category === 'Garden' ? "Public Garden" : "Local Nursery"),
                                latitude: el.lat,
                                longitude: el.lon,
                                address: tags["addr:full"] || tags["addr:street"] || tags["addr:city"] || (category === 'Garden' ? "Public Space" : "Local Listing"),
                                phone: tags.phone || tags["contact:phone"] || "N/A",
                                whatsapp: tags["contact:whatsapp"] || "",
                                verified: false,
                                highlyRecommended: false,
                                category: category,
                                inventoryIds: []
                            };
                        });
                }
            } catch (err) { console.error("OSM Error", err); }

            // 3. Merge and Update with Public Data
            // We re-filter everything to ensure distance correctness and sort order
            const nearbyPublic = unverifiedVendors
                .filter(v => getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) <= radiusKm)
                .map(v => ({ ...v, distance: getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) }));

            // Merge with previous backend results (re-calculate backend to be safe or use state setter)
            // Using state setter is safer if user moved map, but here we are in one flow.
            // Actually, we can just re-merge nearbyBackend and nearbyPublic.

            const combined = [...nearbyBackend, ...nearbyPublic].sort((a, b) => (a.distance || 0) - (b.distance || 0));
            setNearbyVendors(combined);

        } catch (e) {
            setLoading(false);
        } finally {
            setIsScanningPublic(false);
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
                await fetchAllData(latitude, longitude, searchRadius);
            },
            async (err) => {
                console.warn(`GPS failed: ${err.message}. Trying IP fallback...`);
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();
                    if (data.latitude && data.longitude) {
                        const { latitude, longitude, city } = data;
                        setPosition([latitude, longitude]);
                        if (tid) toast.success(`Located via IP: ${city || "approximate"}`, { id: tid });
                        await fetchAllData(latitude, longitude, searchRadius);
                    } else {
                        throw new Error("No data");
                    }
                } catch (fallbackErr) {
                    if (tid) toast.error("Location tracking unavailable", { id: tid });
                    setPosition(prev => prev || [28.6139, 77.2090]); // Fallback to Delhi
                    setLoading(false);
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, [loading, searchRadius]); // Added searchRadius dependency

    useEffect(() => {
        if (!hasInitialLocateRef.current) {
            hasInitialLocateRef.current = true;
            handleGetLocation(false);
        }
    }, [handleGetLocation]);

    const displayVendors = nearbyVendors.filter(v => {
        if (activeTab === 'all') return true;
        return activeTab === 'verified' ? v.verified : !v.verified;
    });

    const resultsHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll logic only if really loaded or we have some vendors
        if (!loading && displayVendors.length > 0 && position) {
            // Scroll to first outlet after short delay for map zoom
            setTimeout(() => {
                resultsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 800);
        }
    }, [loading, displayVendors.length, position]);

    return (
        <div className={styles.nearbyContainer}>
            <div className={styles.noticeBanner} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <MapPin className={styles.noticeIcon} size={20} color="#10b981" />
                <div className={styles.noticeText} style={{ color: '#ecfdf5' }}>
                    {placeName ? (
                        <>
                            <span style={{ color: '#34d399', fontWeight: 700 }}>{placeName.toUpperCase()}</span> — Identifying nearby green spaces...
                        </>
                    ) : (
                        <>
                            <span>GPS Active:</span> Finding the best plant shops around you.
                        </>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleGetLocation(true)} disabled={loading} style={{ marginLeft: 'auto', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh GPS
                </Button>
            </div>

            <div className={styles.headerSection} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className={styles.title} style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Plant Shops Near You</h1>
                <p className={styles.subtitle} style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                    Find trusted local nurseries and garden centers in your neighborhood.
                </p>
            </div>

            <div className={styles.splitLayout}>
                <div className={styles.mapWrapper}>
                    {/* Search by Location Bar Moved Above Map */}
                    <div className={styles.mapSearchBarContainer} style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                        <div className={styles.mapSearchBar} style={{ marginBottom: '1rem' }}>
                            <div className={styles.mapSearchInput}>
                                <Search size={18} className={styles.mapSearchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search city, neighborhood, or zip..."
                                    value={manualSearchQuery}
                                    onChange={(e) => setManualSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                                />
                            </div>
                            <Button onClick={handleManualLocationSearch} disabled={loading} size="sm" style={{ minWidth: '100px', height: '48px' }}>
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Search'}
                            </Button>
                        </div>

                        {/* Radius Slider Control */}
                        <div style={{ padding: '0 0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} className="text-yellow-400" /> Search Radius</span>
                                <span style={{ color: 'var(--color-text-main)' }}>{searchRadius} km</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="1000"
                                value={searchRadius}
                                className="no-swipe"
                                onChange={(e) => setSearchRadius(Number(e.target.value))}
                                onMouseUp={() => position && fetchAllData(position[0], position[1], searchRadius)}
                                onTouchEnd={() => position && fetchAllData(position[0], position[1], searchRadius)}
                                style={{ width: '100%', cursor: 'pointer', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', accentColor: 'var(--color-primary)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                                <span>1km</span>
                                <span>1000km</span>
                            </div>
                            {searchRadius > 600 && (
                                <div style={{ fontSize: '0.75rem', color: '#facc15', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s' }}>
                                    <AlertCircle size={12} /> Pro Tip: For global searches, try typing the city name in the box above.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.mapContainer}>
                        {position ? (
                            <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <ChangeView center={position} />
                                <Marker position={position} icon={L.divIcon({
                                    className: 'u-marker',
                                    html: `<div style="background:transparent;width:30px;height:30px;display:flex;align-items:center;justify-content:center;"><div style="background:var(--color-primary);width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 15px var(--color-primary)"></div></div>`
                                })}><Popup>Origin point (You)</Popup></Marker>
                                {displayVendors.map(v => (
                                    <Marker key={v.id} position={[v.latitude, v.longitude]}>
                                        <Popup><strong>{v.name}</strong><br />{formatDistance((v.distance || 0) * 1000)} away</Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : (
                            <div style={{ background: 'var(--color-bg-card)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                Initializing precision tracking...
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.resultsSection}>
                    <div className={styles.resultsHeader} ref={resultsHeaderRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', scrollMarginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Nearby Outlets ({displayVendors.length})</h3>

                        </div>
                        {/* Subtitle - hidden on very small screens via CSS/Inline if needed, but simpler text helps */}
                        <p style={{ margin: '-0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            Showing results within a {searchRadius}km radius
                        </p>

                        {/* ACTIVE SCANNER INDICATOR */}
                        {isScanningPublic && (
                            <div style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.25rem' }}>
                                <RefreshCw size={10} className="animate-spin" /> Updating public listings...
                            </div>
                        )}

                        <div className={styles.tabGroup} style={{ width: '100%', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                            <button className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`} onClick={() => setActiveTab('all')} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <Sparkles size={16} fill={activeTab === 'all' ? 'var(--color-primary)' : 'none'} /> All
                            </button>
                            <button className={`${styles.tabBtn} ${activeTab === 'verified' ? styles.active : ''}`} onClick={() => setActiveTab('verified')} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <Star size={16} fill={activeTab === 'verified' ? 'var(--color-text-main)' : 'none'} /> Verified
                            </button>
                            <button className={`${styles.tabBtn} ${activeTab === 'unverified' ? styles.active : ''}`} onClick={() => setActiveTab('unverified')} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <AlertCircle size={16} /> Public
                            </button>
                        </div>
                    </div>

                    {/* Public/All Tab Warning Hint Actions - Shown only when no results found AND not scanning */}
                    {!loading && !isScanningPublic && (activeTab === 'unverified' || activeTab === 'all') && displayVendors.length === 0 && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column', // Ensures vertical layout
                            gap: '1rem',
                            animation: 'fadeIn 0.5s ease-out'
                        }}>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    padding: '10px',
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    borderRadius: '12px',
                                    flexShrink: 0
                                }}>
                                    <AlertCircle size={20} color="#fbbf24" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700 }}>Don't see any shops?</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--color-text-muted)' }}>
                                        The map might be looking in the wrong spot. Sync your GPS to find public nurseries near you.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="md"
                                onClick={() => handleGetLocation(false)}
                                style={{
                                    width: '100%',
                                    background: 'var(--color-text-main)',
                                    color: 'var(--color-bg-main)',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <MapPin size={16} /> Sync My Location
                            </Button>
                        </div>
                    )}

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                            <div className="pulse-fast" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                                <Zap size={56} color="#facc15" fill="#facc15" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }} />
                            </div>
                            <h3 style={{ color: '#facc15', margin: '0 0 0.5rem', fontWeight: 800 }}>Searching for Vendors...</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Scanning nearby network at lightning speed</p>
                            <style>{`
                                @keyframes pulseFast {
                                    0% { transform: scale(1); opacity: 1; }
                                    50% { transform: scale(1.15); opacity: 0.8; }
                                    100% { transform: scale(1); opacity: 1; }
                                }
                                .pulse-fast { animation: pulseFast 0.6s infinite ease-in-out; }
                            `}</style>
                        </div>
                    ) : displayVendors.length === 0 && activeTab === 'verified' ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-bg-card)', borderRadius: '2rem', border: '1px dashed var(--glass-border)' }}>
                            <MapPin size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-text-muted)' }}>No confirmed partners found. Try the 'Public' tab.</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.vendorGrid}>
                                {displayVendors.map(vendor => (
                                    <div key={vendor.id} className={`${styles.vendorCard} ${vendor.highlyRecommended ? styles.premiumCard : ''}`}>
                                        <div className={styles.cardContentWrapper}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                                                <h4 className={styles.vendorName}>{vendor.name} {vendor.verified && <Star size={14} fill="var(--color-primary)" color="var(--color-primary)" style={{ display: 'inline', verticalAlign: 'text-bottom' }} />}</h4>
                                            </div>
                                            <div className={styles.vendorMeta}>
                                                <div className={styles.vendorDist}>{formatDistance((vendor.distance || 0) * 1000)} away</div>
                                                {vendor.category && <div className={styles.categoryTag}>{vendor.category}</div>}
                                            </div>
                                            <p className={styles.vendorAddr}>{vendor.address}</p>
                                        </div>

                                        {vendor.highlyRecommended && <div className={styles.premiumBadge}>Partner</div>}

                                        <div className={styles.cardActions}>
                                            <Button variant="outline" size="sm" className={styles.actionBtn} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`)}>
                                                <ExternalLink size={14} /> <span className="hidden sm:inline">Navigate</span>
                                            </Button>
                                            <Button variant="outline" size="sm" className={styles.actionBtn} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.name)}&query_place_id=${vendor.latitude},${vendor.longitude}`)}>
                                                <MapPin size={14} /> <span className="hidden sm:inline">Map</span>
                                            </Button>
                                            {(vendor.whatsapp || vendor.phone !== 'N/A') && (
                                                <Button size="sm" className={styles.actionBtn} style={{ background: '#25D366', color: '#fff', border: 'none' }} onClick={() => {
                                                    logVendorContact({ vendorId: vendor.id, vendorName: vendor.name, userEmail: user?.email || 'guest', contactType: 'whatsapp' });
                                                    let message = `Hi ${vendor.name},`;
                                                    if (items.length > 0) {
                                                        message += ` I am interested in checking availability for:\n`;
                                                        items.forEach(item => message += `- ${item.plant.name} (x${item.quantity})\n`);
                                                        message += `\nDo you have these in stock?`;
                                                    } else {
                                                        message += ` I saw your shop on VanaMap. Do you have stock?`;
                                                    }
                                                    window.open(`https://wa.me/${(vendor.whatsapp || vendor.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                                                }}>
                                                    <MessageCircle size={14} /> <span className="hidden sm:inline">Chat</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Partnership CTA */}
                            <div style={{
                                marginTop: '3rem',
                                background: 'linear-gradient(45deg, rgba(25,25,25,0.8), rgba(16,185,129,0.1))',
                                border: '1px solid rgba(16,185,129,0.2)',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={18} color="#facc15" /> Join VanaMap as a Seller
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                                    Own a nursery or plant shop? List your business here to reach more local customers.
                                </p>
                                <Button variant="primary" size="sm" onClick={() => {
                                    import('react-hot-toast').then(({ default: toast }) => toast.success("Opening WhatsApp contact..."));
                                    window.open('https://wa.me/9188773534', '_blank');
                                }}>
                                    Apply via WhatsApp (+91 88773534)
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
