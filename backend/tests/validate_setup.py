"""
Quick validation script to check if the test suite is set up correctly
"""
import sys
import subprocess
from pathlib import Path


def check_dependencies():
    """Check if all required packages are installed"""
    print("Checking dependencies...")
    required = [
        "pytest",
        "selenium",
        "webdriver_manager",
        "fastapi",
        "sqlalchemy",
        "requests",
        "httpx"
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} (missing)")
            missing.append(package)
    
    if missing:
        print(f"\n❌ Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("\n✓ All dependencies installed")
        return True


def check_test_files():
    """Check if all test files exist"""
    print("\nChecking test files...")
    test_dir = Path(__file__).parent
    
    test_files = [
        "conftest.py",
        "test_auth.py",
        "test_unions.py",
        "test_posts.py",
        "test_feedback.py",
        "test_events.py",
        "test_polls.py",
        "test_selenium_integration.py"
    ]
    
    all_exist = True
    for test_file in test_files:
        file_path = test_dir / test_file
        if file_path.exists():
            print(f"✓ {test_file}")
        else:
            print(f"✗ {test_file} (missing)")
            all_exist = False
    
    if all_exist:
        print("\n✓ All test files present")
    else:
        print("\n❌ Some test files are missing")
    
    return all_exist


def run_syntax_check():
    """Run pytest collection to check for syntax errors"""
    print("\nRunning syntax check...")
    test_dir = Path(__file__).parent
    
    result = subprocess.run(
        ["pytest", "--collect-only", "-q"],
        cwd=test_dir.parent,
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("✓ All tests collected successfully")
        print(f"  {result.stdout.strip()}")
        return True
    else:
        print("✗ Syntax errors found:")
        print(result.stdout)
        print(result.stderr)
        return False


def main():
    """Run all validation checks"""
    print("=" * 60)
    print("Bunch Up Backend Test Suite Validation")
    print("=" * 60)
    
    checks = [
        check_dependencies(),
        check_test_files(),
        run_syntax_check()
    ]
    
    print("\n" + "=" * 60)
    if all(checks):
        print("✅ Test suite is ready to run!")
        print("\nTo run tests:")
        print("  All tests:     pytest backend/tests/ -v")
        print("  Unit tests:    pytest backend/tests/ -v -m 'not selenium'")
        print("  Selenium:      pytest backend/tests/ -v -m selenium")
        print("\n  Or use:        python backend/tests/run_tests.py all")
        return 0
    else:
        print("❌ Test suite has issues. Please fix the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
