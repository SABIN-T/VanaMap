/**
 * Razorpay Payment Configuration
 */
const Razorpay = require('razorpay');

let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    } else {
        console.warn("Razorpay Keys missing in environment. Payment features will be disabled.");
    }
} catch (e) {
    console.error("Razorpay Init Error:", e.message);
}

module.exports = { razorpay };
