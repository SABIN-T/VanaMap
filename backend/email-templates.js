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
    },

    vendorRejected: (name, shopName, reason = 'incomplete information') => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">📋</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Shop Verification Update
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Hello ${name}, regarding your shop verification request
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 25px; border-radius: 12px; margin: 30px 0;">
                        <p style="color: #92400e; font-size: 16px; line-height: 1.8; margin: 0;">
                            <strong>Shop: ${shopName}</strong><br/><br/>
                            We've reviewed your shop registration and found that we need some additional information before we can verify your account. This is typically due to ${reason}.
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            📝 Next Steps:
                        </h3>
                        <ul style="color: #4b5563; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                            <li><strong>Review Your Profile</strong> - Make sure all required fields are filled out completely.</li>
                            <li><strong>Add Contact Information</strong> - Verify your phone number and address are correct.</li>
                            <li><strong>Upload Shop Photos</strong> - Add clear photos of your nursery to build trust.</li>
                            <li><strong>Resubmit</strong> - Once updated, your profile will be automatically reviewed again.</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/vendor/profile" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                            Update Profile
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        Need help? Reply to this email or contact us at <a href="mailto:support@vanamap.online" style="color: #10b981; text-decoration: none;">support@vanamap.online</a>
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    resetInstruction: (email) => {
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🆘</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Secure Access Request
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            We received a request to access your VanaMap account via ${email}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 25px; border-radius: 12px; margin: 30px 0;">
                        <p style="color: #065f46; font-size: 15px; line-height: 1.8; margin: 0;">
                            <strong>Security Protocol Triggered:</strong><br/><br/>
                            Our administrative team has been notified. To protect your nursery and personal data, we have set a temporary secure password for your next login:<br/><br/>
                            <span style="display: block; text-align: center; font-family: monospace; font-size: 24px; font-weight: bold; color: #047857; background: #ffffff; padding: 15px; border-radius: 8px; border: 2px dashed #10b981; letter-spacing: 2px;">
                                123456
                            </span>
                        </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                            🛡️ Next Steps:
                        </h3>
                        <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                            <li>Login using this temporary password.</li>
                            <li>Immediately go to your <strong>Profile Settings</strong>.</li>
                            <li>Change your password to something unique and strong.</li>
                            <li>This temporary key will expire soon.</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/auth" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            Login to VanaMap
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        If you did not request this, please ignore this email. Your account remains secure.
                    </p>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 7. User Order Status Update Notification
    userOrderStatusUpdate: (userName, plantName, status, price, orderId, vendorName, deliveryAddress) => {
        const statusColors = {
            pending: { title: 'Order Pending ⏳', color: '#d97706', bg: '#fef3c7', icon: '⏳' },
            completed: { title: 'Order Confirmed! ✅', color: '#059669', bg: '#ecfdf5', icon: '🌿' },
            out_for_delivery: { title: 'Out for Delivery! 🚚', color: '#2563eb', bg: '#eff6ff', icon: '🚚' },
            ready_for_pickup: { title: 'Ready for Pickup! 🏪', color: '#3b82f6', bg: '#eff6ff', icon: '🏪' },
            picked_up: { title: 'Picked Up! 📦✅', color: '#059669', bg: '#ecfdf5', icon: '🛍️' },
            delivered: { title: 'Order Delivered! 📦🎉', color: '#059669', bg: '#ecfdf5', icon: '📦' },
            cancelled: { title: 'Order Cancelled ❌', color: '#dc2626', bg: '#fef2f2', icon: '❌' }
        };
        const config = statusColors[status.toLowerCase()] || statusColors.pending;
        
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">${config.icon}</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            ${config.title}
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Hello ${userName}, your order status has been updated.
                        </p>
                    </div>
                    
                    <div style="background: ${config.bg}; border: 2px solid ${config.color}; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                            Order Status: <span style="color: ${config.color}; text-transform: uppercase;">${status}</span>
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Order ID:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${orderId}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Plant Ordered:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${plantName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Shop:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${vendorName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Amount Paid:</td>
                                <td style="color: #10b981; font-size: 16px; font-weight: 700; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">₹${price}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Delivery Address:</td>
                                <td style="color: #1f2937; font-size: 14px; text-align: right; padding: 8px 0;">
                                    ${deliveryAddress ? `${deliveryAddress.address || ''}, ${deliveryAddress.city || ''} ${deliveryAddress.pincode || ''}` : 'Not provided'}
                                </td>
                            </tr>
                        </table>
                    </div>

                    ${status.toLowerCase() === 'out_for_delivery' ? `
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
                            <strong>🚚 Local Delivery Alert:</strong> Your plant has left the store and is out for local delivery! Please make sure you are available to receive the delivery.
                        </p>
                    </div>
                    ` : ''}

                    ${status.toLowerCase() === 'ready_for_pickup' ? `
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
                            <strong>🏪 Store Pickup Alert:</strong> Your order is ready and waiting for you to pick up at the physical nursery/store! Please have your pickup OTP ready.
                        </p>
                    </div>
                    ` : ''}

                    ${status.toLowerCase() === 'delivered' ? `
                    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #065f46; font-size: 14px; margin: 0; line-height: 1.6;">
                            <strong>📦 Delivered:</strong> Your plant has been successfully delivered! Don't forget to unbox it immediately and give it some water. Happy gardening! 🌱
                        </p>
                    </div>
                    ` : ''}

                    ${status.toLowerCase() === 'cancelled' ? `
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
                            <strong>❌ Cancellation Notice:</strong> Your order has been cancelled. If payment was made online, it will be refunded back to your account within 5-7 business days.
                        </p>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/orders" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            View Order Status
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 8. Vendor New Order Alert Notification
    vendorNewOrderAlert: (vendorName, customerName, plantName, quantity, price, deliveryAddress) => {
        const hasCoords = deliveryAddress?.latitude && deliveryAddress?.longitude;
        const googleMapsLink = hasCoords ? `https://www.google.com/maps?q=${deliveryAddress.latitude},${deliveryAddress.longitude}` : '';

        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🏪</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            New Order Received!
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Hello ${vendorName}, you have a new customer order.
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #065f46; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                            Order Details
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Customer:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${customerName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Plant:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${plantName} (x${quantity})</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Total Value:</td>
                                <td style="color: #10b981; font-size: 18px; font-weight: 700; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">₹${price * quantity}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">Delivery Address:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #bbf7d0;">
                                    ${deliveryAddress?.address ? `${deliveryAddress.address}, ${deliveryAddress.city || ''} ${deliveryAddress.pincode || ''}` : 'Not provided'}
                                </td>
                            </tr>
                        </table>
                    </div>

                    ${hasCoords ? `
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 30px 0; text-align: center;">
                        <p style="color: #1e40af; font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
                            📍 The customer has pinned their exact coordinates for delivery.
                        </p>
                        <a href="${googleMapsLink}" target="_blank" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            Open in Google Maps
                        </a>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://vanamap.online/vendor" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                            Open Vendor Portal
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    },

    // 9. Vendor Order Status Alert Notification (For cancellations)
    vendorOrderStatusAlert: (vendorName, customerName, plantName, status, quantity, price, orderId) => {
        const isCancelled = status.toLowerCase() === 'cancelled';
        const content = `
            <tr>
                <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">📢</div>
                        <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                            Order Status Update
                        </h2>
                        <p style="color: #6b7280; font-size: 16px; margin: 0;">
                            Hello ${vendorName}, order ${orderId} has been updated.
                        </p>
                    </div>
                    
                    <div style="background: ${isCancelled ? '#fef2f2' : '#f9fafb'}; border: 2px solid ${isCancelled ? '#ef4444' : '#e5e7eb'}; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                            New Status: <span style="color: ${isCancelled ? '#ef4444' : '#4b5563'}; text-transform: uppercase;">${status}</span>
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Order ID:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${orderId}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Customer:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${customerName}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">Plant:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">${plantName} (x${quantity})</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Amount:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">₹${price * quantity}</td>
                            </tr>
                        </table>
                    </div>

                    ${isCancelled ? `
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
                            <strong>⚠️ Order Cancelled:</strong> Please halt any packaging, delivery, or pickup preparation for this order.
                        </p>
                    </div>
                    ` : ''}
                </td>
            </tr>
        `;
        return createEmailTemplate(content);
    }
};

module.exports = EmailTemplates;
