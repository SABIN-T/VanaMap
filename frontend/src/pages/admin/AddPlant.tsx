import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant } from '../../services/api';
import { AdminPageLayout } from './AdminPageLayout';
import { Search, Upload, Thermometer, Sun, Leaf, Sprout, Link as LinkIcon, Wind, Droplets } from 'lucide-react';
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
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

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
            toast.success(`Match Found: ${found.name}`, { icon: '✨' });
        } else {
            toast.error("No match found in local database.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tid = toast.loading("Optimizing Image...");
        try {
            const compressedBase64 = await compressImage(file);
            setNewPlant({ ...newPlant, imageUrl: compressedBase64 });
            toast.success("Image Ready", { id: tid });
        } catch (err) {
            toast.error("Image Error", { id: tid });
        }
    };

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Adding Specimen...");
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
            toast.success("Successfully Registered", { id: tid });

            // Reset
            setNewPlant({
                name: '', scientificName: '', imageUrl: '', price: 0,
                type: 'indoor', sunlight: 'medium', description: '',
                idealTempMin: 18, idealTempMax: 30, minHumidity: 40,
                oxygenLevel: 'high', medicinalValues: [], advantages: []
            });
            setScientificNameSearch('');
        } catch (err) {
            toast.error("Failed to add plant", { id: tid });
        }
    };

    // Construct Preview Object
    const previewPlant: Plant = {
        id: 'preview',
        name: newPlant.name || 'Plant Name',
        scientificName: newPlant.scientificName || 'Scientific Name',
        description: newPlant.description || 'Description...',
        imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop',
        price: Number(newPlant.price),
        type: newPlant.type as any || 'indoor',
        sunlight: newPlant.sunlight as any || 'medium',
        idealTempMin: 18, idealTempMax: 30,
        minHumidity: Number(newPlant.minHumidity),
        oxygenLevel: newPlant.oxygenLevel as any || 'moderate',
        medicinalValues: [],
        advantages: [],
        isNocturnal: false
    };

    return (
        <AdminPageLayout title="Add New Specimen">
            <div className="w-full">

                {/* Workflow Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

                    {/* LEFT COLUMN: LIVE PREVIEW & ASSETS (Sticky) - Span 4 */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Leaf size={14} className="text-emerald-400" /> Live Preview
                            </h3>

                            {/* Card Preview Wrapper - Pointer events disabled to prevent clicking "Add to Cart" */}
                            <div className="pointer-events-none transform transition-all duration-500">
                                <PlantCard plant={previewPlant} onAdd={() => { }} />
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-300 uppercase">Cover Image</label>
                                    <div className="flex bg-slate-900 rounded-md p-0.5 border border-slate-700">
                                        <button type="button" onClick={() => setUploadMode('file')} className={`px-2 py-0.5 text-[10px] rounded transition ${uploadMode === 'file' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}>Upload</button>
                                        <button type="button" onClick={() => setUploadMode('url')} className={`px-2 py-0.5 text-[10px] rounded transition ${uploadMode === 'url' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}>URL</button>
                                    </div>
                                </div>

                                {uploadMode === 'file' ? (
                                    <div className="relative group w-full">
                                        <div className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 border border-slate-700 border-dashed rounded-xl hover:border-emerald-500 hover:bg-slate-800/80 transition-all cursor-pointer">
                                            <Upload size={16} className="text-emerald-400" />
                                            <span className="text-xs font-medium text-slate-300">Choose File</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                        <input
                                            value={newPlant.imageUrl}
                                            onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                                            placeholder="Paste Image URL..."
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DATA ENTRY - Span 8 */}
                    <form onSubmit={handleAddPlant} className="lg:col-span-8 space-y-8">

                        {/* 1. Smart Fill */}
                        <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-1 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-5 relative flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 block">Quick Start</label>
                                    <div className="relative">
                                        <input
                                            value={scientificNameSearch}
                                            onChange={(e) => setScientificNameSearch(e.target.value)}
                                            placeholder="Enter Scientific Name (e.g. Ocimum)..."
                                            className="w-full bg-transparent border-b border-slate-600 py-2 pl-8 pr-4 text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none transition-colors"
                                        />
                                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    </div>
                                </div>
                                <Button type="button" onClick={handleSmartFill} size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 border-0">
                                    <Sprout size={16} className="mr-2" /> Auto-Fill Data
                                </Button>
                            </div>
                        </div>

                        {/* 2. Core Info */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-300"><Leaf size={18} /></div>
                                <span>Identification</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-800/30 border border-slate-800 rounded-2xl p-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Common Name</label>
                                    <input
                                        value={newPlant.name}
                                        onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                                        placeholder="e.g. Snake Plant"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Scientific Name</label>
                                    <input
                                        value={newPlant.scientificName}
                                        onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white italic focus:border-emerald-500 outline-none transition-all "
                                        placeholder="e.g. Sansevieria trifasciata"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Marketing Description</label>
                                    <textarea
                                        value={newPlant.description}
                                        onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all min-h-[120px]"
                                        placeholder="Describe the plant's key features..."
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
                                    <select
                                        value={newPlant.type}
                                        onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none appearance-none"
                                    >
                                        <option value="indoor">🏠 Indoor</option>
                                        <option value="outdoor">🌳 Outdoor</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={newPlant.price}
                                        onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:border-emerald-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 3. Environment */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700 text-amber-400"><Sun size={18} /></div>
                                <span>Bio-Requirements</span>
                            </h2>
                            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 space-y-6">
                                {/* Sunlight */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase block">Sunlight Intensity</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['low', 'medium', 'high', 'direct'].map((lvl) => (
                                            <label key={lvl} className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${newPlant.sunlight === lvl ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                                                <input type="radio" name="sunlight" checked={newPlant.sunlight === lvl} onChange={() => setNewPlant({ ...newPlant, sunlight: lvl as any })} className="sr-only" />
                                                <Sun size={20} className={newPlant.sunlight === lvl ? 'fill-amber-500/20' : ''} />
                                                <span className="text-[10px] font-bold uppercase mt-2">{lvl}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Temp & Oxygen */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                            <Thermometer size={14} /> Ideal Temp Range (°C)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={newPlant.idealTempMin} onChange={(e) => setNewPlant({ ...newPlant, idealTempMin: Number(e.target.value) })} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-center text-white focus:border-blue-500 outline-none" />
                                            <span className="text-slate-600">-</span>
                                            <input type="number" value={newPlant.idealTempMax} onChange={(e) => setNewPlant({ ...newPlant, idealTempMax: Number(e.target.value) })} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-center text-white focus:border-red-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                            <Wind size={14} /> Oxygen Output
                                        </label>
                                        <select value={newPlant.oxygenLevel} onChange={(e) => setNewPlant({ ...newPlant, oxygenLevel: e.target.value as any })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
                                            <option value="low">Low</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="high">High</option>
                                            <option value="very-high">Purifier Grade (Very High)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Humidity */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                                        <span className="flex items-center gap-2"><Droplets size={14} /> Humidity Needs</span>
                                        <span className="text-blue-400">{newPlant.minHumidity}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        step="5"
                                        value={newPlant.minHumidity}
                                        onChange={(e) => setNewPlant({ ...newPlant, minHumidity: Number(e.target.value) })}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Submit Action */}
                        <div className="pt-4 flex justify-end">
                            <Button type="submit" variant="primary" className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 shadow-xl shadow-emerald-900/40 rounded-xl transition-all">
                                Register Specimen
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPageLayout>
    );
};
