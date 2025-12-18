export interface Plant {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    idealTempMin: number; // Celsius
    idealTempMax: number;
    minHumidity: number; // Percentage
    sunlight: 'low' | 'medium' | 'high' | 'direct';
    oxygenLevel: 'moderate' | 'high' | 'very-high';
    medicinalValues: string[];
    advantages: string[];
    price?: number;
    type: 'indoor' | 'outdoor';
    isNocturnal?: boolean; // For CAM plants (Snake Plant, Aloe) that produce O2 at night
    score?: number; // Calculated aptness based on local environment
}

export interface Vendor {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: string;
    whatsapp: string;
    website?: string;
    inventoryIds: string[]; // List of plant IDs they sell
    verified?: boolean;
    highlyRecommended?: boolean;
    distance?: number;
    category?: string;
}

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    isDay: boolean;
}

export type UserRole = 'user' | 'vendor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    favorites: string[]; // Plant IDs
    cart: { plantId: string; quantity: number }[];
    resetRequest?: {
        requested: boolean;
        approved: boolean;
        requestDate: string;
    };
}
