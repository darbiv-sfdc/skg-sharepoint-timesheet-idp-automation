# Agent Tuner - Production Learnings

**Agent**: Agent_Tuner  
**Version**: 1.2.0  
**Last Updated**: April 2026

---

## ✅ INTEGRATED

| Learning | Target File | Date |
|----------|-------------|------|
| LLM gap: Version alignment + `<thinking>` + Confidence + RGV | 00_Phase_Orchestration.mdc | 2026-04-05 |
| LLM gap: Evidence-Bound + Tree of Thought + Few-Shot (already present) | 01_Guidance.mdc | 2026-04-05 |
| LLM gap: Constitutional + Anti-Autopilot + Degradation + Sanitization (already present) | 02_Mandatory_Stop_Points.mdc | 2026-04-05 |
| LLM gap: RISEN Narrowing + Mandatory Behavior enhancement | Agent_Tuner.mdc | 2026-04-05 |

---

## 🆕 PENDING INTEGRATION

_No pending learnings yet._

> **V1.2 Integration (2026-04-23)**: Mermaid Standards Retrofit pattern added to Agent Tuner. Trigger: Agent Builder v1.3.6 introduced `lib/docs/mermaid-diagram-best-practices.md` as the canonical Mermaid mechanics reference and wired it into every newly generated agent via Guidance §12 + Stop Points SELF-CHECK + skeleton-templates.md. However, **existing agents** (01 Technical Design, 02 API Specification, 03 App Dev, 03-01 DataWeave, 04 MUnit, 05 ReadMe, 06 Code Review, 07 Error Analysis, 08 Boomi Documentation, Cloud Success Architect, WSR Email Composer) predate this and ship with broken or inconsistent Mermaid diagrams in their rule files and deliverables. Agent Tuner now provides the retroactive fix: (1) Self-contained copy of `mermaid-diagram-best-practices.md` in Agent Tuner's `lib/docs/`; (2) §7 "Mermaid Standards Retrofit Pattern" in `customization-patterns.md` with a 12-point diagnostic checklist, 10 ordered retrofit steps, embedding template, and post-retrofit validation list (customization-patterns.md bumped 1.0.0 → 1.1.0; renumbered §6 Backup → §8); (3) SECTION 9 in `rules/01_Guidance.mdc` with 5 trigger conditions (when to apply), a Phase 2 → Phase 4 tuning flow summary, and an anti-patterns list (never sed on Mermaid, always backup, never combine retrofit with unrelated tuning, don't copy diagrams verbatim); (4) All-Agents validation checklist in `customization-patterns.md` §5 now includes a Mermaid compliance row. The retrofit is framed as a "tune any existing agent to match the Agent Builder Mermaid standard" operation — fully reusable, backup-first, auditable.

> **V1.1 Integration (2026-04-05)**: LLM behavioral gap countermeasures version-aligned across all rule files — enhanced RISEN Narrowing, mandatory `<thinking>` blocks, RGV verification, assumption flagging. Most countermeasures were already present in v1.0; v1.1 ensures version consistency and adds explicit mandatory behavior items.

---

## 📋 CATEGORIES

| Category | Count |
|----------|-------|
| Error Fixes | 0 |
| Best Practices | 4 |
| Workflow Changes | 0 |
| Edge Cases | 0 |
