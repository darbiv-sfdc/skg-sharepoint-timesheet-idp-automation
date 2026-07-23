# Code Review Report - Template Guide

**Version:** v2.1 (RGV Multi-Pass)  
**Author**: Cheppali Shaik Sohail

---

## Report Structure

Single detailed report (~4-6 pages):

```
# Code Review: {project-name}

## Executive Summary          ← Phase 5 (+ RGV metadata)
## RGV Convergence Summary    ← NEW: Pass counts, delta tracking
## Critical Issues            ← Phase 3 (tagged with [Pass N])
## High Severity Issues       ← Phase 3 (tagged with [Pass N])
## Medium Severity Issues     ← Phase 3 (tagged with [Pass N])
## Flow-by-Flow Analysis      ← Phase 3
## Field Mapping Verification ← Phase 4 (tagged with [Pass N])
## Test Coverage Analysis     ← Phase 3
## Security Analysis          ← Phase 3
## Quality Score Breakdown    ← Phase 5
## Production Decision        ← Phase 5
```

---

## Placeholders (Phase 1 Skeleton)

| Section | Placeholder |
|---------|-------------|
| Score/Grade | `_Pending Phase 5_` |
| RGV Summary | `_Pending RGV completion..._` |
| Findings | `_Pending Phase 3 analysis..._` |
| Mappings | `_Pending Phase 4 analysis..._` |
| Decision | `_Pending Phase 5..._` |

---

## Section Formats

### RGV Convergence Summary (after Executive Summary)

| Phase | Passes | Converged | New in Last Pass |
|-------|--------|-----------|------------------|
| Phase 3: Bug Hunt | 3 | ✅ Yes | 0 Critical/Medium |
| Phase 4: Mappings | 2 | ✅ Yes | 0 Critical/Medium |

#### Per-Pass Delta

| Pass | New Critical | New High | New Medium | Cumulative Total |
|------|-------------|----------|------------|------------------|
| Pass 1 | 2 | 3 | 4 | 9 |
| Pass 2 | 1 | 1 | 2 | 13 |
| Pass 3 | 0 | 1 | 0 | 14 |

### Issues Tables (with Pass column)

| ID | File | Line | Issue | Pass |
|----|------|------|-------|------|
| CRITICAL-001 | `file.dwl` | 101 | Array access without null check | 1 |
| CRITICAL-003 | `file.dwl` | 55 | Filter result [0] no empty check | 2 |

+ **Impact:** summary statement

### Flow-by-Flow Analysis

```
### flow-name (`file.xml`)

| Trigger | Bugs Found |
|---------|------------|
| HTTP POST /path | 2 |

**Trace:**
1. Component (Line X) → ✅
2. Component (Line Y) → ⚠️ BUG: description
```

### Mapping Verification (with Pass column)

| Source | Target | Status | Pass |
|--------|--------|--------|------|
| field.a | Field.A | ✅ | 1 |
| field.b | Field.B | ❌ Missing | 1 |
| field.c | Field.C | ⚠️ Type issue | 2 |

**Coverage:** X% | **Type Issues:** Y | **Null Issues:** Z

### Score Breakdown

| Category | Score | Max |
|----------|-------|-----|
| Requirements | 20 | 25 |
| Implementation | 17 | 25 |
| Architecture | 15 | 20 |
| Code Quality | 12 | 20 |
| Security | 8 | 10 |
| **TOTAL** | **72** | **100** |

### Production Decision

**Decision:** ⚠️ CONDITIONAL / ❌ NOT READY / ✅ READY
**Blockers:** list
**Score:** X/100

---

## Rules

| Rule | Details |
|------|---------|
| Tables over paragraphs | Use tables for all findings |
| File paths in backticks | `src/main/file.xml` |
| Include impact | Each severity section needs Impact summary |
| No fixes | Report bugs only, not solutions |

---

## Update Pattern

```
Phase 3 Pass N: search_replace("_Pending Phase 3 analysis..._", findings)  # Pass 1 only
                append(new_findings_from_pass_N)                            # Pass 2+
Phase 4 Pass N: search_replace("_Pending Phase 4 analysis..._", mappings)  # Pass 1 only
                append(new_mapping_findings_from_pass_N)                    # Pass 2+
Phase 5:        search_replace("_Pending RGV completion..._", convergence_summary)
                search_replace("_Pending Phase 5..._", decision)
                search_replace("_Pending_", values)
```
