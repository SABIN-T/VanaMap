require('dotenv').config();
const mongoose = require('mongoose');
const { Plant } = require('./models');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Database Seeding Script
 * Seeds MongoDB with all plants from frontend/src/data/mocks.ts
 * This ensures plants persist across deployments and are always available
 */

const seedFromFrontend = async () => {
    try {
        console.log('🌱 Starting comprehensive database seeding...');
        console.log('📡 Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Connected');

        // Read the frontend mocks.ts file
        const mocksPath = path.join(__dirname, '../frontend/src/data/mocks.ts');
        console.log(`📖 Reading seed data from: ${mocksPath}`);

        const mocksContent = fs.readFileSync(mocksPath, 'utf-8');

        // Extract the PLANTS array using regex
        const plantsMatch = mocksContent.match(/export const PLANTS: Plant\[\] = (\[[\s\S]*?\n\]);/);

        if (!plantsMatch) {
            throw new Error('Could not find PLANTS array in mocks.ts');
        }

        // Convert TypeScript to JSON-parseable format
        let plantsJson = plantsMatch[1]
            .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
            .replace(/'/g, '"')            // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

        const plants = JSON.parse(plantsJson);

        console.log(`📦 Found ${plants.length} plants in seed data`);

        // Count by type
        const indoorCount = plants.filter(p => p.type === 'indoor').length;
        const outdoorCount = plants.filter(p => p.type === 'outdoor').length;
        console.log(`   🏠 Indoor: ${indoorCount}`);
        console.log(`   🌲 Outdoor: ${outdoorCount}`);

        // Check current database state
        const existingCount = await Plant.countDocuments();
        console.log(`📊 Current database has ${existingCount} plants`);

        // Use bulkWrite for efficient upsert operations
        const ops = plants.map(plant => ({
            updateOne: {
                filter: { id: plant.id },
                update: { $set: plant },
                upsert: true
            }
        }));

        console.log('💾 Upserting plants to database...');
        const result = await Plant.bulkWrite(ops);

        console.log('\n✨ Seed Operation Complete!');
        console.log(`   ✅ Inserted: ${result.upsertedCount}`);
        console.log(`   🔄 Updated: ${result.modifiedCount}`);
        console.log(`   📝 Matched: ${result.matchedCount}`);

        // Verify final count
        const finalCount = await Plant.countDocuments();
        console.log(`\n📊 Final database count: ${finalCount} plants`);

        if (finalCount === plants.length) {
            console.log('🎉 SUCCESS: All plants successfully seeded!');
        } else {
            console.warn(`⚠️  WARNING: Expected ${plants.length} but have ${finalCount}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed Error:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
};

seedFromFrontend();
