require('dotenv').config();
const mongoose = require('mongoose');
const { Plant } = require('./models');

// Import plants directly from frontend (we'll copy the data here)
const PLANTS_SEED_DATA = require('../frontend/src/data/mocks.ts');

const seedDatabase = async () => {
    try {
        console.log('🌱 VanaMap Database Seeding Script');
        console.log('=====================================\n');

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected\n');

        // Get current state
        const existingCount = await Plant.countDocuments();
        console.log(`📊 Current database: ${existingCount} plants`);

        // We'll use the existing plant-data.js which should have all plants
        const { indoorPlants, outdoorPlants } = require('./plant-data');
        const allPlants = [...indoorPlants, ...outdoorPlants];

        console.log(`📦 Seed data contains: ${allPlants.length} plants`);
        console.log(`   🏠 Indoor: ${indoorPlants.length}`);
        console.log(`   🌲 Outdoor: ${outdoorPlants.length}\n`);

        // Upsert all plants
        console.log('💾 Seeding database...');
        const ops = allPlants.map(plant => ({
            updateOne: {
                filter: { id: plant.id },
                update: { $set: plant },
                upsert: true
            }
        }));

        const result = await Plant.bulkWrite(ops);

        console.log('\n✨ Seeding Complete!');
        console.log(`   ✅ Inserted: ${result.upsertedCount}`);
        console.log(`   🔄 Updated: ${result.modifiedCount}`);
        console.log(`   📝 Matched: ${result.matchedCount}`);

        const finalCount = await Plant.countDocuments();
        console.log(`\n📊 Final database: ${finalCount} plants`);

        if (finalCount >= allPlants.length) {
            console.log('🎉 SUCCESS: Database fully seeded!');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error:', err.message);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
