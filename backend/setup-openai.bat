@echo off
echo ========================================
echo VanaMap Backend - OpenAI API Setup
echo ========================================
echo.

REM Check if .env file exists
if exist .env (
    echo [INFO] .env file found. Updating OPENAI_API_KEY...
    echo.
    
    REM Backup existing .env
    copy .env .env.backup >nul 2>&1
    echo [BACKUP] Created .env.backup
    
    REM Check if OPENAI_API_KEY already exists
    findstr /C:"OPENAI_API_KEY" .env >nul 2>&1
    if %errorlevel%==0 (
        echo [UPDATE] Replacing existing OPENAI_API_KEY...
        powershell -Command "(Get-Content .env) -replace '^OPENAI_API_KEY=.*', 'OPENAI_API_KEY=your_openai_api_key_here' | Set-Content .env"
    ) else (
        echo [ADD] Adding OPENAI_API_KEY to .env...
        echo. >> .env
        echo # OpenAI API Key for AI Doctor Chat >> .env
        echo OPENAI_API_KEY=your_openai_api_key_here >> .env
    )
) else (
    echo [CREATE] .env file not found. Creating new .env from template...
    copy .env.example .env >nul 2>&1
)

echo.
echo ========================================
echo [SUCCESS] OpenAI API Key configured!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server: npm start
echo 2. Test the AI Doctor in your frontend
echo.
echo The AI Doctor will now use OpenAI GPT-4o model.
echo.
pause
