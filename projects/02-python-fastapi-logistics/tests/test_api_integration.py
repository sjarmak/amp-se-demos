import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine, SessionLocal, Shipment

client = TestClient(app)

@pytest.fixture(autouse=True, scope='session')
def setup_db():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        db.add(Shipment(id=1, route_id=1, carrier_id=1, status='IN_TRANSIT', created_at='2025-01-01T00:00:00Z'))
        db.commit()


def test_health():
    r = client.get('/health')
    assert r.status_code == 200


def test_shipments_list():
    r = client.get('/shipments')
    assert r.status_code == 200
    assert isinstance(r.json(), list)
