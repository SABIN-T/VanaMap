import { useState, useEffect } from 'react';
import { Plant } from '../types';
import { fetchPlants } from '../services/api';
import { Search, ShoppingBag, Leaf } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Shops = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlants = async () => {
            try {
                const data = await fetchPlants();
                setPlants(data);
            } catch (error) {
                console.error("Failed to load shop items", error);
            } finally {
                setLoading(false);
            }
        };
        loadPlants();
    }, []);

    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper to generate a consistent "fake" price if missing, based on name length for determinism
    const getPrice = (plant: Plant) => {
        if (plant.price) return plant.price;
        // Deterministic pseudo-random price between $15 and $80
        const hash = plant.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 15 + (hash % 65);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', paddingTop: '6rem' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                }}>
                    <ShoppingBag size={40} color="#10b981" /> VanaMap Market
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Premium plants for your home ecosystem.</p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 4rem', position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Search for plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: '99px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Shop...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredPlants.map(plant => (
                        <div key={plant.id} style={{
                            background: 'rgba(30, 41, 59, 0.7)',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Image Area */}
                            <div style={{ height: '250px', position: 'relative', background: '#0f172a' }}>
                                <img
                                    src={plant.imageUrl}
                                    alt={plant.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    background: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    color: '#fff',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {plant.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: 'auto' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>{plant.name}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem' }}>{plant.scientificName}</p>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px' }}>
                                            Air Purifying
                                        </span>
                                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '4px' }}>
                                            {plant.sunlight} Light
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                                        ${getPrice(plant)}
                                    </div>
                                    <Button
                                        disabled
                                        variant="secondary"
                                        style={{
                                            opacity: 0.7,
                                            cursor: 'not-allowed',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Coming Soon
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
