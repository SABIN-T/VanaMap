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

// Routes

// Get all plants
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
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
            id: "v" + Date.now(), // Simple ID generation
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

// Update Vendor (Admin)
app.patch('/api/vendors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const vendor = await Vendor.findOneAndUpdate({ id: id }, updates, { new: true });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Vendor (Admin)
app.delete('/api/vendors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vendor.findOneAndDelete({ id: id });
        res.json({ message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth Endpoints
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const user = new User({ email, password, name, role });
        await user.save();

        // If vendor, also create a vendor placeholder
        if (role === 'vendor') {
            const vendor = new Vendor({
                id: user._id.toString(),
                name: name,
                verified: false,
                highlyRecommended: false,
                inventoryIds: []
            });
            await vendor.save();
        }

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// Seed Endpoint (For dev only - to populate DB easily)
// Seed Endpoint
app.post('/api/seed', async (req, res) => {
    try {
        const { plants, vendors } = req.body;

        // If plants provided, replace plants
        if (plants && plants.length > 0) {
            await Plant.deleteMany({});
            await Plant.insertMany(plants);
        }

        // If vendors provided (only if non-empty array), replace vendors
        // This prevents accidental vendor wipe if we only want to update plants
        if (vendors && vendors.length > 0) {
            await Vendor.deleteMany({});
            await Vendor.insertMany(vendors);
        }

        res.json({ message: 'Database updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
