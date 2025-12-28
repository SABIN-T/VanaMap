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

const POT_STYLES = [
    { id: 'base', name: 'Curved', src: '/pot-base.png' },
    { id: 'classic', name: 'Classic', src: '/pot-classic.png' },
    { id: 'modern', name: 'Modern', src: '/pot-modern.png' },
    { id: 'wide', name: 'Wide', src: '/pot-wide.png' },
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

// 1. Just returns the tinted pot image (fast) for the UI overlay
const tintPotImage = async (potSrc: string, colorHex: string): Promise<string> => {
    return new Promise((resolve) => {
        const i = new Image();
        i.crossOrigin = "Anonymous";
        i.src = potSrc;
        i.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = i.width;
            canvas.height = i.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(i, 0, 0);

                // Tint
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = colorHex;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Cutout
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(i, 0, 0);

                resolve(canvas.toDataURL('image/png'));
            } else {
                resolve(potSrc);
            }
        };
        i.onerror = () => resolve(potSrc);
    });
};

// 2. Bakes the final composite with exact offsets
const bakeComposite = async (plantSrc: string, potSrc: string, colorHex: string, offset: { x: number, y: number }): Promise<string> => {
    return new Promise(async (resolve) => {
        const loadImage = (src: string) => new Promise<HTMLImageElement>((r) => {
            const i = new Image();
            i.crossOrigin = "Anonymous";
            i.src = src;
            i.onload = () => r(i);
            i.onerror = () => r(i);
        });

        const [plantImg, potImg] = await Promise.all([loadImage(plantSrc), loadImage(potSrc)]);

        const canvas = document.createElement('canvas');
        canvas.width = potImg.width;
        canvas.height = potImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(plantSrc);

        // --- LAYER 1: PLANT ---
        // Apply the user's visual offset and scale
        // The user offset is in % of the container size (300px).
        // We need to map 300px visual -> potImg.width actual

        // Visual Container was roughly 300px square in CSS (or responsive).
        // Let's assume standard normalization:
        // The 'scale' passed here is simply: canvas.width * 0.85 / plantImg.width (initial default)
        // Adjustments are made via offset.

        const standardScale = (canvas.width * 0.85) / plantImg.width;
        const pW = plantImg.width * standardScale;
        const pH = plantImg.height * standardScale;

        // Default Center
        const defaultX = (canvas.width - pW) / 2;
        const defaultY = (canvas.height * 0.9) - pH;

        // Apply Custom Offset
        // offset.x/y are percentages of the visual container.
        // If we treat the canvas.width as the 100% reference:
        const moveX = (offset.x / 100) * canvas.width;
        const moveY = (offset.y / 100) * canvas.height;

        ctx.drawImage(plantImg, defaultX + moveX, defaultY + moveY, pW, pH);

        // --- LAYER 2: POT ---
        // Tint Logic Inline (or re-use tinted src if we passed it, but easier to just re-tint here for high-res final)
        const potCanvas = document.createElement('canvas');
        potCanvas.width = canvas.width;
        potCanvas.height = canvas.height;
        const pCtx = potCanvas.getContext('2d');
        if (pCtx) {
            pCtx.drawImage(potImg, 0, 0);
            pCtx.globalCompositeOperation = 'multiply';
            pCtx.fillStyle = colorHex;
            pCtx.fillRect(0, 0, potCanvas.width, potCanvas.height);
            pCtx.globalCompositeOperation = 'destination-in';
            pCtx.drawImage(potImg, 0, 0);
        }
        ctx.drawImage(potCanvas, 0, 0);

        resolve(canvas.toDataURL('image/png'));
    });
};




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

    // Wizard State
    // Steps: 'none' -> 'bg-remove' -> 'pot-select' -> 'placed'
    const [currentStep, setCurrentStep] = useState<'none' | 'bg-remove' | 'pot-select'>('none');

    const [previewPlant, setPreviewPlant] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Step 1 State: BG Removal
    const [bgTolerance, setBgTolerance] = useState(40);
    const [autoRemoveBg, setAutoRemoveBg] = useState(true);
    const [previewBgRemoved, setPreviewBgRemoved] = useState<string | null>(null);

    // Step 2 State
    const [potColor, setPotColor] = useState<string>('#ffffff');
    const [potStyle, setPotStyle] = useState<string>('base');
    const [tintedPotUrl, setTintedPotUrl] = useState<string | null>(null);
    const [plantPotOffset, setPlantPotOffset] = useState({ x: 0, y: 0 }); // % offset
    const [highlightUpload, setHighlightUpload] = useState(false);

    // Pot Style Source Refs
    // We can just use the path string directly since we are moving away from composite-on-load

    // Refs
    // const potBaseRef = useRef<string | null>(null); // No longer strictly needed if we use paths, but kept for cache?
    const canvasRef = useRef<HTMLDivElement>(null);
    const step2PreviewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Transform State (For Final Scene)
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [activeDragTarget, setActiveDragTarget] = useState<'scene' | 'wizard'>('scene');
    const dragStartRef = useRef({ x: 0, y: 0, initialPos: { x: 0, y: 0 } });

    // ... magic mode state
    const [isMagicMode, setIsMagicMode] = useState(false);

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
            setHighlightUpload(false);
            toast.success("Room uploaded! Now pick a plant.");
        }
    };

    // Notification when ready
    useEffect(() => {
        if (roomImage) {
            toast("📸 Setup Complete! Tap a plant to place it.", { icon: '🌿' });
        }
    }, [roomImage]);

    // --- STEP 1 LOGIC: INIT ---
    const onPlantClick = (plant: any) => {
        if (!roomImage) {
            toast.error("Please take a photo or upload an image first!");
            setHighlightUpload(true);
            return;
        }

        setPreviewPlant(plant);
        setCurrentStep('bg-remove');
        // Reset Logic
        setBgTolerance(40);
        setAutoRemoveBg(true);
        setPreviewBgRemoved(null);

        // Trigger initial removal
        runBgRemoval(plant.imageUrl, true, 40);
    };

    const runBgRemoval = async (url: string, remove: boolean, tol: number) => {
        setIsProcessing(true);
        try {
            if (!remove) {
                setPreviewBgRemoved(url);
            } else {
                const result = await removeWhiteBackground(url, tol);
                setPreviewBgRemoved(result);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBgToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBgTolerance(parseInt(e.target.value));
    };

    const handleBgToleranceCommit = () => {
        if (previewPlant && autoRemoveBg) {
            runBgRemoval(previewPlant.imageUrl, true, bgTolerance);
        }
    };
    // --- STEP 1 -> STEP 2 TRANSITION ---
    const goToPotSelection = () => {
        if (!previewBgRemoved) return;
        setCurrentStep('pot-select');
        setPotColor('#f2cc8f'); // Default to mustard/terracotta for nice look
        setPotStyle('classic');
        setPlantPotOffset({ x: 0, y: 0 }); // Reset offset

        // Initial Tint gen
        processTint('/pot-classic.png', '#f2cc8f');
    };

    // --- STEP 2 LOGIC: LIVE PREVIEW ---
    const processTint = async (src: string, color: string) => {
        setIsProcessing(true);
        try {
            // Should remove bg from pot if needed, generally assets are clean PNGs
            const cleaned = await removeWhiteBackground(src, 20);
            const tinted = await tintPotImage(cleaned, color);
            setTintedPotUrl(tinted);
        } finally {
            setIsProcessing(false);
        }
    }

    // Handlers
    const handlePotColorChange = (color: string) => {
        setPotColor(color);
        const style = POT_STYLES.find(s => s.id === potStyle) || POT_STYLES[0];
        processTint(style.src, color);
    };

    const handlePotStyleChange = (styleId: string) => {
        setPotStyle(styleId);
        const style = POT_STYLES.find(s => s.id === styleId) || POT_STYLES[0];
        processTint(style.src, potColor);
    };

    // --- FINISH ---
    const confirmPlacement = async () => {
        if (!roomImage) {
            toast.error("Please upload a room photo first!");
            setCurrentStep('none');
            setPreviewPlant(null);
            setHighlightUpload(true);
            return;
        }

        // BAKE FINAL IMAGE
        setIsProcessing(true);
        try {
            const style = POT_STYLES.find(s => s.id === potStyle) || POT_STYLES[0];
            const cleanedPot = await removeWhiteBackground(style.src, 20);

            const finalUrl = await bakeComposite(
                previewBgRemoved!,
                cleanedPot,
                potColor,
                plantPotOffset
            );

            setPlacedPlant({ ...previewPlant, imageUrl: finalUrl });
            setPosition({ x: 50, y: 50 });
            setScale(1);
            setCurrentStep('none');
            setPreviewPlant(null);
            toast.success("Added to scene!");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- DRAG HANDLERS (UNIFIED) ---
    const handleStart = (target: 'scene' | 'wizard', clientX: number, clientY: number) => {
        setIsDragging(true);
        setActiveDragTarget(target);
        document.body.style.overflow = 'hidden';

        // Store start points for precise delta drag
        dragStartRef.current = {
            x: clientX,
            y: clientY,
            initialPos: target === 'scene' ? { ...position } : { ...plantPotOffset }
        };
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;

        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;

        if (activeDragTarget === 'scene' && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            // Convert delta pixels to %
            const dXPercent = (dx / rect.width) * 100;
            const dYPercent = (dy / rect.height) * 100;

            setPosition({
                x: dragStartRef.current.initialPos.x + dXPercent,
                y: dragStartRef.current.initialPos.y + dYPercent
            });
        }
        else if (activeDragTarget === 'wizard' && step2PreviewRef.current) {
            // For wizard, we move the plant relative to container
            // We can use same % logic or px logic. 
            // Let's use % for consistency with bake.
            const rect = step2PreviewRef.current.getBoundingClientRect();
            const dXPercent = (dx / rect.width) * 100;
            const dYPercent = (dy / rect.height) * 100;

            setPlantPotOffset({
                x: dragStartRef.current.initialPos.x + dXPercent,
                y: dragStartRef.current.initialPos.y + dYPercent
            });
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        document.body.style.overflow = '';
    };

    // Wrappers
    const handleMouseDown = (e: MouseEvent, target: 'scene' | 'wizard') => {
        e.preventDefault(); // Stop image drag
        handleStart(target, e.clientX, e.clientY);
    };

    const globalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent, target: 'scene' | 'wizard') => {
        // e.preventDefault(); // usually good to allow tap, but prevent scroll?
        const t = e.touches[0];
        handleStart(target, t.clientX, t.clientY);
    };

    const globalTouchMove = (e: React.TouchEvent) => {
        if (isDragging && e.cancelable) e.preventDefault();
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
    };

    // Global Listeners for smooth drag even outside element
    // We attach these to the CONTAINER or WINDOW effectively by using the main div


    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className={styles.container}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchEnd={handleEnd}
            onMouseMove={globalMouseMove}
            onTouchMove={globalTouchMove}
        >
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

            {/* WIZARD MODAL */}
            {currentStep !== 'none' && previewPlant && (
                <div className={styles.modalOverlay} onClick={() => setCurrentStep('none')}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

                        {/* HEADER */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <h2 className={styles.modalTitle}>
                                {currentStep === 'bg-remove' ? 'Step 1: Prepare Plant' : 'Step 2: Style Pot'}
                            </h2>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '5px' }}>
                                <div style={{ height: '4px', width: '30px', background: currentStep === 'bg-remove' ? '#34d399' : '#475569', borderRadius: '2px' }} />
                                <div style={{ height: '4px', width: '30px', background: currentStep === 'pot-select' ? '#34d399' : '#475569', borderRadius: '2px' }} />
                            </div>
                        </div>

                        {/* PREVIEW AREA */}
                        <div
                            className={styles.previewContainer}
                            ref={step2PreviewRef}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {currentStep === 'bg-remove' ? (
                                previewBgRemoved ? (
                                    <img src={previewBgRemoved} className={styles.previewImage} alt="Remove BG Preview" />
                                ) : <div className="text-gray-400">Processing...</div>
                            ) : (
                                <>
                                    {/* LIVE PREVIEW COMPOSITION */}
                                    {/* 1. PLANT (Background Layer) - Draggable */}
                                    {previewBgRemoved && (
                                        <img
                                            src={previewBgRemoved}
                                            alt="Plant"
                                            style={{
                                                position: 'absolute',
                                                height: 'auto',
                                                width: '50%', // Approximation of standardScale
                                                left: `${50 + plantPotOffset.x}%`,
                                                top: `${50 + plantPotOffset.y}%`,
                                                transform: 'translate(-50%, -50%)', // Use translate to center handle
                                                // Actually, bake logic assumes top-left coords.
                                                // Let's stick to simple CSS Transforms for WYSIWYG
                                                zIndex: 1,
                                                cursor: 'grab',
                                                touchAction: 'none'
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, 'wizard')}
                                            onTouchStart={(e) => handleTouchStart(e, 'wizard')}
                                        />
                                    )}

                                    {/* 2. POT (Foreground Layer) - Static Overlay */}
                                    {tintedPotUrl ? (
                                        <img
                                            src={tintedPotUrl}
                                            alt="Pot"
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                zIndex: 10,
                                                pointerEvents: 'none', // Allow clicks to pass through to plant if overlapping
                                                // Actually we want to drag the plant BEHIND the pot, so clicking pot shouldn't enable drag?
                                                // User wants to "touch it and change".
                                                // If Pot covers plant, user can't touch plant.
                                                // We should make the Pot capture events but proxy them? Or just set pointerEvents none 
                                                // and ensure container catches... no.
                                                // Let's make the Plant draggable. Since it sticks out top, it's grabable.
                                                // If pot covers it, we might need a transparent overlay div to handle drag.
                                            }}
                                        />
                                    ) : <div className="text-gray-400">Loading Pot...</div>}

                                    {/* Drag Instruction Overlay (fades out?) */}
                                    <div style={{ position: 'absolute', top: 10, left: 0, width: '100%', textAlign: 'center', zIndex: 20, pointerEvents: 'none', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                        Drag plant to position
                                    </div>
                                </>
                            )}

                            {isProcessing && (
                                <div className={styles.processingOverlay}>
                                    <Loader2 className="animate-spin" /> Processing...
                                </div>
                            )}
                        </div>

                        {/* CONTROLS BASED ON STEP */}
                        {currentStep === 'bg-remove' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className={styles.optionRow}>
                                    <div className={styles.toggleLabel}>
                                        <Sparkles size={18} color={autoRemoveBg ? '#34d399' : '#94a3b8'} />
                                        Remove Background
                                    </div>
                                    <div
                                        className={styles.toggleSwitch}
                                        data-active={autoRemoveBg}
                                        onClick={() => {
                                            const newVal = !autoRemoveBg;
                                            setAutoRemoveBg(newVal);
                                            runBgRemoval(previewPlant.imageUrl, newVal, bgTolerance);
                                        }}
                                    >
                                        <div className={styles.toggleKnob} />
                                    </div>
                                </div>
                                {autoRemoveBg && (
                                    <div className={styles.optionRow} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                        <div className={styles.toggleLabel} style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ display: 'flex', gap: '0.5rem' }}><Sliders size={16} /> Sensitivity</span>
                                            <span>{bgTolerance}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={bgTolerance}
                                            onChange={handleBgToleranceChange}
                                            onMouseUp={handleBgToleranceCommit}
                                            onTouchEnd={handleBgToleranceCommit}
                                            style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 'pot-select' && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div className={styles.toggleLabel} style={{ marginBottom: '0.5rem' }}>
                                    <Palette size={16} /> Choose Style
                                </div>
                                <div className={styles.colorPalette} style={{ marginBottom: '1rem' }}>
                                    {POT_STYLES.map(s => (
                                        <div
                                            key={s.id}
                                            className={styles.colorSwatch}
                                            style={{
                                                borderRadius: '0.5rem',
                                                backgroundImage: `url(${s.src})`,
                                                backgroundSize: 'cover',
                                                width: '50px',
                                                height: '50px'
                                            }}
                                            data-selected={potStyle === s.id}
                                            onClick={() => handlePotStyleChange(s.id)}
                                            title={s.name}
                                        />
                                    ))}
                                </div>

                                <div className={styles.toggleLabel} style={{ marginBottom: '0.5rem' }}>
                                    <Palette size={16} /> Choose Color
                                </div>
                                <div className={styles.colorPalette}>
                                    {POT_COLORS.map(c => (
                                        <div
                                            key={c.name}
                                            className={styles.colorSwatch}
                                            style={{ backgroundColor: c.hex }}
                                            data-selected={potColor === c.hex}
                                            onClick={() => handlePotColorChange(c.hex)}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className={styles.modalActions}>
                            <button className={styles.secondaryBtn} onClick={() => setCurrentStep('none')}>Cancel</button>

                            {currentStep === 'bg-remove' ? (
                                <button className={styles.primaryBtn} onClick={goToPotSelection} disabled={isProcessing}>
                                    Next: Choose Pot
                                </button>
                            ) : (
                                <button className={styles.primaryBtn} onClick={confirmPlacement} disabled={isProcessing}>
                                    <Check size={18} style={{ marginRight: '8px' }} />
                                    Finish & Place
                                </button>
                            )}
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
                        onMouseMove={globalMouseMove}
                        onTouchMove={globalTouchMove}
                    >
                        {!roomImage ? (
                            <div className={styles.canvasEmpty}>
                                <ImageIcon size={64} style={{ opacity: 0.5 }} />
                                <h2>Your Space Goes Here</h2>
                                <p>Upload a photo of your room or garden to begin visualization.</p>

                                <div className={styles.actionRow}>
                                    <button
                                        className={`${styles.uploadBtn} ${highlightUpload ? styles.pulseFocus : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={24} /> Upload
                                    </button>
                                    <div className={styles.orDivider}>OR</div>
                                    <button
                                        className={`${styles.cameraBtn} ${highlightUpload ? styles.pulseFocus : ''}`}
                                        onClick={startCamera}
                                    >
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
                                            width: '300px',
                                            cursor: isDragging ? 'grabbing' : 'grab'
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, 'scene')}
                                        onTouchStart={(e) => handleTouchStart(e, 'scene')}
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
        </div >
    );
};
