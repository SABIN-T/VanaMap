/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { jwtDecode } from "jwt-decode";

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData {
    email: string;
    phone?: string;
    password: string;
    name: string;
    role?: string;
    city?: string;
    state?: string;
    country?: string;
}

interface AuthContextType {
    user: User | null;
    signup: (data: SignupData) => Promise<{ success: boolean; message?: string; registrationToken?: string; captchaSvg?: string }>;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
    googleLogin: (credentialResponse: { credential?: string }) => Promise<boolean>;
    logout: () => void;
    verify: (registrationToken: string, otp: string) => Promise<{ success: boolean; message?: string }>;
    toggleFavorite: (plantId: string) => void;
    updateUser: (updates: Partial<User>) => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Normalizing legacy vs current structures
                let userData: (User & { token?: string }) | null = null;

                if (parsed.user && typeof parsed.user === 'object') {
                    // Legacy structure: { user: {...}, token: "..." }
                    userData = { ...parsed.user, token: parsed.token || parsed.user.token };
                } else {
                    // Current flat structure: { ..., token: "..." }
                    userData = parsed;
                }

                // Strictly validate role and name to prevent poisoned state
                if (userData && userData.role && userData.name) {
                    // Ensure crucial arrays exist
                    userData.favorites = Array.isArray(userData.favorites) ? userData.favorites : [];
                    userData.cart = Array.isArray(userData.cart) ? userData.cart : [];
                    setUser(userData);
                } else {
                    console.warn("Invalid user session detected, purging local storage.");
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.error("Local storage corruption", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            // data.user is already normalized by backend
            const userData = { ...data.user, token: data.token };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (err: unknown) {
            const error = err as Error;
            console.error(error);
            return { success: false, message: error.message };
        }
    };

    const signup = async (userData: SignupData) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');

            // Returning the session token and captcha
            return {
                success: true,
                message: data.message,
                registrationToken: data.registrationToken,
                captchaSvg: data.captchaSvg
            };
        } catch (err: unknown) {
            const error = err as Error;
            console.error(error);
            return { success: false, message: error.message };
        }
    };

    const verify = async (registrationToken: string, otp: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationToken, otp })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');

            const fullUser = { ...data.user, token: data.token };
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            return { success: true };
        } catch (err: unknown) {
            const error = err as Error;
            console.error(error);
            return { success: false, message: error.message };
        }
    };

    const googleLogin = async (credentialResponse: { credential?: string }) => {
        try {
            if (!credentialResponse.credential) return false;
            const decoded = jwtDecode(credentialResponse.credential) as { name: string; email: string };

            const res = await fetch(`${API_URL}/auth/google-sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: decoded.email, name: decoded.name })
            });

            if (!res.ok) throw new Error("Google sync failed");
            const data = await res.json();
            const fullUser = { ...data.user, token: data.token };

            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            return true;
        } catch (error) {
            console.error("Google Login Error:", error);
            return false;
        }
    };

    const refreshUser = async () => {
        if (!user || user.token) return; // Need token
        try {
            // We assume we have the token in user object or localStorage
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            const token = stored.token;
            if (!token) return;

            // We need an endpoint to get fresh user data. 
            // If /api/auth/me doesn't exist, we use a different trick or add it.
            // For now, let's assume we can fetch data.
            // Actually, let's just use the current user state if we update it manually via updateUser,
            // but for Premium upgrade we really want server confirmation.
            // let's add /api/user/me to backend index.js to be sure.
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const freshUser = { ...data, token };
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            }
        } catch (e) {
            console.error("Refresh failed", e);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const toggleFavorite = async (plantId: string) => {
        if (!user) return;
        const isFav = user.favorites?.includes(plantId);

        // "if thery add more than three like... if they click fourth time it should show the premium button"
        if (!isFav && (user.favorites?.length || 0) === 3) {
            import('react-hot-toast').then(({ default: toast }) => {
                toast("⭐ You've unlocked the Premium option! Check the menu.", { icon: '👑', duration: 4000 });
            });
            // We allow the adding, but now the Premium button will appear (reactive)
        }

        const newFavorites = isFav
            ? user.favorites.filter(id => id !== plantId)
            : [...(user.favorites || []), plantId];

        updateUser({ favorites: newFavorites });

        try {
            const { toggleFavorite } = await import('../services/api');
            await toggleFavorite(plantId);
        } catch (e) {
            console.error("Failed to sync favorites", e);
        }
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            // Flatten if legacy structure exists in localStorage to prevent corruption
            const saved = localStorage.getItem('user');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const base = parsed.user ? { ...parsed.user, token: parsed.token } : parsed;
                    const final = { ...base, ...updates };
                    localStorage.setItem('user', JSON.stringify(final));
                } catch {
                    localStorage.setItem('user', JSON.stringify(updated));
                }
            } else {
                localStorage.setItem('user', JSON.stringify(updated));
            }
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, verify, toggleFavorite, updateUser, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
