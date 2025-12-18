import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { User, Store, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { countryCodes } from '../data/countryCodes';
import { countryStates } from '../data/states';
import styles from './Auth.module.css';

export const Auth = () => {
    const navigate = useNavigate();
    const { login, signup, user } = useAuth();

    type AuthView = 'login' | 'signup' | 'forgot' | 'reset';
    const [view, setView] = useState<AuthView>('login');

    // Form States
    const [role, setRole] = useState<'user' | 'vendor'>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Vendor Specific
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('');
    const [phoneCode, setPhoneCode] = useState('+91');

    // Sync phone code with country
    useEffect(() => {
        const found = countryCodes.find(c => c.name === country);
        if (found) {
            setPhoneCode(found.code);
        }
    }, [country]);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                localStorage.setItem('adminAuthenticated', 'true');
                navigate('/admin');
            } else if (user.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (view === 'login') {
            const result = await login({ email, password });
            if (result.success) {
                // Toast logic handled in context or by effect
            } else {
                alert(`Authentication failed: ${result.message}`);
            }
        } else if (view === 'signup') {
            const result = await signup({ email, password, name, role });
            if (result.success) {
                // Navigation handled by useEffect
            } else {
                alert(`Signup failed: ${result.message}`);
            }
        } else if (view === 'forgot') {
            try {
                await import('../services/api').then(api => api.requestPasswordReset(email));
                alert("Request sent. Pending Admin Approval.");
                setView('login');
            } catch (err) {
                alert("Failed to send request.");
            }
        } else if (view === 'reset') {
            try {
                await import('../services/api').then(api => api.resetPassword(email, password));
                alert("Password updated!");
                setView('login');
            } catch (err) {
                alert("Reset failed.");
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h2 className={styles.authTitle}>
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Identity'}
                        {view === 'forgot' && 'Reset Access'}
                        {view === 'reset' && 'New Credential'}
                    </h2>
                    <p className={styles.authSubtitle}>
                        {view === 'login' && 'Access your simulation dashboard'}
                        {view === 'signup' && 'Join the eco-simulation network'}
                        {view === 'forgot' && 'Recover your account secure key'}
                    </p>
                </div>

                {view === 'forgot' && (
                    <div className={styles.noticeBox}>
                        <AlertTriangle size={20} style={{ minWidth: '20px' }} />
                        <span>Security Notice: Reset requests are manually audited by Admin. This process may take up to 1 hour for valid verification.</span>
                    </div>
                )}

                {/* Role Toggle */}
                {view === 'signup' && (
                    <div className={styles.roleToggle}>
                        <button
                            type="button"
                            className={`${styles.roleBtn} ${role === 'user' ? styles.active : ''}`}
                            onClick={() => setRole('user')}
                        >
                            <User size={24} /> Plant Lover
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleBtn} ${role === 'vendor' ? styles.active : ''}`}
                            onClick={() => setRole('vendor')}
                        >
                            <Store size={24} /> Shop Owner
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Signup Fields */}
                    {view === 'signup' && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {role === 'vendor' ? 'Business Name' : 'Full Name'}
                            </label>
                            <input
                                className={styles.input}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder={role === 'vendor' ? "e.g. Green Earth Nursery" : "e.g. John Doe"}
                            />
                        </div>
                    )}

                    {/* Vendor Location */}
                    {view === 'signup' && role === 'vendor' && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Business Location</label>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <select
                                        className={styles.select}
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        {countryCodes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                    </select>

                                    {countryStates[country] ? (
                                        <select
                                            className={styles.select}
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {countryStates[country].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            className={styles.input}
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="State / Province"
                                            required
                                        />
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Contact Number</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.phonePrefix}>{phoneCode}</div>
                                    <input
                                        type="tel"
                                        className={styles.input}
                                        placeholder="Mobile Number"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Common Fields */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>

                    {view !== 'forgot' && (
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label className={styles.label} style={{ marginBottom: 0 }}>
                                    {view === 'reset' ? 'New Password' : 'Password'}
                                </label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot')}
                                        className={styles.linkBtn}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <Button type="submit" variant="primary" className={styles.submitBtn}>
                        {view === 'login' && 'Authenticate'}
                        {view === 'signup' && 'Complete Registration'}
                        {view === 'forgot' && 'Submit Request'}
                        {view === 'reset' && 'Update Security Key'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    {view === 'login' && (
                        <>New to VanaMap? <button onClick={() => setView('signup')}>Initialize Identity</button></>
                    )}
                    {view === 'signup' && (
                        <>Already registered? <button onClick={() => setView('login')}>Log In</button></>
                    )}
                    {(view === 'forgot' || view === 'reset') && (
                        <><button onClick={() => setView('login')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto' }}>
                            <ArrowLeft size={16} /> Return to Login
                        </button></>
                    )}
                </div>
            </div>
        </div>
    );
};
