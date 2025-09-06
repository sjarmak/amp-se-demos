# AGENT_NOTES

- Allowed tools: http_request, psql_migrate (for MySQL), search_in_repo, git_ops
- Guardrails: Always use prepared statements; validate all inputs; escape output; use HTTPS in production configs
- Routing: Code in src/; tests in tests/; public files in public/; configs in config/
- PHP standards: Follow PSR-12 coding standards; use namespaces; prefer composition over inheritance; handle errors gracefully
- Security: Never store plaintext passwords; use CSRF tokens; sanitize all user inputs; implement proper session management
