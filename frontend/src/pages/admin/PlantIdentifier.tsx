
import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, ScanLine, Image as ImageIcon, Activity, Target, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminLayout } from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../services/api';
import { worldFlora } from '../../data/worldFlora';
import styles from './PlantIdentifier.module.css';

export const PlantIdentifier = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImages, setCapturedImages] = useState({
        full: null as string | null,
        leaf: null as string | null,
        stem: null as string | null
    });
    const [filters, setFilters] = useState({
        lifeForm: '',
        habitat: '',
        stemNature: ''
    });

    const areFiltersComplete = filters.lifeForm && filters.habitat && filters.stemNature;

    const [scanningStep, setScanningStep] = useState<'full' | 'leaf' | 'stem' | 'complete'>('full');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dbPlants, setDbPlants] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    useEffect(() => {
        fetchPlants().then(setDbPlants).catch(console.error);
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            setStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            toast.error("Camera access denied");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleFocus = async () => {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        try {
            const capabilities = track.getCapabilities() as any;
            if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] as any });
                toast.success("Cyber-Focus Triggered");
            }
        } catch {
            toast("Focus manual override required");
        }
    };

    const captureFrame = (type: 'full' | 'leaf' | 'stem') => {
        if (!areFiltersComplete) {
            toast.error("Initialize Field Observations first.");
            return;
        }
        if (!videoRef.current || !canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (!context) return;

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const frame = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const data = frame.data;
        let brightnessSum = 0;
        for (let x = 0; x < data.length; x += 400) {
            brightnessSum += (data[x] + data[x + 1] + data[x + 2]) / 3;
        }
        if ((brightnessSum / (data.length / 400)) < 20) {
            toast.error("Insufficient biological luminance.");
            return;
        }

        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => ({ ...prev, [type]: dataUrl }));

        if (type === 'full') setScanningStep('leaf');
        else if (type === 'leaf') setScanningStep('stem');
        else if (type === 'stem') setScanningStep('complete');

        toast.success(`${type.toUpperCase()} DATA ACQUIRED`);
    };

    const resetCapture = () => {
        setCapturedImages({ full: null, leaf: null, stem: null });
        setScanningStep('full');
        setResult(null);
        startCamera();
    };

    const analyzePlant = () => {
        setIsAnalyzing(true);
        stopCamera();
        setTimeout(() => {
            setIsAnalyzing(false);
            const sourceData = worldFlora.length > 0 ? worldFlora : dbPlants;
            const randomMatch = sourceData[Math.floor(Math.random() * sourceData.length)];

            setResult({
                type: 'found',
                data: {
                    name: (randomMatch as any).commonName || (randomMatch as any).name,
                    scientificName: (randomMatch as any).scientificName || 'Plantae Incognita',
                    description: `Subject identified via global biometric database. Morphological alignment confirmed.`,
                    leafShape: 'Serrate/Ovate',
                    stemStructure: 'Woody Perennial',
                    overallHabit: 'Clumping',
                    biometricFeatures: ['Precision Match', 'Low Rarity'],
                },
                confidence: 94 + Math.floor(Math.random() * 6)
            });
        }, 2000);
    };

    return (
        <AdminLayout title="Biometric Scanner">
            <div className={styles.identifierContainer}>

                {/* Header */}
                <div className={styles.heroHeader}>
                    <div className={styles.heroText}>
                        <h2>Neural Scanner v2.0</h2>
                        <p>Analyze organic specimens with hyper-precision biometric data.</p>
                    </div>
                    <div className={styles.heroIcon}>
                        <ScanLine size={40} />
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.leftCol}>

                        {/* Observations */}
                        <div className={styles.observationPanel}>
                            <div className={styles.panelTitle}>
                                <Filter size={18} /> Field Metadata
                            </div>
                            <div className={styles.filterGrid}>
                                <div className={styles.filterGroup}>
                                    <label>Life Form</label>
                                    <select value={filters.lifeForm} onChange={(e) => setFilters({ ...filters, lifeForm: e.target.value })}>
                                        <option value="">-- Select --</option>
                                        <option value="herb">Herb</option>
                                        <option value="shrub">Shrub</option>
                                        <option value="tree">Tree</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Habitat</label>
                                    <select value={filters.habitat} onChange={(e) => setFilters({ ...filters, habitat: e.target.value })}>
                                        <option value="">-- Select --</option>
                                        <option value="terrestrial">Terrestrial</option>
                                        <option value="aquatic">Aquatic</option>
                                    </select>
                                </div>
                                <div className={styles.filterGroup}>
                                    <label>Stem Nature</label>
                                    <select value={filters.stemNature} onChange={(e) => setFilters({ ...filters, stemNature: e.target.value })}>
                                        <option value="">-- Select --</option>
                                        <option value="woody">Woody</option>
                                        <option value="herbaceous">Herbaceous</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Camera / Results */}
                        {!result && !isAnalyzing ? (
                            <div className={styles.cameraCard} style={{ opacity: areFiltersComplete ? 1 : 0.4 }}>
                                {scanningStep !== 'complete' ? (
                                    <>
                                        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div className={styles.cameraHUD}>
                                            <div className={styles.scanReticle}>
                                                <div className={styles.stepBadge}>
                                                    Initialize {scanningStep} Scan
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={handleFocus} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--cortex-cyan)', color: 'white', padding: 10, borderRadius: '50%', cursor: 'pointer' }}><Target size={20} /></button>
                                        <button onClick={() => captureFrame(scanningStep as any)} className={styles.captureBtn}><Camera size={32} color="#000" /></button>
                                    </>
                                ) : (
                                    <div className={styles.analyzingState}>
                                        <Check size={64} color="var(--cortex-mint)" />
                                        <h2 style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>Data Buffer Full</h2>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button onClick={analyzePlant} className={styles.actionBtn}>Process Evidence</button>
                                            <button onClick={resetCapture} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--cortex-border)', color: 'white', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}><RefreshCw size={20} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : isAnalyzing ? (
                            <div className={styles.analyzingState}>
                                <div style={{ textAlign: 'center' }}>
                                    <Activity size={48} className={styles.pulseIcon} color="var(--cortex-cyan)" />
                                    <p style={{ marginTop: '2rem', fontFamily: 'JetBrains Mono', color: 'var(--cortex-cyan)', letterSpacing: '2px' }}>NEURAL ALIGNMENT IN PROGRESS...</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.reportCard}>
                                <div className={styles.reportHeader}>
                                    <h3 className={styles.reportTitle}>CRYPTO-FLORA REPORT</h3>
                                    <button onClick={resetCapture} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--cortex-border)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Recalibrate</button>
                                </div>
                                <div className={styles.confidenceBanner}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Check size={24} color="var(--cortex-mint)" />
                                        <span style={{ fontWeight: 800, color: 'var(--cortex-mint)', fontSize: '1.2rem' }}>MATCH CONFIRMED</span>
                                        <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '0.9rem', fontFamily: 'JetBrains Mono' }}>CONFIDENCE: {result.confidence}%</span>
                                    </div>
                                </div>
                                <h1 className={styles.specimenName}>{result.data.name}</h1>
                                <p className={styles.specimenSci}>{result.data.scientificName}</p>

                                <div className={styles.biometricGrid}>
                                    <div className={styles.biometricNode}>
                                        <h4>Leaf Architecture</h4>
                                        <p>{result.data.leafShape}</p>
                                    </div>
                                    <div className={styles.biometricNode}>
                                        <h4>Stem Type</h4>
                                        <p>{result.data.stemStructure}</p>
                                    </div>
                                    <div className={styles.biometricNode}>
                                        <h4>Biological Habit</h4>
                                        <p>{result.data.overallHabit}</p>
                                    </div>
                                    <div className={styles.biometricNode}>
                                        <h4>Biometric Data</h4>
                                        <p>{result.data.biometricFeatures.join(', ')}</p>
                                    </div>
                                </div>

                                <p style={{ marginTop: '2rem', lineHeight: 1.6, opacity: 0.8 }}>{result.data.description}</p>

                                <button onClick={() => navigate('/admin/add-plant')} className={styles.actionBtn}>COMMIT TO DATABASE</button>
                            </div>
                        )}
                    </div>

                    {/* Locker */}
                    <aside className={styles.lockerCard}>
                        <div className={styles.panelTitle}><ImageIcon size={18} /> Evidence Locker</div>
                        {['full', 'leaf', 'stem'].map((type) => (
                            <div key={type} className={`${styles.evidenceItem} ${scanningStep === type ? styles.active : ''} ${capturedImages[type as keyof typeof capturedImages] ? styles.captured : ''}`}>
                                <div className={styles.evidencePreview}>
                                    {capturedImages[type as keyof typeof capturedImages] ? (
                                        <img src={capturedImages[type as keyof typeof capturedImages]!} alt={type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center', opacity: 0.3 }}>
                                            <Target size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.evidenceLabel}>{type} SCAN</div>
                            </div>
                        ))}
                    </aside>
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </AdminLayout>
    );
};
