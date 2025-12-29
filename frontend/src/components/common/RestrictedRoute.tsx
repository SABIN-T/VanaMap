import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
    children: ReactNode;
    path: string;
}

export const RestrictedRoute = ({ children, path }: Props) => {
    const { user, loading: authLoading } = useAuth();
    const [isRestricted, setIsRestricted] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);
    const location = useLocation();

    // Cache to prevent re-fetching contentiously
    // In a real app, this should be in a Context
    useEffect(() => {
        const checkRestriction = async () => {
            try {
                // Optimization: If user is admin or premium, we technically don't care if it's restricted or not, 
                // they can access it. (Unless we want to show a 'Premium' badge).
                // But the requirement says "admin can access everything without any premium options... and for people who taken premimum they should have premuim page always"
                // So if premium/admin, we pass.
                if (user?.role === 'admin' || user?.isPremium) {
                    setIsRestricted(false);
                    setChecking(false);
                    return;
                }

                // API to check if this specific path is restricted
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/system/is-restricted?path=${encodeURIComponent(path)}`);
                const data = await res.json();
                setIsRestricted(data.isRestricted);
            } catch (error) {
                console.error("Failed to check restriction", error);
                setIsRestricted(false); // Default open on error
            } finally {
                setChecking(false);
            }
        };

        if (!authLoading) {
            checkRestriction();
        }
    }, [path, user, authLoading]);

    if (authLoading || checking) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (isRestricted && !user?.isPremium && user?.role !== 'admin') {
        return <Navigate to="/premium" replace state={{ from: location }} />;
    }

    return children;
};
