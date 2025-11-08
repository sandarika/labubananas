"""
Pytest configuration and shared fixtures for backend tests
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Add project root and backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
project_root = os.path.dirname(backend_dir)

# Add both paths to handle different execution contexts
for path in [backend_dir, project_root]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Try different import strategies
try:
    # Try relative import from backend package
    from backend.db import Base, get_db
    from backend.main import app
    from backend.models import User
    from backend.security import get_password_hash
except ImportError:
    # Fall back to direct import (when running from backend directory)
    from db import Base, get_db
    from main import app
    from models import User
    from security import get_password_hash

# Test database URL
TEST_DATABASE_URL = "sqlite:///./test_bunch_up.db"

# Create test engine and session
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with overridden database dependency"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(test_db):
    """Create a test member user"""
    user = User(
        username="testmember",
        hashed_password=get_password_hash("testpass123"),
        role="member"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_organizer(test_db):
    """Create a test organizer user"""
    organizer = User(
        username="testorganizer",
        hashed_password=get_password_hash("organizer123"),
        role="organizer"
    )
    test_db.add(organizer)
    test_db.commit()
    test_db.refresh(organizer)
    return organizer


@pytest.fixture(scope="function")
def test_admin(test_db):
    """Create a test admin user"""
    admin = User(
        username="testadmin",
        hashed_password=get_password_hash("admin123"),
        role="admin"
    )
    test_db.add(admin)
    test_db.commit()
    test_db.refresh(admin)
    return admin


@pytest.fixture(scope="function")
def auth_headers_member(client, test_user):
    """Get authentication headers for member user"""
    response = client.post(
        "/api/auth/token",
        data={"username": "testmember", "password": "testpass123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_headers_organizer(client, test_organizer):
    """Get authentication headers for organizer user"""
    response = client.post(
        "/api/auth/token",
        data={"username": "testorganizer", "password": "organizer123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_headers_admin(client, test_admin):
    """Get authentication headers for admin user"""
    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin", "password": "admin123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def selenium_driver():
    """Create a Selenium WebDriver instance for end-to-end tests"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()


@pytest.fixture(scope="function")
def test_union(test_db, test_organizer):
    """Create a test union"""
    try:
        from backend.models import Union
    except ImportError:
        from models import Union
    
    union = Union(
        name="Test Workers Union",
        description="A test union for testing purposes"
    )
    test_db.add(union)
    test_db.commit()
    test_db.refresh(union)
    return union


@pytest.fixture(scope="function")
def test_post(test_db, test_union):
    """Create a test post"""
    try:
        from backend.models import Post
    except ImportError:
        from models import Post
    
    post = Post(
        title="Test Post",
        content="This is a test post content",
        union_id=test_union.id
    )
    test_db.add(post)
    test_db.commit()
    test_db.refresh(post)
    return post
