/**
 * Vendor Routes
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
const { deductInventory, restoreInventory, getVerifiedCofounders } = require('../helpers');


// Get Vendor Shop Orders
router.get('/api/vendor/orders', auth, async (req, res) => {
    try {
        const vendor = await Vendor.findOne({
            $or: [
                { userId: req.user.id },
                { ownerEmail: req.user.email }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor profile not found for this user.' });
        }

        const orders = await Sale.find({ vendorId: vendor.id }).sort({ timestamp: -1 });

        const userIds = [...new Set(orders.map(o => o.userId).filter(Boolean))];
        const users = await User.find({ _id: { $in: userIds } }).select('email name phone');
        const userMap = {};
        users.forEach(u => userMap[u._id.toString()] = { email: u.email, name: u.name, phone: u.phone });

        res.json(orders.map(o => ({
            ...o.toObject(),
            userInfo: o.userId ? userMap[o.userId] : null
        })));
    } catch (e) {
        console.error('Vendor Fetch Orders Error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Update Order Status with OTP Verification (Vendor)
router.patch('/api/vendor/orders/:id/status', auth, async (req, res) => {
    try {
        const { status, otp } = req.body;
        const validStatuses = ['pending', 'completed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Order not found' });

        const vendor = await Vendor.findOne({ id: sale.vendorId });
        if (!vendor || (vendor.userId !== req.user.id && vendor.ownerEmail !== req.user.email)) {
            return res.status(403).json({ error: 'Access denied. You do not own this shop.' });
        }

        // OTP Check on Deliver transition
        if (status === 'delivered') {
            if (!sale.deliveryOTP) {
                return res.status(400).json({ error: 'Delivery OTP has not been generated. Please mark order as shipped first.' });
            }
            if (sale.deliveryOTP.trim() !== (otp || '').toString().trim()) {
                return res.status(400).json({ error: 'Invalid delivery OTP code. Please enter the correct code from the buyer.' });
            }
        }

        // Generate and Send OTP on Ship transition
        if (status === 'shipped') {
            const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
            sale.deliveryOTP = deliveryOtp;
        }
        // Stock Deduction/Restoration Lifecycle updates
        const oldStatus = sale.status;
        if (status === 'delivered') {
            if (!sale.inventoryDeducted) {
                const deducted = await deductInventory(sale.vendorId, sale.plantId, sale.quantity || 1);
                if (deducted) {
                    sale.inventoryDeducted = true;
                }
            }
        } else if (status === 'cancelled') {
            if (sale.inventoryDeducted) {
                const restored = await restoreInventory(sale.vendorId, sale.plantId, sale.quantity || 1);
                if (restored) {
                    sale.inventoryDeducted = false;
                }
            }
        } else if (oldStatus === 'cancelled' && ['pending', 'completed', 'shipped'].includes(status)) {
            if (!sale.inventoryDeducted) {
                const deducted = await deductInventory(sale.vendorId, sale.plantId, sale.quantity || 1);
                if (deducted) {
                    sale.inventoryDeducted = true;
                }
            }
        }

        sale.status = status;
        await sale.save();

        const cofounderEmails = await getVerifiedCofounders();

        let user = null;
        if (sale.userId) {
            user = await User.findById(sale.userId);
        }

        const vendorName = vendor ? vendor.name : 'VanaMap Partner';

        // Notify user about status update
        if (sale.userId) {
            const statusMessages = {
                shipped: `Your order of ${sale.plantName} has been shipped! 🚚`,
                delivered: `Your order of ${sale.plantName} has been delivered! 📦✅`,
                cancelled: `Your order of ${sale.plantName} has been cancelled. ❌`,
                pending: `Your order of ${sale.plantName} is now pending. ⏳`,
                completed: `Your order of ${sale.plantName} is now packed! ✅`
            };
            await broadcastAlert('order_status', statusMessages[status] || `Order status updated to ${status}`, {
                userId: sale.userId,
                title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} 📋`
            });

            // Send notification email
            if (user && user.email) {
                try {
                    const { generateInvoicePDF } = require('../invoice-helper');
                    let mailParams = {
                        from: 'VanaMap <support@vanamap.online>',
                        to: user.email,
                        subject: `Update: Your order of ${sale.plantName} is ${status}! 🌿`,
                        html: EmailTemplates.userOrderStatusUpdate(
                            user.name,
                            sale.plantName,
                            status,
                            sale.price,
                            sale._id.toString(),
                            vendorName,
                            sale.deliveryAddress
                        )
                    };

                    // If delivered, generate and attach the estimated invoice PDF
                    if (status === 'delivered') {
                        try {
                            const invoiceBuffer = await generateInvoicePDF(sale, user, vendor);
                            mailParams.attachments = [{
                                filename: `Invoice-${sale._id.toString().substring(18).toUpperCase()}.pdf`,
                                content: invoiceBuffer,
                                contentType: 'application/pdf'
                            }];
                        } catch (pdfErr) {
                            console.error('[Invoice PDF] Generation failed:', pdfErr.message);
                        }
                    }

                    await sendEmail(mailParams);
                    console.log(`[Order Status Email] Sent update email to user: ${user.email}`);
                } catch (emailErr) {
                    console.error('[Order Status Email] Failed to send user email:', emailErr.message);
                }
            }
        }

        // If shipped, send another email to the user with the OTP code
        if (status === 'shipped' && user && user.email) {
            try {
                await sendEmail({
                    from: 'VanaMap Delivery <delivery@vanamap.online>',
                    to: user.email,
                    subject: `VanaMap Delivery OTP: ${sale.deliveryOTP} 🌿`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
                            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                                <h1 style="color: #10b981; margin: 0; font-size: 24px;">VanaMap Delivery Verification</h1>
                            </div>
                            <p>Hello <strong>${sale.userName || user.name || 'Valued Customer'}</strong>,</p>
                            <p>Your order for <strong>${sale.plantName}</strong> (Qty: ${sale.quantity}) from <strong>${vendor.name}</strong> is shipped and on its way to you! 🚚</p>
                            <p>To verify and confirm the delivery, please provide the following One-Time Password (OTP) to the delivery agent when they arrive:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: 800; color: #10b981; letter-spacing: 5px; background: #f0fdf4; padding: 12px 24px; border: 1px solid #bbf7d0; border-radius: 8px; display: inline-block;">
                                    ${sale.deliveryOTP}
                                </span>
                            </div>
                            <p style="color: #64748b; font-size: 14px;">If you did not request this delivery or have questions, please contact our support team immediately.</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This email was sent automatically by the VanaMap Logistics Platform.</p>
                        </div>
                    `
                });
                console.log(`[Delivery OTP Email] Sent OTP ${sale.deliveryOTP} to buyer: ${user.email}`);
            } catch (mailErr) {
                console.error('[Delivery OTP Email] Failed to send email:', mailErr.message);
            }
        }

        // Send order status update email copy to cofounders
        if (cofounderEmails && cofounderEmails.length > 0) {
            for (const cofounderEmail of cofounderEmails) {
                try {
                    const { generateInvoicePDF } = require('../invoice-helper');
                    let mailParams = {
                        from: 'VanaMap <support@vanamap.online>',
                        to: cofounderEmail,
                        subject: `[Cofounder Alert] Order ${status.charAt(0).toUpperCase() + status.slice(1)}: ${sale.plantName} (Customer: ${sale.userName || (user ? user.name : 'Customer')}) 🌿`,
                        html: EmailTemplates.userOrderStatusUpdate(
                            sale.userName || (user ? user.name : 'Customer'),
                            sale.plantName,
                            status,
                            sale.price,
                            sale._id.toString(),
                            vendorName,
                            sale.deliveryAddress
                        )
                    };

                    // If delivered, generate and attach the estimated invoice PDF
                    if (status === 'delivered') {
                        try {
                            const invoiceBuffer = await generateInvoicePDF(
                                sale,
                                user || { name: sale.userName || 'Customer', email: '' },
                                vendor || { name: vendorName }
                            );
                            mailParams.attachments = [{
                                filename: `Invoice-${sale._id.toString().substring(18).toUpperCase()}.pdf`,
                                content: invoiceBuffer,
                                contentType: 'application/pdf'
                            }];
                        } catch (pdfErr) {
                            console.error('[Cofounder Alert Invoice PDF] Generation failed:', pdfErr.message);
                        }
                    }

                    await sendEmail(mailParams);
                    console.log(`[Cofounder Alert Status] Sent update email to cofounder: ${cofounderEmail}`);
                } catch (emailErr) {
                    console.error('[Cofounder Alert Status] Failed to send cofounder email:', emailErr.message);
                }
            }
        }

        res.json(sale);
    } catch (e) {
        console.error('Vendor Order Status Update Error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Get Restricted Pages
// Resend Order Delivery OTP (Vendor)
router.post('/api/vendor/orders/:id/resend-otp', auth, async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Order not found' });

        if (sale.status !== 'shipped') {
            return res.status(400).json({ error: 'OTP can only be resent for shipped orders.' });
        }

        const vendor = await Vendor.findOne({ id: sale.vendorId });
        if (!vendor || (vendor.userId !== req.user.id && vendor.ownerEmail !== req.user.email)) {
            return res.status(403).json({ error: 'Access denied. You do not own this shop.' });
        }

        // Generate new OTP
        const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
        sale.deliveryOTP = deliveryOtp;
        await sale.save();

        let user = null;
        if (sale.userId) {
            user = await User.findById(sale.userId);
        }

        const vendorName = vendor ? vendor.name : 'VanaMap Partner';

        // Send OTP email
        if (user && user.email) {
            try {
                await sendEmail({
                    from: 'VanaMap Delivery <delivery@vanamap.online>',
                    to: user.email,
                    subject: `VanaMap Delivery OTP: ${sale.deliveryOTP} 🌿`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
                            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                                <h1 style="color: #10b981; margin: 0; font-size: 24px;">VanaMap Delivery Verification</h1>
                            </div>
                            <p>Hello <strong>${sale.userName || user.name || 'Valued Customer'}</strong>,</p>
                            <p>Your order for <strong>${sale.plantName}</strong> (Qty: ${sale.quantity}) from <strong>${vendor.name}</strong> is shipped and on its way to you! 🚚</p>
                            <p>To verify and confirm the delivery, please provide the following One-Time Password (OTP) to the delivery agent when they arrive:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: 800; color: #10b981; letter-spacing: 5px; background: #f0fdf4; padding: 12px 24px; border: 1px solid #bbf7d0; border-radius: 8px; display: inline-block;">
                                    ${sale.deliveryOTP}
                                </span>
                            </div>
                            <p style="color: #64748b; font-size: 14px;">If you did not request this delivery or have questions, please contact our support team immediately.</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This email was sent automatically by the VanaMap Logistics Platform.</p>
                        </div>
                    `
                });
                console.log(`[Resend OTP Email] Sent OTP ${sale.deliveryOTP} to buyer: ${user.email}`);
            } catch (mailErr) {
                console.error('[Resend OTP Email] Failed to send email:', mailErr.message);
                return res.status(500).json({ error: 'Failed to send OTP email to customer' });
            }
        } else {
            return res.status(400).json({ error: 'Buyer email not found' });
        }

        res.json({ success: true, message: 'New OTP code sent to customer successfully' });
    } catch (e) {
        console.error('Error resending OTP:', e);
        res.status(500).json({ error: e.message });
    }
});

router.get('/api/analytics/vendor/:vendorId', auth, async (req, res) => {
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

router.get('/api/vendor/notifications', auth, async (req, res) => {
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

// --- VENDOR ROUTES ---

router.get('/api/vendors', async (req, res) => {
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

router.post('/api/vendors', auth, async (req, res) => {
    try {
        console.log(`[Vendor Registration] Request from user ID: ${req.user.id}`);

        // Check if user has verified email or phone
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log(`[Vendor Registration] ❌ User not found for ID: ${req.user.id}`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Require email OR phone verification before vendor registration
        // Google Auth users are verified
        if (!user.emailVerified && !user.phoneVerified && !user.googleAuth) {
            console.log(`[Vendor Registration] ❌ User verified check failed`);
            return res.status(403).json({
                error: 'Verification required',
                message: 'Please verify your email or phone number before registering as a vendor',
                requiresVerification: true,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified
            });
        }

        // Check if user already has a vendor profile
        const existingVendor = await Vendor.findOne({ userId: req.user.id });
        if (existingVendor) {
            return res.status(400).json({
                error: 'Vendor profile already exists',
                vendorId: existingVendor.id
            });
        }

        // Allow frontend to specify ID (linking to User ID), fallback to timestamp if missing
        // SECURITY: Strip sensitive fields that users shouldn't set
        const safeBody = { ...req.body };
        delete safeBody.verified;
        delete safeBody.role;
        delete safeBody.earnings;
        delete safeBody.paymentDetails; // Payment details should be set via specific endpoint

        const itemData = {
            id: safeBody.id || ("v" + Date.now()),
            ...safeBody,
            userId: req.user.id, // FORCE correct user ID (cannot be overridden)
            ownerEmail: user.email // FORCE correct email
        };

        const newVendor = new Vendor(itemData);
        await newVendor.save();

        // 🔄 PENDING APPROVAL: Do not upgrade role yet. 
        // User remains 'user' until Admin verifies the vendor profile.
        console.log(`[Vendor Registration] Vendor profile created for ${user.email}. Pending Admin Approval.`);
        // user.role = 'vendor'; // DISABLED: Now requires manual approval
        // await user.save();

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
        res.status(201).json({
            vendor: newVendor,
            user: normalizeUser(user) // Include updated user with new role
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/api/vendors/:id', auth, admin, async (req, res) => {
    try {
        // Only admin can update vendor status
        const oldVendor = await Vendor.findOne({ id: req.params.id });

        if (!oldVendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

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

            // 🌟 UPGRADE USER ROLE TO VENDOR
            if (vendor.userId || vendor.ownerEmail) {
                try {
                    const userQuery = vendor.userId ? { _id: vendor.userId } : { email: vendor.ownerEmail };
                    await User.updateOne(userQuery, { role: 'vendor' });
                    console.log(`[Vendor Approval] User role upgraded to 'vendor' for ${vendor.ownerEmail}`);
                } catch (err) {
                    console.error("[Vendor Approval] Failed to upgrade user role:", err);
                }
            }
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

// Vendor self-update endpoint (vendors can update their own profile)
router.patch('/api/vendors/profile/:id', auth, async (req, res) => {
    try {
        console.log('[Vendor Self-Update] Request received');
        console.log('[Vendor Self-Update] User:', req.user);
        console.log('[Vendor Self-Update] Vendor ID param:', req.params.id);

        // Verify the vendor is updating their own profile
        if (!req.user) {
            console.log('[Vendor Self-Update] ❌ No user in request');
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Try to find the vendor by multiple methods
        let vendor = await Vendor.findOne({ id: req.params.id });

        if (!vendor) {
            // Try finding by ownerEmail
            vendor = await Vendor.findOne({ ownerEmail: req.user.email });
            console.log('[Vendor Self-Update] Vendor found by email:', !!vendor);
        }

        if (!vendor) {
            console.log('[Vendor Self-Update] ❌ Vendor not found in database');
            console.log('[Vendor Self-Update] Searched for ID:', req.params.id);
            console.log('[Vendor Self-Update] Searched for email:', req.user.email);
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Check if user is authorized to update this vendor
        const isOwnProfile = String(req.user.id) === String(vendor.id) ||
            String(req.user._id) === String(vendor.id) ||
            req.user.email === vendor.ownerEmail;

        if (!isOwnProfile && req.user.role !== 'admin') {
            console.log('[Vendor Self-Update] ❌ Not authorized');
            console.log('[Vendor Self-Update] User ID:', req.user.id);
            console.log('[Vendor Self-Update] Vendor ID:', vendor.id);
            console.log('[Vendor Self-Update] User email:', req.user.email);
            console.log('[Vendor Self-Update] Vendor email:', vendor.ownerEmail);
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        // Vendors cannot change their verification status
        const allowedFields = { ...req.body };
        delete allowedFields.verified; // Only admins can verify
        delete allowedFields.role; // Cannot change role
        delete allowedFields.id; // Cannot change ID

        const updatedVendor = await Vendor.findOneAndUpdate(
            { id: vendor.id },
            allowedFields,
            { new: true }
        );

        if (!updatedVendor) {
            console.log('[Vendor Self-Update] ❌ Update failed');
            return res.status(404).json({ error: 'Failed to update vendor' });
        }

        // 🔄 SYNC: Update User Profile Image if Shop Image changed
        if (allowedFields.shopImage) {
            try {
                const userQuery = vendor.userId ? { _id: vendor.userId } : { email: vendor.ownerEmail };
                await User.updateOne(userQuery, {
                    profileImage: allowedFields.shopImage,
                    photoUrl: allowedFields.shopImage
                });
                console.log(`[Vendor Sync] Updated User profile image for ${vendor.ownerEmail}`);
            } catch (syncErr) {
                console.error('[Vendor Sync] Failed to sync user image:', syncErr);
            }
        }

        // 🚀 PERFORMANCE: Invalidate cache
        cache.del('all_vendors');

        console.log(`[Vendor Self-Update] ✅ ${updatedVendor.name} updated their profile`);
        res.json(updatedVendor);
    } catch (err) {
        console.error('[Vendor Self-Update] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/vendors/:id', auth, admin, async (req, res) => {
    try {
        const vendor = await Vendor.findOneAndDelete({ id: req.params.id });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // 🚀 PERFORMANCE: Invalidate cache
        cache.del('all_vendors');

        console.log(`[Vendor Delete] Successfully deleted vendor: ${vendor.name} (ID: ${req.params.id})`);
        res.json({ message: 'Vendor deleted successfully', deletedVendor: vendor.name });
    } catch (err) {
        console.error('[Vendor Delete] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- VENDOR REVIEWS ENDPOINTS ---

// 1. Get all reviews for a vendor
router.get('/api/vendors/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ vendorId: req.params.id }).sort({ timestamp: -1 }).lean();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Submit a new review for a vendor
router.post('/api/vendors/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const vendorId = req.params.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating is required and must be between 1 and 5 stars' });
        }

        // Verify the user has a delivered order from this vendor
        const sale = await Sale.findOne({
            userId: req.user.id,
            vendorId: vendorId,
            status: 'delivered'
        });

        if (!sale) {
            return res.status(403).json({ 
                error: 'Purchase verification required', 
                message: 'You can only review shops from which you have received a delivered order.' 
            });
        }

        // Create the review
        const newReview = await Review.create({
            vendorId,
            userId: req.user.id,
            userName: req.user.name || 'Anonymous User',
            rating: Number(rating),
            comment: comment || ''
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Vendor owner reply to a review
router.post('/api/vendors/:id/reviews/:reviewId/reply', auth, async (req, res) => {
    try {
        const { reply } = req.body;
        const { id: vendorId, reviewId } = req.params;

        if (!reply || !reply.trim()) {
            return res.status(400).json({ error: 'Reply content is required' });
        }

        // Check if the user owns this vendor
        const vendor = await Vendor.findOne({ id: vendorId });
        if (!vendor || (vendor.userId !== req.user.id && vendor.ownerEmail !== req.user.email)) {
            return res.status(403).json({ error: 'Access denied. You do not own this shop.' });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        review.reply = reply;
        review.repliedAt = new Date();
        await review.save();

        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VENDOR TOOLS ---
router.get('/api/vendors/:id/qr', auth, async (req, res) => {
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

router.get('/api/analytics/vendor/:vendorId/demand', auth, async (req, res) => {
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

// --- LOCATION-BASED ANALYTICS FOR VENDORS ---
router.get('/api/analytics/nearby-users', auth, async (req, res) => {
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

module.exports = router;
