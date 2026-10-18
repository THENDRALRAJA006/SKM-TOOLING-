"""Basic API tests for SKM Tooling Center backend."""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db

TEST_DATABASE_URL = "sqlite:///./test_skm.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    import time; time.sleep(0.1)
    try:
        os.remove("./test_skm.db")
    except (FileNotFoundError, PermissionError):
        pass  # Windows may still hold the file; safe to ignore in CI


client = TestClient(app)
_admin_token: dict = {"token": ""}


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert "SKM Tooling Center" in r.json()["app"]


def test_products_list():
    r = client.get("/api/products")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_product_not_found():
    r = client.get("/api/products/nonexistent-xyz-999")
    assert r.status_code == 404


def test_submit_valid_enquiry():
    r = client.post("/api/enquiries", data={
        "name": "Test Engineer",
        "email": "test@example.com",
        "description": "I need a quote for precision core inserts.",
        "consent": "true",
    })
    assert r.status_code == 201
    data = r.json()
    assert data["success"] is True
    assert data["reference"].startswith("ENQ-")


def test_submit_no_consent_rejected():
    r = client.post("/api/enquiries", data={
        "name": "Test", "email": "t@t.com",
        "description": "desc", "consent": "false",
    })
    assert r.status_code in (400, 422)


def test_submit_empty_description_rejected():
    r = client.post("/api/enquiries", data={
        "name": "Test", "email": "t@t.com",
        "description": "", "consent": "true",
    })
    assert r.status_code in (400, 422)


def test_login_fails_without_admin():
    r = client.post("/api/admin/login",
        data={"username": "admin", "password": "wrong"},
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert r.status_code == 401


def test_create_first_admin():
    r = client.post("/api/admin/create-admin", json={
        "email": "admin@test.local",
        "username": "testadmin",
        "password": "SecurePass123",
        "role": "admin",
    })
    assert r.status_code == 201
    assert r.json()["username"] == "testadmin"


def test_login_success():
    r = client.post("/api/admin/login",
        data={"username": "testadmin", "password": "SecurePass123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert r.status_code == 200
    _admin_token["token"] = r.json()["access_token"]


def test_dashboard_requires_auth():
    r = client.get("/api/admin/dashboard")
    assert r.status_code == 401


def test_dashboard_with_token():
    r = client.get("/api/admin/dashboard",
        headers={"Authorization": f"Bearer {_admin_token['token']}"})
    assert r.status_code == 200
    data = r.json()
    assert "total_enquiries" in data


def test_admin_enquiries_requires_auth():
    r = client.get("/api/enquiries/admin/all")
    assert r.status_code == 401


def test_admin_enquiries_with_token():
    r = client.get("/api/enquiries/admin/all",
        headers={"Authorization": f"Bearer {_admin_token['token']}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_second_admin_creation_blocked():
    r = client.post("/api/admin/create-admin", json={
        "email": "second@test.local",
        "username": "second",
        "password": "AnotherPass123",
    })
    assert r.status_code == 403
