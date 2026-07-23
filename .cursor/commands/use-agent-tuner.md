---
description: Customize any R-GENIE agent to match project-specific standards
---

# Agent Tuner

Customize any R-GENIE agent's rules, templates, examples, and best practices for your project with a 7-phase guided workflow.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/output_tuner && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/Agent_Tuner/.*|#/r-genie/Agent_Tuner/|' .cursorignore
```

**Step 2: Make R-GENIE Visible**

Run the `/toggle-rgenie-visibility` workflow to toggle R-GENIE files visible in the VS Code Explorer. This is purely a visual/UX toggle — Cursor has full access to r-genie files regardless of this setting (see Gap #16: do NOT use `cat >` heredoc to rewrite `.vscode/settings.json` — it destroys existing settings like `claudeCode.environmentVariables`; the `/toggle-rgenie-visibility` workflow uses the `edit` tool correctly).

**Step 3: Activate Agent**
- Load agent rules: `@r-genie/Agent_Tuner/rules/Agent_Tuner.mdc`

**Step 4: Select Target Agent (User Action)**
- Tell the agent which agent to customize (e.g., "Customize Agent 01 - Technical Design")
- Or ask to see the agent inventory first

## Display
```
AGENT TUNER V1.1 - ACTIVATED

✅ Ready | 🛑 Checkpoints at every phase (7 total)
📂 State: project/output_tuner/

📥 HOW TO USE:
  • Select target agent: "Customize Agent 01"
  • Provide project standards when asked
  • Review and approve each phase before proceeding

💡 PRO TIPS:
  • For Agent 01: Have your design template ready (screenshot/markdown/text)
  • For Agent 02: Have your RAML/OAS example project ready
  • For Agent 03: Have your MuleSoft reference project ready
  • Backup created automatically before any changes
  • 7 phases: Discover→Backup→Standards→Templates→Rules→Valid→Act

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks and building Agents.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Tell me which agent you'd like to customize.
```
