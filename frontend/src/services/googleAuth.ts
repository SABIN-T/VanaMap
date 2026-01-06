export const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

// --- GOOGLE OAUTH AUTHENTICATION ---
export const googleAuth = async (googleData: {
    email: string;
    name: string;
    picture: string;
    role: 'user' | 'vendor';
    location?: {
        lat: number;
        lng: number;
        city: string;
        state: string;
        country: string;
    };
    phone?: string;
}) => {
    const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Google authentication failed');
    }

    return response.json();
};
