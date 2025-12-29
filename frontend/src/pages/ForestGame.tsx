import { useState } from 'react';
import { ArrowLeft, Play, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForestGame = () => {
    const navigate = useNavigate();
    // const { user } = useAuth(); // Unused for now
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');

    // Simple clicker game logic for now as a placeholder for the "Kids Game"
    const handlePlantClick = () => {
        setScore(s => s + 10);
        // Add particle effect logic here in a real implementation
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8f3793371?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>

            <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
                <header className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/heaven')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-400" />
                        <span className="text-xl font-bold">{score}</span>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center">
                    {gameState === 'start' && (
                        <div className="text-center bg-slate-800/80 backdrop-blur-md p-12 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl">
                            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Forest Guardian</h1>
                            <p className="text-slate-300 mb-8">Protect the forest by planting trees! Tap as fast as you can to grow your sanctuary.</p>
                            <button
                                onClick={() => setGameState('playing')}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                            >
                                <Play fill="currentColor" /> Start Game
                            </button>
                        </div>
                    )}

                    {gameState === 'playing' && (
                        <div className="text-center animate-in zoom-in duration-300">
                            <button
                                onClick={handlePlantClick}
                                className="relative group transition-all active:scale-95"
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-colors"></div>
                                <span className="text-9xl relative z-10 drop-shadow-2xl filter hover:brightness-110 cursor-pointer select-none">
                                    🌳
                                </span>
                            </button>
                            <p className="mt-12 text-slate-400 text-lg animate-pulse">Tap to grow!</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
