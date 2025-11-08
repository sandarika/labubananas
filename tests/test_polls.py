def test_polls_vote_results(client, auth_token, member_token):
    # create two members
    r = client.post("/api/auth/register", json={"username": "bob", "password": "pw", "role": "member"})
    assert r.status_code == 200
    r2 = client.post("/api/auth/token", data={"username": "bob", "password": "pw", "grant_type": "password"})
    token_bob = r2.json()["access_token"]

    r3 = client.post("/api/auth/register", json={"username": "carol", "password": "pw", "role": "member"})
    assert r3.status_code == 200
    r4 = client.post("/api/auth/token", data={"username": "carol", "password": "pw", "grant_type": "password"})
    token_carol = r4.json()["access_token"]

    # organizer creates poll
    poll_payload = {
        "question": "Choose",
        "options": [{"text": "A"}, {"text": "B"}]
    }
    r_poll = client.post("/api/polls/", json=poll_payload, headers={"Authorization": f"Bearer {auth_token}"})
    assert r_poll.status_code == 200, r_poll.text
    poll_id = r_poll.json()["id"]

    # votes
    r_vote1 = client.post(f"/api/polls/{poll_id}/vote", json={"option_id": r_poll.json()["options"][0]["id"]}, headers={"Authorization": f"Bearer {token_bob}"})
    assert r_vote1.status_code == 200

    r_vote2 = client.post(f"/api/polls/{poll_id}/vote", json={"option_id": r_poll.json()["options"][1]["id"]}, headers={"Authorization": f"Bearer {token_carol}"})
    assert r_vote2.status_code == 200

    # bob tries to vote again -> 400
    r_vote_again = client.post(f"/api/polls/{poll_id}/vote", json={"option_id": r_poll.json()["options"][0]["id"]}, headers={"Authorization": f"Bearer {token_bob}"})
    assert r_vote_again.status_code == 400

    # results
    r_results = client.get(f"/api/polls/{poll_id}/results")
    assert r_results.status_code == 200
    res = r_results.json()
    counts = {o["text"]: o["votes"] for o in res["results"]}
    assert counts == {"A": 1, "B": 1}
