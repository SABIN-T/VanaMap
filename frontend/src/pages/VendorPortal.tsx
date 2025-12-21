import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { Store, Phone, MessageCircle, Navigation, Info, Locate, Bell, User, AlertTriangle, BadgeCheck } from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor, fetchVendorNotifications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import type { LatLng } from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when marker moves
const RecenterMap = ({ center }: { center: LatLng }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
    }, [center, map]);
    return null;
};

function DraggableMarker({ pos, setPos }: { pos: L.LatLng, setPos: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPos(e.latlng);
            toast.success("Location pinned!");
        },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    if (marker != null) {
                        setPos(marker.getLatLng());
                        toast.success("Location updated!");
                    }
                },
            }}
            position={pos}>
            <Popup>
                <div style={{ textAlign: 'center' }}>
                    <strong>Your Shop Location</strong><br />
                    Drag me to correct position
                </div>
            </Popup>
        </Marker>
    );
}

export const VendorPortal = () => {
    const { user } = useAuth();
    const [markerPos, setMarkerPos] = useState<L.LatLng>(new L.LatLng(20.5937, 78.9629));
    const [isEditing, setIsEditing] = useState(false);
    const [existingVendorId, setExistingVendorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        whatsapp: '',
        address: ''
    });

    useEffect(() => {
        if (user?.role === 'vendor' || user?.role === 'admin') {
            loadVendorData();
        }
    }, [user]);

    useEffect(() => {
        if (isEditing) {
            loadNotifications();
        }
    }, [isEditing]);

    const loadNotifications = async () => {
        const notifs = await fetchVendorNotifications();
        setNotifications(notifs);
    };

    const loadVendorData = async () => {
        const vendors = await fetchVendors();
        if (!user) return;

        const myVendor = vendors.find(v => v.id === user.id || v.id === (user as any)._id);

        if (myVendor) {
            setIsEditing(true);
            setExistingVendorId(myVendor.id);
            setFormData({
                shopName: myVendor.name,
                phone: myVendor.phone || '',
                whatsapp: myVendor.whatsapp || '',
                address: myVendor.address || ''
            });
            if (myVendor.latitude && myVendor.longitude) {
                setMarkerPos(new L.LatLng(myVendor.latitude, myVendor.longitude));
            }
        }
    };

    const handleAutoLocate = useCallback(() => {
        if (isLocating) return;
        setIsLocating(true);
        const tid = toast.loading("Accessing GPS...");

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser", { id: tid });
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
                setMarkerPos(newPos);
                toast.success("Current location captured!", { id: tid });
                setIsLocating(false);
            },
            () => {
                toast.error("Failed to get location. Please pin manually.", { id: tid });
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [isLocating]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const vendorData = {
            id: existingVendorId || user?.id || Date.now().toString(),
            name: formData.shopName,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            address: formData.address,
            latitude: markerPos.lat,
            longitude: markerPos.lng,
            verified: isEditing // Keep verification status if editing
        };

        try {
            if (isEditing && existingVendorId) {
                const result = await updateVendor(existingVendorId, vendorData);
                if (result) toast.success("Shop details updated!");
                else throw new Error("Update failed");
            } else {
                const result = await registerVendor(vendorData);
                if (result) {
                    toast.success(`Shop "${formData.shopName}" registered!`);
                    setIsEditing(true);
                } else {
                    throw new Error("Registration failed");
                }
            }
        } catch (err) {
            toast.error("Process failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.85rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        color: 'white',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    };

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: 0,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {isEditing ? 'Vendor Dashboard' : 'Vendor Registration'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    {isEditing ? `Managing: ${formData.shopName}` : 'Join our network of verified plant suppliers.'}
                </p>
            </div>

            {/* Verified Partner Banner */}
            {isEditing && (
                <div className="glass-panel" style={{
                    marginBottom: '2.5rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.05) 100%)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{
                        background: 'rgba(234, 179, 8, 0.2)',
                        padding: '1.25rem',
                        borderRadius: '50%',
                        boxShadow: '0 0 30px rgba(234, 179, 8, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AlertTriangle size={48} color="#facc15" fill="rgba(250, 204, 21, 0.2)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <BadgeCheck size={24} color="#facc15" fill="#facc15" className="text-black" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#facc15', margin: 0 }}>
                                Become a Verified Partner
                            </h2>
                        </div>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', fontSize: '1rem' }}>
                            <strong>Get Verified Status properly!</strong> Partners receive the "Verified Badge" on VanaMap, ranking higher in search results and gaining customer trust.
                            <br />
                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Your shop will be marked as "Verified Partner" across the platform.</span>
                        </p>
                    </div>
                    <Button
                        onClick={() => window.open('https://wa.me/9188773534', '_blank')}
                        style={{
                            background: '#25D366',
                            color: 'white',
                            border: 'none',
                            fontWeight: 700,
                            padding: '1rem 2rem',
                            borderRadius: '1rem',
                            minWidth: '220px',
                            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                        }}
                    >
                        <MessageCircle size={20} style={{ marginRight: '0.75rem' }} />
                        WhatsApp Admin
                        <div style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.9, marginTop: '2px' }}>+91 88773534</div>
                    </Button>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem'
            }}>
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', border: 'var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
                        <Store size={24} />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Shop Details</h2>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>Shop Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Green Valley Nursery"
                            style={inputStyle}
                            className="focus-primary"
                            value={formData.shopName}
                            onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>
                                <Phone size={14} /> Phone
                            </label>
                            <input
                                type="tel"
                                required
                                style={inputStyle}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>
                                <MessageCircle size={14} /> WhatsApp
                            </label>
                            <input
                                type="tel"
                                required
                                style={inputStyle}
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>Physical Address</label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Unit #, Street Name, City, Pincode"
                            style={{ ...inputStyle, fontFamily: 'inherit' }}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div style={{
                        background: 'rgba(255,165,0,0.05)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        fontSize: '0.85rem',
                        border: '1px solid rgba(255,165,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Navigation size={18} color="var(--color-primary)" />
                            <div>
                                <div style={{ fontWeight: 'bold', color: 'white' }}>Coordinates</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutoLocate}
                            disabled={isLocating}
                            style={{
                                background: 'var(--color-primary)',
                                color: 'black',
                                border: 'none',
                                padding: '0.5rem 0.8rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontWeight: '700',
                                fontSize: '0.8rem'
                            }}
                        >
                            <Locate size={14} /> {isLocating ? 'Locating...' : 'Use GPS'}
                        </button>
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                        {loading ? 'Processing...' : (isEditing ? 'Update Shop Profile' : 'Complete Registration')}
                    </Button>
                </form>

                {/* Map & Notifications Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0, 255, 157, 0.05)', border: '1px dashed var(--color-primary)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={16} /> Pin Your Location
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>
                            Click on the map or drag the marker to your shop's exact location. You can also use the **Use GPS** button for auto-detection.
                        </p>
                    </div>

                    <div style={{
                        flex: 1,
                        minHeight: '400px',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        border: 'var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)'
                    }}>
                        <MapContainer center={markerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker pos={markerPos} setPos={setMarkerPos} />
                            <RecenterMap center={markerPos} />
                        </MapContainer>
                    </div>

                    {/* Notifications Panel - Only visible when editing (registered) */}
                    {isEditing && (
                        <div className="glass-panel" style={{ padding: '2rem', border: 'var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Bell size={20} color="#facc15" />
                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Customer Activity</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                                        No recent activity. Interaction logs will appear here.
                                    </div>
                                ) : (
                                    notifications.map((note, i) => (
                                        <div key={i} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            borderLeft: '3px solid var(--color-primary)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                    {note.message}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(note.date).toLocaleString()}
                                                </div>
                                            </div>
                                            {note.details?.userEmail && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                                    <User size={12} /> {note.details.userEmail}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                input:focus, textarea:focus {
                    border-color: var(--color-primary) !important;
                    background: rgba(0, 255, 157, 0.02) !important;
                }
            `}</style>
        </div>
    );
};
