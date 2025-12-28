import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';
import styles from './Premium.module.css';

export const Premium = () => {
    const navigate = useNavigate();

    const handleSubscribe = (plan: string) => {
        // In a real app, this would redirect to Stripe/Payment Gateway
        console.log(`User selected plan: ${plan}`);
        navigate('/auth?view=signup');
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Background */}
            <div className={`${styles.bgOrb} ${styles.orb1}`} />
            <div className={`${styles.bgOrb} ${styles.orb2}`} />
            <div className={`${styles.bgOrb} ${styles.orb3}`} />

            <div className={styles.content}>
                <header className={styles.header}>
                    <span className={styles.titleBadge}>VanaMap Premium</span>
                    <h1 className={styles.titleMain}>Unlock the Ultimate<br />Nature Experience</h1>
                    <p className={styles.titleSub}>
                        Join thousands of plant enthusiasts who have taken their gardening journey to the next level with our exclusive tools and features.
                    </p>
                </header>

                <div className={styles.pricingGrid}>
                    {/* Free Tier */}
                    <div className={styles.card} style={{ animationDelay: '0.1s' }}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.planName}>Sprout</h3>
                            <div className={styles.planPrice}>$0<span>/mo</span></div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Basic Plant Search</li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Community Forum Access</li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> 3 Saved Plants</li>
                        </ul>
                        <button onClick={() => handleSubscribe('free')} className={styles.ctaBtn}>
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className={`${styles.card} ${styles.popularCard}`} style={{ animationDelay: '0.2s' }}>
                        <div className={styles.popularBadge}>Most Popular</div>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.planName}>Botanist</h3>
                            <div className={styles.planPrice}>$9<span>/mo</span></div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.featureItem}><Star size={18} className={styles.checkIcon} /> <strong>Everything in Sprout</strong></li>
                            <li className={styles.featureItem}><Zap size={18} className={styles.checkIcon} /> Unlimited Plant Identification</li>
                            <li className={styles.featureItem}><Shield size={18} className={styles.checkIcon} /> Advanced Care Guides</li>
                            <li className={styles.featureItem}><Crown size={18} className={styles.checkIcon} /> <strong>Heaven Access</strong> (Games, News)</li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Priority Support</li>
                        </ul>
                        <button onClick={() => handleSubscribe('pro')} className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}>
                            Start 7-Day Free Trial
                        </button>
                    </div>

                    {/* Business Tier */}
                    <div className={styles.card} style={{ animationDelay: '0.3s' }}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.planName}>Nursery</h3>
                            <div className={styles.planPrice}>$29<span>/mo</span></div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> <strong>Everything in Botanist</strong></li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Vendor Dashboard</li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Bulk Inventory Upload</li>
                            <li className={styles.featureItem}><Check size={18} className={styles.checkIcon} /> Analytics & Insights</li>
                        </ul>
                        <button onClick={() => handleSubscribe('business')} className={styles.ctaBtn}>
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
