"""
MongoDB Connection Test Script
Run this to verify MongoDB is properly set up and accessible
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import sys

def test_mongodb_connection():
    """Test MongoDB connection and setup"""
    
    print("="*60)
    print("MongoDB Connection Test")
    print("="*60)
    
    # Connection string
    mongo_uri = 'mongodb://localhost:27017/'
    db_name = 'brain_tumor_db'
    
    print(f"\n1. Attempting to connect to: {mongo_uri}")
    
    try:
        # Create client with timeout
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        print("   Testing connection...")
        client.admin.command('ping')
        print("   ✅ MongoDB connection successful!")
        
        # Get server info
        server_info = client.server_info()
        print(f"\n2. MongoDB Server Information:")
        print(f"   Version: {server_info['version']}")
        print(f"   Max BSON Size: {server_info['maxBsonObjectSize']} bytes")
        
        # List databases
        print(f"\n3. Available Databases:")
        db_list = client.list_database_names()
        if db_list:
            for db in db_list:
                print(f"   - {db}")
        else:
            print("   (No databases yet)")
        
        # Access our database
        db = client[db_name]
        print(f"\n4. Accessing '{db_name}' database:")
        print(f"   ✅ Database ready!")
        
        # List collections
        collections = db.list_collection_names()
        print(f"\n5. Collections in '{db_name}':")
        if collections:
            for collection in collections:
                count = db[collection].count_documents({})
                print(f"   - {collection} ({count} documents)")
        else:
            print("   (No collections yet - will be created automatically)")
        
        # Test write operation
        print(f"\n6. Testing write operation...")
        test_collection = db['test_connection']
        result = test_collection.insert_one({'test': 'connection', 'status': 'success'})
        print(f"   ✅ Write successful! Document ID: {result.inserted_id}")
        
        # Test read operation
        print(f"\n7. Testing read operation...")
        document = test_collection.find_one({'test': 'connection'})
        print(f"   ✅ Read successful! Document: {document}")
        
        # Clean up test data
        test_collection.delete_one({'test': 'connection'})
        print(f"\n8. Cleanup: Test document removed")
        
        # Create indexes for our application
        print(f"\n9. Creating application indexes...")
        
        # Users collection indexes
        users_collection = db['users']
        users_collection.create_index('email', unique=True)
        print(f"   ✅ Created unique index on users.email")
        
        # Predictions collection indexes
        predictions_collection = db['predictions']
        predictions_collection.create_index('user_id')
        predictions_collection.create_index('created_at')
        print(f"   ✅ Created indexes on predictions collection")
        
        # Display indexes
        print(f"\n10. Database Indexes:")
        for collection_name in ['users', 'predictions']:
            if collection_name in db.list_collection_names():
                indexes = db[collection_name].list_indexes()
                print(f"\n    {collection_name}:")
                for index in indexes:
                    print(f"      - {index['name']}: {index['key']}")
        
        # Close connection
        client.close()
        
        # Final summary
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED!")
        print("="*60)
        print("\nMongoDB is properly configured and ready for the application!")
        print(f"Database '{db_name}' is set up at {mongo_uri}")
        print("\nYou can now run the backend application:")
        print("  python app.py")
        print("="*60)
        
        return True
        
    except ServerSelectionTimeoutError:
        print("\n❌ ERROR: Could not connect to MongoDB server")
        print("\nPossible causes:")
        print("  1. MongoDB service is not running")
        print("  2. MongoDB is not installed")
        print("  3. Firewall is blocking port 27017")
        print("\nSolutions:")
        print("  • Start MongoDB service: net start MongoDB")
        print("  • Install MongoDB: See MONGODB_SETUP.md")
        print("  • Check if port 27017 is in use")
        return False
        
    except ConnectionFailure as e:
        print(f"\n❌ ERROR: Connection failed: {e}")
        return False
        
    except Exception as e:
        print(f"\n❌ ERROR: Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)
