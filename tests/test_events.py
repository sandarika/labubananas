import datetime


def test_event_creation_and_listing(client, auth_token, member_token):
    # organizer creates event
    now = datetime.datetime.utcnow()
    payload = {
        "title": "Meeting",
        "description": "Discuss conditions",
        "start_time": (now + datetime.timedelta(hours=1)).isoformat(),
        "end_time": (now + datetime.timedelta(hours=2)).isoformat(),
    }
    r = client.post("/api/events/", json=payload, headers={"Authorization": f"Bearer {auth_token}"})
    assert r.status_code == 200, r.text

    # member listing events
    r_list = client.get("/api/events/")
    assert r_list.status_code == 200
    events = r_list.json()
    assert len(events) >= 1
    assert events[0]["title"] == "Meeting"

    # member creating should fail
    r_fail = client.post("/api/events/", json=payload, headers={"Authorization": f"Bearer {member_token}"})
    assert r_fail.status_code == 403
