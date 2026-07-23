# ReadMe Documentation Agent (05)

Progressive section-by-section documentation with connection-safe generation and 90+/100 quality target.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_05_readme project/output_05_readme && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/05_ReadMe_Agent/.*|#/r-genie/05_ReadMe_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/05_ReadMe_Agent/rules/05_ReadMe.mdc`

**Step 3: Provide Inputs (User Action)**
- Place MuleSoft project in `project/input_05_readme/`
- Or reference existing project path in chat
- Specify target audience and deployment environment

## Display
```
README DOCUMENTATION AGENT V2 (05) - ACTIVATED

✅ Ready | 🔄 Progressive Save | 📊 Target: 90+/100 pts
📂 In: project/input_05_readme/ | Out: project/output_05_readme/

📥 HOW TO USE:
  • Text: "Generate README for /path/to/mulesoft-project"
  • Files: @project/input_05_readme/design.md
  • Provide: Target audience, deployment env, special sections

💡 PRO TIPS:
  • Complete application first before documentation
  • Include API specs for accurate endpoint docs
  • Connection-safe: Auto-resume from last saved section
  • 6 phases: Init→Template→Discovery→Extract→Generate→Finalize

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share your completed MuleSoft project path to begin.
```
