# 🔐 OTP VERIFICATION FOR CART & PREMIUM ACCESS

## 📋 REQUIREMENT SUMMARY

Users must verify their contact (email OR phone) before they can:
1. **Access Cart** - Add items to cart and checkout
2. **Access Premium/Heaven** - Buy premium subscription

## 🎯 IMPLEMENTATION PLAN

### **Part 1: Database Schema Updates**

Add to `backend/models.js` User schema (after line 79):

```javascript
emailVerified: { type: Boolean, default: false },
phoneVerified: { type: Boolean, default: false },
contactVerificationOTP: String,
contactOTPExpires: Date,
```

**Note:** Google OAuth users automatically get `emailVerified: true`

---

### **Part 2: Backend Routes**

#### **Route 1: Send Contact Verification OTP**
```javascript
// Send OTP for contact verification (email or phone)
app.post('/api/user/send-contact-otp', auth, async (req, res) => {
    try {
        const { method } = req.body; // 'email' or 'phone'
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already verified
        if (method === 'email' && user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }
        if (method === 'phone' && user.phoneVerified) {
            return res.status(400).json({ error: 'Phone already verified' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP (expires in 10 minutes)
        user.contactVerificationOTP = otp;
        user.contactOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send OTP
        if (method === 'email') {
            await sendEmail({
                to: user.email,
                subject: 'VanaMap - Verify Your Email',
                html: `
                    <h2>Email Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #10b981; font-size: 32px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                `
            });
        } else if (method === 'phone') {
            // SMS integration (Twilio/MSG91)
            // await sendSMS(user.phone, `Your VanaMap verification code is: ${otp}`);
            console.log(`[OTP] Phone verification code for ${user.phone}: ${otp}`);
        }

        res.json({ 
            success: true, 
            message: `OTP sent to your ${method}`,
            expiresIn: 600 // seconds
        });
    } catch (error) {
        console.error('[Contact OTP] Error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

#### **Route 2: Verify Contact OTP**
```javascript
// Verify contact OTP
app.post('/api/user/verify-contact-otp', auth, async (req, res) => {
    try {
        const { otp, method } = req.body; // method: 'email' or 'phone'
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check OTP expiry
        if (!user.contactOTPExpires || new Date() > user.contactOTPExpires) {
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        // Verify OTP
        if (user.contactVerificationOTP !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Mark as verified
        if (method === 'email') {
            user.emailVerified = true;
        } else if (method === 'phone') {
            user.phoneVerified = true;
        }

        // Clear OTP
        user.contactVerificationOTP = undefined;
        user.contactOTPExpires = undefined;
        await user.save();

        res.json({ 
            success: true, 
            message: `${method} verified successfully`,
            user: {
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified
            }
        });
    } catch (error) {
        console.error('[Contact Verify] Error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

#### **Route 3: Check Verification Status**
```javascript
// Get user verification status
app.get('/api/user/verification-status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            emailVerified: user.emailVerified || false,
            phoneVerified: user.phoneVerified || false,
            canAccessCart: user.emailVerified || user.phoneVerified,
            canAccessPremium: user.emailVerified || user.phoneVerified
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

### **Part 3: Update Google OAuth Route**

In the `/api/auth/google` route, automatically set `emailVerified: true`:

```javascript
// In the Google OAuth route (around line 1970)
user = new User({
    email,
    name,
    role: role || 'user',
    password: crypto.randomBytes(16).toString('hex'),
    verified: true,
    emailVerified: true, // ← ADD THIS
    googleAuth: true,
    // ... rest of fields
});
```

---

### **Part 4: Frontend Implementation**

#### **Create Verification Modal Component**

```typescript
// frontend/src/components/VerificationModal.tsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const VerificationModal = ({ onSuccess, onClose }) => {
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendOTP = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/send-contact-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ method })
            });
            
            if (response.ok) {
                setOtpSent(true);
                toast.success(`OTP sent to your ${method}!`);
            } else {
                const error = await response.json();
                toast.error(error.error);
            }
        } catch (error) {
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/verify-contact-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ otp, method })
            });
            
            if (response.ok) {
                toast.success('Verification successful!');
                onSuccess();
            } else {
                const error = await response.json();
                toast.error(error.error);
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-modal">
            <h2>Verify Your Contact</h2>
            <p>To access cart and premium features, please verify your contact.</p>
            
            {!otpSent ? (
                <>
                    <div className="method-selector">
                        <button 
                            className={method === 'email' ? 'active' : ''}
                            onClick={() => setMethod('email')}
                        >
                            📧 Email
                        </button>
                        <button 
                            className={method === 'phone' ? 'active' : ''}
                            onClick={() => setMethod('phone')}
                        >
                            📱 Phone
                        </button>
                    </div>
                    <button onClick={sendOTP} disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </>
            ) : (
                <>
                    <input 
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOTP} disabled={loading || otp.length !== 6}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button onClick={() => setOtpSent(false)}>
                        Resend OTP
                    </button>
                </>
            )}
            
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};
```

#### **Update Dashboard to Check Verification**

```typescript
// In Dashboard.tsx (or wherever cart/premium buttons are)
import { useEffect, useState } from 'react';
import { VerificationModal } from '../components/VerificationModal';

const [showVerificationModal, setShowVerificationModal] = useState(false);
const [isVerified, setIsVerified] = useState(false);

useEffect(() => {
    checkVerificationStatus();
}, []);

const checkVerificationStatus = async () => {
    try {
        const response = await fetch('/api/user/verification-status', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        setIsVerified(data.canAccessCart);
    } catch (error) {
        console.error('Failed to check verification');
    }
};

const handleCartClick = () => {
    if (!isVerified) {
        setShowVerificationModal(true);
    } else {
        // Navigate to cart
        navigate('/cart');
    }
};

const handlePremiumClick = () => {
    if (!isVerified) {
        setShowVerificationModal(true);
    } else {
        // Navigate to premium
        navigate('/premium');
    }
};
```

---

### **Part 5: Protected Routes**

Update `RestrictedRoute.tsx` to check verification:

```typescript
// Check if user is verified for cart/premium access
if (requiresVerification && !user.emailVerified && !user.phoneVerified) {
    return <Navigate to="/verify-contact" />;
}
```

---

## 🎯 USER FLOW

### **Scenario 1: Manual Signup User**
1. User signs up manually
2. Completes CAPTCHA verification
3. Tries to access cart/premium
4. **Blocked** → Verification modal appears
5. User selects email or phone
6. Receives OTP
7. Enters OTP
8. ✅ Verified → Can access cart/premium

### **Scenario 2: Google OAuth User**
1. User signs in with Google
2. `emailVerified` automatically set to `true`
3. ✅ Can immediately access cart/premium

---

## 📊 ANALYTICS INTEGRATION

### **Location-Based Ranking**

Vendors can see nearby users via:
```
GET /api/analytics/nearby-users
```

**Response:**
```json
{
  "total": 150,
  "within5km": 25,
  "within10km": 48,
  "within25km": 89,
  "within50km": 120,
  "byCity": {
    "Mumbai": 45,
    "Pune": 30
  },
  "byState": {
    "Maharashtra": 75,
    "Karnataka": 50
  }
}
```

This data is populated from:
- Google OAuth users' location (auto-captured)
- Manual signup users' location (from country/state/city fields)

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend
- [ ] Add verification fields to User model
- [ ] Create `/api/user/send-contact-otp` route
- [ ] Create `/api/user/verify-contact-otp` route
- [ ] Create `/api/user/verification-status` route
- [ ] Update Google OAuth route to set `emailVerified: true`
- [ ] Add location analytics endpoint (✅ DONE)

### Frontend
- [ ] Create `VerificationModal` component
- [ ] Update Dashboard to check verification
- [ ] Add verification check to cart button
- [ ] Add verification check to premium button
- [ ] Create `/verify-contact` page
- [ ] Update RestrictedRoute

### Testing
- [ ] Test email OTP flow
- [ ] Test phone OTP flow (when SMS integrated)
- [ ] Test Google OAuth auto-verification
- [ ] Test cart access restriction
- [ ] Test premium access restriction
- [ ] Test location analytics endpoint

---

## 🚀 DEPLOYMENT PRIORITY

**Phase 1 (High Priority):**
1. Add database fields
2. Create backend routes
3. Update Google OAuth route

**Phase 2 (Medium Priority):**
4. Create verification modal
5. Add verification checks to cart/premium

**Phase 3 (Low Priority):**
6. SMS integration (Twilio)
7. Advanced analytics dashboard

---

**Status:** Implementation plan ready
**Estimated Time:** 3-4 hours
**Complexity:** Medium

Would you like me to proceed with implementing all the backend routes now?
