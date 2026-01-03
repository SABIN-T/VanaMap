import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import styles from './InAppBrowserGuard.module.css';

export const InAppBrowserGuard = ({ children }: { children: React.ReactNode }) => {
    const [isInApp, setIsInApp] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        // Detect Instagram, Facebook, Messenger, LinkedIn in-app browsers
        const isInstagram = ua.indexOf('Instagram') > -1;
        const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
        const isLinkedIn = ua.indexOf('LinkedIn') > -1;

        if (isInstagram || isFacebook || isLinkedIn) {
            setIsInApp(true);
        }
    }, []);

    if (!isInApp || dismissed) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            <div className={styles.overlay}>
                <div className={styles.card}>
                    <div className={styles.iconWrapper}>
                        <ExternalLink size={32} />
                    </div>
                    <h2>Open in System Browser</h2>
                    <p>
                        Instagram's browser restricts location access needed for VanaMap.
                        <br /><br />
                        <strong>Tap the <span className={styles.dots}>•••</span> menu above and select "Open in browser" or "Open in Chrome/Safari".</strong>
                    </p>
                    <button className={styles.dismissBtn} onClick={() => setDismissed(true)}>
                        <X size={16} />
                        I'll try anyway
                    </button>
                    <div className={styles.arrow} />
                </div>
            </div>
        </>
    );
};
