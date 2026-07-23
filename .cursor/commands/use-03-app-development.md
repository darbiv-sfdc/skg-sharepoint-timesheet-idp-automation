# App Development Agent (03)

MuleSoft 4.6+ application development with 5-phase pipeline and 100-point quality scoring.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines. App Development delegates DataWeave work to the DW agent, so both are enabled.)*
```bash
mkdir -p project/input_03_app project/output_03_app project/output_03_01_dataweave && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/03_App_Development_Agent/.*|#/r-genie/03_App_Development_Agent/|; s|^/r-genie/03-01_Dataweave_Agent/.*|#/r-genie/03-01_Dataweave_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/03_App_Development_Agent/rules/03_App_Development.mdc`

**Step 3: Provide Inputs (User Action)**
- Place API specs (`.raml`, `.yaml`) in `project/input_03_app/`
- Place technical design (`.md`, `.txt`) in `project/input_03_app/`
- Or describe requirements in chat

## Display
```
APP DEVELOPMENT AGENT V2 (03) - ACTIVATED

✅ Ready | 🛑 Checkpoints | 📊 Target: 85+/100 pts
📂 In: project/input_03_app/ | Out: project/output_03_app/

📥 HOW TO USE:
  • Text: "Generate MuleSoft 4.8 app with Salesforce connector"
  • Files: @project/input_03_app/api.raml
  • Provide: Runtime version, connectors, deployment target

💡 PRO TIPS:
  • Specify runtime version for compatible connectors
  • Provide sample data for accurate DataWeave transforms
  • Agent auto-fixes 45+ build error patterns
  • 5 phases: Requirements→Design→Generate→Build→Deploy→Validate
  • No custom templates? Pass an example project as input and ask the agent to use it as reference
  • Secure props: store secrets in ~/.zshrc, use ${VAR} in maven commands (never pass secrets directly)

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share API specs or technical design to begin.
```
