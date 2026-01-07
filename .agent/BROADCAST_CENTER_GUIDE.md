# 📢 Admin Broadcast Center - Complete Guide

## ✅ **What You Get:**

A complete broadcast system for admins to send emails to users with:
- ✅ **Text messages**
- ✅ **Images**
- ✅ **Text + Images**
- ✅ **Send to all users** or **single user**
- ✅ **Search users** by name, email, or phone
- ✅ **Fully responsive** design (mobile, tablet, desktop)
- ✅ **Professional email templates**
- ✅ **Powered by Resend API**

---

## 🎯 **Features:**

### **1. Recipient Selection**
- 📣 **Broadcast to All** - Send to every registered user
- 👤 **Single User** - Search and select specific user

### **2. Message Types**
- 📄 **Text Only** - Send text message
- 🖼️ **Image Only** - Send image
- 📸 **Text + Image** - Send both

### **3. User Search**
- Search by **name**, **email**, or **phone number**
- Real-time results
- Select from search results

### **4. Professional Emails**
- VanaMap branding
- Responsive design
- Works on all email clients

---

## 📋 **Files Created:**

1. ✅ `frontend/src/pages/admin/BroadcastCenter.tsx` - Main component
2. ✅ `frontend/src/pages/admin/BroadcastCenter.module.css` - Responsive styles
3. ✅ `backend/broadcast-api.js` - API endpoints

---

## 🚀 **Installation Steps:**

### **Step 1: Install Dependencies**
```bash
cd backend
npm install multer
```

### **Step 2: Create Uploads Directory**
```bash
mkdir -p backend/uploads/broadcasts
```

### **Step 3: Add API Endpoints to Backend**

Copy the code from `backend/broadcast-api.js` to your `backend/index.js`:

```javascript
// Add at the top with other imports
const multer = require('multer');
const path = require('path');

// Add the multer configuration
const storage = multer.diskStorage({...});
const upload = multer({...});

// Add the two endpoints:
// 1. GET /api/admin/search-users
// 2. POST /api/admin/broadcast
```

### **Step 4: Add Route to Admin Dashboard**

In `frontend/src/pages/admin/Admin.tsx`, add navigation:

```typescript
<Link to="/admin/broadcast" className={styles.navLink}>
    📢 Broadcast Center
</Link>
```

### **Step 5: Add Route to App.tsx**

```typescript
import { BroadcastCenter } from './pages/admin/BroadcastCenter';

// In your routes:
<Route path="/admin/broadcast" element={<BroadcastCenter />} />
```

### **Step 6: Deploy**
```bash
git add .
git commit -m "Add Admin Broadcast Center"
git push
```

---

## 🎨 **UI Preview:**

```
┌─────────────────────────────────────────┐
│      📢 Broadcast Center                │
│   Send messages to your users via email │
├─────────────────────────────────────────┤
│                                         │
│  👥 Recipients                          │
│  [📣 All Users] [👤 Single User]       │
│                                         │
│  🔍 Search: [________________] [Search] │
│                                         │
│  📝 Message Type                        │
│  [📄 Text] [🖼️ Image] [📸 Both]       │
│                                         │
│  ✉️ Subject                             │
│  [_____________________________]        │
│                                         │
│  💬 Message                             │
│  [                                ]     │
│  [                                ]     │
│  [                                ]     │
│                                         │
│  🖼️ Image                               │
│  [📤 Upload Image]                      │
│                                         │
│  [🚀 Send Message]                      │
│  📣 This will send to all users         │
└─────────────────────────────────────────┘
```

---

## 📧 **Email Template Preview:**

```
┌────────────────────────────────┐
│  [VanaMap Logo]                │
│      VanaMap                   │
│  (Green Gradient Header)       │
├────────────────────────────────┤
│                                │
│  [Your Message Text]           │
│                                │
│  [Your Image (if included)]    │
│                                │
├────────────────────────────────┤
│  © 2026 VanaMap                │
│  vanamap.online                │
└────────────────────────────────┘
```

---

## 🔧 **API Endpoints:**

### **1. Search Users**
```
GET /api/admin/search-users?q=john
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "role": "user"
    }
  ]
}
```

### **2. Send Broadcast**
```
POST /api/admin/broadcast
Content-Type: multipart/form-data

{
  "recipientType": "all" | "single",
  "messageType": "text" | "image" | "both",
  "subject": "Special Offer!",
  "messageText": "Check out our new plants...",
  "image": [file],
  "recipientId": "123" (if single)
}
```

**Response:**
```json
{
  "success": true,
  "recipientCount": 150,
  "failedCount": 0,
  "message": "Successfully sent to 150 recipient(s)."
}
```

---

## 💡 **Use Cases:**

### **1. Promotional Campaigns**
- Send new plant arrivals
- Announce sales/discounts
- Share seasonal tips

### **2. Important Announcements**
- System maintenance
- Policy updates
- New features

### **3. Personalized Messages**
- Welcome VIP customers
- Birthday wishes
- Order confirmations

### **4. Marketing**
- Newsletter
- Event invitations
- Product launches

---

## 📱 **Responsive Design:**

### **Desktop (1200px+)**
- Two-column layout
- Large preview images
- Spacious forms

### **Tablet (768px - 1199px)**
- Single column
- Optimized spacing
- Touch-friendly buttons

### **Mobile (< 768px)**
- Stacked layout
- Full-width buttons
- Optimized font sizes
- Easy thumb navigation

---

## 🎯 **Features Breakdown:**

### ✅ **Recipient Selection**
- Toggle between "All Users" and "Single User"
- Search functionality with real-time results
- Display user info (name, email, phone, role)
- Visual selection confirmation

### ✅ **Message Composition**
- Subject line (max 100 characters)
- Rich text message area
- Image upload with preview
- File size limit: 5MB
- Supported formats: JPG, PNG, GIF, WebP

### ✅ **Email Delivery**
- Powered by Resend API
- Professional HTML templates
- VanaMap branding
- Mobile-responsive emails
- Delivery tracking

### ✅ **Admin Controls**
- Send confirmation
- Recipient count display
- Success/failure reporting
- Form validation

---

## 🚀 **Testing:**

### **1. Test Search**
```
1. Go to /admin/broadcast
2. Select "Single User"
3. Search for "john"
4. Verify results appear
5. Click to select user
```

### **2. Test Text Message**
```
1. Select "All Users"
2. Select "Text Only"
3. Enter subject: "Test Message"
4. Enter message: "Hello everyone!"
5. Click "Send Message"
6. Check your email
```

### **3. Test Image Message**
```
1. Select "Single User"
2. Search and select a user
3. Select "Image Only"
4. Upload an image
5. Enter subject
6. Send
7. Check recipient's email
```

### **4. Test Both**
```
1. Select "All Users"
2. Select "Text + Image"
3. Enter subject and message
4. Upload image
5. Send
6. Verify all users receive email
```

---

## 🔒 **Security:**

- ✅ **Admin-only access** (requires admin middleware)
- ✅ **File upload validation** (type, size)
- ✅ **Input sanitization**
- ✅ **Rate limiting** (prevent spam)
- ✅ **Error handling**

---

## 📊 **Limitations:**

- **File size:** 5MB max per image
- **Formats:** JPG, PNG, GIF, WebP only
- **Recipients:** No limit (but Resend has daily limits)
- **Resend free tier:** 100 emails/day, 3,000/month

---

## 🎉 **Benefits:**

1. ✅ **No third-party tools** needed
2. ✅ **Professional emails** with your branding
3. ✅ **Easy to use** admin interface
4. ✅ **Fully responsive** on all devices
5. ✅ **Integrated** with your existing system
6. ✅ **Cost-effective** (uses your Resend account)

---

## 🆘 **Troubleshooting:**

### **Images not uploading?**
- Check `uploads/broadcasts/` directory exists
- Verify file size < 5MB
- Check file format (JPG, PNG, GIF, WebP)

### **Emails not sending?**
- Verify `RESEND_API_KEY` in environment variables
- Check Resend dashboard for errors
- Verify sender domain is verified

### **Search not working?**
- Check backend is running
- Verify admin authentication
- Check browser console for errors

---

**Your admin broadcast system is ready!** 🎉

You can now send professional emails to your users with text, images, or both!
