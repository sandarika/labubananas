def test_chatbot_returns_suggestions(client):
    r = client.post("/api/chatbot/ask", json={"question": "What if I am fired?"})
    assert r.status_code == 200
    data = r.json()
    assert "answer" in data
    assert isinstance(data.get("suggestions"), list)
    assert len(data["suggestions"]) >= 1
