import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

/**
 * LocationNag component
 * Periodically checks if location access is denied and prompts the user to enable it
 * for the best experience.
 */
export const LocationNag = () => {
    useEffect(() => {
        const checkPermission = async () => {
            if (!navigator.permissions || !navigator.permissions.query) return;

            try {
                const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

                const handleStatusChange = () => {
                    const hasNagged = sessionStorage.getItem('vanamap_location_nagged');
                    if (hasNagged) return;

                    if (status.state === 'denied') {
                        toast((t) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} className="text-amber-500" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Location Access Denied</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Enable GPS in browser settings for precise Plant Aptness scores.</p>
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            sessionStorage.setItem('vanamap_location_nagged', 'true');
                                        }}
                                        style={{
                                            marginTop: '8px',
                                            background: '#64748b',
                                            color: 'white',
                                            border: 'none',
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        ), { duration: 8000, position: 'bottom-center' });
                        sessionStorage.setItem('vanamap_location_nagged', 'true');
                    } else if (status.state === 'prompt') {
                        toast((t) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} className="text-emerald-500 animate-bounce" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Enable Intelligent Match?</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Turn on location to see which plants thrive in your current atmosphere.</p>
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            navigator.geolocation.getCurrentPosition(() => { }, () => { }); // Trigger native prompt
                                            sessionStorage.setItem('vanamap_location_nagged', 'true');
                                        }}
                                        style={{
                                            marginTop: '8px',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                                        }}
                                    >
                                        Enable Access
                                    </button>
                                </div>
                            </div>
                        ), { duration: 15000, position: 'bottom-center' });
                        sessionStorage.setItem('vanamap_location_nagged', 'true');
                    }
                };

                status.onchange = handleStatusChange;
                handleStatusChange(); // Check immediately
            } catch (e) {
                console.warn("Permission check not supported", e);
            }
        };

        const timer = setTimeout(checkPermission, 3000);
        return () => clearTimeout(timer);
    }, []);

    return null;
};
