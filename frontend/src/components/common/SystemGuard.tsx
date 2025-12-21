import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import styles from './SystemGuard.module.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorType: 'crash' | 'timeout' | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorType: null
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true, errorType: 'crash' };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleRefresh = () => {
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
                            The application encountered an unexpected state. A refresh is required to restore visual stability.
                        </p>
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
