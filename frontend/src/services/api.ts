import type { Plant, Vendor } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

const getHeaders = () => {
    const saved = localStorage.getItem('user');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (saved) {
        try {
            const { token } = JSON.parse(saved);
            if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (e) {
            console.error("Token parse error", e);
        }
    }
    return headers;
};

export const fetchPlants = async (): Promise<Plant[]> => {
    try {
        const response = await fetch(`${API_URL}/plants`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch plants: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Failed to fetch plants: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
};

export const fetchUsers = async (): Promise<any[]> => {
    try {
        const response = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const fetchVendors = async (): Promise<Vendor[]> => {
    try {
        const response = await fetch(`${API_URL}/vendors`);
        if (!response.ok) throw new Error('Failed to fetch vendors');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return [];
    }
};

export const registerVendor = async (vendorData: Partial<Vendor>): Promise<Vendor | null> => {
    try {
        const response = await fetch(`${API_URL}/vendors`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(vendorData)
        });
        if (!response.ok) throw new Error('Failed to register vendor');
        return await response.json();
    } catch (error) {
        console.error("Error registering vendor:", error);
        return null;
    }
};

export const updateVendor = async (id: string, updates: Partial<Vendor>): Promise<Vendor | null> => {
    try {
        const response = await fetch(`${API_URL}/vendors/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update vendor');
        return await response.json();
    } catch (error) {
        console.error("Error updating vendor:", error);
        return null;
    }
}

export const deleteVendor = async (id: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/vendors/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return false;
    }
};

export const seedDatabase = async (plants: Plant[], vendors: Vendor[], users: unknown[] = []) => {
    await fetch(`${API_URL}/seed`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ plants, vendors, users })
    });
};

export const toggleFavorite = async (plantId: string) => {
    const res = await fetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ plantId })
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");
    return res.json();
};

export const syncCart = async (cart: { plantId: string; quantity: number }[]) => {
    const res = await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cart })
    });
    if (!res.ok) throw new Error("Failed to sync cart");
    return res.json();
};

export const requestPasswordReset = async (email: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error("Failed to request reset");
    return res.json();
};

export const resetPasswordVerify = async (email: string, name: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, newPassword })
    });
    if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Verification failed");
    }
    return res.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    });
    if (!res.ok) throw new Error("Reset failed. Check if approved.");
    return res.json();
};

export const fetchResetRequests = async () => {
    try {
        const res = await fetch(`${API_URL}/admin/requests`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch requests");
        return await res.json();
    } catch (error) {
        console.error("Error fetching reset requests:", error);
        return [];
    }
};

export const approveResetRequest = async (userId: string) => {
    const res = await fetch(`${API_URL}/admin/approve-reset`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error("Failed to approve");
    return res.json();
};

export const addPlant = async (plantData: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(plantData)
    });
    if (!res.ok) throw new Error("Failed to add plant");
    return res.json();
};

export const updatePlant = async (id: string, updates: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update plant");
    return res.json();
};

export const deletePlant = async (id: string) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete plant");
    return res.json();
};

export const fetchNotifications = async () => {
    try {
        const res = await fetch(`${API_URL}/admin/notifications`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return await res.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const deleteNotification = async (id: string) => {
    const res = await fetch(`${API_URL}/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to clear notification");
    return res.json();
};

// Notification Aliases & Methods
export const fetchAdminNotifications = fetchNotifications;

export const markNotificationRead = async (id: string) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to mark read");
    return res.json();
};

export const markAllNotificationsRead = async () => {
    const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to mark all read");
    return res.json();
};

export const fetchAdminStats = async () => {
    const res = await fetch(`${API_URL}/admin/stats`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
};

export const fetchVendorNotifications = async () => {
    try {
        const res = await fetch(`${API_URL}/vendor/notifications`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch vendor notifications");
        return await res.json();
    } catch (error) {
        console.error("Error fetching vendor notifications:", error);
        return [];
    }
};

export const logVendorContact = async (data: { vendorId: string, vendorName: string, userEmail: string, contactType: 'whatsapp' | 'call' }) => {
    try {
        await fetch(`${API_URL}/tracking/vendor-contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.error("Failed to log contact", err);
    }
};

export const nudgeAdmin = async (email: string) => {
    return await fetch(`${API_URL}/auth/nudge-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(res => res.json());
};

export const deleteUser = async (id: string) => {
    return await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(res => res.json());
};

export const adminResetPassword = async (userId: string, newPassword?: string) => {
    return await fetch(`${API_URL}/admin/reset-user-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, newPassword })
    }).then(res => res.json());
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
    return await fetch(`${API_URL}/user/change-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ oldPassword, newPassword })
    }).then(res => res.json());
};

export const sendAiChat = async (userId: string, message: string) => {
    const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
    });
    return res.json();
};

export const submitSuggestion = async (data: { userId?: string, userName?: string, plantName: string, description: string }) => {
    const res = await fetch(`${API_URL}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to submit suggestion");
    return res.json();
};

export const fetchSuggestions = async () => {
    const res = await fetch(`${API_URL}/suggestions`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return res.json();
};

export const updateSuggestion = async (id: string, updates: any) => {
    const res = await fetch(`${API_URL}/suggestions/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update suggestion");
    return res.json();
};

export const deleteSuggestion = async (id: string) => {
    const res = await fetch(`${API_URL}/suggestions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete suggestion");
    return res.json();
};

export const fetchLeaderboard = async () => {
    const res = await fetch(`${API_URL}/gamification/leaderboard`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return res.json();
};

export const logSearch = async (query: string, plantId?: string, location?: any) => {
    try {
        await fetch(`${API_URL}/tracking/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, plantId, location })
        });
    } catch (e) {
        console.error("Search logging failed", e);
    }
};

export const fetchVendorAnalytics = async (vendorId: string) => {
    const res = await fetch(`${API_URL}/analytics/vendor/${vendorId}`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
};

export const completePurchase = async (items: any[]) => {
    const res = await fetch(`${API_URL}/user/complete-purchase`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error("Failed to complete purchase");
    return res.json();
};

export const updateUserPoints = async (userId: string, points: number) => {
    const res = await fetch(`${API_URL}/admin/users/${userId}/points`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ points })
    });
    if (!res.ok) throw new Error("Failed to update user points");
    return res.json();
};
export const fetchSeedData = async () => {
    const res = await fetch(`${API_URL}/admin/seed-data`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch seed data");
    return res.json();
};

export const seedSinglePlant = async (plantId: string) => {
    const res = await fetch(`${API_URL}/admin/seed-single`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ plantId })
    });
    if (!res.ok) throw new Error("Failed to deploy plant");
    return res.json();
};
