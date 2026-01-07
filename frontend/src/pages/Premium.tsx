import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Shield, Zap, Heart, Bot, Headset, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Premium.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

export const Premium = () => {
    const { user, refreshUser } = useAuth();
    const token = user?.token;
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({ price: 10, activePromo: false, freeEnd: '' });
    const [configLoading, setConfigLoading] = useState(true);
    const navigate = useNavigate();

    // Derived State
    const isFreeMode = config.activePromo || config.price === 0 || String(config.price) === '0';

    // Access Control
    const canView = user && (user.favorites?.length > 3 || user.isPremium || user.role === 'admin');

    useEffect(() => {
        // 1. Fetch Config (Price/Promo)
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_URL}/public/premium-config`);
                const data = await res.json();
                setConfig(data);
            } catch (e) {
                console.error("Config fetch failed", e);
            } finally {
                setConfigLoading(false);
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

        if (isFreeMode) {
            await handleFreeClaim();
        } else {
            await handlePaidSubscription();
        }
    };

    const getButtonText = () => {
        if (configLoading) return 'Checking Offers...';
        if (loading) return 'Processing...';
        if (user?.isPremium) return 'Premium Active';

        if (isFreeMode) {
            if (!user) return 'Login to Claim Free Access';
            return 'Claim Free Access Now';
        } else {
            if (!user) return 'Login to Upgrade';
            return 'Upgrade to Premium';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.backgroundEffects}>
                <div className={`${styles.orb} ${styles.orb1}`}></div>
                <div className={`${styles.orb} ${styles.orb2}`}></div>
            </div>

            <div className={styles.content}>
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
                        {(isFreeMode || configLoading) && <div className={styles.badge}>Limited Offer</div>}

                        <div className={styles.planName}>
                            Premium <Crown size={24} fill="currentColor" className="text-yellow-400" />
                        </div>

                        <div className="flex items-baseline mb-1">
                            {configLoading ? (
                                <span className={styles.price} style={{ fontSize: '1.5rem', opacity: 0.7 }}>Checking...</span>
                            ) : (
                                <>
                                    <span className={styles.price}>{isFreeMode ? '₹0' : `₹${config.price}`}</span>
                                    <span className={styles.priceStrike}>{isFreeMode ? `₹${config.price}` : ''}</span>
                                    <span className={styles.priceDuration}>/mo</span>
                                </>
                            )}
                        </div>
                        <div className={styles.promoText}>
                            {configLoading
                                ? 'Checking for exclusive offers...'
                                : (isFreeMode
                                    ? (config.activePromo
                                        ? `Free until ${config.freeEnd ? new Date(config.freeEnd).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Limited Time'}!`
                                        : 'Free Access for Everyone!')
                                    : 'Best Value for Serious Gardeners'
                                )
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
                            disabled={loading || user?.isPremium || configLoading}
                            className={`${styles.button} ${user?.isPremium ? styles.btnActive : styles.btnPremium}`}
                        >
                            {getButtonText()}
                        </button>
                    </div>
                </div>

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

                {/* Legal & Payment Information */}
                <section className={styles.legalSection}>
                    <h3 className={styles.legalTitle}>Payment & Legal Information</h3>

                    <div className={styles.legalGrid}>
                        {/* Payment Security */}
                        <div className={styles.legalCard}>
                            <Shield className="text-emerald-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>🔒 Secure Payments</h4>
                            <ul className={styles.legalList}>
                                <li>All payments are processed through <strong>Razorpay</strong>, India's most trusted payment gateway</li>
                                <li>256-bit SSL encryption for all transactions</li>
                                <li>PCI DSS Level 1 compliant</li>
                                <li>Your card details are never stored on our servers</li>
                                <li>Supports UPI, Cards, Net Banking, and Wallets</li>
                            </ul>
                        </div>

                        {/* Privacy Policy */}
                        <div className={styles.legalCard}>
                            <Shield className="text-blue-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>🛡️ Privacy Policy</h4>
                            <ul className={styles.legalList}>
                                <li><strong>Data Collection:</strong> We collect only essential information (name, email, phone) for account creation and payment processing</li>
                                <li><strong>Data Usage:</strong> Your data is used solely for providing VanaMap services and will never be sold to third parties</li>
                                <li><strong>Data Storage:</strong> All data is encrypted and stored securely on MongoDB Atlas with automatic backups</li>
                                <li><strong>Your Rights:</strong> You can request data deletion at any time by contacting support@vanamap.online</li>
                                <li><strong>Cookies:</strong> We use essential cookies for authentication and user preferences only</li>
                            </ul>
                        </div>

                        {/* Terms of Service */}
                        <div className={styles.legalCard}>
                            <Check className="text-yellow-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>📜 Terms of Service</h4>
                            <ul className={styles.legalList}>
                                <li><strong>Subscription:</strong> Premium is a monthly subscription that auto-renews unless cancelled</li>
                                <li><strong>Cancellation:</strong> You can cancel anytime from your account settings. Access continues until the end of the billing period</li>
                                <li><strong>Fair Use:</strong> Premium features are for personal use only. Commercial use requires a business license</li>
                                <li><strong>Account Sharing:</strong> One account per person. Sharing credentials may result in account suspension</li>
                                <li><strong>Content Rights:</strong> You retain all rights to your uploaded content. VanaMap has the right to use anonymized data for service improvement</li>
                            </ul>
                        </div>

                        {/* Refund Policy */}
                        <div className={styles.legalCard}>
                            <DollarSign className="text-green-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>💰 Refund Policy</h4>
                            <ul className={styles.legalList}>
                                <li><strong>7-Day Money-Back Guarantee:</strong> Full refund if you're not satisfied within 7 days of purchase</li>
                                <li><strong>Refund Process:</strong> Email support@vanamap.online with your transaction ID and reason</li>
                                <li><strong>Processing Time:</strong> Refunds are processed within 5-7 business days</li>
                                <li><strong>Refund Method:</strong> Refunds are credited to the original payment method</li>
                                <li><strong>Exceptions:</strong> Refunds are not available for promotional/free subscriptions</li>
                            </ul>
                        </div>

                        {/* Auto-Renewal */}
                        <div className={styles.legalCard}>
                            <Zap className="text-purple-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>🔄 Auto-Renewal</h4>
                            <ul className={styles.legalList}>
                                <li><strong>Automatic Billing:</strong> Your subscription will auto-renew monthly on the same date</li>
                                <li><strong>Payment Method:</strong> The card/UPI used for initial payment will be charged automatically</li>
                                <li><strong>Price Changes:</strong> You'll be notified 7 days before any price changes</li>
                                <li><strong>Failed Payments:</strong> If payment fails, you'll have 3 days grace period before access is suspended</li>
                                <li><strong>Cancellation:</strong> Cancel anytime from Settings → Subscription → Cancel Subscription</li>
                            </ul>
                        </div>

                        {/* Contact & Support */}
                        <div className={styles.legalCard}>
                            <Headset className="text-cyan-400 mb-3" size={28} />
                            <h4 className={styles.legalCardTitle}>📞 Contact & Support</h4>
                            <ul className={styles.legalList}>
                                <li><strong>Email:</strong> support@vanamap.online</li>
                                <li><strong>WhatsApp:</strong> +91 91887 73534</li>
                                <li><strong>Response Time:</strong> Within 24 hours for all queries</li>
                                <li><strong>Premium Support:</strong> Priority support with &lt;2 hour response time</li>
                                <li><strong>Business Hours:</strong> Monday-Saturday, 9 AM - 6 PM IST</li>
                            </ul>
                        </div>
                    </div>

                    {/* Razorpay Disclaimer */}
                    <div className={styles.razorpayDisclaimer}>
                        <div className={styles.disclaimerHeader}>
                            <Shield size={24} className="text-blue-400" />
                            <h4>Payment Gateway Information</h4>
                        </div>
                        <div className={styles.disclaimerContent}>
                            <p><strong>Powered by Razorpay:</strong> All payments are processed through Razorpay Payment Gateway (Razorpay Software Private Limited, Bangalore, India).</p>
                            <p><strong>Security:</strong> Razorpay is PCI DSS Level 1 certified and complies with RBI guidelines for online payments in India.</p>
                            <p><strong>Data Protection:</strong> Your card/bank details are encrypted and transmitted directly to Razorpay. VanaMap never stores or has access to your complete card information.</p>
                            <p><strong>Dispute Resolution:</strong> For payment-related disputes, contact support@vanamap.online or raise a dispute through your bank/card issuer.</p>
                            <p><strong>Accepted Methods:</strong> Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking (All major banks), Wallets (Paytm, PhonePe, Amazon Pay).</p>
                        </div>
                    </div>

                    {/* GST Information */}
                    <div className={styles.gstInfo}>
                        <p><strong>GST:</strong> 18% GST is included in the displayed price. GST Invoice will be sent to your registered email after successful payment.</p>
                        <p><strong>Company Details:</strong> VanaMap | GSTIN: [To be registered] | PAN: [To be registered]</p>
                    </div>
                </section>

                <div className="mt-8 text-center text-xs text-slate-500 pb-8">
                    <p>🔒 Secured by Razorpay | By subscribing, you agree to our <a href="#terms" className="underline hover:text-emerald-400">Terms of Service</a> and <a href="#privacy" className="underline hover:text-emerald-400">Privacy Policy</a>.</p>
                    <p className="mt-2">© 2026 VanaMap. All rights reserved. | Made with 🌿 in India</p>
                </div>
            </div>
        </div>
    );
};
