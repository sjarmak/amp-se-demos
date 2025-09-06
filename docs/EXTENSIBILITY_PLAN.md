# Extensibility & Scenario-Driven Demo Plan

This document proposes a scenario-centric, extensible architecture for amp-se-demos so Solution Engineers can quickly assemble customer-specific demos focused on business outcomes rather than feature tours.

## 1. Goals & Non-Goals

Goals
- Modular, scenario-centric demos that compose code, data, and talk-tracks.
- Declarative authoring of scenarios; repeatable value proofs (tests/metrics/artefacts).
- Guided playbooks/talk-tracks; usage telemetry for outcome evidence.

Non-Goals
- Hosted web app; we stay CLI/Markdown + CI.
- Replacing existing project scaffolds; we reuse them.

## 2. Architecture Overview

Key ideas
- Scenario-centric: smallest addressable unit = Scenario (problem → solution → proof).
- Demo pack: bundle of scenarios bound to a project/vertical.
- Scenario Engine: single CLI to validate metadata, render playbooks, execute flows, collect metrics.

Diagram
```
Demo Pack (project + datasets + scenario.yml) ──▶ Scenario Registry (YAML)
      └─▶ Scenario Engine (validate/render/run)
                    └─▶ CI/CD (matrix validate/build/test/publish)
```

## 3. Metadata Model (scenario.yml)

Example
```yaml
id: node-cart-autotest
title: Auto-generate unit tests for cart service
level: quick-win
project: 01-node-express-ecommerce
prerequisites:
  - Node 20 LTS
  - Postgres (env: DATABASE_URL_NODE)
problem_statement: >
  We need faster test creation for our cart logic to reduce regressions.
solution_summary: >
  Use Amp to scaffold Jest tests, achieve +20 % coverage, and validate in CI.
flow:
  - step: search_src
    description: "Locate cart.js service"
  - step: generate_tests
    description: "Prompt Amp to create Jest tests"
  - step: run_coverage
    description: "npm test -- --coverage"
value_proof:
  metrics:
    - name: coverage_delta
      target: ">=0.20"
    - name: tests_green
      target: true
talk_track: talktracks/node-cart-autotest.md
toolbox: [http_request, git_ops]
estimated_duration_min: 7
```

Schema (excerpt)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Scenario",
  "type": "object",
  "required": ["id", "title", "project", "flow", "value_proof"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "title": { "type": "string" },
    "level": { "enum": ["quick-win", "core", "deep-dive"] },
    "project": { "type": "string" },
    "flow": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["step", "description"],
        "properties": { "step": {"type":"string"}, "description": {"type":"string"} }
      }
    },
    "value_proof": {
      "type": "object",
      "properties": {
        "metrics": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "target"],
            "properties": {"name": {"type":"string"}, "target": {}}
          }
        }
      }
    }
  }
}
```

## 4. Repo Structure Changes

```
/projects/
  01-node-express-ecommerce/
    scenario.yml           # one or more per project
    talktracks/*.md
    scripts/flows/
/docs/
  EXTENSIBILITY_PLAN.md
  SCHEMA/scenario.schema.json
  PLAYBOOK_TEMPLATES/
scripts/
  scenario_engine.ts       # validate/render/run
  generate_playbook.ts
.github/workflows/
  demo-ci.yml
```

## 5. Automation & Scripts

Commands
```bash
# Validate all scenarios
npm run scenario validate

# Render playbooks to docs/generated/
npm run scenario render-playbook

# Execute a scenario locally
npm run scenario run node-cart-autotest
```

NPM scripts
```json
{
  "scripts": {
    "scenario": "ts-node scripts/scenario_engine.ts",
    "scenario:ci": "npm run scenario validate && npm run test"
  }
}
```

## 6. CI/CD Pipeline Changes

- Matrix derives from discovered scenario.yml files.
- Steps: checkout → setup runtimes → scenario validate → verify_all.sh → render playbooks → upload artifacts.
- Required checks: scenario-validate, demo-tests, doc-publish.

## 7. Playbook & Talk-Track Templates

Template: docs/PLAYBOOK_TEMPLATES/playbook.md.hbs
```
# {{title}}

|                |                                |
|----------------|--------------------------------|
| Duration       | {{estimated_duration_min}} min |
| Project        | {{project}}                    |
| Level          | {{level}}                      |
| Problem        | {{problem_statement}}          |
| Solution       | {{solution_summary}}           |

## Step-by-step
{{#each flow}}
1. **{{step}}** – {{description}}
{{/each}}

## Value Proof
{{#each value_proof.metrics}}
- {{name}} → target **{{target}}**
{{/each}}
```

## 8. AMP_TOOLBOX Registration & Policy

- Every scenario lists required tools; Scenario Engine checks tools exist in AMP_TOOLBOX/toolbox.config.json.
- Add policy to AGENTS.md for tool security review and version pinning.

Example (scenario.yml)
```yaml
toolbox: [http_request, git_ops]
```

## 9. Telemetry & Metrics (Value Proof)

- Scenario Engine emits JSONL to .telemetry/{scenario_id}.jsonl capturing metrics like coverage_delta, tests_green, perf timings.
- GH Actions uploads artefacts; optional export to external analytics.

Example record
```json
{"ts":"2025-09-06T12:00:00Z","metric":"coverage_delta","value":0.23}
```

## 10. Rollout Plan & Timeline

| Phase | Week | Deliverables |
|------|------|--------------|
| Design freeze | 1 | Final schema + plan PR |
| Scenario Engine POC | 2–3 | validate + render |
| Migrate pilot scenarios | 4–5 | Node, Python, Java quick-wins |
| CI integration | 6 | matrix validate/build/test |
| Telemetry MVP | 7 | JSONL artefacts + charts |
| Full migration | 8–10 | All MASTER_DEMOS via scenario.yml |
| Enablement | 11 | Authoring guide + workshop |
| GA | 12 | Enforce scenario.yml for new demos |

## 11. Acceptance Criteria

- 100% demos have valid scenario.yml.
- scenario validate passes locally/CI; playbooks auto-generated under docs/generated/.
- CI ≤ 15 min for matrix.
- Telemetry artefacts present for metrics.

## 12. Risks & Mitigations

- Schema drift: version schema; regression tests.
- CI time growth: parallel matrix, caching, selective runs.
- Over-complex metadata: iterate minimally; authoring guide.
- Toolbox security: review process; restrict network; pinned versions.
- Contributor learning curve: scaffolding scripts + templates + walkthrough.
