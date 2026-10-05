@echo off
echo ====================================================================
echo Brain Tumor Detection - Model Checker
echo ====================================================================
echo.

cd /d "c:\Prashanth_N Projects\Brain Tumor Identification"

echo Checking for model files in backend\models\...
echo.

if exist "backend\models\*.h5" (
    echo ✅ Found .h5 model file:
    dir /b "backend\models\*.h5"
    echo.
) else (
    echo ❌ No .h5 model files found
    echo.
)

if exist "backend\models\*.keras" (
    echo ✅ Found .keras model file:
    dir /b "backend\models\*.keras"
    echo.
) else (
    echo ❌ No .keras model files found
    echo.
)

if exist "backend\models\*.h5" (
    goto :model_found
)

if exist "backend\models\*.keras" (
    goto :model_found
)

echo.
echo ====================================================================
echo ⚠️  NO MODEL FOUND!
echo ====================================================================
echo.
echo Please place your trained model in the backend\models\ folder:
echo.
echo 1. Download model from Google Colab
echo 2. Copy to: backend\models\
echo 3. Supported formats: .h5 or .keras
echo.
echo See PLACE_YOUR_MODEL.md for detailed instructions.
echo.
pause
exit /b

:model_found
echo.
echo ====================================================================
echo ✅ MODEL FOUND! Your application is ready to run.
echo ====================================================================
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd backend
echo    python app.py
echo.
echo 2. Start Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
pause
