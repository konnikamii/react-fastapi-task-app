import pytest


def test_get_task(authorized_client, test_tasks):
    res = authorized_client.get("/api/task/1")
    assert res.status_code == 200


@pytest.mark.parametrize("title, description, completed, due_date, status_code", [
    ("Title 1", "Desc 1", True, "2024-12-23", 201),
    ("Title 2", "Desc 2", False, None, 201),
    ("Title 3", None, True, "2024-12-23", 422),
    (None, "Desc 4", True, "2024-12-23", 422),
    (None, None, True, "2024-12-23", 422),
    ("Title 6", "Desc 6", 'tru', None, 422),
    ("Title 7", "Desc 7", None, None, 422),
    ("Title 8", "Desc 8", True, "2099-99-99", 422),
])
def test_create_task(authorized_client, title, description, completed, due_date, status_code):
    res = authorized_client.post("/api/task/", json={
        "title": title,
        "description": description,
        "completed": completed,
        "due_date": due_date
    })
    assert res.status_code == status_code


def test_update_task(authorized_client, test_tasks):
    res = authorized_client.put("/api/task/1", json={
        "title": "Changed!",
        "description": "No Descriptione.",
        "completed": False,
        "due_date": "2025-12-22"
    })
    assert res.status_code == 200


def test_delete_task(authorized_client, test_tasks):
    res = authorized_client.delete("/api/task/1")
    assert res.status_code == 200


def test_get_all_tasks(authorized_client, test_tasks):
    res = authorized_client.post(
        "/api/tasks/", json={"page": 1, "page_size": 10, "sort_by": "due_date", "sort_type": "asc"})
    assert res.status_code == 200
