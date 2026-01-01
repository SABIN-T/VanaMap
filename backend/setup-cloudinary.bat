@echo off
echo ========================================
echo Cloudinary Setup for VanaMap
echo ========================================
echo.

echo This script will help you set up automatic cloud storage for plant images.
echo.

echo Step 1: Get Cloudinary Credentials
echo -----------------------------------
echo 1. Go to: https://cloudinary.com/users/register_free
echo 2. Sign up for FREE account
echo 3. Go to Dashboard
echo 4. Copy your credentials
echo.

set /p CLOUD_NAME="Enter your Cloudinary Cloud Name: "
set /p API_KEY="Enter your Cloudinary API Key: "
set /p API_SECRET="Enter your Cloudinary API Secret: "

echo.
echo Step 2: Adding to .env file...
echo -----------------------------------

if not exist .env (
    echo Creating .env file...
    echo # Cloudinary Configuration > .env
) else (
    echo Updating .env file...
)

echo. >> .env
echo # Cloudinary Configuration >> .env
echo CLOUDINARY_CLOUD_NAME=%CLOUD_NAME% >> .env
echo CLOUDINARY_API_KEY=%API_KEY% >> .env
echo CLOUDINARY_API_SECRET=%API_SECRET% >> .env

echo.
echo ========================================
echo ✅ Cloudinary credentials added to .env!
echo ========================================
echo.
echo Next steps:
echo 1. Add the Cloudinary code to index.js (see CLOUDINARY_SETUP.md)
echo 2. Restart your backend server
echo 3. Upload plant images - they'll be stored permanently!
echo.
echo Documentation: CLOUDINARY_SETUP.md
echo.
pause
