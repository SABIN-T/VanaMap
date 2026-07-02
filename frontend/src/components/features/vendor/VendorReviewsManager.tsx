import { useState, useEffect } from 'react';
import { 
    Star, MessageSquare, Send, Loader2, 
    Heart, Repeat, BarChart2, Bookmark, Share, CheckCircle, Image, Smile, AlignLeft
} from 'lucide-react';
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
    
    // X UI/UX Interactive State Extensions
    const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [repostReviews, setRepostReviews] = useState<Record<string, boolean>>({});
    const [repostCounts, setRepostCounts] = useState<Record<string, number>>({});
    const [activeComposeId, setActiveComposeId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'high'>('all');

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

    // Initialize like and repost counts deterministically based on review ID hash
    useEffect(() => {
        if (reviews.length > 0) {
            const initialLikes: Record<string, number> = {};
            const initialReposts: Record<string, number> = {};
            reviews.forEach(r => {
                let hash = 0;
                const idStr = r._id || '';
                for (let i = 0; i < idStr.length; i++) {
                    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
                }
                initialLikes[r._id] = Math.abs(hash % 35) + 3;
                initialReposts[r._id] = Math.abs(hash % 12);
            });
            setLikeCounts(initialLikes);
            setRepostCounts(initialReposts);
        }
    }, [reviews]);

    const handleReplySubmit = async (reviewId: string) => {
        const text = replyText[reviewId];
        if (!text || !text.trim()) {
            toast.error("Reply text cannot be empty");
            return;
        }

        setSubmittingId(reviewId);
        const tid = toast.loading("Posting reply to feed...");
        try {
            await replyToVendorReview(vendorId, reviewId, text);
            toast.success("Reply posted!", { id: tid });
            setReplyText(prev => {
                const copy = { ...prev };
                delete copy[reviewId];
                return copy;
            });
            setActiveComposeId(null);
            loadReviews();
        } catch (err: any) {
            toast.error(err.message || "Failed to post reply", { id: tid });
        } finally {
            setSubmittingId(null);
        }
    };

    const toggleLike = (reviewId: string) => {
        setLikedReviews(prev => {
            const isLiked = !prev[reviewId];
            setLikeCounts(cPrev => ({
                ...cPrev,
                [reviewId]: cPrev[reviewId] + (isLiked ? 1 : -1)
            }));
            return { ...prev, [reviewId]: isLiked };
        });
    };

    const toggleRepost = (reviewId: string) => {
        setRepostReviews(prev => {
            const isReposted = !prev[reviewId];
            setRepostCounts(cPrev => ({
                ...cPrev,
                [reviewId]: cPrev[reviewId] + (isReposted ? 1 : -1)
            }));
            if (isReposted) {
                toast.success("Reposted review to your shop profile!", { duration: 1500 });
            }
            return { ...prev, [reviewId]: isReposted };
        });
    };

    // Calculate simulated impressions count
    const getViewsCount = (reviewId: string) => {
        let hash = 0;
        const idStr = reviewId || '';
        for (let i = 0; i < idStr.length; i++) {
            hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const val = Math.abs(hash % 920) + 140; 
        if (val > 1000) return (val / 1000).toFixed(1) + 'K';
        return val.toString();
    };

    // Filter reviews based on active tab
    const filteredReviews = reviews.filter(r => {
        if (activeTab === 'pending') return !r.reply;
        if (activeTab === 'high') return r.rating >= 4;
        return true;
    });

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: '#e7e9ea',
            maxWidth: '680px',
            margin: '0 auto',
            background: '#000000',
            border: '1px solid #2f3336',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            
            {/* Header Title */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #2f3336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f7f9f9', letterSpacing: '-0.3px' }}>Customer Feedback</h2>
                    <span style={{ fontSize: '0.8rem', color: '#71767b' }}>{reviews.length} posts</span>
                </div>
                
                {/* Micro Rating Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(251, 191, 36, 0.08)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>{avgRating} standing</span>
                </div>
            </div>

            {/* Twitter-like Tab Navigation */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #2f3336',
                background: '#000000'
            }}>
                {(['all', 'pending', 'high'] as const).map(tab => {
                    const label = tab === 'all' ? 'All reviews' : tab === 'pending' ? 'Pending response' : 'High rating (4-5★)';
                    const active = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                padding: '16px 8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: active ? 700 : 500,
                                color: active ? '#f7f9f9' : '#71767b',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'color 0.2s',
                                outline: 'none'
                            }}
                        >
                            <span>{label}</span>
                            <div style={{
                                width: '40px',
                                height: '4px',
                                borderRadius: '2px',
                                background: active ? 'var(--color-primary)' : 'transparent',
                                transition: 'background-color 0.2s'
                            }} />
                        </button>
                    );
                })}
            </div>

            {/* Feed Section */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredReviews.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#71767b',
                        borderBottom: '1px solid #2f3336'
                    }}>
                        <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#f7f9f9', fontWeight: 700 }}>No Reviews Here</h4>
                        <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#71767b' }}>
                            {activeTab === 'pending' ? "Excellent! You've responded to all customer feedback." : "When verified buyers review your shop, their posts will appear here."}
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((rev) => {
                        const isLiked = !!likedReviews[rev._id];
                        const isReposted = !!repostReviews[rev._id];
                        const likes = likeCounts[rev._id] || 0;
                        const reposts = repostCounts[rev._id] || 0;
                        const isComposing = activeComposeId === rev._id;

                        return (
                            <div 
                                key={rev._id} 
                                style={{
                                    borderBottom: '1px solid #2f3336',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#000000',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {/* Review Main Post */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    
                                    {/* Left Column: Avatar + Thread Connector Line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {/* User Initial Avatar */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#2f3336',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 800,
                                            color: '#e7e9ea',
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            {rev.userName ? rev.userName.charAt(0) : 'U'}
                                        </div>
                                        
                                        {/* Vertical thread connector line to reply / compose box */}
                                        {(rev.reply || isComposing) && (
                                            <div style={{
                                                flex: 1,
                                                width: '2px',
                                                background: '#2f3336',
                                                marginTop: '4px',
                                                marginBottom: '-16px'
                                            }} />
                                        )}
                                    </div>

                                    {/* Right Column: Review Details & Content */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {/* User Info Line */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 800, color: '#f7f9f9', fontSize: '0.95rem' }}>{rev.userName}</span>
                                                <span title="Verified Buyer" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
                                                    <CheckCircle size={14} fill="#1d9bf0" color="#000000" />
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: '#71767b' }}>
                                                    @{rev.userName ? rev.userName.toLowerCase().replace(/\s+/g, '') : 'buyer'}
                                                </span>
                                                <span style={{ color: '#71767b', fontSize: '0.85rem' }}>•</span>
                                                <span style={{ fontSize: '0.85rem', color: '#71767b' }}>
                                                    {new Date(rev.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>

                                            {/* Rating Stars Badge */}
                                            <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
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

                                        {/* Comment Body */}
                                        <p style={{
                                            margin: '4px 0 0 0',
                                            fontSize: '0.95rem',
                                            color: '#e7e9ea',
                                            lineHeight: 1.5,
                                            wordBreak: 'break-word',
                                            whiteSpace: 'pre-line'
                                        }}>
                                            {rev.comment}
                                        </p>

                                        {/* X-Style Action Icons Bar */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            maxWidth: '420px',
                                            marginTop: '12px',
                                            marginLeft: '-8px',
                                            color: '#71767b'
                                        }}>
                                            
                                            {/* Reply Action */}
                                            <button 
                                                onClick={() => {
                                                    if (rev.reply) return; // Cannot reply twice
                                                    setActiveComposeId(isComposing ? null : rev._id);
                                                }}
                                                disabled={!!rev.reply}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: rev.reply ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.8rem',
                                                    color: rev.reply ? '#2f3336' : isComposing ? 'var(--color-primary)' : '#71767b',
                                                    padding: '6px 8px',
                                                    borderRadius: '9999px',
                                                    outline: 'none',
                                                    transition: 'background-color 0.2s, color 0.2s'
                                                }}
                                                className="x-action-btn"
                                            >
                                                <MessageSquare size={16} />
                                                <span>{rev.reply ? 1 : 0}</span>
                                            </button>

                                            {/* Repost Action */}
                                            <button 
                                                onClick={() => toggleRepost(rev._id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.8rem',
                                                    color: isReposted ? '#00ba7c' : '#71767b',
                                                    padding: '6px 8px',
                                                    borderRadius: '9999px',
                                                    outline: 'none',
                                                    transition: 'background-color 0.2s, color 0.2s'
                                                }}
                                            >
                                                <Repeat size={16} style={{ transform: isReposted ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                                                <span>{reposts}</span>
                                            </button>

                                            {/* Like Action */}
                                            <button 
                                                onClick={() => toggleLike(rev._id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.8rem',
                                                    color: isLiked ? '#f91880' : '#71767b',
                                                    padding: '6px 8px',
                                                    borderRadius: '9999px',
                                                    outline: 'none',
                                                    transition: 'background-color 0.2s, color 0.2s'
                                                }}
                                            >
                                                <Heart size={16} fill={isLiked ? '#f91880' : 'none'} style={{ transform: isLiked ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.1s' }} />
                                                <span>{likes}</span>
                                            </button>

                                            {/* Impressions/Views Action */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.8rem',
                                                color: '#71767b',
                                                padding: '6px 8px'
                                            }}>
                                                <BarChart2 size={16} />
                                                <span>{getViewsCount(rev._id)}</span>
                                            </div>

                                            {/* Bookmark Action */}
                                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#71767b', padding: '6px 8px', borderRadius: '9999px', outline: 'none' }} title="Bookmark">
                                                <Bookmark size={16} />
                                            </button>

                                            {/* Share Action */}
                                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#71767b', padding: '6px 8px', borderRadius: '9999px', outline: 'none' }} title="Share">
                                                <Share size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Threaded Vendor Response (If exists) */}
                                {rev.reply && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingLeft: '40px' }}>
                                        {/* Vendor Avatar */}
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--color-primary, #10b981)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 800,
                                            color: '#ffffff',
                                            fontSize: '0.8rem',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            V
                                        </div>

                                        {/* Reply Content */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 800, color: '#f7f9f9', fontSize: '0.9rem' }}>You (Shop Owner)</span>
                                                <span title="Official Partner" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
                                                    <CheckCircle size={12} fill="#e5c158" color="#000000" />
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: '#71767b' }}>@your_shop</span>
                                                <span style={{ color: '#71767b', fontSize: '0.8rem' }}>•</span>
                                                <span style={{ fontSize: '0.8rem', color: '#71767b' }}>Responding to @{rev.userName ? rev.userName.toLowerCase().replace(/\s+/g, '') : 'buyer'}</span>
                                            </div>
                                            
                                            <p style={{
                                                margin: '4px 0 0 0',
                                                fontSize: '0.9rem',
                                                color: '#cfd9db',
                                                lineHeight: 1.4,
                                                wordBreak: 'break-word'
                                            }}>
                                                {rev.reply}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Inline X-Style Compose Reply Editor (When active) */}
                                {isComposing && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingLeft: '40px' }}>
                                        {/* Vendor Avatar */}
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--color-primary, #10b981)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 800,
                                            color: '#ffffff',
                                            fontSize: '0.8rem',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            V
                                        </div>

                                        {/* Composer Box */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#71767b' }}>
                                                <span>Replying to</span>
                                                <span style={{ color: 'var(--color-primary, #10b981)', fontWeight: 600 }}>@{rev.userName ? rev.userName.toLowerCase().replace(/\s+/g, '') : 'buyer'}</span>
                                            </div>

                                            <div style={{
                                                background: '#000000',
                                                border: '1px solid #2f3336',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                padding: '8px 12px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <textarea 
                                                    placeholder="Post your response..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#e7e9ea',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        resize: 'none',
                                                        fontFamily: 'inherit',
                                                        lineHeight: 1.4
                                                    }}
                                                    value={replyText[rev._id] || ''}
                                                    onChange={e => setReplyText(prev => ({ ...prev, [rev._id]: e.target.value }))}
                                                />

                                                {/* Bottom Toolbar & Action button */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginTop: '10px',
                                                    borderTop: '1px solid #2f3336',
                                                    paddingTop: '8px'
                                                }}>
                                                    {/* Mock icons toolbar */}
                                                    <div style={{ display: 'flex', gap: '12px', color: 'var(--color-primary, #10b981)' }}>
                                                        <Image size={16} style={{ cursor: 'not-allowed', opacity: 0.5 }} />
                                                        <Smile size={16} style={{ cursor: 'not-allowed', opacity: 0.5 }} />
                                                        <AlignLeft size={16} style={{ cursor: 'not-allowed', opacity: 0.5 }} />
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button
                                                        onClick={() => handleReplySubmit(rev._id)}
                                                        disabled={submittingId === rev._id || !replyText[rev._id]?.trim()}
                                                        style={{
                                                            background: 'var(--color-primary, #10b981)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '9999px',
                                                            padding: '6px 16px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            cursor: (submittingId === rev._id || !replyText[rev._id]?.trim()) ? 'not-allowed' : 'pointer',
                                                            opacity: (!replyText[rev._id]?.trim()) ? 0.5 : 1,
                                                            transition: 'opacity 0.2s'
                                                        }}
                                                    >
                                                        {submittingId === rev._id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                                        <span>Reply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Custom Interactive CSS overrides injection */}
            <style>{`
                .x-action-btn:hover {
                    background-color: rgba(29, 155, 240, 0.1) !important;
                    color: #1d9bf0 !important;
                }
                .x-action-btn + span {
                    transition: color 0.2s;
                }
                .x-action-btn:hover + span {
                    color: #1d9bf0 !important;
                }
                
                /* Hover styles for actions */
                button[title="Share"]:hover {
                    background-color: rgba(29, 155, 240, 0.1) !important;
                    color: #1d9bf0 !important;
                }
                button[title="Bookmark"]:hover {
                    background-color: rgba(29, 155, 240, 0.1) !important;
                    color: #1d9bf0 !important;
                }
                button:has(svg[class*="lucide-repeat"]):hover {
                    background-color: rgba(0, 186, 124, 0.1) !important;
                    color: #00ba7c !important;
                }
                button:has(svg[class*="lucide-heart"]):hover {
                    background-color: rgba(249, 24, 128, 0.1) !important;
                    color: #f91880 !important;
                }
            `}</style>
        </div>
    );
};
