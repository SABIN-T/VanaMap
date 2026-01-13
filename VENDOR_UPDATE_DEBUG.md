# Vendor Profile Update Debugging Guide

## Issue: "User not found" when saving vendor profile

### Quick Fix Steps:

#### 1. **Check Render Logs** (Most Important)
After deployment completes (2-3 minutes), try saving your vendor profile again and immediately check Render logs:

**What to look for:**
```
[Vendor Self-Update] Request received
[Vendor Self-Update] User: { id: '...', email: '...', role: 'vendor' }
[Vendor Self-Update] Vendor ID param: ...
[Vendor Self-Update] Vendor found by email: true/false
```

**If you see:**
- `❌ No user in request` → JWT token issue (re-login)
- `❌ Vendor not found in database` → Vendor doesn't exist in MongoDB
- `❌ Not authorized` → User ID doesn't match vendor ID

---

#### 2. **Verify User Role in MongoDB**

**Check in MongoDB Atlas:**
1. Go to MongoDB Atlas → Browse Collections
2. Open `users` collection
3. Find your user by email
4. Check the `role` field:
   ```json
   {
     "email": "your@email.com",
     "role": "vendor",  // Must be "vendor"
     "id": "123456"
   }
   ```

---

#### 3. **Verify Vendor Exists**

**Check in MongoDB Atlas:**
1. Go to `vendors` collection
2. Find vendor by `ownerEmail`
3. Verify it exists:
   ```json
   {
     "id": "123456",
     "name": "VanaMap",
     "ownerEmail": "your@email.com",  // Must match user email
     "verified": false
   }
   ```

---

#### 4. **Common Issues & Fixes**

**Issue A: User role is not "vendor"**
```javascript
// Fix in MongoDB:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "vendor" } }
)
```

**Issue B: Vendor doesn't exist**
- Register as vendor first through `/vendor/profile`
- Or create manually in MongoDB

**Issue C: User ID doesn't match Vendor ID**
```javascript
// Fix in MongoDB - Update vendor's ID to match user's ID:
db.vendors.updateOne(
  { ownerEmail: "your@email.com" },
  { $set: { id: "USER_ID_HERE" } }
)
```

**Issue D: JWT token expired**
- Logout and login again
- Clear browser cache
- Check localStorage for valid token

---

#### 5. **Test After Fix**

1. **Logout** from VanaMap
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Login again**
4. Go to **Vendor → Shop Settings**
5. Try **saving profile**

---

## Expected Behavior After Fix:

### Successful Save:
```
[Vendor Self-Update] Request received
[Vendor Self-Update] User: { id: '123', email: 'vendor@email.com', role: 'vendor' }
[Vendor Self-Update] Vendor ID param: 123
[Vendor Self-Update] ✅ VanaMap updated their profile
```

### Response:
```json
{
  "id": "123",
  "name": "VanaMap",
  "phone": "9188773534",
  "address": "Ayunikad",
  "latitude": 11.53773,
  "longitude": 75.81384,
  "verified": false
}
```

---

## Still Not Working?

### Check These:

1. **Render Deployment Status**
   - Go to Render dashboard
   - Check if deployment succeeded
   - Look for any build errors

2. **Frontend Deployment**
   - Go to Vercel dashboard
   - Check if deployment succeeded
   - Clear Vercel cache if needed

3. **Browser Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API responses

4. **API Endpoint**
   - Verify it's calling: `/api/vendors/profile/:id`
   - NOT calling: `/api/vendors/:id` (old endpoint)

---

## Manual Database Fix (If Needed)

If vendor and user IDs don't match:

```javascript
// In MongoDB Atlas → Data Explorer → Run Query

// 1. Find your user ID
db.users.findOne({ email: "your@email.com" })
// Copy the "id" or "_id" value

// 2. Update vendor to use same ID
db.vendors.updateOne(
  { ownerEmail: "your@email.com" },
  { $set: { id: "PASTE_USER_ID_HERE" } }
)
```

---

## Contact Support

If issue persists after trying all steps:
1. Share Render logs (last 50 lines)
2. Share MongoDB user document (hide sensitive data)
3. Share MongoDB vendor document (hide sensitive data)
4. Share browser console errors

**WhatsApp Support:** +91 9188773534
