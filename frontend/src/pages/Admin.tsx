
import { useState, useEffect, useCallback } from 'react';
import { fetchVendors, fetchPlants, addPlant, updatePlant, deletePlant, fetchUsers } from '../services/api';
import type { Vendor, Plant } from '../types';
import { MoreHorizontal, MapPin, Trash2, Edit, Image as ImageIcon, Users, Sprout, Activity, LogOut, Sparkles, Search, Database, Leaf, Droplets, Thermometer, Sun } from 'lucide-react';
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
    // Track which fields were auto-filled

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




    const loadAll = useCallback(async () => {
        // setLoading(true);
        const toastId = toast.loading("Fetching latest dashboard data...");
        try {
            const [vData, pData, uData] = await Promise.all([
                fetchVendors(),
                fetchPlants(),
                fetchUsers()
            ]);
            setVendors(vData);
            setPlants(pData);
            setUsers(uData);

            toast.success("Dashboard synced", { id: toastId });
        } catch (err: any) {
            console.error("Sync Error:", err);
            toast.error("Sync failed: " + (err.message || 'Unknown error'), { id: toastId });
        }
    }, []);

    useEffect(() => {
        const isAdmin = localStorage.getItem('adminAuthenticated');
        if (!isAdmin) {
            navigate('/admin-login');
            return;
        }
        loadAll();
    }, [navigate, loadAll]);

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
                    toast.success("Inferred Arid traits (Succulent Family)", { id: toastId, icon: '🌵' });
                } else if (isFern) {
                    setFormData(prev => ({ ...prev, ecosystem: 'Rainforest Floor', minHumidity: 70, sunlight: 'low' }));
                    toast.success("Inferred Rainforest traits (Fern Family)", { id: toastId, icon: '🌿' });
                } else if (isPalm) {
                    setFormData(prev => ({ ...prev, ecosystem: 'Tropical', minHumidity: 50, sunlight: 'medium', oxygenLevel: 'very-high' }));
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

            loadAll();
        } catch (err) {
            toast.error("Catalog failure", { id: tid });
        }
    };

    const startEdit = (plant: Plant) => {
        setIsEditing(true);
        setCurrentPlantId(plant.id);
        setFormData({ ...plant });

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
                        <div className={`${styles['stats-grid']} animate - fade -in `}>
                            <div className={`${styles['premium-card']} p - 6 group`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Users size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-wide">+12% vs week</div>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">{vendors.length}</div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Partners</div>
                                </div>
                            </div>

                            <div className={`${styles['premium-card']} p - 6 group`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Database size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                                    </span>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">{plants.length}</div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Botanical Records</div>
                                </div>
                            </div>

                            <div className={`${styles['premium-card']} p - 6 group`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Activity size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">Optimal</div>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">99.8%</div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">System Uptime</div>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className={styles.contentArea}>
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recent Activity Feed */}
                                <div className={`${styles['premium-card']} p - 0 overflow - hidden`}>
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Activity size={18} className="text-emerald-500" /> Recent Species Log
                                        </h3>
                                        <button onClick={() => setActiveTab('plants')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
                                            View All
                                        </button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {plants.slice(0, 5).map((p) => (
                                            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-emerald-200 transition-colors">
                                                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{p.name}</div>
                                                    <div className="text-xs text-slate-500 italic">{p.scientificName}</div>
                                                </div>
                                                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">NEW</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Health Check */}
                                <div className="space-y-6">
                                    <div className={`${styles['premium-card']} p-6`}>
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <Sparkles size={18} className="text-blue-500" /> Platform Metrics
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-2"><span className="text-slate-500">Database Load</span> <span className="text-slate-800">12%</span></div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full w-[12%]" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-2"><span className="text-slate-500">Asset Storage</span> <span className="text-slate-800">4.2 GB</span></div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">API Uptime</span> <span className="text-emerald-400">99.99%</span></div>
                                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[100%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                        <div>
                                            <h4 className="text-emerald-800 font-bold mb-1">Backup Protocol</h4>
                                            <p className="text-[10px] font-medium text-slate-400">ADMINISTRATOR</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 border-2 border-slate-900">
                                            A
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="animate-fade-in space-y-8">
                            <div className={`${styles['premium-card']} p-12 text-center flex flex-col items-center shadow-none border-dashed border-2 bg-slate-50/50`}>
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-50">
                                    <Activity size={48} className="animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-800 mb-2">System Diagnostics</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-10 text-sm">Real-time telemetry and error monitoring across VanaMap cloud clusters.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Response Time</div>
                                        <div className="text-4xl font-black text-slate-800 mb-1">24ms</div>
                                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-full">Excellent</div>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Server Load</div>
                                        <div className="text-4xl font-black text-slate-800 mb-1">4.2%</div>
                                        <div className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-full">Nominal</div>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Search Latency</div>
                                        <div className="text-4xl font-black text-slate-800 mb-1">0.02s</div>
                                        <div className="text-xs font-bold text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded-full">Ultra Fast</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-bold text-slate-200 tracking-wide">Live Telemetry Stream</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                    </div>
                                </div>
                                <div className="p-6 font-mono text-xs text-slate-400 space-y-3 h-72 overflow-y-auto custom-scrollbar bg-slate-900/50">
                                    <div className="flex gap-4 border-l-2 border-slate-700 pl-3 opacity-50"><span className="text-slate-600 w-16">[01:30:12]</span> <span className="text-blue-400 font-bold w-16">INFO</span> <span>API Gateway initialized</span></div>
                                    <div className="flex gap-4 border-l-2 border-emerald-500/50 pl-3 bg-emerald-500/5 py-1"><span className="text-slate-500 w-16">[01:30:15]</span> <span className="text-emerald-400 font-bold w-16">SUCCESS</span> <span className="text-slate-300">Database connection established (MongoDB Cluster)</span></div>
                                    <div className="flex gap-4 border-l-2 border-slate-700 pl-3"><span className="text-slate-600 w-16">[01:31:02]</span> <span className="text-blue-400 font-bold w-16">INFO</span> <span>Cache: Purged 14 expired sessions</span></div>
                                    <div className="flex gap-4 border-l-2 border-amber-500/50 pl-3"><span className="text-slate-600 w-16">[01:32:45]</span> <span className="text-amber-400 font-bold w-16">WARN</span> <span>High latency detected on region: ap-south-1</span></div>
                                    <div className="flex gap-4 border-l-2 border-slate-700 pl-3"><span className="text-slate-600 w-16">[01:35:10]</span> <span className="text-blue-400 font-bold w-16">INFO</span> <span>User authentication token refreshed</span></div>
                                    <div className="flex gap-4 border-l-2 border-emerald-500/50 pl-3 py-1"><span className="text-slate-500 w-16">[01:38:22]</span> <span className="text-emerald-400 font-bold w-16">VITAL</span> <span className="text-emerald-200">System running at optimal performance (99.9% health)</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className={styles.contentArea}>
                            <div className={styles.header}>
                                <h2>User & Vendor Management</h2>
                                <p className="text-slate-400">Monitor active sessions and registered accounts from MongoDB.</p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
                                {/* VENDORS COLUMN */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 shadow-lg shadow-slate-900/10"><Sparkles size={20} /></div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-lg tracking-tight">Partner Network</h3>
                                                <p className="text-xs text-slate-500 font-medium">Verified botanical suppliers</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100/50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">{vendors.length} Active</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {vendors.map(v => (
                                            <div key={v.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-emerald-400 font-black text-xl shadow-lg border border-slate-700">
                                                        {v.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-slate-900 text-base truncate pr-8 group-hover:text-emerald-700 transition-colors">{v.name}</h4>
                                                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100/50">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium mt-1 mb-3 flex items-center gap-1.5">
                                                            <MapPin size={12} /> {v.address || 'Global HQ'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* USERS COLUMN */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-white border border-slate-200 rounded-xl text-indigo-600 shadow-sm"><Users size={20} /></div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-lg tracking-tight">Community Access</h3>
                                                <p className="text-xs text-slate-500 font-medium">Registered platform users</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100">{users.filter(u => u.role !== 'vendor').length} Users</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {users.filter(u => u.role !== 'vendor').map(u => (
                                            <div key={u.id} className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-white group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">{u.name}</h4>
                                                    <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 uppercase tracking-wider group-hover:border-slate-200">Standard</span>
                                            </div>
                                        ))}
                                        {users.filter(u => u.role !== 'vendor').length === 0 && (
                                            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-slate-100">
                                                    <Users size={28} />
                                                </div>
                                                <p className="text-slate-500 font-bold text-sm">No community members yet</p>
                                                <p className="text-xs text-slate-400 mt-1">Invite users to grow the platform</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'plants' && (
                        <div className="animate-fade-in">
                            {/* PLANT FORM PRO */}
                            <div className={`${styles['premium-card']} p - 8 mb - 12 relative overflow - hidden group`}>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                                <h3 className={`text - 2xl font - black mb - 8 flex items - center justify - between relative z - 10 ${styles['glow-text']} `}>
                                    <span className="flex items-center gap-3">
                                        <Database className="text-emerald-400" />
                                        {isEditing ? `Refining: ${formData.name} ` : 'Catalog New Species'}
                                    </span>
                                    {isEditing && (
                                        <button
                                            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                                            className="text-[10px] uppercase tracking-widest flex items-center gap-1.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full transition-all border border-red-500/20 hover:scale-105"
                                        >
                                            <LogOut size={12} className="rotate-180" /> Abort Edit
                                        </button>
                                    )}
                                </h3>

                                <form onSubmit={handlePlantSubmit} className="space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        {/* LEFT COLUMN: IDENTITY & BIOLOGY */}
                                        <div className="lg:col-span-8 space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-4">I. Botanical Identity</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className={`${styles['premium-box']} focus - within: ring - 2 ring - emerald - 500 / 10`}>
                                                        <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Common Nomenclature</label>
                                                        <input className={`${styles.input} text - xl`} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Fiddle Leaf Fig" required />
                                                    </div>
                                                    <div className={`${styles['premium-box']} flex items - center gap - 4`}>
                                                        <div className="flex-1">
                                                            <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Scientific Taxonomy</label>
                                                            <input className={`${styles.input} text - sm font - medium italic`} value={formData.scientificName} onChange={e => setFormData({ ...formData, scientificName: e.target.value })} placeholder="e.g. Ficus lyrata" required />
                                                        </div>
                                                        <Button type="button" onClick={handleSmartFetch} size="sm" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-100 p-2.5 rounded-xl transition-all shadow-sm">
                                                            <Search size={16} strokeWidth={2.5} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className={styles['premium-box']}>
                                                    <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Classification</label>
                                                    <select className={`${styles.select} `} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                                                        <option value="indoor">Indoor (Houseplant)</option>
                                                        <option value="outdoor">Outdoor (Wild)</option>
                                                    </select>
                                                </div>
                                                <div className={styles['premium-box']}>
                                                    <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Market Price</label>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-slate-800 font-bold text-lg">₹</span>
                                                        <input type="number" className={`${styles.input} text - lg`} value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
                                                    </div>
                                                </div>
                                                <div className={styles['premium-box']}>
                                                    <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Origin Ecosystem</label>
                                                    <input className={`${styles.input} text - base`} value={formData.ecosystem || ''} onChange={e => setFormData({ ...formData, ecosystem: e.target.value })} placeholder="e.g. Mediterranean" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] mb-4">II. Environmental Parameters</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className={styles['premium-box']}>
                                                        <div className="flex justify-between items-center mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                            <span>Vital Temp</span>
                                                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{formData.idealTempMin}-{formData.idealTempMax}°C</span>
                                                        </div>
                                                        <div className="space-y-4 px-1">
                                                            <input type="range" min="0" max="40" value={formData.idealTempMin} onChange={e => setFormData({ ...formData, idealTempMin: Number(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all" />
                                                            <input type="range" min="10" max="50" value={formData.idealTempMax} onChange={e => setFormData({ ...formData, idealTempMax: Number(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all" />
                                                        </div>
                                                    </div>
                                                    <div className={styles['premium-box']}>
                                                        <div className="flex justify-between items-center mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                            <span>Moisure</span>
                                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{formData.minHumidity}%+</span>
                                                        </div>
                                                        <input type="range" min="10" max="100" value={formData.minHumidity} onChange={e => setFormData({ ...formData, minHumidity: Number(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all" />
                                                        <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between px-1">
                                                            <span>Arid</span>
                                                            <span>Tropical</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: MEDIA & ACTION */}
                                        <div className="lg:col-span-4 space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-purple-500/50 uppercase tracking-[0.2em] mb-4">III. Visual Asset</h4>
                                                <div className="relative group/img overflow-hidden rounded-2xl border border-slate-700/50 aspect-square bg-slate-900/40">
                                                    {formData.imageUrl ? (
                                                        <img src={formData.imageUrl} alt="Ref" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                                            <ImageIcon size={48} className="mb-4 opacity-30" />
                                                            <span className="text-[10px] uppercase tracking-widest font-bold">No Image</span>
                                                        </div>
                                                    )}
                                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                                        <div className="text-white text-[10px] font-black uppercase tracking-widest bg-emerald-500 px-6 py-3 rounded-full shadow-xl">Source Image</div>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.2em] mb-4">IV. Metadata</h4>
                                                <textarea
                                                    className={`${styles.input} h - 32 bg - slate - 50 border border - slate - 200 rounded - xl p - 4 text - sm resize - none focus: ring - 2 focus: ring - emerald - 500 / 20 focus: border - emerald - 500 transition - all`}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Synthesize species characteristics and lore..."
                                                />
                                            </div>

                                            <div className="pt-6">
                                                <Button type="submit" className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-500/20 group-hover:scale-[1.02] transition-transform">
                                                    {isEditing ? 'Push Data Updates' : 'Commit To Registry'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* PLANTS CATALOGUE FEED */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                <div className="flex items-center gap-1 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    {['all', 'indoor', 'outdoor'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setPlantFilter(f as any)}
                                            className={`px - 6 py - 2.5 rounded - xl text - [11px] font - bold uppercase tracking - wider transition - all ${plantFilter === f
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                } `}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-96 group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="SEARCH SPECIES..."
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={`${styles['animate-staggered']} pb - 32`}>
                                {plants.filter(p => (plantFilter === 'all' || p.type === plantFilter) && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()))).map((p, index) => (
                                    <div
                                        key={p.id}
                                        className={styles['premium-card']}
                                        style={{ animationDelay: `${index * 0.1} s` }}
                                    >
                                        <div className={styles['image-container']}>
                                            <img src={p.imageUrl} alt="" className={styles['plant-image']} />
                                            {/* Top Badges */}
                                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                                <span className={`px - 3 py - 1.5 rounded - 3xl text - [10px] font - bold uppercase tracking - wide backdrop - blur - md shadow - sm border border - white / 40 ${p.type === 'indoor' ? 'bg-white/90 text-indigo-600' : 'bg-white/90 text-orange-600'} `}>
                                                    {p.type}
                                                </span>
                                                {(p.price || 0) > 800 && <span className="bg-white/90 text-purple-600 px-3 py-1.5 rounded-3xl text-[10px] font-bold uppercase tracking-wide backdrop-blur-md shadow-sm border border-white/40">Premium</span>}
                                            </div>

                                            {/* Edit Overlay */}
                                            <div className={styles['edit-overlay']}>
                                                <button onClick={() => startEdit(p)} className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-xl hover:scale-110">
                                                    <Edit size={22} />
                                                </button>
                                                <button onClick={() => deletePlantHandler(p.id, p.name)} className="w-12 h-12 rounded-2xl bg-white text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl hover:scale-110">
                                                    <Trash2 size={22} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-emerald-600 transition-colors tracking-tight">{p.name}</h3>
                                                    <p className="text-xs text-slate-500 font-serif italic flex items-center gap-1.5">
                                                        <Leaf size={12} className="text-emerald-500" /> {p.scientificName || 'Unclassified'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-base font-black text-slate-800">₹{p.price}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 mt-auto">
                                                <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors">
                                                    <Sun size={16} className="text-amber-500 mb-1" />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{p.sunlight}</span>
                                                </div>
                                                <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors">
                                                    <Droplets size={16} className="text-blue-500 mb-1" />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{p.minHumidity}%</span>
                                                </div>
                                                <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors">
                                                    <Thermometer size={16} className="text-rose-500 mb-1" />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{p.idealTempMin}°C</span>
                                                </div>
                                            </div>

                                            {p.isNocturnal && (
                                                <div className="mt-4 flex items-center gap-2 justify-center text-[9px] font-bold uppercase tracking-wide text-purple-600 bg-purple-50 py-2.5 rounded-xl border border-purple-100">
                                                    <Sparkles size={12} /> Night Purifier
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {plants.length === 0 && (
                                <div className="col-span-full py-32 text-center border border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 backdrop-blur">
                                    <div className="flex justify-center mb-6"><Sprout size={64} className="text-slate-300" /></div>
                                    <h3 className="text-xl font-bold text-slate-700 uppercase tracking-wide mb-2">Registry Empty</h3>
                                    <p className="text-slate-500 mb-8 text-sm font-medium">No botanical data found matching these parameters.</p>
                                    <Button onClick={handleBulkImport} variant="outline" className="border-slate-200 text-slate-600 hover:text-emerald-500 hover:border-emerald-500 hover:bg-white px-8 h-12 rounded-xl transition-all shadow-sm">Initialize Default Data</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
};
