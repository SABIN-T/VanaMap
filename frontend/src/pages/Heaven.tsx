import { useState, useEffect, type MouseEvent } from 'react';
import { Sprout, CloudRain, Coins, Volume2, VolumeX, Sparkles, Heart, Info, Newspaper, Recycle, ArrowLeft, LockKeyhole, Gamepad2, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Heaven.module.css';
import confetti from 'canvas-confetti';
import { updateGameProgress } from '../services/api';
import toast from 'react-hot-toast';
import { PotMaker } from '../components/features/games/PotMaker';

interface PlantState {
    id: number;
    stage: number;
    type: string;
    water: number;
    timeToNextStage: number;
}

const PLANT_TYPES = [
    { name: 'Sunflower', stages: ['🕳️', '🌰', '🌱', '🌿', '🌻'], reward: 50 },
    { name: 'Rose', stages: ['🕳️', '🌰', '🌱', '🌿', '🌹'], reward: 60 },
    { name: 'Tree', stages: ['🕳️', '🌰', '🌱', '🌳', '🍎'], reward: 100 },
    { name: 'Cactus', stages: ['🕳️', '🌰', '🌵', '🌵', '🌸'], reward: 80 }
];

export const Heaven = () => {
    // Auth State
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // Hub State
    const [view, setView] = useState<'menu' | 'game' | 'lifecycle' | 'news' | 'pot-maker'>('menu');

    // --- AUTH GATE ---
    if (loading) return <div className={styles.pageWrapper}><div style={{ margin: 'auto', color: 'white' }}>Loading Heaven...</div></div>;

    if (!user) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.sky}>
                    <CloudRain size={120} className={styles.cloud} style={{ top: '10%', left: '-10%', opacity: 0.4 }} />
                    <CloudRain size={80} className={styles.cloud} style={{ top: '20%', animationDelay: '5s', opacity: 0.3 }} />
                </div>
                <div className={styles.lockOverlay}>
                    <div className={styles.lockCard}>
                        <div className={styles.lockIcon}><LockKeyhole size={40} /></div>
                        <h1 className={styles.lockTitle}>Unlock Heaven 🌿</h1>
                        <p className={styles.lockDesc}>
                            Welcome to <strong>Heaven</strong>. Sign in to access our exclusive nature sanctuary.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <Gamepad2 className={styles.featureIcon} size={24} />
                                <span>3D Magical Games for Children</span>
                            </div>
                            <div className={styles.featureItem}>
                                <Box className={styles.featureIcon} size={24} />
                                <span>Premium 3D Pot Design Studio</span>
                            </div>
                            <div className={styles.featureItem}>
                                <Newspaper className={styles.featureIcon} size={24} />
                                <span>Real-time Global Nature News</span>
                            </div>
                        </div>

                        <div className={styles.authButtons}>
                            <button onClick={() => navigate('/auth?view=login')} className={styles.loginBtn}>Login to VanaMap</button>
                            <button onClick={() => navigate('/auth?view=signup')} className={styles.signupBtn}>Sign Up Free</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Game Logic State
    const [coins, setCoins] = useState(100);
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const xpToNextLevel = level * 200;
    const [plots, setPlots] = useState<PlantState[]>(Array(6).fill(null).map((_, i) => ({
        id: i, stage: 0, type: 'Sunflower', water: 100, timeToNextStage: 0
    })));
    const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'harvest' | null>(null);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [showTutorial, setShowTutorial] = useState(true);


    const playSound = (_type: 'pop' | 'success' | 'water' | 'level') => {
        if (!isSoundOn) return;
        // In a real app, use new Audio('/sounds/' + type + '.mp3').play();
    };

    // --- GAME EFFECTS ---
    useEffect(() => {
        if (view !== 'game') return;
        const timer = setInterval(() => {
            setPlots(current => current.map(plot => {
                if (plot.stage > 0 && plot.stage < 4) {
                    let newWater = Math.max(0, plot.water - 2);
                    if (newWater > 0) {
                        const newTime = plot.timeToNextStage - 1;
                        if (newTime <= 0) return { ...plot, stage: plot.stage + 1, timeToNextStage: 8, water: newWater - 10 };
                        return { ...plot, timeToNextStage: newTime, water: newWater };
                    }
                    return { ...plot, water: newWater };
                }
                return plot;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, [view]);

    useEffect(() => {
        if (level > 1 || xp > 0) updateGameProgress(level, Math.floor(xp)).catch(err => console.error(err));
    }, [level, xp]);

    // --- GAME HANDLERS ---
    const handlePlotClick = (index: number, e: MouseEvent<HTMLDivElement>) => {
        const plot = plots[index];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        if (selectedTool === 'plant') {
            if (plot.stage !== 0) { toast.error("Already planted here!", { icon: '🌱' }); return; }
            if (coins < 10) { toast.error("Need 10 coins!", { icon: '🪙' }); return; }
            setCoins(c => c - 10);
            playSound('pop');
            updatePlot(index, { stage: 1, type: PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)].name, timeToNextStage: 5, water: 100 });
            confetti({ particleCount: 15, spread: 40, origin: { x, y } });
        } else if (selectedTool === 'water') {
            if (plot.stage === 0) return;
            playSound('water');
            updatePlot(index, { water: 100 });
            confetti({ particleCount: 5, colors: ['#38bdf8'], spread: 20, origin: { x, y }, ticks: 50 });
        } else if (selectedTool === 'harvest') {
            if (plot.stage !== 4) return;
            const plantType = PLANT_TYPES.find(p => p.name === plot.type) || PLANT_TYPES[0];
            setCoins(c => c + plantType.reward);
            addXp(plantType.reward);
            playSound('success');
            updatePlot(index, { stage: 0 });
            confetti({ particleCount: 60, spread: 80, origin: { x, y } });
        }
    };

    const addXp = (amount: number) => {
        setXp(curr => {
            const next = curr + amount;
            if (next >= xpToNextLevel) {
                setLevel(l => l + 1);
                playSound('level');
                toast.success(`Level Up! You are now Level ${level + 1}!`);
                return next - xpToNextLevel;
            }
            return next;
        });
    };

    const updatePlot = (index: number, updates: Partial<PlantState>) => {
        setPlots(curr => { const n = [...curr]; n[index] = { ...n[index], ...updates }; return n; });
    };

    const getPlantEmoji = (plot: PlantState) => {
        const plantDef = PLANT_TYPES.find(p => p.name === plot.type) || PLANT_TYPES[0];
        return plantDef.stages[plot.stage];
    };

    // --- LIFE CYCLE COMPONENT ---
    const LifecycleView = () => (
        <div className={styles.subPage}>
            <h2 className={styles.sectionTitle}>The Eternal Cycle</h2>
            <div className={styles.lifecycleContainer}>
                <div className={styles.cycleStage}>
                    <div className={styles.stageIcon}>🌰</div>
                    <h3>Birth</h3>
                    <p>Every giant tree begins as a tiny dream wrapped in a seed shell.</p>
                </div>
                <div className={styles.cycleArrow}>➡️</div>
                <div className={styles.cycleStage}>
                    <div className={styles.stageIcon}>🌳</div>
                    <h3>Life</h3>
                    <p>Providing oxygen, shelter, and beauty to the world.</p>
                </div>
                <div className={styles.cycleArrow}>➡️</div>
                <div className={styles.cycleStage}>
                    <div className={styles.stageIcon}>🍂</div>
                    <h3>Return</h3>
                    <p>Returning to the earth to nourish the next generation.</p>
                </div>
            </div>
            <p className={styles.cycleQuote}>"Nature does not hurry, yet everything is accomplished."</p>
        </div>
    );

    // --- NEWS COMPONENT ---
    const NewsView = () => {
        const [newsData, setNewsData] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchNews = async () => {
                try {
                    // Try fetch from backend
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const res = await fetch(`${apiUrl}/news`);
                    if (res.ok) {
                        const data = await res.json();
                        setNewsData(data);
                    } else {
                        throw new Error("Failed");
                    }
                } catch (e) {
                    console.error("News fetch failed, using fallback", e);
                    // Fallback if backend offline/fails
                    const fallbackNews = [
                        { title: 'Global Forest Cover Increases by 2% this Year', source: 'Earth Watch', time: 'Today', link: 'https://www.sciencedaily.com/news/plants_animals/nature/' },
                        { title: 'New Species of Orchid Discovered in Amazon', source: 'Botany Today', time: 'Yesterday', link: 'https://news.mongabay.com/' }
                    ];
                    setNewsData(fallbackNews);
                } finally {
                    setLoading(false);
                }
            };
            fetchNews();
        }, []);

        return (
            <div className={styles.subPage}>
                <h2 className={styles.sectionTitle}>Global Nature Pulse</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading fresh news from nature...</div>
                ) : (
                    <div className={styles.newsGrid}>
                        {newsData.length === 0 && <p style={{ textAlign: 'center' }}>No news available today.</p>}
                        {newsData.map((item, i) => (
                            <div key={i} className={styles.newsCard}>
                                <div className={styles.newsSource}>
                                    {item.source} • {new Date(item.pubDate || Date.now()).toLocaleDateString()}
                                </div>
                                <h3 className={styles.newsTitle}>{item.title}</h3>
                                {item.snippet && <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>{item.snippet}</p>}
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.readMoreBtn}
                                >
                                    Read Full Story
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- RENDER ---
    return (
        <div className={styles.pageWrapper}>
            {/* Background Atmosphere */}
            <div className={styles.sky}>
                <CloudRain size={120} className={styles.cloud} style={{ top: '10%', left: '-10%', opacity: 0.4 }} />
                <CloudRain size={80} className={styles.cloud} style={{ top: '20%', animationDelay: '5s', opacity: 0.3 }} />
            </div>

            {/* HEADER / NAV */}
            <div className={styles.topNav}>
                {view !== 'menu' && (
                    <button onClick={() => setView('menu')} className={styles.backBtn}>
                        <ArrowLeft /> Back to Heaven
                    </button>
                )}
                <h1 className={styles.mainLogo}>HEAVEN 🌿</h1>
            </div>

            {/* MAIN MENU VIEW */}
            {view === 'menu' && (
                <div className={styles.menuContainer}>
                    <div className={styles.menuCard} onClick={() => setView('game')}>
                        <div className={`${styles.cardIcon} ${styles.iconGreen}`}><Sprout size={40} /></div>
                        <h2>Tiny Gardeners</h2>
                        <p>Grow your own magical virtual garden. Plant, water, and harvest!</p>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('pot-maker')}>
                        {/* Using a distinct color/icon for Pot Maker */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
                            boxShadow: '0 8px 16px -4px rgba(219, 39, 119, 0.4)'
                        }} className={styles.cardIcon}>
                            <Sparkles size={40} color="white" />
                        </div>
                        <h2>Pot Studio</h2>
                        <p>Design your own custom 3D plant pots. Upload art & create!</p>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('lifecycle')}>
                        <div className={`${styles.cardIcon} ${styles.iconYellow}`}><Recycle size={40} /></div>
                        <h2>Life Cycle</h2>
                        <p>Witness the beautiful journey of birth, life, and renewal.</p>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('news')}>
                        <div className={`${styles.cardIcon} ${styles.iconBlue}`}><Newspaper size={40} /></div>
                        <h2>Nature News</h2>
                        <p>Real-time updates on our planet's breathing ecosystems.</p>
                    </div>
                </div>
            )}

            {/* GAME VIEW */}
            {view === 'game' && (
                <div className={styles.gameContainer}>
                    {showTutorial && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <h1>🌱 Magic Garden</h1>
                                <p>Build your pocket ecosystem! Plants grow in real-time.</p>
                                <button className={styles.ctaBtn} onClick={() => setShowTutorial(false)}>Let's Grow!</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.header}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <h1 className={styles.title}>Tiny Gardeners</h1>
                            <button onClick={() => setShowTutorial(true)} className={styles.iconBtn}><Info size={20} /></button>
                        </div>
                        <p className={styles.subtitle}>Level {level}</p>
                        <div className={styles.xpBarContainer}>
                            <div className={styles.xpBarFill} style={{ width: `${(xp / xpToNextLevel) * 100}%` }} />
                        </div>
                    </div>

                    <div className={styles.statsBar}>
                        <div className={`${styles.stat} ${styles.textYellow}`}><Coins size={20} fill="#eab308" /> {coins}</div>
                        <div className={`${styles.stat} ${styles.textRed}`}><Heart size={20} fill="#ef4444" /> {plots.filter(p => p.stage > 0).length} Alive</div>
                        <button onClick={() => setIsSoundOn(!isSoundOn)} className={styles.iconBtn}>
                            {isSoundOn ? <Volume2 /> : <VolumeX />}
                        </button>
                    </div>

                    <div className={styles.gardenGrid}>
                        {plots.map((plot, i) => (
                            <div key={i} className={`${styles.plot} ${plot.stage === 0 ? styles.plotLocked : ''}`} onClick={(e) => handlePlotClick(i, e)}>
                                <div className={`${styles.plantContent} ${plot.stage > 0 && plot.stage < 4 ? styles.plantGrowing : ''}`}>{getPlantEmoji(plot)}</div>
                                {plot.stage > 0 && plot.stage < 4 && (
                                    <div className={styles.waterMeter}>
                                        <div className={styles.waterFill} style={{ width: `${plot.water}%`, background: plot.water < 30 ? '#ef4444' : '#38bdf8' }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.controls}>
                        <button className={`${styles.toolBtn} ${selectedTool === 'plant' ? styles.seed + ' ' + styles.toolBtnActive : ''}`} onClick={() => setSelectedTool('plant')}>
                            <Sprout size={28} /><span>Seed</span>
                        </button>
                        <button className={`${styles.toolBtn} ${selectedTool === 'water' ? styles.water + ' ' + styles.toolBtnActive : ''}`} onClick={() => setSelectedTool('water')}>
                            <CloudRain size={28} /><span>Water</span>
                        </button>
                        <button className={`${styles.toolBtn} ${selectedTool === 'harvest' ? styles.harvest + ' ' + styles.toolBtnActive : ''}`} onClick={() => setSelectedTool('harvest')}>
                            <Sparkles size={28} /><span>Harvest</span>
                        </button>
                    </div>
                </div>
            )}

            {/* POT MAKER VIEW */}
            {view === 'pot-maker' && (
                <PotMaker onBack={() => setView('menu')} />
            )}

            {/* SUB VIEWS */}
            {view === 'lifecycle' && <LifecycleView />}
            {view === 'news' && <NewsView />}
        </div>
    );
};
