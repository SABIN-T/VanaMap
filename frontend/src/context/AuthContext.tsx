import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: User | null;
    signup: (data: any) => Promise<{ success: boolean; message?: string }>;
    login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
    googleLogin: (credentialResponse: any) => Promise<boolean>;
    logout: () => void;
    toggleFavorite: (plantId: string) => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

    const login = async (credentials: any) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Login failed');

                // Fetch latest profile to ensure favorites are synced
                let fullProfile = data;
                try {
                    const profileRes = await fetch(`${API_URL}/user/profile?email=${data.email}`);
                    if (profileRes.ok) {
                        fullProfile = await profileRes.json();
                    }
                } catch (e) { console.warn("Could not fetch full profile", e); }

                setUser(fullProfile);
                localStorage.setItem('user', JSON.stringify(fullProfile));
                return { success: true };
            } else {
                const text = await res.text();
                throw new Error(`Server Error (${res.status}): ${text.slice(0, 100)}`);
            }
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const signup = async (userData: any) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Signup failed');

                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true };
            } else {
                const text = await res.text();
                throw new Error(`Server Error (${res.status}): ${text.slice(0, 100)}`);
            }
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const googleLogin = async (credentialResponse: any) => {
        try {
            if (!credentialResponse.credential) return false;

            const decoded: any = jwtDecode(credentialResponse.credential);

            // Check if user exists in DB, otherwise create
            let googleUser: User = {
                id: decoded.sub || 'google-user',
                name: decoded.name || 'Google User',
                email: decoded.email,
                role: 'user',
                favorites: [],
                cart: []
            };

            // Attempt backend sync
            try {
                const res = await fetch(`${API_URL}/auth/google-sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(googleUser)
                });
                if (res.ok) {
                    googleUser = await res.json();
                }
            } catch (e) { console.warn("Google sync failed", e); }

            setUser(googleUser);
            localStorage.setItem('user', JSON.stringify(googleUser));
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

        // Optimistic UI update
        const isFav = user.favorites.includes(plantId);
        const newFavorites = isFav
            ? user.favorites.filter(id => id !== plantId)
            : [...user.favorites, plantId];

        const updatedUser = { ...user, favorites: newFavorites };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep local sync

        try {
            // Push to MongoDB
            const { toggleFavorite } = await import('../services/api');
            await toggleFavorite(user.email, plantId);
        } catch (e) {
            console.error("Failed to sync favorites to Cloud", e);
            // Verify state on next reload
        }
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, toggleFavorite, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
