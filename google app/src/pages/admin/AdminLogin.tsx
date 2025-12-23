import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import styles from './AdminLogin.module.css';

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const tid = toast.loading("Verifying Security Credentials...");

        try {
            const result = await login({ email, password });
            if (result.success) {
                toast.success("Access Granted. Welcome, Overseer.", { id: tid });
                // Explicitly navigate to admin dashboard
                setTimeout(() => {
                    navigate('/admin', { replace: true });
                }, 500);
            } else {
                toast.error(result.message || "Invalid credentials for security level 4", { id: tid });
                setIsSubmitting(false);
            }
        } catch (err) {
            toast.error("Gateway timeout. Check connection.", { id: tid });
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.shieldIcon}>
                        <Shield size={32} />
                    </div>
                    <h1 className={styles.title}>Admin Access</h1>
                    <p className={styles.subtitle}>Secure Registry Terminal</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Designation ID</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="admin@vanamap.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className={styles.inputIcon} size={20} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Security Key</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className={styles.inputIcon} size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isSubmitting}
                    >
                        <Terminal size={20} />
                        {isSubmitting ? 'Syncing...' : 'Initialize Link'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <button className={styles.backLink} onClick={() => navigate('/auth')}>
                        <ArrowLeft size={16} /> Return to Primary Hub
                    </button>
                </div>
            </div>

            <div className={styles.securityBadge}>
                <Lock size={12} />
                <span>256-bit Encrypted Session</span>
            </div>
        </div>
    );
};
