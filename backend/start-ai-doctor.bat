@echo off
color 0A
echo.
echo ========================================
echo    VanaMap AI Doctor - Quick Start
echo ========================================
echo.
echo [1/4] Checking OpenAI API Key...
findstr /C:"OPENAI_API_KEY" .env >nul 2>&1
if %errorlevel%==0 (
    echo [OK] API Key found in .env
) else (
    echo [ERROR] API Key not found!
    echo.
    echo Run setup-openai.bat first
    pause
    exit /b 1
)

echo.
echo [2/4] Testing OpenAI Connection...
node test-openai.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] OpenAI test failed!
    echo.
    echo Common issues:
    echo - Insufficient quota: Add credits at https://platform.openai.com/account/billing
    echo - Invalid API key: Check at https://platform.openai.com/api-keys
    echo - Network issue: Check internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo [3/4] Starting Backend Server...
echo.
echo Press Ctrl+C to stop the server
echo.
start "VanaMap Backend" cmd /k "npm start"

timeout /t 3 >nul

echo.
echo [4/4] Opening Setup Instructions...
start OPENAI_INTEGRATION_SUMMARY.md

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Backend is running in a separate window
echo.
echo Next steps:
echo 1. Start the frontend: cd ../frontend && npm run dev
echo 2. Open browser: http://localhost:5173
echo 3. Navigate to: Heaven > AI Doctor
echo 4. Start chatting with Dr. Flora!
echo.
echo ========================================
pause
