import { useState, useEffect } from 'react';
import { MapPin, Bell, Camera, ShieldCheck, Info, Bot } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PermissionCenter.module.css';
import toast from 'react-hot-toast';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export const PermissionCenter = () => {
    const [geo, setGeo] = useState<PermissionState>('prompt');
    const [notif, setNotif] = useState<PermissionState>('prompt');
    const [cam, setCam] = useState<PermissionState>('prompt');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Only show on Home page
    if (location.pathname !== '/' && !isOpen) {
        return null;
    }

    const checkPermissions = async () => {
        // Geolocation
        if ('permissions' in navigator) {
            try {
                const geoStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                setGeo(geoStatus.state as PermissionState);
                geoStatus.onchange = () => setGeo(geoStatus.state as PermissionState);
            } catch (e) { setGeo('unsupported'); }

            // Notifications
            try {
                if ('Notification' in window) {
                    const state = Notification.permission;
                    setNotif(state === 'default' ? 'prompt' : state as PermissionState);
                } else {
                    setNotif('unsupported');
                }
            } catch (e) { setNotif('unsupported'); }

            // Camera (Not queryable via permissions API in all browsers, so we assume prompt)
            try {
                const camStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
                setCam(camStatus.state as PermissionState);
                camStatus.onchange = () => setCam(camStatus.state as PermissionState);
            } catch (e) {
                // Fallback for camera
                setCam('prompt');
            }
        }
    };

    useEffect(() => {
        checkPermissions();

        const handleToggle = () => setIsOpen(true);
        window.addEventListener('toggleVanaPermissions', handleToggle);
        return () => window.removeEventListener('toggleVanaPermissions', handleToggle);
    }, []);

    const requestGeo = () => {
        navigator.geolocation.getCurrentPosition(
            () => { setGeo('granted'); toast.success("Location Synced!"); },
            () => { setGeo('denied'); toast.error("Location Access Denied"); }
        );
    };

    const requestNotif = () => {
        if (!('Notification' in window)) return;
        Notification.requestPermission().then(permission => {
            setNotif(permission === 'default' ? 'prompt' : permission as PermissionState);
        });
    };

    const requestCam = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
                setCam('granted');
            })
            .catch(() => setCam('denied'));
    };

    const getStatusStyle = (state: PermissionState) => {
        switch (state) {
            case 'granted': return styles.statusGranted;
            case 'denied': return styles.statusDenied;
            case 'prompt': return styles.statusPrompt;
            default: return styles.statusUnsupported;
        }
    };

    if (!isOpen) {
        return (
            <>
                {/* AI Doctor Bot Button */}
                <button
                    className={styles.aiFab}
                    onClick={() => navigate('/admin/ai-doctor')}
                    title="AI Plant Doctor"
                >
                    <Bot size={20} />
                    <span className={styles.fabText}>AI Doctor</span>
                </button>

                {/* Permissions Button */}
                <button className={styles.fab} onClick={() => setIsOpen(true)} title="Permissions">
                    <ShieldCheck size={20} />
                    <span className={styles.fabText}>Permissions</span>
                </button>
            </>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <ShieldCheck className={styles.headerIcon} />
                        <div>
                            <h2>System Permissions</h2>
                            <p>Manage how VanaMap accesses your device</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className={styles.content}>
                    {/* Geolocation */}
                    <div className={styles.item}>
                        <div className={styles.itemIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <MapPin size={22} color="#10b981" />
                        </div>
                        <div className={styles.itemDetails}>
                            <h3>Real-time Location</h3>
                            <p>Required for Plant Aptness scores and finding nearby shops.</p>
                            <span className={getStatusStyle(geo)}>{geo.toUpperCase()}</span>
                        </div>
                        {geo !== 'granted' && geo !== 'unsupported' && (
                            <button onClick={requestGeo} className={styles.actionBtn}>Enable</button>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className={styles.item}>
                        <div className={styles.itemIcon} style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
                            <Bell size={22} color="#38bdf8" />
                        </div>
                        <div className={styles.itemDetails}>
                            <h3>Live Notifications</h3>
                            <p>Get alerted about rare species and order updates.</p>
                            <span className={getStatusStyle(notif)}>{notif.toUpperCase()}</span>
                        </div>
                        {notif !== 'granted' && notif !== 'unsupported' && (
                            <button onClick={requestNotif} className={styles.actionBtn}>Enable</button>
                        )}
                    </div>

                    {/* Camera */}
                    <div className={styles.item}>
                        <div className={styles.itemIcon} style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                            <Camera size={22} color="#a855f7" />
                        </div>
                        <div className={styles.itemDetails}>
                            <h3>Vision & AR</h3>
                            <p>Necessary for the 'Make It Real' AR plant preview.</p>
                            <span className={getStatusStyle(cam)}>{cam.toUpperCase()}</span>
                        </div>
                        {cam !== 'granted' && cam !== 'unsupported' && (
                            <button onClick={requestCam} className={styles.actionBtn}>Enable</button>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.infoBox}>
                        <Info size={16} />
                        <p>
                            <b>Mobile Shortcut:</b> Long-press the app icon (touch for a second) {'>'} Site Settings.<br />
                            Or enable in <b>Browser {'>'} Site Settings</b>.
                        </p>
                    </div>
                    <button className={styles.finishBtn} onClick={() => setIsOpen(false)}>Done</button>
                </div>
            </div>
        </div>
    );
};
