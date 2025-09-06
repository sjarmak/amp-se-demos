# Scenario Customization Guide

## Overview

The Scenario Engine enables SEs to rapidly create customer-specific demos by:
1. **Forking base scenarios** - Clone proven demo patterns
2. **Customizing context** - Adapt problem/solution to customer's domain
3. **Generating artifacts** - Auto-create playbooks, metrics, talk tracks
4. **Scaling delivery** - Reuse across similar customer profiles

## Detailed Customer Example: FinTech API Testing

### Context
**Customer:** TradeFast Solutions
- **Stack:** React frontend, Node.js/Express APIs, PostgreSQL
- **Pain:** Manual API testing delays releases by 2 weeks; compliance requires extensive test coverage
- **Goal:** Demonstrate Amp reducing testing overhead by 50%

### Step 1: Fork Base Scenario

**SE starts with existing scenario:**
```bash
# Copy base scenario
cp projects/01-node-express-ecommerce/scenario.yml projects/tradefast-api-demo/scenario.yml
mkdir -p projects/tradefast-api-demo/talktracks
```

### Step 2: Customize Scenario Metadata

**Edit `projects/tradefast-api-demo/scenario.yml`:**
```yaml
id: tradefast-api-testing
title: Auto-generate compliance-ready API tests for trading endpoints
level: core
project: tradefast-api-demo
prerequisites:
  - Node 20 LTS
  - PostgreSQL (trading data)
  - Compliance test framework
problem_statement: >
  Manual API testing for trading endpoints creates 2-week release bottlenecks.
  Compliance requires 90% test coverage but writing tests manually is time-intensive
  and error-prone, especially for complex market data validation scenarios.
solution_summary: >
  Use Amp to auto-generate Jest API tests with compliance assertions,
  achieve 90% coverage in minutes, reduce release cycle from 2 weeks to 1 week.
flow:
  - step: audit_existing_apis
    description: "Scan src/routes/ for trading API endpoints"
  - step: generate_compliance_tests
    description: "Prompt Amp: 'Generate Jest tests for trading APIs with regulatory validation'"
  - step: validate_market_data
    description: "Add tests for price feeds, order validation, risk checks"
  - step: run_coverage_report
    description: "npm test -- --coverage --reporter=compliance"
  - step: demo_ci_integration
    description: "Show tests running in CI pipeline with compliance gates"
value_proof:
  metrics:
    - name: test_coverage_percentage
      target: ">=0.90"
    - name: api_endpoints_tested
      target: ">=15"
    - name: compliance_assertions
      target: ">=30"
    - name: time_saved_hours
      target: ">=40"
talk_track: talktracks/tradefast-api-testing.md
toolbox: [http_request, git_ops, psql_migrate]
estimated_duration_min: 12
```

### Step 3: Create Custom Talk Track

**Create `projects/tradefast-api-demo/talktracks/tradefast-api-testing.md`:**
```markdown
# TradeFast API Testing Demo - Talk Track

## Opening (2 min)
"I know you're struggling with API testing bottlenecks that are delaying your trading feature releases. 
Let me show you how Amp can auto-generate comprehensive test suites that meet your compliance requirements."

## Context Setting (1 min)
- TradeFast processes $50M+ daily trading volume
- Regulatory requirements demand 90% test coverage
- Manual testing takes 80 hours per release cycle
- Current 2-week release cycle is too slow for competitive market

## Demo Flow (8 min)

### 1. Audit Trading APIs (1 min)
"Let's start by having Amp scan your trading endpoints..."
- Show: `src/routes/trading.js`, `src/routes/orders.js`, `src/routes/risk.js`
- Highlight: Complex validation logic that's hard to test manually

### 2. Generate Compliance Tests (3 min)
"Now I'll ask Amp to generate comprehensive test suites..."
- Prompt: "Generate Jest tests for these trading APIs with regulatory compliance checks"
- Show: Auto-generated tests covering:
  - Price validation (SEC Rule 605 compliance)
  - Order execution testing (FINRA requirements)
  - Risk management assertions (Basel III)

### 3. Market Data Validation (2 min)
"Notice how Amp understands financial domain logic..."
- Generated tests include: Price tolerance checks, Market hours validation, Circuit breaker scenarios

### 4. Coverage & Compliance Report (2 min)
"Let's see the results..."
- Run: Coverage goes from 45% → 92%
- Show: 23 API endpoints now fully tested
- Highlight: 47 compliance assertions auto-generated

## Value Proposition (1 min)
"What you just saw would have taken your team 40+ hours. Amp did it in 8 minutes.
This means you can:
- Cut release cycles from 2 weeks to 1 week
- Pass compliance audits with confidence  
- Free up developers for feature work instead of test maintenance"

## Metrics to Capture
- test_coverage_percentage: 0.92 (target: >=0.90) ✓
- api_endpoints_tested: 23 (target: >=15) ✓  
- compliance_assertions: 47 (target: >=30) ✓
- time_saved_hours: 40 (target: >=40) ✓

## Follow-up Questions
- "How many trading endpoints do you currently have in production?"
- "What's your current test coverage for compliance-critical APIs?"
- "How much developer time do you spend on test maintenance per release?"
```

### Step 4: Generate Custom Playbook

**SE runs:**
```bash
npm run scenario:validate  # Ensures schema compliance
npm run scenario:render   # Generates customer playbook
```

**Generated `docs/generated/tradefast-api-testing.md`:**
```markdown
# Auto-generate compliance-ready API tests for trading endpoints

|                |                                |
|----------------|--------------------------------|
| Duration       | 12 min                         |
| Project        | tradefast-api-demo            |
| Level          | core                          |
| Problem        | Manual API testing for trading endpoints creates 2-week release bottlenecks. Compliance requires 90% test coverage... |
| Solution       | Use Amp to auto-generate Jest API tests with compliance assertions, achieve 90% coverage in minutes... |

## Step-by-step
1. **audit_existing_apis** – Scan src/routes/ for trading API endpoints
2. **generate_compliance_tests** – Prompt Amp: 'Generate Jest tests for trading APIs with regulatory validation'
3. **validate_market_data** – Add tests for price feeds, order validation, risk checks
4. **run_coverage_report** – npm test -- --coverage --reporter=compliance
5. **demo_ci_integration** – Show tests running in CI pipeline with compliance gates

## Value Proof
- test_coverage_percentage → target **>=0.90**
- api_endpoints_tested → target **>=15**
- compliance_assertions → target **>=30**
- time_saved_hours → target **>=40**
```

### Step 5: Execute Demo

**Enrich customer intelligence (optional):**
```bash
# Requires: intel_enrich tool (registered) and optional env: SF_INSTANCE_URL, SF_ACCESS_TOKEN, GITHUB_TOKEN
npm run scenario -- enrich "TradeFast Solutions" -o docs/generated/research/tradefast.md
```

**During customer call:**
```bash
npm run scenario:run tradefast-api-testing
```

**Real-time telemetry captured in `.telemetry/tradefast-api-testing.jsonl`:**
```json
{"ts":"2025-09-06T14:00:00Z","event":"start"}
{"ts":"2025-09-06T14:01:30Z","event":"step_end","step":"audit_existing_apis","data":{"endpoints_found":23}}
{"ts":"2025-09-06T14:04:45Z","event":"step_end","step":"generate_compliance_tests","data":{"tests_created":47,"coverage_delta":0.47}}
{"ts":"2025-09-06T14:06:20Z","event":"step_end","step":"validate_market_data","data":{"assertions_added":15}}
{"ts":"2025-09-06T14:07:15Z","event":"step_end","step":"run_coverage_report","data":{"final_coverage":0.92}}
{"ts":"2025-09-06T14:08:00Z","event":"end","data":{"total_time_saved_hours":42}}
```

## Scaling Benefits

### For SE Team:
- **Reusability:** Fork `tradefast-api-testing` for other fintech prospects
- **Consistency:** Every demo follows same proven structure  
- **Metrics:** Concrete ROI data captured automatically
- **Speed:** 30-minute prep vs 4-hour custom demo creation

### For Customers:
- **Relevance:** Problem/solution matches their exact context
- **Credibility:** Domain-specific terminology and compliance requirements
- **Proof:** Live metrics showing concrete business impact
- **Repeatability:** Can recreate demo in their environment

### Repository Growth:
```
projects/
├── base-node-ecommerce/scenario.yml          # Generic base
├── tradefast-api-demo/scenario.yml           # FinTech variant
├── healthtech-hipaa-demo/scenario.yml        # Healthcare variant  
├── logistics-microservices-demo/scenario.yml # Supply chain variant
└── saas-scaling-demo/scenario.yml            # High-growth SaaS variant
```

Each scenario targets specific verticals while reusing proven technical patterns.
