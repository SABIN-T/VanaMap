# Email Support System Setup for VanaMap

## 🎯 Overview
Create `support@vanamap.online` using Resend and build an admin dashboard to manage all incoming support emails.

## 📧 Step 1: Setup support@vanamap.online in Resend

### 1.1 Add Email Address in Resend Dashboard
1. Go to https://resend.com/domains
2. Click on your domain `vanamap.online`
3. Go to **Email Addresses** tab
4. Click **Add Email Address**
5. Enter: `support@vanamap.online`
6. Click **Create**

### 1.2 Configure Email Forwarding (Webhook)
Resend will forward all incoming emails to your backend webhook:
1. In Resend Dashboard → **Webhooks**
2. Click **Add Webhook**
3. **Endpoint URL**: `https://plantoxy.onrender.com/api/webhooks/resend-email`
4. **Events**: Select `email.received`
5. Click **Create Webhook**
6. Copy the **Signing Secret** (for verification)

## 🔧 Step 2: Backend Implementation

### 2.1 Environment Variables
Add to `.env`:
```env
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 2.2 Database Schema
Create `SupportEmail` model in `models.js`:
```javascript
const SupportEmailSchema = new mongoose.Schema({
    messageId: String,
    from: String,
    to: String,
    subject: String,
    text: String,
    html: String,
    receivedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    assignedTo: String, // Admin user ID
    tags: [String],
    reply: {
        message: String,
        sentAt: Date,
        sentBy: String
    },
    attachments: [{
        filename: String,
        url: String,
        size: Number
    }]
}, { timestamps: true });
```

### 2.3 API Endpoints
```javascript
// Webhook to receive emails
POST /api/webhooks/resend-email

// Admin endpoints
GET /api/admin/support-emails
GET /api/admin/support-emails/:id
PUT /api/admin/support-emails/:id/status
POST /api/admin/support-emails/:id/reply
DELETE /api/admin/support-emails/:id
```

## 🎨 Step 3: Admin Dashboard Features

### Features to Build:
- ✅ Inbox view with email list
- ✅ Email detail view
- ✅ Reply functionality
- ✅ Status management (unread/read/replied/archived)
- ✅ Priority tagging
- ✅ Search and filter
- ✅ Auto-refresh for new emails
- ✅ Email statistics (total, unread, replied)

## 🔒 Step 4: Security
- Verify webhook signatures from Resend
- Admin-only access to support emails
- Sanitize email content (prevent XSS)
- Rate limiting on reply endpoint

## 📊 Step 5: Analytics
Track:
- Response time
- Resolution rate
- Most common issues
- Peak support hours

## 🚀 Next Steps
1. Setup `support@vanamap.online` in Resend
2. Implement backend webhook and APIs
3. Create admin UI for email management
4. Test email flow
5. Add auto-responder for new emails

---

**This will give you a complete email support system integrated directly into your admin dashboard!**
