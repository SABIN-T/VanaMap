import {
    ArrowLeft,
    Send,
    Sparkles,
    Globe,
    ShieldCheck,
    Cpu,
    Activity,
    Brain,
    Zap,
    Gamepad2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './About.module.css';
import { Helmet } from 'react-helmet-async';

export const About = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Helmet>
                <title>About VanaMap | Precision Urban Ecosystems & AI Botany</title>
                <meta name="description" content="Learn about VanaMap's mission to merge technology and nature. Using AI, Monte Carlo simulations, and biophilic design to create healthier urban spaces." />
                <link rel="canonical" href="https://www.vanamap.online/about" />
            </Helmet>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={18} /> BACK TO DISCOVERY
            </button>

            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.topBadge}>
                        <Sparkles size={14} /> THE NEXT GENERATION OF BOTANY
                    </div>
                    <h1 className={styles.title}>Precision Urban <br /> Ecosystems.</h1>
                    <p className={styles.subtitle}>
                        VanaMap isn't just a platform—it's a high-performance simulation engine
                        designed to turn any urban space into a thriving bio-active sanctuary.
                    </p>
                </header>

                <div className={styles.grid}>
                    {/* Mission Card */}
                    <div className={`${styles.bentoCard} ${styles.large}`}>
                        <div className={styles.cardIcon}><Globe size={24} /></div>
                        <h3>Engineered for the Earth</h3>
                        <p>
                            In an era of rising urban density and ecological shift, we've built a bridge between
                            metropolitan life and biological intelligence. VanaMap empowers you to build
                            micro-ecosystems that don't just survive—they optimize your air, your mood,
                            and your life through data-driven accuracy.
                        </p>
                        <div className={styles.glow}></div>
                    </div>

                    {/* Monte Carlo Card */}
                    <div className={`${styles.bentoCard} ${styles.medium}`}>
                        <div className={styles.cardIcon}><Cpu size={24} /></div>
                        <h3>Monte Carlo Aptness</h3>
                        <p>
                            Our proprietary probabilistic engine runs 500 mini-simulations for every plant,
                            accounting for diurnal temperature swings and stochastic weather patterns
                            to ensure 99.9% biological reliability.
                        </p>
                    </div>

                    {/* AI Doctor Card */}
                    <div className={`${styles.bentoCard} ${styles.medium}`}>
                        <div className={styles.cardIcon}><Brain size={24} /></div>
                        <h3>AI Vision Diagnostics</h3>
                        <p>
                            An expert botanist in your pocket. Our neural-network powered AI Doctor
                            diagnoses over 120+ plant pathologies instantly via your camera.
                        </p>
                    </div>

                    {/* Simulation Card */}
                    <div className={`${styles.bentoCard} ${styles.large}`}>
                        <div className={styles.cardIcon}><Activity size={24} /></div>
                        <h3>Advanced Oxygen Analytics</h3>
                        <p>
                            Model your room's atmospheric balance with our real-time Room Lab.
                            We calculate metabolic production rates, accounting for respiration
                            cycles and nocturnal CAM photosynthesis for precise air quality targets.
                        </p>
                        <div className={styles.glow}></div>
                    </div>

                    {/* Gaming Card */}
                    <div className={`${styles.bentoCard} ${styles.small}`}>
                        <div className={styles.cardIcon}><Gamepad2 size={24} /></div>
                        <h3>The Heaven Ecosystem</h3>
                        <p>
                            Bio-gamification at its peak. Earn VanaCoins, cultivate virtual gardens,
                            and compete in the "Pot Designer" arena to unlock exclusive rewards
                            across our verified nursery network.
                        </p>
                    </div>

                    {/* 3D Card */}
                    <div className={`${styles.bentoCard} ${styles.small}`}>
                        <div className={styles.cardIcon}><Zap size={24} /></div>
                        <h3>3D Ecosystem Studio</h3>
                        <p>
                            Design your biophilic space in immersive 3D. Our WebGL integration
                            allows you to visualize plant growth, pot aesthetics, and spatial
                            layouts before the first seed is even planted.
                        </p>
                    </div>

                    {/* Sustainability Card */}
                    <div className={`${styles.bentoCard} ${styles.full}`}>
                        <div className={styles.cardIcon}><ShieldCheck size={24} /></div>
                        <h3>Hyper-Local, Ethics-First</h3>
                        <p>
                            By integrating Nominatim geolocation and a verified network of local
                            artisanal growers, we eliminate the carbon footprint of long-distance
                            shipping. Every plant you find is sourced from a professional who
                            understands your local climate as well as our algorithms do.
                        </p>
                    </div>
                </div>

                <section className={styles.statsSection}>
                    <div className={styles.statItem}>
                        <h4>500+</h4>
                        <p>MC Simulations / Plant</p>
                    </div>
                    <div className={styles.statItem}>
                        <h4>0.1s</h4>
                        <p>AI Diagnostic Latency</p>
                    </div>
                    <div className={styles.statItem}>
                        <h4>100%</h4>
                        <p>Ethical Sourcing</p>
                    </div>
                    <div className={styles.statItem}>
                        <h4>24/7</h4>
                        <p>Active Monitoring</p>
                    </div>
                </section>

                <div className={styles.ctaSection}>
                    <h2>Ready to optimize your space?</h2>
                    <Button onClick={() => navigate('/')} variant="primary" style={{ padding: '20px 48px', fontSize: '1.1rem' }}>
                        Launch Discovery <Send size={20} style={{ marginLeft: '12px' }} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
