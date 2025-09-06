# AGENT_NOTES

- Allowed tools: search_in_repo, git_ops, http_request
- Guardrails: Use proper Result<T,E> error handling; avoid unwrap() in production code; prefer owned types over references in async contexts
- Routing: Code in src/; tests in tests/; benchmarks in benches/; diagrams in docs/
- Rust standards: Use clippy for lints; prefer iterators over loops; use #[derive] for common traits; follow naming conventions
