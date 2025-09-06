#!/usr/bin/env bash
set -euo pipefail

# Verify key projects build and test

export DATABASE_URL_NODE=${DATABASE_URL_NODE:-postgresql://postgres:postgres@localhost:5432/node_ecom}
export DATABASE_URL_PY=${DATABASE_URL_PY:-postgresql://postgres:postgres@localhost:5432/logistics_db}
export DATABASE_URL_JAVA=${DATABASE_URL_JAVA:-jdbc:postgresql://localhost:5432/fintech_db}
export PGUSER=${PGUSER:-postgres}
export PGPASSWORD=${PGPASSWORD:-postgres}

pushd projects/01-node-express-ecommerce >/dev/null
./scripts/ci.sh
popd >/dev/null

pushd projects/02-python-fastapi-logistics >/dev/null
./scripts/ci.sh
popd >/dev/null

pushd projects/03-java-springboot-fintech >/dev/null
./scripts/ci.sh
popd >/dev/null

echo "All verifications passed"
