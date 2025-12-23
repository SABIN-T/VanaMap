import { useState } from 'react';
import { ArrowLeft, Send, Sparkles, MessageCircle, AlertTriangle, CheckCircle, Store, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const Support = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [plantName, setPlantName] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plantName || !reason) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    userName: user?.name,
                    plantName,
                    description: reason
                })
            });

            if (res.ok) {
                toast.success("Suggestion sent successfully!");
                setPlantName('');
                setReason('');
            } else {
                toast.error("Failed to send suggestion.");
            }
        } catch (err) {
            toast.error("Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', color: '#94a3b8' }}>
                <ArrowLeft size={18} /> Back
            </Button>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Support Community</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Help us grow the VanaMap ecosystem together.</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem' }}>

                {/* Sponsor Section */}
                <div className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(250, 204, 21, 0.2)',
                    background: 'linear-gradient(145deg, rgba(250, 204, 21, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(250, 204, 21, 0.1)', padding: '10px', borderRadius: '12px' }}>
                            <HeartHandshake size={32} color="#facc15" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#facc15' }}>Become a Sponsor</h2>
                    </div>
                    <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        We are actively looking for partners to help upgrade the VanaMap infrastructure.
                        If you share our vision for a greener future, let's collaborate.
                    </p>
                    <Button
                        onClick={() => navigate('/sponsor')}
                        style={{ width: '100%', background: '#facc15', color: '#000', fontWeight: 'bold' }}
                    >
                        View Sponsorship Details <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                    </Button>
                </div>

                {/* Plant Suggestion */}
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '12px' }}>
                            <Sparkles size={28} color="#60a5fa" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Suggest a Plant</h2>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Found something missing? Let us know!</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitSuggestion} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Plant Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rare Hoya Carnosa"
                                value={plantName}
                                onChange={e => setPlantName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '0.8rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Why should we add this?</label>
                            <textarea
                                placeholder="Describe its benefits or where it grows best..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '0.8rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting} variant="primary">
                            {isSubmitting ? 'Sending...' : 'Send Suggestion'} <Send size={16} />
                        </Button>
                    </form>
                </div>

                {/* Partner / Vendor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                        <Store size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Vendor Partner</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Join our verified network of sellers.</p>
                        <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>Login as Vendor</Button>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                        <AlertTriangle size={32} color="#f43f5e" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Report Issue</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Found a bug? Tell us about it.</p>
                        <Button variant="outline" size="sm" onClick={() => window.location.href = 'mailto:support@vanamap.com'}>Email Support</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};
