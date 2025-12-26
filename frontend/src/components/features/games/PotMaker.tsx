import { useState, useRef } from 'react';
import { Upload, Camera, Save, ShoppingCart, Layers, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './PotMaker.module.css';

interface PotMakerProps {
    onBack: () => void;
}

export const PotMaker = ({ onBack }: PotMakerProps) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveDesign = async (saveOnly: boolean = false) => {
        if (!uploadedImage) {
            toast.error("Upload an image first!");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to save designs");
                return;
            }

            const res = await fetch('http://localhost:5000/api/user/designs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl: uploadedImage })
            });

            if (res.ok) {
                toast.success(saveOnly ? "Design saved to your profile!" : "Coming Soon: Buying Feature!");

                if (!saveOnly) {
                    toast("Design has been saved for future purchase.", { icon: '💾' });
                }
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error(error);
            toast.error("Couldn't save design");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}
                >
                    &larr; Back to Menu
                </button>
                <h2 className={styles.title}>
                    <Layers color="#10b981" /> 3D Pot Designer
                </h2>
                <p className={styles.subtitle}>Upload your art and see it come to life on a premium ceramic pot.</p>
            </div>

            <div className={styles.workspace}>
                {/* 3D Viewer Area */}
                <div className={styles.previewArea}>
                    <div className={styles.potContainer}>
                        {/* Base Pot Layer */}
                        <img
                            src="/pot-base.png"
                            alt="3D Pot"
                            className={styles.potBase}
                        />

                        {/* User Design Overlay - Masked to Pot Shape */}
                        {uploadedImage && (
                            <div className={styles.designOverlay} style={{ backgroundImage: `url(${uploadedImage})` }} />
                        )}

                        {/* Lighting/Shadow Overlay for Realism */}
                        <div className={styles.lightingOverlay} />
                    </div>

                    {!uploadedImage && (
                        <div className={styles.uploadPrompt} onClick={() => fileInputRef.current?.click()}>
                            <Upload size={32} />
                            <span>Click to Upload Art</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className={styles.controls}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload}
                    />

                    <button className={styles.actionBtn} onClick={() => fileInputRef.current?.click()}>
                        <Camera size={20} /> Change Art
                    </button>

                    <div className={styles.divider} />

                    <button
                        className={styles.saveBtn}
                        onClick={() => handleSaveDesign(true)}
                        disabled={!uploadedImage || saving}
                    >
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Design'}
                    </button>

                    <button
                        className={styles.buyBtn}
                        onClick={() => handleSaveDesign(false)} // Save but show "Coming Soon"
                        disabled={!uploadedImage || saving}
                    >
                        <ShoppingCart size={20} /> Buy Now <span className={styles.badge}>Soon</span>
                    </button>

                    {!uploadedImage && <p className={styles.hint}><AlertCircle size={14} /> Upload an image to enable actions</p>}
                </div>
            </div>
        </div>
    );
};
