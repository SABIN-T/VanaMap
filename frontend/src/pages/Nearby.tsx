import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchVendors, seedDatabase, logVendorContact } from '../services/api';
import { VENDORS as MOCK_VENDORS } from '../data/mocks';
import { getDistanceFromLatLonInKm, formatDistance } from '../utils/logic';
import type { Vendor } from '../types';
import { Phone, MessageCircle, MapPin, Locate } from 'lucide-react';
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
    map.setView(center, map.getZoom());
    return null;
}

export const Nearby = () => {
    const { user } = useAuth();
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'verified' | 'unverified'>('verified');

    const handleContact = async (vendor: Vendor, type: 'whatsapp' | 'call') => {
        if (!user) {
            toast.error("Please sign in to contact vendors");
            return;
        }

        // Log to backend (this triggers Admin notification and WhatsApp mock)
        await logVendorContact({
            vendorId: vendor.id,
            vendorName: vendor.name,
            userEmail: user.email,
            contactType: type
        });
    };

    const fetchNearbyShops = async (lat: number, lng: number) => {
        // Fetch verified vendors from backend
        let allVendors = await fetchVendors();
        if (allVendors.length === 0) {
            console.log("No vendors found, seeding...");
            await seedDatabase([], MOCK_VENDORS);
            allVendors = await fetchVendors();
        }
        const verifiedVendors = allVendors.filter(v => v.verified === true);

        // Fetch 'Unverified' / Public listings via Overpass API (OSM)
        // Targeted at: plant_nursery, florist, and garden_centre
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
                        const name = (el.tags.name || "").toLowerCase();

                        // MUST contain a plant-related word to be shown in "Unverified"
                        const plantKeywords = [
                            'plant', 'nursery', 'garden', 'green', 'flora',
                            'flower', 'farm', 'botanical', 'seed', 'landscape',
                            'potted', 'horticulture', 'sapling', 'bonsai', 'nursary',
                            'vanapathi', 'tree', 'organic'
                        ];
                        if (!plantKeywords.some(word => name.includes(word))) return false;

                        // Blacklist irrelevant locations
                        const blacklist = [
                            'temple', 'pooja', 'general store', 'bakery', 'medical',
                            'pharmacy', 'hospital', 'clinic', 'school', 'atm',
                            'bank', 'restaurant', 'hotel', 'police', 'post office',
                            'supermarket', 'mall', 'gym', 'salon', 'boutique',
                            'mosque', 'church', 'mandir', 'library', 'office'
                        ];
                        if (blacklist.some(word => name.includes(word))) return false;

                        if (!name || name === "local plant shop (public listing)") return false;
                        return true;
                    })
                    .map((el: any) => ({
                        id: `osm-${el.id}`,
                        name: el.tags.name,
                        latitude: el.lat,
                        longitude: el.lon,
                        address: el.tags["addr:full"] || el.tags["addr:street"] || "Local Public Listing",
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

    const handleGetLocation = useCallback(() => {
        setLoading(true);
        const toastId = toast.loading("Locating you...");

        if (!navigator.geolocation) {
            toast.error("Geolocation not supported", { id: toastId });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                toast.success("Location found!", { id: toastId });

                await fetchNearbyShops(latitude, longitude);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                toast.error("Location access denied", { id: toastId });
                // Fallback to NY or current?
                if (!position) setPosition([40.7128, -74.0060]);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [position]);

    useEffect(() => {
        handleGetLocation();
    }, [handleGetLocation]);

    const filteredVendors = nearbyVendors.filter(v => {
        if (activeTab === 'verified') return v.verified;
        return !v.verified;
    });

    if (!position) return <div className="container" style={{ padding: '2rem' }}>Loading Location...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Nearby Plant Shops</h2>
                <Button onClick={handleGetLocation} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Locate size={18} /> {loading ? 'Locating...' : 'Refresh GPS Location'}
                </Button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('verified')}
                    style={{
                        padding: '0.75rem 2rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: activeTab === 'verified' ? 'var(--color-primary)' : 'var(--glass-bg)',
                        color: activeTab === 'verified' ? 'black' : 'var(--color-text-main)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                >
                    Verified Shops
                </button>
                <button
                    onClick={() => setActiveTab('unverified')}
                    style={{
                        padding: '0.75rem 2rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: activeTab === 'unverified' ? 'var(--color-primary)' : 'var(--glass-bg)',
                        color: activeTab === 'unverified' ? 'black' : 'var(--color-text-main)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                >
                    Unverified (Public)
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: '600px', marginBottom: '4rem' }}>

                {/* Map Section */}
                <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ChangeView center={position} />

                        {/* User Location */}
                        <Marker position={position}>
                            <Popup>You are here</Popup>
                        </Marker>

                        {/* Vendors - Show ALL on map but maybe distinct icons? For now just show active filter or all? Let's show filtered for clarity */}
                        {filteredVendors.map(vendor => (
                            <Marker key={vendor.id} position={[vendor.latitude, vendor.longitude]}>
                                <Popup>
                                    <strong>{vendor.name}</strong><br />
                                    {vendor.address}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* List Section */}
                <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                        {activeTab === 'verified' ? 'Verified Partners' : 'Public Listings'} (Within 50km)
                    </h3>

                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-warning, #fbbf24)',
                        background: 'rgba(251, 191, 36, 0.05)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(251, 191, 36, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>⚠️</span>
                        <span>If shops or plants are not visible, please click on <strong>Refresh GPS Location</strong> above.</span>
                    </div>
                    {filteredVendors.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No {activeTab} vendors found nearby.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredVendors.map((vendor: any) => (
                                <div key={vendor.id} style={{
                                    background: 'var(--glass-bg)',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: 'var(--glass-border)'
                                }}>
                                    <h4 style={{
                                        color: vendor.verified ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        fontSize: '1.1rem',
                                        marginBottom: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {vendor.name}
                                        {!vendor.verified && <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid #aaa', borderRadius: '4px', color: 'var(--color-text-muted)' }}>Unverified</span>}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                        {formatDistance(vendor.distance * 1000)} away
                                    </p>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>{vendor.address}</p>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <a
                                            href={`tel:${vendor.phone}`}
                                            className="btn btn-outline"
                                            onClick={() => handleContact(vendor, 'call')}
                                            style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-main)', borderColor: 'var(--color-text-muted)' }}
                                        >
                                            <Phone size={14} /> Call
                                        </a>
                                        {(vendor.whatsapp || (vendor.phone && vendor.phone !== 'N/A')) && (
                                            <a
                                                href={`https://wa.me/${(vendor.whatsapp || vendor.phone).replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                className="btn btn-primary"
                                                onClick={() => handleContact(vendor, 'whatsapp')}
                                                style={{ padding: '0.5rem', fontSize: '0.8rem', flex: 1 }}
                                            >
                                                <MessageCircle size={14} /> WhatsApp
                                            </a>
                                        )}
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', textDecoration: 'none', marginTop: '0.5rem', width: '100%', borderColor: '#4285F4', color: '#4285F4' }}
                                    >
                                        <MapPin size={14} /> Navigate (Google Maps)
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
