from flask import Blueprint, request, jsonify, session
from models import db, User
from flask_bcrypt import Bcrypt
from functools import wraps

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
            
        user = User.query.get(session['user_id'])
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
            
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({"error": "Missing required fields"}), 400
            
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists"}), 409
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already exists"}), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            is_admin=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Set session
        session['user_id'] = new_user.id
        
        return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({"error": "Registration failed"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ('username', 'password')):
            return jsonify({"error": "Missing username or password"}), 400
        
        # Find user
        user = User.query.filter_by(username=data['username']).first()
        
        # Verify user and password
        if user and bcrypt.check_password_hash(user.password, data['password']):
            session['user_id'] = user.id
            return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
        
        return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.pop('user_id', None)
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({"error": "Logout failed"}), 500

@auth_bp.route('/current-user', methods=['GET'])
@login_required
def current_user():
    try:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({"user": user.to_dict()}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Current user error: {str(e)}")
        return jsonify({"error": "Failed to fetch user data"}), 500

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    try:
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                return jsonify({"authenticated": True, "user": user.to_dict()}), 200
        return jsonify({"authenticated": False}), 200
    except Exception as e:
        print(f"Auth check error: {str(e)}")
        return jsonify({"error": "Authentication check failed"}), 500