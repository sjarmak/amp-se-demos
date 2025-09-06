#!/usr/bin/env bash
set -euo pipefail
# Simple git ops: status|log|show|diff
cmd=${1:-status}
shift || true
case "$cmd" in
  status) git status --porcelain=v1;;
  log) git --no-pager log --oneline -n ${1:-10};;
  show) git --no-pager show ${1:-HEAD};;
  diff) git --no-pager diff ${1:-HEAD};;
  *) echo "unknown subcommand"; exit 1;;
 esac
