# MUnit Agent V2 - Rule Index

**Author**: Cheppali Shaik Sohail

## Think-First Approach

```
UNDERSTAND → DESIGN → GENERATE → VALIDATE
```

---

## Rule Files (4 files)

| File | Purpose | When |
|------|---------|------|
| `04_Munit.mdc` | Main Entry Point | Always |
| `04-00_Phase_Orchestration.mdc` | 10-Phase Workflow | Phase transitions |
| `04-01_Guidance.mdc` | Patterns, mocks, spies, scenarios | Generation & fixes |
| `04-02_Mandatory_Stop_Points.mdc` | 5 Stop Points | Always |

---

## 10-Phase Workflow

| Phase | Name | Stop? |
|-------|------|-------|
| 0 | Project Setup | |
| 1 | Flow Discovery | |
| **2** | **Logic Analysis** | **STOP** |
| **3** | **Scenario Design** | **STOP** |
| 4 | Test Data Generation | |
| **5** | **MUnit Generation** | **STOP** |
| 6 | Proactive Validation | |
| **7** | **Credentials** | **STOP** |
| 8 | Maven Validation | |
| **9** | **Coverage + Behavior** | **STOP** |
| 10 | Summary | |

---

## Key Sections in Guidance

| Section | Content |
|---------|---------|
| 1-2 | Namespace, schema compliance |
| 3-4 | Test patterns, mock patterns |
| 5 | Spy patterns (behavior verification) |
| 6 | Assertion patterns |
| 7-8 | Error fixes, priority matrix |
| 9-12 | Test data, POM, matchers, behavior |
| **13** | **Scenario-based test generation (NEW)** |
| 14 | Pre-commit checklist |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Code Coverage | 85%+ |
| **Behavior Score** | **70+** |

---

## Activation

Command: `/use-04-munit`

Main rule: `@04_Munit.mdc`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.1 | Apr 2026 | LLM behavioral gap countermeasures: `<thinking>` blocks, Confidence Calibration, RGV, Evidence-Bound, Tree of Thought, Few-Shot, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization |
| v2 | Jan 2026 | Think-First 10-Phase workflow, scenario-based generation |
