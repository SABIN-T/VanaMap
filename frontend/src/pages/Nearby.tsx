import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchVendors, seedDatabase, logVendorContact } from '../services/api';
import { getDistanceFromLatLonInKm, formatDistance } from '../utils/logic';
import type { Vendor } from '../types';
import { MessageCircle, MapPin, ExternalLink, RefreshCw, AlertCircle, Star, Sparkles, Search } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Nearby.module.css';

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
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [placeName, setPlaceName] = useState<string>("");
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified'>('verified');
    const [manualSearchQuery, setManualSearchQuery] = useState('');
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

                await fetchAllData(latitude, longitude);
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

    const fetchAllData = async (lat: number, lng: number) => {
        setLoading(true);
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

            let allVendors = await fetchVendors();
            if (allVendors.length === 0) {
                const { VENDORS } = await import('../data/mocks');
                await seedDatabase([], VENDORS);
                allVendors = await fetchVendors();
            }
            const verifiedVendors = allVendors.filter(v => v.verified === true);

            // Improved Overpass Query - Strictly Gardens and Nurseries
            const overpassQuery = `
[out:json][timeout:25];
(
    node["shop"="garden_centre"](around:25000,${lat},${lng});
    node["shop"="garden"](around:25000,${lat},${lng});
    node["leisure"="garden"](around:25000,${lat},${lng});
    node["landuse"="flower_bed"](around:25000,${lat},${lng});
    node["tourism"="botanical_garden"](around:25000,${lat},${lng});
    node["landuse"="plant_nursery"]["name"](around:25000,${lat},${lng});
    node["amenity"="greenhouse"]["name"](around:25000,${lat},${lng});
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
                        .filter((el: any) => {
                            // Must have coordinates
                            if (!el.lat || !el.lon) return false;

                            // If it's a shop, it must have a name. If it's a public garden, name is optional but good.
                            const tags = el.tags || {};
                            const name = tags.name || "Unknown Garden";

                            // Filter out non-garden related shops
                            const nameLower = name.toLowerCase();
                            const excludeKeywords = ['hardware', 'supermarket', 'grocery', 'general store', 'convenience', 'department store'];
                            if (excludeKeywords.some(keyword => nameLower.includes(keyword))) return false;

                            return true;
                        })
                        .map((el: any) => ({
                            id: `osm-${el.id}`,
                            name: el.tags?.name || (el.tags?.leisure === 'garden' ? "Public Garden" : "Local Nursery"),
                            latitude: el.lat,
                            longitude: el.lon,
                            address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || el.tags?.["addr:city"] || (el.tags?.leisure === 'garden' ? "Public Space" : "Local Listing"),
                            phone: el.tags?.phone || el.tags?.["contact:phone"] || "N/A",
                            whatsapp: el.tags?.["contact:whatsapp"] || "",
                            verified: false,
                            highlyRecommended: false,
                            inventoryIds: []
                        }));
                }
            } catch (err) { console.error("OSM Error", err); }

            const combined = [...verifiedVendors, ...unverifiedVendors];
            const nearby = combined.filter(v => getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) <= 25)
                .map(v => ({ ...v, distance: getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) }))
                .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

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

    const displayVendors = nearbyVendors.filter(v => activeTab === 'verified' ? v.verified : !v.verified);

    return (
        <div className={styles.nearbyContainer}>
            <div className={styles.noticeBanner}>
                <AlertCircle className={styles.noticeIcon} size={24} />
                <div className={styles.noticeText}>
                    {placeName ? (
                        <>
                            <span>LOCATION DETECTED: {placeName.toUpperCase()}</span> — Found verified simulation partners in your radius.
                        </>
                    ) : (
                        <>
                            <span>SATELLITE SYNC ACTIVE:</span> Find real nurseries verified in our simulation network.
                            Locate yourself to see nearest high-oxygen suppliers.
                        </>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleGetLocation(true)} disabled={loading} style={{ marginLeft: 'auto' }}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync GPS
                </Button>
            </div>

            <div className={styles.headerSection}>
                <h1 className={styles.title}>NURSERY EXPLORER</h1>
                <p className={styles.subtitle}>Discover verified nurseries providing simulation-matched species near you.</p>

                {/* Search by Location Bar */}
                <div style={{ marginTop: '2rem', maxWidth: '600px', position: 'relative', display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search by city or area (e.g. Connaught Place)"
                            value={manualSearchQuery}
                            onChange={(e) => setManualSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '1rem',
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <Button onClick={handleManualLocationSearch} disabled={loading} style={{ minWidth: '120px' }}>
                        {loading ? 'Scanning...' : 'Locate'}
                    </Button>
                </div>
            </div>

            <div className={styles.splitLayout}>
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

                <div className={styles.resultsSection}>
                    <div className={styles.resultsHeader}>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Nearby Outlets ({displayVendors.length})</h3>
                        <div className={styles.tabGroup}>
                            <button className={`${styles.tabBtn} ${activeTab === 'verified' ? styles.active : ''}`} onClick={() => setActiveTab('verified')}>
                                <Star size={16} fill={activeTab === 'verified' ? 'var(--color-text-main)' : 'none'} /> Verified
                            </button>
                            <button className={`${styles.tabBtn} ${activeTab === 'unverified' ? styles.active : ''}`} onClick={() => setActiveTab('unverified')}>
                                <AlertCircle size={16} /> Public
                            </button>
                        </div>
                    </div>

                    {displayVendors.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-bg-card)', borderRadius: '2rem', border: '1px dashed var(--glass-border)' }}>
                            <MapPin size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-text-muted)' }}>No simulation partners detected. Try syncing your GPS metadata.</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.vendorGrid}>
                                {displayVendors.map(vendor => (
                                    <div key={vendor.id} className={`${styles.vendorCard} ${vendor.highlyRecommended ? styles.premiumCard : ''}`}>
                                        {vendor.highlyRecommended && <div className={styles.premiumBadge}>Partner</div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h4 className={styles.vendorName}>{vendor.name}</h4>
                                            {vendor.verified && <Star size={18} fill="var(--color-primary)" color="var(--color-primary)" />}
                                        </div>
                                        <div className={styles.vendorDist}>{formatDistance((vendor.distance || 0) * 1000)} away</div>
                                        <p className={styles.vendorAddr}>{vendor.address}</p>

                                        <div className={styles.cardActions}>
                                            <Button variant="outline" size="sm" className={styles.actionBtn} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`)}>
                                                <ExternalLink size={14} /> Navigate
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
                                    <Sparkles size={18} color="#facc15" /> Nursery Partnership Program
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                                    Own a nursery or garden center? Join our verified network to showcase your sustainable inventory to thousands of local eco-enthusiasts.
                                </p>
                                <Button variant="primary" size="sm" onClick={() => toast.success("Join queue opened! Email us at partners@vanamap.online")}>
                                    Apply for Verified Status
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
