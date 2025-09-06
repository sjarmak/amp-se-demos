import time
from sqlalchemy.orm import Session
from ..db import Shipment

_last_ts = 0

# Intentional: throttle not yet 200ms; to be implemented in demo flows

def list_shipments(db: Session):
    return db.query(Shipment).order_by(Shipment.id).all()

async def throttled_fetch(fn, *args, **kwargs):
    global _last_ts
    now = time.time()
    # placeholder throttle: no delay
    _last_ts = now
    return await fn(*args, **kwargs)
