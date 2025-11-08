"""
Test runner script for Bunch Up backend tests
Run this script to execute all tests with proper configuration
"""
import sys
import subprocess
from pathlib import Path


def run_tests(test_type="all"):
    """
    Run tests based on the specified type
    
    Args:
        test_type: "all", "unit", "integration", or "selenium"
    """
    backend_dir = Path(__file__).parent.parent
    
    if test_type == "all":
        print("Running all tests...")
        cmd = ["pytest", "tests/", "-v", "--tb=short"]
    elif test_type == "unit":
        print("Running unit tests (API tests without Selenium)...")
        cmd = ["pytest", "tests/", "-v", "--tb=short", "--ignore=tests/test_selenium_integration.py"]
    elif test_type == "integration" or test_type == "selenium":
        print("Running Selenium integration tests...")
        cmd = ["pytest", "tests/test_selenium_integration.py", "-v", "--tb=short"]
    else:
        print(f"Unknown test type: {test_type}")
        print("Available types: all, unit, integration, selenium")
        sys.exit(1)
    
    # Add coverage if requested
    if "--coverage" in sys.argv:
        cmd.extend(["--cov=backend", "--cov-report=html", "--cov-report=term"])
    
    # Run from backend directory
    result = subprocess.run(cmd, cwd=backend_dir)
    sys.exit(result.returncode)


if __name__ == "__main__":
    test_type = sys.argv[1] if len(sys.argv) > 1 else "all"
    run_tests(test_type)
