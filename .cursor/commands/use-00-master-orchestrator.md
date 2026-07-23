# Master Orchestrator Agent (00)

End-to-end phase-aware pipeline orchestration with 7-stage workflow and structured handoffs.

## Steps to Activate

**Step 1: Setup** *(The agent attempts this **once**. If the `.cursorignore` write is blocked, it does not retry — it asks you to run it in your terminal and waits.)*
```bash
mkdir -p project/input_01_design project/output_01_design project/input_02_api project/output_02_api project/input_03_app project/output_03_app project/input_03_01_dataweave project/output_03_01_dataweave project/input_04_munit project/output_04_munit project/input_05_readme project/output_05_readme project/input_06_review project/output_06_review project/output_00_orchestrator && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/00_Master_Orchestrator_System/.*|#/r-genie/00_Master_Orchestrator_System/|' .cursorignore
```

**Step 2: Activate Orchestrator**
- Load orchestrator rules: `@r-genie/00_Master_Orchestrator_System/rules/00_Master_Orchestrator.mdc`

**Step 3: Provide Requirements (User Action)**
- Describe full project requirements in chat
- Or specify which stage to start from

## Agent Enable/Disable Mechanism

Agents are enabled/disabled by toggling their line in `.cursorignore`:
- `#/r-genie/{agent}/` → **ENABLED** (commented = AI can access + index)
- `/r-genie/{agent}/` → **DISABLED** (uncommented = AI access off)

Per stage, the orchestrator enables the active stage's agent and disables the previous one in `.cursorignore`.

> ⚠️ **Execute-or-ask rule (one attempt):** `.cursorignore` is write-protected from agents in Cursor. For every `.cursorignore` change, the orchestrator must:
> 1. **ATTEMPT** the command itself **exactly once** (terminal `sed`), then
> 2. if the write is blocked ("operation not permitted" / "permission denied"), **STOP — do not retry or use workarounds** (no `edit`/`perl`/temp files/re-approvals) — **ask the user** to run the exact command in their own terminal, and **WAIT** for confirmation before continuing.

## Display
```
MASTER ORCHESTRATOR V3 (00) - ACTIVATED

✅ Ready | 🛑 Checkpoints at every stage + agent internal stops
📂 Handoffs: project/output_00_orchestrator/

🔄 7-Stage Pipeline:
  1:Design → 2:API Spec → 3:App Dev → 4:DW Review → 5:Test → 6:Docs → 7:Review

📥 HOW TO USE:
  • Full pipeline: "Build MuleSoft integration for X"
  • Jump to stage: "Start at Stage 3"
  • Files: @project/input_{stage}/ | Screenshots: paste in chat

💡 PRO TIPS:
  • Orchestrator drives each agent's FULL phase workflow
  • Handoff documents bridge context between stages
  • Code Review (Stage 7) validates against Stage 1 design
  • DataWeave Review (Stage 4) optimizes transforms from App Dev

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Agent toggles .cursorignore; if blocked, you'll be asked to run the command
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share requirements or specify stage to start.
```
