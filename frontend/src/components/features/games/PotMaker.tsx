import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Save, ShoppingCart, Layers, RotateCcw, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { Canvas, useLoader } from '@react-three/fiber';
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
    size
}: {
    textureUrl: string | null,
    shape: PotShape,
    size: PotSize
}) => {
    const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

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
                <meshStandardMaterial attach="material-0" color="#ffffff" roughness={0.3} map={texture} />
                {/* Material 1: Top - White */}
                <meshStandardMaterial attach="material-1" color="#ffffff" roughness={0.3} />
                {/* Material 2: Bottom - White */}
                <meshStandardMaterial attach="material-2" color="#ffffff" roughness={0.3} />
            </mesh>

            {/* Soil */}
            <mesh position={[0, shape === 'wide' ? 1.3 : 1.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[shape === 'wide' ? 1.3 : 1.1, 32]} />
                <meshStandardMaterial color="#3f2e26" />
            </mesh>
        </group>
    );
};


export const PotMaker = ({ onBack }: PotMakerProps) => {
    const [step, setStep] = useState<'select' | 'upload' | 'crop' | 'preview'>('select');

    // Selection State
    const [selectedShape, setSelectedShape] = useState<PotShape>('classic');
    const [selectedSize, setSelectedSize] = useState<PotSize>('medium');

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_area: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const reader = new FileReader();
            reader.onload = () => { setImageSrc(reader.result as string); setStep('crop'); };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(cropped);
            setStep('preview');
        }
    };

    const handleSaveDesign = async (saveOnly: boolean = false) => {
        if (!croppedImage) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/user/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ imageUrl: croppedImage, shape: selectedShape, size: selectedSize })
            });
            toast.success(saveOnly ? "Saved!" : "Coming Soon: Buying!");
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
                    {step === 'crop' && "Step 3: Position your design"}
                    {step === 'preview' && "Step 4: Preview & Create"}
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
                                        <PotModel textureUrl={null} shape={selectedShape} size={selectedSize} />
                                    </Stage>
                                </PresentationControls>
                            </Canvas>
                            <div className={styles.rotateHint}><RotateCcw size={12} /> Spin Me</div>
                        </div>

                        <div className={styles.optionsGrid}>
                            <div className={styles.optionGroup}>
                                <h3>Shape</h3>
                                <div className={styles.optionRow}>
                                    <button className={`${styles.optBtn} ${selectedShape === 'classic' ? styles.optActive : ''}`} onClick={() => setSelectedShape('classic')}>Classic</button>
                                    <button className={`${styles.optBtn} ${selectedShape === 'modern' ? styles.optActive : ''}`} onClick={() => setSelectedShape('modern')}>Modern</button>
                                    <button className={`${styles.optBtn} ${selectedShape === 'wide' ? styles.optActive : ''}`} onClick={() => setSelectedShape('wide')}>Wide</button>
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

                {/* STEP 3: CROP */}
                {step === 'crop' && (
                    <div className={styles.cropContainer}>
                        <div className={styles.cropperWrapper}>
                            <Cropper image={imageSrc || ''} crop={crop} zoom={zoom} aspect={4 / 3} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                        </div>
                        <div className={styles.cropButtons}>
                            <button onClick={() => setStep('upload')} className={styles.cancelBtn}><X size={18} /></button>
                            <button onClick={handleCropSave} className={styles.applyBtn}><Check size={18} /> Apply</button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW */}
                {step === 'preview' && (
                    <div className={styles.previewContainer}>
                        <div className={styles.canvasWrapper}>
                            <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                                    <Stage environment={null} intensity={1} castShadow={false}>
                                        <PotModel textureUrl={croppedImage} shape={selectedShape} size={selectedSize} />
                                    </Stage>
                                </PresentationControls>
                            </Canvas>
                            <div className={styles.rotateHint}><RotateCcw size={16} /> Drag to rotate</div>
                        </div>

                        <div className={styles.controls}>
                            <button className={styles.actionBtn} onClick={() => setStep('crop')}><Camera size={20} /> Edit</button>
                            <button className={styles.actionBtn} onClick={() => setStep('select')}><RotateCcw size={20} /> Reset</button>
                            <div className={styles.divider} />
                            <button className={styles.saveBtn} onClick={() => handleSaveDesign(true)} disabled={saving}><Save size={20} /> Save</button>
                            <button className={styles.buyBtn} onClick={() => handleSaveDesign(false)} disabled={saving}><ShoppingCart size={20} /> Buy <span className={styles.badge}>msg</span></button>
                        </div>
                    </div>
                )}

                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
            </div>
        </div>
    );
};
