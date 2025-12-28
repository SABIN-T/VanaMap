import { useState, useRef, useEffect, type MouseEvent } from 'react';
import styles from './MakeItReal.module.css';
import { Upload, Search, Wand2, RefreshCw, ZoomIn, ZoomOut, Image as ImageIcon, Camera, X, Check, Loader2, Sparkles } from 'lucide-react';
import { fetchPlants } from '../services/api';
import toast from 'react-hot-toast';

// Helper: Smart Flood Fill to remove background but keep the subject (pots/plants)
const removeWhiteBackground = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Limit size for performance if needed, but keeping original for quality
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(imageSrc);

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;

            // 1. Define "White-ish" background threshold
            // Standard white background is usually usually near (255,255,255)
            // We use a strict tolerance to avoid eating into light green leaves, 
            // but loose enough to catch JPEG artifacts.
            const isBackground = (r: number, g: number, b: number) => {
                const threshold = 230;
                return r > threshold && g > threshold && b > threshold;
            };

            // 2. Queue-based Flood Fill from corners
            // This ensures we only remove white pixels connected to the OUTSIDE
            // protecting white pots or flowers in the center.
            const queue: number[] = [];
            const visited = new Uint8Array(width * height);

            // Add all 4 corners as seed points if they are white
            const corners = [0, width - 1, (height - 1) * width, (height - 1) * width + (width - 1)];

            for (const idx of corners) {
                const r = data[idx * 4];
                const g = data[idx * 4 + 1];
                const b = data[idx * 4 + 2];
                if (isBackground(r, g, b)) {
                    queue.push(idx);
                    visited[idx] = 1;
                }
            }

            // Run Flood Fill
            while (queue.length > 0) {
                const idx = queue.shift()!;
                const x = idx % width;
                const y = Math.floor(idx / width);

                // Turn pixel transparent
                const pixIdx = idx * 4;
                data[pixIdx + 3] = 0; // Alpha = 0

                // Check neighbors (4-way connectivity)
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
                            const nPixIdx = nIdx * 4;
                            if (isBackground(data[nPixIdx], data[nPixIdx + 1], data[nPixIdx + 2])) {
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
    const [autoRemoveBg, setAutoRemoveBg] = useState(true);

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

    const onPlantClick = (plant: any) => {
        setPreviewPlant(plant);
        setProcessedImage(null); // Clear previous processed image
        runProcessing(plant.imageUrl, autoRemoveBg);
    };

    const runProcessing = async (url: string, remove: boolean) => {
        if (!remove) {
            setProcessedImage(url);
            setIsProcessing(false);
            return;
        }
        setIsProcessing(true);
        try {
            const result = await removeWhiteBackground(url);
            setProcessedImage(result);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleBgRemoval = () => {
        const newVal = !autoRemoveBg;
        setAutoRemoveBg(newVal);
        if (previewPlant) {
            runProcessing(previewPlant.imageUrl, newVal);
        }
    };

    const confirmPlacement = () => {
        if (!roomImage) {
            toast.error("Please upload a room photo first!");
            setPreviewPlant(null); // Close modal if no room image
            return;
        }
        setPlacedPlant({ ...previewPlant, imageUrl: processedImage });
        setPosition({ x: 50, y: 50 });
        setScale(1);
        setPreviewPlant(null); // Close modal
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
                        <h2 className={styles.modalTitle}>Add {previewPlant.name}?</h2>

                        <div className={styles.previewContainer}>
                            {processedImage && (
                                <img src={processedImage} className={styles.previewImage} alt="Preview" key={processedImage} />
                            )}
                            {isProcessing && (
                                <div className={styles.processingOverlay}>
                                    <Loader2 className="animate-spin" /> Removing Background...
                                </div>
                            )}
                        </div>

                        <div className={styles.optionRow}>
                            <div className={styles.toggleLabel}>
                                <Sparkles size={18} color={autoRemoveBg ? '#34d399' : '#94a3b8'} />
                                Remove Background
                            </div>
                            <div
                                className={styles.toggleSwitch}
                                data-active={autoRemoveBg}
                                onClick={toggleBgRemoval}
                            >
                                <div className={styles.toggleKnob} />
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
