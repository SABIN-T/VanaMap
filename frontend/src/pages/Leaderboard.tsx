import { useState, useEffect } from 'react';
import { Trophy, Crown, MapPin, Building, Sprout, TrendingUp, Users, ArrowRight } from 'lucide-react';
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
        return (
            <div style={{
                display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem'
            }}>
                <div style={{ width: 30, height: 30, border: '2px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Analyzing Ecosystem...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Sort top 3 for podium
    const top3 = data.users.slice(0, 3);
    const rest = data.users.slice(3);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.badge}>
                    <Trophy size={11} /> Global Rankings
                </div>
                <h1 className={styles.title}>Hall of Fame</h1>
                <p className={styles.subtitle}>
                    Top ecosystem guardians.
                </p>
            </header>

            {/* PODIUM SECTION */}
            <div className={styles.podium}>
                {/* 2nd Place */}
                {top3[1] && (
                    <div className={`${styles.podiumCard} ${styles.silver}`}>
                        <div className={styles.avatar}>{top3[1].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[1].name}</h3>
                        <div className={styles.userPoints}>{top3[1].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP</div>
                        <div className={styles.location}>
                            <MapPin size={10} /> <span>{top3[1].city || 'Earth'}</span>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className={`${styles.podiumCard} ${styles.gold}`}>
                        <Crown className={styles.crow} size={32} />
                        <div className={styles.avatar}>{top3[0].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[0].name}</h3>
                        <div className={styles.userPoints}>{top3[0].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP</div>
                        <div className={styles.location}>
                            <MapPin size={10} /> <span>{top3[0].city || 'Earth'}</span>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className={`${styles.podiumCard} ${styles.bronze}`}>
                        <div className={styles.avatar}>{top3[2].name.charAt(0)}</div>
                        <h3 className={styles.userName}>{top3[2].name}</h3>
                        <div className={styles.userPoints}>{top3[2].points.toLocaleString()}</div>
                        <div className={styles.pointsLabel}>CP</div>
                        <div className={styles.location}>
                            <MapPin size={10} /> <span>{top3[2].city || 'Earth'}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.contentGrid}>
                {/* COLUMN 1: GLOBAL RANKINGS */}
                <div>
                    <h2 className={styles.sectionTitle}>
                        <Users size={16} className="text-indigo-400" /> Global Elite
                    </h2>

                    <div className={styles.tableContainer}>
                        {rest.map((user, idx) => (
                            <div key={idx} className={styles.row}>
                                <span className={styles.rankNumber}>#{idx + 4}</span>
                                <div className={styles.smallAvatar}>{user.name.charAt(0)}</div>
                                <div className={styles.userInfo}>
                                    <span className={styles.name}>{user.name}</span>
                                    <span className={styles.levelText}>{user.city || 'Global'} • Lvl {user.gameLevel || 1}</span>
                                </div>
                                <div className={styles.rowPoints}>{user.points.toLocaleString()}</div>
                            </div>
                        ))}
                        {rest.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>No other rankings yet.</div>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: NEIGHBORHOOD RANKINGS */}
                <div>
                    <h2 className={styles.sectionTitle}>
                        <Building size={16} className="text-emerald-400" /> Top Zones
                    </h2>

                    <div>
                        {data.cities.length > 0 ? data.cities.map((cityData, idx) => (
                            <div key={idx} className={styles.cityCard}>
                                <div className={styles.cityIcon}>
                                    <TrendingUp size={18} />
                                </div>
                                <div className={styles.cityInfo}>
                                    <span className={styles.cityName}>{cityData._id.city || 'Wilderness'}</span>
                                    <div className={styles.cityMeta}>
                                        {cityData.userCount} Citizens
                                    </div>
                                </div>
                                <div className={styles.cityPointsValue}>{cityData.totalPoints.toLocaleString()}</div>
                            </div>
                        )) : (
                            <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
                                No urban ecosystem data yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CALL TO ACTION */}
            <div className={styles.ctaBox}>
                <Sprout size={32} color="#10b981" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Climb the Ranks</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 auto 1rem', maxWidth: '400px' }}>
                    Grow your collection to earn CP and lead your city.
                </p>
                <button
                    onClick={() => window.location.href = '/shops'}
                    className={styles.ctaBtn}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Get Plans <ArrowRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
                </button>
            </div>
        </div>
    );
};
