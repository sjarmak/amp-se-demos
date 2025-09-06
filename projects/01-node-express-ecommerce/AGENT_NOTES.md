# AGENT_NOTES

- Allowed tools: http_request, psql_migrate, search_in_repo, git_ops
- Guardrails: Do not modify db schema without adding/updating migration in db/migrations. Do not change scripts/ci.sh.
- Routing: Code edits limited to src/ and tests/; diagrams to docs/.
