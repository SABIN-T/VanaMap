import { useState, Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Decal, useTexture } from '@react-three/drei';
import { TextureLoader } from 'three';
import { ArrowLeft, Upload, ShoppingBag, Palette, Maximize, Move, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './PotDesigner.module.css';

// --- Separate 3D Components to separate suspense bounds ---

function StandardPot({ color }: { color: string }) {
    // We use a separate component for the base pot to keep its texture loading isolated if needed
    // But usually standard textures are fine.
    const texture = useTexture('https://images.unsplash.com/photo-1614730341194-75c60740a2d3?q=80&w=2667&auto=format&fit=crop');

    return (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 0.9, 2.2, 64]} />
            <meshStandardMaterial
                color={color}
                roughness={0.6}
                metalness={0.1}
                map={texture}
                envMapIntensity={0.8}
            />
        </mesh>
    );
}

// Separate Decal component to handle conditional loading safely
function ArtDecal({ image, decalProps }: { image: string, decalProps: any }) {
    const decalTexture = useLoader(TextureLoader, image); // unconditional here! (component only mounted when image exists)

    return (
        <Decal
            position={[0, decalProps.y, 1.1]}
            rotation={[0, 0, decalProps.rotation]}
            scale={[decalProps.scale, decalProps.scale, 1]}
        >
            <meshBasicMaterial
                map={decalTexture}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
            />
        </Decal>
    );
}

// Wrapper for the Pot Composition
function PotComposition({ color, image, decalProps }: any) {
    return (
        <group>
            <StandardPot color={color} />
            {image && <ArtDecal image={image} decalProps={decalProps} />}
        </group>
    );
}

// --- Main Page Component ---
export const PotDesigner = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [color, setColor] = useState('#e2e8f0');
    const [image, setImage] = useState<string | null>(null);
    const [decalProps, setDecalProps] = useState({
        y: 0,
        scale: 1,
        rotation: 0
    });

    const colors = [
        '#e2e8f0', '#94a3b8', '#64748b', '#0f172a',
        '#fecaca', '#ef4444', '#991b1b',
        '#fed7aa', '#f97316', '#c2410c',
        '#fde047', '#eab308',
        '#86efac', '#22c55e', '#166534',
        '#93c5fd', '#3b82f6', '#1e40af',
        '#d8b4fe', '#a855f7', '#6b21a8'
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                toast.success("Art applied locally!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = () => {
        toast.success("Designed Pot added to cart!", { icon: '🛒' });
        setTimeout(() => {
            toast("Shipping functionality coming soon.", { icon: '🚚' });
        }, 800);
    };

    return (
        <div className={styles.studioContainer}>
            <div className={styles.canvasArea}>
                <Suspense fallback={<div className={styles.loaderOverlay}>Loading 3D Engine...</div>}>
                    <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                        <ambientLight intensity={0.7} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
                        <Environment preset="studio" />

                        {/* Pot Composition includes texture loading, so we wrap it in internal Suspense? 
                            Canvas usually handles it, but explicit boundary helps debug. */}
                        <PotComposition color={color} image={image} decalProps={decalProps} />

                        <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                        <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} enablePan={false} minDistance={3} maxDistance={8} />
                    </Canvas>
                </Suspense>
            </div>

            <div className={styles.controlsPanel}>
                <div className={styles.panelHeader}>
                    <div className={styles.studioTitle}>
                        <Palette size={20} className="text-sky-400" />
                        Ceramic 3D Studio
                    </div>
                    <button onClick={() => navigate('/heaven')} className={styles.backBtn}>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className={styles.scrollContent}>
                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionLabel}>
                            <Upload size={14} /> Custom Art Overlay
                        </div>
                        <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={handleImageUpload}
                            />
                            <div className={styles.uploadText}>{image ? 'Change Artwork' : 'Upload Image'}</div>
                            <div className={styles.uploadSub}>Supports JPG, PNG (Transparent recommended)</div>
                        </div>
                    </div>

                    {image && (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionLabel}>
                                <Move size={14} /> Refine Placement
                            </div>

                            <div className={styles.sliderGroup}>
                                <div className={styles.sliderLabel}>
                                    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Maximize size={12} /> Scale</span> <span>{(decalProps.scale * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="2"
                                    step="0.1"
                                    value={decalProps.scale}
                                    onChange={(e) => setDecalProps(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                                    className={styles.rangeInput}
                                />
                            </div>

                            <div className={styles.sliderGroup}>
                                <div className={styles.sliderLabel}>
                                    <span>Height Placement</span>
                                </div>
                                <input
                                    type="range"
                                    min="-1"
                                    max="1"
                                    step="0.1"
                                    value={decalProps.y}
                                    onChange={(e) => setDecalProps(p => ({ ...p, y: parseFloat(e.target.value) }))}
                                    className={styles.rangeInput}
                                />
                            </div>

                            <div className={styles.sliderGroup}>
                                <div className={styles.sliderLabel}>
                                    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><RotateCcw size={12} /> Rotation</span> <span>{Math.round(decalProps.rotation * (180 / Math.PI))}°</span>
                                </div>
                                <input
                                    type="range"
                                    min={-Math.PI}
                                    max={Math.PI}
                                    step="0.1"
                                    value={decalProps.rotation}
                                    onChange={(e) => setDecalProps(p => ({ ...p, rotation: parseFloat(e.target.value) }))}
                                    className={styles.rangeInput}
                                />
                            </div>

                        </div>
                    )}

                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionLabel}>
                            <Palette size={14} /> Base Glaze Color
                        </div>
                        <div className={styles.colorGrid}>
                            {colors.map(c => (
                                <div
                                    key={c}
                                    className={`${styles.colorDot} ${color === c ? styles.colorDotActive : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                        <ShoppingBag size={20} />
                        Add to Cart &minus; Free Preview
                    </button>
                </div>
            </div>
        </div>
    );
};
