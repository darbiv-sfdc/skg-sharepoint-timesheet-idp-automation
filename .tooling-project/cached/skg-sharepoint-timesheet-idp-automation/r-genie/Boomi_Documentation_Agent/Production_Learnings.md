# Production Learnings - Boomi Documentation Agent

**Last Updated**: 2026-04-05 (v4.1)  
**Author**: Cheppali Shaik Sohail

---

## ✅ INTEGRATED LEARNINGS

> Integrated into rule files

| Learning | Target File | Date |
|----------|-------------|------|
| 12 component types extraction | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| 18 shape types extraction | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| Document properties (6 valueTypes) | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| Transform function extraction | `lib/docs/xml-patterns-reference.md` | 2026-01-14 |
| Complete field mappings documentation | `rules/08-02_Guidance.mdc` | 2026-02-13 |
| Source/target path verification | `rules/08-02_Guidance.mdc` | 2026-02-13 |
| Gaps section for referenced-but-missing components | `rules/08-00_Template_Configuration.mdc`, `08-01_Phase_Orchestration.mdc`, `templates/documentation-style.yaml` | 2026-02-13 |
| Output folder by process number | `rules/08-01_Phase_Orchestration.mdc` | 2026-02-14 |
| Output subfolder per flow ({flow_name}) | All rules, templates, README, workflow, workspace-organization | 2026-02-14 |
| Mapping count verification (visual + grep) | `rules/08-02_Guidance.mdc` | 2026-02-14 |
| Skip XML formatting preprocessing step | `rules/Boomi_Documentation.mdc`, `rules/08-01_Phase_Orchestration.mdc`, `rules/INDEX.md`, `templates/documentation-style.yaml` | 2026-02-14 |
| Flexible input location for Boomi exports | `rules/08-01_Phase_Orchestration.mdc` | 2026-02-14 |
| Process property set extraction | `lib/docs/xml-patterns-reference.md` | 2026-01-14 |
| Cross-reference data extraction | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| Global function handling | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| Unknown element handling | `rules/08-02_Guidance.mdc` | 2026-01-14 |
| Progressive output workflow | `rules/08-01_Phase_Orchestration.mdc` | 2026-01-14 |
| Missing component type verification | `rules/08-01_Phase_Orchestration.mdc` | 2026-01-14 |
| Data types in mapping tables | `rules/08-02_Guidance.mdc` | 2026-01-14 |

---

| V3.2 Lean Architecture refactor: 4-file standard, DRY | All rule files, INDEX, README, ARCHITECTURE | 2026-02-20 |
| Output separation: verification counts ONLY in verification-checklist.md | `rules/00_Phase_Orchestration.mdc`, `02_Mandatory_Stop_Points.mdc`, `templates/documentation-style.yaml` | 2026-02-20 |
| Anti-summarize: NEVER abbreviate mapping or shape tables in main doc | `rules/01_Guidance.mdc`, `02_Mandatory_Stop_Points.mdc`, `templates/documentation-style.yaml` | 2026-02-20 |
| Template Configuration moved to lib/docs/ for DRY | `lib/docs/template-configuration.md` (was `rules/08-00_Template_Configuration.mdc`) | 2026-02-20 |
| Mandatory Stop Points file created | `rules/02_Mandatory_Stop_Points.mdc` (new) | 2026-02-20 |
| Context-aware reading: RE-READ relevant XMLs per phase, not just Phase 0 | `08_Main`, `08-00`, `08-01`, `08-02` | 2026-02-20 |
| Grouped file reads for mappings: map + source profile + target profile + functions together | `08-00`, `08-01`, `08-02` | 2026-02-20 |
| Phase 0 = classification only; content generation uses fresh re-reads | `08_Main`, `08-00`, `08-01` | 2026-02-20 |

---

| V4.0 RGV Architecture: 6-phase model with per-section Read-Generate-Verify loops | All rule files, INDEX, README, ARCHITECTURE, templates, lib/docs | 2026-02-21 |
| RGV Loop (DRY): RE-READ → INVENTORY → GENERATE → VERIFY → FIX → CHECKPOINT defined once in 08-01 §1 | `01_Guidance.mdc` (source), all phases reference it | 2026-02-21 |
| Field Inventory pattern: Count elements, COMMIT to N, generate N rows, VERIFY N — prevents summarization | `01_Guidance.mdc §2`, `08-02`, `lib/docs/documentation-formats.md` | 2026-02-21 |
| Phase 2 split into 3 focused phases: Phase 2 (mappings only), Phase 3 (profiles/functions), Phase 4 (connectors/crossrefs) | `00_Phase_Orchestration.mdc` | 2026-02-21 |
| Micro-checkpoints per section: ✅ 4.1: MapName — 22/22 mappings (count-verified after every section) | `08-00`, `08-02`, `templates/documentation-style.yaml` | 2026-02-21 |
| Section-atomic execution: Each section is independent; must pass verification before proceeding to next | `08_Main`, `08-00`, `08-02` | 2026-02-21 |
| Reading plan with counts: Phase 0 builds per-phase reading plan with element counts per file | `00_Phase_Orchestration.mdc` | 2026-02-21 |
| RGV self-check expanded: 4 categories (RGV, Mapping, Output, Phase Boundary) with INVENTORY/VERIFY questions | `02_Mandatory_Stop_Points.mdc` | 2026-02-21 |
| Phase boundary anti-patterns: profiles/functions in Phase 2 → Phase 3, connectors in Phase 2 → Phase 4 | `02_Mandatory_Stop_Points.mdc` | 2026-02-21 |
|| Project field should contain flow name, not description | `templates/documentation-style.yaml`, `lib/docs/template-configuration.md`, `examples/` | 2026-02-21 |

---

## 🆕 PENDING INTEGRATION

*No pending learnings.*

> **V4.1 LLM Gap Integration (2026-04-05)**: LLM behavioral gap countermeasures integrated across all rule files — `<thinking>` blocks, Confidence Calibration, Evidence-Bound, Tree of Thought, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization.

---

## Quick Template

```markdown
### {#}. {Title} 🆕 [Pending - YYYY-MM-DD]

**Problem**: {1-2 lines}
**Solution**: {1 line}

{Single BAD vs GOOD example}

**Impact**: {High/Medium/Low} - {reason}
```

---

## Learning Types → Target Files

| Type | Target |
|------|--------|
| Phase workflow | `00_Phase_Orchestration.mdc` |
| Extraction patterns | `01_Guidance.mdc` |
| Anti-patterns & output rules | `02_Mandatory_Stop_Points.mdc` |
| Template formats | `lib/docs/template-configuration.md` |
| XML patterns (detailed) | `lib/docs/xml-patterns-reference.md` |
| Output formats (detailed) | `lib/docs/documentation-formats.md` |

---

## Tracking

| Date | Learning | Status | Target |
|------|----------|--------|--------|
| 2026-01-14 | Component types (12) | ✅ Integrated | 08-02 |
| 2026-01-14 | Shape types (18) | ✅ Integrated | 08-02 |
| 2026-01-14 | Document properties valueTypes | ✅ Integrated | 08-02 |
| 2026-01-14 | Transform function extraction | ✅ Integrated | lib/docs |
| 2026-01-14 | Process property extraction | ✅ Integrated | lib/docs |
| 2026-01-14 | Cross-reference extraction | ✅ Integrated | 08-02 |
| 2026-01-14 | Global function handling | ✅ Integrated | 08-02 |
| 2026-01-14 | Unknown element handling | ✅ Integrated | 08-02 |
| 2026-01-14 | Progressive output | ✅ Integrated | 08-01 |
| 2026-01-14 | Missing component type verification | ✅ Integrated | 08-01 |
| 2026-01-14 | Data types in mapping tables | ✅ Integrated | 08-02 |
| 2026-02-13 | Complete field mappings documentation | ✅ Integrated | 08-02 |
| 2026-02-13 | Source/target path verification | ✅ Integrated | 08-02 |
| 2026-02-13 | Gaps section for referenced-but-missing components | ✅ Integrated | 08-00, 08-01, documentation-style.yaml |
| 2026-02-14 | Output folder by process number | ✅ Integrated | 08-01 |
| 2026-02-14 | Mapping count verification (visual + grep) | ✅ Integrated | 08-02 |
| 2026-02-14 | Skip XML formatting preprocessing step | ✅ Integrated | 08_Main, 08-01, INDEX, style.yaml |
| 2026-02-14 | Flexible input location for Boomi exports | ✅ Integrated | 08-01 |
| 2026-02-14 | Output subfolder per flow ({flow_name}) | ✅ Integrated | All rules, templates, README, workflow |
| 2026-02-20 | V3.2 Lean 4-file architecture refactor | ✅ Integrated | All rule files |
| 2026-02-20 | Output separation (verification → supporting docs only) | ✅ Integrated | 08-00, 08-02, style.yaml |
| 2026-02-20 | Anti-summarize (never abbreviate mapping/shape tables) | ✅ Integrated | 08-01, 08-02, style.yaml |
| 2026-02-20 | Template Config moved to lib/docs/ | ✅ Integrated | lib/docs/template-configuration.md |
| 2026-02-20 | Mandatory Stop Points file created | ✅ Integrated | 02_Mandatory_Stop_Points.mdc |
| 2026-02-20 | Context-aware reading (RE-READ per phase) | ✅ Integrated | 08_Main, 08-00, 08-01, 08-02 |
| 2026-02-20 | Grouped file reads for mapping extraction | ✅ Integrated | 08-00, 08-01, 08-02 |
| 2026-02-21 | V4.0 RGV Architecture (6-phase model) | ✅ Integrated | All rule files, lib/docs, templates |
| 2026-02-21 | RGV Loop pattern (DRY, defined once in 08-01 §1) | ✅ Integrated | 08-01 (source), all phases reference |
| 2026-02-21 | Field Inventory pattern (COMMIT to N) | ✅ Integrated | 08-01 §2, 08-02, documentation-formats |
| 2026-02-21 | Phase 2 split → P2 (maps), P3 (profiles/functions), P4 (connectors) | ✅ Integrated | 08-00 |
| 2026-02-21 | Micro-checkpoints per section (N/N format) | ✅ Integrated | 08-00, 08-02, style.yaml |
| 2026-02-21 | Section-atomic execution | ✅ Integrated | 08_Main, 08-00, 08-02 |
| 2026-02-21 | Reading plan with counts in Phase 0 | ✅ Integrated | 08-00 |
| 2026-02-21 | RGV self-check (4 categories) | ✅ Integrated | 08-02 |
| 2026-02-21 | Phase boundary anti-patterns | ✅ Integrated | 08-02 |
| 2026-02-21 | Project field should contain flow name, not description | ✅ Integrated | templates/style.yaml, lib/docs/template-config.md, examples |
| 2026-04-05 | LLM gap: `<thinking>` + Confidence Calibration | ✅ Integrated | 00_Phase_Orchestration.mdc |
| 2026-04-05 | LLM gap: Evidence-Bound + Tree of Thought | ✅ Integrated | 01_Guidance.mdc |
| 2026-04-05 | LLM gap: Constitutional + Anti-Autopilot + Degradation + Sanitization | ✅ Integrated | 02_Mandatory_Stop_Points.mdc |
| 2026-04-05 | LLM gap: RISEN Narrowing + Mandatory Behavior | ✅ Integrated | Boomi_Documentation.mdc |

---

## References

- **Rules**: `rules/INDEX.md`
- **Architecture**: `ARCHITECTURE.md`
- **Templates**: `templates/`
- **Detailed Docs**: `lib/docs/`

---

🧞‍♂️ *R-GENIE: Capture → Validate → Integrate*
