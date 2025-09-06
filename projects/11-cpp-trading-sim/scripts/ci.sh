#!/usr/bin/env bash
set -euo pipefail
sudo apt-get update && sudo apt-get install -y cmake build-essential libgtest-dev
mkdir -p build
cd build
cmake ..
make -j$(nproc)
./trading_tests
