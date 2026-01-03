import { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { addPlant, fetchPlants, chatWithDrFlora } from '../../services/api';
import { AdminLayout } from './AdminLayout';
import { Search, Upload, Thermometer, Wind, Droplets, Leaf, ArrowRight, Sparkles, ScanLine, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INDIAN_PLANT_DB } from '../../data/indianPlants';
import type { Plant } from '../../types';
import { PlantCard } from '../../components/features/plants/PlantCard';
import styles from './AddPlant.module.css';

// --- HELPERS ---
const smartFillPlant = (sciName: string) => {
    const search = sciName.toLowerCase().trim();
    if (!search) return null;

    const entries = Object.entries(INDIAN_PLANT_DB);
    const found = entries.find(([key, val]) => {
        return key.includes(search) || val.name?.toLowerCase().includes(search);
    });

    if (found) {
        const [key, data] = found;
        return {
            ...(data as any),
            scientificName: key,
            name: data.name,
            type: data.type || 'indoor',
            sunlight: data.sunlight || 'medium'
        };
    }
    return null;
};

// AI-powered plant data extraction
const extractPlantDataFromAI = (aiResponse: string): Partial<Plant> => {
    const data: Partial<Plant> = {};

    // Extract scientific name - multiple strategies for robustness
    // Strategy 1: Look for "Scientific Name:" label
    let sciMatch = aiResponse.match(/scientific name[:\s]+([A-Z][a-z]+(?:\s+[a-z]+)?(?:\s+[a-z]+)?)/i);
    if (sciMatch) {
        data.scientificName = sciMatch[1].trim();
    } else {
        // Strategy 2: Look for binomial nomenclature pattern (Genus species)
        sciMatch = aiResponse.match(/\b([A-Z][a-z]+\s+[a-z]+)\b/);
        if (sciMatch && !sciMatch[1].match(/Common Name|Type|Indoor|Outdoor|Description|Benefits|Medicinal/i)) {
            data.scientificName = sciMatch[1].trim();
        }
    }

    // Strategy 3: If still not found, check first few lines for binomial name
    if (!data.scientificName) {
        const firstLines = aiResponse.split('\n').slice(0, 3).join(' ');
        const binomialMatch = firstLines.match(/\b([A-Z][a-z]+\s+[a-z]+)\b/);
        if (binomialMatch && !binomialMatch[1].match(/Common Name|Type|Indoor|Outdoor/i)) {
            data.scientificName = binomialMatch[1].trim();
        }
    }

    // Extract common name
    const nameMatch = aiResponse.match(/common name[:\s]+([^\n.]+)/i);
    if (nameMatch) data.name = nameMatch[1].trim();

    // Extract description
    const descMatch = aiResponse.match(/(?:description|about)[:\s]+([^\n]+(?:\n[^\n]+)*?)(?=\n\n|\n[A-Z]|$)/i);
    if (descMatch) data.description = descMatch[1].trim().replace(/\n/g, ' ').substring(0, 500);

    // Extract type
    if (aiResponse.match(/\b(indoor|houseplant)\b/i)) data.type = 'indoor';
    if (aiResponse.match(/\b(outdoor|garden)\b/i)) data.type = 'outdoor';

    // Extract sunlight
    if (aiResponse.match(/\b(full sun|direct sunlight|direct sun)\b/i)) data.sunlight = 'direct';
    else if (aiResponse.match(/\b(bright|high light)\b/i)) data.sunlight = 'high';
    else if (aiResponse.match(/\b(medium|moderate|partial|indirect)\b/i)) data.sunlight = 'medium';
    else if (aiResponse.match(/\b(low light|shade)\b/i)) data.sunlight = 'low';

    // Extract temperature
    const tempMatch = aiResponse.match(/(\d+)[-–to\s]+(\d+)\s*°?[CF]/i);
    if (tempMatch) {
        let min = parseInt(tempMatch[1]);
        let max = parseInt(tempMatch[2]);
        if (min > 50) { min = Math.round((min - 32) * 5 / 9); max = Math.round((max - 32) * 5 / 9); }
        data.idealTempMin = min;
        data.idealTempMax = max;
    } else { data.idealTempMin = 18; data.idealTempMax = 30; }

    // Extract humidity
    const humidMatch = aiResponse.match(/humidity[:\s]+(\d+)/i);
    if (humidMatch) data.minHumidity = parseInt(humidMatch[1]);
    else if (aiResponse.match(/\bhigh humidity\b/i)) data.minHumidity = 70;
    else if (aiResponse.match(/\bmoderate humidity\b/i)) data.minHumidity = 50;
    else data.minHumidity = 40;

    // Extract oxygen level
    if (aiResponse.match(/\b(excellent|very high|purifier|air purifying)\b/i)) data.oxygenLevel = 'very-high';
    else if (aiResponse.match(/\bhigh oxygen\b/i)) data.oxygenLevel = 'high';
    else data.oxygenLevel = 'moderate';

    // Extract price
    const priceMatch = aiResponse.match(/(?:price|cost|₹|Rs\.?)[:\s]*(\d+)/i);
    data.price = priceMatch ? parseInt(priceMatch[1]) : 150;

    // Extract medicinal values
    const medMatch = aiResponse.match(/medicinal[:\s]+([^\n]+)/i);
    if (medMatch) data.medicinalValues = medMatch[1].split(/[,;]/).map(v => v.trim()).filter(Boolean);

    // Extract advantages
    const advMatch = aiResponse.match(/(?:benefits?|advantages?|uses)[:\s]+([^\n]+(?:\n[^\n]+)*?)(?=\n\n|\n[A-Z]|$)/i);
    if (advMatch) data.advantages = advMatch[1].split(/[,;.\n]/).map(v => v.trim().replace(/^[-•*]\s*/, '')).filter(v => v.length > 5 && v.length < 100);

    // Extract lifespan
    const lifeMatch = aiResponse.match(/lifespan[:\s]+([^\n.]+)/i);
    if (lifeMatch) data.lifespan = lifeMatch[1].trim();
    else if (aiResponse.match(/\bperennial\b/i)) data.lifespan = 'Perennial (10+ years)';
    else if (aiResponse.match(/\bannual\b/i)) data.lifespan = 'Annual (1 year)';

    // Extract leaf shape
    const leafMatch = aiResponse.match(/leaf shape[:\s]+([^\n.]+)/i);
    if (leafMatch) data.leafShape = leafMatch[1].trim();
    else if (aiResponse.match(/\bovate\b/i)) data.leafShape = 'Ovate';

    // Extract stem structure
    const stemMatch = aiResponse.match(/stem[:\s]+([^\n.]+)/i);
    if (stemMatch) data.stemStructure = stemMatch[1].trim();
    else if (aiResponse.match(/\bwoody\b/i)) data.stemStructure = 'Woody';
    else if (aiResponse.match(/\bherbaceous\b/i)) data.stemStructure = 'Herbaceous';
    else if (aiResponse.match(/\bsucculent\b/i)) data.stemStructure = 'Succulent';

    // Extract growth habit
    const habitMatch = aiResponse.match(/(?:growth habit|habit)[:\s]+([^\n.]+)/i);
    if (habitMatch) data.overallHabit = habitMatch[1].trim();
    else if (aiResponse.match(/\b(climbing|vine)\b/i)) data.overallHabit = 'Climbing';
    else if (aiResponse.match(/\bbushy\b/i)) data.overallHabit = 'Bushy';
    else if (aiResponse.match(/\bupright\b/i)) data.overallHabit = 'Upright';

    // Extract foliage texture
    if (aiResponse.match(/\bglossy\b/i)) data.foliageTexture = 'Glossy';
    else if (aiResponse.match(/\bmatte\b/i)) data.foliageTexture = 'Matte';
    else if (aiResponse.match(/\bfuzzy\b/i)) data.foliageTexture = 'Fuzzy';

    // Extract distinctive features
    const featMatch = aiResponse.match(/(?:distinctive|features?)[:\s]+([^\n]+(?:\n[^\n]+)*?)(?=\n\n|\n[A-Z]|$)/i);
    if (featMatch) data.biometricFeatures = featMatch[1].split(/[,;.\n]/).map(v => v.trim().replace(/^[-•*]\s*/, '')).filter(v => v.length > 5 && v.length < 80);

    // Extract pet safety
    if (aiResponse.match(/\b(pet safe|pet friendly|non-toxic to pets|safe for pets)\b/i)) {
        data.petFriendly = true;
    } else if (aiResponse.match(/\b(toxic to pets|poisonous to pets|harmful to pets|not pet safe)\b/i)) {
        data.petFriendly = false;
    }

    // Extract nocturnal/CAM photosynthesis
    if (aiResponse.match(/\b(CAM|nocturnal|night oxygen|produces oxygen at night)\b/i)) {
        data.isNocturnal = true;
    }

    // Extract ecosystem
    if (aiResponse.match(/\b(tropical|rainforest)\b/i)) data.ecosystem = 'Tropical';
    else if (aiResponse.match(/\b(desert|arid)\b/i)) data.ecosystem = 'Desert';
    else if (aiResponse.match(/\b(temperate|woodland)\b/i)) data.ecosystem = 'Temperate';
    else if (aiResponse.match(/\b(mediterranean)\b/i)) data.ecosystem = 'Mediterranean';

    return data;
};

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
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
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const AddPlant = () => {
    const [scientificNameSearch, setScientificNameSearch] = useState('');

    const [newPlant, setNewPlant] = useState<Partial<Plant>>({
        name: '',
        scientificName: '',
        description: '',
        imageUrl: '',
        price: 0,
        type: 'indoor',
        sunlight: 'medium',
        idealTempMin: 18,
        idealTempMax: 30,
        minHumidity: 40,
        oxygenLevel: 'high',
        medicinalValues: [],
        advantages: [],
        foliageTexture: '',
        leafShape: '',
        stemStructure: '',
        overallHabit: '',
        biometricFeatures: [],
        lifespan: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [aiLoading, setAiLoading] = useState(false);

    const handleAIAutoFill = async () => {
        if (!scientificNameSearch.trim()) {
            toast.error("Please enter a plant name first");
            return;
        }

        setAiLoading(true);
        const tid = toast.loading("🤖 Dr. Flora is researching...");

        try {
            // Create a structured prompt for Dr. Flora
            const prompt = `Please provide comprehensive information about the plant: "${scientificNameSearch}". 

IMPORTANT: Start your response with the scientific name in binomial nomenclature format (Genus species).

Include the following details in a structured format:
- Scientific Name: (MUST be in binomial nomenclature format, e.g., Rosa damascena)
- Common Name:
- Description: (2-3 sentences about the plant)
- Type: (indoor or outdoor)
- Sunlight: (low, medium, high, or direct)
- Temperature Range: (in Celsius, format: XX-XX°C)
- Humidity: (percentage)
- Oxygen Level: (low, moderate, high, or very-high)
- Pet Safety: (Is it safe for pets? toxic or non-toxic)
- CAM Photosynthesis: (Does it produce oxygen at night?)
- Ecosystem: (Tropical, Desert, Temperate, or Mediterranean)
- Medicinal Values: (comma-separated list)
- Benefits/Advantages: (comma-separated list)
- Lifespan: (e.g., Perennial, Annual, etc.)
- Leaf Shape: (e.g., Ovate, Lanceolate)
- Stem Structure: (e.g., Woody, Herbaceous)
- Growth Habit: (e.g., Climbing, Bushy)
- Distinctive Features: (comma-separated)

Please be specific and accurate.`;

            const response = await chatWithDrFlora(
                [{ role: 'user', content: prompt }],
                { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
            );

            const aiText = response.choices?.[0]?.message?.content;

            if (!aiText) {
                toast.error("Dr. Flora couldn't find information", { id: tid });
                return;
            }

            // Extract data from AI response
            const extractedData = extractPlantDataFromAI(aiText);

            // Merge with existing data
            setNewPlant(prev => ({
                ...prev,
                ...extractedData,
                // Preserve existing values if AI didn't provide them
                name: extractedData.name || prev.name,
                scientificName: extractedData.scientificName || prev.scientificName,
                description: extractedData.description || prev.description,
                type: extractedData.type || prev.type,
                sunlight: extractedData.sunlight || prev.sunlight,
                price: extractedData.price || prev.price,
                idealTempMin: extractedData.idealTempMin || prev.idealTempMin,
                idealTempMax: extractedData.idealTempMax || prev.idealTempMax,
                minHumidity: extractedData.minHumidity || prev.minHumidity,
                oxygenLevel: extractedData.oxygenLevel || prev.oxygenLevel,
                medicinalValues: extractedData.medicinalValues || prev.medicinalValues,
                advantages: extractedData.advantages || prev.advantages,
                lifespan: extractedData.lifespan || prev.lifespan,
                leafShape: extractedData.leafShape || prev.leafShape,
                stemStructure: extractedData.stemStructure || prev.stemStructure,
                overallHabit: extractedData.overallHabit || prev.overallHabit,
                foliageTexture: extractedData.foliageTexture || prev.foliageTexture,
                biometricFeatures: extractedData.biometricFeatures || prev.biometricFeatures
            }));

            toast.success(`✨ Auto-filled by Dr. Flora!`, { id: tid });
            console.log('[AI Auto-Fill] Extracted data:', extractedData);
            console.log('[AI Auto-Fill] Full response:', aiText);

        } catch (error) {
            console.error('[AI Auto-Fill] Error:', error);
            toast.error("Dr. Flora is unavailable. Try manual entry.", { id: tid });
        } finally {
            setAiLoading(false);
        }
    };

    const handleSmartFill = () => {
        if (!scientificNameSearch) return;
        const found = smartFillPlant(scientificNameSearch);
        if (found) {
            setNewPlant(prev => ({
                ...prev,
                name: found.name || prev.name,
                scientificName: found.scientificName,
                description: found.description || prev.description,
                type: (found.type === 'herb' ? 'outdoor' : found.type) as any,
                sunlight: found.sunlight as any,
                idealTempMin: found.idealTempMin || prev.idealTempMin,
                idealTempMax: found.idealTempMax || prev.idealTempMax,
                minHumidity: found.minHumidity || prev.minHumidity,
                oxygenLevel: found.oxygenLevel as any || prev.oxygenLevel,
                medicinalValues: found.medicinalValues || [],
                advantages: found.advantages || []
            }));
            toast.success(`Populated: ${found.name}`, { icon: '✨' });
        } else {
            toast.error("Specimen not found in database.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tid = toast.loading("Processing...");
        try {
            const compressedBase64 = await compressImage(file);
            setNewPlant({ ...newPlant, imageUrl: compressedBase64 });
            toast.success("Image Set", { id: tid });
        } catch (err) {
            toast.error("Image Error", { id: tid });
        }
    };

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Saving Specimen...");
        try {
            // Check for existing scientific name
            const existingPlants = await fetchPlants();
            const isDuplicate = existingPlants.some(p =>
                p.scientificName?.toLowerCase().trim() === newPlant.scientificName?.toLowerCase().trim()
            );

            if (isDuplicate) {
                toast.error("The plant is already enrolled", { id: tid });
                return;
            }

            const plantData: Plant = {
                id: crypto.randomUUID(),
                name: newPlant.name || 'Unknown',
                scientificName: newPlant.scientificName || 'Unknown',
                description: newPlant.description || 'No description.',
                imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop',
                price: Number(newPlant.price),
                type: newPlant.type as any || 'indoor',
                sunlight: newPlant.sunlight as any || 'medium',
                idealTempMin: Number(newPlant.idealTempMin),
                idealTempMax: Number(newPlant.idealTempMax),
                minHumidity: Number(newPlant.minHumidity),
                oxygenLevel: newPlant.oxygenLevel as any || 'moderate',
                medicinalValues: newPlant.medicinalValues || [],
                advantages: newPlant.advantages || [],
                isNocturnal: false,
                foliageTexture: newPlant.foliageTexture,
                leafShape: newPlant.leafShape,
                stemStructure: newPlant.stemStructure,
                overallHabit: newPlant.overallHabit,
                biometricFeatures: newPlant.biometricFeatures || [],
                lifespan: newPlant.lifespan || 'Unknown'
            };
            await addPlant(plantData);
            toast.success("Specimen Registered", { id: tid });

            // Reset
            setNewPlant({
                name: '', scientificName: '', imageUrl: '', price: 0,
                type: 'indoor', sunlight: 'medium', description: '',
                idealTempMin: 18, idealTempMax: 30, minHumidity: 40,
                oxygenLevel: 'high', medicinalValues: [], advantages: [],
                foliageTexture: '', leafShape: '', stemStructure: '', overallHabit: '', biometricFeatures: [], lifespan: ''
            });
            setScientificNameSearch('');
        } catch (err) {
            toast.error("Save Failed", { id: tid });
        }
    };

    const previewPlant: Plant = {
        id: 'preview',
        name: newPlant.name || 'Botanic Name',
        scientificName: newPlant.scientificName || 'Scientific classification',
        description: newPlant.description || 'Plant description will appear here...',
        imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop',
        price: Number(newPlant.price),
        type: newPlant.type as any || 'indoor',
        sunlight: newPlant.sunlight as any || 'medium',
        idealTempMin: 18, idealTempMax: 30,
        minHumidity: Number(newPlant.minHumidity),
        oxygenLevel: newPlant.oxygenLevel as any || 'moderate',
        medicinalValues: [], advantages: [], isNocturnal: false
    };

    return (
        <AdminLayout title="Add New Specimen">
            <div className={styles.pageContainer}>

                <div className={styles.mainLayout}>
                    {/* --- LEFT PANEL: VISUAL & PREVIEW --- */}
                    <div className={styles.previewPanel}>
                        {/* Dynamic Background */}
                        <div
                            className={styles.previewBg}
                            style={{
                                backgroundImage: `url(${newPlant.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop'})`
                            }}
                        />

                        {/* 3D Card Containment */}
                        <div className={styles.cardWrapper}>
                            <PlantCard plant={previewPlant} onAdd={() => { }} />
                        </div>

                        {/* Interactive Overlay */}
                        <div className={styles.uploadOverlay}>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-black hover:bg-slate-200 shadow-xl mb-4"
                            >
                                <Upload size={18} className="mr-2" /> Upload Photo
                            </Button>

                            <div className="w-64">
                                <span className="text-xs text-slate-300 font-medium mb-1 block text-center">Or paste external URL</span>
                                <input
                                    value={newPlant.imageUrl}
                                    onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-1.5 text-xs text-white outline-none text-center focus:border-emerald-500 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-widest z-10 opacity-70">
                            <Sparkles size={12} className="text-emerald-400" /> Live Preview
                        </div>
                    </div>

                    {/* --- RIGHT PANEL: FORM --- */}
                    <div className={styles.formPanel}>
                        <form onSubmit={handleAddPlant}>

                            {/* 1. Smart Search */}
                            <div className={styles.smartSearchWrapper}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <label className="text-sm text-emerald-500 font-bold uppercase tracking-wider">Quick Populator</label>
                                    <div className="flex gap-2">
                                        {scientificNameSearch && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleSmartFill}
                                                    className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full uppercase font-bold tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                                                >
                                                    DB Fill <ArrowRight size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleAIAutoFill}
                                                    disabled={aiLoading}
                                                    className="text-xs bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full uppercase font-bold tracking-widest hover:bg-violet-500/20 transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {aiLoading ? (
                                                        <>
                                                            <span className="animate-spin">⚙️</span> AI Thinking...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bot size={12} /> AI Auto-Fill
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        value={scientificNameSearch}
                                        onChange={(e) => setScientificNameSearch(e.target.value)}
                                        placeholder="Type a plant name (e.g. Tulsi, Rose, Aloe Vera)..."
                                        className={styles.smartSearchInput}
                                    />
                                    <Search size={22} className={styles.smartSearchIcon} />
                                </div>
                            </div>

                            {/* 2. Primary Identity */}
                            <div className="mb-10">
                                <div className={styles.sectionTitle}>
                                    <Leaf size={18} /> Identity
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Common Name</label>
                                        <input
                                            value={newPlant.name}
                                            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Peace Lily"
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Scientific Name</label>
                                        <input
                                            value={newPlant.scientificName}
                                            onChange={(e) => setNewPlant({ ...newPlant, scientificName: e.target.value })}
                                            className={`${styles.glassInput} italic`}
                                            placeholder="e.g. Spathiphyllum"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Description</label>
                                        <textarea
                                            value={newPlant.description}
                                            onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                                            className={styles.glassTextarea}
                                            placeholder="Describe the plant's origin, care needs, and unique features..."
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Expected Lifespan</label>
                                        <input
                                            value={newPlant.lifespan}
                                            onChange={(e) => setNewPlant({ ...newPlant, lifespan: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Perennial (10+ Years), Annual"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Biometric Profile */}
                            <div className="mb-10">
                                <div className={styles.sectionTitle}>
                                    <ScanLine size={18} /> Biometric Profile
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Leaf Shape</label>
                                        <input
                                            value={newPlant.leafShape}
                                            onChange={(e) => setNewPlant({ ...newPlant, leafShape: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Ovate, Lanceolate"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Stem Structure</label>
                                        <input
                                            value={newPlant.stemStructure}
                                            onChange={(e) => setNewPlant({ ...newPlant, stemStructure: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Woody, Succulent"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Growth Habit</label>
                                        <input
                                            value={newPlant.overallHabit}
                                            onChange={(e) => setNewPlant({ ...newPlant, overallHabit: e.target.value })}
                                            className={styles.glassInput}
                                            placeholder="e.g. Climbing, Bushy"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Distinctive Features</label>
                                        <input
                                            value={newPlant.biometricFeatures?.join(', ')}
                                            onChange={(e) => setNewPlant({ ...newPlant, biometricFeatures: e.target.value.split(',').map(s => s.trim()) })}
                                            className={styles.glassInput}
                                            placeholder="Comma separated e.g. Serrated edges"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Vital Metrics */}
                            <div className="mb-10">
                                <div className={styles.sectionTitle}>
                                    <Thermometer size={18} className="text-amber-500" /> Vital Metrics
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Environment Type</label>
                                        <select
                                            value={newPlant.type}
                                            onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value as any })}
                                            className={styles.glassSelect}
                                        >
                                            <option value="indoor">Indoor</option>
                                            <option value="outdoor">Outdoor</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Base Price (Rs)</label>
                                        <input
                                            type="number"
                                            value={newPlant.price}
                                            onChange={(e) => setNewPlant({ ...newPlant, price: Number(e.target.value) })}
                                            className={styles.glassInput}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Sunlight Control */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Sunlight Requirement</label>
                                    <div className={styles.segmentedControl}>
                                        {['low', 'medium', 'high', 'direct'].map(lvl => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setNewPlant({ ...newPlant, sunlight: lvl as any })}
                                                className={`${styles.segmentBtn} ${newPlant.sunlight === lvl ? styles.segmentBtnActive : ''}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sliders & Advanced */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                                <Droplets size={14} className="text-blue-400" /> Humidity
                                            </label>
                                            <span className="text-sm font-mono text-blue-400 font-bold">{newPlant.minHumidity}%</span>
                                        </div>
                                        <div className={styles.rangeWrapper}>
                                            <input
                                                type="range" min="0" max="100" step="10"
                                                value={newPlant.minHumidity}
                                                onChange={(e) => setNewPlant({ ...newPlant, minHumidity: Number(e.target.value) })}
                                                className={styles.rangeInput}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 mb-3">
                                            <Wind size={14} className="text-purple-400" /> Oxygen Output
                                        </label>
                                        <select
                                            value={newPlant.oxygenLevel}
                                            onChange={(e) => setNewPlant({ ...newPlant, oxygenLevel: e.target.value as any })}
                                            className={styles.glassSelect}
                                        >
                                            <option value="low">Low</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="high">High</option>
                                            <option value="very-high">Purifier (Very High)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                                <Thermometer size={14} className="text-amber-400" /> Ideal Temp (Min)
                                            </label>
                                            <span className="text-sm font-mono text-amber-400 font-bold">{newPlant.idealTempMin}°C</span>
                                        </div>
                                        <div className={styles.rangeWrapper}>
                                            <input
                                                type="range" min="0" max="40" step="1"
                                                value={newPlant.idealTempMin}
                                                onChange={(e) => setNewPlant({ ...newPlant, idealTempMin: Number(e.target.value) })}
                                                className={styles.rangeInput}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                                                <Thermometer size={14} className="text-red-400" /> Ideal Temp (Max)
                                            </label>
                                            <span className="text-sm font-mono text-red-400 font-bold">{newPlant.idealTempMax}°C</span>
                                        </div>
                                        <div className={styles.rangeWrapper}>
                                            <input
                                                type="range" min="0" max="50" step="1"
                                                value={newPlant.idealTempMax}
                                                onChange={(e) => setNewPlant({ ...newPlant, idealTempMax: Number(e.target.value) })}
                                                className={styles.rangeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Area */}
                            <div className="pt-8 border-t border-slate-700/50 flex justify-end">
                                <button type="submit" className={styles.submitBtn}>
                                    Register Specimen
                                </button>
                            </div>

                        </form>
                    </div>

                </div >
            </div >
        </AdminLayout >
    );
};
