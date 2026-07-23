# Code Review Agent - Rules Index

**Version:** 2.1.0 (RGV Multi-Pass)  
**Author**: Cheppali Shaik Sohail

---

## Rule Files

| File | Purpose | When Used |
|------|---------|-----------|
| `06_Code_Review.mdc` | Main entry, RISEN framework, RGV overview | Always (entry point) |
| `06-00_Template_Configuration.mdc` | Template loading, document skeleton, RGV config | Phase 1 |
| `06-01_Phase_Orchestration.mdc` | Progressive document workflow, RGV loop protocol | All phases/passes |
| `06-02_Guidance.mdc` | Bug patterns, mental execution, scoring, RGV strategy | Phases 3-5 |
| `06-03_Mandatory_Stop_Points.mdc` | User confirmation, inter-pass stops, RGV anti-patterns | All phases/passes |

---

## Quick Reference

### 5-Phase Workflow (RGV Multi-Pass)

| Phase | Focus | Document Action | RGV |
|-------|-------|-----------------|-----|
| 1 | Validate inputs | CREATE skeleton | Single |
| 2 | Extract requirements | UPDATE requirements | Single |
| 3 | Mental execution | UPDATE findings | **ITERATES** |
| 4 | Mapping verification | UPDATE mappings | **ITERATES** |
| 5 | Score & finalize | UPDATE score + RGV summary | Single |

### RGV Parameters

| Parameter | Value |
|-----------|-------|
| Default Passes | 3 (ask user after) |
| Convergence | Zero new CRITICAL/MEDIUM |
| Strategy | Full sweep every pass |
| Delta Tracking | Findings tagged with pass number |

### Bug Severity

| Severity | Example |
|----------|---------|
| CRITICAL | Array access `[0]` without null check |
| HIGH | Flow name mismatch, type mismatch |
| MEDIUM | Hardcoded values, low test coverage |

### Scoring Categories

| Category | Points |
|----------|--------|
| Requirements Compliance | 25 |
| Implementation Quality | 25 |
| Architecture & Design | 20 |
| Code Quality & Tests | 20 |
| Security & Compliance | 10 |

---

## Related Resources

| Resource | Location |
|----------|----------|
| Report template + RGV config | `templates/review-style.yaml` |
| Content guide (RGV format) | `templates/review-template-guide.md` |
| Examples (multi-pass) | `examples/` |

---

## Key Principles

1. **Progressive Document** - Update output file at each phase/pass, no state file
2. **Findings Only** - No fixes in main report
3. **Mental Execution** - Trace every flow step-by-step
4. **User Control** - Stop at each phase AND each RGV pass for confirmation
5. **RGV Multi-Pass** - Iterate Phase 3 & 4 until convergence (zero new Critical/Medium)
6. **Delta Tracking** - Every finding tagged with discovery pass number
7. **`<thinking>` Blocks** - Structured reasoning before every phase/pass output
8. **Evidence-Bound** - Every finding cites file:line source evidence
9. **Confidence Calibration** - HIGH/MEDIUM/LOW for every output

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.1 | Mar 2026 | RGV Multi-Pass iteration on Phase 3 & 4, delta tracking, convergence protocol |
| v2.1 | Apr 2026 | LLM behavioral gap countermeasures: `<thinking>` blocks, Confidence Calibration, Evidence-Bound, Tree of Thought, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization |
| v2 | Jan 2026 | Initial 5-Phase workflow with mental code execution |
