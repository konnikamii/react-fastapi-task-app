

import pytest


@pytest.mark.parametrize("name, email, subject, message, status_code", [
    ("name1", "test@test.com", 'subject 1', "message 1", 201),
    ("name2", "test@test.com", 'subject 2', None, 400),
    ("name3", "test@test.com", None, "message 3", 400),
    ("name4", None, 'subject 4', "message 4", 422),
    (None, "test@test.com", 'subject 5', "message 5", 400),
    (f"name{'6'*200}", "test@test.com", 'subject 6', "message 6", 400),
    ("name7", f"test@{'t'*200}est.com", 'subject 7', "message 7", 422),
    ("name8", "test@test.com", f'subject {'8'*200}', "message 8", 400),
    ("name9", "test@test.com", 'subject 9', f"message {'9'*1500}", 400),
])
def test_create_contact(client, name, email, subject, message, status_code):
    res = client.post("/api/contact/", data={
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
    })
    assert res.status_code == status_code
