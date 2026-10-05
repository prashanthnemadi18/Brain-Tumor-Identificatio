from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import datetime
from bson import ObjectId
from config.database import Database
from utils.auth import hash_password, verify_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Normalize inputs (avoid stray whitespace breaking future logins)
        data['name'] = data['name'].strip()
        data['email'] = data['email'].strip().lower()
        data['password'] = data['password'].strip()
        
        users_collection = Database.get_collection('users')
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': data['email'].lower()})
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Create user document
        user_doc = {
            'name': data['name'],
            'email': data['email'].lower(),
            'password': hashed_password,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'name': data['name'],
                'email': data['email'].lower()
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json() or {}

        email = (data.get('email') or '').strip().lower()
        password = (data.get('password') or '').strip()

        # Validate required fields
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        users_collection = Database.get_collection('users')
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@auth_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    try:
        users_collection = Database.get_collection('users')
        
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'created_at': user['created_at'].isoformat() if user.get('created_at') else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user', 'message': str(e)}), 500
