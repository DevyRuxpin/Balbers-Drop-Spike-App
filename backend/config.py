import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL').replace("postgres://", "postgresql://", 1)  # Fix for Render
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STOCK_API_KEY = os.getenv('STOCK_API_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
