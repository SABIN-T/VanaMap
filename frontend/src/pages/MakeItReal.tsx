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

                        // If it's the pot area or background white
                        const isPotOrBg = (diff < 35) || (r > 200 && g > 200 && b > 200);

                        if (isPotOrBg) {
                            data[i + 3] = 0;
                        } else {
                            // Update content bounds
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                            hasContent = true;
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
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Video Frame
        ctx.drawImage(video, 0, 0);

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

        // 3. Draw Pot (if enabled)
        const scale = 0.55;
        const potW = canvas.width * scale;
        const potH = (potImg ? (potImg.height / potImg.width) : 1) * potW;
        const x = (pos.x / 100) * canvas.width - (potW / 2);
        const y = (pos.y / 100) * canvas.height - (potH / 2);

        if (potImg) {
            // Draw Plant first (behind/inside pot rim)
            const plantW = potW * 1.1; // Make it a bit bushier
            const plantH = (plantImg.height / plantImg.width) * plantW;

            // SHIFT: Place plant base exactly on the top rim level of the pot
            // We shift it down so it overlaps the pot area
            const plantY = y - plantH + (potH * 0.2);
            ctx.drawImage(plantImg, x + (potW - plantW) / 2, plantY, plantW, plantH);
            ctx.drawImage(potImg, x, y, potW, potH);
        } else {
            const imgW = canvas.width * scale;
            const imgH = (plantImg.height / plantImg.width) * imgW;
            ctx.drawImage(plantImg, x, y, imgW, imgH);
        }

        // 4. Save
        const finalImage = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `vanamap-design-${Date.now()}.png`;
        link.href = finalImage;
        link.click();
        toast.success("Masterpiece Saved!", { icon: '🏆' });
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
                                    marginBottom: useStudioPot ? '-40px' : '0',
                                    zIndex: 1
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
