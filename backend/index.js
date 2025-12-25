require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Plant, Vendor, User, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription } = require('./models');
const webpush = require('web-push');
const helmet = require('helmet');
const compression = require('compression'); // Performance: Gzip/Brotli
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 60000, // 1 minute
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000 // 1 minute
});

const sendResetEmail = async (email, tempPass) => {
    console.log(`ATTEMPTING TO SEND EMAIL TO: ${email} via ${process.env.EMAIL_USER}`);
    const mailOptions = {
        from: `"Vana Map" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🛡️ Account Recovered by The Defender',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #10b981; margin: 0;">VanaMap Security Hub</h1>
                    <p style="color: #64748b; font-size: 14px;">The Ultimate Secure Protector</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <p style="font-weight: bold; font-size: 18px; color: #059669;">I am the Defender of VanaMap</p>
                    <p>The ultimate secure Protector of this environment. Your access has been restored. Use the key below to return:</p>
                    
                    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px dashed #10b981;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; color: #0f172a; letter-spacing: 4px;">${tempPass}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #475569;">Return to the simulation and update your credentials immediately via your Dashboard.</p>
                </div>

                <div style="margin-top: 30px; text-align: center; padding: 0 20px;">
                    <p style="font-style: italic; color: #10b981; font-size: 14px; line-height: 1.6;">
                        "Be happy don't worry for a password everything has a solution lets breath fresh air together"
                    </p>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p>This is the Defender of VanaMap. The ultimate sure Protector in email.</p>
                    <p>System Generated Shield - DO NOT SPAM</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to: ${email}`);
        console.log(`Response: ${info.response}`);
    } catch (e) {
        console.error("CRITICAL MAIL ERROR:", e.message);
        console.error("Transporter Auth:", { user: process.env.EMAIL_USER, pass: '****' });
    }
};

const sendWelcomeEmail = async (email, name, role = 'user') => {
    const isVendor = role === 'vendor';
    const welcomeTitle = isVendor ? `Welcome Partner, ${name}! 🏪` : `Welcome, ${name}! 🌿`;
    const specificMessage = isVendor
        ? `You are now a registered <strong>Vendor</strong> on VanaMap. Get ready to showcase your nursery to thousands of plant lovers!`
        : `You are now part of VanaMap with user name <strong style="color: #10b981;">Explore the nature</strong>.`;

    const mailOptions = {
        from: `"Vana Map" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: isVendor ? 'Welcome to VanaMap Content Partner! 🚀' : 'Welcome to VanaMap - Explore the nature',
        html: `
            <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1e293b; background-color: #f0fdf4; border-radius: 24px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #10b981; margin: 0; font-size: 32px; letter-spacing: -1px;">VanaMap</h1>
                    <p style="color: #059669; font-size: 16px; margin-top: 8px; font-weight: 600;">The Forest Land for Future</p>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);">
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 24px;">${welcomeTitle}</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #475569;">
                        ${specificMessage}
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #475569;">
                        We are thrilled to have you join our mission to build a greener future. With VanaMap, you can:
                    </p>
                    <ul style="color: #475569; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                        ${isVendor ? '<li>🏪 Manage your digital shop inventory</li><li>📈 Reach local customers instantly</li>' : '<li>🌱 Discover plants perfect for your home</li><li>🏡 Find nearby nurseries and vendors</li>'}
                        <li>🤖 Diagnose plant diseases with AI</li>
                        <li>💨 Simulate air quality improvements</li>
                    </ul>
                    
                    <div style="margin-top: 35px; text-align: center;">
                        <a href="https://www.vanamap.online/dashboard" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 99px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);">
                            ${isVendor ? 'Go to Vendor Portal' : 'Start Exploring'}
                        </a>
                    </div>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #64748b; font-size: 13px;">
                    <p>&copy; 2025 VanaMap. All rights reserved.</p>
                    <p>Let's breathe fresh air together.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to: ${email} (${role})`);
    } catch (e) {
        console.error("Welcome Mail Error:", e.message);
    }
};

// --- WEB PUSH SETUP ---
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

let pushEnabled = false;
if (publicVapidKey && privateVapidKey) {
    try {
        webpush.setVapidDetails('mailto:support@vanamap.online', publicVapidKey, privateVapidKey);
        pushEnabled = true;
        console.log("Web Push initialized successfully.");
    } catch (err) {
        console.error("Web Push init failed:", err.message);
    }
} else {
    console.warn("WARNING: VAPID Keys not found in environment variables. Push notifications disabled.");
}

const sendPushNotification = async (payload) => {
    if (!pushEnabled) {
        console.log("Skipping push notification (Push Disabled/No Keys)");
        return;
    }

    try {
        const subscriptions = await PushSubscription.find();
        if (subscriptions.length === 0) return;

        console.log(`[PUSH] Sending to ${subscriptions.length} devices...`);
        const notificationPayload = JSON.stringify(payload);

        let sentCount = 0;
        const promises = subscriptions.map(sub =>
            webpush.sendNotification(sub, notificationPayload)
                .then(() => sentCount++)
                .catch(err => {
                    // 410 Gone / 404 means expired
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        return PushSubscription.deleteOne({ _id: sub._id });
                    }
                    console.error(`[PUSH] Error: ${err.statusCode}`);
                })
        );
        await Promise.all(promises);
        console.log(`[PUSH] Sent to ${sentCount} devices.`);
    } catch (e) {
        console.error("[PUSH] Critical error:", e.message);
    }
};

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'vanamap_super_secret_key_2025';

// Security & Performance
app.enable('trust proxy'); // Required for Render/Heroku to get real client IP
app.use(compression()); // Compress all responses
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
})); // Set security HTTP headers
app.use(express.json({ limit: '10mb' })); // Body parser
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- RATE LIMITING ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per window
    message: { error: "Too many attempts from this IP, please try again after 15 minutes" }
});

const generalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 500, // Limit each IP to 500 requests per window
    message: { error: "System under heavy load. Please try again later." }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast if no connection
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Do not exit process, let server run to serve /health
    }
};
connectDB();

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

app.post('/api/notifications/subscribe', async (req, res) => {
    try {
        const subscription = req.body;
        // Simple upsert based on endpoint
        await PushSubscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            subscription,
            { upsert: true, new: true }
        );
        res.status(201).json({});
    } catch (e) {
        console.error("Sub error", e);
        res.status(500).json({ error: "Failed to subscribe" });
    }
});

// --- ROUTES ---

// --- GAMIFICATION & ANALYTICS ---

app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
        // Only real users with role 'user', having at least some points
        const topUsers = await User.find({ role: 'user', points: { $gt: 0 } })
            .sort({ points: -1 })
            .limit(10)
            .select('name points city state');

        const cityRankings = await User.aggregate([
            { $match: { role: 'user', points: { $gt: 0 } } },
            {
                $group: {
                    _id: { city: '$city', state: '$state' },
                    totalPoints: { $sum: '$points' },
                    userCount: { $sum: 1 }
                }
            },
            { $sort: { totalPoints: -1 } },
            { $limit: 10 }
        ]);

        res.json({ users: topUsers, cities: cityRankings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/complete-purchase', auth, async (req, res) => {
    try {
        const { items } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Award 100 points per plant selected for purchase
        const pointsToAward = (items?.length || 0) * 100;
        user.points = (user.points || 0) + pointsToAward;
        await user.save();

        // Create log
        await Notification.create({
            type: 'system',
            message: `User ${user.name} earned ${pointsToAward} points for starting a purchase.`,
            details: { userId: user._id, points: pointsToAward }
        });

        res.json({ success: true, newPoints: user.points });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tracking/search', async (req, res) => {
    try {
        const { query, plantId, location } = req.body;
        const log = new SearchLog({ query, plantId, location });
        await log.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/analytics/vendor/:vendorId', auth, async (req, res) => {
    try {
        // Simple search analytics for vendors
        // In a real app we'd filter by vendor's service area
        const topSearches = await SearchLog.aggregate([
            { $group: { _id: '$query', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const demandByLocation = await SearchLog.aggregate([
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ topSearches, demandByLocation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/notifications', auth, admin, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ date: -1 }).limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/notifications/:id', auth, admin, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vendor/notifications', auth, async (req, res) => {
    try {
        // Find notifications where details.vendorId matches the logged-in user's ID
        // Note: We check both direct ID and potentially "v" prefixed ID if implementation varies
        const notifications = await Notification.find({
            $or: [
                { "details.vendorId": req.user.id },
                { "details.vendorId": req.user._id }
            ]
        }).sort({ date: -1 }).limit(50);
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

// --- SUGGESTION ROUTES ---

app.post('/api/suggestions', async (req, res) => {
    try {
        const { userId, plantName, description, userName } = req.body;
        const suggestion = new PlantSuggestion({
            userId,
            userName: userName || 'Anonymous',
            plantName,
            description
        });
        await suggestion.save();

        // Notify Admin
        await sendWhatsApp(`New Plant Suggestion: ${plantName} by ${userName}`, 'suggestion_add', { suggestionId: suggestion._id });
        const notif = new Notification({
            type: 'suggestion',
            message: `User ${userName} suggested a new plant: ${plantName}`,
            details: { suggestionId: suggestion._id }
        });
        await notif.save();

        res.status(201).json({ success: true, message: "Suggestion submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NOTIFICATION MANAGEMENT ---
app.patch('/api/notifications/:id/read', auth, admin, async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/notifications/mark-all-read', auth, admin, async (req, res) => {
    try {
        await Notification.updateMany({ read: false }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/stats', auth, admin, async (req, res) => {
    try {
        const [
            userCount,
            vendorCount,
            plantCount,
            unreadNotifs,
            unreadUsers,
            unreadVendors,
            unreadPlants,
            unreadPrices
        ] = await Promise.all([
            User.countDocuments(),
            Vendor.countDocuments(),
            Plant.countDocuments(),
            Notification.countDocuments({ read: false }),
            Notification.countDocuments({ type: 'user', read: false }),
            Notification.countDocuments({ type: 'vendor', read: false }),
            Notification.countDocuments({ type: 'plant', read: false }),
            Notification.countDocuments({ type: 'price', read: false })
        ]);
        res.json({
            users: userCount,
            vendors: vendorCount,
            plants: plantCount,
            unread: {
                total: unreadNotifs,
                users: unreadUsers,
                vendors: unreadVendors,
                plants: unreadPlants,
                prices: unreadPrices
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/suggestions', auth, admin, async (req, res) => {
    try {
        const suggestions = await PlantSuggestion.find().sort({ submittedAt: -1 });
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/suggestions/:id', auth, admin, async (req, res) => {
    try {
        const suggestion = await PlantSuggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/suggestions/:id', auth, admin, async (req, res) => {
    try {
        await PlantSuggestion.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- PLANT DATA SEEDING ---
const { indoorPlants, outdoorPlants } = require('./plant-data');

app.get('/api/admin/seed-data', auth, admin, (req, res) => {
    // Return the static seed data so frontend can list it
    try {
        const { indoorPlants, outdoorPlants } = require('./plant-data');
        res.json({ indoor: indoorPlants, outdoor: outdoorPlants });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/seed-single', auth, admin, async (req, res) => {
    try {
        const { plantId } = req.body;
        const { indoorPlants, outdoorPlants } = require('./plant-data');
        const allPlants = [...indoorPlants, ...outdoorPlants];
        const plant = allPlants.find(p => p.id === plantId);

        if (!plant) return res.status(404).json({ error: "Plant not found in seed bank" });

        // Check for duplicate by scientific name
        const existingPlant = await Plant.findOne({ scientificName: plant.scientificName });
        if (existingPlant) {
            return res.status(409).json({
                error: `Plant with scientific name "${plant.scientificName}" already exists in the live database!`,
                existingId: existingPlant.id
            });
        }

        await Plant.updateOne({ id: plant.id }, { $set: plant }, { upsert: true });

        // Notify
        await Notification.create({
            type: 'system',
            message: `Admin manually deployed seed plant: ${plant.name}`,
            details: { plantId: plant.id },
            read: false
        });

        // Push Notification
        sendPushNotification({
            title: 'New Plant Discovered! 🌿',
            body: `${plant.name} has been added to our global database. Check it out!`,
            url: '/#plant-grid',
            icon: '/logo.png'
        });

        res.json({ success: true, plant });
    } catch (e) {
        console.error("SEED SINGLE ERROR:", e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/seed-plants', auth, admin, async (req, res) => {
    try {
        console.log("SEED: Starting plant population...");
        const allPlants = [...indoorPlants, ...outdoorPlants];
        let stats = { added: 0, updated: 0 };

        for (const plant of allPlants) {
            const result = await Plant.updateOne(
                { id: plant.id },
                { $set: plant },
                { upsert: true }
            );
            if (result.upsertedCount > 0) stats.added++;
            else if (result.modifiedCount > 0) stats.updated++;
        }

        console.log(`SEED: Complete. Added ${stats.added}, Updated ${stats.updated}`);
        res.json({ success: true, ...stats, total: allPlants.length });
    } catch (err) {
        console.error("SEED ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- PLANT ROUTES ---

app.get('/api/plants', async (req, res) => {
    try {
        console.log("GET /api/plants - Fetching all plants...");
        const plants = await Plant.find().lean();
        console.log(`GET /api/plants - Found ${plants.length} plants`);
        res.json(plants);
    } catch (err) {
        console.error("GET /api/plants ERROR:", err);
        res.status(500).json({ error: "DB Error: " + err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
    }
});

app.post('/api/plants', auth, admin, async (req, res) => {
    try {
        const plant = new Plant(req.body);
        await plant.save();

        await Notification.create({
            type: 'plant',
            message: `New plant added: ${plant.name}`,
            details: { plantId: plant.id },
            read: false
        });

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

app.post('/api/vendors', auth, async (req, res) => {
    try {
        // Allow frontend to specify ID (linking to User ID), fallback to timestamp if missing
        const itemData = { id: "v" + Date.now(), ...req.body };
        const newVendor = new Vendor(itemData);
        await newVendor.save();

        await Notification.create({
            type: 'vendor',
            message: `New vendor joined: ${newVendor.name}`,
            details: { vendorId: newVendor.id },
            read: false
        });

        res.status(201).json(newVendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/vendors/:id', auth, async (req, res) => {
    try {
        // Only admin or the vendor themselves should update, but for now we protect with auth
        const oldVendor = await Vendor.findOne({ id: req.params.id });
        const vendor = await Vendor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });

        if (req.body.verified === true && !oldVendor.verified) {
            sendPushNotification({
                title: 'New Verified Nursery! 🏠',
                body: `${vendor.name} is now a Verified VanaMap Partner in ${vendor.city || 'your area'}. Visit them today!`,
                url: '/nearby',
                icon: '/logo.png'
            });
        }

        // Detect Inventory/Price Updates
        if (req.body.inventory && oldVendor) {
            // Check for new or changed items
            // Simple check: if inventory length changed or prices changed
            // For robustness, let's just log "Inventory Updated"
            // But user wants "Price Details Added... with vendor name shop name and price"
            // We can iterate to find diffs, or just log the event.
            // Let's try to extract the last modified item if possible, or just generic message.

            // Since "save" on frontend sends whole array, finding the exact change is complex without diffing.
            // We'll create a generic "Price/Inventory Update" notification for now, or maybe the last item?
            // User wants "every price saved should be alerted".
            // We'll assume the update implies activity.

            await Notification.create({
                type: 'price',
                message: `Price/Inventory updated for ${vendor.name}`,
                details: { vendorId: vendor.id, location: vendor.address },
                read: false
            });
        }

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


// --- USER ROUTES ---
app.get('/api/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// --- SUPPORT ---
app.post('/api/support/inquiry', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const targetEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER; // Send to admin

        const mailOptions = {
            from: `"VanaMap Contact" <${process.env.EMAIL_USER}>`,
            to: targetEmail,
            replyTo: email,
            subject: `New Inquiry from ${name}: VanaMap`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #10b981;">New Inquiry Received</h2>
                    <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; color: #334155;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p style="margin-top:20px; font-size: 12px; color: #94a3b8;">
                        Reply directly to this email to respond to the user.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Inquiry received from ${email}`);
        res.json({ success: true, message: 'Inquiry sent successfully' });
    } catch (err) {
        console.error("Inquiry Mail Error:", err);
        res.status(500).json({ error: 'Failed to send inquiry' });
    }
});

// --- AUTH ---

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, role, country, city, state } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User exists" });

        const user = new User({ email, password, name, role, country, city, state });
        await user.save();

        await Notification.create({
            type: 'user',
            message: `New user registered: ${name} (${role})`,
            details: { email, role },
            read: false
        });

        // Send Welcome Email
        sendWelcomeEmail(email, name, role);

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
            // Check admin recovery via Environment Variables
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
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
        if (index === -1) {
            user.favorites.push(plantId);
            user.points = (user.points || 0) + 10;
        } else {
            user.favorites.splice(index, 1);
            user.points = Math.max(0, (user.points || 0) - 10);
        }
        await user.save();
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const currentCartCount = user.cart.length;
        user.cart = req.body.cart.map(item => ({
            plantId: item.plantId || item.plant?.id,
            quantity: item.quantity,
            vendorId: item.vendorId,
            vendorPrice: item.vendorPrice
        }));

        // Award points if cart size increased (new plants added)
        if (user.cart.length > currentCartCount) {
            user.points = (user.points || 0) + (user.cart.length - currentCartCount) * 50;
        }

        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/change-password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(401).json({ error: "Incorrect old password" });

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
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
            sendWelcomeEmail(email, name);
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



app.delete('/api/users/:id', auth, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/reset-user-password', auth, admin, async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.password = newPassword || '123456';
        await user.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/users/:id/points', auth, admin, async (req, res) => {
    try {
        const { points } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.points = points;
        await user.save();
        res.json({ success: true, points: user.points });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/init-emergency', async (req, res) => {
    // Only allow if no admin exists or with a secret key
    const secret = req.query.secret;
    if (secret !== process.env.EMERGENCY_SECRET && process.env.NODE_ENV === 'production') {
        return res.status(403).send('Unauthorized');
    }
    const email = process.env.ADMIN_EMAIL || 'admin@plantai.com';
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ email, password: process.env.ADMIN_PASS, name: 'Vana Map', role: 'admin' });
    } else {
        user.password = process.env.ADMIN_PASS;
        user.role = 'admin';
        user.name = 'Vana Map';
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

app.post('/api/auth/reset-password-verify', async (req, res) => {
    try {
        const { email, name, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Account not found." });
        }

        // Verify "username as before"
        if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
            return res.status(400).json({ error: "Verification failed: Name does not match our records." });
        }

        user.password = newPassword;
        user.resetRequest = { requested: false, approved: true, requestDate: new Date() };
        await user.save();

        // Notify Admin via Notification system
        const notif = new Notification({
            type: 'security',
            message: `User ${user.name} (${user.email}) changed password via verified reset.`,
            details: { userId: user._id, email: user.email }
        });
        await notif.save();

        res.json({ success: true, message: "Password updated successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/nudge-admin', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        // No automatic reset here, admin will do it manually.

        const notif = new Notification({
            type: 'help',
            message: `User with email ${email || 'Anonymous'} is requesting help (Forgot Username or Access). Manual password reset requested.`,
            details: { email, userId: user ? user._id : null }
        });
        await notif.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
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

// Global Error Handlers to prevent crash
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥', err);
    // Keep alive if possible, or exit cleanly
});
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err);
});

app.get('/debug-env', (req, res) => {
    // SECURITY: Do not expose full values in prod, just presence
    res.json({
        MONGO_URI_SET: !!process.env.MONGO_URI,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        MONGO_STATUS: mongoose.connection.readyState // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
