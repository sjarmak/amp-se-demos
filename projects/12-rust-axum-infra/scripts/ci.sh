#!/usr/bin/env bash
set -euo pipefail
rustup update
cargo clippy -- -D warnings
cargo test
