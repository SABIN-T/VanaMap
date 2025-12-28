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
    const resizeImage = (url: string, maxWidth: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;

            // Timeout if image load hangs (e.g. network issues)
            const timeout = setTimeout(() => reject(new Error('Image Load Timeout')), 10000);

            img.onload = () => {
                clearTimeout(timeout);
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas Error'));

                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Blob Error'));
                }, 'image/jpeg', 0.8);
            };
            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Image Load Failed'));
            };
        });
    };

    const removeBackgroundSimple = async (imageSrc: string, tolerance: number = 20): Promise<string> => {
        try {
            // Optimization: Resize first to avoid processing 4K/8K images on mobile thread
            const blob = await resizeImage(imageSrc, 600); // 600px sufficient for fallback
            const url = URL.createObjectURL(blob);

            return new Promise((resolve) => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(url);

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
            });
        } catch {
            return imageSrc; // If everything fails, just return original
        }
    };

    // --- STRATEGIES ---

    // 1. Remove.bg (Best Quality, requires Key)
    const removeBackgroundRemoveBg = async (blob: Blob): Promise<string> => {
        const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY || "kW5A7cdmPKAgNwGJVD8AuKuV";
        if (!apiKey) throw new Error("No API Key");

        const formData = new FormData();
        formData.append('image_file', blob);
        formData.append('size', 'preview'); // Fast & Good for AR

        const res = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': apiKey },
            body: formData
        });

        if (!res.ok) throw new Error(`Remove.bg Error: ${res.status}`);
        const resBlob = await res.blob();
        return URL.createObjectURL(resBlob);
    };

    // 2. Hugging Face Inference API (RMBG-1.4 / U2-Net)
    const removeBackgroundHF = async (blob: Blob): Promise<string> => {
        // Uses briaai/RMBG-1.4 (State of the art open model)
        const MODEL_ID = "briaai/RMBG-1.4";
        const HF_TOKEN = import.meta.env.VITE_HF_TOKEN; // Optional but recommended

        const headers: Record<string, string> = {};
        if (HF_TOKEN) headers['Authorization'] = `Bearer ${HF_TOKEN}`;

        const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: "POST",
            headers,
            body: blob,
        });

        if (!res.ok) throw new Error(`HF API Error: ${res.status}`);
        const resBlob = await res.blob();
        return URL.createObjectURL(resBlob);
    };

    // 3. Self-Hosted Python Service (U2-Net / Rembg)
    const removeBackgroundPython = async (blob: Blob): Promise<string> => {
        const baseUrl = import.meta.env.VITE_AI_API_URL;
        if (!baseUrl) throw new Error("No Python Service URL");

        const formData = new FormData();
        formData.append('file', blob, 'plant.jpg');

        const res = await fetch(`${baseUrl}/remove-bg`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error("Python Service Error");
        const resBlob = await res.blob();
        return URL.createObjectURL(resBlob);
    };

    // --- MAIN PROCESSOR ---
    const processPlant = async (plant: any) => {
        setIsProcessing(true);
        setSelectedPlant(plant);

        try {
            // 1. Optimize Image (Resize to 1000px for good balance)
            const resizedBlob = await resizeImage(plant.imageUrl, 1000);

            // 2. Try Strategies in Order
            let resultUrl: string | null = null;
            let successStrategy = "";

            // Strategy A: Remove.bg
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundRemoveBg(resizedBlob);
                    successStrategy = "Remove.bg";
                } catch (e) { console.log("Strategy A skipped:", e); }
            }

            // Strategy B: Hugging Face (U2-Net / RMBG)
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundHF(resizedBlob);
                    successStrategy = "Hugging Face (U2-Net)";
                } catch (e) { console.log("Strategy B skipped:", e); }
            }

            // Strategy C: Python Service (Self-Hosted)
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundPython(resizedBlob);
                    successStrategy = "Python Service";
                } catch (e) { console.log("Strategy C skipped:", e); }
            }

            // Strategy D: Local Fallback
            if (!resultUrl) {
                resultUrl = await removeBackgroundSimple(plant.imageUrl, 20);
                successStrategy = "Basic Cutout";
                toast("Using Basic Mode (AI Offline)", { icon: '🔧' });
            } else {
                // Success Toast
                toast.success(`Processed with ${successStrategy}`, { position: 'bottom-center' });
            }

            setCutoutUrl(resultUrl);
            startStudio();

        } catch (error) {
            console.error("All bg removal failed", error);
            toast.error("Could not process image");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- CAMERA STUDIO LOGIC ---
    const startStudio = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            // Only switch view if camera succeeds
            setViewMode('STUDIO');
            setPos({ x: 50, y: 50 }); // Center plant
        } catch (e) {
            console.error("Camera denied", e);
            toast.error("Camera needed for AR mode.");
            // Do NOT switch to STUDIO view, stay on selection
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
