// Professional Email Templates for VanaMap
// All templates use international English and premium design

const createEmailTemplate = (content) => `
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
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                            <img src="https://vanamap.online/logo.png" alt="VanaMap" style="height: 50px; margin-bottom: 10px;" />
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">VanaMap</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    ${content}
                    
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

const EmailTemplates = {
    // 1. Welcome Email for New Users
    welcome: (name, role = 'user') => {
        const isVendor = role === 'vendor';
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">${isVendor ? '🏪' : '🌿'}</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Welcome to VanaMap, ${name}!
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            ${isVendor ? 'Your nursery journey begins here' : 'Your green journey starts now'}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #065f46; font-size: 15px; line-height: 1.8; margin: 0;">
                            ${isVendor
                ? 'Thank you for joining VanaMap as a partner! You can now showcase your nursery to thousands of plant enthusiasts and grow your business with us.'
                : 'We\'re thrilled to have you join our community of plant lovers! Discover thousands of plants, connect with local nurseries, and bring nature into your life.'}
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            ${isVendor ? 'Get Started:' : 'What You Can Do:'}
                        </h3>
                        <ul style="color: #4b5563; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                            ${isVendor
                ? `
                                <li>Add your plants to our marketplace</li>
                                <li>Manage your nursery profile</li>
                                <li>Connect with customers nearby</li>
                                <li>Track your sales and analytics</li>
                                `
                : `
                                <li>Browse 1000+ plant varieties</li>
                                <li>Find nurseries near you</li>
                                <li>Get AI-powered plant care advice</li>
                                <li>Visualize plants in your space with AR</li>
                                `
            }
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            ${isVendor ? 'Go to Dashboard' : 'Start Exploring'}
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Need help? Reply to this email or visit our <a href="https://vanamap.online/support" style="color: #10b981; text-decoration: none;">Help Center</a>
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 2. Premium Subscription Confirmation
    premiumActivated: (name, planType, expiryDate) => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">👑</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Welcome to Premium!
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Thank you for upgrading, ${name}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                        <p style="color: #92400e; font-size: 14px; margin: 0 0 10px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Your Premium Status
                        </p>
                        <h3 style="color: #78350f; font-size: 24px; margin: 0; font-weight: 700;">
                            ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
                        </h3>
                        <p style="color: #92400e; font-size: 13px; margin: 10px 0 0 0;">
                            Valid until ${new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            🎉 Your Premium Benefits:
                        </h3>
                        <ul style="color: #4b5563; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                            <li><strong>Unlimited Favorites</strong> - Save as many plants as you want</li>
                            <li><strong>AI Plant Doctor</strong> - Get expert plant care advice 24/7</li>
                            <li><strong>AR Visualization</strong> - See plants in your space before buying</li>
                            <li><strong>Priority Support</strong> - Get help faster from our team</li>
                            <li><strong>Exclusive Content</strong> - Access premium plant care guides</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/heaven" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                            Explore Premium Features
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Enjoy your premium experience! 🌟
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 3. Password Changed Confirmation
    passwordChanged: (name) => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🔒</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Password Updated Successfully
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Your account security has been enhanced
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #065f46; font-size: 15px; line-height: 1.8; margin: 0;">
                            <strong>Hi ${name},</strong><br/><br/>
                            Your password was successfully changed on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.
                        </p>
                    </div>
                    
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #991b1b; font-size: 14px; line-height: 1.8; margin: 0;">
                            <strong>⚠️ Didn't make this change?</strong><br/>
                            If you didn't request this password change, please contact our support team immediately at <a href="mailto:support@vanamap.online" style="color: #dc2626; text-decoration: none; font-weight: 600;">support@vanamap.online</a>
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            🛡️ Security Tips:
                        </h3>
                        <ul style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                            <li>Use a unique password for VanaMap</li>
                            <li>Enable two-factor authentication (coming soon)</li>
                            <li>Never share your password with anyone</li>
                            <li>Change your password regularly</li>
                        </ul>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Stay secure! 🔐
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 4. Plant Purchase Confirmation
    plantPurchased: (name, plantName, vendorName, price) => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Order Confirmed!
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Thank you for your purchase, ${name}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #065f46; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                            Order Summary
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Plant:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${plantName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Vendor:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${vendorName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Amount:</td>
                                <td style="color: #10b981; font-size: 18px; font-weight: 700; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">₹${price}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Order Date:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            📦 What's Next?
                        </h3>
                        <ol style="color: #4b5563; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                            <li>The vendor will contact you shortly to arrange delivery</li>
                            <li>Prepare a suitable spot for your new plant</li>
                            <li>Check our care guide for ${plantName}</li>
                            <li>Share your plant journey with #VanaMap</li>
                        </ol>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/orders" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            View Order Details
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Happy planting! 🌱
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 5. Vendor Verified Confirmation
    vendorVerified: (name, shopName) => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🛡️</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Your Shop is Verified!
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Congratulations ${name}, your nursery is now a Verified Partner.
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 25px; border-radius: 12px; margin: 30px 0;">
                        <p style="color: #065f46; font-size: 16px; line-height: 1.8; margin: 0;">
                            <strong>Shop: ${shopName}</strong><br/><br/>
                            We have reviewed your shop details and granted you the <strong>Verified Partner</strong> badge. This status increases your visibility in search results and builds trust with thousands of local plant enthusiasts on VanaMap.
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            🚀 Next Professional Steps:
                        </h3>
                        <ul style="color: #4b5563; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                            <li><strong>List Your Inventory</strong> - Add high-quality photos and professional descriptions for your plants.</li>
                            <li><strong>Manage Prices</strong> - Keep your pricing up-to-date to attract more local buyers.</li>
                            <li><strong>Check Insights</strong> - Use your dashboard to see which plants are in high demand in your area.</li>
                            <li><strong>Promote Your Shop</strong> - Share your VanaMap profile link on social media.</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/vendor/inventory" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            Start Adding Plants
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Welcome to the Elite Circle of VanaMap Partners! 🌿
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    }
};

module.exports = EmailTemplates;
