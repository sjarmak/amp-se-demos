#!/usr/bin/env bash
set -euo pipefail
# amp_apply.sh "<prompt text>" <context_path>
PROMPT=${1:-}
CONTEXT_PATH=${2:-}
if [[ -z "$PROMPT" ]]; then
  echo "Usage: amp_apply.sh \"<prompt text>\" <context_path>" >&2
  exit 2
fi
CONTEXT_CONTENT=""
if [[ -n "${CONTEXT_PATH:-}" && -f "$CONTEXT_PATH" ]]; then
  CONTEXT_CONTENT=$(cat "$CONTEXT_PATH")
fi
TMP_PROMPT=$(mktemp)
cat > "$TMP_PROMPT" <<'EOF'
You are Amp. Apply non-interactive changes to this repository.
Follow all repo conventions and EXTENSIBILITY_PLAN.md.
EOF
# append dynamic context and task
{
  echo "\n--- Context (from file) ---\n"
  echo "$CONTEXT_CONTENT"
  echo "\n--- Task ---\n$PROMPT\n"
  echo "\nConstraints:\n- Keep scenario.yml valid (docs/SCHEMA/scenario.schema.json).\n- Update talk tracks under projects/*/talktracks/.\n- Avoid committing secrets; do not change CI config.\n"
} >> "$TMP_PROMPT"

# Require amp CLI
if ! command -v amp >/dev/null 2>&1; then
  echo "amp CLI not found in PATH. Install Amp CLI to use this tool." >&2
  rm -f "$TMP_PROMPT"
  exit 127
fi

amp -x < "$TMP_PROMPT"
rm -f "$TMP_PROMPT"
