import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { registerVendor } from '../../services/api';
import type { Vendor } from '../../types';

export const AddVendor = () => {
    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
        latitude: 28.61, longitude: 77.23, verified: true
    });

    const handleSaveVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Onboarding Partner...");
        try {
            await registerVendor(newVendor);
            toast.success("Partner Onboarded", { id: tid });
            setNewVendor({ latitude: 28.61, longitude: 77.23, verified: true });
        } catch (err) {
            toast.error("Failed to add vendor", { id: tid });
        }
    };

    return (
        <AdminPageLayout title="Onboard New Partner">
            <form onSubmit={handleSaveVendor} className="space-y-8 max-w-2xl mx-auto">
                <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Vendor Name</label>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 outline-none" required value={newVendor.name || ''} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} placeholder="e.g. Green Earth Nursery" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold ml-1">Latitude</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white font-mono" value={newVendor.latitude || ''} onChange={e => setNewVendor({ ...newVendor, latitude: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold ml-1">Longitude</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white font-mono" value={newVendor.longitude || ''} onChange={e => setNewVendor({ ...newVendor, longitude: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold ml-1">Full Address</label>
                            <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white h-32 resize-none focus:ring-2 focus:ring-amber-500 outline-none" required value={newVendor.address || ''} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} placeholder="Complete street address..." />
                        </div>

                        <div className="pt-4">
                            <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 text-lg">
                                <MapPin className="mr-2" /> Register Vendor
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminPageLayout>
    );
};
