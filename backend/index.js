require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cron = require('node-cron');
let MongoStore = require('connect-mongo');
if (MongoStore.default) {
    MongoStore = MongoStore.default;
}

// Config & Middleware Imports
const { connectDB } = require('./config/database');
const { applySecurityMiddleware } = require('./middleware/security');
const { initializePush, broadcastAlert, sendPushNotification } = require('./config/push');
const { User } = require('./models');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Apply Security Middlewares (CORS, Helmet, Rate Limiters, Viewer Tracking)
applySecurityMiddleware(app);

// Parser Middlewares
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// Session Store Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'vanamap_default_secure_session_key_rotate_this',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 1 day
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Connect to Database & Seeder
connectDB();

// Initialize Web Push
initializePush();

// --- CRON: AUTOMATED PREMIUM CHECK (Daily at Midnight) ---
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

                // Specific push
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

// --- MOUNT ROUTERS ---
app.use(require('./routes/auth.routes'));
app.use(require('./routes/newsletter.routes'));
app.use(require('./routes/notifications.routes'));
app.use(require('./routes/payments.routes'));
app.use(require('./routes/admin.routes'));
app.use(require('./routes/vendor.routes'));
app.use(require('./routes/user.routes'));
app.use(require('./routes/plants.routes'));
app.use(require('./routes/shop.routes'));
app.use(require('./routes/gamification.routes'));
app.use(require('./routes/support.routes'));
app.use(require('./routes/ai.routes'));
app.use(require('./routes/misc.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Initialize HTTP server for WebSocket support
const http = require('http');
const server = http.createServer(app);

// Initialize WebSocket server
const { initializeWebSocket } = require('./websocket-server');
initializeWebSocket(server);

// Handle process-wide uncaught exceptions/rejections gracefully
process.on('uncaughtException', (err) => {
    console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with WebSocket support`);
});
