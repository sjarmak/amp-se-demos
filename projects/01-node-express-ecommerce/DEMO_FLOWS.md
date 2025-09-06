# DEMO_FLOWS

Flow name: Quick Win: Auto-generate unit tests for cart service
- Goals: Raise coverage by 20% on src/services/cart.js
- Amp prompts:
  - "Open src/services/cart.js. Generate unit tests for edge cases: empty cart, discount > subtotal, rounding."
  - "Run tests and propose minimal diffs if failures occur."
- Commands:
  - ./scripts/test.sh
- Acceptance: tests pass; coverage increases.

Flow name: Core: Throttle requests to every 200ms
- Goals: Implement throttling in src/services/httpClient.js; update tests in tests/httpClient.test.js; produce PR with diagrams
- Amp prompts:
  - "Open src/services/httpClient.js. Add a throttling layer so outbound requests fire no more than once every 200ms. Maintain retries. Update tests/httpClient.test.js to cover rapid-fire N requests, jitter, and retry backoff. Don’t change public method signatures."
  - "Run the test suite. If failures occur, propose minimal diffs and apply them."
  - "Generate a class + sequence diagram of the call path for this change and save to docs/throttle-sequence.puml."
  - "Create a single commit: feat(throttle): 200ms throttle + tests; diagrams. Generate a PR description summarizing rationale, risks, validation steps. Include a linkable checklist."
- Commands:
  - ./scripts/test.sh
- Acceptance: green tests, docs/throttle-sequence.puml created, no lint errors.

Flow name: Deep: Refactor checkout + diagrams + alloy mode
- Goals: Refactor routes/checkout.js to isolate payment adapter with interface; add integration test hitting DB; generate C4 diagram in docs/
- Amp prompts:
  - "Refactor src/routes/checkout.js to delegate to src/services/paymentAdapter.js with interface check. Maintain behavior."
  - "Add integration test hitting orders table (seeded)."
  - "Generate C4 overview in docs/c4-overview.puml and class diagram in docs/class-diagram.puml."
  - "Use Alloy Mode: one model plans, another implements; compare latency/cost in PR."
- Commands: ./scripts/test.sh
- Acceptance: tests pass; diagrams produced; PR text generated.
