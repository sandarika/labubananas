"""
Tests for feedback endpoints
"""
import pytest


class TestFeedbackEndpoints:
    """Test suite for feedback routes"""

    def test_create_feedback_anonymous(self, client, auth_headers_member, test_post):
        """Test creating anonymous feedback"""
        response = client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={
                "message": "This is anonymous feedback",
                "anonymous": True
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "This is anonymous feedback"
        assert data["anonymous"] is True
        assert data["post_id"] == test_post.id

    def test_create_feedback_non_anonymous(self, client, auth_headers_member, test_post):
        """Test creating non-anonymous feedback"""
        response = client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={
                "message": "This is public feedback",
                "anonymous": False
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "This is public feedback"
        assert data["anonymous"] is False

    def test_create_feedback_default_anonymous(self, client, auth_headers_member, test_post):
        """Test that feedback defaults to non-anonymous"""
        response = client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={
                "message": "Default feedback"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["anonymous"] is False

    def test_create_feedback_nonexistent_post(self, client, auth_headers_member):
        """Test creating feedback for non-existent post"""
        response = client.post(
            "/api/feedbacks/post/99999",
            headers=auth_headers_member,
            json={
                "message": "Should fail",
                "anonymous": True
            }
        )
        assert response.status_code == 404

    def test_list_feedbacks_for_post(self, client, test_post, auth_headers_member):
        """Test listing all feedbacks for a post"""
        # Create some feedbacks
        client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={"message": "Feedback 1", "anonymous": True}
        )
        client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={"message": "Feedback 2", "anonymous": False}
        )
        
        response = client.get(f"/api/feedbacks/post/{test_post.id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2

    def test_get_feedback_by_id(self, client, auth_headers_member, test_post):
        """Test getting a specific feedback by ID"""
        # Create feedback first
        create_response = client.post(
            f"/api/feedbacks/post/{test_post.id}",
            headers=auth_headers_member,
            json={"message": "Test feedback", "anonymous": True}
        )
        feedback_id = create_response.json()["id"]
        
        response = client.get(f"/api/feedbacks/{feedback_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == feedback_id
        assert data["message"] == "Test feedback"

    def test_get_nonexistent_feedback(self, client):
        """Test getting feedback that doesn't exist"""
        response = client.get("/api/feedbacks/99999")
        assert response.status_code == 404

    def test_feedback_requires_auth(self, client, test_post):
        """Test that creating feedback requires authentication"""
        response = client.post(
            f"/api/feedbacks/post/{test_post.id}",
            json={"message": "Unauth feedback"}
        )
        # Depends on implementation - might be 401
        assert response.status_code in [401, 403]

    def test_list_feedbacks_empty_post(self, client, auth_headers_organizer, test_union):
        """Test listing feedbacks for a post with no feedbacks"""
        # Create a new post without feedbacks
        post_response = client.post(
            f"/api/posts/union/{test_union.id}",
            headers=auth_headers_organizer,
            json={"title": "Empty Post", "content": "No feedbacks"}
        )
        post_id = post_response.json()["id"]
        
        response = client.get(f"/api/feedbacks/post/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
