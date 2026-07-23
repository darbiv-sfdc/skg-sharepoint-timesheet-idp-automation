# Scripts Pillar — WSR Email Composer (v1.2.1 Lean + Stateless)

> **Design principle:** keep ONLY scripts for what LLMs are unreliable at — HTML/CSS rendering, multi-step arithmetic, and exact-phrase format compliance with auto-fix or regex precision. Everything else (text extraction, free-text parsing, gap aggregation, trivial format checks) is LLM-native via `<thinking>` blocks.
>
> **v1.2 reduction**: 19 → 9 scripts (−53%). See `../../Production_Learnings.md` for rationale.

---

## Inventory (9 scripts)

```
lib/
├── builders/
│   └── html_email_builder.py            # 1 — Gmail-compatible HTML rendering
├── calculators/
│   ├── days_calculator.py               # 2 — Cumulative days from team-roster + leaves
│   └── metrics_calculator.py            # 3 — Capacity %, Story %, DpD math
└── validators/
    ├── body_structure_validator.py      # 4 — All 6 required headers present
    ├── british_spelling_linter.py       # 5 — Utilization → Utilisation (auto-fix)
    ├── metric_name_validator.py         # 6 — Exact phrases: "User Story Delivered", "Defects Per Days"
    ├── numeric_format_validator.py      # 7 — DpD decimal (no %); percentages with %
    ├── status_format_validator.py       # 8 — "Status -" hyphen prefix
    └── subject_line_validator.py        # 9 — Subject regex (also covers completeness)
```

**Removed in v1.2:** `parsers/prior_email_parser.py`, `builders/plaintext_email_builder.py`, `calculators/metrics_inference.py`, `reporters/gap_reporter.py`, `validators/{subject_completeness_checker,date_format_validator,recipient_validator,fresh_email_checker,section_order_validator,forbidden_header_scanner}.py`

---

## What the LLM Now Does Natively (instead of scripts)

| Task | How |
|------|-----|
| Read prior `.eml` / pasted email / screenshot description | LLM reads in `<thinking>` block during Phase 0 |
| Parse user's Jira sprint export → metrics dict | LLM extracts capacity / stories / per-phase defects natively in Phase 2 |
| Aggregate `⚠️ MISSING` markers into a gap list | LLM scans final draft and renders inline at SP2 + captures into `run_metadata.json gaps[]` |
| Render plain-text preview of the email body | LLM renders inline at SP2 (uses `templates/wsr-email-template.txt` as structural reference) |
| Verify date is `dd-mmm-yy` | LLM `<thinking>` self-check in Phase 2 |
| Verify TO contains `gdc-project-collaboration@salesforce.com` | LLM `<thinking>` self-check |
| Verify subject doesn't start with `Re:`/`Fw:`/`Fwd:` | LLM `<thinking>` self-check |
| Verify all 6 sections appear in correct order | LLM `<thinking>` self-check (body_structure_validator catches missing headers) |
| Scan for forbidden headers (`Project Update:`, `Summary: TBD`) | LLM `<thinking>` self-check |

---

## Script Reference

### 1. `builders/html_email_builder.py`
**Purpose:** Render a Gmail-compatible HTML email with inline-styled tables, color-coded status indicators, hierarchical bullet structure.

**Why script (not LLM):** HTML/CSS rendering with inline styles is brittle when LLMs produce it; deterministic builder ensures Gmail/Outlook parser compatibility.

**Usage:**
```bash
# The agent writes a transient JSON file from its in-context draft, then hands it to the builder.
# --state here is the builder's input-JSON flag; it is NOT cross-session runtime state.
python lib/builders/html_email_builder.py \
    --state /tmp/wsr_draft.json \
    --bundle-dir project/output_wsr/2026-04-22-1130_heineken-migration/
```

**Output:** Writes `email_body.html` to the bundle directory + appends to `run_metadata.json`. The transient `/tmp/wsr_draft.json` can be deleted after the run.

---

### 2. `calculators/days_calculator.py`
**Purpose:** Compute cumulative running days totals per release phase from team roster + leaves.

**Why script (not LLM):** Multi-step arithmetic; auditable numbers required for delivery reporting.

**Formula:** `new_total = prior_total + (active_members × 5 × weeks_elapsed) − sum(leaves)`

**Usage:**
```bash
echo '{"Build": 579, "SIT": 579, "UAT": 579, "PROD": 0, "Over All Delivery": 579}' > /tmp/prior.json
python lib/calculators/days_calculator.py --prior /tmp/prior.json --leaves "Akshay=2,Bhawna=1" --weeks 1
```

**Output (JSON):**
```json
{"increment_per_phase": 67, "leaves_total": 3, "active_members": 14,
 "phases": {"Build": 646, "SIT": 646, "UAT": 646, "PROD": 0, "Over All Delivery": 646}}
```

---

### 3. `calculators/metrics_calculator.py`
**Purpose:** Compute Capacity Utilisation %, User Story Delivered %, and Defect Per Days (DpD) per release phase.

**Why script (not LLM):** Math; auditable for delivery reporting. Consumes the LLM's natively-parsed Jira dict directly (v1.2: no inference script in front).

**Usage:**
```bash
echo '{"capacity_actual": 102, "capacity_planned": 102, "story_planned": 43, "story_completed": 10,
       "phases": {"Build": {"days": 646, "defects": 0}, "SIT": {"days": 646, "defects": 4},
                  "UAT": {"days": 646, "defects": 5}, "PROD": {"days": 0, "defects": 0}}}' > /tmp/m.json
python lib/calculators/metrics_calculator.py --input /tmp/m.json --format human
```

**Output:** Capacity 100%, Story 23%, per-phase DpD decimals, "Over All Delivery" totals.

---

### 4. `validators/body_structure_validator.py`
**Purpose:** Verify all 6 required body section headers are present in correct order (`Summary of WSR:`, status lines, `Ask for/ Attention required by Leaders:`, sub-headers `Ask :` and `Attention:`, `Delivery Metrics & Quality Details:`).

**Why script (not LLM):** Multi-pattern structural check; LLM may skip a header on edge cases.

**Usage:**
```bash
python lib/validators/body_structure_validator.py --html project/output_wsr/.../email_body.html
```

---

### 5. `validators/british_spelling_linter.py` (with auto-fix)
**Purpose:** Catch + auto-fix `Utilization` → `Utilisation`, plus other common American → British conversions.

**Why script (not LLM):** Auto-fix is the unique value; LLM occasionally misses single-character substitutions in long content.

**Usage:**
```bash
python lib/validators/british_spelling_linter.py --html ... --fix-in-place
```

---

### 6. `validators/metric_name_validator.py`
**Purpose:** Enforce exact phrases — `User Story Delivered` (not "Stories"), `Defects Per Days` (not "Defects/Day", "DpD%").

**Why script (not LLM):** LLMs frequently drift to plural ("Stories") or shorthand; parser silently rejects.

---

### 7. `validators/numeric_format_validator.py`
**Purpose:** Enforce DpD as decimal (no `%`); percentages with `%`; `XX.XX` format for DpD values.

**Why script (not LLM):** LLMs frequently append `%` to DpD; parser silently rejects.

---

### 8. `validators/status_format_validator.py`
**Purpose:** Enforce `Status - {Color}` (hyphen + space) in subject. Rejects `Status: Color`, `Status — Color` (em-dash), `Status_Color`.

**Why script (not LLM):** Unicode look-alikes (em-dash vs hyphen) are visually identical; LLM may produce em-dash. Parser is byte-exact.

---

### 9. `validators/subject_line_validator.py`
**Purpose:** Enforce subject regex `^WSR \| \d{2}-[A-Z][a-z]{2}-\d{2} \| .+ \| Status - (Green|Amber|Red) \| .+$`. Covers component completeness in v1.2 (replaces the dropped `subject_completeness_checker.py`).

**Why script (not LLM):** Pipe delimiter spacing, date format, and component count are byte-exact; parser silently rejects subtle variations.

---

## Integration into the 3-Phase Workflow

| Phase | Scripts Run | LLM-Native |
|-------|-------------|------------|
| **Phase 0 — Ingest & Infer** | (none) | LLM reads prior reference, extracts subject/sender/sections/metrics/days |
| **Phase 1 — Per-Section Updates** | (none) | LLM presents inferred batch + sycophancy preview |
| **Phase 2 — Draft, Validate, Approve** | `days_calculator` → `metrics_calculator` → 6 validators (silent, parallel) → `html_email_builder --bundle-dir` | LLM parses Jira paste, aggregates gaps, renders plain-text preview inline, runs `<thinking>` self-checks (date, recipient, fresh-email, section order, forbidden headers) |

---

## Common Patterns

### Bundle write (Phase 2)
```bash
TS=$(date +%Y-%m-%d-%H%M)
PROJECT_SLUG="heineken-migration"
BUNDLE="project/output_wsr/${TS}_${PROJECT_SLUG}"
mkdir -p "$BUNDLE"

python lib/calculators/days_calculator.py --prior /tmp/prior.json --leaves "$LEAVES" > "$BUNDLE/days.json"
python lib/calculators/metrics_calculator.py --input /tmp/metrics.json --format json > "$BUNDLE/metrics.json"
python lib/builders/html_email_builder.py --state /tmp/wsr_draft.json --bundle-dir "$BUNDLE"

# Run all 6 validators
for v in lib/validators/*.py; do python "$v" --html "$BUNDLE/email_body.html"; done > "$BUNDLE/validation_report.md"
```

### Inline preview (Phase 2 — LLM, no script)
The LLM renders the plain-text preview directly in chat at SP2, structured per `templates/wsr-email-template.txt`. No file written.

### Inline gap list (Phase 2 — LLM, no script)
The LLM scans the final HTML for `⚠️ MISSING` markers, deduplicates, renders inline at SP2, and writes the array into `run_metadata.json gaps[]`.

---

## Why This Lean Pillar Works

| Concern | v1.0/v1.1 Approach | v1.2 Approach | Verdict |
|---------|---------------------|----------------|---------|
| Silent parser rejection | 12 validators | 6 validators + LLM `<thinking>` self-checks | **Same coverage; less script overhead** |
| Reference parsing | Regex-based parser script | LLM reads natively | **More flexible; handles arbitrary formats** |
| Jira parsing | Regex-based inference script | LLM parses natively | **More flexible; handles edge cases** |
| Math (days, metrics) | Calculators | Calculators | **Unchanged — math stays scripted for audit** |
| HTML rendering | HTML builder | HTML builder | **Unchanged — Gmail-compatible HTML stays scripted** |
| Plain-text preview | Builder script + bundle file | LLM renders inline in chat | **Eliminates 1 script + 1 file; preview is for review only** |
| Gap report | Reporter script + bundle file | LLM renders inline + captures in `run_metadata.json` | **Eliminates 1 script + 1 file; same audit value** |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-17
> 🔧 Tuned by sohail via R-GENIE Agent Tuner | v1.1.0 → v1.2.0 → v1.2.1 | 2026-04-22
