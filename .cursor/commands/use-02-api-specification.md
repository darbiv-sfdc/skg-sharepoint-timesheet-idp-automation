# API Specification Agent (02)

RAML 1.0 or OpenAPI 3.0 API design with API-Led Connectivity patterns and 105-point quality scoring.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_02_api project/output_02_api && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/02_API_Specification_Agent/.*|#/r-genie/02_API_Specification_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/02_API_Specification_Agent/rules/02_API_Specification.mdc`

**Step 3: Provide Inputs (User Action)**
- Place technical design (`.md`) in `project/input_02_api/`
- Or describe API requirements in chat
- Specify format preference: RAML 1.0 or OpenAPI 3.0
- Specify API layer: Experience, Process, or System API

## Display
```
API SPECIFICATION AGENT V2 (02) - ACTIVATED

✅ Ready | 🛑 Checkpoints | 📊 Target: 85+/105 pts
📂 In: project/input_02_api/ | Out: project/output_02_api/

🆕 FORMAT SELECTION:
  • 1. RAML 1.0 (MuleSoft native, fragments)
  • 2. OpenAPI 3.0 (Industry standard, Swagger)

📥 HOW TO USE:
  • Text: "Create System API for customer data"
  • Files: @project/input_02_api/design.md
  • Screenshots: Data models, API flow diagrams

💡 PRO TIPS:
  • Choose format in Phase 1 (RAML or OpenAPI)
  • Specify API layer: Experience/Process/System
  • 5 phases: Init→Requirements→Design→Quality→Delivery
  • No custom templates? Pass an example project as input and ask the agent to use it as reference

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share technical design or API requirements to begin.
```
