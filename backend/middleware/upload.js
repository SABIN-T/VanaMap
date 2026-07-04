/**
 * File Upload Configuration
 * Cloudinary storage + multer setup
 */
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const isCloudinaryConfigured = process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (isCloudinaryConfigured) {
    console.log('✅ Cloudinary Storage Connected');
} else {
    console.log('❌ Cloudinary Configuration Missing (Check CLOUDINARY_URL or keys)');
}

/**
 * Primary Cloudinary storage — for plant images
 */
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
    limits: {
        fileSize: 20 * 1024 * 1024,  // 20MB max
        files: 1
    }
});

/**
 * Broadcast upload — for admin broadcast images (in-memory)
 */
const broadcastUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { upload, broadcastUpload, cloudinary, isCloudinaryConfigured };
