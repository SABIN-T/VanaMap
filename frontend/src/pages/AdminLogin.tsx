import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Use environment variables (with hardcoded fallback for immediate fix)
        const validEmail = import.meta.env.VITE_ADMIN_USER || 'admin@plantai.com';
        const validPass = import.meta.env.VITE_ADMIN_PASS || 'Defender123';

        console.log("Expected User:", validEmail, "Entered:", email);
        console.log("Expected Pass:", validPass, "Entered:", password);

        if (email.trim() === validEmail && password.trim() === validPass) {
            localStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin');
        } else {
            alert(`Invalid Credentials.\nExpected: ${validEmail}\nGot: ${email}`);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}>
                        <Lock size={40} color="#facc15" />
                    </div>
                    <h1>Admin Portal</h1>
                    <p style={{ color: '#aaa' }}>Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <Button type="submit" size="lg" style={{ marginTop: '1rem' }}>
                        Access Dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
};
