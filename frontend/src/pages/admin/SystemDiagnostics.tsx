import { AdminPageLayout } from './AdminPageLayout';
import { Server, Database, Activity } from 'lucide-react';
import styles from './SystemDiagnostics.module.css';

export const SystemDiagnostics = () => {
    return (
        <AdminPageLayout title="System Diagnostics">
            <div className={styles.pageContainer}>

                <div className={styles.grid}>
                    {/* API Latency Card */}
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <div className={`${styles.iconWrapper} ${styles.iconApi}`}>
                                <Server size={24} />
                            </div>
                            <div>
                                <div className={styles.title}>API Latency</div>
                                <div className={styles.subtitle}>Response time from server</div>
                            </div>
                        </div>
                        <div className={`${styles.metricValue} ${styles.statusGood}`}>
                            42<span className={styles.unit}>ms</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={`${styles.fill} ${styles.fillBlue}`}></div>
                        </div>
                        <div className={styles.meta}>Global Average: 45ms</div>
                    </div>

                    {/* Database Health Card */}
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <div className={`${styles.iconWrapper} ${styles.iconDb}`}>
                                <Database size={24} />
                            </div>
                            <div>
                                <div className={styles.title}>Database Health</div>
                                <div className={styles.subtitle}>MongoDB Cluster Status</div>
                            </div>
                        </div>
                        <div className={`${styles.metricValue} ${styles.statusGood}`}>
                            Healthy
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={`${styles.fill} ${styles.fillPurple}`}></div>
                        </div>
                        <div className={styles.meta}>Uptime: 99.998% • Connections: 14/100</div>
                    </div>
                </div>

                {/* Live Logs Terminal */}
                <div className={`${styles.card} ${styles.terminalCard}`}>
                    <div className={styles.terminalHeader}>
                        <div className={styles.terminalTitle}>
                            <Activity size={18} />
                            <div className={styles.liveDot}></div>
                            LIVE SYSTEM LOGS
                        </div>
                        <div className={styles.terminalCommand}>{`> tail -f /var/log/syslog`}</div>
                    </div>

                    <div className={styles.logs}>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:42:01]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>Worker process started (PID 24102)</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:42:05]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>Connected to MongoDB Cluster0 (AWS_US_EAST_1)</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:43:12]</span>
                            <span className={`${styles.level} ${styles.success}`}>SUCCESS</span>
                            <span>Backup routine executed successfully (snapshot_42)</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:45:00]</span>
                            <span className={`${styles.level} ${styles.warn}`}>WARN</span>
                            <span>Memory usage spike detected (Heap: 84%) - GC triggered</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:45:01]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>Cleaning up temporary files...</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:45:01]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>Cleanup complete. 12mb freed.</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:46:22]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>User login: admin@vanamap.online (IP: 192.168.1.4)</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span className={styles.timestamp}>[15:46:45]</span>
                            <span className={`${styles.level} ${styles.info}`}>INFO</span>
                            <span>Health check request received from 127.0.0.1</span>
                        </div>
                        <div className={styles.logEntry}>
                            <span>_</span>
                            <span className={styles.cursor}></span>
                        </div>
                    </div>
                </div>

            </div>
        </AdminPageLayout>
    );
};
