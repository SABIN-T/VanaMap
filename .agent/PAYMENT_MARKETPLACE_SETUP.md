# VanaMap Marketplace Payment System Setup

## 🎯 Overview
Implement a split payment system where:
- Customers pay through VanaMap
- VanaMap keeps a commission (10-15%)
- Vendors receive their share automatically

## 🔧 Technology: Razorpay Route

### Step 1: Enable Razorpay Route
1. Login to Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Enable **Route** (Marketplace feature)
4. Get your **Route API credentials**

### Step 2: Vendor Bank Account Collection
Vendors need to provide:
- Account Holder Name
- Account Number
- IFSC Code
- Account Type (savings/current)
- PAN Card (for tax compliance)

### Step 3: Payment Flow
```
Customer Purchase (₹1000)
    ↓
Payment to VanaMap Razorpay Account
    ↓
VanaMap Commission (₹100 - 10%)
    ↓
Vendor Receives (₹900)
    ↓
Auto-transfer to Vendor's Bank (via Razorpay Route)
```

### Step 4: Environment Variables Needed
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_ROUTE_ACCOUNT_ID=acc_xxxxx
VANAMAP_COMMISSION_PERCENT=10
```

### Step 5: Compliance Requirements
- **GST Registration** (if annual turnover > ₹20 lakhs)
- **TDS Deduction** (if vendor earnings > ₹50,000/year)
- **PAN Card** verification for vendors
- **Invoice Generation** for each transaction

## 📝 Implementation Checklist
- [ ] Add bank details form in Vendor Portal
- [ ] Create Razorpay Route contacts for each vendor
- [ ] Implement split payment logic
- [ ] Add commission calculation
- [ ] Create payout automation
- [ ] Add transaction history
- [ ] Generate tax invoices
- [ ] Implement withdrawal requests

## 🔒 Security
- Encrypt bank details in database
- Use HTTPS for all payment APIs
- Implement 2FA for withdrawal requests
- Log all transactions for audit trail
