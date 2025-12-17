import type { Plant, Vendor } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

export const fetchPlants = async (): Promise<Plant[]> => {
    try {
        const response = await fetch(`${API_URL}/plants`);
        if (!response.ok) throw new Error('Failed to fetch plants');
        return await response.json();
    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
};

export const fetchVendors = async (): Promise<Vendor[]> => {
    try {
        const response = await fetch(`${API_URL}/vendors`);
        if (!response.ok) throw new Error('Failed to fetch vendors');
        return await response.json();
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return [];
    }
};

export const registerVendor = async (vendorData: Partial<Vendor>): Promise<Vendor | null> => {
    try {
        const response = await fetch(`${API_URL}/vendors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
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
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return false;
    }
};

export const seedDatabase = async (plants: Plant[], vendors: Vendor[], users: any[] = []) => {
    await fetch(`${API_URL}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plants, vendors, users })
    });
};

export const toggleFavorite = async (email: string, plantId: string) => {
    const res = await fetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plantId })
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");
    return res.json();
};

export const requestPasswordReset = async (email: string) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error("Failed to request reset");
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
    const res = await fetch(`${API_URL}/admin/requests`);
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
};

export const approveResetRequest = async (userId: string) => {
    const res = await fetch(`${API_URL}/admin/approve-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error("Failed to approve");
    return res.json();
};

export const addPlant = async (plantData: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantData)
    });
    if (!res.ok) throw new Error("Failed to add plant");
    return res.json();
};

export const updatePlant = async (id: string, updates: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update plant");
    return res.json();
};

export const deletePlant = async (id: string) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete plant");
    return res.json();
};

export const fetchNotifications = async () => {
    const res = await fetch(`${API_URL}/admin/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
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
