# User Identity & OTP Solutions (2025 Research)

## 📧 Free Email OTP (Gmail)

The most reliable, free method for developers is using **Gmail SMTP with an App Password**.

### 1. Limits
- **500 emails per day** (Free Gmail accounts).
- **2,000 emails per day** (Google Workspace paid accounts).
- Sufficient for development, testing, and early-stage startups.

### 2. Setup Guide
1.  Go to **Google Account** > **Security**.
2.  Enable **2-Step Verification**.
3.  Search for **"App Passwords"** (or go to `myaccount.google.com/apppasswords`).
4.  Create a new app password (name it "VanaMap").
5.  Copy the 16-character code (e.g., `abcd efgh ijkl mnop`).
6.  Update your `.env` file:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=abcd efgh ijkl mnop
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_SECURE=false
    ```

---

## 📱 Free SMS OTP (Mobile)

Sending SMS messages costs money (telecom fees). There is no "unlimited free" API, but here are the best low-cost/trial options found for 2025.

### Top Recommendation: Fast2SMS (India)
- **Best for:** Indian phone numbers (`+91`).
- **Freebie:** ₹50 free credit on signup (approx. 200-250 SMS).
- **Cost:** extremely cheap (~₹0.20 per SMS).
- **API Type:** Simple REST API.
- **Website:** [fast2sms.com](https://fast2sms.com)

### Runner Up: Firebase Phone Auth (Global)
- **Best for:** Global scaling without upfront cost.
- **Free Tier:** **10,000 free verifications per month**.
- **Pros:** Google handles delivery, security, and UI.
- **Cons:** Requires using Firebase SDK on frontend (not a simple backend API call).

### Other Options
1.  **Twilio**: Industry standard. Free trial ($15), but **requires verifying every target phone number** in sandbox mode. Not usable for public users until you pay.
2.  **TextLocal**: 10 free SMS test credits. Good reliability.
3.  **Brevo (Sendinblue)**: Primarily email, but has some SMS capabilities (paid).

## 🛠️ Implementation Plan
We are activating the **Gmail SMTP** method for your backend to send Email OTPs immediately. We have also audited the code to include a **Fast2SMS** integration point for when you are ready to add SMS.
