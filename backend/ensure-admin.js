require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function ensureAdminExists() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const adminEmail = 'admin@vanamap.com';
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log(`✅ Admin user already exists: ${adminEmail}`);
            console.log(`   Role: ${admin.role}`);
            console.log(`   Name: ${admin.name}`);

            // Ensure role is admin
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('✅ Updated role to admin');
            }
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                emailVerified: true
            });
            await admin.save();
            console.log('✅ Created new admin user');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: admin123`);
            console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
        }

        await mongoose.disconnect();
        console.log('\n✅ Admin setup complete!');
        console.log('\nLogin credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: admin123 (if newly created)`);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

ensureAdminExists();
