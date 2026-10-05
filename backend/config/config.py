import os
from datetime import timedelta

class Config:
    """Application configuration"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'brain_tumor_db')
    
    # Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Model Configuration
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'brain_tumor_cnn_model.h5')
    MODEL_WEIGHTS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'model_weights.h5')
    
    # Image Processing Configuration
    IMG_SIZE = (224, 224)
    
    # Tumor Classes
    TUMOR_CLASSES = ['glioma', 'meningioma', 'notumor', 'pituitary']
    
    # Reports Configuration
    REPORTS_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'reports')
    
    @staticmethod
    def init_app(app):
        """Initialize application folders"""
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.REPORTS_FOLDER, exist_ok=True)
        os.makedirs(os.path.dirname(Config.MODEL_PATH), exist_ok=True)
