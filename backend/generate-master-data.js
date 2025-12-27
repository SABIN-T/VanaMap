const fs = require('fs');
const path = require('path');

// Helper for random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 1. DEFINE REAL PLANT DATA ---
// EMPTY - User wants to manage from Admin Dashboard
const REAL_PLANTS_SOURCE = [];

// --- 2. GENERATE BACKEND DATA (plant-data.js) ---
const generateBackendData = () => {
    // Generate data objects (Empty)
    const indoor = [];
    const outdoor = [];

    const content = `// MASTER PLANT DATA (Generated)
const indoorPlants = ${JSON.stringify(indoor, null, 4)};
const outdoorPlants = ${JSON.stringify(outdoor, null, 4)};

module.exports = { indoorPlants, outdoorPlants };
`;

    fs.writeFileSync(path.join(__dirname, 'plant-data.js'), content);
    console.log("Backend plant-data.js generated (EMPTY).");
};

// --- 3. GENERATE FRONTEND TYPESCRIPT MOCKS (mocks.ts) ---
const generateFrontendMocks = () => {
    const allPlants = [];

    const content = `import type { Plant, Vendor } from '../types';

export const PLANTS: Plant[] = [];

export const VENDORS: Vendor[] = [];

// Default Admin for access
export const USERS = [
    {
        _id: 'mock_admin_1',
        name: 'Admin User',
        email: 'admin@plantoxy.com',
        password: 'admin', // Mock only
        role: 'admin',
        favorites: [],
        cart: []
    }
];
`;
    // Note: We are using a relative path that assumes this script is run from project root or backend dir.
    // __dirname is usually backend/ so ../frontend/... is correct.
    const frontendPath = path.join(__dirname, '../frontend/src/data/mocks.ts');
    fs.writeFileSync(frontendPath, content);
    console.log("Frontend mocks.ts generated (with Admin User).");
};

// --- 4. GENERATE SIMULATION DATA (worldFlora.ts) ---
const generateSimulationData = () => {
    const flora = [];

    const content = `export interface WorldFloraSpecimen {
    id: string;
    scientificName: string;
    commonName: string;
    flowerType: string;
    leafVenation: string;
    inflorescencePattern: string;
    rarityIndex: number;
}

export const worldFlora: WorldFloraSpecimen[] = ${JSON.stringify(flora, null, 4)};
`;
    const simPath = path.join(__dirname, '../frontend/src/data/worldFlora.ts');
    fs.writeFileSync(simPath, content);
    console.log("Frontend worldFlora.ts generated.");
};

// RUN ALL
generateBackendData();
generateFrontendMocks();
generateSimulationData();

console.log("ALL DATA CLEARED SUCCESSFULLY.");
