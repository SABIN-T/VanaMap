import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Contact = () => {
    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '100vh',
            paddingTop: '6rem',
            color: 'white'
        }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                }}>
                    <MessageCircle size={40} color="#38bdf8" /> Contact Support
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Have questions about your plants, orders, or our app? We're here to help you grow.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                {/* Contact Information */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle size={24} color="#facc15" /> Get in Touch
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                <Mail size={24} color="#38bdf8" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email Us</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>support@vanamap.com</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Response time: Within 24 hours</p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                <Phone size={24} color="#10b981" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Call Us</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>+1 (555) 123-4567</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Mon-Fri, 9am - 6pm EST</p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                        }}>
                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                <MapPin size={24} color="#f43f5e" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Visit HQ</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                    123 Green Earth Blvd<br />
                                    Eco City, EC 90210
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.3)',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Send a Message</h2>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Your Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Message</label>
                            <textarea
                                rows={5}
                                placeholder="How can we help you?"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <Button variant="primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Send size={18} /> Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
