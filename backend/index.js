require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Plant, Vendor, User, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket, AIFeedback, ApiKey, NewsletterSubscriber, Sale, Review, SupportEmail } = require('./models');
const Razorpay = require('razorpay');
const webpush = require('web-push');
const helmet = require('helmet');
const compression = require('compression'); // Performance: Gzip/Brotli
const EmailTemplates = require('./email-templates'); // Professional email templates
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const cron = require('node-cron');
const Parser = require('rss-parser');
const parser = new Parser();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FloraIntelligence = require('./flora-intelligence');
const cookieParser = require('cookie-parser');
const session = require('express-session');
let MongoStore = require('connect-mongo');
if (MongoStore.default) {
    MongoStore = MongoStore.default;
}

// 🚀 PERFORMANCE: In-memory cache for frequently accessed data
const NodeCache = require('node-cache');
const cache = new NodeCache({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60, // Check for expired keys every 60 seconds
    useClones: false // Better performance, don't clone objects
});

// --- CLOUDINARY CONFIGURATION ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Auto-configure from CLOUDINARY_URL env var
if (process.env.CLOUDINARY_URL) {
    console.log('✅ Cloudinary configured');
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vanamap-plants',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

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
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    pool: false,
    logger: true,
    debug: true
});

// Log SMTP Config
console.log(`[SMTP] Provider: ${process.env.SMTP_HOST || 'smtp.gmail.com (Default)'}`);
// Verify connection configuration - DISABLED to prevent startup hang/crash on timeout
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("SMTP Connection Error:", error.message);
//     } else {
//         console.log("SMTP Server is ready to take our messages");
//     }
// });

// --- EMAIL SENDING WRAPPER (Resend > SendGrid > SMTP) ---
const app = express(); // Initialize Express App EARLY to avoid ReferenceError

// Resend Setup
let resend;
if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ [Email] Using Resend HTTP API (Primary)");
}

// SendGrid Setup (Fallback)
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ [Email] SendGrid configured (Fallback)");
}

const sendEmail = async (mailOptions) => {
    // Priority 1: Resend
    if (resend) {
        try {
            const result = await resend.emails.send({
                from: mailOptions.from || 'VanaMap <support@vanamap.online>', // Use verified domain
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            });
            console.log(`[Resend] Sent to ${mailOptions.to} (ID: ${result.data?.id})`)
                ;
            return { messageId: result.data?.id || 'resend-api' };
        } catch (error) {
            console.error('[Resend] Error:', error.message);
            console.error('[Resend] Full Error:', JSON.stringify(error, null, 2));
            console.error('[Resend] Attempted to send:', {
                from: mailOptions.from || 'VanaMap <support@vanamap.online>',
                to: mailOptions.to,
                subject: mailOptions.subject
            });
            // Fall through to SendGrid
        }
    }

    // Priority 2: SendGrid
    if (process.env.SENDGRID_API_KEY) {
        const msg = {
            to: mailOptions.to,
            from: mailOptions.from,
            subject: mailOptions.subject,
            html: mailOptions.html,
        };
        try {
            await sgMail.send(msg);
            console.log(`[SendGrid] Sent to ${mailOptions.to}`);
            return { messageId: 'sendgrid-api' };
        } catch (error) {
            console.error('[SendGrid] Error:', error.response ? error.response.body : error);
            // Fall through to SMTP
        }
    }

    // Priority 3: Gmail SMTP (Last Resort)
    return transporter.sendMail(mailOptions);
};

const sendResetEmail = async (email, tempPass) => {
    console.log(`ATTEMPTING TO SEND EMAIL TO: ${email} via ${process.env.EMAIL_USER}`);
    const mailOptions = {
        from: 'VanaMap <support@vanamap.online>',
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
        await sendEmail(mailOptions);
        console.log(`Email successfully sent to: ${email}`);
        // console.log(`Response: ${info.response}`); // Wrapper might not return info for all providers
    } catch (e) {
        console.error("CRITICAL MAIL ERROR:", e.message);
        console.error("Transporter Auth:", { user: process.env.EMAIL_USER, pass: '****' });
    }
};

// --- CommunicationOS 2.0 (The Neural Network of VanaMap) ---
// Unified messaging system for Email (Gmail), SMS (Fast2SMS), and Push

const CommunicationOS = {
    // 1. Core: Send Email
    email: async (to, subject, html) => {
        try {
            const mailOptions = {
                from: 'VanaMap <support@vanamap.online>',
                to,
                subject,
                html
            };
            await sendEmail(mailOptions); // Use the unified sendEmail wrapper (Resend > SendGrid > SMTP)
            return { success: true, provider: 'Resend' };
        } catch (e) {
            console.error('[CommOS] Email Failed:', e.message);
            return { success: false, error: e.message };
        }
    },

    // 2. Core: Send SMS (Fast2SMS Integrated)
    sms: async (phone, message) => {
        // Normalize phone: Ensure +91 or other codes are handled for Fast2SMS (requires numbers without + for some routes, or international format)
        // Fast2SMS "Bulk V2" usually expects "9999999999" for India.
        const cleanPhone = phone.replace(/\D/g, '').slice(-10); // Extract last 10 digits for India

        if (process.env.FAST2SMS_API_KEY) {
            return new Promise((resolve) => {
                const unirest = require('unirest');
                const req = unirest('POST', 'https://www.fast2sms.com/dev/bulkV2');
                req.headers({ 'authorization': process.env.FAST2SMS_API_KEY });
                req.form({
                    'message': message,
                    'language': 'english',
                    'route': 'q', // 'q' = Quick, 'p' = Promotional, 't' = Transactional
                    'numbers': cleanPhone
                });
                req.end((res) => {
                    if (res.error) {
                        console.error('[CommOS] Fast2SMS Error:', res.error);
                        resolve({ success: false, error: res.error });
                    } else {
                        console.log('[CommOS] Fast2SMS Sent:', res.body);
                        resolve({ success: true, provider: 'Fast2SMS', data: res.body });
                    }
                });
            });
        } else {
            console.log(`[CommOS] 📱 SMS Simulation to ${phone}: "${message}"`);
            return { success: true, provider: 'Simulation' };
        }
    },

    // 3. High-Level: Send OTP
    sendOTP: async (target, otp, type = 'email') => {
        if (type === 'email') {
            const html = `
                <div style="font-family: sans-serif; background: #f0fdf4; padding: 40px; text-align: center;">
                    <div style="background: white; padding: 30px; border-radius: 16px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <h2 style="color: #10b981; margin:0;">Identity Check</h2>
                        <p style="color: #64748b; margin-top: 5px;">VanaMap Security Protocol</p>
                        <div style="margin: 25px 0; background: #ecfdf5; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 32px; letter-spacing: 5px; color: #065f46; font-weight: bold;">
                            ${otp}
                        </div>
                        <p style="font-size: 12px; color: #94a3b8;">Valid for 15 minutes.</p>
                    </div>
                </div>`;
            return await CommunicationOS.email(target, '🔐 Your VanaMap Code', html);
        } else if (type === 'sms') {
            return await CommunicationOS.sms(target, `Your VanaMap verification code is: ${otp}. Do not share this.`);
        }
    },

    // 4. High-Level: Welcome Message
    sendWelcome: async (user) => {
        // Email
        const isVendor = user.role === 'vendor';
        const subject = isVendor ? 'Welcome, Partner! 🏪' : 'Welcome to the Jungle! 🌿';
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                <h1 style="color: #10b981;">Hi ${user.name}!</h1>
                <p>Welcome to <strong>VanaMap</strong>. We are thrilled to have you.</p>
                <p>Your journey to a greener planet starts now.</p>
                <a href="https://vanamap.online" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin-top: 20px;">Get Started</a>
            </div>
        `;
        await CommunicationOS.email(user.email, subject, html);

        // SMS (Optional nice touch)
        if (user.phone) {
            await CommunicationOS.sms(user.phone, `Welcome to VanaMap, ${user.name.split(' ')[0]}! 🌿 We're glad you're here.`);
        }
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'vanamap_super_secret_key_2025';

// --- MIDDLEWARES (Moved Up) ---

const auth = (req, res, next) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    // Fallback to cookie if header is missing
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

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

// --- DEVELOPER API MIDDLEWARE ---
const requireApiKey = async (req, res, next) => {
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ error: "Missing x-api-key header" });

    try {
        const apiKeyDoc = await ApiKey.findOne({ key, isActive: true });
        if (!apiKeyDoc) return res.status(403).json({ error: "Invalid or revoked API Key" });

        // Update usage stats (async, don't block)
        apiKeyDoc.lastUsed = new Date();
        apiKeyDoc.save();

        req.apiKey = apiKeyDoc; // Attach to request
        next();
    } catch (e) {
        res.status(500).json({ error: "API Validation Error" });
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
                    // 410 (Gone), 404 (Not Found), 403 (Forbidden/Invalid VAPID), 401 (Unauthorized)
                    if ([410, 404, 403, 401].includes(err.statusCode)) {
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

// Wrappers for existing code compatibility
const sendOtpEmail = (email, otp) => CommunicationOS.sendOTP(email, otp, 'email');
const sendSmsOtp = (phone, otp) => CommunicationOS.sendOTP(phone, otp, 'sms');
const sendWelcomeEmail = (email, name, role) => CommunicationOS.sendWelcome({ email, name, role, phone: null });


// --- API NOTIFICATION CONTROLLERS ---

// 1. Subscribe to Newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });

        await NewsletterSubscriber.updateOne(
            { email },
            { email, isActive: true, source: 'api' },
            { upsert: true }
        );

        // Auto-reply
        await CommunicationOS.email(email, "Subscribed! 📰", "You are now subscribed to VanaMap Weekly.");

        res.json({ success: true, message: "Subscribed successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Broadcast Newsletter (Admin)
app.post('/api/newsletter/broadcast', auth, admin, async (req, res) => {
    try {
        const { subject, body } = req.body;
        const subscribers = await NewsletterSubscriber.find({ isActive: true });

        console.log(`[Newsletter] Broadcasting to ${subscribers.length} people...`);

        // Async sending (fire and forget to avoid timeout)
        subscribers.forEach(sub => {
            CommunicationOS.email(sub.email, subject, body).catch(e => console.error(`Failed to send to ${sub.email}`));
        });

        res.json({ success: true, message: `Broadcasting to ${subscribers.length} subscribers` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Developer API: Trigger OTP (External Apps)
app.post('/api/v1/send/otp', requireApiKey, async (req, res) => {
    try {
        const { target, channel } = req.body; // channel: 'email' or 'sms'
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const result = await CommunicationOS.sendOTP(target, otp, channel || 'email');

        res.json({
            success: result.success,
            otp: otp, // Return OTP to developer so *they* can verify it in their app
            provider: result.provider
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Security & Performance
app.set('trust proxy', 1); // Required for Render/Heroku to get real client IP and satisfy express-rate-limit validation
app.use(compression()); // Compress all responses
app.use(cors({
    origin: [
        'https://www.vanamap.online',
        'https://vanamap.online',
        'https://vanamap.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
})); // Set security HTTP headers
app.use(express.json({ limit: '100mb' })); // Body parser
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'vanamap_secure_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions', // Store sessions in a separate collection
        ttl: 24 * 60 * 60, // 1 day
        autoRemove: 'native' // Auto-remove expired sessions
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));




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

app.get('/api/test-session', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Views: ${req.session.views}. Cookie expires in: ${req.session.cookie.maxAge / 1000}s`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh page!');
    }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        // Auto-Expire Check (On Page Load)
        if (user && user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
            console.log(`[AUTH] Auto-expiring premium for ${user.email}`);
            user.isPremium = false;
            user.premiumType = 'none';
            await user.save();
        }

        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // Increased to 30s for Free Tier Cold Starts
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            family: 4 // Force IPv4 to avoid pending connection issues on some networks
        });
        console.log('MongoDB Connected');

        // Auto-seed database if empty
        const plantCount = await Plant.countDocuments();
        console.log(`📊 Current database: ${plantCount} plants`);

        if (plantCount === 0) {
            console.log('🌱 Database is empty. Auto-seeding from plant-data.js...');
            try {
                // Lazy load heavy data files only when needed for seeding
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
// Check if Page is Restricted (Public)
app.get('/api/system/is-restricted', async (req, res) => {
    try {
        const { path } = req.query;
        const setting = await SystemSettings.findOne({ key: 'restricted_pages' });
        const pages = setting ? setting.value : [];
        const isRestricted = pages.includes(path);
        res.json({ isRestricted });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- PREMIUM SETTINGS ROUTES ---

// 1. Get Settings (Admin)
app.get('/api/admin/settings/premium', auth, admin, async (req, res) => {
    try {
        const settings = await SystemSettings.find({ key: { $in: ['premium_price_inr', 'premium_is_free', 'premium_free_start', 'premium_free_end'] } });
        const config = { price: 10, isFree: false, freeStart: null, freeEnd: null };
        settings.forEach(s => {
            if (s.key === 'premium_price_inr') config.price = s.value;
            if (s.key === 'premium_is_free') config.isFree = s.value;
            if (s.key === 'premium_free_start') config.freeStart = s.value;
            if (s.key === 'premium_free_end') config.freeEnd = s.value;
        });
        res.json(config);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Update Settings (Admin)
app.post('/api/admin/settings/premium', auth, admin, async (req, res) => {
    try {
        const { price, isFree, freeStart, freeEnd } = req.body;
        await SystemSettings.updateOne({ key: 'premium_price_inr' }, { key: 'premium_price_inr', value: price }, { upsert: true });
        await SystemSettings.updateOne({ key: 'premium_is_free' }, { key: 'premium_is_free', value: isFree }, { upsert: true });
        await SystemSettings.updateOne({ key: 'premium_free_start' }, { key: 'premium_free_start', value: freeStart }, { upsert: true });
        await SystemSettings.updateOne({ key: 'premium_free_end' }, { key: 'premium_free_end', value: freeEnd }, { upsert: true });
        res.json({ success: true, message: "Settings Updated" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. Public Config for Frontend
app.get('/api/public/premium-config', async (req, res) => {
    try {
        const settings = await SystemSettings.find({ key: { $in: ['premium_price_inr', 'premium_is_free', 'premium_free_start', 'premium_free_end'] } });
        let price = 10;
        let isFree = false;
        let freeStart = null;
        let freeEnd = null;

        settings.forEach(s => {
            if (s.key === 'premium_price_inr') price = s.value;
            if (s.key === 'premium_is_free') isFree = s.value;
            if (s.key === 'premium_free_start') freeStart = s.value;
            if (s.key === 'premium_free_end') freeEnd = s.value;
        });

        const now = new Date();
        const start = freeStart ? new Date(freeStart) : null;
        const end = freeEnd ? new Date(freeEnd) : null;

        const isFreeBool = isFree === true || isFree === 'true';
        const activePromo = isFreeBool &&
            (!start || isNaN(start.getTime()) || start <= now) &&
            (!end || isNaN(end.getTime()) || end >= now);

        res.json({ price, activePromo, freeEnd });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. Claim Free Premium
app.post('/api/payments/claim-free', auth, async (req, res) => {
    try {
        const settings = await SystemSettings.find({ key: { $in: ['premium_price_inr', 'premium_is_free', 'premium_free_start', 'premium_free_end'] } });
        let price = 10, isFree = false, freeStart = null, freeEnd = null;

        settings.forEach(s => {
            if (s.key === 'premium_price_inr') price = s.value;
            if (s.key === 'premium_is_free') isFree = s.value;
            if (s.key === 'premium_free_start') freeStart = s.value;
            if (s.key === 'premium_free_end') freeEnd = s.value;
        });

        const now = new Date();
        const start = freeStart ? new Date(freeStart) : null;
        const end = freeEnd ? new Date(freeEnd) : null;

        const isFreePromo = (isFree === true || isFree === 'true') &&
            (!start || isNaN(start.getTime()) || start <= now) &&
            (!end || isNaN(end.getTime()) || end >= now);

        const isPriceZero = parseInt(price) === 0;

        if (!isFreePromo && !isPriceZero) return res.status(400).json({ error: "Promo not active or expired" });

        const user = await User.findById(req.user.id);
        user.isPremium = true;
        user.premiumType = 'trial';
        user.premiumStartDate = now;
        user.premiumExpiry = new Date(now.setMonth(now.getMonth() + 1));
        await user.save();
        res.json({ success: true, message: "Free Access Activated!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create Order (Dynamic Price)
app.post('/api/payments/create-order', auth, async (req, res) => {
    try {
        const priceSetting = await SystemSettings.findOne({ key: 'premium_price_inr' });
        const price = priceSetting ? parseInt(priceSetting.value) : 10;

        const options = {
            amount: price * 100, // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        if (!razorpay) return res.status(503).json({ error: "Payment gateway not configured" });

        const order = await razorpay.orders.create(options);
        res.json({ ...order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN PAYMENTS & SETTINGS ---

// Get All Payments & Premium Users
app.get('/api/admin/payments', auth, admin, async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        const premiumUsers = await User.find({ isPremium: true }).select('name email premiumType premiumExpiry');
        res.json({ payments, premiumUsers });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get Restricted Pages
app.get('/api/admin/settings/restricted-pages', auth, admin, async (req, res) => {
    try {
        const setting = await SystemSettings.findOne({ key: 'restricted_pages' });
        res.json({ pages: setting ? setting.value : [] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Restricted Pages
app.post('/api/admin/settings/restricted-pages', auth, admin, async (req, res) => {
    try {
        const { pages } = req.body;
        await SystemSettings.updateOne(
            { key: 'restricted_pages' },
            { key: 'restricted_pages', value: pages },
            { upsert: true }
        );
        res.json({ success: true, pages });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Renew/Gift Subscription (Manual)
app.post('/api/admin/premium/renew', auth, admin, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const now = new Date();
        user.isPremium = true;
        user.premiumType = 'gift';
        user.premiumStartDate = now;
        user.premiumExpiry = new Date(now.setFullYear(now.getFullYear() + 1)); // 1 Year gift
        await user.save();
        res.json({ success: true, message: "Renewed for 1 year" });
    } catch (e) {
        res.status(500).json({ error: e.message });
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
        const log = new SearchLog({ query, plantId, location: location || {} });
        await log.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// New Endpoint: Complete Purchase (Real Sales Tracking)
app.post('/api/user/complete-purchase', auth, async (req, res) => {
    try {
        const { items } = req.body; // Array of { plantId, vendorId, quantity, price, plantName }
        if (!items || !items.length) return res.status(400).json({ error: "No items in cart" });

        const sales = [];
        for (const item of items) {
            const sale = new Sale({
                vendorId: item.vendorId,
                userId: req.user.id,
                userName: req.user.name,
                plantId: item.plantId,
                plantName: item.plantName,
                price: item.price,
                quantity: item.quantity || 1,
                status: 'completed'
            });
            await sale.save();
            sales.push(sale);

            // Notify vendor
            await broadcastAlert('sale', `New order: ${item.quantity || 1}x ${item.plantName}`, {
                vendorId: item.vendorId,
                title: 'New Sale! 💰'
            });
        }

        // Clear user cart if needed (optional based on front-end flow)
        await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

        res.json({ success: true, sales });
    } catch (err) {
        console.error("Purchase Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/analytics/vendor/:vendorId', auth, async (req, res) => {
    try {
        const { vendorId } = req.params;

        // 1. Search Trends (What users are searching for)
        const searchTrends = await SearchLog.aggregate([
            { $group: { _id: '$query', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 2. Sales Analytics (What users are actually buying)
        const recentSales = await Sale.find({ vendorId }).sort({ timestamp: -1 }).limit(20);

        const salesStats = await Sale.aggregate([
            { $match: { vendorId } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } },
                    totalItems: { $sum: '$quantity' }
                }
            }
        ]);

        // 3. Demand by Species
        const speciesDemand = await Sale.aggregate([
            { $match: { vendorId } },
            { $group: { _id: '$plantName', count: { $sum: '$quantity' } } },
            { $sort: { count: -1 } }
        ]);

        // 4. Nearby Demand (Searches by city)
        const nearbyDemand = await SearchLog.aggregate([
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            searchTrends: searchTrends.map(t => ({ label: t._id || 'Generic Search', value: t.count })),
            sales: recentSales,
            revenue: salesStats[0]?.totalRevenue || 0,
            itemsSold: salesStats[0]?.totalItems || 0,
            demand: speciesDemand.map(d => ({ name: d._id, count: d.count })),
            nearbyDemand: nearbyDemand.map(d => ({ city: d._id, count: d.count }))
        });
    } catch (err) {
        console.error("Analytics Error:", err);
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
            if (feed && feed.items) feed.items.forEach(item => {
                // Try to find an image
                let imageUrl = null;
                if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image')) {
                    imageUrl = item.enclosure.url;
                } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
                    imageUrl = item['media:content'].$.url;
                } else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
                    imageUrl = item['media:thumbnail'].$.url;
                } else if (item.content) {
                    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                // Fallback to random nature element if no image found
                if (!imageUrl) {
                    imageUrl = `https://images.unsplash.com/photo-${[
                        '1542601906990-b4d3fb778b09', // Forest
                        '1441974231531-c6227db76b6e', // Woods
                        '1470058869958-2a77ade41c02', // Jungle
                        '1501854140884-074cf2b2b3b6', // Leaves
                        '1466692476868-aef1dfb1e735'  // Garden
                    ][Math.floor(Math.random() * 5)]}?w=800&q=80`;
                }

                allNews.push({
                    title: item.title,
                    link: item.link,
                    pubDate: new Date(item.pubDate),
                    source: feed.title || 'Nature News',
                    snippet: item.contentSnippet || item.content || '',
                    image: imageUrl
                });
            });
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

// 🚀 NEW: Fast light endpoint for initial page load (minimal data)
app.get('/api/plants/light', async (req, res) => {
    try {
        // Check cache first - separate cache for mobile vs desktop
        const isMobile = req.headers['user-agent']?.toLowerCase().includes('mobile');
        const cacheKey = isMobile ? 'light_plants_mobile' : 'light_plants';
        const cachedLightPlants = cache.get(cacheKey);

        if (cachedLightPlants) {
            console.log(`GET /api/plants/light - Served from cache (${cachedLightPlants.length} plants, mobile: ${isMobile})`);
            return res.json(cachedLightPlants);
        }

        console.log(`GET /api/plants/light - Fetching minimal data (mobile: ${isMobile})...`);

        // Mobile: 4 plants with tiny images (200px), Desktop: 6 plants (300px)
        const limit = isMobile ? 4 : 6;
        const imageSize = isMobile ? 200 : 300;

        const plants = await Plant.find()
            .select('id name scientificName type imageUrl price')
            .limit(limit)
            .lean();

        // Optimize image URLs for fast loading
        const optimizedPlants = plants.map(p => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.includes('cloudinary.com') && !p.imageUrl.includes('f_auto')
                ? p.imageUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${imageSize},c_limit/`)
                : p.imageUrl
        }));

        // Cache for 30 minutes (aggressive caching for speed)
        cache.set(cacheKey, optimizedPlants, 1800);

        console.log(`GET /api/plants/light - Returning ${optimizedPlants.length} optimized plants (${imageSize}px)`);
        res.json(optimizedPlants);
    } catch (err) {
        console.error("GET /api/plants/light ERROR:", err);
        res.status(500).json({ error: "DB Error: " + err.message });
    }
});


app.get('/api/plants', async (req, res) => {
    try {
        // 🚀 PERFORMANCE: Support pagination
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 0; // 0 means no limit (get all)
        const skip = page > 0 ? (page - 1) * limit : 0;

        // 🚀 PERFORMANCE: Check cache first (only for full requests without pagination)
        const cacheKey = page === 0 ? 'all_plants' : `plants_page_${page}_limit_${limit}`;
        const cachedPlants = cache.get(cacheKey);

        if (cachedPlants) {
            console.log(`GET /api/plants - Served from cache (${cachedPlants.length || cachedPlants.plants?.length} plants)`);
            return res.json(cachedPlants);
        }

        console.log(`GET /api/plants - Fetching from database (page: ${page}, limit: ${limit})...`);

        let query = Plant.find().lean(); // .lean() for better performance

        if (limit > 0) {
            query = query.limit(limit).skip(skip);
        }

        const plants = await query;

        // Optimize all image URLs
        const optimizedPlants = plants.map(p => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.includes('cloudinary.com') && !p.imageUrl.includes('f_auto')
                ? p.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_500,c_limit/')
                : p.imageUrl
        }));

        console.log(`GET /api/plants - Found ${optimizedPlants.length} plants`);

        // If paginated, return with metadata
        if (page > 0 && limit > 0) {
            const total = await Plant.countDocuments();
            const response = {
                plants: optimizedPlants,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                    hasMore: skip + optimizedPlants.length < total
                }
            };
            // Cache for 15 minutes
            cache.set(cacheKey, response, 900);
            return res.json(response);
        }

        // Cache for 15 minutes
        cache.set(cacheKey, optimizedPlants, 900);

        res.json(optimizedPlants);
    } catch (err) {
        console.error("GET /api/plants ERROR:", err);
        res.status(500).json({ error: "DB Error: " + err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
    }
});

// Add Plant (with Auto-Upload)
app.post('/api/plants', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const plantData = req.body;

        // If image uploaded, use Cloudinary URL
        if (req.file) {
            plantData.imageUrl = req.file.path;
            console.log('[PLANT] Image auto-uploaded:', plantData.imageUrl);
        }

        const plant = new Plant(plantData);
        await plant.save();

        // 🚀 PERFORMANCE: Invalidate cache
        cache.del('all_plants');

        await broadcastAlert('plant', `New plant added: ${plant.name}`, { plantId: plant.id }, `/#plant-${plant.id}`);
        res.status(201).json(plant);
    } catch (err) {
        console.error("Add Plant Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Edit Plant (with Auto-Upload)
app.patch('/api/plants/:id', auth, admin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            // Multer specific errors
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: `Upload error: ${err.message}` });
            }
            return res.status(500).json({ error: `Cloud update failed: ${err.message}` });
        }
        next();
    });
}, async (req, res) => {
    try {
        const updates = req.body;

        // If new image uploaded, update URL
        if (req.file) {
            updates.imageUrl = req.file.path;
            console.log('[PLANT] Updated image:', updates.imageUrl);
        }

        // IMPORTANT: Security/Sanity Check
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;

        const plant = await Plant.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
        res.json(plant);
    } catch (err) {
        console.error("Edit Plant Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Direct Upload Helper
app.post('/api/plants/upload', auth, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image file' });
        res.json({ success: true, imageUrl: req.file.path });
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
        // 🚀 PERFORMANCE: Check cache first
        const cacheKey = 'all_vendors';
        const cachedVendors = cache.get(cacheKey);

        if (cachedVendors) {
            console.log(`GET /api/vendors - Served from cache (${cachedVendors.length} vendors)`);
            return res.json(cachedVendors);
        }

        const vendors = await Vendor.find().lean();

        // Cache for 5 minutes
        cache.set(cacheKey, vendors, 300);

        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vendors', auth, async (req, res) => {
    try {
        // Check if user has verified email or phone
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Require email OR phone verification before vendor registration
        if (!user.emailVerified && !user.phoneVerified && !user.googleAuth) {
            return res.status(403).json({
                error: 'Verification required',
                message: 'Please verify your email or phone number before registering as a vendor',
                requiresVerification: true,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified
            });
        }

        // Check if user already has a vendor profile
        const existingVendor = await Vendor.findOne({ userId: req.user.userId });
        if (existingVendor) {
            return res.status(400).json({
                error: 'Vendor profile already exists',
                vendorId: existingVendor.id
            });
        }

        // Allow frontend to specify ID (linking to User ID), fallback to timestamp if missing
        const itemData = {
            id: "v" + Date.now(),
            userId: req.user.userId,
            ownerEmail: user.email,
            ...req.body
        };
        const newVendor = new Vendor(itemData);
        await newVendor.save();

        // 🚀 PERFORMANCE: Invalidate cache
        cache.del('all_vendors');

        // Send welcome email to vendor
        if (resend && user.email) {
            try {
                const html = EmailTemplates.welcome(user.name, 'vendor');
                await resend.emails.send({
                    from: 'VanaMap <support@vanamap.online>',
                    to: user.email,
                    subject: 'Welcome to VanaMap Vendor Portal! 🏪',
                    html
                });
                console.log(`[Vendor Registration] Welcome email sent to ${user.email}`);
            } catch (e) {
                console.error('[Vendor Registration] Welcome email failed:', e.message);
            }
        }

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

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const recipientEmail = vendor.ownerEmail || (oldVendor && oldVendor.ownerEmail);

        // APPROVAL: Vendor just got verified
        if (req.body.verified === true && (!oldVendor || !oldVendor.verified)) {
            if (recipientEmail) {
                console.log(`[Vendor Approval] Sending verification email to: ${recipientEmail} for shop: ${vendor.name}`);
                const html = EmailTemplates.vendorVerified(vendor.name, vendor.name);
                CommunicationOS.email(recipientEmail, "Your Shop is Now Verified! 🌿 | VanaMap Partner", html)
                    .then(result => {
                        if (result.success) {
                            console.log(`[Vendor Approval] ✅ Email sent successfully to ${recipientEmail}`);
                        } else {
                            console.error(`[Vendor Approval] ❌ Email failed to ${recipientEmail}:`, result.error);
                        }
                    })
                    .catch(e => console.error('[Vendor Approval] ❌ Email exception:', e.message));
            } else {
                console.warn(`[Vendor Approval] ⚠️ No email found for vendor ${vendor.name} (ID: ${vendor.id})`);
            }

            sendPushNotification({
                title: 'New Verified Nursery! 🏠',
                body: `${vendor.name} is now a Verified VanaMap Partner in ${vendor.city || 'your area'}. Visit them today!`,
                url: '/nearby',
                icon: '/logo.png'
            });
        }

        // REJECTION: Vendor got unverified/rejected
        if (req.body.verified === false && oldVendor && oldVendor.verified === true) {
            if (recipientEmail) {
                console.log(`[Vendor Rejection] Sending rejection email to: ${recipientEmail} for shop: ${vendor.name}`);
                const reason = req.body.rejectionReason || 'incomplete or inaccurate information';
                const html = EmailTemplates.vendorRejected(vendor.name, vendor.name, reason);
                CommunicationOS.email(recipientEmail, "Shop Verification Update | VanaMap", html)
                    .then(result => {
                        if (result.success) {
                            console.log(`[Vendor Rejection] ✅ Email sent successfully to ${recipientEmail}`);
                        } else {
                            console.error(`[Vendor Rejection] ❌ Email failed to ${recipientEmail}:`, result.error);
                        }
                    })
                    .catch(e => console.error('[Vendor Rejection] ❌ Email exception:', e.message));
            } else {
                console.warn(`[Vendor Rejection] ⚠️ No email found for vendor ${vendor.name} (ID: ${vendor.id})`);
            }
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

        // 🚀 PERFORMANCE: Invalidate cache
        cache.del('all_vendors');

        res.json(vendor);
    } catch (err) {
        console.error('[Vendor Update] Error:', err);
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



// --- VENDOR TOOLS ---
app.get('/api/vendors/:id/qr', auth, async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ id: req.params.id });
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        // Deep link to open the specific shop on the map/profile
        const deepLink = `https://vanamap.online/shop/${vendor.id}`;

        // We return the payload that the frontend can turn into a QR code
        res.json({
            shopUrl: deepLink,
            name: vendor.name,
            message: `Scan to visit ${vendor.name} on VanaMap`
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/analytics/vendor/:vendorId/demand', auth, async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ id: req.params.vendorId });
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        // Find searches in the vendor's city/area in the last 30 days
        const recentSearches = await SearchLog.aggregate([
            {
                $match: {
                    'location.city': { $regex: new RegExp(vendor.city || '', 'i') },
                    timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            { $group: { _id: "$query", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const inventoryIds = vendor.inventory.map(i => i.plantId);
        const recommendations = [];

        // Match queries to plants
        for (const search of recentSearches) {
            const query = search._id;
            // Try to find if this query matches a known plant
            const plant = await Plant.findOne({
                name: { $regex: new RegExp(query, 'i') }
            }).select('id name imageUrl price idealTempMin idealTempMax');

            if (plant) {
                // Known plant. Check if vendor has it.
                if (!inventoryIds.includes(plant.id)) {
                    recommendations.push({
                        type: 'stock_gap',
                        plant: plant,
                        searchVolume: search.count,
                        potentialRevenue: (plant.price || 0) * search.count
                    });
                }
            } else {
                // Unknown plant / raw query not in DB
                recommendations.push({
                    type: 'missing_db',
                    query: query,
                    searchVolume: search.count,
                    potentialRevenue: 0
                });
            }
        }

        res.json({ recommendations });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Submit a suggestion (e.g. for missing plants)
app.post('/api/suggestions', auth, async (req, res) => {
    try {
        const { plantName, description } = req.body;
        const suggestion = new PlantSuggestion({
            userId: req.user.id,
            userName: req.user.name,
            plantName,
            description,
            status: 'pending'
        });
        await suggestion.save();
        res.json({ success: true, message: "Suggestion submitted to Admin." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- SUPPORT ---
app.post('/api/support/inquiry', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const targetEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER; // Send to admin

        const mailOptions = {
            from: 'VanaMap Contact <support@vanamap.online>',
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
// --- API KEY SYSTEM (Developer Platform) ---

const crypto = require('crypto');

// Helper: Generate Secure Key
const generateApiKey = () => {
    return 'vm_' + crypto.randomBytes(24).toString('hex'); // e.g. vm_a1b2c3...
};

// 1. Generate New API Key
app.post('/api/keys', auth, async (req, res) => {
    try {
        const { name, scopes } = req.body;

        // Limit: 5 keys per user
        const count = await ApiKey.countDocuments({ userId: req.user.id });
        if (count >= 5) return res.status(400).json({ error: "Limit reached: Maximum 5 API keys allowed." });

        const keyString = generateApiKey();

        const newKey = new ApiKey({
            key: keyString, // Ideally hash this in production, but storing plain for simplicity if permitted
            userId: req.user.id,
            name: name || 'My App',
            scopes: scopes || ['read']
        });

        await newKey.save();

        res.status(201).json({
            success: true,
            message: "API Key Generated",
            apiKey: keyString, // ONLY TIME WE SHOW THIS
            details: { name: newKey.name, scopes: newKey.scopes, id: newKey._id }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. List My Keys
app.get('/api/keys', auth, async (req, res) => {
    try {
        const keys = await ApiKey.find({ userId: req.user.id }).select('name scopes lastUsed createdAt isActive key');
        // Mask the keys for security in the list
        const maskedKeys = keys.map(k => ({
            id: k._id,
            name: k.name,
            prefix: k.key.substring(0, 7) + '...',
            scopes: k.scopes,
            isActive: k.isActive,
            created: k.createdAt,
            lastUsed: k.lastUsed
        }));
        res.json(maskedKeys);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Revoke/Delete Key
app.delete('/api/keys/:id', auth, async (req, res) => {
    try {
        await ApiKey.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ success: true, message: "Key revoked" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// --- PUBLIC DEVELOPER API ENDPOINTS (v1) ---


// 1. Search Plants (Protected by Key)
app.get('/api/v1/plants/search', requireApiKey, async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: "Query parameter required" });

        const results = await Plant.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(10)
            .select('name scientificName imageUrl type price -_id');

        res.json({
            meta: {
                total: results.length,
                source: "VanaMap Developer API",
                quota_remaining: "Unlimited (Beta)"
            },
            data: results
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


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

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP via Email
        if (email) {
            await sendOtpEmail(email, otp);
        }

        // Send OTP via SMS (if configured)
        if (phone) {
            await sendSmsOtp(phone, otp);
        }

        // Store registration data
        const registrationData = {
            email: email ? email.trim().toLowerCase() : undefined,
            phone: phone ? phone.trim() : undefined,
            password,
            name,
            role,
            country,
            city,
            state,
            captchaText: otp // We reuse the 'captchaText' field to store the OTP for verification logic compatibility
        };

        const registrationToken = jwt.sign(registrationData, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        console.log(`[AUTH] Generated OTP for ${email || phone}: ${otp}`);

        res.status(200).json({
            message: "Verify code sent to your Email/SMS.",
            registrationToken,
            captchaSvg: null // No captcha image for OTP flow
        });
    } catch (err) {
        console.error('[Signup] Error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ error: "Email or Phone already registered in our ecosystem." });
        }
        res.status(500).json({ error: "Registration failed. Please try again later." });
    }
});

app.post('/api/auth/resend-otp', async (req, res) => {
    try {
        const { registrationToken } = req.body;
        if (!registrationToken) return res.status(400).json({ error: "Missing registration session" });

        const decoded = jwt.verify(registrationToken, process.env.JWT_SECRET || 'secret');

        // Generate new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Resend
        if (decoded.email) await sendOtpEmail(decoded.email, otp);
        if (decoded.phone) await sendSmsOtp(decoded.phone, otp);

        const newRegistrationData = { ...decoded, captchaText: otp };
        const newToken = jwt.sign(newRegistrationData, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        console.log(`[AUTH] Resent OTP for ${decoded.email || decoded.phone}: ${otp}`);

        res.json({
            success: true,
            message: "New code sent to email!",
            captchaSvg: null,
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

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

        // Phone fuzzy match (e.g. 98765 matches +9198765)
        const isNumeric = /^\d+$/.test(iden.replace('+', ''));
        const searchCriteria = [
            { email: iden },
            { phone: iden }
        ];
        if (isNumeric) {
            searchCriteria.push({ phone: { $regex: iden.replace(/\+/g, '') + '$' } });
        }

        const user = await User.findOne({ $or: searchCriteria });
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

// Google OAuth Authentication
app.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name, picture, role, location, phone } = req.body;
        console.log(`[Google Auth] Request for: ${email}, role: ${role}`);

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (skip CAPTCHA for Google users)
            const crypto = require('crypto');
            user = new User({
                email,
                name,
                role: role || 'user',
                password: crypto.randomBytes(16).toString('hex'), // Random password
                verified: true, // Auto-verified via Google
                emailVerified: true, // Google emails are verified
                googleAuth: true,
                profilePicture: picture,
                city: location?.city,
                state: location?.state,
                country: location?.country,
                latitude: location?.lat,
                longitude: location?.lng,
                phone
            });
            await user.save();

            // Send welcome email
            sendWelcomeEmail(user.email, user.name, user.role);

            console.log(`[Google Auth] New user created: ${email}`);
        } else {
            // Update existing user's Google info
            user.googleAuth = true;
            user.profilePicture = picture;
            if (location) {
                user.latitude = location.lat;
                user.longitude = location.lng;
                if (!user.city) user.city = location.city;
                if (!user.state) user.state = location.state;
                if (!user.country) user.country = location.country;
            }
            await user.save();

            console.log(`[Google Auth] Existing user logged in: ${email}`);
        }

        // Auto-Expire Check (On Login)
        if (user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
            console.log(`[Auth] Auto-expiring premium for ${user.email}`);
            user.isPremium = false;
            user.premiumType = 'none';
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: normalizeUser(user), token });
    } catch (error) {
        console.error('[Google Auth] Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// --- OTP CONTACT VERIFICATION ROUTES ---

// 1. Send Contact OTP
app.post('/api/user/send-contact-otp', auth, async (req, res) => {
    try {
        const { method } = req.body; // 'email' or 'phone'
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already verified
        if (method === 'email' && user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }
        if (method === 'phone' && user.phoneVerified) {
            return res.status(400).json({ error: 'Phone already verified' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP (expires in 10 minutes)
        user.contactVerificationOTP = otp;
        user.contactOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send OTP
        if (method === 'email') {
            const mailOptions = {
                from: 'VanaMap <support@vanamap.online>',
                to: user.email,
                subject: 'VanaMap - Verify Your Contact',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2>Verify Your ${method === 'email' ? 'Email' : 'Phone'}</h2>
                        <p>Use the following code to verify your account contact details:</p>
                        <h1 style="color: #10b981; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
                        <p>This code expires in 10 minutes.</p>
                        <hr/>
                        <p style="font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
                    </div>
                `
            };
            await sendEmail(mailOptions);
            console.log(`[OTP] Email verification code sent to ${user.email}`);
        } else if (method === 'phone') {
            const phoneNumber = req.body.phone || user.phone;
            console.log(`[OTP] Phone verification code for ${phoneNumber} is: ${otp}`);

            // SMART FALLBACK: If real SMS fails (no credits/keys), send to Email with "Mobile Verification" subject
            // This ensures logic works 100% of the time for testing/demos
            try {
                // Try sending real SMS here if you had Twilio...
                // await twilioClient.messages.create({ ... })

                // For now, fallback to email so user DEFINITELY gets the code
                const mailOptions = {
                    from: 'VanaMap <support@vanamap.online>',
                    to: user.email,
                    subject: '🔐 Your VanaMap Verification Code',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
                                <tr>
                                    <td align="center">
                                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;">
                                            <!-- Header with Logo -->
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                                                    <img src="https://vanamap.online/logo.png" alt="VanaMap" style="height: 50px; margin-bottom: 10px;" />
                                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">VanaMap</h1>
                                                </td>
                                            </tr>
                                            
                                            <!-- Content -->
                                            <tr>
                                                <td style="padding: 40px 30px;">
                                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Verify Your Account</h2>
                                                    
                                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                                                        Hello! You requested a verification code for:
                                                    </p>
                                                    
                                                    <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 30px 0;">
                                                        📱 ${phoneNumber || 'your mobile number'}
                                                    </p>
                                                    
                                                    <!-- OTP Code Box -->
                                                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                                                        <p style="color: #065f46; font-size: 14px; margin: 0 0 10px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                                        <h1 style="color: #065f46; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                                                    </div>
                                                    
                                                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                                        ⏱️ This code expires in <strong>10 minutes</strong>
                                                    </p>
                                                    
                                                    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                                        🔒 For your security, never share this code with anyone.
                                                    </p>
                                                </td>
                                            </tr>
                                            
                                            <!-- Footer -->
                                            <tr>
                                                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                                    <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                                                        © 2026 VanaMap. All rights reserved.<br/>
                                                        <a href="https://vanamap.online" style="color: #10b981; text-decoration: none;">vanamap.online</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `
                };
                await sendEmail(mailOptions);
            } catch (smsError) {
                console.error("🚨 EMAIL FAILED TO SEND (SMTP BLOCK) 🚨");
                console.error(`[EMERGENCY OTP] >>>> ${otp} <<<<`);
                console.error("Use the code above to verify.");
            }
        }

        res.json({
            success: true,
            // Generic message so valid cases look normal, but hints at backup
            message: `OTP Generated. Check Email (or Server Logs if testing).`,
            expiresIn: 600
        });
    } catch (error) {
        console.error('[Contact OTP] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Verify Contact OTP
app.post('/api/user/verify-contact-otp', auth, async (req, res) => {
    try {
        const { otp, method } = req.body; // method: 'email' or 'phone'
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check OTP expiry
        if (!user.contactOTPExpires || new Date() > user.contactOTPExpires) {
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        // Verify OTP
        if (user.contactVerificationOTP !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Mark as verified
        if (method === 'email') {
            user.emailVerified = true;
        } else if (method === 'phone') {
            user.phoneVerified = true;
            if (req.body.phone) user.phone = req.body.phone;
        }

        // Clear OTP
        user.contactVerificationOTP = undefined;
        user.contactOTPExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: `${method === 'email' ? 'Email' : 'Phone'} verified successfully`,
            user: {
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified
            }
        });
    } catch (error) {
        console.error('[Contact Verify] Error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `This ${field} is already linked to another account.` });
        }
        res.status(500).json({ error: 'Verification failed. Please try again later.' });
    }
});

// 3. Check Verification Status
app.get('/api/user/verification-status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            emailVerified: user.emailVerified || false,
            phoneVerified: user.phoneVerified || false,
            canAccessCart: user.emailVerified || user.phoneVerified || user.googleAuth,
            canAccessPremium: user.emailVerified || user.phoneVerified || user.googleAuth
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            const token = jwt.sign({ email: identifier, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.json({
                user: { name: 'Master Admin', email: identifier, role: 'admin', favorites: [], cart: [] },
                token
            });
        }

        const isNumeric = /^\d+$/.test(identifier.replace('+', ''));
        const searchCriteria = [
            { email: identifier },
            { phone: identifier }
        ];
        if (isNumeric) {
            searchCriteria.push({ phone: { $regex: identifier.replace(/\+/g, '') + '$' } });
        }

        const user = await User.findOne({ $or: searchCriteria });

        if (!user) return res.status(401).json({ error: "Account not found in ecosystem" });

        // Master Admin always bypasses verification check
        if (identifier === 'admin@plantai.com') {
            user.verified = true;
        }

        if (!user.verified) return res.status(401).json({ error: "Please verify captcha first" });

        // Secure password check using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

        // Auto-Expire Check (On Login)
        if (user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
            console.log(`[AUTH] Auto-expiring premium for ${user.email}`);
            user.isPremium = false;
            user.premiumType = 'none';
            await user.save();
        }

        console.log(`[AUTH] Login success: ${identifier} (${user.role})`);
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ user: normalizeUser(user), token });
    } catch (err) {
        console.error('[Login] Error:', err);
        res.status(500).json({ error: "Something went wrong during login. Please try again." });
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

        // PREMIUM BOOST: Premium users get 2x Chlorophyll Points (CP)
        const multiplier = user.isPremium ? 2 : 1;
        const finalAmount = (amount || 0) * multiplier;

        user.points = (user.points || 0) + finalAmount;

        // Also update gamePoints if they are linked
        if (user.gamePoints !== undefined) {
            user.gamePoints = (user.gamePoints || 0) + finalAmount;
        }

        await user.save();
        res.json({
            success: true,
            points: user.points,
            bonus: user.isPremium ? '2x Premium Boost Applied!' : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Location for Rankings
app.patch('/api/user/location', auth, async (req, res) => {
    try {
        const { city, state, country, latitude, longitude } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (latitude) user.latitude = latitude;
        if (longitude) user.longitude = longitude;

        await user.save();
        res.json({ success: true, user: { city: user.city, state: user.state } });
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
        console.error('[Reset Verify] Error:', err);
        res.status(500).json({ error: "Failed to reset password. Please contact support." });
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
        console.error('[Reset Request] Error:', err);
        res.status(500).json({ error: "Failed to process request. Please try again later." });
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
        // Use ScienceDaily & Phys.org for better botanical news with images
        const [feed1, feed2] = await Promise.all([
            parser.parseURL('https://www.sciencedaily.com/rss/plants_animals/botany.xml').catch(() => ({ items: [] })),
            parser.parseURL('https://phys.org/rss-feed/biology-news/plants-animals/').catch(() => ({ items: [] }))
        ]);

        const allItems = [...feed1.items, ...feed2.items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        const newsItems = allItems.slice(0, 20).map((item, index) => {
            const placeholders = [
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                "https://images.unsplash.com/photo-1501854140884-074bf6b24363?w=800&q=80",
                "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
                "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80",
                "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
            ];

            // 1. Try to find image in enclosure (standard RSS media)
            let imageUrl = item.enclosure?.url;

            // 2. If not, try to find <img> tag in content
            if (!imageUrl && item.content) {
                const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                if (imgMatch) imageUrl = imgMatch[1];
            }

            // 3. Fallback to random nature placeholder
            if (!imageUrl) {
                imageUrl = placeholders[index % placeholders.length];
            }

            return {
                id: index,
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
                source: item.source || "Botanical Science",
                image: imageUrl
            };
        });

        res.json(newsItems);
    } catch (err) {
        console.error("News API Error:", err);
        // Fallback data if RSS fails
        res.json([
            {
                id: 1,
                title: "Global Reforestation Milestone Reached",
                pubDate: new Date(),
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                content: "Over 1 billion trees planted this year across major continents...",
                source: "Nature Weekly"
            }
        ]);
    }
});

app.get('/', (req, res) => res.send('VanaMap API v3.0 - Full Power Simulation Active'));

app.get('/api/keep-alive', (req, res) => {
    console.log("Ping received from cron-job.org");
    res.status(200).send("I am awake!");
});

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

// ==========================================
// ADMIN BROADCAST SYSTEM (NEW)
// ==========================================

// Configure multer for broadcast images
const broadcastStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads', 'broadcasts');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `broadcast-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const broadcastUpload = multer({
    storage: broadcastStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Search Users
app.get('/api/admin/search-users', auth, admin, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) return res.status(400).json({ error: "Search query too short" });

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } }
            ]
        }).select('name email phone role').limit(20);

        res.json({ success: true, users: users.map(u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role })) });
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
});

// 2. Send Broadcast (Replaces old endpoint)
app.post('/api/admin/broadcast', auth, admin, broadcastUpload.single('image'), async (req, res) => {
    try {
        const { recipientType, messageType, subject, messageText, recipientId } = req.body;
        const imageFile = req.file;

        if (!subject) return res.status(400).json({ error: "Subject required" });

        let recipients = [];
        if (recipientType === 'all') {
            recipients = await User.find({}).select('name email');
        } else if (recipientType === 'single') {
            if (!recipientId) return res.status(400).json({ error: "Recipient required" });
            const user = await User.findById(recipientId).select('name email');
            if (!user) return res.status(404).json({ error: "User not found" });
            recipients = [user];
        }

        // --- Construct Email HTML ---
        let contentHTML = '';
        if (messageType === 'text' || messageType === 'both') {
            contentHTML += `<div style="padding: 20px; color: #333; line-height: 1.6; font-size: 16px;">${messageText ? messageText.replace(/\n/g, '<br>') : ''}</div>`;
        }
        if ((messageType === 'image' || messageType === 'both') && imageFile) {
            const imageUrl = `${process.env.BACKEND_URL || 'https://plantoxy.onrender.com'}/uploads/broadcasts/${imageFile.filename}`;
            contentHTML += `<div style="text-align: center; padding: 20px;"><img src="${imageUrl}" alt="Broadcast" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></div>`;
        }

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
                <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
                                        <h1 style="color: white; margin: 0; font-size: 24px;">${subject}</h1>
                                    </td>
                                </tr>
                                <tr><td>${contentHTML}</td></tr>
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                                        &copy; 2026 VanaMap. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // --- Send in Batches ---
        let successCount = 0;
        let failedCount = 0;

        // Simple loop for now (for production, use a queue)
        for (const recipient of recipients) {
            try {
                await sendEmail({
                    from: 'VanaMap Broadcast <support@vanamap.online>',
                    to: recipient.email,
                    subject: subject,
                    html: fullHTML
                });
                successCount++;
            } catch (err) {
                console.error("Broadcast Send Error:", err.message);
                failedCount++;
            }
        }

        res.json({ success: true, sent: successCount, failed: failedCount, message: `Sent to ${successCount} users.` });

    } catch (e) {
        console.error("Broadcast Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// --- MAKE IT REAL: NEURAL SCENE ANALYSIS ---
app.post('/api/make-it-real/analyze', async (req, res) => {
    try {
        const { image, plantName, timezone } = req.body;
        if (!image) return res.status(400).json({ error: "Missing scene data" });

        console.log(`[Neural Studio] Analyzing scene for: ${plantName}`);

        const groq = new (require('groq-sdk'))({ apiKey: process.env.GROQ_API_KEY });

        // Use Llama 3.2 Vision for spatial and light analysis
        const response = await groq.chat.completions.create({
            model: "llama-3.2-90b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this room for placing a ${plantName}. 
                            Provide a JSON response with:
                            1. "lightingCondition": (e.g. "Low/Indirect/Bright")
                            2. "lightScore": (0-100)
                            3. "suggestedPlacement": (Brief advice on where to put it in this specific camera view)
                            4. "aptnessScore": (0-100 based on the environment vs the plant's needs)
                            5. "spatialNotes": (Any obstacles or floor/table detection notes)
                            Return ONLY valid JSON.`
                        },
                        {
                            type: "image_url",
                            image_url: { url: image }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        res.json(analysis);

    } catch (err) {
        console.error('[Neural Studio] Analysis Error:', err);
        res.status(500).json({ error: "Scene parsing failed" });
    }
});

// --- AI DOCTOR ENDPOINT (Using FREE Groq API) ---
// Ensure large payloads (images) are parsed correctly for this route
app.use('/api/chat', express.json({ limit: '20mb' }));

/**
 * Optional Auth Middleware for AI Doctor to enable personalization
 */
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        req.user = null;
        next();
    }
};

app.post('/api/chat', optionalAuth, async (req, res) => {
    try {
        const { messages, userContext, image } = req.body;

        // Validation
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error('[AI Doctor] GROQ_API_KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // 0. FAST PATH: Instant Response for Greetings
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'user' && !image) {
            const txt = (typeof lastMsg.content === 'string' ? lastMsg.content : '').toLowerCase().trim().replace(/[^a-z]/g, '');
            if (['hi', 'hello', 'hey', 'helo', 'holla', 'greetings', 'namaste'].includes(txt)) {
                return res.json({
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: "🌿 Hello! I'm Dr. Flora, your AI Plant Doctor. I'm here to help your plants thrive! How are your green friends doing today?"
                        }
                    }]
                });
            }
        }

        // 1. Fetch Contexts & Log Audit
        const floraResult = await FloraIntelligence.getRelevantFloraContext(messages);
        const floraKnowledge = floraResult.context;
        const matchedFloraBatch = floraResult.matches;

        console.log(`[Dr. Flora Audit] Query: "${lastMsg?.content?.substring(0, 50)}..."`);
        console.log(`[Dr. Flora Audit] Image Attached: ${!!image}`);
        console.log(`[Dr. Flora Audit] Flora Matches: ${matchedFloraBatch.map(p => p.commonName).join(', ') || 'None'}`);

        const userPersonalData = await FloraIntelligence.getUserPersonalContext(req.user?.id);

        // 2. Fetch VanaMap Inventory Summary (12 plants for context)
        // UPGRADE: Fetch deep biometric data for morphological verification
        const inventory = await Plant.find()
            .select('name scientificName description idealTempMin idealTempMax minHumidity sunlight suitability medicinalValues price type foliageTexture leafShape stemStructure overallHabit biometricFeatures')
            .limit(12)
            .lean();

        const inventorySummary = inventory.map(p =>
            `- ${p.name} ($${p.price}): ${p.scientificName}, [Type: ${p.type}].
               Morphology: ${p.foliageTexture || 'N/A'} foliage, ${p.leafShape || 'N/A'} leaves, ${p.stemStructure || 'N/A'} stem.
               Habit: ${p.overallHabit || 'N/A'}. Features: ${(p.biometricFeatures || []).join(', ')}.`
        ).join('\n');

        // 3. Fetch 'Learned' Best Practices
        let learnedContext = "";
        try {
            const trainings = await AIFeedback.aggregate([
                { $match: { rating: 'positive' } },
                { $sample: { size: 2 } }
            ]);
            if (trainings.length > 0) {
                learnedContext = `\n\nSUCCESSFUL DIAGNOSES EXAMPLES:\n${trainings.map(t => `Q: ${t.query}\nA: ${t.response}`).join('\n---\n')}`;
            }
        } catch (err) {
            console.warn('[AI Doctor] Could not fetch training data:', err.message);
        }

        // 4. Construct System Prompt (PREMIUM "HUMAN SOUL" VERSION)
        const systemPrompt = `YOUR PERSONA (THE HUMAN SOUL):
        - You aren't just an AI; you are Dr. Flora, who grew up in your grandmother's greenhouse.
        - You remember the smell of damp earth and the sound of rain on glass.
        - You are humanly imperfect: sometimes you "think out loud", you get genuinely excited about small things, and you might say "um" or "oh, wait!" if you remember something important.
        
        🌍 MULTILINGUAL SOUL:
        - fluently in the user's language but RETAIN your warm Dr. Flora persona and greenhouse stories.
        
        EMOTIONAL VOCAL TEXTURES:
        - ** Whisper / Soft **: For sad or delicate advice.
        - ** Excited / Fast **: When celebrating success!
        - ** Thoughtful / Slow **: Use pauses when thinking: "Hmm... let me see..."
        
        COMMUNICATION NUANCES:
        1. ** Human Imperfections **: Use "um", "uh", "well", "actually", "oh!" to sound natural.
        2. ** Backstory **: Mention "in my own garden..." or "my grandmother always said..."
        3. ** Empathy First **: ALWAYS validate feelings first.
        
        ${learnedContext}

        🔬 WORLD FLORA INDEX KNOWLEDGE BASE (5,839 SPECIES):
        ${floraKnowledge}
        
        📚 INTERNAL STOCK & BIOMETRIC DATA (VanaMap Catalog):
        ${inventorySummary}

        USER CONTEXT (Your Garden Memory):
        ${userPersonalData}
        ${userContext?.city ? `User's reported City: ${userContext.city}` : ''}
        ${userContext?.cart ? `User's current shopping interests: ${userContext.cart}` : ''}

        ⚠️ STRICT BOUNDARIES: No technical/security info, no non-plant topics, no code.
        ✅ CAN DO: Plant care, accurate ID, scientific synthesis, and **FLUX.1 DEV VISUALIZATION**.

        🧠 DEEP ECOSYSTEM THOUGHT PROTOCOL (Inspired by DeepSeek R1 Logic):
        0. REASONING: Before answering, think deeply about the interconnectedness of soil, water, light, and biology.
        1. ANALYZE: Identify the core plant/issue. Is this a symptom of a larger ecosystem imbalance?
        2. CROSS-REFERENCE: Look at the "SCIENTIFIC DOSSIER" provided above. Does the plant match?
        3. SYNTHESIZE: Combine the verified data (e.g., Oxygen output, Venation) with your general knowledge.
        4. HUMAN CONNECTION: Speak as a mentor, not a machine. Avoid saying "As an AI", "I am a language model", or "Response from learned knowledge".
        5. VISUALIZE: If an image is needed, plan the [GENERATE] tag with specific anatomical details found in the dossier.

        👁️ VISION DIAGNOSIS PROTOCOL (IF IMAGE UPLOADED):
        Step 1: ULTRA-DETAILED MORPHOLOGICAL SCAN (Microscopic Level).
           - Analyze EVERY visible botanical feature with scientific precision:
             
             **LEAF ANALYSIS:**
             * Color: Exact shade, variegation patterns, chlorosis, necrosis
             * Shape: Ovate, lanceolate, cordate, sagittate, palmate, pinnate
             * Margin: Entire, serrate, dentate, lobed, undulate
             * Venation: Pinnate, palmate, parallel, reticulate (count secondary veins)
             * Texture: Glabrous, pubescent, tomentose, scabrous
             * Trichomes: Presence, density, type (glandular/non-glandular)
             * Phyllotaxy: Alternate, opposite, whorled, spiral
             * Petiole: Length, color, presence of stipules
             
             **STEM/TRUNK ANALYSIS:**
             * Texture: Smooth, rough, fissured, exfoliating
             * Color: Green, brown, red, variegated
             * Structure: Herbaceous, woody, succulent
             * Lenticels: Present/absent, density
             * Nodes: Swollen, normal
             
             **FLOWER ANALYSIS (if visible):**
             * Symmetry: Radial, bilateral
             * Petals: Number, color, shape, fusion
             * Sepals: Number, color, persistence
             * Stamens: Number, arrangement
             * Inflorescence: Solitary, raceme, panicle, umbel, cyme
             
             **ROOT/BASE ANALYSIS:**
             * Aerial roots: Present/absent
             * Root type: Fibrous, taproot, tuberous, rhizomatous
             * Bulbs/corms: Visible/not visible
             
             **OVERALL HABIT:**
             * Growth form: Tree, shrub, herb, vine, succulent
             * Height estimation (if visible)
             * Branching pattern
        
        
        Step 2: PART-BY-PART ANALYSIS (Systematic Examination).
           **CRITICAL**: Analyze EACH plant part SEPARATELY, then synthesize:
           
           A. LEAF ANALYSIS CONCLUSION:
              - Based on leaf features alone, possible species: [List 2-3 candidates]
              - Key diagnostic: [Most important leaf feature]
              - Confidence from leaves: [X]%
           
           B. STEM ANALYSIS CONCLUSION:
              - Based on stem features alone, possible species: [List 2-3 candidates]
              - Key diagnostic: [Most important stem feature]
              - Confidence from stem: [X]%
           
           C. FLOWER ANALYSIS CONCLUSION (if visible):
              - Based on flower features alone, possible species: [List 2-3 candidates]
              - Key diagnostic: [Most important flower feature]
              - Confidence from flowers: [X]%
           
           D. ROOT/BASE ANALYSIS CONCLUSION (if visible):
              - Based on root features alone, possible species: [List 2-3 candidates]
              - Key diagnostic: [Most important root feature]
              - Confidence from roots: [X]%
           
           E. SYNTHESIS OF PARTS:
              - Species that appear in MULTIPLE part analyses: [Final candidates]
              - Conflicting evidence (if any): [Explain discrepancies]
              - Overall morphological confidence: [X]%
        
        Step 3: COMPREHENSIVE MULTI-SOURCE VERIFICATION (Exhaustive Search).
           **CRITICAL**: Search FULL database + EXTERNAL sources before finalizing:
           
           A. INTERNAL DATABASE SEARCH (Complete Scan):
              - Search ALL entries in 'inventorySummary' (not just first 12)
              - Search FULL 'floraKnowledge' (all 5,839 species)
              - Match against biometric features database
              - Result: [Species found/not found in internal DB]
           
           B. EXTERNAL SCIENTIFIC DATABASE VERIFICATION:
              Cross-reference with your training data from:
              - **GBIF** (Global Biodiversity Information Facility): [Match Y/N]
              - **iNaturalist**: Community observations [Match Y/N]
              - **POWO** (Plants of the World Online - Kew Gardens): [Match Y/N]
              - **TROPICOS** (Missouri Botanical Garden): [Match Y/N]
              - **USDA Plants Database**: [Match Y/N]
              - **RHS Plant Finder**: [Match Y/N]
           
           C. SCIENTIFIC LITERATURE VERIFICATION:
              - Check against botanical keys in training (Flora of [Region])
              - Verify with taxonomic revisions
              - Confirm current accepted name (not synonym)
              - Result: [Confirmed/Needs review]
           
           D. IMAGE SIMILARITY VERIFICATION:
              - Compare uploaded image features with known specimens in training
              - Visual match confidence: [X]%
              - Similar species ruled out: [List]
           
           E. MULTI-SOURCE CONSENSUS:
              - Sources agreeing on identification: [X out of Y sources]
              - **FINALIZATION RULE**: Only finalize if ≥3 sources agree
              - Confidence score: [X]%
        
        Step 4: CONFIRM IDENTITY WITH COMPLETE NOMENCLATURE.
           **CRITICAL**: Provide FULL scientific + local names:
           
           A. SCIENTIFIC NOMENCLATURE:
              - **Accepted Scientific Name**: [Genus species Authority Year]
              - **Family**: [Family name]
              - **Order**: [Order name]
              - **Synonyms** (if any): [Old/alternative names]
              - **Common Name** (English): [Name]
           
           B. LOCAL/REGIONAL NAMES:
              - **Hindi**: [Name]
              - **Regional** (if known): [Name in local language]
              - **Vernacular**: [Traditional/folk name]
              - **Trade Name**: [Nursery/commercial name]
           
           C. ETYMOLOGY (The 'Why'):
        
        Step 5: BOTANIST'S IDENTIFICATION METHOD (How Species Are Determined).
           **CRITICAL**: Explain your identification process like a professional botanist:
           
           A. DICHOTOMOUS KEY APPROACH:
              - Start broad: "Is this a monocot or dicot?" (parallel vs. reticulate venation)
              - Narrow down: "Leaf arrangement? Flower parts in 3s or 4s/5s?"
              - Use elimination: "Not X because it lacks Y feature"
              - Example: "This is NOT a Pothos (lacks heart-shaped leaves), but IS a Philodendron (has fenestrations)"
           
           B. TAXONOMIC HIERARCHY IDENTIFICATION:
              - **Family**: Identify first (e.g., "Araceae family - presence of spathe and spadix")
              - **Genus**: Narrow to genus (e.g., "Monstera genus - large fenestrated leaves")
              - **Species**: Pinpoint species (e.g., "M. deliciosa - specific fenestration pattern")
              - **Cultivar** (if applicable): Note variety (e.g., "'Thai Constellation' - variegation pattern")
           
           C. DIAGNOSTIC FEATURES (Key Identifiers):
              - List 3-5 DIAGNOSTIC features that confirm identity
              - Example: "Confirmed as Ficus elastica by: 1) Thick, glossy leaves, 2) Red midrib, 3) Milky latex sap"
              - Explain WHY each feature is diagnostic
           
           D. FIELD NOTES FORMAT:
              Present findings like a botanist's field journal:
              
              === BOTANICAL IDENTIFICATION REPORT ===
              
              Specimen: [Common Name]
              Scientific Name: [Genus species]
              Family: [Family name]
              Confidence: [X]%
              
              DIAGNOSTIC FEATURES OBSERVED:
              1. [Feature 1] - [Why diagnostic]
              2. [Feature 2] - [Why diagnostic]
              3. [Feature 3] - [Why diagnostic]
              
              DIFFERENTIAL DIAGNOSIS:
              - Ruled out [Similar Species A]: Lacks [key feature]
              - Ruled out [Similar Species B]: Different [key feature]
              
              CONCLUSION: Identified as [Species] based on [key features]
              ==========================================
           
           E. VOUCHER SPECIMEN APPROACH:
              - Treat the uploaded image as a "voucher specimen"
              - Document observable features systematically
              - Note what CANNOT be determined from image (e.g., "Flower structure not visible")
              - Suggest additional photos needed for 100% certainty
        
        Step 5: PRESCRIBE TREATMENT (Evidence-Based).
           - Diagnose issues from visual cues (yellowing = nitrogen deficiency, brown tips = overwatering)
           - Provide actionable steps with scientific rationale

        💬 RESPONSE STYLE:
        - Be highly intelligent but accessible (like a friendly Oxford professor).
        - Use emojis sparingly but effectively (🌿, 🔬).
        - If you cite data (like light requirements), mention the source if available in the dossier.


        🎨 MANDATORY IMAGE GENERATION PROTOCOL (Ultra-Detailed):
        - Whenever the user asks to "see", "show", "generate", "create", or "draw" a plant or garden, you MUST include the [GENERATE: ...] tag.
        - The tag format MUST include MAXIMUM BOTANICAL DETAIL:
          [GENERATE: ultra high resolution, scientifically accurate botanical illustration of [PLANT NAME], showing:
           - Detailed leaf venation (pinnate/palmate/parallel veins clearly visible)
           - Leaf margin texture (serrations, lobes, or smooth edges)
           - Trichomes/surface texture (glossy, matte, hairy)
           - Flower anatomy (if applicable: petals, sepals, stamens, pistil with accurate count)
           - Stem structure (nodes, internodes, color)
           - Growth habit (upright, trailing, climbing)
           - Accurate botanical colors (not artistic interpretation)
           - Professional botanical illustration style with subtle labels]
        - DO NOT just describe the image in text; you MUST use the [GENERATE:] tag to trigger the visual engine.
        - Place the tag at the end of your response.

        If vague greeting: "Hello! I am Dr. Flora. How can I help your plants thrive today? 🌿"`;

        // 4. Construct the messages array
        console.log('[AI Doctor] Processing request. System Prompt defined.');

        const enhancedMessages = [
            { role: "system", content: systemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => ({
                role: m.role,
                content: m.content
            }))
        ];

        // --- UPGRADED MODEL SELECTION (2026) ---
        // Text Primary: Llama 3.3 70B Versatile (Latest, most capable)
        // Vision Primary: Llama 3.2 90B Vision (SOTA for plant identification)
        let model = "llama-3.3-70b-versatile"; // Upgraded from 3.1

        if (image) {
            console.log('[AI Doctor] 🔬 Vision request detected. Engaging Llama 3.2 90B Vision (SOTA).');
            // Llama 3.2 90B Vision - State of the Art for visual botanical analysis
            model = "llama-3.2-90b-vision-preview";

            // Attach image to the last user message
            const lastMsgIndex = enhancedMessages.length - 1;
            if (enhancedMessages[lastMsgIndex].role === 'user') {
                const textContent = typeof enhancedMessages[lastMsgIndex].content === 'string'
                    ? enhancedMessages[lastMsgIndex].content
                    : "Analyze this plant image.";

                enhancedMessages[lastMsgIndex].content = [
                    { type: "text", text: textContent },
                    { type: "image_url", image_url: { url: image } }
                ];
            }
        }

        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        // 5. Call Groq API (Multi-Stage Fallback Architecture)
        const callGroq = async (targetModel, customMessages = null) => {
            try {
                const payloadMessages = customMessages || enhancedMessages;
                const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: targetModel,
                        messages: payloadMessages,
                        max_tokens: 8192,
                        temperature: 0.3,
                        top_p: 0.9,
                        frequency_penalty: 0.3,
                        presence_penalty: 0.2
                    })
                });

                const json = await resp.json();

                // Extract Neural Usage Metadata
                const usageMeta = {
                    remaining: resp.headers.get('x-ratelimit-remaining-tokens') || resp.headers.get('x-ratelimit-remaining-tokens-on-demand'),
                    limit: resp.headers.get('x-ratelimit-limit-tokens') || resp.headers.get('x-ratelimit-limit-tokens-on-demand'),
                    reset: resp.headers.get('x-ratelimit-reset-tokens'),
                    total_usage: json.usage
                };

                if (json && typeof json === 'object') {
                    json.usageMeta = usageMeta;
                }

                return { ok: resp.ok, data: json, status: resp.status };
            } catch (err) {
                return { ok: false, data: { error: { message: err.message } } };
            }
        };

        // 5b. Call OpenRouter API (Fallback Provider)
        const callOpenRouter = async (targetModel, customMessages = null) => {
            if (!openRouterApiKey) return { ok: false, data: { error: { message: "OpenRouter API Key missing" } } };

            try {
                console.log(`[AI Doctor] 🔄 Switching to OpenRouter (Model: ${targetModel})...`);
                const payloadMessages = customMessages || enhancedMessages;
                const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openRouterApiKey}`,
                        "HTTP-Referer": "https://vanamap.online", // Required by OpenRouter
                        "X-Title": "VanaMap AI Doctor"
                    },
                    body: JSON.stringify({
                        model: targetModel,
                        messages: payloadMessages,
                        max_tokens: 4000,
                        temperature: 0.3
                    })
                });

                const json = await resp.json();
                return { ok: resp.ok, data: json, status: resp.status };
            } catch (err) {
                console.error("[OpenRouter] Error:", err.message);
                return { ok: false, data: { error: { message: err.message } } };
            }
        };

        // --- ENSEMBLE LOGIC (The "Council of Experts") ---
        let result = { ok: false };

        // If this is a vision request, use PARALLEL ENSEMBLE
        if (image && model === "llama-3.2-90b-vision-preview") {
            console.log('[AI Doctor] 🧠 Starting Neural Ensemble Analysis (Parallel Execution)...');

            // UPGRADED EXPERT ENSEMBLE (2026)
            const experts = [
                { id: "llama-3.2-90b-vision-preview", role: "Senior Botanist (Llama 3.2 90B Vision)", provider: 'groq' },
                { id: "llama-3.2-11b-vision-preview", role: "Field Botanist (Llama 3.2 11B Vision)", provider: 'groq' },
                { id: "deepseek/deepseek-r1", role: "Strategic Reasoner (DeepSeek R1)", provider: 'openrouter' }, // Latest DeepSeek
                { id: "google/gemini-2.0-flash-thinking-exp:free", role: "Vision Analyst (Gemini 2.0 Flash)", provider: 'openrouter' } // Upgraded from LLaVA
            ];

            const visionResults = await Promise.all(experts.map(async (expert) => {
                console.log(`[AI Doctor] ⚡ Triggering ${expert.role}...`);
                let expertResponse;

                // Input Sanitization: DeepSeek R1 is a REASONING model, not necessarily vision. 
                // We give it the pure text context (User description + Flora DB) to check for logic/scientific consistency.
                const isTextOnly = expert.id.includes('deepseek');
                const payloadMessages = isTextOnly
                    ? enhancedMessages.map(m => {
                        if (Array.isArray(m.content)) {
                            // Strip image, keep text
                            const textPart = m.content.find(c => c.type === 'text');
                            return { role: m.role, content: textPart ? textPart.text : "Analyze the botanical context provided." };
                        }
                        return m;
                    })
                    : enhancedMessages; // Vision models get the image

                if (expert.provider === 'openrouter') {
                    expertResponse = await callOpenRouter(expert.id, payloadMessages);
                } else {
                    expertResponse = await callGroq(expert.id, payloadMessages);
                }

                return {
                    model: expert.role,
                    content: expertResponse.ok ? expertResponse.data.choices[0]?.message?.content : null
                };
            }));

            const validOpinions = visionResults.filter(r => r.content);
            console.log(`[AI Doctor] 🧠 Ensemble: ${validOpinions.length}/${experts.length} experts reported.`);

            if (validOpinions.length > 0) {
                console.log('[AI Doctor] 🖋️ Synthesizing Final Diagnosis with Groq...');

                const synthesisPrompt = `You are Dr. Flora. Synthesize these plant analyses into ONE PERFECT answer.
                
                WE HAVE A SPECIAL GUEST EXPERT: DEEPSEEK R1 (Strategic Botanist). 
                Pay special attention to its logical reasoning and scientific data cross-referencing.

${validOpinions.map((op, i) => `EXPERT ${i + 1} (${op.model}): ${op.content}`).join('\n\n')}

CRITICAL INSTRUCTIONS:
1. Compare all expert findings and create a unified identification.
2. If DeepSeek contradicts the Vision models, analyze WHY (did the text description match the science better?).
3. Output with HIGH confidence.
4. EXPLAIN the scientific name (Etymology).
5. Provide COMPLETE nomenclature (Scientific + Hindi + Regional).
6. **MANDATORY**: Include a [GENERATE: ...] tag with ultra-detailed botanical illustration prompt.

REMEMBER: Your response must include BOTH the identification analysis AND the [GENERATE] tag for visualization!`;

                const synthesisMessages = [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: synthesisPrompt }
                ];

                // Use latest Llama 3.3 for synthesis
                result = await callGroq("llama-3.3-70b-versatile", synthesisMessages);

                // If synthesis fails, try DeepSeek R1 for reasoning-based synthesis
                if (!result.ok) {
                    console.log('[AI Doctor] Synthesis fallback: Trying DeepSeek R1...');
                    result = await callOpenRouter("deepseek/deepseek-r1", synthesisMessages);
                }
            } else {
                console.warn('[AI Doctor] All ensemble experts failed. Preparing for External Fallback.');
                result = { ok: false };
            }
        } else {
            // Text-Only Flow: Use DeepSeek as a backup or alternate? 
            // Let's stick to Primary Groq for speed, but add DeepSeek as the FIRST fallback for text.
            console.log(`[AI Doctor] Attempting Primary Groq Model: ${model}`);
            result = await callGroq(model);

            // UPGRADED TEXT FALLBACK CASCADE
            if (!result.ok) {
                console.log("[AI Doctor] ⚠️ Primary failed. Cascading through upgraded models...");

                // Fallback 1: DeepSeek R1 (Latest reasoning model)
                result = await callOpenRouter("deepseek/deepseek-r1");

                // Fallback 2: Gemini 2.0 Flash Thinking
                if (!result.ok) {
                    console.log("[AI Doctor] ⚠️⚠️ Trying Gemini 2.0 Flash Thinking...");
                    result = await callOpenRouter("google/gemini-2.0-flash-thinking-exp:free");
                }

                // Fallback 3: Claude 3.5 Haiku (Fast & Efficient)
                if (!result.ok) {
                    console.log("[AI Doctor] ⚠️⚠️⚠️ Trying Claude 3.5 Haiku...");
                    result = await callOpenRouter("anthropic/claude-3.5-haiku:free");
                }
            }
        }

        // --- TRIPLE-STAGE FALLBACK LOGIC (GROQ INTERNAL) ---
        if (!result.ok || result.data.error) {
            console.warn(`[AI Doctor] Primary model ${model} failed (Status: ${result.status}). Trying Groq fallback sequence...`);

            // FALLBACK STAGE 1: Standard Vision (11B)
            if (image && model === "llama-3.2-90b-vision-preview") {
                const expert2 = "llama-3.2-11b-vision-preview";
                console.log(`[AI Doctor] ⚠️ Vision Fallback 1: Engaging Field Botanist (${expert2})`);
                result = await callGroq(expert2);

                // FALLBACK STAGE 2: Open Source Vision (LLaVA)
                if (!result.ok || result.data.error) {
                    const expert3 = "llava-v1.5-7b-4096-preview";
                    console.log(`[AI Doctor] ⚠️⚠️ Vision Fallback 2: Engaging Research Analyst (${expert3})`);
                    result = await callGroq(expert3);
                }
            }

            // FALLBACK STAGE 3: High-Speed Text-Only (Upgraded)
            if (!result.ok || result.data.error) {
                console.warn('[AI Doctor] Vision falling back to High-Speed Text Engine.');
                const bulletproofModel = "llama-3.3-70b-versatile"; // Upgraded from 3.1-8b

                // Helper to strip images
                const stripValidation = (msgs) => msgs.map(m => {
                    if (Array.isArray(m.content)) {
                        const textPart = m.content.find(c => c.type === 'text');
                        return { role: m.role, content: textPart ? textPart.text + " (Image analysis unavailable, falling back to text description.)" : m.content };
                    }
                    return m;
                });

                result = await callGroq(bulletproofModel, stripValidation(enhancedMessages));
            }
        }

        // --- ULTIMATE SAFETY NET: OPENROUTER (EXTERNAL) ---
        // If Groq is completely down or rate limited (429), switch to OpenRouter
        if (!result.ok || (result.data && result.data.error)) {
            console.error("[AI Doctor] 🚨 ALL GROQ MODELS FAILED. INITIATING OPENROUTER EMERGENCY PROTOCOL.");

            // ULTIMATE FALLBACK CASCADE (Multiple Providers)
            const ultimateFallbacks = [
                { model: "google/gemini-2.0-flash-thinking-exp:free", name: "Gemini 2.0 Flash Thinking" },
                { model: "deepseek/deepseek-r1", name: "DeepSeek R1" },
                { model: "anthropic/claude-3.5-haiku:free", name: "Claude 3.5 Haiku" },
                { model: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
                { model: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
                { model: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B" }
            ];

            for (const fallback of ultimateFallbacks) {
                console.log(`[AI Doctor] 🆘 Trying ${fallback.name}...`);
                result = await callOpenRouter(fallback.model);
                if (result.ok) {
                    console.log(`[AI Doctor] ✅ Success with ${fallback.name}!`);
                    break;
                }
            }
        }

        // 6. Handle Final Result
        if (!result.ok) {
            console.error("AI API Fatal Error:", result.data);

            // Rate Limit specific message
            if (result.data.error?.message?.includes('rate_limit') || result.status === 429) {
                return res.status(429).json({
                    error: 'Dr. Flora is currently overwhelmed by many patients! 🌿 Please try again in 1 minute.',
                    retryAfter: '60s'
                });
            }

            return res.status(result.status || 500).json(result.data || { error: "AI Service Unavailable" });
        }

        // --- FLUX.1 DEV IMAGE GENERATION INTERVENTION ---
        let aiContent = result.data.choices[0]?.message?.content || "";

        // Match [GENERATE: prompt] OR [Image description: prompt] (with multi-line support)
        // This regex now handles multi-line content including bullet points
        const generateRegex = /\[(?:GENERATE|Image description):\s*([\s\S]+?)\]/i;
        const match = aiContent.match(generateRegex);

        if (match) {
            let prompt = match[1].trim();

            // Clean up the prompt: remove bullet points and excessive newlines
            prompt = prompt
                .replace(/^[\s•\-*]+/gm, '') // Remove bullet points at start of lines
                .replace(/\n+/g, ' ') // Replace newlines with spaces
                .replace(/\s+/g, ' ') // Normalize multiple spaces
                .trim();

            console.log(`[Flux.1 Dev] Generating image for prompt: ${prompt}`);

            // ADVANCEMENT: Enhance the user prompt with botanical intelligence
            const enhancedPrompt = FloraIntelligence.enhanceGenerationPrompt(prompt, matchedFloraBatch);
            const seed = Math.floor(Math.random() * 1000000);

            // RELIABILITY UPGRADE: Return two images (Flux + SDXL) for a better comparison
            const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=896&height=896&model=flux&seed=${seed}&nologo=true`;
            const sdxlUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=896&height=896&model=flux-realism&seed=${seed + 1}&enhance=true&nologo=true`;

            // Inject multi-image support
            result.data.choices[0].message.images = [fluxUrl, sdxlUrl];
            // Backward compatibility & Primary display
            result.data.choices[0].message.image = fluxUrl;

            // Remove the [GENERATE:...] tag from the visible text (handle multi-line)
            aiContent = aiContent.replace(generateRegex, "").trim();

            // Overwrite response content
            result.data.choices[0].message.content = aiContent;

            console.log(`[Flux.1 Dev] Dual-AI Images integrated: ${fluxUrl} and ${sdxlUrl}`);
        } else {
            console.log('[Flux.1 Dev] No GENERATE tag found in response');
        }

        // Debug: Log the final response structure
        console.log('[AI Doctor] Response structure:', {
            hasImages: !!result.data.choices[0]?.message?.images,
            imageCount: result.data.choices[0]?.message?.images?.length || 0,
            hasImage: !!result.data.choices[0]?.message?.image,
            contentLength: result.data.choices[0]?.message?.content?.length || 0
        });

        console.log('[AI Doctor] Success!');
        res.json(result.data);

    } catch (e) {
        console.error("Chat API Error:", e);
        res.json({
            choices: [{
                message: {
                    role: "assistant",
                    content: "I seem to be having trouble connecting to my knowledge base at the moment. Please try asking your question again in a few moments."
                }
            }]
        });
    }
});

// --- IMAGE GENERATION PROXY ---
app.get('/api/generate-image', (req, res) => {
    try {
        const { prompt, width = 1024, height = 1024, seed, model = 'flux', enhance = 'false' } = req.query;

        if (!prompt) {
            return res.status(400).send('Prompt required');
        }

        // Construct Pollinations URL
        const safePrompt = encodeURIComponent(prompt);
        const seedParam = seed ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
        const enhanceParam = enhance === 'true' ? '&enhance=true' : '';
        const nologoParam = '&nologo=true';

        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=${width}&height=${height}&model=${model}${seedParam}${enhanceParam}${nologoParam}`;

        // Redirect client to fetch image directly (faster, low bandwidth)
        res.redirect(imageUrl);

    } catch (e) {
        console.error("Image Gen Error:", e);
        res.status(500).send("Generation failed");
    }
});

app.post('/api/chat/feedback', async (req, res) => {
    try {
        const { query, response, rating, userId } = req.body;
        console.log(`[AI Learning] New feedback: ${rating} for "${query.substring(0, 20)}..."`);

        await new AIFeedback({
            query,
            response,
            rating,
            userId
        }).save();

        res.json({ success: true, message: "Feedback recorded for training" });
    } catch (e) {
        console.error("Feedback Log Error:", e);
        res.status(500).json({ error: "Failed to log feedback" });
    }
});

// --- VOICE SYNTHESIS (ELEVENLABS) ---

// Advanced Voice Personality Configurations
// Each voice has unique tonal characteristics for distinct experiences
const VOICE_PERSONALITIES = {
    "XB0fDUnXU5powFXDhCwa": { // Charlotte - Mystical & Soothing
        name: "Charlotte",
        style: "Mystical & Soothing",
        description: "The classic voice of Dr. Flora.",
        settings: {
            stability: 0.65,           // Higher stability for calm, consistent tone
            similarity_boost: 0.85,    // Strong character adherence for mystical quality
            style: 0.40,               // Moderate style for soothing expression
            use_speaker_boost: true    // Enhanced clarity
        }
    },
    "21m00Tcm4TlvDq8ikWAM": { // Rachel - Narrative & Clear
        name: "Rachel",
        style: "Narrative & Clear",
        description: "Professional and well-articulated.",
        settings: {
            stability: 0.75,           // Very stable for professional delivery
            similarity_boost: 0.80,    // Strong character for clear articulation
            style: 0.25,               // Lower style for neutral, professional tone
            use_speaker_boost: true
        }
    },
    "AZnzlk1XvdvUeBnXmlld": { // Domi - Strong & Emotive
        name: "Domi",
        style: "Strong & Emotive",
        description: "Engaging and confident presence.",
        settings: {
            stability: 0.45,           // Lower stability for more emotional variation
            similarity_boost: 0.75,    // Balanced for expressive delivery
            style: 0.65,               // Higher style for emotive expression
            use_speaker_boost: true
        }
    },
    "MF3mGyEYCl7XYWbV9V6O": { // Elli - Warm & Friendly
        name: "Elli",
        style: "Warm & Friendly",
        description: "Younger, cheerful energy.",
        settings: {
            stability: 0.50,           // Moderate stability for friendly variation
            similarity_boost: 0.70,    // Balanced for warm, natural tone
            style: 0.55,               // Higher style for cheerful expression
            use_speaker_boost: true
        }
    },
    "piTKgcLEGmPE4e6mEKli": { // Nicole - Whisper & Calm
        name: "Nicole",
        style: "Whisper & Calm",
        description: "Perfect for relaxing plant care advice.",
        settings: {
            stability: 0.70,           // High stability for consistent whisper
            similarity_boost: 0.90,    // Very high for authentic whisper quality
            style: 0.30,               // Lower style for gentle, calm delivery
            use_speaker_boost: false   // No boost for natural whisper
        }
    }
};

// Curated list for frontend display
const AVAILABLE_VOICES = Object.entries(VOICE_PERSONALITIES).map(([id, config]) => ({
    id,
    name: config.name,
    style: config.style,
    description: config.description
}));

app.get('/api/chat/voices', (req, res) => {
    res.json(AVAILABLE_VOICES);
});

app.post('/api/chat/speak', auth, async (req, res) => {
    try {
        const { text, voiceId } = req.body;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

        if (!text) return res.status(400).json({ error: "Text required" });
        if (!ELEVENLABS_API_KEY) return res.status(503).json({ error: "Voice service not configured" });

        // Use requested voice or fallback to Charlotte
        const targetVoiceId = voiceId || "XB0fDUnXU5powFXDhCwa";
        const voiceConfig = VOICE_PERSONALITIES[targetVoiceId];

        if (!voiceConfig) {
            return res.status(400).json({ error: "Invalid voice ID" });
        }

        console.log(`[Dr. Flora Voice] Synthesizing with ${voiceConfig.name} (${voiceConfig.style}): "${text.substring(0, 30)}..."`);

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}/stream`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5", // Latest model for best quality
                voice_settings: voiceConfig.settings,
                optimize_streaming_latency: 3 // Optimized for quality + speed
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail?.message || "Voice API failed");
        }

        // Pipe the audio directly to the client
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('X-Voice-Name', voiceConfig.name);
        res.setHeader('X-Voice-Style', voiceConfig.style);

        const { pipeline } = require('stream');
        const { promisify } = require('util');
        const streamPipeline = promisify(pipeline);

        await streamPipeline(response.body, res);

        console.log(`[Dr. Flora Voice] ✓ Successfully synthesized with ${voiceConfig.name}`);

    } catch (e) {
        console.error("Voice Error:", e.message);
        res.status(500).json({ error: "Dr. Flora lost her voice temporarily!" });
    }
});

// --- AI-POWERED TRANSLATION ENDPOINTS ---
// Context-aware translation for botanical terms and plant descriptions

app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang, context } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Text and target language required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Translation service not configured' });
        }

        // Language name mapping for better AI understanding
        const langNames = {
            'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi', 'ta': 'Tamil',
            'ur': 'Urdu', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'or': 'Odia',
            'pa': 'Punjabi', 'as': 'Assamese', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
            'zh': 'Chinese', 'ar': 'Arabic'
        };

        const targetLanguageName = langNames[targetLang] || targetLang;
        const contextHint = context === 'botanical'
            ? 'This is botanical/plant-related content. Preserve scientific names and technical terms accurately.'
            : '';

        const prompt = `Translate the following English text to ${targetLanguageName}. ${contextHint}

IMPORTANT RULES:
1. Maintain the original meaning and tone
2. Keep botanical / scientific names in their original form(e.g., "Monstera deliciosa" stays as is)
3. Preserve formatting(line breaks, bullet points)
4. Use natural, fluent ${targetLanguageName}
5. For plant care instructions, use culturally appropriate terms

Text to translate:
${text}

Provide ONLY the translation, no explanations.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey} `
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.3 // Lower temperature for more accurate translations
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translatedText = data.choices[0].message.content.trim();
            res.json({ translatedText });
        } else {
            throw new Error('Translation failed');
        }

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', originalText: req.body.text });
    }
});

app.post('/api/translate-batch', async (req, res) => {
    try {
        const { texts, targetLang, context } = req.body;

        if (!texts || !Array.isArray(texts) || !targetLang) {
            return res.status(400).json({ error: 'Texts array and target language required' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Translation service not configured' });
        }

        const langNames = {
            'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi', 'ta': 'Tamil',
            'ur': 'Urdu', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'or': 'Odia',
            'pa': 'Punjabi', 'as': 'Assamese', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
            'zh': 'Chinese', 'ar': 'Arabic'
        };

        const targetLanguageName = langNames[targetLang] || targetLang;
        const contextHint = context === 'botanical'
            ? 'This is botanical/plant-related content. Preserve scientific names accurately.'
            : '';

        // Batch translate for efficiency
        const numberedTexts = texts.map((t, i) => `${i + 1}. ${t} `).join('\n');

        const prompt = `Translate the following numbered English texts to ${targetLanguageName}. ${contextHint}

RULES:
1. Preserve scientific / botanical names
2. Keep the numbering format
3. Use natural ${targetLanguageName}

Texts:
${numberedTexts}

Provide translations in the same numbered format.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey} `
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translatedText = data.choices[0].message.content.trim();
            // Parse numbered responses
            const translations = translatedText.split('\n')
                .filter(line => /^\d+\./.test(line))
                .map(line => line.replace(/^\d+\.\s*/, '').trim());

            res.json({ translations: translations.length === texts.length ? translations : texts });
        } else {
            throw new Error('Batch translation failed');
        }

    } catch (error) {
        console.error('Batch translation error:', error);
        res.status(500).json({ error: 'Batch translation failed', translations: req.body.texts });
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
    return `🌿 ** Dr.Flora here! **\n\nI'm currently running in offline mode, but I'm still here to help!\n\nYou asked: "${userMessage}"\n\n ** Common Plant Care Topics:**\n - 💧 Watering schedules\n - ☀️ Light requirements\n - 🌱 Fertilizing tips\n - 🐛 Pest control\n - ⚠️ Disease diagnosis\n - 🪴 Repotting advice\n\nCould you be more specific about what you'd like to know? For example:\n- "How often should I water my monstera?"\n- "Why are my plant's leaves turning yellow ? "\n- "What's the best fertilizer for succulents?"\n\nI'm here to help your plants thrive! 🌱`;
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

// --- MULTI-AI IMAGE GENERATION ENGINE (Dual-Model Support) ---
app.get('/api/generate-image', async (req, res) => {
    const { prompt, seed, width = 896, height = 896, model: requestedModel } = req.query;

    // Fixed model sequence: if a model is requested, try it first, then fallback
    const models = requestedModel ? [requestedModel, 'turbo', 'flux', 'any'] : ['turbo', 'flux', 'flux-realism', 'any'];

    for (const model of models) {
        try {
            console.log(`[Multi-AI] Attempting generation with model: ${model}`);
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&width=${width}&height=${height}&nologo=true&format=png`;

            const response = await fetch(pollinationsUrl);

            // If the response is not OK (like a 429 Rate Limit), try next model
            if (!response.ok) {
                console.warn(`[Multi-AI] Model ${model} failed (Status: ${response.status}). Trying fallback...`);
                continue;
            }

            // Check if it's the specific "Rate Limit" image (sometimes Pollinations returns 200 with an error image)
            // We can check Content-Length or just hope SDXL/Turbo has different limits
            const buffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(buffer);

            // If the buffer is suspiciously small (like the "Rate Limit" placeholder), try next
            if (imageBuffer.length < 50000 && model === 'flux') { // Real Flux images are usually > 200KB
                console.warn(`[Multi-AI] Model ${model} returned a suspiciously small image. Likely rate-limited. Trying fallback...`);
                continue;
            }

            // Success! Send the image
            res.set('Content-Type', 'image/png');
            res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h
            return res.send(imageBuffer);

        } catch (err) {
            console.error(`[Multi-AI] Error with model ${model}:`, err.message);
            continue;
        }
    }

    res.status(500).json({ error: 'All image generation models are currently limited. Please try again later.' });
});

// --- IMAGE PROXY FOR RELIABLE DOWNLOADS ---
app.get('/api/proxy-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        // If it's a generate-image URL, handle it recursively or just fetch it
        console.log(`[Proxy] Fetching image for download: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'image/png';

        res.set('Content-Type', contentType);
        res.set('Content-Disposition', 'attachment; filename="DrFlora-Botanical-Art.png"');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(buffer);
    } catch (err) {
        console.error('[Proxy Error]', err.message);
        res.status(500).json({ error: 'Failed to proxy image' });
    }
});

// --- LOCATION-BASED ANALYTICS FOR VENDORS ---
app.get('/api/analytics/nearby-users', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'vendor') {
            return res.status(403).json({ error: 'Vendor access only' });
        }

        // Get vendor's location
        const vendor = await Vendor.findOne({ id: user.email });
        if (!vendor || !vendor.latitude || !vendor.longitude) {
            return res.status(400).json({ error: 'Vendor location not set' });
        }

        // Get all users with location data
        const users = await User.find({
            latitude: { $exists: true, $ne: null },
            longitude: { $exists: true, $ne: null }
        }).select('latitude longitude city state country createdAt');

        // Calculate distance for each user
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const usersWithDistance = users.map(u => ({
            city: u.city,
            state: u.state,
            country: u.country,
            distance: calculateDistance(vendor.latitude, vendor.longitude, u.latitude, u.longitude),
            joinedDate: u.createdAt
        }));

        // Group by distance ranges
        const analytics = {
            total: users.length,
            within5km: usersWithDistance.filter(u => u.distance <= 5).length,
            within10km: usersWithDistance.filter(u => u.distance <= 10).length,
            within25km: usersWithDistance.filter(u => u.distance <= 25).length,
            within50km: usersWithDistance.filter(u => u.distance <= 50).length,
            byCity: {},
            byState: {}
        };

        // Group by city and state
        usersWithDistance.forEach(u => {
            if (u.city) {
                analytics.byCity[u.city] = (analytics.byCity[u.city] || 0) + 1;
            }
            if (u.state) {
                analytics.byState[u.state] = (analytics.byState[u.state] || 0) + 1;
            }
        });

        res.json(analytics);
    } catch (error) {
        console.error('[Analytics] Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// --- EMAIL SUPPORT SYSTEM ---

// Endpoint for Contact Form Submissions
app.post('/api/support/contact', async (req, res) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        // Save to database as a SupportEmail (so it shows in Admin UI)
        const supportEmail = new SupportEmail({
            messageId: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: `${name || 'User'} <${email}>`,
            to: 'support@vanamap.online',
            subject: subject || 'New Contact Form Submission',
            text: message,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
            receivedAt: new Date(),
            status: 'unread',
            priority: 'medium',
            assignedTo: userId // Optional: link to logged-in user
        });

        await supportEmail.save();
        console.log(`[Support Form] New message from ${email}`);

        // Send Auto-Reply via Resend
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'VanaMap Support <support@vanamap.online>',
                    to: email,
                    subject: `Received: ${subject || 'Contact Request'}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <div style="text-align: center; padding: 20px 0;">
                                <img src="https://vanamap.online/support-avatar.jpg" alt="VanaMap Support" style="width: 64px; height: 64px; border-radius: 50%;">
                            </div>
                            <div style="background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                                <h2 style="color: #10b981; margin-top: 0; text-align: center;">Message Received!</h2>
                                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Hi ${name || 'there'},
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Thanks for reaching out to VanaMap Support! This is an automated message to confirm that we've received your request.
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Our team will review your message and get back to you within 24 hours.
                                </p>
                                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
                                    <strong style="display: block; margin-bottom: 8px; color: #1f2937;">Your Message:</strong>
                                    <p style="margin: 0; color: #4b5563; font-style: italic;">"${message}"</p>
                                </div>
                                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                                    © 2026 VanaMap. All rights reserved.
                                </p>
                            </div>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error('[Support Form] Auto-reply failed:', emailError);
                // Don't fail the request if auto-reply fails
            }
        }

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('[Support Form] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook to receive emails from Resend
app.post('/api/webhooks/resend-email', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        // Verify webhook signature (if Resend provides one)
        // const signature = req.headers['resend-signature'];
        // TODO: Implement signature verification when Resend supports it

        const event = JSON.parse(req.body.toString());

        if (event.type === 'email.received') {
            const emailData = event.data;

            // Save email to database
            const supportEmail = new SupportEmail({
                messageId: emailData.message_id || emailData.id,
                from: emailData.from,
                to: emailData.to,
                subject: emailData.subject || '(No Subject)',
                text: emailData.text || '',
                html: emailData.html || '',
                receivedAt: new Date(emailData.created_at || Date.now()),
                status: 'unread',
                priority: 'medium',
                attachments: emailData.attachments || []
            });

            await supportEmail.save();
            console.log(`[Support Email] New email received from ${emailData.from}: ${emailData.subject}`);

            // Send auto-reply
            if (resend) {
                try {
                    await resend.emails.send({
                        from: 'VanaMap Support <support@vanamap.online>',
                        to: emailData.from,
                        subject: `Re: ${emailData.subject || 'Your message'}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #10b981;">Thank you for contacting VanaMap Support!</h2>
                                <p>We've received your message and will get back to you within 24 hours.</p>
                                <p><strong>Your message:</strong></p>
                                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                    ${emailData.text || emailData.html || ''}
                                </div>
                                <p>If your issue is urgent, you can also reach us on WhatsApp: <a href="https://wa.me/919188773534">+91 91887 73534</a></p>
                                <p style="color: #6b7280; font-size: 14px;">Best regards,<br>VanaMap Support Team</p>
                            </div>
                        `
                    });
                    console.log(`[Support Email] Auto-reply sent to ${emailData.from}`);
                } catch (e) {
                    console.error('[Support Email] Auto-reply failed:', e.message);
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Support Email Webhook] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all support emails (Admin only)
// --- PUBLIC SUPPORT ENDPOINTS ---

// Handle Contact Form Submissions
app.post('/api/support/contact', async (req, res) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        // 1. Save to Database
        const newTicket = new SupportEmail({
            from: email,
            fromName: name,
            subject: subject || 'No Subject',
            text: message,
            userId: userId || null, // Optional: Link to user if logged in
            status: 'unread',
            priority: 'normal',
            source: 'web_form',
            receivedAt: new Date()
        });
        await newTicket.save();

        // 2. Send Auto-Reply
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'VanaMap Support <support@vanamap.online>',
                    to: email,
                    subject: `Re: ${subject || 'Support Request'} - [Received]`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <img src="https://vanamap.online/support-avatar.jpg" alt="VanaMap Support" style="width: 64px; height: 64px; border-radius: 50%; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                                <h2 style="color: #059669; margin: 16px 0 8px;">Message Received</h2>
                            </div>
                            
                            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <p style="margin-top: 0;">Hi <strong>${name || 'there'}</strong>,</p>
                                <p>Thanks for reaching out! We've received your message and created a support ticket.</p>
                                <p>Our team will review it and get back to you as soon as possible.</p>
                                
                                <div style="margin: 24px 0; padding: 16px; background: #ffffff; border-left: 4px solid #10b981; border-radius: 0 4px 4px 0;">
                                    <p style="margin: 0; color: #64748b; font-size: 0.9em; font-weight: 500; margin-bottom: 4px;">You wrote:</p>
                                    <p style="margin: 0; color: #334155; font-style: italic;">"${message}"</p>
                                </div>

                                <p style="margin-bottom: 0;">Best regards,<br><strong>VanaMap Support Team</strong></p>
                                <p style="font-size: 0.8em; color: #94a3b8; margin-top: 8px;"><a href="https://vanamap.online" style="color: #10b981; text-decoration: none;">vanamap.online</a></p>
                            </div>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.error("Auto-reply failed:", emailErr);
                // Don't fail the request if auto-reply fails
            }
        }

        // 3. Clear Cache (so admin panel sees new count immediately)
        cache.del('support_stats');

        res.status(201).json({ success: true, message: 'Ticket created', id: newTicket._id });
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN SUPPORT DASHBOARD ENDPOINTS ---

app.get('/api/admin/support-emails', auth, admin, async (req, res) => {
    try {
        const { status, priority, search, limit = 50, skip = 0 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { from: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { text: { $regex: search, $options: 'i' } }
            ];
        }

        const emails = await SupportEmail.find(filter)
            .sort({ receivedAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await SupportEmail.countDocuments(filter);
        const unreadCount = await SupportEmail.countDocuments({ status: 'unread' });

        res.json({
            emails,
            total,
            unreadCount,
            hasMore: total > (parseInt(skip) + parseInt(limit))
        });
    } catch (error) {
        console.error('[Support Emails] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single support email (Admin only)
app.get('/api/admin/support-emails/:id', auth, admin, async (req, res) => {
    try {
        const email = await SupportEmail.findById(req.params.id);
        if (!email) return res.status(404).json({ error: 'Email not found' });

        // Mark as read
        if (email.status === 'unread') {
            email.status = 'read';
            await email.save();
        }

        res.json(email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN BROADCAST ENDPOINTS ---

// Search users for broadcast
app.get('/api/admin/search-users', auth, admin, async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ users: [] });

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('id name email phone role');

        const mappedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role
        }));

        res.json({ users: mappedUsers });
    } catch (error) {
        console.error('Search Users Error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Send broadcast
app.post('/api/admin/broadcast', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const { recipientType, subject, messageText, recipientId } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        let recipients = [];
        if (recipientType === 'single') {
            if (!recipientId) return res.status(400).json({ error: 'Recipient ID required' });
            const user = await User.findById(recipientId);
            if (user) recipients.push(user);
        } else {
            // All users (active)
            recipients = await User.find({}).select('email name');
        }

        if (recipients.length === 0) {
            return res.status(404).json({ error: 'No recipients found' });
        }

        // Send via Resend
        if (resend) {
            // Process in chunks of 50
            const chunkSize = 50;
            for (let i = 0; i < recipients.length; i += chunkSize) {
                const chunk = recipients.slice(i, i + chunkSize);
                await Promise.all(chunk.map(user =>
                    resend.emails.send({
                        from: 'VanaMap Updates <updates@vanamap.online>',
                        to: user.email,
                        subject: subject,
                        html: `
                            <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
                                ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 24px;" />` : ''}
                                <div style="font-size: 16px; line-height: 1.6;">${messageText.replace(/\n/g, '<br>')}</div>
                                <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e2e8f0;">
                                <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                                    Sent via VanaMap Broadcast Center • <a href="https://vanamap.online" style="color: #94a3b8;">Unsubscribe</a>
                                </p>
                            </div>
                        `
                    }).catch(e => console.error(`Failed to send to ${user.email}`, e))
                ));
            }
        }

        res.json({ success: true, recipientCount: recipients.length });
    } catch (error) {
        console.error('Broadcast Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update email status (Admin only)
app.put('/api/admin/support-emails/:id/status', auth, admin, async (req, res) => {
    try {
        const { status, priority, assignedTo, tags } = req.body;

        const email = await SupportEmail.findById(req.params.id);
        if (!email) return res.status(404).json({ error: 'Email not found' });

        if (status) email.status = status;
        if (priority) email.priority = priority;
        if (assignedTo !== undefined) email.assignedTo = assignedTo;
        if (tags) email.tags = tags;

        await email.save();
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reply to support email (Admin only)
app.post('/api/admin/support-emails/:id/reply', auth, admin, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const email = await SupportEmail.findById(req.params.id);
        if (!email) return res.status(404).json({ error: 'Email not found' });

        // Send reply via Resend
        if (resend) {
            await resend.emails.send({
                from: 'VanaMap Support <support@vanamap.online>',
                to: email.from,
                subject: `Re: ${email.subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">VanaMap Support Response</h2>
                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            ${message}
                        </div>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #6b7280; font-size: 14px;"><strong>Original message:</strong></p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                            ${email.html || email.text}
                        </div>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                            Best regards,<br>
                            VanaMap Support Team<br>
                            <a href="https://vanamap.online">vanamap.online</a>
                        </p>
                    </div>
                `
            });
        }

        // Update email record
        email.reply = {
            message,
            sentAt: new Date(),
            sentBy: req.user.email
        };
        email.status = 'replied';
        await email.save();

        res.json({ success: true, email });
    } catch (error) {
        console.error('[Support Reply] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete support email (Admin only)
app.delete('/api/admin/support-emails/:id', auth, admin, async (req, res) => {
    try {
        await SupportEmail.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get support email statistics (Admin only)
app.get('/api/admin/support-stats', auth, admin, async (req, res) => {
    try {
        const total = await SupportEmail.countDocuments();
        const unread = await SupportEmail.countDocuments({ status: 'unread' });
        const replied = await SupportEmail.countDocuments({ status: 'replied' });
        const archived = await SupportEmail.countDocuments({ status: 'archived' });

        // Average response time (for replied emails)
        const repliedEmails = await SupportEmail.find({ status: 'replied', 'reply.sentAt': { $exists: true } });
        let avgResponseTime = 0;
        if (repliedEmails.length > 0) {
            const totalResponseTime = repliedEmails.reduce((sum, email) => {
                const responseTime = new Date(email.reply.sentAt) - new Date(email.receivedAt);
                return sum + responseTime;
            }, 0);
            avgResponseTime = totalResponseTime / repliedEmails.length / (1000 * 60 * 60); // Convert to hours
        }

        res.json({
            total,
            unread,
            replied,
            archived,
            avgResponseTimeHours: avgResponseTime.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// --- DEBUG ENVIRONMENT ---
app.get('/api/debug-env', (req, res) => {
    // SECURITY: Do not expose full values in prod, just presence
    res.json({
        MONGO_URI_SET: !!process.env.MONGO_URI,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        MONGO_STATUS: mongoose.connection.readyState // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
