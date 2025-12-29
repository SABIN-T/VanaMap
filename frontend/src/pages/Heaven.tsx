import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Sparkles, Zap, Sprout, ArrowRight, Star } from 'lucide-react';
import { useEffect } from 'react';
import styles from './Heaven.module.css';

export const Heaven = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user.isPremium && user.role !== 'admin') {
            navigate('/premium');
        }
    }, [user, navigate]);

    if (!user || (!user.isPremium && user.role !== 'admin')) {
        return <div className="min-h-screen bg-slate-900" />; // Or redirect handled by effect
    }

    return (
        <div className={styles.container}>
            {/* Ambient Background */}
            <div className={styles.particles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Hero */}
                <header className={styles.hero}>
                    <Crown size={64} className={`${styles.crownIcon} text-yellow-400`} strokeWidth={1} />
                    <h1 className={styles.title}>HEAVEN</h1>
                    <h2 className={styles.subtitle}>The Sanctuary for Elite Botanists</h2>

                    <div className={styles.welcomeBanner}>
                        <Star size={20} className="text-yellow-400 animate-pulse" />
                        <div>
                            <span className="text-slate-400 text-sm">Welcome back,</span>
                            <div className={styles.welcomeUser}>{user.name}</div>
                        </div>
                    </div>

                    <p className={styles.description}>
                        "You contain all this and you can do all these." <br />
                        Unlock the deepest secrets of nature with tools designed for the chosen few.
                    </p>
                </header>

                {/* Exclusive Features Grid */}
                <div className={styles.grid}>
                    {/* Feature 1 */}
                    <div className={styles.card}>
                        <div className={styles.exclusiveBadge}>Premium</div>
                        <div className={styles.cardIconBox}>
                            <Sprout size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Rare Plant Index</h3>
                        <p className={styles.cardText}>
                            Gain early access to the world's most exotic and endangered species database.
                            Updated daily by our master botanists.
                        </p>
                        <button className={styles.cardAction}>
                            Explore Index <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Feature 2 */}
                    <div className={styles.card}>
                        <div className={styles.exclusiveBadge}>Beta</div>
                        <div className={styles.cardIconBox}>
                            <Sparkles size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>AI Vision Pro</h3>
                        <p className={styles.cardText}>
                            Next-gen diagnostics with 99.9% accuracy. Analyze plant health, soil conditions,
                            and local pest threats in real-time.
                        </p>
                        <button className={styles.cardAction}>
                            Start Scan <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Feature 3 */}
                    <div className={styles.card}>
                        <div className={styles.exclusiveBadge}>VanaMap+</div>
                        <div className={styles.cardIconBox}>
                            <Zap size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Direct Vendor Link</h3>
                        <p className={styles.cardText}>
                            Concierge service for purchasing. Skip the queues and reserve rare stock
                            directly from top-rated nurseries.
                        </p>
                        <button className={styles.cardAction}>
                            View Requests <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
