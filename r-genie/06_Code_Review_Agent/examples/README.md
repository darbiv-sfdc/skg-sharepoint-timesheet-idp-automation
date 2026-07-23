# Code Review Agent - Examples

**Purpose:** Sample findings-only review reports for reference.  
**Author**: Cheppali Shaik Sohail

---

## Available Examples

| Example | Type | Score | Demonstrates |
|---------|------|-------|--------------|
| [`01_complete_review_report.md`](01_complete_review_report.md) | Standard | 82/100 | Full findings report |
| [`02_quick_review_summary.md`](02_quick_review_summary.md) | Summary | 75/100 | Quick review format |

---

## How to Use

### As Reference
- Report structure and sections
- Bug documentation format (file:line)
- Severity classification
- Findings-only content

### Key Patterns
- Tables over paragraphs
- Specific locations (file:line)
- Severity always included
- NO recommendations in main report

---

## Report Benchmarks

| Section | Coverage |
|---------|----------|
| Executive Summary | Score, grade, decision |
| Critical Issues | Table with locations |
| Bug Findings | All severities |
| Requirements Gaps | If requirements provided |
| Mapping Issues | DataWeave verification |
| Quality Score | 100-point breakdown |

---

## Findings-Only Rule

**Examples show:**
- What's broken
- Where it's broken
- Why it matters
- Severity level

**Examples do NOT show:**
- How to fix
- Code solutions
- Recommendations

*Fixes go in supplementary document (on request)*

---

*Code Review Agent V2 - Findings-only examples*
