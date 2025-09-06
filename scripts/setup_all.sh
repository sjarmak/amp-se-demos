#!/usr/bin/env bash
set -euo pipefail

# Root setup orchestrates per-project installs without starting dev servers.

echo "[setup] 01-node-express-ecommerce"
( cd projects/01-node-express-ecommerce && npm ci )

echo "[setup] 02-python-fastapi-logistics"
python -m venv .venv || true
source .venv/bin/activate || true
( cd projects/02-python-fastapi-logistics && python -m pip install --upgrade pip && pip install -r requirements.txt )

echo "[setup] 03-java-springboot-fintech"
( cd projects/03-java-springboot-fintech && ./mvnw -q -DskipTests package || mvn -q -DskipTests package )

echo "[setup] done"
