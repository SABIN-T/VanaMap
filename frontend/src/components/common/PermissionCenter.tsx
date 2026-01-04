import { useState, useEffect, useCallback } from 'react';
import { MapPin, Bell, Camera, ShieldCheck, Info, Bot, Mic, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PermissionCenter.module.css';
import toast from 'react-hot-toast';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export const PermissionCenter = () => {
    const [geo, setGeo] = useState<PermissionState>('prompt');
    const [notif, setNotif] = useState<PermissionState>('prompt');
    const [cam, setCam] = useState<PermissionState>('prompt');
    const [mic, setMic] = useState<PermissionState>('prompt');
    const [isOpen, setIsOpen] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const checkPermissions = useCallback(async () => {
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

            // Camera & Mic
            try {
                const camStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
                setCam(camStatus.state as PermissionState);
                camStatus.onchange = () => setCam(camStatus.state as PermissionState);
            } catch (e) { setCam('prompt'); }

            try {
                const micStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                setMic(micStatus.state as PermissionState);
                micStatus.onchange = () => setMic(micStatus.state as PermissionState);
            } catch (e) { setMic('prompt'); }
        }
    }, []);

    useEffect(() => {
        // Detect Standalone Mode
        const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
        setIsStandalone(!!standalone);

        checkPermissions();

        // Auto-open if standalone and hasn't granted major permissions
        if (standalone) {
            const hasInitialized = localStorage.getItem('vanamap_setup_complete');
            if (!hasInitialized) {
                setIsOpen(true);
            }
        }

        const handleToggle = () => setIsOpen(true);
        window.addEventListener('toggleVanaPermissions', handleToggle);
        return () => window.removeEventListener('toggleVanaPermissions', handleToggle);
    }, [checkPermissions]);

    const requestGeo = async () => {
        return new Promise<boolean>((resolve) => {
            navigator.geolocation.getCurrentPosition(
                () => { setGeo('granted'); toast.success("Location Synced!"); resolve(true); },
                () => { setGeo('denied'); toast.error("Location Access Denied"); resolve(false); }
            );
        });
    };

    const requestNotif = async () => {
        if (!('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        setNotif(permission === 'default' ? 'prompt' : permission as PermissionState);
        return permission === 'granted';
    };

    const requestCam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCam('granted');
            return true;
        } catch (e) {
            setCam('denied');
            return false;
        }
    };

    const requestMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setMic('granted');
            return true;
        } catch (e) {
            setMic('denied');
            return false;
        }
    };

    const grantAll = async () => {
        const toastId = toast.loading("Configuring System...");
        try {
            await requestGeo();
            await requestCam();
            await requestMic();
            await requestNotif();
            toast.success("All Systems Go! 🚀", { id: toastId });
            localStorage.setItem('vanamap_setup_complete', 'true');
        } catch (err) {
            toast.error("Some permissions were skipped.", { id: toastId });
        }
    };

    const getStatusStyle = (state: PermissionState) => {
        switch (state) {
            case 'granted': return styles.statusGranted;
            case 'denied': return styles.statusDenied;
            case 'prompt': return styles.statusPrompt;
            default: return styles.statusUnsupported;
        }
    };

    // Only show on Home page (unless modal is open)
    // Moving this check AFTER all hooks to prevent "Rendered fewer hooks than expected" error
    if (location.pathname !== '/' && !isOpen) {
        return null;
    }

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
                        <div>
                            <h2>{isStandalone ? 'App Configuration' : 'System Permissions'}</h2>
                            <p>{isStandalone ? 'Initialize VanaMap for your device' : 'Manage how VanaMap accesses your device'}</p>
                        </div>
                    </div>
                    {geo === 'granted' && cam === 'granted' && mic === 'granted' && (
                        <CheckCircle2 color="#10b981" />
                    )}
                </div>

                <div className={styles.content}>
                    {/* Grant All Header (PWA Mode) */}
                    {isStandalone && (geo !== 'granted' || cam !== 'granted' || mic !== 'granted') && (
                        <div className={styles.setupHero}>
                            <Bot size={40} color="#10b981" />
                            <h3>Full Access Required</h3>
                            <p>To operate as a native app, VanaMap needs permission to use your sensors.</p>
                            <button onClick={grantAll} className={styles.grantAllBtn}>
                                Grant All Permissions ⚡
                            </button>
                        </div>
                    )}
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

                    {/* Microphone */}
                    <div className={styles.item}>
                        <div className={styles.itemIcon} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                            <Mic size={22} color="#ef4444" />
                        </div>
                        <div className={styles.itemDetails}>
                            <h3>Voice Control</h3>
                            <p>Speak to the AI Doctor and use voice commands.</p>
                            <span className={getStatusStyle(mic)}>{mic.toUpperCase()}</span>
                        </div>
                        {mic !== 'granted' && mic !== 'unsupported' && (
                            <button onClick={requestMic} className={styles.actionBtn}>Enable</button>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.infoBox}>
                        <Info size={16} />
                        <p>
                            {isStandalone
                                ? "Permissions are stored in your device's app settings. Long-press the icon to manage."
                                : "Permissions are managed by your browser. You can reset them in the URL bar settings."}
                        </p>
                    </div>
                    <button className={styles.finishBtn} onClick={() => {
                        setIsOpen(false);
                        localStorage.setItem('vanamap_setup_complete', 'true');
                    }}>
                        {isStandalone ? 'Finish Setup' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
};
