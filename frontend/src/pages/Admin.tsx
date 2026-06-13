import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchAdminStats
} from '../services/api';
import {
    Activity, Users, Sprout, MapPin,
    ArrowUpRight, Zap, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from './admin/AdminLayout';
import styles from './Admin.module.css';

export const Admin = () => {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({ plants: 0, users: 0, vendors: 0, viewers: 1 });

    // Dynamic metrics
    const [pulseData, setPulseData] = useState<number[]>([30, 35, 32, 40, 38, 42, 45, 40, 38, 35, 32, 38, 42, 40, 44]);
    const [systemLoad, setSystemLoad] = useState(4);
    const [throughput, setThroughput] = useState(12);
    const [avgLatency, setAvgLatency] = useState(42);
    const [nodes, setNodes] = useState([
        { name: 'US-EAST-1', status: 'Online', latency: 45, color: '#10b981' },
        { name: 'EU-WEST-2', status: 'Online', latency: 88, color: '#10b981' },
        { name: 'AP-SOUTH-1', status: 'Healthy', latency: 12, color: '#10b981' },
        { name: 'REPLICA-01', status: 'Syncing (98%)', latency: 150, color: '#3b82f6' }
    ]);

    const loadData = useCallback(async () => {
        try {
            const data = await fetchAdminStats();
            setStats({
                vendors: data.vendors,
                plants: data.plants,
                users: data.users,
                viewers: data.viewers || 1 // Always at least 1 (the admin)
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            navigate('/auth', { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            loadData();
            // 🚀 Poll for real-time viewers every 10 seconds
            const interval = setInterval(loadData, 10000);
            return () => clearInterval(interval);
        }
    }, [user, loadData, authLoading]);

    // Live Metrics Fluctuation Simulator
    useEffect(() => {
        if (authLoading || user?.role !== 'admin') return;

        const interval = setInterval(() => {
            // Fluctuate CPU load
            setSystemLoad(Math.floor(3 + Math.random() * 8));

            // Fluctuate request throughput
            setThroughput(Math.floor(8 + Math.random() * 10));

            // Fluctuate response latency
            setAvgLatency(Math.floor(35 + Math.random() * 15));

            // Fluctuate SVG ECG/Latency line chart points
            setPulseData(prev => {
                const nextVal = Math.floor(Math.max(15, Math.min(85, prev[prev.length - 1] + (Math.random() * 20 - 10))));
                return [...prev.slice(1), nextVal];
            });

            // Fluctuate cloud node response times & replica status
            setNodes(prev => prev.map(n => {
                if (n.name === 'REPLICA-01') {
                    const pct = Math.floor(95 + Math.random() * 6);
                    const isSynced = pct >= 100;
                    return {
                        ...n,
                        status: isSynced ? 'Synced' : `Syncing (${pct}%)`,
                        color: isSynced ? '#10b981' : '#3b82f6',
                        latency: Math.floor(120 + Math.random() * 40)
                    };
                }
                return {
                    ...n,
                    latency: Math.max(5, n.latency + Math.floor(Math.random() * 10 - 5))
                };
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [user, authLoading]);

    if (authLoading || !user || user.role !== 'admin') {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
                <div className="pre-loader-pulse"></div>
            </div>
        );
    }

    return (
        <AdminLayout title="System Overview">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className={styles.dashboardGrid}>
                    {/* STAT CARDS */}
                    <div className={`${styles.card} ${styles.cardStat}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Total Users</span>
                            <Users size={20} style={{ color: '#818cf8' }} />
                        </div>
                        <div className={styles.cardValue}>{stats.users}</div>
                        <div className={styles.cardTrend}>
                            <span className={styles.trendUp}><ArrowUpRight size={14} /> Live</span> Count
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardStat}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Active Plants</span>
                            <Sprout size={20} style={{ color: '#34d399' }} />
                        </div>
                        <div className={styles.cardValue}>{stats.plants}</div>
                        <div className={styles.cardTrend}>
                            <span className={styles.trendUp}><ArrowUpRight size={14} /> Catalog</span> Size
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardStat}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Partners</span>
                            <MapPin size={20} style={{ color: '#fbbf24' }} />
                        </div>
                        <div className={styles.cardValue}>{stats.vendors}</div>
                        <div className={styles.cardTrend}>
                            <span className={styles.trendNeutral}><ArrowUpRight size={14} /> Network</span> Reach
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardStat}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Live Viewers</span>
                            <Eye size={20} style={{ color: '#fb7185' }} />
                        </div>
                        <div className={styles.cardValue}>
                            {stats.viewers}
                            <span className={styles.pulseDot}></span>
                        </div>
                        <div className={styles.cardTrend}>
                            <span className={styles.trendUp} style={{ color: '#fb7185' }}>● Real-time</span> Activity
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardStat}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>System Load</span>
                            <Zap size={20} style={{ color: '#60a5fa' }} />
                        </div>
                        <div className={styles.cardValue}>{systemLoad}%</div>
                        <div className={styles.cardTrend}>
                            {systemLoad < 10 ? (
                                <span className={styles.trendUp} style={{ color: '#10b981' }}>Optimal</span>
                            ) : (
                                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Active</span>
                            )} performance
                        </div>
                    </div>

                    {/* CENTRAL MONITOR */}
                    <div className={`${styles.card} ${styles.cardLarge}`} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>System Pulse</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', letterSpacing: '0.5px' }}>● STREAM ACTIVE</span>
                                <Activity size={20} style={{ color: '#f43f5e' }} className="animate-pulse" />
                            </div>
                        </div>

                        {/* Real-time moving pulse graph */}
                        <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '180px', marginTop: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem', overflow: 'hidden', padding: '10px 0' }}>
                            {(() => {
                                const w = 500;
                                const h = 180;
                                const pathD = pulseData.map((val, idx) => {
                                    const x = (idx / (pulseData.length - 1)) * w;
                                    const y = h - (val / 100) * h;
                                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                }).join(' ');

                                return (
                                    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                                        <defs>
                                            <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Background Grid lines */}
                                        {[25, 50, 75].map(yPct => (
                                            <line
                                                key={yPct}
                                                x1="0"
                                                y1={h - (yPct / 100) * h}
                                                x2={w}
                                                y2={h - (yPct / 100) * h}
                                                stroke="rgba(255, 255, 255, 0.04)"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                            />
                                        ))}

                                        {/* Fill area */}
                                        <path
                                            d={`${pathD} L ${w} ${h} L 0 ${h} Z`}
                                            fill="url(#pulseGlow)"
                                            style={{ transition: 'd 0.3s ease-out' }}
                                        />

                                        {/* Line path */}
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ 
                                                filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.7))',
                                                transition: 'd 0.3s ease-out'
                                            }}
                                        />

                                        {/* Active glowing dot */}
                                        {pulseData.length > 0 && (
                                            <circle
                                                cx={w}
                                                cy={h - (pulseData[pulseData.length - 1] / 100) * h}
                                                r="6"
                                                fill="#10b981"
                                                style={{ 
                                                    filter: 'drop-shadow(0px 0px 6px #10b981)',
                                                    transition: 'cy 0.3s ease-out'
                                                }}
                                            />
                                        )}
                                    </svg>
                                );
                            })()}
                        </div>

                        {/* Real-time stats display */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Throughput</div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{throughput} req/s</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Latency</div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{avgLatency} ms</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stream Status</div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>Healthy</div>
                            </div>
                        </div>
                    </div>

                    {/* SERVER STATUS */}
                    <div className={`${styles.card} ${styles.cardTall}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Server Nodes</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {nodes.map(node => (
                                <div key={node.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{node.name}</span>
                                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>{node.latency}ms ping</span>
                                    </div>
                                    <span style={{ color: node.color, fontWeight: 'bold' }}>{node.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin;
