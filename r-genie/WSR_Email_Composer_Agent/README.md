# WSR Email Composer Agent (v1.2.1)

> **R-GENIE Agent** · **Archetype:** Document Generator · **Version:** 1.2.1 · **Scripts Pillar:** Lean (9 tools — down from 19) · **Runtime state:** none (stateless, single-session)

LLM-native, infer-first conversational assistant that helps **Salesforce GDC delivery leads** compose a parser-compliant **Weekly Status Report** in **2 stop points**. The LLM reads any prior email or screenshot description natively (no parser script), asks the user once for genuine weekly updates, then produces a parser-ready HTML email for one final approval.

> **Goal:** composing a WSR via this agent should be **FASTER than typing the email manually** — and use only the scripts the LLM is genuinely unreliable at.

---

## What's New in v1.2 (2026-04-22)

**Lean refactor — 10 scripts dropped, all LLM-handled now:**

- ❌ `prior_email_parser.py` — LLM reads prior email / screenshot description natively
- ❌ `plaintext_email_builder.py` — preview rendered inline in chat, not to file
- ❌ `metrics_inference.py` — LLM parses Jira paste / free-text natively
- ❌ `gap_reporter.py` — LLM aggregates `⚠️ MISSING` markers inline + into `run_metadata.json`
- ❌ `subject_completeness_checker.py` — duplicate of `subject_line_validator`
- ❌ `date_format_validator.py` — LLM `<thinking>` self-check
- ❌ `recipient_validator.py` — LLM `<thinking>` self-check
- ❌ `fresh_email_checker.py` — LLM `<thinking>` self-check
- ❌ `section_order_validator.py` — LLM `<thinking>` self-check
- ❌ `forbidden_header_scanner.py` — LLM `<thinking>` self-check

**Output bundle reduced 6 → 4 files** (plain-text preview + gap report now rendered inline in chat).

**9 scripts retained** — only what LLMs are unreliable at:
- 6 format-compliance validators (regex / exact-phrase / auto-fix)
- 1 HTML builder (Gmail-compatible inline-styled tables)
- 2 calculators (days arithmetic, metrics math)

---

## What It Does

- Reads your prior WSR email or screenshot description natively (Mode A) — OR falls back to fresh prompts (Mode B)
- Asks you ONE batch of updates: leaves/holidays, Jira paste or metric description, free-form section edits/additions/removals
- Computes days totals from your team roster + leaves (`days_calculator.py`)
- LLM parses your Jira paste; `metrics_calculator.py` does the auditable math (Capacity %, User Story %, DpD)
- Runs 6 deterministic validators silently and surfaces only failures
- LLM does the trivial format checks in `<thinking>` (date, recipient, fresh email, section order, forbidden headers)
- Produces a parser-ready HTML file in a timestamped folder
- Renders plain-text preview + gap list **inline in chat** (no extra files)
- **Never invents content** — gaps flagged as `⚠️ MISSING — please provide {data}`
- **Never re-asks data** already inferred from your reference
- **Refuses Reply/Forward** — always composes fresh

---

## RISEN Summary (v1.2)

| | |
|---|---|
| **Role** | WSR Email Composer — LLM-native infer-first assistant |
| **Input** | (Mode A) prior `.eml` / pasted email / screenshot description + single batch reply with leaves + Jira paste + free-form updates. (Mode B) project name, sender, region + same single batch reply. **Date is always today, auto-injected.** |
| **Steps** | 3 phases: Phase 0 silent LLM-native ingest → Phase 1 single batch (Stop #1) → Phase 2 draft + silent 6-validator run + inline preview + approval (Stop #2) |
| **Expectation** | **4-artifact bundle** in `project/output_wsr/{YYYY-MM-DD-HHmm}_{project-slug}/`: `subject.txt` + `email_body.html` + `validation_report.md` + `run_metadata.json`. Plain-text preview + gap list rendered inline in chat. |
| **Narrowing** | Salesforce GDC Collab App WSRs only; does NOT send; no reply/forward; evidence-bound; never re-asks inferred data; never asks for date; HTML is the deliverable |

---

## Quick Start

### 1. Activate
```bash
sed -i '' 's|^#/r-genie/WSR_Email_Composer_Agent/|/r-genie/WSR_Email_Composer_Agent/|' .windsurfignore
```

In Windsurf/Cursor:
- Load main entry: `@r-genie/WSR_Email_Composer_Agent/rules/WSR_Email_Composer_Agent.mdc`
- Or via slash command: `/use-wsr-email-composer`

### 2. Hand It a Reference (Mode A — Recommended)
Paste last week's WSR email OR describe the contents of a screenshot. The LLM silently reads everything, then asks you ONE consolidated message — same shape as v1.1.

### 3. Reply Once
```
leaves: Akshay=2
metrics: Capacity 102/102, 43 stories planned 12 dev completed.
         Build 0 def, SIT 4 def, UAT 5 def, PROD 0
updates: add to Attention — "Heilite 1 build at risk, mitigation call Friday"
```

### 4. Approve and Send
The agent presents:
- Subject (in chat + `subject.txt`)
- **Plain-text preview** rendered inline in chat (visual review only)
- Validation summary (`✅ 6/6 PASS` typical)
- Inline gap list

Reply `approved` to lock the bundle. Then:

```
1. Open email_body.html in your browser (double-click the file)
2. Cmd+A then Cmd+C to copy the rendered content
3. Compose a FRESH email in Gmail/Outlook (do NOT Reply/Forward)
4. TO: gdc-project-collaboration@salesforce.com
5. CC: {your CC list}
6. Cmd+V into the body — Gmail preserves the rendered tables
7. Subject: paste from subject.txt
8. Send
```

> **Why open in browser?** Gmail strips inline styles when pasting from a chat console; copying from a browser-rendered HTML preserves rich formatting (tables, colors, borders).

---

## 3-Phase Workflow

| Phase | Name | Stop Point? | What Happens |
|-------|------|-------------|--------------|
| 0 | Ingest & Infer | No (silent) | LLM detects Mode A/B; reads prior reference natively (no script); auto-set today's date; load team roster; build draft state |
| 1 | Per-Section Updates | **Stop #1** | Single batch — present 6 inferred sections, ask leaves + Jira + free-form, run bidirectional sycophancy preview |
| 2 | Draft, Validate, Approve | **Stop #2** | Apply updates, compute days+metrics (script-backed math), LLM does trivial format checks + parses Jira paste, run 6 validators silently, render inline plain-text preview + gap list, write 4-file bundle |

**Total: 2 stop points. 4-file bundle. 9 scripts.**

---

## Artifact Bundle (v1.2)

Each run gets its own timestamped folder — same-day re-runs never overwrite:

```
project/output_wsr/{YYYY-MM-DD-HHmm}_{project-slug}/
├── subject.txt              # WSR | dd-mmm-yy | Project | Status - Color | Region
├── email_body.html          # Gmail-compatible HTML — THE deliverable
├── validation_report.md     # 6-validator PASS/FAIL (silent in P2; surfaced if FAIL)
└── run_metadata.json        # Audit: mode, inferences, inputs, gaps[], timestamp, tuner attribution
```

**Inline in chat at SP2 (NOT files):**
- Plain-text preview of the email body — for visual review
- Gap list — `⚠️ MISSING` items consolidated for the user (also captured in `run_metadata.json`)

---

## Scripts Pillar (9 Tools — v1.2 Lean)

> Design principle: keep ONLY scripts for what LLMs are unreliable at — exact-phrase format compliance, HTML rendering, auditable math.

**Validators (6)** — Phase 2 silent gate:
- `subject_line_validator` — regex enforces pipes + Status prefix
- `status_format_validator` — `Status -` (hyphen, not colon, not em-dash)
- `british_spelling_linter` (auto-fix) — `Utilization` → `Utilisation`
- `metric_name_validator` — exact phrases: `User Story Delivered`, `Defects Per Days`
- `numeric_format_validator` — DpD decimal (no `%`); percentages with `%`
- `body_structure_validator` — verifies all 6 required headers present

**Builder (1)** — Phase 2 rendering (with `--bundle-dir`):
- `html_email_builder` — Gmail-compatible HTML with inline-styled tables

**Calculators (2)** — Phase 2 math:
- `metrics_calculator` — Capacity %, Story %, DpD
- `days_calculator` — cumulative days from team roster + leaves

**LLM-handled (no script needed)**:
- Prior email / screenshot reading
- Jira paste parsing
- Gap list aggregation
- Plain-text preview rendering
- Date format check (`dd-mmm-yy`)
- Recipient check (`gdc-project-collaboration@salesforce.com` in TO)
- Fresh-email check (no `Re:`/`Fw:` in subject)
- Section order check (6 sections in correct order)
- Forbidden header scan (`Project Update:`, `Summary: TBD`)

See [`lib/docs/scripts_README.md`](lib/docs/scripts_README.md) for CLI usage.

---

## Tips

- **Hand it a reference** — Mode A auto-fills 80%+ of the draft; Mode B works but takes longer
- **Be specific in the Jira paste** — `Capacity 102/102` is parsed cleanly; the LLM is more flexible than regex was
- **List leaves precisely** — `Akshay=2, Bhawna=1` produces accurate cumulative days
- **Trust the bidirectional sycophancy guard** — flags both Green-with-blockers and Amber/Red-with-no-blockers
- **Don't ask the agent for the date** — it always uses today; if you need a different date, include it in your batch reply
- **Open the HTML in your browser before pasting into Gmail** — never copy from the chat preview (Gmail strips formatting)
- **Use Claude Sonnet (Thinking)** for standard runs; **Claude Opus (Thinking)** for complex multi-team WSRs

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-17 | Initial release via Agent Builder v1.2 — 8 phases, 8 stop points, 16 scripts |
| 1.1.0 | 2026-04-22 | Reduced to 3 phases / 2 stop points. Added Mode A reference parser, days calculator, metrics inference, bidirectional sycophancy guard, today auto-injection, timestamped bundles. Scripts: 16 → 19. |
| 1.2.0 | 2026-04-22 | LLM-native lean refactor. Dropped 10 scripts (parser, plain-text builder, metrics inference, gap reporter, 5 trivial validators + 1 duplicate). Bundle reduced 6 → 4 files. Plain-text preview + gap list rendered inline in chat. Scripts: 19 → 9. |
| **1.2.1** | **2026-04-22** | **Stateless design.** Dropped `.wsr-state.json` runtime persistence — single-session flow fits comfortably in the LLM's context window. `run_metadata.json` retained as post-hoc audit snapshot only (not runtime state). Cross-session resume removed (intentional). |

See [`Production_Learnings.md`](Production_Learnings.md) for field-tested patterns and tuning rationale.

---

## References

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — How it works under the hood (v1.2 updated)
- [`rules/INDEX.md`](rules/INDEX.md) — Rule file map (v1.2)
- [`templates/wsr-section-specs.yaml`](templates/wsr-section-specs.yaml) — Section structure + inference + days/metrics policy + 4-file bundle spec
- [`templates/team-roster.yaml`](templates/team-roster.yaml) — Active team members for `days_calculator`
- [`examples/reference_wsr_heineken.eml`](examples/reference_wsr_heineken.eml) — Canonical example
- Source guidelines: Salesforce GDC Collab App WSR Submission Guidelines

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-17
> 🔧 Tuned by sohail via R-GENIE Agent Tuner | v1.1.0 → v1.2.0 → v1.2.1 | 2026-04-22
