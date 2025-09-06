# DEMO_FLOWS

Flow name: Quick Win: Optimize order matching loop
- Goals: Profile and optimize the order matching algorithm in src/engine.cpp
- Amp prompts:
  - "Open src/engine.cpp. Profile the matchOrders function and optimize the inner loop for cache efficiency. Add unit tests in tests/engine_test.cpp covering edge cases: empty book, large orders, price priority."
  - "Run performance tests and generate a benchmark comparison."
- Commands: ./scripts/test.sh && ./scripts/benchmark.sh
- Acceptance: tests pass; measurable performance improvement documented

Flow name: Core: Memory pool for order objects
- Goals: Implement object pooling to reduce allocations in high-frequency scenarios
- Amp prompts:
  - "Implement a memory pool in src/memory_pool.hpp for Order objects. Replace new/delete in src/engine.cpp with pool allocation. Maintain thread safety."
  - "Add comprehensive tests covering pool exhaustion, thread contention, and memory leak detection."
  - "Generate sequence diagram docs/memory-pool-sequence.puml showing allocation flow."
- Commands: ./scripts/test.sh && valgrind ./build/trading_sim
- Acceptance: no memory leaks; improved allocation performance; passing thread safety tests

Flow name: Deep: Latency measurement and optimization
- Goals: Add microsecond-precision latency tracking; identify and fix bottlenecks
- Amp prompts:
  - "Add latency measurement infrastructure using std::chrono::high_resolution_clock. Track order-to-fill latency in src/latency_tracker.cpp."
  - "Identify the top 3 performance bottlenecks using profiling tools. Propose and implement optimizations."
  - "Generate performance analysis report with before/after metrics and C4 diagram of optimized architecture."
- Commands: ./scripts/profile.sh && ./scripts/test.sh
- Acceptance: sub-microsecond order processing; comprehensive performance report; diagrams produced
