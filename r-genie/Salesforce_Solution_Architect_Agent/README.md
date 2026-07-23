# Salesforce Solution Architect Agent

> ⚠️ **Status: Initial Version — Tuning In Progress**
> This agent is an early release. Core functionality is operational; rule files and workflow are actively being refined based on production runs. Expect improvements via `/use-agent-tuner` as learnings accumulate.

> **R-GENIE Agent** that conversationally guides you through producing a structured 12-section Salesforce Solution Architecture document for any SFDC + integration scenario, following Pattern #20 v2 (Template-First / Per-Phase Write Contract).

**Author**: Cheppali Shaik Sohail
**Version**: 1.0.0
**Released**: 2026-05-13
**Archetype**: Document Generator (primary) + Conversational (secondary)
**Domain**: Salesforce Industry Clouds (Insurance/FSC/Service/Sales) + Integration platforms (Guidewire / MuleSoft / SAP / Boomi / Heroku)

---

## What This Agent Does

Takes any **Salesforce architecture / integration scenario** as input — free-text prompt, structured intake form, or uploaded RFP/BRD — and walks you through producing a **production-ready 12-section Solution Architecture HLD** (~400-700 lines):

1. Business & Technical Context
2. Recommended Architecture
3. Architecture Diagram (Mermaid)
4. Data Model Design
5. Data Model Diagram (Lucidchart Instructions)
6. Integration & Event Pattern
7. Automation & Orchestration
8. Security & Compliance
9. Scalability & Performance (with explicit arithmetic)
10. Reusability & Productization
11. Risks & Mitigations
12. References

Built for **Salesforce Solution Architects, Integration Architects, and Pre-sales / RFP responders** who need consistent, evidence-bound, audit-ready architecture deliverables — not Apex code, not live-org pulls, not implementation details.

---

## RISEN Summary

| | |
|---|---|
| **R - ROLE** | Senior Salesforce Solution Architect — interviewer + document author |
| **I - INPUT** | Scenario (free-text / form / RFP upload) + discovery Q&A; medium input profile |
| **S - STEPS** | 9-phase progressive workflow with Pattern #20 v2 (template-first, per-phase write) |
| **E - EXPECTATION** | ~400-700 line 12-section HLD; verbosity benchmarked against FNOL anchor |
| **N - NARROWING** | Architecture-level only; **NO** code generation, live orgs, or implementation |

---

## Quick Start

### Activation (Cursor / Windsurf)

```bash
# 1. Run the activation command in your IDE:
/use-salesforce-solution-architect

# 2. Provide your scenario when prompted, e.g.:
"Design a Service Cloud + SAP S/4HANA integration that handles 25K
 service requests/day with bidirectional CRM ↔ ERP sync."

# 3. Walk through 9 phases (15 user touch-points), approving each section
```

### What you'll get

- A polished `{scenario-slug}-solution-architecture.md` file in `project/output_salesforce_solution_architect/`
- A validation report from `validate-solution-doc.js`
- A runtime state file enabling resume across sessions

### What the agent will REFUSE to do (by design)

- Generate Apex / LWC / Flow / DataWeave / Mule / test code
- Pull metadata from a live Salesforce org
- Skip a section (all 12 are mandatory)
- Make architectural assertions without trade-off tables
- Make numeric claims without explicit arithmetic
- Flip its recommendation just because you push back (anti-sycophancy)

---

## Workflow

| Phase | Name | Writes Section(s) | User Touch-Points |
|-------|------|-------------------|-------------------|
| 0 | Skeleton + Intake + Discovery | §1 | 1 stop |
| 1 | Recommended Architecture | §2 | 1 stop |
| 2 | Architecture Diagram (Mermaid) | §3 | 1 stop (after render check) |
| 3 | Data Model + Lucidchart | §4, §5 | 2 sub-stops |
| 4 | Integration & Event Pattern | §6 | 1 stop |
| 5 | Automation & Orchestration | §7 | 1 stop |
| 6 | Security & Compliance | §8 | 1 stop |
| 7 | Scalability + Reusability | §9, §10 | 2 sub-stops (numeric verify) |
| 8 | Risks + References + CONSOLIDATE | §11, §12, polish | 4 sub-stops (script + polish) |

**Total**: 9 phases, **15 user checkpoints** (9 phase + 6 sub).

---

## Pro Tips

- **Be specific in Phase 0**: clearer intake = sharper HLD. Include scale targets (TPS / daily volume), regulatory context (HIPAA/PCI/etc.), and integration partner (Guidewire / SAP / etc.) up front.
- **Upload the RFP if you have one**: the agent applies Forensic Input Processing for inputs >500 lines (mind map + section-level RGV + positional bias scan).
- **Trust the trade-off table mandate**: every architectural decision must compare ≥2 alternatives. If you push back on the chosen option, bring **counter-evidence** (the agent will stand firm without it).
- **Section 9 arithmetic is non-negotiable**: every TPS / daily-volume / sizing claim shows the math. The validation script enforces it.
- **Section 5 is Lucidchart, not Mermaid**: data models go to Lucidchart per agent convention; architecture diagrams stay Mermaid.
- **Resume mid-run**: state file persists at `project/output_salesforce_solution_architect/.salesforce-solution-architect-state.json` — pick up where you left off.

---

## Architecture (5 Rule Files)

| File | Purpose |
|------|---------|
| `rules/Salesforce_Solution_Architect.mdc` | Main entry — RISEN, 9-phase overview, 5 critical rules, 10 mandatory behaviors |
| `rules/00_Template_Configuration.mdc` | 12-section template, section markers, pre-generation checklist |
| `rules/01_Phase_Orchestration.mdc` | 9-phase workflow, state machine, P20v2 contract, state file schema |
| `rules/02_Guidance.mdc` | SFDC patterns, decision matrices, few-shots, Mermaid + Lucidchart standards |
| `rules/03_Mandatory_Stop_Points.mdc` | 15 stops, self-check, all Gap 8-14 sections, Mermaid render guard |
| `rules/INDEX.md` | Quick reference, dependency map, phase workflow diagram |

See `ARCHITECTURE.md` for detailed workflow steps and design rationale.

---

## Reference Materials

- **Templates**: `templates/solution-architecture-style.yaml` + `templates/solution-architecture-template-guide.md`
- **Canonical example (verbosity anchor)**: `examples/01_fnol_insurance_guidewire/solution_architecture_fnol_guidewire.md`
- **Validation script**: `lib/scripts/validate-solution-doc.js` (6 lean checks per Lean Script Principle)
- **Production learnings** (populated post-runs via `/use-agent-tuner`): `Production_Learnings.md`

---

## Tuning the Agent

After production runs reveal patterns worth codifying:
- Use `/use-agent-tuner` to apply learnings to rule files
- Add new examples to `examples/NN_{scenario-slug}/` and update `examples/README.md`
- Append to `Production_Learnings.md` with date, observation, and which rule file was updated

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-13 | Initial release. 5-file modern architecture (Document Generator + Conversational hybrid). Pattern #20 v2 (Template-First / Per-Phase Write Contract) wired throughout. Stateful with resume capability. Light Scripts pillar (1 lean validator). FNOL-on-Insurance-Cloud-+-Guidewire as canonical verbosity anchor. |

---

## License & Attribution

Part of the **R-GENIE (AI-CodeMate)** framework — an AI-powered digital workforce that accelerates software development from design to deployment.

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-05-13
