import { useState, useEffect, type MouseEvent } from 'react';
import { Sprout, CloudRain, Coins, Volume2, VolumeX, Sparkles, Heart, Trophy, Info } from 'lucide-react';
import styles from './ChildrenZone.module.css';
import confetti from 'canvas-confetti';
import { updateGameProgress } from '../services/api';
import toast from 'react-hot-toast';

interface PlantState {
    id: number;
    stage: number; // 0: Empty, 1: Seed, 2: Sprout, 3: Small, 4: Mature
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

export const ChildrenZone = () => {
    // Game State
    const [coins, setCoins] = useState(100);
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const xpToNextLevel = level * 200;

    const [plots, setPlots] = useState<PlantState[]>(Array(6).fill(null).map((_, i) => ({
        id: i,
        stage: 0,
        type: 'Sunflower',
        water: 100,
        timeToNextStage: 0
    })));

    const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'harvest' | null>(null);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [showTutorial, setShowTutorial] = useState(true);

    // Audio placeholders
    const playSound = (_type: 'pop' | 'success' | 'water' | 'level') => {
        if (!isSoundOn) return;
        // In a real app, use new Audio('/sounds/' + type + '.mp3').play();
    };

    // Game Loop
    useEffect(() => {
        const timer = setInterval(() => {
            setPlots(current => current.map(plot => {
                if (plot.stage > 0 && plot.stage < 4) {
                    // Reduce water
                    let newWater = Math.max(0, plot.water - 2);

                    if (newWater > 0) {
                        const newTime = plot.timeToNextStage - 1;
                        if (newTime <= 0) {
                            return { ...plot, stage: plot.stage + 1, timeToNextStage: 8, water: newWater - 10 };
                        }
                        return { ...plot, timeToNextStage: newTime, water: newWater };
                    }
                    return { ...plot, water: newWater };
                }
                return plot;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Sync Progress
    useEffect(() => {
        if (level > 1 || xp > 0) {
            updateGameProgress(level, Math.floor(xp)).catch(err => console.error(err));
        }
    }, [level, xp]);

    const handlePlotClick = (index: number, e: MouseEvent<HTMLDivElement>) => {
        const plot = plots[index];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        if (selectedTool === 'plant') {
            if (plot.stage !== 0) {
                toast.error("Already planted here!", { icon: '🌱' });
                return;
            }
            if (coins < 10) {
                toast.error("Need 10 coins!", { icon: '🪙' });
                return;
            }
            setCoins(c => c - 10);
            playSound('pop');
            updatePlot(index, {
                stage: 1,
                type: PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)].name,
                timeToNextStage: 5,
                water: 100
            });
            confetti({ particleCount: 15, spread: 40, origin: { x, y } });
        }
        else if (selectedTool === 'water') {
            if (plot.stage === 0) return;
            playSound('water');
            updatePlot(index, { water: 100 });
            // Small subtle confetti for water
            confetti({ particleCount: 5, colors: ['#38bdf8'], spread: 20, origin: { x, y }, ticks: 50 });
        }
        else if (selectedTool === 'harvest') {
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
                // Level Up!
                setLevel(l => l + 1);
                playSound('level');
                toast.custom((_t) => (
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Trophy size={32} color="#facc15" />
                        <div>
                            <h3 style={{ margin: 0, color: '#0f172a' }}>Level Up!</h3>
                            <p style={{ margin: 0, color: '#64748b' }}>You reached Level {level + 1}!</p>
                        </div>
                    </div>
                ));
                confetti({
                    particleCount: 200,
                    spread: 120,
                    origin: { y: 0.6 }
                });
                return next - xpToNextLevel;
            }
            return next;
        });
    };

    const updatePlot = (index: number, updates: Partial<PlantState>) => {
        setPlots(current => {
            const next = [...current];
            next[index] = { ...next[index], ...updates };
            return next;
        });
    };

    const getPlantEmoji = (plot: PlantState) => {
        const plantDef = PLANT_TYPES.find(p => p.name === plot.type) || PLANT_TYPES[0];
        return plantDef.stages[plot.stage];
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Background Atmosphere */}
            <div className={styles.sky}>
                <CloudRain size={120} className={styles.cloud} style={{ top: '10%', left: '-10%', opacity: 0.4 }} />
                <CloudRain size={80} className={styles.cloud} style={{ top: '20%', animationDelay: '5s', opacity: 0.3 }} />
                <CloudRain size={160} className={styles.cloud} style={{ top: '15%', animationDelay: '12s', opacity: 0.5 }} />
            </div>

            <div className={styles.gameContainer}>
                {showTutorial && (
                    <div className={styles.overlay}>
                        <div className={styles.modal}>
                            <h1>🌱 Magic Garden</h1>
                            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem' }}>
                                Build your own pocket ecosystem! Plants grow in real-time.
                                Keep them happy with water and harvest them to level up!
                            </p>
                            <button className={styles.ctaBtn} onClick={() => setShowTutorial(false)}>
                                Let's Grow!
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <h1 className={styles.title}>Tiny Gardeners</h1>
                        <button onClick={() => setShowTutorial(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><Info size={20} /></button>
                    </div>
                    <p className={styles.subtitle}>Level {level}</p>

                    {/* XP BAR */}
                    <div style={{ width: '200px', height: '8px', background: '#e2e8f0', borderRadius: '4px', margin: '10px auto', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(xp / xpToNextLevel) * 100}%`, background: '#22c55e', transition: 'width 0.5s' }} />
                    </div>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.stat} style={{ color: '#eab308' }}>
                        <Coins size={24} fill="#eab308" /> {coins}
                    </div>
                    <div className={styles.stat} style={{ color: '#ef4444' }}>
                        <Heart size={24} fill="#ef4444" /> {plots.filter(p => p.stage > 0).length} Alive
                    </div>
                    <button onClick={() => setIsSoundOn(!isSoundOn)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        {isSoundOn ? <Volume2 /> : <VolumeX />}
                    </button>
                </div>

                <div className={styles.gardenGrid}>
                    {plots.map((plot, i) => (
                        <div
                            key={i}
                            className={`${styles.plot} ${plot.stage === 0 ? styles.plotLocked : ''}`}
                            onClick={(e) => handlePlotClick(i, e)}
                        >
                            <div className={`${styles.plantContent} ${plot.stage > 0 && plot.stage < 4 ? styles.plantGrowing : ''}`}>
                                {getPlantEmoji(plot)}
                            </div>

                            {/* Water Meter */}
                            {plot.stage > 0 && plot.stage < 4 && (
                                <div className={styles.waterMeter}>
                                    <div
                                        className={styles.waterFill}
                                        style={{
                                            width: `${plot.water}%`,
                                            background: plot.water < 30 ? '#ef4444' : '#38bdf8'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.controls}>
                    <button
                        className={`${styles.toolBtn} ${selectedTool === 'plant' ? styles.seed + ' ' + styles.toolBtnActive : ''}`}
                        onClick={() => setSelectedTool('plant')}
                    >
                        <Sprout size={28} />
                        <span>Seed</span>
                    </button>

                    <button
                        className={`${styles.toolBtn} ${selectedTool === 'water' ? styles.water + ' ' + styles.toolBtnActive : ''}`}
                        onClick={() => setSelectedTool('water')}
                    >
                        <CloudRain size={28} />
                        <span>Water</span>
                    </button>

                    <button
                        className={`${styles.toolBtn} ${selectedTool === 'harvest' ? styles.harvest + ' ' + styles.toolBtnActive : ''}`}
                        onClick={() => setSelectedTool('harvest')}
                    >
                        <Sparkles size={28} />
                        <span>Harvest</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
