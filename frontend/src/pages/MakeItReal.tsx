import { useState, useRef, useEffect, type MouseEvent } from 'react';
import styles from './MakeItReal.module.css';
import { Upload, Search, Wand2, RefreshCw, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';
import { fetchPlants } from '../services/api';
import toast from 'react-hot-toast';

export const MakeItReal = () => {
    const [plants, setPlants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Canvas State
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [placedPlant, setPlacedPlant] = useState<any | null>(null);

    // Transform State
    const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isMagicMode, setIsMagicMode] = useState(false); // Simulated BG Removal

    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load plant library");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setRoomImage(url);
            toast.success("Room uploaded! Now pick a plant.");
        }
    };

    const handlePlantSelect = (plant: any) => {
        if (!roomImage) {
            toast.error("Please upload a room photo first!");
            return;
        }
        setPlacedPlant(plant);
        setPosition({ x: 50, y: 50 });
        setScale(1);
        toast.success(`added ${plant.name} to scene`);
    };

    // --- DRAG LOGIC ---
    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setPosition({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div className={styles.header}>
                <h1 className={styles.title}>Make It Real</h1>
                <div className={styles.subtitle}>
                    <Wand2 size={16} /> premium ar visualization studio
                </div>
            </div>

            <div className={styles.workspace}>
                {/* SIDEBAR: PLANT LIBRARY */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.searchBox}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder="Search nature library..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.plantList}>
                        {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading Library...</div> :
                            filteredPlants.map(plant => (
                                <div key={plant.id} className={styles.plantCard} onClick={() => handlePlantSelect(plant)}>
                                    <img src={plant.imageUrl} alt={plant.name} className={styles.thumb} />
                                    <div className={styles.plantInfo}>
                                        <h4>{plant.name}</h4>
                                        <p>{plant.type}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* MAIN CANVAS */}
                <div
                    className={styles.canvasArea}
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                >
                    {!roomImage ? (
                        <div className={styles.canvasEmpty}>
                            <ImageIcon size={64} style={{ opacity: 0.5 }} />
                            <h2>Your Space Goes Here</h2>
                            <p>Upload a photo of your room or garden to begin visualization.</p>
                            <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                                <Upload size={24} /> Upload Photo
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    ) : (
                        <>
                            <img src={roomImage} alt="Room" className={styles.roomImage} />

                            {placedPlant && (
                                <img
                                    src={placedPlant.imageUrl}
                                    alt="Plant"
                                    className={`${styles.placedPlant} ${isMagicMode ? styles.removeBg : ''}`}
                                    style={{
                                        left: `${position.x}%`,
                                        top: `${position.y}%`,
                                        transform: `translate(-50%, -50%) scale(${scale})`,
                                        width: '300px' // Base size
                                    }}
                                    onMouseDown={handleMouseDown}
                                />
                            )}

                            {/* FLOATING CONTROLS */}
                            <div className={styles.controls}>
                                <button className={styles.controlBtn} onClick={() => setRoomImage(null)} title="New Photo">
                                    <RefreshCw size={20} />
                                </button>

                                {placedPlant && (
                                    <>
                                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', height: '24px' }}></div>
                                        <button className={styles.controlBtn} onClick={() => setScale(s => Math.max(0.5, s - 0.1))} title="Shrink">
                                            <ZoomOut size={20} />
                                        </button>
                                        <span style={{ color: 'white', fontSize: '0.9rem', alignSelf: 'center' }}>{Math.round(scale * 100)}%</span>
                                        <button className={styles.controlBtn} onClick={() => setScale(s => Math.min(3, s + 0.1))} title="Grow">
                                            <ZoomIn size={20} />
                                        </button>

                                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', height: '24px' }}></div>

                                        <button
                                            className={`${styles.controlBtn} ${styles.magicBtn}`}
                                            onClick={() => {
                                                setIsMagicMode(!isMagicMode);
                                                toast(isMagicMode ? "Original Mode" : "Magic Blend Mode Activated ✨");
                                            }}
                                            title="Simulate BG Remove"
                                        >
                                            <Wand2 size={18} /> {isMagicMode ? 'Magic ON' : 'Magic OFF'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
