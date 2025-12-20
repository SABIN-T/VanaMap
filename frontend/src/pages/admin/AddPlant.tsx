import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Sprout, Search, X, Image as ImageIcon } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { addPlant } from '../../services/api';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';

export const AddPlant = () => {
    const [newPlant, setNewPlant] = useState<Partial<Plant>>({
        price: 500, idealTempMin: 18, idealTempMax: 30, minHumidity: 50,
        sunlight: 'medium', oxygenLevel: 'moderate', type: 'indoor',
        medicinalValues: [], advantages: [], isNocturnal: false
    });

    const handleSavePlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Adding to Registry...");
        try {
            await addPlant({
                ...newPlant,
                id: newPlant.name?.toLowerCase().replace(/\s+/g, '-') || `plant-${Date.now()}`,
                price: Number(newPlant.price)
            } as Plant);
            toast.success("Plant Added Successfully", { id: tid });
            setNewPlant({
                price: 500, idealTempMin: 18, idealTempMax: 30, minHumidity: 50,
                sunlight: 'medium', oxygenLevel: 'moderate', type: 'indoor',
                medicinalValues: [], advantages: [], isNocturnal: false
            });
        } catch (err) {
            toast.error("Failed to add plant", { id: tid });
        }
    };

    const smartFillPlant = () => {
        if (!newPlant.scientificName) return toast.error("Enter Scientific Name");
        const match = Object.values(INDIAN_PLANT_DB).find(p => (p as any).scientificName?.toLowerCase() === newPlant.scientificName?.toLowerCase());
        if (match) {
            setNewPlant(prev => ({ ...prev, ...match }));
            toast.success("Data Auto-Filled");
        } else {
            toast.error("Not found in database");
        }
    };

    return (
        <AdminPageLayout title="Add New Plant Species">
            <form onSubmit={handleSavePlant} className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Smart Fill</label>
                        <Sprout className="text-emerald-500/50" />
                    </div>
                    <div className="flex gap-4">
                        <input className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter Scientific Name (e.g. Ocimum tenuiflorum)" value={newPlant.scientificName || ''} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
                        <Button type="button" onClick={smartFillPlant} className="px-6 bg-emerald-600 hover:bg-emerald-500"><Search size={20} /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Common Name</label>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-lg font-medium focus:ring-2 focus:ring-indigo-500 outline-none" required value={newPlant.name || ''} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} placeholder="e.g. Holy Basil" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Plant Image</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[240px] bg-slate-900/50 relative group transition hover:border-slate-500">
                                {newPlant.imageUrl ? (
                                    <>
                                        <img src={newPlant.imageUrl} alt="Preview" className="w-full h-56 object-cover rounded-xl shadow-lg" />
                                        <button type="button" onClick={() => setNewPlant({ ...newPlant, imageUrl: '' })} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-red-500 text-white transition-colors backdrop-blur-sm"><X size={18} /></button>
                                    </>
                                ) : (
                                    <div className="text-center text-slate-500">
                                        <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
                                        <span className="text-sm font-medium">Enter Image URL below</span>
                                    </div>
                                )}
                            </div>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." value={newPlant.imageUrl || ''} onChange={e => setNewPlant({ ...newPlant, imageUrl: e.target.value })} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold ml-1">Price (₹)</label>
                                <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white font-mono focus:ring-2 focus:ring-indigo-500 outline-none" value={newPlant.price || ''} onChange={e => setNewPlant({ ...newPlant, price: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold ml-1">Category</label>
                                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none" value={newPlant.type || 'indoor'} onChange={e => setNewPlant({ ...newPlant, type: e.target.value as any })}>
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                    <option value="flower">Flowering</option>
                                    <option value="fruit">Fruit Bearing</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Sunlight Requirement</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['low', 'medium', 'high'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setNewPlant({ ...newPlant, sunlight: level as any })}
                                        className={`p-3 rounded-lg border capitalize text-sm font-medium transition ${newPlant.sunlight === level ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Temperature Range (°C)</label>
                            <div className="flex items-center gap-4">
                                <input type="number" placeholder="Min" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-center" value={newPlant.idealTempMin || ''} onChange={e => setNewPlant({ ...newPlant, idealTempMin: Number(e.target.value) })} />
                                <span className="text-slate-500">-</span>
                                <input type="number" placeholder="Max" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-center" value={newPlant.idealTempMax || ''} onChange={e => setNewPlant({ ...newPlant, idealTempMax: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-900/20 text-lg transition transform hover:scale-[1.01]">
                        Save Plant to Registry
                    </Button>
                </div>
            </form>
        </AdminPageLayout>
    );
};
