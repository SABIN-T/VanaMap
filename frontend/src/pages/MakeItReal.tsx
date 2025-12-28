import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import styles from './MakeItReal.module.css';
import { fetchPlants } from '../services/api';
import toast from 'react-hot-toast';
import { Search, ArrowLeft, ScanLine } from 'lucide-react';

/* 
 * 🧠 MakeItReal v3.0 - Neural Studio
 * Pure React + Python FastAPI Architecture
 */

export const MakeItReal = () => {
    // --- STATE ---
    const [viewMode, setViewMode] = useState<'SELECTION' | 'STUDIO' | 'RESULT'>('SELECTION');
    const [plants, setPlants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Core Data
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);

    // Studio State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Plant Transform State (Draggable)
    const [pos, setPos] = useState({ x: 0, y: 0 }); // Percentages
    const [dragging, setDragging] = useState(false);

    // --- INIT ---
    useEffect(() => {
        loadPlants();
        return () => stopCamera(); // Cleanup on unmount
    }, []);

    const loadPlants = async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);
        } catch (e) {
            console.error(e);
            toast.error("Unlinked from database.");
        }
    };

    // --- HELPERS ---
    const removeBackgroundSimple = (imageSrc: string, tolerance: number = 20): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageSrc;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(imageSrc);

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const bgR = data[0], bgG = data[1], bgB = data[2];

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
                    if (diff < tolerance) data[i + 3] = 0;
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(imageSrc);
        });
    };

    // --- AI LOGIC (Remove BG) ---
    const processPlant = async (plant: any) => {
        setIsProcessing(true);
        setSelectedPlant(plant);

        // 1. Fetch raw image as blob
        let rawBlob: Blob;
        try {
            const rawRes = await fetch(plant.imageUrl);
            rawBlob = await rawRes.blob();
        } catch {
            return; // Failed to even load image
        }

        try {
            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append('image_file', rawBlob);
            formData.append('size', 'auto');

            // 3. Send to Public API (Remove.bg)
            // ⚠️ SECURITY WARNING: Hardcoding API keys in frontend code is risky.
            // Ideally use VITE_REMOVE_BG_API_KEY environment variable in Vercel.
            const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY || "kW5A7cdmPKAgNwGJVD8AuKuV";

            if (!apiKey) {
                console.warn("No API Key found for Remove.bg");
                throw new Error("Missing API Key");
            }

            const apiRes = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey
                },
                body: formData
            });

            if (!apiRes.ok) {
                if (apiRes.status === 402) throw new Error('API Quota Exceeded');
                if (apiRes.status === 401) throw new Error('Invalid API Key');
                throw new Error('API Error');
            }

            // 4. Get Result as Blob
            const pngBlob = await apiRes.blob();
            const pngUrl = URL.createObjectURL(pngBlob);

            setCutoutUrl(pngUrl);
            startStudio();

        } catch (error) {
            console.warn("Public AI Service unavailable/failed:", error);

            // FALLBACK: Use simple canvas removal
            const fallbackUrl = await removeBackgroundSimple(plant.imageUrl, 20);

            setCutoutUrl(fallbackUrl);

            // Helpful toast for developer
            const isApiKeyError = (error as Error).message === "Missing API Key";
            toast(
                isApiKeyError ? "Setup API Key in .env for better quality!" : "Using basic cutout mode.",
                { icon: isApiKeyError ? '🔑' : '🔧' }
            );

            startStudio();
        } finally {
            setIsProcessing(false);
        }
    };

    // --- CAMERA STUDIO LOGIC ---
    const startStudio = async () => {
        setViewMode('STUDIO');
        setPos({ x: 50, y: 50 }); // Center plant
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (e) {
            console.error("Camera denied", e);
            toast.error("Camera access required for AR");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    const captureScene = () => {
        if (!videoRef.current || !cutoutUrl) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Video Frame
        ctx.drawImage(video, 0, 0);

        // 2. Draw Plant (respecting current pos)
        const plantImg = new Image();
        plantImg.crossOrigin = "Anonymous";
        plantImg.src = cutoutUrl;
        plantImg.onload = () => {
            // Calculate position based on percentages
            const imgW = canvas.width * 0.5; // Plant is ~50% of screen width
            const imgH = (plantImg.height / plantImg.width) * imgW;

            const x = (pos.x / 100) * canvas.width - (imgW / 2);
            const y = (pos.y / 100) * canvas.height - (imgH / 2);

            ctx.drawImage(plantImg, x, y, imgW, imgH);

            // 3. Save
            const finalImage = canvas.toDataURL('image/png');
            // Download it
            const link = document.createElement('a');
            link.download = `vanamap-ar-${Date.now()}.png`;
            link.href = finalImage;
            link.click();

            toast.success("Design Saved to Gallery!", { icon: '📸' });
        };
    };

    // --- INTERACTION LOGIC ---
    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!dragging) return;
        // Convert screen coords to percentage
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        setPos({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            handleDragMove(e.clientX, e.clientY);
        }
    };

    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.ambientGlow} />
            <div className={styles.scanline} />

            {/* --- HEADER --- */}
            <div className={styles.header}>
                <div className={styles.brand}>
                    <ScanLine size={20} className="text-emerald-400" />
                    <span>Neural<span className="text-emerald-400">Studio</span></span>
                    <span className={styles.brandBadge}>BETA</span>
                </div>
            </div>

            {/* --- VIEW 1: SELECTION --- */}
            {viewMode === 'SELECTION' && (
                <div className={styles.selectionView}>
                    <div className={styles.heroSection}>
                        <h1 className={styles.heroTitle}>Reality, Augmented.</h1>
                        <p className={styles.heroText}>Select a specimen. Our neural network will isolate it. You place it in your world.</p>
                    </div>

                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search botanical database..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.plantGrid}>
                        {filteredPlants.map(plant => (
                            <div
                                key={plant._id}
                                className={styles.plantCard}
                                onClick={() => processPlant(plant)}
                            >
                                <img src={plant.imageUrl} className={styles.cardImage} alt={plant.name} loading="lazy" />
                                <div className={styles.cardOverlay}>
                                    <h4 className={styles.cardName}>{plant.name}</h4>
                                    <span className={styles.cardSci}>{plant.scientificName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PROCESSING OVERLAY --- */}
            {isProcessing && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.scanner}>
                        <div className={styles.scanBeam} />
                        {selectedPlant && <img src={selectedPlant.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />}
                    </div>
                    <div className={styles.loaderText}>Isolating Subject...</div>
                </div>
            )}

            {/* --- VIEW 2: AR STUDIO --- */}
            {viewMode === 'STUDIO' && (
                <div
                    className={styles.arView}
                    onTouchMove={handleTouchMove}
                    onMouseMove={handleMouseMove}
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* 1. Camera Feed */}
                    <video
                        ref={videoRef}
                        className={styles.cameraVideo}
                        autoPlay
                        playsInline
                        muted
                    />

                    {/* 2. Drag Overlay */}
                    {dragging && <div style={{ position: 'absolute', inset: 0, zIndex: 10 }} onMouseUp={() => setDragging(false)} onTouchEnd={() => setDragging(false)} />}

                    {/* 3. The Plant */}
                    {cutoutUrl && (
                        <img
                            src={cutoutUrl}
                            className={styles.arPlant}
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                            }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                            draggable={false}
                        />
                    )}

                    {/* 4. UI Layer */}
                    <div className={styles.arOverlay}>
                        <div className={styles.arHeader}>
                            <button className={styles.glassBtn} onClick={() => {
                                stopCamera();
                                setViewMode('SELECTION');
                            }}>
                                <ArrowLeft size={20} />
                            </button>
                        </div>

                        <div className={styles.arFooter}>
                            <button className={styles.shutterBtn} onClick={captureScene}>
                                <div className={styles.shutterInner} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
