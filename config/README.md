# Demo Customization System

This directory contains the JSON-based demo customization system that replaces the previous Salesforce API integration.

## Overview

The system uses JSON customer profiles to intelligently select and customize demo flows based on:
- Company information (industry, size, tech stack)
- Demo context (use cases, audience level, duration)
- Current tools and pain points
- Security requirements and preferences

## Files

### Schema
- [`customer_profile.schema.json`](./customer_profile.schema.json) - JSON schema defining the structure of customer profiles
- [`use_case_mapping.json`](./use_case_mapping.json) - Maps the 16 core Amp use cases to demo projects

### Example Profiles
- [`profiles/example_fintech.json`](./profiles/example_fintech.json) - Financial services company (mid-market, Java/Spring)
- [`profiles/example_startup.json`](./profiles/example_startup.json) - Technology startup (Python/React)  
- [`profiles/example_enterprise_security.json`](./profiles/example_enterprise_security.json) - Enterprise security-focused profile

## Tools

### Profile Loader
```bash
# Load a pre-defined profile
node AMP_TOOLBOX/tools/profile_loader.mjs --profile example_fintech

# Load a custom profile file
node AMP_TOOLBOX/tools/profile_loader.mjs --file /path/to/profile.json
```

### Demo Customizer
```bash
# Generate customized demo recommendations
node AMP_TOOLBOX/tools/demo_customizer.mjs --profile example_fintech

# Override duration and use cases
node AMP_TOOLBOX/tools/demo_customizer.mjs --profile example_startup --duration 20 --use-cases rapid_prototyping,feature_building
```

## 16 Core Use Cases

The system maps customer needs to these 16 proven Amp use cases:

1. **Context Restoration** - Quickly regain context on old/unfamiliar code
2. **Toil Reduction** - Automate tedious follow-up changes after refactors  
3. **Debugging Investigation** - Reduce large log output into actionable summaries
4. **Codebase Navigation** - Search and explore code with natural language
5. **Bug Fixing & Features** - Find bugs, fix them, create PRs
6. **Feature Building** - Paint-by-numbers programming and extension
7. **Code Review & Validation** - Self-audits, run tests, fix issues
8. **UI Validation** - Screenshot-based visual validation
9. **Advanced Refactoring** - Complex, high-effort architectural changes
10. **Visual Troubleshooting** - Screenshot-first problem diagnosis
11. **Logic Explanation** - Generate diagrams to explain complex logic
12. **Git Workflow** - Use staging area as experimentation sandbox
13. **Rapid Prototyping** - Build, iterate, learn without fear
14. **Database Queries** - Natural language to SQL translation
15. **Thread Sharing** - Collaborative documentation via shared sessions
16. **Security Reviews** - Fast security checks and vulnerability assessment

## Project Mapping

Each demo project in [`PROJECTS.json`](../PROJECTS.json) includes a `use_case_mapping` array that indicates which use cases it best demonstrates:

```json
{
  "id": "03-java-springboot-fintech",
  "use_case_mapping": ["security_reviews", "advanced_refactoring", "code_review_validation"]
}
```

## Creating Custom Profiles

1. Copy an existing profile from the `profiles/` directory
2. Modify the company information, tech stack, and demo context
3. Ensure the profile validates against the schema:
   ```bash
   node -e "
   const schema = require('./customer_profile.schema.json');
   const profile = require('./profiles/your_profile.json');
   console.log('Profile is valid:', JSON.stringify(profile, null, 2));
   "
   ```

## Demo Customization Logic

The demo customizer scores projects based on:

- **Use Case Alignment** (10 points per match) - How many requested use cases the project supports
- **Tech Stack Match** (5 points per match) - Overlap between customer tech stack and project stack  
- **Audience Appropriateness** (8 points) - Project complexity matches audience level
- **Duration Fit** (7 points) - Demo flow duration matches target time

Top 3 scoring projects become the demo recommendations.

## Migration from Salesforce

This system replaces:
- `AMP_TOOLBOX/tools/sf_fetch.mjs` → `profile_loader.mjs`
- `AMP_TOOLBOX/tools/intel_enrich.mjs` → `demo_customizer.mjs`
- Salesforce API calls → JSON profile loading
- Dynamic account fetching → Pre-defined customer profiles

The output format maintains compatibility with existing scenario templates while providing richer customization capabilities.
