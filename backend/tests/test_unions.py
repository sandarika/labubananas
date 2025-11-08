"""
Tests for union endpoints
"""
import pytest


class TestUnionEndpoints:
    """Test suite for union management routes"""

    def test_create_union_as_organizer(self, client, auth_headers_organizer):
        """Test creating a union as an organizer"""
        response = client.post(
            "/api/unions/",
            headers=auth_headers_organizer,
            json={
                "name": "New Workers Union",
                "description": "A union for new workers"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Workers Union"
        assert data["description"] == "A union for new workers"
        assert "id" in data
        assert "created_at" in data

    def test_create_union_as_admin(self, client, auth_headers_admin):
        """Test creating a union as an admin"""
        response = client.post(
            "/api/unions/",
            headers=auth_headers_admin,
            json={
                "name": "Admin Created Union",
                "description": "Created by admin"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Admin Created Union"

    def test_create_union_as_member_forbidden(self, client, auth_headers_member):
        """Test that members cannot create unions"""
        response = client.post(
            "/api/unions/",
            headers=auth_headers_member,
            json={
                "name": "Member Union",
                "description": "Should fail"
            }
        )
        assert response.status_code == 403

    def test_create_union_no_auth(self, client):
        """Test creating union without authentication"""
        response = client.post(
            "/api/unions/",
            json={
                "name": "Unauth Union",
                "description": "Should fail"
            }
        )
        assert response.status_code == 401

    def test_create_duplicate_union(self, client, auth_headers_organizer, test_union):
        """Test creating a union with duplicate name"""
        response = client.post(
            "/api/unions/",
            headers=auth_headers_organizer,
            json={
                "name": "Test Workers Union",  # Same as test_union
                "description": "Duplicate"
            }
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    def test_list_unions(self, client, test_union):
        """Test listing all unions"""
        response = client.get("/api/unions/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(u["name"] == "Test Workers Union" for u in data)

    def test_list_unions_pagination(self, client, auth_headers_organizer):
        """Test union listing with pagination"""
        # Create multiple unions
        for i in range(5):
            client.post(
                "/api/unions/",
                headers=auth_headers_organizer,
                json={
                    "name": f"Union {i}",
                    "description": f"Description {i}"
                }
            )
        
        # Test with limit
        response = client.get("/api/unions/?skip=0&limit=3")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 3

    def test_get_union_by_id(self, client, test_union):
        """Test getting a specific union by ID"""
        response = client.get(f"/api/unions/{test_union.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_union.id
        assert data["name"] == "Test Workers Union"
        assert data["description"] == "A test union for testing purposes"

    def test_get_nonexistent_union(self, client):
        """Test getting a union that doesn't exist"""
        response = client.get("/api/unions/99999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_create_union_no_description(self, client, auth_headers_organizer):
        """Test creating a union without description (optional field)"""
        response = client.post(
            "/api/unions/",
            headers=auth_headers_organizer,
            json={
                "name": "Minimal Union"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Minimal Union"
        assert data["description"] is None

    def test_union_has_posts_relationship(self, client, test_union, test_post):
        """Test that union response includes posts relationship"""
        response = client.get(f"/api/unions/{test_union.id}")
        assert response.status_code == 200
        data = response.json()
        assert "posts" in data
        assert isinstance(data["posts"], list)
