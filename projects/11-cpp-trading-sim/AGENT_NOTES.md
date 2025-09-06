# AGENT_NOTES

- Allowed tools: search_in_repo, git_ops
- Guardrails: No heap allocations in hot paths; prefer stack/pool allocation; maintain const-correctness
- Routing: Code in src/; tests in tests/; build artifacts in build/; diagrams in docs/
- Performance: Always measure before optimizing; use compiler intrinsics judiciously; prefer standard library containers
