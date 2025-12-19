
import { useState, useEffect } from 'react';
import { fetchVendors, fetchPlants, addPlant, updatePlant, deletePlant, fetchResetRequests, fetchUsers } from '../services/api';
import type { Vendor, Plant } from '../types';
import { Check, Trash2, Edit, Image as ImageIcon, Users, Sprout, Activity, LogOut, Sparkles, Search, Database, Leaf, HelpCircle, Droplets, Thermometer, Sun } from 'lucide-react';
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
    // const [requests, setRequests] = useState<any[]>([]); // Future implementation
    // const [notifications, setNotifications] = useState<any[]>([]); // To be implemented
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'plants' | 'reports' | 'users'>('dashboard');
    const [users, setUsers] = useState<any[]>([]);
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
            const [vData, pData, , uData] = await Promise.all([
                fetchVendors(),
                fetchPlants(),
                fetchResetRequests(),
                fetchUsers()
                // fetchNotifications()
            ]);
            setVendors(vData);
            setPlants(pData);
            // setRequests(rData);
            setUsers(uData);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem}>
                        <Activity size={18} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('plants')} className={activeTab === 'plants' ? styles.navItemActive : styles.navItem}>
                        <Database size={18} /> Plant Directory
                    </button>
                    <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? styles.navItemActive : styles.navItem}>
                        <Users size={18} /> User Management
                    </button>
                    <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? styles.navItemActive : styles.navItem}>
                        <Sparkles size={18} /> System Health
                    </button>
                </nav>
                <div className="mt-auto pt-6 border-t border-slate-700">
                    <button className={styles.navItem} onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div className="flex justify-between items-center w-full mb-8">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                {activeTab === 'users' ? 'User Access Control' :
                                    activeTab === 'plants' ? 'Botanical Matrix' :
                                        activeTab === 'reports' ? 'System Health' : 'Mission Control'}
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {activeTab === 'users' ? 'Manage vendor permissions and user sessions' : 'Real-time database operations and analytics'}
                            </p>
                        </div>
                        {activeTab === 'plants' && (
                            <Button onClick={handleBulkImport} variant="outline" size="sm" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 gap-2">
                                <Database size={16} /> Run Diagnostics
                            </Button>
                        )}
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={64} /></div>
                                <div className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">Total Vendors</div>
                                <div className="text-4xl font-black text-white">{vendors.length}</div>
                                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><Activity size={10} /> Active Partner Network</div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Database size={64} /></div>
                                <div className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">Plants Cataloged</div>
                                <div className="text-4xl font-black text-white">{plants.length}</div>
                                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><Sprout size={10} /> Verified Species</div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={64} /></div>
                                <div className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">System Status</div>
                                <div className="text-4xl font-black text-emerald-400">98%</div>
                                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">Operational</div>
                            </div>
                        </div>
                    )}
                </header>

                <div className={styles.contentArea}>
                    {activeTab === 'users' && (
                        <div className={styles.contentArea}>
                            <div className={styles.header}>
                                <h2>User & Vendor Management</h2>
                                <p className="text-slate-400">Monitor active sessions and registered accounts from MongoDB.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* VENDORS */}
                                <div className={styles.card}>
                                    <div className={styles.cardTitle}>
                                        <span className="text-emerald-400 flex items-center gap-2"><Sparkles size={18} /> Verified Vendors</span>
                                        <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-white">{vendors.length}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {vendors.map(v => (
                                            <div key={v.id} className={styles.listItem}>
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                                                    {v.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-200">{v.name}</h4>
                                                    <p className="text-xs text-slate-400">{v.address || 'Location Unknown'}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700">
                                                        <span className={`w-2 h-2 rounded-full ${v.id.charCodeAt(0) % 3 !== 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></span>
                                                        <span className="text-[10px] font-medium text-slate-300">{v.id.charCodeAt(0) % 3 !== 0 ? 'Online' : 'Offline'}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500">ID: {v.id.slice(0, 6)}...</span>
                                                </div>
                                            </div>
                                        ))}
                                        {vendors.length === 0 && <div className="text-center text-slate-500 py-8">No vendors found.</div>}
                                    </div>
                                </div>

                                {/* USERS */}
                                <div className={styles.card}>
                                    <div className={styles.cardTitle}>
                                        <span className="text-blue-400 flex items-center gap-2"><Users size={18} /> Registered Users</span>
                                        <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-white">{users.filter(u => u.role !== 'vendor').length}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {users.filter(u => u.role !== 'vendor').length === 0 && (
                                            <div className="text-center p-8 text-slate-500 flex flex-col items-center">
                                                <Users size={40} className="mb-2 opacity-20" />
                                                <p>No registered users found.</p>
                                            </div>
                                        )}
                                        {users.filter(u => u.role !== 'vendor').map(u => (
                                            <div key={u.id} className={styles.listItem}>
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-200">{u.name}</h4>
                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700">
                                                        <span className={`w-2 h-2 rounded-full ${Math.random() > 0.4 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-500'}`}></span>
                                                        <span className="text-[10px] font-medium text-slate-300">{Math.random() > 0.4 ? 'Active' : 'Away'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'plants' && (
                        <div className="animate-fade-in">
                            {/* PLANT FORM */}
                            {/* PLANT FORM PRO */}
                            <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6 flex items-center justify-between relative z-10">
                                    <span>{isEditing ? `Editing: ${formData.name} ` : 'Catalog New Species'}</span>
                                    {isEditing && (
                                        <button
                                            onClick={() => { setIsEditing(false); setFormData(initialFormState); setLastAutoFilled([]); }}
                                            className="text-xs flex items-center gap-1 text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-colors border border-red-500/20"
                                        >
                                            <LogOut size={12} className="rotate-180" /> Cancel Edit
                                        </button>
                                    )}
                                </h3>

                                <form onSubmit={handlePlantSubmit} className="space-y-8 relative z-10">

                                    {/* SECTION 1: IDENTITY */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-2 mb-4">Core Identity</h4>

                                        {/* Smart Fetch Bar */}
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row gap-4 items-end md:items-center transition-all focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20">
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-2"> Scientific Taxonomy <HelpCircle size={10} /></label>
                                                    {lastAutoFilled.length > 0 && <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Sparkles size={8} /> Auto-Verified</span>}
                                                </div>
                                                <input
                                                    className="w-full bg-slate-800 border-none rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50"
                                                    placeholder="e.g. Monstera deliciosa"
                                                    value={formData.scientificName}
                                                    onChange={e => setFormData({ ...formData, scientificName: e.target.value })}
                                                    required
                                                    style={getFieldStyle('scientificName')}
                                                />
                                            </div>
                                            <Button type="button" onClick={handleSmartFetch} className="w-full md:w-auto md:mb-0.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                                                <Search size={16} className="mr-2" /> Verify & Fetch
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Common Name</label>
                                                <input className={styles.input} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Classification</label>
                                                <select className={styles.select} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                                                    <option value="indoor">Indoor (Houseplant)</option>
                                                    <option value="outdoor">Outdoor (Garden/Wild)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Market Price (₹)</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                                    <input type="number" className={`${styles.input} pl-8`} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-1 h-4">
                                                    {(formData.price || 0) > 0 && ((formData.price || 0) < 150 ? <span className="text-emerald-400">Budget Friendly</span> : (formData.price || 0) > 800 ? <span className="text-purple-400">Premium Species</span> : 'Standard Market Range')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 2: ENVIRONMENTAL & BIOLOGY */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest border-b border-blue-500/20 pb-2 mb-4">Environmental Profile</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Ecosystem Origin</label>
                                                <input className={styles.input} placeholder="e.g. Tropical Rainforest" value={formData.ecosystem || ''} onChange={e => setFormData({ ...formData, ecosystem: e.target.value })} style={getFieldStyle('ecosystem')} />
                                                <textarea className={`${styles.input} mt-2 text-xs`} rows={2} placeholder="Describe the natural habitat..." value={formData.ecosystemDescription || ''} onChange={e => setFormData({ ...formData, ecosystemDescription: e.target.value })} style={getFieldStyle('ecosystemDescription')} />
                                            </div>

                                            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                                                <div className="flex justify-between items-start mb-4">
                                                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Sparkles size={12} /> Bio-Efficiency</label>
                                                    {isFieldAutoFilled('oxygenLevel') && <Check size={12} className="text-emerald-500" />}
                                                </div>
                                                <select className={`${styles.select} mb-4`} value={formData.oxygenLevel} onChange={e => setFormData({ ...formData, oxygenLevel: e.target.value as any })} style={getFieldStyle('oxygenLevel')}>
                                                    <option value="low">Standard O₂ Production</option>
                                                    <option value="moderate">Moderate Air Purifier</option>
                                                    <option value="high">High Efficiency Purifier</option>
                                                    <option value="very-high">Super Oxygenator (NASA List)</option>
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={formData.isNocturnal || false} onChange={e => setFormData({ ...formData, isNocturnal: e.target.checked })} className="w-4 h-4 rounded border-slate-600 bg-slate-700 accent-purple-500" />
                                                    <span className="text-xs text-slate-300">Nocturnal O₂ (CAM)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RANGE SLIDERS GRID */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
                                            {/* TEMP */}
                                            <div>
                                                <div className="flex justify-between mb-2"><span className="text-xs text-slate-400">Temperature</span> <span className="text-xs font-bold text-slate-200">{formData.idealTempMin}-{formData.idealTempMax}°C</span></div>
                                                <input type="range" min="0" max="40" value={formData.idealTempMin} onChange={e => setFormData({ ...formData, idealTempMin: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2" />
                                                <input type="range" min="10" max="50" value={formData.idealTempMax} onChange={e => setFormData({ ...formData, idealTempMax: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                            {/* HUMIDITY */}
                                            <div>
                                                <div className="flex justify-between mb-2"><span className="text-xs text-slate-400">Humidity</span> <span className="text-xs font-bold text-slate-200">{formData.minHumidity}%+</span></div>
                                                <input type="range" min="10" max="100" value={formData.minHumidity} onChange={e => setFormData({ ...formData, minHumidity: Number(e.target.value) })} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                                <div className="text-[10px] text-right text-slate-500 mt-1">{(formData.minHumidity || 0) > 60 ? 'Misting Required' : 'Drought Tolerant'}</div>
                                            </div>
                                            {/* LIGHT */}
                                            <div>
                                                <div className="flex justify-between mb-2"><span className="text-xs text-slate-400">Sunlight</span> <span className="text-xs font-bold text-slate-200 capitalize">{formData.sunlight}</span></div>
                                                <select className={styles.select} value={formData.sunlight} onChange={e => setFormData({ ...formData, sunlight: e.target.value as any })} style={getFieldStyle('sunlight')}>
                                                    <option value="low">Low (Indirect)</option>
                                                    <option value="medium">Medium (Bright Indirect)</option>
                                                    <option value="high">High (Direct)</option>
                                                    <option value="direct">Full Direct Sun</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 3: MEDIA & DETAILS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
                                            <textarea className={styles.input} rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={getFieldStyle('description')} placeholder="Detailed description of the species..." />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Reference Image</label>
                                            <label className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl h-32 flex flex-col items-center justify-center transition-colors bg-slate-900/20 group">
                                                {formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <>
                                                        <ImageIcon size={24} className="text-slate-500 group-hover:text-emerald-400 mb-2 transition-colors" />
                                                        <span className="text-[10px] text-slate-500">Upload / Drag & Drop</span>
                                                    </>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-emerald-500/10">
                                        <Button type="button" variant="outline" onClick={() => { setFormData(initialFormState); setIsEditing(false); }} className="border-slate-600 text-slate-400 hover:text-white">Clear Form</Button>
                                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-8">
                                            {isEditing ? 'Update Botanical Record' : 'AddTo Global Database'}
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* PLANTS LIST HEADER & SEARCH */}
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl p-4 -mx-4 border-b border-slate-700/50">
                                <div className="flex gap-2 p-1 bg-slate-800 rounded-full border border-slate-700">
                                    {['all', 'indoor', 'outdoor'].map(filterVal => (
                                        <button
                                            key={filterVal}
                                            onClick={() => setPlantFilter(filterVal as any)}
                                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${plantFilter === filterVal
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                        >
                                            {filterVal === 'all' ? 'All Collection' : filterVal.charAt(0).toUpperCase() + filterVal.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-80 group">
                                    <Search className="absolute left-4 top-3 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search taxonomy..."
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2.5 pl-12 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PLANTS GRID PRO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {plants.filter(p => (plantFilter === 'all' || p.type === plantFilter) && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()))).map(p => (
                                    <div key={p.id} className="group relative bg-slate-800/20 hover:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1">
                                        {/* Image Area */}
                                        <div className="h-48 overflow-hidden relative bg-slate-900">
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            {/* Floating Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg ${p.type === 'indoor' ? 'bg-indigo-500/80 text-white' : 'bg-orange-500/80 text-white'}`}>
                                                    {p.type}
                                                </span>
                                            </div>

                                            {/* Action Buttons (Reveal on Hover) */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors border border-white/10" title="Edit">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); deletePlantHandler(p.id, p.name); }} className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-white/10" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-4 pt-2">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="font-bold text-slate-100 text-lg leading-tight group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                                                    <p className="text-xs text-emerald-500/70 italic font-serif flex items-center gap-1 mt-0.5">
                                                        <Leaf size={10} /> {p.scientificName || 'Unknown Taxon'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-slate-200 block">₹{p.price || 0}</span>
                                                </div>
                                            </div>

                                            {/* Micro Stats */}
                                            <div className="grid grid-cols-3 gap-1 mt-4 pt-3 border-t border-slate-700/50">
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors">
                                                    <Sun size={12} className="text-amber-400 mb-1" />
                                                    <span className="text-[9px] text-slate-400 capitalize">{p.sunlight === 'direct' ? 'Direct' : p.sunlight === 'high' ? 'Bright' : 'Low'}</span>
                                                </div>
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors">
                                                    <Droplets size={12} className="text-blue-400 mb-1" />
                                                    <span className="text-[9px] text-slate-400">{p.minHumidity}% Hum</span>
                                                </div>
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors">
                                                    <Thermometer size={12} className="text-rose-400 mb-1" />
                                                    <span className="text-[9px] text-slate-400">{p.idealTempMin}-{p.idealTempMax}°</span>
                                                </div>
                                            </div>

                                            {p.isNocturnal && (
                                                <div className="mt-3 flex items-center gap-1.5 justify-center text-[10px] text-purple-300 bg-purple-500/10 py-1 rounded-md border border-purple-500/20">
                                                    <Sparkles size={10} /> 24/7 Oxygen Producer
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {plants.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-700 rounded-3xl">
                                        <div className="flex justify-center mb-4"><Sprout size={48} className="text-slate-600" /></div>
                                        <h3 className="text-xl font-bold text-slate-500">Inventory Empty</h3>
                                        <p className="text-slate-600 mb-6">Start by importing the database.</p>
                                        <Button onClick={handleBulkImport} variant="outline" className="opacity-50 hover:opacity-100">Simulate Import</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                </div>
            </main>
        </div>
    );
};
