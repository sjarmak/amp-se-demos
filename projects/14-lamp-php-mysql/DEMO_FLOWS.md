# DEMO_FLOWS

Flow name: Quick Win: Create MVC structure for user management
- Goals: Implement basic MVC pattern with User model, controller, and views using MySQL
- Amp prompts:
  - "Create src/Models/User.php with PDO-based database operations (create, read, update, delete). Include input validation and prepared statements."
  - "Implement src/Controllers/UserController.php with methods for listing, creating, updating, and deleting users."
  - "Add PHPUnit tests in tests/UserTest.php covering CRUD operations and input validation edge cases."
- Commands: ./scripts/test.sh
- Acceptance: MVC structure working; MySQL integration functional; comprehensive test coverage

Flow name: Core: Add authentication and session management
- Goals: Implement secure login/logout system with PHP sessions and password hashing
- Amp prompts:
  - "Implement authentication system in src/Auth/AuthService.php using password_hash() and password_verify(). Add session management and CSRF protection."
  - "Create login/logout forms with proper HTML structure and basic CSS styling. Include client-side validation."
  - "Add comprehensive security tests covering password hashing, session handling, CSRF protection, and SQL injection prevention."
  - "Generate sequence diagram docs/auth-sequence.puml showing login flow and session management."
- Commands: ./scripts/test.sh && ./scripts/security-scan.sh
- Acceptance: secure authentication working; all security tests passing; sequence diagram generated

Flow name: Deep: Performance optimization and caching
- Goals: Implement database query optimization, output caching, and performance monitoring
- Amp prompts:
  - "Add database query optimization using prepared statement caching and connection pooling. Implement Redis-based output caching for frequently accessed data."
  - "Add performance monitoring with execution time tracking and slow query logging. Create database indexes for optimal query performance."
  - "Implement comprehensive performance testing using Apache Bench (ab) and generate performance analysis report with before/after metrics."
  - "Create architectural diagrams showing caching layers and database optimization strategies."
- Commands: ./scripts/benchmark.sh && ./scripts/test.sh
- Acceptance: measurable performance improvements; caching working; comprehensive performance analysis; architectural documentation
