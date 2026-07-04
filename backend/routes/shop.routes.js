/**
 * Shop Routes
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


// --- KIDS PRODUCTS ENDPOINTS ---

// Get all Kids Products
router.get('/api/kids-products', async (req, res) => {
    try {
        console.log('GET /api/kids-products - Fetching from database...');
        const products = await KidsProduct.find().lean();
        
        const optimizedProducts = products.map(p => {
            const imageUrl = p.imageUrl && p.imageUrl.includes('cloudinary.com') && !p.imageUrl.includes('f_auto')
                ? p.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_500,c_limit/')
                : p.imageUrl;
            const images = p.images && p.images.length > 0
                ? p.images.map(img => img && img.includes('cloudinary.com') && !img.includes('f_auto')
                    ? img.replace('/upload/', '/upload/f_auto,q_auto,w_500,c_limit/')
                    : img)
                : (imageUrl ? [imageUrl] : []);
            return {
                ...p,
                imageUrl,
                images
            };
        });
        
        res.json(optimizedProducts);
    } catch (err) {
        console.error("GET /api/kids-products ERROR:", err);
        res.status(500).json({ error: "DB Error: " + err.message });
    }
});

// Add Kids Product
router.post('/api/kids-products', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const productData = req.body;
        
        // If image uploaded, use Cloudinary URL
        if (req.file) {
            productData.imageUrl = req.file.path;
            console.log('[KIDS] Image auto-uploaded:', productData.imageUrl);
        }

        if (typeof productData.images === 'string') {
            try {
                productData.images = JSON.parse(productData.images);
            } catch (e) {
                productData.images = productData.images.split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        // Synchronize images with imageUrl if images array is empty but imageUrl is present
        if ((!productData.images || productData.images.length === 0) && productData.imageUrl) {
            productData.images = [productData.imageUrl];
        }
        
        // Convert comma-separated strings to arrays if they are sent as strings
        if (typeof productData.includes === 'string') {
            try {
                productData.includes = JSON.parse(productData.includes);
            } catch (e) {
                productData.includes = productData.includes.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        if (typeof productData.tags === 'string') {
            try {
                productData.tags = JSON.parse(productData.tags);
            } catch (e) {
                productData.tags = productData.tags.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        
        const product = new KidsProduct(productData);
        await product.save();
        
        res.status(201).json(product);
    } catch (err) {
        console.error("Add Kids Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Edit Kids Product
router.patch('/api/kids-products/:id', auth, admin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
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
        
        if (req.file) {
            updates.imageUrl = req.file.path;
            console.log('[KIDS] Updated image:', updates.imageUrl);
        }

        if (typeof updates.images === 'string') {
            try {
                updates.images = JSON.parse(updates.images);
            } catch (e) {
                updates.images = updates.images.split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        // Synchronize images with imageUrl if updates contains new imageUrl
        if (req.file && updates.imageUrl) {
            if (updates.images && Array.isArray(updates.images)) {
                updates.images = [updates.imageUrl, ...updates.images];
            } else {
                updates.images = [updates.imageUrl];
            }
        }
        
        // Convert comma-separated strings to arrays if they are sent as strings
        if (typeof updates.includes === 'string') {
            try {
                updates.includes = JSON.parse(updates.includes);
            } catch (e) {
                updates.includes = updates.includes.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        if (typeof updates.tags === 'string') {
            try {
                updates.tags = JSON.parse(updates.tags);
            } catch (e) {
                updates.tags = updates.tags.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;
        
        const product = await KidsProduct.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
        res.json(product);
    } catch (err) {
        console.error("Edit Kids Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Kids Product
router.delete('/api/kids-products/:id', auth, admin, async (req, res) => {
    try {
        await KidsProduct.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error("Delete Kids Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/custom-pots', auth, async (req, res) => {
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

router.get('/api/custom-pots/my', auth, async (req, res) => {
    try {
        const pots = await CustomPot.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(pots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
