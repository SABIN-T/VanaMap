import { useState, useEffect } from 'react';
import { TrendingUp, Map, Award, Lightbulb, ArrowUpRight } from 'lucide-react';
import { fetchVendorAnalytics } from '../../../services/api';
import styles from './MarketInsights.module.css';

interface MarketInsightsProps {
    vendorId: string;
}

export const MarketInsights = ({ vendorId }: MarketInsightsProps) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchVendorAnalytics(vendorId);
                setStats(res);
            } catch (e) {
                console.error("Analytics failure", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [vendorId]);

    if (loading) return <div style={{ color: '#64748b', padding: '2rem', textAlign: 'center' }}>Synchronizing local market data...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className={styles.title}>Market Intelligence</h2>
                        <p className={styles.subtitle}>Real-time search trends and regional demand within 5km.</p>
                    </div>
                </div>
            </header>

            <div className={styles.grid}>
                {/* TOP SEARCHES */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Award size={16} /> Most Wanted Species
                    </div>
                    {stats?.topSearches?.map((item: any, idx: number) => (
                        <div key={idx} className={styles.listItem}>
                            <div className={styles.indicator}>
                                <div className={styles.rank}>{idx + 1}</div>
                                <span className={styles.label}>{item._id}</span>
                            </div>
                            <div className={styles.valueGroup}>
                                <span className={styles.count}>{item.count}</span>
                                <span className={styles.growth}>searches</span>
                            </div>
                        </div>
                    ))}
                    {!stats?.topSearches?.length && <div style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>No search data yet.</div>}
                </div>

                {/* DEMAND BY CITY */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Map size={16} /> Regional Interest
                    </div>
                    <div className={styles.barContainer}>
                        {stats?.demandByLocation?.map((item: any, idx: number) => {
                            const max = stats.demandByLocation[0].count;
                            const percentage = (item.count / max) * 100;
                            return (
                                <div key={idx} className={styles.barWrapper}>
                                    <div className={styles.barLabel}>
                                        <span className={styles.barName}>{item._id || 'Nearby'}</span>
                                        <span className={styles.barValue}>{item.count} requests</span>
                                    </div>
                                    <div className={styles.track}>
                                        <div className={styles.fill} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        {!stats?.demandByLocation?.length && <div style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>Awaiting local GPS signals.</div>}
                    </div>
                </div>

                {/* AI INSIGHT */}
                <div className={styles.insightBanner}>
                    <Lightbulb className={styles.insightIcon} size={28} />
                    <div className={styles.insightText}>
                        <strong>Smart Tip:</strong> {stats?.topSearches?.[0] ?
                            `There is a 30% surge in searches for "${stats.topSearches[0]._id}". Consider restocking this species to maximize visibility.` :
                            "Keep your inventory updated to track which of your specimens are attracting the most interest."
                        }
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', cursor: 'pointer', color: '#10b981', fontWeight: 700 }}>
                            View detailed report <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
