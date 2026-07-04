/**
 * Misc Routes
 * Auto-extracted from monolithic index.js during professional refactoring
 */
const express = require('express');
const router = express.Router();
const { auth, admin, optionalAuth, normalizeUser, requireApiKey, validateRequest } = require('../middleware/auth');
const { sendEmail, CommunicationOS, sendResetEmail, sendOtpEmail, sendSmsOtp, sendWelcomeEmail, resend } = require('../config/email');
const { broadcastAlert, sendPushNotification, getPublicVapidKey, sendWhatsApp } = require('../config/push');
const { razorpay } = require('../config/razorpay');
const { upload, broadcastUpload, cloudinary } = require('../middleware/upload');
const { cache } = require('../config/cache');
const { sensitiveLimiter, otpLimiter, activeViewers } = require('../middleware/security');
const { body } = require('express-validator');
const { User, Plant, Vendor, Sale, Payment, Notification, Chat, PlantSuggestion, SearchLog, PushSubscription, SystemSettings, CustomPot, SupportTicket, AIFeedback, ApiKey, NewsletterSubscriber, Review, SupportEmail, DiagnosisRecord, KidsProduct, WorldFlora } = require('../models');
const EmailTemplates = require('../email-templates');
const FloraIntelligence = require('../flora-intelligence');


router.get('/api/test-session', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Views: ${req.session.views}. Cookie expires in: ${req.session.cookie.maxAge / 1000}s`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh page!');
    }
});

// 3. Public Config for Frontend
router.get('/api/public/premium-config', async (req, res) => {
    try {
        const settings = await SystemSettings.find({ key: { $in: ['premium_price_inr', 'premium_is_free', 'premium_free_start', 'premium_free_end'] } });
        let price = 10;
        let isFree = false;
        let freeStart = null;
        let freeEnd = null;

        settings.forEach(s => {
            if (s.key === 'premium_price_inr') price = s.value;
            if (s.key === 'premium_is_free') isFree = s.value;
            if (s.key === 'premium_free_start') freeStart = s.value;
            if (s.key === 'premium_free_end') freeEnd = s.value;
        });

        const now = new Date();
        const start = freeStart ? new Date(freeStart) : null;
        const end = freeEnd ? new Date(freeEnd) : null;

        const isFreeBool = isFree === true || isFree === 'true';
        const activePromo = isFreeBool &&
            (!start || isNaN(start.getTime()) || start <= now) &&
            (!end || isNaN(end.getTime()) || end >= now);

        res.json({ price, activePromo, freeEnd });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/api/news', async (req, res) => {
    const now = Date.now();
    if (newsCache.data.length > 0 && (now - newsCache.lastUpdated) < 24 * 60 * 60 * 1000) {
        return res.json(newsCache.data);
    }

    try {
        const Parser = require('rss-parser');
        const parser = new Parser();
        const FEED_URLS = [
            'https://www.sciencedaily.com/rss/plants_animals/nature.xml',
            'https://news.mongabay.com/feed/',
            'https://feeds.feedburner.com/enn/main'
        ];

        const promises = FEED_URLS.map(url => parser.parseURL(url).catch(e => null));
        const feeds = await Promise.all(promises);
        const allNews = [];

        feeds.forEach(feed => {
            if (feed && feed.items) feed.items.forEach(item => {
                // Try to find an image
                let imageUrl = null;
                if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image')) {
                    imageUrl = item.enclosure.url;
                } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
                    imageUrl = item['media:content'].$.url;
                } else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
                    imageUrl = item['media:thumbnail'].$.url;
                } else if (item.content) {
                    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                // Fallback to random nature element if no image found
                if (!imageUrl) {
                    imageUrl = `https://images.unsplash.com/photo-${[
                        '1542601906990-b4d3fb778b09', // Forest
                        '1441974231531-c6227db76b6e', // Woods
                        '1470058869958-2a77ade41c02', // Jungle
                        '1501854140884-074cf2b2b3b6', // Leaves
                        '1466692476868-aef1dfb1e735'  // Garden
                    ][Math.floor(Math.random() * 5)]}?w=800&q=80`;
                }

                allNews.push({
                    title: item.title,
                    link: item.link,
                    pubDate: new Date(item.pubDate),
                    source: feed.title || 'Nature News',
                    snippet: item.contentSnippet || item.content || '',
                    image: imageUrl
                });
            });
        });

        // specific filtering for nature/plants
        const keywords = ['plant', 'tree', 'forest', 'garden', 'flower', 'nature', 'species', 'conservation', 'climate'];
        const filteredNews = allNews.filter(item => {
            const text = (item.title + ' ' + item.snippet).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        // Sort by date and take top 10
        filteredNews.sort((a, b) => b.pubDate - a.pubDate);
        const topNews = filteredNews.slice(0, 10);

        newsCache = {
            data: topNews,
            lastUpdated: now
        };

        res.json(topNews);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// 1. Generate New API Key
router.post('/api/keys', auth, async (req, res) => {
    try {
        const { name, scopes } = req.body;

        // Limit: 5 keys per user
        const count = await ApiKey.countDocuments({ userId: req.user.id });
        if (count >= 5) return res.status(400).json({ error: "Limit reached: Maximum 5 API keys allowed." });

        const keyString = generateApiKey();

        const newKey = new ApiKey({
            key: keyString, // Ideally hash this in production, but storing plain for simplicity if permitted
            userId: req.user.id,
            name: name || 'My App',
            scopes: scopes || ['read']
        });

        await newKey.save();

        res.status(201).json({
            success: true,
            message: "API Key Generated",
            apiKey: keyString, // ONLY TIME WE SHOW THIS
            details: { name: newKey.name, scopes: newKey.scopes, id: newKey._id }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. List My Keys
router.get('/api/keys', auth, async (req, res) => {
    try {
        const keys = await ApiKey.find({ userId: req.user.id }).select('name scopes lastUsed createdAt isActive key');
        // Mask the keys for security in the list
        const maskedKeys = keys.map(k => ({
            id: k._id,
            name: k.name,
            prefix: k.key.substring(0, 7) + '...',
            scopes: k.scopes,
            isActive: k.isActive,
            created: k.createdAt,
            lastUsed: k.lastUsed
        }));
        res.json(maskedKeys);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Revoke/Delete Key
router.delete('/api/keys/:id', auth, async (req, res) => {
    try {
        await ApiKey.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ success: true, message: "Key revoked" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- NEWS API ENDPOINT ---
router.get('/api/news', async (req, res) => {
    try {
        // Use ScienceDaily & Phys.org for better botanical news with images
        const [feed1, feed2] = await Promise.all([
            parser.parseURL('https://www.sciencedaily.com/rss/plants_animals/botany.xml').catch(() => ({ items: [] })),
            parser.parseURL('https://phys.org/rss-feed/biology-news/plants-animals/').catch(() => ({ items: [] }))
        ]);

        const allItems = [...feed1.items, ...feed2.items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        const newsItems = allItems.slice(0, 20).map((item, index) => {
            const placeholders = [
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                "https://images.unsplash.com/photo-1501854140884-074bf6b24363?w=800&q=80",
                "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
                "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80",
                "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
            ];

            // 1. Try to find image in enclosure (standard RSS media)
            let imageUrl = item.enclosure?.url;

            // 2. If not, try to find <img> tag in content
            if (!imageUrl && item.content) {
                const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                if (imgMatch) imageUrl = imgMatch[1];
            }

            // 3. Fallback to random nature placeholder
            if (!imageUrl) {
                imageUrl = placeholders[index % placeholders.length];
            }

            return {
                id: index,
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
                source: item.source || "Botanical Science",
                image: imageUrl
            };
        });

        res.json(newsItems);
    } catch (err) {
        console.error("News API Error:", err);
        // Fallback data if RSS fails
        res.json([
            {
                id: 1,
                title: "Global Reforestation Milestone Reached",
                pubDate: new Date(),
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                content: "Over 1 billion trees planted this year across major continents...",
                source: "Nature Weekly"
            }
        ]);
    }
});

router.get('/', (req, res) => res.send('VanaMap API v3.0 - Full Power Simulation Active'));

router.get('/api/keep-alive', (req, res) => {
    console.log("Ping received from cron-job.org");
    res.status(200).send("I am awake!");
});

// Webhook to receive emails from Resend
router.post('/api/webhooks/resend-email', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        // Verify webhook signature (if Resend provides one)
        // const signature = req.headers['resend-signature'];
        // TODO: Implement signature verification when Resend supports it

        let event;
        if (Buffer.isBuffer(req.body)) {
            event = JSON.parse(req.body.toString());
        } else if (typeof req.body === 'string') {
            event = JSON.parse(req.body);
        } else if (req.body && typeof req.body === 'object') {
            event = req.body;
        } else {
            throw new Error("Invalid request body");
        }

        if (event.type === 'email.received') {
            const emailData = event.data;

            // Save email to database
            const supportEmail = new SupportEmail({
                messageId: emailData.message_id || emailData.id,
                from: emailData.from,
                to: emailData.to,
                subject: emailData.subject || '(No Subject)',
                text: emailData.text || '',
                html: emailData.html || '',
                receivedAt: new Date(emailData.created_at || Date.now()),
                status: 'unread',
                priority: 'medium',
                attachments: emailData.attachments || []
            });

            await supportEmail.save();
            console.log(`[Support Email] New email received from ${emailData.from}: ${emailData.subject}`);

            // Send auto-reply
            if (resend) {
                try {
                    await resend.emails.send({
                        from: 'VanaMap Support <support@vanamap.online>',
                        to: emailData.from,
                        subject: `Re: ${emailData.subject || 'Your message'}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #10b981;">Thank you for contacting VanaMap Support!</h2>
                                <p>We've received your message and will get back to you within 24 hours.</p>
                                <p><strong>Your message:</strong></p>
                                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                    ${emailData.text || emailData.html || ''}
                                </div>
                                <p>If your issue is urgent, you can also reach us on WhatsApp: <a href="https://wa.me/919188773534">+91 91887 73534</a></p>
                                <p style="color: #6b7280; font-size: 14px;">Best regards,<br>VanaMap Support Team</p>
                            </div>
                        `
                    });
                    console.log(`[Support Email] Auto-reply sent to ${emailData.from}`);
                } catch (e) {
                    console.error('[Support Email] Auto-reply failed:', e.message);
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Support Email Webhook] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- DEBUG ENVIRONMENT ---
router.get('/api/debug-env', (req, res) => {
    // SECURITY: Do not expose full values in prod, just presence
    res.json({
        MONGO_URI_SET: !!process.env.MONGO_URI,
        JWT_SECRET_SET: !!process.env.JWT_SECRET,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        MONGO_STATUS: mongoose.connection.readyState // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    });
});

module.exports = router;
