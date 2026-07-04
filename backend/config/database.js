/**
 * Database Configuration & Auto-Seeding
 */
const mongoose = require('mongoose');
const { Plant, WorldFlora, Vendor } = require('../models');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log('MongoDB Connected');

        // Auto-seed database if empty
        const plantCount = await Plant.countDocuments();
        console.log(`📊 Current database: ${plantCount} plants`);

        if (plantCount === 0) {
            console.log('🌱 Database is empty. Auto-seeding from plant-data.js...');
            try {
                const { indoorPlants, outdoorPlants } = require('../plant-data');
                const allPlants = [...indoorPlants, ...outdoorPlants];

                const ops = allPlants.map(plant => ({
                    updateOne: {
                        filter: { id: plant.id },
                        update: { $set: plant },
                        upsert: true
                    }
                }));

                const result = await Plant.bulkWrite(ops);
                console.log(`✅ Auto-seeded ${result.upsertedCount} plants successfully!`);
            } catch (seedErr) {
                console.error('❌ Auto-seed failed:', seedErr.message);
            }
        } else {
            console.log('✅ Database already populated');
        }

        // Auto-seed WorldFlora registry if empty
        const floraCount = await WorldFlora.countDocuments();
        console.log(`🔬 Current World Flora database: ${floraCount} specimens`);
        if (floraCount === 0) {
            console.log('🌱 World Flora database is empty. Auto-seeding from simulation-seed-data.json...');
            try {
                const fs = require('fs');
                const path = require('path');
                const seedFile = path.join(__dirname, '..', 'simulation-seed-data.json');
                if (fs.existsSync(seedFile)) {
                    const floraData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
                    await WorldFlora.insertMany(floraData);
                    console.log(`✅ Auto-seeded ${floraData.length} World Flora specimens successfully!`);
                } else {
                    console.warn('⚠️ Seeding file simulation-seed-data.json not found.');
                }
            } catch (seedErr) {
                console.error('❌ World Flora auto-seed failed:', seedErr.message);
            }
        }

        // Ensure Care Products are seeded and added to vendor inventory
        await seedCareProducts();
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
    }
};

const seedCareProducts = async () => {
    try {
        const careProducts = [
            {
                id: "care_neem_oil",
                name: "Organic Neem Oil Pest Spray",
                scientificName: "Azadirachta indica extract",
                description: "100% cold-pressed organic Neem Oil spray. Highly effective natural treatment for Spider Mites, Aphids, Mealybugs, and fungal spots. Safe for indoor and outdoor plants.",
                imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
                idealTempMin: 10, idealTempMax: 40, minHumidity: 10,
                sunlight: "N/A", oxygenLevel: "N/A",
                medicinalValues: ["Organic Pest Control", "Antifungal"],
                advantages: ["Pet safe in dilution", "Controls 100+ pests"],
                price: 199, type: "care", audience: "both"
            },
            {
                id: "care_npk_fertilizer",
                name: "NPK 19-19-19 Premium Fertilizer",
                scientificName: "Balanced NPK Solution",
                description: "Balanced NPK liquid concentrate fertilizer. Promotes strong vegetative growth, leaf color, and healthy root development. Ideal for all indoor house plants.",
                imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
                idealTempMin: 5, idealTempMax: 45, minHumidity: 10,
                sunlight: "N/A", oxygenLevel: "N/A",
                medicinalValues: ["Nutrient Supplement"],
                advantages: ["Balanced growth formula", "Water-soluble"],
                price: 249, type: "care", audience: "both"
            },
            {
                id: "care_soil_mix",
                name: "Premium Aerated Potting Soil Mix",
                scientificName: "Organic Growth Medium",
                description: "Complete organic soil mix enriched with coco peat, vermicompost, and perlite. Provides optimal aeration, water retention, and essential micronutrients.",
                imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
                idealTempMin: 0, idealTempMax: 50, minHumidity: 5,
                sunlight: "N/A", oxygenLevel: "N/A",
                medicinalValues: ["Substrate Conditioning"],
                advantages: ["Enriched with Vermicompost", "Optimized pH & drainage"],
                price: 299, type: "care", audience: "both"
            },
            {
                id: "care_fungicide",
                name: "Systemic Copper Fungicide Spray",
                scientificName: "Copper Octanoate solution",
                description: "Highly effective broad-spectrum copper fungicide. Controls Powdery Mildew, Black Spot, Rust, and Anthracnose on indoor/outdoor plants.",
                imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
                idealTempMin: 5, idealTempMax: 40, minHumidity: 10,
                sunlight: "N/A", oxygenLevel: "N/A",
                medicinalValues: ["Foliage Protection"],
                advantages: ["Controls Powdery Mildew & Rust", "Organic compatible"],
                price: 349, type: "care", audience: "both"
            }
        ];

        for (const prod of careProducts) {
            await Plant.updateOne({ id: prod.id }, { $set: prod }, { upsert: true });
        }
        console.log("🧴 Seeded care and treatment products.");

        // Add products to all verified vendors
        const vendors = await Vendor.find();
        for (const vendor of vendors) {
            let updated = false;
            if (!vendor.inventory) vendor.inventory = [];
            for (const prod of careProducts) {
                const hasItem = vendor.inventory.some(i => i.plantId === prod.id);
                if (!hasItem) {
                    vendor.inventory.push({
                        plantId: prod.id,
                        price: prod.price,
                        quantity: 50,
                        status: 'approved',
                        inStock: true,
                        sellingMode: 'both'
                    });
                    updated = true;
                }
            }
            if (updated) {
                if (vendor.inventoryIds) {
                    for (const prod of careProducts) {
                        if (!vendor.inventoryIds.includes(prod.id)) {
                            vendor.inventoryIds.push(prod.id);
                        }
                    }
                }
                await vendor.save();
            }
        }
        console.log(`🏪 Updated inventory of ${vendors.length} vendors with care supplies.`);
    } catch (err) {
        console.error("❌ Failed to seed care products:", err.message);
    }
};

module.exports = { connectDB };
