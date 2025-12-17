import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { User, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { countryCodes } from '../data/countryCodes';
import { countryStates } from '../data/states';

export const Auth = () => {
    const navigate = useNavigate();
    const { login, signup, user } = useAuth(); // Removed googleLogin

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
            if (user.role === 'vendor') {
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
                alert("Login Successful");
                // Navigation handled by useEffect
            } else {
                alert(`Authentication failed: ${result.message}`);
            }
        } else if (view === 'signup') {
            const result = await signup({ email, password, name, role });
            if (result.success) {
                alert("Signup Successful");
                // Navigation handled by useEffect
            } else {
                alert(`Signup failed: ${result.message}`);
            }
        } else if (view === 'forgot') {
            // Request Reset
            try {
                await import('../services/api').then(api => api.requestPasswordReset(email));
                alert("Request sent to Admin. Notice: It will take 1 hour sometimes to change the new password space. Admin must approve.");
                setView('login');
            } catch (err) {
                alert("Failed to send request. User might not exist.");
            }
        } else if (view === 'reset') {
            // Perform Reset
            try {
                await import('../services/api').then(api => api.resetPassword(email, password));
                alert("Password changed successfully! You can now login.");
                setView('login');
            } catch (err) {
                alert("Reset failed. Your request might not be approved yet.");
            }
        }
    };


    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', background: 'var(--bg-card)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {view === 'login' && 'Welcome Back'}
                    {view === 'signup' && 'Join VanaMap'}
                    {view === 'forgot' && 'Reset Password Request'}
                    {view === 'reset' && 'Set New Password'}
                </h2>

                {/* Role Toggle only for Signup */}
                {view === 'signup' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            onClick={() => setRole('user')}
                            type="button"
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${role === 'user' ? 'var(--color-primary)' : 'transparent'}`,
                                background: role === 'user' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                color: role === 'user' ? 'var(--color-primary)' : '#aaa',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <User size={24} /> Plant Lover
                        </button>
                        <button
                            onClick={() => setRole('vendor')}
                            type="button"
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${role === 'vendor' ? 'var(--color-primary)' : 'transparent'}`,
                                background: role === 'vendor' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                color: role === 'vendor' ? 'var(--color-primary)' : '#aaa',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Store size={24} /> Shop Owner
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Name Field (Signup only) */}
                    {view === 'signup' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: '#666' }}>Full Name {role === 'vendor' && '/ Shop Name'}</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }} />
                        </div>
                    )}

                    {/* Vendor Fields (Signup + Vendor only) */}
                    {view === 'signup' && role === 'vendor' && (
                        <>
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Country</label>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }}
                                    >
                                        {countryCodes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>State / Province</label>
                                    {countryStates[country] ? (
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            required
                                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }}
                                        >
                                            <option value="">Select State</option>
                                            {countryStates[country].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="Enter State"
                                            required
                                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Phone Number</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: 'var(--glass-border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--color-primary)',
                                        fontWeight: 'bold',
                                        minWidth: '60px',
                                        textAlign: 'center'
                                    }}>
                                        {phoneCode}
                                    </div>
                                    <input type="tel" placeholder="1234567890" required style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email Field (All Views) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }} />
                    </div>

                    {/* Password Field (Login, Signup, Reset) */}
                    {view !== 'forgot' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {view === 'reset' ? 'New Password' : 'Password'}
                            </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--color-text-main)', outline: 'none' }} />
                        </div>
                    )}

                    <Button type="submit" size="lg" style={{ marginTop: '1rem' }}>
                        {view === 'login' && 'Log In'}
                        {view === 'signup' && (role === 'vendor' ? 'Register Shop' : 'Create Account')}
                        {view === 'forgot' && 'Send Request'}
                        {view === 'reset' && 'Update Password'}
                    </Button>

                    {/* Login Links */}
                    {view === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setView('forgot')} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                    {view === 'login' && (
                        <>Don't have an account? <button onClick={() => setView('signup')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Sign Up</button></>
                    )}
                    {view === 'signup' && (
                        <>Already have an account? <button onClick={() => setView('login')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Log In</button></>
                    )}
                    {(view === 'forgot' || view === 'reset') && (
                        <>Back to <button onClick={() => setView('login')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Log In</button></>
                    )}
                </p>

                {view === 'forgot' && (
                    <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                        Has your request been approved? <button onClick={() => setView('reset')} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Set New Password</button>
                    </p>
                )}
            </div>
        </div>
    );
};
