require('dotenv').config();
const mongoose = require('mongoose');

console.log('--- DB Connection Test ---');
console.log('Target URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB');
        console.error('Error Details:', err);
        process.exit(1);
    });
