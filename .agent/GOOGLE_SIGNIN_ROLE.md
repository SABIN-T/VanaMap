# Google Sign-In with Role Selection

## 🎯 **Requirements:**

1. ✅ When user clicks Google Sign-In, ask "Are you a User or Vendor?"
2. ✅ Save the role to their account
3. ✅ Route to correct dashboard (User Dashboard or Vendor Dashboard)
4. ✅ Show actual name instead of "Hello Friend"

---

## 🔧 **Implementation**

### **Step 1: Add Role Selection Modal**

Create a new component `RoleSelectionModal.tsx`:

```typescript
import React from 'react';
import styles from './RoleSelectionModal.module.css';

interface RoleSelectionModalProps {
    isOpen: boolean;
    onSelectRole: (role: 'user' | 'vendor') => void;
    onClose: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ 
    isOpen, 
    onSelectRole, 
    onClose 
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Welcome to VanaMap!</h2>
                    <p>Please select your account type to continue</p>
                </div>

                <div className={styles.roleCards}>
                    <div 
                        className={styles.roleCard}
                        onClick={() => onSelectRole('user')}
                    >
                        <div className={styles.icon}>🌿</div>
                        <h3>I'm a Plant Lover</h3>
                        <p>Browse plants, find nurseries, and get plant care advice</p>
                        <ul className={styles.features}>
                            <li>✓ Discover 1000+ plants</li>
                            <li>✓ Find nearby nurseries</li>
                            <li>✓ AI plant doctor</li>
                            <li>✓ AR visualization</li>
                        </ul>
                        <button className={styles.selectButton}>
                            Continue as User
                        </button>
                    </div>

                    <div 
                        className={styles.roleCard}
                        onClick={() => onSelectRole('vendor')}
                    >
                        <div className={styles.icon}>🏪</div>
                        <h3>I'm a Nursery Owner</h3>
                        <p>Sell plants, manage inventory, and grow your business</p>
                        <ul className={styles.features}>
                            <li>✓ List your plants</li>
                            <li>✓ Manage orders</li>
                            <li>✓ Track analytics</li>
                            <li>✓ Connect with customers</li>
                        </ul>
                        <button className={styles.selectButton}>
                            Continue as Vendor
                        </button>
                    </div>
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    );
};
```

---

### **Step 2: Create Modal Styles**

Create `RoleSelectionModal.module.css`:

```css
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(8px);
}

.modal {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-radius: 24px;
    padding: 40px;
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(16, 185, 129, 0.2);
    position: relative;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.header h2 {
    color: #ffffff;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 10px 0;
}

.header p {
    color: #9ca3af;
    font-size: 16px;
    margin: 0;
}

.roleCards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
    margin-bottom: 20px;
}

.roleCard {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 16px;
    padding: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.roleCard:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
    border-color: #34d399;
}

.icon {
    font-size: 48px;
    margin-bottom: 16px;
    text-align: center;
}

.roleCard h3 {
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 12px 0;
    text-align: center;
}

.roleCard p {
    color: #d1fae5;
    font-size: 14px;
    margin: 0 0 20px 0;
    text-align: center;
    line-height: 1.6;
}

.features {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
}

.features li {
    color: #ecfdf5;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.features li:last-child {
    border-bottom: none;
}

.selectButton {
    width: 100%;
    background: #ffffff;
    color: #059669;
    border: none;
    border-radius: 50px;
    padding: 14px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.selectButton:hover {
    background: #f0fdf4;
    transform: scale(1.05);
}

.closeButton {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.closeButton:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

@media (max-width: 768px) {
    .roleCards {
        grid-template-columns: 1fr;
    }
    
    .modal {
        padding: 24px;
    }
}
```

---

### **Step 3: Update Auth.tsx to Use Role Selection**

Add to your `Auth.tsx`:

```typescript
import { RoleSelectionModal } from './RoleSelectionModal';

// Add state
const [showRoleModal, setShowRoleModal] = useState(false);
const [pendingGoogleCredential, setPendingGoogleCredential] = useState<any>(null);

// Update Google Sign-In handler
const handleGoogleSignIn = async (credential: any) => {
    // Store credential temporarily
    setPendingGoogleCredential(credential);
    
    // Show role selection modal
    setShowRoleModal(true);
};

// Handle role selection
const handleRoleSelection = async (role: 'user' | 'vendor') => {
    try {
        setShowRoleModal(false);
        
        // Send to backend with role
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: pendingGoogleCredential,
                role: role
            })
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Route based on role
            if (role === 'vendor') {
                navigate('/vendor-dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
    }
};

// Add modal to JSX
return (
    <div>
        {/* ... existing auth form ... */}
        
        <RoleSelectionModal
            isOpen={showRoleModal}
            onSelectRole={handleRoleSelection}
            onClose={() => setShowRoleModal(false)}
        />
    </div>
);
```

---

### **Step 4: Update Backend Google Auth**

Update `backend/index.js`:

```javascript
app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential, role } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        if (user) {
            // Existing user - update Google ID if needed
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // New user - create with selected role
            user = new User({
                email,
                name,
                googleId,
                role: role || 'user', // Use selected role
                emailVerified: true, // Google emails are pre-verified
                verified: true
            });
            await user.save();
            
            // Send welcome email
            await sendEmail({
                from: 'VanaMap <noreply@vanamap.online>',
                to: email,
                subject: role === 'vendor' ? 'Welcome to VanaMap, Partner!' : 'Welcome to VanaMap!',
                html: EmailTemplates.welcome(name, role)
            });
        }
        
        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

### **Step 5: Fix "Hello Friend" in Dashboard**

Update your dashboard greeting:

```typescript
// In Dashboard.tsx or User.tsx
const [user, setUser] = useState<any>(null);

useEffect(() => {
    // Load user from localStorage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
}, []);

// In JSX
<h1>Hello, {user?.name || 'Friend'}! 🌿</h1>
```

---

## 🎨 **User Flow:**

```
1. User clicks "Sign in with Google"
        ↓
2. Google authentication popup
        ↓
3. Success → Show Role Selection Modal
   ┌─────────────────────────────────┐
   │  Welcome to VanaMap!            │
   │  Please select your account type│
   │                                 │
   │  [🌿 I'm a Plant Lover]        │
   │  [🏪 I'm a Nursery Owner]      │
   └─────────────────────────────────┘
        ↓
4. User selects role
        ↓
5. Account created/updated with role
        ↓
6. Redirect to correct dashboard:
   - User → /dashboard
   - Vendor → /vendor-dashboard
        ↓
7. Show "Hello, [Actual Name]!"
```

---

## ✅ **Features:**

- ✅ Beautiful role selection modal
- ✅ Clear descriptions for each role
- ✅ Automatic routing based on role
- ✅ Shows actual user name in dashboard
- ✅ Welcome email sent with correct role
- ✅ Mobile responsive
- ✅ Professional design

---

**Your Google Sign-In now has role selection and proper user greetings!** 🎉
