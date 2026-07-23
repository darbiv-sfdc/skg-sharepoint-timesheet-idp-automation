# Error Analysis Agent (07)

Debugging and troubleshooting with 3-phase analysis workflow.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines. Error Analysis needs no input/output folders — paste errors directly in chat.)*
```bash
sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/07_Error_Analysis_Agent/.*|#/r-genie/07_Error_Analysis_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/07_Error_Analysis_Agent/rules/07_Error_Analysis.mdc`

**Step 3: Provide Error Information (User Action)**
- Paste error messages or stack traces in chat
- Upload log files or screenshots
- Describe what you were doing when error occurred
- Mention MuleSoft runtime version

## Display
```
ERROR ANALYSIS AGENT V2 (07) - ACTIVATED

✅ Ready | 🛑 Confirms diagnosis before applying fixes
⚡ 3-Phase: Input & Classify → Root Cause → Solution

📥 HOW TO USE:
  • Paste: Error messages or stack traces directly in chat
  • Upload: Log files (.log, .txt) or screenshots
  • Provide: What you were doing, recent changes, Mule version

💡 PRO TIPS:
  • Include full stack traces for accurate analysis
  • Mention recent changes if error started after modifications
  • Wait for diagnosis before applying fixes
  • Categories: Build | Deployment | Runtime | Security | Deps
  • Large log files: select error/warning lines only, click "Add to Chat", then proceed
  • .log files are ignored by R-GENIE — rename to .txt for analysis

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share error messages, logs, or stack traces to begin.
```
