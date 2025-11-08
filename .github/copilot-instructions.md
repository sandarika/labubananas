# Copilot Instructions for Bunch Up

## Project Overview
Bunch Up is a social media platform designed to facilitate union organization and worker communication. Think of it as "Reddit for labor unions" with secure channels for workers and unions to interact.

## Architecture & Components

### Backend Structure
- FastAPI/Flask backend (`/backend`)
  - Routes are modularized in `/backend/routes/`
  - Database models in `/backend/models.py`
  - Pydantic schemas in `/backend/schemas.py`
  - Database configuration in `/backend/db.py`

### Key Features
- Union & Member Communication
- Polls & Voting
- AI Legal Chatbot
- Event Scheduling
- Anonymous Feedback
- Role-Based Access Control

## Development Patterns

### API Route Organization
- Routes are modularized by feature area:
  - `/backend/routes/posts.py` - Post-related endpoints
  - `/backend/routes/unions.py` - Union management
  - `/backend/routes/feedback.py` - Anonymous feedback system

### Security & Privacy Considerations
When contributing:
- All worker-related data must be handled with strict privacy controls
- Anonymous feedback routes must preserve user anonymity
- Role-based access control should be enforced at the API level

### Component Communication
- Frontend ↔️ Backend: REST API with JSON payloads
- Backend ↔️ Database: SQLAlchemy ORM

## Development Setup
1. Set up Python virtual environment
2. Install backend dependencies (requirements.txt)
3. Configure database connection
4. Start development server

## Key Integration Points
- Authentication system
- Database layer
- AI Legal Chatbot service

## Common Tasks
- Adding new API endpoints: Create route in appropriate `/backend/routes/` file
- Defining new data models: Add to `models.py` with SQLAlchemy
- API schema changes: Update corresponding Pydantic models in `schemas.py`