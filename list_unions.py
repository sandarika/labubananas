import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.db import SessionLocal
from backend.models import Union

db = SessionLocal()
unions = db.query(Union).all()

if unions:
    print(f"\n✓ Found {len(unions)} union(s) in database:\n")
    for union in unions:
        print(f"  • {union.name}")
        if union.industry:
            print(f"    Industry: {union.industry}")
        if union.tags:
            print(f"    Tags: {union.tags}")
        print()
else:
    print("No unions found in database")

db.close()
