import React from 'react';
import { Users, Sprout, Store, Activity } from 'lucide-react';
import styles from './ActivityFeed.module.css';

export interface ActivityItem {
    id: string;
    type: 'user' | 'plant' | 'vendor' | 'system';
    title: string;
    description: string;
    timestamp: Date | string;
    meta?: string;
}

interface ActivityFeedProps {
    activities: ActivityItem[];
    isLoading?: boolean;
}

const timeAgo = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Just now';

    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, isLoading }) => {

    if (isLoading) {
        return (
            <div className={styles.emptyState}>
                <div className="flex gap-1">
                    <div className={styles.loadingPulse}></div>
                    <div className={styles.loadingPulse}></div>
                    <div className={styles.loadingPulse}></div>
                </div>
                <div className="mt-2 text-sm">Syncing live data...</div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Activity size={32} className={styles.emptyIcon} />
                <h3>No Recent Activity</h3>
                <p className="text-xs mt-1">New actions will appear here in real-time.</p>
            </div>
        );
    }

    return (
        <div className={styles.feedContainer}>
            <div className={styles.scrollArea}>
                {activities.map((item) => (
                    <div key={item.id} className={styles.feedItem}>
                        <div className={`${styles.iconWrapper} ${styles[`variant-${item.type}`]}`}>
                            {item.type === 'user' && <Users size={20} />}
                            {item.type === 'plant' && <Sprout size={20} />}
                            {item.type === 'vendor' && <Store size={20} />}
                            {item.type === 'system' && <Activity size={20} />}
                        </div>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <div className={styles.title}>{item.title}</div>
                                <div className={styles.time} title={new Date(item.timestamp).toLocaleString()}>
                                    {timeAgo(item.timestamp)}
                                </div>
                            </div>
                            <div className={styles.description}>
                                {item.description}
                            </div>
                            {item.meta && (
                                <div className={styles.meta}>
                                    <span className={styles.badge}>{item.meta}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
