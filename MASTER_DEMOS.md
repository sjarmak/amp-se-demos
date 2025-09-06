# MASTER_DEMOS

Mapping discovery situations → project → flow → talk track → value proof.

| Situation | Project | Recommended flow | Talk track | Value proof |
|---|---|---|---|---|
| We struggle to produce tests quickly | 01-node-express-ecommerce | Quick Win: Auto-generate unit tests for src/services/cart.js and raise coverage by 20% | ROI and defect prevention; leverage Amp to scaffold tests, then iterate | Jest coverage diff and passing suite |
| Need to throttle outbound API requests to 200ms | 02-python-fastapi-logistics | Core: Implement throttle in app/services/shipments.py + tests + PR | Safety and resilience; show spec→code loop | Pytest results + sequence diagram |
| Need to throttle outbound API requests to 200ms | 03-java-springboot-fintech | Core: Implement throttle in service layer + tests + PR | Strong typing, Liquibase migrations, CI | JUnit + Liquibase changelog applied |
| We have a legacy monolith we’re decomposing | 07-legacy-php-laravel-monolith | Deep Dive: Identify seams, extract module, add boundary tests | Risk mitigation, incremental modernization | Passing boundary tests + diagram diff |
| How do we handle auth headers across services? | 08-ruby-on-rails-auth-headers | Core: cross-repo search → class/sequence diagrams → PR | Shared standards and reuse | Generated diagrams + PR |
| We want to compare model strategies | Any project | Deep Dive: Alloy Mode plan + implement, compare latency/cost | Model orchestration, governance | PR notes with cost/latency tables |
| UI iteration with screenshots | 06-react-nextjs-ui or 09-sveltekit-dashboard | Quick Win + Core with screenshot tool | Visual diffs and accessibility | Saved screenshots + passing e2e |
| High-frequency trading performance optimization | 11-cpp-trading-sim | Core: Memory pool + Deep: Latency measurement | C++ performance, memory mgmt, low-latency systems | Sub-microsecond metrics + flame graphs |
| Modern async infrastructure monitoring | 12-rust-axum-infra | Core: Background health checks + Deep: Performance profiling | Rust safety, async programming, infrastructure | Performance benchmarks + async test coverage |
| Full-stack JavaScript development | 13-mern-fullstack | Core: CRUD with MongoDB + Deep: Real-time WebSockets | Modern JS patterns, React hooks, full-stack | Working CRUD + real-time updates |
| Traditional web development with security focus | 14-lamp-php-mysql | Core: Authentication + Deep: Performance & caching | LAMP patterns, security best practices, caching | Secure auth + performance improvements |

See each project’s DEMO_FLOWS.md for copy-pasteable prompts.
