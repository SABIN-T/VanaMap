require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const ADMIN_EMAIL = 'admin@plantai.com';
const ADMIN_PASS = 'Defender123';

const createAdmin = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ No MONGO_URI found in .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB.");

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (user) {
            console.log("ℹ️ User exists.");
            if (user.role !== 'admin') {
                console.log("⚠️ User role is " + user.role + ". Updating to admin...");
                user.role = 'admin';
                await user.save();
                console.log("✅ User promoted to Admin.");
            } else {
                console.log("✅ User is already Admin.");
            }
            if (user.password !== ADMIN_PASS) {
                console.log("⚠️ Password mismatch. Updating password...");
                user.password = ADMIN_PASS;
                await user.save();
                console.log("✅ Password updated.");
            }
        } else {
            console.log("ℹ️ User not found. Creating...");
            user = new User({
                email: ADMIN_EMAIL,
                password: ADMIN_PASS,
                name: 'System Admin',
                role: 'admin'
            });
            await user.save();
            console.log("✅ Admin User Created Successfully.");
        }

        console.log("\n⬇️ Credentials:");
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Pass:  ${ADMIN_PASS}`);
        console.log("\nYou should now be able to login.");

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
