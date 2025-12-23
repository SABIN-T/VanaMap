import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Clock, User, Sparkles, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const ManageSuggestions = () => {
    const { user } = useAuth();
    const token = (user as any)?.token;
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/suggestions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setSuggestions(data);
            }
        } catch (err) {
            toast.error("Failed to load suggestions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return formatDate(dateString);
    };

    return (
        <AdminLayout title="Ecosystem Requests">
            <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                    Review plant species suggested by the community for inclusion in the VanaMap database.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: '#94a3b8' }}>Synchronizing requests...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {suggestions.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Sparkles size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2, color: '#10b981' }} />
                            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ecosystem is Up to Date</h3>
                            <p style={{ color: '#64748b' }}>No pending plant suggestions found at this time.</p>
                        </div>
                    )}

                    {suggestions.map((s) => (
                        <div key={s._id} className="glass-panel" style={{
                            padding: '2rem',
                            borderRadius: '1.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '1rem' }}>
                                    <MessageSquare size={24} color="#10b981" />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '800' }}>
                                        <Clock size={12} /> {getTimeAgo(s.submittedAt)}
                                    </div>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '0.5rem',
                                        fontSize: '0.65rem',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#cbd5e1',
                                        fontWeight: '800',
                                        letterSpacing: '0.5px'
                                    }}>
                                        ID: {s._id.substring(18)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>{s.plantName}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    <User size={14} /> Submitted by <strong style={{ color: '#cbd5e1' }}>{s.userName || 'Root User'}</strong>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '1.25rem',
                                borderRadius: '1rem',
                                fontSize: '0.95rem',
                                color: '#94a3b8',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                                border: '1px solid rgba(255,255,255,0.03)'
                            }}>
                                "{s.description}"
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2"
                                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                                    onClick={() => toast.success("Added to review queue")}
                                >
                                    <CheckCircle size={16} /> APPROVE
                                </button>
                                <button
                                    className="flex-shrink-0"
                                    style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer' }}
                                    onClick={() => toast.error("Rejection noted")}
                                >
                                    <XCircle size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};
