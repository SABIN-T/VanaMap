import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '../common/Button';

interface VerificationModalProps {
    onSuccess: () => void;
    onClose: () => void;
    initialMethod?: 'email' | 'phone';
    disableEmail?: boolean;
}

export const VerificationModal = ({ onSuccess, onClose, initialMethod = 'email', disableEmail = false }: VerificationModalProps) => {
    const [method, setMethod] = useState<'email' | 'phone'>(disableEmail ? 'phone' : initialMethod);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');

    const sendOTP = async () => {
        setLoading(true);
        const tid = toast.loading(`Sending OTP to your ${method}...`);
        try {
            // Get token from localStorage
            const saved = localStorage.getItem('user');
            const token = saved ? JSON.parse(saved).token : null;

            if (!token) {
                throw new Error("You must be logged in");
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/send-contact-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ method })
            });

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                toast.success(data.message || `OTP Sent! Check your ${method}.`, { id: tid });
            } else {
                toast.error(data.error || "Failed to send OTP", { id: tid });
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP', { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        const tid = toast.loading("Verifying code...");
        try {
            const saved = localStorage.getItem('user');
            const token = saved ? JSON.parse(saved).token : null;

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api'}/user/verify-contact-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ otp, method, phone: method === 'phone' ? phone : undefined })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Verification successful!', { id: tid });
                onSuccess();
                setTimeout(onClose, 1000);
            } else {
                toast.error(data.error || "Invalid OTP", { id: tid });
            }
        } catch (error) {
            toast.error('Verification failed', { id: tid });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
            <div style={{
                width: '100%', maxWidth: '400px',
                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem', padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                animation: 'scaleIn 0.3s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                        width: '64px', height: '64px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                    }}>
                        <Shield size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>Secure Your Account</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Verify your contact details to access Cart & Premium features.
                    </p>
                </div>

                {!otpSent ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!disableEmail && <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500 }}>Select Verification Method:</p>}

                        {!disableEmail && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => setMethod('email')}
                                    style={{
                                        padding: '1rem', borderRadius: '12px', border: '1px solid',
                                        borderColor: method === 'email' ? '#10b981' : 'rgba(255,255,255,0.1)',
                                        background: method === 'email' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        color: method === 'email' ? '#10b981' : '#94a3b8',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <Mail size={24} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email</span>
                                </button>

                                <button
                                    onClick={() => setMethod('phone')}
                                    style={{
                                        padding: '1rem', borderRadius: '12px', border: '1px solid',
                                        borderColor: method === 'phone' ? '#10b981' : 'rgba(255,255,255,0.1)',
                                        background: method === 'phone' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        color: method === 'phone' ? '#10b981' : '#94a3b8',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <Phone size={24} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Phone</span>
                                </button>
                            </div>
                        )}

                        {method === 'phone' && (
                            <input
                                type="tel"
                                placeholder="Enter Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', marginTop: '0.5rem'
                                }}
                            />
                        )}

                        <Button
                            onClick={sendOTP}
                            disabled={loading || (method === 'phone' && phone.length < 10)}
                            variant="primary"
                            style={{ width: '100%', marginTop: '1rem', height: '48px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                                Enter the 6-digit code sent to your {method}.
                            </p>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid #10b981',
                                        color: 'white', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Button
                                onClick={verifyOTP}
                                disabled={loading || otp.length !== 6}
                                variant="primary"
                                style={{ width: '100%', height: '48px', fontSize: '1rem' }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Setup'}
                            </Button>

                            <button
                                onClick={() => setOtpSent(false)}
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Change Method / Resend
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'transparent', border: 'none', color: '#64748b',
                        cursor: 'pointer', fontSize: '1.5rem'
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};
