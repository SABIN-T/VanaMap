# Vendor Image Upload Guide

## Overview
Vendors can upload two types of images:
1. **Shop Logo/Verification Image** - Displayed in navbar and shop listings
2. **Custom Plant Images** - Up to 3 real photos per plant in inventory

## How to Upload Shop Logo

### For Unverified Vendors:
1. Log in to your vendor account
2. You'll see a **red "Upload Verification Photo"** section
3. Click the upload button and select your shop image
4. Wait for admin approval

### For Verified Vendors:
1. Go to your Vendor Dashboard
2. Look at the **Shop Profile Header** at the top
3. Click the **blue upload icon** on your shop logo (bottom-right corner)
4. Select your new shop image
5. The image will update across the platform (navbar, shop listings, etc.)

## How to Upload Custom Plant Images

1. Go to your **Inventory & Pricing** section
2. Find the plant you want to add photos for
3. Click the **Edit button** (pencil icon) on the plant card
4. In the modal that opens:
   - You'll see a grid with the default plant image
   - Click **"Add Photo"** boxes to upload up to 3 custom images
   - Each image uploads immediately
   - Remove unwanted images with the trash icon
5. Click **"Save Changes"** when done

## Features:
- **Shop Logo**: Syncs to your user profile, appears in navbar
- **Custom Plant Images**: First image becomes the primary display image
- **Image Gallery**: Customers see your real plant photos in shop listings
- **Professional Branding**: Build trust with actual product photos

## Technical Details:
- **Endpoint**: `/api/upload` (authenticated)
- **Allowed Roles**: Admin, Vendor
- **Max Images per Plant**: 3
- **Storage**: Cloudinary
- **Sync**: Shop image updates User.profileImage automatically

## Troubleshooting:
- If you see "Unexpected token" error, check browser console for details
- Ensure you're logged in with a vendor account
- Image must be a valid image file (jpg, png, webp, etc.)
- Check network tab for API response status
