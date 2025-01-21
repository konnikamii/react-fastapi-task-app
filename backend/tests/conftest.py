import logging.config
import os
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from website.main import app

from website.config import settings
from website.database import get_db
from website.database import Base
from alembic import command
from website.oauth2 import create_access_token
from website import schemas
from website import models

SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{
    settings.database_hostname}:{settings.database_port}/{settings.database_name}_test'


engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

test_user_1 = {'username': 'testname',
               'email': 'test@test.com', 'password': 'qwerty123'}


@pytest.fixture(scope='function')
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope='function')
def client(session: Session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)


@pytest.fixture(scope='function')
def test_user(client: TestClient, session: Session):
    user_data = test_user_1.copy()
    res = client.post('/api/user/', data=user_data)
    assert res.status_code == 201
    new_user = session.query(models.User).filter(
        models.User.email == user_data['email']).first()
    assert new_user is not None
    new_user_dict = {
        'id': new_user.id,
        'username': new_user.username,
        'email': new_user.email,
        'password': user_data['password']
    }
    return new_user_dict


@pytest.fixture(scope='function')
def access_token(test_user):
    return create_access_token(data={"user_id": test_user['id'], "username": test_user['username']})


@pytest.fixture(scope='function')
def authorized_client(client: TestClient, access_token):
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {access_token}"
    }
    return client


@pytest.fixture(scope='function')
def test_tasks(test_user, session: Session):
    tasks_data = [{"title": "Title 1", "description": "Description 1",
                   "completed": True, "due_date": "2024-06-22", "owner_id": test_user["id"]},
                  {"title": "Title 2", "description": "Description 2",
                   "completed": True, "due_date": "2024-11-17", "owner_id": test_user["id"]},
                  {"title": "Title 3", "description": "Description 3",
                   "completed": False, "due_date": "2025-12-01", "owner_id": test_user["id"]}]

    def create_task_model(task):
        return models.Tasks(**task)
    task_map = map(create_task_model, tasks_data)
    tasks = list(task_map)
    session.add_all(tasks)
    session.commit()
    tasks = session.query(models.Tasks).all()
    return tasks


# Configure logging without rotation for tests
@pytest.fixture(scope='session', autouse=True)
def configure_logging():
    log_file_path = os.path.join(os.path.dirname(
        __file__), 'test_logs', 'test_log.jsonl')
    os.makedirs(os.path.dirname(log_file_path), exist_ok=True)
    logging.config.dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'file': {
                'class': 'logging.FileHandler',
                'formatter': 'json',
                'filename': log_file_path,
                'mode': 'a',
                'encoding': 'utf-8'
            }
        },
        'formatters': {
            'json': {
                'format': '{ "time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s" }'
            }
        },
        'root': {
            'level': 'DEBUG',
            'handlers': ['file']
        }
    })
