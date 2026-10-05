@echo off
echo ====================================================================
echo Brain Tumor Detection - Model Training
echo ====================================================================
echo.
echo This will train the CNN model on your dataset.
echo Training may take 1-3 hours on CPU (20-40 minutes with GPU).
echo.
echo Press Ctrl+C to stop training at any time.
echo The best model will be automatically saved.
echo.
echo Starting training in 5 seconds...
timeout /t 5
echo.
echo ====================================================================
echo Training Started - DO NOT CLOSE THIS WINDOW
echo ====================================================================
echo.

cd /d "c:\Prashanth_N Projects\Brain Tumor Identification\ml_module"
python train_model.py

echo.
echo ====================================================================
echo Training Complete!
echo ====================================================================
echo.
echo Model saved to: backend\models\brain_tumor_cnn_model.h5
echo Results saved to: backend\models\results\
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& python app.py
echo 2. Start frontend: cd frontend ^&^& npm start
echo.
pause
