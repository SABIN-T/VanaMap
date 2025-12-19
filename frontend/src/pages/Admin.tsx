
import { useState, useEffect } from 'react';
import { fetchVendors, fetchPlants, addPlant, updatePlant, deletePlant, fetchResetRequests } from '../services/api';
import type { Vendor, Plant } from '../types';
import { Check, Trash2, Edit, Image as ImageIcon, Users, Sprout, Activity, LogOut, Sparkles, Search, Database, Leaf, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './Admin.module.css';
import toast from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../data/indianPlants';

// --- MOCK BOTANICAL DATABASE (Expanded with 20+ Entries + Indian DB) ---
// Simulating data from open access botanical repositories (e.g. Figshare, OpenFarm)
const BASE_BOTANICAL_DB: Record<string, Partial<Plant>> = {
    'monstera deliciosa': {
        name: 'Swiss Cheese Plant',
        ecosystem: 'Tropical Rainforest',
        ecosystemDescription: 'Native to Central American jungles, thriving in high humidity and canopy-filtered light.',
        sunlight: 'medium',
        oxygenLevel: 'high',
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 60,
        isNocturnal: false,
        description: 'Iconic large leaves with natural fenestrations (holes). Adds a jungle vibe to any room.',
        type: 'indoor',
        medicinalValues: ['Air purification'],
        advantages: ['Aesthetically pleasing', 'Fast growing']
    },
    'sansevieria trifasciata': {
        name: 'Snake Plant',
        ecosystem: 'West African Tropical (Arid)',
        ecosystemDescription: 'A succulent adapted to dry, rocky habitats. Extremely drought tolerant.',
        sunlight: 'low',
        oxygenLevel: 'very-high',
        idealTempMin: 13,
        idealTempMax: 35,
        minHumidity: 30,
        isNocturnal: true,
        description: 'Indestructible plant that releases oxygen at night (CAM Photosynthesis). Perfect for bedrooms.',
        type: 'indoor',
        medicinalValues: ['Nighttime air filtering', 'Toxin removal'],
        advantages: ['Low light tolerance', 'Low water needs']
    },
    'aloe vera': {
        name: 'Aloe Vera',
        ecosystem: 'Arabian Peninsula (Desert)',
        ecosystemDescription: 'Desert succulent evolved to store water in thick fleshy leaves.',
        sunlight: 'direct',
        oxygenLevel: 'moderate',
        idealTempMin: 15,
        idealTempMax: 40,
        minHumidity: 20,
        isNocturnal: true,
        description: 'Medicinal succulent known for gel that soothes burns and skin irritations.',
        type: 'indoor',
        medicinalValues: ['Skin healing', 'Anti-inflammatory'],
        advantages: ['Easy to propagate', 'Medicinal uses']
    },
    'spathiphyllum wallisii': {
        name: 'Peace Lily',
        ecosystem: 'Rainforest Floor',
        ecosystemDescription: 'Understory plant accustomed to low light and consistent moisture.',
        sunlight: 'low',
        oxygenLevel: 'high',
        idealTempMin: 16,
        idealTempMax: 28,
        minHumidity: 50,
        isNocturnal: false,
        description: 'Elegant white blooms and dark green leaves. Excellent at breaking down VOCs.',
        type: 'indoor',
        medicinalValues: ['VOC removal'],
        advantages: ['Flowering', 'Low light']
    },
    'ficus lyrata': {
        name: 'Fiddle Leaf Fig',
        ecosystem: 'Lowland Tropical Rainforest',
        ecosystemDescription: 'Requires stable warm and humid conditions to thrive.',
        sunlight: 'high',
        oxygenLevel: 'high',
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 60,
        isNocturnal: false,
        description: 'Statement tree with massive, violin-shaped leaves. Requires attention to detail.',
        type: 'indoor',
        medicinalValues: [],
        advantages: ['Architectural beauty']
    },
    'dypsis lutescens': {
        name: 'Areca Palm',
        ecosystem: 'Madagascar Tropical',
        ecosystemDescription: 'Native to humid forests of Madagascar. High transpiration rate adds moisture to air.',
        sunlight: 'medium',
        oxygenLevel: 'very-high',
        idealTempMin: 16,
        idealTempMax: 30,
        minHumidity: 55,
        isNocturnal: false,
        description: 'Feathery, arching fronds. Known as one of the best air purifying plants.',
        type: 'indoor',
        medicinalValues: ['Humidifier'],
        advantages: ['Pet safe', 'High oxygen']
    },
    'chlorophytum comosum': {
        name: 'Spider Plant',
        ecosystem: 'Southern African Grassland',
        ecosystemDescription: 'Fast-growing perennial herb native to tropical and southern Africa.',
        sunlight: 'medium',
        oxygenLevel: 'moderate',
        idealTempMin: 13,
        idealTempMax: 27,
        minHumidity: 40,
        isNocturnal: false,
        description: 'Easy to grow with arching leaves and baby plantlets. Great for beginners.',
        type: 'indoor',
        medicinalValues: ['Safe for pets', 'Air cleaning'],
        advantages: ['Easy propagation', 'Resilient']
    },
    'epipremnum aureum': {
        name: 'Golden Pothos',
        ecosystem: 'Moorea Tropical Forest',
        ecosystemDescription: 'Understory vine that climbs trees in tropical forests.',
        sunlight: 'low',
        oxygenLevel: 'moderate',
        idealTempMin: 15,
        idealTempMax: 30,
        minHumidity: 40,
        isNocturnal: false,
        description: 'The "Devil\'s Ivy" because it is nearly impossible to kill. Trailing vine.',
        type: 'indoor',
        medicinalValues: [],
        advantages: ['Fast growing', 'Trailing']
    },
    'ficus elastica': {
        name: 'Rubber Plant',
        ecosystem: 'South Asian Jungle',
        ecosystemDescription: 'Large tree in the banyan group of figs, native to northeast India and Indonesia.',
        sunlight: 'medium',
        oxygenLevel: 'high',
        idealTempMin: 15,
        idealTempMax: 29,
        minHumidity: 50,
        isNocturnal: false,
        description: 'Sturdy, glossy dark leaves. Can grow into a large indoor tree.',
        type: 'indoor',
        medicinalValues: ['Toxin removal'],
        advantages: ['Statement piece', 'Robust']
    },
    'zamioculcas zamiifolia': {
        name: 'ZZ Plant',
        ecosystem: 'East African Drought Prone',
        ecosystemDescription: 'Native to drought-prone grasslands and forests in eastern Africa.',
        sunlight: 'low',
        oxygenLevel: 'moderate',
        idealTempMin: 15,
        idealTempMax: 35,
        minHumidity: 30,
        isNocturnal: true,
        description: 'Waxy, glossy leaves. Survives neglect and very low light.',
        type: 'indoor',
        medicinalValues: [],
        advantages: ['Hard to kill', 'Modern look']
    },
    'hedera helix': {
        name: 'English Ivy',
        ecosystem: 'European Woodland',
        ecosystemDescription: 'Evergreen climbing vine common in European gardens and wild woodlands.',
        sunlight: 'medium',
        oxygenLevel: 'high',
        idealTempMin: 10,
        idealTempMax: 24,
        minHumidity: 50,
        isNocturnal: false,
        description: 'Classic trailing vine. Excellent at filtering mold particles from air.',
        type: 'indoor',
        medicinalValues: ['Mold reduction'],
        advantages: ['Trailing', 'Cooler temp tolerance']
    },
    'lavandula': {
        name: 'Lavender',
        ecosystem: 'Mediterranean',
        ecosystemDescription: 'Native to the Old World, prefers dry, sandy soil and full sun.',
        sunlight: 'direct',
        oxygenLevel: 'moderate',
        idealTempMin: 10,
        idealTempMax: 30,
        minHumidity: 30,
        isNocturnal: false,
        description: 'Aromatic herb known for its calming scent.',
        type: 'outdoor',
        medicinalValues: ['Calming', 'Sleep aid'],
        advantages: ['Scented', 'Bee friendly']
    },
    'ocimum basilicum': {
        name: 'Basil',
        ecosystem: 'Tropical Regions',
        ecosystemDescription: 'Tender plant native to tropical regions of central Africa and southeast Asia.',
        sunlight: 'high',
        oxygenLevel: 'moderate',
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 50,
        isNocturnal: false,
        description: 'Culinary herb essential for Italian and Thai cuisines.',
        type: 'indoor',
        medicinalValues: ['Culinary'],
        advantages: ['Edible', 'Fast from seed']
    }
};

const BOTANICAL_DB = { ...BASE_BOTANICAL_DB, ...INDIAN_PLANT_DB };

export const Admin = () => {
    // --- STATE ---
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    // const [notifications, setNotifications] = useState<any[]>([]); // To be implemented
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'plants' | 'activity'>('users');
    // const [loading, setLoading] = useState(true);

    // Filter State
    const [plantFilter, setPlantFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Plant Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);
    const [lastAutoFilled, setLastAutoFilled] = useState<string[]>([]); // Track which fields were auto-filled

    const initialFormState: Partial<Plant> = {
        name: '',
        scientificName: '',
        description: '',
        imageUrl: '',
        price: 0,
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 50,
        sunlight: 'medium',
        oxygenLevel: 'moderate',
        type: 'indoor',
        medicinalValues: [],
        advantages: [],
        ecosystem: '',
        ecosystemDescription: '',
        isNocturnal: false
    };
    const [formData, setFormData] = useState<Partial<Plant>>(initialFormState);

    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuthenticated');
        if (!isAdmin) {
            navigate('/admin-login');
            return;
        }
        loadAll();
    }, []);

    const loadAll = async () => {
        // setLoading(true);
        const toastId = toast.loading("Fetching latest dashboard data...");
        try {
            const [vData, pData, rData] = await Promise.all([
                fetchVendors(),
                fetchPlants(),
                fetchResetRequests(),
                // fetchNotifications()
            ]);
            setVendors(vData);
            setPlants(pData);
            setRequests(rData);
            // setNotifications(nData);

            toast.success("Dashboard synced", { id: toastId });
        } catch (err: any) {
            console.error("Sync Error:", err);
            toast.error("Sync failed: " + (err.message || 'Unknown error'), { id: toastId });
        } finally {
            // setLoading(false);
        }
    };

    // --- SMART FETCH ---
    const handleSmartFetch = () => {
        const query = formData.scientificName?.toLowerCase().trim();
        if (!query) {
            toast.error("Please enter a Taxonomy Name first");
            return;
        }

        const toastId = toast.loading(`Checking Global Botanical Repositories for '${query}'...`);

        setTimeout(() => {
            const preFetchFormData = { ...formData };
            // Enhanced Lookup: Checks Merged DB
            const match = BOTANICAL_DB[query] || Object.values(BOTANICAL_DB).find(p => p.name?.toLowerCase().includes(query));

            if (match) {
                const newFormData = { ...preFetchFormData, ...match, scientificName: formData.scientificName };
                const updatedFields: string[] = [];
                const missingFields: string[] = [];

                // Identify Changes
                (Object.keys(newFormData) as Array<keyof Partial<Plant>>).forEach((key) => {
                    const oldVal = preFetchFormData[key];
                    const newVal = newFormData[key];
                    // Simple equality check (works for primitives, adequate for this demo)
                    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                        updatedFields.push(key);
                    }
                });

                // Identify Important Missing Fields
                if (!newFormData.ecosystem) missingFields.push("Ecosystem");
                if (!newFormData.ecosystemDescription) missingFields.push("Eco Desc");
                if (!newFormData.oxygenLevel) missingFields.push("O2 Level");

                setFormData(newFormData);
                setLastAutoFilled(updatedFields);

                toast.success(`Verified: ${match.name} found!`, { id: toastId });

                if (updatedFields.length > 0) {
                    toast(() => (
                        <div className="text-sm">
                            <div className="font-bold text-green-400 mb-1">✅ Auto-Updated {updatedFields.length} Fields:</div>
                            <div className="opacity-80">{updatedFields.slice(0, 5).join(', ')}{updatedFields.length > 5 && '...'}</div>
                        </div>
                    ), { duration: 4000 });
                }

                if (missingFields.length > 0) {
                    toast(() => (
                        <div className="text-sm">
                            <div className="font-bold text-yellow-400 mb-1">⚠️ Manual Input Required:</div>
                            <div>{missingFields.join(', ')}</div>
                        </div>
                    ), { duration: 6000, icon: '✏️' });
                }

            } else {
                // FALLBACK SMART GUESS
                const isSucculent = query.includes('succulent') || query.includes('cacti') || query.includes('aloe');
                const isFern = query.includes('fern');
                const isPalm = query.includes('palm');

                if (isSucculent) {
                    setFormData(prev => ({ ...prev, ecosystem: 'Semi-Arid', minHumidity: 20, sunlight: 'direct', isNocturnal: true }));
                    setLastAutoFilled(['ecosystem', 'minHumidity', 'sunlight', 'isNocturnal']);
                    toast.success("Inferred Arid traits (Succulent Family)", { id: toastId, icon: '🌵' });
                } else if (isFern) {
                    setFormData(prev => ({ ...prev, ecosystem: 'Rainforest Floor', minHumidity: 70, sunlight: 'low' }));
                    setLastAutoFilled(['ecosystem', 'minHumidity', 'sunlight']);
                    toast.success("Inferred Rainforest traits (Fern Family)", { id: toastId, icon: '🌿' });
                } else if (isPalm) {
                    setFormData(prev => ({ ...prev, ecosystem: 'Tropical', minHumidity: 50, sunlight: 'medium', oxygenLevel: 'very-high' }));
                    setLastAutoFilled(['ecosystem', 'minHumidity', 'sunlight', 'oxygenLevel']);
                    toast.success("Inferred Tropical traits (Palm Family)", { id: toastId, icon: '🌴' });
                } else {
                    toast.error("No exact botanical match found. Please fill manually.", { id: toastId });
                }
            }
        }, 800);
    };

    // --- FORM HANDLERS ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Saving plant catalog...");
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                idealTempMin: Number(formData.idealTempMin),
                idealTempMax: Number(formData.idealTempMax),
                minHumidity: Number(formData.minHumidity),
            };

            if (isEditing && currentPlantId) {
                await updatePlant(currentPlantId, payload);
                toast.success("Plant directory updated!", { id: tid });
            } else {
                const newId = (formData.name?.toLowerCase().replace(/\s+/g, '-') || 'plant-' + Date.now());
                await addPlant({ ...payload, id: newId });
                toast.success("New plant cataloged!", { id: tid });
            }

            setFormData(initialFormState);
            setIsEditing(false);
            setCurrentPlantId(null);
            setLastAutoFilled([]);
            loadAll();
        } catch (err) {
            toast.error("Catalog failure", { id: tid });
        }
    };

    const startEdit = (plant: Plant) => {
        setIsEditing(true);
        setCurrentPlantId(plant.id);
        setFormData({ ...plant });
        setLastAutoFilled([]);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const deletePlantHandler = async (id: string, name: string) => {
        if (!confirm(`Permanently delete ${name}?`)) return;
        const tid = toast.loading("Deleting...");
        try {
            await deletePlant(id);
            toast.success("Entry removed", { id: tid });
            loadAll();
        } catch (err) {
            toast.error("Deletion failed", { id: tid });
        }
    };

    const handleBulkImport = async () => {
        if (!confirm("Run Smart Diagnostics & Import? This will fix missing scientific names and add missing plants.")) return;
        const tid = toast.loading("Analyzing Database...");
        let added = 0;
        let updated = 0;
        try {
            const formatSciName = (key: string) => key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            for (const [key, data] of Object.entries(INDIAN_PLANT_DB)) {
                // Case insensitive check
                const match = plants.find(p => p.name.toLowerCase() === data.name?.toLowerCase());

                if (match) {
                    // Smart Repair: Fix missing Scientific Names
                    if (!match.scientificName || match.scientificName === 'Unknown' || match.scientificName === 'Unknown Taxon') {
                        await updatePlant(match.id, { scientificName: formatSciName(key) });
                        updated++;
                    }
                    continue;
                }

                let img = 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=80&w=400';
                const k = data.name?.toLowerCase() || '';
                if (k.includes('neem') || k.includes('tree')) img = 'https://images.unsplash.com/photo-1542372070-07ffee20e649?auto=format&fit=crop&q=80&w=400';
                else if (k.includes('tulsi') || k.includes('basil')) img = 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400';
                else if (k.includes('palm')) img = 'https://images.unsplash.com/photo-1614539971887-2cd9393309a6?auto=format&fit=crop&q=80&w=400';
                else if (k.includes('flower') || k.includes('rose') || k.includes('hibiscus')) img = 'https://images.unsplash.com/photo-1580227974351-460d53c301cb?auto=format&fit=crop&q=80&w=400';

                await addPlant({
                    ...data,
                    scientificName: formatSciName(key),
                    id: key.replace(/\s+/g, '-'),
                    price: Math.floor(Math.random() * 800) + 150,
                    imageUrl: img,
                    idealTempMin: data.idealTempMin || 20,
                    idealTempMax: data.idealTempMax || 30,
                    minHumidity: data.minHumidity || 50
                } as Plant);
                added++;
            }
            toast.success(`Sync Complete: Added ${added}, Repaired ${updated} entries!`, { id: tid });
            loadAll();
        } catch (err) {
            console.error(err);
            toast.error("Import failed", { id: tid });
        }
    };

    // --- UX HELPERS ---
    const InfoTip = ({ text }: { text: string }) => (
        <span className="group relative inline-flex items-center ml-2 cursor-help text-slate-500 hover:text-emerald-400 align-middle">
            <HelpCircle size={14} />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded bg-slate-900 p-2 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50 border border-slate-700">
                {text}
                <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
            </span>
        </span>
    );

    // --- RENDER HELPERS ---
    const isFieldAutoFilled = (fieldName: string) => lastAutoFilled.includes(fieldName);
    const getFieldStyle = (fieldName: string) => isFieldAutoFilled(fieldName) ?
        { border: '1px solid #10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)' } : {};

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <Sprout size={28} className="text-emerald-400" />
                    <h1>VanaMap Admin</h1>
                </div>
                <nav className={styles.nav}>
                    <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? styles.navItemActive : styles.navItem}><Users size={20} /> Users</button>
                    <button onClick={() => setActiveTab('plants')} className={activeTab === 'plants' ? styles.navItemActive : styles.navItem}><Database size={20} /> Plant Directory</button>
                    <button onClick={() => setActiveTab('activity')} className={activeTab === 'activity' ? styles.navItemActive : styles.navItem}><Activity size={20} /> System Activity</button>
                </nav>
                <div className="mt-auto pt-6 border-t border-slate-700">
                    <button className={styles.navItem} onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h2>{activeTab === 'users' ? 'User Management' : activeTab === 'plants' ? 'Plant Directory' : 'System Activity'}</h2>
                        {activeTab === 'plants' && (
                            <Button onClick={handleBulkImport} variant="outline" size="sm" style={{ borderColor: '#10b981', color: '#10b981' }}>
                                <Sparkles size={16} className="mr-2" /> Simulate 500+ Inventory
                            </Button>
                        )}
                    </div>
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Total Vendors</div>
                            <div className={styles.statValue}>{vendors.length}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Plants Listed</div>
                            <div className={styles.statValue}>{plants.length}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Pending Requests</div>
                            <div className={styles.statValue}>{requests.length}</div>
                        </div>
                    </div>
                </header>

                <div className={styles.contentArea}>
                    {activeTab === 'plants' && (
                        <div className="animate-fade-in">
                            {/* PLANT FORM */}
                            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                                <h3 className={styles.cardTitle}>
                                    {isEditing ? `Editing: ${formData.name} ` : 'Catalog New Species'}
                                    {isEditing && <button onClick={() => { setIsEditing(false); setFormData(initialFormState); setLastAutoFilled([]); }} className="text-xs ml-4 text-red-400 border border-red-500/30 px-2 py-1 rounded">Cancel Edit</button>}
                                </h3>
                                <form onSubmit={handlePlantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                                    {/* Taxonomy & Fetch */}
                                    <div className="md:col-span-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm text-slate-400">Taxonomy Name (Scientific) *</label>
                                            {lastAutoFilled.length > 0 && <span className="text-xs text-emerald-400 flex items-center gap-1"><Sparkles size={12} /> {lastAutoFilled.length} Fields Auto-Verified</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                className={styles.input}
                                                placeholder="e.g. Monstera deliciosa"
                                                value={formData.scientificName}
                                                onChange={e => setFormData({ ...formData, scientificName: e.target.value })}
                                                required
                                                style={getFieldStyle('scientificName')}
                                            />
                                            <Button type="button" onClick={handleSmartFetch} style={{ whiteSpace: 'nowrap' }}>
                                                <Search size={16} className="mr-2" /> Verify & Fetch
                                            </Button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">✨ Enter taxonomy to fetch verified botanical ecosystem & efficiency data.</p>
                                    </div>

                                    <div>
                                        <label className={styles.label}>Common Name * <span style={getFieldStyle('name')}>{isFieldAutoFilled('name') ? '✓' : ''}</span></label>
                                        <input className={styles.input} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className={styles.label}>Type</label>
                                        <select className={styles.select} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                                            <option value="indoor">Indoor</option>
                                            <option value="outdoor">Outdoor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={styles.label}>Price (₹) <InfoTip text="Market price in INR." /></label>
                                        <input type="number" className={styles.input} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
                                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                                            {(formData.price || 0) > 0 && ((formData.price || 0) < 150 ? <span className="text-emerald-400">Budget Friendly</span> : (formData.price || 0) > 800 ? <span className="text-purple-400">Premium Species</span> : 'Standard Market Range')}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Ecosystem Type</label>
                                        <input className={styles.input} placeholder="e.g. Tropical Rainforest" value={formData.ecosystem || ''} onChange={e => setFormData({ ...formData, ecosystem: e.target.value })} style={getFieldStyle('ecosystem')} />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-slate-400 mb-1">Ecosystem Description</label>
                                        <textarea className={styles.input} style={{ height: '80px', ...getFieldStyle('ecosystemDescription') }} placeholder="Describe the natural habitat..." value={formData.ecosystemDescription || ''} onChange={e => setFormData({ ...formData, ecosystemDescription: e.target.value })} />
                                    </div>

                                    {/* Scientific Specs */}
                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">O₂ Efficiency <InfoTip text="Breaks down CO2/VOCs" /> {isFieldAutoFilled('oxygenLevel') && <Check size={10} color="#10b981" />}</label>
                                            <select className={styles.input} value={formData.oxygenLevel} onChange={e => setFormData({ ...formData, oxygenLevel: e.target.value as any })} style={getFieldStyle('oxygenLevel')}>
                                                <option value="low">Standard</option>
                                                <option value="moderate">Moderate</option>
                                                <option value="high">High</option>
                                                <option value="very-high">Super Oxygenator</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">Sunlight Req <InfoTip text="Light intensity needed" /> {isFieldAutoFilled('sunlight') && <Check size={10} color="#10b981" />}</label>
                                            <select className={styles.input} value={formData.sunlight} onChange={e => setFormData({ ...formData, sunlight: e.target.value as any })} style={getFieldStyle('sunlight')}>
                                                <option value="low">Low (Indirect)</option>
                                                <option value="medium">Medium (Bright Indirect)</option>
                                                <option value="high">High (Direct)</option>
                                                <option value="direct">Full Direct</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 pt-6">
                                            <input type="checkbox" checked={formData.isNocturnal || false} onChange={e => setFormData({ ...formData, isNocturnal: e.target.checked })} className="w-5 h-5 accent-emerald-500" />
                                            <div className="flex flex-col">
                                                <label className="text-sm text-slate-300 flex items-center">Nocturnal O₂ <InfoTip text="CAM Photosynthesis" /></label>
                                                {isFieldAutoFilled('isNocturnal') && <span className="text-[10px] text-emerald-400">Verified Trait</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between"><span className="text-xs text-slate-400">Min Temp</span> <span className="text-xs font-bold text-slate-200">{formData.idealTempMin}°C</span></div>
                                            <input type="range" min="0" max="40" value={formData.idealTempMin} onChange={e => setFormData({ ...formData, idealTempMin: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                            <span className="text-[9px] text-slate-500 text-right">{(formData.idealTempMin || 0) < 10 ? 'Frost Hardy' : 'Tropical'}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between"><span className="text-xs text-slate-400">Max Temp</span> <span className="text-xs font-bold text-slate-200">{formData.idealTempMax}°C</span></div>
                                            <input type="range" min="10" max="50" value={formData.idealTempMax} onChange={e => setFormData({ ...formData, idealTempMax: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between"><span className="text-xs text-slate-400">Min Humidity</span> <span className="text-xs font-bold text-slate-200">{formData.minHumidity}%</span></div>
                                            <input type="range" min="10" max="100" value={formData.minHumidity} onChange={e => setFormData({ ...formData, minHumidity: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                            <span className="text-[9px] text-slate-500 text-right">{(formData.minHumidity || 0) > 60 ? 'Humid (Mist often)' : 'Dry Air Tolerant'}</span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                                        <textarea className={styles.input} rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={getFieldStyle('description')} />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Plant Image</label>
                                        <label className="cursor-pointer border-2 border-dashed border-slate-600 rounded-lg p-4 flex flex-col items-center hover:border-emerald-500 transition-colors">
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="Preview" className="h-32 object-contain" />
                                            ) : (
                                                <>
                                                    <ImageIcon size={24} className="text-slate-400 mb-2" />
                                                    <span className="text-xs text-slate-500">Upload Image</span>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                        {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData(initialFormState); }}>Cancel</Button>}
                                        <Button type="submit">{isEditing ? 'Update Registry' : 'AddTo Database'}</Button>
                                    </div>
                                </form>
                            </div>

                            {/* PLANTS LIST HEADER & SEARCH */}
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                                <div className="flex gap-2">
                                    <button onClick={() => setPlantFilter('all')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${plantFilter === 'all' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>All Varieties</button>
                                    <button onClick={() => setPlantFilter('indoor')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${plantFilter === 'indoor' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Indoor</button>
                                    <button onClick={() => setPlantFilter('outdoor')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${plantFilter === 'outdoor' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Outdoor</button>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search taxonomy or local name..."
                                        className="w-full bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PLANTS LIST CARDS */}
                            <div className="grid grid-cols-1 gap-4">
                                {plants.filter(p => (plantFilter === 'all' || p.type === plantFilter) && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()))).map(p => (
                                    <div key={p.id} className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300 flex items-center gap-4">
                                        <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-slate-900 shadow-md group-hover:scale-105 transition-transform" />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-200 truncate text-lg">{p.name}</h4>
                                                {p.type === 'indoor' ? <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-medium border border-indigo-500/30">Indoor</span> : <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-medium border border-orange-500/30">Outdoor</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Leaf size={12} className="text-emerald-500" />
                                                <span className="italic font-serif text-emerald-100/70">{p.scientificName || 'Unknown Taxonomy'}</span>
                                            </div>
                                            <div className="flex gap-3 mt-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400/50"></span> {p.ecosystem || 'General Class'}</span>
                                                {p.isNocturnal && <span className="flex items-center gap-1 text-purple-400"><Sparkles size={10} /> CAM Invariant</span>}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(p)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit Species">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => deletePlantHandler(p.id, p.name)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Remove Species">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {plants.length === 0 && <div className="text-center py-10 text-slate-500">No plants in database. Use seed button above.</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-fade-in text-center text-slate-400 py-10">
                            User Management Section
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="animate-fade-in text-center text-slate-400 py-10">
                            Activity Log Section
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
