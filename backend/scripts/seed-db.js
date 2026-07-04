require('dotenv').config();
const mongoose = require('mongoose');
const { Plant } = require('./models');
const { indoorPlants, outdoorPlants } = require('./plant-data');

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected');

        const allPlants = [...indoorPlants, ...outdoorPlants];
        console.log(`Processing ${allPlants.length} plants from seed file...`);

        // Use bulkWrite to upsert (update if exists, insert if new)
        // This ensures meaningful descriptions overwrite the Lorem Ipsum ones
        const ops = allPlants.map(plant => ({
            updateOne: {
                filter: { id: plant.id },
                update: { $set: plant },
                upsert: true
            }
        }));

        const result = await Plant.bulkWrite(ops);
        console.log('Seed Operation Result:', result);
        console.log('Database updated successfully with English descriptions.');

        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
