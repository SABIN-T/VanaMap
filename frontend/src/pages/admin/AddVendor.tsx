import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Navigation, Store, CheckCircle, Globe } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { registerVendor } from '../../services/api';
import type { Vendor } from '../../types';
import styles from './AddVendor.module.css';

export const AddVendor = () => {
    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
        latitude: 28.61,
        longitude: 77.23,
        verified: true,
        address: '',
        name: ''
    });

    const handleSaveVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Onboarding Partner...");
        try {
            await registerVendor(newVendor);
            toast.success("Partner Onboarded Successfully", { id: tid, icon: '🤝' });
            setNewVendor({ latitude: 28.61, longitude: 77.23, verified: true, address: '', name: '' });
        } catch (err) {
            toast.error("Failed to register vendor", { id: tid });
        }
    };

    return (
        <AdminPageLayout title="Onboard Partner">
            <div className={styles.pageContainer}>

                <div className={styles.mainCard}>
                    <div className={styles.header}>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-500/20 rounded-full text-amber-500">
                                <Store size={40} />
                            </div>
                        </div>
                        <h1 className={styles.title}>Register New Vendor</h1>
                        <p className={styles.subtitle}>Add a verified garden center or nursery to the network.</p>
                    </div>

                    <form onSubmit={handleSaveVendor}>
                        {/* 1. Identity Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <CheckCircle size={16} /> Partner Identity
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Business Name</label>
                                <input
                                    className={styles.glassInput}
                                    value={newVendor.name || ''}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                    placeholder="e.g. Green Earth Nursery"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Location Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Globe size={16} /> Geographic Data
                            </div>

                            {/* Decorative Map Preview */}
                            <div className={styles.mapPreview} title="Map Preview (Visual Only)">
                                <div className={styles.mapPulse}></div>
                                <span className="mt-8 text-xs font-bold uppercase tracking-widest">
                                    Simulated Location Source
                                </span>
                                <span className="font-mono text-xs text-slate-500 mt-1">
                                    {newVendor.latitude?.toFixed(4)}, {newVendor.longitude?.toFixed(4)}
                                </span>
                            </div>

                            <div className={styles.coordGrid}>
                                <div>
                                    <label className={styles.label}>Latitude</label>
                                    <input
                                        className={styles.glassInput}
                                        type="number"
                                        step="any"
                                        value={newVendor.latitude || ''}
                                        onChange={e => setNewVendor({ ...newVendor, latitude: Number(e.target.value) })}
                                        placeholder="28.61"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Longitude</label>
                                    <input
                                        className={styles.glassInput}
                                        type="number"
                                        step="any"
                                        value={newVendor.longitude || ''}
                                        onChange={e => setNewVendor({ ...newVendor, longitude: Number(e.target.value) })}
                                        placeholder="77.23"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Address Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Navigation size={16} /> Physical Address
                            </div>

                            <div>
                                <label className={styles.label}>Full Street Address</label>
                                <textarea
                                    className={styles.glassTextarea}
                                    value={newVendor.address || ''}
                                    onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                                    placeholder="Enter the complete address for navigation purposes..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button type="submit" className={styles.submitBtn}>
                                <MapPin size={20} />
                                Confirm Registration
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AdminPageLayout>
    );
};
