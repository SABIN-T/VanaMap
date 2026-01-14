# Admin Access Troubleshooting Guide

## Issue: Admin Can't Delete or Perform Actions

### What I Fixed:

1. **Enhanced Admin Middleware** ✅
   - Added detailed logging to see exactly what's happening
   - Better error messages for debugging

2. **Created Admin Setup Script** ✅
   - File: `backend/ensure-admin.js`
   - Ensures admin user exists with correct role

---

## How to Fix Admin Access:

### Step 1: Check Render Logs

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Logs"
4. Look for messages like:
   ```
   [Admin Check] User: { id: '...', email: '...', role: '...' }
   [Admin Check] Role: admin
   ```

### Step 2: Verify Admin User Exists

Run this command on Render (or locally with MongoDB connection):

```bash
node backend/ensure-admin.js
```

This will:
- ✅ Check if admin@vanamap.com exists
- ✅ Create it if missing
- ✅ Ensure role is set to 'admin'

### Step 3: Test Admin Login

1. Go to: https://www.vanamap.online/admin/login
2. Login with:
   - **Email:** admin@vanamap.com
   - **Password:** admin123 (or your custom password)

3. Check browser console for errors
4. Check Render logs for:
   ```
   [Admin Check] ✅ Admin access granted
   ```

---

## Common Issues & Solutions:

### Issue 1: "Access denied. Admin only"

**Cause:** User role is not 'admin'

**Fix:**
```javascript
// Run in MongoDB or use ensure-admin.js
db.users.updateOne(
  { email: "admin@vanamap.com" },
  { $set: { role: "admin" } }
)
```

### Issue 2: "Authentication required"

**Cause:** JWT token not being sent

**Fix:**
1. Clear browser localStorage
2. Re-login to admin panel
3. Check Network tab → Headers → Authorization header should be present

### Issue 3: Token expired

**Cause:** JWT token older than 7 days

**Fix:**
1. Logout
2. Login again
3. Token will refresh

---

## Manual Admin User Creation

If you need to create admin manually in MongoDB:

```javascript
// In MongoDB shell or Compass
use your_database_name;

db.users.insertOne({
  name: "Admin",
  email: "admin@vanamap.com",
  password: "$2a$10$YourHashedPasswordHere",  // Use bcrypt to hash
  role: "admin",
  emailVerified: true,
  createdAt: new Date()
});
```

Or use the force-create-admin.js script:
```bash
node backend/force-create-admin.js
```

---

## Debugging Checklist:

- [ ] Admin user exists in database
- [ ] Admin user has `role: "admin"`
- [ ] JWT token is being sent in requests (check Network tab)
- [ ] Token contains `role: "admin"` (decode at jwt.io)
- [ ] Backend logs show admin check passing
- [ ] No CORS errors in console

---

## Quick Test:

1. **Login as admin**
2. **Open browser DevTools** (F12)
3. **Go to Console tab**
4. **Run:**
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('Role:', user?.role);
   console.log('Token:', user?.token?.substring(0, 20) + '...');
   ```

**Expected output:**
```
Role: admin
Token: eyJhbGciOiJIUzI1NiIs...
```

If role is NOT "admin", you need to update the user in database.

---

## After Deployment:

Wait 1-2 minutes for Render to restart, then:

1. Check Render logs for startup messages
2. Try admin actions again
3. Logs will now show detailed admin check information

---

**Need Help?**

Check Render logs at: https://dashboard.render.com/web/[your-service-id]/logs

Look for:
- `[Admin Check]` messages
- `[Vendor Update]` or `[Vendor Delete]` messages
- Any error stack traces
