/**
 * Gamification Routes
 * Auto-extracted from monolithic index.js during professional refactoring
 */
const express = require('express');
const router = express.Router();
const { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest } = require('../middleware/auth');
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


// --- ROUTES ---

// --- GAMIFICATION & ANALYTICS ---

router.get('/api/gamification/leaderboard', async (req, res) => {
    try {
        // Include both users AND vendors with points > 0
        const topUsers = await User.find({
            role: { $in: ['user', 'vendor'] },
            points: { $gt: 0 }
        })
            .sort({ points: -1 })
            .limit(50)
            .select('name points city state gameLevel role');

        const cityRankings = await User.aggregate([
            { $match: { role: { $in: ['user', 'vendor'] }, points: { $gt: 0 } } },
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

router.post('/api/tracking/search', async (req, res) => {
    try {
        const { query, plantId, location } = req.body;
        const log = new SearchLog({ query, plantId, location: location || {} });
        await log.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/tracking/vendor-contact', async (req, res) => {
    try {
        const { vendorId, vendorName, userEmail, contactType } = req.body;
        const msg = `User ${userEmail} contacted Vendor ${vendorName} via ${contactType}`;
        await broadcastAlert('vendor_contact', msg, { vendorId, userEmail, contactType, skipPush: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
