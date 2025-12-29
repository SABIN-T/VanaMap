import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Palette, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const PotDesigner = () => {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState('#e2e8f0');
    const [selectedPattern, setSelectedPattern] = useState('none');

    const patterns = [
        { id: 'none', name: 'Smooth' },
        { id: 'dots', name: 'Polka' },
        { id: 'stripes', name: 'Stripes' },
        { id: 'marble', name: 'Marble' }
    ];

    const colors = [
        '#e2e8f0', '#94a3b8', '#475569', // Grays
        '#fca5a5', '#f87171', '#ef4444', // Reds
        '#fcd34d', '#fbbf24', '#f59e0b', // Yellows
        '#86efac', '#4ade80', '#22c55e', // Greens
        '#93c5fd', '#60a5fa', '#3b82f6', // Blues
        '#d8b4fe', '#c084fc', '#a855f7', // Purples
    ];

    const handleSave = () => {
        toast.success("Design saved to your collection!");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <div className="container mx-auto px-4 py-8 relative z-10">
                <header className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/heaven')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Ceramic Studio</h1>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Share2 size={24} />
                    </button>
                </header>

                <div className="grid lg:grid-cols-2 gap-12 items-center h-[calc(100vh-140px)]">
                    {/* Preview Area */}
                    <div className="flex items-center justify-center bg-slate-800/50 rounded-3xl h-full border border-white/5 relative p-12">
                        <div className="relative w-64 h-80 transition-all duration-300" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
                            {/* Plant (Static for demo) */}
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-64 z-10">
                                <img src="https://images.unsplash.com/photo-1597055181300-e249520535c7?w=800&auto=format&fit=crop&q=60"
                                    alt="Plant"
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </div>

                            {/* Pot */}
                            <div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-40 rounded-b-3xl rounded-t-lg transition-colors duration-500 ease-out"
                                style={{
                                    backgroundColor: selectedColor,
                                    backgroundImage: selectedPattern === 'dots' ? 'radial-gradient(#00000020 2px, transparent 2.5px)' :
                                        selectedPattern === 'stripes' ? 'repeating-linear-gradient(45deg, #00000010 0px, #00000010 10px, transparent 10px, transparent 20px)' : 'none',
                                    backgroundSize: selectedPattern === 'dots' ? '20px 20px' : 'auto'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-b-3xl rounded-t-lg"></div>
                                <div className="absolute top-0 w-full h-4 bg-black/10 rounded-t-lg transform -translate-y-2 scale-x-110 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-full flex flex-col overflow-y-auto">

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Palette size={16} /> Base Color
                            </h3>
                            <div className="grid grid-cols-6 gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 border-2 ${selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Texture & Finish</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {patterns.map(pat => (
                                    <button
                                        key={pat.id}
                                        onClick={() => setSelectedPattern(pat.id)}
                                        className={`p-4 rounded-xl border transition-all text-left ${selectedPattern === pat.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-300'}`}
                                    >
                                        <span className="font-medium">{pat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Save size={20} /> Save Design
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
