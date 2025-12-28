import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import styles from './MakeItReal.module.css';
import { fetchPlants } from '../services/api';
import type { Plant } from '../types';
import toast from 'react-hot-toast';
import { Search, ArrowLeft, ScanLine } from 'lucide-react';

/* 
 * 🧠 MakeItReal v3.0 - Neural Studio
 * Pure React + Python FastAPI Architecture
 */

export const MakeItReal = () => {
    // --- STATE ---
    const [viewMode, setViewMode] = useState<'SELECTION' | 'STUDIO' | 'RESULT'>('SELECTION');
    const [plants, setPlants] = useState<Plant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Core Data
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);

    // Studio State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Plant Transform State (Draggable)
    const [pos, setPos] = useState({ x: 0, y: 0 }); // Percentages
    const [dragging, setDragging] = useState(false);

    // --- CORE METHODS ---
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    const startStudio = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            setStream(mediaStream);
            setViewMode('STUDIO');
            setPos({ x: 50, y: 50 });
        } catch (e) {
            console.error("Camera denied", e);
            toast.error("Camera access denied. Please enable it in settings.");
        }
    };

    // --- EFFECT: Camera Connector ---
    useEffect(() => {
        if (viewMode === 'STUDIO' && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Video play error", e));
        }
    }, [viewMode, stream]);

    const loadPlants = async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);
        } catch (e) {
            console.error(e);
            toast.error("Unlinked from database.");
        }
    };

    // --- EFFECT ---
    useEffect(() => {
        loadPlants();
        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- HELPERS ---
    const resizeImage = (url: string, maxWidth: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;

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

    const removeBackgroundSimple = async (imageSrc: string): Promise<string> => {
        try {
            const blob = await resizeImage(imageSrc, 1000);
            const url = URL.createObjectURL(blob);

            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
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

                    // 1. Better Background Sampling (Top edge is almost always pure background)
                    let rSum = 0, gSum = 0, bSum = 0;
                    const samplePoints = 10;
                    for (let x = 0; x < samplePoints; x++) {
                        const idx = Math.floor(x * (canvas.width / samplePoints)) * 4;
                        rSum += data[idx]; gSum += data[idx + 1]; bSum += data[idx + 2];
                    }
                    const bg = { r: rSum / samplePoints, g: gSum / samplePoints, b: bSum / samplePoints };

                    // 2. Advanced Extraction with "Pot Protection"
                    const tolerance = 35;
                    const centerX = canvas.width / 2;

                    for (let i = 0; i < data.length; i += 4) {
                        const px = (i / 4) % canvas.width;
                        const py = Math.floor((i / 4) / canvas.width);

                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const diff = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);

                        // Calculate distance from center-bottom (where the pot usually is)
                        const distToPotCenter = Math.sqrt((px - centerX) ** 2 + (py - (canvas.height * 0.7)) ** 2);
                        const isPotArea = distToPotCenter < (canvas.width * 0.25);

                        // SCIENTIFIC LOGIC: 
                        // If we are in the "Pot Area", we use a MUCH tighter tolerance.
                        // We only remove pixels that are ALMOST EXACTLY the background color. 
                        // This prevents the white pot from being eaten.
                        const activeTolerance = isPotArea ? 15 : tolerance;

                        // Check for "Studio White" highlights vs "Flat Background"
                        const isPureWhiteBG = r > 245 && g > 245 && b > 245 && diff < 10;

                        if (diff < activeTolerance || isPureWhiteBG) {
                            // Leave a tiny bit of alpha (0.02) for edge smoothing if needed
                            data[i + 3] = 0;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);

                    // 3. Final Polish: Alpha Smoothing
                    const polish = document.createElement('canvas');
                    polish.width = canvas.width; polish.height = canvas.height;
                    const pCtx = polish.getContext('2d');
                    if (pCtx) {
                        pCtx.filter = 'contrast(1.1) brightness(1.05)'; // Make the pot pop
                        pCtx.drawImage(canvas, 0, 0);
                        resolve(polish.toDataURL('image/png'));
                    } else {
                        resolve(canvas.toDataURL('image/png'));
                    }
                };
            });
        } catch {
            return imageSrc;
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
        // Fallback to localhost if no production URL is set
        const baseUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

        const formData = new FormData();
        formData.append('file', blob, 'plant.jpg');

        try {
            const res = await fetch(`${baseUrl}/remove-bg`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error(`Python API Error: ${res.status}`);
            const resBlob = await res.blob();
            return URL.createObjectURL(resBlob);
        } catch {
            // Throwing triggers the next strategy
            throw new Error(`Python Service Unreachable at ${baseUrl}`);
        }
    };

    // --- MAIN PROCESSOR ---
    const processPlant = async (plant: Plant) => {
        setIsProcessing(true);
        setSelectedPlant(plant);

        try {
            // 1. Optimize Image (Resize to 1000px for good balance)
            const resizedBlob = await resizeImage(plant.imageUrl, 1000);

            // 2. Try Strategies in Order
            let resultUrl: string | null = null;
            let successStrategy = "";

            // Strategy A: Remove.bg (Commercial / Key)
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundRemoveBg(resizedBlob);
                    successStrategy = "Remove.bg";
                } catch (e) { console.warn("Strategy A (Remove.bg) failed:", e); }
            }

            // Strategy B: Hugging Face (Public AI)
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundHF(resizedBlob);
                    successStrategy = "Hugging Face";
                } catch (e) { console.warn("Strategy B (Hugging Face) failed:", e); }
            }

            // Strategy C: Python Service (Local/Render)
            if (!resultUrl) {
                try {
                    resultUrl = await removeBackgroundPython(resizedBlob);
                    successStrategy = "Python Service";
                } catch (e) { console.warn("Strategy C (Python) failed:", e); }
            }

            // Strategy D: Local Fallback (Improved Canvas)
            if (!resultUrl) {
                resultUrl = await removeBackgroundSimple(plant.imageUrl);
                successStrategy = "Edge Detection";
                toast("AI Latency High. Using Studio Mode.", { icon: '⚙️' });
            } else {
                toast.success(`Neural Processing: ${successStrategy}`, {
                    position: 'bottom-center',
                    style: { background: '#022c22', color: '#10b981', border: '1px solid #064e3b' }
                });
            }

            setCutoutUrl(resultUrl);
            await startStudio();

        } catch (error) {
            console.error("All bg removal strategies failed", error);
            toast.error("Could not process image");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- CAMERA STUDIO LOGIC ---
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
                        {selectedPlant && <img src={selectedPlant.imageUrl} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />}
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
                            alt="AR Plant"
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
