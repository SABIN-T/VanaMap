require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const emailToDelete = process.argv[2];

if (!emailToDelete) {
    console.error("Please provide an email address to delete.");
    console.error("Usage: node delete-user.js <email>");
    process.exit(1);
}

const deleteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const result = await User.deleteOne({ email: emailToDelete });

        if (result.deletedCount > 0) {
            console.log(`✅ Successfully deleted user: ${emailToDelete}`);
        } else {
            console.log(`⚠️ User not found: ${emailToDelete}`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

deleteUser();
