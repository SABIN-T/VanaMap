import { useState, useRef, useEffect, type MouseEvent } from 'react';
import styles from './MakeItReal.module.css';
import { Upload, Search, Wand2, RefreshCw, ZoomIn, ZoomOut, Image as ImageIcon, Camera, X, Loader2, Sparkles, Sliders } from 'lucide-react';
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
    { id: 'original', name: 'Original', src: '' }, // No virtual pot
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
        // Only draw if we have a valid pot source (not original mode)
        if (potSrc) {
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
        }

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

    // Unified "Designer" State
    // We treat the placed plant as the single source of truth for the session
    const [designerState, setDesignerState] = useState({
        uuid: 0, // force re-render/re-effect
        plant: null as any,
        rawPlantImg: null as string | null, // Original plant image
        cleanPlantImg: null as string | null, // BG Removed plant
        potColor: '#e07a5f',
        potStyle: 'original', // Default to original to keep user's pot
        bgTolerance: 15, // Lower tolerance to protect white pots
        scale: 1,
        pos: { x: 50, y: 50 },
        offset: { x: 0, y: 0 }, // Plant-in-pot offset
        isProcessing: false,
    });

    const [highlightUpload, setHighlightUpload] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived State for Dragging
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, initialPos: { x: 0, y: 0 } });

    // Magic/AI States
    const [showDesigner, setShowDesigner] = useState(false);

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

    // --- NEW "ONE CLICK" WORKFLOW ---

    // 1. User Clicks Plant -> Immediate Processing & Placement
    const onPlantClick = async (plant: any) => {
        if (!roomImage) {
            toast.error("Please take a photo or upload an image first!");
            setHighlightUpload(true);
            return;
        }

        // Initialize State
        setDesignerState(prev => ({
            ...prev,
            plant,
            rawPlantImg: plant.imageUrl,
            cleanPlantImg: null, // Wipe old
            isProcessing: true,
            uuid: prev.uuid + 1
        }));
        setPlacedPlant(null); // Hide old until ready (or show loading placeholder)
        setShowDesigner(true);

        toast.promise(
            processPlantInitial(plant.imageUrl),
            {
                loading: '✨ AI is preparing your plant...',
                success: 'Plant ready! Style it below.',
                error: 'Could not process plant.'
            }
        );
    };

    const processPlantInitial = async (imgUrl: string) => {
        // 1. Remove BG (Conservative)
        const clean = await removeWhiteBackground(imgUrl, 15);

        // 2. Default to exact original first
        setDesignerState(prev => ({
            ...prev,
            cleanPlantImg: clean,
            potStyle: 'original',
            bgTolerance: 15,
            isProcessing: true
        }));

        // 3. Initial Bake (Original)
        await updateComposite(clean, 'original', '#ffffff', { x: 0, y: 0 });
    };

    // Core Update Logic
    const updateComposite = async (cleanPlant: string, pStyle: string, pColor: string, pOffset: { x: number, y: number }) => {
        setDesignerState(prev => ({ ...prev, isProcessing: true }));
        try {
            const styleObj = POT_STYLES.find(s => s.id === pStyle) || POT_STYLES[0];

            // Handle Original Mode (no virtual pot source)
            let cleanedPot = '';
            if (styleObj.src) {
                cleanedPot = await removeWhiteBackground(styleObj.src, 20);
            }

            const finalUrl = await bakeComposite(
                cleanPlant,
                cleanedPot,
                pColor,
                pOffset
            );

            setPlacedPlant({
                imageUrl: finalUrl,
                name: 'Designed Plant'
            });

            setDesignerState(prev => ({
                ...prev,
                cleanPlantImg: cleanPlant,
                potStyle: pStyle,
                potColor: pColor,
                offset: pOffset,
                isProcessing: false
            }));

        } catch (e) {
            console.error(e);
            setDesignerState(prev => ({ ...prev, isProcessing: false }));
        }
    };

    // Live Tweaks
    const handleDesignerUpdate = (changes: Partial<typeof designerState>) => {
        const next = { ...designerState, ...changes };
        // If critical visual props changed, re-bake
        if (
            changes.potColor ||
            changes.potStyle ||
            changes.bgTolerance ||
            changes.offset
        ) {
            // If tolerance changed, re-clean plant first
            if (changes.bgTolerance && next.rawPlantImg) {
                // Debounce this in real app
                removeWhiteBackground(next.rawPlantImg, next.bgTolerance).then(clean => {
                    updateComposite(clean, next.potStyle, next.potColor, next.offset);
                });
            } else if (next.cleanPlantImg) {
                updateComposite(next.cleanPlantImg, next.potStyle, next.potColor, next.offset);
            }
        } else {
            // Just state update (like scale/pos if we moved them here)
            setDesignerState(next);
        }
    };

    // --- DRAG HANDLERS ---
    // --- DRAG HANDLERS ---
    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        document.body.style.overflow = 'hidden';
        dragStartRef.current = {
            x: clientX,
            y: clientY,
            initialPos: { ...designerState.pos }
        };
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging || !canvasRef.current) return;

        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;
        const rect = canvasRef.current.getBoundingClientRect();

        const dXPercent = (dx / rect.width) * 100;
        const dYPercent = (dy / rect.height) * 100;

        const newPos = {
            x: dragStartRef.current.initialPos.x + dXPercent,
            y: dragStartRef.current.initialPos.y + dYPercent
        };

        setDesignerState(prev => ({ ...prev, pos: newPos }));
    };

    const handleEnd = () => {
        setIsDragging(false);
        document.body.style.overflow = '';
    };

    // Wrappers
    // Wrappers
    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        handleStart(t.clientX, t.clientY);
    };

    const globalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
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

            {/* NEW: FLOATING DESIGNER PANEL */}
            {showDesigner && (
                <div className={styles.designerPanel}>
                    <div className={styles.panelHeader}>
                        <h3><Sparkles size={16} className={styles.sparkleIcon} /> AI Studio</h3>
                        <button className={styles.closePanelBtn} onClick={() => setShowDesigner(false)}><X size={16} /></button>
                    </div>

                    {/* Controls */}
                    <div className={styles.panelScroll}>
                        {/* 1. Pot Style */}
                        <div className={styles.controlGroup}>
                            <label>Pot Style</label>
                            <div className={styles.styleGrid}>
                                {POT_STYLES.map(s => (
                                    <div
                                        key={s.id}
                                        className={`${styles.styleOption} ${designerState.potStyle === s.id ? styles.selected : ''}`}
                                        onClick={() => handleDesignerUpdate({ potStyle: s.id })}
                                    >
                                        {/* Show text for original, image for others */}
                                        {s.id === 'original' ? (
                                            <div className={styles.styleThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #666', borderRadius: '50%' }}>
                                                <ImageIcon size={20} />
                                            </div>
                                        ) : (
                                            <div className={styles.styleThumb} style={{ backgroundImage: `url(${s.src})` }} />
                                        )}
                                        <span>{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Colors */}
                        <div className={styles.controlGroup}>
                            <label>Pot Color</label>
                            <div className={styles.colorRow}>
                                {POT_COLORS.map(c => (
                                    <div
                                        key={c.name}
                                        className={styles.colorDot}
                                        style={{ backgroundColor: c.hex }}
                                        data-active={designerState.potColor === c.hex}
                                        onClick={() => handleDesignerUpdate({ potColor: c.hex })}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 3. Magic Fix */}
                        <div className={styles.controlGroup}>
                            <label>Refine Cutout</label>
                            <div className={styles.sliderRow}>
                                <Sliders size={14} />
                                <input
                                    type="range"
                                    min="10"
                                    max="80"
                                    value={designerState.bgTolerance}
                                    onChange={(e) => handleDesignerUpdate({ bgTolerance: parseInt(e.target.value) })}
                                />
                            </div>
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
                                    <>
                                        <img
                                            src={placedPlant.imageUrl}
                                            alt="Placed Plant"
                                            className={`${styles.placedPlant} ${isMagicMode ? styles.removeBg : ''}`}
                                            style={{
                                                left: `${designerState.pos.x}%`,
                                                top: `${designerState.pos.y}%`,
                                                transform: `translate(-50%, -50%) scale(${designerState.scale})`,
                                                width: '300px',
                                                cursor: isDragging ? 'grabbing' : 'grab',
                                                opacity: designerState.isProcessing ? 0.7 : 1,
                                                filter: designerState.isProcessing ? 'blur(2px)' : 'none',
                                                transition: 'filter 0.3s'
                                            }}
                                            onMouseDown={handleMouseDown}
                                            onTouchStart={handleTouchStart}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDesigner(true);
                                            }}
                                        />

                                        {designerState.isProcessing && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: `${designerState.pos.x}%`,
                                                    top: `${designerState.pos.y}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    pointerEvents: 'none',
                                                    zIndex: 100
                                                }}
                                            >
                                                <Loader2 className="animate-spin" color="#34d399" size={40} />
                                            </div>
                                        )}
                                    </>
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
                                <button className={styles.toolBtn} onClick={() => handleDesignerUpdate({ scale: Math.max(0.5, designerState.scale - 0.1) })} disabled={!placedPlant}>
                                    <ZoomOut size={18} />
                                </button>
                                <span style={{ color: 'white', fontWeight: 600, minWidth: '3rem', textAlign: 'center' }}>
                                    {Math.round(designerState.scale * 100)}%
                                </span>
                                <button className={styles.toolBtn} onClick={() => handleDesignerUpdate({ scale: Math.min(3, designerState.scale + 0.1) })} disabled={!placedPlant}>
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
