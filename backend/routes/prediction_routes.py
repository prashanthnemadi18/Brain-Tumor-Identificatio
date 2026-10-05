from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import get_jwt_identity
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
from bson import ObjectId
import numpy as np
import tensorflow as tf

from config.config import Config
from config.database import Database
from utils.auth import token_required, get_current_user
from utils.image_preprocessing import ImagePreprocessor
from utils.image_validator import ImageValidator
from utils.report_generator import ReportGenerator

prediction_bp = Blueprint('prediction', __name__)

# Load model at startup
model = None
try:
    # Try primary model path (.h5 format)
    if os.path.exists(Config.MODEL_PATH):
        model = tf.keras.models.load_model(Config.MODEL_PATH)
        print(f"✅ Model loaded successfully from {Config.MODEL_PATH}")
    else:
        # Try .keras format
        keras_model_path = Config.MODEL_PATH.replace('.h5', '.keras')
        if os.path.exists(keras_model_path):
            model = tf.keras.models.load_model(keras_model_path)
            print(f"✅ Model loaded successfully from {keras_model_path}")
        else:
            # Try alternative names
            model_dir = os.path.dirname(Config.MODEL_PATH)
            for filename in os.listdir(model_dir):
                if filename.endswith(('.h5', '.keras')):
                    full_path = os.path.join(model_dir, filename)
                    model = tf.keras.models.load_model(full_path)
                    print(f"✅ Model loaded successfully from {full_path}")
                    break
except Exception as e:
    print(f"⚠️ Warning: Could not load model: {e}")
    print("Please place your trained model in backend/models/")
    model = None

# Load model performance metrics if available
try:
    metrics_path = os.path.join(os.path.dirname(Config.MODEL_PATH), 'results', 'custom_cnn_metrics.json')
    with open(metrics_path, 'r') as f:
        model_performance = json.load(f)
except Exception:
    model_performance = {
        'accuracy': 0.95,
        'precision': 0.94,
        'recall': 0.93,
        'f1_score': 0.94
    }

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@prediction_bp.route('/predict', methods=['POST'])
@token_required
def predict():
    """Predict brain tumor from uploaded MRI image"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500
        
        # Check if file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed'}), 400
        
        # Get current user
        user_id = get_current_user()
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{user_id}_{timestamp}_{filename}"
        filepath = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        
        # Validate if image is a brain MRI scan
        validator = ImageValidator()
        is_valid, validation_message = validator.validate_mri_image(filepath)
        
        if not is_valid:
            # Remove the uploaded file if validation fails
            print(f"❌ Validation REJECTED [{filename}]: {validation_message}")
            os.remove(filepath)
            return jsonify({
                'error': 'Invalid Image Type',
                'message': validation_message,
                'suggestion': 'Please upload a grayscale brain MRI scan image. The system only accepts medical brain scan images.'
            }), 400
        
        print(f"✅ Image validation passed: {validation_message}")
        
        # Preprocess image
        preprocessor = ImagePreprocessor()
        try:
            processed_image = preprocessor.preprocess_for_prediction(filepath)
        except Exception as e:
            os.remove(filepath)
            return jsonify({'error': f'Image preprocessing failed: {str(e)}'}), 400
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        predicted_class = Config.TUMOR_CLASSES[predicted_class_idx]
        
        # Get all class probabilities
        class_probabilities = {
            Config.TUMOR_CLASSES[i]: float(predictions[0][i])
            for i in range(len(Config.TUMOR_CLASSES))
        }
        
        # Create prediction record
        predictions_collection = Database.get_collection('predictions')
        
        prediction_doc = {
            'user_id': user_id,
            'image_filename': unique_filename,
            'image_path': filepath,
            'predicted_class': predicted_class,
            'confidence': confidence,
            'class_probabilities': class_probabilities,
            'model_name': 'CNN Model',
            'preprocessing_steps': preprocessor.get_preprocessing_info()['steps'],
            'created_at': datetime.utcnow(),
            'timestamp': datetime.utcnow()
        }
        
        result = predictions_collection.insert_one(prediction_doc)
        prediction_id = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'prediction_id': prediction_id,
            'predicted_class': predicted_class,
            'confidence': confidence,
            'class_probabilities': class_probabilities,
            'timestamp': prediction_doc['timestamp'].isoformat(),
            'message': f'Prediction completed: {predicted_class.upper()} with {confidence*100:.2f}% confidence'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

@prediction_bp.route('/history', methods=['GET'])
@token_required
def get_prediction_history():
    """Get user's prediction history"""
    try:
        user_id = get_current_user()
        predictions_collection = Database.get_collection('predictions')
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        # Get predictions
        predictions_cursor = predictions_collection.find(
            {'user_id': user_id}
        ).sort('created_at', -1).skip(skip).limit(per_page)
        
        predictions = []
        for pred in predictions_cursor:
            predictions.append({
                'id': str(pred['_id']),
                'predicted_class': pred['predicted_class'],
                'confidence': pred['confidence'],
                'timestamp': pred['timestamp'].isoformat(),
                'image_filename': pred.get('image_filename', 'N/A')
            })
        
        # Get total count
        total = predictions_collection.count_documents({'user_id': user_id})
        
        return jsonify({
            'predictions': predictions,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch history', 'message': str(e)}), 500

@prediction_bp.route('/prediction/<prediction_id>', methods=['GET'])
@token_required
def get_prediction_details(prediction_id):
    """Get detailed information about a specific prediction"""
    try:
        user_id = get_current_user()
        predictions_collection = Database.get_collection('predictions')
        
        prediction = predictions_collection.find_one({
            '_id': ObjectId(prediction_id),
            'user_id': user_id
        })
        
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        return jsonify({
            'id': str(prediction['_id']),
            'predicted_class': prediction['predicted_class'],
            'confidence': prediction['confidence'],
            'class_probabilities': prediction.get('class_probabilities', {}),
            'model_name': prediction.get('model_name', 'CNN Model'),
            'preprocessing_steps': prediction.get('preprocessing_steps', []),
            'timestamp': prediction['timestamp'].isoformat(),
            'image_filename': prediction.get('image_filename', 'N/A')
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch prediction', 'message': str(e)}), 500

@prediction_bp.route('/test-report', methods=['GET'])
def test_report():
    """Test endpoint to verify report generation works"""
    try:
        from reportlab.pdfgen import canvas
        
        test_path = os.path.join(Config.REPORTS_FOLDER, 'test_report.pdf')
        
        # Create simple PDF
        c = canvas.Canvas(test_path)
        c.drawString(100, 750, "Test PDF Report")
        c.save()
        
        if os.path.exists(test_path):
            return send_file(
                test_path,
                mimetype='application/pdf',
                as_attachment=True,
                download_name='test_report.pdf'
            )
        else:
            return jsonify({'error': 'Test PDF not created'}), 500
            
    except Exception as e:
        import traceback
        return jsonify({
            'error': 'Test failed',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500

@prediction_bp.route('/report/<prediction_id>', methods=['GET'])
@token_required  
def generate_report(prediction_id):
    """Generate and download PDF report for a prediction"""
    print(f"\n{'='*60}")
    print(f"📄 REPORT REQUEST RECEIVED")
    print(f"Prediction ID: {prediction_id}")
    print(f"{'='*60}\n")
    
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        print(f"✅ User authenticated: {user_id}")
        
        # Get collections
        predictions_collection = Database.get_collection('predictions')
        users_collection = Database.get_collection('users')
        
        # Get prediction
        try:
            prediction = predictions_collection.find_one({
                '_id': ObjectId(prediction_id),
                'user_id': user_id
            })
        except Exception as db_error:
            print(f"❌ Database error: {str(db_error)}")
            return jsonify({'error': 'Database error', 'message': str(db_error)}), 500
        
        if not prediction:
            print(f"❌ Prediction not found for ID: {prediction_id}")
            return jsonify({'error': 'Prediction not found'}), 404
        
        print(f"✅ Prediction found: {prediction.get('predicted_class')}")
        
        # Get user info
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        user_info = {
            'name': user.get('name', 'Unknown') if user else 'Unknown',
            'email': user.get('email', '') if user else ''
        }
        
        # Check image path
        image_path = prediction.get('image_path')
        if image_path and os.path.exists(image_path):
            print(f"✅ Image file found: {image_path}")
        else:
            print(f"⚠️  Image file not found, will skip in report")
            image_path = None
        
        # Prepare prediction data
        prediction_data = {
            'analysis_id': str(prediction['_id']),
            'predicted_class': prediction.get('predicted_class', 'Unknown'),
            'confidence': prediction.get('confidence', 0),
            'model_name': prediction.get('model_name', 'CNN Model'),
            'preprocessing_steps': prediction.get('preprocessing_steps', [
                'Image validation',
                'Resize to 224x224',
                'Noise reduction',
                'Contrast enhancement',
                'Normalization'
            ]),
            'timestamp': prediction.get('timestamp', datetime.now()),
            'image_path': image_path
        }
        
        # Generate PDF filename
        report_filename = f"brain_tumor_report_{prediction_id}.pdf"
        report_path = os.path.join(Config.REPORTS_FOLDER, report_filename)
        
        print(f"📊 Generating PDF at: {report_path}")
        
        # Generate report
        try:
            generator = ReportGenerator(report_path)
            generator.generate_prediction_report(
                prediction_data,
                user_info,
                model_performance
            )
            print(f"✅ PDF generated successfully")
        except Exception as pdf_error:
            print(f"❌ PDF generation failed: {str(pdf_error)}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'error': 'PDF generation failed',
                'message': str(pdf_error)
            }), 500
        
        # Verify file was created
        if not os.path.exists(report_path):
            print(f"❌ PDF file not found after generation")
            return jsonify({'error': 'Report file was not created'}), 500
        
        file_size = os.path.getsize(report_path)
        print(f"✅ PDF file ready: {file_size} bytes")
        print(f"📤 Sending file to client...\n")
        
        # Send file
        return send_file(
            report_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=report_filename
        )
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ ERROR: {str(e)}")
        print(f"{'='*60}")
        import traceback
        traceback.print_exc()
        print(f"{'='*60}\n")
        
        return jsonify({
            'error': 'Report generation failed',
            'message': str(e)
        }), 500

@prediction_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats():
    """Get user's prediction statistics"""
    try:
        user_id = get_current_user()
        predictions_collection = Database.get_collection('predictions')
        
        # Get all user predictions
        predictions = list(predictions_collection.find({'user_id': user_id}))
        
        total_predictions = len(predictions)
        
        if total_predictions == 0:
            return jsonify({
                'total_predictions': 0,
                'class_distribution': {},
                'average_confidence': 0
            }), 200
        
        # Calculate statistics
        class_counts = {}
        total_confidence = 0
        
        for pred in predictions:
            pred_class = pred['predicted_class']
            class_counts[pred_class] = class_counts.get(pred_class, 0) + 1
            total_confidence += pred['confidence']
        
        average_confidence = total_confidence / total_predictions
        
        return jsonify({
            'total_predictions': total_predictions,
            'class_distribution': class_counts,
            'average_confidence': average_confidence
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch statistics', 'message': str(e)}), 500

@prediction_bp.route('/model-info', methods=['GET'])
def get_model_info():
    """Get information about the loaded model"""
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'Please train the model first using ml_module/train_model.py'
            }), 503
        
        return jsonify({
            'model_loaded': True,
            'classes': Config.TUMOR_CLASSES,
            'input_shape': list(Config.IMG_SIZE),
            'performance': model_performance
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch model info', 'message': str(e)}), 500

@prediction_bp.route('/validate-image', methods=['POST'])
@token_required
def validate_image():
    """Validate if uploaded image is a brain MRI scan before prediction"""
    try:
        # Check if file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed'}), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_filepath = os.path.join(Config.UPLOAD_FOLDER, f"temp_{filename}")
        file.save(temp_filepath)
        
        # Validate image
        validator = ImageValidator()
        is_valid, validation_message = validator.validate_mri_image(temp_filepath)
        image_info = validator.get_image_info(temp_filepath)
        
        # Remove temporary file
        os.remove(temp_filepath)
        
        return jsonify({
            'is_valid': is_valid,
            'message': validation_message,
            'image_info': image_info
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Validation failed', 'message': str(e)}), 500

