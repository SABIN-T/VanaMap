# Quick Fix: Admin Can't Delete Vendors

## The Problem
Admin middleware is working, but your user account doesn't have `role: "admin"` in the database.

## The Solution

### Option 1: Update Your User Role in MongoDB (Recommended)

1. **Go to MongoDB Atlas:**
   - Visit https://cloud.mongodb.com
   - Login to your account
   - Select your cluster

2. **Open Collections:**
   - Click "Browse Collections"
   - Find the `users` collection

3. **Find Your Admin User:**
   - Search for email: `admin@vanamap.com` (or your admin email)

4. **Update the Role:**
   - Click "Edit" on that user
   - Change `role` field to: `"admin"`
   - Click "Update"

### Option 2: Create New Admin User

If no admin exists, add this document to `users` collection:

```json
{
  "name": "Admin",
  "email": "admin@vanamap.com",
  "password": "$2a$10$rZ5qN8vZ5qN8vZ5qN8vZ5uXYZ5qN8vZ5qN8vZ5qN8vZ5qN8vZ5qN8",
  "role": "admin",
  "emailVerified": true,
  "createdAt": { "$date": "2026-01-13T00:00:00.000Z" }
}
```

**Password:** `admin123` (hash shown above)

### Option 3: Use Existing User

If you already have a user account:

1. Find your user in MongoDB
2. Change the `role` field from `"user"` to `"admin"`
3. Logout and login again

## How to Verify It Works

1. **Login to admin panel:**
   - Go to: https://www.vanamap.online/admin/login
   - Use your admin credentials

2. **Check localStorage:**
   - Press F12 (DevTools)
   - Console tab
   - Type: `JSON.parse(localStorage.getItem('user')).role`
   - Should return: `"admin"`

3. **Try deleting a vendor:**
   - Should work now!

## Common Mistakes

❌ **Wrong:** `role: "Admin"` (capital A)  
✅ **Correct:** `role: "admin"` (lowercase)

❌ **Wrong:** User has `role: "user"`  
✅ **Correct:** User has `role: "admin"`

## Still Not Working?

Check if JWT token is being sent:
1. F12 → Network tab
2. Try deleting a vendor
3. Click the DELETE request
4. Headers tab → Look for `Authorization: Bearer ...`

If missing, logout and login again.
