
import { AdminLayout } from './AdminLayout';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, ShieldCheck, Zap, Globe, Layout, Smartphone } from 'lucide-react';
import styles from './Premium.module.css';

export const Premium = () => {
    const { isPremium, togglePremium } = useTheme();

    return (
        <AdminLayout title="Premium Experience">
            <div className={styles.container}>
                <div className={styles.hero}>
                    <h1 className={styles.title}>The Next Generation UI</h1>
                    <p className={styles.subtitle}>
                        Experience VanaMap like never before. High-performance rendering,
                        advanced animations, and a premium aesthetic designed for power users.
                    </p>

                    <div className={styles.toggleSection}>
                        <span className={styles.toggleLabel}>Standard Mode</span>
                        <div
                            className={`${styles.toggleWrapper} ${isPremium ? styles.active : ''}`}
                            onClick={togglePremium}
                        >
                            <div className={styles.slider}>
                                <Sparkles size={20} color={isPremium ? '#10b981' : '#64748b'} />
                            </div>
                        </div>
                        <span className={styles.toggleLabel} style={{ color: isPremium ? '#10b981' : '#94a3b8' }}>Premium Mode</span>
                    </div>
                </div>

                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconBox}><Zap size={30} /></div>
                        <h3 className={styles.featureTitle}>GPU Accelerated</h3>
                        <p className={styles.featureDesc}>
                            Smooth 60fps animations and transitions across all devices using
                            hardware acceleration and optimized CSS engines.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.iconBox} style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}><Layout size={30} /></div>
                        <h3 className={styles.featureTitle}>Glassmorphism v3</h3>
                        <p className={styles.featureDesc}>
                            Ultra-modern translucency effects with multi-layered backdrops
                            and dynamic lighting that reacts to your interactions.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.iconBox} style={{ color: '#818cf8', background: 'rgba(129, 140, 248, 0.1)' }}><Smartphone size={30} /></div>
                        <h3 className={styles.featureTitle}>Mobile Perfection</h3>
                        <p className={styles.featureDesc}>
                            Pixel-perfect responsive layouts that adapt seamlessly from
                            large 4K monitors down to the smallest mobile screens.
                        </p>
                    </div>
                </div>

                <div className={styles.featureGrid} style={{ marginTop: '2rem' }}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconBox} style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.1)' }}><ShieldCheck size={30} /></div>
                        <h3 className={styles.featureTitle}>Enterprise Logic</h3>
                        <p className={styles.featureDesc}>
                            Under-the-hood stability improvements that ensure data integrity
                            even during rapid UI state changes and heavy computations.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.iconBox} style={{ color: '#fb923c', background: 'rgba(251, 146, 60, 0.1)' }}><Globe size={30} /></div>
                        <h3 className={styles.featureTitle}>Edge Performance</h3>
                        <p className={styles.featureDesc}>
                            Network-first strategies combined with intelligent pre-fetching
                            to make the Premium experience feel instantaneous.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
