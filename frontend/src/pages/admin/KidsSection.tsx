import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Upload, Search, Baby } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchKidsProducts, addKidsProduct, updateKidsProduct, deleteKidsProduct } from '../../services/api';
import type { KidsProduct } from '../../types';
import styles from './KidsSection.module.css';

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1020;
                const MAX_HEIGHT = 1020;
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
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

const initialFormState = {
    name: '',
    description: '',
    price: 0,
    category: 'kit' as KidsProduct['category'],
    type: 'indoor' as KidsProduct['type'],
    ageRange: '5-12',
    includesInput: '',
    tagsInput: '',
    imageUrl: '',
    inStock: true,
    stockQuantity: 10,
    featured: false
};

export const KidsSection = () => {
    const [products, setProducts] = useState<KidsProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<KidsProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [form, setForm] = useState(initialFormState);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadProducts = async () => {
        try {
            const data = await fetchKidsProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            console.error('Failed to load products', err);
            toast.error('Could not load kids products');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredProducts(products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, products]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tid = toast.loading('Compressing image...');
        try {
            const compressedBase64 = await compressImage(file);
            setForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
            toast.success('Image set successfully', { id: tid });
        } catch (err) {
            toast.error('Image compression failed', { id: tid });
        } finally {
            e.target.value = '';
        }
    };

    const handleEdit = (product: KidsProduct) => {
        setIsEditing(true);
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category,
            type: product.type,
            ageRange: product.ageRange,
            includesInput: product.includes ? product.includes.join(', ') : '',
            tagsInput: product.tags ? product.tags.join(', ') : '',
            imageUrl: product.imageUrl || '',
            inStock: product.inStock,
            stockQuantity: product.stockQuantity || 0,
            featured: product.featured || false
        });
        // Scroll form into view for mobile devices
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setForm(initialFormState);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        const tid = toast.loading('Deleting product...');
        try {
            await deleteKidsProduct(id);
            toast.success('Product deleted', { id: tid });
            loadProducts();
            if (editingId === id) {
                handleCancelEdit();
            }
        } catch (err) {
            toast.error('Failed to delete product', { id: tid });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.imageUrl) {
            toast.error('Please enter product name and choose an image.');
            return;
        }

        const includesArray = form.includesInput
            ? form.includesInput.split(',').map(s => s.trim()).filter(Boolean)
            : [];
        const tagsArray = form.tagsInput
            ? form.tagsInput.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const payload: Partial<KidsProduct> = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            type: form.type,
            ageRange: form.ageRange,
            includes: includesArray,
            tags: tagsArray,
            imageUrl: form.imageUrl,
            inStock: form.inStock,
            stockQuantity: Number(form.stockQuantity),
            featured: form.featured
        };

        const tid = toast.loading(isEditing ? 'Updating product...' : 'Creating product...');
        try {
            if (isEditing && editingId) {
                await updateKidsProduct(editingId, payload);
                toast.success('Product updated!', { id: tid });
            } else {
                const newId = `kids-${crypto.randomUUID()}`;
                await addKidsProduct({ ...payload, id: newId } as KidsProduct);
                toast.success('Product created!', { id: tid });
            }
            setForm(initialFormState);
            setIsEditing(false);
            setEditingId(null);
            loadProducts();
        } catch (err) {
            toast.error('Failed to save product', { id: tid });
        }
    };

    return (
        <AdminLayout title="Kids Section Hub">
            <div className={styles.pageContainer}>
                <div className={styles.mainLayout}>
                    {/* Left Column: Form */}
                    <div className={styles.formPanel}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>
                                {isEditing ? '✏️ Edit Product' : '✨ Add Kids Product'}
                            </h2>
                            {isEditing && (
                                <button className={styles.cancelEditBtn} onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Product Image</label>
                                <div 
                                    className={styles.imageUploadArea} 
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {form.imageUrl ? (
                                        <div>
                                            <img src={form.imageUrl} alt="Preview" className={styles.previewImage} />
                                            <p className={styles.imageUploadText} style={{ marginTop: '0.5rem' }}>
                                                Click to change image
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className={styles.uploadIcon} size={28} style={{ margin: '0 auto' }} />
                                            <p className={styles.imageUploadText}>
                                                Click to upload high-quality product image
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Product Name</label>
                                <input 
                                    type="text" 
                                    className={styles.glassInput} 
                                    placeholder="e.g. Kid's Magic Seed Kit"
                                    value={form.name}
                                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Description</label>
                                <textarea 
                                    className={styles.glassTextarea} 
                                    placeholder="Tell the kids why this is so much fun!"
                                    value={form.description}
                                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className={styles.rowGroup}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Price (INR)</label>
                                    <input 
                                        type="number" 
                                        className={styles.glassInput} 
                                        value={form.price || ''}
                                        onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Category</label>
                                    <select 
                                        className={styles.glassSelect}
                                        value={form.category}
                                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                                    >
                                        <option value="kit">Gardening Kit</option>
                                        <option value="toy">Toy</option>
                                        <option value="educational">Educational</option>
                                        <option value="seeds">Easy Seeds</option>
                                        <option value="accessory">Accessory</option>
                                        <option value="craft">Craft / Painting</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.rowGroup}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Recommended Age Range</label>
                                    <input 
                                        type="text" 
                                        className={styles.glassInput} 
                                        placeholder="e.g. 5-12 years"
                                        value={form.ageRange}
                                        onChange={e => setForm(prev => ({ ...prev, ageRange: e.target.value }))}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Location Type</label>
                                    <div className={styles.segmentedControl}>
                                        <button 
                                            type="button"
                                            className={`${styles.segmentBtn} ${form.type === 'indoor' ? styles.segmentBtnActive : ''}`}
                                            onClick={() => setForm(prev => ({ ...prev, type: 'indoor' }))}
                                        >
                                            Indoor
                                        </button>
                                        <button 
                                            type="button"
                                            className={`${styles.segmentBtn} ${form.type === 'outdoor' ? styles.segmentBtnActive : ''}`}
                                            onClick={() => setForm(prev => ({ ...prev, type: 'outdoor' }))}
                                        >
                                            Outdoor
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Includes (Comma Separated)</label>
                                <input 
                                    type="text" 
                                    className={styles.glassInput} 
                                    placeholder="e.g. Seeds, Soil, Clay Pot, Paints, Brush"
                                    value={form.includesInput}
                                    onChange={e => setForm(prev => ({ ...prev, includesInput: e.target.value }))}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Search Tags (Comma Separated)</label>
                                <input 
                                    type="text" 
                                    className={styles.glassInput} 
                                    placeholder="e.g. colorful, gift, sensory, fast-growing"
                                    value={form.tagsInput}
                                    onChange={e => setForm(prev => ({ ...prev, tagsInput: e.target.value }))}
                                />
                            </div>

                            <div className={styles.rowGroup}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Stock Quantity</label>
                                    <input 
                                        type="number" 
                                        className={styles.glassInput} 
                                        value={form.stockQuantity}
                                        onChange={e => setForm(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input 
                                                type="checkbox" 
                                                className={styles.checkboxInput}
                                                checked={form.inStock}
                                                onChange={e => setForm(prev => ({ ...prev, inStock: e.target.checked }))}
                                            />
                                            In Stock
                                        </label>
                                        <label className={styles.checkboxLabel}>
                                            <input 
                                                type="checkbox" 
                                                className={styles.checkboxInput}
                                                checked={form.featured}
                                                onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                                            />
                                            Featured
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {isEditing ? 'Save Changes' : 'Create Product'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: List */}
                    <div className={styles.listPanel}>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} size={20} />
                            <input 
                                type="text" 
                                className={styles.searchBar} 
                                placeholder="Search kids section catalogue..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.statsText}>
                            <span>Kids Section Products</span>
                            <span>Total: <span className={styles.highlight}>{filteredProducts.length} Items</span></span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Baby size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <h3>No products found</h3>
                                <p>Try adding a kids kit or seeds product in the left form!</p>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {filteredProducts.map(product => (
                                    <div className={styles.card} key={product.id}>
                                        <div className={styles.cardImageContainer}>
                                            <img src={product.imageUrl} alt={product.name} className={styles.cardImage} />
                                            <div className={styles.cardOverlay} />
                                            <div className={styles.cardActions}>
                                                <button 
                                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button 
                                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardHeader}>
                                                <span className={styles.cardCategory}>{product.category}</span>
                                                <h3 className={styles.cardTitle}>{product.name}</h3>
                                                {product.ageRange && (
                                                    <p className={styles.cardMeta}>Age: {product.ageRange}</p>
                                                )}
                                            </div>
                                            <div className={styles.cardFooter}>
                                                <span className={styles.cardPrice}>Rs. {product.price}</span>
                                                <span className={`${styles.badge} ${product.inStock ? styles.badgeInStock : styles.badgeOutStock}`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
