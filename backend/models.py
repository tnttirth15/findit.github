from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('Item', backref='owner', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    items = db.relationship('Item', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    item_type = db.Column(db.String(10), nullable=False)  # 'lost' or 'found'
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    date_occurred = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    image_filename = db.Column(db.String(200), nullable=True)
    is_resolved = db.Column(db.Boolean, default=False)
    
    # Foreign keys
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'title': self.title,
            'description': self.description,
            'item_type': self.item_type,
            'date_posted': self.date_posted.isoformat(),
            'date_occurred': self.date_occurred.isoformat(),
            'location': self.location,
            'image_url': f'/api/items/image/{self.image_filename}' if self.image_filename else None,
            'is_resolved': self.is_resolved,
            'category': self.category.to_dict() if self.category else None,
            'user_id': self.user_id
        }