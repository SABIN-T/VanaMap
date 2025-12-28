
import { useState, useMemo } from 'react';
import { Search, Flower, Leaf, Activity, Database, Cpu } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { worldFlora } from '../../data/worldFlora';

export const SimulationData = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic
    const filteredData = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return worldFlora.filter(p =>
            p.scientificName.toLowerCase().includes(lower) ||
            p.commonName.toLowerCase().includes(lower) ||
            p.flowerType.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    return (
        <AdminLayout title="Global Biometric Database">
            <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#e2e8f0' }}>

                {/* Header / HUD */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: '20px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Database size={24} color="#38bdf8" />
                            <span style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600 }}>Simulation Data Core</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                            World Flora Index
                        </h1>
                        <p style={{ marginTop: '0.5rem', opacity: 0.7, maxWidth: '600px' }}>
                            Comprehensive biomorphological registry containing {worldFlora.length.toLocaleString()} categorized species.
                            Used for high-fidelity simulation and AI training.
                        </p>
                    </div>

                    <div style={{ zIndex: 2, display: 'flex', gap: '2rem', textAlign: 'right' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 700, color: '#38bdf8' }}>{worldFlora.length}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total Records</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>99.9%</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Accuracy</span>
                        </div>
                    </div>

                    {/* BG Decoration */}
                    <div style={{ position: 'absolute', right: -50, top: -50, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '2rem', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search by Scientific Name, Common Name, or Morphology..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 1.2rem 1.2rem 4rem',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '16px',
                            color: 'white',
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />
                </div>

                {/* Data Grid */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #334155',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.75fr 1fr 1fr 1fr 1fr 0.75fr 1.5fr', // Removed ID Ref, added Source
                        padding: '1.25rem 2rem',
                        background: '#0f172a',
                        borderBottom: '1px solid #334155',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#94a3b8'
                    }}>
                        <div>Scientific Name</div>
                        <div>Flower Type</div>
                        <div>Leaf Venation</div>
                        <div>Inflorescence</div>
                        <div>Aptness</div>
                        <div>Rarity</div>
                        <div style={{ textAlign: 'right' }}>Verified Source</div>
                    </div>

                    {/* Scanlines Effect Overlay (Optional, distinct look) */}
                    <div style={{ position: 'relative', maxHeight: '600px', overflowY: 'auto' }}>
                        {filteredData.slice(0, 100).map((plant) => (
                            <div key={plant.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '1.75fr 1fr 1fr 1fr 1fr 0.75fr 1.5fr', // Updated Grid
                                padding: '1rem 2rem',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                alignItems: 'center',
                                transition: '0.2s',
                                cursor: 'default',
                                fontSize: '0.95rem'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{plant.scientificName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{plant.commonName}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                                    <Flower size={14} color="#f472b6" /> {plant.flowerType}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                                    <Leaf size={14} color="#4ade80" /> {plant.leafVenation}
                                </div>
                                <div style={{ color: '#cbd5e1' }}>{plant.inflorescencePattern}</div>

                                {/* APTNESS CELL */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ flex: 1, height: '6px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${plant.aptness || 0}%`,
                                                height: '100%',
                                                background: (plant.aptness || 0) > 80 ? '#10b981' : (plant.aptness || 0) > 50 ? '#facc15' : '#ef4444',
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '32px', color: (plant.aptness || 0) > 80 ? '#10b981' : (plant.aptness || 0) > 50 ? '#facc15' : '#ef4444' }}>
                                            {plant.aptness || 0}%
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: plant.rarityIndex > 80 ? 'rgba(244, 63, 94, 0.2)' : plant.rarityIndex > 50 ? 'rgba(250, 204, 21, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: plant.rarityIndex > 80 ? '#fb7185' : plant.rarityIndex > 50 ? '#facc15' : '#34d399',
                                    }}>
                                        idx: {plant.rarityIndex}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                    {plant.verifiedSource || 'Gene Bank'}
                                </div>
                            </div>
                        ))}

                        {filteredData.length === 0 && (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                                <Database size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No matching biosignatures found in simulation node.</p>
                            </div>
                        )}

                        {filteredData.length > 100 && (
                            <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #334155', color: '#64748b', fontSize: '0.9rem' }}>
                                Showing top 100 matches of {filteredData.length}
                            </div>
                        )}
                    </div>
                </div>

                {/* Simulation Status Footer */}
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Cpu size={24} color="#38bdf8" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 700 }}>Neural Net Active</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Biometric simulation nodes online.</p>
                        </div>
                    </div>
                    <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Activity size={24} color="#10b981" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 700 }}>Latency: 12ms</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Quantum sync stable.</p>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};
