import { useState, useEffect } from 'react';
import type { Plant } from '../types';
import { fetchPlants } from '../services/api';
import { Search, ShoppingBag } from 'lucide-react';


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
                <div className="shops-grid">
                    {filteredPlants.map(plant => (
                        <div key={plant.id} className="shop-card">
                            {/* Image Area */}
                            <div className="shop-image-container">
                                <img
                                    src={plant.imageUrl}
                                    alt={plant.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                                <div className="shop-badge">
                                    {plant.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="shop-content">
                                <div style={{ marginBottom: 'auto' }}>
                                    <h3 className="shop-title">{plant.name}</h3>
                                    <p className="shop-scientific">{plant.scientificName}</p>

                                    <div className="shop-tags">
                                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                            Air Purifying
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="shop-footer">
                                    <div className="shop-price">
                                        ${getPrice(plant)}
                                    </div>
                                    <button className="shop-btn" disabled>
                                        Soon
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .shops-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }
                
                .shop-card {
                    background: rgba(30, 41, 59, 0.7);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s;
                    backdrop-filter: blur(10px);
                }

                .shop-image-container {
                    height: 250px;
                    position: relative;
                    background: #0f172a;
                }

                .shop-badge {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    color: #fff;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    fontWeight: 600;
                }

                .shop-content {
                    padding: 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .shop-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                    color: #fff;
                }

                .shop-scientific {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    font-style: italic;
                    margin-bottom: 1rem;
                }

                .shop-tags {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 1.5rem;
                }

                .shop-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 1rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 1rem;
                }

                .shop-price {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #fff;
                }

                .shop-btn {
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                /* Mobile Optimizations */
                @media (max-width: 640px) {
                    .shops-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.75rem;
                    }

                    .shop-card {
                        border-radius: 1rem;
                    }

                    .shop-image-container {
                        height: 160px; /* Shorter image on mobile */
                    }

                    .shop-badge {
                        top: 0.5rem;
                        left: 0.5rem;
                        padding: 0.2rem 0.5rem;
                        font-size: 0.6rem;
                    }

                    .shop-content {
                        padding: 0.75rem;
                    }

                    .shop-title {
                        font-size: 0.95rem;
                        margin-bottom: 0.1rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .shop-scientific {
                        font-size: 0.7rem;
                        margin-bottom: 0.5rem;
                    }

                    .shop-tags {
                        margin-bottom: 0.75rem;
                        display: none; /* Hide tags to save space on mobile? Or keep minimal. Let's hide for clean look */
                    }

                    .shop-footer {
                        margin-top: 0.5rem;
                        padding-top: 0.5rem;
                    }

                    .shop-price {
                        font-size: 1.1rem;
                    }

                    .shop-btn {
                        padding: 0.3rem 0.6rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};
