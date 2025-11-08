"""
Tests for event endpoints
"""
import pytest
from datetime import datetime, timedelta


class TestEventEndpoints:
    """Test suite for event management routes"""

    def test_create_event_as_organizer(self, client, auth_headers_organizer, test_union):
        """Test creating an event as an organizer"""
        start_time = datetime.utcnow() + timedelta(days=1)
        end_time = start_time + timedelta(hours=2)
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_organizer,
            json={
                "title": "Union Meeting",
                "description": "Monthly union meeting",
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "union_id": test_union.id
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Union Meeting"
        assert data["description"] == "Monthly union meeting"
        assert data["union_id"] == test_union.id

    def test_create_event_as_admin(self, client, auth_headers_admin):
        """Test creating an event as an admin"""
        start_time = datetime.utcnow() + timedelta(days=2)
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_admin,
            json={
                "title": "Admin Event",
                "description": "Admin organized event",
                "start_time": start_time.isoformat(),
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Admin Event"

    def test_create_event_as_member_forbidden(self, client, auth_headers_member):
        """Test that members cannot create events"""
        start_time = datetime.utcnow() + timedelta(days=1)
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_member,
            json={
                "title": "Member Event",
                "start_time": start_time.isoformat()
            }
        )
        assert response.status_code == 403

    def test_create_event_invalid_times(self, client, auth_headers_organizer):
        """Test creating event with end_time before start_time"""
        start_time = datetime.utcnow() + timedelta(days=1)
        end_time = start_time - timedelta(hours=1)  # Invalid: before start
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_organizer,
            json={
                "title": "Invalid Event",
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            }
        )
        assert response.status_code == 400
        assert "after start_time" in response.json()["detail"].lower()

    def test_create_event_no_end_time(self, client, auth_headers_organizer):
        """Test creating event without end_time (optional)"""
        start_time = datetime.utcnow() + timedelta(days=1)
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_organizer,
            json={
                "title": "Open-ended Event",
                "start_time": start_time.isoformat()
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["end_time"] is None

    def test_create_event_no_union(self, client, auth_headers_organizer):
        """Test creating event without union_id (optional)"""
        start_time = datetime.utcnow() + timedelta(days=1)
        
        response = client.post(
            "/api/events/",
            headers=auth_headers_organizer,
            json={
                "title": "General Event",
                "start_time": start_time.isoformat()
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["union_id"] is None

    def test_list_events(self, client, auth_headers_organizer):
        """Test listing all events"""
        # Create some events
        for i in range(3):
            start_time = datetime.utcnow() + timedelta(days=i+1)
            client.post(
                "/api/events/",
                headers=auth_headers_organizer,
                json={
                    "title": f"Event {i}",
                    "start_time": start_time.isoformat()
                }
            )
        
        response = client.get("/api/events/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3

    def test_list_events_pagination(self, client, auth_headers_organizer):
        """Test event listing with pagination"""
        # Create multiple events
        for i in range(5):
            start_time = datetime.utcnow() + timedelta(days=i+1)
            client.post(
                "/api/events/",
                headers=auth_headers_organizer,
                json={
                    "title": f"Paginated Event {i}",
                    "start_time": start_time.isoformat()
                }
            )
        
        response = client.get("/api/events/?skip=0&limit=3")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 3

    def test_list_events_ordered(self, client, auth_headers_organizer):
        """Test that events are ordered by start_time descending"""
        # Create events with different times
        times = [
            datetime.utcnow() + timedelta(days=3),
            datetime.utcnow() + timedelta(days=1),
            datetime.utcnow() + timedelta(days=2),
        ]
        
        for i, time in enumerate(times):
            client.post(
                "/api/events/",
                headers=auth_headers_organizer,
                json={
                    "title": f"Event {i}",
                    "start_time": time.isoformat()
                }
            )
        
        response = client.get("/api/events/")
        assert response.status_code == 200
        data = response.json()
        # Should be ordered by start_time descending
        # Most recent (latest date) should be first
        if len(data) >= 2:
            assert data[0]["start_time"] >= data[1]["start_time"]

    def test_create_event_no_auth(self, client):
        """Test creating event without authentication"""
        start_time = datetime.utcnow() + timedelta(days=1)
        
        response = client.post(
            "/api/events/",
            json={
                "title": "Unauth Event",
                "start_time": start_time.isoformat()
            }
        )
        assert response.status_code == 401
