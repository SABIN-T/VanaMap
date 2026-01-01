# 📸 Image Storage: MongoDB + Cloudinary Hybrid Solution

## 🎯 Best of Both Worlds

Store **small images** (< 1MB) in MongoDB, **large images** in Cloudinary.

---

## ✅ Implementation

### Step 1: Install Packages

```bash
npm install cloudinary multer multer-storage-cloudinary
```

### Step 2: Add to `index.js`

```javascript
// --- HYBRID IMAGE STORAGE ---
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (optional - only if you want cloud backup)
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('✅ Cloudinary configured for large images');
}

// Multer memory storage for MongoDB
const memoryStorage = multer.memoryStorage();
const upload = multer({ 
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// --- SMART IMAGE UPLOAD ENDPOINT ---
app.post('/api/plants/upload-image', auth, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const fileSize = req.file.size;
        const fileSizeMB = fileSize / (1024 * 1024);
        
        console.log(`[UPLOAD] Image size: ${fileSizeMB.toFixed(2)}MB`);

        // STRATEGY 1: Small images (< 1MB) → MongoDB (Base64)
        if (fileSize < 1024 * 1024) {
            const base64Image = req.file.buffer.toString('base64');
            const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
            
            console.log('[UPLOAD] Stored in MongoDB (small image)');
            
            return res.json({
                success: true,
                imageUrl: dataUrl,
                storage: 'mongodb',
                size: fileSizeMB.toFixed(2) + 'MB'
            });
        }

        // STRATEGY 2: Large images (> 1MB) → Cloudinary
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            // Upload to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'vanamap-plants',
                    transformation: [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto:good' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('[UPLOAD] Cloudinary error:', error);
                        return res.status(500).json({ error: 'Cloud upload failed' });
                    }
                    
                    console.log('[UPLOAD] Stored in Cloudinary (large image)');
                    
                    res.json({
                        success: true,
                        imageUrl: result.secure_url,
                        storage: 'cloudinary',
                        size: fileSizeMB.toFixed(2) + 'MB'
                    });
                }
            );
            
            // Pipe the buffer to Cloudinary
            const bufferStream = require('stream').Readable.from(req.file.buffer);
            bufferStream.pipe(uploadStream);
            
        } else {
            // Fallback: Store large image in MongoDB anyway
            const base64Image = req.file.buffer.toString('base64');
            const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
            
            console.log('[UPLOAD] Stored in MongoDB (Cloudinary not configured)');
            
            return res.json({
                success: true,
                imageUrl: dataUrl,
                storage: 'mongodb-fallback',
                size: fileSizeMB.toFixed(2) + 'MB',
                warning: 'Large image stored in MongoDB. Consider using Cloudinary for better performance.'
            });
        }
        
    } catch (error) {
        console.error('[UPLOAD] Error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

// --- ADD PLANT WITH IMAGE ---
app.post('/api/plants', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const plantData = req.body;
        
        // If image was uploaded
        if (req.file) {
            const fileSize = req.file.size;
            
            // Small image: Store in MongoDB
            if (fileSize < 1024 * 1024) {
                const base64Image = req.file.buffer.toString('base64');
                plantData.imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
                console.log('[PLANT] Image stored in MongoDB');
            } 
            // Large image: Store in Cloudinary
            else if (process.env.CLOUDINARY_CLOUD_NAME) {
                // Upload to Cloudinary synchronously
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'vanamap-plants',
                            transformation: [
                                { width: 1200, height: 1200, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    
                    const bufferStream = require('stream').Readable.from(req.file.buffer);
                    bufferStream.pipe(uploadStream);
                });
                
                plantData.imageUrl = result.secure_url;
                console.log('[PLANT] Image stored in Cloudinary');
            }
            // Fallback: Store in MongoDB
            else {
                const base64Image = req.file.buffer.toString('base64');
                plantData.imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
                console.log('[PLANT] Image stored in MongoDB (fallback)');
            }
        }
        
        // Create plant in database
        const plant = await Plant.create(plantData);
        
        res.status(201).json({
            success: true,
            plant: plant
        });
        
    } catch (error) {
        console.error('[PLANT] Error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

---

## 🎯 How It Works

### Smart Decision:

```javascript
if (image < 1MB) {
    // Store in MongoDB (Base64)
    ✅ Fast, no external service
} else {
    // Store in Cloudinary (URL)
    ✅ Better performance, CDN
}
```

### What Gets Stored in MongoDB:

**Small images:**
```json
{
  "name": "Rose",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Image data
}
```

**Large images:**
```json
{
  "name": "Rose",
  "imageUrl": "https://res.cloudinary.com/..." // URL only
}
```

---

## 📊 Comparison

| Feature | MongoDB Only | Cloudinary Only | **Hybrid** |
|---------|-------------|-----------------|------------|
| Small images | ✅ Fast | ⚠️ Overkill | ✅ **Best** |
| Large images | ❌ Slow | ✅ Fast | ✅ **Best** |
| Setup | ✅ Easy | ⚠️ Need signup | ✅ **Flexible** |
| Cost | ⚠️ DB storage | ✅ Free 25GB | ✅ **Optimal** |
| Performance | ⚠️ Slower | ✅ CDN | ✅ **Best** |

---

## ✅ Benefits of Hybrid Approach

1. **✅ Works immediately** - No Cloudinary needed for small images
2. **✅ Scales well** - Large images use Cloudinary
3. **✅ Cost-effective** - Only use Cloudinary when needed
4. **✅ Fast** - Small images from MongoDB, large from CDN
5. **✅ Flexible** - Works with or without Cloudinary

---

## 🚀 Setup

### Option A: MongoDB Only (Simple)

Just use the code above. It will:
- Store ALL images in MongoDB (Base64)
- No external service needed
- Works immediately

### Option B: Hybrid (Recommended)

1. Sign up at cloudinary.com (optional)
2. Add credentials to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Restart server

Now it will:
- Small images → MongoDB
- Large images → Cloudinary

---

## 💡 Recommendation

**For your use case:**

If you have:
- **Mostly small plant icons** → MongoDB only is fine
- **Mix of sizes** → Use hybrid approach
- **High-res photos** → Definitely use Cloudinary

**My recommendation:** Start with **MongoDB only** (simpler), add Cloudinary later if needed.

---

## 🎯 MongoDB-Only Implementation

Want to keep it simple? Here's MongoDB-only code:

```javascript
// Simple MongoDB storage
app.post('/api/plants', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const plantData = req.body;
        
        if (req.file) {
            // Convert to Base64 and store in MongoDB
            const base64Image = req.file.buffer.toString('base64');
            plantData.imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        }
        
        const plant = await Plant.create(plantData);
        res.status(201).json({ success: true, plant });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

**That's it!** Images saved in MongoDB, no external service needed.

---

**🌿 Both options work! MongoDB is simpler, Cloudinary is better for large images. Your choice! 📸✨**
