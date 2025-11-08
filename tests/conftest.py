import os
import threading
import time
from contextlib import contextmanager

import pytest
import httpx
import uvicorn
from fastapi.testclient import TestClient

from backend.test_app import app


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(scope="session")
def auth_token(client):
    # register organizer
    r = client.post("/api/auth/register", json={"username": "organizer", "password": "pw", "role": "organizer"})
    assert r.status_code == 200
    # login
    data = {"username": "organizer", "password": "pw"}
    r2 = client.post("/api/auth/token", data={"username": data["username"], "password": data["password"], "grant_type": "password"})
    assert r2.status_code == 200
    return r2.json()["access_token"]


@pytest.fixture(scope="session")
def member_token(client):
    r = client.post("/api/auth/register", json={"username": "member1", "password": "pw", "role": "member"})
    assert r.status_code == 200
    r2 = client.post("/api/auth/token", data={"username": "member1", "password": "pw", "grant_type": "password"})
    assert r2.status_code == 200
    return r2.json()["access_token"]


@contextmanager
def run_server():
    """Run the FastAPI test app in a background thread for Selenium tests."""
    config = uvicorn.Config(app, host="127.0.0.1", port=8765, log_level="error")
    server = uvicorn.Server(config)

    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    # wait for server to start
    for _ in range(50):
        try:
            with httpx.Client() as c:
                resp = c.get("http://127.0.0.1:8765/")
                if resp.status_code == 200:
                    break
        except Exception:
            time.sleep(0.1)
    yield
    server.should_exit = True
    thread.join(timeout=5)


@pytest.fixture(scope="session")
def live_server():
    with run_server():
        yield "http://127.0.0.1:8765"
