import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import init_db

init_db()  # create all tables before any test runs

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
