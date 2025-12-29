import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import styles from './MakeItReal.module.css';
import { fetchPlants } from '../services/api';
import type { Plant } from '../types';
import toast from 'react-hot-toast';
import { Search, ArrowLeft, ScanLine, Sparkles } from 'lucide-react';

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
    const [useStudioPot, setUseStudioPot] = useState(true);
    const [pos, setPos] = useState({ x: 50, y: 50 });
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

                    // 1. Precise Background Profile
                    const width = canvas.width;
                    const height = canvas.height;
                    const bg = { r: data[0], g: data[1], b: data[2] };

                    // 2. Clear Background + Find Content Bounds
                    let minX = width, minY = height, maxX = 0, maxY = 0;
                    let hasContent = false;

                    for (let i = 0; i < data.length; i += 4) {
                        const x = (i / 4) % width;
                        const y = Math.floor((i / 4) / width);
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const diff = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);

                        // VIBRANCY ANALYSIS: Is this actually a plant leaf?
                        // Plants are usually significantly more saturated than shadows/pots
                        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
                        const isNeutral = saturation < 30; // Shadows, Pots, and Backgrounds are neutral

                        // If it matches background OR it's a neutral-colored pixel (shadow/pot)
                        const isTargetToRemove = (diff < 45) || (r > 190 && g > 190 && b > 190) || (isNeutral && y > height * 0.5);

                        if (isTargetToRemove) {
                            data[i + 3] = 0;
                        } else {
                            // Update content bounds ONLY for colored/vibrant pixels (must be the plant)
                            if (saturation > 25) {
                                if (x < minX) minX = x;
                                if (x > maxX) maxX = x;
                                if (y < minY) minY = y;
                                if (y > maxY) maxY = y;
                                hasContent = true;
                            }
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);

                    if (!hasContent) {
                        resolve(canvas.toDataURL('image/png'));
                        return;
                    }

                    // 3. AUTO-CROP: Create a new canvas with just the plant content
                    const cropW = maxX - minX + 1;
                    const cropH = maxY - minY + 1;
                    const cropCanvas = document.createElement('canvas');
                    cropCanvas.width = cropW;
                    cropCanvas.height = cropH;
                    const cropCtx = cropCanvas.getContext('2d');
                    if (cropCtx) {
                        cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
                        resolve(cropCanvas.toDataURL('image/png'));
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
    const captureScene = async () => {
        if (!videoRef.current || !cutoutUrl) return;

        const video = videoRef.current;

        // 1. Calculate aspect ratio fitting (matching object-fit: cover)
        const windowRatio = window.innerWidth / window.innerHeight;
        const videoRatio = video.videoWidth / video.videoHeight;

        let startX = 0, startY = 0, drawWidth = video.videoWidth, drawHeight = video.videoHeight;

        if (videoRatio > windowRatio) {
            // Video is wider than screen: Crop sides
            drawWidth = video.videoHeight * windowRatio;
            startX = (video.videoWidth - drawWidth) / 2;
        } else {
            // Video is taller than screen: Crop top/bottom
            drawHeight = video.videoWidth / windowRatio;
            startY = (video.videoHeight - drawHeight) / 2;
        }

        const canvas = document.createElement('canvas');
        // Use high-res but keep preview aspect ratio
        canvas.width = 1200;
        canvas.height = 1200 / windowRatio;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Video Frame (Exactly as seen on screen)
        ctx.drawImage(video, startX, startY, drawWidth, drawHeight, 0, 0, canvas.width, canvas.height);

        // 2. Load Images
        const [plantImg, potImg] = await Promise.all([
            new Promise<HTMLImageElement>((resolve) => {
                const img = new Image(); img.crossOrigin = "Anonymous";
                img.src = cutoutUrl; img.onload = () => resolve(img);
            }),
            useStudioPot ? new Promise<HTMLImageElement>((resolve) => {
                const img = new Image(); img.src = "/images/sig-pot.png";
                img.onload = () => resolve(img);
            }) : Promise.resolve(null)
        ]);

        // 3. Setup Composition Offscreen for Lighting Pass
        const potW = canvas.width * 0.40;
        const potH = (potImg ? (potImg.height / potImg.width) : 1) * potW;
        const compCanvas = document.createElement('canvas');
        compCanvas.width = potW * 2; compCanvas.height = (potH + 500);
        const cCtx = compCanvas.getContext('2d');
        if (!cCtx) return;

        // Draw Composition to offscreen first
        let plantW = potW * 0.72;
        let plantH = (plantImg.height / plantImg.width) * plantW;
        let cX = potW, cY = compCanvas.height - potH;

        if (potImg) {
            const plantY = cY - (plantH * 0.85) + (potH * 0.12);
            cCtx.drawImage(plantImg, cX - (plantW / 2), plantY, plantW, plantH);
            cCtx.drawImage(potImg, cX - (potW / 2), cY, potW, potH);
        } else {
            cCtx.drawImage(plantImg, cX - (potW / 2), cY, potW, (plantImg.height / plantImg.width) * potW);
        }

        // 4. NEURAL LIGHTING: Sample Local Environment
        const sampleX = Math.max(0, (pos.x / 100) * canvas.width - 100);
        const sampleY = Math.max(0, (pos.y / 100) * canvas.height - 100);
        const envData = ctx.getImageData(sampleX, sampleY, 200, 200).data;
        let lR = 0, lG = 0, lB = 0;
        for (let j = 0; j < envData.length; j += 16) {
            lR += envData[j]; lG += envData[j + 1]; lB += envData[j + 2];
        }
        const lCount = envData.length / 16;
        const envR = lR / lCount, envG = lG / lCount, envB = lB / lCount;

        // Apply Light Adaptation to Composition
        cCtx.globalCompositeOperation = 'source-atop';
        cCtx.fillStyle = `rgb(${envR}, ${envG}, ${envB})`;
        cCtx.globalAlpha = 0.2; // Blend with environment
        cCtx.fillRect(0, 0, compCanvas.width, compCanvas.height);

        // Final Color Correction (Match brightness/contrast of room)
        const luminance = (envR + envG + envB) / 3;
        const brightness = 0.8 + (luminance / 255) * 0.4;
        cCtx.filter = `brightness(${brightness}) contrast(1.1)`;
        cCtx.drawImage(compCanvas, 0, 0);

        // 5. Final Assembly with Ground Shadow
        ctx.save();
        const drawX = (pos.x / 100) * canvas.width;
        const drawY = (pos.y / 100) * canvas.height;

        // Calculate the "Visual Center" of the composition to match CSS translate(-50%, -50%)
        // The composition is drawn on an offscreen canvas and then centered on the final frame.

        // Fake Ground Shadow for Realism
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowOffsetY = 15;

        ctx.drawImage(compCanvas, drawX - cX, drawY - (compCanvas.height / 2));
        ctx.restore();

        // 6. Output Perfect Sync
        const finalImage = canvas.toDataURL('image/jpeg', 0.98);
        const link = document.createElement('a');
        link.download = `VanaMap_LiveShot_${Date.now()}.jpg`;
        link.href = finalImage;
        link.click();
        toast.success("Final Masterpiece Saved!", { icon: '✨' });
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

                    {/* 3. The Composition */}
                    {cutoutUrl && (
                        <div
                            className={styles.composition}
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                            }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            {/* Foliage */}
                            <img
                                src={cutoutUrl}
                                className={styles.foliage}
                                alt="Foliage"
                                draggable={false}
                                style={{
                                    marginBottom: useStudioPot ? '-48px' : '0',
                                    zIndex: 1,
                                    transform: useStudioPot ? 'scale(0.85)' : 'none'
                                }}
                            />
                            {/* Pot Overlay */}
                            {useStudioPot && (
                                <img
                                    src="/images/sig-pot.png"
                                    className={styles.potOverlay}
                                    alt="Pot"
                                    draggable={false}
                                    style={{ zIndex: 2 }}
                                />
                            )}
                        </div>
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

                            <button
                                className={`${styles.glassBtn} ${useStudioPot ? styles.active : ''}`}
                                onClick={() => setUseStudioPot(!useStudioPot)}
                                title="Toggle Signature Pot"
                            >
                                <Sparkles size={18} color={useStudioPot ? '#facc15' : '#fff'} />
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
