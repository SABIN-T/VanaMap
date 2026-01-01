import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Shield, Zap, Heart, Bot, Headset } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Premium.module.css';

export const Premium = () => {
    const { user, refreshUser } = useAuth();
    const token = user?.token;
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({ price: 10, activePromo: false, freeEnd: '' });
    const navigate = useNavigate();

    // Access Control
    const canView = user && (user.favorites?.length > 3 || user.isPremium || user.role === 'admin');
    const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

    useEffect(() => {
        // 1. Fetch Config (Price/Promo)
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_URL}/public/premium-config`);
                const data = await res.json();
                setConfig(data);
            } catch (e) {
                console.error("Config fetch failed", e);
            }
        };
        fetchConfig();

        // 2. Route Protection
        if (user && !canView && user.role !== 'admin') {
            toast("Add more than 3 plants to favorites to unlock Premium!", { icon: '🔒' });
            navigate('/');
        } else if (user?.isPremium) {
            navigate('/heaven');
        }
    }, [user, canView, navigate]);

    // Helpers
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaidSubscription = async () => {
        setLoading(true);
        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load");
            setLoading(false);
            return;
        }

        try {
            const result = await fetch(`${API_URL}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!result.ok) {
                const errorData = await result.json().catch(() => ({}));
                if (result.status === 503) {
                    toast.error("Payment Gateway disabled. Try again later.");
                } else {
                    console.error("Order Error:", errorData);
                    toast.error(`Order Failed: ${errorData.error || result.statusText || "Server Error"}`);
                }
                setLoading(false);
                return;
            }

            const order = await result.json();

            const options = {
                key: order.key, // Dynamic backend key
                amount: order.amount,
                currency: order.currency,
                name: "VanaMap Premium",
                description: "Monthly Subscription",
                image: "/logo.png",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
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
                    if (verifyData.success || verifyRes.ok) {
                        toast.success("Payment Successful! Welcome to Premium.");
                        await refreshUser();
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

    const handleFreeClaim = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/payments/claim-free`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok && data.success) {
                toast.success("Welcome to Premium Heaven! 🌟");
                await refreshUser();
                navigate('/heaven');
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

    const handlePayment = async () => {
        if (!user) {
            navigate('/auth', { state: { from: '/premium' } });
            return;
        }

        if (config.activePromo) {
            await handleFreeClaim();
        } else {
            await handlePaidSubscription();
        }
    };

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
                                Unlimited Global Plant Search
                            </li>
                            <li className={styles.featureItem}>
                                <Check size={18} className={styles.checkIcon} />
                                Access Public Garden Community
                            </li>
                            <li className={styles.featureItem}>
                                <Check size={18} className={styles.checkIcon} />
                                Create up to 3 Plant Collections
                            </li>
                        </ul>
                        <button className={`${styles.button} ${styles.btnFree}`} disabled>
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className={`${styles.card} ${styles.cardPremium}`}>
                        {config.activePromo && <div className={styles.badge}>Limited Offer</div>}

                        <div className={styles.planName}>
                            Premium <Crown size={24} fill="currentColor" className="text-yellow-400" />
                        </div>

                        <div className="flex items-baseline mb-1">
                            <span className={styles.price}>{config.activePromo ? '₹0' : `₹${config.price}`}</span>
                            <span className={styles.priceStrike}>{config.activePromo ? `₹${config.price}` : ''}</span>
                            <span className={styles.priceDuration}>/mo</span>
                        </div>
                        <div className={styles.promoText}>
                            {config.activePromo
                                ? `Free until ${config.freeEnd ? new Date(config.freeEnd).toLocaleDateString() : 'Limited Time'}!`
                                : 'Best Value for Serious Gardeners'
                            }
                        </div>

                        <ul className={styles.features}>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Heart size={18} className={styles.checkIcon} />
                                <span><strong>Unlimited</strong> Personal Garden Collections</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Crown size={18} className={styles.checkIcon} />
                                <span>Exclusive <strong>Heaven</strong> Metaverse Access</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Bot size={18} className={styles.checkIcon} />
                                <span>Dr. Flora: <strong>Groq AI</strong> (Llama 3.3 70B)</span>
                            </li>
                            <li className={`${styles.featureItem} ${styles.premium}`}>
                                <Headset size={18} className={styles.checkIcon} />
                                <span>24/7 Priority Concierge Support</span>
                            </li>
                        </ul>

                        <button
                            onClick={handlePayment}
                            disabled={loading || user?.isPremium}
                            className={`${styles.button} ${user?.isPremium ? styles.btnActive : styles.btnPremium}`}
                        >
                            {loading ? 'Processing...' : (user?.isPremium ? 'Premium Active' : (config.activePromo ? 'Claim Free Access Now' : 'Upgrade to Premium'))}
                        </button>
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
                {/* Compliance Footer for Razorpay */}
                <div className="mt-8 text-center text-xs text-slate-500 pb-8">
                    <p>Secured by Razorpay. By subscribing, you agree to our <a href="#" className="underline hover:text-emerald-400">Terms of Service</a> and <a href="#" className="underline hover:text-emerald-400">Privacy Policy</a>.</p>
                </div>
            </div>
        </div>
    );
};
