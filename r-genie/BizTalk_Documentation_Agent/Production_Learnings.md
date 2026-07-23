# BizTalk Documentation Agent — Production Learnings

> Captured learnings from real runs. Add entries ONLY via the `/add-production-learnings` command with user approval.

**Author:** Cheppali Shaik Sohail  |  **Version:** 1.0.0

---

## How to Use

Each learning: what happened, root cause, the rule/guidance change that fixed it, and the file updated.

| # | Date | Learning | Root Cause | Countermeasure | File(s) |
|---|------|----------|-----------|----------------|---------|
| — | — | _(none yet — initial release)_ | — | — | — |

---

## Candidate Watch-List (validate in production)

- UTF-16 BOM handling on `.btm`/`.xsd` across different export tools.
- Maps using `CustomXSLT` vs pure functoids — confirm `.xsl` is always the better logic source.
- External assembly references (`VenEdi.Schemas`, `Venture.Utilities`) frequently absent — confirm gap-report wording is actionable for the BizTalk team.
- Very large orchestrations (Complex tier, e.g., VenMYEInvoice) — confirm positional-bias re-scan catches mid-file shapes.
