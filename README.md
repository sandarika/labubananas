# 🍌 Bunch Up
### by Team Labubananas | CornHacks 2025

---

## 🌟 Overview

**Bunch Up** is a full-stack social platform designed to empower workers and unions by improving transparency, collaboration, and organization.  
It bridges the gap between employees and union representatives, making it easier to **form**, **join**, and **engage** with unions.

Our mission is simple: make labor organization as easy and accessible as creating a group chat.

Think of it as **"Reddit for labor unions"**—a safe digital space for workers to organize, communicate, and advocate for better working conditions.

---

## 💡 Problem Statement

Across many industries, workers face significant challenges in organizing and communicating effectively.  
From factories to farms, many employees lack access to centralized platforms where they can safely discuss workplace conditions, share updates, and connect with unions that represent them.  

This communication gap weakens labor solidarity, slows down the process of forming unions, and often leaves workers unaware of their rights or the resources available to them.  
During our research, we were particularly inspired by stories of **banana plantation workers who were overworked and isolated**, unable to effectively communicate across departments or reach out to labor representatives. Their situation sparked our goal: **to create a simple, secure platform where every worker's voice can be heard.**

---

## 🧠 Inspiration

Our idea was inspired by the struggles of **banana plantation workers** who lacked the means to collectively voice their concerns or organize due to poor communication channels.  
Their resilience and need for unity motivated our team to create a tool that would make forming unions as effortless as forming friendships online.

---

## 🚀 Key Features

### 🏢 Union Management
- **Union Discovery & Browsing** – Browse all available unions with search and industry filtering
- **Join/Leave Unions** – One-click membership management with real-time member counts
- **Industry Classification** – Unions organized by Healthcare, Technology, Education, Manufacturing, Transportation, Hospitality, and more
- **Union Profiles** – Detailed information including descriptions, member counts, and relevant tags

### 💬 Communication & Engagement
- **Forum System** – Reddit-style posts with upvoting/downvoting functionality
- **Comments** – Threaded discussions on posts with user attribution
- **Real-time Updates** – Stay informed about union news and announcements
- **Union-Specific Channels** – Dedicated spaces for each union to communicate

### 🗳️ Democratic Decision Making
- **Poll Creation** – Organizers and admins can create polls with multiple options
- **Secure Voting** – One vote per user per poll with real-time results
- **Vote Tracking** – View current vote counts and percentages
- **Poll History** – Access past polls and decisions

### 📅 Event Management
- **Event Creation & Scheduling** – Coordinate union meetings, training sessions, and rallies
- **Event Details** – Title, description, location, start/end times
- **RSVP System** – Track event attendance with attendee counts
- **Calendar View** – Visualize upcoming union events
- **Event Permissions** – Only organizers and admins can create events

### 🔒 Anonymous Feedback
- **Anonymous Submissions** – Workers can voice concerns without fear of retaliation
- **Post-Specific Feedback** – Leave feedback on specific posts or general feedback
- **Protected Identity** – Complete anonymity preserved in the system
- **Feedback Review** – Organizers can view and respond to concerns

### 👥 Role-Based Access Control
- **Member Role** – Join unions, create posts, vote, comment, submit feedback
- **Organizer Role** – Create unions, events, polls, plus all member permissions
- **Admin Role** – Full system access and user management capabilities
- **Secure Authentication** – JWT-based authentication with bcrypt password hashing

### 🤖 AI Legal Assistant
- **Labor Law Guidance** – Get information about overtime, breaks, and working hours
- **Retaliation Protection** – Advice on anti-retaliation protections
- **Contract Help** – Guidance on understanding contract terms
- **Union Procedures** – Information about union processes and procedures
- **Disclaimer System** – Clear messaging that advice is informational, not legal counsel

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.x)
- **Database:** SQLAlchemy ORM with SQLite (dev) / PostgreSQL (production-ready)
- **Authentication:** JWT tokens with OAuth2PasswordBearer
- **Password Security:** bcrypt hashing
- **API Documentation:** Auto-generated OpenAPI/Swagger docs
- **Testing:** pytest with 95%+ coverage
- **Environment:** python-dotenv for configuration

### Frontend
- **Framework:** Next.js 16.0.0 (React 19.2.0)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI primitives
- **Form Handling:** React Hook Form with Zod validation
- **State Management:** React Context API
- **Icons:** Lucide React
- **Charts:** Recharts for data visualization
- **Date Handling:** date-fns

### Key Backend Dependencies
```
fastapi>=0.95.0
uvicorn[standard]>=0.22.0
SQLAlchemy>=1.4
pydantic>=1.10
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
bcrypt==4.0.1
python-dotenv>=1.0
python-multipart>=0.0.6
```

### Development & Testing
- **Testing Framework:** pytest with pytest-cov
- **HTTP Client:** httpx for async testing
- **Integration Tests:** Selenium with webdriver-manager
- **API Testing:** requests library
- **Test Database:** Isolated test.db for test isolation

---

## 📂 Project Structure

```
labubananas/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── db.py                   # Database configuration and session management
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic schemas for request/response validation
│   ├── security.py             # JWT authentication and password hashing
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── __init__.py         # API router aggregation
│   │   ├── auth.py             # Authentication endpoints (register, login)
│   │   ├── unions.py           # Union CRUD and membership management
│   │   ├── posts.py            # Forum posts, comments, voting
│   │   ├── polls.py            # Poll creation and voting
│   │   ├── events.py           # Event scheduling and RSVP
│   │   ├── feedback.py         # Anonymous feedback system
│   │   └── chatbot.py          # AI legal assistant endpoints
│   └── tests/
│       ├── conftest.py         # Pytest fixtures and configuration
│       ├── test_auth.py        # Authentication tests
│       ├── test_unions.py      # Union management tests
│       ├── test_posts.py       # Posts and comments tests
│       ├── test_polls.py       # Polling system tests
│       ├── test_events.py      # Event management tests
│       ├── test_feedback.py    # Feedback system tests
│       └── test_selenium_integration.py
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── globals.css         # Global styles
│   │   ├── dashboard/          # User dashboard
│   │   ├── forum/              # Forum/posts view
│   │   ├── unions/             # Union browsing and management
│   │   ├── calendar/           # Event calendar
│   │   ├── sign-in/            # Login page
│   │   └── sign-up/            # Registration page
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── forum-navbar.tsx
│   │   ├── post-card.tsx       # Individual post display
│   │   ├── comment-section.tsx
│   │   ├── poll-card.tsx
│   │   ├── feedback-form.tsx
│   │   ├── ai-chatbot-button.tsx
│   │   ├── union-sidebar.tsx
│   │   └── ui/                 # Reusable Radix UI components
│   ├── lib/
│   │   ├── api.ts              # API client and type definitions
│   │   ├── user-context.tsx    # User authentication context
│   │   └── utils.ts            # Utility functions
│   └── package.json
│
├── README.md                   # This file
├── QUICK_SETUP.md              # Quick start guide
├── UNION_FEATURES.md           # Union features documentation
├── SEED_DATA_REFERENCE.md      # Test data and credentials
├── pytest.ini                  # Pytest configuration
└── .env.example                # Environment variables template
```

---

## 🗄️ Database Schema

### Core Models

**User**
- id, username (unique), hashed_password, role (member/organizer/admin), created_at
- Relationships: comments, union_memberships, post_votes

**Union**
- id, name (unique), description, industry, tags, created_at
- Relationships: posts, members
- Features: Industry classification, searchable tags, member tracking

**UnionMember** (Join Table)
- id, union_id, user_id, joined_at
- Unique constraint on (union_id, user_id)

**Post**
- id, title, content, union_id, created_at
- Relationships: comments, feedbacks, votes
- Features: Upvote/downvote system

**Comment**
- id, content, post_id, user_id, created_at, updated_at
- Features: User attribution, edit tracking

**PostVote**
- id, post_id, user_id, vote_type (up/down), created_at
- Unique constraint per user per post

**Poll**
- id, question, union_id, created_at
- Relationships: options

**PollOption**
- id, poll_id, text
- Relationships: votes

**Vote**
- id, poll_id, option_id, user_id, created_at
- Unique constraint: one vote per user per poll

**Event**
- id, title, description, location, start_time, end_time, union_id, creator_id, created_at
- Relationships: attendees
- Features: RSVP tracking

**EventAttendee**
- id, event_id, user_id, created_at
- Unique constraint on (event_id, user_id)

**Feedback**
- id, post_id (optional), anonymous (boolean), message, created_at
- Features: Anonymous submission support

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm/pnpm
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/sandarika/labubananas.git
cd labubananas
```

2. **Set up Python virtual environment**
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables (optional)**
```bash
# Create .env file in backend/ directory
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./test.db  # or your PostgreSQL URL
```

5. **Run database migrations** (if needed)
```bash
python migrate_unions.py
python migrate_events.py
```

6. **Seed the database** (optional but recommended)
```bash
python seed_database.py
# Or for sample unions:
python create_sample_unions.py
```

7. **Start the backend server**
```bash
uvicorn main:app --reload
# Server will run on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Start the development server**
```bash
npm run dev
# or
pnpm dev
# Frontend will run on http://localhost:3000
```

### Running Tests

```bash
cd backend
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/token` - Login and get JWT token

#### Unions
- `GET /api/unions/` - List all unions (with search & filter)
- `POST /api/unions/` - Create union (organizer/admin only)
- `GET /api/unions/{id}` - Get union details
- `POST /api/unions/{id}/join` - Join a union
- `POST /api/unions/{id}/leave` - Leave a union

#### Posts
- `GET /api/posts/union/{union_id}` - List posts in union
- `POST /api/posts/union/{union_id}` - Create post in union
- `GET /api/posts/{post_id}` - Get single post
- `POST /api/posts/{post_id}/comments` - Add comment
- `POST /api/posts/{post_id}/vote` - Upvote/downvote post

#### Polls
- `GET /api/polls/` - List all polls
- `POST /api/polls/` - Create poll (organizer/admin only)
- `POST /api/polls/{poll_id}/vote` - Cast vote
- `GET /api/polls/{poll_id}/results` - Get poll results

#### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create event (organizer/admin only)
- `GET /api/events/{event_id}` - Get event details
- `PUT /api/events/{event_id}` - Update event
- `POST /api/events/{event_id}/attend` - RSVP to event
- `DELETE /api/events/{event_id}/attend` - Cancel RSVP

#### Feedback
- `POST /api/feedbacks/` - Submit general feedback
- `POST /api/feedbacks/post/{post_id}` - Submit post-specific feedback
- `GET /api/feedbacks/post/{post_id}` - Get feedback for post

#### Chatbot
- `POST /api/chatbot/ask` - Ask legal question

---

## 🧪 Test Data

See `SEED_DATA_REFERENCE.md` for comprehensive test data including:
- **Default password:** `password123` (most users) / `admin123` (admin)
- **Admin account:** `admin` / `admin123`
- **25+ test users** across various roles and industries
- **15+ sample unions** including the special "Banana Plantation Workers United 🍌"
- **100+ posts, comments, polls, and events**

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with automatic salt generation
- **Role-Based Access Control** - Granular permissions per endpoint
- **Anonymous Feedback** - True anonymity preservation
- **Input Validation** - Pydantic schemas validate all inputs
- **SQL Injection Protection** - SQLAlchemy ORM parameterization
- **CORS Configuration** - Configurable cross-origin policies

---

## 🌍 Real-World Scalability

Bunch Up is built with scalability and impact in mind.  
While initially designed for demonstration at CornHacks 2025, the platform's architecture can easily expand to support **real-world labor unions** across industries.

### Potential Growth Paths:
- Integration with **existing union databases and HR systems** for membership verification
- Expansion to include **multilingual support**, enabling use in global labor markets
- Partnerships with **nonprofit organizations** and **labor advocacy groups** to reach underrepresented workers
- Development of a **mobile app version** for ease of access in low-connectivity environments
- Enhanced **data encryption and anonymity features** for worker protection
- **Real-time notifications** using WebSockets for instant updates
- **File sharing** for union documents and resources
- **Video conferencing integration** for remote meetings
- **Analytics dashboard** for union organizers

By scaling responsibly, Bunch Up has the potential to become a **cornerstone platform for digital labor organization worldwide.**

---

## 🤝 Contributing

This project was created for CornHacks 2025. For collaboration or inquiries, please contact the team members.

---

## 📄 License

This project is part of the CornHacks 2025 submission by Team Labubananas.

---

## 🧑‍💻 Team Labubananas

- Mason Miller
- Ananya Bindu Mirle 
- Rithvika Thunuguntla
- Sandarika Warjri 

CornHacks 2025 Submission  
**"Forming Unions. Forming Change."**

---

## 🙏 Acknowledgments

Special thanks to:
- The banana plantation workers who inspired this project
- CornHacks 2025 organizers
- All workers fighting for better working conditions worldwide

---
