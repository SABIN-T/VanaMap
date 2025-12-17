import type { Plant, Vendor } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Seed function to running from browser console if needed
export const seedDatabase = async (plants: Plant[], vendors: Vendor[]) => {
    await fetch(`${API_URL}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plants, vendors })
    });
};
