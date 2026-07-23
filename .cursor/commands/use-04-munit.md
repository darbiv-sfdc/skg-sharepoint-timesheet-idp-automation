# MUnit Testing Agent (04)

Think-First test generation: Understand → Design → Generate → Validate

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_04_munit project/output_04_munit && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/04_Munit_Agent/.*|#/r-genie/04_Munit_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/04_Munit_Agent/rules/04_Munit.mdc`

**Step 3: Provide Inputs (User Action)**
- Place MuleSoft project in `project/input_04_munit/`
- Or reference existing project path in chat
- Agent will generate tests in `{project}/src/test/munit/`

## ⚠️ Critical Output Rule

**Phases 0-3:** Display analysis **IN CONVERSATION** (not files)  
**Phases 4+:** Create actual test **FILES** in output directory

❌ Don't create: `PHASE_1_FLOW_DISCOVERY.md`, `PHASE_2_LOGIC_ANALYSIS.md`  
✅ Do display: All discovery/analysis/scenarios directly in chat

## Display
```
MUNIT TESTING AGENT V2 (04) - ACTIVATED

✅ Think-First | 🛑 5 Stop Points | 📊 85%+ Coverage + Behavior
📂 In: project/input_04_munit/ | Out: project/output_04_munit/
📂 Tests → {project}/src/test/munit/

🧠 10-PHASE WORKFLOW:
  0-1: Discover → 2: Analyze Logic (STOP) → 3: Design (STOP)
  4-5: Generate (STOP) → 6-7: Validate (STOP) → 8-9: Optimize

📥 HOW TO USE:
  • Text: "Generate MUnit tests for /path/to/mulesoft-project"
  • Files: @project/input_04_munit/your-app

💡 KEY FEATURES:
  • Phases 0-3 output shown IN CHAT (not as files)
  • Designs scenarios with expected outcomes
  • Behavior Score ensures tests catch regressions
  • Secure props: store secrets in ~/.zshrc, use ${VAR} in maven commands (never pass secrets directly)

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share your MuleSoft project path to begin.
```
