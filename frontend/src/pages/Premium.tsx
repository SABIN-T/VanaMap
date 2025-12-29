import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Star, Shield, Zap, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

// Load Razorpay Script
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

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
        setLoading(true);
        const res = await loadRazorpay();

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        // Logic for "Free until Jan 2026"
        // Let's treat it as a "Free Activation" for now based on the prompt "premium is now free purchase".
        // If we want to simulate the real payment flow for "after that 10rs", we can do a 1 rupee auth or just free activation.
        // Prompt: "purchase by for 2026 jan 1 -31 after that you should pay 10rs per month"
        // I will implement the FREE activation now since we are in 2025 (according to metadata? wait metadata says 2025-12-29).
        // Wow, logic: Current date: Dec 29, 2025.
        // Prompt says "free purchase by for 2026 jan 1 -31". 
        // We are close to Jan 1 2026. 
        // I'll implement a button "Claim Free Premium (Valid till Jan 2026)" and a "Subscribe (₹10/mo)"

        try {
            // For now, let's just do the Free Activation call since it's the promo period.
            const response = await fetch('http://localhost:5000/api/payments/activate-free', {
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
        <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                        <Crown size={48} className="text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-sm">
                        Go Premium
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Exciting prices are coming soon for choosing proper plant according to your place.
                        Your chlorophyll points changes and best point holders will get exciting prizes so stay tuned!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Star className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-200">Current Plan</h3>
                        <div className="text-4xl font-bold mb-6 text-slate-400">
                            Free
                        </div>
                        <ul className="space-y-4 mb-8 text-slate-300">
                            <li className="flex items-center gap-3">
                                <Check size={20} className="text-emerald-500" />
                                Basic Plant Search
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={20} className="text-emerald-500" />
                                Community Access
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={20} className="text-emerald-500" />
                                Limited Favorites (3 Max)
                            </li>
                        </ul>
                        <button disabled className="w-full py-3 rounded-xl bg-slate-700 text-slate-400 font-medium cursor-not-allowed">
                            Active
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-1 p-[1px] relative overflow-hidden group hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 animate-spin-slow opacity-75"></div>
                        <div className="relative bg-slate-900 rounded-[23px] p-8 h-full">
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl shadow-lg">
                                LIMITED OFFER
                            </div>

                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
                                Premium <Crown size={20} className="text-yellow-400" />
                            </h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">₹0</span>
                                <span className="text-slate-400 text-sm ml-2 line-through">₹10/mo</span>
                                <p className="text-yellow-400 text-xs mt-1 font-semibold">
                                    Free until Jan 31, 2026!
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Check size={16} /></div>
                                    <span className="font-medium">Access to Heaven</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Check size={16} /></div>
                                    Unlimited Favorites
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Check size={16} /></div>
                                    Chlorophyll Points Multiplier
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Shield size={16} /></div>
                                    Premium Priority Support
                                </li>
                            </ul>

                            <button
                                onClick={handlePayment}
                                disabled={loading || user?.isPremium}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg 
                                    ${user?.isPremium
                                        ? 'bg-emerald-600 text-white cursor-default'
                                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 hover:shadow-yellow-500/25 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {loading ? 'Processing...' : (user?.isPremium ? 'Premium Active' : 'Claim Free Access Now')}
                            </button>
                            {!user?.isPremium && (
                                <p className="text-center text-slate-500 text-xs mt-4">
                                    Recurring billing of ₹10/mo starts Feb 1, 2026.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/5 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Why users choose Premium?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div>
                            <Heart className="mx-auto text-pink-500 mb-4" size={32} />
                            <h4 className="font-bold text-slate-200">Unlimited Love</h4>
                            <p className="text-slate-400 text-sm mt-2">Add as many plants as you want to your favorites.</p>
                        </div>
                        <div>
                            <Zap className="mx-auto text-yellow-400 mb-4" size={32} />
                            <h4 className="font-bold text-slate-200">Early Access</h4>
                            <p className="text-slate-400 text-sm mt-2">Be the first to see new exciting prizes and exotic plants.</p>
                        </div>
                        <div>
                            <Shield className="mx-auto text-emerald-400 mb-4" size={32} />
                            <h4 className="font-bold text-slate-200">Premium Badge</h4>
                            <p className="text-slate-400 text-sm mt-2">Stand out in the ranking with a special profile badge.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
