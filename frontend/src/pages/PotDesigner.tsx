import { useState, Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Decal, Float, PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import { ArrowLeft, Upload, Download, ShoppingBag, Palette, Move, RotateCcw, Box, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './PotDesigner.module.css';
import { saveCustomPot } from '../services/api';

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
    const { addToCart } = useCart();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#d97706'); // Terracotta
    const [image, setImage] = useState<string | null>(null);
    const [rawImageBase64, setRawImageBase64] = useState<string | null>(null);
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImageBase64(reader.result as string);
                setImage(URL.createObjectURL(file));
                toast.success("Design Applied! Adjust the sliders below.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error("Please login to save your design!");
            navigate('/auth'); // Updated to /auth for consistent login flow
            return;
        }

        const loadingToast = toast.loading("Capturing and saving your design...");

        try {
            // Capture the 3D Snapshots
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("3D Engine not ready. Please try again in a moment.");

            // Generate snapshot - Use JPEG for smaller size (saves DB space)
            let potWithDesignUrl = '';
            try {
                potWithDesignUrl = canvas.toDataURL('image/jpeg', 0.8);
            } catch (e) {
                console.error("Canvas capture failed", e);
                throw new Error("Unable to capture image from 3D view.");
            }

            if (!potWithDesignUrl || potWithDesignUrl.length < 50) {
                throw new Error("Design snapshot failed. Is the hardware accelerator active?");
            }

            // 1. Save to Database
            const design = await saveCustomPot({
                potColor: color,
                potWithDesignUrl,
                rawDesignUrl: rawImageBase64 || '',
                decalProps
            });

            const stableId = design?.design?._id || Date.now().toString();

            // 2. Add to Shopping Cart
            addToCart({
                id: `cp_${stableId}`,
                name: 'Your Custom Pot Design',
                scientificName: 'Handcrafted Ceramic',
                description: 'A unique ceramic pot designed by you in the VanaMap Studio.',
                imageUrl: potWithDesignUrl,
                price: 299,
                type: 'indoor',
                medicinalValues: [],
                advantages: ['Unique Aesthetic', 'Custom Fit', 'Studio Grade'],
                idealTempMin: 0,
                idealTempMax: 50,
                minHumidity: 0,
                sunlight: 'Direct/Indirect',
                oxygenLevel: 'High'
            }, 'vanamap', 299);

            toast.dismiss(loadingToast);
            toast.success("Design saved and added to cart!", {
                icon: '🛍️',
                style: { background: '#0f172a', color: '#fff', border: '1px solid #10b981' }
            });

            setTimeout(() => {
                toast("This buying option is coming soon, stay tuned! 🌿", {
                    icon: '🚀',
                    duration: 5000,
                    style: { background: '#020617', color: '#10b981', border: '1px solid #10b981' }
                });
            }, 1000);

        } catch (err: any) {
            toast.dismiss(loadingToast);
            console.error("Collection Save Error:", err);
            // Show the actual error message from the API logic
            const msg = err.message || "Failed to save design. Network interruption?";
            toast.error(msg, {
                duration: 4000
            });
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            toast.error("3D Engine not ready for download.");
            return;
        }
        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `Vana_Custom_Pot_${new Date().getTime()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Design downloaded! 📁");
        } catch (e) {
            console.error("Download failed", e);
            toast.error("Failed to generate download file.");
        }
    };

    return (
        <div className={`${styles.designerContainer} no-swipe`}>
            {/* Top Bar */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> EXIT
                </button>
                <div className={styles.title}>VANA STUDIO • POT CONFIGURATOR</div>
                <div style={{ width: 60 }} className="hidden sm:block"></div>
            </header>

            <main className={styles.mainWrapper}>
                {/* 3D Canvas Area */}
                <div className={styles.canvasContainer}>
                    <Suspense fallback={
                        <div className={styles.loading}>
                            <div className={styles.pulse} />
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>INITIALIZING ENGINE...</p>
                        </div>
                    }>
                        <div className={styles.canvasWrapper}>
                            {/* gl={{ preserveDrawingBuffer: true }} is CRITICAL for toDataURL to work */}
                            <Canvas
                                shadows
                                gl={{ preserveDrawingBuffer: true }}
                                onCreated={({ gl }) => {
                                    // Make the canvas available via ref
                                    (canvasRef as any).current = gl.domElement;
                                }}
                            >
                                <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={35} />

                                <ambientLight intensity={0.6} />
                                <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2.5} castShadow />
                                <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#3b82f6" />
                                <pointLight position={[0, -2, 5]} intensity={0.6} color="#10b981" />

                                <PotComposition color={color} image={image} decalProps={decalProps} />

                                <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2.4} far={4.5} />
                                <OrbitControls
                                    enablePan={false}
                                    minPolarAngle={Math.PI / 4}
                                    maxPolarAngle={Math.PI / 1.6}
                                    autoRotate={!image}
                                    autoRotateSpeed={0.4}
                                />
                            </Canvas>
                        </div>
                    </Suspense>

                    {/* Desktop Interaction Tips */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.75rem' }} className="hidden sm:flex">
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                            ROTATE <span style={{ color: '#fff' }}>DRAG</span>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                            ZOOM <span style={{ color: '#fff' }}>SCROLL</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Config Panel */}
                <div className={styles.scrollArea}>
                    <div className={styles.content}>
                        {/* Base Finish */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Palette size={16} />
                                <h3>Material Finish</h3>
                            </div>
                            <div className={styles.colorGrid}>
                                {potColors.map((c) => (
                                    <div
                                        key={c.value}
                                        className={`${styles.colorItem} ${color === c.value ? styles.colorActive : ''}`}
                                        style={{ backgroundColor: c.value }}
                                        onClick={() => setColor(c.value)}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Custom Artwork */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Box size={16} />
                                <h3>Artwork Overlay</h3>
                            </div>

                            <input type="file" id="pot-upload" hidden accept="image/*" onChange={handleImageUpload} />
                            <label htmlFor="pot-upload" className={styles.uploadBox}>
                                <div className={styles.uploadInfo}>
                                    <Upload size={28} color={image ? '#10b981' : '#475569'} />
                                    <span>{image ? <b>SWITCH IMAGE</b> : <>UPLOAD <b>CUSTOM ART</b></>}</span>
                                </div>
                            </label>

                            {image && (
                                <div className={styles.sliders}>
                                    <div className={styles.sliderGroup}>
                                        <div className={styles.sliderHead}>
                                            <span><Maximize size={12} /> SCALE</span>
                                            <span>{Math.round(decalProps.scale * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0.4" max="2.2" step="0.01"
                                            value={decalProps.scale}
                                            onChange={(e) => setDecalProps(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                                            className={styles.range}
                                        />
                                    </div>

                                    <div className={styles.sliderGroup}>
                                        <div className={styles.sliderHead}>
                                            <span><Move size={12} /> ELEVATION</span>
                                            <span>{Math.round(decalProps.y * 100)}</span>
                                        </div>
                                        <input
                                            type="range" min="-0.6" max="1.6" step="0.01"
                                            value={decalProps.y}
                                            onChange={(e) => setDecalProps(p => ({ ...p, y: parseFloat(e.target.value) }))}
                                            className={styles.range}
                                        />
                                    </div>

                                    <div className={styles.sliderGroup}>
                                        <div className={styles.sliderHead}>
                                            <span><RotateCcw size={12} /> ROTATION</span>
                                            <span>{Math.round(decalProps.rotation * 57.3)}°</span>
                                        </div>
                                        <input
                                            type="range" min="-3.14" max="3.14" step="0.01"
                                            value={decalProps.rotation}
                                            onChange={(e) => setDecalProps(p => ({ ...p, rotation: parseFloat(e.target.value) }))}
                                            className={styles.range}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        <div style={{ height: '40px' }} /> {/* Margin spacer */}
                    </div>

                    <div className={styles.footer} style={{ display: 'flex', gap: '8.1px' }}>
                        <button className={styles.downloadBtn} onClick={handleDownload} title="Download Locally">
                            <Download size={18} />
                        </button>
                        <button className={styles.checkoutBtn} onClick={handleAddToCart}>
                            <ShoppingBag size={18} /> ADD TO COLLECTION
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
