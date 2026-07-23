# R-GENIE Code Review Agent V2.1 (RGV Multi-Pass)

**Version:** v2.1 | **Author:** Cheppali Shaik Sohail

---

## What It Does

Mental code execution → **RGV multi-pass iteration** → **Progressive document updates** → Findings report

The agent traces through your MuleSoft code step-by-step, hunts bugs systematically across **multiple passes**, and builds the report incrementally. Each RGV pass catches issues that single-pass review misses.

---

## Progressive Document Approach

The report is built incrementally:

| Phase | What Happens | Document Update | RGV |
|-------|--------------|-----------------|-----|
| 1 | Scan project, count files | CREATE skeleton | Single |
| 2 | Extract requirements | UPDATE requirements | Single |
| 3 | Hunt bugs, trace flows | UPDATE findings tables | **ITERATES** |
| 4 | Verify mappings | UPDATE mapping section | **ITERATES** |
| 5 | Calculate score | UPDATE score + RGV summary | Single |

**The document is always viewable** - check progress at any phase/pass.

---

## What You Get

**Report:** `output_06_review/{project}-code-review.md`

| Section | Content |
|---------|--------|
| Executive Summary | Score, grade, production decision, RGV pass count |
| RGV Convergence Summary | Per-pass delta tracking, convergence status |
| Critical Issues | Bugs that block production (tagged with pass #) |
| High Severity Issues | Major issues (tagged with pass #) |
| Medium Severity Issues | Quality issues (tagged with pass #) |
| Field Mapping Verification | DataWeave analysis (tagged with pass #) |
| Quality Score | 100-point breakdown |
| Production Decision | Ready/Not Ready + RGV impact statement |

**What's NOT in the report:**
- How to fix issues
- Code solutions
- Recommendations

**Want fixes?** Reply "generate fixes" → Separate document

---

## How To Use

```bash
# Point to your MuleSoft project
@06_Code_Review.mdc @your-project-folder/

# Optionally include requirements for gap analysis
@06_Code_Review.mdc @your-project/ @requirements.md
```

---

## 5-Phase Workflow (RGV Multi-Pass)

| Phase | What Happens | Stop? |
|-------|--------------|-------|
| 1 | Initialize document, confirm scope | YES |
| 2 | Extract requirements (if provided) | YES |
| 3 | Mental execution (RGV loop: 3 default passes) | YES (each pass) |
| 4 | Verify mappings (RGV loop: 3 default passes) | YES (each pass) |
| 5 | Calculate score, generate RGV summary, finalize | NO |

### RGV (Repeated Generation Validation)

Phase 3 & 4 iterate until **zero new CRITICAL/MEDIUM findings**:

| Parameter | Value |
|-----------|-------|
| Default Passes | 3, then ask user |
| Convergence | Zero new CRITICAL or MEDIUM |
| Strategy | Full sweep every pass |
| Delta Tracking | Every finding tagged with pass # |
| HIGH-only pass | Does NOT block convergence |

**Why?** LLMs miss ~15-30% of issues in a single pass due to attention drift, context saturation, and pattern fixation. RGV eliminates this.

---

## 100-Point Scoring

| Category | Points |
|----------|--------|
| Requirements Compliance | 25 |
| Implementation Quality | 25 |
| Architecture & Design | 20 |
| Code Quality & Tests | 20 |
| Security & Compliance | 10 |

| Score | Grade | Production |
|-------|-------|------------|
| 90-100 | EXCEPTIONAL | ✅ Yes |
| 80-89 | EXCELLENT | ✅ Yes |
| 70-79 | GOOD | ⚠️ Conditional |
| 60-69 | ACCEPTABLE | ❌ No |
| 0-59 | POOR | ❌ No |

**Target:** 80+ for production approval

---

## Bug Hunt Order

The agent hunts systematically:

1. **Flows** - Entry points, execution paths, error handlers
2. **DataWeave** - Null safety, type coercion, field mappings
3. **Configs** - Hardcoded values, missing externalization
4. **Tests** - Coverage gaps, missing scenarios

---

## Example Output

```markdown
## Critical Issues

| ID | File | Line | Issue | Pass |
|----|------|------|-------|------|
| CRITICAL-001 | `account-mapping.dwl` | 101 | Array access [0] without null check | 1 |
| CRITICAL-003 | `process-order-flow.xml` | 52 | Null payload after scatter-gather timeout | 2 |

## Production Decision

**Decision:** ❌ NOT READY
**Blockers:** 3 critical, 27% test coverage
**Score:** 65/100
**RGV Impact:** Pass 2-3 found 4 additional findings missed by single-pass
```

---

## File Structure

```
06_Code_Review_Agent/
├── rules/                  # Agent behavior
├── templates/              # Report structure config
└── examples/               # Sample reports
```

---

*R-GENIE Code Review Agent V2.1 - Multi-pass forensic review. Find what single-pass misses.*
