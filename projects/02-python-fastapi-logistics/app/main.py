from fastapi import FastAPI
from .db import Base, engine, SessionLocal, Shipment
from .services.shipments import list_shipments

app = FastAPI()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/shipments")
def shipments():
    with SessionLocal() as db:
        return list_shipments(db)
