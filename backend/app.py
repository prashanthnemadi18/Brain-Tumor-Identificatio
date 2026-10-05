# Ensure UTF-8 stdout/stderr BEFORE any route modules import.
# Windows default cp1252 cannot encode emoji characters like ✅/⚠️ used in
# startup logs, which would otherwise crash module import at Flask boot.
import sys
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from config.config import Config
from config.database import Database
from routes.auth_routes import auth_bp
from routes.prediction_routes import prediction_bp
from routes.chatbot_routes import chatbot_bp

def create_app():
    """Application factory"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize database
    Database.initialize()

    # Initialize app folders
    Config.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Brain Tumor Detection API',
            'version': '1.0.0',
            'status': 'running'
        })
    
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    return app

if __name__ == '__main__':
    from datetime import datetime
    
    app = create_app()
    
    print("\n" + "="*60)
    print("Brain Tumor Detection API Server")
    print("="*60)
    print(f"Server starting at: http://localhost:5000")
    print(f"API Documentation: http://localhost:5000/api")
    print("="*60 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=Config.DEBUG,
        # The werkzeug stat-reloader watches every loaded .py file, which
        # includes ~4000 TensorFlow modules. It triggers spurious restarts
        # that crash mid-request with WinError 10038 (invalid socket). Keep
        # debug=True for the interactive exception page, but disable the
        # file watcher. Restart the process manually after backend edits.
        use_reloader=False
    )
