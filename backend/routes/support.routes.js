/**
 * Support Routes
 * Auto-extracted from monolithic index.js during professional refactoring
 */
const express = require('express');
const router = express.Router();
const { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest } = require('../middleware/auth');
const { sendEmail, CommunicationOS, sendResetEmail, sendOtpEmail, sendSmsOtp, sendWelcomeEmail, resend } = require('../config/email');
const { broadcastAlert, sendPushNotification, getPublicVapidKey, sendWhatsApp } = require('../config/push');
const { razorpay } = require('../config/razorpay');
const { upload, broadcastUpload, cloudinary } = require('../middleware/upload');
const { cache } = require('../config/cache');
const { sensitiveLimiter, otpLimiter, activeViewers } = require('../middleware/security');
const { body } = require('express-validator');
const { User, Plant, Vendor, Sale, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket, AIFeedback, ApiKey, NewsletterSubscriber, Review, SupportEmail, DiagnosisRecord, KidsProduct, WorldFlora } = require('../models');
const EmailTemplates = require('../email-templates');
const FloraIntelligence = require('../flora-intelligence');


// --- SUPPORT ---
router.post('/api/support/inquiry', async (req, res) => {
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

// 1. User Submit Ticket
router.post('/api/support', auth, async (req, res) => {
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

// --- EMAIL SUPPORT SYSTEM ---

// Endpoint for Contact Form Submissions
router.post('/api/support/contact', async (req, res) => {
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

// Get all support emails (Admin only)
// --- PUBLIC SUPPORT ENDPOINTS ---

// Handle Contact Form Submissions
router.post('/api/support/contact', async (req, res) => {
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

module.exports = router;
