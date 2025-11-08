"""
Tests for post endpoints
"""
import pytest


class TestPostEndpoints:
    """Test suite for post management routes"""

    def test_create_post_as_organizer(self, client, auth_headers_organizer, test_union):
        """Test creating a post as an organizer"""
        response = client.post(
            f"/api/posts/union/{test_union.id}",
            headers=auth_headers_organizer,
            json={
                "title": "Important Announcement",
                "content": "This is an important message for all union members."
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Important Announcement"
        assert data["content"] == "This is an important message for all union members."
        assert data["union_id"] == test_union.id
        assert "id" in data
        assert "created_at" in data

    def test_create_post_as_admin(self, client, auth_headers_admin, test_union):
        """Test creating a post as an admin"""
        response = client.post(
            f"/api/posts/union/{test_union.id}",
            headers=auth_headers_admin,
            json={
                "title": "Admin Post",
                "content": "Posted by admin"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Admin Post"

    def test_create_post_as_member_forbidden(self, client, auth_headers_member, test_union):
        """Test that members cannot create posts"""
        response = client.post(
            f"/api/posts/union/{test_union.id}",
            headers=auth_headers_member,
            json={
                "title": "Member Post",
                "content": "Should fail"
            }
        )
        assert response.status_code == 403

    def test_create_post_no_auth(self, client, test_union):
        """Test creating post without authentication"""
        response = client.post(
            f"/api/posts/union/{test_union.id}",
            json={
                "title": "Unauth Post",
                "content": "Should fail"
            }
        )
        assert response.status_code == 401

    def test_create_post_nonexistent_union(self, client, auth_headers_organizer):
        """Test creating a post for a non-existent union"""
        response = client.post(
            "/api/posts/union/99999",
            headers=auth_headers_organizer,
            json={
                "title": "Test Post",
                "content": "Should fail"
            }
        )
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_list_posts_for_union(self, client, test_union, test_post):
        """Test listing all posts for a union"""
        response = client.get(f"/api/posts/union/{test_union.id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(p["title"] == "Test Post" for p in data)

    def test_list_posts_pagination(self, client, auth_headers_organizer, test_union):
        """Test post listing with pagination"""
        # Create multiple posts
        for i in range(5):
            client.post(
                f"/api/posts/union/{test_union.id}",
                headers=auth_headers_organizer,
                json={
                    "title": f"Post {i}",
                    "content": f"Content {i}"
                }
            )
        
        # Test with limit
        response = client.get(f"/api/posts/union/{test_union.id}?skip=0&limit=3")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 3

    def test_get_post_by_id(self, client, test_post):
        """Test getting a specific post by ID"""
        response = client.get(f"/api/posts/{test_post.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_post.id
        assert data["title"] == "Test Post"
        assert data["content"] == "This is a test post content"

    def test_get_nonexistent_post(self, client):
        """Test getting a post that doesn't exist"""
        response = client.get("/api/posts/99999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_post_has_feedbacks_relationship(self, client, test_post):
        """Test that post response includes feedbacks relationship"""
        response = client.get(f"/api/posts/{test_post.id}")
        assert response.status_code == 200
        data = response.json()
        assert "feedbacks" in data
        assert isinstance(data["feedbacks"], list)

    def test_list_posts_empty_union(self, client, auth_headers_organizer):
        """Test listing posts for a union with no posts"""
        # Create a new union without posts
        union_response = client.post(
            "/api/unions/",
            headers=auth_headers_organizer,
            json={"name": "Empty Union", "description": "No posts"}
        )
        union_id = union_response.json()["id"]
        
        response = client.get(f"/api/posts/union/{union_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
