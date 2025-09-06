#!/usr/bin/env bash
set -euo pipefail
mkdir -p build
cd build
cmake ..
make -j$(nproc)
./trading_tests
