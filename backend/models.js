const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PlantSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    scientificName: String,
    description: String,
    imageUrl: String,
    idealTempMin: Number,
    idealTempMax: Number,
    minHumidity: Number,
    sunlight: { type: String }, // e.g. 'low' or '2000 Lux'
    oxygenLevel: { type: String }, // e.g. 'moderate' or '30 L/day'
    medicinalValues: [String],
    advantages: [String],
    price: Number,
    type: { type: String, enum: ['indoor', 'outdoor'], required: true },
    lifespan: { type: String, default: 'Unknown' }, // e.g. "Perennial (10+ years)"
    // Biometric Data for AI Scanning
    foliageTexture: String, // e.g. "Glossy", "Matte", "Pubescent"
    leafShape: String, // e.g. "Ovate", "Lanceolate", "Cordate"
    stemStructure: String, // e.g. "Woody", "Herbaceous", "Succulent"
    overallHabit: String, // e.g. "Climbing", "Bushy", "Tree-like"
    biometricFeatures: [String] // e.g. ["Serrated Edges", "Variegated Patterns"]
}, { timestamps: true });

const VendorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    address: String,
    phone: String,
    whatsapp: String,
    website: String,
    countryCode: String,
    state: String,
    country: String,
    district: String,
    inventoryIds: [String],
    inventory: [{
        plantId: String,
        price: Number,
        quantity: { type: Number, default: 0 },
        status: { type: String, default: 'approved' },
        inStock: { type: Boolean, default: true },
        sellingMode: { type: String, enum: ['online', 'offline', 'both'], default: 'offline' },
        isBoosted: { type: Boolean, default: false },
        boostExpiry: Date,
        lowStockThreshold: { type: Number, default: 5 }
    }],
    verified: { type: Boolean, default: false },
    highlyRecommended: { type: Boolean, default: false },
    category: { type: String, default: 'Plant Shop' },
    ownerEmail: String,
    isVacationMode: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },

    // Payment & Banking Details
    paymentDetails: {
        // Bank Account
        accountHolderName: String,
        accountNumber: String, // Encrypted
        ifscCode: String,
        accountType: { type: String, enum: ['savings', 'current'] },
        bankName: String,
        branchName: String,

        // UPI (Alternative)
        upiId: String,

        // Tax & Compliance
        panCard: String, // Required for tax compliance
        gstNumber: String, // Optional, required if registered

        // Razorpay Route
        razorpayContactId: String, // Razorpay contact ID for payouts
        razorpayFundAccountId: String, // Fund account ID

        // Payout Settings
        autoPayoutEnabled: { type: Boolean, default: false },
        minimumPayoutAmount: { type: Number, default: 500 }, // Minimum ₹500 for payout
        payoutFrequency: { type: String, enum: ['instant', 'daily', 'weekly', 'monthly'], default: 'weekly' },

        // Status
        isVerified: { type: Boolean, default: false }, // Bank details verified
        verifiedAt: Date,
        lastPayoutDate: Date
    },

    // Commission & Earnings
    earnings: {
        totalSales: { type: Number, default: 0 },
        vanaMapCommission: { type: Number, default: 0 },
        netEarnings: { type: Number, default: 0 },
        pendingPayout: { type: Number, default: 0 },
        totalPaidOut: { type: Number, default: 0 }
    }
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
    vendorId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    reply: String,
    repliedAt: Date,
    timestamp: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    favorites: [String],
    isPremium: { type: Boolean, default: false },
    premiumType: { type: String, enum: ['none', 'trial', 'monthly', 'gift'], default: 'none' },
    premiumExpiry: { type: Date },
    premiumStartDate: { type: Date },
    lastPurchaseDate: { type: Date },
    favoritesCount: { type: Number, default: 0 }, // To track total likes behavior
    cart: [{ plantId: String, quantity: Number, vendorId: String, vendorPrice: Number }],
    points: { type: Number, default: 0 },
    city: String,
    state: String,
    country: String,
    resetRequest: {
        requested: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        requestDate: { type: Date }
    },
    verified: { type: Boolean, default: false },
    verificationOTP: String,
    otpExpires: Date,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    contactVerificationOTP: String,
    contactOTPExpires: Date,
    googleAuth: { type: Boolean, default: false },
    profilePicture: String,
    latitude: Number,
    longitude: Number,
    gameLevel: { type: Number, default: 1 },
    gamePoints: { type: Number, default: 0 },
    designs: [{
        id: String,
        imageUrl: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const SearchLogSchema = new mongoose.Schema({
    query: String,
    plantId: String, // If they clicked a specific plant
    location: {
        city: String,
        state: String,
        lat: Number,
        lng: Number
    },
    timestamp: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const NotificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    details: mongoose.Schema.Types.Mixed,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const ChatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const PlantSuggestionSchema = new mongoose.Schema({
    userId: { type: String }, // Optional, linking to user if logged in
    userName: { type: String, default: 'Anonymous' },
    plantName: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
    searchCount: { type: Number, default: 1 } // Track frequency
});

const PaymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: String,
    amount: Number,
    currency: String,
    orderId: String,
    paymentId: String,
    signature: String,
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    plan: String,
    date: { type: Date, default: Date.now }
});

const SaleSchema = new mongoose.Schema({
    vendorId: { type: String, required: true },
    userId: String,
    userName: String,
    plantId: { type: String, required: true },
    plantName: String,
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
    timestamp: { type: Date, default: Date.now }
});

// --- INDEXES FOR PERFORMANCE ---
// Speed up plant searches by name, type, and medical values
PlantSchema.index({ name: 'text', description: 'text', type: 1 });
PlantSchema.index({ oxygenLevel: 1 });
PlantSchema.index({ type: 1, name: 1 }); // For filtered searches by type
// Note: id field already has index from unique: true in schema definition

// Speed up vendor lookups by location and inventory
VendorSchema.index({ city: 1, state: 1 });
VendorSchema.index({ verified: 1 });
VendorSchema.index({ verified: 1, 'inventory.plantId': 1 }); // Shop queries with stock checks

// Speed up login and auth checks
// UserSchema.index({ email: 1 }); // Already defined in schema with unique: true

module.exports = {
    Plant: mongoose.model('Plant', PlantSchema),
    Vendor: mongoose.model('Vendor', VendorSchema),
    User: mongoose.model('User', UserSchema),
    Payment: mongoose.model('Payment', PaymentSchema),
    Notification: mongoose.model('Notification', NotificationSchema),
    Notification: mongoose.model('Notification', NotificationSchema),
    Chat: mongoose.model('Chat', ChatSchema),
    PlantSuggestion: mongoose.model('PlantSuggestion', PlantSuggestionSchema),
    SearchLog: mongoose.model('SearchLog', SearchLogSchema),
    Sale: mongoose.model('Sale', SaleSchema),
    Review: mongoose.model('Review', ReviewSchema),
    PushSubscription: mongoose.model('PushSubscription', new mongoose.Schema({
        endpoint: { type: String, unique: true, required: true },
        keys: {
            p256dh: String,
            auth: String
        },
        description: String, // e.g. "User Device" or "Chrome on Windows"
        createdAt: { type: Date, default: Date.now }
    })),
    SystemSettings: mongoose.model('SystemSettings', new mongoose.Schema({
        key: { type: String, unique: true, required: true },
        value: mongoose.Schema.Types.Mixed,
        description: String
    })),
    CustomPot: mongoose.model('CustomPot', new mongoose.Schema({
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        potColor: String,
        potWithDesignUrl: String, // Base64 or URL of the 3D snapshot
        rawDesignUrl: String, // Base64 or URL of the raw uploaded design
        decalProps: mongoose.Schema.Types.Mixed,
        status: { type: String, enum: ['unprocessed', 'processed'], default: 'unprocessed' },
        createdAt: { type: Date, default: Date.now }
    })),
    SupportTicket: mongoose.model('SupportTicket', new mongoose.Schema({
        userId: { type: String, required: true },
        userEmail: { type: String, required: true },
        userName: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
        adminReply: String,
        repliedAt: Date,
        createdAt: { type: Date, default: Date.now }
    })),
    AIFeedback: mongoose.model('AIFeedback', new mongoose.Schema({
        query: { type: String, required: true },
        response: { type: String, required: true },
        rating: { type: String, enum: ['positive', 'negative'], required: true },
        correction: String, // If user provides a better answer
        userId: String,
        timestamp: { type: Date, default: Date.now }
    })),
    ApiKey: mongoose.model('ApiKey', new mongoose.Schema({
        key: { type: String, required: true, unique: true }, // Store hashed if possible, but strict unique
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, default: 'My API Key' }, // Friendly name e.g. "Mobile App"
        scopes: [{ type: String, enum: ['read', 'write', 'admin', 'notify'], default: 'read' }],
        isActive: { type: Boolean, default: true },
        lastUsed: Date,
        createdAt: { type: Date, default: Date.now }
    })),
    NewsletterSubscriber: mongoose.model('NewsletterSubscriber', new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: true },
        source: { type: String, default: 'website' },
        joinedAt: { type: Date, default: Date.now }
    }))
};
