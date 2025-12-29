import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, MapPin, Building, Sprout, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';
import styles from './Leaderboard.module.css';

interface LeaderboardData {
    users: any[];
    cities: any[];
}

export const Leaderboard = () => {
    const [data, setData] = useState<LeaderboardData>({ users: [], cities: [] });
    const [loading, setLoading] = useState(true);
    const [showPromo, setShowPromo] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                // Safety timeout: If fetch hangs for >10s, stop loading
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Request timeout")), 10000)
                );

                const dataPromise = fetchLeaderboard();
                const res = await Promise.race([dataPromise, timeoutPromise]) as LeaderboardData;

                if (isMounted) setData(res);
            } catch (e: any) {
                console.error("Leaderboard load failed", e);
                if (isMounted) setError(e.message || "Failed to load rankings");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();

        // Show Promo
        const hasSeenPromo = sessionStorage.getItem('seenLeaderboardPromo');
        if (!hasSeenPromo) {
            setShowPromo(true);
            sessionStorage.setItem('seenLeaderboardPromo', 'true');
        }

        return () => { isMounted = false; };
    }, []);

    const navigate = useNavigate();

    // DYNAMIC QUESTS: Rotate based on day of year to keep it fresh!
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    // Pool of missions - Easy for kids, engaging for adults
    const missionPool = [
        { title: 'Morning Scout', desc: 'Tap to find 3 plants near you!', points: 50, path: '/', action: 'search' },
        { title: 'Green Shopper', desc: 'Tap to visit a plant shop.', points: 100, path: '/shops', action: 'shop' },
        { title: 'Wise Reader', desc: 'Tap to read today\'s news.', points: 30, path: '/daily-news', action: 'read' },
        { title: 'Forest Hero', desc: 'Tap to play the Forest Game!', points: 50, path: '/forest-game', action: 'game' },
        { title: 'Pot Designer', desc: 'Tap to paint a new pot!', points: 75, path: '/pot-designer', action: 'design' },
        { title: 'Weather Watch', desc: 'Tap to check local weather.', points: 20, path: '/', action: 'weather' }
    ];

    // Select 3 missions based on the day automatically
    const quests = [
        { ...missionPool[dayOfYear % missionPool.length], id: 1, status: 'Active' },
        { ...missionPool[(dayOfYear + 1) % missionPool.length], id: 2, status: 'Pending' },
        { ...missionPool[(dayOfYear + 2) % missionPool.length], id: 3, status: 'Completed' }
    ];

    const handleQuestClick = (q: any) => {
        // Simple and clear messaging
        if (q.status === 'Completed') return;

        // Persist mission
        sessionStorage.setItem('active_quest', JSON.stringify({ id: q.id, action: q.action, points: q.points, title: q.title }));

        // Go there
        navigate(q.path);
    };

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

    // In case of error, we just render with empty/initial data, but maybe log it.
    // The user will see empty leaderboard but at least the UI loads.
    if (error) {
        console.warn("Rendering Leaderboard in fallback state due to error:", error);
    }

    // Sort top 3 for podium
    const top3 = data.users.slice(0, 3);
    const rest = data.users.slice(3);

    return (
        <div className={styles.container}>
            {/* PROMO MODAL */}
            {showPromo && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <div className={styles.modalBadge}>LIMITED TIME OFFER</div>
                        <Crown size={48} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
                        <h2 className={styles.modalTitle}>Become an Elite Guardian</h2>
                        <p className={styles.modalText}>
                            Reach <strong>2,000 Chlorophyll Points</strong> and unlock
                            <br />
                            <span className="text-emerald-400 font-bold text-lg">1 YEAR FREE PREMIUM</span>
                        </p>
                        <button onClick={() => setShowPromo(false)} className={styles.modalBtn}>
                            Challenge Accepted
                        </button>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.badge}>
                    <Users size={11} /> Top Gardeners
                </div>
                <h1 className={styles.title}>Star Guardians</h1>
                <p className={styles.subtitle}>
                    See who is saving the planet!
                </p>
            </header>

            {/* DAILY QUESTS BAR */}
            <div className={styles.questBar}>
                <div className={styles.questHeader}>
                    <TrendingUp size={16} className="text-emerald-400" />
                    <span>Your Daily Missions</span>
                </div>
                <div className={styles.questGrid}>
                    {quests.map(q => (
                        <div
                            key={q.id}
                            onClick={() => handleQuestClick(q)}
                            className={`${styles.questItem} ${q.status === 'Completed' ? styles.questDone : ''}`}
                            style={{ cursor: q.status === 'Completed' ? 'default' : 'pointer' }}
                        >
                            <div className={styles.questInfo}>
                                <span className={styles.questTitle}>{q.title}</span>
                                <span className={styles.questDesc}>{q.desc}</span>
                            </div>
                            <div className={styles.questReward}>
                                +{q.points} CP
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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

                {/* COLUMN 2: EARN GUIDE & ZONES */}
                <div className="flex flex-col gap-6">
                    {/* EARN INFO CARD */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>How to Earn CP?</h3>
                        <ul className={styles.earnList}>
                            <li>
                                <span className={styles.earnIcon}>🎮</span>
                                <div>
                                    <strong>Play Canopy Hero</strong>
                                    <span>+10 CP per session</span>
                                </div>
                            </li>
                            <li>
                                <span className={styles.earnIcon}>🛍️</span>
                                <div>
                                    <strong>Shop Green</strong>
                                    <span>+50 CP per purchase</span>
                                </div>
                            </li>
                            <li>
                                <span className={styles.earnIcon}>🌱</span>
                                <div>
                                    <strong>Identify Plants</strong>
                                    <span>+5 CP per scan</span>
                                </div>
                            </li>
                        </ul>
                    </div>

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
