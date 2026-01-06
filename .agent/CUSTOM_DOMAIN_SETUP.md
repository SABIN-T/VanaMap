# 🌐 CUSTOM DOMAIN SETUP - www.vanamap.online

## ✅ REQUIRED CHANGES

### **1. Google Cloud Console (CRITICAL - Do This First!)**

Go to: https://console.cloud.google.com/apis/credentials

Click your OAuth Client ID and add these URLs:

#### **Authorized JavaScript origins:**
```
https://www.vanamap.online
https://vanamap.online
https://vanamap.vercel.app
http://localhost:5173
```

#### **Authorized redirect URIs:**
```
https://www.vanamap.online
https://vanamap.online
https://vanamap.vercel.app
http://localhost:5173
```

**Important:**
- Add BOTH `www.vanamap.online` AND `vanamap.online` (with and without www)
- Click **Save**
- Wait 5-10 minutes for changes to propagate

---

### **2. Vercel Environment Variables (Optional but Recommended)**

If you want to explicitly set the API URL, add this to Vercel:

**Variable Name:** `VITE_API_URL`
**Value:** `https://plantoxy.onrender.com/api`

**How to add:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the variable
5. Redeploy

**Note:** This is optional since your code already has `https://plantoxy.onrender.com/api` as the fallback.

---

### **3. Update CORS on Backend (If Needed)**

Check if your backend (`plantoxy.onrender.com`) allows requests from your custom domain.

Your backend should have CORS configured like this:

```javascript
// In backend/index.js
const cors = require('cors');

app.use(cors({
    origin: [
        'https://www.vanamap.online',
        'https://vanamap.online',
        'https://vanamap.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));
```

Let me check your current CORS configuration...

---

## 🧪 TESTING CHECKLIST

### **After Adding URLs to Google Console:**

1. **Wait 5-10 minutes** for Google to propagate changes

2. **Test on your custom domain:**
   ```
   Visit: https://www.vanamap.online/auth
   Click: "Continue with Google"
   Expected: Google popup → Select account → Success
   ```

3. **Test without www:**
   ```
   Visit: https://vanamap.online/auth
   Click: "Continue with Google"
   Expected: Should also work
   ```

4. **Test on Vercel subdomain:**
   ```
   Visit: https://vanamap.vercel.app/auth
   Click: "Continue with Google"
   Expected: Should work
   ```

---

## 🔍 CURRENT CONFIGURATION

### **Frontend (www.vanamap.online):**
- ✅ Hosted on Vercel
- ✅ Custom domain configured
- ✅ Google Client ID: `1962862596-913q2agm2ut7dot7dm6ml58rsvtp3adp.apps.googleusercontent.com`
- ✅ API URL: `https://plantoxy.onrender.com/api` (fallback)

### **Backend (plantoxy.onrender.com):**
- ✅ Hosted on Render
- ✅ Google OAuth route: `/api/auth/google`
- ⚠️ CORS: Needs to allow `www.vanamap.online`

---

## 🚨 COMMON ISSUES & FIXES

### **Issue: "Error 401: invalid_client"**
**Cause:** Domain not added to Google Console
**Fix:** Add `https://www.vanamap.online` to Authorized JavaScript origins

### **Issue: "CORS error"**
**Cause:** Backend doesn't allow requests from custom domain
**Fix:** Update CORS configuration on backend (see below)

### **Issue: "Redirect URI mismatch"**
**Cause:** Redirect URI not whitelisted
**Fix:** Add domain to Authorized redirect URIs

---

## 📝 SUMMARY OF CHANGES

### **What You Need to Do:**

1. ✅ **Google Console** (5 min)
   - Add `https://www.vanamap.online`
   - Add `https://vanamap.online`
   - Save and wait 10 minutes

2. ⚠️ **Backend CORS** (2 min)
   - I'll check and update if needed

3. ✅ **Test** (2 min)
   - Visit your site
   - Try Google Sign-In
   - Verify it works

---

## 🎯 PRIORITY ORDER

1. **CRITICAL:** Add domains to Google Console (without this, nothing works)
2. **IMPORTANT:** Update backend CORS (if needed)
3. **OPTIONAL:** Add `VITE_API_URL` to Vercel env vars

---

**Status:** Ready to configure
**Time Required:** 15 minutes total
**Difficulty:** Easy

Let me know once you've added the URLs to Google Console, and I'll help verify everything works!
