import { useState } from 'react';
import { ArrowLeft, Palette, Save, Share2, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './PotDesigner.module.css';

export const PotDesigner = () => {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState('#e2e8f0');
    const [selectedPattern, setSelectedPattern] = useState('none');

    const patterns = [
        { id: 'none', name: 'Smooth Matte' },
        { id: 'dots', name: 'Polka Dots' },
        { id: 'stripes', name: 'Modern Stripes' },
        { id: 'marble', name: 'Marble Texture' },
        { id: 'terrazzo', name: 'Terrazzo' }
    ];

    const colors = [
        '#e2e8f0', '#94a3b8', '#475569', '#1e293b',
        '#fca5a5', '#ef4444', '#b91c1c',
        '#fbbf24', '#d97706',
        '#86efac', '#22c55e', '#15803d',
        '#93c5fd', '#3b82f6', '#1d4ed8',
        '#d8b4fe', '#a855f7', '#7e22ce'
    ];

    const handleSave = () => {
        toast.success("Design saved to your collection!");
    };

    const getPatternStyle = () => {
        switch (selectedPattern) {
            case 'dots': return { backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2.5px)', backgroundSize: '15px 15px' };
            case 'stripes': return { backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)' };
            case 'marble': return { backgroundImage: 'url("https://www.transparenttextures.com/patterns/shattered-island.png")', backgroundBlendMode: 'overlay' };
            case 'terrazzo': return { backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-diamond-dark.png")' }; // Placeholder for terrazzo
            default: return {};
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <button onClick={() => navigate('/heaven')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <Palette className="text-indigo-400" size={24} />
                    <h1 className={styles.title}>Ceramic Studio</h1>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                    <Share2 size={24} />
                </button>
            </header>

            <div className={styles.workspace}>
                {/* 3D Preview Canvas */}
                <div className={styles.canvas}>
                    <div className={styles.gridPattern}></div>
                    <div className={styles.previewArea}>
                        {/* Plant Image (Layered) */}
                        <img
                            src="https://images.unsplash.com/photo-1597055181300-e249520535c7?w=800&auto=format&fit=crop&q=60"
                            alt="Plant"
                            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 drop-shadow-2xl z-10 pointer-events-none"
                        />
                        {/* Styled Pot */}
                        <div className={styles.potWrapper}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: selectedColor,
                                    borderRadius: '10px 10px 60px 60px',
                                    boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.3), inset 10px 10px 30px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.4)',
                                    ...getPatternStyle()
                                }}
                            >
                                <div className="absolute top-0 w-[110%] left-[-5%] h-6 bg-black/20 rounded-full blur-[1px]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <aside className={styles.controls}>
                    <div>
                        <h3 className={styles.sectionTitle}>
                            <Palette size={14} className="inline mr-2" /> Base Color
                        </h3>
                        <div className={styles.colorGrid}>
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`${styles.colorBtn} ${selectedColor === color ? styles.active : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>
                            <Layers size={14} className="inline mr-2" /> Surface Finish
                        </h3>
                        <div className={styles.patternList}>
                            {patterns.map(pat => (
                                <button
                                    key={pat.id}
                                    onClick={() => setSelectedPattern(pat.id)}
                                    className={`${styles.patternBtn} ${selectedPattern === pat.id ? styles.active : ''}`}
                                >
                                    {pat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSave} className={styles.saveBtn}>
                        <Save size={20} /> Save Masterpiece
                    </button>
                </aside>
            </div>
        </div>
    );
};
