import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Lock } from 'lucide-react';
import { useEffect } from 'react';

export const Heaven = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Double check protection (though Route guard should handle it usually)
        if (user && !user.isPremium && user.role !== 'admin') {
            navigate('/premium');
        }
    }, [user, navigate]);

    if (!user || (!user.isPremium && user.role !== 'admin')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <Lock size={48} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold">Access Restricted</h2>
                    <p className="text-slate-400">Heaven is only for Premium Angels.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center bg-fixed relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
                <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 animate-bounce">
                    <Crown size={64} className="text-yellow-400" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    HEAVEN
                </h1>

                <p className="text-2xl md:text-3xl font-light text-slate-100 max-w-3xl mx-auto mb-12">
                    Welcome to the sanctuary.
                    <br />
                    <span className="text-yellow-300 font-medium">You contain all this and you can do all these.</span>
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mt-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                            <div className="h-48 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 mb-6 group-hover:scale-[1.02] transition-transform flex items-center justify-center">
                                <span className="text-4xl">🌿</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">Exclusive Content {i}</h3>
                            <p className="text-slate-300">Premium members get access to rare plant data and advanced AI diagnostics first.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
