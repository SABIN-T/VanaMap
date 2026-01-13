# Admin Dashboard - Complete Functionality Checklist

## ✅ All Endpoints Have Admin Protection

Every admin endpoint is protected with `auth, admin` middleware.

---

## Admin Pages & API Endpoints Status

### 1. **Dashboard (Main)** - `/admin`
- **GET** `/api/admin/stats` ✅ Protected
- **Features:**
  - View total users, plants, vendors
  - Recent activity feed
  - Quick stats

---

### 2. **Manage Plants** - `/admin/manage-plants`
- **GET** `/api/plants` ✅ Protected
- **PATCH** `/api/plants/:id` ✅ Protected (approve/reject)
- **DELETE** `/api/plants/:id` ✅ Protected
- **Features:**
  - ✅ View all plants
  - ✅ Approve pending plants
  - ✅ Edit plant details
  - ✅ Delete plants

---

### 3. **Add Plant** - `/admin/add-plant`
- **POST** `/api/plants` ✅ Protected
- **Features:**
  - ✅ Add new plant with image upload
  - ✅ Set all plant properties
  - ✅ Cloudinary image storage

---

### 4. **Edit Plant** - `/admin/edit-plant/:id`
- **GET** `/api/plants/:id` ✅ Protected
- **PATCH** `/api/plants/:id` ✅ Protected
- **Features:**
  - ✅ Edit existing plant
  - ✅ Update image
  - ✅ Modify all fields

---

### 5. **Manage Vendors** - `/admin/manage-vendors`
- **GET** `/api/vendors` ✅ Protected
- **PATCH** `/api/vendors/:id` ✅ Protected (verify/unverify)
- **DELETE** `/api/vendors/:id` ✅ Protected
- **Features:**
  - ✅ View all vendors
  - ✅ Verify/revoke vendor status
  - ✅ Mark as highly recommended
  - ✅ Reset vendor password
  - ✅ Delete vendor account

---

### 6. **Add Vendor** - `/admin/add-vendor`
- **POST** `/api/vendors` ✅ Protected
- **Features:**
  - ✅ Create new vendor
  - ✅ Set location
  - ✅ Add inventory

---

### 7. **Manage Users** - `/admin/manage-users`
- **GET** `/api/users` ✅ Protected
- **PATCH** `/api/admin/users/:id/points` ✅ Protected
- **POST** `/api/admin/users/:id/gift-premium` ✅ Protected
- **POST** `/api/admin/reset-user-password` ✅ Protected
- **Features:**
  - ✅ View all users
  - ✅ Manage user points
  - ✅ Gift premium access
  - ✅ Reset user passwords
  - ✅ View user activity

---

### 8. **Broadcast Center** - `/admin/broadcast`
- **GET** `/api/admin/search-users` ✅ Protected
- **POST** `/api/admin/broadcast` ✅ Protected (with image upload)
- **Features:**
  - ✅ Send notifications to all users
  - ✅ Target specific user groups
  - ✅ Upload notification images
  - ✅ Set priority levels

---

### 9. **Customer Support** - `/admin/support`
- **GET** `/api/admin/support` ✅ Protected
- **POST** `/api/admin/support/:id/reply` ✅ Protected
- **Features:**
  - ✅ View support tickets
  - ✅ Reply to tickets
  - ✅ Mark as resolved

---

### 10. **Support Emails** - `/admin/support-emails`
- **GET** `/api/admin/support-emails` ✅ Protected
- **GET** `/api/admin/support-stats` ✅ Protected
- **PUT** `/api/admin/support-emails/:id/status` ✅ Protected
- **POST** `/api/admin/support-emails/:id/reply` ✅ Protected
- **DELETE** `/api/admin/support-emails/:id` ✅ Protected
- **Features:**
  - ✅ View all support emails
  - ✅ Reply to emails
  - ✅ Mark as read/replied/archived
  - ✅ Delete emails
  - ✅ View response stats

---

### 11. **Premium Settings** - `/admin/premium`
- **GET** `/api/admin/settings/premium` ✅ Protected
- **POST** `/api/admin/settings/premium` ✅ Protected
- **POST** `/api/admin/premium/renew` ✅ Protected
- **Features:**
  - ✅ Set premium price
  - ✅ Configure features
  - ✅ Manage promotions
  - ✅ Renew user premium

---

### 12. **Seed Dashboard** - `/admin/seed-dashboard`
- **GET** `/api/admin/seed-data` ✅ Protected
- **POST** `/api/admin/seed-single` ✅ Protected
- **POST** `/api/admin/seed-plants` ✅ Protected
- **PATCH** `/api/admin/seed-bank/:id/toggle-type` ✅ Protected
- **DELETE** `/api/admin/seed-bank/:id` ✅ Protected
- **Features:**
  - ✅ View seed bank
  - ✅ Add plants from seed
  - ✅ Toggle indoor/outdoor
  - ✅ Delete seed entries

---

### 13. **Pot Designs** - `/admin/pot-designs`
- **GET** `/api/admin/custom-pots` ✅ Protected
- **DELETE** `/api/admin/custom-pots/:id` ✅ Protected
- **Features:**
  - ✅ View user pot designs
  - ✅ Delete inappropriate designs

---

### 14. **Notifications** - `/admin/notifications`
- **GET** `/api/admin/notifications` ✅ Protected
- **DELETE** `/api/admin/notifications/:id` ✅ Protected
- **Features:**
  - ✅ View all notifications
  - ✅ Delete notifications

---

### 15. **Settings** - `/admin/settings`
- **GET** `/api/admin/settings/restricted-pages` ✅ Protected
- **POST** `/api/admin/settings/restricted-pages` ✅ Protected
- **POST** `/api/admin/settings` ✅ Protected
- **Features:**
  - ✅ Configure restricted pages
  - ✅ System settings
  - ✅ Feature toggles

---

### 16. **System Diagnostics** - `/admin/diagnostics`
- **GET** `/api/health` ✅ Public (for monitoring)
- **Features:**
  - ✅ View system health
  - ✅ Check API status
  - ✅ Monitor performance

---

## Common Issues & Solutions

### Issue: "Access denied. Admin only"

**Cause:** User role is not 'admin'

**Fix:**
1. Go to MongoDB Atlas
2. Find your user in `users` collection
3. Change `role: "user"` to `role: "admin"`
4. Logout and login again

### Issue: "Authentication required"

**Cause:** JWT token not being sent

**Fix:**
1. Check localStorage: `JSON.parse(localStorage.getItem('user')).token`
2. If missing, logout and login again
3. Check Network tab → Headers → Authorization should be present

### Issue: Buttons not working

**Cause:** Usually a frontend error or missing admin role

**Fix:**
1. Open browser console (F12)
2. Look for error messages
3. Verify admin role: `JSON.parse(localStorage.getItem('user')).role`
4. Should return `"admin"`

---

## Testing Checklist

### Before Testing:
- [ ] Ensure user has `role: "admin"` in MongoDB
- [ ] Login to admin panel
- [ ] Verify token in localStorage
- [ ] Open browser DevTools (F12)

### Test Each Page:

#### Manage Plants:
- [ ] Can view all plants
- [ ] Can approve pending plant
- [ ] Can delete plant
- [ ] Can edit plant details

#### Manage Vendors:
- [ ] Can view all vendors
- [ ] Can verify vendor
- [ ] Can revoke verification
- [ ] Can delete vendor
- [ ] Can reset password

#### Manage Users:
- [ ] Can view all users
- [ ] Can update points
- [ ] Can gift premium
- [ ] Can reset password

#### Broadcast:
- [ ] Can send notification
- [ ] Can upload image
- [ ] Can target user groups

#### Support:
- [ ] Can view tickets
- [ ] Can reply to tickets
- [ ] Can view emails
- [ ] Can reply to emails
- [ ] Can delete emails

---

## API Response Codes

- **200** - Success
- **201** - Created
- **400** - Bad request (validation error)
- **401** - Not authenticated (no token)
- **403** - Not authorized (not admin)
- **404** - Not found
- **500** - Server error

---

## Quick Debug Commands

### Check Admin Role:
```javascript
JSON.parse(localStorage.getItem('user')).role
// Should return: "admin"
```

### Check Token:
```javascript
JSON.parse(localStorage.getItem('user')).token
// Should return: "eyJhbGciOiJIUzI1NiIs..."
```

### Test API Call:
```javascript
fetch('https://plantoxy.onrender.com/api/admin/stats', {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
  }
}).then(r => r.json()).then(console.log)
```

---

## Conclusion

✅ **All admin endpoints are properly protected**  
✅ **All CRUD operations have auth + admin middleware**  
✅ **All pages should work if user has admin role**

**If something doesn't work:**
1. Check user role in MongoDB
2. Check browser console for errors
3. Check Network tab for failed requests
4. Verify JWT token is being sent
