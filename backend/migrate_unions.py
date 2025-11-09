"""
Migration script to add union membership and enhanced union features.

This script adds:
1. industry and tags columns to unions table
2. union_members table to track membership
3. union_memberships relationship to users table

Run this after updating the models.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
import os

# Use the same database path as db.py
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "test.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

def run_migration():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Check if we're using SQLite or PostgreSQL
        is_sqlite = DATABASE_URL.startswith("sqlite")
        
        print("Starting migration...")
        
        # Add industry column to unions table if it doesn't exist
        try:
            if is_sqlite:
                conn.execute(text("ALTER TABLE unions ADD COLUMN industry VARCHAR"))
            else:
                conn.execute(text("ALTER TABLE unions ADD COLUMN industry VARCHAR"))
            conn.commit()
            print("✓ Added industry column to unions table")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("- industry column already exists")
            else:
                print(f"! Error adding industry column: {e}")
        
        # Add tags column to unions table if it doesn't exist
        try:
            if is_sqlite:
                conn.execute(text("ALTER TABLE unions ADD COLUMN tags VARCHAR"))
            else:
                conn.execute(text("ALTER TABLE unions ADD COLUMN tags VARCHAR"))
            conn.commit()
            print("✓ Added tags column to unions table")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("- tags column already exists")
            else:
                print(f"! Error adding tags column: {e}")
        
        # Create union_members table if it doesn't exist
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS union_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    union_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(union_id) REFERENCES unions(id),
                    FOREIGN KEY(user_id) REFERENCES users(id),
                    CONSTRAINT unique_union_member UNIQUE (union_id, user_id)
                )
            """ if is_sqlite else """
                CREATE TABLE IF NOT EXISTS union_members (
                    id SERIAL PRIMARY KEY,
                    union_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(union_id) REFERENCES unions(id),
                    FOREIGN KEY(user_id) REFERENCES users(id),
                    CONSTRAINT unique_union_member UNIQUE (union_id, user_id)
                )
            """))
            conn.commit()
            print("✓ Created union_members table")
        except Exception as e:
            print(f"! Error creating union_members table: {e}")
        
        print("\nMigration completed!")
        print("\nNote: The models.py already includes the relationship definitions.")
        print("You can now restart the FastAPI server to use the new features.")

if __name__ == "__main__":
    run_migration()
