import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import styles from './SystemGuard.module.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);

        // Auto-fix for common deployment chunk mismatch errors
        if (error.name === 'ChunkLoadError' || error.message?.includes('Failed to fetch dynamically imported module')) {
            console.warn("System mismatch detected. A manual refresh may be needed to synchronize assets.");
        }
    }

    private handleRefresh = async () => {
        // Clear all persistent storage
        localStorage.clear();
        sessionStorage.clear();

        // 1. Unregister Service Workers (Crucial for fixing stale asset locks)
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            } catch (e) {
                console.error("SW unregistration failed", e);
            }
        }

        // 2. Force reload from server bypassing cache if possible
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className={styles.overlay}>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className={styles.title}>System Interruption</h2>
                        <p className={styles.desc}>
                            The application reached an inconsistent state or couldn't load the latest updates. This usually happens after a system upgrade.
                        </p>
                        <p className={styles.desc} style={{ fontSize: '0.85rem', marginTop: '-1rem', opacity: 0.8 }}>
                            Clicking <strong>Reset & Refresh</strong> will purge stale data and synchronize with the latest version.
                        </p>
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            marginBottom: '2rem',
                            textAlign: 'left',
                            fontSize: '0.8rem',
                            color: '#64748b',
                            maxHeight: '100px',
                            overflow: 'auto',
                            fontFamily: 'monospace'
                        }}>
                            {this.state.error?.stack?.split('\n').slice(0, 3).join('\n')}
                        </div>
                        <button onClick={this.handleRefresh} className={styles.refreshBtn}>
                            <RefreshCcw size={18} />
                            Reset & Refresh
                        </button>
                    </div>
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

export const SystemGuard = ErrorBoundary;
