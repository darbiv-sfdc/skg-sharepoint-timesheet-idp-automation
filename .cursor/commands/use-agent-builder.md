---
description: Create brand-new R-GENIE agents for any domain or goal
---

# Agent Builder

Create brand-new R-GENIE conversational agents for any domain or goal with an 8-phase guided workflow.

## About R-GENIE

**R-GENIE (AI-CodeMate)** is an AI-powered digital workforce created by **Cheppali Shaik Sohail** that accelerates software development — from design to deployment. Built on enterprise-grade prompt engineering (RISEN, Chain of Thought, Few-Shot, ReAct, HITL), it delivers guided autonomy through phase-wise workflows with human-in-the-loop checkpoints across Cursor and Windsurf IDEs.

### Three Pillars Architecture

R-GENIE agents are built on three core pillars that work together:

| Pillar | Role | How It Works |
|--------|------|-------------|
| **Scripts** | Orchestration, tools, validations | External scripts (JS, Python, CLI tools) provide deterministic, programmatic validation of AI output |
| **AI Code Editor + Rules + LLM** | Intelligence | Rule files (.mdc) guide the LLM with RISEN framework, prompt engineering patterns, and domain expertise |
| **Human** | Review & Update | HITL checkpoints at every phase ensure human approval before the agent proceeds |

Each generated agent follows a **4+1 lean rule architecture**: Main Entry (.mdc), Phase Orchestration, Guidance, Mandatory Stop Points — plus an optional Template Configuration for document-heavy agents. This modular structure prevents LLM attention drift and keeps each file focused.

The Agent Builder creates agents that balance all three pillars — producing rule files for intelligence, integrating scripts for validation (when applicable), and enforcing human review at every step.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/output_builder && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/Agent_Builder/.*|#/r-genie/Agent_Builder/|' .cursorignore
```

**Step 2: Make R-GENIE Visible**

Run the `/toggle-rgenie-visibility` workflow to toggle R-GENIE files visible in the VS Code Explorer. This is purely a visual/UX toggle — Cursor has full access to r-genie files regardless of this setting (see Gap #16: do NOT use `cat >` heredoc to rewrite `.vscode/settings.json` — it destroys existing settings like `claudeCode.environmentVariables`; the `/toggle-rgenie-visibility` workflow uses the `edit` tool correctly).

**Step 3: Activate Agent**
- Load agent rules: `@r-genie/Agent_Builder/rules/Agent_Builder.mdc`

**Step 4: Describe Your Goal (User Action)**
- Tell the agent what you want your new agent to do
- Examples: "Create an agent that reviews Python code for security vulnerabilities"

## Display
```
AGENT BUILDER V1.1 - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
   Three Pillars: Scripts (validation) + AI Rules+LLM (intelligence) + Human (HITL review)
   Agent Architecture: 4+1 lean rule files per agent

✅ Ready | 🛑 Checkpoints at every phase (8 total)
📂 State: project/output_builder/

📥 HOW TO USE:
  • Describe your goal: "Create an agent that..."
  • The builder will guide you through design & generation
  • You approve every element before it's created

💡 PRO TIPS:
  • Be specific about your goal for best results
  • 4 archetypes: Document, Code, Analyzer, Conversational
  • Any domain: MuleSoft, Python, Terraform, security, etc.
  • 8 phases: Goal→Arch→RISEN→Rules→Examples→Docs→Valid→Register

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks and building Agents.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Describe what you want your agent to do.
```
