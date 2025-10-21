@echo off
echo Starting AI Writing Platform...
echo.

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo Installing dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

echo Starting development server...
cd frontend
npm run dev

