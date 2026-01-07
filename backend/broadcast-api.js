// Admin Broadcast System - Backend API
// Add these endpoints to backend/index.js

const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/broadcasts/');
    },
    filename: (req, file, cb) => {
        cb(null, `broadcast-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// ==========================================
// 1. SEARCH USERS ENDPOINT
// ==========================================

app.get('/api/admin/search-users', admin, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                error: "Search query too short",
                message: "Please enter at least 2 characters to search."
            });
        }

        // Search by name, email, or phone
        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } }
            ]
        })
            .select('name email phone role')
            .limit(20);

        res.json({
            success: true,
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                role: u.role
            }))
        });
    } catch (error) {
        res.status(500).json({
            error: "Search failed",
            message: "We couldn't search for users at this time. Please try again."
        });
    }
});

// ==========================================
// 2. SEND BROADCAST ENDPOINT
// ==========================================

app.post('/api/admin/broadcast', admin, upload.single('image'), async (req, res) => {
    try {
        const { recipientType, messageType, subject, messageText, recipientId } = req.body;
        const imageFile = req.file;

        // Validation
        if (!subject || !subject.trim()) {
            return res.status(400).json({
                error: "Subject required",
                message: "Please enter an email subject."
            });
        }

        if (messageType !== 'image' && (!messageText || !messageText.trim())) {
            return res.status(400).json({
                error: "Message required",
                message: "Please enter a message."
            });
        }

        if ((messageType === 'image' || messageType === 'both') && !imageFile) {
            return res.status(400).json({
                error: "Image required",
                message: "Please upload an image."
            });
        }

        // Get recipients
        let recipients = [];

        if (recipientType === 'all') {
            // Get all users
            recipients = await User.find({}).select('name email');
        } else if (recipientType === 'single') {
            if (!recipientId) {
                return res.status(400).json({
                    error: "Recipient required",
                    message: "Please select a recipient."
                });
            }
            const user = await User.findById(recipientId).select('name email');
            if (!user) {
                return res.status(404).json({
                    error: "User not found",
                    message: "The selected user doesn't exist."
                });
            }
            recipients = [user];
        }

        // Create email HTML
        let emailHTML = '';

        if (messageType === 'text' || messageType === 'both') {
            emailHTML += `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    ${messageText.replace(/\n/g, '<br>')}
                </div>
            `;
        }

        if (messageType === 'image' || messageType === 'both') {
            const imageUrl = `${process.env.BACKEND_URL || 'https://plantoxy.onrender.com'}/uploads/broadcasts/${imageFile.filename}`;
            emailHTML += `
                <div style="text-align: center; padding: 20px;">
                    <img src="${imageUrl}" alt="Broadcast Image" style="max-width: 100%; height: auto; border-radius: 12px;" />
                </div>
            `;
        }

        // Wrap in professional template
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                                        <img src="https://vanamap.online/logo.png" alt="VanaMap" style="height: 50px; margin-bottom: 10px;" />
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">VanaMap</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        ${emailHTML}
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                                            © 2026 VanaMap. All rights reserved.<br/>
                                            <a href="https://vanamap.online" style="color: #10b981; text-decoration: none;">vanamap.online</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // Send emails
        let successCount = 0;
        let failedCount = 0;

        for (const recipient of recipients) {
            try {
                await sendEmail({
                    from: 'VanaMap <noreply@vanamap.online>',
                    to: recipient.email,
                    subject: subject,
                    html: fullHTML
                });
                successCount++;
            } catch (error) {
                console.error(`Failed to send to ${recipient.email}:`, error.message);
                failedCount++;
            }
        }

        res.json({
            success: true,
            recipientCount: successCount,
            failedCount: failedCount,
            message: `Successfully sent to ${successCount} recipient(s). ${failedCount > 0 ? `${failedCount} failed.` : ''}`
        });

    } catch (error) {
        console.error('[BROADCAST] Error:', error);
        res.status(500).json({
            error: "Broadcast failed",
            message: "We couldn't send your message at this time. Please try again."
        });
    }
});

// ==========================================
// 3. CREATE UPLOADS DIRECTORY
// ==========================================

const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'broadcasts');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// USAGE INSTRUCTIONS
// ==========================================

/*
1. Install multer:
   npm install multer

2. Add these endpoints to your backend/index.js

3. Create uploads/broadcasts directory:
   mkdir -p uploads/broadcasts

4. Add to Admin.tsx navigation:
   <Link to="/admin/broadcast">📢 Broadcast Center</Link>

5. Add route in App.tsx:
   <Route path="/admin/broadcast" element={<BroadcastCenter />} />

6. Test:
   - Search for users
   - Send text message
   - Send image
   - Send both
   - Send to all users
   - Send to single user
*/
