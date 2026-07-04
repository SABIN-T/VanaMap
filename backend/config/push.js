/**
 * Push Notification Configuration
 * Web Push with VAPID keys
 */
const webpush = require('web-push');
const { PushSubscription, Notification } = require('../models');

let publicVapidKey = process.env.PUBLIC_VAPID_KEY;
let privateVapidKey = process.env.PRIVATE_VAPID_KEY;
let pushEnabled = false;

const initializePush = () => {
    if (!publicVapidKey || !privateVapidKey) {
        console.warn("VAPID Keys not found. Generating temporary keys...");
        const keys = webpush.generateVAPIDKeys();
        publicVapidKey = keys.publicKey;
        privateVapidKey = keys.privateKey;
        console.log("-----------------------------------------");
        console.log("NEW VAPID KEYS GENERATED (Save to .env):");
        console.log("PUBLIC_VAPID_KEY=" + publicVapidKey);
        console.log("PRIVATE_VAPID_KEY=" + privateVapidKey);
        console.log("-----------------------------------------");
    }

    try {
        webpush.setVapidDetails('mailto:support@vanamap.online', publicVapidKey, privateVapidKey);
        pushEnabled = true;
        console.log("Web Push initialized successfully.");
    } catch (err) {
        console.error("Web Push init failed:", err.message);
    }
};

initializePush();

/**
 * Send push notification to all subscribers
 */
const sendPushNotification = async (payload) => {
    if (!pushEnabled) {
        console.log("Skipping push notification (Push Disabled/No Keys)");
        return;
    }

    try {
        const subscriptions = await PushSubscription.find().lean();
        if (subscriptions.length === 0) return;

        console.log(`[PUSH] Dispatched to ${subscriptions.length} devices...`);
        const notificationPayload = JSON.stringify(payload);

        const batchSize = 50;
        let sentCount = 0;
        let deadCount = 0;

        for (let i = 0; i < subscriptions.length; i += batchSize) {
            const batch = subscriptions.slice(i, i + batchSize);
            await Promise.all(batch.map(async (sub) => {
                try {
                    await webpush.sendNotification(sub, notificationPayload);
                    sentCount++;
                } catch (err) {
                    if ([410, 404, 403, 401].includes(err.statusCode)) {
                        deadCount++;
                        await PushSubscription.deleteOne({ _id: sub._id }).catch(() => { });
                    } else {
                        console.error(`[PUSH] Delivery error (${err.statusCode}): ${err.message}`);
                    }
                }
            }));
        }

        if (deadCount > 0) console.log(`[PUSH] Cleaned up ${deadCount} expired subscriptions.`);
        console.log(`[PUSH] Successfully reached ${sentCount} devices.`);
    } catch (e) {
        console.error("[PUSH] Critical processing error:", e.message);
    }
};

/**
 * Unified Alert System — creates DB notification + dispatches push
 */
const broadcastAlert = async (type, message, details = {}, url = '/') => {
    try {
        await Notification.create({ type, message, details, read: false });

        if (!details.skipPush) {
            const pushPayload = {
                title: details.title || `VanaMap ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                body: message,
                url,
                icon: '/logo.png'
            };
            await sendPushNotification(pushPayload);
        }

        console.log(`[ALERT] Alert dispatched: ${type} (Push: ${!details.skipPush})`);
    } catch (err) {
        console.error(`[ALERT] Failed to broadcast ${type}:`, err.message);
    }
};

const sendWhatsApp = async (msg, type, details = {}) => {
    console.log(`[PUSH REPLACED WHATSAPP] ${type}: ${msg}`);
    await broadcastAlert(type, msg, details);
};

const getPublicVapidKey = () => publicVapidKey;

module.exports = {
    sendPushNotification,
    broadcastAlert,
    sendWhatsApp,
    getPublicVapidKey,
    initializePush
};
