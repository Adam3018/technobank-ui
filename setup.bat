@echo off
node --version >nul 2>&1
if %errorlevel% NEQ 0 (
    echo ERROR: Node.js not found. Install Node.js 14+ first.
    pause
    exit /b 1
)

npm install
echo.
echo Setup complete. To run:
echo   npm run dev
echo.
pause