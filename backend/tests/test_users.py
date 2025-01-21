import pytest
import jwt  # pyjwt
from website import schemas
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key
from website.config import settings
import os
from .conftest import test_user_1
# from .database import client, session
from fastapi.testclient import TestClient

ALGORITHM = settings.algorithm
ROOT_PATH = os.path.join(os.path.dirname(__file__), '..')

with open(f'{ROOT_PATH}/keys/public_key.pem', 'rb') as key_file:
    public_key_pem = key_file.read()
    public_key = load_pem_public_key(public_key_pem)


def test_root(client: TestClient):
    res = client.get('/api')
    assert res.status_code == 200


def test_create_user(client: TestClient):
    res = client.post(
        '/api/user/', data=test_user_1.copy())
    assert res.status_code == 201


def test_login_user(test_user, client: TestClient):
    res = client.post(
        '/api/login/', data={'username': test_user['username'], 'password': test_user['password']})
    login_res = schemas.Token(**res.json())
    payload = jwt.decode(login_res.access_token,
                         public_key, algorithms=[ALGORITHM])
    id: str = payload.get('user_id')
    username: str = payload.get('username')
    assert id == test_user['id']
    assert username == test_user['username']
    assert login_res.token_type == "bearer"
    assert res.status_code == 200


@pytest.mark.parametrize("username, password, status_code", [
    (test_user_1['username'], 'wrongpass', 401),
    ("wrongname", test_user_1['password'], 401),
    ("wrongname", 'wrongpass', 401),
    ("wrongname", None, 401),
    (None, 'wrongpass', 401),
    (None, None, 401),
])
def test_incorrect_login_user(test_user, client: TestClient, username, password, status_code):
    res = client.post(
        '/api/login/', data={'username': username, 'password': password})
    assert res.status_code == status_code


def test_get_user(authorized_client: TestClient):
    res = authorized_client.get("/api/user/")
    assert res.status_code == 200
