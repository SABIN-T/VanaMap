import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchVendors, seedDatabase, logVendorContact } from '../services/api';
import { VENDORS as MOCK_VENDORS } from '../data/mocks';
import { getDistanceFromLatLonInKm, formatDistance } from '../utils/logic';
import type { Vendor } from '../types';
import { MessageCircle, MapPin, Locate, Star, ExternalLink, Info } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map
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
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified'>('verified');
    const hasInitialLocateRef = useRef(false);

    const handleContact = async (vendor: Vendor, type: 'whatsapp' | 'call') => {
        if (!user) {
            toast.error("Please sign in to contact vendors");
            return;
        }
        await logVendorContact({
            vendorId: vendor.id,
            vendorName: vendor.name,
            userEmail: user.email,
            contactType: type
        });
    };

    const fetchNearbyShops = async (lat: number, lng: number) => {
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

                        // Strict keywords related to whole plants and nurseries
                        const plantKeywords = [
                            'nursery', 'garden', 'flora', 'sapling', 'horticulture',
                            'potted', 'botanical', 'vanapathi', 'tree house', 'bonsai',
                            'greenery', 'landscape', 'seeds', 'orchard', 'farm'
                        ];

                        // Check if name contains plant keywords OR it's specifically tagged as garden_centre/nursery
                        const isPlantRelated = plantKeywords.some(word => name.includes(word)) ||
                            shopType.includes('garden_centre') ||
                            shopType.includes('plant_nursery');

                        if (!isPlantRelated) return false;

                        // Aggressive blacklist to exclude generic shops that might match keywords
                        const blacklist = [
                            'temple', 'pooja', 'store', 'mart', 'bakery', 'medical',
                            'pharmacy', 'hospital', 'clinic', 'school', 'atm',
                            'bank', 'restaurant', 'hotel', 'police', 'post office',
                            'supermarket', 'mall', 'gym', 'salon', 'boutique',
                            'mosque', 'church', 'mandir', 'library', 'office',
                            'hardware', 'furniture', 'electronics', 'gift', 'stationery',
                            'tailor', 'laundry', 'sweet', 'juice', 'liquor', 'wine',
                            'automotive', 'tyre', 'garage', 'cement', 'paint', 'tiles',
                            'educational', 'trust', 'sanitary', 'studio', 'optical'
                        ];

                        if (blacklist.some(word => name.includes(word))) return false;

                        // Special case: Florists are often just cut flowers, user specified plant shops/gardens
                        if (shopType === 'florist' && !name.includes('nursery') && !name.includes('garden')) return false;

                        if (!name || name.length < 3) return false;
                        return true;
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
        } catch (err) {
            console.error("OSM fetch failed", err);
        }

        const combined = [...verifiedVendors, ...unverifiedVendors];

        const nearby = combined.filter(v => {
            return getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude) <= 50;
        }).map(v => ({
            ...v,
            distance: getDistanceFromLatLonInKm(lat, lng, v.latitude, v.longitude)
        })).sort((a: any, b: any) => {
            if (a.highlyRecommended && !b.highlyRecommended) return -1;
            if (!a.highlyRecommended && b.highlyRecommended) return 1;
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;
            return a.distance - b.distance;
        });

        setNearbyVendors(nearby);
    };

    const handleGetLocation = useCallback((isManual = false) => {
        if (loading) return;

        let toastId: string | undefined;
        // Only show loading toast for manual refresh
        if (isManual) {
            toastId = toast.loading("Refreshing location...");
        }

        setLoading(true);

        if (!navigator.geolocation) {
            if (isManual && toastId) toast.error("Geolocation not supported", { id: toastId });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                // Only update if position actually changed significantly or first time
                setPosition([latitude, longitude]);

                // Only show success toast for manual refresh
                if (isManual && toastId) {
                    toast.success("Location found!", { id: toastId });
                } else if (toastId) {
                    toast.dismiss(toastId);
                }

                await fetchNearbyShops(latitude, longitude);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                if (isManual && toastId) {
                    toast.error("Location access denied", { id: toastId });
                } else if (toastId) {
                    toast.dismiss(toastId);
                }

                // Set default fallback if no position exists
                setPosition(prev => prev || [40.7128, -74.0060]);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
    }, [loading]);

    useEffect(() => {
        if (!hasInitialLocateRef.current) {
            hasInitialLocateRef.current = true;
            handleGetLocation(false);
        }
    }, [handleGetLocation]);

    const filteredVendors = nearbyVendors.filter(v => {
        if (activeTab === 'verified') return v.verified;
        return !v.verified;
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Nearby Shops
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            Discover verified nurseries and local plant listings in your area.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.4rem', borderRadius: '0.75rem', border: 'var(--glass-border)' }}>
                        <button
                            onClick={() => setActiveTab('verified')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: activeTab === 'verified' ? 'var(--color-primary)' : 'transparent',
                                color: activeTab === 'verified' ? 'black' : 'var(--color-text-muted)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Star size={16} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Verified
                        </button>
                        <button
                            onClick={() => setActiveTab('unverified')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: activeTab === 'unverified' ? 'var(--color-primary)' : 'transparent',
                                color: activeTab === 'unverified' ? 'black' : 'var(--color-text-muted)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Info size={16} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Public Listings
                        </button>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => handleGetLocation(true)}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.75rem' }}
                    >
                        <Locate size={18} /> {loading ? 'Locating...' : 'Refresh GPS'}
                    </Button>
                </div>
            </div>

            {/* Main Interactive Section */}
            {!position ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Locate size={48} className="animate-pulse" color="var(--color-primary)" />
                    </div>
                    <h3 style={{ color: 'var(--color-text-main)' }}>Determining your coordinates...</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>We need your location to find the closest plants for you.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '2rem',
                }}>
                    {/* Map Section */}
                    <div className="glass-panel" style={{
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        height: '400px',
                        border: 'var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)'
                    }}>
                        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ChangeView center={position} />
                            <Marker position={position} icon={L.divIcon({
                                className: 'user-location-marker',
                                html: `<div style="background: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.5)"></div>`
                            })}>
                                <Popup>Your Location</Popup>
                            </Marker>

                            {filteredVendors.map(vendor => (
                                <Marker key={vendor.id} position={[vendor.latitude, vendor.longitude]}>
                                    <Popup>
                                        <div style={{ padding: '0.5rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{vendor.name}</strong>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{vendor.address}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* List Grid Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.5rem' }}>
                                Results ({filteredVendors.length})
                            </h3>
                            {activeTab === 'unverified' && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '99px' }}>
                                    External Data (OSM)
                                </span>
                            )}
                        </div>

                        {filteredVendors.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.25rem' }}>
                                <MapPin size={32} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--color-text-muted)' }}>No {activeTab} vendors found in this radius.</p>
                                <Button variant="outline" onClick={() => handleGetLocation(true)} size="sm">Try Refreshing</Button>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1.25rem'
                            }}>
                                {filteredVendors.map((vendor: any) => (
                                    <div key={vendor.id} style={{
                                        background: 'var(--glass-bg)',
                                        padding: '1.5rem',
                                        borderRadius: '1.25rem',
                                        border: 'var(--glass-border)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'default'
                                    }} className="card-hover">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <h4 style={{
                                                color: 'var(--color-text-main)',
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                margin: 0
                                            }}>
                                                {vendor.name}
                                            </h4>
                                            {vendor.verified && <div title="Verified Partner" style={{ color: 'var(--color-primary)' }}><Star size={18} fill="currentColor" /></div>}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                background: 'rgba(0, 255, 157, 0.1)',
                                                color: 'var(--color-primary)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '99px'
                                            }}>
                                                {formatDistance(vendor.distance * 1000)} away
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                {vendor.address.length > 30 ? vendor.address.substring(0, 30) + '...' : vendor.address}
                                            </span>
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`)}
                                                style={{ flex: 1, borderRadius: '0.75rem' }}
                                            >
                                                <ExternalLink size={14} /> Directions
                                            </Button>

                                            {(vendor.whatsapp || (vendor.phone && vendor.phone !== 'N/A')) && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        handleContact(vendor, 'whatsapp');
                                                        window.open(`https://wa.me/${(vendor.whatsapp || vendor.phone).replace(/[^0-9]/g, '')}`, '_blank');
                                                    }}
                                                    style={{ flex: 1, borderRadius: '0.75rem' }}
                                                >
                                                    <MessageCircle size={14} /> WhatsApp
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    border-color: var(--color-primary) !important;
                }
            `}</style>
        </div>
    );
};
