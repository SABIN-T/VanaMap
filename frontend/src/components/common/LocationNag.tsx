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
                    if (status.state === 'denied') {
                        const hasNagged = sessionStorage.getItem('vanamap_location_nagged');
                        if (!hasNagged) {
                            toast((t) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MapPin size={20} className="text-amber-500" />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Location Access Needed</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Enable GPS for precise Plant Aptness scores and Survival Matches.</p>
                                        <button
                                            onClick={() => {
                                                toast.dismiss(t.id);
                                                sessionStorage.setItem('vanamap_location_nagged', 'true');
                                            }}
                                            style={{
                                                marginTop: '8px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Got it
                                        </button>
                                    </div>
                                </div>
                            ), {
                                duration: 8000,
                                position: 'bottom-center'
                            });
                            sessionStorage.setItem('vanamap_location_nagged', 'true');
                        }
                    }
                };

                status.onchange = handleStatusChange;
                handleStatusChange(); // Check immediately
            } catch (e) {
                console.warn("Permission check not supported", e);
            }
        };

        // Delay check to not overwhelm on load
        const timer = setTimeout(checkPermission, 5000);
        return () => clearTimeout(timer);
    }, []);

    return null;
};
