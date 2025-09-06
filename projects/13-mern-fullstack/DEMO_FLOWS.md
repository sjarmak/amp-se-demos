# DEMO_FLOWS

Flow name: Quick Win: Add React component with API integration
- Goals: Create a TaskList component in client/src/components/ that fetches and displays tasks from Express API
- Amp prompts:
  - "Create client/src/components/TaskList.jsx that uses React hooks (useState, useEffect) to fetch tasks from /api/tasks. Include loading states and error handling."
  - "Add corresponding Express route in server/routes/tasks.js that returns mock task data from MongoDB."
  - "Write React Testing Library tests in client/src/components/TaskList.test.js covering loading, success, and error states."
- Commands: ./scripts/test.sh
- Acceptance: component renders; API integration works; tests pass

Flow name: Core: Full CRUD operations with MongoDB
- Goals: Implement complete Create, Read, Update, Delete operations for tasks with MongoDB persistence
- Amp prompts:
  - "Implement CRUD endpoints in server/routes/tasks.js using MongoDB/Mongoose. Add proper input validation and error handling middleware."
  - "Create React forms and components for task creation and editing. Use React Hook Form for validation."
  - "Add integration tests using supertest for API endpoints and React Testing Library for components. Include database cleanup in test setup/teardown."
  - "Generate sequence diagram docs/crud-sequence.puml showing client-server-database interactions."
- Commands: ./scripts/test.sh
- Acceptance: full CRUD working; comprehensive test coverage; diagram generated

Flow name: Deep: Real-time updates with WebSockets
- Goals: Add Socket.IO for real-time task updates; optimize React rendering; add performance monitoring
- Amp prompts:
  - "Integrate Socket.IO in both client and server for real-time task updates. Implement optimistic UI updates in React."
  - "Add React.memo and useMemo for performance optimization. Implement virtual scrolling for large task lists."
  - "Add performance monitoring using React DevTools Profiler API and server-side metrics. Generate comprehensive performance analysis."
  - "Create architectural diagrams showing WebSocket message flow and component optimization strategies."
- Commands: npm run benchmark && ./scripts/test.sh
- Acceptance: real-time updates working; performance optimized; monitoring in place; architectural documentation complete
