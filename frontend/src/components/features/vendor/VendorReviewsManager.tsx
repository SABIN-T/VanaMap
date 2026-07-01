import { useState, useEffect } from 'react';
import { Star, MessageSquare, CornerDownRight, Send, Loader2, Calendar } from 'lucide-react';
import { fetchVendorReviews, replyToVendorReview } from '../../../services/api';
import toast from 'react-hot-toast';

interface VendorReviewsManagerProps {
    vendorId: string;
}

export const VendorReviewsManager = ({ vendorId }: VendorReviewsManagerProps) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await fetchVendorReviews(vendorId);
            setReviews(data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load customer reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vendorId) {
            loadReviews();
        }
    }, [vendorId]);

    const handleReplySubmit = async (reviewId: string) => {
        const text = replyText[reviewId];
        if (!text || !text.trim()) {
            toast.error("Reply text cannot be empty");
            return;
        }

        setSubmittingId(reviewId);
        const tid = toast.loading("Submitting reply...");
        try {
            await replyToVendorReview(vendorId, reviewId, text);
            toast.success("Reply posted successfully!", { id: tid });
            setReplyText(prev => {
                const copy = { ...prev };
                delete copy[reviewId];
                return copy;
            });
            loadReviews();
        } catch (err: any) {
            toast.error(err.message || "Failed to post reply", { id: tid });
        } finally {
            setSubmittingId(null);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={32} color="#10b981" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s' }}>
            
            {/* Rating Summary header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem'
            }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Shop Standing</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24' }}>{avgRating}</span>
                        <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 5.0</span>
                    </div>
                </div>

                <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.06)', height: '50px' }} />

                <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Total Feedbacks</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>
                        {reviews.length} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Customer reviews</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 ? (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px dashed rgba(255, 255, 255, 0.06)',
                        borderRadius: '16px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        color: '#64748b'
                    }}>
                        <MessageSquare size={36} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1' }}>No Customer Reviews Yet</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>When verified buyers purchase plants from your shop, their feedback will show up here.</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>{rev.userName}</span>
                                        <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                            Verified Buyer
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star 
                                                key={s} 
                                                size={12} 
                                                fill={s <= rev.rating ? '#fbbf24' : 'none'} 
                                                color="#fbbf24" 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
                                    <Calendar size={12} />
                                    <span>{new Date(rev.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                                {rev.comment}
                            </p>

                            {/* Existing Reply */}
                            {rev.reply ? (
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.02)',
                                    borderLeft: '3px solid #10b981',
                                    padding: '10px 14px',
                                    borderRadius: '0 12px 12px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    marginTop: '4px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>
                                        <CornerDownRight size={12} />
                                        <span>Your Response:</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>{rev.reply}</p>
                                </div>
                            ) : (
                                /* Post Reply Form */
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginTop: '8px',
                                    background: 'rgba(0,0,0,0.2)',
                                    padding: '8px',
                                    borderRadius: '10px'
                                }}>
                                    <input 
                                        type="text"
                                        placeholder="Type your response to this feedback..."
                                        style={{
                                            flex: 1,
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '0.8rem',
                                            outline: 'none',
                                            padding: '4px 8px'
                                        }}
                                        value={replyText[rev._id] || ''}
                                        onChange={e => setReplyText(prev => ({ ...prev, [rev._id]: e.target.value }))}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleReplySubmit(rev._id);
                                        }}
                                    />
                                    <button
                                        onClick={() => handleReplySubmit(rev._id)}
                                        disabled={submittingId === rev._id}
                                        style={{
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '4px 12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: submittingId === rev._id ? 'wait' : 'pointer'
                                        }}
                                    >
                                        {submittingId === rev._id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                        <span>Respond</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
