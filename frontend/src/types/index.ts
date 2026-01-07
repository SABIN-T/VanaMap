export interface Plant {
    id: string;
    _id?: string;
    name: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    idealTempMin: number; // Celsius
    idealTempMax: number;
    minHumidity: number; // Percentage
    sunlight: string; // e.g. 'low', '2000 Lux'
    oxygenLevel: string; // e.g. 'high', '300ml/h'
    medicinalValues: string[];
    advantages: string[];
    price?: number;
    // Base price, vendors may override
    type: 'indoor' | 'outdoor';
    lifespan?: string;
    isNocturnal?: boolean; // For CAM plants (Snake Plant, Aloe) that produce O2 at night
    ecosystem?: string;
    // Biometric Data
    foliageTexture?: string;
    leafShape?: string;
    stemStructure?: string;
    overallHabit?: string;
    biometricFeatures?: string[];
    ecosystemDescription?: string;
    score?: number; // Calculated aptness based on local environment
    petFriendly?: boolean;
}

export interface Vendor {
    id: string;
    _id?: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: string;
    whatsapp: string;
    website?: string;
    inventoryIds: string[]; // List of plant IDs they sell
    // Detailed inventory for price management
    inventory?: {
        plantId: string;
        price: number;
        status: 'pending' | 'approved';
        inStock: boolean;
    }[];
    verified?: boolean;
    highlyRecommended?: boolean;
    distance?: number;
    category?: string;
}

export interface CartItem {
    plant: Plant;
    quantity: number;
    vendorId?: string; // Optional: If buying from specific vendor
    vendorPrice?: number; // Snapshot of price at time of add
}

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    isDay: boolean;
}

export type UserRole = 'user' | 'vendor' | 'admin';

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    favorites: string[]; // Plant IDs
    cart: { plantId: string; quantity: number; vendorId?: string; vendorPrice?: number; }[];
    token?: string; // JWT Session Token
    resetRequest?: {
        requested: boolean;
        approved: boolean;
        requestDate: string;
    };
    points?: number;
    isPremium?: boolean;
    premiumType?: 'none' | 'trial' | 'monthly' | 'gift' | 'free_promo';
    premiumExpiry?: string;
    premiumStartDate?: string;
    gameLevel?: number;
    gamePoints?: number;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    googleAuth?: boolean;
}
