import { useState, useRef, useEffect, type MouseEvent } from 'react';
import styles from './MakeItReal.module.css';
import { Upload, Search, Wand2, RefreshCw, ZoomIn, ZoomOut, Image as ImageIcon, Camera, X, Check, Loader2, Sparkles, Sliders, Palette } from 'lucide-react';
import { fetchPlants } from '../services/api';
import toast from 'react-hot-toast';

// Constants
const POT_COLORS = [
    { name: 'Classic White', hex: '#ffffff' },
    { name: 'Terracotta', hex: '#e07a5f' },
    { name: 'Charcoal', hex: '#264653' },
    { name: 'Sage Green', hex: '#81b29a' },
    { name: 'Navy Blue', hex: '#3d405b' },
    { name: 'Concrete', hex: '#9ca3af' },
    { name: 'Mustard', hex: '#f2cc8f' },
    { name: 'Black', hex: '#000000' },
];

const removeWhiteBackground = (imageSrc: string, tolerance: number = 30): Promise<string> => {
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
            const width = canvas.width;
            const height = canvas.height;

            const bgR = data[0];
            const bgG = data[1];
            const bgB = data[2];

            const getDist = (index: number) => {
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                return Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            };

            const queue: number[] = [];
            const visited = new Uint8Array(width * height);

            const corners = [0, width - 1, (height - 1) * width, (height - 1) * width + (width - 1)];

            for (const idx of corners) {
                if (getDist(idx * 4) <= tolerance) {
                    queue.push(idx);
                    visited[idx] = 1;
                }
            }

            while (queue.length > 0) {
                const idx = queue.shift()!;
                const x = idx % width;
                const y = Math.floor(idx / width);

                const pixIdx = idx * 4;
                data[pixIdx + 3] = 0;

                const neighbors = [
                    { nx: x + 1, ny: y },
                    { nx: x - 1, ny: y },
                    { nx: x, ny: y + 1 },
                    { nx: x, ny: y - 1 }
                ];

                for (const { nx, ny } of neighbors) {
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nIdx = ny * width + nx;
                        if (visited[nIdx] === 0) {
                            if (getDist(nIdx * 4) <= tolerance) {
                                visited[nIdx] = 1;
                                queue.push(nIdx);
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
            console.warn("Could not process image (likely CORS), using original.");
            resolve(imageSrc);
        };
    });
};

// Generates a composite of the Plant (no bg) inside the PotBase (tinted)
const generateComposite = async (plantSrc: string, potSrc: string, colorHex: string): Promise<string> => {
    return new Promise(async (resolve) => {
        // Load Images
        const loadImage = (src: string) => new Promise<HTMLImageElement>((r) => {
            const i = new Image();
            i.crossOrigin = "Anonymous";
            i.src = src;
            i.onload = () => r(i);
            i.onerror = () => r(i); // proceeding anyway
        });

        const [plantImg, potImg] = await Promise.all([loadImage(plantSrc), loadImage(potSrc)]);

        const canvas = document.createElement('canvas');
        canvas.width = potImg.width;
        canvas.height = potImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(plantSrc);

        // --- LAYER 1: PLANT (Behind/Inside Pot) ---
        // Scale plant to fit decently within the pot width
        // Assume pot opening is roughly 80% of pot width
        const plantScale = (canvas.width * 0.85) / plantImg.width;
        const pW = plantImg.width * plantScale;
        const pH = plantImg.height * plantScale;

        // Center Horizontally
        const pX = (canvas.width - pW) / 2;
        // Position Vertically: Plant bottom should be near the bottom of the pot but hidden
        // Let's place the bottom of the plant at 90% of pot height
        const pY = (canvas.height * 0.9) - pH;

        ctx.drawImage(plantImg, pX, pY, pW, pH);

        // --- LAYER 2: POT (Tinted) ---
        // We need to tint the pot.
        // Create an offscreen canvas for the pot to apply tint
        const potCanvas = document.createElement('canvas');
        potCanvas.width = canvas.width;
        potCanvas.height = canvas.height;
        const pCtx = potCanvas.getContext('2d');
        if (pCtx) {
            // Draw Pot
            pCtx.drawImage(potImg, 0, 0);

            // Apply Tint (Multiply)
            // This works best if pot is white/light.
            pCtx.globalCompositeOperation = 'multiply';
            pCtx.fillStyle = colorHex;
            pCtx.fillRect(0, 0, potCanvas.width, potCanvas.height);

            // Restore Alpha (clean up the rectangle overflow)
            pCtx.globalCompositeOperation = 'destination-in';
            pCtx.drawImage(potImg, 0, 0);
        }

        // Draw the tinted pot on top of the plant
        ctx.drawImage(potCanvas, 0, 0);

        resolve(canvas.toDataURL('image/png'));
    });
};


const getImgCoordinates = (e: React.MouseEvent, img: HTMLImageElement) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ratio = img.naturalWidth / img.naturalHeight;
    const elemRatio = rect.width / rect.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (ratio > elemRatio) {
        drawWidth = rect.height * ratio;
        drawHeight = rect.height;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = rect.width;
        drawHeight = rect.width / ratio;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
    }
    const naturalX = (x - offsetX) * (img.naturalWidth / drawWidth);
    const naturalY = (y - offsetY) * (img.naturalHeight / drawHeight);
    return { x: naturalX, y: naturalY };
}

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

    // Modal / Preview State
    const [previewPlant, setPreviewPlant] = useState<any | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Potting State
    const [autoRemoveBg, setAutoRemoveBg] = useState(true);
    const [potColor, setPotColor] = useState<string>('#ffffff');
    const [cleanPlantImg, setCleanPlantImg] = useState<string | null>(null);

    // Refs
    const potBaseRef = useRef<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Transform State
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isMagicMode, setIsMagicMode] = useState(false);

    useEffect(() => {
        loadPlants();
        // Preload and clean pot base
        removeWhiteBackground('/pot-base.png', 20).then(res => {
            potBaseRef.current = res;
        });
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

    const onPlantClick = async (plant: any) => {
        setPreviewPlant(plant);
        setProcessedImage(null);
        setPotColor('#ffffff'); // Reset to white
        setIsProcessing(true);

        try {
            // 1. Remove BG from Plant (Always do this for potting flow)
            // Even if we don't auto-remove in final, we need it for potting
            const noBg = await removeWhiteBackground(plant.imageUrl, 40);
            setCleanPlantImg(noBg);

            // 2. Generate Initial Composite
            if (potBaseRef.current) {
                const composite = await generateComposite(noBg, potBaseRef.current, '#ffffff');
                setProcessedImage(composite);
            } else {
                // Fallback if pot not loaded yet
                setProcessedImage(noBg);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Effect: Update Composite when Pot Color Changes
    useEffect(() => {
        if (!previewPlant || !cleanPlantImg || !potBaseRef.current) return;

        const updateComposite = async () => {
            // Processing indicator specific to color change? 
            // Might be fast enough to not need it, but let's see.
            const composite = await generateComposite(cleanPlantImg, potBaseRef.current!, potColor);
            setProcessedImage(composite);
        };

        updateComposite();
    }, [potColor, cleanPlantImg]); // Re-run if color or base plant changes


    const confirmPlacement = () => {
        if (!roomImage) {
            toast.error("Please upload a room photo first!");
            setPreviewPlant(null);
            return;
        }
        setPlacedPlant({ ...previewPlant, imageUrl: processedImage });
        setPosition({ x: 50, y: 50 });
        setScale(1);
        setPreviewPlant(null);
        toast.success("Added to scene!");
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
            {/* CAMERA OVERLAY */}
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

            {/* PLANT PREVIEW MODAL */}
            {previewPlant && (
                <div className={styles.modalOverlay} onClick={() => setPreviewPlant(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Customize {previewPlant.name}</h2>

                        <div className={styles.previewContainer}>
                            {processedImage ? (
                                <img
                                    src={processedImage}
                                    className={styles.previewImage}
                                    alt="Preview"
                                />
                            ) : (
                                <div className="text-gray-400">Loading...</div>
                            )}
                            {isProcessing && (
                                <div className={styles.processingOverlay}>
                                    <Loader2 className="animate-spin" /> Preparing Pot...
                                </div>
                            )}
                        </div>

                        {/* CONTROLS */}
                        <div style={{ marginTop: '0.5rem' }}>
                            <div className={styles.toggleLabel} style={{ marginBottom: '0.5rem' }}>
                                <Palette size={16} /> Select Pot Color
                            </div>
                            <div className={styles.colorPalette}>
                                {POT_COLORS.map(c => (
                                    <div
                                        key={c.name}
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: c.hex }}
                                        data-selected={potColor === c.hex}
                                        onClick={() => setPotColor(c.hex)}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.secondaryBtn} onClick={() => setPreviewPlant(null)}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={confirmPlacement} disabled={isProcessing}>
                                <Check size={18} style={{ marginRight: '8px' }} />
                                Place in Scene
                            </button>
                        </div>
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
                                placeholder="Search library..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.plantList}>
                        {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading Library...</div> :
                            filteredPlants.map(plant => (
                                <div key={plant.id} className={styles.plantCard} onClick={() => onPlantClick(plant)}>
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
                                        alt="Placed Plant"
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
                                    <Wand2 size={18} /> {isMagicMode ? 'Light Blend' : 'Light Blend'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
