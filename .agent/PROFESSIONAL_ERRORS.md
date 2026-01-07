# Professional Error Messages for VanaMap

## 🎯 **User-Friendly Error Handling**

Replace technical error messages with professional, helpful ones that guide users to the solution.

---

## 📧 **Email Already Exists**

### ❌ **Bad (Technical):**
```json
{ "error": "Email already registered" }
```

### ✅ **Good (Professional):**
```json
{
  "error": "This email is already associated with an account",
  "message": "It looks like you already have a VanaMap account with this email address.",
  "suggestion": "Try logging in instead, or use the 'Forgot Password' option if you need to reset your password.",
  "action": "login",
  "loginUrl": "/auth?mode=login"
}
```

---

## 📱 **Phone Already Exists**

### ❌ **Bad (Technical):**
```json
{ "error": "Phone already registered" }
```

### ✅ **Good (Professional):**
```json
{
  "error": "This mobile number is already registered",
  "message": "We found an existing account linked to this mobile number.",
  "suggestion": "Please log in to access your account, or contact support if you believe this is an error.",
  "action": "login",
  "loginUrl": "/auth?mode=login"
}
```

---

## 🔧 **Implementation**

### **Update Signup Validation**

Replace this code in your signup endpoint:

```javascript
// ❌ OLD CODE (Technical)
const existing = await User.findOne({
    $or: [
        { email: email ? email.trim().toLowerCase() : undefined },
        { phone: phone ? phone.trim() : undefined }
    ]
});
if (existing) {
    return res.status(400).json({ error: "Email or Phone already registered" });
}
```

```javascript
// ✅ NEW CODE (Professional)
const existing = await User.findOne({
    $or: [
        { email: email ? email.trim().toLowerCase() : undefined },
        { phone: phone ? phone.trim() : undefined }
    ]
});

if (existing) {
    // Determine which field matched
    const isEmailMatch = existing.email === email?.trim().toLowerCase();
    const isPhoneMatch = existing.phone === phone?.trim();
    
    if (isEmailMatch && isPhoneMatch) {
        return res.status(409).json({
            error: "Account already exists",
            message: "Both your email and mobile number are already registered with VanaMap.",
            suggestion: "Please log in to access your account. If you've forgotten your password, you can reset it using the 'Forgot Password' option.",
            action: "login",
            loginUrl: "/auth?mode=login"
        });
    } else if (isEmailMatch) {
        return res.status(409).json({
            error: "Email already in use",
            message: "This email address is already associated with a VanaMap account.",
            suggestion: "Try logging in instead, or use a different email address to create a new account.",
            action: "login",
            loginUrl: "/auth?mode=login",
            field: "email"
        });
    } else if (isPhoneMatch) {
        return res.status(409).json({
            error: "Mobile number already registered",
            message: "We found an existing account linked to this mobile number.",
            suggestion: "Please log in to continue, or use a different mobile number to sign up.",
            action: "login",
            loginUrl: "/auth?mode=login",
            field: "phone"
        });
    }
}
```

---

## 🎨 **Frontend Display**

### **React/TypeScript Example:**

```typescript
// Handle signup error
try {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        
        // Show professional error message
        if (error.action === 'login') {
            // Show modal with helpful message
            showErrorModal({
                title: error.error,
                message: error.message,
                suggestion: error.suggestion,
                primaryButton: {
                    text: "Log In Instead",
                    action: () => navigate('/auth?mode=login')
                },
                secondaryButton: {
                    text: "Forgot Password?",
                    action: () => navigate('/auth?mode=forgot')
                }
            });
        }
    }
} catch (e) {
    // Handle network errors
}
```

---

## 📋 **All Professional Error Messages**

### **1. Email Already Exists**
```javascript
{
    error: "Email already in use",
    message: "This email address is already associated with a VanaMap account.",
    suggestion: "Try logging in instead, or use a different email address to create a new account.",
    action: "login",
    loginUrl: "/auth?mode=login",
    field: "email"
}
```

### **2. Phone Already Exists**
```javascript
{
    error: "Mobile number already registered",
    message: "We found an existing account linked to this mobile number.",
    suggestion: "Please log in to continue, or use a different mobile number to sign up.",
    action: "login",
    loginUrl: "/auth?mode=login",
    field: "phone"
}
```

### **3. Both Email & Phone Exist**
```javascript
{
    error: "Account already exists",
    message: "Both your email and mobile number are already registered with VanaMap.",
    suggestion: "Please log in to access your account. If you've forgotten your password, you can reset it using the 'Forgot Password' option.",
    action: "login",
    loginUrl: "/auth?mode=login"
}
```

### **4. Invalid Email Format**
```javascript
{
    error: "Invalid email address",
    message: "The email address you entered doesn't appear to be valid.",
    suggestion: "Please check for typos and try again. Example: user@example.com",
    field: "email"
}
```

### **5. Invalid Phone Format**
```javascript
{
    error: "Invalid mobile number",
    message: "The mobile number you entered doesn't appear to be valid.",
    suggestion: "Please enter a 10-digit mobile number without spaces or special characters.",
    field: "phone"
}
```

### **6. Weak Password**
```javascript
{
    error: "Password too weak",
    message: "Your password doesn't meet our security requirements.",
    suggestion: "Please use at least 8 characters, including uppercase, lowercase, and a number.",
    field: "password"
}
```

### **7. OTP Expired**
```javascript
{
    error: "Verification code expired",
    message: "Your verification code has expired for security reasons.",
    suggestion: "Please request a new code to continue. Codes are valid for 10 minutes.",
    action: "resend"
}
```

### **8. Invalid OTP**
```javascript
{
    error: "Incorrect verification code",
    message: "The code you entered doesn't match our records.",
    suggestion: "Please double-check the code and try again, or request a new one.",
    action: "retry"
}
```

### **9. Too Many Attempts**
```javascript
{
    error: "Too many attempts",
    message: "For your security, we've temporarily locked this account.",
    suggestion: "Please wait 15 minutes before trying again, or contact support for assistance.",
    action: "wait",
    waitTime: "15 minutes"
}
```

### **10. Server Error**
```javascript
{
    error: "Something went wrong",
    message: "We're experiencing technical difficulties on our end.",
    suggestion: "Please try again in a few moments. If the problem persists, contact our support team.",
    action: "retry",
    supportEmail: "support@vanamap.online"
}
```

---

## 🎯 **Error Response Structure**

### **Standard Format:**
```typescript
interface ErrorResponse {
    error: string;           // Short error title
    message: string;         // User-friendly explanation
    suggestion: string;      // What user should do
    action?: string;         // Suggested action (login, retry, wait, etc.)
    field?: string;          // Which field has the error
    loginUrl?: string;       // URL to redirect for login
    supportEmail?: string;   // Support contact
    waitTime?: string;       // How long to wait
}
```

---

## 💡 **Best Practices**

### ✅ **Do:**
- Use friendly, conversational language
- Explain what happened in simple terms
- Provide clear next steps
- Offer alternative solutions
- Use proper HTTP status codes (409 for conflicts)

### ❌ **Don't:**
- Use technical jargon ("findOne failed", "duplicate key error")
- Blame the user ("You entered wrong data")
- Be vague ("Error occurred")
- Show stack traces or database errors
- Use ALL CAPS or excessive punctuation!!!

---

## 🌐 **Tone Examples**

### **Professional & Helpful:**
```
"This email address is already associated with a VanaMap account. 
Try logging in instead, or use a different email to create a new account."
```

### **Friendly & Supportive:**
```
"Looks like you already have an account with us! 
Let's get you logged in, or you can reset your password if needed."
```

### **Clear & Actionable:**
```
"We found an existing account with this mobile number. 
Please log in to continue, or contact support if you need help."
```

---

## 🚀 **Implementation Checklist**

- [ ] Update signup validation with professional messages
- [ ] Add email format validation
- [ ] Add phone format validation
- [ ] Implement frontend error modal
- [ ] Add "Log In Instead" button
- [ ] Add "Forgot Password" link
- [ ] Test all error scenarios
- [ ] Update error messages to match brand voice

---

**Your error messages will now guide users professionally instead of confusing them!** 🎉
