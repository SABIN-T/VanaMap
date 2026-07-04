require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        console.log("Recent Users:");
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

listUsers();
