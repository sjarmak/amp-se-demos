#!/usr/bin/env python3
import os, sys
import psycopg

# usage: psql_migrate_tool.py sql_file.sql

def main():
    if len(sys.argv) < 2:
        print("usage: psql_migrate_tool.py path/to.sql", file=sys.stderr)
        sys.exit(1)
    dsn = os.environ.get("DATABASE_URL") or os.environ.get("DATABASE_URL_NODE") or os.environ.get("DATABASE_URL_PY")
    if not dsn:
        print("DATABASE_URL env var required", file=sys.stderr)
        sys.exit(2)
    sql_path = sys.argv[1]
    with open(sql_path, 'r') as f:
        sql = f.read()
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            conn.commit()
    print("applied:", sql_path)

if __name__ == '__main__':
    main()
