require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Plant, Vendor, User, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket } = require('./models');
const Razorpay = require('razorpay');
const webpush = require('web-push');
const helmet = require('helmet');
const compression = require('compression'); // Performance: Gzip/Brotli
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const cron = require('node-cron');
const Parser = require('rss-parser');
const parser = new Parser();

// --- AUTOMATED PREMIUM CHECK (Daily at Midnight) ---
cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Checking for expired premium subscriptions...');
    try {
        const now = new Date();
        const expiredUsers = await User.find({
            isPremium: true,
            premiumExpiry: { $lt: now }
        });

        if (expiredUsers.length > 0) {
            console.log(`[CRON] Found ${expiredUsers.length} expired users.`);

            for (const user of expiredUsers) {
                user.isPremium = false;
                user.premiumType = 'none';
                await user.save();

                // Notification
                await broadcastAlert('premium_expired', `Your Premium Access has expired.`, {
                    userId: user._id,
                    title: "Subscription Ended ⏳",
                    body: "Your premium benefits have ended. Renew now for just ₹10/mo to keep accessing Heaven!"
                });

                // Specific push for "last day" or expiry moment
                sendPushNotification({
                    title: "Premium Expired 🔴",
                    body: "Your premium access ended today. Please renew to continue using features.",
                    url: "/premium",
                    icon: "/logo.png"
                });
            }
        }
    } catch (e) {
        console.error("[CRON] Error checking expiry:", e);
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 1 minute
    greetingTimeout: 30000,
    socketTimeout: 60000,
    pool: false, // Disable pooling for more consistent per-request connections
    logger: true,
    debug: true
});

// Verify connection configuration
// Verify connection configuration - DISABLED to prevent startup hang/crash on timeout
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("SMTP Connection Error:", error.message);
//     } else {
//         console.log("SMTP Server is ready to take our messages");
//     }
// });

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
let publicVapidKey = process.env.PUBLIC_VAPID_KEY;
let privateVapidKey = process.env.PRIVATE_VAPID_KEY;

let pushEnabled = false;

const initializePush = () => {
    if (!publicVapidKey || !privateVapidKey) {
        console.warn("VAPID Keys not found. Generating temporary keys...");
        const keys = webpush.generateVAPIDKeys();
        publicVapidKey = keys.publicKey;
        privateVapidKey = keys.privateKey;
        console.log("-----------------------------------------");
        console.log("NEW VAPID KEYS GENERATED (Save to .env):");
        console.log("PUBLIC_VAPID_KEY=" + publicVapidKey);
        console.log("PRIVATE_VAPID_KEY=" + privateVapidKey);
        console.log("-----------------------------------------");
    }

    try {
        webpush.setVapidDetails('mailto:support@vanamap.online', publicVapidKey, privateVapidKey);
        pushEnabled = true;
        console.log("Web Push initialized successfully.");
    } catch (err) {
        console.error("Web Push init failed:", err.message);
    }
};

initializePush();

const sendPushNotification = async (payload) => {
    if (!pushEnabled) {
        console.log("Skipping push notification (Push Disabled/No Keys)");
        return;
    }

    try {
        const subscriptions = await PushSubscription.find().lean();
        if (subscriptions.length === 0) return;

        console.log(`[PUSH] Dispatched to ${subscriptions.length} devices...`);
        const notificationPayload = JSON.stringify(payload);

        // Process in batches of 50 to avoid memory/rate limit issues
        const batchSize = 50;
        let sentCount = 0;
        let deadCount = 0;

        for (let i = 0; i < subscriptions.length; i += batchSize) {
            const batch = subscriptions.slice(i, i + batchSize);
            await Promise.all(batch.map(async (sub) => {
                try {
                    await webpush.sendNotification(sub, notificationPayload);
                    sentCount++;
                } catch (err) {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        deadCount++;
                        await PushSubscription.deleteOne({ _id: sub._id }).catch(() => { });
                    } else {
                        console.error(`[PUSH] Delivery error (${err.statusCode}): ${err.message}`);
                    }
                }
            }));
        }

        if (deadCount > 0) console.log(`[PUSH] Cleaned up ${deadCount} expired subscriptions.`);
        console.log(`[PUSH] Successfully reached ${sentCount} devices.`);
    } catch (e) {
        console.error("[PUSH] Critical processing error:", e.message);
    }
};

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'vanamap_super_secret_key_2025';

// Security & Performance
app.set('trust proxy', 1); // Required for Render/Heroku to get real client IP and satisfy express-rate-limit validation
app.use(compression()); // Compress all responses
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
})); // Set security HTTP headers
app.use(express.json({ limit: '50mb' })); // Body parser
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast if no connection
        });
        console.log('MongoDB Connected');

        // Auto-seed database if empty
        const plantCount = await Plant.countDocuments();
        console.log(`📊 Current database: ${plantCount} plants`);

        if (plantCount === 0) {
            console.log('🌱 Database is empty. Auto-seeding from plant-data.js...');
            try {
                const { indoorPlants, outdoorPlants } = require('./plant-data');
                const allPlants = [...indoorPlants, ...outdoorPlants];

                const ops = allPlants.map(plant => ({
                    updateOne: {
                        filter: { id: plant.id },
                        update: { $set: plant },
                        upsert: true
                    }
                }));

                const result = await Plant.bulkWrite(ops);
                console.log(`✅ Auto-seeded ${result.upsertedCount} plants successfully!`);
            } catch (seedErr) {
                console.error('❌ Auto-seed failed:', seedErr.message);
            }
        } else {
            console.log('✅ Database already populated');
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Do not exit process, let server run to serve /health
    }
};
connectDB();



// --- HELPER: Unified Alert System ---
const broadcastAlert = async (type, message, details = {}, url = '/') => {
    try {
        // 1. Create DB Notification for Dashboard Tracking
        await Notification.create({ type, message, details, read: false });

        // 2. Dispatch Web Push to all active subscribers (unless explicitly skipped)
        if (!details.skipPush) {
            const pushPayload = {
                title: details.title || `VanaMap ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                body: message,
                url,
                icon: '/logo.png'
            };
            await sendPushNotification(pushPayload);
        }

        console.log(`[ALERT] Alert dispatched: ${type} (Push: ${!details.skipPush})`);
    } catch (err) {
        console.error(`[ALERT] Failed to broadcast ${type}:`, err.message);
    }
};

const sendWhatsApp = async (msg, type, details = {}) => {
    console.log(`[PUSH REPLACED WHATSAPP] ${type}: ${msg}`);
    await broadcastAlert(type, msg, details);
};

app.get('/api/notifications/vapid-key', (req, res) => {
    if (!publicVapidKey) return res.status(404).json({ error: "Push keys not configured" });
    res.json({ publicKey: publicVapidKey });
});

app.post('/api/notifications/subscribe', async (req, res) => {
    try {
        const subscription = req.body;
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: "Invalid subscription" });
        }
        // Simple upsert based on endpoint
        await PushSubscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            subscription,
            { upsert: true, new: true }
        );

        // Immediate confirmation push
        await sendPushNotification({
            title: 'Cloud Alerts Enabled! ☁️',
            body: 'You will now receive real-time updates from VanaMap.',
            url: '/',
            icon: '/logo.png'
        });

        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Subscription Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- PAYMENT INTEGRATION ---
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    } else {
        console.warn("Razorpay Keys missing in environment. Payment features will be disabled.");
    }
} catch (e) {
    console.error("Razorpay Init Error:", e.message);
}

// Create Order
app.post('/api/payments/create-order', auth, async (req, res) => {
    try {
        const options = {
            amount: 1000, // amount in the smallest currency unit (10 INR) for testing or as per prompt "10rs per month" -> 1000 paise? prompt says "10rs per month". So 10 * 100 = 1000 paise.
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        // If user wants free trial (Jan 1-31 2026 prompt mentions free purchase), the frontend should handle "Free" logic or we create a 0 amount order? Razorpay doesn't support 0 order for normal flows usually without subscription. 
        // Prompt says: "premium is now free purchase by for 2026 jan 1 -31".
        // Use a flag for free purchase or just bypass payment if frontend detects date/promo.
        // For now, let's support standard payment flow. logic for Amount will be handled here.

        // Check promo
        const now = new Date();
        const promoStart = new Date('2026-01-01');
        const promoEnd = new Date('2026-01-31');

        // User prompt says "now free purchase by for 2026 jan 1 -31 after that you should pay 10rs". 
        // Interpreting "now free purchase... for 2026...". Maybe "It is free now". 
        // If Free, we don't need Razorpay order. The frontend calls 'activate-free-premium'.
        // But if we need Razorpay for PAID flow:

        if (!razorpay) {
            return res.status(503).json({ error: "Payment gateway not configured" });
        }

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Verify Payment
app.post('/api/payments/verify', auth, async (req, res) => {
    try {
        const { orderId, paymentId, signature, planType } = req.body;
        const crypto = require('crypto');

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({ error: "Server configuration missing (Payment)" });
        }

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest('hex');

        if (generated_signature === signature) {
            // Payment Successful
            const user = await User.findById(req.user.id);
            user.isPremium = true;
            user.premiumType = planType || 'monthly';
            user.lastPurchaseDate = new Date();
            user.premiumStartDate = new Date();
            // Valid for 1 month
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + 1);
            user.premiumExpiry = expiry;

            // Add Bonus Points
            user.points = (user.points || 0) + 200;

            await user.save();

            const payment = new Payment({
                userId: user.id,
                userName: user.name,
                amount: 10, // store as rupees
                currency: 'INR',
                orderId,
                paymentId,
                signature,
                status: 'paid',
                plan: planType
            });
            await payment.save();

            await broadcastAlert('premium', `User ${user.name} just upgraded to PREMIUM! 🌟`, { userId: user.id });

            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: "Signature verification failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Activate Free Premium (Promo)
app.post('/api/payments/activate-free', auth, async (req, res) => {
    try {
        // Logic: Check if promo is valid.
        // "premium is now free purchase by for 2026 jan 1 -31" -> This text is confusing.
        // Assuming user means: "Current time -> Free". "After 2026 Jan -> Pay".
        // Or "Purchase NOW FOR the period of Jan 2026".
        // Let's assume it's free to activate NOW. 

        const user = await User.findById(req.user.id);
        if (user.isPremium) return res.status(400).json({ error: "Already Premium" });

        // Enforce JAN 31, 2026 Deadline
        if (new Date() > new Date('2026-02-01')) {
            return res.status(403).json({ error: "Free Promo Ended. Premium is now ₹10/month." });
        }

        user.isPremium = true;
        user.premiumType = 'trial';
        user.premiumStartDate = new Date();
        // Sets expiry to very long or 1 month? "after that you should pay 10rs per month".
        // Maybe indefinite until 2026? Or just 1 month free? 
        // "purchase by for 2026 jan 1" -> Valid until then?
        // I will set it to 1 year for now or until 2026.
        user.premiumExpiry = new Date('2026-02-01'); // Valid until Feb 2026 start?

        // Add Bonus Points
        user.points = (user.points || 0) + 200;

        await user.save();

        const payment = new Payment({
            userId: user.id,
            userName: user.name,
            amount: 0,
            status: 'paid',
            plan: 'free_promo'
        });
        await payment.save();

        await broadcastAlert('premium', `User ${user.name} claimed FREE Premium & got 200 Chlorophyll! 🌱`, { userId: user.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Payments Management
app.get('/api/admin/payments', auth, admin, async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        const premiumUsers = await User.find({ isPremium: true }).select('name email role premiumType premiumExpiry');
        res.json({ payments, premiumUsers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Gift/Renew Premium
app.post('/api/admin/premium/renew', auth, admin, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.isPremium = true;
        user.premiumType = 'gift';
        user.premiumExpiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // 1 Year Gift
        await user.save();

        // Push Notification
        await broadcastAlert('gift', `You have been gifted 1 Year of Premium access! Enjoy! 🎁`,
            { userId: user._id, specificUserOnly: true } // Need to handle specificUserOnly in broadcast if not already
        );
        // Also simpler: Create a specific notification for this user
        await Notification.create({
            type: 'user',
            message: "Admin renewed your Premium status as a gift! Enjoy the full experience.",
            details: { userId: user._id },
            read: false
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        await broadcastAlert('system', `User ${user.name} earned ${pointsToAward} points for starting a purchase.`, { userId: user._id, points: pointsToAward });

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
        await broadcastAlert('vendor_contact', msg, { vendorId, userEmail, contactType, skipPush: true });
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
        await broadcastAlert('ai_chat', `AI responded to user ${userId}'s query.`, { userId, message, response: response.substring(0, 50) + '...' });
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

        await broadcastAlert('suggestion', `New plant suggestion: ${plantName} by ${userName}`, { plantName, userId });

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

        await broadcastAlert('discovery', `${plant.name} has been added to our global database. Check it out!`, { plantId: plant.id, title: 'New Plant Discovered! 🌿' }, '/#plant-grid');

        res.json({ success: true, plant });
    } catch (e) {
        console.error("SEED SINGLE ERROR:", e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/seed-plants', auth, admin, async (req, res) => {
    try {
        const { type } = req.body; // 'indoor' | 'outdoor' | null
        console.log(`SEED: Starting Smart Deployment (${type || 'ALL'})...`);

        // Fresh import to get latest generated data
        delete require.cache[require.resolve('./plant-data')];
        const { indoorPlants, outdoorPlants } = require('./plant-data');

        let targetPlants = [];
        if (type === 'indoor') targetPlants = indoorPlants;
        else if (type === 'outdoor') targetPlants = outdoorPlants;
        else targetPlants = [...indoorPlants, ...outdoorPlants];

        let stats = { added: 0, skipped: 0 };

        for (const plant of targetPlants) {
            // Check for existence by Scientific Name (Scientific Truth)
            const exists = await Plant.exists({ scientificName: plant.scientificName });

            if (exists) {
                stats.skipped++;
                continue;
            }

            // If not found, deploy it
            await Plant.updateOne(
                { id: plant.id },
                { $set: plant },
                { upsert: true }
            );
            stats.added++;
        }

        console.log(`SEED: Deployment Complete. Added ${stats.added}, Skipped ${stats.skipped} (Already Live).`);

        if (stats.added > 0) {
            await broadcastAlert('plant', `${stats.added} new plants have been added to our collection!`, { count: stats.added, title: 'Library Update 📚' }, '/#plant-grid');
        }

        res.json({ success: true, ...stats, total: targetPlants.length });
    } catch (err) {
        console.error("SEED Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- SYSTEM SETTINGS (PREMIUM PAGES) ---
app.get('/api/admin/settings/restricted-pages', auth, admin, async (req, res) => {
    try {
        const setting = await SystemSettings.findOne({ key: 'restricted_pages' });
        res.json({ pages: setting?.value || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/settings/restricted-pages', auth, admin, async (req, res) => {
    try {
        const { pages } = req.body; // Array of strings e.g. ['/heaven', '/shops']
        await SystemSettings.findOneAndUpdate(
            { key: 'restricted_pages' },
            { value: pages, description: 'List of pages requiring Premium' },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if a page is restricted (Public/User endpoint)
app.get('/api/system/is-restricted', async (req, res) => {
    try {
        const { path } = req.query;
        const setting = await SystemSettings.findOne({ key: 'restricted_pages' });
        const restrictedList = setting?.value || [];
        const isRestricted = restrictedList.includes(path);
        res.json({ isRestricted });
    } catch (err) {
        res.json({ isRestricted: false }); // Default open if error
    }
});

// --- DYNAMIC SEED BANK MANAGEMENT (EDIT/DELETE) ---
const fs = require('fs');
const path = require('path');

const updatePlantDataFile = (indoor, outdoor) => {
    const content = `// MASTER PLANT DATA (Generated & Updated via Admin)
const indoorPlants = ${JSON.stringify(indoor, null, 4)};
const outdoorPlants = ${JSON.stringify(outdoor, null, 4)};

module.exports = { indoorPlants, outdoorPlants };
`;
    fs.writeFileSync(path.join(__dirname, 'plant-data.js'), content);
    // Clear cache so next read gets new data
    delete require.cache[require.resolve('./plant-data')];
};

app.patch('/api/admin/seed-bank/:id/toggle-type', auth, admin, (req, res) => {
    try {
        delete require.cache[require.resolve('./plant-data')];
        let { indoorPlants, outdoorPlants } = require('./plant-data');
        const { id } = req.params;

        // Try find in indoor
        let plant = indoorPlants.find(p => p.id === id);
        let fromList = 'indoor';

        if (!plant) {
            plant = outdoorPlants.find(p => p.id === id);
            fromList = 'outdoor';
        }

        if (!plant) return res.status(404).json({ error: "Plant not found in Seed Bank" });

        // Remove from current list
        if (fromList === 'indoor') {
            indoorPlants = indoorPlants.filter(p => p.id !== id);
            // Modify plant
            plant.type = 'outdoor';
            // Optionally update ID prefix if strictly following convention, but let's keep ID stable for tracking
            // plant.id = plant.id.replace('p_in_', 'p_out_'); 
            outdoorPlants.push(plant);
        } else {
            outdoorPlants = outdoorPlants.filter(p => p.id !== id);
            plant.type = 'indoor';
            indoorPlants.push(plant);
        }

        updatePlantDataFile(indoorPlants, outdoorPlants);
        res.json({ success: true, indoor: indoorPlants, outdoor: outdoorPlants });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/admin/seed-bank/:id', auth, admin, (req, res) => {
    try {
        delete require.cache[require.resolve('./plant-data')];
        let { indoorPlants, outdoorPlants } = require('./plant-data');
        const { id } = req.params;

        const initialLength = indoorPlants.length + outdoorPlants.length;

        indoorPlants = indoorPlants.filter(p => p.id !== id);
        outdoorPlants = outdoorPlants.filter(p => p.id !== id);

        if (indoorPlants.length + outdoorPlants.length === initialLength) {
            return res.status(404).json({ error: "Plant not found in Seed Bank" });
        }

        updatePlantDataFile(indoorPlants, outdoorPlants);
        res.json({ success: true, indoor: indoorPlants, outdoor: outdoorPlants });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- NEWS API ---
let newsCache = { data: [], lastUpdated: 0 };
app.get('/api/news', async (req, res) => {
    const now = Date.now();
    if (newsCache.data.length > 0 && (now - newsCache.lastUpdated) < 24 * 60 * 60 * 1000) {
        return res.json(newsCache.data);
    }

    try {
        const Parser = require('rss-parser');
        const parser = new Parser();
        const FEED_URLS = [
            'https://www.sciencedaily.com/rss/plants_animals/nature.xml',
            'https://news.mongabay.com/feed/',
            'https://feeds.feedburner.com/enn/main'
        ];

        const promises = FEED_URLS.map(url => parser.parseURL(url).catch(e => null));
        const feeds = await Promise.all(promises);
        const allNews = [];

        feeds.forEach(feed => {
            if (feed && feed.items) {
                feed.items.forEach(item => {
                    allNews.push({
                        title: item.title,
                        link: item.link,
                        pubDate: new Date(item.pubDate),
                        source: feed.title || 'Nature News',
                        snippet: item.contentSnippet || item.content || ''
                    });
                });
            }
        });

        // specific filtering for nature/plants
        const keywords = ['plant', 'tree', 'forest', 'garden', 'flower', 'nature', 'species', 'conservation', 'climate'];
        const filteredNews = allNews.filter(item => {
            const text = (item.title + ' ' + item.snippet).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        // Sort by date and take top 10
        filteredNews.sort((a, b) => b.pubDate - a.pubDate);
        const topNews = filteredNews.slice(0, 10);

        newsCache = {
            data: topNews,
            lastUpdated: now
        };

        res.json(topNews);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
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

        await broadcastAlert('plant', `New plant added: ${plant.name}`, { plantId: plant.id }, `/#plant-${plant.id}`);
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

        await broadcastAlert('vendor', `New vendor joined: ${newVendor.name}`, { vendorId: newVendor.id, title: 'New Store Opening! 🏪' }, '/nearby');
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

            await broadcastAlert('price', `Price/Inventory updated for ${vendor.name}`, { vendorId: vendor.id, location: vendor.address, title: 'Price Hack! 📉' });
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
        await broadcastAlert('support', `New Inquiry from ${name}`, { email, title: 'Inquiry Received 📩' });
        res.json({ success: true, message: 'Inquiry sent successfully' });
    } catch (err) {
        console.error("Inquiry Mail Error:", err);
        res.status(500).json({ error: 'Failed to send inquiry' });
    }
});
// --- AUTH ---

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, phone, password, name, role, country, city, state } = req.body;

        const existing = await User.findOne({
            $or: [
                { email: email ? email.trim().toLowerCase() : undefined },
                { phone: phone ? phone.trim() : undefined }
            ]
        });
        if (existing) return res.status(400).json({ error: "Email or Phone already registered" });

        const captcha = svgCaptcha.create({
            size: 4,
            noise: 4,
            color: true,
            background: '#ffffff',
            charPreset: '0123456789'
        });

        // Store registration data in a temporary token (valid for 15m)
        const registrationData = {
            email: email ? email.trim().toLowerCase() : undefined,
            phone: phone ? phone.trim() : undefined,
            password,
            name,
            role,
            country,
            city,
            state,
            captchaText: captcha.text
        };

        const registrationToken = jwt.sign(registrationData, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        console.log(`[AUTH] Numeric Captcha (4-digit) generated: ${captcha.text}`);

        res.status(200).json({
            message: "Verify captcha to complete registration.",
            registrationToken,
            captchaSvg: captcha.data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/resend-otp', async (req, res) => {
    try {
        const { registrationToken } = req.body;
        if (!registrationToken) return res.status(400).json({ error: "Missing registration session" });

        const decoded = jwt.verify(registrationToken, process.env.JWT_SECRET || 'secret');

        const captcha = svgCaptcha.create({
            size: 4,
            noise: 4,
            color: true,
            background: '#ffffff',
            charPreset: '0123456789'
        });

        const newRegistrationData = { ...decoded, captchaText: captcha.text };
        const newToken = jwt.sign(newRegistrationData, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        res.json({
            success: true,
            message: "New code generated!",
            captchaSvg: captcha.data,
            registrationToken: newToken
        });
    } catch (err) {
        res.status(401).json({ error: "Verification session expired. Please sign up again." });
    }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { registrationToken, otp } = req.body;
        if (!registrationToken) return res.status(400).json({ error: "Missing registration session" });

        const data = jwt.verify(registrationToken, process.env.JWT_SECRET || 'secret');

        if (data.captchaText !== otp) {
            return res.status(400).json({ error: "Invalid characters typed. Try again." });
        }

        // Now save the user to database
        const user = new User({
            email: data.email,
            phone: data.phone,
            password: data.password, // Schema hook will hash it if configured
            name: data.name,
            role: data.role,
            country: data.country,
            city: data.city,
            state: data.state,
            verified: true
        });
        await user.save();

        console.log(`[AUTH] User created AFTER verification: ${user.email || user.phone}`);

        sendWelcomeEmail(user.email, user.name, user.role);

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: normalizeUser(user), token, message: "Verification Successful!" });
    } catch (err) {
        res.status(401).json({ error: "Session expired or invalid. Please sign up again." });
    }
});

app.post('/api/auth/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const iden = email.trim().toLowerCase();

        if (iden === 'admin@plantai.com') {
            return res.json({ success: true, verified: true, role: 'admin', name: 'Master Admin' });
        }

        const user = await User.findOne({
            $or: [
                { email: iden },
                { phone: iden }
            ]
        });
        if (!user) {
            return res.status(404).json({ error: "Access Denied: Account not found." });
        }
        if (!user.verified) {
            return res.status(403).json({ error: "Account found, but not yet verified via WhatsApp/Gmail." });
        }
        res.json({ success: true, verified: true, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const identifier = email.trim().toLowerCase();

        console.log(`[AUTH] Login attempt for: ${identifier}`);

        // Admin login fallback with environment credentials
        if (identifier === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            console.log(`[AUTH] Login success: ${identifier} (admin)`);
            return res.json({
                user: { name: 'Master Admin', email: identifier, role: 'admin', favorites: [], cart: [] },
                token: jwt.sign({ email: identifier, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
            });
        }

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });

        if (!user) return res.status(401).json({ error: "Account not found in ecosystem" });

        // Master Admin always bypasses verification check
        if (identifier === 'admin@plantai.com') {
            user.verified = true;
        }

        if (!user.verified) return res.status(401).json({ error: "Please verify captcha first" });

        // Secure password check using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

        console.log(`[AUTH] Login success: ${identifier} (${user.role})`);
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

app.patch('/api/user/game-progress', auth, async (req, res) => {
    try {
        const { level, points } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (level && level > (user.gameLevel || 1)) user.gameLevel = level;
        if (points && points > (user.gamePoints || 0)) user.gamePoints = points;

        await user.save();
        res.json({ success: true, level: user.gameLevel, gamePoints: user.gamePoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/add-points', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.points = (user.points || 0) + (amount || 0);
        await user.save();
        res.json({ success: true, points: user.points });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/designs', auth, admin, async (req, res) => {
    try {

        const usersWithDesigns = await User.find({ "designs.0": { $exists: true } })
            .select('name email designs')
            .lean();

        res.json(usersWithDesigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/designs', auth, async (req, res) => {
    try {
        const { imageUrl, shape, size } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.designs) user.designs = [];

        user.designs.push({
            id: 'pot_' + Date.now(),
            imageUrl,
            shape,
            size,
            createdAt: new Date()
        });

        await user.save();
        res.json({ success: true, designs: user.designs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .sort({ points: -1 })
            .limit(50)
            .select('name city points gameLevel gamePoints');

        const cities = await User.aggregate([
            { $match: { city: { $exists: true, $ne: null } } },
            { $group: { _id: { city: "$city" }, totalPoints: { $sum: "$points" }, userCount: { $sum: 1 } } },
            { $sort: { totalPoints: -1 } },
            { $limit: 10 }
        ]);

        res.json({ users, cities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/users/:id/gift-premium', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const now = new Date();
        const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1));

        user.isPremium = true;
        user.premiumType = 'gift';
        user.premiumStartDate = new Date();
        user.premiumExpiry = oneYearFromNow;

        await user.save();

        // Log the action (optional but good for tracking)
        console.log(`Admin gifted premium to user ${user.email}`);

        res.json({ success: true, user });
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

        const resetPass = newPassword || Math.random().toString(36).slice(-8).toUpperCase();
        user.password = resetPass;
        await user.save();

        // Fix: Actually send the email to the user
        sendResetEmail(user.email, resetPass);

        res.json({ success: true, message: `Password reset and sent to ${user.email}` });
    } catch (e) {
        console.error("Admin Password Reset Error:", e);
        res.status(500).json({ error: e.message });
    }
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

        // Notify Admin via Unified system
        await broadcastAlert('security', `User ${user.name} (${user.email}) changed password via verified reset.`, { userId: user._id, email: user.email, title: 'Security Update 🛡️' });

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

        await broadcastAlert('help', `User with email ${email || 'Anonymous'} is requesting help (Forgot Username or Access). Manual password reset requested.`, { email, userId: user ? user._id : null, title: 'Support Request 🆘' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});



// --- Password Reset Request ---
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

// --- SYSTEM SETTINGS ---
app.get('/api/settings/:key', async (req, res) => {
    try {
        const setting = await SystemSettings.findOne({ key: req.params.key });
        if (!setting) {
            // Default values for common settings
            if (req.params.key === 'pot_save_on_buy') return res.json({ key: 'pot_save_on_buy', value: true });
            return res.status(404).json({ error: "Setting not found" });
        }
        res.json(setting);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/settings', auth, admin, async (req, res) => {
    try {
        const { key, value } = req.body;

        let setting = await SystemSettings.findOne({ key });
        if (!setting) {
            setting = new SystemSettings({ key, value });
        } else {
            setting.value = value;
        }

        await setting.save();
        res.json({ success: true, setting });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- ADMIN SEED ROUTE (SYSTEM FIX) ---
app.post('/api/admin/seed-real-data', async (req, res) => {
    try {
        console.log("Creating/Updating Real Plant Data...");
        const { indoorPlants, outdoorPlants } = require('./plant-data');
        const allPlants = [...indoorPlants, ...outdoorPlants];

        let count = 0;
        for (const plant of allPlants) {
            await Plant.updateOne(
                { id: plant.id },
                { $set: plant },
                { upsert: true }
            );
            count++;
        }
        console.log(`Successfully updated ${count} plants with REAL data.`);
        res.json({ success: true, message: `Updated ${count} plants with real descriptions, medicinal values, and advantages.` });
    } catch (e) {
        console.error("Seed Error:", e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/custom-pots', auth, async (req, res) => {
    try {
        const { potColor, potWithDesignUrl, rawDesignUrl, decalProps } = req.body;

        // Log payload size for debugging
        const payloadStr = JSON.stringify(req.body || {});
        const sizeKB = Math.round(payloadStr.length / 1024);
        console.log(`[STUDIO] Received new design. Size: ${sizeKB}KB. UserID: ${req.user?.id}`);

        const user = await User.findById(req.user?.id);
        if (!user) {
            console.error(`[STUDIO] Save failed: User ${req.user?.id} not found in DB.`);
            return res.status(401).json({ error: "User session invalid. Please log in again." });
        }

        const customPot = new CustomPot({
            userId: user._id.toString(),
            userName: user.name || "Unknown User",
            userEmail: user.email || "No Email",
            potColor: potColor || "#d97706",
            potWithDesignUrl: potWithDesignUrl || '',
            rawDesignUrl: rawDesignUrl || '',
            decalProps: decalProps || {}
        });

        await customPot.save();
        console.log(`[STUDIO] Design saved successfully for ${user.name}`);

        broadcastAlert('custom_pot', `New Ceramic Design by ${user.name}`, {
            userId: user._id,
            potColor,
            title: "New Pot Artwork! 🏺",
            skipPush: true
        }).catch((e) => console.error("[STUDIO] Alert Broadcast Failed:", e.message));

        res.status(201).json({ success: true, message: "Custom design saved to collection!", design: customPot });
    } catch (err) {
        console.error("Custom Pot Save Error Details:", err);
        res.status(500).json({ error: "Studio Engine Error: " + err.message });
    }
});

app.get('/api/custom-pots/my', auth, async (req, res) => {
    try {
        const pots = await CustomPot.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(pots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/custom-pots', auth, admin, async (req, res) => {
    try {
        const pots = await CustomPot.find().sort({ createdAt: -1 });
        res.json(pots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/custom-pots/:id', auth, admin, async (req, res) => {
    try {
        const result = await CustomPot.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: "Design not found" });
        res.json({ success: true, message: "Design removed from repository" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEWS API ENDPOINT ---
app.get('/api/news', async (req, res) => {
    try {
        // Fetch from Google News RSS for reliable, free, real-time data
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=botany+plants+environment+science+nature&hl=en-US&gl=US&ceid=US:en');

        const newsItems = feed.items.map((item, index) => {
            const placeholders = [
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                "https://images.unsplash.com/photo-1501854140884-074bf6b24363?w=800&q=80",
                "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
                "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80"
            ];

            // Try to find an image in content content:encoded if possible, else random
            // Google RSS content snippet is usually HTML-escaped description

            return {
                id: index,
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.contentSnippet || item.content,
                source: item.source || "Google News",
                image: placeholders[index % placeholders.length]
            };
        });

        res.json(newsItems.slice(0, 15));
    } catch (error) {
        console.error("News Fetch Error:", error);
        // Fallback fake news if RSS fails (e.g. rate limit)
        res.json([
            { id: 1, title: 'Server connectivity issue: Showing cached data', pubDate: new Date(), image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80", content: "We couldn't reach the live news server. Please try again later." }
        ]);
    }
});

app.get('/', (req, res) => res.send('VanaMap API v3.0 - Full Power Simulation Active'));

// 1. User Submit Ticket
app.post('/api/support', auth, async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) return res.status(400).json({ error: "Missing fields" });

        const ticket = new SupportTicket({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            subject,
            message
        });
        await ticket.save();

        res.json({ success: true, message: "Ticket created" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Admin Get All Tickets
app.get('/api/admin/support', auth, admin, async (req, res) => {
    try {
        const tickets = await SupportTicket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Admin Reply to Ticket
app.post('/api/admin/support/:id/reply', auth, admin, async (req, res) => {
    try {
        const { message } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        ticket.adminReply = message;
        ticket.repliedAt = new Date();
        ticket.status = 'resolved';
        await ticket.save();

        // Notify User
        await broadcastAlert('support_reply', 'Admin responded to your inquiry', {
            userId: ticket.userId,
            title: 'Support Response 🔔',
            body: `Admin: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`
        });

        res.json({ success: true, message: "Reply sent" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 4. Admin Broadcast Message (Manual)
app.post('/api/admin/broadcast', auth, admin, async (req, res) => {
    try {
        const { type, targetId, title, message } = req.body; // type: 'all', 'vendor', 'user', 'specific'

        // Use existing broadcastAlert function logic but generalized
        // If specific targetId is provided, notify just them
        // If type is all/vendor/user, we iterate and notify

        if (type === 'specific' && targetId) {
            await broadcastAlert('admin_msg', 'Admin Message', {
                userId: targetId,
                title: title || 'System Update',
                body: message
            });
        } else {
            // For mass broadcast, efficient logic would be needed. 
            // For now, we assume this is low volume usage or handled by socket broadcast in future.
            // We'll create a generic notification type that the frontend polls for? 
            // Actually, existing broadcastAlert saves to DB for specific users. 
            // MassDB insertion for thousands of users is heavy. 
            // Instead, we might create a 'SystemAnnouncement' model later.
            // But for now, let's just support 'specific' user messaging via UI as requested "sepratly".
            return res.status(400).json({ error: "Mass broadcast not fully implemented in this version. Use specific user targeting." });
        }

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- AI DOCTOR ENDPOINT (Using FREE Groq API) ---
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        // Groq API Key (FREE - Get from https://console.groq.com)
        // If not set, use a public demo key (limited but works for testing)
        const apiKey = process.env.GROQ_API_KEY || 'YOUR_FREE_GROQ_KEY_HERE';

        console.log('[AI Doctor] Processing chat request...');

        // Using Groq's FREE API with Llama 3.1 70B
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile", // FREE powerful model
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 1,
                stream: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", data);

            // Fallback to local AI if Groq fails
            if (data.error?.message?.includes('rate_limit') || data.error?.message?.includes('quota')) {
                console.log('[AI Doctor] Rate limit hit, using fallback response...');
                return res.json({
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: generateFallbackResponse(messages[messages.length - 1]?.content || '')
                        }
                    }]
                });
            }

            return res.status(response.status).json(data);
        }

        console.log('[AI Doctor] Response generated successfully');
        res.json(data);
    } catch (e) {
        console.error("Chat API Error:", e);

        // Fallback response on network error
        const userMessage = req.body.messages?.[req.body.messages.length - 1]?.content || '';
        res.json({
            choices: [{
                message: {
                    role: 'assistant',
                    content: generateFallbackResponse(userMessage)
                }
            }]
        });
    }
});

// Fallback AI response generator (rule-based)
function generateFallbackResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();

    // Plant care keywords
    if (lowerMsg.includes('water')) {
        return "🌿 **Watering Tips:**\n\nMost plants prefer consistent watering schedules. Here's what I recommend:\n\n💧 **General Rule:** Water when the top 2-3 inches of soil feel dry\n\n**Signs of Overwatering:**\n- Yellow leaves\n- Mushy stems\n- Moldy soil\n\n**Signs of Underwatering:**\n- Drooping leaves\n- Dry, crispy edges\n- Soil pulling away from pot\n\n💡 **Pro Tip:** It's better to underwater than overwater. Most plants can recover from drought stress, but root rot is often fatal.\n\nWhat specific plant are you caring for? I can give more tailored advice!";
    }

    if (lowerMsg.includes('light') || lowerMsg.includes('sun')) {
        return "☀️ **Light Requirements:**\n\nLight is crucial for plant health! Here's a quick guide:\n\n**Bright Direct Light:**\n- Succulents, cacti, citrus trees\n- 6+ hours of direct sun\n\n**Bright Indirect Light:**\n- Monstera, pothos, snake plants\n- Near windows but not direct rays\n\n**Low Light:**\n- ZZ plant, peace lily, cast iron plant\n- Can survive in dim corners\n\n💡 **Signs of Too Much Light:**\n- Scorched, brown leaves\n- Faded colors\n\n💡 **Signs of Too Little Light:**\n- Leggy, stretched growth\n- Small, pale leaves\n\nWhat's your lighting situation like?";
    }

    if (lowerMsg.includes('yellow') || lowerMsg.includes('brown')) {
        return "⚠️ **Leaf Discoloration Diagnosis:**\n\n**Yellow Leaves:**\n1. **Overwatering** (most common)\n2. Nutrient deficiency\n3. Natural aging (lower leaves)\n\n**Brown Leaves:**\n1. **Underwatering**\n2. Low humidity\n3. Fertilizer burn\n4. Sunburn\n\n**Brown Tips:**\n- Usually indicates low humidity or chlorine in water\n- Try using filtered water\n- Mist leaves regularly\n\n🔍 **Quick Check:**\n- Feel the soil moisture\n- Check for pests under leaves\n- Assess light levels\n\nCan you describe the pattern of discoloration? That'll help me narrow it down!";
    }

    if (lowerMsg.includes('pest') || lowerMsg.includes('bug')) {
        return "🐛 **Common Plant Pests:**\n\n**Spider Mites:**\n- Tiny webs on leaves\n- Treatment: Neem oil spray\n\n**Aphids:**\n- Small green/black insects\n- Treatment: Insecticidal soap\n\n**Mealybugs:**\n- White cottony masses\n- Treatment: Rubbing alcohol on cotton swab\n\n**Fungus Gnats:**\n- Small flies in soil\n- Treatment: Let soil dry out, yellow sticky traps\n\n🛡️ **Prevention:**\n- Inspect new plants before bringing home\n- Quarantine new additions\n- Keep leaves clean\n- Ensure good air circulation\n\nWhat symptoms are you seeing?";
    }

    if (lowerMsg.includes('fertiliz') || lowerMsg.includes('feed')) {
        return "🌱 **Fertilizing Guide:**\n\n**When to Fertilize:**\n- Growing season (spring/summer): Every 2-4 weeks\n- Dormant season (fall/winter): Monthly or not at all\n\n**Types:**\n- **Liquid:** Fast-acting, easy to control\n- **Granular:** Slow-release, less frequent\n- **Organic:** Compost, worm castings\n\n**NPK Ratio:**\n- **Foliage plants:** Higher nitrogen (10-5-5)\n- **Flowering plants:** Higher phosphorus (5-10-5)\n- **All-purpose:** Balanced (10-10-10)\n\n⚠️ **Warning Signs of Over-Fertilizing:**\n- White crust on soil\n- Brown leaf tips\n- Stunted growth\n\n💡 **Pro Tip:** \"Weakly, weekly\" - Use diluted fertilizer more frequently rather than strong doses.\n\nWhat type of plant are you feeding?";
    }

    // Default response
    return `🌿 **Dr. Flora here!**\n\nI'm currently running in offline mode, but I'm still here to help!\n\nYou asked: "${userMessage}"\n\n**Common Plant Care Topics:**\n- 💧 Watering schedules\n- ☀️ Light requirements\n- 🌱 Fertilizing tips\n- 🐛 Pest control\n- ⚠️ Disease diagnosis\n- 🪴 Repotting advice\n\nCould you be more specific about what you'd like to know? For example:\n- "How often should I water my monstera?"\n- "Why are my plant's leaves turning yellow?"\n- "What's the best fertilizer for succulents?"\n\nI'm here to help your plants thrive! 🌱`;
}

// Start Server
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
