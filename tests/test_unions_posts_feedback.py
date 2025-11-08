def test_union_post_feedback_flow(client, auth_token, member_token):
    # create union with organizer token
    r = client.post("/api/unions/", json={"name": "UnionA", "description": "Desc"}, headers={"Authorization": f"Bearer {auth_token}"})
    assert r.status_code == 200, r.text
    union_id = r.json()["id"]

    # attempt create with member (should fail RBAC)
    r_fail = client.post("/api/unions/", json={"name": "UnionB"}, headers={"Authorization": f"Bearer {member_token}"})
    assert r_fail.status_code == 403

    # create post
    r_post = client.post(f"/api/posts/union/{union_id}", json={"title": "Hello", "content": "World"}, headers={"Authorization": f"Bearer {auth_token}"})
    assert r_post.status_code == 200
    post_id = r_post.json()["id"]

    # list posts
    r_list = client.get(f"/api/posts/union/{union_id}")
    assert r_list.status_code == 200
    assert len(r_list.json()) == 1

    # submit feedback with member token
    r_fb = client.post(f"/api/feedbacks/post/{post_id}", json={"message": "Looks good", "anonymous": True}, headers={"Authorization": f"Bearer {member_token}"})
    assert r_fb.status_code == 200
    fb = r_fb.json()
    assert fb["anonymous"] is True

    # list feedback
    r_fb_list = client.get(f"/api/feedbacks/post/{post_id}")
    assert r_fb_list.status_code == 200
    assert len(r_fb_list.json()) == 1
