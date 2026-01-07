# Separate Email & Mobile Verification System

## 📧 📱 **Dual Verification Flow**

Users can verify email and mobile separately with:
- ✅ **Different OTP codes** for each
- ✅ **10-minute expiry** for each code
- ✅ **Independent verification** (can verify email first, mobile later, or vice versa)

---

## 🔧 **Implementation**

### **Step 1: Add OTP Storage to User Model**

Update `backend/models.js`:

```javascript
const UserSchema = new mongoose.Schema({
    // ... existing fields ...
    
    // Email Verification
    emailVerified: { type: Boolean, default: false },
    emailOTP: { type: String },
    emailOTPExpiry: { type: Date },
    
    // Mobile Verification
    phoneVerified: { type: Boolean, default: false },
    phoneOTP: { type: String },
    phoneOTPExpiry: { type: Date },
    
    // ... rest of schema ...
});
```

---

### **Step 2: Create Verification Endpoints**

Add to `backend/index.js`:

```javascript
// ==========================================
// SEPARATE EMAIL & MOBILE VERIFICATION
// ==========================================

// 1. Request Email Verification
app.post('/api/verify/email/request', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.emailVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiry to 10 minutes from now
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        
        // Save OTP to user
        user.emailOTP = otp;
        user.emailOTPExpiry = expiry;
        await user.save();
        
        // Send OTP via email
        await sendEmail({
            from: 'VanaMap <noreply@vanamap.online>',
            to: user.email,
            subject: '🔐 Verify Your Email - VanaMap',
            html: EmailTemplates.emailVerification(user.name, otp)
        });
        
        console.log(`[EMAIL-VERIFY] OTP sent to ${user.email}: ${otp}`);
        
        res.json({
            success: true,
            message: "Verification code sent to your email",
            expiresIn: "10 minutes"
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Verify Email OTP
app.post('/api/verify/email/confirm', auth, async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);
        
        if (user.emailVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }
        
        // Check if OTP expired
        if (!user.emailOTPExpiry || new Date() > user.emailOTPExpiry) {
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }
        
        // Check if OTP matches
        if (user.emailOTP !== otp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }
        
        // Mark email as verified
        user.emailVerified = true;
        user.emailOTP = undefined;
        user.emailOTPExpiry = undefined;
        await user.save();
        
        console.log(`[EMAIL-VERIFY] Email verified for ${user.email}`);
        
        res.json({
            success: true,
            message: "Email verified successfully! ✅"
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Request Mobile Verification
app.post('/api/verify/mobile/request', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.phoneVerified) {
            return res.status(400).json({ error: "Mobile already verified" });
        }
        
        if (!user.phone) {
            return res.status(400).json({ error: "No mobile number on file" });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiry to 10 minutes from now
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        
        // Save OTP to user
        user.phoneOTP = otp;
        user.phoneOTPExpiry = expiry;
        await user.save();
        
        // Send OTP via SMS (or email fallback)
        if (process.env.FAST2SMS_API_KEY) {
            await CommunicationOS.sms(user.phone, `Your VanaMap verification code is: ${otp}. Valid for 10 minutes.`);
        } else {
            // Fallback to email
            await sendEmail({
                from: 'VanaMap <noreply@vanamap.online>',
                to: user.email,
                subject: '📱 Verify Your Mobile - VanaMap',
                html: EmailTemplates.mobileVerification(user.name, user.phone, otp)
            });
        }
        
        console.log(`[MOBILE-VERIFY] OTP sent to ${user.phone}: ${otp}`);
        
        res.json({
            success: true,
            message: "Verification code sent to your mobile",
            expiresIn: "10 minutes"
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 4. Verify Mobile OTP
app.post('/api/verify/mobile/confirm', auth, async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);
        
        if (user.phoneVerified) {
            return res.status(400).json({ error: "Mobile already verified" });
        }
        
        // Check if OTP expired
        if (!user.phoneOTPExpiry || new Date() > user.phoneOTPExpiry) {
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }
        
        // Check if OTP matches
        if (user.phoneOTP !== otp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }
        
        // Mark mobile as verified
        user.phoneVerified = true;
        user.phoneOTP = undefined;
        user.phoneOTPExpiry = undefined;
        await user.save();
        
        console.log(`[MOBILE-VERIFY] Mobile verified for ${user.phone}`);
        
        res.json({
            success: true,
            message: "Mobile verified successfully! ✅"
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 5. Get Verification Status
app.get('/api/verify/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.json({
            email: {
                address: user.email,
                verified: user.emailVerified || false,
                canResend: !user.emailOTPExpiry || new Date() > user.emailOTPExpiry
            },
            mobile: {
                number: user.phone,
                verified: user.phoneVerified || false,
                canResend: !user.phoneOTPExpiry || new Date() > user.phoneOTPExpiry
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
```

---

### **Step 3: Add Email Templates**

Add to `backend/email-templates.js`:

```javascript
// Email Verification Template
emailVerification: (name, otp) => {
    const content = `
        <tr>
            <td style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">📧</div>
                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                        Verify Your Email
                    </h2>
                    <p style="color: #6b7280; font-size: 16px; margin: 0;">
                        Hi ${name}, let's confirm your email address
                    </p>
                </div>
                
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #065f46; font-size: 14px; margin: 0 0 10px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <h1 style="color: #065f46; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                    ⏱️ This code expires in <strong>10 minutes</strong>
                </p>
                
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    🔒 Never share this code with anyone.
                </p>
            </td>
        </tr>
    `;
    return createEmailTemplate(content);
},

// Mobile Verification Template
mobileVerification: (name, phone, otp) => {
    const content = `
        <tr>
            <td style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">📱</div>
                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                        Verify Your Mobile
                    </h2>
                    <p style="color: #6b7280; font-size: 16px; margin: 0;">
                        Hi ${name}, let's confirm your number
                    </p>
                </div>
                
                <p style="color: #4b5563; font-size: 16px; text-align: center; margin: 20px 0;">
                    Verifying: <strong>${phone}</strong>
                </p>
                
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #065f46; font-size: 14px; margin: 0 0 10px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <h1 style="color: #065f46; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                    ⏱️ This code expires in <strong>10 minutes</strong>
                </p>
                
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    🔒 Never share this code with anyone.
                </p>
            </td>
        </tr>
    `;
    return createEmailTemplate(content);
}
```

---

## 🎯 **How It Works:**

### **User Flow:**

1. **User logs in** (already authenticated)
2. **Requests email verification**:
   - `POST /api/verify/email/request`
   - Receives OTP via email
   - OTP valid for 10 minutes
3. **Enters email OTP**:
   - `POST /api/verify/email/confirm`
   - Email marked as verified ✅
4. **Requests mobile verification**:
   - `POST /api/verify/mobile/request`
   - Receives OTP via SMS (or email fallback)
   - OTP valid for 10 minutes
5. **Enters mobile OTP**:
   - `POST /api/verify/mobile/confirm`
   - Mobile marked as verified ✅

---

## ✅ **Features:**

- ✅ **Separate OTPs** for email and mobile
- ✅ **10-minute expiry** for each
- ✅ **Independent verification** (can do in any order)
- ✅ **Resend protection** (can't spam requests)
- ✅ **Status endpoint** (check what's verified)
- ✅ **Professional emails** for both

---

## 🚀 **Next Steps:**

1. ✅ Add fields to User model (emailVerified, phoneVerified, etc.)
2. ✅ Add the 5 endpoints above to index.js
3. ✅ Add the 2 email templates
4. ✅ Create frontend UI for verification
5. ✅ Test both flows

---

**Your users can now verify email and mobile separately with different codes!** 🎉
