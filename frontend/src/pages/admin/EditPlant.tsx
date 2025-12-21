import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ChevronLeft, Save, Image as ImageIcon, Sparkles,
    Thermometer, Droplets, Upload, Wind, Sun, Leaf, Activity,
    ShieldCheck, PlusCircle, XCircle
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchPlants, updatePlant } from '../../services/api';
import type { Plant } from '../../types';
import styles from './EditPlant.module.css';

// --- HELPERS ---
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;
                if (width > height && width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                } else if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const EditPlant = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [plant, setPlant] = useState<Partial<Plant>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tags state for array fields
    const [medicinalInput, setMedicinalInput] = useState('');
    const [advantageInput, setAdvantageInput] = useState('');

    useEffect(() => {
        const loadPlantData = async () => {
            if (!id) return;
            try {
                const plants = await fetchPlants();
                const found = plants.find(p => p.id === id);
                if (found) {
                    setPlant({
                        ...found,
                        medicinalValues: found.medicinalValues || [],
                        advantages: found.advantages || []
                    });
                } else {
                    toast.error("Plant not found in registry");
                    navigate('/admin/manage-plants');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load flora data");
            } finally {
                setLoading(false);
            }
        };
        loadPlantData();
    }, [id, navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tid = toast.loading("Processing image...");
        try {
            const compressedBase64 = await compressImage(file);
            setPlant({ ...plant, imageUrl: compressedBase64 });
            toast.success("Image updated", { id: tid });
        } catch (err) {
            toast.error("Compression failed", { id: tid });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);
        const tid = toast.loading("Recording modifications to registry...");

        try {
            await updatePlant(id, plant);
            toast.success("Specimen updated successfully", { id: tid });
            setTimeout(() => navigate('/admin/manage-plants'), 1000);
        } catch (err) {
            toast.error("An error occurred during verification", { id: tid });
            setSaving(false);
        }
    };

    const addMedicinal = () => {
        if (!medicinalInput.trim()) return;
        setPlant(prev => ({
            ...prev,
            medicinalValues: [...(prev.medicinalValues || []), medicinalInput.trim()]
        }));
        setMedicinalInput('');
    };

    const removeMedicinal = (index: number) => {
        setPlant(prev => ({
            ...prev,
            medicinalValues: (prev.medicinalValues || []).filter((_, i) => i !== index)
        }));
    };

    const addAdvantage = () => {
        if (!advantageInput.trim()) return;
        setPlant(prev => ({
            ...prev,
            advantages: [...(prev.advantages || []), advantageInput.trim()]
        }));
        setAdvantageInput('');
    };

    const removeAdvantage = (index: number) => {
        setPlant(prev => ({
            ...prev,
            advantages: (prev.advantages || []).filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <AdminLayout title="Specimen Analysis">
                <div className="flex items-center justify-center p-20 text-slate-400">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <Sparkles size={48} className="text-blue-500 animate-spin" />
                        <p className="font-bold tracking-widest text-sm uppercase">Accessing Flora Database...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Specimen Editor">
            <div className={styles.editContainer}>
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.titleIcon}>
                            <Sparkles size={24} />
                        </div>
                        <div className={styles.titleText}>
                            <h1>{plant.name || 'New Specimen'}</h1>
                            <p>Refinery ID: {id}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.btnCancel}>
                        <ChevronLeft size={18} className="mr-2" /> Back
                    </button>
                </header>

                <form onSubmit={handleSave} className={styles.formGrid}>
                    <div className={styles.formSection}>
                        {/* Identity Section */}
                        <div className="mb-8">
                            <h3 className={styles.sectionSubtitle}>
                                <Leaf size={16} className="text-emerald-500" /> Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Common Name</label>
                                    <input
                                        className={styles.glassInput}
                                        value={plant.name || ''}
                                        onChange={e => setPlant({ ...plant, name: e.target.value })}
                                        placeholder="e.g. Silver Queen Snake Plant"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Scientific Designation</label>
                                    <input
                                        className={`${styles.glassInput} italic`}
                                        value={plant.scientificName || ''}
                                        onChange={e => setPlant({ ...plant, scientificName: e.target.value })}
                                        placeholder="e.g. Sansevieria trifasciata"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Economics & Type Section */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Base Price (₹)</label>
                                    <input
                                        type="number"
                                        className={styles.glassInput}
                                        value={plant.price || 0}
                                        onChange={e => setPlant({ ...plant, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Environment Type</label>
                                    <select
                                        className={styles.glassSelect}
                                        value={plant.type || 'indoor'}
                                        onChange={e => setPlant({ ...plant, type: e.target.value as any })}
                                    >
                                        <option value="indoor">Indoor (Lab)</option>
                                        <option value="outdoor">Outdoor (Natural)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sunlight & Oxygen */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Sunlight Requirement</label>
                                    <div className={styles.segmentedControl}>
                                        {['low', 'medium', 'high', 'direct'].map(lvl => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setPlant({ ...plant, sunlight: lvl as any })}
                                                className={`${styles.segmentBtn} ${plant.sunlight === lvl ? styles.segmentBtnActive : ''}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Oxygen Output</label>
                                    <select
                                        className={styles.glassSelect}
                                        value={plant.oxygenLevel || 'moderate'}
                                        onChange={e => setPlant({ ...plant, oxygenLevel: e.target.value as any })}
                                    >
                                        <option value="low">Low Output</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High Purifier</option>
                                        <option value="very-high">Superior Purifier</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Vital Metrics (Sliders) */}
                        <div className="mb-8">
                            <h3 className={styles.sectionSubtitle}>
                                <Activity size={16} className="text-blue-500" /> Vital Metrics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={styles.label}>
                                            <Droplets size={14} className="text-blue-400 inline mr-1" /> Min Humidity
                                        </label>
                                        <span className="text-sm font-mono text-blue-400 font-bold">{plant.minHumidity || 0}%</span>
                                    </div>
                                    <div className={styles.rangeWrapper}>
                                        <input
                                            type="range" min="0" max="100" step="5"
                                            className={styles.rangeInput}
                                            value={plant.minHumidity || 0}
                                            onChange={e => setPlant({ ...plant, minHumidity: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={styles.label}>
                                            <Thermometer size={14} className="text-amber-400 inline mr-1" /> Ideal Temp (Min)
                                        </label>
                                        <span className="text-sm font-mono text-amber-400 font-bold">{plant.idealTempMin || 18}°C</span>
                                    </div>
                                    <div className={styles.rangeWrapper}>
                                        <input
                                            type="range" min="0" max="40" step="1"
                                            className={styles.rangeInput}
                                            value={plant.idealTempMin || 18}
                                            onChange={e => setPlant({ ...plant, idealTempMin: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={styles.label}>
                                            <Thermometer size={14} className="text-red-400 inline mr-1" /> Ideal Temp (Max)
                                        </label>
                                        <span className="text-sm font-mono text-red-400 font-bold">{plant.idealTempMax || 30}°C</span>
                                    </div>
                                    <div className={styles.rangeWrapper}>
                                        <input
                                            type="range" min="0" max="50" step="1"
                                            className={styles.rangeInput}
                                            value={plant.idealTempMax || 30}
                                            onChange={e => setPlant({ ...plant, idealTempMax: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* medicinalValues & Advantages Section */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Activity size={14} className="inline mr-1" /> Medicinal Values</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        className={styles.glassInput}
                                        value={medicinalInput}
                                        onChange={e => setMedicinalInput(e.target.value)}
                                        placeholder="Add value..."
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMedicinal())}
                                    />
                                    <button type="button" onClick={addMedicinal} className={styles.addTagBtn}><PlusCircle size={20} /></button>
                                </div>
                                <div className={styles.tagCloud}>
                                    {plant.medicinalValues?.map((val, i) => (
                                        <span key={i} className={styles.tag}>
                                            {val} <button type="button" onClick={() => removeMedicinal(i)}><XCircle size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><ShieldCheck size={14} className="inline mr-1" /> Key Advantages</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        className={styles.glassInput}
                                        value={advantageInput}
                                        onChange={e => setAdvantageInput(e.target.value)}
                                        placeholder="Add advantage..."
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAdvantage())}
                                    />
                                    <button type="button" onClick={addAdvantage} className={styles.addTagBtn}><PlusCircle size={20} /></button>
                                </div>
                                <div className={styles.tagCloud}>
                                    {plant.advantages?.map((val, i) => (
                                        <span key={i} className={styles.tag}>
                                            {val} <button type="button" onClick={() => removeAdvantage(i)}><XCircle size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Botanical Description</label>
                            <textarea
                                className={`${styles.glassInput} ${styles.textarea}`}
                                value={plant.description || ''}
                                onChange={e => setPlant({ ...plant, description: e.target.value })}
                                placeholder="Enter detailed physiological characteristics..."
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Asset URL (External)</label>
                            <input
                                className={styles.glassInput}
                                value={plant.imageUrl || ''}
                                onChange={e => setPlant({ ...plant, imageUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className={styles.imageSection}>
                        <label className={styles.label}>Live Preview & Upload</label>
                        <div className={styles.previewCard}>
                            {plant.imageUrl ? (
                                <img src={plant.imageUrl} className={styles.previewImage} alt="Preview" />
                            ) : (
                                <div className={styles.noImage}>
                                    <ImageIcon size={64} />
                                    <p className="text-sm font-bold opacity-30">NO ASSET FOUND</p>
                                </div>
                            )}
                            <div className={styles.uploadOverlay}>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.uploadBtn}>
                                    <Upload size={18} /> Update Photo
                                </button>
                                <p className="text-[10px] text-white/60 mt-2 uppercase tracking-tight">Auto-compressed JPG</p>
                            </div>
                            <div className={styles.badge}>{plant.type}</div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        <div className="mt-8 grid grid-cols-2 gap-3 opacity-50 text-white">
                            <div className="p-3 border border-slate-800 rounded-lg flex items-center gap-3">
                                <Sun size={16} className="text-amber-500" /> <span className="text-[10px] uppercase font-bold">{plant.sunlight}</span>
                            </div>
                            <div className="p-3 border border-slate-800 rounded-lg flex items-center gap-3">
                                <Wind size={16} className="text-purple-400" /> <span className="text-[10px] uppercase font-bold">{plant.oxygenLevel}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/manage-plants')}
                            className={styles.btnCancel}
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={styles.btnSave}
                        >
                            <Save size={18} /> {saving ? 'Verifying...' : 'Seal Registry'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};
