#!/usr/bin/env bash
set -euo pipefail

find projects -name node_modules -type d -prune -exec rm -rf {} + || true
find . -name "__pycache__" -type d -prune -exec rm -rf {} + || true
find projects -name target -type d -prune -exec rm -rf {} + || true
find . -name .pytest_cache -type d -prune -exec rm -rf {} + || true
rm -rf .venv || true

echo "Reset complete."
