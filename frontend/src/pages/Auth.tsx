import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { User, ArrowLeft, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Country, State, type ICountry, type IState } from 'country-state-city';
import { toast } from 'react-hot-toast';
import styles from './Auth.module.css';

export const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { login, signup, user, verify } = useAuth();

    type AuthView = 'login' | 'signup' | 'forgot' | 'reset' | 'verify';

    // Parse URL params
    const initialView = searchParams.get('view') as AuthView || 'login';
    const initialRole = searchParams.get('role') as 'user' | 'vendor' || 'user';

    const [view, setView] = useState<AuthView>(initialView);

    // Form States
    const [role, setRole] = useState<'user' | 'vendor'>(initialRole);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Vendor Specific
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [selectedState, setSelectedState] = useState<IState | null>(null);

    // Derived values for API
    const [country, setCountry] = useState('India'); // defaulting to India if needed, but updated by selection
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [phoneCode, setPhoneCode] = useState('91');

    // Load initial country (India) if desired
    useEffect(() => {
        const india = Country.getCountryByCode('IN');
        if (india && !selectedCountry) {
            setSelectedCountry(india);
            setCountry(india.name);
            setPhoneCode(india.phonecode);
        }
    }, []);

    // Handle country change
    const handleCountryChange = (isoCode: string) => {
        const c = Country.getCountryByCode(isoCode);
        if (c) {
            setSelectedCountry(c);
            setCountry(c.name);
            setPhoneCode(c.phonecode);
            setSelectedState(null);
            setState('');
        }
    };

    // Handle state change
    const handleStateChange = (isoCode: string) => {
        if (!selectedCountry) return;
        const s = State.getStateByCodeAndCountry(isoCode, selectedCountry.isoCode);
        if (s) {
            setSelectedState(s);
            setState(s.name);
        }
    };


    useEffect(() => {
        if (user) {
            // Check if there is a pending redirect from a protected route
            const origin = location.state?.from?.pathname || location.state?.from;

            if (origin) {
                navigate(origin, { replace: true });
                return;
            }

            if (user.role === 'admin') {
                localStorage.setItem('adminAuthenticated', 'true');
                navigate('/admin', { replace: true });
            } else if (user.role === 'vendor') {
                navigate('/vendor', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [user, navigate, location]);

    const handleNudge = async () => {
        if (!email) { toast.error("Please enter your email address first"); return; }
        const tid = toast.loading("Signaling Admin...");
        try {
            const api = await import('../services/api');
            await api.nudgeAdmin(email);
            toast.success("Admin will change the password to 123456 for this email shortly. Please try after 1hr.", { id: tid, duration: 6000 });
        } catch (e) { toast.error("Failed to signal admin", { id: tid }); }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailVerifiedResult, setEmailVerifiedResult] = useState<{ name: string, role: string } | null>(null);

    // Password Validation
    const validatePassword = (pass: string) => {
        const minLen = 4;
        const maxLen = 18;
        const hasUpper = /[A-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[@#$%]/.test(pass);

        if (pass.length < minLen || pass.length > maxLen) return "Password must be 4-18 characters.";
        if (!hasUpper) return "At least one capital letter required.";
        if (!hasNumber) return "At least one number required.";
        if (!hasSpecial) return "At least one special character (@,#,$,%) required.";
        return null; // OK
    };

    const handleEmailCheck = async () => {
        if (!email) { toast.error("Please enter email or phone first"); return; }

        // Immediate bypass for Master Admin
        if (email.trim().toLowerCase() === 'admin@plantai.com') {
            setEmailVerifiedResult({ name: 'Master Admin', role: 'admin' });
            setIsEmailChecked(true);
            return;
        }

        setEmailLoading(true);
        try {
            const api = await import('../services/api');
            const res = await api.checkEmail(email);
            if (res.success && res.verified) {
                toast.success(`Verified account found: ${res.name}`);
                setEmailVerifiedResult({ name: res.name, role: res.role });
                setIsEmailChecked(true);
            }
        } catch (err: any) {
            toast.error(err.message || "Account not found or not verified.");
            // If account found but not verified, we can offer to resent OTP?
            if (err.message && err.message.includes("not yet verified")) {
                toast("Please sign up again or verify your account using the captcha.", { icon: '🛡️' });
            }
        } finally {
            setEmailLoading(false);
        }
    };

    const [otp, setOtp] = useState('');
    const [captchaSvg, setCaptchaSvg] = useState<string | null>(null);
    const [registrationToken, setRegistrationToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password for signup and reset
        if (view === 'signup' || view === 'reset') {
            const error = validatePassword(password);
            if (error) { toast.error(error); return; }
        }

        if (view === 'login') {
            if (!isEmailChecked) {
                handleEmailCheck();
                return;
            }
            const tid = toast.loading("Authenticating...");
            const result = await login({ email, password });
            if (result.success) {
                toast.success("Login Successful! Welcome back.", { id: tid });
            } else {
                toast.error(
                    result.message || "Something is wrong. Please type it correctly or change your password.",
                    { id: tid, duration: 4000 }
                );
            }
        } else if (view === 'signup') {
            const fullPhone = phone ? `+${phoneCode}${phone.replace(/\D/g, '')}` : undefined;
            const result = await signup({ email, phone: fullPhone, password, name, role, city, state, country });
            if (result.success) {
                toast.success("Account ready! Please verify captcha.");
                if (result.captchaSvg) setCaptchaSvg(result.captchaSvg);
                if (result.registrationToken) setRegistrationToken(result.registrationToken);
                setView('verify');
            } else {
                toast.error(result.message || "Signup failed");
            }
        } else if (view === 'verify') {
            if (!registrationToken) {
                toast.error("Session expired. Please sign up again.");
                setView('signup');
                return;
            }
            const tid = toast.loading("Verifying Captcha...");
            const result = await verify(registrationToken, otp);
            if (result.success) {
                toast.success("Identity Verified! Welcome.", { id: tid });
            } else {
                toast.error(result.message || "Invalid Captcha", { id: tid });
            }
        } else if (view === 'forgot') {
            const tid = toast.loading("Verifying Identity...");
            try {
                const api = await import('../services/api');
                await api.resetPasswordVerify(email, name, password);
                toast.success("Password Reset Successful! Login with new credentials.", { id: tid });
                setView('login');
            } catch (err: any) {
                toast.error(err.message || "Verification failed. Check Name/Email.", { id: tid });
            }
        } else if (view === 'reset') {
            const tid = toast.loading("Updating Password...");
            try {
                const api = await import('../services/api');
                await api.resetPassword(email, password);
                toast.success("Password Updated! Please Login.", { id: tid });
                setView('login');
            } catch (err) {
                toast.error("Reset Failed. Try again.", { id: tid });
            }
        }
    };

    const handleResendOTP = async () => {
        if (!registrationToken) return;
        const tid = toast.loading("Refreshing captcha...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationToken })
            });
            const data = await res.json();
            if (data.captchaSvg) setCaptchaSvg(data.captchaSvg);
            if (data.registrationToken) setRegistrationToken(data.registrationToken);
            toast.success("New code generated!", { id: tid });
        } catch (err: any) {
            toast.error(err.message || "Failed to refresh captcha", { id: tid });
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>

                {/* Unified Login Notice */}
                {view === 'login' && (
                    <div className={styles.noticeBox} style={{ borderColor: isEmailChecked ? '#10b981' : undefined }}>
                        <div className={styles.noticeDot} style={{ background: isEmailChecked ? '#10b981' : undefined }}></div>
                        <span>
                            {isEmailChecked
                                ? <strong>VanaMap Verified: {emailVerifiedResult?.name}</strong>
                                : <><strong>Users and Vendors</strong> can login here.</>}
                        </span>
                    </div>
                )}

                <div className={styles.authHeader}>
                    <h2 className={styles.authTitle}>
                        {view === 'login' && (isEmailChecked ? 'Enter Password' : 'Welcome Back')}
                        {view === 'signup' && 'Create Account'}
                        {view === 'verify' && 'Verify Identity'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'New Password'}
                    </h2>
                    <p className={styles.authSubtitle}>
                        {view === 'login' && (isEmailChecked ? `Hi ${emailVerifiedResult?.name.split(' ')[0]}, please type your key.` : 'Enter email or phone to verify status')}
                        {view === 'signup' && 'Join the VanaMap community today'}
                        {view === 'verify' && `Please enter the characters shown below`}
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
                            <div className={styles.roleIcon}>
                                <User size={18} />
                            </div>
                            <span>Plant Lover</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleBtn} ${role === 'vendor' ? styles.active : ''} `}
                            onClick={() => setRole('vendor')}
                        >
                            <div className={styles.roleIcon}>
                                <Store size={18} />
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

                    {/* Unified Location Collection */}
                    {view === 'signup' && (
                        <>
                            <div className={styles.formGroup}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label className={styles.label} style={{ marginBottom: 0 }}>
                                        {role === 'vendor' ? 'Business Location' : 'Your Location'}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!navigator.geolocation) return toast.error("Not supported");
                                            const tid = toast.loading("Detecting...");
                                            navigator.geolocation.getCurrentPosition(async (pos) => {
                                                try {
                                                    const { latitude, longitude } = pos.coords;
                                                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                                    const data = await res.json();

                                                    if (data.address) {
                                                        const code = data.address.country_code?.toUpperCase();
                                                        const countryObj = Country.getCountryByCode(code);

                                                        if (countryObj) {
                                                            setSelectedCountry(countryObj);
                                                            setCountry(countryObj.name);
                                                            setPhoneCode(countryObj.phonecode);

                                                            const stateName = data.address.state;
                                                            if (stateName) {
                                                                const states = State.getStatesOfCountry(countryObj.isoCode);
                                                                const foundState = states.find(s =>
                                                                    s.name.toLowerCase().includes(stateName.toLowerCase()) ||
                                                                    stateName.toLowerCase().includes(s.name.toLowerCase())
                                                                );
                                                                if (foundState) {
                                                                    setSelectedState(foundState);
                                                                    setState(foundState.name);
                                                                }
                                                            }
                                                        }

                                                        const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                                        if (cityVal) setCity(cityVal);

                                                        toast.success("Location Detected!", { id: tid });
                                                    }
                                                } catch (e) {
                                                    toast.error("Failed to detect address", { id: tid });
                                                }
                                            }, () => toast.error("Permission denied", { id: tid }));
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        📍 Auto-Detect
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <select
                                            className={styles.select}
                                            value={selectedCountry?.isoCode || ''}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            required
                                        >
                                            {Country.getAllCountries().map(c => (
                                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            className={styles.select}
                                            value={selectedState?.isoCode || ''}
                                            onChange={(e) => handleStateChange(e.target.value)}
                                            required
                                        >
                                            <option value="">{selectedCountry ? 'Select State' : 'Select Country First'}</option>
                                            {selectedCountry && State.getStatesOfCountry(selectedCountry.isoCode).map(s => (
                                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder={role === 'vendor' ? "City / District" : "City (e.g. Kathmandu)"}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Vendor Specific Phone (Only for Vendor) - REMOVED redundant here, handled below */}
                        </>
                    )}

                    {/* email/Phone Field - Step 1 for Login */}
                    <div className={styles.formGroup} style={{ opacity: (isEmailChecked && view === 'login') ? 0.6 : 1, transition: '0.3s' }}>
                        <label className={styles.label}>{view === 'login' ? 'Email or Phone Number' : 'Email Address'}</label>
                        <input
                            className={styles.input}
                            type={view === 'login' ? "text" : "email"}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setIsEmailChecked(false); }}
                            required
                            disabled={(isEmailChecked && view === 'login') || view === 'verify'}
                            placeholder={view === 'login' ? "Email or Mobile Number" : "name@example.com"}
                        />
                        {isEmailChecked && view === 'login' && (
                            <button
                                type="button"
                                className={styles.changeEmailBtn}
                                onClick={() => { setIsEmailChecked(false); setPassword(''); }}
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {view === 'signup' && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>WhatsApp / Mobile Number</label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.phonePrefix}>+{phoneCode}</div>
                                <input
                                    className={styles.input}
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="XXXXX XXXXX"
                                    style={{ paddingLeft: '4.5rem' }}
                                />
                            </div>
                        </div>
                    )}

                    {view === 'verify' && (
                        <div className={`${styles.formGroup} ${styles.revealAnimation}`}>
                            <label className={styles.label}>Enter Captcha</label>

                            {captchaSvg && (
                                <div
                                    className={styles.captchaBox}
                                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                                    style={{
                                        background: '#f8fafc',
                                        padding: '10px',
                                        borderRadius: '12px',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        border: '1px solid #e2e8f0'
                                    }}
                                />
                            )}

                            <input
                                className={styles.input}
                                type="text"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Type 4 characters"
                                autoFocus
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px', textTransform: 'lowercase' }}
                            />
                        </div>
                    )}

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

                    {/* Step 2: Password Field */}
                    {((view === 'signup' || view === 'reset' || view === 'forgot') || (view === 'login' && isEmailChecked)) && (
                        <div className={`${styles.formGroup} ${styles.revealAnimation}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <label className={styles.label} style={{ marginBottom: 0 }}>
                                    {(view === 'reset' || view === 'forgot') ? 'New Password' : 'Password'}
                                </label>
                                {(view === 'signup' || view === 'reset') && (
                                    <span className={styles.hintText} style={{ color: password.length > 0 && validatePassword(password) ? '#ef4444' : '#10b981' }}>
                                        {password.length === 0 ? '' : (validatePassword(password) || 'Strong Key')}
                                    </span>
                                )}
                            </div>
                            <div className={styles.passwordWrapper}>
                                <input
                                    className={styles.input}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className={styles.eyeIcon} />
                                    ) : (
                                        <Eye size={18} className={styles.eyeIcon} />
                                    )}
                                </button>
                            </div>
                            {view === 'signup' && (
                                <p className={styles.passwordRules}>
                                    4-18 chars, 1 Upper, 1 Number, 1 Special (@#$%)
                                </p>
                            )}
                        </div>
                    )}

                    {!isEmailChecked && view === 'login' ? (
                        <Button
                            type="button"
                            onClick={handleEmailCheck}
                            disabled={emailLoading}
                            variant="primary"
                            className={styles.submitBtn}
                        >
                            {emailLoading ? 'Verifying...' : 'Next'}
                        </Button>
                    ) : (
                        <Button type="submit" variant="primary" className={styles.submitBtn}>
                            {view === 'login' && 'Log In'}
                            {view === 'signup' && 'Send Code'}
                            {view === 'verify' && 'Verify & Enter'}
                            {view === 'forgot' && 'Reset Password'}
                            {view === 'reset' && 'Update Password'}
                        </Button>
                    )}

                    {view === 'login' && !isEmailChecked && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setView('forgot')}
                                className={styles.forgotLink}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

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
                                New to VanaMap? <button onClick={() => { setView('signup'); setIsEmailChecked(false); }} style={{ color: '#10b981', fontWeight: 600 }}>Create Account</button>
                            </p>
                        </>
                    )}
                    {view === 'signup' && (
                        <>Already have an account? <button onClick={() => { setView('login'); setIsEmailChecked(false); }} style={{ color: '#10b981', fontWeight: 600 }}>Log In</button></>
                    )}
                    {view === 'verify' && (
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <div className={styles.hintText}>
                                Can't read the code? <button type="button" onClick={handleResendOTP} style={{ color: '#10b981', fontWeight: 600 }}>Refresh Captcha</button>
                            </div>
                        </div>
                    )}
                    {(view === 'forgot' || view === 'reset') && (
                        <><button onClick={() => { setView('login'); setIsEmailChecked(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto', color: '#cbd5e1' }}>
                            <ArrowLeft size={16} /> Return to Login
                        </button></>
                    )}
                </div>
            </div >
        </div >
    );
};
