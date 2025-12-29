import { useState } from 'react';
import { ArrowLeft, Play, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './ForestGame.module.css';

export const ForestGame = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing'>('start');

    const handlePlantClick = () => {
        setScore(s => s + 10);
        // Sound or particle effect logic could go here
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>

            {/* Header */}
            <header className={styles.header}>
                <button
                    onClick={() => navigate('/heaven')}
                    className={styles.backBtn}
                >
                    <ArrowLeft size={24} color="white" />
                </button>
                <div className={styles.scoreBoard}>
                    <Trophy size={20} className="text-yellow-400" />
                    <span className={styles.scoreValue}>{score}</span>
                </div>
            </header>

            <main>
                {gameState === 'start' && (
                    <div className={styles.startScreen}>
                        <h1 className={styles.gameTitle}>Forest Guardian</h1>
                        <button
                            onClick={() => setGameState('playing')}
                            className={styles.startBtn}
                        >
                            <Play fill="currentColor" size={24} /> Play Now
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className={styles.gameArea}>
                        <button
                            onClick={handlePlantClick}
                            className={styles.treeBtn}
                        >
                            <div className={styles.glow}></div>
                            <span className={styles.treeIcon}>🌳</span>
                        </button>
                        <p className={styles.tapHint}>Tap to Grow the Sanctuary!</p>
                    </div>
                )}
            </main>
        </div>
    );
};
