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
    }

    private handleRefresh = () => {
        localStorage.clear(); // Clear storage on crash recovery
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
                            {this.state.error?.message || "The application encountered an unexpected state."}
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
