import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button';
import toast from 'react-hot-toast';
import styles from './ContactSupport.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

export const ContactSupport = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // Pre-fill user data when opened
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !message) {
            toast.error('Email and message are required');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/support/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message,
                    userId: user?.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Message sent! We\'ll reply shortly.');
                setIsOpen(false);
                setSubject('');
                setMessage('');
                // Don't clear name/email for convenience
            } else {
                toast.error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact error:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={styles.fab}
                onClick={() => setIsOpen(true)}
                aria-label="Contact Support"
            >
                <div className={styles.fabIcon}>
                    <Mail size={24} />
                </div>
                <span className={styles.fabLabel}>Support</span>
            </button>

            {/* Support Modal */}
            {isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.headerTitle}>
                                <div className={styles.headerIcon}>
                                    <MessageSquare size={20} />
                                </div>
                                <h3>Contact Support</h3>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p className={styles.modalDesc}>
                                Have a question or need help? Send us a message and we'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        placeholder="How can we help?"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Message *</label>
                                    <textarea
                                        placeholder="Tell us more about your issue..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        disabled={loading}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
