import { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, Calendar, Loader2 } from 'lucide-react';
import { fetchVendorReviews, submitVendorReview, fetchUserOrders } from '../../../services/api';
import toast from 'react-hot-toast';
import type { Vendor } from '../../../types';

interface VendorReviewsModalProps {
    vendor: Vendor;
    onClose: () => void;
}

export const VendorReviewsModal = ({ vendor, onClose }: VendorReviewsModalProps) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hasDeliveredOrder, setHasDeliveredOrder] = useState(false);
    const [checkingPurchase, setCheckingPurchase] = useState(true);

    const loadReviewsAndEligibility = async () => {
        setLoading(true);
        try {
            // Load reviews
            const reviewsData = await fetchVendorReviews(vendor.id);
            setReviews(reviewsData || []);

            // Check purchase eligibility
            const orders = await fetchUserOrders();
            const eligible = orders.some((o: any) => o.vendorId === vendor.id && o.status === 'delivered');
            setHasDeliveredOrder(eligible);
        } catch (err: any) {
            console.error("Failed to load reviews data:", err);
        } finally {
            setLoading(false);
            setCheckingPurchase(false);
        }
    };

    useEffect(() => {
        loadReviewsAndEligibility();
    }, [vendor.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        const tid = toast.loading("Submitting your review...");
        try {
            await submitVendorReview(vendor.id, rating, comment);
            toast.success("Review submitted successfully!", { id: tid });
            setComment('');
            setRating(5);
            loadReviewsAndEligibility();
        } catch (err: any) {
            toast.error(err.message || "Failed to submit review", { id: tid });
        } finally {
            setSubmitting(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '1rem',
            animation: 'fadeIn 0.25s ease-out'
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(30, 41, 59, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '520px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                            {vendor.name}
                        </h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                            Customer Reviews & Ratings
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Summary Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '16px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{avgRating}</div>
                            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '6px 0' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                        key={s} 
                                        size={14} 
                                        fill={s <= Math.round(Number(avgRating)) ? '#f59e0b' : 'none'} 
                                        color="#f59e0b" 
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{reviews.length} total reviews</span>
                        </div>
                        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.06)', height: '50px' }} />
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '160px', textAlign: 'left', lineHeight: 1.4 }}>
                            Reviews are collected exclusively from customers with verified purchases.
                        </div>
                    </div>

                    {/* Write Review Section */}
                    {!checkingPurchase && (
                        hasDeliveredOrder ? (
                            <form onSubmit={handleSubmit} style={{
                                background: 'rgba(16, 185, 129, 0.03)',
                                border: '1px dashed rgba(16, 185, 129, 0.25)',
                                borderRadius: '16px',
                                padding: '1.25rem'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MessageSquare size={14} /> Write Verified Review
                                </h4>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Rating:</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={18}
                                                fill={(hoverRating !== null ? s <= hoverRating : s <= rating) ? '#fbbf24' : 'none'}
                                                color="#fbbf24"
                                                style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                                onMouseEnter={() => setHoverRating(s)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                onClick={() => setRating(s)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <textarea
                                        rows={2}
                                        required
                                        placeholder="Share your delivery experience, packing quality, or plant freshness..."
                                        style={{
                                            flex: 1,
                                            background: 'rgba(15, 23, 42, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            color: 'white',
                                            fontSize: '0.8rem',
                                            resize: 'none',
                                            outline: 'none'
                                        }}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            background: '#10b981',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: submitting ? 'wait' : 'pointer',
                                            alignSelf: 'stretch'
                                        }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{
                                padding: '10px 14px',
                                background: 'rgba(245, 158, 11, 0.05)',
                                border: '1px solid rgba(245, 158, 11, 0.15)',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                color: '#f59e0b',
                                textAlign: 'center'
                            }}>
                                🔒 Only customers with a completed, delivered purchase from this vendor can leave reviews.
                            </div>
                        )
                    )}

                    {/* Review List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>
                            Customer Feedback ({reviews.length})
                        </h4>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                <Loader2 className="animate-spin" color="#10b981" />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
                                No reviews posted yet. Be the first to share your experience!
                            </div>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev._id} style={{
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    paddingBottom: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>{rev.userName}</span>
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                                Verified Purchase
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1px' }}>
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star 
                                                    key={s} 
                                                    size={10} 
                                                    fill={s <= rev.rating ? '#fbbf24' : 'none'} 
                                                    color="#fbbf24" 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>{rev.comment}</p>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#64748b' }}>
                                        <Calendar size={10} />
                                        <span>{new Date(rev.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                    {/* Vendor Reply */}
                                    {rev.reply ? (
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '8px 12px',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderLeft: '2px solid #10b981',
                                            borderRadius: '0 8px 8px 0'
                                        }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', marginBottom: '2px' }}>
                                                Response from {vendor.name}:
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{rev.reply}</p>
                                        </div>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
