/**
 * Security Middleware Configuration
 * Rate limiters, CORS, helmet, sanitization
 */
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * CORS configuration — allowed origins
 */
const corsOptions = {
    origin: [
        'https://www.vanamap.online',
        'https://vanamap.online',
        'https://vanamap.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
};

/**
 * Helmet configuration — security headers
 */
const helmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
};

/**
 * Rate Limiters
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "Too many attempts from this IP, please try again after 15 minutes" }
});

const generalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: { error: "System under heavy load. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const sensitiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: "Security limit reached. Please wait an hour before trying again." }
});

const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: "Too many OTP requests. Please wait an hour before trying again." }
});

/**
 * Real-time viewer tracker
 */
const activeViewers = new Map();
const TRACKING_WINDOW = 5 * 60 * 1000;

const trackViewer = (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (ip) {
            activeViewers.set(ip, Date.now());
        }

        // Cleanup expired viewers occasionally (1% chance per request to save CPU)
        if (Math.random() < 0.01) {
            const now = Date.now();
            for (const [ip, lastSeen] of activeViewers.entries()) {
                if (now - lastSeen > TRACKING_WINDOW) {
                    activeViewers.delete(ip);
                }
            }
        }
    } catch (e) {
        console.error("Tracker Error:", e.message);
    }
    next();
};

/**
 * Apply all security middleware to an Express app
 */
const applySecurityMiddleware = (app) => {
    app.set('trust proxy', 1);
    app.use(compression());
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(mongoSanitize());
    app.use(xss());
    app.use(trackViewer);
    app.use('/api/', generalLimiter);
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/signup', authLimiter);
};

module.exports = {
    corsOptions,
    helmetOptions,
    authLimiter,
    generalLimiter,
    sensitiveLimiter,
    otpLimiter,
    activeViewers,
    trackViewer,
    applySecurityMiddleware
};
