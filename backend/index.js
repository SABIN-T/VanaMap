require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Plant, Vendor, User } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- HELPER: Mock WhatsApp Notification ---
const sendWhatsApp = (msg) => {
    // In a real app, integrate with Twilio/Meta API
    // User requested phone: 9188773534
    console.log(`[WHATSAPP MOCK] To 9188773534: ${msg}`);
};

// --- ROUTES ---

// Get all plants
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin add new plant (Requested feature: Notify Admin)
// Admin add new plant (Requested feature: Notify Admin)
app.post('/api/plants', async (req, res) => {
    try {
        const plant = new Plant(req.body);
        await plant.save();
        sendWhatsApp(`New Plant Added: ${plant.name} (${plant.scientificName})`);
        res.status(201).json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Update Plant (New)
app.patch('/api/plants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Search by 'id' string field not _id
        const plant = await Plant.findOneAndUpdate({ id: id }, updates, { new: true });
        res.json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Delete Plant (New)
app.delete('/api/plants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Plant.findOneAndDelete({ id: id });
        res.json({ message: 'Plant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all vendors
app.get('/api/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register a vendor
app.post('/api/vendors', async (req, res) => {
    try {
        const { name, latitude, longitude, address, phone, whatsapp, website } = req.body;
        const newVendor = new Vendor({
            id: "v" + Date.now(),
            name,
            latitude,
            longitude,
            address,
            phone,
            whatsapp,
            website,
            inventoryIds: []
        });
        await newVendor.save();
        res.status(201).json(newVendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Vendor (Admin or Vendor Action)
app.patch('/api/vendors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const vendor = await Vendor.findOneAndUpdate({ id: id }, updates, { new: true });

        // Notify if inventory changed (New Plant Add context for vendors)
        if (updates.inventoryIds) {
            sendWhatsApp(`Vendor ${vendor ? vendor.name : id} updated their inventory.`);
        }

        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Vendor
app.delete('/api/vendors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vendor.findOneAndDelete({ id: id });
        res.json({ message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AUTH & USER ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const user = new User({ email, password, name, role });
        await user.save();

        if (role === 'vendor') {
            const vendor = new Vendor({
                id: user._id.toString(),
                name: name,
                verified: false,
                highlyRecommended: false,
                inventoryIds: []
            });
            await vendor.save();
            sendWhatsApp(`New Vendor Registration: ${name} (${email})`);
        } else {
            sendWhatsApp(`New User Registration: ${name} (${email})`);
        }

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password Request
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.resetRequest = {
            requested: true,
            approved: false, // Must be approved by admin
            requestDate: new Date()
        };
        await user.save();

        sendWhatsApp(`Password Reset Request: ${user.name} (${email}). Please approve in Admin Dashboard.`);

        res.json({ message: "Request sent to Admin. Please wait for approval." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password (Perform actual change after approval)
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.resetRequest?.approved) {
            return res.status(403).json({ error: "Reset request not approved by Admin yet." });
        }

        user.password = newPassword;
        user.resetRequest = {
            requested: false,
            approved: false,
            requestDate: null
        };
        await user.save();

        sendWhatsApp(`Password Changed Successfully for: ${user.name}`);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Favorite
app.post('/api/user/favorites', async (req, res) => {
    try {
        const { email, plantId } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Initialize if missing
        if (!user.favorites) user.favorites = [];

        const index = user.favorites.indexOf(plantId);
        if (index === -1) {
            user.favorites.push(plantId); // Add
        } else {
            user.favorites.splice(index, 1); // Remove
        }
        await user.save();
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- ADMIN ---

// Get Reset Requests
app.get('/api/admin/requests', async (req, res) => {
    try {
        // Find users with pending requests
        const users = await User.find({ "resetRequest.requested": true });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve Reset Request
app.post('/api/admin/approve-reset', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Keep 'requested' true so it still shows up or handled in FE? 
        // Better: Keep 'requested' true until password changed, but set 'approved' true.
        user.resetRequest.approved = true;
        await user.save();

        res.json({ message: "Request approved. User can now reset password." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Endpoint
// Seed Endpoint
app.post('/api/seed', async (req, res) => {
    try {
        const { plants, vendors, users } = req.body;

        // If plants provided, replace plants
        if (plants && plants.length > 0) {
            await Plant.deleteMany({});
            await Plant.insertMany(plants);
        }

        // If vendors provided, replace vendors
        if (vendors && vendors.length > 0) {
            await Vendor.deleteMany({});
            await Vendor.insertMany(vendors);
        }

        // If users provided, replace users
        if (users && users.length > 0) {
            await User.deleteMany({});
            await User.insertMany(users);
        }

        res.json({ message: 'Database updated successfully with Plants, Vendors, and Users.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
