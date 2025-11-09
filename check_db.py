import sqlite3

conn = sqlite3.connect('bunch_up.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]
print(f"Tables in database: {tables}")

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
