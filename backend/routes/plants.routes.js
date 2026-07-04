/**
 * Plants Routes
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


// --- SUGGESTION ROUTES ---

router.post('/api/suggestions', async (req, res) => {
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

router.get('/api/suggestions', auth, admin, async (req, res) => {
    try {
        const suggestions = await PlantSuggestion.find().sort({ submittedAt: -1 });
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/api/suggestions/:id', auth, admin, async (req, res) => {
    try {
        const oldSuggestion = await PlantSuggestion.findById(req.params.id);
        const suggestion = await PlantSuggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // 🚀 Award 250 points if newly approved
        if (req.body.status === 'approved' && oldSuggestion?.status !== 'approved' && suggestion.userId) {
            const user = await User.findById(suggestion.userId);
            if (user) {
                user.points = (user.points || 0) + 250;
                await user.save();
                await broadcastAlert('reward', `You earned 250 CP! Your suggestion for "${suggestion.plantName}" was approved. 🌿`, { userId: user._id, title: 'Reward Received! 🎁' });
            }
        }

        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/suggestions/:id', auth, admin, async (req, res) => {
    try {
        await PlantSuggestion.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PLANT ROUTES ---

// 🚀 NEW: Fast light endpoint for initial page load (minimal data)
router.get('/api/plants/light', async (req, res) => {
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

router.get('/api/plants', async (req, res) => {
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
        const optimizedPlants = plants.map(p => {
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
router.post('/api/plants', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const plantData = req.body;

        // If image uploaded, use Cloudinary URL
        if (req.file) {
            plantData.imageUrl = req.file.path;
            console.log('[PLANT] Image auto-uploaded:', plantData.imageUrl);
        }

        if (typeof plantData.images === 'string') {
            try {
                plantData.images = JSON.parse(plantData.images);
            } catch (e) {
                plantData.images = plantData.images.split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        // Synchronize images with imageUrl if images array is empty but imageUrl is present
        if ((!plantData.images || plantData.images.length === 0) && plantData.imageUrl) {
            plantData.images = [plantData.imageUrl];
        }

        const plant = new Plant(plantData);
        await plant.save();

        // 🚀 PERFORMANCE: Invalidate cache
        cache.keys().forEach(k => {
            if (k.includes('plant') || k === 'all_plants') cache.del(k);
        });
        console.log('[Cache] 🗑️  Plant cache invalidated (Add)');

        await broadcastAlert('plant', `New plant added: ${plant.name}`, { plantId: plant.id }, `/#plant-${plant.id}`);
        res.status(201).json(plant);
    } catch (err) {
        console.error("Add Plant Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Edit Plant (with Auto-Upload)
router.patch('/api/plants/:id', auth, admin, (req, res, next) => {
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
                // Prepend or add the new imageUrl
                updates.images = [updates.imageUrl, ...updates.images];
            } else {
                updates.images = [updates.imageUrl];
            }
        }

        // IMPORTANT: Security/Sanity Check
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;

        const plant = await Plant.findOneAndUpdate({ id: req.params.id }, updates, { new: true });

        // 🚀 PERFORMANCE: Invalidate cache
        cache.keys().forEach(k => {
            if (k.includes('plant') || k === 'all_plants') cache.del(k);
        });
        console.log('[Cache] 🗑️  Plant cache invalidated (Update)');

        res.json(plant);
    } catch (err) {
        console.error("Edit Plant Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Direct Upload Helper (Admin + Vendor)
router.post('/api/upload', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('[Upload] Request received from:', req.user?.email, 'Role:', req.user?.role);

        // Check authorization
        if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
            console.log('[Upload] ❌ Unauthorized role:', req.user.role);
            return res.status(403).json({ error: 'Unauthorized upload access' });
        }

        // Check if file was uploaded
        if (!req.file) {
            console.log('[Upload] ❌ No file in request');
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Check Cloudinary configuration
        // Assuming isCloudinaryConfigured is defined elsewhere, e.g., as a global variable or imported
        // For this example, I'll define a placeholder if it's not present in the provided context
        const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

        if (!isCloudinaryConfigured) {
            console.error('[Upload] ❌ Cloudinary not configured!');
            return res.status(500).json({ error: 'Image storage not configured. Please contact support.' });
        }

        // Validate file path
        if (!req.file.path) {
            console.error('[Upload] ❌ File uploaded but no Cloudinary path returned');
            console.error('[Upload] File object:', JSON.stringify(req.file, null, 2));
            return res.status(500).json({ error: 'Image upload failed - no storage path' });
        }

        console.log(`[Upload] ✅ Success - ${req.user.email}: ${req.file.path}`);
        res.json({ success: true, imageUrl: req.file.path });
    } catch (err) {
        console.error('[Upload] ❌ Error:', err);
        console.error('[Upload] Error stack:', err.stack);
        res.status(500).json({
            error: err.message || 'Upload failed',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Legacy Endpoint (Redirect to above if possible, but keeping for compatibility)
router.post('/api/plants/upload', auth, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image file' });
        res.json({ success: true, imageUrl: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/plants/:id', auth, admin, async (req, res) => {
    try {
        await Plant.findOneAndDelete({ id: req.params.id });

        // 🚀 PERFORMANCE: Invalidate cache
        cache.keys().forEach(k => {
            if (k.includes('plant') || k === 'all_plants') cache.del(k);
        });
        console.log('[Cache] 🗑️  Plant cache invalidated (Delete)');

        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a suggestion (e.g. for missing plants)
router.post('/api/suggestions', auth, async (req, res) => {
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

// --- PUBLIC DEVELOPER API ENDPOINTS (v1) ---


// 1. Search Plants (Protected by Key)
router.get('/api/v1/plants/search', requireApiKey, async (req, res) => {
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

// GET /api/world-flora
router.get('/api/world-flora', async (req, res) => {
    try {
        const { search = '', page = 1, limit = 20, type = 'all' } = req.query;
        const query = {};

        if (type !== 'all') {
            query.type = type;
        }

        if (search.trim()) {
            // Check if scientific/common name matches
            query.$or = [
                { scientificName: new RegExp(search.trim(), 'i') },
                { commonName: new RegExp(search.trim(), 'i') },
                { flowerType: new RegExp(search.trim(), 'i') }
            ];
        }

        const limitNum = Math.min(parseInt(limit) || 20, 100);
        const skip = (Math.max(parseInt(page) || 1, 1) - 1) * limitNum;

        const list = await WorldFlora.find(query)
            .skip(skip)
            .limit(limitNum)
            .lean();
            
        const total = await WorldFlora.countDocuments(query);

        res.json({
            plants: list,
            total,
            page: Math.max(parseInt(page) || 1, 1),
            limit: limitNum
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
