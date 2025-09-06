# AGENTS.md

This repo is optimized for Amp-driven workflows. Follow these standards to ensure consistent, reliable demos.

- Version targeting: Prefer LTS runtimes (Node 20, Python 3.11, Java 17, Go 1.22, .NET 8)
- Dependencies: Declare explicit versions; avoid global installs
- Commits/PRs: Small, focused commits with imperative messages; PRs include rationale, risks, validation checklist, and link to Amp thread
- Testing: Write unit + at least one integration test per project; keep tests deterministic
- Middleware order: Auth → Validation → Business Logic → Persistence → Response
- DI rules: Prefer constructor injection or lightweight factory functions
- DB safety: Use parameterized queries; migrations are idempotent; never log secrets
- Cleanup: Reset any test DB state in setup/teardown; no background processes in scripts
- Diagrams: Generate PlantUML/Mermaid into docs/ and reference in PRs
- Large context: Use file lists and outline prompts; prefer code-linked references
- Alloy mode: Use plan/implement split; specify roles for models; compare latency/cost in PR
- JetBrains: Use run configs per project; see JETBRAINS.md
- .NET specifics: Target net8.0; nullable enabled; async naming with Async suffix; DI via minimal APIs or Program.cs; use EF Core Migrations; avoid static state in tests

Tooling
- Use AMP_TOOLBOX tools for HTTP, git, psql, screenshot, and search operations
- Register tools per AMP_TOOLBOX/README.md

Repo conventions
- Root scripts orchestrate install/verify; project scripts implement dev/test/lint/ci
- Datasets in datasets/ are used by Node, Python, and Java seeders
