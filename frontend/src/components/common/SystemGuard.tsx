import React, { Component, useState, useEffect, type ErrorInfo, type ReactNode } from 'react';
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

        return <SafetyCheck>{this.props.children}</SafetyCheck>;
    }
}

const SafetyCheck: React.FC<Props> = ({ children }) => {
    const [isBlank, setIsBlank] = useState(false);

    useEffect(() => {
        // Detect if page remains blank after 8 seconds (Lazy loading failure or white-screen)
        const timer = setTimeout(() => {
            const mainContent = document.querySelector('main') || document.querySelector('.container');
            if (!mainContent || mainContent.innerHTML === '') {
                setIsBlank(true);
            }
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    if (isBlank) {
        return (
            <div className={styles.miniGuard}>
                <div className={styles.miniCard}>
                    <RefreshCcw size={16} className={styles.spin} />
                    <span>Page taking too long?</span>
                    <button onClick={() => window.location.reload()}>Refresh</button>
                    <button onClick={() => setIsBlank(false)} className={styles.close}>×</button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export const SystemGuard = ErrorBoundary;
