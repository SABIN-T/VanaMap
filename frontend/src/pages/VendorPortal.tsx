import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../components/common/Button';
import { MapPin } from 'lucide-react';
import { registerVendor } from '../services/api';

function DraggableMarker({ pos, setPos }: { pos: L.LatLng, setPos: (pos: L.LatLng) => void }) {
    // const [draggable, setDraggable] = useState(true);

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
    const [markerPos, setMarkerPos] = useState<L.LatLng>(new L.LatLng(40.7128, -74.0060));
    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        whatsapp: '',
        address: ''
    });

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

        const result = await registerVendor(vendorData);
        if (result) {
            alert(`Shop "${formData.shopName}" registered successfully!`);
            setFormData({ shopName: '', phone: '', whatsapp: '', address: '' });
        } else {
            alert("Submission failed. Please try again.");
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Vendor Registration</h1>

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

                    <Button type="submit" style={{ width: '100%' }}>Register Shop</Button>
                </form>

                <div style={{ height: '500px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--color-primary)' }}>
                    <MapContainer center={markerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
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
