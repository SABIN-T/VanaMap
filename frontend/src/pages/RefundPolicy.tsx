import { ArrowLeft, RefreshCcw, Landmark, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './LegalPages.module.css';
import { Helmet } from 'react-helmet-async';

export const RefundPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Refund & Cancellation Policy | VanaMap</title>
                <meta name="description" content="Review VanaMap's guidelines on order cancellations, live plant return policies, and payout terms." />
            </Helmet>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={18} /> BACK TO DISCOVERY
            </button>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.topBadge}>
                        <RefreshCcw size={14} /> Returns & Payouts
                    </div>
                    <h1 className={styles.title}>Refund & Cancellation</h1>
                    <p className={styles.subtitle}>
                        Last Updated: June 27, 2026. Review rules for cancellation, refunds, and live plant transit returns.
                    </p>
                </header>

                <div className={styles.legalBody}>
                    <section>
                        <h2><AlertCircle size={20} color="var(--color-primary)" /> 1. Order Cancellation Policy</h2>
                        <p>
                            Purchasers can request free cancellations on order selections within the cancellation window:
                        </p>
                        <ul>
                            <li><strong>Standard Orders:</strong> Cancellations are permitted within 2 hours of payment confirmation or before the partner nursery dispatches the botanical package.</li>
                            <li>Once the plant shipment leaves the local nursery, cancellations cannot be processed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><RefreshCcw size={20} color="var(--color-primary)" /> 2. Live Plants Returns Policy</h2>
                        <p>
                            Because plants are live perishables subject to transport stress, standard physical returns are restricted:
                        </p>
                        <ul>
                            <li><strong>Damaged on Arrival:</strong> If your plant arrives severe-wilted, damaged, or infected, please file a support claim within 24 hours of delivery.</li>
                            <li>Include high-resolution photographs showing the packaging status and the specific root or foliage damage.</li>
                            <li>Minor transport cosmetic details (such as single dry leaves or normal soil displacement) are standard and do not warrant refunds.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><Landmark size={20} color="var(--color-primary)" /> 3. Refund Timelines</h2>
                        <p>
                            Once a refund claim is authorized and verified by our Support Desk:
                        </p>
                        <ul>
                            <li>Approved refund amounts are automatically credited to the original transaction instrument.</li>
                            <li>Funds generally take 5 to 7 bank business days to clear and show on credit statements, depending on bank regulations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2><ShieldCheck size={20} color="var(--color-primary)" /> 4. Customer Support Contact</h2>
                        <p>
                            To coordinate claims, submit transport damage reports, or seek updates on pending claims, please connect with us at:
                        </p>
                        <p>
                            <strong>Email:</strong> support@vanamap.online<br />
                            <strong>Response Time:</strong> Typically within 24 to 48 business hours.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
