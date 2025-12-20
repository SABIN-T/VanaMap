import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant } from '../../services/api';
import { AdminPageLayout } from './AdminPageLayout';
import { Search, Upload, Thermometer, Sun, DollarSign, Leaf, Type, Sprout, Monitor, Link as LinkIcon, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';

// Helper for 'Smart Fill'
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

// Helper: Compress Image to Base64
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

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                // Compress to JPEG 0.7
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export const AddPlant = () => {
    const [scientificNameSearch, setScientificNameSearch] = useState('');
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

    // Initial state matching Plant interface
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
            toast.success(`Found: ${found.name}!`, { icon: '🌿' });
        } else {
            toast.error("Species not found in database.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const tid = toast.loading("Processing Image...");
        try {
            const compressedBase64 = await compressImage(file);
            setNewPlant({ ...newPlant, imageUrl: compressedBase64 });
            toast.success("Image Uploaded & Ready!", { id: tid });
        } catch (err) {
            toast.error("Failed to process image", { id: tid });
            console.error(err);
        }
    };

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Adding to Registry...");
        try {
            const plantData: Plant = {
                id: crypto.randomUUID(),
                name: newPlant.name || 'Unknown Plant',
                scientificName: newPlant.scientificName || 'Unknown',
                description: newPlant.description || 'No description available.',
                imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop',
                price: Number(newPlant.price),
                type: newPlant.type as 'indoor' | 'outdoor' || 'indoor',
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
            toast.success("Specimen Registered Successfully", { id: tid });

            // Reset
            setNewPlant({
                name: '', scientificName: '', imageUrl: '', price: 0,
                type: 'indoor', sunlight: 'medium', description: '',
                idealTempMin: 18, idealTempMax: 30, minHumidity: 40,
                oxygenLevel: 'high', medicinalValues: [], advantages: []
            });
            setScientificNameSearch('');
        } catch (err) {
            console.error(err);
            toast.error("Registration Failed", { id: tid });
        }
    };

    return (
        <AdminPageLayout title="New Specimen Entry">
            <div className="max-w-5xl mx-auto">
                {/* Smart Fill Section */}
                <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20">
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                <Sprout size={14} /> AI Smart Fill
                            </label>
                            <div className="relative group">
                                <input
                                    value={scientificNameSearch}
                                    onChange={(e) => setScientificNameSearch(e.target.value)}
                                    placeholder="Enter Scientific Name (e.g. Ocimum tenuiflorum)..."
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none group-hover:bg-slate-800/80"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-emerald-400 transition-colors" size={20} />
                            </div>
                        </div>
                        <Button onClick={handleSmartFill} className="h-14 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 w-full md:w-auto font-bold tracking-wide">
                            Auto-Fill Details
                        </Button>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <form onSubmit={handleAddPlant} className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                        {/* LEFT COLUMN: Core Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                                <Leaf className="text-emerald-400" size={20} /> Core Identification
                            </h3>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Common Name</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            value={newPlant.name}
                                            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                            placeholder="e.g. Holy Basil"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white hover:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Scientific Name</label>
                                    <div className="relative">
                                        <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            value={newPlant.scientificName}
                                            onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                            placeholder="e.g. Ocimum tenuiflorum"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white italic hover:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Description</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <textarea
                                            value={newPlant.description}
                                            onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                            placeholder="Brief description of the plant..."
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white hover:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none min-h-[100px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Category</label>
                                        <select
                                            value={newPlant.type}
                                            onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 px-4 text-white hover:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none appearance-none"
                                        >
                                            <option value="indoor">🏠 Indoor</option>
                                            <option value="outdoor">🌳 Outdoor</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Price (₹)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                                            <input
                                                type="number"
                                                value={newPlant.price}
                                                onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                                placeholder="500"
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white font-mono hover:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Bio Specs & Image */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                                <Sun className="text-amber-400" size={20} /> Bio-Requirements
                            </h3>

                            <div className="group relative">
                                <label className="text-xs text-slate-400 font-bold uppercase mb-2 ml-1 block flex justify-between">
                                    <span>Visual Reference</span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setUploadMode('file')} className={`text-[10px] px-2 py-0.5 rounded-full border ${uploadMode === 'file' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}`}>Upload</button>
                                        <button type="button" onClick={() => setUploadMode('url')} className={`text-[10px] px-2 py-0.5 rounded-full border ${uploadMode === 'url' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}`}>URL</button>
                                    </div>
                                </label>
                                <div className={`h-48 rounded-2xl border-2 border-dashed ${newPlant.imageUrl ? 'border-emerald-500/50 bg-slate-950' : 'border-slate-700 bg-slate-800/30'} flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:border-slate-500`}>
                                    {newPlant.imageUrl ? (
                                        <>
                                            <img src={newPlant.imageUrl} className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" alt="Plant Preview" />
                                            <button
                                                type="button"
                                                onClick={() => setNewPlant({ ...newPlant, imageUrl: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors z-20"
                                            >
                                                <Monitor size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            {uploadMode === 'file' ? (
                                                <>
                                                    <Upload className="mx-auto text-emerald-500 mb-2 animate-bounce" size={32} />
                                                    <p className="text-xs text-slate-400 font-bold">Click to Upload Image</p>
                                                    <p className="text-[10px] text-slate-600 mt-1">Supports JPG, PNG (Max 5MB)</p>
                                                </>
                                            ) : (
                                                <>
                                                    <LinkIcon className="mx-auto text-slate-600 mb-2" size={32} />
                                                    <p className="text-xs text-slate-500">Paste Image URL below</p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Invisible File Input Overlay */}
                                    {uploadMode === 'file' && !newPlant.imageUrl && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    )}
                                </div>

                                {uploadMode === 'url' && (
                                    <div className="mt-4 relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            value={newPlant.imageUrl}
                                            onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-xs text-slate-300 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block">Sunlight</label>
                                    <div className="flex bg-slate-950/50 border border-slate-700 rounded-xl p-1">
                                        {['low', 'medium', 'high'].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setNewPlant({ ...newPlant, sunlight: level as any })}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${newPlant.sunlight === level ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1 block flex items-center gap-1"><Thermometer size={12} /> Temp Range (°C)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={newPlant.idealTempMin}
                                            onChange={(e) => setNewPlant({ ...newPlant, idealTempMin: Number(e.target.value) })}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 text-center text-white hover:border-slate-600 focus:border-blue-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={newPlant.idealTempMax}
                                            onChange={(e) => setNewPlant({ ...newPlant, idealTempMax: Number(e.target.value) })}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 text-center text-white hover:border-slate-600 focus:border-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="col-span-1 lg:col-span-2 pt-6 border-t border-slate-800 flex justify-end">
                            <Button type="submit" variant="primary" className="h-14 px-12 text-lg font-bold shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform bg-gradient-to-r from-emerald-500 to-green-600">
                                Register Specimen
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPageLayout>
    );
};
