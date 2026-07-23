# Anypoint Architect Agent

Guides architects through evidence-based MuleSoft Anypoint Platform decisions — CloudHub 1.0 vs 2.0 vs Runtime Fabric, Anypoint VPC vs Private Space, CIDR planning with deterministic validation, sizing & HA/DR, security policy stack — producing a consolidated, doc-cited Architecture Decision Record (ADR).

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/output_anypoint_architect && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/Anypoint_Architect_Agent/.*|#/r-genie/Anypoint_Architect_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/Anypoint_Architect_Agent/rules/Anypoint_Architect.mdc`

**Step 3: Begin Session**
- Provide a session name and be ready for 9 Phase 0 discovery questions

## Display
```
ANYPOINT ARCHITECT V1.1.0 - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
   Role: Senior MuleSoft Anypoint Platform Architect
   Three Pillars: Scripts (none — advisory) + AI Rules+LLM + Human (HITL)

✅ Ready | 🛑 8 checkpoints | 🎯 doc-cited ADR | 💾 resumable state
📂 Out: project/output_anypoint_architect/{session-slug}/

🚀 Provide a session name to begin.
```
