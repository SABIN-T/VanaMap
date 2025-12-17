import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: User | null;
    signup: (data: any) => Promise<boolean>;
    login: (credentials: any) => Promise<boolean>;
    googleLogin: (credentialResponse: any) => Promise<boolean>;
    logout: () => void;
    toggleFavorite: (plantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/auth';

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
            if (!res.ok) throw new Error('Login failed');
            const data = await res.json();
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const signup = async (userData: any) => {
        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!res.ok) throw new Error('Signup failed');
            const data = await res.json();
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return true;
        } catch (err) {
            console.error(err);
            return false;
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

    const toggleFavorite = (plantId: string) => {
        if (!user) return;

        const isFav = user.favorites.includes(plantId);
        const newFavorites = isFav
            ? user.favorites.filter(id => id !== plantId)
            : [...user.favorites, plantId];

        const updatedUser = { ...user, favorites: newFavorites };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // TODO: Sync with backend
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
