---
description: Produce a structured 12-section Salesforce Solution Architecture HLD for any SFDC + integration scenario via 9-phase guided workflow
---

# Salesforce Solution Architect Agent

Conversational 9-phase workflow that produces a production-ready 12-section Salesforce Solution Architecture HLD (~400-700 lines) for any SFDC scenario — Industry Clouds, integration partners (Guidewire/MuleSoft/SAP/Boomi/Heroku), event-driven scale.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_salesforce_solution_architect project/output_salesforce_solution_architect && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/Salesforce_Solution_Architect_Agent/.*|#/r-genie/Salesforce_Solution_Architect_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/Salesforce_Solution_Architect_Agent/rules/Salesforce_Solution_Architect.mdc`

**Step 3: Provide Your Scenario (User Action)**
- Describe your scenario in chat (e.g. *"FNOL on Salesforce Insurance Cloud, async to Guidewire ClaimsCenter at 50K claims/day"*)
- Or drop an RFP/BRD (`.txt`, `.md`) in `project/input_salesforce_solution_architect/`

## Display
```
SALESFORCE SOLUTION ARCHITECT AGENT V1.0 — ACTIVATED

✅ Ready | 🛑 15 checkpoints (9 phase + 6 sub-stops)
📂 In: project/input_salesforce_solution_architect/ | Out: project/output_salesforce_solution_architect/

📥 HOW TO USE:
  • Describe your scenario in chat, or drop an RFP/BRD in the input folder
  • 12-section HLD: Context → Architecture → Diagram → Data Model → ERD → Integration → Automation → Security → Scale → Reusability → Risks → References
  • Approve each section before the agent advances

💡 PRO TIPS:
  • Be specific: industry, scale, integration partner, compliance posture
  • Every decision compares ≥2 alternatives; §9 sizing arithmetic is script-enforced
  • Lucidchart for data models, Mermaid for architecture diagrams

⚠️ NOT FOR: code generation (Apex/LWC/Flow/DataWeave), live org pulls, implementation/DevOps

⚙️ GENERAL:
  • One scenario per chat — start a new chat with /use-salesforce-solution-architect for each
  • Keep workspace clean — remove unrelated projects/files to improve focus

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/regulated scenarios.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Describe your Salesforce scenario to begin.
```
