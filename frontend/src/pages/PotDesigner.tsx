import { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Decal, Float, PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import { ArrowLeft, Upload, ShoppingBag, Palette, Move, RotateCcw, Box, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './PotDesigner.module.css';

// ==========================================
// 3D COMPONENTS
// ==========================================

function StandardPot({ color, children }: { color: string, children?: React.ReactNode }) {
    return (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 0.7, 2, 64]} />
            <meshStandardMaterial
                color={color}
                roughness={0.4}
                metalness={0.1}
                envMapIntensity={1}
            />
            {children}
        </mesh>
    );
}

function ArtDecal({ image, decalProps }: { image: string, decalProps: any }) {
    // Isolated loader component to prevent main crash
    const decalTexture = useLoader(TextureLoader, image);

    return (
        <Decal
            position={[0, decalProps.y - 0.5, 0.95]} // Adjusted Y since mesh is now at origin relative to parent
            rotation={[0, 0, decalProps.rotation]}
            scale={[decalProps.scale, decalProps.scale, 1]}
        >
            <meshStandardMaterial
                map={decalTexture}
                transparent
                polygonOffset
                polygonOffsetFactor={-10}
                roughness={0.5}
            />
        </Decal>
    );
}

function PotComposition({ color, image, decalProps }: any) {
    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <StandardPot color={color}>
                {image && (
                    <Suspense fallback={null}>
                        <ArtDecal image={image} decalProps={decalProps} />
                    </Suspense>
                )}
            </StandardPot>
        </Float>
    );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export const PotDesigner = () => {
    const navigate = useNavigate();
    const [color, setColor] = useState('#d97706'); // Terracotta
    const [image, setImage] = useState<string | null>(null);
    const [decalProps, setDecalProps] = useState({
        scale: 1,
        y: 0.5,
        rotation: 0
    });

    const potColors = [
        { name: 'Terracotta', value: '#d97706' },
        { name: 'Pure White', value: '#f8fafc' },
        { name: 'Midnight', value: '#1e293b' },
        { name: 'Sage', value: '#10b981' },
        { name: 'Ocean', value: '#3b82f6' },
        { name: 'Rose', value: '#fb7185' },
        { name: 'Basalt', value: '#334155' },
        { name: 'Clay', value: '#a8a29e' },
        { name: 'Teal', value: '#0d9488' },
        { name: 'Lemon', value: '#eab308' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            toast.success("Design Applied! Adjust the sliders below.");
        }
    };

    const handleAddToCart = () => {
        toast.success("Pot design saved to cart!", {
            icon: '🛍️',
            style: { background: '#0f172a', color: '#fff', border: '1px solid #10b981' }
        });
        setTimeout(() => toast("Ordering coming soon!", { icon: '📦' }), 800);
    };

    return (
        <div className={styles.designerContainer}>
            {/* Top Bar */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> <span className="hidden sm:inline">EXIT STUDIO</span>
                </button>
                <div className={styles.title}>VANA STUDIO • 3D CONFIGURATOR</div>
                <div style={{ width: 100 }} className="hidden sm:block"></div>
            </header>

            <main className={styles.mainLayout}>
                {/* 3D Canvas Area */}
                <div className={styles.canvasWrapper}>
                    <Suspense fallback={
                        <div className={styles.loadingOverlay}>
                            <div className={styles.spinner} />
                            <p>Initializing Environment...</p>
                        </div>
                    }>
                        <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={40} />

                            {/* Pro Lighting Setup */}
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                            <directionalLight position={[-5, 5, -5]} intensity={1} color="#3b82f6" />
                            <pointLight position={[0, -2, 5]} intensity={0.5} color="#10b981" />

                            <PotComposition color={color} image={image} decalProps={decalProps} />

                            <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                            <OrbitControls
                                enablePan={false}
                                minPolarAngle={Math.PI / 4}
                                maxPolarAngle={Math.PI / 1.5}
                                autoRotate={!image}
                                autoRotateSpeed={0.5}
                            />
                        </Canvas>
                    </Suspense>

                    {/* Quick Tips Overlay */}
                    <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem' }} className="hidden sm:flex">
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            🖱️ Drag to Rotate
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            🔍 Scroll to Zoom
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <aside className={styles.controlsSidebar}>
                    <div className={styles.sidebarContent}>
                        {/* Section 1: Color */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Palette size={18} />
                                <h3>Base Finish</h3>
                            </div>
                            <div className={styles.colorGrid}>
                                {potColors.map((c) => (
                                    <div
                                        key={c.value}
                                        className={`${styles.colorCircle} ${color === c.value ? styles.colorCircleActive : ''}`}
                                        style={{ backgroundColor: c.value }}
                                        onClick={() => setColor(c.value)}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Section 2: Decal */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Box size={18} />
                                <h3>Custom Art</h3>
                            </div>

                            <input
                                type="file"
                                id="pot-art-upload"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="pot-art-upload" className={styles.uploadArea}>
                                <div className={styles.uploadLabel}>
                                    <Upload size={32} color={image ? '#10b981' : '#64748b'} />
                                    <span>{image ? <b>Change Artwork</b> : <>Click to <b>Upload Artwork</b></>}</span>
                                </div>
                            </label>

                            {image && (
                                <div className={styles.adjustmentGroup}>
                                    <div className={styles.sliderBox}>
                                        <div className={styles.sliderLabel}>
                                            <span><Maximize size={12} /> SCALE</span>
                                            <span>{Math.round(decalProps.scale * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0.5" max="2" step="0.01"
                                            value={decalProps.scale}
                                            onChange={(e) => setDecalProps(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                                            className={styles.rangeInput}
                                        />
                                    </div>

                                    <div className={styles.sliderBox}>
                                        <div className={styles.sliderLabel}>
                                            <span><Move size={12} /> POSITION</span>
                                            <span>{Math.round(decalProps.y * 100)}</span>
                                        </div>
                                        <input
                                            type="range" min="-0.5" max="1.5" step="0.01"
                                            value={decalProps.y}
                                            onChange={(e) => setDecalProps(p => ({ ...p, y: parseFloat(e.target.value) }))}
                                            className={styles.rangeInput}
                                        />
                                    </div>

                                    <div className={styles.sliderBox}>
                                        <div className={styles.sliderLabel}>
                                            <span><RotateCcw size={12} /> ROTATION</span>
                                            <span>{Math.round(decalProps.rotation * 57.3)}°</span>
                                        </div>
                                        <input
                                            type="range" min="-3.14" max="3.14" step="0.01"
                                            value={decalProps.rotation}
                                            onChange={(e) => setDecalProps(p => ({ ...p, rotation: parseFloat(e.target.value) }))}
                                            className={styles.rangeInput}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className={styles.actionArea}>
                        <button className={styles.buyBtn} onClick={handleAddToCart}>
                            <ShoppingBag size={20} /> ADD DESIGNED POT TO CART
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};
