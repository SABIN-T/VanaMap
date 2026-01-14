# Cloudinary Setup for Render Deployment

## Issue: Server Error (500) on Image Upload

The error occurs because Cloudinary environment variables are not configured on your Render deployment.

## Solution: Add Cloudinary Environment Variables to Render

### Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in to your account
3. On the dashboard, you'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 2: Add Environment Variables to Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your **backend service** (the Node.js/Express API)
3. Click on **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add these three variables:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

**OR** use a single variable:

```
CLOUDINARY_URL = cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Step 3: Save and Redeploy

1. Click **"Save Changes"**
2. Render will automatically redeploy your service
3. Wait for deployment to complete (~2-3 minutes)

### Step 4: Verify

1. Check Render logs for: `✅ Cloudinary Storage Connected`
2. Try uploading an image again
3. Check logs for `[Upload] ✅ Success` message

## Troubleshooting

### If you still see errors:

**Check Render Logs:**
```
1. Go to Render Dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for [Upload] messages
```

**Common Issues:**

1. **"Cloudinary not configured"**
   - Environment variables not set correctly
   - Check spelling of variable names
   - Ensure no extra spaces in values

2. **"No storage path"**
   - Cloudinary credentials are invalid
   - Check API key and secret are correct
   - Verify cloud name matches your account

3. **"Unauthorized upload access"**
   - User role is not 'vendor' or 'admin'
   - Check user authentication

### Test Cloudinary Connection

Add this test endpoint to verify Cloudinary is working:

```javascript
app.get('/api/test-cloudinary', auth, (req, res) => {
    const isConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                        process.env.CLOUDINARY_API_KEY && 
                        process.env.CLOUDINARY_API_SECRET;
    
    res.json({
        configured: isConfigured,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
        apiKey: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗'
    });
});
```

## Expected Behavior After Fix

✅ Shop image uploads work
✅ Plant custom image uploads work (up to 3 per plant)
✅ Images stored permanently in Cloudinary
✅ URLs saved to MongoDB
✅ Images display immediately after upload

## Need Help?

If issues persist:
1. Check Render logs for detailed error messages
2. Verify Cloudinary account is active
3. Ensure you're using the correct credentials
4. Check Cloudinary usage limits (free tier: 25 credits/month)
