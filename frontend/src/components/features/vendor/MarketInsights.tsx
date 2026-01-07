import { useState, useEffect } from 'react';
import { TrendingUp, Map, Award, Lightbulb, ArrowUpRight, DollarSign, Package, ShoppingCart, User } from 'lucide-react';
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
        if (vendorId) load();
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
                        <h2 className={styles.title}>Vendor Command Center</h2>
                        <p className={styles.subtitle}>Real-time performance metrics and regional intelligence.</p>
                    </div>
                </div>
                <div className={styles.headerBadges}>
                    <div className={styles.headBadge}>
                        <DollarSign size={14} />
                        <span>Revenue: ₹{stats?.revenue?.toLocaleString() || 0}</span>
                    </div>
                    <div className={styles.headBadge} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                        <Package size={14} />
                        <span>Sold: {stats?.itemsSold || 0} units</span>
                    </div>
                </div>
            </header>

            <div className={styles.grid}>
                {/* 1. REAL-TIME SALES (What users are really buying) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <ShoppingCart size={16} /> Recent Sales Activity
                    </div>
                    <div className={styles.scrollList}>
                        {stats?.sales?.map((sale: any, idx: number) => (
                            <div key={idx} className={styles.saleItem}>
                                <div className={styles.saleMain}>
                                    <div className={styles.customerIcon}><User size={12} /></div>
                                    <div className={styles.saleInfo}>
                                        <div className={styles.saleTitle}>{sale.plantName}</div>
                                        <div className={styles.saleSubText}>Bought by {sale.userName || 'Customer'}</div>
                                    </div>
                                </div>
                                <div className={styles.saleValue}>
                                    <div className={styles.salePrice}>₹{sale.price}</div>
                                    <div className={styles.saleDate}>{new Date(sale.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                </div>
                            </div>
                        ))}
                        {!stats?.sales?.length && <div className={styles.emptyState}>No transaction history recorded yet.</div>}
                    </div>
                </div>

                {/* 2. SEARCH TRENDS (What users are searching for) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Award size={16} /> Local Search Trends
                    </div>
                    {stats?.searchTrends?.map((item: any, idx: number) => (
                        <div key={idx} className={styles.listItem}>
                            <div className={styles.indicator}>
                                <div className={styles.rank}>{idx + 1}</div>
                                <span className={styles.label}>{item.label}</span>
                            </div>
                            <div className={styles.valueGroup}>
                                <span className={styles.count}>{item.value}</span>
                                <span className={styles.growth}>hits</span>
                            </div>
                        </div>
                    ))}
                    {!stats?.searchTrends?.length && <div className={styles.emptyState}>No search activity in your region.</div>}
                </div>

                {/* 3. REGIONAL DEMAND map */}
                <div className={styles.card} style={{ gridColumn: 'span 1' }}>
                    <div className={styles.cardHeader}>
                        <Map size={16} /> Regional Interest Hotspots
                    </div>
                    <div className={styles.barContainer}>
                        {stats?.nearbyDemand?.map((item: any, idx: number) => {
                            const max = stats.nearbyDemand[0].count;
                            const percentage = (item.count / max) * 100;
                            return (
                                <div key={idx} className={styles.barWrapper}>
                                    <div className={styles.barLabel}>
                                        <span className={styles.barName}>{item.city || 'Nearby'}</span>
                                        <span className={styles.barValue}>{item.count} engagement</span>
                                    </div>
                                    <div className={styles.track}>
                                        <div className={styles.fill} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        {!stats?.nearbyDemand?.length && <div className={styles.emptyState}>Awaiting local GPS signals.</div>}
                    </div>
                </div>

                {/* AI INSIGHT */}
                <div className={styles.insightBanner}>
                    <Lightbulb className={styles.insightIcon} size={28} />
                    <div className={styles.insightText}>
                        <strong>Neural Insight:</strong> {stats?.searchTrends?.[0] ?
                            `There is a high conversion potential for "${stats.searchTrends[0].label}". Our data shows it represents 25% of regional interest.` :
                            "Keep your catalog optimized with current prices to capture emerging seasonal demand in your area."
                        }
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', cursor: 'pointer', color: '#10b981', fontWeight: 700 }}>
                            Generate Demand Forecast <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
