
import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, Search, Plus, ScanLine, Leaf, Image as ImageIcon, Activity, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminLayout } from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../services/api';

export const PlantIdentifier = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImages, setCapturedImages] = useState({
        full: null as string | null,
        leaf: null as string | null,
        stem: null as string | null
    });
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
        if (!videoRef.current || !canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        if (!context) return;

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => ({ ...prev, [type]: dataUrl }));

        // Advance step
        if (type === 'full') setScanningStep('leaf');
        if (type === 'leaf') setScanningStep('stem');
        if (type === 'stem') setScanningStep('complete');

        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} captured!`);
    };

    const resetCapture = () => {
        setCapturedImages({ full: null, leaf: null, stem: null });
        setScanningStep('full');
        setResult(null);
    };

    const analyzePlant = () => {
        setIsAnalyzing(true);
        stopCamera();

        // Simulation
        setTimeout(() => {
            setIsAnalyzing(false);

            // Mock logic: Try to match with DB or suggest new
            const randomMatch = Math.random() > 0.5 ? dbPlants[0] : null; // 50% chance to match

            if (randomMatch) {
                setResult({
                    type: 'found',
                    data: randomMatch,
                    confidence: 94.2
                });
            } else {
                setResult({
                    type: 'unknown',
                    data: {
                        name: 'Unknown Species',
                        scientificName: 'Plantae Incognita',
                        description: 'No plant identified with this characteristic structure in the database. The observed morphology differs significantly from known records.',
                        leafShape: 'Observed: Ovate/Broad',
                        stemStructure: 'Observed: Semi-Woody',
                        overallHabit: 'Observed: Upright',
                        biometricFeatures: ['Slightly Serrated', 'Dark Green Hue'],
                        likelyMatches: [
                            { name: 'Rubber Fig', confidence: 88 },
                            { name: 'Magnolia', confidence: 65 }
                        ]
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
                        <div style={{
                            background: '#1e293b',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '1px solid #334155',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
