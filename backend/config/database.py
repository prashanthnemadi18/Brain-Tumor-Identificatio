from pymongo import MongoClient
from config.config import Config

class Database:
    """MongoDB Database Handler"""
    
    client = None
    db = None
    
    @staticmethod
    def initialize():
        """Initialize database connection"""
        Database.client = MongoClient(Config.MONGO_URI)
        Database.db = Database.client[Config.MONGO_DB_NAME]
        
        # Create indexes
        Database.db.users.create_index('email', unique=True)
        Database.db.predictions.create_index('user_id')
        Database.db.predictions.create_index('created_at')
        
    @staticmethod
    def get_collection(collection_name):
        """Get a specific collection"""
        return Database.db[collection_name]
