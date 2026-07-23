# Salesforce Solution Architect Agent — Production Learnings

> **Purpose**: Capture observations from real production runs of this agent so they can be codified back into the rule files via `/use-agent-tuner`.
>
> **Owner**: Cheppali Shaik Sohail
> **Update Mechanism**: ONLY via `/add-production-learnings` command with user approval (per R-GENIE protection rules)

---

## How to Use This Document

1. After a real production run that surfaces a recurring issue, an unexpected edge case, or a user-feedback pattern, append a new entry below.
2. Each entry is **factual and concrete** — no speculation. Cite the run date, scenario, observed behaviour, and impact.
3. Tag entries with the rule file they likely belong to (`Salesforce_Solution_Architect.mdc`, `00_Template_Configuration.mdc`, `01_Phase_Orchestration.mdc`, `02_Guidance.mdc`, `03_Mandatory_Stop_Points.mdc`).
4. Once an entry is codified into the rules via `/use-agent-tuner`, mark it `[CODIFIED]` and link to the rule edit.

---

## Entry Template

```markdown
### YYYY-MM-DD — {Short title}

**Scenario**: {1-line scenario description, e.g., "FSC + Calabrio integration, 80K interactions/day"}
**Phase**: {Which phase surfaced the learning}
**Observation**: {What happened — concrete and factual}
**Impact**: {How this affected the deliverable or the user experience}
**Recommended Rule Update**: {Which rule file + what change}
**Status**: [PENDING] | [CODIFIED via {rule-file} on YYYY-MM-DD]
```

---

## Entries

_No production learnings recorded yet. First entries will appear after real-world agent runs._

---

> 🧞‍♂️ R-GENIE Agent Framework | Salesforce Solution Architect Agent v1.0.0 | 2026-05-13
