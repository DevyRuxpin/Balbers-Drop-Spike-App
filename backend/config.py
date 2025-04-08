import os
import re

class Config:
    # Fix for Render's PostgreSQL + HTTPS confusion
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        uri = os.getenv('DATABASE_URL', 'sqlite:///default.db')
        if uri.startswith('postgres://'):
            uri = uri.replace('postgres://', 'postgresql+psycopg2://', 1)
        # Handle any accidental HTTPS prefixes
        if uri.startswith('https://'):
            uri = re.sub(r'^https://', 'postgresql+psycopg2://', uri)
        return uri
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STOCK_API_KEY = os.getenv('STOCK_API_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
