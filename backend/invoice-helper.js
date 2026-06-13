const PDFDocument = require('pdfkit');

/**
 * Generates a beautiful, professional PDF invoice for a plant purchase
 * @param {Object} sale - Sale mongoose document
 * @param {Object} user - Customer user document
 * @param {Object} vendor - Vendor document
 * @returns {Promise<Buffer>} - Resolves with PDF file Buffer
 */
const generateInvoicePDF = (sale, user, vendor) => {
    return new Promise((resolve, reject) => {
        try {
            const PAGE_HEIGHT = 841.89;
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                info: {
                    Title: `Invoice - VanaMap Order`,
                    Author: 'VanaMap.online',
                    Subject: `Receipt for ${sale.plantName}`,
                    Keywords: 'receipt, invoice, vanamap, plant, purchase',
                    Creator: 'VanaMap Invoice Generator',
                }
            });

            const buffers = [];
            doc.on('data', chunk => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', err => reject(err));

            const COLORS = {
                primary: '#10b981',       // Emerald Green
                primaryDark: '#047857',   // Deep Forest Green
                dark: '#0f172a',          // Slate Dark
                text: '#334155',          // Slate Grey
                lightText: '#64748b',     // Secondary slate grey
                lightBg: '#f8fafc',       // Soft grey background
                border: '#e2e8f0'         // Light divider border
            };

            // --- HEADER WITH LOGO ---
            doc.rect(0, 0, 595.28, 120).fill(COLORS.primary);
            
            // Text branding
            doc.fontSize(26).font('Helvetica-Bold').fillColor('#ffffff')
               .text('VanaMap', 50, 40);
            doc.fontSize(10).font('Helvetica').fillColor('#d1fae5')
               .text('Your Local Green Ecosystem Partner', 50, 72);
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#ffffff')
               .text('ESTIMATED INVOICE', 350, 40, { align: 'right', width: 195 });
            
            // Date & Invoice ID
            const dateStr = new Date(sale.timestamp || Date.now()).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const invId = `INV-${sale._id.toString().substring(18).toUpperCase()}`;
            doc.fontSize(9).font('Helvetica').fillColor('#d1fae5')
               .text(`Date: ${dateStr}`, 350, 65, { align: 'right', width: 195 })
               .text(`Invoice ID: ${invId}`, 350, 78, { align: 'right', width: 195 });

            let y = 145;

            // --- CLIENT & MERCHANDISER SECTION ---
            doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.dark)
               .text('Billed To:', 50, y)
               .text('Vendor Details:', 300, y);

            doc.save();
            doc.moveTo(50, y + 15).lineTo(250, y + 15)
               .moveTo(300, y + 15).lineTo(545, y + 15)
               .strokeColor(COLORS.primary).lineWidth(1.5).stroke();
            doc.restore();

            y += 24;

            // Client Info
            const custName = user ? user.name : (sale.userName || 'Valued Customer');
            const custEmail = user ? user.email : 'N/A';
            const deliveryInfo = sale.deliveryAddress || {};
            const clientAddress = deliveryInfo.address 
                ? `${deliveryInfo.address}, ${deliveryInfo.city || ''} ${deliveryInfo.state || ''} ${deliveryInfo.pincode || ''}`
                : 'Local Pickup';

            doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.dark)
               .text(custName, 50, y);
            doc.font('Helvetica').fillColor(COLORS.text)
               .text(`Email: ${custEmail}`, 50, y + 14, { width: 220 })
               .text(`Address: ${clientAddress}`, 50, y + 28, { width: 220 });

            // Vendor Info
            const vName = vendor ? vendor.name : 'VanaMap Official';
            const vAddress = vendor ? vendor.address : 'HQ Office';
            const vContact = vendor ? (vendor.phone || vendor.whatsapp || 'N/A') : 'support@vanamap.online';

            doc.font('Helvetica-Bold').fillColor(COLORS.dark)
               .text(vName, 300, y);
            doc.font('Helvetica').fillColor(COLORS.text)
               .text(`Contact: ${vContact}`, 300, y + 14, { width: 245 })
               .text(`Address: ${vAddress}`, 300, y + 28, { width: 245 });

            y += 85;

            // --- INVOICE ITEMS TABLE ---
            doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.dark);
            
            // Draw Table Header Background
            doc.rect(50, y, 495.28, 22).fill(COLORS.lightBg);
            doc.fillColor(COLORS.primaryDark)
               .text('Item Description', 60, y + 6)
               .text('Qty', 320, y + 6, { width: 40, align: 'center' })
               .text('Unit Price', 380, y + 6, { width: 70, align: 'right' })
               .text('Total', 470, y + 6, { width: 65, align: 'right' });

            doc.save();
            doc.moveTo(50, y).lineTo(545, y)
               .moveTo(50, y + 22).lineTo(545, y + 22)
               .strokeColor(COLORS.border).lineWidth(1).stroke();
            doc.restore();

            y += 22;

            // Draw Item Row
            doc.rect(50, y, 495.28, 26).fill('#ffffff');
            doc.fontSize(9).font('Helvetica').fillColor(COLORS.dark)
               .text(sale.plantName, 60, y + 8, { width: 250 })
               .text(sale.quantity.toString(), 320, y + 8, { width: 40, align: 'center' })
               .text(`₹${sale.price}`, 380, y + 8, { width: 70, align: 'right' })
               .text(`₹${sale.price * sale.quantity}`, 470, y + 8, { width: 65, align: 'right' });

            doc.save();
            doc.moveTo(50, y + 26).lineTo(545, y + 26)
               .strokeColor(COLORS.border).lineWidth(0.8).stroke();
            doc.restore();

            y += 26;

            // --- TOTAL BALANCE ---
            y += 15;
            doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.lightText)
               .text('Subtotal:', 350, y, { width: 90, align: 'right' })
               .text('Delivery Charge:', 350, y + 16, { width: 90, align: 'right' });

            doc.fillColor(COLORS.dark)
               .text(`₹${sale.price * sale.quantity}`, 455, y, { width: 80, align: 'right' })
               .text('₹0 (Free Delivery)', 455, y + 16, { width: 80, align: 'right' });

            y += 38;
            doc.rect(340, y, 205.28, 24).fill(COLORS.lightBg);
            doc.save();
            doc.moveTo(340, y).lineTo(545, y)
               .moveTo(340, y + 24).lineTo(545, y + 24)
               .strokeColor(COLORS.primary).lineWidth(1).stroke();
            doc.restore();

            doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.primaryDark)
               .text('TOTAL PAID:', 350, y + 6, { width: 95 })
               .text(`₹${sale.price * sale.quantity}`, 450, y + 6, { width: 85, align: 'right' });

            y += 60;

            // --- GEOLOCATION ATTACHMENT DETAILS ---
            if (deliveryInfo.latitude && deliveryInfo.longitude) {
                doc.rect(50, y, 495.28, 50).fill(COLORS.lightBg);
                doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.primaryDark)
                   .text('📍 Pinned Delivery Location Coordinates:', 60, y + 10);
                doc.font('Helvetica').fillColor(COLORS.text)
                   .text(`Latitude: ${deliveryInfo.latitude} | Longitude: ${deliveryInfo.longitude}`, 60, y + 24)
                   .text('Click here to open maps location', 60, y + 36, {
                       link: `https://www.google.com/maps?q=${deliveryInfo.latitude},${deliveryInfo.longitude}`,
                       underline: true
                   });
                y += 70;
            }

            // --- FOOTER NOTE ---
            doc.fontSize(9).font('Helvetica-Oblique').fillColor(COLORS.lightText)
               .text('Thank you for supporting sustainable greenery with VanaMap.online!', 50, PAGE_HEIGHT - 90, {
                   width: 495.28,
                   align: 'center'
               });
            doc.fontSize(7).font('Helvetica').fillColor(COLORS.lightText)
               .text('This estimated invoice is automatically generated for tracking plant health delivery and ecological records. For refunds or care guides, contact support@vanamap.online.', 50, PAGE_HEIGHT - 70, {
                   width: 495.28,
                   align: 'center'
               });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateInvoicePDF };
