# Salesforce Solution Architect Agent — Validation Scripts

**Pillar 1 (Scripts) — LIGHT footprint** per Lean Script Principle.
Only checks LLMs are unreliable at; relies on AI + Human for everything else.

---

## Scripts

| Script | Purpose | Mandatory Phase |
|--------|---------|-----------------|
| `validate-solution-doc.js` | Validates 12-section presence, Mermaid lint, §9 numeric arithmetic, cross-section entity consistency, residual marker check | Phase 8c |

---

## `validate-solution-doc.js`

### What it checks (6 checks)

1. **All 12 sections present, in fixed order** — heading pattern `## N. Title`
2. **Mermaid blocks lint clean** — `curve: 'linear'` directive, no `\n` labels, styles at end
3. **§9 numeric claims have arithmetic** — TPS / volume / sizing tokens require `÷ × =` within ±10 lines
4. **Cross-section entity consistency** — entities introduced in §4 must appear in §6 or §7
5. **No residual `<!-- SECTION: ... -->` markers** — Pattern #20 v2 contract
6. **No residual `_{pending Phase N}_` placeholders** — Phase 8 polish must replace all

### What it does NOT check (LLM is reliable here)

- Narrative quality
- Technical correctness of design decisions
- Markdown link validity (use `markdown-link-check` separately if needed)
- Section content depth (LLM + HITL handles)

### Usage

```bash
node r-genie/Salesforce_Solution_Architect_Agent/lib/scripts/validate-solution-doc.js \
  project/output_salesforce_solution_architect/{scenario-slug}-solution-architecture.md
```

### Exit codes

- `0` — all checks pass
- `1` — one or more checks failed (review report)
- `2` — usage error (missing file argument or file not found)

### When to run

- **Mandatory**: Phase 8c (after §11 + §12 written, before CONSOLIDATE & POLISH)
- **Optional**: any time during Phases 1-7 to spot-check structural compliance

### Output format

```
🔍 validate-solution-doc.js — checking: <path>

── Check 1. All 12 sections present, in order ──
  ✅ §1 "Business & Technical Context" — present
  ✅ §2 "Recommended Architecture" — present
  ...

── Check 2. Mermaid blocks lint clean ──
  ✅ Mermaid block #1 — lint clean

── Check 3. §9 numeric claims have arithmetic ──
  ❌ §9 line ~382: numeric claim "5,000 TPS peak" lacks nearby arithmetic block

...

─────────────────────────────────────────────────────────
SUMMARY: 22 pass, 1 fail
─────────────────────────────────────────────────────────
```

### Lean Script Principle Justification

This single script earns its place because:
- **Section presence**: LLM verbosity bias drops sections silently in long Consolidate passes (Gap #12)
- **Mermaid lint**: LLMs misemit `\n` and forget `curve` directive (proven Gap)
- **Arithmetic check**: LLMs hand-wave numbers in long-form output (Gap #13)
- **Cross-section consistency**: LLMs lose entity-naming discipline across 9 phases (Gap #1, #11)
- **Marker cleanup**: LLMs forget to replace consumed markers in Phase 8 polish

Each of these has been observed at >1/100 runs in production R-GENIE agents — meets Lean Principle threshold.

---

## Adding New Scripts

If a new check earns its place per Lean Script Principle (LLM fails ≥1/100 runs):
1. Create `lib/scripts/{script-name}.js`
2. Add a row to the table above
3. Reference in `@01_Phase_Orchestration.mdc` MANDATORY SCRIPT DIRECTIVE if the check should block a checkpoint
4. Reference in `@Salesforce_Solution_Architect.mdc` MANDATORY SCRIPTS section
5. Update `Production_Learnings.md` with the production observation that justified the script

**Anti-pattern**: scripting things LLMs do reliably. See `r-genie/Agent_Builder/lib/docs/prompt-engineering-patterns.md` Pattern #19 (Programmatic Validation).

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-05-13
