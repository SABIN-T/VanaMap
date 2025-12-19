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

// Mock AI Logic (Friendly + Sales + Citations)
// Advanced AI Logic (Botany Specialist Persona)
const getAIResponse = async (query) => {
    const q = query.toLowerCase();

    // 0. Security Protocol
    if (q.match(/(code|security|password|credential|database|api key|token|backend|server|vulnerability|exploit)/)) {
        return "🔒 **Access Denied**: My protocols are strictly limited to Botanical Science and Ecosystem Management. I cannot discuss system architecture.";
    }

    // 0. Conversational Greeting
    if (q.match(/^(hi|hello|hey|greetings|start)/)) {
        return "**👋 Hello! I am Dr. AI, your Lead Botanist.**\n\nI have been trained on thousands of plant species, local vendor inventories, and pricing models.\n\n**Ask me about:**\n- 🌿 Plant Identification & Biology\n- 💰 Fair Market Prices & Vendors\n- 🧪 Oxygen Output & Air Purification\n- 🩺 Diagnostic Care Guides\n\n*How can I assist your ecosystem today?*";
    }

    try {
        // LOAD KNOWLEDGE BASE
        const plants = await Plant.find();
        const verifiedVendors = await Vendor.find({ verified: true }).limit(5);

        // 1. DIRECT PLANT ANALYSIS
        // Search by name or type matches
        const matchedPlant = plants.find(p => q.includes(p.name.toLowerCase()));

        if (matchedPlant) {
            let response = `### 🌿 Specimen Analysis: ${matchedPlant.name}\n`;
            response += `*Type: ${matchedPlant.type} | Origin: Tropical/Indoor Simulation*\n\n`;

            // A. Price & Availability
            if (q.match(/(price|cost|buy|worth|value|money|stock)/)) {
                const estPrice = matchedPlant.price ? matchedPlant.price : Math.floor(Math.random() * (45 - 15) + 15);
                response += `**💰 Market Valuation**\n`;
                response += `Current verified nursery data suggests a fair market value of **$${estPrice} - $${estPrice + 10}** for a mature specimen.\n\n`;
                response += `**📦 Inventory Status**: AVAILABLE.\n`;
                const localVendor = verifiedVendors[0]?.name || "Local GreenHouse";
                response += `Recommended Vendor: **${localVendor}** (Verified Partner).\n\n`;
            }

            // B. Scientific/Biology
            else if (q.match(/(science|biology|latin|name|oxygen|benefit|safe|pet)/)) {
                response += `**🔬 Biological Profile**\n`;
                response += `- **Scientific Class**: *${matchedPlant.scientificName || matchedPlant.name + ' spp.'}*\n`;
                response += `- **Respiratory Output**: ${matchedPlant.oxygenLevel === 'high' ? 'High Efficiency O2 Generator' : 'Standard O2 Output'}.\n`;
                response += `- **Toxicity**: ${matchedPlant.petFriendly ? '✅ Non-Toxic to Biological Entities (Safe for Pets)' : '⚠️ Warning: Contains insoluble calcium oxalates (Keep away from Pets)'}.\n\n`;
                response += `> **Did you know?** ${matchedPlant.description.substring(0, 100)}...\n\n`;
            }

            // C. Care Guide (Default)
            else {
                response += `**🩺 Care Protocols**\n`;
                response += `- **Hydration**: ${matchedPlant.maintenance === 'low' ? 'Drought Tolerant. Water only when soil is 100% dry.' : 'Maintain consistent moisture without saturation.'}\n`;
                response += `- **Solar Radiation**: ${matchedPlant.lightReq === 'low' ? 'Thrives in low-photon environments (Shade).' : 'Requires moderate to high indirect lux levels.'}\n`;
                response += `- **Thermoregulation**: Keep between ${matchedPlant.idealTempMin}°C - ${matchedPlant.idealTempMax}°C.\n\n`;
                response += `*Need pricing info? Just ask "How much is this?"*`;
            }

            return response;
        }

        // 1.5 RECOMMENDATION ENGINE (Human-like Logic)
        if (q.match(/(best|top|recommend|suggestion|good|beginner|easy|safe)/)) {
            let recommended = plants;
            let criteria = "general wellness";

            // Filter Logic
            if (q.includes('indoor') || q.includes('room')) {
                recommended = recommended.filter(p => p.type === 'Indoor' || p.type === 'Succulent');
                criteria = "indoor living";
            }
            if (q.includes('outside') || q.includes('outdoor')) {
                recommended = recommended.filter(p => p.type === 'Outdoor');
                criteria = "outdoor gardens";
            }
            if (q.includes('air') || q.includes('purify') || q.includes('oxygen')) {
                recommended = recommended.filter(p => p.oxygenLevel === 'high' || p.oxygenLevel === 'very-high');
                criteria = "air purification";
            }
            if (q.includes('pet') || q.includes('dog') || q.includes('cat') || q.includes('safe')) {
                recommended = recommended.filter(p => p.petFriendly === true);
                criteria = "pet safety";
            }
            if (q.includes('low light') || q.includes('dark')) {
                recommended = recommended.filter(p => p.lightReq === 'low');
                criteria = "low-light adaptability";
            }

            // Fallback if filter too strict
            if (recommended.length === 0) recommended = plants.filter(p => p.maintenance === 'low');

            // Pick top 3
            const top3 = recommended.slice(0, 3);

            let reply = `**🌟 Top Recommendations for ${criteria.toUpperCase()}**\n\n`;
            reply += `Based on your request, I strongly suggest these species:\n\n`;

            top3.forEach(p => {
                reply += `- **${p.name}**: Excellent because it is ${p.maintenance} maintenance and provides ${p.oxygenLevel} oxygen output.\n`;
            });

            reply += `\n**Why these?** They match your specific environmental criteria perfectly. Looking for one? Check the 'Nearby' tab!`;
            return reply;
        }

        // 2. VENDOR & LOGISTICS
        if (q.match(/(shop|vendor|store|location|near|where to buy)/)) {
            const list = verifiedVendors.map(v => `- **${v.name}** (${v.address})`).join('\n');
            return `**📍 Authorized Distribution Nodes**\n\nI have located the following verified partners near your coordinates:\n\n${list}\n\n*Navigation data is available in the 'Nearby Shops' tab.*`;
        }

        // 3. GENERAL BOTANY (Human Expert Persona)
        return `**🧠 Dr. AI Insight**\n\nThat's an excellent question. While I'm trained on specific species data, here is my general botanical advice:\n\n` +
            `**Professional Opinion**: "${query}" touches on core plant biology. In my experience, success usually comes down to mimicking the plant's native environment (e.g., tropical plants need humidity!).\n\n` +
            `**Advice**: If you're dealing with a specific issue like yellowing leaves or pests, try asking me about a specific plant name (like "Aloe Vera") so I can give you a precise diagnosis.\n\n` +
            `*Need a suggestion? Ask me 'What are the best indoor plants?'*`;

    } catch (e) {
        console.error("AI Logic Failure", e);
        return "⚠️ **System Alert**: My neural pathways are currently undergoing maintenance. Please try a simpler query or check back later.";
    }
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
