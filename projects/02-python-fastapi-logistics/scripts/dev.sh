#!/usr/bin/env bash
set -euo pipefail
export DATABASE_URL=${DATABASE_URL:-${DATABASE_URL_PY:-postgresql://postgres:postgres@localhost:5432/logistics_db}}
uvicorn app.main:app --port 3002
