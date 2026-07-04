/**
 * Email Configuration
 * Multi-provider email system: Resend > SendGrid > Gmail SMTP
 */
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    pool: false,
    logger: true,
    debug: true
});

console.log(`[SMTP] Provider: ${process.env.SMTP_HOST || 'smtp.gmail.com (Default)'}`);

// Resend Setup
let resend;
if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ [Email] Using Resend HTTP API (Primary)");
}

// SendGrid Setup (Fallback)
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ [Email] SendGrid configured (Fallback)");
}

/**
 * Unified email sender with multi-provider fallback
 * Priority: Resend > SendGrid > Gmail SMTP
 */
const sendEmail = async (mailOptions) => {
    // Priority 1: Resend
    if (resend) {
        try {
            const payload = {
                from: mailOptions.from || 'VanaMap <support@vanamap.online>',
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.html
            };
            if (mailOptions.attachments) {
                payload.attachments = mailOptions.attachments.map(att => ({
                    filename: att.filename,
                    content: att.content,
                    path: att.path
                }));
            }
            const result = await resend.emails.send(payload);
            console.log(`[Resend] Sent to ${mailOptions.to} (ID: ${result.data?.id})`);
            return { messageId: result.data?.id || 'resend-api' };
        } catch (error) {
            console.error('[Resend] Error:', error.message);
            console.error('[Resend] Full Error:', JSON.stringify(error, null, 2));
            console.error('[Resend] Attempted to send:', {
                from: mailOptions.from || 'VanaMap <support@vanamap.online>',
                to: mailOptions.to,
                subject: mailOptions.subject
            });
            // Fall through to SendGrid
        }
    }

    // Priority 2: SendGrid
    if (process.env.SENDGRID_API_KEY) {
        const msg = {
            to: mailOptions.to,
            from: mailOptions.from || 'VanaMap <support@vanamap.online>',
            subject: mailOptions.subject,
            html: mailOptions.html,
        };
        if (mailOptions.attachments) {
            msg.attachments = mailOptions.attachments.map(att => {
                let base64Content = '';
                if (Buffer.isBuffer(att.content)) {
                    base64Content = att.content.toString('base64');
                } else if (typeof att.content === 'string') {
                    base64Content = Buffer.from(att.content).toString('base64');
                } else if (att.path) {
                    base64Content = fs.readFileSync(att.path).toString('base64');
                }
                return {
                    content: base64Content,
                    filename: att.filename,
                    type: att.contentType || 'application/pdf',
                    disposition: 'attachment'
                };
            });
        }
        try {
            await sgMail.send(msg);
            console.log(`[SendGrid] Sent to ${mailOptions.to}`);
            return { messageId: 'sendgrid-api' };
        } catch (error) {
            console.error('[SendGrid] Error:', error.response ? error.response.body : error);
            // Fall through to SMTP
        }
    }

    // Priority 3: Gmail SMTP (Last Resort)
    return transporter.sendMail(mailOptions);
};

/**
 * Send password reset email
 */
const sendResetEmail = async (email, tempPass) => {
    console.log(`ATTEMPTING TO SEND EMAIL TO: ${email} via ${process.env.EMAIL_USER}`);
    const mailOptions = {
        from: 'VanaMap <support@vanamap.online>',
        to: email,
        subject: '🛡️ Account Recovered by The Defender',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #10b981; margin: 0;">VanaMap Security Hub</h1>
                    <p style="color: #64748b; font-size: 14px;">The Ultimate Secure Protector</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <p style="font-weight: bold; font-size: 18px; color: #059669;">I am the Defender of VanaMap</p>
                    <p>The ultimate secure Protector of this environment. Your access has been restored. Use the key below to return:</p>
                    
                    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px dashed #10b981;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; color: #0f172a; letter-spacing: 4px;">${tempPass}</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #475569;">Return to the simulation and update your credentials immediately via your Dashboard.</p>
                </div>

                <div style="margin-top: 30px; text-align: center; padding: 0 20px;">
                    <p style="font-style: italic; color: #10b981; font-size: 14px; line-height: 1.6;">
                        "Be happy don't worry for a password everything has a solution lets breath fresh air together"
                    </p>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p>This is the Defender of VanaMap. The ultimate sure Protector in email.</p>
                    <p>System Generated Shield - DO NOT SPAM</p>
                </div>
            </div>
        `
    };

    try {
        await sendEmail(mailOptions);
        console.log(`Email successfully sent to: ${email}`);
    } catch (e) {
        console.error("CRITICAL MAIL ERROR:", e.message);
        console.error("Transporter Auth:", { user: process.env.EMAIL_USER, pass: '****' });
    }
};

/**
 * CommunicationOS 2.0 — Unified messaging system
 */
const CommunicationOS = {
    email: async (to, subject, html) => {
        try {
            const mailOptions = {
                from: 'VanaMap <support@vanamap.online>',
                to, subject, html
            };
            await sendEmail(mailOptions);
            return { success: true, provider: 'Resend' };
        } catch (e) {
            console.error('[CommOS] Email Failed:', e.message);
            return { success: false, error: e.message };
        }
    },

    sms: async (phone, message) => {
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);

        if (process.env.FAST2SMS_API_KEY) {
            try {
                const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                    method: 'POST',
                    headers: {
                        'authorization': process.env.FAST2SMS_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'message': message,
                        'language': 'english',
                        'route': 'q',
                        'numbers': cleanPhone
                    })
                });
                const data = await response.json();

                if (data.return) {
                    console.log(`[CommOS] SMS Sent via Fast2SMS to ${cleanPhone}`);
                    return { success: true, provider: 'Fast2SMS' };
                } else {
                    console.error('[CommOS] Fast2SMS API Error:', data);
                    return { success: false, error: data.message };
                }
            } catch (err) {
                console.error('[CommOS] Fast2SMS Network Error:', err.message);
                return { success: false, error: err.message };
            }
        } else {
            console.log(`[CommOS] 📱 SMS Simulation to ${phone}: "${message}"`);
            return { success: true, provider: 'Simulation' };
        }
    },

    sendOTP: async (target, otp, type = 'email') => {
        if (type === 'email') {
            const html = `
                <div style="font-family: sans-serif; background: #f0fdf4; padding: 40px; text-align: center;">
                    <div style="background: white; padding: 30px; border-radius: 16px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <h2 style="color: #10b981; margin:0;">Identity Check</h2>
                        <p style="color: #64748b; margin-top: 5px;">VanaMap Security Protocol</p>
                        <div style="margin: 25px 0; background: #ecfdf5; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 32px; letter-spacing: 5px; color: #065f46; font-weight: bold;">
                            ${otp}
                        </div>
                        <p style="font-size: 12px; color: #94a3b8;">Valid for 15 minutes.</p>
                    </div>
                </div>`;
            return await CommunicationOS.email(target, '🔐 Your VanaMap Code', html);
        } else if (type === 'sms') {
            return await CommunicationOS.sms(target, `Your VanaMap verification code is: ${otp}. Do not share this.`);
        }
    },

    sendWelcome: async (user) => {
        const isVendor = user.role === 'vendor';
        const subject = isVendor ? 'Welcome, Partner! 🏪' : 'Welcome to the Jungle! 🌿';
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                <h1 style="color: #10b981;">Hi ${user.name}!</h1>
                <p>Welcome to <strong>VanaMap</strong>. We are thrilled to have you.</p>
                <p>Your journey to a greener planet starts now.</p>
                <a href="https://vanamap.online" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin-top: 20px;">Get Started</a>
            </div>
        `;
        await CommunicationOS.email(user.email, subject, html);

        if (user.phone) {
            await CommunicationOS.sms(user.phone, `Welcome to VanaMap, ${user.name.split(' ')[0]}! 🌿 We're glad you're here.`);
        }
    }
};

// Wrappers for existing code compatibility
const sendOtpEmail = (email, otp) => CommunicationOS.sendOTP(email, otp, 'email');
const sendSmsOtp = (phone, otp) => CommunicationOS.sendOTP(phone, otp, 'sms');
const sendWelcomeEmail = (email, name, role) => CommunicationOS.sendWelcome({ email, name, role, phone: null });

module.exports = {
    sendEmail,
    sendResetEmail,
    CommunicationOS,
    sendOtpEmail,
    sendSmsOtp,
    sendWelcomeEmail,
    transporter,
    resend
};
