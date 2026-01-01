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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '300px' }}>
                                <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px' }}>
                                    <MapPin size={24} className="text-amber-600" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#92400e' }}>GPS Access Blocked</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#b45309', lineHeight: 1.4 }}>
                                        To see Survival Matches: <br />
                                        <strong>Mobile:</strong> Long-press app icon (Site Settings) OR check Browser Settings {'>'} Location.<br />
                                        <strong>Desktop:</strong> Click the <b>Lock</b> icon next to URL.
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        <button
                                            onClick={() => {
                                                toast.dismiss(t.id);
                                                sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                                            }}
                                            style={{
                                                background: '#f59e0b',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            I'll Fix It
                                        </button>
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            style={{
                                                background: 'transparent',
                                                color: '#b45309',
                                                border: '1px solid #f59e0b',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ), { duration: 15000, position: 'top-center' });
                        sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                    } else if (status.state === 'prompt') {
                        toast((t) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '4px' }}>
                                <div className="animate-pulse" style={{ background: '#d1fae5', padding: '12px', borderRadius: '50%' }}>
                                    <MapPin size={24} className="text-emerald-600" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#064e3b' }}>Connect to Local Climate?</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#065f46', opacity: 0.9 }}>
                                        Enable location in your <b>Browser Settings</b> to unlock precision data.
                                    </p>
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            navigator.geolocation.getCurrentPosition(
                                                () => toast.success("Satellites Synced!"),
                                                () => toast.error("Access blocked. Check Browser Settings.")
                                            );
                                            sessionStorage.setItem('vanamap_location_nagged_v4', 'true');
                                        }}
                                        style={{
                                            marginTop: '10px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                            display: 'block',
                                            width: '100%'
                                        }}
                                    >
                                        Allow Location Prompt
                                    </button>
                                </div>
                            </div>
                        ), { duration: 20000, position: 'bottom-center' });
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
