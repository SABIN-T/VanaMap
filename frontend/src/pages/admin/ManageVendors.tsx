import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Store, CheckCircle, Star, Trash2 } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { fetchVendors, updateVendor, deleteVendor } from '../../services/api';
import type { Vendor } from '../../types';

export const ManageVendors = () => {
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);

    useEffect(() => { loadVendors(); }, []);

    const loadVendors = async () => {
        const data = await fetchVendors();
        setAllVendors(data);
    };

    const toggleVerification = async (v: Vendor) => {
        const newStatus = !v.verified;
        try {
            await updateVendor(v.id, { verified: newStatus });
            toast.success(newStatus ? "Approved!" : "Revoked");
            loadVendors();
        } catch (e) { toast.error("Update failed"); }
    };

    const toggleRecommendation = async (v: Vendor) => {
        const newStatus = !v.highlyRecommended;
        try {
            await updateVendor(v.id, { highlyRecommended: newStatus });
            toast.success(newStatus ? "Promoted!" : "Demoted");
            loadVendors();
        } catch (e) { toast.error("Update failed"); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Permanently delete?")) return;
        try {
            await deleteVendor(id);
            toast.success("Deleted");
            loadVendors();
        } catch (e) { toast.error("Deletion failed"); }
    };

    return (
        <AdminPageLayout title="Vendor Network Management">
            <div className="space-y-4">
                {allVendors.map(vendor => (
                    <div key={vendor.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800/60 transition-colors">
                        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                            <div className={`p-4 rounded-xl ${vendor.verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <Store size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-white text-xl">{vendor.name}</h3>
                                    {vendor.verified && <CheckCircle size={18} className="text-emerald-500" fill="currentColor" />}
                                    {vendor.highlyRecommended && <Star size={18} className="text-yellow-400" fill="currentColor" />}
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{vendor.address || "No address provided"}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide ${vendor.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        {vendor.verified ? 'VERIFIED PARTNER' : 'PENDING APPROVAL'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button size="sm" variant="outline" onClick={() => toggleVerification(vendor)} className={`flex-1 md:flex-none ${vendor.verified ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                                {vendor.verified ? 'Revoke' : 'Approve'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleRecommendation(vendor)} className={`flex-1 md:flex-none ${vendor.highlyRecommended ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}>
                                <Star size={18} fill={vendor.highlyRecommended ? "currentColor" : "none"} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(vendor.id)} className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminPageLayout>
    );
};
