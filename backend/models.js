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
    sunlight: { type: String, enum: ['low', 'medium', 'high', 'direct'] },
    oxygenLevel: { type: String, enum: ['moderate', 'high', 'very-high'] },
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
        inStock: { type: Boolean, default: true }
    }],
    verified: { type: Boolean, default: false },
    highlyRecommended: { type: Boolean, default: false },
    category: { type: String, default: 'Plant Shop' }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    favorites: [String],
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
    gameLevel: { type: Number, default: 1 },
    gamePoints: { type: Number, default: 0 }
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
    submittedAt: { type: Date, default: Date.now }
});

// --- INDEXES FOR PERFORMANCE ---
// Speed up plant searches by name, type, and medical values
PlantSchema.index({ name: 'text', description: 'text', type: 1 });
PlantSchema.index({ oxygenLevel: 1 });

// Speed up vendor lookups by location
VendorSchema.index({ city: 1, state: 1 });
VendorSchema.index({ verified: 1 });

// Speed up login and auth checks
// UserSchema.index({ email: 1 }); // Already defined in schema with unique: true

module.exports = {
    Plant: mongoose.model('Plant', PlantSchema),
    Vendor: mongoose.model('Vendor', VendorSchema),
    User: mongoose.model('User', UserSchema),
    Notification: mongoose.model('Notification', NotificationSchema),
    Chat: mongoose.model('Chat', ChatSchema),
    PlantSuggestion: mongoose.model('PlantSuggestion', PlantSuggestionSchema),
    SearchLog: mongoose.model('SearchLog', SearchLogSchema),
    PushSubscription: mongoose.model('PushSubscription', new mongoose.Schema({
        endpoint: { type: String, unique: true, required: true },
        keys: {
            p256dh: String,
            auth: String
        },
        description: String, // e.g. "User Device" or "Chrome on Windows"
        createdAt: { type: Date, default: Date.now }
    }))
};
