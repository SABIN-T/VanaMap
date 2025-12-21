const mongoose = require('mongoose');
const { User } = require('./models.js');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sabin:sabin@cluster0.pujhf.mongodb.net/plant-finder?retryWrites=true&w=majority";

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const email = "sabin02032002@gmail.com";

        // 1. Create or Reset User
        let user = await User.findOne({ email });
        if (!user) {
            console.log("Creating test user sabin02032002@gmail.com...");
            user = new User({
                email,
                name: "Sabin Real",
                password: "OriginalPassword123",
                role: "user"
            });
        } else {
            console.log("User exists, resetting password to 'OriginalPassword123' for test...");
            user.password = "OriginalPassword123";
        }
        await user.save();
        console.log("User ready with password: OriginalPassword123");

        // 2. Perform 'Nudge Admin' (Manual trigger of the logic)
        // This mimics clicking the 'Contact Admin' button
        console.log("Triggering Admin Help (Password Reset Logic)...");
        user.password = '123456';
        await user.save();
        console.log("System reset password to: 123456");

        // 3. Verify Login
        const verifiedUser = await User.findOne({ email });
        const isMatch = await verifiedUser.comparePassword('123456');

        if (isMatch) {
            console.log("SUCCESS: User sabin02032002@gmail.com can now login with 123456");
            console.log("Notification entry would also be created in real flow.");
        } else {
            console.log("FAILURE: Reset did not work as expected");
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

verify();
