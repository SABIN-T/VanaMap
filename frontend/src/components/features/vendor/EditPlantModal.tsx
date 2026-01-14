import { useState, useRef } from 'react';
import { X, Upload, Trash2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EditPlantModalProps {
    plant: any;
    inventoryItem: any;
    onSave: (updates: any) => Promise<void>;
    onClose: () => void;
}

export const EditPlantModal = ({ plant, inventoryItem, onSave, onClose }: EditPlantModalProps) => {
    const [price, setPrice] = useState(inventoryItem?.price || plant.price || 0);
    const [quantity, setQuantity] = useState(inventoryItem?.quantity || 0);
    const [inStock, setInStock] = useState(inventoryItem?.inStock ?? true);
    const [customImages, setCustomImages] = useState<string[]>(inventoryItem?.customImages || []);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (customImages.length >= 3) {
            toast.error("Maximum 3 images allowed per plant");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        const tid = toast.loading("Uploading image...");

        try {
            const savedUser = localStorage.getItem('user');
            const token = savedUser ? JSON.parse(savedUser).token : null;

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setCustomImages([...customImages, data.imageUrl]);
                toast.success("Image uploaded", { id: tid });
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            toast.error(err.message || "Upload failed", { id: tid });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setCustomImages(customImages.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        await onSave({
            price: Number(price),
            quantity: Number(quantity),
            inStock,
            customImages
        });
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: '#1e293b', border: '1px solid #334155',
                borderRadius: '1.5rem', width: '90%', maxWidth: '600px',
                maxHeight: '90vh', overflowY: 'auto', padding: '2rem'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Edit {plant.name}</h2>
                    <button onClick={onClose}><X color="white" /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* LEFT: Images */}
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Plant Images (Max 3)
                        </label>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden',
                                border: '2px solid #3b82f6', position: 'relative'
                            }}>
                                <img src={plant.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '4px', textAlign: 'center' }}>Default</span>
                            </div>

                            {customImages.map((img, idx) => (
                                <div key={idx} style={{
                                    aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden',
                                    border: '1px solid #475569', position: 'relative'
                                }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={12} color="white" />
                                    </button>
                                </div>
                            ))}

                            {customImages.length < 3 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        aspectRatio: '1', borderRadius: '0.5rem',
                                        border: '2px dashed #475569', display: 'flex',
                                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        cursor: uploading ? 'wait' : 'pointer', color: '#94a3b8',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} disabled={uploading} />
                                    {uploading ? <div className="spinner-small"></div> : <Upload size={20} />}
                                    <span style={{ fontSize: '10px', marginTop: '4px' }}>Add Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                style={{
                                    width: '100%', padding: '1rem', background: '#0f172a',
                                    border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1.1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Stock Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                style={{
                                    width: '100%', padding: '1rem', background: '#0f172a',
                                    border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', fontSize: '1.1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    border: inStock ? 'none' : '2px solid #475569',
                                    background: inStock ? '#10b981' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {inStock && <Check size={16} color="white" />}
                                </div>
                                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} hidden />
                                <span style={{ color: 'white' }}>Available in Stock</span>
                            </label>
                        </div>

                        <button
                            onClick={handleSave}
                            style={{
                                marginTop: 'auto', padding: '1rem', borderRadius: '0.5rem',
                                background: '#3b82f6', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
