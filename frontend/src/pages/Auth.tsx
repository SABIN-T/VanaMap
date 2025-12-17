import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../components/common/Button';
import { User, Store, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { countryCodes } from '../data/countryCodes';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DraggableMarker = ({ location, setLocation }: { location: { lat: number, lng: number }, setLocation: (loc: { lat: number, lng: number }) => void }) => {
    const map = useMapEvents({
        click(e) {
            setLocation(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setLocation(position);
                },
            }}
            position={location}
        />
    )
}

export const Auth = () => {
    const navigate = useNavigate();
    const { login, signup, googleLogin, user } = useAuth();
    const [role, setRole] = useState<'user' | 'vendor'>('user');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneCode, setPhoneCode] = useState(countryCodes[0]?.code || '+91');
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (user) {
            if (user.role === 'vendor') navigate('/vendor');
            else navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let success = false;
        if (isLogin) {
            success = await login({ email, password });
        } else {
            success = await signup({ email, password, name, role });
        }

        if (success) {
            alert(`Welcome ${name || email}!`);
        } else {
            alert('Authentication failed. Please check your credentials.');
        }
    };

    /* New: GPS Location handler */
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
                setLocation(newLoc);
                // Also could reverse geocode here if needed
            },
            () => {
                alert("Unable to retrieve your location");
                // Fallback to default if failed? Or just do nothing.
                // Let's set a default location for demo purposes if it fails, or maybe not.
                // setLocation({ lat: 20.5937, lng: 78.9629 }); // India Center
            }
        );
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', background: 'var(--bg-card)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isLogin ? 'Welcome Back' : 'Join VanaMap'}
                </h2>

                {!isLogin && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            onClick={() => setRole('user')}
                            type="button"
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${role === 'user' ? 'var(--color-primary)' : 'transparent'}`,
                                background: role === 'user' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                color: role === 'user' ? 'var(--color-primary)' : '#aaa',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <User size={24} />
                            Plant Lover
                        </button>
                        <button
                            onClick={() => setRole('vendor')}
                            type="button"
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${role === 'vendor' ? 'var(--color-primary)' : 'transparent'}`,
                                background: role === 'vendor' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                color: role === 'vendor' ? 'var(--color-primary)' : '#aaa',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Store size={24} />
                            Shop Owner
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!isLogin && (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#666' }}>Full Name {role === 'vendor' && '/ Shop Name'}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Vendor Specific Fields */}
                            {role === 'vendor' && (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Country</label>
                                        <select
                                            onChange={(e) => {
                                                const selected = countryCodes.find(c => c.name === e.target.value);
                                                if (selected) {
                                                    // Auto-set the code here if you had a state for it, but for now 
                                                    // we will find the code input below and simulate it or just let the user see it update if we controlled it.
                                                    // Since the code input below doesn't have a unique state managed here (it just renders options),
                                                    // we'll update a new 'selectedCode' state.
                                                    // For simple UX, let's just make the code dropdown uncontrolled but default selected? 
                                                    // Better: let's add a state for `phoneCode`.
                                                    setPhoneCode(selected.code);
                                                }
                                            }}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: 'var(--glass-border)',
                                                background: 'var(--glass-bg)',
                                                color: 'var(--color-text-main)',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="" disabled selected>Select Country</option>
                                            {countryCodes.map((c) => (
                                                <option key={c.name} value={c.name} style={{ background: 'var(--color-bg-card)', color: 'var(--color-text-main)' }}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Code</label>
                                            <select
                                                value={phoneCode}
                                                onChange={(e) => setPhoneCode(e.target.value)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'var(--glass-border)',
                                                    background: 'var(--glass-bg)',
                                                    color: 'var(--color-text-main)',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {countryCodes.map((c) => (
                                                    <option key={c.name} value={c.code} style={{ background: 'var(--color-bg-card)', color: 'var(--color-text-main)' }}>
                                                        {c.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Phone</label>
                                            <input type="tel" placeholder="1234567890" style={{
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: 'var(--glass-border)',
                                                background: 'var(--glass-bg)',
                                                color: 'var(--color-text-main)',
                                                outline: 'none'
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>State</label>
                                        <input type="text" placeholder="State / Province" style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: 'var(--glass-border)',
                                            background: 'var(--glass-bg)',
                                            color: 'var(--color-text-main)',
                                            outline: 'none'
                                        }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>District / City</label>
                                        <input type="text" placeholder="District" style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: 'var(--glass-border)',
                                            background: 'var(--glass-bg)',
                                            color: 'var(--color-text-main)',
                                            outline: 'none'
                                        }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '0.5rem', border: 'var(--glass-border)' }}>
                                        <button type="button" onClick={handleGetLocation} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--color-primary)', borderColor: 'var(--color-primary)', background: 'transparent' }}>
                                            <MapPin size={16} /> Auto-Detect GPS
                                        </button>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            (Click to auto-fill)
                                        </span>
                                    </div>

                                    {location && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                <span>Lat: {location.lat.toFixed(6)}</span>
                                                <span>Lng: {location.lng.toFixed(6)}</span>
                                            </div>
                                            <div style={{ height: '200px', borderRadius: '0.5rem', overflow: 'hidden', border: 'var(--glass-border)' }}>
                                                <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <DraggableMarker location={location} setLocation={setLocation} />
                                                </MapContainer>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                                                Drag the pin to adjust precise shop location
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: 'var(--glass-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--color-text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: 'var(--glass-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--color-text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <Button type="submit" size="lg" style={{ marginTop: '1rem' }}>
                        {isLogin ? 'Sign In' : (role === 'vendor' ? 'Register Shop' : 'Create Account')}
                    </Button>

                    {/* OR Separator hidden while Google Login is disabled */}
                    {false && (
                        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#666' }}>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                            <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>OR</span>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                        </div>
                    )}

                    {/* Google Login Hidden by User Request for now */}
                    {false && (import.meta.env.VITE_GOOGLE_CLIENT_ID || "480996649148-rkab0dbajc5n6q2lhvjjjkog2in6oh5u.apps.googleusercontent.com") ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    const success = await googleLogin(credentialResponse);
                                    if (success) {
                                        /* Toast is visible via context state change or handle inside */
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                theme="outline"
                                size="large"
                                width="250"
                            />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                            (Google Sign-In currently unavailable)
                        </div>
                    )}
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
