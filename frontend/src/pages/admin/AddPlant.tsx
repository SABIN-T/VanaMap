import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant } from '../../services/api';
import { AdminPageLayout } from './AdminPageLayout';
import { Search, Upload, Thermometer, Sun, Leaf, Sprout, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';

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

    return (
        <AdminPageLayout title="New Specimen Entry">
            <div className="w-full space-y-6">

                {/* 1. Smart Fill Bar */}
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold whitespace-nowrap">
                        <Sprout size={20} />
                        <span>AI Smart Fill</span>
                    </div>
                    <div className="flex-1 w-full relative">
                        <input
                            value={scientificNameSearch}
                            onChange={(e) => setScientificNameSearch(e.target.value)}
                            placeholder="Type scientific name to auto-complete (e.g. Ocimum)..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    </div>
                    <Button onClick={handleSmartFill} className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-emerald-900/20">
                        Auto-Fill
                    </Button>
                </div>

                <form onSubmit={handleAddPlant} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                    {/* LEFT COLUMN (Media & Quick Stats) - Span 4 */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Image Upload */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm hover:border-slate-600 transition-colors">
                            <h3 className="text-white font-bold mb-4 flex justify-between items-center">
                                <span>Plant Image</span>
                                <div className="flex bg-slate-900 rounded-md p-0.5">
                                    <button type="button" onClick={() => setUploadMode('file')} className={`px-3 py-1 text-[10px] rounded hover:text-white transition ${uploadMode === 'file' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Upload</button>
                                    <button type="button" onClick={() => setUploadMode('url')} className={`px-3 py-1 text-[10px] rounded hover:text-white transition ${uploadMode === 'url' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>URL</button>
                                </div>
                            </h3>

                            <div className="aspect-square bg-slate-900 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                                {newPlant.imageUrl ? (
                                    <>
                                        <img src={newPlant.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setNewPlant({ ...newPlant, imageUrl: '' })}
                                            className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <AlertCircle size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        {uploadMode === 'file' ? (
                                            <>
                                                <Upload className="mx-auto text-emerald-500 mb-3" size={32} />
                                                <span className="text-sm text-slate-400 block font-medium">Click to Upload</span>
                                                <span className="text-xs text-slate-600">JPG/PNG max 5MB</span>
                                            </>
                                        ) : (
                                            <>
                                                <LinkIcon className="mx-auto text-blue-500 mb-3" size={32} />
                                                <span className="text-sm text-slate-400">Paste URL Below</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {uploadMode === 'file' && (
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                )}
                            </div>

                            {uploadMode === 'url' && (
                                <input
                                    value={newPlant.imageUrl}
                                    onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="mt-3 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:border-blue-500 outline-none"
                                />
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Classification</h3>

                            <div>
                                <label className="text-sm text-slate-300 block mb-1.5">Category</label>
                                <select
                                    value={newPlant.type}
                                    onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                >
                                    <option value="indoor">🏠 Indoor Specimen</option>
                                    <option value="outdoor">🌳 Outdoor Specimen</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-300 block mb-1.5">Market Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                    <input
                                        type="number"
                                        value={newPlant.price}
                                        onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-3 text-white font-mono focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-900/40">
                            Register Specimen
                        </Button>
                    </div>

                    {/* RIGHT COLUMN (Main Details) - Span 8 */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Leaf size={20} className="text-emerald-400" /> Identification
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Common Name</label>
                                    <input
                                        value={newPlant.name}
                                        onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                                        placeholder="e.g. Aloe Vera"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Scientific Name</label>
                                    <input
                                        value={newPlant.scientificName}
                                        onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white italic focus:border-emerald-500 outline-none placeholder:text-slate-600"
                                        placeholder="e.g. Aloe barbadensis miller"
                                        required
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                                    <textarea
                                        value={newPlant.description}
                                        onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-emerald-500 outline-none resize-none placeholder:text-slate-600"
                                        placeholder="Detailed plant description..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Environment */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Sun size={20} className="text-amber-400" /> Environment
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase block">Sunlight Requirement</label>
                                    <div className="flex flex-col gap-2">
                                        {['low', 'medium', 'high', 'direct'].map((lvl) => (
                                            <label key={lvl} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newPlant.sunlight === lvl ? 'bg-amber-500/20 border-amber-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                                <input
                                                    type="radio"
                                                    name="sunlight"
                                                    checked={newPlant.sunlight === lvl}
                                                    onChange={() => setNewPlant({ ...newPlant, sunlight: lvl as any })}
                                                    className="w-4 h-4 accent-amber-500"
                                                />
                                                <span className="capitalize font-medium">{lvl} Light</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                                <Thermometer size={14} /> Min Temp (°C)
                                            </label>
                                            <input
                                                type="number"
                                                value={newPlant.idealTempMin}
                                                onChange={(e) => setNewPlant({ ...newPlant, idealTempMin: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-center font-mono focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                                <Thermometer size={14} /> Max Temp (°C)
                                            </label>
                                            <input
                                                type="number"
                                                value={newPlant.idealTempMax}
                                                onChange={(e) => setNewPlant({ ...newPlant, idealTempMax: Number(e.target.value) })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-center font-mono focus:border-red-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                            Min Humidity (%) - Current: <span className="text-blue-400">{newPlant.minHumidity}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0" max="100" // Correction: max 100
                                            step="5"
                                            value={newPlant.minHumidity}
                                            onChange={(e) => setNewPlant({ ...newPlant, minHumidity: Number(e.target.value) })}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Dry (0%)</span>
                                            <span>Moderate (50%)</span>
                                            <span>Tropical (100%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AdminPageLayout>
    );
};
