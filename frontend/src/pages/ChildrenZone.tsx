import { useState, useEffect, type MouseEvent } from 'react';
import { Sprout, CloudRain, Coins, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import styles from './ChildrenZone.module.css';
import confetti from 'canvas-confetti';

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
    const [coins, setCoins] = useState(100);
    const [level, setLevel] = useState(1);
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

    const playSound = (_type: 'pop' | 'success' | 'water') => {
        if (!isSoundOn) return;
        // Simple Audio Context or HTML5 Audio would go here
        // For now simulating visuals is enough
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setPlots(current => current.map(plot => {
                if (plot.stage > 0 && plot.stage < 4) {
                    // Growing logic
                    if (plot.water > 0) {
                        const newTime = plot.timeToNextStage - 1;
                        if (newTime <= 0) {
                            return { ...plot, stage: plot.stage + 1, timeToNextStage: 10, water: plot.water - 10 };
                        }
                        return { ...plot, timeToNextStage: newTime, water: plot.water - 5 };
                    }
                }
                return plot;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handlePlotClick = (index: number, e: MouseEvent<HTMLDivElement>) => {
        const plot = plots[index];

        if (selectedTool === 'plant') {
            if (plot.stage !== 0) return;
            if (coins < 10) {
                alert("Not enough coins! Harvest mature plants to earn more.");
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
            confetti({
                particleCount: 20,
                spread: 30,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
            });
        }
        else if (selectedTool === 'water') {
            if (plot.stage === 0 || plot.stage === 4) return;
            playSound('water');
            updatePlot(index, { water: 100 });
        }
        else if (selectedTool === 'harvest') {
            if (plot.stage !== 4) return;
            const plantType = PLANT_TYPES.find(p => p.name === plot.type) || PLANT_TYPES[0];
            setCoins(c => c + plantType.reward);
            playSound('success');
            updatePlot(index, { stage: 0 }); // Reset
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            if (coins > level * 200) {
                setLevel(l => l + 1);
            }
        }
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
        <div className={styles.container}>
            <div className={styles.gameArea}>
                {showTutorial && (
                    <div className={styles.tutorialOverlay}>
                        <h1>Welcome to Magic Garden! 🌿</h1>
                        <p>1. Select the <strong>SEED</strong> tool to plant.</p>
                        <p>2. Use the <strong>WATER</strong> can to keep them alive.</p>
                        <p>3. <strong>HARVEST</strong> when they are fully grown!</p>
                        <button className={styles.actionBtn} style={{ background: '#10b981', color: 'white' }} onClick={() => setShowTutorial(false)}>
                            Start Playing! 🎮
                        </button>
                    </div>
                )}

                <div className={styles.header}>
                    <h1 className={styles.title}>🌱 Tiny Gardeners</h1>
                    <p className={styles.subtitle}>Level {level} • Eco-Guardian</p>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.statItem} style={{ color: '#eab308' }}>
                        <Coins size={28} /> {coins}
                    </div>
                    <div className={styles.statItem} style={{ color: '#ef4444' }}>
                        <Heart size={28} /> {plots.filter(p => p.stage > 0).length} Alive
                    </div>
                    <button onClick={() => setIsSoundOn(!isSoundOn)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {isSoundOn ? <Volume2 /> : <VolumeX />}
                    </button>
                </div>

                <div className={styles.gardenGrid}>
                    {plots.map((plot, i) => (
                        <div
                            key={i}
                            className={`${styles.plot} ${plot.stage > 0 ? styles.plotActive : ''}`}
                            onClick={(e) => handlePlotClick(i, e)}
                        >
                            <span className={styles.plantEmoji}>{getPlantEmoji(plot)}</span>
                            {plot.stage > 0 && plot.stage < 4 && (
                                <div style={{ width: '60%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                                    <div style={{
                                        width: `${plot.water}%`,
                                        height: '100%',
                                        background: plot.water < 30 ? '#ef4444' : '#38bdf8',
                                        borderRadius: '3px',
                                        transition: 'width 0.5s'
                                    }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.actionBar}>
                    <button
                        className={`${styles.actionBtn} ${selectedTool === 'plant' ? styles.btnPlant : ''}`}
                        onClick={() => setSelectedTool('plant')}
                        style={{ opacity: selectedTool && selectedTool !== 'plant' ? 0.5 : 1 }}
                    >
                        <Sprout /> Plant (-10)
                    </button>
                    <button
                        className={`${styles.actionBtn} ${selectedTool === 'water' ? styles.btnWater : ''}`}
                        onClick={() => setSelectedTool('water')}
                        style={{ opacity: selectedTool && selectedTool !== 'water' ? 0.5 : 1 }}
                    >
                        <CloudRain /> Water
                    </button>
                    <button
                        className={`${styles.actionBtn} ${selectedTool === 'harvest' ? styles.btnHarvest : ''}`}
                        onClick={() => setSelectedTool('harvest')}
                        style={{ opacity: selectedTool && selectedTool !== 'harvest' ? 0.5 : 1 }}
                    >
                        <Sparkles /> Harvest
                    </button>
                </div>
            </div>
        </div>
    );
};
