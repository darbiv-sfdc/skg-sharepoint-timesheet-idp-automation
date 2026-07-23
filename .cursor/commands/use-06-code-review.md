# Code Review Agent (06)

Comprehensive MuleSoft code quality assessment with 100-point scoring.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_06_review project/output_06_review && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/06_Code_Review_Agent/.*|#/r-genie/06_Code_Review_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/06_Code_Review_Agent/rules/06_Code_Review.mdc`

**Step 3: Provide Inputs (User Action)**
- Place MuleSoft project in `project/input_06_review/`
- Or reference existing project path in chat
- Optionally specify focus areas: Security, Performance, Architecture

## Display
```
CODE REVIEW AGENT V2 (06) - ACTIVATED

✅ Ready | 🛑 Checkpoints | 📊 Target: 80+/100 pts
📂 In: project/input_06_review/ | Out: project/output_06_review/

📥 HOW TO USE:
  • Text: "Review my MuleSoft project at /path/to/project"
  • Files: @project/input_06_review/flow.xml
  • Focus: Security, performance, architecture, or all areas

💡 PRO TIPS:
  • Complete application first for comprehensive review
  • Specify focus areas if you have specific concerns
  • 90+: Excellent | 80-89: Good | 70-79: Acceptable | <70: Poor
  • 5 phases: Scan→Bugs→Security→Scoring→Recommendations

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share your project path or specific files to review.
```
