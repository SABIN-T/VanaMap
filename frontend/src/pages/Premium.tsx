import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Shield, Zap, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Premium.module.css';

// Load Razorpay Script (Commented out until paid flow is restored)
// const loadRazorpay = () => {
//     return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//     });
// };

export const Premium = () => {
    const { user, refreshUser } = useAuth();
    const token = user?.token;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Prevent direct access if user shouldn't see this yet logic? 
    // Prompt says: "remove the premium page from the nav bar it should open only when the users or vendors if thery add more than three like... if they click fourth time it should show the premium button."
    // But if they navigate directly via URL, maybe we let them see it? Let's check favorites count.

    const canView = user && (user.favorites?.length > 3 || user.isPremium || user.role === 'admin');

    useEffect(() => {
        if (user && !canView && user.role !== 'admin') {
            toast("Add more than 3 plants to favorites to unlock Premium!", { icon: '🔒' });
            navigate('/');
        }
    }, [user, canView, navigate]);

    const handlePayment = async () => {
        if (!user) {
            navigate('/auth', { state: { from: '/premium' } });
            return;
        }

        setLoading(true);
        // ... rest of logic
        // For now, let's just do the Free Activation call since it's the promo period.
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';
            const response = await fetch(`${API_URL}/payments/activate-free`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Welcome to Premium Heaven! 🌟");
                await refreshUser(); // Update context
                navigate('/heaven'); // Redirect to Heaven
            } else {
                toast.error(data.error || "Activation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ...

    <button
        onClick={handlePayment}
        disabled={loading || user?.isPremium}
        className={`${styles.button} ${user?.isPremium ? styles.btnActive : styles.btnPremium}`}
    >
        {loading ? 'Processing...' : (user?.isPremium ? 'Premium Active' : (!user ? 'Login to Claim Free Access' : 'Claim Free Access Now'))}
    </button>

    // Alternative: Real Razorpay Flow (Hidden/Secondary if Free is active)
    // Alternative: Real Razorpay Flow (Hidden/Secondary if Free is active)
    /*
    const handlePaidSubscription = async () => {
        setLoading(true);
        const res = await loadRazorpay();
        if (!res) return;

        try {
            const result = await fetch('http://localhost:5000/api/payments/create-order', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const order = await result.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RxOhUE43Mr4CZp', // Fallback to prompt key if env missing (but safer to use env)
                amount: order.amount,
                currency: order.currency,
                name: "VanaMap Premium",
                description: "Monthly Subscription",
                image: "/logo.png",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            planType: 'monthly'
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success("Payment Successful! Welcome to Premium.");
                        refreshUser();
                        navigate('/heaven');
                    } else {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: {
                    color: "#10b981"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            toast.error("Payment initiation failed");
        } finally {
            setLoading(false);
        }
    };
    */

    return (
        <div className={styles.container}>
            {/* Background Effects */}
            <div className={styles.backgroundEffects}>
                <div className={`${styles.orb} ${styles.orb1}`}></div>
                <div className={`${styles.orb} ${styles.orb2}`}></div>
            </div>

            <div className={styles.content}>

                {/* Hero Section */}
                <header className={styles.hero}>
                    <div className={styles.crownBadge}>
                        <Crown size={40} className="text-slate-900" strokeWidth={2.5} />
                    </div>
                    <h1 className={styles.title}>
                        Unlock <span className={styles.titleHighlight}>VanaMap+</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Elevate your plant journey with exclusive AI tools, unlimited collections,
                        and premium community status.
                    </p>
                </header>

                {/* Plans Comparison */}
                <div className={styles.plansGrid}>

                    {/* Free Plan */}
                    <div className={`${styles.card} ${styles.cardFree}`}>
                        <div className={styles.planName}>Standard</div>
                        <div className={styles.price}>Free</div>
                        <div className={styles.promoText}>Forever free for basic use</div>

                        <ul className={styles.features}>
                            <li className={styles.featureItem}>
                                <Check size={18} className={styles.checkIcon} />
                                Basic Plant Search
                            </li>
                            <li className={styles.featureItem}>
                                <Check size={18} className={styles.checkIcon} />
                                Community Access
                            </li>
                            <li className={styles.featureItem}>
                                <Check size={18} className={styles.checkIcon} />
                                Max 3 Favorites
                            </li>
                        </ul>
                        <button className={`${styles.button} ${styles.btnFree}`} disabled>
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className={`${styles.card} ${styles.cardPremium}`}>
                        <div className={styles.badge}>Limited Offer</div>

                        <div className={styles.planName}>
                            Premium <Crown size={24} fill="currentColor" className="text-yellow-400" />
                        </div>

                        <div className="flex items-baseline mb-1">
                            <span className={styles.price}>₹0</span>
                            <span className={styles.priceStrike}>₹10</span>
                            <span className={styles.priceDuration}>/mo</span>
                        </div>
                        <div className={styles.promoText}>Free until Jan 31, 2026!</div>

                        <ul className={styles.features}>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Check size={18} className={styles.checkIcon} />
                                <span><strong>Unlimited</strong> Favorites</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Check size={18} className={styles.checkIcon} />
                                <span>Access to <strong>Heaven</strong> (Exclusive)</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Check size={18} className={styles.checkIcon} />
                                <span>AI Plant Diagnostics</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Check size={18} className={styles.checkIcon} />
                                <span>Priority Support</span>
                            </li>
                        </ul>


                    </div>
                </div>

                {/* Value Props */}
                <section className={styles.valueProps}>
                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Why Go Premium?
                    </h3>
                    <div className={styles.propsGrid}>
                        <div className={styles.propCard}>
                            <Heart className="text-pink-500 mb-4" size={32} />
                            <h4 className={styles.propTitle}>Unlimited Collections</h4>
                            <p className={styles.propDesc}>Build your dream garden without limits. Save every plant you love.</p>
                        </div>
                        <div className={styles.propCard}>
                            <Zap className="text-yellow-400 mb-4" size={32} />
                            <h4 className={styles.propTitle}>Early Access</h4>
                            <p className={styles.propDesc}>Be the first to try new features like AI-powered placement visualization.</p>
                        </div>
                        <div className={styles.propCard}>
                            <Shield className="text-emerald-400 mb-4" size={32} />
                            <h4 className={styles.propTitle}>Elite Status</h4>
                            <p className={styles.propDesc}>Stand out in the community leaderboard with a special Premium badge.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
