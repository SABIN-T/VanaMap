const mongoose = require('mongoose');

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
    type: { type: String, enum: ['indoor', 'outdoor'], required: true }
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
    district: String,
    inventoryIds: [String],
    verified: { type: Boolean, default: false },
    highlyRecommended: { type: Boolean, default: false },
    category: { type: String, default: 'Plant Shop' }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real app, hash this!
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    favorites: [String],
    cart: [{ plantId: String, quantity: Number }],
    resetRequest: {
        requested: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        requestDate: { type: Date }
    }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    details: mongoose.Schema.Types.Mixed,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = {
    Plant: mongoose.model('Plant', PlantSchema),
    Vendor: mongoose.model('Vendor', VendorSchema),
    User: mongoose.model('User', UserSchema),
    Notification: mongoose.model('Notification', NotificationSchema)
};
