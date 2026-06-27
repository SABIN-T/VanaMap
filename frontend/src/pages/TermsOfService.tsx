import { ArrowLeft, Scale, ShieldAlert, Heart, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './LegalPages.module.css';
import { Helmet } from 'react-helmet-async';

export const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Terms of Service | VanaMap</title>
                <meta name="description" content="Review VanaMap's Terms of Service to understand user rules, vendor regulations, and platform compliance." />
            </Helmet>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={18} /> BACK TO DISCOVERY
            </button>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.topBadge}>
                        <Scale size={14} /> Agreement
                    </div>
                    <h1 className={styles.title}>Terms of Service</h1>
                    <p className={styles.subtitle}>
                        Last Updated: June 27, 2026. Please read this agreement before using Earth's Digital Botanical Archive.
                    </p>
                </header>

                <div className={styles.legalBody}>
                    <section>
                        <h2><Sprout size={20} color="var(--color-primary)" /> 1. Platform & Service Scope</h2>
                        <p>
                            VanaMap provides real-time botanical archiving, Monte Carlo simulation scoring for plant suitability, and connects local growers/nurseries with urban gardening consumers.
                        </p>
                        <ul>
                            <li>Users must be at least 18 years of age or access under parental guidance.</li>
                            <li>You agree to provide accurate, up-to-date registration information to secure platform integrity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><Heart size={20} color="var(--color-primary)" /> 2. Vendor Rules & Code of Conduct</h2>
                        <p>
                            If you list flora as a registered partner vendor on VanaMap, you commit to maintaining professional quality standards:
                        </p>
                        <ul>
                            <li>All plant species descriptions, health statuses, and pricing information must be accurate.</li>
                            <li>Selling invasive plant species prohibited by state/federal conservation authorities is strictly forbidden.</li>
                            <li>Vendors are responsible for fulfilling order requests and coordinating delivery details with customers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><ShieldAlert size={20} color="var(--color-primary)" /> 3. Intellectual Property & Simulation Limits</h2>
                        <p>
                            The algorithms, Monte Carlo mathematical logic, brand design, and site assets are property of VanaMap:
                        </p>
                        <ul>
                            <li>Our "Aptness" score model provides predictive estimations based on weather inputs and is not an absolute biological guarantee of a plant's survival.</li>
                            <li>Users agree not to scrape, reverse engineer, or script mass extraction of VanaMap's digital botanical indexes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><Scale size={20} color="var(--color-primary)" /> 4. Liability & Termination</h2>
                        <p>
                            We reserve the right to suspend accounts that violate safety norms or engage in fraudulent activities:
                        </p>
                        <p>
                            VanaMap is not liable for indirect biological failures, unexpected local weather shifts, or transaction disputes between independent vendors and purchasers.
                        </p>
                        <p>
                            These terms shall be governed by the laws of India. Any litigation will be subject to exclusive jurisdiction in local courts.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
