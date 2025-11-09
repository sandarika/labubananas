"""
Migration script to add location, creator_id, and attendees table to events.
Run this once to update the database schema.

Note: For SQLite, column additions are limited. This script handles schema updates.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.db import engine, Base, get_db
from backend import models
from sqlalchemy import text, inspect

def migrate():
    print("Starting database migration...")
    
    # Create all tables (this will create new tables but won't modify existing ones)
    Base.metadata.create_all(bind=engine)
    print("✓ Created new tables")
    
    # Check what needs to be added
    inspector = inspect(engine)
    events_columns = [col['name'] for col in inspector.get_columns('events')]
    
    db = next(get_db())
    try:
        # Add location column if it doesn't exist
        if 'location' not in events_columns:
            print("Adding location column...")
            db.execute(text("ALTER TABLE events ADD COLUMN location VARCHAR"))
            db.commit()
            print("✓ Added location column")
        else:
            print("✓ Location column already exists")
        
        # Add creator_id column if it doesn't exist
        if 'creator_id' not in events_columns:
            print("Adding creator_id column...")
            db.execute(text("ALTER TABLE events ADD COLUMN creator_id INTEGER"))
            db.commit()
            
            # Set default creator for existing events
            result = db.execute(text("""
                SELECT id FROM users 
                WHERE role IN ('admin', 'organizer') 
                ORDER BY created_at ASC 
                LIMIT 1
            """))
            default_creator = result.fetchone()
            
            if default_creator:
                db.execute(text(f"UPDATE events SET creator_id = {default_creator[0]} WHERE creator_id IS NULL"))
                db.commit()
                print(f"✓ Added creator_id column and set default to user {default_creator[0]}")
            else:
                print("⚠ Added creator_id column but no admin/organizer found for default")
        else:
            print("✓ creator_id column already exists")
        
        print("\n✅ Migration completed successfully!")
        print("Note: Restart your backend server to use the new schema.")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
