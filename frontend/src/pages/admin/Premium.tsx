import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
    CreditCard, Users, Gift, Lock, Unlock,
    CheckCircle, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Payment {
    _id: string;
    userName: string;
    amount: number;
    plan: string;
    status: string;
    date: string;
    orderId: string;
}

interface PremiumUser {
    _id: string;
    name: string;
    email: string;
    premiumType: string;
    premiumExpiry: string;
}

export const Premium = () => {
    const { user } = useAuth();
    const token = user?.token;
    const [payments, setPayments] = useState<Payment[]>([]);
    const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [restrictedPages, setRestrictedPages] = useState<string[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const loadData = async () => {
        try {
            const [payRes, settingsRes] = await Promise.all([
                fetch(`${API_URL}/admin/payments`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/admin/settings/restricted-pages`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const payData = await payRes.json();
            const setData = await settingsRes.json();

            setPayments(payData.payments);
            setPremiumUsers(payData.premiumUsers);
            setRestrictedPages(setData.pages || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    const handleRenew = async (userId: string) => {
        if (!confirm("Gift 1 Year Premium to this user?")) return;
        try {
            const res = await fetch(`${API_URL}/admin/premium/renew`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Premium Renewed/Gifted Successfully! 🎁");
                loadData();
            } else {
                toast.error("Failed to renew");
            }
        } catch (err) {
            toast.error("Error renewing subscription");
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    return (
        <AdminLayout title="Premium Management">
            <div className="p-6 max-w-7xl mx-auto space-y-8">

                {/* Stats Overview */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading Premium Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400">
                                <Users size={32} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm">Active Premium Users</h3>
                                <p className="text-3xl font-bold text-white">{premiumUsers.length}</p>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400">
                                <CreditCard size={32} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm">Total Revenue</h3>
                                <p className="text-3xl font-bold text-white">
                                    ₹{payments.reduce((acc, curr) => acc + (curr.amount || 0), 0)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-yellow-500/20 text-yellow-400">
                                <Gift size={32} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm">Gifted Plans</h3>
                                <p className="text-3xl font-bold text-white">
                                    {premiumUsers.filter(u => u.premiumType === 'gift').length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Premium Users Table */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users size={20} className="text-indigo-400" /> Subscribers
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Plan Type</th>
                                    <th className="p-4">Expires On</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {premiumUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-700/30">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.premiumType === 'gift' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {user.premiumType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">{formatDate(user.premiumExpiry)}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleRenew(user._id)}
                                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <Gift size={14} /> Gift Renew
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {premiumUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">No premium subscribers yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CreditCard size={20} className="text-emerald-400" /> Transaction History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {payments.map(pay => (
                                    <tr key={pay._id} className="hover:bg-slate-700/30">
                                        <td className="p-4">{formatDate(pay.date)}</td>
                                        <td className="p-4 text-white font-medium">{pay.userName}</td>
                                        <td className="p-4 text-xs font-mono text-slate-500">{pay.orderId || 'N/A'}</td>
                                        <td className="p-4 font-bold text-white">₹{pay.amount}</td>
                                        <td className="p-4">
                                            {pay.status === 'paid' ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                    <CheckCircle size={14} /> PAID
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                                                    <XCircle size={14} /> FAILED
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Page Access Control */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-orange-400" /> Premium Content Control
                    </h2>
                    <p className="text-slate-400 mb-6">Toggle which pages require Premium access.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Heaven', path: '/heaven' },
                            { name: 'Shops Global', path: '/shops' },
                            { name: 'AI Diagnostics', path: '/make-it-real' }, // Assuming this corresponds to AI
                            { name: 'Leaderboard', path: '/leaderboard' },
                            { name: 'Nearby GPS', path: '/nearby' }
                        ].map(page => {
                            const isLocked = restrictedPages.includes(page.path);
                            return (
                                <div
                                    key={page.path}
                                    onClick={async () => {
                                        const newList = isLocked
                                            ? restrictedPages.filter(p => p !== page.path)
                                            : [...restrictedPages, page.path];

                                        // Update Local
                                        setRestrictedPages(newList);

                                        // Save to DB
                                        try {
                                            await fetch(`${API_URL}/admin/settings/restricted-pages`, {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ pages: newList })
                                            });
                                            toast.success(`${page.name} is now ${isLocked ? 'Free' : 'Premium Only'}`);
                                        } catch (e) {
                                            toast.error("Failed to save setting");
                                        }
                                    }}
                                    className={`p-4 rounded-xl flex justify-between items-center border cursor-pointer transition-all duration-200 ${isLocked
                                        ? 'bg-slate-900 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                                        : 'bg-slate-800 border-slate-600 hover:border-emerald-500'
                                        }`}
                                >
                                    <span className={isLocked ? "text-orange-400 font-bold" : "text-slate-300"}>{page.name}</span>
                                    {isLocked ? <Lock size={18} className="text-orange-500" /> : <Unlock size={18} className="text-emerald-500" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};
