# amp-se-demos bootstrap checklist

## Repo scaffolding

- [ ] Create repo root with: `README.md`, `MASTER_DEMOS.md`, `AGENTS.md`, `JETBRAINS.md`, `PROJECTS.json`, `LICENSE`, `.editorconfig`, `.gitignore`
- [ ] Add `.github/workflows/ci.yml`
- [ ] Add `scripts/` with `setup_all.sh`, `reset_all.sh`, `verify_all.sh` (chmod +x)

## AMP toolbox

- [ ] Create `AMP_TOOLBOX/README.md` with enable instructions
- [ ] Add `toolbox.config.json`
- [ ] Add tools: `http_request_tool.py`, `git_ops_tool.sh`, `psql_migrate_tool.py`, `screenshot_tool.py`, `search_in_repo_tool.py`

## Datasets

- [ ] `datasets/ecommerce/*`
- [ ] `datasets/fintech/*`
- [ ] `datasets/health/*`
- [ ] `datasets/logistics/*`
- [ ] `datasets/media/*`

## Projects scaffolded

- [ ] 01-node-express-ecommerce
- [ ] 02-python-fastapi-logistics
- [ ] 03-java-springboot-fintech
- [ ] 04-go-gin-media
- [ ] 05-dotnet-webapi-health
- [ ] 06-react-nextjs-ui
- [ ] 07-legacy-php-laravel-monolith
- [ ] 08-ruby-on-rails-auth-headers
- [ ] 09-sveltekit-dashboard
- [ ] 10-infra-iac-terraform

## Per project minimums

For each project:

- [ ] `README.md` with quick start
- [ ] `DEMO_FLOWS.md` with Quick Win, Core, Deep Dive
- [ ] `AGENT_NOTES.md` with routing, tools, guardrails
- [ ] `scripts/dev.sh`, `scripts/test.sh`, `scripts/lint.sh`, `scripts/ci.sh`
- [ ] `docs/` with at least one Mermaid or PlantUML file and render command
- [ ] One intentional bug or missing edge case
- [ ] Tests run locally and in CI target (where applicable)

## Wiring and realism

- [ ] Seed scripts connect datasets to Node, Python, Java projects
- [ ] Each applicable project has 1 API endpoint and 1 background task
- [ ] At least 1 integration test hitting a DB per DB-backed project
- [ ] Docker or docker-compose provided for DB-backed projects

## CI coverage

- [ ] `scripts/verify_all.sh` builds and tests projects 01, 02, 03
- [ ] CI green on a clean clone

## Master mapping

- [ ] `MASTER_DEMOS.md` table maps discovery situations to project, flow, talk track, value proof
- [ ] Include entries for unit tests gap, legacy decomposition, auth headers search, 200 ms throttle, alloy mode compare, UI iteration with screenshots

## AGENTS.md standards

- [ ] Version targeting rules
- [ ] Explicit dependencies, cleanup of resources
- [ ] Middleware order and DI rules
- [ ] Safe DB query patterns
- [ ] Commit and PR hygiene
- [ ] .NET section included

## JetBrains integration

- [ ] `JETBRAINS.md` with run configs, test runners, file watchers, Amp usage notes

## Validation

- [ ] `PROJECTS.json` lists stacks, datasets, capabilities, demo flows
- [ ] `scripts/verify_all.sh` runs without manual edits
- [ ] Diagrams render using documented command
- [ ] Final one-page summary printed by the agent

---

### Quick commands

- [ ] `./scripts/setup_all.sh`
- [ ] `./scripts/verify_all.sh`
- [ ] `git add -A && git commit -m "bootstrap: scaffold amp-se-demos" && git push`

### PR description helper

- [ ] Include links to CI run, `MASTER_DEMOS.md`, `PROJECTS.json`
- [ ] Paste a sample discovery situation and the chosen demo flow
- [ ] Attach screenshots of generated diagrams or UI diffs if relevant
