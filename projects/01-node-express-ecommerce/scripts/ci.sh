#!/usr/bin/env bash
set -euo pipefail
if [ -f package-lock.json ]; then
  npm ci
else
  npm install --no-audit --no-fund
fi
export DATABASE_URL=${DATABASE_URL:-${DATABASE_URL_NODE:-postgresql://postgres:postgres@localhost:5432/node_ecom}}
node db/seed.js
npm test
