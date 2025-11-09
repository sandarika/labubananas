import subprocess
import sys
from pathlib import Path

def start_backend():
    """Start the FastAPI backend server"""
    try:
        print("Starting backend server...")
        subprocess.Popen([sys.executable, "backend/main.py"], cwd=Path(__file__).parent)
    except Exception as e:
        print(f"Failed to start backend: {e}")

def start_frontend():
    """Start the frontend development server"""
    try:
        print("Starting frontend server...")
        subprocess.Popen(["npm", "start"], cwd=Path(__file__).parent / "frontend")
    except Exception as e:
        print(f"Failed to start frontend: {e}")

if __name__ == "__main__":
    # Start both servers
    start_backend()
    start_frontend()
    
    # Keep the main process running
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        sys.exit(0)