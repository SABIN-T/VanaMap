import { useState } from 'react';
import { ArrowLeft, Send, Sparkles, AlertTriangle, Store, MoveRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { submitSuggestion } from '../services/api';
import styles from './Support.module.css';

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
            await submitSuggestion({
                userId: user?.id,
                userName: user?.name,
                plantName,
                description: reason
            });

            toast.success("Suggestion sent successfully!");
            setPlantName('');
            setReason('');
        } catch (err) {
            toast.error("Failed to send suggestion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.supportContainer}>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
                <ArrowLeft size={18} /> Back to Ecosystem
            </button>

            <header className={styles.header}>
                <div className={styles.badge}>
                    COMMUNITY POWERED
                </div>
                <h1 className={styles.title}>How can we<br />help you?</h1>
                <p className={styles.subtitle}>Join our mission to bridge nature with technology. Whether you want to contribute, partner, or fix an issue, we're here.</p>
            </header>

            <div className={styles.sectionGrid}>
                {/* Sponsor Section */}
                <div className={`${styles.glassCard} ${styles.sponsorCard}`}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${styles.sponsorIcon}`}>
                            <Heart size={32} fill="#facc15" color="#facc15" />
                        </div>
                        <h2 className={styles.cardTitle} style={{ color: '#facc15' }}>Partner with VanaMap</h2>
                    </div>
                    <p className={styles.cardDesc}>
                        We're looking for visionary partners to help us scale.
                        Your support directly funds reforestation projects and advanced research.
                    </p>
                    <Button
                        onClick={() => navigate('/sponsor')}
                        className={styles.sponsorActionBtn}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
                            color: '#000',
                            fontWeight: '900',
                            borderRadius: '1.25rem',
                            padding: '1.5rem',
                            fontSize: '1.1rem',
                            border: 'none',
                            boxShadow: '0 15px 30px -10px rgba(250, 204, 21, 0.4)'
                        }}
                    >
                        BECOME A SPONSOR <MoveRight size={22} style={{ marginLeft: '12px' }} />
                    </Button>
                </div>

                {/* Plant Suggestion */}
                <div className={styles.glassCard}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${styles.sparkleIcon}`}>
                            <Sparkles size={32} />
                        </div>
                        <div>
                            <h2 className={styles.cardTitle}>Suggest a Plant</h2>
                            <span className={styles.cardSubtitle}>Help us grow our database of oxygen-rich species.</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitSuggestion} className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Plant Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rare Monstera Adansonii"
                                value={plantName}
                                onChange={e => setPlantName(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Why should we add this?</label>
                            <textarea
                                placeholder="Tell us about its benefits, where it grows, or why you love it..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={3}
                                className={styles.textarea}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="primary"
                            style={{ padding: '1.25rem', borderRadius: '1rem', fontWeight: '800' }}
                        >
                            {isSubmitting ? 'PROCESSING...' : 'SUBMIT REQUEST'} <Send size={18} />
                        </Button>
                    </form>
                </div>

                {/* Mini Actions Grid */}
                <div className={styles.actionGrid}>
                    <div className={`${styles.glassCard} ${styles.miniCard}`}>
                        <Store size={32} color="#10b981" className={styles.miniIcon} />
                        <h3 className={styles.miniTitle}>Vendor Hub</h3>
                        <p className={styles.miniDesc}>Scale your nursery business by joining our verified network.</p>
                        <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate('/auth')}>JOIN NETWORK</Button>
                    </div>

                    <div className={`${styles.glassCard} ${styles.miniCard}`}>
                        <AlertTriangle size={32} color="#f43f5e" className={styles.miniIcon} />
                        <h3 className={styles.miniTitle}>Report Data Issue</h3>
                        <p className={styles.miniDesc}>Spotted an error? Help us keep our plant data accurate.</p>
                        <Button variant="outline" style={{ width: '100%' }} onClick={() => window.location.href = 'mailto:support@vanamap.com'}>REPORT AN ISSUE</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
