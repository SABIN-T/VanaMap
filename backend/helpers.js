/**
 * Shared Helper Functions
 * Extracted from monolithic index.js
 */
const { Vendor, Plant, User, Notification, SystemSettings } = require('./models');
const { broadcastAlert } = require('./config/push');
const { sendEmail } = require('./config/email');

const deductInventory = async (vendorId, plantId, quantityDeducted) => {
    try {
        const vendor = await Vendor.findOne({ id: vendorId });
        if (!vendor) return false;

        const item = vendor.inventory.find(i => i.plantId === plantId);
        if (!item) return false;

        const oldQty = item.quantity || 0;
        const newQty = Math.max(0, oldQty - quantityDeducted);
        item.quantity = newQty;

        if (newQty === 0) {
            item.inStock = false;
        }

        vendor.markModified('inventory');
        await vendor.save();

        const threshold = item.lowStockThreshold !== undefined ? item.lowStockThreshold : 5;
        if (newQty <= threshold) {
            const plant = await Plant.findOne({ id: plantId });
            const plantName = plant ? plant.name : plantId;
            
            await broadcastAlert('low_stock', `Low Stock Alert: ${plantName} has only ${newQty} items left! ⚠️`, {
                vendorId: vendor.id,
                title: 'Low Stock Alert ⚠️',
                plantId
            });

            if (vendor.ownerEmail) {
                try {
                    await sendEmail({
                        from: 'VanaMap Inventory <inventory@vanamap.online>',
                        to: vendor.ownerEmail,
                        subject: `Alert: Low stock for ${plantName}! ⚠️`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #d97706;">⚠️ Low Stock Alert</h2>
                                <p>Hello <strong>${vendor.name}</strong>,</p>
                                <p>This is to notify you that the inventory for <strong>${plantName}</strong> has dropped below your threshold.</p>
                                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <p style="margin: 0; font-size: 16px;">Current Quantity: <strong>${newQty}</strong></p>
                                    <p style="margin: 5px 0 0; font-size: 14px; color: #b45309;">Threshold: ${threshold}</p>
                                </div>
                                <p>Please restock soon to ensure customers can continue ordering this specimen online.</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                <p style="font-size: 12px; color: #777;">Sent automatically by VanaMap Inventory System.</p>
                            </div>
                        `
                    });
                    console.log(`[Low Stock Email] Sent alert to vendor: ${vendor.ownerEmail}`);
                } catch (mailErr) {
                    console.error('[Low Stock Email] Failed to send email:', mailErr.message);
                }
            }
        }
        return true;
    } catch (err) {
        console.error('Inventory Deduction Error:', err);
        return false;
    }
};

const restoreInventory = async (vendorId, plantId, quantityRestored) => {
    try {
        const vendor = await Vendor.findOne({ id: vendorId });
        if (!vendor) return false;

        const item = vendor.inventory.find(i => i.plantId === plantId);
        if (!item) return false;

        const oldQty = item.quantity || 0;
        const newQty = oldQty + quantityRestored;
        item.quantity = newQty;

        if (newQty > 0) {
            item.inStock = true;
        }

        vendor.markModified('inventory');
        await vendor.save();
        console.log(`[Inventory Restored] Vendor ${vendor.name} plant ${plantId} increased by ${quantityRestored}. New Qty: ${newQty}`);
        return true;
    } catch (err) {
        console.error('Inventory Restoration Error:', err);
        return false;
    }
};

async function getVerifiedCofounders() {
    try {
        const setting = await SystemSettings.findOne({ key: 'team_members' });
        if (setting && Array.isArray(setting.value)) {
            return setting.value
                .filter(m => m.role === 'Cofounder' && m.verified)
                .map(m => m.email);
        }
    } catch (e) {
        console.error("Failed to fetch cofounders", e);
    }
    return [];
}

module.exports = { deductInventory, restoreInventory, getVerifiedCofounders };
