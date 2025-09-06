# amp-se-demos

A curated set of realistic demo projects to showcase Amp across common enterprise use cases. Includes multi-language stacks, mock datasets, reusable tools, and end-to-end demo flows.

- Quick start: scripts/setup_all.sh
- Choose a demo: see MASTER_DEMOS.md
- Run projects: each project has scripts/dev.sh, scripts/test.sh, scripts/lint.sh, scripts/ci.sh
- Enable tools: see AMP_TOOLBOX/README.md
- Alloy modes and large-context tips: see AGENTS.md
- JetBrains usage: JETBRAINS.md

## Quick start

1) Clone the repo
2) ./scripts/setup_all.sh
3) Open MASTER_DEMOS.md and pick a flow

## Projects

See PROJECTS.json for metadata and DEMO_FLOWS.md in each project for step-by-step flows.

## Scenario Engine (MVP)

Prereqs: Node 20 LTS. Setup: `npm install` at repo root.

Key files:
- Schema: docs/SCHEMA/scenario.schema.json
- Playbook template: docs/PLAYBOOK_TEMPLATES/playbook.md.hbs
- CLI: scripts/scenario_engine.ts
- Plan: docs/EXTENSIBILITY_PLAN.md
- Customization guide: docs/SCENARIO_CUSTOMIZATION_GUIDE.md
- Sample: projects/01-node-express-ecommerce/scenario.yml

Commands:
- Validate all scenarios: `npm run scenario:validate`
- Render playbooks to docs/generated/: `npm run scenario:render`
- Run a scenario: `npm run scenario:run node-cart-autotest`
- Enrich customer intel: `npm run scenario -- enrich "Acme Corp" -o docs/generated/research/acme.md`
  - Optional env: SF_INSTANCE_URL, SF_ACCESS_TOKEN, GITHUB_TOKEN

Authoring:
- Create projects/<project>/scenario.yml (conforms to schema) and talktracks under projects/<project>/talktracks/.
- List required tools in `toolbox` that exist in AMP_TOOLBOX/toolbox.config.json.
- Validate and render before PRs.

CI:
- .github/workflows/demo-ci.yml discovers scenario.yml files, validates, renders playbooks, and uploads docs/generated/ as an artifact.

Notes:
- docs/generated/ and .telemetry/ are ignored by git.
