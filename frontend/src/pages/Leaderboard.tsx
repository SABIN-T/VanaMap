import { useState, useEffect } from 'react';
import { Trophy, Crown, MapPin, Building, Sprout, TrendingUp, Users } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';
import styles from './Leaderboard.module.css';

interface LeaderboardData {
    users: any[];
    cities: any[];
}

export const Leaderboard = () => {
    const [data, setData] = useState<LeaderboardData>({ users: [], cities: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchLeaderboard();
                setData(res);
            } catch (e) {
                console.error("Leaderboard load failed", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Analyzing Ecosystem Rankings...</div>;
    }

    // Sort top 3 for podium
    const top3 = data.users.slice(0, 3);
    const rest = data.users.slice(3);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <Trophy size={14} /> Global Ecosystem Rankings
                </div>
                <h1 className={styles.title}>Hall of Fame</h1>
                <p className={styles.subtitle}>
                    Celebrating the most dedicated caretakers in the VanaMap network.
                    Earn Chlorophyll Points (CP) by expanding your home ecosystem.
                </p>
            </header>

            {/* PODIUM */}
            <div className={styles.podium}>
                {/* 2nd Place */}
                {top3[1] && (
                    <div className={`${styles.podiumCard} ${styles.silver}`}>
                        <div className={styles.avatar}>{top3[1].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[1].name}</h3>
                        <div className={styles.userPoints}>{top3[1].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP Points</div>
                        <div className={styles.location}>
                            <MapPin size={14} /> {top3[1].city || 'Earth'}
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className={`${styles.podiumCard} ${styles.gold}`}>
                        <Crown className={styles.crown} size={48} />
                        <div className={styles.avatar}>{top3[0].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[0].name}</h3>
                        <div className={styles.userPoints}>{top3[0].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP Points</div>
                        <div className={styles.location}>
                            <MapPin size={14} /> {top3[0].city || 'Earth'}
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className={`${styles.podiumCard} ${styles.bronze}`}>
                        <div className={styles.avatar}>{top3[2].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[2].name}</h3>
                        <div className={styles.userPoints}>{top3[2].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP Points</div>
                        <div className={styles.location}>
                            <MapPin size={14} /> {top3[2].city || 'Earth'}
                        </div>
                    </div>
                )}
            </div>

            {/* FULL RANKINGS */}
            <div className={styles.tableContainer}>
                {rest.map((user, idx) => (
                    <div key={idx} className={styles.row}>
                        <span className={styles.rankNumber}>#{idx + 4}</span>
                        <div className={styles.userInfo}>
                            <div className={styles.smallAvatar}>{user.name.charAt(0)}</div>
                            <span className={styles.name}>{user.name}</span>
                        </div>
                        <span className={styles.rowLocation}>{user.city || 'Global'}</span>
                        <div className={styles.rowPoints}>{user.points.toLocaleString()} CP</div>
                    </div>
                ))}
            </div>

            {/* CITY RANKINGS */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Neighborhood Rankings</h2>
                <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={16} /> Updated 1h ago
                </div>
            </div>

            <div className={styles.grid}>
                {data.cities.length > 0 ? data.cities.map((cityData, idx) => (
                    <div key={idx} className={styles.cityCard}>
                        <div className={styles.cityIcon}>
                            <Building size={32} />
                        </div>
                        <div className={styles.cityInfo}>
                            <span className={styles.cityName}>{cityData._id.city || 'Wilderness'}</span>
                            <div className={styles.cityMeta}>
                                <Users size={12} style={{ marginRight: '4px' }} /> {cityData.userCount} Citizens
                            </div>
                        </div>
                        <div className={styles.cityPoints}>
                            <span className={styles.cityPointsValue}>{cityData.totalPoints.toLocaleString()}</span>
                            <span className={styles.cityPointsLabel}>Total CP</span>
                        </div>
                    </div>
                )) : (
                    <div style={{ color: '#64748b', textAlign: 'center', gridColumn: '1/-1', padding: '4rem' }}>
                        No urban ecosystem data yet. Be the first to represent your neighborhood!
                    </div>
                )}
            </div>

            {/* CALL TO ACTION */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                padding: '3rem',
                borderRadius: '2rem',
                textAlign: 'center',
                marginTop: '4rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <Sprout size={48} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Increase Your Contribution</h2>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 2rem' }}>
                    Every plant you add to your dashboard increases your home's air quality and moves your neighborhood up the charts.
                </p>
                <button
                    onClick={() => window.location.href = '/shops'}
                    style={{
                        padding: '1rem 2rem',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Explore Marketplace
                </button>
            </div>
        </div>
    );
};
