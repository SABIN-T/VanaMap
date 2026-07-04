/**
 * Newsletter Routes
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


// --- API NOTIFICATION CONTROLLERS ---

// 1. Subscribe to Newsletter
router.post('/api/newsletter/subscribe', async (req, res) => {
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
router.post('/api/newsletter/broadcast', auth, admin, async (req, res) => {
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

module.exports = router;
