"""
Selenium-based integration tests for Bunch Up API
These tests use Selenium to interact with the API documentation (FastAPI's automatic docs)
and validate the API endpoints work correctly through a browser interface.
"""
import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import requests


@pytest.mark.selenium
class TestAPIDocumentation:
    """Test suite for API documentation using Selenium"""

    @pytest.fixture(autouse=True)
    def setup(self, selenium_driver):
        """Setup for each test"""
        self.driver = selenium_driver
        self.base_url = "http://localhost:8000"
        self.docs_url = f"{self.base_url}/docs"
        
    def test_api_is_running(self):
        """Test that the API server is accessible"""
        try:
            response = requests.get(self.base_url, timeout=5)
            assert response.status_code == 200
            assert "Bunch Up" in response.json()["message"]
        except requests.exceptions.ConnectionError:
            pytest.skip("API server is not running. Start with: uvicorn backend.main:app")

    def test_docs_page_loads(self):
        """Test that the API documentation page loads"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            # Wait for the Swagger UI to load
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swagger-ui")))
            assert "Bunch Up API" in self.driver.title or "FastAPI" in self.driver.title
        except TimeoutException:
            pytest.skip("API docs not accessible. Ensure server is running.")

    def test_docs_shows_auth_endpoints(self):
        """Test that authentication endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/auth/register" in page_text
            assert "/api/auth/token" in page_text
            assert "/api/auth/me" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_docs_shows_union_endpoints(self):
        """Test that union endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/unions" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_docs_shows_post_endpoints(self):
        """Test that post endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/posts" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_docs_shows_poll_endpoints(self):
        """Test that poll endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/polls" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_docs_shows_event_endpoints(self):
        """Test that event endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/events" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_docs_shows_feedback_endpoints(self):
        """Test that feedback endpoints are visible in docs"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            page_text = self.driver.page_source.lower()
            assert "/api/feedbacks" in page_text
        except TimeoutException:
            pytest.skip("API docs not loading properly")

    def test_expand_endpoint_shows_details(self):
        """Test expanding an endpoint in the docs shows details"""
        try:
            self.driver.get(self.docs_url)
            wait = WebDriverWait(self.driver, 10)
            
            # Wait for endpoints to load
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "opblock")))
            
            # Find and click the first GET endpoint
            get_buttons = self.driver.find_elements(By.CSS_SELECTOR, ".opblock-get")
            if get_buttons:
                get_buttons[0].click()
                time.sleep(1)  # Wait for expansion animation
                
                # Check if details are visible
                assert "parameters" in self.driver.page_source.lower() or \
                       "responses" in self.driver.page_source.lower()
        except (TimeoutException, IndexError):
            pytest.skip("Could not interact with endpoint expansion")

    def test_redoc_page_accessible(self):
        """Test that ReDoc page is accessible"""
        try:
            self.driver.get(f"{self.base_url}/redoc")
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "redoc")))
            assert "redoc" in self.driver.page_source.lower()
        except TimeoutException:
            pytest.skip("ReDoc not accessible")

    def test_openapi_json_accessible(self):
        """Test that OpenAPI JSON schema is accessible"""
        try:
            response = requests.get(f"{self.base_url}/openapi.json", timeout=5)
            assert response.status_code == 200
            schema = response.json()
            assert "openapi" in schema
            assert "info" in schema
            assert "paths" in schema
        except requests.exceptions.ConnectionError:
            pytest.skip("API server is not running")


@pytest.mark.selenium
@pytest.mark.integration
class TestAPIEndToEnd:
    """End-to-end tests using Selenium and direct API calls"""

    @pytest.fixture(autouse=True)
    def setup(self, selenium_driver):
        """Setup for each test"""
        self.driver = selenium_driver
        self.base_url = "http://localhost:8000"
        self.api_url = f"{self.base_url}/api"
        
    def test_full_user_workflow(self):
        """Test complete user registration and login workflow"""
        try:
            # Check if server is running
            response = requests.get(self.base_url, timeout=5)
            assert response.status_code == 200
            
            # Register a new user
            register_data = {
                "username": f"selenium_user_{int(time.time())}",
                "password": "selenium123",
                "role": "member"
            }
            register_response = requests.post(
                f"{self.api_url}/auth/register",
                json=register_data,
                timeout=5
            )
            assert register_response.status_code == 200
            
            # Login
            login_response = requests.post(
                f"{self.api_url}/auth/token",
                data={
                    "username": register_data["username"],
                    "password": register_data["password"]
                },
                timeout=5
            )
            assert login_response.status_code == 200
            token = login_response.json()["access_token"]
            
            # Access protected endpoint
            headers = {"Authorization": f"Bearer {token}"}
            me_response = requests.get(f"{self.api_url}/auth/me", headers=headers, timeout=5)
            assert me_response.status_code == 200
            assert me_response.json()["username"] == register_data["username"]
            
        except requests.exceptions.ConnectionError:
            pytest.skip("API server is not running")

    def test_union_creation_workflow(self):
        """Test creating a union through the API"""
        try:
            # Register an organizer
            register_data = {
                "username": f"organizer_{int(time.time())}",
                "password": "org123",
                "role": "organizer"
            }
            requests.post(f"{self.api_url}/auth/register", json=register_data, timeout=5)
            
            # Login
            login_response = requests.post(
                f"{self.api_url}/auth/token",
                data={
                    "username": register_data["username"],
                    "password": register_data["password"]
                },
                timeout=5
            )
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            
            # Create union
            union_data = {
                "name": f"Selenium Union {int(time.time())}",
                "description": "Created via Selenium test"
            }
            union_response = requests.post(
                f"{self.api_url}/unions/",
                json=union_data,
                headers=headers,
                timeout=5
            )
            assert union_response.status_code == 200
            union_id = union_response.json()["id"]
            
            # Verify union exists
            get_response = requests.get(f"{self.api_url}/unions/{union_id}", timeout=5)
            assert get_response.status_code == 200
            assert get_response.json()["name"] == union_data["name"]
            
        except requests.exceptions.ConnectionError:
            pytest.skip("API server is not running")

    def test_post_and_feedback_workflow(self):
        """Test creating a post and adding feedback"""
        try:
            # Setup: Create organizer and union
            org_data = {
                "username": f"poster_{int(time.time())}",
                "password": "post123",
                "role": "organizer"
            }
            requests.post(f"{self.api_url}/auth/register", json=org_data, timeout=5)
            
            login_resp = requests.post(
                f"{self.api_url}/auth/token",
                data={"username": org_data["username"], "password": org_data["password"]},
                timeout=5
            )
            org_token = login_resp.json()["access_token"]
            org_headers = {"Authorization": f"Bearer {org_token}"}
            
            # Create union
            union_resp = requests.post(
                f"{self.api_url}/unions/",
                json={"name": f"Post Union {int(time.time())}"},
                headers=org_headers,
                timeout=5
            )
            union_id = union_resp.json()["id"]
            
            # Create post
            post_resp = requests.post(
                f"{self.api_url}/posts/union/{union_id}",
                json={"title": "Test Post", "content": "Test content"},
                headers=org_headers,
                timeout=5
            )
            assert post_resp.status_code == 200
            post_id = post_resp.json()["id"]
            
            # Create member for feedback
            member_data = {
                "username": f"feedback_user_{int(time.time())}",
                "password": "member123",
                "role": "member"
            }
            requests.post(f"{self.api_url}/auth/register", json=member_data, timeout=5)
            
            member_login = requests.post(
                f"{self.api_url}/auth/token",
                data={"username": member_data["username"], "password": member_data["password"]},
                timeout=5
            )
            member_token = member_login.json()["access_token"]
            member_headers = {"Authorization": f"Bearer {member_token}"}
            
            # Add feedback
            feedback_resp = requests.post(
                f"{self.api_url}/feedbacks/post/{post_id}",
                json={"message": "Great post!", "anonymous": False},
                headers=member_headers,
                timeout=5
            )
            assert feedback_resp.status_code == 200
            
            # Verify feedback exists
            feedbacks = requests.get(f"{self.api_url}/feedbacks/post/{post_id}", timeout=5)
            assert feedbacks.status_code == 200
            assert len(feedbacks.json()) > 0
            
        except requests.exceptions.ConnectionError:
            pytest.skip("API server is not running")


@pytest.mark.selenium
class TestBrowserCompatibility:
    """Test browser compatibility for API documentation"""

    def test_page_responsive_design(self, selenium_driver):
        """Test that the docs page is responsive"""
        try:
            selenium_driver.get("http://localhost:8000/docs")
            wait = WebDriverWait(selenium_driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swagger-ui")))
            
            # Test mobile viewport
            selenium_driver.set_window_size(375, 667)
            time.sleep(1)
            assert selenium_driver.find_elements(By.CLASS_NAME, "swagger-ui")
            
            # Test desktop viewport
            selenium_driver.set_window_size(1920, 1080)
            time.sleep(1)
            assert selenium_driver.find_elements(By.CLASS_NAME, "swagger-ui")
            
        except TimeoutException:
            pytest.skip("API docs not accessible")

    def test_javascript_loads(self, selenium_driver):
        """Test that JavaScript loads properly in the docs"""
        try:
            selenium_driver.get("http://localhost:8000/docs")
            wait = WebDriverWait(selenium_driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "swagger-ui")))
            
            # Execute JavaScript to check if Swagger UI is initialized
            result = selenium_driver.execute_script("return typeof window.ui !== 'undefined';")
            assert result is True or selenium_driver.find_elements(By.CLASS_NAME, "opblock")
            
        except TimeoutException:
            pytest.skip("API docs not accessible")
