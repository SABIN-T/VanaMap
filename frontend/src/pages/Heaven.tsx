import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Zap, ArrowRight, Star, Palette, Gamepad as GamepadIcon, Newspaper, Bot } from 'lucide-react';
import { useEffect } from 'react';
import styles from './Heaven.module.css';

export const Heaven = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not logged in OR if logged in but not premium/admin
        if (!user || (!user.isPremium && user.role !== 'admin')) {
            navigate('/premium');
        }
    }, [user, navigate]);

    if (!user || (!user.isPremium && user.role !== 'admin')) {
        return null;
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
                    {/* Make It Real */}
                    <div className={styles.card} onClick={() => navigate('/make-it-real')}>
                        <div className={styles.exclusiveBadge}>VanaMap+</div>
                        <div className={styles.cardIconBox}>
                            <Zap size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Make It Real</h3>
                        <p className={styles.cardText}>
                            Visualize plants in your space with advanced AR reality.
                            Recolor pots and see magic happen.
                        </p>
                        <button className={styles.cardAction}>
                            Launch AR <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Pot Designer */}
                    <div className={styles.card} onClick={() => navigate('/pot-designer')}>
                        <div className={styles.exclusiveBadge}>Studio</div>
                        <div className={styles.cardIconBox}>
                            <Palette size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Ceramic Studio</h3>
                        <p className={styles.cardText}>
                            Design and customize your own pots. Choose textures, colors, and finish
                            for your unique style.
                        </p>
                        <button className={styles.cardAction}>
                            Start Designing <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Kids Game */}
                    <div className={styles.card} onClick={() => navigate('/forest-game')}>
                        <div className={styles.exclusiveBadge}>Fun</div>
                        <div className={styles.cardIconBox}>
                            <GamepadIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Forest Guardian</h3>
                        <p className={styles.cardText}>
                            A fun way to learn about nature! Plant trees and grow your own
                            virtual digital sanctuary.
                        </p>
                        <button className={styles.cardAction}>
                            Play Now <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Daily News */}
                    <div className={styles.card} onClick={() => navigate('/daily-news')}>
                        <div className={styles.exclusiveBadge}>Fresh</div>
                        <div className={styles.cardIconBox}>
                            <Newspaper size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Botanical Digest</h3>
                        <p className={styles.cardText}>
                            Stay updated with the latest in plant science, gardening trends,
                            and environmental news.
                        </p>
                        <button className={styles.cardAction}>
                            Read News <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* AI Plant Doctor - NEW */}
                    <div className={styles.card} onClick={() => navigate('/ai-doctor')}>
                        <div className={styles.exclusiveBadge}>AI-Powered</div>
                        <div className={styles.cardIconBox}>
                            <Bot size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>AI Plant Doctor</h3>
                        <p className={styles.cardText}>
                            Chat with Dr. Flora, your AI botanical expert. Get instant advice on
                            plant care, diseases, and treatments.
                        </p>
                        <button className={styles.cardAction}>
                            Consult Now <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
