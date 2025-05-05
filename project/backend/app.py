from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from models import db, User, Item, Category
import os
from flask_session import Session
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import datetime
from config import Config

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../dist', static_url_path='/')
app.config.from_object(Config)

# Initialize config
Config.init_app(app)

# Setup CORS with specific origins
CORS(app, 
     supports_credentials=True,
     resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
     allow_headers=["Content-Type", "Authorization"])

# Setup database
db.init_app(app)

# Setup bcrypt for password hashing
bcrypt = Bcrypt(app)

# Setup flask-session
Session(app)

# Import routes
from routes.auth import auth_bp
from routes.items import items_bp
from routes.admin import admin_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(items_bp, url_prefix='/api/items')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Initialize database and create default categories
with app.app_context():
    try:
        db.create_all()
        # Create default categories if none exist
        if Category.query.count() == 0:
            default_categories = [
                "Electronics", "Clothing", "Accessories", "Books", 
                "Documents", "Keys", "Pets", "Other"
            ]
            for cat_name in default_categories:
                category = Category(name=cat_name)
                db.session.add(category)
            db.session.commit()
    except Exception as e:
        print(f"Database initialization error: {str(e)}")

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return app.send_static_file(path)
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)