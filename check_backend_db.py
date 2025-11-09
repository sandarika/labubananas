import sqlite3
import os

db_path = os.path.join('backend', 'test.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]
print(f"Tables in backend/test.db: {tables}")

# Check unions table structure
if 'unions' in tables:
    cursor.execute("PRAGMA table_info(unions)")
    columns = cursor.fetchall()
    print(f"\nUnions table columns:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
else:
    print("\nNo 'unions' table found!")

conn.close()
