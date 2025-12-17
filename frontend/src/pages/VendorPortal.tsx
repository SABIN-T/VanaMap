import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { MapPin } from 'lucide-react';
import { registerVendor, fetchVendors, updateVendor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Vendor } from '../types';

function DraggableMarker({ pos, setPos }: { pos: L.LatLng, setPos: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPos(e.latlng);
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
                    }
                },
            }}
            position={pos}
            ref={(m) => {
                if (m) m.openPopup();
            }}>
            <Popup>Drag me to your shop location</Popup>
        </Marker>
    );
}

export const VendorPortal = () => {
    const { user } = useAuth();
    const [markerPos, setMarkerPos] = useState<L.LatLng>(new L.LatLng(20.5937, 78.9629));
    const [isEditing, setIsEditing] = useState(false);
    const [existingVendorId, setExistingVendorId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        whatsapp: '',
        address: ''
    });

    useEffect(() => {
        if (user?.role === 'vendor') {
            loadVendorData();
        }
    }, [user]);

    const loadVendorData = async () => {
        const vendors = await fetchVendors();
        // Match vendor ID with user ID (assuming linked)
        // If user was created via seed/signup, user.id might be the link
        if (!user) return;

        // Try to find a vendor that matches user ID or name/email if stored
        // In our mock data, vendor.id was manually set. 
        // In signup, vendor.id = user._id.
        // Let's check matching ID.
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
        const vendorData = {
            name: formData.shopName,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            address: formData.address,
            latitude: markerPos.lat,
            longitude: markerPos.lng
        };

        if (isEditing && existingVendorId) {
            const result = await updateVendor(existingVendorId, vendorData);
            if (result) alert("Shop details updated successfully!");
            else alert("Update failed.");
        } else {
            const result = await registerVendor(vendorData);
            if (result) {
                alert(`Shop "${formData.shopName}" registered successfully!`);
                setFormData({ shopName: '', phone: '', whatsapp: '', address: '' });
            } else {
                alert("Submission failed. Please try again.");
            }
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>
                {isEditing ? `Vendor Dashboard: ${formData.shopName}` : 'Vendor Registration'}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Shop Name</label>
                        <input
                            type="text"
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #333', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                            value={formData.shopName}
                            onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>WhatsApp Number</label>
                        <input
                            type="tel"
                            required
                            placeholder="For direct orders"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #333', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                            value={formData.whatsapp}
                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Phone Number</label>
                        <input
                            type="tel"
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #333', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Full Address</label>
                        <textarea
                            rows={3}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #333', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'inherit' }}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#888' }}>
                        <MapPin size={16} style={{ verticalAlign: 'middle' }} />
                        Location selected: {markerPos.lat.toFixed(4)}, {markerPos.lng.toFixed(4)}
                    </div>

                    <Button type="submit" style={{ width: '100%' }}>
                        {isEditing ? 'Update Details' : 'Register Shop'}
                    </Button>
                </form>

                <div style={{ height: '500px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--color-primary)' }}>
                    <MapContainer center={markerPos} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker pos={markerPos} setPos={setMarkerPos} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};
