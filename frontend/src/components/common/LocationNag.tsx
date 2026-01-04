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
                    const hasNagged = sessionStorage.getItem('vanamap_location_nagged_v4');
                    if (hasNagged) return;

                    if (status.state === 'denied') {
                        toast((t) => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                maxWidth: 'calc(100vw - 2rem)',
                                fontSize: '0.85rem'
                            }}>
                                <div style={{
                                    background: '#fef3c7',
                                    padding: '8px',
                                    borderRadius: '10px',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={20} className="text-amber-600" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        color: '#92400e'
                                    }}>GPS Access Blocked</p>
                                    <p style={{
                                        margin: '4px 0',
                                        fontSize: '0.75rem',
                                        color: '#b45309',
                                        lineHeight: 1.3
                                    }}>
                                        <strong>Mobile:</strong> Long-press app icon → Site Settings<br />
                                        <strong>Desktop:</strong> Click Lock icon next to URL
                                    </p>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                        <button
                                            onClick={() => {
                                                toast.dismiss(t.id);
                                                sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                                            }}
                                            style={{
                                                background: '#f59e0b',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Got It
                                        </button>
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            style={{
                                                background: 'transparent',
                                                color: '#b45309',
                                                border: '1px solid #f59e0b',
                                                padding: '5px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ), { duration: 12000, position: 'bottom-center', style: { marginBottom: '80px' } });
                        sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                    } else if (status.state === 'prompt') {
                        toast((t) => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '4px',
                                maxWidth: 'calc(100vw - 2rem)'
                            }}>
                                <div className="animate-pulse" style={{
                                    background: '#d1fae5',
                                    padding: '10px',
                                    borderRadius: '50%',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={20} className="text-emerald-600" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        color: '#064e3b'
                                    }}>Enable Location?</p>
                                    <p style={{
                                        margin: '4px 0',
                                        fontSize: '0.75rem',
                                        color: '#065f46',
                                        opacity: 0.9,
                                        lineHeight: 1.3
                                    }}>
                                        Get climate data for your area
                                    </p>
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            navigator.geolocation.getCurrentPosition(
                                                () => toast.success("Location enabled!"),
                                                () => toast.error("Access blocked. Check settings.")
                                            );
                                            sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                                        }}
                                        style={{
                                            marginTop: '8px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '7px 16px',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                            display: 'block',
                                            width: '100%'
                                        }}
                                    >
                                        Allow Location
                                    </button>
                                </div>
                            </div>
                        ), { duration: 15000, position: 'bottom-center', style: { marginBottom: '80px' } });
                        sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
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
