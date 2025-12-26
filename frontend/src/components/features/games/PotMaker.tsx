import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, Save, ShoppingCart, Layers, RotateCcw, X, Check, Move, Maximize, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import styles from './PotMaker.module.css';

interface PotMakerProps {
    onBack: () => void;
}

type PotShape = 'classic' | 'modern' | 'wide';
type PotSize = 'small' | 'medium' | 'large';

// --- UTILS FOR CROPPING ---
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        if (!url.startsWith('data:')) image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return canvas.toDataURL('image/jpeg');
};


// --- 3D POT COMPONENT ---
const PotModel = ({
    textureUrl,
    shape,
    size,
    scaleX,
    scaleY,
    offsetX,
    offsetY,
    rotation
}: {
    textureUrl: string | null,
    shape: PotShape,
    size: PotSize,
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number,
    rotation: number
}) => {
    const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

    // Apply texture transformations
    if (texture) {
        // We want the image to behave like a "sticker" or decal, not a repeating pattern.
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // Quality improvements for "High End" look
        texture.anisotropy = 16;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        // Inverse logic: Higher "Scale" slider value usually means "Zoom In", 
        // which for repeats means SMALLER repeat count.
        // So we invert the slider value: 1 / scale
        texture.repeat.set(1 / scaleX, 1 / scaleY);

        texture.offset.set(offsetX, offsetY);

        texture.center.set(0.5, 0.5);
        texture.rotation = rotation * (Math.PI / 180);

        texture.needsUpdate = true;
    }

    // Size multiplier
    const scale = size === 'small' ? 0.8 : size === 'medium' ? 1 : 1.2;

    // Geometry args based on shape
    let geometryArgs: [number, number, number, number] = [1.2, 1, 2.2, 64]; // Classic (Tapered)

    if (shape === 'modern') geometryArgs = [1.1, 1.1, 2.2, 64]; // Straight Cylinder
    if (shape === 'wide') geometryArgs = [1.4, 1.2, 1.8, 64]; // Short & Wide

    return (
        <group dispose={null} scale={[scale, scale, scale]}>
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                <cylinderGeometry args={geometryArgs} />

                {/* Material 0: Side - Texture */}
                <meshStandardMaterial
                    attach="material-0"
                    color="#ffffff"
                    roughness={0.4}
                    metalness={0.05}
                    map={texture}
                />
                {/* Material 1: Top - White */}
                <meshStandardMaterial attach="material-1" color="#ffffff" roughness={0.5} />
                {/* Material 2: Bottom - White */}
                <meshStandardMaterial attach="material-2" color="#ffffff" roughness={0.5} />
            </mesh>

            {/* Soil */}
            <mesh position={[0, shape === 'wide' ? 1.3 : 1.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[shape === 'wide' ? 1.3 : 1.1, 32]} />
                <meshStandardMaterial color="#2d1e18" roughness={1} />
            </mesh>
        </group>
    );
};


// --- CAPTURE HELPER ---
const CaptureRelay = ({ captureRef }: { captureRef: React.MutableRefObject<any> }) => {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        captureRef.current = () => {
            // Force a high-quality render for the snapshot
            const originalRatio = gl.getPixelRatio();
            gl.setPixelRatio(2); // High resolution snapshot
            gl.render(scene, camera);
            const dataUrl = gl.domElement.toDataURL('image/png', 1.0);
            gl.setPixelRatio(originalRatio); // Restore
            return dataUrl;
        };
    }, [gl, scene, camera, captureRef]);

    return null;
};

export const PotMaker = ({ onBack }: PotMakerProps) => {
    const [step, setStep] = useState<'select' | 'upload' | 'crop' | 'preview' | 'result'>('select');

    // Selection State
    const [selectedShape, setSelectedShape] = useState<PotShape>('classic');
    const [selectedSize, setSelectedSize] = useState<PotSize>('medium');

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [finalImage, setFinalImage] = useState<string | null>(null); // The 3D render snapshot

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [saving, setSaving] = useState(false);

    // 3D Texture Transforms
    const [texScale, setTexScale] = useState(1);
    const [texOffsetX, setTexOffsetX] = useState(0);
    const [texOffsetY, setTexOffsetY] = useState(0);
    const [texRotation, setTexRotation] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const captureRef = useRef<() => string>(null);

    const onCropComplete = useCallback((_area: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const reader = new FileReader();
            reader.onload = () => { currentImageToCrop(reader.result as string); };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const currentImageToCrop = (src: string) => {
        setImageSrc(src);
        setStep('crop');
    };

    const handleCropSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(cropped);
            setStep('preview');
        }
    };

    const handleFinalize = () => {
        if (captureRef.current) {
            const snapshot = captureRef.current();
            setFinalImage(snapshot);
            setStep('result');
            toast.success("3D View Captured!");
        }
    };

    const handleSaveDesign = async (saveOnly: boolean = false) => {
        if (!finalImage) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/user/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    imageUrl: finalImage, // Saving the 3D snapshot
                    shape: selectedShape,
                    size: selectedSize
                })
            });
            toast.success(saveOnly ? "Saved to Profile!" : "Order placed (Simulated)!");
        } catch (e) { toast.error("Error saving"); }
        setSaving(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backBtnWrapper}>&larr; Back to Menu</button>
                <h2 className={styles.title}><Layers color="#10b981" /> 3D Pot Studio</h2>
                <p className={styles.subtitle}>
                    {step === 'select' && "Step 1: Choose your base"}
                    {step === 'upload' && "Step 2: Upload your art"}
                    {step === 'crop' && "Step 3: Crop"}
                    {step === 'preview' && "Step 4: Customize"}
                    {step === 'result' && "Final Step: Review & Save"}
                </p>
            </div>

            <div className={styles.workspace}>
                {/* STEP 1: SELECTION */}
                {step === 'select' && (
                    <div className={styles.selectionContainer}>
                        {/* Live Preview of Base Pot */}
                        <div className={styles.miniPreview}>
                            <Canvas shadows camera={{ position: [0, 1, 4], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                <PresentationControls speed={2} global zoom={0.8} polar={[-0.1, Math.PI / 4]}>
                                    <Stage environment={null} intensity={1} castShadow={false}>
                                        <PotModel
                                            textureUrl={null} shape={selectedShape} size={selectedSize}
                                            scaleX={1} scaleY={1} offsetX={0} offsetY={0} rotation={0}
                                        />
                                    </Stage>
                                </PresentationControls>
                            </Canvas>
                            <div className={styles.rotateHint}><RotateCcw size={12} /> Spin Me</div>
                        </div>

                        <div className={styles.optionsGrid}>
                            <div className={styles.optionGroup}>
                                <h3>Shape</h3>
                                <div className={styles.visualOptions}>
                                    <div
                                        className={`${styles.visualOption} ${selectedShape === 'classic' ? styles.visualActive : ''}`}
                                        onClick={() => setSelectedShape('classic')}
                                    >
                                        <img src="/pot-classic.png" alt="Classic Pot" />
                                        <span>Classic</span>
                                    </div>
                                    <div
                                        className={`${styles.visualOption} ${selectedShape === 'modern' ? styles.visualActive : ''}`}
                                        onClick={() => setSelectedShape('modern')}
                                    >
                                        <img src="/pot-modern.png" alt="Modern Pot" />
                                        <span>Modern</span>
                                    </div>
                                    <div
                                        className={`${styles.visualOption} ${selectedShape === 'wide' ? styles.visualActive : ''}`}
                                        onClick={() => setSelectedShape('wide')}
                                    >
                                        <img src="/pot-wide.png" alt="Wide Pot" />
                                        <span>Wide</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.optionGroup}>
                                <h3>Size</h3>
                                <div className={styles.optionRow}>
                                    <button className={`${styles.optBtn} ${selectedSize === 'small' ? styles.optActive : ''}`} onClick={() => setSelectedSize('small')}>S</button>
                                    <button className={`${styles.optBtn} ${selectedSize === 'medium' ? styles.optActive : ''}`} onClick={() => setSelectedSize('medium')}>M</button>
                                    <button className={`${styles.optBtn} ${selectedSize === 'large' ? styles.optActive : ''}`} onClick={() => setSelectedSize('large')}>L</button>
                                </div>
                            </div>

                            <button className={styles.nextBtn} onClick={() => setStep('upload')}>
                                Next: Add Design &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: UPLOAD */}
                {step === 'upload' && (
                    <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                        <Upload size={48} color="#94a3b8" />
                        <h3>Upload Your Art</h3>
                        <p>Click to browse images</p>
                    </div>
                )}

                {/* STEP 3: CROP (Flexible Aspect) */}
                {step === 'crop' && (
                    <div className={styles.cropContainer}>
                        <div className={styles.cropperWrapper}>
                            <Cropper
                                image={imageSrc || ''}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                minZoom={0.5}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                            Crop the part of the image you want. You can resize it on the pot in the next step.
                        </p>
                        <div className={styles.cropButtons}>
                            <button onClick={() => setStep('upload')} className={styles.cancelBtn}><X size={18} /></button>
                            <button onClick={handleCropSave} className={styles.applyBtn}><Check size={18} /> Apply</button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW & CUSTOMIZE */}
                {step === 'preview' && (
                    <div className={styles.previewContainer}>
                        <div className={styles.canvasWrapper}>
                            <Canvas
                                shadows
                                gl={{ preserveDrawingBuffer: true }} // Allow screenshot
                                camera={{ position: [0, 2, 5], fov: 45 }}
                            >
                                <CaptureRelay captureRef={captureRef} />
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                                    <Stage environment={null} intensity={1} castShadow={false}>
                                        <PotModel
                                            textureUrl={croppedImage}
                                            shape={selectedShape}
                                            size={selectedSize}
                                            scaleX={texScale}
                                            scaleY={texScale}
                                            offsetX={texOffsetX}
                                            offsetY={texOffsetY}
                                            rotation={texRotation}
                                        />
                                    </Stage>
                                </PresentationControls>
                            </Canvas>
                            <div className={styles.rotateHint}><RotateCcw size={16} /> Drag to rotate</div>
                        </div>

                        {/* TEXTURE CONTROLS */}
                        <div className={styles.textureControls}>
                            <div className={styles.controlRow}>
                                <Maximize size={16} />
                                <input type="range" min="0.5" max="3" step="0.1" value={texScale} onChange={(e) => setTexScale(parseFloat(e.target.value))} />
                            </div>
                            <div className={styles.controlRow}>
                                <Move size={16} />
                                <input type="range" min="-1" max="1" step="0.1" value={texOffsetX} onChange={(e) => setTexOffsetX(parseFloat(e.target.value))} />
                                <input type="range" min="-1" max="1" step="0.1" value={texOffsetY} onChange={(e) => setTexOffsetY(parseFloat(e.target.value))} />
                            </div>
                            <div className={styles.controlRow}>
                                <RotateCw size={16} />
                                <input type="range" min="0" max="360" step="10" value={texRotation} onChange={(e) => setTexRotation(parseFloat(e.target.value))} />
                            </div>
                        </div>

                        <div className={styles.controls}>
                            <button className={styles.actionBtn} onClick={() => setStep('crop')}><Camera size={20} /> Re-Crop</button>
                            <div className={styles.divider} />
                            {/* Finalize Button */}
                            <button className={styles.saveBtn} onClick={handleFinalize} style={{ width: '100%', justifyContent: 'center' }}>
                                <Check size={20} /> Generate Final View
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: FINAL RESULT */}
                {step === 'result' && finalImage && (
                    <div className={styles.previewContainer}>
                        <div className={styles.canvasWrapper} style={{ background: '#fff', overflow: 'hidden' }}>
                            {/* Display the Captured Image */}
                            <img src={finalImage} alt="Final Design" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>This is how your masterpiece looks!</p>

                        <div className={styles.controls}>
                            <button className={styles.actionBtn} onClick={() => setStep('preview')}>
                                <RotateCcw size={20} /> Keep Editing
                            </button>
                            <div className={styles.divider} />
                            <button className={styles.saveBtn} onClick={() => handleSaveDesign(true)} disabled={saving}>
                                <Save size={20} /> Save Design
                            </button>
                            <button className={styles.buyBtn} onClick={() => handleSaveDesign(false)} disabled={saving}>
                                <ShoppingCart size={20} /> Buy <span className={styles.badge}>msg</span>
                            </button>
                        </div>
                    </div>
                )}

                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
            </div>
        </div>
    );
};
