# VanaMap Database Seeding Guide

## Overview
VanaMap automatically seeds the MongoDB database with all plants from `plant-data.js` on first startup. This ensures plants are always available across deployments.

## How It Works

### Automatic Seeding (Recommended)
The backend automatically checks if the database is empty on startup:
- If **0 plants** exist → Auto-seeds from `plant-data.js`
- If plants exist → Skips seeding

This happens in `index.js` during the `connectDB()` function.

### Manual Seeding
If you need to manually seed or re-seed the database:

```bash
cd backend
node seed-database.js
```

This will:
1. Connect to MongoDB
2. Read all plants from `plant-data.js`
3. Upsert (update or insert) all plants
4. Show summary of operations

## Plant Data Sources

### Primary Source: `plant-data.js`
- Contains all indoor and outdoor plants
- Exported as `indoorPlants` and `outdoorPlants` arrays
- Used by both auto-seeding and manual seeding

### Frontend Source: `frontend/src/data/mocks.ts`
- Contains the same plant data in TypeScript format
- Used by the frontend for display
- Should be kept in sync with `plant-data.js`

## Database Persistence

### What Persists
✅ **Plants added via Admin Panel** - Saved to MongoDB
✅ **Plant photos uploaded** - Saved to MongoDB (base64 or URL)
✅ **User-created data** - All user data persists
✅ **Vendor inventory** - Persists in MongoDB

### What Doesn't Persist (Without Database)
❌ Seed bank data (mocks.ts) - Only in code, not in database
❌ Static images - Need to be in `/public` or uploaded

## Ensuring Plants Always Show

### 1. Auto-Seeding (Enabled)
The backend now auto-seeds on startup if database is empty.

### 2. Image Persistence
For plant images to persist:
- **Option A**: Use external URLs (Unsplash, etc.) ✅ Recommended
- **Option B**: Upload to MongoDB as base64
- **Option C**: Store in cloud storage (Cloudinary, AWS S3)

### 3. Deployment Best Practices

**On Vercel/Render:**
1. Database auto-seeds on first deployment
2. Plants persist in MongoDB Atlas
3. No re-seeding needed on subsequent deploys

**On New Commits:**
- Database data is NOT affected by code commits
- Only code changes are deployed
- MongoDB data remains intact

## Troubleshooting

### Plants Not Showing
1. Check database connection: `node test-db.js`
2. Check plant count: 
   ```javascript
   const count = await Plant.countDocuments();
   console.log(count); // Should be > 0
   ```
3. Manually seed: `node seed-database.js`

### Images Not Loading
1. Check if URLs are valid
2. Verify CORS settings
3. Consider uploading to cloud storage

### After Git Push
- Plants in database: ✅ Persist
- Code changes: ✅ Deploy
- New plants in mocks.ts: ❌ Need manual seed or admin panel add

## Summary

🎯 **Key Points:**
- Database auto-seeds on first run
- Plants persist across deployments
- Manual seeding available via `seed-database.js`
- Images should use external URLs or cloud storage
- MongoDB data is separate from code commits

✅ **Your plants will always be available!**
