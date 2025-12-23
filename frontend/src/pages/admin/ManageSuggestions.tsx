import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Search, MapPin, Check, X, Clock, User, Filter, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const ManageSuggestions = () => {
    const { token } = useAuth();
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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="User Plant Suggestions">
            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading requests...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestions.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                            <Sparkles size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No suggestions pending. The community is quiet.</p>
                        </div>
                    )}

                    {suggestions.map((s) => (
                        <div key={s._id} className="glass-panel" style={{
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.2rem' }}>{s.plantName}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        <User size={12} /> {s.userName || 'Anonymous'}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '99px',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    color: '#38bdf8'
                                }}>
                                    {s.status?.toUpperCase() || 'PENDING'}
                                </span>
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.2)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.9rem',
                                color: '#cbd5e1',
                                lineHeight: '1.5',
                                flex: 1
                            }}>
                                "{s.description}"
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem' }}>
                                    <Clock size={12} /> {formatDate(s.submittedAt)}
                                </div>
                                {/* Future actions: Approve/Reject */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};
