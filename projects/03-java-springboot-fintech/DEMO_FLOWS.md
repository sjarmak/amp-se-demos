# DEMO_FLOWS

Flow name: Quick Win: Service tests for fee calc
- Goals: Add unit tests for a fee calculation method; identify edge cases
- Amp prompts:
  - "Open service and generate tests for fee calc covering negative, zero, rounding."
- Commands: ./scripts/test.sh

Flow name: Core: 200ms throttle + Liquibase + PR
- Goals: Implement throttle in a service method; add Liquibase change; tests
- Amp prompts:
  - "Open src/main/java/com/amp/fintech/service/ExternalClient.java. Add 200ms throttle preserving retries. Update tests."
  - "Add Liquibase changeSet in src/main/resources/db/changelog/ to add index on transactions." 
  - "Generate sequence diagram docs/sequence-throttle.puml."

Flow name: Deep: Refactor service layer + diagrams
- Goals: Introduce repository layer, refactor controller; add C4/class diagrams
- Commands: ./scripts/test.sh
