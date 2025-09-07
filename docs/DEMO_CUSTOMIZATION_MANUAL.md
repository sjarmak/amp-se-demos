# Amp Demo Customization System  
## Field Manual for Sales Engineers  
**Version 1.0** (Last updated 2025-01-07)

## 1. Purpose & Mind-Set

The JSON-based demo customization pipeline lets you deliver razor-focused demos in minutes, without waiting on Salesforce data or ad-hoc slide prep.  

Think of it as:  
• **A data sheet** (customer profile) -> • **A recommendation engine** (demo_customizer) -> • **A story generator** (talk track).  

Your job is to feed it the right inputs, sanity-check the outputs, and add the human gloss that only you can provide.

## 2. Quick-Start (TL;DR)

```bash
# 1. Pick or create a profile
cp config/profiles/example_fintech.json my_target.json

# 2. Edit the JSON (company, use_cases, pain_points, etc.)
vim my_target.json          # or VS Code with JSON schema validation

# 3. Validate (optional but recommended)
npx ajv -s customer_profile.schema.json -d my_target.json

# 4. Load & enrich (for legacy tools that still expect SFDC fields)
node AMP_TOOLBOX/tools/profile_loader.mjs --file my_target.json > /tmp/enriched.json

# 5. Generate demo plan & talk track
node AMP_TOOLBOX/tools/demo_customizer.mjs --file my_target.json --duration 20 --out /tmp/custom_demo.json

# 6. Skim /tmp/custom_demo.json or pipe through jq for the highlights
jq '.talk_track' /tmp/custom_demo.json | less

# 7. Run the recommended projects inside Amp, follow the talk track, WIN.
```

## 3. End-to-End Workflow

### STEP 0: Environment
• Use Node 18 or higher  
• AMP_TOOLBOX must be on your $PATH or referenced relatively  
• jq (optional) for easier JSON inspection

### STEP 1: Profile Creation
• Start from the closest example profile  
• Fill at least: `company.name`, `demo_context.use_cases`, `audience_level`  
• Keep enums & arrays exactly as defined in `customer_profile.schema.json` to avoid validation failures  
• **Pro-tip**: Ask the AE for "tech stack", "top 3 pain points", "desired time window"

### STEP 2: Profile Validation
```bash
npx ajv -s customer_profile.schema.json -d config/profiles/<file>.json
```
Errors point to the exact property—fix them before moving on.

### STEP 3: Profile Loading (optional)
If you still leverage any legacy steps that expect Salesforce-style objects, run profile_loader:
```bash
node AMP_TOOLBOX/tools/profile_loader.mjs --profile example_startup
```
Returns an enriched JSON that contains account, contacts, opportunities, etc.

### STEP 4: Demo Customization
Core command:
```bash
node AMP_TOOLBOX/tools/demo_customizer.mjs \
  --file config/profiles/<file>.json \
  [--duration <minutes>] \
  [--use-cases uc1,uc2] \
  [--out <out_path>]
```

**What happens under the hood:**
• Scores every project in PROJECTS.json:  
  - 10 pts per use-case match
  - 5 pts per tech-stack match  
  - 8 pts audience fit
  - 7 pts duration fit  
• Returns top-3 projects with reasons, plus a ready-to-read talk_track text block

### STEP 5: Human Review & Polishing
1. Read `talk_track` → Verify it tells the right story  
2. Check recommended `demo_flows` → Choose Quick Win, Core, or Deep path depending on meeting length  
3. Tweak wording for the customer's vernacular (e.g., "MTTR" vs. "resolution time")  
4. Add live transitions or ROI slides if executives will be present

### STEP 6: Live Demo Delivery
• Set a timer based on `audience_mapping.recommended_duration`  
• Use browser tabs: left = Amp window, right = JSON talk track for reference  
• **Narrative arc**: Pain -> Amp superpower -> Outcome -> Metric tie-back  
• Close with "next steps" specific to their `success_metrics`

## 4. Best Practices

### Before the Call
✓ Pre-run the recommended projects to warm their caches  
✓ Stage git branches with obvious commit messages ("amp-demo-\<feature>")  
✓ If `include_security_scenarios = true`, line up the security scanner view for instant credibility

### During the Call
✓ Start with a 30-second recap of THEIR challenges (taken from `pain_points`)  
✓ Show, don't tell—run code, tests, or UI and let Amp narrate via chat  
✓ Use the "why" notes from `talk_track` to justify every click  
✓ Watch the clock; if you're over, switch to a Quick Win flow (`duration_min <= 10`)

### After the Call
✓ Export the Amp chat and attach to follow-up email—this hits the "thread_sharing" use case  
✓ Attach `/tmp/custom_demo.json` so they see the rigor behind your recs

## 5. Common Scenarios & Recipes

### FINTECH SECURITY (Mid-Market) — PayFlow Style
• **Profile**: example_fintech  
• **Key props**: security_reviews, debugging_investigation, Java/Spring stack  
• **Command**:  
  ```bash
  node demo_customizer.mjs --profile example_fintech --duration 25
  ```
• **Typical pick list**: 03-java-springboot-fintech (Core), 02-python-fastapi-logistics (Quick Win)  
• **Angle**: show PCI compliance checks + fast root-cause on transaction errors

### MOVE-FAST STARTUP — BuildFast AI
• **Focus**: rapid_prototyping, feature_building, small team  
• Push Quick Wins in 13-mern-fullstack and 01-node-express-ecommerce  
• Emphasize Git staging & throw-away branches; skip deep refactors

### ENTERPRISE SECURITY AUDIT — SecureBank Corp
• **Audience**: manager/CISO, 30 min, heavy on compliance  
• Ensure `--duration 30` and `include_security_scenarios true`  
• Show 10-infra-iac-terraform policy tests + 03-java-springboot-fintech code review automation  
• Always pull up compliance scorecard screenshots at the end

## 6. Advanced Techniques

### A. Overriding Scoring Weights  
Edit `demo_customizer.mjs` lines 78-101 if you need to boost tech_stack weight or penalize long demos.

### B. Adding New Projects  
1. Append to PROJECTS.json with id, stack, capabilities, use_case_mapping, demo_flows  
2. Keep id numeric prefix unique—it sorts demos in UI

### C. Defining New Use Cases  
1. Add to `customer_profile.schema.json` enum list + `use_case_mapping.json`  
2. Provide `best_projects` & `demo_flows`, otherwise scoring will assign 0 pts

### D. Multi-Profile "Playbook"  
Run demo_customizer against several profiles to test resonance; pick the best talk track.

### E. Live Re-Scoring  
If the customer drops "We actually use Go," hit ↑ / edit `--use-cases` or `profile.tech_stack` on the fly and rerun—takes ~1 s.

## 7. Troubleshooting

**Issue**: "Profile not found"  
• Check spelling; run profile_loader.mjs with no args to see available profiles

**Issue**: Validation error "additionalProperties"  
• You added a key not allowed by schema; either remove it or extend the schema

**Issue**: demo_customizer returns empty recommended_projects  
• No project matched requested use_cases—add a more general use_case or create a project mapping

**Issue**: Node throws "Cannot find module fs/promises"  
• You're on Node older than 14—upgrade to 18 LTS

**Issue**: Output JSON hard to read  
• Pipe through jq: `jq '.recommended_projects[] | {id, score, reasons}'`

## 8. Command Reference (Cheat Sheet)

```bash
# List built-in profiles
ls config/profiles | sed 's/\.json//'

# Load profile & view enriched SFDC-compatible JSON
node profile_loader.mjs --profile <name> | jq

# Generate demo with overrides
node demo_customizer.mjs --profile <name> --duration 12 --use-cases debugging_investigation

# Just print talk track
node demo_customizer.mjs --profile <name> | jq -r '.talk_track'

# Validate profile
npx ajv -s customer_profile.schema.json -d <my.json>
```

## 9. Appendix

### A. 16 Core Use Cases
See [README § 4](../config/README.md) or [`use_case_mapping.json`](../config/use_case_mapping.json)

### B. Audience Mapping
See `use_case_mapping.json.audience_mapping`

### C. JSON Schema Tips
Visit https://json-schema.org/learn/getting-started-step-by-step.html

### D. Glossary
• **Quick Win** = 10 min or less flow, **Core** = 15-25 min, **Deep** = 25-35 min  
• **Alloy Mode** = Amp writes + executes code autonomously  
• **End-to-End** = Full cycle from change to passing tests & PR

---

**Remember**: the system gives you an algorithmically perfect starting point.  
Your storytelling turns it into a deal-closing experience. Good luck out there!
