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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api/auth';

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
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true };
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const signup = async (userData: any) => {
        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true };
        } catch (err: any) {
            console.error(err);
            return { success: false, message: err.message };
        }
    };

    const googleLogin = async (credentialResponse: any) => {
        try {
            if (!credentialResponse.credential) return false;

            const decoded: any = jwtDecode(credentialResponse.credential);

            // Map Google user to our User type
            const googleUser: User = {
                id: decoded.sub || 'google-user',
                name: decoded.name || 'Google User',
                email: decoded.email,
                role: 'user', // Default to user
                favorites: [],
                cart: []
            };

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
        localStorage.setItem('user', JSON.stringify(updatedUser));

        try {
            await import('../services/api').then(api => api.toggleFavorite(user.email, plantId));
        } catch (e) {
            console.error("Failed to sync favorites", e);
            // Revert on failure? (Optional, skipping for UX smoothness)
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
