# How to Rename Email in Resend Dashboard

## 🎯 Quick Steps (2 minutes):

### Option 1: Edit Existing Email (Recommended)
Unfortunately, Resend doesn't allow renaming email addresses directly. You need to:

1. **Go to Resend Dashboard**: https://resend.com/domains
2. **Click on `vanamap.online`**
3. **Go to "Email Addresses" tab**
4. **Delete `noreply@vanamap.online`** (if it exists)
5. **Click "Add Email Address"**
6. **Enter**: `support@vanamap.online`
7. **Click "Create"**

### Option 2: Just Use noreply (Alternative)
If you want to keep using `noreply@vanamap.online`:
- The code is already updated to use `support@vanamap.online`
- But you can keep the Resend email as `noreply@vanamap.online`
- Resend will still deliver emails, just the "From" name will show as "support"

## ✅ What Was Changed in Code:

All email sending now uses: `support@vanamap.online`

**Files Updated:**
- `backend/index.js` - All email sending functions
- `backend/broadcast-api.js` - Broadcast emails

**Locations Changed:**
- ✅ OTP emails
- ✅ Welcome emails
- ✅ Password reset emails
- ✅ Vendor approval/rejection emails
- ✅ Newsletter emails
- ✅ Broadcast notifications
- ✅ Support auto-replies

## 🔧 Webhook Setup:

After renaming to `support@vanamap.online`:

1. **Go to Resend Dashboard** → **Webhooks**
2. **Click "Add Webhook"**
3. **Endpoint URL**: `https://plantoxy.onrender.com/api/webhooks/resend-email`
4. **Events**: Select `email.received`
5. **Click "Create Webhook"**

This will forward all emails sent to `support@vanamap.online` to your backend!

## 📧 Email Flow:

```
Customer sends email to support@vanamap.online
    ↓
Resend receives it
    ↓
Webhook triggers → Your backend
    ↓
Email saved to database
    ↓
Auto-reply sent from support@vanamap.online
    ↓
You see it in admin dashboard
```

## 💡 Pro Tip:

You can use the same email address for both:
- **Sending** emails (OTP, notifications, etc.)
- **Receiving** support emails

This is perfect for a small business/startup! 🚀

---

**All code changes are done and pushed! Just rename the email in Resend dashboard.**
