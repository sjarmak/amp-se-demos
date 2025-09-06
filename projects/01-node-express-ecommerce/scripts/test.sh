#!/usr/bin/env bash
set -euo pipefail
export DATABASE_URL=${DATABASE_URL:-${DATABASE_URL_NODE:-postgresql://postgres:postgres@localhost:5432/node_ecom}}
node db/seed.js || true
exec npm test
