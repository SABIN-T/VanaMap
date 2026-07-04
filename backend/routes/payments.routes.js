/**
 * Payments Routes
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
const { deductInventory, restoreInventory, getVerifiedCofounders } = require('../helpers');


// 4. Claim Free Premium
router.post('/api/payments/claim-free', auth, async (req, res) => {
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
router.post('/api/payments/create-order', auth, async (req, res) => {
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

// --- CART PAYMENT ENDPOINTS ---

// Create Cart Order (Dynamic Amount)
router.post('/api/payments/create-cart-order', auth, async (req, res) => {
    try {
        const { amount, items, deliveryAddress } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
        if (!items || !items.length) return res.status(400).json({ error: "No items provided" });

        if (!razorpay) return res.status(503).json({ error: "Payment gateway not configured" });

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: "INR",
            receipt: `cart_${Date.now()}`,
            notes: {
                userId: req.user.id,
                itemCount: items.length.toString(),
                deliveryCity: deliveryAddress?.city || '',
                deliveryState: deliveryAddress?.state || ''
            }
        };

        const order = await razorpay.orders.create(options);
        res.json({ ...order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Cart Order Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Cart Payment
router.post('/api/payments/verify-cart', auth, async (req, res) => {
    try {
        const { orderId, paymentId, signature, items, totalAmount, deliveryAddress } = req.body;
        const crypto = require('crypto');

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({ error: "Server configuration missing (Payment)" });
        }

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest('hex');

        if (generated_signature !== signature) {
            return res.status(400).json({ success: false, message: "Signature verification failed" });
        }

        // Payment Verified — Create Sales & Award Points
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const cofounderEmails = await getVerifiedCofounders();

        const sales = [];
        let pointsToAward = 0;
        const deliveryInfo = deliveryAddress || {};
        const deliveryStr = deliveryInfo.address ? `\nDelivery: ${deliveryInfo.address}, ${deliveryInfo.city || ''} ${deliveryInfo.state || ''} ${deliveryInfo.pincode || ''}` : '';

        for (const item of items) {
            const sale = new Sale({
                vendorId: item.vendorId,
                userId: user._id,
                userName: user.name,
                plantId: item.plantId,
                plantName: item.plantName,
                price: item.price,
                quantity: item.quantity || 1,
                status: 'completed',
                deliveryAddress: deliveryInfo,
                deliveryFee: item.deliveryFee || 0,
                deliveryDistance: item.deliveryDistance || 0
            });
            await sale.save();
            sales.push(sale);

            // Auto-deduct inventory
            const deducted = await deductInventory(item.vendorId, item.plantId, item.quantity || 1);
            if (deducted) {
                sale.inventoryDeducted = true;
                await sale.save();
            }
            pointsToAward += (item.quantity || 1) * 200;

            // Notify vendor with delivery info
            await broadcastAlert('sale', `New paid order: ${item.quantity || 1}x ${item.plantName} by ${user.name}${deliveryStr}`, {
                vendorId: item.vendorId,
                title: 'New Paid Sale! 💰',
                deliveryAddress: deliveryInfo
            });

            // Send Purchase Confirmation Email to User & New Order Alert to Vendor
            try {
                await sendEmail({
                    from: 'VanaMap <support@vanamap.online>',
                    to: user.email,
                    subject: `Confirmed: Your purchase of ${item.plantName}! 🌿`,
                    html: EmailTemplates.plantPurchased(user.name, item.plantName, item.vendorName || 'VanaMap Partner', item.price)
                });
            } catch (mailErr) {
                console.error('[Cart Payment] Email failed:', mailErr.message);
            }

            try {
                const vendorObj = await Vendor.findOne({ id: item.vendorId });
                if (vendorObj && vendorObj.ownerEmail) {
                    await sendEmail({
                        from: 'VanaMap Orders <orders@vanamap.online>',
                        to: vendorObj.ownerEmail,
                        subject: `New Paid Order: ${item.plantName} from ${user.name}! 🛒`,
                        html: EmailTemplates.vendorNewOrderAlert(
                            vendorObj.name,
                            user.name,
                            item.plantName,
                            item.quantity || 1,
                            item.price,
                            deliveryInfo
                        )
                    });
                    console.log(`[Cart Payment] Sent new order notification email to vendor: ${vendorObj.ownerEmail}`);
                }
            } catch (vendorMailErr) {
                console.error('[Cart Payment] Vendor email failed:', vendorMailErr.message);
            }

            // Send copy of notifications to verified cofounders
            if (cofounderEmails && cofounderEmails.length > 0) {
                for (const cofounderEmail of cofounderEmails) {
                    try {
                        // Copy of user purchase confirmation
                        await sendEmail({
                            from: 'VanaMap <support@vanamap.online>',
                            to: cofounderEmail,
                            subject: `[Cofounder Alert] User Purchase: ${item.plantName} by ${user.name} 🌿`,
                            html: EmailTemplates.plantPurchased(user.name, item.plantName, item.vendorName || 'VanaMap Partner', item.price)
                        });
                        
                        // Copy of vendor new order alert
                        await sendEmail({
                            from: 'VanaMap Orders <orders@vanamap.online>',
                            to: cofounderEmail,
                            subject: `[Cofounder Alert] Vendor New Order: ${item.plantName} from ${user.name} 🛒`,
                            html: EmailTemplates.vendorNewOrderAlert(
                                item.vendorName || 'VanaMap Partner',
                                user.name,
                                item.plantName,
                                item.quantity || 1,
                                item.price,
                                deliveryInfo
                            )
                        });
                        console.log(`[Cofounder Alert] Sent copies to cofounder: ${cofounderEmail}`);
                    } catch (cofounderErr) {
                        console.error('[Cofounder Alert] Failed to send order copies to cofounder:', cofounderErr.message);
                    }
                }
            }
        }

        // Apply Points
        user.points = (user.points || 0) + pointsToAward;
        user.cart = []; // Clear server-side cart
        await user.save();

        // Record Payment with delivery address and items
        const payment = new Payment({
            userId: user.id,
            userName: user.name,
            amount: totalAmount,
            currency: 'INR',
            orderId,
            paymentId,
            signature,
            status: 'paid',
            plan: 'cart_purchase',
            items: items.map(i => ({ plantId: i.plantId, plantName: i.plantName, vendorId: i.vendorId, vendorName: i.vendorName, quantity: i.quantity, price: i.price })),
            deliveryAddress: deliveryInfo
        });
        await payment.save();

        await broadcastAlert('sale', `User ${user.name} completed a paid cart purchase (₹${totalAmount})! 🛒💚`, {
            userId: user._id,
            points: pointsToAward
        });

        res.json({ success: true, sales, pointsAwarded: pointsToAward });
    } catch (error) {
        console.error("Cart Verify Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
router.post('/api/payments/verify', auth, async (req, res) => {
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
            user.points = (user.points || 0) + 500;

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
router.post('/api/payments/activate-free', auth, async (req, res) => {
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
        user.points = (user.points || 0) + 500;

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

module.exports = router;
