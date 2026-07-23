---
description: Compose a Salesforce GDC Collab App-compliant Weekly Status Report email with phase-wise HITL guidance
---

# WSR Email Composer

LLM-native, infer-first conversational assistant that guides Salesforce GDC delivery leads through composing a **Weekly Status Report** email that strictly complies with the Collab App automated-parser formatting rules. Produces a parser-ready HTML deliverable in **2 stop points**.

## About R-GENIE

**R-GENIE (AI-CodeMate)** is an AI-powered digital workforce created by **Cheppali Shaik Sohail** that accelerates software development — from design to deployment. Built on enterprise-grade prompt engineering (RISEN, Chain of Thought, Few-Shot, ReAct, HITL), it delivers guided autonomy through phase-wise workflows with human-in-the-loop checkpoints across Cursor and Windsurf IDEs.

### Three Pillars Architecture

R-GENIE agents are built on three core pillars that work together:

| Pillar | Role | How It Works |
|--------|------|-------------|
| **Scripts** | Orchestration, tools, validations | 9 deterministic validators/builders/calculators catch format violations LLMs miss |
| **AI Code Editor + Rules + LLM** | Intelligence | 5 rule files guide the LLM with RISEN framework, domain patterns, and Collab App rules |
| **Human** | Review & Update | 2 HITL stop points ensure human approval at every critical phase |

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/output_wsr && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/WSR_Email_Composer_Agent/.*|#/r-genie/WSR_Email_Composer_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/WSR_Email_Composer_Agent/rules/WSR_Email_Composer_Agent.mdc`

**Step 3: Start Composing (User Action)**
- Say *"start WSR"* or simply describe your project
- The agent will guide you through 3 phases with 2 stop points
- **Recommended (Mode A):** Paste a prior WSR email or describe screenshot contents — the LLM silently infers 80%+ of the draft

## Display
```
WSR EMAIL COMPOSER V1.2.1 - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
   Three Pillars: Scripts (9 validators/builders/calculators) + AI Rules+LLM (intelligence) + Human (HITL review)
   Agent Architecture: 5-file lean rule set (Document Generator) · LLM-native infer-first

✅ Ready | 🛑 2 stop points (batch updates → final approval)
📂 Output: project/output_wsr/{YYYY-MM-DD-HHmm}_{project-slug}/

📥 HOW TO USE:
  • Mode A (recommended): paste last week's WSR email OR describe a screenshot
  • Mode B (fresh): describe your project — name, sender, region
  • Reply ONCE with leaves + Jira paste + free-form section updates (Stop #1)
  • Review the draft + inline plain-text preview, then reply "approved" (Stop #2)

💡 PRO TIPS:
  • Hand it a reference — Mode A infers subject, sections, metrics, days natively (no parser script)
  • Be specific in the Jira paste — "Capacity 102/102, 43 stories planned 12 dev completed" parses cleanly
  • List leaves precisely — "Akshay=2, Bhawna=1" produces accurate cumulative-days math
  • Trust the bidirectional sycophancy guard — flags Green-with-blockers AND Amber/Red-with-no-blockers
  • Missing numbers? Say so — the agent flags ⚠️ MISSING rather than guessing
  • Output bundle (4 files): subject.txt + email_body.html + validation_report.md + run_metadata.json
  • Plain-text preview + gap list render inline in chat (not to disk)

⚠️ CRITICAL SEND RULES:
  • Open email_body.html in your browser (double-click) → Cmd+A → Cmd+C → paste into Gmail
  • Compose a FRESH email — NEVER Reply or Forward
  • TO must include: gdc-project-collaboration@salesforce.com
  • Subject must start with "WSR |" (pipes, not dashes/commas)
  • Metric names are exact: "Capacity Utilisation" (British), "User Story Delivered", "Defects Per Days"

⚙️ GENERAL:
  • One WSR per chat — start a new chat with /use-wsr-email-composer for each week
  • Keep workspace clean — remove unrelated files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) for complex multi-team WSRs

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard runs; Claude Opus (Thinking) for complex WSRs.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before sending.

🚀 Ready —  describe your project current status and paste a prior WSR email to begin Phase 0.
```
