import { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant, fetchPlants } from '../../services/api';
import { AdminPageLayout } from './AdminPageLayout';
import { Search, Upload, Thermometer, Wind, Droplets, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';
import { PlantCard } from '../../components/features/plants/PlantCard';
import styles from './AddPlant.module.css';

// --- HELPERS ---
const smartFillPlant = (sciName: string) => {
    const search = sciName.toLowerCase().trim();
    if (!search) return null;

    const entries = Object.entries(INDIAN_PLANT_DB);
    const found = entries.find(([key, val]) => {
        return key.includes(search) || val.name?.toLowerCase().includes(search);
    });

    if (found) {
        const [key, data] = found;
        return {
            ...(data as any),
            scientificName: key,
            name: data.name,
            type: data.type || 'indoor',
            sunlight: data.sunlight || 'medium'
        };
    }
    return null;
};

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

export const AddPlant = () => {
    const [scientificNameSearch, setScientificNameSearch] = useState('');

    const [newPlant, setNewPlant] = useState<Partial<Plant>>({
        name: '',
        scientificName: '',
        description: '',
        imageUrl: '',
        price: 0,
        type: 'indoor',
        sunlight: 'medium',
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 40,
        oxygenLevel: 'high',
        medicinalValues: [],
        advantages: []
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSmartFill = () => {
        if (!scientificNameSearch) return;
        const found = smartFillPlant(scientificNameSearch);
        if (found) {
            setNewPlant(prev => ({
                ...prev,
                name: found.name || prev.name,
                scientificName: found.scientificName,
                description: found.description || prev.description,
                type: (found.type === 'herb' ? 'outdoor' : found.type) as any,
                sunlight: found.sunlight as any,
                idealTempMin: found.idealTempMin || prev.idealTempMin,
                idealTempMax: found.idealTempMax || prev.idealTempMax,
                minHumidity: found.minHumidity || prev.minHumidity,
                oxygenLevel: found.oxygenLevel as any || prev.oxygenLevel,
                medicinalValues: found.medicinalValues || [],
                advantages: found.advantages || []
            }));
            toast.success(`Populated: ${found.name}`, { icon: '✨' });
        } else {
            toast.error("Specimen not found in database.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tid = toast.loading("Processing...");
        try {
            const compressedBase64 = await compressImage(file);
            setNewPlant({ ...newPlant, imageUrl: compressedBase64 });
            toast.success("Image Set", { id: tid });
        } catch (err) {
            toast.error("Image Error", { id: tid });
        }
    };

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Saving Specimen...");
        try {
            // Check for existing scientific name
            const existingPlants = await fetchPlants();
            const isDuplicate = existingPlants.some(p =>
                p.scientificName?.toLowerCase().trim() === newPlant.scientificName?.toLowerCase().trim()
            );

            if (isDuplicate) {
                toast.error("The plant is already enrolled", { id: tid });
                return;
            }

            const plantData: Plant = {
                id: crypto.randomUUID(),
                name: newPlant.name || 'Unknown',
                scientificName: newPlant.scientificName || 'Unknown',
                description: newPlant.description || 'No description.',
                imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop',
                price: Number(newPlant.price),
                type: newPlant.type as any || 'indoor',
                sunlight: newPlant.sunlight as any || 'medium',
                idealTempMin: Number(newPlant.idealTempMin),
                idealTempMax: Number(newPlant.idealTempMax),
                minHumidity: Number(newPlant.minHumidity),
                oxygenLevel: newPlant.oxygenLevel as any || 'moderate',
                medicinalValues: newPlant.medicinalValues || [],
                advantages: newPlant.advantages || [],
                isNocturnal: false
            };
            await addPlant(plantData);
            toast.success("Specimen Registered", { id: tid });

            // Reset
            setNewPlant({
                name: '', scientificName: '', imageUrl: '', price: 0,
                type: 'indoor', sunlight: 'medium', description: '',
                idealTempMin: 18, idealTempMax: 30, minHumidity: 40,
                oxygenLevel: 'high', medicinalValues: [], advantages: []
            });
            setScientificNameSearch('');
        } catch (err) {
            toast.error("Save Failed", { id: tid });
        }
    };

    const previewPlant: Plant = {
        id: 'preview',
        name: newPlant.name || 'Botanic Name',
        scientificName: newPlant.scientificName || 'Scientific classification',
        description: newPlant.description || 'Plant description will appear here...',
        imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop',
        price: Number(newPlant.price),
        type: newPlant.type as any || 'indoor',
        sunlight: newPlant.sunlight as any || 'medium',
        idealTempMin: 18, idealTempMax: 30,
        minHumidity: Number(newPlant.minHumidity),
        oxygenLevel: newPlant.oxygenLevel as any || 'moderate',
        medicinalValues: [], advantages: [], isNocturnal: false
    };

    return (
        <AdminPageLayout title="New Specimen">
            <div className={styles.pageContainer}>

                <div className={styles.mainLayout}>
                    {/* --- LEFT PANEL: VISUAL & PREVIEW --- */}
                    <div className={styles.previewPanel}>
                        {/* Dynamic Background */}
                        <div
                            className={styles.previewBg}
                            style={{
                                backgroundImage: `url(${newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop'})`
                            }}
                        />

                        {/* 3D Card Containment */}
                        <div className={styles.cardWrapper}>
                            <PlantCard plant={previewPlant} onAdd={() => { }} />
                        </div>

                        {/* Interactive Overlay */}
                        <div className={styles.uploadOverlay}>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-black hover:bg-slate-200 shadow-xl mb-4"
                            >
                                <Upload size={18} className="mr-2" /> Upload Photo
                            </Button>

                            <div className="w-64">
                                <span className="text-xs text-slate-300 font-medium mb-1 block text-center">Or paste external URL</span>
                                <input
                                    value={newPlant.imageUrl}
                                    onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-1.5 text-xs text-white outline-none text-center focus:border-emerald-500 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-widest z-10 opacity-70">
                            <Sparkles size={12} className="text-emerald-400" /> Live Preview
                        </div>
                    </div>

                    {/* --- RIGHT PANEL: FORM --- */}
                    <div className={styles.formPanel}>
                        <form onSubmit={handleAddPlant}>

                            {/* 1. Smart Search */}
                            <div className={styles.smartSearchWrapper}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <label className="text-sm text-emerald-500 font-bold uppercase tracking-wider">Quick Populator</label>
                                    {scientificNameSearch && (
                                        <button
                                            type="button"
                                            onClick={handleSmartFill}
                                            className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full uppercase font-bold tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                                        >
                                            Auto-Fill <ArrowRight size={12} />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        value={scientificNameSearch}
                                        onChange={(e) => setScientificNameSearch(e.target.value)}
                                        placeholder="Type a scientific name (e.g. Ocimum)..."
                                        className={styles.smartSearchInput}
                                    />
                                    <Search size={22} className={styles.smartSearchIcon} />
                                </div>
                            </div>

                            {/* 2. Primary Identity */}
                            <div className="mb-10">
                                <div className={styles.sectionTitle}>
                                    <Leaf size={18} /> Identity
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Common Name</label>
                                        <input
                                            value={newPlant.name}
                                            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Peace Lily"
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Scientific Name</label>
                                        <input
                                            value={newPlant.scientificName}
                                            onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                            className={`${styles.glassInput} italic`}
                                            placeholder="e.g. Spathiphyllum"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Description</label>
                                    <textarea
                                        value={newPlant.description}
                                        onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                        className={styles.glassTextarea}
                                        placeholder="Describe the plant's origin, care needs, and unique features..."
                                    />
                                </div>
                            </div>

                            {/* 3. Vital Metrics */}
                            <div className="mb-10">
                                <div className={styles.sectionTitle}>
                                    <Thermometer size={18} className="text-amber-500" /> Vital Metrics
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Environment Type</label>
                                        <select
                                            value={newPlant.type}
                                            onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                            className={styles.glassSelect}
                                        >
                                            <option value="indoor">Indoor</option>
                                            <option value="outdoor">Outdoor</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Base Price (₹)</label>
                                        <input
                                            type="number"
                                            value={newPlant.price}
                                            onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                            className={styles.glassInput}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Sunlight Control */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Sunlight Requirement</label>
                                    <div className={styles.segmentedControl}>
                                        {['low', 'medium', 'high', 'direct'].map(lvl => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setNewPlant({ ...newPlant, sunlight: lvl as any })}
                                                className={`${styles.segmentBtn} ${newPlant.sunlight === lvl ? styles.segmentBtnActive : ''}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sliders & Advanced */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                                <Droplets size={14} className="text-blue-400" /> Humidity
                                            </label>
                                            <span className="text-sm font-mono text-blue-400 font-bold">{newPlant.minHumidity}%</span>
                                        </div>
                                        <div className={styles.rangeWrapper}>
                                            <input
                                                type="range" min="0" max="100" step="10"
                                                value={newPlant.minHumidity}
                                                onChange={(e) => setNewPlant({ ...newPlant, minHumidity: Number(e.target.value) })}
                                                className={styles.rangeInput}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 mb-3">
                                            <Wind size={14} className="text-purple-400" /> Oxygen Output
                                        </label>
                                        <select
                                            value={newPlant.oxygenLevel}
                                            onChange={(e) => setNewPlant({ ...newPlant, oxygenLevel: e.target.value as any })}
                                            className={styles.glassSelect}
                                        >
                                            <option value="low">Low</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="high">High</option>
                                            <option value="very-high">Purifier (Very High)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Area */}
                            <div className="pt-8 border-t border-slate-700/50 flex justify-end">
                                <button type="submit" className={styles.submitBtn}>
                                    Register Specimen
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </AdminPageLayout>
    );
};
