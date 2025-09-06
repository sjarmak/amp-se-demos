import csv, os, datetime
from app.db import Base, engine, SessionLocal, Shipment

DATA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../datasets/logistics'))

def main():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        with open(os.path.join(DATA_ROOT,'shipments.csv')) as f:
            rd = csv.DictReader(f)
            for r in rd:
                s = Shipment(
                    id=int(r['id']),
                    route_id=int(r['route_id']),
                    carrier_id=int(r['carrier_id']),
                    status=r['status'],
                    created_at=datetime.datetime.fromisoformat(r['created_at'].replace('Z','+00:00'))
                )
                db.merge(s)
        db.commit()
    print('seeded logistics')

if __name__ == '__main__':
    main()
