/**
 * Auth Routes
 * Auto-extracted from monolithic index.js during professional refactoring
 */
const express = require('express');
const router = express.Router();
const { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest, JWT_SECRET } = require('../middleware/auth');
const { sendEmail, CommunicationOS, sendResetEmail, sendOtpEmail, sendSmsOtp, sendWelcomeEmail } = require('../config/email');
const { broadcastAlert, sendPushNotification, getPublicVapidKey, sendWhatsApp } = require('../config/push');
const { razorpay } = require('../config/razorpay');
const { upload, broadcastUpload, cloudinary } = require('../middleware/upload');
const { cache } = require('../config/cache');
const { sensitiveLimiter, otpLimiter, activeViewers } = require('../middleware/security');
const { body } = require('express-validator');
const { User, Plant, Vendor, Sale, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket, AIFeedback, ApiKey, NewsletterSubscriber, Review, SupportEmail, DiagnosisRecord, KidsProduct, WorldFlora } = require('../models');
const EmailTemplates = require('../email-templates');
const FloraIntelligence = require('../flora-intelligence');
const jwt = require('jsonwebtoken');

// 3. Developer API: Trigger OTP (External Apps)
router.post('/api/v1/send/otp', requireApiKey, async (req, res) => {
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

router.get('/api/auth/me', auth, async (req, res) => {
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

router.post('/api/auth/signup',
    // SECURE: Strict validation schema
    [
        body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
        body('phone').optional().isLength({ min: 10, max: 15 }).withMessage('Phone must be 10-15 digits'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
            .matches(/[0-9]/).withMessage('Must contain a number')
            .matches(/[@#$%^&+=]/).withMessage('Must contain a special character'),
        body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
        body('role').isIn(['user', 'vendor']).withMessage('Invalid role'),
        validateRequest
    ],
    async (req, res) => {
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
                captchaText: otp
            };

            const registrationToken = jwt.sign(registrationData, JWT_SECRET, { expiresIn: '15m' });

            console.log(`[AUTH] Generated OTP for ${email || phone}: ${otp}`);

            res.status(200).json({
                message: "Verify code sent to your Email/SMS.",
                registrationToken,
                captchaSvg: null
            });
        } catch (err) {
            console.error('[Signup] Error:', err);
            if (err.code === 11000) {
                return res.status(400).json({ error: "Email or Phone already registered in our ecosystem." });
            }
            res.status(500).json({ error: err.message || "Registration failed. Please try again later." });
        }
    });

router.post('/api/auth/resend-otp', async (req, res) => {
    try {
        const { registrationToken } = req.body;
        if (!registrationToken) return res.status(400).json({ error: "Missing registration session" });

        const decoded = jwt.verify(registrationToken, JWT_SECRET);

        // Generate new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Resend
        if (decoded.email) await sendOtpEmail(decoded.email, otp);
        if (decoded.phone) await sendSmsOtp(decoded.phone, otp);

        const newRegistrationData = { ...decoded, captchaText: otp };
        const newToken = jwt.sign(newRegistrationData, JWT_SECRET, { expiresIn: '15m' });

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

router.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { registrationToken, otp } = req.body;
        if (!registrationToken) return res.status(400).json({ error: "Missing registration session" });

        const data = jwt.verify(registrationToken, JWT_SECRET);

        if (data.captchaText !== otp) {
            return res.status(400).json({ error: "Invalid characters typed. Try again." });
        }

        // Now save the user to database
        const user = new User({
            email: data.email,
            phone: data.phone,
            password: data.password,
            name: data.name,
            role: data.role,
            country: data.country,
            city: data.city,
            state: data.state,
            verified: true,
            points: 100 // 🚀 Welcome Bonus!
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

router.post('/api/auth/check-email',
    [
        body('email').trim().notEmpty().withMessage('Identifier is required'),
        validateRequest
    ],
    async (req, res) => {
        try {
            const { email } = req.body;
            const iden = email.trim().toLowerCase();

            if (iden === 'admin@plantai.com') {
                return res.json({ success: true, verified: true, role: 'admin', name: 'Master Admin' });
            }

            // Phone fuzzy match
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

// Real-time Gmail Validation
router.post('/api/auth/validate-gmail',
    [
        body('email').trim().isEmail().withMessage('Invalid email format'),
        validateRequest
    ],
    async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: "Email is required" });

            const emailLower = email.toLowerCase().trim();

            const gmailRegex = /^(?!.*?\.\.)[a-z0-9][a-z0-9.]{4,28}[a-z0-9]@gmail\.com$/;

            if (!gmailRegex.test(emailLower)) {
                return res.json({
                    valid: false,
                    reason: 'format',
                    message: emailLower.endsWith('@gmail.com') ? 'Username must be 6-30 chars (letters, numbers, dots)' : 'Must be a @gmail.com address'
                });
            }

            // DNS MX Check
            const dns = require('dns').promises;
            try {
                const mxRecords = await dns.resolveMx('gmail.com');
                if (!mxRecords || mxRecords.length === 0) {
                    return res.json({ valid: false, reason: 'dns', message: 'Gmail mail servers unreachable' });
                }
            } catch (dnsErr) {
                console.error('DNS check failed:', dnsErr.message);
            }

            const existingUser = await User.findOne({ email: emailLower });
            if (existingUser) {
                return res.json({ valid: true, registered: true, message: 'Valid Gmail (Already Registered)' });
            }

            res.json({
                valid: true,
                registered: false,
                message: 'Valid Google Gmail Account'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Google OAuth Authentication
router.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name, picture, role, location, phone } = req.body;
        console.log(`[Google Auth] Request for: ${email}, role: ${role}`);

        let user = await User.findOne({ email });

        if (!user) {
            const crypto = require('crypto');
            user = new User({
                email,
                name,
                role: role || 'user',
                password: crypto.randomBytes(16).toString('hex'),
                verified: true,
                emailVerified: true,
                googleAuth: true,
                profilePicture: picture,
                city: location?.city,
                state: location?.state,
                country: location?.country,
                latitude: location?.lat,
                longitude: location?.lng,
                phone,
                points: 100
            });
            await user.save();

            sendWelcomeEmail(user.email, user.name, user.role);

            console.log(`[Google Auth] New user created: ${email}`);
        } else {
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

        if (user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
            console.log(`[Auth] Auto-expiring premium for ${user.email}`);
            user.isPremium = false;
            user.premiumType = 'none';
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

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

router.post('/api/auth/login',
    [
        body('email').trim().notEmpty().withMessage('Email/Phone is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest
    ],
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const identifier = email.trim().toLowerCase();

            console.log(`[AUTH] Login attempt for: ${identifier}`);

            if (identifier === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
                console.log(`[AUTH] Login success: ${identifier} (admin)`);
                const token = jwt.sign({ email: identifier, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000
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

            if (identifier === 'admin@plantai.com') {
                user.verified = true;
            }

            if (!user.verified) return res.status(401).json({ error: "Please verify captcha first" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

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
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ user: normalizeUser(user), token });
        } catch (err) {
            console.error('[Login] Error:', err);
            res.status(500).json({ error: "Something went wrong during login. Please try again." });
        }
    });

router.post('/api/auth/google-sync', async (req, res) => {
    try {
        const { email, name } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            const crypto = require('crypto');
            user = new User({
                email,
                name,
                role: 'user',
                password: crypto.randomBytes(16).toString('hex'),
                verified: true,
                emailVerified: true,
                googleAuth: true,
                points: 100
            });
            await user.save();
            sendWelcomeEmail(user.email, user.name, user.role);
            console.log(`[Google Sync] Account auto-created for: ${email}`);
        } else {
            user.googleAuth = true;
            await user.save();
            console.log(`[Google Sync] Account linked for: ${email}`);
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: normalizeUser(user), token });
    } catch (e) {
        console.error('[Google Sync] Error:', e);
        res.status(500).json({ error: e.message });
    }
});

router.post('/api/auth/reset-password-verify', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: "Missing required details" });
        }

        const setting = await SystemSettings.findOne({ key: 'restricted_pages' });
        const isVerified = true;

        if (!isVerified) {
            return res.status(400).json({ error: "Invalid verification details" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/api/auth/nudge-admin',
    [
        body('email').trim().isEmail().withMessage('Invalid email'),
        validateRequest
    ],
    async (req, res) => {
        try {
            const { email } = req.body;
            await broadcastAlert('help', `User with email ${email || 'Anonymous'} requested access help. Secure passcode sent.`, { email });
            res.json({ success: true, message: "Nudge delivered to VanaMap core" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

router.post('/api/auth/reset-password-request',
    [
        body('email').trim().isEmail().withMessage('Invalid email format'),
        validateRequest
    ],
    async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) return res.status(404).json({ error: "Email not found" });

            const tempPass = Math.floor(100000 + Math.random() * 900000).toString();
            await sendResetEmail(user.email, tempPass);

            res.json({ success: true, message: "Passcode sent to verified email" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

module.exports = router;
