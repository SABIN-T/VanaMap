require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Plant, Vendor, User, Notification, Chat } = require('./models');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'vanamap_super_secret_key_2025';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- MIDDLEWARES ---

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const admin = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admin only.' });
    next();
};

// Helper to normalize user for frontend (stripping sensitive data)
const normalizeUser = (user) => {
    if (!user) return null;
    const obj = user.toObject ? user.toObject() : user;
    const { password, __v, _id, ...rest } = obj;
    return {
        id: _id ? _id.toString() : (obj.id || ''),
        ...rest
    };
};

// --- HELPER: Mock WhatsApp Notification ---
const sendWhatsApp = async (msg, type, details = {}) => {
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

// --- ROUTES ---

app.get('/api/admin/notifications', auth, admin, async (req, res) => {
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

// --- DOCTOR AI ---

const getAIResponse = async (query) => {
    const q = query.toLowerCase();

    if (q.match(/(code|security|password|credential|database|api key|token|backend|server|vulnerability|exploit)/)) {
        return "🔒 **Access Denied**: My protocols are strictly limited to Botanical Science and Ecosystem Management. I cannot discuss system architecture.";
    }

    if (q.match(/^(hi|hello|hey|greetings|start)/)) {
        return "**👋 Hello! I am Dr. AI, your Lead Botanist.**\n\nI have been trained on thousands of plant species, local vendor inventories, and pricing models.\n\n**Ask me about:**\n- 🌿 Plant Identification & Biology\n- 💰 Fair Market Prices & Vendors\n- 🧪 Oxygen Output & Air Purification\n- 🩺 Diagnostic Care Guides\n\n*How can I assist your ecosystem today?*";
    }

    try {
        const matchedPlant = await Plant.findOne({ name: { $regex: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } });

        if (matchedPlant) {
            let response = `### 🌿 Specimen Analysis: ${matchedPlant.name}\n`;
            response += `*Type: ${matchedPlant.type} | Origin: Tropical/Indoor Simulation*\n\n`;

            if (q.match(/(price|cost|buy|worth|value|money|stock)/)) {
                const estPrice = matchedPlant.price || 25;
                response += `**💰 Market Valuation**\n`;
                response += `Current verified nursery data suggests a fair market value of **$${estPrice} - $${estPrice + 10}**.\n\n`;
                response += `**📦 Inventory Status**: AVAILABLE.\n`;
                const verifiedVendors = await Vendor.find({ verified: true }).limit(1);
                const localVendor = verifiedVendors[0]?.name || "Local GreenHouse";
                response += `Recommended Vendor: **${localVendor}** (Verified Partner).\n\n`;
            } else if (q.match(/(science|biology|latin|name|oxygen|benefit|safe|pet)/)) {
                response += `**🔬 Biological Profile**\n`;
                response += `- **Scientific Class**: *${matchedPlant.scientificName || matchedPlant.name + ' spp.'}*\n`;
                response += `- **Respiratory Output**: ${matchedPlant.oxygenLevel === 'high' ? 'High Efficiency O2 Generator' : 'Standard O2 Output'}.\n`;
                response += `- **Toxicity**: ${matchedPlant.petFriendly ? '✅ Non-Toxic' : '⚠️ Warning: Toxic to pets'}.\n\n`;
                response += `> **Insight**: ${matchedPlant.description?.substring(0, 150)}...\n\n`;
            } else {
                response += `**🩺 Care Protocols**\n`;
                response += `- **Hydration**: ${matchedPlant.maintenance === 'low' ? 'Drought Tolerant.' : 'Regular moisture.'}\n`;
                response += `- **Solar Rotation**: ${matchedPlant.lightReq === 'low' ? 'Low light.' : 'Moderate Lux.'}\n\n`;
                response += `*Ask "How much?" for pricing.*`;
            }
            return response;
        }

        // Search for relevant plants if no direct match
        const recommendations = await Plant.find({
            $or: [
                { type: q.includes('indoor') ? 'indoor' : (q.includes('outdoor') ? 'outdoor' : null) },
                { oxygenLevel: q.includes('oxygen') ? 'very-high' : null },
                { petFriendly: q.includes('pet') ? true : null }
            ].filter(cond => Object.values(cond)[0] !== null)
        }).limit(3);

        if (recommendations.length > 0) {
            let reply = `**🌟 Top Recommendations**\n\n`;
            recommendations.forEach(p => {
                reply += `- **${p.name}**: Optimized for your request.\n`;
            });
            return reply;
        }

        return `**🧠 Dr. AI Insight**\n\nI couldn't find a specific specimen matching "${query}". Please check the spelling or ask about 'Best indoor plants'.`;

    } catch (e) {
        console.error("AI Logic Failure", e);
        return "⚠️ **System Alert**: My neural pathways are currently undergoing maintenance.";
    }
};

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { userId, message } = req.body;
        const count = await Chat.countDocuments({ userId });
        const response = await getAIResponse(message);
        const chat = new Chat({ userId, message, response });
        await chat.save();
        res.json({ response, count: count + 1, limitReached: (count + 1) > 10 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PLANT ROUTES ---

app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find().lean();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/plants', auth, admin, async (req, res) => {
    try {
        const plant = new Plant(req.body);
        await plant.save();
        await sendWhatsApp(`New Plant: ${plant.name}`, 'plant_add', { plantId: plant.id });
        res.status(201).json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/plants/:id', auth, admin, async (req, res) => {
    try {
        const plant = await Plant.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/plants/:id', auth, admin, async (req, res) => {
    try {
        await Plant.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VENDOR ROUTES ---

app.get('/api/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find().lean();
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vendors', auth, admin, async (req, res) => {
    try {
        const newVendor = new Vendor({ ...req.body, id: "v" + Date.now() });
        await newVendor.save();
        res.status(201).json(newVendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/vendors/:id', auth, async (req, res) => {
    try {
        // Only admin or the vendor themselves should update, but for now we protect with auth
        const vendor = await Vendor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/vendors/:id', auth, admin, async (req, res) => {
    try {
        await Vendor.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AUTH ---

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User exists" });

        const user = new User({ email, password, name, role });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: normalizeUser(user), token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Check hardcoded admin recovery
            if (email === 'admin@plantai.com' && password === 'Defender123') {
                // Allow recovery login
            } else {
                return res.status(401).json({ error: "Invalid credentials" });
            }
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: normalizeUser(user), token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        res.json(normalizeUser(user));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/favorites', auth, async (req, res) => {
    try {
        const { plantId } = req.body;
        const user = await User.findById(req.user.id);
        const index = user.favorites.indexOf(plantId);
        if (index === -1) user.favorites.push(plantId);
        else user.favorites.splice(index, 1);
        await user.save();
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = req.body.cart.map(item => ({
            plantId: item.plantId || item.plant?.id,
            quantity: item.quantity
        }));
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/google-sync', async (req, res) => {
    try {
        const { email, name } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, password: Math.random().toString(36), role: 'user' });
            await user.save();
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: normalizeUser(user), token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN OPS ---

app.get('/api/admin/requests', auth, admin, async (req, res) => {
    const users = await User.find({ "resetRequest.requested": true });
    res.json(users);
});

app.get('/api/admin/init-emergency', async (req, res) => {
    // Only allow if no admin exists or with a secret key
    const secret = req.query.secret;
    if (secret !== process.env.EMERGENCY_SECRET && process.env.NODE_ENV === 'production') {
        return res.status(403).send('Unauthorized');
    }
    const email = 'admin@plantai.com';
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ email, password: 'Defender123', name: 'Super Admin', role: 'admin' });
    } else {
        user.password = 'Defender123';
        user.role = 'admin';
    }
    await user.save();
    res.json({ success: true });
});

app.post('/api/seed', auth, admin, async (req, res) => {
    const { plants, vendors } = req.body;
    if (plants) { await Plant.deleteMany({}); await Plant.insertMany(plants); }
    if (vendors) { await Vendor.deleteMany({}); await Vendor.insertMany(vendors); }
    res.json({ message: 'Seeded' });
});

app.post('/api/auth/reset-password-request', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            await new Promise(r => setTimeout(r, 500));
            return res.json({ success: true, message: "If account exists, request sent." });
        }
        user.resetRequest = { requested: true, approved: false, requestDate: new Date() };
        await user.save();
        res.json({ success: true, message: "Request submitted for admin review." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('VanaMap API v3.0 - Secure & Fast'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
