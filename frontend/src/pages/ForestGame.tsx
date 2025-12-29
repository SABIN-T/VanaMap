
import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Play, Trophy, Timer, Sparkles, Sprout, Heart, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addPoints } from '../services/api';
import toast from 'react-hot-toast';
import styles from './ForestGame.module.css';

interface Target {
    id: number;
    x: number;
    y: number;
    type: 'seed' | 'leaf' | 'flower';
}

export const ForestGame = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [timeLeft, setTimeLeft] = useState(30);
    const [targets, setTargets] = useState<Target[]>([]);
    const [combo, setCombo] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const gameTimerRef = useRef<number | null>(null);
    const spawnTimerRef = useRef<number | null>(null);

    // Load initial user data
    useEffect(() => {
        if (user) {
            setCurrentLevel(user.gameLevel || 1);
        }
    }, [user]);

    const spawnTarget = useCallback(() => {
        const id = Date.now();
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 60 + 15; // 15% to 75% (Keeping it higher for mobile visibility)
        const types: Target['type'][] = ['seed', 'leaf', 'flower'];
        const type = types[Math.floor(Math.random() * types.length)];

        setTargets(prev => [...prev, { id, x, y, type }]);

        // Auto remove target
        setTimeout(() => {
            setTargets(prev => prev.filter(t => t.id !== id));
        }, 1800);
    }, []);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setCombo(0);
        setGameState('playing');
        setTargets([]);
        setShowLevelUp(false);
    };

    const endGame = useCallback(async () => {
        setGameState('end');
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

        // Award Chlorophyll Points (10 per game)
        try {
            const POINTS_REWARD = 10;
            await addPoints(POINTS_REWARD);

            // Check for level up logic (every 100 points)
            const newPoints = (user?.points || 0) + POINTS_REWARD;
            const newLevel = Math.floor(newPoints / 100) + 1;

            if (newLevel > currentLevel) {
                setShowLevelUp(true);
                setCurrentLevel(newLevel);
                toast.success(`LEVEL UP! You are now Level ${newLevel}! 🌟`, { duration: 4000 });
            }

            // Optimistically update UI
            if (user) {
                updateUser({
                    points: newPoints,
                    gameLevel: newLevel
                });
            }
            toast.success(`+${POINTS_REWARD} Chlorophyll Points added! 🌿`, { icon: '🧪' });
        } catch (e) {
            console.error("Points update failed");
        }
    }, [user, updateUser, currentLevel]);

    useEffect(() => {
        if (gameState === 'playing') {
            gameTimerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            spawnTimerRef.current = window.setInterval(() => {
                spawnTarget();
            }, 800);
        }

        return () => {
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        };
    }, [gameState, spawnTarget, endGame]);

    const handleTargetClick = (id: number) => {
        setScore(s => s + 10 + (combo * 2));
        setCombo(c => c + 1);
        setTargets(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>

            {/* Level Up Modal */}
            {showLevelUp && (
                <div className={styles.levelModal}>
                    <div className={styles.levelTitle}>LEVEL UP!</div>
                    <div className={styles.levelSub}>Rank {currentLevel} achieved</div>
                    <div className="text-4xl animate-bounce">⭐</div>
                </div>
            )}

            {/* Header: High Density */}
            <header className={styles.header}>
                <button onClick={() => navigate('/heaven')} className={styles.backBtn}>
                    <ArrowLeft size={18} color="white" />
                </button>
                <div className={styles.statsGroup}>
                    <div className={styles.miniStat}>
                        <span>Lvl {currentLevel}</span>
                    </div>
                    <div className={`${styles.miniStat} ${timeLeft < 10 ? styles.pulseRed : ''}`}>
                        <Timer size={timeLeft < 10 ? 20 : 14} />
                        <span>{timeLeft}s</span>
                    </div>
                    <div className={styles.miniStat}>
                        <Trophy size={14} color="#facc15" />
                        <span>{score}</span>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                {gameState === 'start' && (
                    <div className={styles.card}>
                        <div className={styles.badge}>MISSION: REFORESTATION</div>
                        <h1 className={styles.gameTitle}>Canopy Hero</h1>
                        <p className={styles.missionText}>
                            The digital Amazon is losing its glow. Tap emerging <strong>Seedlings</strong> to release oxygen and restore the canopy.
                        </p>
                        <div className={styles.featureGrid}>
                            <div className={styles.featureItem}>
                                <Sprout size={20} color="#10b981" />
                                <span>Save Nature</span>
                            </div>
                            <div className={styles.featureItem}>
                                <Sparkles size={20} color="#facc15" />
                                <span>Earn Points</span>
                            </div>
                        </div>
                        <button onClick={startGame} className={styles.startBtn}>
                            <Play fill="currentColor" size={20} /> Deploy Seedlings
                        </button>
                        <p className={styles.rewardNote}>🏆 Complete 1 session for 10 Chlorophyll Points</p>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className={styles.gameArea}>
                        {targets.map(t => (
                            <button
                                key={t.id}
                                className={styles.target}
                                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                                onClick={() => handleTargetClick(t.id)}
                            >
                                <div className={styles.targetGlow}></div>
                                <span className={styles.targetIcon}>
                                    {t.type === 'seed' && <Sprout size={32} />}
                                    {t.type === 'leaf' && <Leaf size={32} />}
                                    {t.type === 'flower' && <Heart size={32} fill="#ef4444" />}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {gameState === 'end' && (
                    <div className={styles.card}>
                        <div className={styles.successIcon}>🌿</div>
                        <h2 className={styles.endTitle}>Canopy Restored!</h2>
                        <div className={styles.scoreBreakdown}>
                            <div className={styles.finalScore}>
                                <span className={styles.label}>Energy Generated</span>
                                <span className={styles.value}>{score}</span>
                            </div>
                            <div className={styles.pointsEarned}>
                                <span className={styles.label}>Chlorophyll Gained</span>
                                <span className={styles.value}>+10 Points</span>
                            </div>
                        </div>
                        <div className={styles.btnGroup}>
                            <button onClick={startGame} className={styles.retryBtn}>Play Again</button>
                            <button onClick={() => navigate('/heaven')} className={styles.exitBtn}>Return to Studio</button>
                        </div>
                    </div>
                )}
            </main>

            {/* Background elements */}
            <div className={styles.bgGlow}></div>
        </div>
    );
};
