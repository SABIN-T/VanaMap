import { X, Sun, Wind, Droplet, Leaf, Lightbulb, Fan, AlertTriangle, Sparkles, Stethoscope, BookOpen, GraduationCap, Hourglass, ShoppingBag } from 'lucide-react';
import type { Plant } from '../../../types';
import styles from './PlantDetailsModal.module.css';
import { useState, useMemo, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { Button } from '../../common/Button';

interface PlantDetailsModalProps {
    plant: Plant;
    weather: {
        avgTemp30Days?: number;
        avgHumidity30Days?: number;
        [key: string]: any;
    } | null;
    onClose: () => void;
    onBuy?: () => void;
}

export const PlantDetailsModal = ({ plant, weather, onClose, onBuy }: PlantDetailsModalProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // UI States
    const [activeTab, setActiveTab] = useState<'overview' | 'simulation'>('overview');

    // Simulation States
    const [numPeople, setNumPeople] = useState(1);
    const [simulationHours, setSimulationHours] = useState(24); // New State
    const [isACMode, setIsACMode] = useState(false);
    const [targetTemp, setTargetTemp] = useState(22);
    const [lightLevel, setLightLevel] = useState(70);

    // Environment
    const currentTemp = isACMode ? targetTemp : (weather?.avgTemp30Days || 25);
    const currentHumidity = weather?.avgHumidity30Days || 50;


    // ==========================================
    // SCIENTIFIC LOGIC
    // ==========================================
    // ==========================================
    // SCIENTIFIC LOGIC
    // ==========================================

    // Parse the specific L/day from string "30 L/day"

    const temperatureEffect = useMemo(() => {
        const T = currentTemp + 273.15;
        const T_opt = 298.15;
        if (currentTemp < 10 || currentTemp > 42) return 0.1;
        const sigma = 12;
        return Math.max(0.15, Math.exp(-Math.pow(T - T_opt, 2) / (2 * sigma * sigma)));
    }, [currentTemp]);

    const humidityEffect = useMemo(() => {
        if (currentHumidity < 25) return 0.65;
        if (currentHumidity > 85) return 0.8;
        return 1.0;
    }, [currentHumidity]);



    // Formula: (Humans * HourlyNeed * Hours) / (PlantHourlyOutput * Hours)
    // Simplified: (Humans * HourlyNeed) / PlantHourlyOutput
    // Wait, if user wants plants for 1 hour, they need enough plants to produce that much in 1 hour.
    // Actually, "Plants Needed" is constant rate. Rate matches Rate.
    // But if we want to "fill a room" for X hours... let's stick to Rate Matching.
    // Interpreting User Request: "how many hours to change so accordingly the plant changes".
    // Maybe they mean: "How long does it take for X plants to fill the room?" or "How many plants to sustain for X hours is same as 24 hours (rate)".
    // AHH, usually simulation implies "How much Oxygen is accumulated" OR "How many plants to refresh air in X hours".
    // Let's go with: "Plants required to replenish X people's consumption over Y hours".
    // Actually, consumption is continuous.
    // Let's try a "Fresh Air Target" Approach: 
    // "To generate [Hours] worth of fresh air in real-time, you need..." -> No that's same as rate.

    // BETTER INTERPRATION: "Accumulation Mode".
    // "How many plants to produce [Hours] worth of Oxygen in [Hours]?" -> Still rate.

    // GAME INTERPRETATION:
    // User wants to see the number go DOWN if they only need to survive for 1 hour? No.
    // User likely means: "How many plants to purify the room in X hours?" 
    // OR: "If I only stay in the room for X hours, do I need fewer plants?" (Technically no, you still breathe at same rate).

    // LET'S DO THIS: 
    // Total Oxygen Required = People * (550L / 24) * Hours.
    // Plant Output over Duration = (Plant_L_Day / 24) * Hours.
    // The 'Hours' cancels out if we just match rate.

    // ALTERNATIVE (User Experience):
    // Maybe the user thinks "I need less plants for less time".
    // Let's simply show: "Oxygen Produced in [X] Hours" vs "Required in [X] Hours".
    // And calculate plants needed to BREAK EVEN over that window. (It's still the same number).

    // WAIT, let's look at "Air Change".
    // Maybe: "How many plants to scrub the CO2 from X hours of breathing?"
    // Let's stick to the cumulative logic:
    // "To provide {Hours} hours of Oxygen:"
    // It is simply the same rate number.

    // LET'S TRY A "BUFFER" APPROACH for the game feel.
    // If you only need to survive 1 hour, and the room acts as a buffer...
    // No, let's keep it simple: "Oxygen Generated in [X] Hours: [Value] L"
    // And we show if it meets the need.
    // BUT user asked "plant changes accordingly".
    // Let's implement: "Target Duration". 
    // Maybe we treat it as: "I want to generate X hours worth of Oxygen in ONE hour". (Speed charging).
    // OR "I want to offset X hours of occupancy."

    // LETS DO: "Duration of Stay".
    // Actually, scientific fact: Plants produce O2 mostly during day.
    // If you stay 24h, you need night storage.
    // If you stay 8h (day), you can rely on direct production.
    // Let's scale based on "Daylight Hours" overlap? Too complex.

    // SIMPLE UX SOLUTION:
    // Scale the "Goal".
    // "Goal: Generate Oxygen for [X] Hours".
    // If I select 1 Hour, I need [Z] Amount for that session.
    // The visualization shows "Plants needed to produce that amount in... 12 hours?"
    // No.

    // LET'S GO LITERAL: 
    // User asks "how many hours... so plant changes".
    // Let's calculate: Plants Needed = (People * Hours * 23L/hr) / (PlantOutput * Hours).
    // It's mathematically 1:1.
    // UNLESS... we account for "Stored Air".
    // Let's assume the room has NO air.

    // OKAY, let's try a "Purification Speed" angle.
    // "Time to Refresh Room".
    // Slider: "Desired Refresh Time (Hours)".
    // Faster refresh = More plants.
    // Formula: Plants = (RoomVolume / RefreshTime) / PlantHourlyRate.
    // Let's assume Room Volume = 50m3 roughly.

    // Let's pivot to "Occupancy Duration" but visually scale the "Total Load".
    // Let's just show "Total Oxygen Needed for [X] Hours: [Y] Liters".
    // And "Plants to generate this in ONE day". -> This changes the number!
    // "I need 8 hours of oxygen (180L). How many plants to make 180L in a day?"
    // -> 180 / DailyRate.
    // Result: If you only need 8 hours of O2, you need 1/3rd the plants (if they work all day).
    // THIS MAKES SENSE FOR A LAYMAN USER!
    // "I'm only in the office 8 hours." -> Plants work 24h. -> I need fewer plants because they "charge" the room overnight.
    // Formula: Plants = (People * (550/24 * Hours)) / PlantDailyOutput.

    const plantsNeeded = useMemo(() => {
        const hourlyNeedPerPerson = 550 / 24; // ~23L
        const totalNeed = hourlyNeedPerPerson * numPeople * simulationHours; // Total L needed for the duration

        // Plant Daily Output (Assuming they work ~12h effectively, but logic is simplified to 24h cycle avg)
        const plantDailyOutput = parseFloat(plant.oxygenLevel) || 20;
        const adjustedDailyOutput = plantDailyOutput * temperatureEffect * humidityEffect * (lightLevel / 100);

        // How many plants to produce 'totalNeed' in a 24h cycle?
        // (Assuming we bank the O2).
        return Math.max(1, Math.ceil(totalNeed / adjustedDailyOutput));
    }, [numPeople, simulationHours, plant.oxygenLevel, temperatureEffect, humidityEffect, lightLevel]);


    // Stop Propagation Helper
    const stopProp = (e: TouchEvent | MouseEvent) => e.stopPropagation();

    // ==========================================
    // SHARED COMPONENTS
    // ==========================================

    const renderControls = () => (
        <div className={styles.mobileControlsContainer}>
            {/* GPS Warning */}
            <div className={styles.instructionNotice}>
                <AlertTriangle size={16} className="text-yellow-500" style={{ marginTop: 2, flexShrink: 0 }} />
                <div><strong>Pro Tip:</strong> Enable GPS for accurate local climate simulation results.</div>
            </div>

            {/* People */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <span>Occupants</span>
                    <span className={styles.controlValue}>{numPeople}</span>
                </div>
                <input
                    type="range" min="1" max="10" value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                    className={styles.rangeInput}
                />
            </div>

            {/* Simulation Duration */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Hourglass size={14} /> Duration (Hours)</span>
                    <span className={styles.controlValue} style={{ color: '#38bdf8' }}>{simulationHours}h</span>
                </div>
                <input
                    type="range" min="1" max="24" value={simulationHours}
                    onChange={(e) => setSimulationHours(Number(e.target.value))}
                    className={styles.rangeInput}
                    style={{ '--thumb-color': '#38bdf8' } as any}
                />
            </div>

            {/* Light */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lightbulb size={14} /> Light Level</span>
                    <span className={styles.controlValue} style={{ color: '#facc15' }}>{lightLevel}%</span>
                </div>
                <input
                    type="range" min="10" max="100" value={lightLevel}
                    onChange={(e) => setLightLevel(Number(e.target.value))}
                    className={styles.rangeInput}
                    style={{ '--thumb-color': '#facc15' } as any}
                />
            </div>

            {/* AC/Temp */}
            <div className={styles.controlItem}>
                <div className={styles.controlHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Fan size={14} /> AC Control</div>
                    <button
                        onClick={() => setIsACMode(!isACMode)}
                        className={`${styles.toggleSwitch} ${isACMode ? styles.active : ''}`}
                    />
                </div>

                {isACMode ? (
                    <div className="animate-fade-in space-y-2 mt-2">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Target Temp</span>
                            <span className={styles.controlValue}>{targetTemp}°C</span>
                        </div>
                        <input
                            type="range" min="16" max="30" value={targetTemp}
                            onChange={(e) => setTargetTemp(Number(e.target.value))}
                            className={styles.rangeInput}
                        />
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                        Using local weather: <strong style={{ color: '#94a3b8' }}>{weather?.avgTemp30Days || 25}°C</strong>
                    </div>
                )}
            </div>
        </div>
    );

    const renderVisualizer = () => (
        <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', border: '1px dashed rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, zIndex: 2 }}>RESULTS</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '8px', maxWidth: '80%', margin: '1rem 0', zIndex: 2 }}>
                {[...Array(Math.min(plantsNeeded, 12))].map((_, i) => (
                    <div key={i} className="pop-in" style={{
                        width: '32px', height: '32px', background: '#10b981', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
                        animationDelay: `${i * 0.05}s`
                    }}>
                        <Leaf size={14} fill="rgba(255,255,255,0.5)" color="white" />
                    </div>
                ))}
                {plantsNeeded > 12 && <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>+{plantsNeeded - 12}</div>}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '1.5rem', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
                    {plantsNeeded}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>Plants Needed</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>For {numPeople} People (Needs {numPeople * 550}L O₂)</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent 70%)' }}></div>
        </div>
    );

    // ==========================================
    // MOBILE VIEW
    // ==========================================
    if (isMobile) {
        return (
            <div
                className={`${styles.overlay} no-swipe`}
                onClick={onClose}
                onTouchStart={stopProp}
                onTouchMove={stopProp}
                onTouchEnd={stopProp}
                style={{ zIndex: 9999, padding: '10px' }}
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{
                    maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px',
                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                        <img src={plant.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 100%)' }}></div>
                        <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 8, color: 'white', border: 'none' }}>
                            <X size={20} />
                        </button>
                        <div style={{ position: 'absolute', bottom: 10, left: 20 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>{plant.name}</h2>
                            <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: 4 }}>{plant.oxygenLevel} O2</span>
                                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: 4 }}>{plant.sunlight}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className={styles.overviewContainer}>
                            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Overview</h3>
                            <p className={styles.descriptionText}>{plant.description}</p>

                            {/* Mobile Advantages & Medicine */}
                            <div className={styles.infoGrid}>
                                {plant.advantages && plant.advantages.length > 0 && (
                                    <div className={`${styles.infoCard} ${styles.cardGreen}`}>
                                        <div className={`${styles.cardHeader} ${styles.textGreen}`}>
                                            <Sparkles size={16} /> Key Advantages
                                        </div>
                                        <div className={styles.chipsContainer}>
                                            {plant.advantages.map((adv, i) => (
                                                <span key={i} className={`${styles.chip} ${styles.chipGreen}`}>
                                                    {adv}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {plant.medicinalValues && plant.medicinalValues.length > 0 && (
                                    <div className={`${styles.infoCard} ${styles.cardRose}`}>
                                        <div className={`${styles.cardHeader} ${styles.textRose}`}>
                                            <Stethoscope size={16} /> Medicinal Uses
                                        </div>
                                        <div className={styles.chipsContainer}>
                                            {plant.medicinalValues.map((med, i) => (
                                                <span key={i} className={`${styles.chip} ${styles.chipRose}`}>
                                                    {med}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Wind size={20} /> Room Lab
                                </h3>
                                <div className="text-xs text-emerald-400 font-bold border border-emerald-500 rounded px-2">ACTIVE</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {renderControls()}
                                {renderVisualizer()}
                            </div>
                        </div>

                        {onBuy && (
                            <div style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
                                <Button onClick={onBuy} variant="primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                                    <ShoppingBag size={20} style={{ marginRight: '8px' }} /> Buy Now
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
                <style>{`
                    .pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                    @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
            </div>
        );
    }

    // ==========================================
    // DESKTOP VIEW
    // ==========================================
    return (
        <div
            className={`${styles.overlay} no-swipe`}
            onClick={onClose}
            onTouchStart={stopProp}
            onTouchMove={stopProp}
            onTouchEnd={stopProp}
            style={{ zIndex: 9999 }}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>

                    <div style={{ flex: '0 0 45%', position: 'relative', background: '#0f172a' }}>
                        <img src={plant.imageUrl} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%, rgba(0,0,0,0.8))' }}></div>
                        <button onClick={onClose} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                            <X size={24} />
                        </button>
                        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', color: 'white' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{plant.name}</h1>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e293b', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
                                <button onClick={() => setActiveTab('overview')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'overview' ? '#334155' : 'transparent', color: activeTab === 'overview' ? 'white' : '#64748b', transition: 'all 0.2s' }}>Overview</button>
                                <button onClick={() => setActiveTab('simulation')} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'simulation' ? '#334155' : 'transparent', color: activeTab === 'simulation' ? '#38bdf8' : '#64748b', transition: 'all 0.2s' }}>Simulation</button>
                            </div>

                            {/* Desktop Buy Button */}
                            {onBuy && (
                                <button
                                    onClick={onBuy}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        padding: '10px 24px', borderRadius: '12px',
                                        border: 'none', fontWeight: 700, cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                        transition: 'transform 0.2s',
                                        marginRight: '20px' // Added margin to move it left from edge
                                    }}
                                    className="hover-scale"
                                >
                                    <ShoppingBag size={18} /> Buy Now
                                </button>
                            )}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                            {activeTab === 'overview' ? (
                                <div className={`${styles.overviewContainer} animate-fade-in`}>
                                    <p className={styles.descriptionText}>{plant.description}</p>

                                    {/* Desktop Advantages & Medicine */}
                                    <div className={styles.infoGrid}>
                                        {plant.advantages && plant.advantages.length > 0 && (
                                            <div className={`${styles.infoCard} ${styles.cardGreen}`}>
                                                <div className={`${styles.cardHeader} ${styles.textGreen}`}>
                                                    <Sparkles size={16} /> Key Advantages
                                                </div>
                                                <div className={styles.chipsContainer}>
                                                    {plant.advantages.map((adv, i) => (
                                                        <span key={i} className={`${styles.chip} ${styles.chipGreen}`}>
                                                            {adv}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {plant.medicinalValues && plant.medicinalValues.length > 0 && (
                                            <div className={`${styles.infoCard} ${styles.cardRose}`}>
                                                <div className={`${styles.cardHeader} ${styles.textRose}`}>
                                                    <Stethoscope size={16} /> Medicinal Uses
                                                </div>
                                                <div className={styles.chipsContainer}>
                                                    {plant.medicinalValues.map((med, i) => (
                                                        <span key={i} className={`${styles.chip} ${styles.chipRose}`}>
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.statsRow}>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Sun className="text-yellow-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Sunlight</span>
                                                <span className={styles.statValue}>{plant.sunlight}</span>
                                            </div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Droplet className="text-blue-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Water</span>
                                                <span className={styles.statValue}>Weekly</span>
                                            </div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Hourglass className="text-pink-400" /></div>
                                            <div className={styles.statText}>
                                                <span className={styles.statLabel}>Life Exp.</span>
                                                <span className={styles.statValue}>{plant.lifespan || '3-5 Years'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🎓 Educational Deep Dive */}
                                    <div className={styles.educationalSection}>
                                        <div className={styles.eduHeader}>
                                            <GraduationCap size={20} color="#38bdf8" />
                                            <h3>Botanical Deep Dive</h3>
                                        </div>
                                        <div className={styles.eduGrid}>
                                            <div className={styles.eduCard}>
                                                <BookOpen size={16} />
                                                <h4>Scientific Trivia</h4>
                                                <p>Did you know? The {plant.name} uses CAM photosynthesis to purify air even during the nocturnal cycle.</p>
                                            </div>
                                            <div className={styles.eduCard}>
                                                <Sparkles size={16} />
                                                <h4>Beginner Friendly</h4>
                                                <p>Top tip: Avoid overwatering. This species thrives when the top 2 inches of soil are dry.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                    {renderVisualizer()}
                                    {renderControls()}
                                </div>
                            )}
                        </div>

                        {/* Desktop Footer Removed */}
                    </div>
                </div>
            </div>
            <style>{` .animate-fade-in { animation: fadeIn 0.4s ease-out; } `}</style>
        </div>
    );
};


