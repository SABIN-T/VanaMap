import { useState, useRef, useEffect, type MouseEvent } from 'react';
import styles from './MakeItReal.module.css';
import { Upload, Search, Wand2, RefreshCw, ZoomIn, ZoomOut, Image as ImageIcon, Camera, X } from 'lucide-react';
import { fetchPlants } from '../services/api';
import toast from 'react-hot-toast';

export const MakeItReal = () => {
    const [plants, setPlants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Canvas State
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [placedPlant, setPlacedPlant] = useState<any | null>(null);

    // Camera State
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    // Camera Logic
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (err) {
            toast.error("Camera access denied or unavailable.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL('image/png');
                setRoomImage(imageUrl);
                toast.success("Photo captured!");
                stopCamera();
            }
        }
    };

    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [showCamera, stream]);

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
            {showCamera && (
                <div className={styles.cameraOverlay}>
                    <button className={styles.closeCameraBtn} onClick={stopCamera}><X size={32} /></button>
                    <video ref={videoRef} autoPlay playsInline muted className={styles.videoPreview} />
                    <div className={styles.cameraControls}>
                        <button className={styles.shutterBtn} onClick={capturePhoto}>
                            <div className={styles.shutterBtnInner} />
                        </button>
                    </div>
                </div>
            )}

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

                {/* MAIN STUDIO AREA */}
                <div className={styles.studioMain}>
                    <div
                        className={styles.canvasViewport}
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                    >
                        {!roomImage ? (
                            <div className={styles.canvasEmpty}>
                                <ImageIcon size={64} style={{ opacity: 0.5 }} />
                                <h2>Your Space Goes Here</h2>
                                <p>Upload a photo of your room or garden to begin visualization.</p>

                                <div className={styles.actionRow}>
                                    <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                                        <Upload size={24} /> Upload
                                    </button>
                                    <div className={styles.orDivider}>OR</div>
                                    <button className={styles.cameraBtn} onClick={startCamera}>
                                        <Camera size={24} /> Take Photo
                                    </button>
                                </div>
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
                                            width: '300px'
                                        }}
                                        onMouseDown={handleMouseDown}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* TOOLBAR (Visible when image loaded) */}
                    {roomImage && (
                        <div className={styles.editorToolbar}>
                            <div className={styles.toolbarGroup}>
                                <button className={styles.toolBtn} onClick={() => setRoomImage(null)}>
                                    <RefreshCw size={18} /> New Canvas
                                </button>
                            </div>

                            <div className={styles.toolbarGroup}>
                                <button className={styles.toolBtn} onClick={() => setScale(s => Math.max(0.5, s - 0.1))} disabled={!placedPlant}>
                                    <ZoomOut size={18} />
                                </button>
                                <span style={{ color: 'white', fontWeight: 600, minWidth: '3rem', textAlign: 'center' }}>
                                    {Math.round(scale * 100)}%
                                </span>
                                <button className={styles.toolBtn} onClick={() => setScale(s => Math.min(3, s + 0.1))} disabled={!placedPlant}>
                                    <ZoomIn size={18} />
                                </button>
                            </div>

                            <div className={styles.toolbarGroup}>
                                <button
                                    className={`${styles.toolBtn} ${styles.magicToggle} ${isMagicMode ? styles.magicActive : ''}`}
                                    onClick={() => {
                                        setIsMagicMode(!isMagicMode);
                                        toast(isMagicMode ? "Original Mode" : "Magic Blend Mode Activated ✨");
                                    }}
                                    disabled={!placedPlant}
                                >
                                    <Wand2 size={18} /> {isMagicMode ? 'Magic ON' : 'Magic OFF'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
