# DataWeave Agent - Rules Index

**Author**: Cheppali Shaik Sohail

## 4-File Architecture (Consistent with Other R-GENIE Agents)

| # | File | Purpose | Priority |
|---|------|---------|----------|
| 1 | `03-01_Dataweave.mdc` | **MAIN ENTRY POINT** - Identity, RISEN, workflow overview | HIGHEST |
| 2 | `03-01-00_Phase_Orchestration.mdc` | Phase workflow, checkpoints, state management | HIGH |
| 3 | `03-01-01_Guidance.mdc` | Patterns, functions, tools, quality, performance | HIGH |
| 4 | `03-01-02_Mandatory_Stop_Points.mdc` | Interactive enforcement, stop points | HIGHEST |

---

## Quick Reference

| Need | Reference |
|------|-----------|
| Start DataWeave session | `@03-01_Dataweave.mdc` |
| Phase workflow details | `@03-01-00_Phase_Orchestration.mdc` |
| Patterns, functions & tools | `@03-01-01_Guidance.mdc` |
| Stop point enforcement | `@03-01-02_Mandatory_Stop_Points.mdc` |

---

## Detailed Documentation (lib/docs/)

For comprehensive reference material beyond the essentials in Guidance:

| Document | Content |
|----------|---------|
| `functions-reference.md` | DataWeave functions |
| `xml-processing.md` | Complete XML patterns |
| `error-troubleshooting.md` | All error resolutions |
| `cli-framework.md` | CLI tool documentation |
| `quality-security.md` | Quality gates detail |
| `enterprise-config.md` | Configuration patterns |
| `excellence-focus.md` | Best practices |
| `performance-optimization.md` | MuleSoft performance |

---

## Safe Defaults Strategy

| Field Type | Strategy | Example |
|------------|----------|---------|
| Display | Natural null | `customer.name` |
| Arithmetic | `default 0` | `price as Number default 0` |
| Date arithmetic | `default now()` | `orderDate as Date default now()` |
| Boolean | `default false` | `isActive as Boolean default false` |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.1 | Apr 2026 | LLM behavioral gap countermeasures: `<thinking>` blocks, Confidence Calibration, RGV, Evidence-Bound, Tree of Thought, Few-Shot, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization |
| v2 | Jan 2026 | Lean 4-File Architecture, streamlined toolset |

---

🧞‍♂️ *R-GENIE DataWeave Agent V2.1 - Lean 4-File Architecture*
