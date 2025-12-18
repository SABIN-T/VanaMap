require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Plant, Vendor, User, Notification } = require('./models');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- HELPER: Mock WhatsApp Notification ---
const sendWhatsApp = async (msg, type, details = {}) => {
    // User requested phone: 9188773534
    const adminPhone = "9188773534";
    console.log(`[WHATSAPP MOCK] To ${adminPhone}: ${msg}`);

    try {
        const notification = new Notification({
            type,
            message: msg,
            details
        });
        await notification.save();
    } catch (err) {
        console.error("Failed to save notification:", err);
    }
};

app.get('/api/admin/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ date: -1 }).limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tracking/vendor-contact', async (req, res) => {
    try {
        const { vendorId, vendorName, userEmail, contactType } = req.body;
        const msg = `User ${userEmail} contacted Vendor ${vendorName} via ${contactType}`;
        await sendWhatsApp(msg, 'vendor_contact', { vendorId, userEmail, contactType });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DOCTOR AI & SUGGESTION ROUTES ---

const { Chat } = require('./models');

// Mock AI Logic (Heuristic)
// Mock AI Logic (Heuristic + DB Augmented)
const getAIResponse = async (query) => {
    const q = query.toLowerCase();

    // 1. DB Search (Train on Website Data)
    try {
        // Simple linear search for keyword matching in Plant Names
        const plants = await Plant.find({}, 'name description medicinalValues idealTempMin idealTempMax');
        const matchedPlant = plants.find(p => q.includes(p.name.toLowerCase()) || (p.scientificName && q.includes(p.scientificName.toLowerCase())));

        if (matchedPlant) {
            return `Based on my analysis of ${matchedPlant.name}: It thrives between ${matchedPlant.idealTempMin}-${matchedPlant.idealTempMax}°C. ${matchedPlant.description}. Key benefits: ${matchedPlant.medicinalValues.slice(0, 3).join(', ')}.`;
        }
    } catch (e) {
        console.error("AI DB Lookup Error:", e);
    }

    // 2. Expert Heuristics
    if (q.includes('water')) return "Hydration Logic: Most indoor flora requires water when the substrate's top inch desiccates. Succulents require total aridity between cycles.";
    if (q.includes('light') || q.includes('sun')) return "Photosynthesis Optimization: South-facing apertures provide high lux (direct). North-facing provides ambient (low) light. Match your plant's heliophilic rating.";
    if (q.includes('yellow')) return "Chlorosis Detected: Yellowing often signals hydric saturation (overwatering). Alternates: Nitrogen deficiency or pest vectors. Audit soil moisture immediately.";
    if (q.includes('bug') || q.includes('pest')) return "Pest Protocol: Isolate the specimen. Apply Neem Oil solution or insecticidal soap. Increase humidity if Spider Mites are suspected.";
    if (q.includes('hello') || q.includes('hi')) return "System Online. I am Doctor AI, initialized with VanaMap's complete botanical registry. Query me about specific species or general horticulture.";

    return "Query Analysis: My local neural pathways didn't match a specific species in our database. ensure standard homeostasis: 50% Humidity, Indirect Light, and Weekly Watering cycles.";
};

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { userId, message } = req.body;

        // 1. Check Usage Limit
        const count = await Chat.countDocuments({ userId });
        // NOTE: In a real app, we check if user has 'premium' status in User model. 
        // Here we just return the count so frontend can gate it, OR gate it here.
        // Returning 'limitReached' flag if > 5 and not paid (simulated).

        // AI Logic Response
        const response = await getAIResponse(message);

        // Save Chat
        const chat = new Chat({ userId, message, response });
        await chat.save();

        res.json({
            response,
            count: count + 1,
            limitReached: (count + 1) > 5
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/suggestions', async (req, res) => {
    try {
        const { message, contact } = req.body; // user/vendor contact info
        const msg = `SUGGESTION from ${contact || 'Anonymous'}: ${message}`;

        // Send to Admin WhatsApp (Mock)
        await sendWhatsApp(msg, 'suggestion', { contact });

        // Also save to Notifications for dashboard capability
        const notif = new Notification({
            type: 'suggestion',
            message: msg,
            details: { contact, fullText: message }
        });
        await notif.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



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
app.post('/api/plants', async (req, res) => {
    try {
        const plant = new Plant(req.body);
        await plant.save();
        await sendWhatsApp(`New Plant Added: ${plant.name} (${plant.scientificName})`, 'plant_add', { plantId: plant.id });
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
        await sendWhatsApp(`New Vendor Profile Created: ${name}`, 'vendor_registration', { vendorId: newVendor.id });
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
            await sendWhatsApp(`Vendor ${vendor ? vendor.name : id} updated their inventory.`, 'vendor_update', { vendorId: id });
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
            await sendWhatsApp(`New Vendor Registration: ${name} (${email})`, 'vendor_registration', { userId: user._id, email });
        } else {
            await sendWhatsApp(`New User Registration: ${name} (${email})`, 'signup', { userId: user._id, email });
        }

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
// Health Check
app.get('/', (req, res) => res.send('VanaMap API v2.2 - Emergency Init Available'));

app.get('/api/admin/init-emergency', async (req, res) => {
    try {
        const email = 'admin@plantai.com';
        const password = 'Defender123';

        let user = await User.findOne({ email });
        let msg = '';

        if (!user) {
            user = new User({ email, password, name: 'Super Admin', role: 'admin' });
            await user.save();
            msg = 'Created Admin User';
        } else {
            user.password = password;
            user.role = 'admin';
            await user.save();
            msg = 'Updated Existing Admin User';
        }
        res.json({ success: true, message: msg, user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- LEGACY ADMIN MIGRATION ---
        const inputEmail = String(email).trim().toLowerCase();
        const inputPass = String(password).trim();

        // Environment variables (optional)
        const ENV_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
        const ENV_PASS = (process.env.ADMIN_PASS || '').trim();

        // Hardcoded Recovery Credentials (Requested by User)
        const HARDCODED_EMAIL = 'admin@plantai.com';
        const HARDCODED_PASS = 'Defender123';

        const isEnvMatch = ENV_EMAIL && inputEmail === ENV_EMAIL && (inputPass === ENV_PASS || inputPass === HARDCODED_PASS);
        const isHardcodedMatch = inputEmail === HARDCODED_EMAIL && inputPass === HARDCODED_PASS;

        if (isEnvMatch || isHardcodedMatch) {
            // Use the input email (case-insensitive) for DB lookup
            let admin = await User.findOne({ email: { $regex: new RegExp(`^${inputEmail}$`, 'i') } });
            if (!admin) {
                admin = new User({
                    email: inputEmail,
                    password: password,
                    name: 'System Admin',
                    role: 'admin'
                });
                await admin.save();
                console.log("Admin account auto-generated");
            }
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
            }
            return res.json(admin);
        }

        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        await sendWhatsApp(`User Logged In: ${user.name} (${email})`, 'login', { userId: user._id, email });

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

        await sendWhatsApp(`Password Reset Request: ${user.name} (${email}). Please approve in Admin Dashboard.`, 'password_reset_request', { email });

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

        await sendWhatsApp(`Password Changed Successfully for: ${user.name}`, 'password_reset_complete', { email });

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

// Sync Cart
app.post('/api/user/cart', async (req, res) => {
    try {
        const { email, cart } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Map frontend cart items (full plant objects) to schema format (plantId)
        // Or if frontend sends pre-formatted items, use them.
        // Based on frontend logic, we sync whatever matches the Schema: { plantId: String, quantity: Number }

        const schemaCart = cart.map(item => ({
            plantId: item.plantId || item.plant?.id || item.plant?._id,
            quantity: item.quantity
        })).filter(item => item.plantId); // Remove invalid items

        user.cart = schemaCart;
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        console.error("Cart Sync Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get User Profile (Full Sync)
app.get('/api/user/profile', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google Auth Sync
app.post('/api/auth/google-sync', async (req, res) => {
    try {
        const { email, name, favorites, cart } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            // Create new Google user
            user = new User({
                email,
                name,
                password: "GOOGLE_AUTH_" + Date.now(), // Dummy password
                role: 'user',
                favorites: favorites || [],
                cart: cart || []
            });
            await user.save();
            await sendWhatsApp(`New Google User: ${name}`, 'signup', { userId: user._id, email });
        } else {
            // Check if we need to merge logic? For now, just return existing user.
        }
        res.json(user);
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
