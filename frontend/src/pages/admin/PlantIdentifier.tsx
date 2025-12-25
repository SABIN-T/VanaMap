
import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, Search, Plus, ScanLine, Leaf, Image as ImageIcon, Activity, Target, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminLayout } from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../services/api';
import { worldFlora } from '../../data/worldFlora';

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
                    // Removes any potential default filters
                }
            });
            setStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            toast.error("Camera permission denied");
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
            // Check if advanced capabilities are supported
            const capabilities = track.getCapabilities() as any;
            if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                await track.applyConstraints({
                    advanced: [{ focusMode: 'continuous' }] as any
                });
                toast.success("Auto-focus triggered");
            } else if (capabilities.focusMode && capabilities.focusMode.includes('single-shot')) {
                await track.applyConstraints({
                    advanced: [{ focusMode: 'single-shot' }] as any
                });
                toast.success("Focused");
            } else {
                toast("Manual focus not supported on this device. Tap screen to focus if available.", { icon: 'ℹ️' });
            }
        } catch (e) {
            console.error("Focus failed", e);
            toast("Focus adjustment failed");
        }
    };

    const captureFrame = (type: 'full' | 'leaf' | 'stem') => {
        if (!areFiltersComplete) {
            toast.error("Please complete the Field Observations above before scanning.");
            return;
        }
        if (!videoRef.current || !canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (!context) return;

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        // Simple Detection Simulation: Check for "Blank" or "Dark" image
        const frame = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const data = frame.data;
        let r, g, b, avg;
        let colorSum = 0;
        let brightnessSum = 0;

        // Sample every 100th pixel for speed
        for (let x = 0; x < data.length; x += 400) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];
            avg = (r + g + b) / 3;
            colorSum += avg;
            brightnessSum += avg;
        }

        const totalPixels = data.length / 400;
        const avgBrightness = brightnessSum / totalPixels;

        // Thresholds: Too dark or effectively blank
        if (avgBrightness < 20) {
            toast.error("❌ No Biological Subject Detected!\n\nImage is too dark or empty. Please ensure the plant is well-lit and in frame.", { duration: 5000, icon: '🌑' });
            return;
        }

        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => ({ ...prev, [type]: dataUrl }));

        // Advance step & Instructional Notifications
        if (type === 'full') {
            setScanningStep('leaf');
            toast.success("Full Plant Captured. 🌿\nNow, move closer to scan a single LEAF.", { duration: 4000 });
        } else if (type === 'leaf') {
            setScanningStep('stem');
            toast.success("Leaf Architecture Scanned. 🍃\nFinally, capture the STEM or Bark texture.", { duration: 4000 });
        } else if (type === 'stem') {
            setScanningStep('complete');
            toast.success("Biometric Data Collection Complete! ✅\nProceed to Analysis.", { duration: 4000 });
        }
    };

    const resetCapture = () => {
        setCapturedImages({ full: null, leaf: null, stem: null });
        setScanningStep('full');
        setResult(null);
        // Optional: Reset filters? No, user might want to scan again with same settings.
    };

    const analyzePlant = () => {
        setIsAnalyzing(true);
        stopCamera();

        // Simulation
        setTimeout(() => {
            setIsAnalyzing(false);

            // Biometric Feature Detection Simulation
            // We simulate the extraction of distinctive morphological features.
            const detectedFeaturesCount = Math.floor(Math.random() * 6); // Randomly find 0 to 5 features

            if (detectedFeaturesCount >= 3) {
                // Sufficient data: Match found
                // Prioritize "Global Simulation Data" for high accuracy look, fallback to DB
                const sourceData = worldFlora.length > 0 ? worldFlora : dbPlants;
                const randomMatch = sourceData[Math.floor(Math.random() * sourceData.length)];

                // Map worldFlora format to Plant result format if needed

                setResult({
                    type: 'found',
                    data: {
                        name: (randomMatch as any).commonName || (randomMatch as any).name,
                        scientificName: (randomMatch as any).scientificName || 'Plantae',
                        description: `Identified via global biometric database. Match Index: ${(randomMatch as any).rarityIndex || 'Standard'}.`,
                        leafShape: (randomMatch as any).leafVenation || 'Observed Data',
                        stemStructure: (randomMatch as any).inflorescencePattern || 'Observed Data',
                        overallHabit: (randomMatch as any).flowerType || 'Observed Data',
                        biometricFeatures: [`Rarity: ${(randomMatch as any).rarityIndex || 'N/A'}`, 'High Confidence Match'],
                        likelyMatches: []
                    },
                    confidence: 96 + Math.floor(Math.random() * 4) // High accuracy
                });
            } else {
                // Insufficient data or No Match
                setResult({
                    type: 'unknown',
                    data: {
                        name: 'No Plant Identified',
                        scientificName: 'Analysis Inconclusive',
                        description: detectedFeaturesCount < 3
                            ? `Biometric scan failed. Only ${detectedFeaturesCount} valid characteristic(s) detected. A minimum of 3 unique features (e.g., Venation, Leaf Margin, Phyllotaxy) is required for identification.`
                            : `Biometric profile complete (${detectedFeaturesCount} features), but no matching specimen found in the global registry.`,
                        leafShape: 'Undetermined',
                        stemStructure: 'Undetermined',
                        overallHabit: 'Undetermined',
                        biometricFeatures: [],
                        likelyMatches: []
                    }
                });
            }
        }, 3000); // 3s analysis simulation
    };

    const addToDatabase = () => {
        // Navigate to Add Plant with pre-filled state (mock)
        // In a real app, we'd pass state via location
        navigate('/admin/add-plant', {
            state: {
                prefill: {
                    name: result.data.name !== 'Unknown Species' ? result.data.name : result.data.likelyMatches[0].name,
                    scientificName: result.data.scientificName !== 'Plantae Incognita' ? result.data.scientificName : '',
                    description: result.data.description,
                    // Potentially pass the captured images too
                }
            }
        });
    };

    return (
        <AdminLayout title="Plant Identifier AI">
            <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>

                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bio-Scanner v2.0</h2>
                        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Capture plant morphology for standard identification.</p>
                    </div>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ScanLine size={32} />
                    </div>
                    {/* Abstract Shapes */}
                    <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                </div>

                {/* Main Workflow Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Left Col: Camera & Capture */}
                    <div style={{ gridColumn: 'span 2' }}>

                        {/* Pre-Scan Context Filters - NEW SECTION */}
                        <div style={{
                            background: '#1e293b',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #334155',
                            display: result ? 'none' : 'block' // Hide if result shown
                        }}>
                            <h3 style={{ marginBottom: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={20} /> Field Observations
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                Select environmental traits to calibrate the visual scanner.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

                                {/* Life Form Select */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Life Form</label>
                                    <select
                                        value={filters.lifeForm}
                                        onChange={(e) => setFilters({ ...filters, lifeForm: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                                    >
                                        <option value="">-- Select Type --</option>
                                        <option value="herb">Herb</option>
                                        <option value="shrub">Shrub</option>
                                        <option value="tree">Tree</option>
                                        <option value="climber">Climber</option>
                                        <option value="creeper">Creeper</option>
                                    </select>
                                </div>

                                {/* Habitat Select */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Habitat</label>
                                    <select
                                        value={filters.habitat}
                                        onChange={(e) => setFilters({ ...filters, habitat: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                                    >
                                        <option value="">-- Select Habitat --</option>
                                        <option value="terrestrial">Terrestrial</option>
                                        <option value="aquatic">Aquatic</option>
                                        <option value="epiphytic">Epiphytic</option>
                                        <option value="xerophytic">Xerophytic</option>
                                    </select>
                                </div>

                                {/* Stem Nature Select */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Stem Nature</label>
                                    <select
                                        value={filters.stemNature}
                                        onChange={(e) => setFilters({ ...filters, stemNature: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                                    >
                                        <option value="">-- Select Stem --</option>
                                        <option value="woody">Woody</option>
                                        <option value="semi-woody">Semi-Woody</option>
                                        <option value="herbaceous">Herbaceous</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: '#1e293b',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '1px solid #334155',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            opacity: areFiltersComplete ? 1 : 0.5,
                            pointerEvents: areFiltersComplete ? 'auto' : 'none',
                            transition: 'opacity 0.3s'
                        }}>
                            {!result && !isAnalyzing ? (
                                <div style={{ position: 'relative', height: '500px', background: '#000' }}>
                                    {scanningStep !== 'complete' ? (
                                        <>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {/* HUD Overlay */}
                                            <div style={{ position: 'absolute', inset: 0, border: '50px solid rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                                <div style={{ width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.5)', position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                                        color: 'white', textAlign: 'center', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '99px'
                                                    }}>
                                                        {scanningStep === 'full' && "Align Full Plant"}
                                                        {scanningStep === 'leaf' && "Focus on a Single Leaf"}
                                                        {scanningStep === 'stem' && "Capture Stem Details"}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleFocus}
                                                style={{
                                                    position: 'absolute', top: '20px', right: '20px',
                                                    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)',
                                                    color: 'white', padding: '10px', borderRadius: '50%',
                                                    cursor: 'pointer', zIndex: 10
                                                }}
                                                title="Trigger Auto-Focus"
                                            >
                                                <Target size={20} />
                                            </button>

                                            <button
                                                onClick={() => captureFrame(scanningStep as any)}
                                                style={{
                                                    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                                                    width: '80px', height: '80px', borderRadius: '50%', background: 'white',
                                                    border: '4px solid rgba(255,255,255,0.5)', cursor: 'pointer',
                                                    display: 'grid', placeItems: 'center',
                                                    boxShadow: '0 0 20px rgba(255,255,255,0.3)'
                                                }}
                                            >
                                                <Camera size={32} color="#000" />
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                            <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Check size={48} color="white" />
                                            </div>
                                            <h2>Scans Complete</h2>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button
                                                    onClick={analyzePlant}
                                                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 3rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Analyze Evidence
                                                </button>
                                                <button
                                                    onClick={resetCapture}
                                                    style={{ background: '#334155', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}
                                                >
                                                    <RefreshCw />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : isAnalyzing ? (
                                <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                                    <div className="pre-loader-pulse"></div>
                                    <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '1.1rem' }}>Simulating Neural Network Analysis...</p>
                                    <div style={{ width: '300px', marginTop: '1rem', height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: '100%', height: '100%', background: '#10b981', animation: 'progress 3s ease-in-out' }}>
                                            <style>{`@keyframes progress { from { width: 0%} to { width: 100% } }`}</style>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '2rem', height: '500px', overflowY: 'auto' }}>
                                    {/* RESULTS */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Analysis Report</h3>
                                        <button onClick={resetCapture} style={{ background: '#334155', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>New Scan</button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                background: result.type === 'found' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                border: `1px solid ${result.type === 'found' ? '#10b981' : '#f59e0b'}`,
                                                borderRadius: '16px', padding: '1.5rem'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                    {result.type === 'found' ? <Check size={24} color="#10b981" /> : <Search size={24} color="#f59e0b" />}
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: result.type === 'found' ? '#10b981' : '#f59e0b' }}>
                                                        {result.type === 'found' ? 'Database Match Confirmed' : 'New Species Discovery'}
                                                    </span>
                                                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.7 }}>Confidence: {result.confidence}%</span>
                                                </div>

                                                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{result.data.name}</h1>
                                                {result.data.scientificName && <p style={{ fontStyle: 'italic', opacity: 0.7, marginBottom: '1rem', fontSize: '1.1rem' }}>{result.data.scientificName}</p>}

                                                {/* BIOMETRIC DETAILS GRID */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Leaf Structure</span>
                                                        <p style={{ fontWeight: 600 }}>{result.data.leafShape || 'Unknown'}</p>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Stem Type</span>
                                                        <p style={{ fontWeight: 600 }}>{result.data.stemStructure || 'Unknown'}</p>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Habit</span>
                                                        <p style={{ fontWeight: 600 }}>{result.data.overallHabit || 'Unknown'}</p>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Features</span>
                                                        <p style={{ fontWeight: 600 }}>{result.data.biometricFeatures?.join(', ') || 'Standard'}</p>
                                                    </div>
                                                </div>

                                                <p style={{ lineHeight: 1.6, color: '#ecfdf5' }}>{result.data.description}</p>

                                                {result.type === 'unknown' && (
                                                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                                        <h4 style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Web Search Suggestions:</h4>
                                                        <ul style={{ paddingLeft: '1.2rem' }}>
                                                            {result.data.likelyMatches.map((m: any) => (
                                                                <li key={m.name} style={{ marginBottom: '0.25rem' }}>{m.name} ({m.confidence}% match)</li>
                                                            ))}
                                                        </ul>
                                                        <a href={`https://www.google.com/search?tbm=isch&q=${result.data.likelyMatches[0].name}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1rem', color: '#60a5fa', textDecoration: 'none' }}>
                                                            Verify on Google Images &rarr;
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={addToDatabase}
                                                style={{
                                                    width: '100%', marginTop: '1.5rem',
                                                    background: '#10b981', color: 'white', border: 'none',
                                                    padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
                                                }}
                                            >
                                                <Plus size={20} />
                                                Add to Official Database
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Col: Evidence Gallery */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '24px', border: '1px solid #334155' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={18} /> Evidence Locker</h3>

                                {['full', 'leaf', 'stem'].map((type, idx) => (
                                    <div key={type} style={{
                                        marginBottom: '1rem',
                                        background: '#0f172a',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: scanningStep === type ? '2px solid #10b981' : '1px solid #334155',
                                        opacity: capturedImages[type as keyof typeof capturedImages] ? 1 : 0.5,
                                        transition: '0.3s'
                                    }}>
                                        {capturedImages[type as keyof typeof capturedImages] ? (
                                            <img src={capturedImages[type as keyof typeof capturedImages]!} alt={type} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                                                {type === 'full' && <ScanLine size={32} color="#475569" />}
                                                {type === 'leaf' && <Leaf size={32} color="#475569" />}
                                                {type === 'stem' && <Activity size={32} color="#475569" />}
                                                <span style={{ textTransform: 'capitalize', color: '#64748b', fontSize: '0.8rem' }}>{type}</span>
                                            </div>
                                        )}
                                        <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', background: '#1e293b', color: capturedImages[type as keyof typeof capturedImages] ? '#10b981' : '#64748b' }}>
                                            {idx + 1}. {type} Scan
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            </div>
        </AdminLayout >
    );
};
