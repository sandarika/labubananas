# Test Suite for Bunch Up Backend

This directory contains comprehensive tests for the Bunch Up backend API.

## Test Structure

- `conftest.py` - Pytest configuration and shared fixtures
- `test_auth.py` - Authentication endpoint tests
- `test_unions.py` - Union management tests
- `test_posts.py` - Post management tests
- `test_feedback.py` - Feedback system tests
- `test_events.py` - Event management tests
- `test_polls.py` - Poll and voting tests
- `test_selenium_integration.py` - Selenium-based integration tests
- `run_tests.py` - Test runner script

## Running Tests

### Prerequisites

1. Install test dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure Chrome browser is installed (for Selenium tests)

### Run All Tests
```bash
pytest tests/ -v
```

### Run Specific Test Categories

**Unit Tests Only (without Selenium):**
```bash
pytest tests/ -v --ignore=tests/test_selenium_integration.py
```

**Selenium Integration Tests Only:**
```bash
pytest tests/test_selenium_integration.py -v
```

**Specific Test File:**
```bash
pytest tests/test_auth.py -v
```

**Specific Test Class:**
```bash
pytest tests/test_auth.py::TestAuthEndpoints -v
```

**Specific Test Function:**
```bash
pytest tests/test_auth.py::TestAuthEndpoints::test_register_new_user -v
```

### Using the Test Runner Script

```bash
# Run all tests
python tests/run_tests.py all

# Run only unit tests (no Selenium)
python tests/run_tests.py unit

# Run only Selenium tests
python tests/run_tests.py selenium

# Run with coverage report
python tests/run_tests.py all --coverage
```

## Test Coverage

The test suite covers:

- ✅ Authentication (register, login, token validation)
- ✅ User roles and permissions (member, organizer, admin)
- ✅ Union creation and management
- ✅ Post creation and retrieval
- ✅ Anonymous feedback system
- ✅ Event scheduling
- ✅ Poll creation and voting
- ✅ API documentation accessibility
- ✅ End-to-end workflows

## Selenium Tests

Selenium tests require the API server to be running:

```bash
# Start the server in one terminal
uvicorn backend.main:app --reload

# Run Selenium tests in another terminal
pytest tests/test_selenium_integration.py -v
```

The Selenium tests validate:
- API documentation page loads correctly
- All endpoints are visible in the docs
- Interactive documentation works
- End-to-end user workflows
- Browser compatibility

## Test Database

Tests use a separate SQLite database (`test_bunch_up.db`) which is:
- Created fresh for each test
- Automatically cleaned up after each test
- Isolated from development database

## Fixtures

Common fixtures available in all tests:
- `client` - FastAPI TestClient
- `test_db` - Test database session
- `test_user` - Pre-created member user
- `test_organizer` - Pre-created organizer user
- `test_admin` - Pre-created admin user
- `auth_headers_*` - Authentication headers for each role
- `test_union` - Pre-created test union
- `test_post` - Pre-created test post
- `selenium_driver` - Selenium WebDriver (headless Chrome)

## Writing New Tests

Example test structure:

```python
def test_my_feature(client, auth_headers_organizer):
    """Test description"""
    response = client.post(
        "/api/endpoint/",
        headers=auth_headers_organizer,
        json={"key": "value"}
    )
    assert response.status_code == 200
    assert response.json()["key"] == "value"
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines. The Selenium tests run in headless mode by default.

## Troubleshooting

**ChromeDriver issues:**
```bash
pip install --upgrade webdriver-manager
```

**Import errors:**
Ensure you're running tests from the project root or backend directory.

**Database locked errors:**
Tests automatically handle database cleanup. If issues persist, delete `test_bunch_up.db` manually.

**API server not running (Selenium tests):**
Selenium integration tests will skip if the API server is not accessible.
