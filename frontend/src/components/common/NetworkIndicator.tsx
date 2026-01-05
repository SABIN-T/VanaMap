import React, { useState, useEffect } from 'react';
import { WifiOff, AlertTriangle, Wifi } from 'lucide-react';
import styles from './NetworkIndicator.module.css';

export const NetworkIndicator: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [statusType, setStatusType] = useState<'offline' | 'slow' | 'back-online'>('offline');

    useEffect(() => {
        const handleOnline = () => {
            setStatusType('back-online');
            setIsVisible(true);
            // Hide "back online" after 3 seconds
            setTimeout(() => setIsVisible(false), 3000);
        };

        const handleOffline = () => {
            setStatusType('offline');
            setIsVisible(true);
        };

        const updateConnection = () => {
            // @ts-expect-error - Network Information API
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                const isSlowConn = conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
                if (isSlowConn && navigator.onLine) {
                    setStatusType('slow');
                    setIsVisible(true);
                } else {
                    if (navigator.onLine && statusType === 'slow') {
                        setIsVisible(false);
                    }
                }
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Slow connection check
        // @ts-expect-error - Network Information API
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            conn.addEventListener('change', updateConnection);
            updateConnection();
        }

        // Initial state for offline
        if (!navigator.onLine) handleOffline();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (conn) conn.removeEventListener('change', updateConnection);
        };
    }, [statusType]);

    if (!isVisible) return null;

    const renderContent = () => {
        switch (statusType) {
            case 'offline':
                return (
                    <>
                        <div className={styles.iconWrapper}><WifiOff size={20} /></div>
                        <div className={styles.textWrapper}>
                            <span className={styles.title}>You are offline</span>
                            <span className={styles.desc}>Check your internet connection.</span>
                        </div>
                    </>
                );
            case 'slow':
                return (
                    <>
                        <div className={styles.iconWrapper}><AlertTriangle size={20} /></div>
                        <div className={styles.textWrapper}>
                            <span className={styles.title}>Slow connection</span>
                            <span className={styles.desc}>Optimizing experience for low bandwidth.</span>
                        </div>
                    </>
                );
            case 'back-online':
                return (
                    <>
                        <div className={styles.iconWrapper} style={{ backgroundColor: '#10b981' }}><Wifi size={20} /></div>
                        <div className={styles.textWrapper}>
                            <span className={styles.title} style={{ color: '#10b981' }}>Back Online</span>
                            <span className={styles.desc}>Connection restored successfully.</span>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className={`${styles.container} ${styles[statusType]}`}>
            <div className={styles.content}>
                {renderContent()}
            </div>
            {statusType !== 'back-online' && (
                <div className={styles.reconnecting}>
                    <div className={styles.dot} />
                    <span>Monitoring...</span>
                </div>
            )}
        </div>
    );
};
