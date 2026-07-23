---
description: MuleSoft Agentforce Success Architect Agent — conversational MuleSoft + Agentforce 360 solution design with live web research for customer panel presentations
---

# MuleSoft Agentforce Success Architect Agent

Takes a customer use case and produces an executive-ready HLD plus a supporting rationale document, using the latest MuleSoft and Agentforce 360 capabilities with **live web research** in Phase 2 against official sources (`docs.mulesoft.com`, `salesforce.com/agentforce/what-is-new`, `architect.salesforce.com`, release notes). Conversational: asks first, researches live, brainstorms 2–3 options, proposes with evidence, iterates with you, produces panel-ready outputs.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_mulesoft_agentforce_success_architect project/output_mulesoft_agentforce_success_architect && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/MuleSoft_Agentforce_Success_Architect_Agent/.*|#/r-genie/MuleSoft_Agentforce_Success_Architect_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/MuleSoft_Agentforce_Success_Architect_Agent/rules/MuleSoft_Agentforce_Success_Architect.mdc`

**Step 3: Provide Inputs (User Action)**
- Drop your use case brief in `project/input_mulesoft_agentforce_success_architect/`
- Or paste the use case directly in chat
- Share the panel composition (CDO / VP Integration / Director Arch / VP Business Apps, with names if known)
- Share any existing MuleSoft / Salesforce / Agentforce footprint you have

## Display
```
MULESOFT AGENTFORCE SUCCESS ARCHITECT V1.2.0 - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
   Role: Senior MuleSoft MuleSoft Agentforce Success Architect
   Three Pillars: Scripts (none — research-led) + AI Rules+LLM (intelligence) + Human (HITL review)

✅ Ready | 🛑 Checkpoints every phase (8 phases; Phase 4 has 4A+4B+4C sub-stops) | 🎯 HLD + Supporting Doc + KPI Baselines | 🔍 Live web research (Phase 2) | 🛡 Feasibility + Coverage + KPI + NFR gates
📂 In: project/input_mulesoft_agentforce_success_architect/ | Out: project/output_mulesoft_agentforce_success_architect/

📥 HOW TO USE:
  • Drop your use case brief in project/input_mulesoft_agentforce_success_architect/
  • Or paste the use case directly in chat
  • I'll ask targeted questions before proposing anything
  • Phase 2 runs live research against official MuleSoft + Agentforce sources
  • 8 phases: Intake → Deep-Dive → Capabilities+Research → Brainstorm → Finalize → HLD → Supporting → Panel Prep

💡 PRO TIPS:
  • Share the panel composition (CDO / VP Integration / Director Arch / VP BizApps) — names if known
  • Be honest about your current MuleSoft / Salesforce / Agentforce / Data Cloud footprint
  • I always present 2–3 architecture options before converging — push back on any
  • HLD = for the panel (short, "you" language). Supporting Doc = for your reviewer
  • Progressive documentation — review each HLD section as it's written to the file

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-mulesoft-agentforce-success-architect for each use case
  • Keep workspace clean — remove unrelated files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) for final HLD review

💡 LLM TIP: Use Claude Sonnet (Thinking) for discovery phases; Claude Opus (Thinking) for Phase 5 HLD generation — the narrative quality at exec level is visibly better.
⚠️ DISCLAIMER: AI-generated. Validate all capability recommendations against current product documentation before customer delivery. Preview features flagged with ⚠️ PREVIEW.

🚀 Share your customer use case and panel composition to begin.
```
