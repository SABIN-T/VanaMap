import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { Store, Phone, MessageCircle, Navigation, Info } from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-primary)'
                    }}>
                        <Navigation size={18} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Map Selected</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}</div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                        {loading ? 'Processing...' : (isEditing ? 'Update Shop Profile' : 'Complete Registration')}
                    </Button>
                </form>

                {/* Map Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0, 255, 157, 0.05)', border: '1px dashed var(--color-primary)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={16} /> Pin Your Location
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>
                            Click on the map or drag the marker to your shop's exact location. This is how customers will find you.
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
                        </MapContainer>
                    </div>
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
