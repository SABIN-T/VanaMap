import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Sponsor = () => {
    const navigate = useNavigate();

    return (
        <div className="page-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, rgba(250, 204, 21, 0.1), transparent 40%), #0f172a'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '600px',
                width: '90%',
                padding: '3rem',
                textAlign: 'center',
                borderRadius: '2rem',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                boxShadow: '0 20px 50px -10px rgba(250, 204, 21, 0.15)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #facc15, #b45309)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    boxShadow: '0 0 30px rgba(250, 204, 21, 0.4)'
                }}>
                    <MessageCircle size={40} color="#fff" fill="rgba(255,255,255,0.2)" />
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#facc15', marginBottom: '1rem', lineHeight: 1.1 }}>
                    Power the Future<br />of VanaMap
                </h1>

                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                    For the upgrade of this app, we are actively searching for visionary sponsors. If you are interested in sponsoring the next phase of our ecosystem engine, please connect with us directly.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>WHATSAPP DIRECT LINE</div>
                    <div style={{ fontSize: '1.8rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#4ade80', letterSpacing: '1px' }}>
                        +91 9188773534
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </Button>
                    <Button
                        onClick={() => window.open('https://wa.me/919188773534', '_blank')}
                        style={{ background: '#25D366', color: 'white', border: 'none' }}
                    >
                        Chat on WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
};
