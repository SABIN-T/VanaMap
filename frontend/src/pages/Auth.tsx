import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { User, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { countryCodes } from '../data/countryCodes';
import { countryStates } from '../data/states';
import { toast } from 'react-hot-toast';
import styles from './Auth.module.css';

export const Auth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, signup, user } = useAuth();

    type AuthView = 'login' | 'signup' | 'forgot' | 'reset';

    // Parse URL params
    const initialView = searchParams.get('view') as AuthView || 'login';
    const initialRole = searchParams.get('role') as 'user' | 'vendor' || 'user';

    const [view, setView] = useState<AuthView>(initialView);

    // Form States
    const [role, setRole] = useState<'user' | 'vendor'>(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Vendor Specific
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
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
            console.log("Auth redirecting user with role:", user.role);
            if (user.role === 'admin') {
                localStorage.setItem('adminAuthenticated', 'true');
                navigate('/admin', { replace: true });
            } else if (user.role === 'vendor') {
                navigate('/vendor', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    const handleNudge = async () => {
        if (!email) { toast.error("Please enter your email address first"); return; }
        const tid = toast.loading("Signaling Admin...");
        try {
            await import('../services/api').then(api => api.nudgeAdmin(email));
            toast.success("Admin will change the password to 123456 for this email shortly. Please try after 1hr.", { id: tid, duration: 6000 });
        } catch (e) { toast.error("Failed to signal admin", { id: tid }); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (view === 'login') {
            const tid = toast.loading("Authenticating...");
            const result = await login({ email, password });
            if (result.success) {
                toast.success("Login Successful! Welcome back.", { id: tid });
            } else {
                // User requested specific error phrasing
                toast.error(
                    result.message || "Something is wrong. Please type it correctly or change your password.",
                    { id: tid, duration: 4000 }
                );
            }
        } else if (view === 'signup') {
            const tid = toast.loading("Creating Account...");
            const result = await signup({ email, password, name, role, city, state });
            if (result.success) {
                toast.success("Account Created Successfully!", { id: tid });
            } else {
                toast.error(`Signup Failed: ${result.message} `, { id: tid });
            }
        } else if (view === 'forgot') {
            const tid = toast.loading("Verifying Identity...");
            try {
                await import('../services/api').then(api => api.resetPasswordVerify(email, name, password));
                toast.success("Password Reset Successful! Login with new credentials.", { id: tid });
                setView('login');
            } catch (err: any) {
                toast.error(err.message || "Verification failed. Check Name/Email.", { id: tid });
            }
        } else if (view === 'reset') {
            const tid = toast.loading("Updating Password...");
            try {
                await import('../services/api').then(api => api.resetPassword(email, password));
                toast.success("Password Updated! Please Login.", { id: tid });
                setView('login');
            } catch (err) {
                toast.error("Reset Failed. Try again.", { id: tid });
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>

                {/* Unified Login Notice */}
                {view === 'login' && (
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        Note: <strong>Users and Vendors</strong> can login here.
                    </div>
                )}

                <div className={styles.authHeader}>
                    <h2 className={styles.authTitle}>
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'New Password'}
                    </h2>
                    <p className={styles.authSubtitle}>
                        {view === 'login' && 'Enter your details to access your account'}
                        {view === 'signup' && 'Join the VanaMap community today'}
                        {view === 'forgot' && 'We’ll help you get back in'}
                    </p>
                </div>


                {/* Role Toggle */}
                {view === 'signup' && (
                    <div className={styles.roleToggle}>
                        <button
                            type="button"
                            className={`${styles.roleBtn} ${role === 'user' ? styles.active : ''} `}
                            onClick={() => setRole('user')}
                        >
                            <div style={{ background: role === 'user' ? 'white' : 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', color: role === 'user' ? 'black' : 'white' }}>
                                <User size={20} />
                            </div>
                            <span>Plant Lover</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleBtn} ${role === 'vendor' ? styles.active : ''} `}
                            onClick={() => setRole('vendor')}
                        >
                            <div style={{ background: role === 'vendor' ? 'white' : 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', color: role === 'vendor' ? 'black' : 'white' }}>
                                <Store size={20} />
                            </div>
                            <span>Shop Owner</span>
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

                    {/* Location Collection for Rankings */}
                    {view === 'signup' && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{role === 'vendor' ? 'Business Neighborhood' : 'Your City / Neighborhood'}</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City (e.g. Kathmandu)"
                                        required
                                    />
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
                                            placeholder="Province/State"
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Vendor Location (redundant parts removed/merged) */}
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

                    {view === 'forgot' && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Username (As Before)</label>
                            <input
                                className={styles.input}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Verify your identity"
                            />
                        </div>
                    )}

                    {(view === 'login' || view === 'signup' || view === 'reset' || view === 'forgot') && (
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label className={styles.label} style={{ marginBottom: 0 }}>
                                    {(view === 'reset' || view === 'forgot') ? 'New Password' : 'Password'}
                                </label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot')}
                                        className={styles.linkBtn}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Forgot Password?
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
                        {view === 'login' && 'Log In'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'Update Password'}
                    </Button>

                    {view === 'forgot' && (
                        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Forgot username too?
                            </p>
                            <button
                                type="button"
                                onClick={handleNudge}
                                className={styles.linkBtn}
                                style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '1rem' }}
                            >
                                Contact Admin (Manual Reset)
                            </button>
                        </div>
                    )}
                </form>

                <div className={styles.footer}>
                    {view === 'login' && (
                        <>
                            <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                New to VanaMap? <button onClick={() => setView('signup')} style={{ color: '#10b981', fontWeight: 600 }}>Create Account</button>
                            </p>
                        </>
                    )}
                    {view === 'signup' && (
                        <>Already have an account? <button onClick={() => setView('login')} style={{ color: '#10b981', fontWeight: 600 }}>Log In</button></>
                    )}
                    {(view === 'forgot' || view === 'reset') && (
                        <><button onClick={() => setView('login')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto', color: '#cbd5e1' }}>
                            <ArrowLeft size={16} /> Return to Login
                        </button></>
                    )}
                </div>
            </div>
        </div>
    );
};
