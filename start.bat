@echo off
title Lowkey Chopped Elite - Local Server
echo ===================================================
echo     Launching Lowkey Chopped Elite (LCE)
echo ===================================================
echo.

if not exist node_modules (
    echo [1/2] Installing dependencies (first-time setup)...
    call npm install
    echo.
)

echo [2/2] Starting local development server...
echo Server running at: http://localhost:3000
echo Press Ctrl+C in this window anytime to stop.
echo.
call npm run dev
pause
