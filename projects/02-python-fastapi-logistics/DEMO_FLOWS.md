# DEMO_FLOWS

Flow name: Quick Win: Create tests for rate limiter
- Goals: Add unit tests for app/services/shipments.py throttle
- Amp prompts:
  - "Open app/services/shipments.py and write tests for throttle edge cases."
- Commands: ./scripts/test.sh
- Acceptance: tests pass.

Flow name: Core: Throttle requests to every 200ms
- Goals: Implement throttling in app/services/shipments.py; tests in tests/test_shipments.py; add sequence diagram docs/throttle-sequence.puml; PR text
- Amp prompts:
  - "Open app/services/shipments.py. Add a throttling layer so outbound requests fire no more than once every 200ms. Maintain existing retries. Update tests/test_shipments.py to cover rapid-fire N requests, jitter, and retry backoff. Don’t change public method signatures."
  - "Run tests; fix failures with minimal diffs; generate docs/throttle-sequence.puml."
  - "Create commit feat(throttle): 200ms throttle + tests; diagrams and a PR description."
- Commands: ./scripts/test.sh
- Acceptance: green tests, diagram file present.

Flow name: Deep: Background task + diagrams + PR
- Goals: Add a periodic reconciliation task; integration test hitting shipments table; C4 diagram docs/c4-overview.puml
- Amp prompts:
  - "Implement background reconciliation task in main with threading/apscheduler."
  - "Add integration test that inserts shipments and verifies status update."
  - "Generate C4 and class diagrams."
- Commands: ./scripts/test.sh
- Acceptance: tests pass; diagrams present.
