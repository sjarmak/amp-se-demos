#!/usr/bin/env bash
set -euo pipefail

# Root setup orchestrates per-project installs without starting dev servers.

echo "[setup] 01-node-express-ecommerce"
(
  cd projects/01-node-express-ecommerce
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install --no-audit --no-fund
  fi
)

echo "[setup] 02-python-fastapi-logistics"
python -m venv .venv || true
source .venv/bin/activate || true
( cd projects/02-python-fastapi-logistics && python -m pip install --upgrade pip && pip install -r requirements.txt )

echo "[setup] 03-java-springboot-fintech"
(
  cd projects/03-java-springboot-fintech || exit 0
  if [ -x ./mvnw ]; then
    ./mvnw -q -DskipTests package || true
  elif command -v mvn >/dev/null 2>&1; then
    mvn -q -DskipTests package || true
  else
    echo "[setup] skipping Java project (maven not found)"
  fi
)

echo "[setup] done"
