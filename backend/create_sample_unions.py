"""
Sample data script to create example unions for testing.

Run this after the migration to populate the database with sample unions.
"""

import sys
import os

# Add parent directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import SessionLocal, engine
from backend.models import Union, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def create_sample_unions():
    db = SessionLocal()
    
    try:
        # Check if sample unions already exist (check for one of our sample unions)
        existing = db.query(Union).filter(Union.name == "Healthcare Workers United").first()
        if existing:
            print("Sample unions already exist. Skipping...")
            return
        
        sample_unions = [
            {
                "name": "Healthcare Workers United",
                "description": "A union dedicated to advocating for healthcare workers' rights, fair wages, and safe working conditions across hospitals, clinics, and care facilities.",
                "industry": "Healthcare",
                "tags": "nurses, doctors, medical staff, patient care, benefits"
            },
            {
                "name": "Tech Workers Alliance",
                "description": "Fighting for fair compensation, work-life balance, and ethical practices in the technology industry. Open to software engineers, designers, and all tech professionals.",
                "industry": "Technology",
                "tags": "software, engineering, tech, remote work, startup"
            },
            {
                "name": "Educators United",
                "description": "Supporting teachers, professors, and educational staff in their mission to provide quality education while ensuring fair pay and resources.",
                "industry": "Education",
                "tags": "teachers, professors, school, university, education"
            },
            {
                "name": "Service Industry Workers Coalition",
                "description": "Representing restaurant workers, retail employees, and hospitality staff fighting for livable wages, tips protection, and better working conditions.",
                "industry": "Service",
                "tags": "restaurant, retail, hospitality, tips, customer service"
            },
            {
                "name": "Manufacturing Workers Union",
                "description": "Advocating for the rights of factory workers, production staff, and industrial workers. Focus on safety, fair wages, and job security.",
                "industry": "Manufacturing",
                "tags": "factory, production, industrial, safety, blue collar"
            },
            {
                "name": "Transportation & Logistics Workers",
                "description": "Uniting drivers, warehouse workers, and logistics professionals to ensure fair treatment, safe conditions, and competitive compensation.",
                "industry": "Transportation",
                "tags": "drivers, warehouse, delivery, logistics, trucking"
            },
            {
                "name": "Creative Professionals Guild",
                "description": "A union for writers, designers, artists, and other creative professionals seeking fair contracts, intellectual property rights, and sustainable careers.",
                "industry": "Arts & Media",
                "tags": "creative, design, writing, art, freelance"
            },
            {
                "name": "Construction Workers Union",
                "description": "Building a better future for construction workers through advocacy for safety standards, fair wages, and comprehensive benefits.",
                "industry": "Construction",
                "tags": "construction, building, trades, safety, contractors"
            },
            {
                "name": "Financial Services Workers Alliance",
                "description": "Supporting bank employees, financial advisors, and other financial sector workers in achieving fair compensation and ethical work environments.",
                "industry": "Finance",
                "tags": "banking, finance, accounting, investment, financial"
            },
            {
                "name": "Remote Workers Collective",
                "description": "A modern union for remote and hybrid workers across all industries, focusing on work-from-home rights, equipment stipends, and flexible schedules.",
                "industry": "Remote Work",
                "tags": "remote, hybrid, work from home, flexible, digital nomad"
            }
        ]
        
        for union_data in sample_unions:
            union = Union(**union_data)
            db.add(union)
        
        db.commit()
        print(f"✓ Created {len(sample_unions)} sample unions!")
        
        # Display created unions
        print("\nSample unions created:")
        for union in sample_unions:
            print(f"  - {union['name']} ({union['industry']})")
        
    except Exception as e:
        print(f"Error creating sample unions: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating sample unions...")
    create_sample_unions()
    print("\nDone! You can now browse unions in the application.")
