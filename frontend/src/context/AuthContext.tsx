import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { jwtDecode } from "jwt-decode";

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData {
    email: string;
    password: string;
    name: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    signup: (data: SignupData) => Promise<{ success: boolean; message?: string }>;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
    googleLogin: (credentialResponse: any) => Promise<boolean>;
    logout: () => void;
    toggleFavorite: (plantId: string) => void;
    updateUser: (updates: Partial<User>) => void;
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
                // In a perfect world, we'd verify the token is not expired here too
                setUser(parsed.user || parsed);
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

            // Data contains { user, token }
            const userData = { ...data.user, token: data.token };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
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

            const fullUser = { ...data.user, token: data.token };
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            return { success: true };
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const googleLogin = async (credentialResponse: any) => {
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

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const toggleFavorite = async (plantId: string) => {
        if (!user) return;
        const isFav = user.favorites?.includes(plantId);
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
            // Persist the token too!
            const saved = localStorage.getItem('user');
            if (saved) {
                const parsed = JSON.parse(saved);
                localStorage.setItem('user', JSON.stringify({ ...parsed, ...updates }));
            }
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, toggleFavorite, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
