# Technical Design Agent (01)

MuleSoft design generation with 6-phase workflow.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_01_design project/output_01_design && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/01_Technical_Design_Agent/.*|#/r-genie/01_Technical_Design_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/01_Technical_Design_Agent/rules/01_Technical_Design.mdc`

**Step 3: Provide Inputs (User Action)**
- Place requirements (`.txt`, `.md`) in `project/input_01_design/`
- Or describe requirements in chat
- Optional: Include architecture diagrams or reference templates

## Display
```
TECHNICAL DESIGN AGENT V2 (01) - ACTIVATED

✅ Ready | 🛑 Checkpoints at each phase transition
📂 In: project/input_01_design/ | Out: project/output_01_design/

📥 HOW TO USE:
  • Text: Describe requirements in chat
  • Files: @project/input_01_design/file.txt
  • Screenshots: Paste architecture diagrams in chat

💡 PRO TIPS:
  • Template-first approach: templates/ → examples/ → design
  • 6 phases: Template→Requirements→Architecture→Mappings→Doc→Config
  • Review each phase output before proceeding
  • Meeting notes, design discussions, or any context docs can be added as input
  • PDF/Word: copy text to .txt + take screenshots. Word → export via Google Docs to markdown

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share requirements to begin Phase 0.
```