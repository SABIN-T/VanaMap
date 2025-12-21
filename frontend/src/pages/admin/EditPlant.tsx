import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ChevronLeft, Save, Image as ImageIcon, Sparkles,
    Thermometer, Droplets
} from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { fetchPlants, updatePlant } from '../../services/api';
import type { Plant } from '../../types';
import styles from './EditPlant.module.css';

export const EditPlant = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [plant, setPlant] = useState<Partial<Plant>>({});

    useEffect(() => {
        const loadPlantData = async () => {
            if (!id) return;
            try {
                const plants = await fetchPlants();
                const found = plants.find(p => p.id === id);
                if (found) {
                    setPlant(found);
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

    if (loading) {
        return (
            <AdminPageLayout title="Specimen Analysis">
                <div className="flex items-center justify-center p-20 text-slate-400">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <Sparkles size={48} className="text-blue-500 animate-spin" />
                        <p className="font-bold tracking-widest text-sm uppercase">Accessing Flora Database...</p>
                    </div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout title="Modify Specimen">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Base Price (₹)</label>
                                <input
                                    type="number"
                                    className={styles.glassInput}
                                    value={plant.price || ''}
                                    onChange={e => setPlant({ ...plant, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Category</label>
                                <select
                                    className={styles.glassInput}
                                    value={plant.type || 'indoor'}
                                    onChange={e => setPlant({ ...plant, type: e.target.value as any })}
                                >
                                    <option value="indoor">Indoor (Lab)</option>
                                    <option value="outdoor">Outdoor (Natural)</option>
                                </select>
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
                            <label className={styles.label}>Asset URL</label>
                            <input
                                className={styles.glassInput}
                                value={plant.imageUrl || ''}
                                onChange={e => setPlant({ ...plant, imageUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className={styles.imageSection}>
                        <label className={styles.label}>Live Preview</label>
                        <div className={styles.previewCard}>
                            {plant.imageUrl ? (
                                <img src={plant.imageUrl} className={styles.previewImage} alt="Preview" />
                            ) : (
                                <div className={styles.noImage}>
                                    <ImageIcon size={64} />
                                    <p className="text-sm font-bold opacity-30">NO ASSET FOUND</p>
                                </div>
                            )}
                            <div className={styles.badge}>{plant.type}</div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3 opacity-50">
                            <div className="p-3 border border-slate-800 rounded-lg flex items-center gap-3">
                                <Thermometer size={16} /> <span className="text-xs">Temp Sensor</span>
                            </div>
                            <div className="p-3 border border-slate-800 rounded-lg flex items-center gap-3">
                                <Droplets size={16} /> <span className="text-xs">Hydrometry</span>
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
        </AdminPageLayout>
    );
};
