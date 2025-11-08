def test_register_login_me(client):
    # register a user
    r = client.post("/api/auth/register", json={"username": "alice", "password": "secret", "role": "member"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["username"] == "alice"

    # login
    r2 = client.post(
        "/api/auth/token",
        data={"username": "alice", "password": "secret", "grant_type": "password"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r2.status_code == 200, r2.text
    token = r2.json()["access_token"]

    # get current user
    r3 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r3.status_code == 200
    me = r3.json()
    assert me["username"] == "alice"
