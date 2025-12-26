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

// --- UTILS FOR CROPPING ---
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        // Only needed if loading from external URL, but our source is almost always base64 from FileReader here.
        // If it is a base64 string, setting crossOrigin can sometimes cause issues in some environments.
        if (!url.startsWith('data:')) {
            image.setAttribute('crossOrigin', 'anonymous');
        }
        image.src = url;
    });

const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
};


// --- 3D POT COMPONENT ---
const PotModel = ({ textureUrl }: { textureUrl: string | null }) => {
    // If we have a texture, load it
    const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

    return (
        <group dispose={null}>
            {/* The Pot Mesh */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                {/* Cylinder: TopRadius, BottomRadius, Height, Segments */}
                <cylinderGeometry args={[1.2, 1, 2.2, 64]} />
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.3}
                    metalness={0.1}
                    map={texture} // Apply user design as texture
                />
            </mesh>
            {/* Inner Dark Soil Area (Visual trick) */}
            <mesh position={[0, 1.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.1, 32]} />
                <meshStandardMaterial color="#3f2e26" />
            </mesh>
        </group>
    );
};


export const PotMaker = ({ onBack }: PotMakerProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [step, setStep] = useState<'upload' | 'crop' | 'preview'>('upload');
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_area: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
                setStep('crop');
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
                setCroppedImage(cropped);
                setStep('preview');
                toast.success("Design applied to pot!");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to crop image");
        }
    };

    const handleSaveDesign = async (saveOnly: boolean = false) => {
        if (!croppedImage) {
            toast.error("No design to save!");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming endpoint exists per previous steps
            const res = await fetch('http://localhost:5000/api/user/designs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl: croppedImage })
            });

            if (res.ok) {
                toast.success(saveOnly ? "Design saved to profile!" : "Coming Soon: Buying Feature!");
                if (!saveOnly) toast("Design saved for future purchase.", { icon: '💾' });
            } else {
                toast.error("Failed to save (Are you logged in?)");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    onClick={onBack}
                    className={styles.backBtnWrapper}
                >
                    &larr; Back to Menu
                </button>
                <h2 className={styles.title}>
                    <Layers color="#10b981" /> 3D Pot Studio
                </h2>
                <p className={styles.subtitle}>Design, Spin, & Create your custom ceramic pot.</p>
            </div>

            <div className={styles.workspace}>

                {/* STEP 1 & 2: UPLOAD OR CROP */}
                {(step === 'upload' || step === 'crop') && (
                    <div className={styles.cropContainer}>
                        {step === 'upload' ? (
                            <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                                <Upload size={48} color="#94a3b8" />
                                <h3>Upload Your Art</h3>
                                <p>Click to browse images</p>
                            </div>
                        ) : (
                            <div className={styles.cropperWrapper}>
                                <Cropper
                                    image={imageSrc || ''}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3} // Aspect ratio for pot wrapping
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        )}

                        {step === 'crop' && (
                            <div className={styles.cropControls}>
                                <div className={styles.sliderContainer}>
                                    <span>Zoom</span>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className={styles.slider}
                                    />
                                </div>
                                <div className={styles.buttonRow}>
                                    <button onClick={() => { setImageSrc(null); setStep('upload'); }} className={styles.cancelBtn}>
                                        <X size={18} /> Cancel
                                    </button>
                                    <button onClick={handleCropSave} className={styles.applyBtn}>
                                        <Check size={18} /> Apply to Pot
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: 3D PREVIEW */}
                {step === 'preview' && (
                    <div className={styles.previewContainer}>
                        <div className={styles.canvasWrapper}>
                            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-bias={-0.00001} />
                                <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                                    <Stage environment={null} intensity={1} castShadow={false}>
                                        <PotModel textureUrl={croppedImage} />
                                    </Stage>
                                </PresentationControls>
                            </Canvas>
                            <div className={styles.rotateHint}>
                                <RotateCcw size={16} /> Drag to rotate
                            </div>
                        </div>

                        <div className={styles.controls}>
                            <button className={styles.actionBtn} onClick={() => { setStep('crop'); }}>
                                <Camera size={20} /> Edit Crop
                            </button>
                            <button className={styles.actionBtn} onClick={() => { setStep('upload'); setImageSrc(null); setCroppedImage(null); }}>
                                <Upload size={20} /> New Image
                            </button>

                            <div className={styles.divider} />

                            <button
                                className={styles.saveBtn}
                                onClick={() => handleSaveDesign(true)}
                                disabled={saving}
                            >
                                <Save size={20} /> {saving ? 'Saving...' : 'Save Design'}
                            </button>

                            <button
                                className={styles.buyBtn}
                                onClick={() => handleSaveDesign(false)}
                                disabled={saving}
                            >
                                <ShoppingCart size={20} /> Buy <span className={styles.badge}>Soon</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* HIDDEN INPUT */}
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>
        </div>
    );
};
