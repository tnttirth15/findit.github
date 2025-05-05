from flask import Blueprint, request, jsonify, session
from models import db, User, Item
from routes.auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify({"users": [user.to_dict() for user in users]}), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'is_admin' in data:
        user.is_admin = bool(data['is_admin'])
    
    db.session.commit()
    
    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    # Prevent self-deletion
    if session.get('user_id') == user_id:
        return jsonify({"error": "Cannot delete yourself"}), 400
        
    user = User.query.get_or_404(user_id)
    
    # Delete user's items first (to handle foreign key constraints)
    items = Item.query.filter_by(user_id=user_id).all()
    for item in items:
        db.session.delete(item)
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"}), 200

@admin_bp.route('/items', methods=['GET'])
@admin_required
def get_all_items():
    items = Item.query.order_by(Item.date_posted.desc()).all()
    return jsonify({"items": [item.to_dict() for item in items]}), 200