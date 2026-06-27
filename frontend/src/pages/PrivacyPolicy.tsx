import { ArrowLeft, Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './LegalPages.module.css';
import { Helmet } from 'react-helmet-async';

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Privacy Policy | VanaMap</title>
                <meta name="description" content="Read VanaMap's privacy policy to understand how we secure your botanical research, account data, and real-time geolocations." />
            </Helmet>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={18} /> BACK TO DISCOVERY
            </button>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.topBadge}>
                        <Shield size={14} /> Data Protection
                    </div>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.subtitle}>
                        Last Updated: June 27, 2026. Learn how we handle and protect your digital footprint on the archive.
                    </p>
                </header>

                <div className={styles.legalBody}>
                    <section>
                        <h2><Eye size={20} color="var(--color-primary)" /> 1. Information We Collect</h2>
                        <p>
                            We collect variables necessary to power the biophilic calculation systems, real-time location services, and authentication routines:
                        </p>
                        <ul>
                            <li><strong>Account Data:</strong> Display name, email address, password hashes, and user roles (nursery vendors or customers).</li>
                            <li><strong>Sensor & Geolocation Data:</strong> GPS coordinates (latitude and longitude) to calculate botanical compatibility / Aptness scores and trace nearby verified nurseries.</li>
                            <li><strong>Environmental Inputs:</strong> Humidity levels, temperature, and light conditions inputs used for localized simulation modeling.</li>
                            <li><strong>Commercial Transactions:</strong> Contact information, shipping addresses, and cart purchase histories to facilitate checkout flows.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><Lock size={20} color="var(--color-primary)" /> 2. How We Secure Your Data</h2>
                        <p>
                            Security is woven into VanaMap's core architecture:
                        </p>
                        <ul>
                            <li>Passwords are salted and cryptographically hashed at the database layer (BCrypt hashing).</li>
                            <li>All telemetry and API transactions are encrypted in transit using Transport Layer Security (TLS 1.3 / HTTPS).</li>
                            <li>Geolocation parameters are stored only within the active browser session (SessionStorage) to prevent background tracking or permanent surveillance history.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><RefreshCw size={20} color="var(--color-primary)" /> 3. Data Transfers and Sharing</h2>
                        <p>
                            We do not trade, monetize, or transfer your metadata to third-party brokers. Data sharing is limited to functional APIs required for the service:
                        </p>
                        <ul>
                            <li><strong>Map and Geocoding APIs:</strong> Nominatim (OpenStreetMap) and Open-Meteo to resolve weather and street coordinates for local nurseries.</li>
                            <li><strong>Payment Processors:</strong> Secured payment gateways (e.g. Razorpay/Stripe) to process subscription tokens and retail botanical checkout.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><FileText size={20} color="var(--color-primary)" /> 4. Your Rights & Redressal</h2>
                        <p>
                            Under modern protection framework mandates (including India's Digital Personal Data Protection Act - DPDP), you reserve full autonomy:
                        </p>
                        <ul>
                            <li>The right to withdraw sensor permission prompts at any time via the browser Settings.</li>
                            <li>The right to request immediate erasure of your credentials and store history from VanaMap's production database.</li>
                            <li>The right to access and export your cataloged plant archives.</li>
                        </ul>
                        <p>
                            For inquiries, compliance audits, or data purge requests, please contact our privacy compliance desk at <strong>support@vanamap.online</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
