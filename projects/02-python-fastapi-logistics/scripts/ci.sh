#!/usr/bin/env bash
set -euo pipefail
python -m pip install --upgrade pip
pip install -r requirements.txt
export DATABASE_URL=${DATABASE_URL:-${DATABASE_URL_PY:-postgresql://postgres:postgres@localhost:5432/logistics_db}}
python db/seed.py
pytest -q
