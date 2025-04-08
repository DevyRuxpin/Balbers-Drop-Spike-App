from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Your original URI fix (preserved)
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
    
    # Added explicit app context
    with app.app_context():
        db.init_app(app)
        jwt.init_app(app)
        CORS(app)
        
        # Your original blueprints
        app.register_blueprint(main_bp)
        app.register_blueprint(auth_bp)
        
        # New for Render: ensures tables exist
        db.create_all()
    
    return app

