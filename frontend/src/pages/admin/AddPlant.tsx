import { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant } from '../../services/api';
import { AdminPageLayout } from './AdminPageLayout';
import { Search, Upload, Thermometer, Wind, Droplets, Leaf, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';
import { PlantCard } from '../../components/features/plants/PlantCard';

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
        name: newPlant.name || 'Specimen Name',
        scientificName: newPlant.scientificName || 'Scientific Name',
        description: newPlant.description || '...',
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
            <div className="-m-6 flex flex-col lg:flex-row min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden">
                {/* --- LEFT PANEL: VISUAL & PREVIEW (40%) --- */}
                <div className="relative w-full lg:w-2/5 bg-slate-950 border-r border-slate-800 flex flex-col items-center justify-center p-8 overflow-hidden group">
                    {/* Blurred Background */}
                    <div
                        className="absolute inset-0 opacity-30 blur-3xl scale-125 transition-all duration-1000"
                        style={{
                            backgroundImage: `url(${newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    ></div>

                    {/* The Card */}
                    <div className="relative z-10 scale-100 transition-transform duration-300">
                        <PlantCard plant={previewPlant} onAdd={() => { }} />
                    </div>

                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-sm">
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-black hover:bg-slate-200"
                        >
                            <Upload size={18} className="mr-2" /> Upload Image
                        </Button>
                        <span className="text-xs text-slate-400 font-medium">Or paste URL below</span>
                        <input
                            value={newPlant.imageUrl}
                            onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                            placeholder="https://image-url.com..."
                            className="bg-black/50 border border-white/20 rounded px-3 py-1 text-xs text-white outline-none w-64 text-center"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="absolute bottom-6 text-slate-500 text-xs font-mono uppercase tracking-widest z-10">
                        Live Preview Mode
                    </div>
                </div>

                {/* --- RIGHT PANEL: FORM (60%) --- */}
                <div className="w-full lg:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-[800px]">
                    <form onSubmit={handleAddPlant} className="max-w-xl mx-auto space-y-10">

                        {/* 1. SMART SEARCH */}
                        <div className="relative">
                            <input
                                value={scientificNameSearch}
                                onChange={(e) => setScientificNameSearch(e.target.value)}
                                placeholder="Search DB to auto-fill (e.g. Ocimum)..."
                                className="w-full bg-transparent text-2xl font-light text-white placeholder:text-slate-600 border-b border-slate-700 py-4 focus:border-emerald-500 outline-none transition-colors"
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {scientificNameSearch && (
                                    <button
                                        type="button"
                                        onClick={handleSmartFill}
                                        className="text-emerald-400 text-xs font-bold uppercase tracking-wider hover:text-emerald-300 transition-colors flex items-center gap-1"
                                    >
                                        Auto-Fill <ArrowRight size={12} />
                                    </button>
                                )}
                                <Search size={20} className="text-slate-600" />
                            </div>
                        </div>

                        {/* 2. IDENTITY */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                <Leaf size={20} /> <span className="text-sm font-bold uppercase tracking-widest">Identity</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-semibold uppercase">Common Name</label>
                                    <input
                                        value={newPlant.name}
                                        onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Plant Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-semibold uppercase">Scientific Name</label>
                                    <input
                                        value={newPlant.scientificName}
                                        onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white italic focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Latin Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-semibold uppercase">Description</label>
                                <textarea
                                    value={newPlant.description}
                                    onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                    className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
                                    placeholder="Story about this plant..."
                                />
                            </div>
                        </div>

                        {/* 3. METRICS */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-amber-500 mb-2">
                                <Thermometer size={20} /> <span className="text-sm font-bold uppercase tracking-widest">Metrics</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-semibold uppercase">Category</label>
                                    <select
                                        value={newPlant.type}
                                        onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer"
                                    >
                                        <option value="indoor">Indoor</option>
                                        <option value="outdoor">Outdoor</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-semibold uppercase">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={newPlant.price}
                                        onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                            </div>

                            {/* Sunlight Segmented Control */}
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Sunlight</label>
                                <div className="flex bg-slate-800 rounded-lg p-1">
                                    {['low', 'medium', 'high', 'direct'].map(lvl => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setNewPlant({ ...newPlant, sunlight: lvl as any })}
                                            className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${newPlant.sunlight === lvl ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sliders & Oxygen */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2"><Droplets size={14} /> Humidity</label>
                                        <span className="text-xs font-mono text-blue-400">{newPlant.minHumidity}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="10"
                                        value={newPlant.minHumidity}
                                        onChange={(e) => setNewPlant({ ...newPlant, minHumidity: Number(e.target.value) })}
                                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2"><Wind size={14} /> Oxygen</label>
                                    <select
                                        value={newPlant.oxygenLevel}
                                        onChange={(e) => setNewPlant({ ...newPlant, oxygenLevel: e.target.value as any })}
                                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                        <option value="very-high">Purifier (Very High)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <div className="pt-8 border-t border-slate-800 flex justify-end">
                            <Button
                                type="submit"
                                className="px-8 py-3 bg-white text-black font-bold text-sm tracking-widest hover:bg-slate-200 transition-colors uppercase rounded-none border border-white"
                            >
                                Publish Specimen
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminPageLayout>
    );
};
