import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './Contact.module.css';
import { useState, useEffect } from 'react';

export const Contact = () => {
    const navigate = useNavigate();
    const [captchaText, setCaptchaText] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userCaptcha !== captchaText) {
            toast.error("Incorrect Captcha Code. Please try again.");
            setUserCaptcha('');
            generateCaptcha();
            return;
        }

        const form = e.target as HTMLFormElement;
        const name = (form.elements[0] as HTMLInputElement).value;
        const message = (form.elements[2] as HTMLTextAreaElement).value;

        const toastId = toast.loading("Dispatching to Admin HQ...");

        try {
            // New Support Ticket Logic
            const api = await import('../services/api');
            await api.createSupportTicket({
                subject: `Inquiry from ${name}`, // Auto-subject for now, or add field
                message: message
            });

            toast.success("Message Dispatched! Reply will be given in 2 days and will be visible in your Dashboard.", {
                id: toastId,
                duration: 6000,
                icon: '📨',
                style: {
                    borderRadius: '1rem',
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid #10b981',
                    maxWidth: '500px'
                }
            });
            form.reset();
            setUserCaptcha('');
            generateCaptcha();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to send. Please Login first.", {
                id: toastId,
                style: {
                    borderRadius: '1rem',
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid #f43f5e'
                }
            });
        }
    };

    return (
        <div className={styles.contactContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.badge}>
                    READY TO ASSIST
                </div>
                <h1 className={styles.title}>VANAMAP<br />CONCIERGE</h1>
                <p className={styles.subtitle}>
                    Have questions about your specimens, orders, or ecosystem? Our botanical experts are standing by.
                </p>
            </header>

            <div className={styles.grid}>
                {/* Contact Information */}
                <div className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <div className={styles.iconBox} style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
                            <Mail size={24} color="#38bdf8" />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>Email Support</h3>
                            <p className={styles.cardValue}>jiibruh86@gmail.com</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Average response: 2h</p>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.iconBox} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Phone size={24} color="#10b981" />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>Botanist Hotline</h3>
                            <p className={styles.cardValue}>+91 9188773534</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>WhatsApp Available</p>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.iconBox} style={{ background: 'rgba(244, 63, 94, 0.1)' }}>
                            <MapPin size={24} color="#f43f5e" />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>Global HQ</h3>
                            <p className={styles.cardValue}>Calicut, Kerala<br />India</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={styles.formCard}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '2rem' }}>Send Inquiry</h2>
                    <form onSubmit={handleSendMessage}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Identity</label>
                            <input type="text" placeholder="Your Name" className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Channel</label>
                            <input type="email" placeholder="Email Address" className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Manifesto</label>
                            <textarea rows={4} placeholder="How can we help your ecosystem grow?" className={styles.textarea} required />
                        </div>

                        {/* Captcha Section */}
                        <div className={styles.inputGroup} style={{ marginBottom: '2rem' }}>
                            <label className={styles.label}>Security Check</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div className={styles.captchaBox} style={{ position: 'relative', overflow: 'hidden' }}>
                                    {/* Noise lines for effect */}
                                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: 'rgba(0,0,0,0.3)', transform: 'rotate(5deg)' }}></div>
                                    <div style={{ position: 'absolute', top: '20%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.3)', transform: 'rotate(-10deg)' }}></div>
                                    {captchaText}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className={styles.input}
                                    style={{ letterSpacing: '2px', textTransform: 'uppercase' }}
                                    value={userCaptcha}
                                    onChange={(e) => setUserCaptcha(e.target.value.toUpperCase().slice(0, 4))}
                                    maxLength={4}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', fontWeight: '800', opacity: userCaptcha.length === 4 ? 1 : 0.6 }}
                            disabled={userCaptcha.length !== 4}
                        >
                            <Send size={18} /> DISPATCH MESSAGE
                        </Button>
                    </form>
                </div>

                {/* Plant Suggestion Promotion */}
                <div className={styles.suggestionPromo}>
                    <div className={styles.promoContent}>
                        <h2 className={styles.promoTitle}>Missing a Specimen?</h2>
                        <p className={styles.promoDesc}>
                            If you've discovered a rare plant species that isn't in our database yet, let us know!
                            Our team will analyze its oxygen output and add it to the ecosystem.
                        </p>
                    </div>
                    <button className={styles.suggestionBtn} onClick={() => navigate('/support')}>
                        <Sparkles size={20} /> SUGGEST A PLANT
                    </button>
                </div>
            </div>
        </div>
    );
};
