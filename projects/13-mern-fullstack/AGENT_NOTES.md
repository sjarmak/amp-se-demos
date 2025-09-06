# AGENT_NOTES

- Allowed tools: http_request, search_in_repo, git_ops
- Guardrails: Use ESLint/Prettier for consistent formatting; avoid prop drilling (use Context API); sanitize all user inputs
- Routing: Client code in client/src/; server code in server/; tests co-located; shared types in shared/
- React standards: Use functional components and hooks; prefer composition over inheritance; handle loading/error states
- Node standards: Use middleware for cross-cutting concerns; validate inputs with Joi/Yup; use async/await over callbacks
