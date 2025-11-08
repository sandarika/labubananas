"""
Tests for authentication endpoints
"""
import pytest


class TestAuthEndpoints:
    """Test suite for authentication routes"""

    def test_register_new_user(self, client):
        """Test registering a new user"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "newuser",
                "password": "newpass123",
                "role": "member"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["role"] == "member"
        assert "id" in data
        assert "hashed_password" not in data  # Should not expose password

    def test_register_duplicate_username(self, client, test_user):
        """Test registering with an existing username"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "testmember",
                "password": "somepass",
                "role": "member"
            }
        )
        assert response.status_code == 400
        assert "already taken" in response.json()["detail"].lower()

    def test_login_success(self, client, test_user):
        """Test successful login"""
        response = client.post(
            "/api/auth/token",
            data={
                "username": "testmember",
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_user):
        """Test login with incorrect password"""
        response = client.post(
            "/api/auth/token",
            data={
                "username": "testmember",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent username"""
        response = client.post(
            "/api/auth/token",
            data={
                "username": "nonexistent",
                "password": "somepass"
            }
        )
        assert response.status_code == 401

    def test_get_current_user(self, client, auth_headers_member, test_user):
        """Test getting current user information"""
        response = client.get(
            "/api/auth/me",
            headers=auth_headers_member
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testmember"
        assert data["role"] == "member"

    def test_get_current_user_no_auth(self, client):
        """Test accessing /me without authentication"""
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_get_current_user_invalid_token(self, client):
        """Test accessing /me with invalid token"""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalidtoken"}
        )
        assert response.status_code == 401

    def test_register_organizer(self, client):
        """Test registering an organizer"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "neworganizer",
                "password": "orgpass123",
                "role": "organizer"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "organizer"

    def test_register_admin(self, client):
        """Test registering an admin"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "newadmin",
                "password": "adminpass123",
                "role": "admin"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "admin"
