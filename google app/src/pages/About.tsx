import { ArrowLeft, Send, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './About.module.css';

export const About = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <button onClick={() => navigate('/')} className={styles.backBtn}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h1 className={styles.title}>About VanaMap</h1>
                    <p className={styles.subtitle}>The Future of Urban Ecosystems</p>
                </header>

                <section className={styles.section}>
                    <h2><Globe className={styles.icon} /> Our Mission</h2>
                    <p>
                        VanaMap is more than just a plant finder; it is a smart ecosystem simulator designed to bridge the gap between urban living and nature.
                        In an era of increasing pollution and disconnect from the environment, our mission is to empower individuals to build their own micro-ecosystems.
                        We use data-driven insights to match the perfect bio-active plants to your specific location, air quality index (AQI), and lifestyle.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2><Sparkles className={styles.icon} /> Technology & Innovation</h2>
                    <p>
                        Built with cutting-edge web technologies, VanaMap integrates real-time weather APIs, air quality sensors, and a botanical database to provide:
                    </p>
                    <ul className={styles.list}>
                        <li>**AI Plant Doctor**: Diagnose plant health issues instantly using our computer vision AI.</li>
                        <li>**Oxygen Simulation**: Calculate the metabolic rate and oxygen output of your indoor garden.</li>
                        <li>**Smart Aptness Algorithm**: Matching plants based on 30-day historical weather patterns of your city.</li>
                        <li>**Hyper-local Sourcing**: A verified network of local nurseries and garden centers to source your plants sustainably.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2><ShieldCheck className={styles.icon} /> Commitment to Sustainability</h2>
                    <p>
                        We are a "Green-First" platform. We prioritize native species that support local biodiversity and partner exclusively with ethical growers.
                        VanaMap is maintained by a dedicated team of developers, botanists, and environmental enthusiasts committed to a greener Earth.
                    </p>
                </section>

                <div className={styles.footer}>
                    <h3>Join the Movement</h3>
                    <p>Start your journey towards a cleaner, greener home today.</p>
                    <Button onClick={() => navigate('/')} variant="primary">
                        Explore Plants <Send size={16} style={{ marginLeft: '8px' }} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
