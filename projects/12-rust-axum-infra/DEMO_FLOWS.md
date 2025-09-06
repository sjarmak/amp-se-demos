# DEMO_FLOWS

Flow name: Quick Win: Add metrics endpoint with Prometheus format
- Goals: Implement /metrics endpoint in src/handlers.rs exposing node health metrics
- Amp prompts:
  - "Open src/handlers.rs. Add a /metrics endpoint that returns Prometheus format metrics for CPU and memory from datasets/infrastructure/nodes.csv. Use proper Rust error handling with Result types."
  - "Add unit tests in tests/handlers_test.rs covering the metrics format and error cases."
- Commands: ./scripts/test.sh
- Acceptance: tests pass; metrics endpoint returns valid Prometheus format

Flow name: Core: Async background task for health checks
- Goals: Implement periodic health checking with tokio spawn; rate limiting; structured logging
- Amp prompts:
  - "Implement a background task in src/health_checker.rs that periodically polls node status. Use tokio::spawn and tokio::time::interval. Add rate limiting using tower middleware."
  - "Add comprehensive async tests using tokio::test covering task lifecycle, error recovery, and rate limiting behavior."
  - "Generate sequence diagram docs/health-check-sequence.puml showing the async flow."
- Commands: ./scripts/test.sh
- Acceptance: background task runs; rate limiting works; comprehensive async test coverage

Flow name: Deep: Performance optimization and memory profiling
- Goals: Optimize memory usage and request throughput; identify bottlenecks
- Amp prompts:
  - "Profile the application using cargo flamegraph and identify the top 3 performance bottlenecks. Optimize hot paths, consider using Arc<> for shared state, and implement zero-copy where possible."
  - "Add benchmarks using criterion crate measuring request latency and memory allocation patterns."
  - "Generate comprehensive performance analysis with before/after metrics and architectural diagrams showing optimized data flow."
- Commands: cargo bench && ./scripts/test.sh
- Acceptance: measurable performance improvement; benchmarks document gains; architectural analysis complete
