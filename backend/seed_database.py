"""
Seed the database with fake data for testing and demonstration.

This script creates:
- Multiple users with different roles
- Various unions across different industries
- Posts with comments
- Polls with votes
- Events with attendees
- Anonymous and public feedback
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Add the parent directory to the path so we can import backend modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import SessionLocal, engine, Base
from backend.models import User, Union, Post, Comment, Poll, PollOption, Vote, Event, EventAttendee, Feedback, UnionMember, PostVote
from backend.security import get_password_hash


def clear_database(db):
    """Clear all existing data from the database."""
    print("🗑️  Clearing existing data...")
    db.query(PostVote).delete()
    db.query(Vote).delete()
    db.query(PollOption).delete()
    db.query(Poll).delete()
    db.query(EventAttendee).delete()
    db.query(Event).delete()
    db.query(Feedback).delete()
    db.query(Comment).delete()
    db.query(Post).delete()
    db.query(UnionMember).delete()
    db.query(User).delete()
    db.query(Union).delete()
    db.commit()
    print("✅ Database cleared!")


def create_users(db):
    """Create fake users with different roles."""
    print("\n👥 Creating users...")
    
    users_data = [
        # Admins
        {"username": "admin", "password": "admin123", "role": "admin"},
        
        # Organizers
        {"username": "sarah_organizer", "password": "password123", "role": "organizer"},
        {"username": "mike_organizer", "password": "password123", "role": "organizer"},
        {"username": "jessica_lead", "password": "password123", "role": "organizer"},
        {"username": "carlos_union_lead", "password": "password123", "role": "organizer"},
        {"username": "rachel_organizer", "password": "password123", "role": "organizer"},
        
        # Regular members
        {"username": "john_worker", "password": "password123", "role": "member"},
        {"username": "emma_nurse", "password": "password123", "role": "member"},
        {"username": "david_teacher", "password": "password123", "role": "member"},
        {"username": "lisa_dev", "password": "password123", "role": "member"},
        {"username": "robert_driver", "password": "password123", "role": "member"},
        {"username": "maria_retail", "password": "password123", "role": "member"},
        {"username": "james_factory", "password": "password123", "role": "member"},
        {"username": "sophia_care", "password": "password123", "role": "member"},
        {"username": "william_tech", "password": "password123", "role": "member"},
        {"username": "olivia_education", "password": "password123", "role": "member"},
        {"username": "noah_logistics", "password": "password123", "role": "member"},
        
        # Banana plantation workers
        {"username": "miguel_harvester", "password": "password123", "role": "member"},
        {"username": "ana_packer", "password": "password123", "role": "member"},
        {"username": "juan_supervisor", "password": "password123", "role": "member"},
        {"username": "carmen_quality", "password": "password123", "role": "member"},
        {"username": "diego_transport", "password": "password123", "role": "member"},
        {"username": "isabel_fieldworker", "password": "password123", "role": "member"},
        {"username": "pablo_equipment", "password": "password123", "role": "member"},
        {"username": "lucia_admin", "password": "password123", "role": "member"},
        
        # Additional workers across industries
        {"username": "alex_chef", "password": "password123", "role": "member"},
        {"username": "sam_hospitality", "password": "password123", "role": "member"},
        {"username": "taylor_warehouse", "password": "password123", "role": "member"},
        {"username": "jordan_service", "password": "password123", "role": "member"},
        {"username": "morgan_construction", "password": "password123", "role": "member"},
        {"username": "casey_agriculture", "password": "password123", "role": "member"},
    ]
    
    users = []
    for user_data in users_data:
        user = User(
            username=user_data["username"],
            hashed_password=get_password_hash(user_data["password"]),
            role=user_data["role"]
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    print(f"✅ Created {len(users)} users")
    return users


def create_unions(db):
    """Create fake unions across different industries."""
    print("\n🏢 Creating unions...")
    
    unions_data = [
        {
            "name": "Healthcare Workers United",
            "description": "A union dedicated to improving working conditions, wages, and patient care for healthcare professionals.",
            "industry": "Healthcare",
            "tags": "healthcare,nurses,doctors,medical"
        },
        {
            "name": "Tech Workers Coalition",
            "description": "Organizing tech workers for better compensation, work-life balance, and ethical practices in the technology industry.",
            "industry": "Technology",
            "tags": "tech,software,engineering,it"
        },
        {
            "name": "United Teachers Association",
            "description": "Fighting for fair wages, smaller class sizes, and better resources for educators at all levels.",
            "industry": "Education",
            "tags": "education,teachers,schools,professors"
        },
        {
            "name": "Retail Workers Union",
            "description": "Supporting retail workers in securing fair wages, reasonable schedules, and safe working environments.",
            "industry": "Retail",
            "tags": "retail,sales,customer service,stores"
        },
        {
            "name": "Transportation & Logistics Union",
            "description": "Representing drivers, warehouse workers, and logistics professionals for better pay and working conditions.",
            "industry": "Transportation",
            "tags": "transportation,drivers,logistics,warehouse"
        },
        {
            "name": "Manufacturing Workers Alliance",
            "description": "Advocating for safe working conditions, fair wages, and job security in manufacturing industries.",
            "industry": "Manufacturing",
            "tags": "manufacturing,factory,industrial,production"
        },
        {
            "name": "Banana Plantation Workers United 🍌",
            "description": "Empowering banana plantation workers to fight for fair wages, safe working conditions, and protection from pesticide exposure. We stand together for workers' rights in tropical agriculture.",
            "industry": "Agriculture",
            "tags": "agriculture,bananas,farming,plantation,tropical,harvest"
        },
        {
            "name": "Hospitality Workers Guild",
            "description": "Uniting hotel, restaurant, and tourism workers to secure fair wages, benefits, and dignified working conditions.",
            "industry": "Hospitality",
            "tags": "hospitality,hotels,restaurants,tourism,service"
        },
        {
            "name": "Construction Trades Council",
            "description": "Protecting construction workers' rights with focus on safety standards, fair pay, and apprenticeship programs.",
            "industry": "Construction",
            "tags": "construction,building,trades,labor,safety"
        },
    ]
    
    unions = []
    for union_data in unions_data:
        union = Union(**union_data)
        db.add(union)
        unions.append(union)
    
    db.commit()
    print(f"✅ Created {len(unions)} unions")
    return unions


def assign_union_memberships(db, users, unions):
    """Assign users to various unions."""
    print("\n🤝 Assigning union memberships...")
    
    # Mapping users to unions based on their roles and names
    memberships = [
        # Healthcare Workers United
        (users[7], unions[0]),  # emma_nurse
        (users[13], unions[0]), # sophia_care
        (users[1], unions[0]),  # sarah_organizer
        
        # Tech Workers Coalition
        (users[9], unions[1]),  # lisa_dev
        (users[14], unions[1]), # william_tech
        (users[2], unions[1]),  # mike_organizer
        
        # United Teachers Association
        (users[8], unions[2]),  # david_teacher
        (users[15], unions[2]), # olivia_education
        (users[3], unions[2]),  # jessica_lead
        
        # Retail Workers Union
        (users[11], unions[3]),  # maria_retail
        (users[6], unions[3]),  # john_worker
        
        # Transportation & Logistics Union
        (users[10], unions[4]), # robert_driver
        (users[16], unions[4]), # noah_logistics
        (users[27], unions[4]), # taylor_warehouse
        
        # Manufacturing Workers Alliance
        (users[12], unions[5]), # james_factory
        (users[6], unions[5]),  # john_worker
        
        # Banana Plantation Workers United 🍌
        (users[17], unions[6]), # miguel_harvester
        (users[18], unions[6]), # ana_packer
        (users[19], unions[6]), # juan_supervisor
        (users[20], unions[6]), # carmen_quality
        (users[21], unions[6]), # diego_transport
        (users[22], unions[6]), # isabel_fieldworker
        (users[23], unions[6]), # pablo_equipment
        (users[24], unions[6]), # lucia_admin
        (users[4], unions[6]),  # carlos_union_lead (organizer)
        (users[29], unions[6]), # casey_agriculture
        
        # Hospitality Workers Guild
        (users[25], unions[7]), # alex_chef
        (users[26], unions[7]), # sam_hospitality
        (users[28], unions[7]), # jordan_service
        (users[5], unions[7]),  # rachel_organizer
        
        # Construction Trades Council
        (users[29], unions[8]), # morgan_construction
        (users[6], unions[8]),  # john_worker
        
        # Admin in all unions
        (users[0], unions[0]),
        (users[0], unions[1]),
        (users[0], unions[2]),
        (users[0], unions[3]),
        (users[0], unions[4]),
        (users[0], unions[5]),
        (users[0], unions[6]),
        (users[0], unions[7]),
        (users[0], unions[8]),
    ]
    
    for user, union in memberships:
        membership = UnionMember(user_id=user.id, union_id=union.id)
        db.add(membership)
    
    db.commit()
    print(f"✅ Created {len(memberships)} union memberships")


def create_posts(db, users, unions):
    """Create posts in various unions."""
    print("\n📝 Creating posts...")
    
    posts_data = [
        # Healthcare Workers United posts
        {
            "title": "Petition for Better Nurse-to-Patient Ratios",
            "content": "We're organizing a petition to present to hospital management demanding safer nurse-to-patient ratios. Current staffing levels are unsafe for both patients and staff. Please sign and share!",
            "union": unions[0],
            "author": users[4]  # emma_nurse
        },
        {
            "title": "Victory! Wage Increase Approved",
            "content": "Great news everyone! After months of negotiation, management has approved a 15% wage increase for all healthcare workers. This is a testament to our collective power!",
            "union": unions[0],
            "author": users[1]  # sarah_organizer
        },
        {
            "title": "Meeting Notes: Contract Negotiation Strategy",
            "content": "Here are the notes from our recent strategy meeting. Key points: 1) Focus on healthcare benefits, 2) Push for predictable scheduling, 3) Demand safer working conditions. Next meeting is Thursday at 6 PM.",
            "union": unions[0],
            "author": users[11]  # sophia_care
        },
        
        # Tech Workers Coalition posts
        {
            "title": "Remote Work Rights Under Threat",
            "content": "Management is trying to force a return-to-office mandate. We need to organize and push back. Remote work has proven effective and eliminates commute time. Let's fight for our right to work flexibly!",
            "union": unions[1],
            "author": users[7]  # lisa_dev
        },
        {
            "title": "Overtime Pay Discussion",
            "content": "Many of us are working 50-60 hour weeks without proper compensation. It's time we demand overtime pay or comp time. Share your experiences below.",
            "union": unions[1],
            "author": users[12]  # william_tech
        },
        
        # United Teachers Association posts
        {
            "title": "Classroom Supply Budget Proposal",
            "content": "Teachers shouldn't have to pay out of pocket for classroom supplies. We're drafting a proposal for a $500 annual supply budget per teacher. Please provide feedback!",
            "union": unions[2],
            "author": users[6]  # david_teacher
        },
        {
            "title": "Mental Health Support for Educators",
            "content": "Teaching is stressful, and we need better mental health support. Let's discuss what resources we need: counseling services, stress management workshops, or mental health days?",
            "union": unions[2],
            "author": users[13]  # olivia_education
        },
        
        # Retail Workers Union posts
        {
            "title": "Scheduling Rights: We Deserve Predictability",
            "content": "Tired of getting your schedule just 2 days in advance? We're pushing for 2-week advance notice and restrictions on on-call scheduling. Join the campaign!",
            "union": unions[3],
            "author": users[9]  # maria_retail
        },
        
        # Transportation & Logistics Union posts
        {
            "title": "Safety First: New Equipment Needed",
            "content": "Several delivery trucks are in poor condition and pose safety risks. We need management to invest in proper vehicle maintenance and replacement.",
            "union": unions[4],
            "author": users[8]  # robert_driver
        },
        
        # Manufacturing Workers Alliance posts
        {
            "title": "Heat Safety Concerns in Summer Months",
            "content": "Factory floor temperatures reached 95°F last week. We need better ventilation, AC, and mandatory heat break policies. Worker safety cannot be compromised.",
            "union": unions[5],
            "author": users[12]  # james_factory
        },
        
        # Banana Plantation Workers United posts 🍌
        {
            "title": "🍌 Urgent: Pesticide Safety Equipment Needed",
            "content": "Many workers are experiencing respiratory issues and skin irritation from pesticide exposure. We need proper protective equipment including respirators, gloves, and protective clothing. Management keeps promising but nothing changes. Our health is at risk!",
            "union": unions[6],
            "author": users[17]  # miguel_harvester
        },
        {
            "title": "Victory! Wage Increase Negotiated 🎉",
            "content": "After 6 months of negotiations and standing together, we've secured a 20% wage increase for all plantation workers! This shows what we can achieve through solidarity. Congratulations to everyone who supported this effort!",
            "union": unions[6],
            "author": users[4]  # carlos_union_lead
        },
        {
            "title": "Break Time Policy: We Need Your Input",
            "content": "Currently we get one 30-minute break during 10-hour shifts in the tropical heat. This is insufficient and dangerous. What break schedule would be fair? Let's discuss and present a united proposal.",
            "union": unions[6],
            "author": users[19]  # juan_supervisor
        },
        {
            "title": "Quality Standards Putting Pressure on Workers",
            "content": "The new quality inspection quotas are unrealistic. Workers are being penalized for natural variations in banana ripeness. We need to push back against these arbitrary standards that punish workers for things beyond our control.",
            "union": unions[6],
            "author": users[20]  # carmen_quality
        },
        {
            "title": "Transportation Workers: Unsafe Truck Conditions",
            "content": "The trucks used for transporting bananas from field to processing are in terrible condition - bad brakes, worn tires, broken mirrors. We're risking our lives every day. This needs to be addressed immediately!",
            "union": unions[6],
            "author": users[21]  # diego_transport
        },
        {
            "title": "Women in the Fields: Addressing Gender Discrimination",
            "content": "Female workers consistently get assigned to lower-paying packing jobs while men get higher-paid harvesting positions. We need equal pay for equal work and fair job assignments regardless of gender!",
            "union": unions[6],
            "author": users[22]  # isabel_fieldworker
        },
        
        # Hospitality Workers Guild posts
        {
            "title": "Tip Pooling Policy Changes - Not Fair!",
            "content": "Management wants to include non-service staff in tip pooling, which will reduce server income by 30-40%. This is our earned money! We need to organize against this policy change.",
            "union": unions[7],
            "author": users[25]  # alex_chef
        },
        {
            "title": "Weekend and Holiday Premium Pay",
            "content": "Hospitality workers sacrifice time with family on holidays and weekends. It's time we demand premium pay for these shifts - at least time and a half for weekends, double time for holidays.",
            "union": unions[7],
            "author": users[26]  # sam_hospitality
        },
        
        # Construction Trades Council posts
        {
            "title": "Mandatory Safety Training Being Cut",
            "content": "Management is cutting safety training time from 8 hours to 4 hours to 'save money.' This is absolutely unacceptable in construction where one mistake can be fatal. We need to fight this immediately.",
            "union": unions[8],
            "author": users[29]  # morgan_construction
        },
    ]
    
    posts = []
    for post_data in posts_data:
        post = Post(
            title=post_data["title"],
            content=post_data["content"],
            union_id=post_data["union"].id
        )
        db.add(post)
        posts.append(post)
    
    db.commit()
    print(f"✅ Created {len(posts)} posts")
    return posts


def create_comments(db, users, posts):
    """Create comments on posts."""
    print("\n💬 Creating comments...")
    
    comments_data = [
        # Comments on Healthcare post
        {"post": posts[0], "user": users[11], "content": "Signed! This is so important for patient safety."},
        {"post": posts[0], "user": users[1], "content": "I've shared this with my entire department. Let's get 500 signatures!"},
        {"post": posts[0], "user": users[0], "content": "Supporting this initiative 100%. Keep up the great work!"},
        
        {"post": posts[1], "user": users[4], "content": "Amazing news! This is what solidarity looks like! 🎉"},
        {"post": posts[1], "user": users[11], "content": "So proud of everyone who fought for this. We did it together!"},
        
        # Comments on Tech posts
        {"post": posts[3], "user": users[12], "content": "Remote work is a game changer for work-life balance. Count me in!"},
        {"post": posts[3], "user": users[2], "content": "Let's organize a meeting to plan our response. Who's available this week?"},
        {"post": posts[3], "user": users[0], "content": "Data shows remote work increases productivity. We have the facts on our side."},
        
        {"post": posts[4], "user": users[7], "content": "I've been tracking 55 hours/week for the past month with no extra pay. This needs to change."},
        {"post": posts[4], "user": users[2], "content": "Everyone document your hours. We'll need evidence for negotiations."},
        
        # Comments on Education posts
        {"post": posts[5], "user": users[13], "content": "Yes! I spent $800 last year on supplies. This is essential."},
        {"post": posts[5], "user": users[3], "content": "I'll help draft the proposal. Great initiative!"},
        
        {"post": posts[6], "user": users[6], "content": "Mental health days would make a huge difference. We need this."},
        {"post": posts[6], "user": users[3], "content": "I propose quarterly wellness workshops as a starting point."},
        
        # Comments on Retail post
        {"post": posts[7], "user": users[4], "content": "The unpredictability makes it impossible to plan anything. Fully support this!"},
        
        # Comments on Transportation post
        {"post": posts[8], "user": users[14], "content": "Agreed. Truck #47 has brake issues that haven't been fixed for weeks."},
        {"post": posts[8], "user": users[0], "content": "Safety violations should be reported to OSHA if not addressed immediately."},
        
        # Comments on Manufacturing post
        {"post": posts[9], "user": users[6], "content": "That's dangerous. OSHA has guidelines about workplace temperature limits."},
        
        # Comments on Banana Plantation posts
        {"post": posts[10], "user": users[18], "content": "Yes! I've had constant headaches and breathing problems. We need proper masks NOW."},
        {"post": posts[10], "user": users[22], "content": "My skin has rashes from the chemicals. This is a serious health crisis."},
        {"post": posts[10], "user": users[4], "content": "I'm documenting all health complaints. We may need to file a formal OSHA complaint if management doesn't act."},
        {"post": posts[10], "user": users[0], "content": "Worker health and safety is non-negotiable. Keep documenting everything."},
        
        {"post": posts[11], "user": users[17], "content": "This is amazing! So proud of our union! Solidarity works! 🍌💪"},
        {"post": posts[11], "user": users[18], "content": "This will make such a difference for my family. Thank you to everyone who fought!"},
        {"post": posts[11], "user": users[23], "content": "Incredible work Carlos and the negotiating team! This is why we unionize!"},
        
        {"post": posts[12], "user": users[17], "content": "I think we need breaks every 2 hours when working in direct sun. Plus shade stations."},
        {"post": posts[12], "user": users[22], "content": "Agreed. 30 minutes is nothing in this heat. We need more frequent shorter breaks."},
        {"post": posts[12], "user": users[24], "content": "Other plantations give 15-minute breaks every 2 hours. Let's demand the same."},
        
        {"post": posts[13], "user": users[18], "content": "These quotas are impossible. We're being set up to fail."},
        {"post": posts[13], "user": users[19], "content": "I've seen workers unfairly penalized. We need to stand together on this."},
        
        {"post": posts[14], "user": users[19], "content": "This is a safety emergency. No one should drive unsafe vehicles."},
        {"post": posts[14], "user": users[4], "content": "Document every issue with photos. We'll compile a safety report for management."},
        
        {"post": posts[15], "user": users[18], "content": "Absolutely right! I have the same skills as male harvesters but get paid less. This is discrimination."},
        {"post": posts[15], "user": users[24], "content": "Supporting this 100%. Equal pay and equal opportunities for all!"},
        {"post": posts[15], "user": users[4], "content": "Gender discrimination violates labor laws. We have legal grounds to push this issue."},
        
        # Comments on Hospitality posts
        {"post": posts[16], "user": users[26], "content": "This is theft from servers! Tips are OUR compensation for good service."},
        {"post": posts[16], "user": users[5], "content": "Let's organize a meeting to discuss our response strategy."},
        
        {"post": posts[17], "user": users[25], "content": "Yes! I work every holiday and miss family time. We deserve premium pay."},
        
        # Comments on Construction post
        {"post": posts[18], "user": users[6], "content": "Cutting safety training is criminally negligent. People die in construction accidents."},
        {"post": posts[18], "user": users[0], "content": "Document this decision in writing. It could be important for legal action if there's an incident."},
    ]
    
    comments = []
    for comment_data in comments_data:
        comment = Comment(
            content=comment_data["content"],
            post_id=comment_data["post"].id,
            user_id=comment_data["user"].id
        )
        db.add(comment)
        comments.append(comment)
    
    db.commit()
    print(f"✅ Created {len(comments)} comments")
    return comments


def create_post_votes(db, users, posts):
    """Create upvotes and downvotes on posts from various users."""
    print("\n👍 Creating post votes...")
    
    votes_data = []
    
    # Posts with high engagement get more votes
    high_engagement_posts = [posts[0], posts[1], posts[3], posts[10], posts[11], posts[15]]  # Important posts
    medium_engagement_posts = [posts[2], posts[4], posts[5], posts[7], posts[12], posts[14]]
    low_engagement_posts = [posts[6], posts[8], posts[9], posts[13], posts[16], posts[17], posts[18]]
    
    # High engagement posts - 10-20 upvotes
    for post in high_engagement_posts:
        num_votes = random.randint(12, 22)
        voters = random.sample(users[1:], min(num_votes, len(users)-1))  # Exclude admin sometimes
        for voter in voters:
            # 90% upvotes, 10% downvotes
            vote_type = "up" if random.random() < 0.9 else "down"
            votes_data.append({"post": post, "user": voter, "vote_type": vote_type})
    
    # Medium engagement posts - 5-12 upvotes
    for post in medium_engagement_posts:
        num_votes = random.randint(5, 12)
        voters = random.sample(users[1:], min(num_votes, len(users)-1))
        for voter in voters:
            vote_type = "up" if random.random() < 0.85 else "down"
            votes_data.append({"post": post, "user": voter, "vote_type": vote_type})
    
    # Low engagement posts - 2-6 upvotes
    for post in low_engagement_posts:
        num_votes = random.randint(2, 6)
        voters = random.sample(users[1:], min(num_votes, len(users)-1))
        for voter in voters:
            vote_type = "up" if random.random() < 0.8 else "down"
            votes_data.append({"post": post, "user": voter, "vote_type": vote_type})
    
    votes = []
    for vote_data in votes_data:
        # Check if this user already voted on this post
        existing = db.query(PostVote).filter(
            PostVote.post_id == vote_data["post"].id,
            PostVote.user_id == vote_data["user"].id
        ).first()
        
        if not existing:
            vote = PostVote(
                post_id=vote_data["post"].id,
                user_id=vote_data["user"].id,
                vote_type=vote_data["vote_type"]
            )
            db.add(vote)
            votes.append(vote)
    
    db.commit()
    print(f"✅ Created {len(votes)} post votes")
    return votes


def create_polls(db, users, unions):
    """Create polls with options and votes."""
    print("\n📊 Creating polls...")
    
    polls_data = [
        {
            "question": "What should be our top priority in the next contract negotiation?",
            "union": unions[0],
            "options": [
                "Higher wages",
                "Better healthcare benefits",
                "More vacation days",
                "Improved safety protocols"
            ]
        },
        {
            "question": "Should we pursue remote work as a permanent option?",
            "union": unions[1],
            "options": [
                "Yes, full remote",
                "Hybrid (2-3 days in office)",
                "Keep current policy",
                "No opinion"
            ]
        },
        {
            "question": "What time works best for union meetings?",
            "union": unions[2],
            "options": [
                "Weekday evenings (6-8 PM)",
                "Weekend mornings (10 AM-12 PM)",
                "Lunch hour (12-1 PM)",
                "After work (4-6 PM)"
            ]
        },
        {
            "question": "Which benefit would most improve your work life?",
            "union": unions[3],
            "options": [
                "Predictable scheduling",
                "Higher base pay",
                "Employee discounts",
                "Paid sick leave"
            ]
        },
        {
            "question": "🍌 Most urgent safety issue on the plantation?",
            "union": unions[6],
            "options": [
                "Pesticide protection equipment",
                "Heat exhaustion prevention",
                "Transportation vehicle safety",
                "First aid facilities"
            ]
        },
        {
            "question": "Preferred break schedule during harvest season?",
            "union": unions[6],
            "options": [
                "15 min breaks every 2 hours",
                "30 min break every 3 hours",
                "Two 20 min breaks + lunch",
                "Flexible breaks as needed"
            ]
        },
        {
            "question": "Should we strike if safety equipment isn't provided within 30 days?",
            "union": unions[6],
            "options": [
                "Yes, strike immediately after deadline",
                "Yes, but try negotiation first",
                "No, find other solutions",
                "Need more information"
            ]
        },
        {
            "question": "Hotel worker priority for next contract?",
            "union": unions[7],
            "options": [
                "Higher wages",
                "Tip protection policies",
                "Better health insurance",
                "Predictable scheduling"
            ]
        },
    ]
    
    polls = []
    all_options = []
    
    for poll_data in polls_data:
        poll = Poll(
            question=poll_data["question"],
            union_id=poll_data["union"].id
        )
        db.add(poll)
        db.flush()  # Get poll ID
        
        options = []
        for option_text in poll_data["options"]:
            option = PollOption(
                poll_id=poll.id,
                text=option_text
            )
            db.add(option)
            options.append(option)
        
        polls.append(poll)
        all_options.extend(options)
    
    db.commit()
    
    # Create votes
    print("  🗳️  Adding votes to polls...")
    votes = []
    
    # Get union members for each poll
    for poll in polls:
        union_members = db.query(UnionMember).filter(UnionMember.union_id == poll.union_id).all()
        poll_options = [opt for opt in all_options if opt.poll_id == poll.id]
        
        # Have some members vote (60-80% participation)
        voters = random.sample(union_members, k=int(len(union_members) * random.uniform(0.6, 0.8)))
        
        for member in voters:
            chosen_option = random.choice(poll_options)
            vote = Vote(
                poll_id=poll.id,
                option_id=chosen_option.id,
                user_id=member.user_id
            )
            db.add(vote)
            votes.append(vote)
    
    db.commit()
    print(f"✅ Created {len(polls)} polls with {len(all_options)} options and {len(votes)} votes")
    return polls


def create_events(db, users, unions):
    """Create upcoming and past events."""
    print("\n📅 Creating events...")
    
    now = datetime.utcnow()
    
    events_data = [
        {
            "title": "Monthly Union Meeting - Healthcare Workers",
            "description": "Discussing upcoming contract negotiations and new safety protocols. All members welcome!",
            "location": "Community Center, Room 203",
            "start_time": now + timedelta(days=5, hours=18),
            "end_time": now + timedelta(days=5, hours=20),
            "union": unions[0],
            "creator": users[1]  # sarah_organizer
        },
        {
            "title": "Picket Line Training Workshop",
            "description": "Learn effective picketing strategies, your rights, and how to stay safe during demonstrations.",
            "location": "Union Hall",
            "start_time": now + timedelta(days=12, hours=14),
            "end_time": now + timedelta(days=12, hours=16),
            "union": unions[0],
            "creator": users[1]
        },
        {
            "title": "Tech Workers Social Mixer",
            "description": "Casual meetup to connect with fellow tech workers. Food and drinks provided!",
            "location": "The Brewery Downtown",
            "start_time": now + timedelta(days=8, hours=19),
            "end_time": now + timedelta(days=8, hours=22),
            "union": unions[1],
            "creator": users[2]  # mike_organizer
        },
        {
            "title": "Know Your Rights: Legal Workshop",
            "description": "Free legal consultation and workshop on worker rights, contract terms, and dispute resolution.",
            "location": "Virtual (Zoom link will be sent)",
            "start_time": now + timedelta(days=15, hours=18),
            "end_time": now + timedelta(days=15, hours=20),
            "union": unions[1],
            "creator": users[2]
        },
        {
            "title": "Teachers' Solidarity March",
            "description": "Join us in demanding better funding for education and fair teacher compensation.",
            "location": "City Hall Plaza",
            "start_time": now + timedelta(days=20, hours=10),
            "end_time": now + timedelta(days=20, hours=14),
            "union": unions[2],
            "creator": users[3]  # jessica_lead
        },
        {
            "title": "Contract Negotiation Strategy Session",
            "description": "Planning our approach for the upcoming contract negotiations. Your input is crucial!",
            "location": "Teachers Union Office",
            "start_time": now + timedelta(days=3, hours=17),
            "end_time": now + timedelta(days=3, hours=19),
            "union": unions[2],
            "creator": users[3]
        },
        # Past event
        {
            "title": "New Member Orientation",
            "description": "Welcome new members! Learn about union benefits, how to get involved, and meet fellow members.",
            "location": "Union Hall",
            "start_time": now - timedelta(days=7, hours=18),
            "end_time": now - timedelta(days=7, hours=20),
            "union": unions[3],
            "creator": users[0]  # admin
        },
        
        # Banana Plantation Union Events 🍌
        {
            "title": "🍌 Emergency Safety Meeting - Pesticide Exposure",
            "description": "Critical meeting to discuss pesticide safety concerns and plan our response. Health expert will present on exposure risks. All workers urged to attend!",
            "location": "Community Hall, Plantation District",
            "start_time": now + timedelta(days=2, hours=19),
            "end_time": now + timedelta(days=2, hours=21),
            "union": unions[6],
            "creator": users[4]  # carlos_union_lead
        },
        {
            "title": "🍌 Wage Victory Celebration BBQ",
            "description": "Come celebrate our 20% wage increase! Free food, music, and fellowship. Bring your family! This is what solidarity looks like!",
            "location": "Riverside Park Pavilion",
            "start_time": now + timedelta(days=6, hours=12),
            "end_time": now + timedelta(days=6, hours=16),
            "union": unions[6],
            "creator": users[4]  # carlos_union_lead
        },
        {
            "title": "🍌 Women Workers Caucus Meeting",
            "description": "Meeting for female plantation workers to discuss gender discrimination issues and develop action plan for equal pay and fair job assignments.",
            "location": "Women's Center",
            "start_time": now + timedelta(days=10, hours=18),
            "end_time": now + timedelta(days=10, hours=20),
            "union": unions[6],
            "creator": users[22]  # isabel_fieldworker
        },
        {
            "title": "🍌 Safety Training: Heat Illness Prevention",
            "description": "Free training on recognizing and preventing heat exhaustion and heat stroke. Learn how to stay safe in tropical conditions. Refreshments provided.",
            "location": "Plantation Main Office, Training Room",
            "start_time": now + timedelta(days=18, hours=10),
            "end_time": now + timedelta(days=18, hours=12),
            "union": unions[6],
            "creator": users[19]  # juan_supervisor
        },
        
        # Hospitality Union Events
        {
            "title": "Hospitality Workers Social Hour",
            "description": "Casual meetup for hotel and restaurant workers. Share experiences, build solidarity, and enjoy good company!",
            "location": "Joe's Bar & Grill",
            "start_time": now + timedelta(days=9, hours=20),
            "end_time": now + timedelta(days=9, hours=23),
            "union": unions[7],
            "creator": users[5]  # rachel_organizer
        },
        {
            "title": "Tip Pooling Town Hall",
            "description": "Open forum to discuss the proposed tip pooling changes. Your voice matters! We'll be voting on our collective response.",
            "location": "Workers Center Downtown",
            "start_time": now + timedelta(days=4, hours=18),
            "end_time": now + timedelta(days=4, hours=20),
            "union": unions[7],
            "creator": users[5]  # rachel_organizer
        },
        
        # Construction Union Event
        {
            "title": "OSHA Safety Rights Workshop",
            "description": "Learn your OSHA rights, how to report violations, and what protections you have. OSHA representative will be present.",
            "location": "Construction Union Hall",
            "start_time": now + timedelta(days=14, hours=17),
            "end_time": now + timedelta(days=14, hours=19),
            "union": unions[8],
            "creator": users[0]  # admin
        },
    ]
    
    events = []
    for event_data in events_data:
        event = Event(
            title=event_data["title"],
            description=event_data["description"],
            location=event_data["location"],
            start_time=event_data["start_time"],
            end_time=event_data["end_time"],
            union_id=event_data["union"].id,
            creator_id=event_data["creator"].id
        )
        db.add(event)
        events.append(event)
    
    db.commit()
    
    # Add attendees to events
    print("  👥 Adding event attendees...")
    attendees = []
    
    for event in events:
        union_members = db.query(UnionMember).filter(UnionMember.union_id == event.union_id).all()
        
        # Random attendance (30-70%)
        num_attendees = random.randint(int(len(union_members) * 0.3), int(len(union_members) * 0.7))
        event_attendees = random.sample(union_members, k=min(num_attendees, len(union_members)))
        
        for member in event_attendees:
            attendee = EventAttendee(
                event_id=event.id,
                user_id=member.user_id
            )
            db.add(attendee)
            attendees.append(attendee)
    
    db.commit()
    print(f"✅ Created {len(events)} events with {len(attendees)} attendees")
    return events


def create_feedback(db, posts):
    """Create feedback entries (both anonymous and public)."""
    print("\n💭 Creating feedback...")
    
    feedback_data = [
        {
            "post": posts[0],
            "anonymous": True,
            "message": "I'm afraid to speak up publicly, but I fully support the nurse ratio petition. The current situation is unsustainable."
        },
        {
            "post": posts[0],
            "anonymous": False,
            "message": "Great initiative! I've seen firsthand how understaffing affects patient care."
        },
        {
            "post": posts[3],
            "anonymous": True,
            "message": "I have childcare responsibilities that make commuting impossible. Remote work is essential for parents like me."
        },
        {
            "post": posts[4],
            "anonymous": True,
            "message": "I've been working 60+ hours weekly for months. Management acts like it's normal. We need change."
        },
        {
            "post": posts[7],
            "anonymous": False,
            "message": "Unpredictable scheduling is causing serious stress. I can't attend school or plan appointments."
        },
        {
            "post": posts[8],
            "anonymous": True,
            "message": "I reported safety issues three times and nothing changed. Worried about retaliation if I push harder."
        },
        {
            "post": posts[9],
            "anonymous": False,
            "message": "The heat situation is dangerous. We need immediate action before someone gets seriously hurt."
        },
        # Banana plantation feedback
        {
            "post": posts[10],
            "anonymous": True,
            "message": "I've been coughing blood after spraying shifts but I'm scared to report it officially. I need this job to feed my family."
        },
        {
            "post": posts[10],
            "anonymous": False,
            "message": "Three workers from my section have had to visit the doctor for respiratory issues this month alone. This is an epidemic."
        },
        {
            "post": posts[11],
            "anonymous": False,
            "message": "This wage increase will allow me to finally afford proper housing for my family. Thank you union!"
        },
        {
            "post": posts[12],
            "anonymous": True,
            "message": "I nearly passed out from heat exhaustion last week. We desperately need more breaks and water stations."
        },
        {
            "post": posts[13],
            "anonymous": True,
            "message": "I got written up for bananas that weren't ripe enough, but they came from a section that's always shaded. The quotas don't account for growing conditions."
        },
        {
            "post": posts[15],
            "anonymous": False,
            "message": "I've been passed over for supervisor positions three times despite having more experience than the men who were promoted."
        },
        {
            "post": posts[15],
            "anonymous": True,
            "message": "When I complained about unequal pay, my supervisor told me 'women should be happy with packing work.' This is blatant discrimination."
        },
        # Hospitality feedback
        {
            "post": posts[16],
            "anonymous": True,
            "message": "I make most of my income from tips. If they pool it with kitchen staff, I won't be able to pay rent."
        },
        {
            "post": posts[17],
            "anonymous": False,
            "message": "I've worked every Christmas for 5 years straight. Premium pay would at least compensate for missing family time."
        },
        # Construction feedback
        {
            "post": posts[18],
            "anonymous": True,
            "message": "A coworker died last year from a preventable fall. Cutting safety training is asking for more deaths."
        },
    ]
    
    feedbacks = []
    for feedback_item in feedback_data:
        feedback = Feedback(
            post_id=feedback_item["post"].id,
            anonymous=feedback_item["anonymous"],
            message=feedback_item["message"]
        )
        db.add(feedback)
        feedbacks.append(feedback)
    
    db.commit()
    print(f"✅ Created {len(feedbacks)} feedback entries")
    return feedbacks


def main():
    """Main function to seed the database."""
    print("=" * 60)
    print("🌱 SEEDING DATABASE WITH FAKE DATA")
    print("=" * 60)
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Optional: Clear existing data
        response = input("\n⚠️  Clear existing data? (y/N): ").strip().lower()
        if response == 'y':
            clear_database(db)
        
        # Create all fake data
        users = create_users(db)
        unions = create_unions(db)
        assign_union_memberships(db, users, unions)
        posts = create_posts(db, users, unions)
        comments = create_comments(db, users, posts)
        post_votes = create_post_votes(db, users, posts)
        polls = create_polls(db, users, unions)
        events = create_events(db, users, unions)
        feedback = create_feedback(db, posts)
        
        print("\n" + "=" * 60)
        print("✅ DATABASE SEEDING COMPLETE!")
        print("=" * 60)
        print("\n📊 Summary:")
        print(f"   - {len(users)} users created")
        print(f"   - {len(unions)} unions created (including Banana Plantation Workers United! 🍌)")
        print(f"   - {len(posts)} posts created")
        print(f"   - {len(comments)} comments created")
        print(f"   - {len(post_votes)} post votes created")
        print(f"   - {len(polls)} polls created")
        print(f"   - {len(events)} events created")
        print(f"   - {len(feedback)} feedback entries created")
        
        print("\n🔑 Test Credentials:")
        print("   Admin:      username='admin', password='admin123'")
        print("   Organizer:  username='sarah_organizer', password='password123'")
        print("   Organizer:  username='carlos_union_lead', password='password123' (Banana Union)")
        print("   Member:     username='john_worker', password='password123'")
        print("   Member:     username='miguel_harvester', password='password123' (Banana Worker)")
        print("\n   All users have password: 'password123' (except admin: 'admin123')")
        print("\n🍌 Special Feature: Banana Plantation Workers United")
        print("   - 10 members including field workers, packers, and supervisors")
        print("   - Active posts about pesticide safety, wages, and working conditions")
        print("   - Multiple polls on safety priorities and break schedules")
        print("   - Upcoming events including safety meetings and celebrations")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
