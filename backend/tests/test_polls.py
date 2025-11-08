"""
Tests for poll and voting endpoints
"""
import pytest


class TestPollEndpoints:
    """Test suite for poll and voting routes"""

    def test_create_poll_as_organizer(self, client, auth_headers_organizer, test_union):
        """Test creating a poll as an organizer"""
        response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Should we strike next week?",
                "union_id": test_union.id,
                "options": [
                    {"text": "Yes"},
                    {"text": "No"},
                    {"text": "Need more information"}
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["question"] == "Should we strike next week?"
        assert data["union_id"] == test_union.id
        assert len(data["options"]) == 3

    def test_create_poll_as_admin(self, client, auth_headers_admin):
        """Test creating a poll as an admin"""
        response = client.post(
            "/api/polls/",
            headers=auth_headers_admin,
            json={
                "question": "Admin poll question?",
                "options": [
                    {"text": "Option A"},
                    {"text": "Option B"}
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["question"] == "Admin poll question?"

    def test_create_poll_as_member_forbidden(self, client, auth_headers_member):
        """Test that members cannot create polls"""
        response = client.post(
            "/api/polls/",
            headers=auth_headers_member,
            json={
                "question": "Member poll?",
                "options": [
                    {"text": "Yes"},
                    {"text": "No"}
                ]
            }
        )
        assert response.status_code == 403

    def test_create_poll_insufficient_options(self, client, auth_headers_organizer):
        """Test creating poll with less than 2 options"""
        response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Invalid poll?",
                "options": [
                    {"text": "Only one option"}
                ]
            }
        )
        assert response.status_code == 400
        assert "at least two options" in response.json()["detail"].lower()

    def test_create_poll_no_options(self, client, auth_headers_organizer):
        """Test creating poll with no options"""
        response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "No options poll?",
                "options": []
            }
        )
        assert response.status_code == 400

    def test_list_polls(self, client, auth_headers_organizer):
        """Test listing all polls"""
        # Create some polls
        for i in range(3):
            client.post(
                "/api/polls/",
                headers=auth_headers_organizer,
                json={
                    "question": f"Poll question {i}?",
                    "options": [
                        {"text": f"Option A{i}"},
                        {"text": f"Option B{i}"}
                    ]
                }
            )
        
        response = client.get("/api/polls/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3

    def test_list_polls_pagination(self, client, auth_headers_organizer):
        """Test poll listing with pagination"""
        # Create multiple polls
        for i in range(5):
            client.post(
                "/api/polls/",
                headers=auth_headers_organizer,
                json={
                    "question": f"Paginated poll {i}?",
                    "options": [{"text": "Yes"}, {"text": "No"}]
                }
            )
        
        response = client.get("/api/polls/?skip=0&limit=3")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 3

    def test_vote_on_poll(self, client, auth_headers_member, auth_headers_organizer):
        """Test voting on a poll"""
        # Create a poll
        poll_response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Vote test poll?",
                "options": [
                    {"text": "Option 1"},
                    {"text": "Option 2"}
                ]
            }
        )
        poll_data = poll_response.json()
        poll_id = poll_data["id"]
        option_id = poll_data["options"][0]["id"]
        
        # Vote on the poll
        vote_response = client.post(
            f"/api/polls/{poll_id}/vote",
            headers=auth_headers_member,
            json={"option_id": option_id}
        )
        assert vote_response.status_code == 200
        results = vote_response.json()
        assert results["poll_id"] == poll_id
        assert "results" in results

    def test_vote_twice_forbidden(self, client, auth_headers_member, auth_headers_organizer):
        """Test that a user cannot vote twice on the same poll"""
        # Create a poll
        poll_response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Double vote test?",
                "options": [{"text": "Yes"}, {"text": "No"}]
            }
        )
        poll_data = poll_response.json()
        poll_id = poll_data["id"]
        option_id = poll_data["options"][0]["id"]
        
        # First vote
        client.post(
            f"/api/polls/{poll_id}/vote",
            headers=auth_headers_member,
            json={"option_id": option_id}
        )
        
        # Second vote attempt
        second_vote = client.post(
            f"/api/polls/{poll_id}/vote",
            headers=auth_headers_member,
            json={"option_id": option_id}
        )
        assert second_vote.status_code == 400
        assert "already voted" in second_vote.json()["detail"].lower()

    def test_vote_invalid_option(self, client, auth_headers_member, auth_headers_organizer):
        """Test voting with an invalid option_id"""
        # Create a poll
        poll_response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Invalid option test?",
                "options": [{"text": "Valid"}, {"text": "Also valid"}]
            }
        )
        poll_id = poll_response.json()["id"]
        
        # Vote with invalid option
        vote_response = client.post(
            f"/api/polls/{poll_id}/vote",
            headers=auth_headers_member,
            json={"option_id": 99999}
        )
        assert vote_response.status_code == 404
        assert "not found" in vote_response.json()["detail"].lower()

    def test_get_poll_results(self, client, auth_headers_member, auth_headers_organizer):
        """Test getting poll results"""
        # Create a poll
        poll_response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Results test poll?",
                "options": [
                    {"text": "Option A"},
                    {"text": "Option B"}
                ]
            }
        )
        poll_data = poll_response.json()
        poll_id = poll_data["id"]
        option_id = poll_data["options"][0]["id"]
        
        # Cast a vote
        client.post(
            f"/api/polls/{poll_id}/vote",
            headers=auth_headers_member,
            json={"option_id": option_id}
        )
        
        # Get results
        results_response = client.get(f"/api/polls/{poll_id}/results")
        assert results_response.status_code == 200
        results = results_response.json()
        assert results["poll_id"] == poll_id
        assert results["question"] == "Results test poll?"
        assert len(results["results"]) == 2
        # Check that vote was counted
        assert any(r["votes"] > 0 for r in results["results"])

    def test_get_results_nonexistent_poll(self, client):
        """Test getting results for non-existent poll"""
        response = client.get("/api/polls/99999/results")
        assert response.status_code == 404

    def test_vote_requires_auth(self, client, auth_headers_organizer):
        """Test that voting requires authentication"""
        # Create a poll
        poll_response = client.post(
            "/api/polls/",
            headers=auth_headers_organizer,
            json={
                "question": "Auth test poll?",
                "options": [{"text": "Yes"}, {"text": "No"}]
            }
        )
        poll_data = poll_response.json()
        poll_id = poll_data["id"]
        option_id = poll_data["options"][0]["id"]
        
        # Try to vote without auth
        vote_response = client.post(
            f"/api/polls/{poll_id}/vote",
            json={"option_id": option_id}
        )
        assert vote_response.status_code == 401
