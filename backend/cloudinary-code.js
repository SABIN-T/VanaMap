// ========================================
// CLOUDINARY IMAGE UPLOAD - QUICK SETUP
// ========================================
// Add this code to your index.js

// --- STEP 1: Add after imports (around line 20) ---

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Auto-configure from CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
    console.log('✅ Cloudinary configured');
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vanamap-plants',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// --- STEP 2: Add endpoints (around line 1500) ---

// Upload image only
app.post('/api/plants/upload-image', auth, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image' });

        console.log('[UPLOAD] Saved:', req.file.path);

        res.json({
            success: true,
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add plant with image
app.post('/api/plants', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const plantData = req.body;

        if (req.file) {
            plantData.imageUrl = req.file.path; // Cloudinary URL
            console.log('[PLANT] Image:', plantData.imageUrl);
        }

        const plant = await Plant.create(plantData);

        res.status(201).json({
            success: true,
            plant: plant
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// DONE! Restart server and test
// ========================================
