from flask import Blueprint, request, jsonify, session, current_app, send_from_directory
from models import db, Item, Category, User
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
from routes.auth import login_required
import imghdr

items_bp = Blueprint('items', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@items_bp.route('/', methods=['GET'])
def get_items():
    try:
        item_type = request.args.get('type')
        category_id = request.args.get('category')
        search = request.args.get('search')
        
        query = Item.query
        
        if item_type:
            query = query.filter_by(item_type=item_type)
            
        if category_id:
            query = query.filter_by(category_id=category_id)
            
        if search:
            query = query.filter(
                (Item.title.ilike(f'%{search}%')) | 
                (Item.description.ilike(f'%{search}%')) |
                (Item.location.ilike(f'%{search}%'))
            )
        
        # Get the most recent items first
        items = query.order_by(Item.date_posted.desc()).all()
        
        return jsonify({"items": [item.to_dict() for item in items]}), 200
    except Exception as e:
        print(f"Error in get_items: {str(e)}")
        return jsonify({"error": "Failed to fetch items"}), 500

@items_bp.route('/mine', methods=['GET'])
@login_required
def get_my_items():
    try:
        user_id = session.get('user_id')
        items = Item.query.filter_by(user_id=user_id).order_by(Item.date_posted.desc()).all()
        
        return jsonify({"items": [item.to_dict() for item in items]}), 200
    except Exception as e:
        print(f"Error in get_my_items: {str(e)}")
        return jsonify({"error": "Failed to fetch your items"}), 500

@items_bp.route('/<int:item_id>', methods=['GET'])
def get_item(item_id):
    try:
        item = Item.query.get_or_404(item_id)
        return jsonify({"item": item.to_dict()}), 200
    except Exception as e:
        print(f"Error in get_item: {str(e)}")
        return jsonify({"error": "Failed to fetch item"}), 500

@items_bp.route('/', methods=['POST'])
@login_required
def create_item():
    try:
        user_id = session.get('user_id')
        
        # Check if form data or JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Form data with file upload
            data = request.form
            image_file = request.files.get('image')
        else:
            # JSON data
            data = request.get_json()
            image_file = None
        
        # Validate required fields
        required_fields = ['title', 'description', 'item_type', 'category_id', 'date_occurred', 'location']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Validate item type
        if data['item_type'] not in ['lost', 'found']:
            return jsonify({"error": "Item type must be 'lost' or 'found'"}), 400
        
        # Parse date
        try:
            date_occurred = datetime.fromisoformat(data['date_occurred'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
        
        # Create new item
        new_item = Item(
            title=data['title'],
            description=data['description'],
            item_type=data['item_type'],
            category_id=int(data['category_id']),
            date_occurred=date_occurred,
            location=data['location'],
            user_id=user_id
        )
        
        # Handle image upload
        if image_file and allowed_file(image_file.filename):
            # Generate a unique filename
            filename = secure_filename(image_file.filename)
            ext = filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}.{ext}"
            
            # Save the file
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            image_file.save(file_path)
            
            # Check if the file is actually an image
            if imghdr.what(file_path) is None:
                os.remove(file_path)
                return jsonify({"error": "Uploaded file is not a valid image"}), 400
                
            new_item.image_filename = unique_filename
        
        # Save to database
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({"message": "Item created successfully", "item": new_item.to_dict()}), 201
    except Exception as e:
        print(f"Error in create_item: {str(e)}")
        return jsonify({"error": "Failed to create item"}), 500

@items_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({"categories": [category.to_dict() for category in categories]}), 200
    except Exception as e:
        print(f"Error in get_categories: {str(e)}")
        return jsonify({"error": "Failed to fetch categories"}), 500

@items_bp.route('/image/<filename>', methods=['GET'])
def get_image(filename):
    try:
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print(f"Error in get_image: {str(e)}")
        return jsonify({"error": "Failed to fetch image"}), 500