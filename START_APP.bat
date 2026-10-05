@echo off
title Brain Tumor Detection - Application Launcher
color 0A

echo.
echo ====================================================================
echo     BRAIN TUMOR DETECTION SYSTEM - APPLICATION LAUNCHER
echo ====================================================================
echo.

cd /d "C:\Prashanth_N Projects\Brain Tumor Identification"

echo [STEP 1] Checking for model file...
echo.

set MODEL_FOUND=0

if exist "backend\models\*.keras" (
    echo ✅ Found .keras model file
    set MODEL_FOUND=1
)

if exist "backend\models\*.h5" (
    echo ✅ Found .h5 model file
    set MODEL_FOUND=1
)

if %MODEL_FOUND%==0 (
    echo.
    echo ❌ ERROR: No model file found!
    echo.
    echo Please place your trained model in: backend\models\
    echo.
    echo Options:
    echo   1. Download from Google Colab
    echo   2. Train using Train_on_Google_Colab.ipynb
    echo.
    echo See PLACE_YOUR_MODEL.md for instructions.
    echo.
    pause
    exit /b 1
)

echo.
echo [STEP 2] Checking MongoDB...
echo.

sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo ⚠️  MongoDB not running. Attempting to start...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo ❌ Could not start MongoDB
        echo Please start MongoDB manually: net start MongoDB
        echo.
        pause
        exit /b 1
    ) else (
        echo ✅ MongoDB started successfully
    )
) else (
    echo ✅ MongoDB is running
)

echo.
echo ====================================================================
echo     READY TO START APPLICATION
echo ====================================================================
echo.
echo This will open 2 terminal windows:
echo   1. Backend Server (Flask/Python)
echo   2. Frontend Server (React/Node.js)
echo.
echo Keep BOTH windows open while using the application!
echo.
echo Press any key to start...
pause >nul

echo.
echo Starting Backend Server...
start "Brain Tumor Backend" cmd /k "cd /d "%~dp0backend" && echo ====================================================================== && echo BACKEND SERVER && echo ====================================================================== && echo. && python app.py"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Brain Tumor Frontend" cmd /k "cd /d "%~dp0frontend" && echo ====================================================================== && echo FRONTEND SERVER && echo ====================================================================== && echo. && npm start"

echo.
echo ====================================================================
echo ✅ APPLICATION STARTED!
echo ====================================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Browser will open automatically in a few seconds...
echo.
echo To stop the application:
echo   - Close both terminal windows
echo   - Or press Ctrl+C in each window
echo.
echo ====================================================================
