# Production_Learnings.md

> **Field-tested patterns and lessons** for the WSR Email Composer agent.
> Populated over time as the agent is used on real WSR submissions.

---

## How to Use This File

This file is an **empty production log** initially. As you use the agent on real WSRs, append learnings here in the template below. The `/add-production-learnings` workflow can be used to capture them automatically.

Production learnings are **referenced by the agent during runs** (Phase 0 `<thinking>` block checks this file for applicable patterns) — so the agent gets smarter over time based on what actually happens in production.

---

## Learning Template

```markdown
### YYYY-MM-DD — {Short Title}

**Context:** {What WSR was being composed; anything unusual}

**What Happened:** {The issue encountered — validation failure, user confusion, edge case}

**Root Cause:** {Why it happened}

**Fix / Pattern:** {The resolution; rule or pattern to prevent recurrence}

**Rule File Updated:** {Which rule file was tuned, if any}

**Validator Added:** {If a new validator was created}
```

---

## Entries

### 2026-04-22 — v1.2.1: Stateless Design (Dropped `.wsr-state.json`)

**Context:** Right after the v1.2 lean refactor, user audit asked: "do we really need state management? This is a simple use case, we won't lose the context window."

**What Happened:** v1.1 introduced `.wsr-state.json` for resume capability and audit trail. v1.2 kept it. But a WSR run is a short, single-session flow (3 phases, 2 stops, minutes of wall-clock). A modern LLM's 200k-token context window comfortably holds the entire run: reference + Phase 0 inferences + Phase 1 batch reply + Phase 2 draft + silent validation results.

**Root Cause:** Runtime state persistence was a reflex from the v1.0 multi-phase design (when a single user prompt wasn't enough). Once the flow collapsed to a single-session batch interaction in v1.1+, the state file became pure overhead — schema drift risk, file I/O, and another thing to maintain, with zero delivered benefit.

**Fix / Pattern — Stateless-When-Short Principle:**

> **Drop runtime state files** when the entire workflow fits comfortably in one chat session and cross-session resume isn't a requirement. The LLM's context window IS the state. Keep only post-hoc audit artifacts (written once at the end, not updated incrementally).

Applied that principle:
- **Dropped** `.wsr-state.json` runtime persistence
- **Dropped** `STATE FILE` and `STATE FILE UPDATE PROTOCOL` sections from `01_Phase_Orchestration.mdc`
- **Dropped** `RESUME CAPABILITY` section — cross-session resume not supported (intentional — lower friction to restart from Phase 0 than to maintain a schema)
- **Replaced** with `IN-CONTEXT DRAFT SHAPE` documentation — same dict shape, but lives only in LLM conversation context
- **Kept** `run_metadata.json` — reframed as **post-hoc audit snapshot** (written ONCE at SP2 post-approval), not runtime state
- **Kept** `BACKWARD NAVIGATION` — but scoped to "in-session only" (draft still in LLM context when user says `edit {section}`)
- **Clarified** `html_email_builder.py`'s `--state` CLI flag: it's the builder's input-JSON arg name, not persistent runtime state (now examples use `/tmp/wsr_draft.json`)

**Rule File Updated:** `WSR_Email_Composer_Agent.mdc`, `01_Phase_Orchestration.mdc`, `ARCHITECTURE.md`, `INDEX.md`, `scripts_README.md` — all bumped to v1.2.1.

**Validator Added:** None.

**v1.2 → v1.2.1 Reduction Summary:**
| | v1.2 | v1.2.1 |
|--|--|--|
| Runtime state files | 1 (`.wsr-state.json`) | **0** |
| Session model | "stateful with resume" | **"stateless, single-session"** |
| Post-hoc audit artifacts | `run_metadata.json` | `run_metadata.json` (unchanged; reframed as audit-only) |
| Bundle files at SP2 | 4 | 4 (unchanged) |

**Trade-off Accepted:** If a session is interrupted mid-flow, the user restarts from Phase 0 in a new session (pastes reference + single batch reply). This is faster than maintaining a runtime schema for a rare failure case.

---

### 2026-04-22 — v1.2 Lean Refactor: 19→9 Scripts, LLM-Native Inference

**Context:** Immediately after the v1.1 tuning (which reduced stop points 8 → 2 and added 3 new scripts to bring the total to 19), user audit asked: "do we really need a parser? plain-text builder? gap reporter? Can the LLM not handle these natively?"

**What Happened:** v1.1 introduced `prior_email_parser.py`, `metrics_inference.py`, `gap_reporter.py`, kept `plaintext_email_builder.py`, and retained 12 validators — but several of these did things the LLM does well natively (text extraction, free-text parsing, marker aggregation) or things that were trivially done in `<thinking>` (date format, recipient check, fresh-email check, section order, forbidden header scan).

**Root Cause:** v1.0 → v1.1 added scripts under the assumption that "deterministic = better". But for natural-language tasks, modern LLMs are more flexible than regex. For trivial format checks, LLM `<thinking>` is reliable. Scripts should be reserved for what LLMs genuinely drift on.

**Fix / Pattern — Lean Architecture Principle:**

> **Keep a script if and only if** the task is one of: (a) HTML/CSS rendering, (b) multi-step arithmetic, (c) exact-phrase format compliance with auto-fix, OR (d) regex-precise structural validation that LLMs occasionally miss.

Applied that principle:
- **DROPPED 10 scripts:**
  - `prior_email_parser.py` — LLM reads natively
  - `plaintext_email_builder.py` — preview rendered inline in chat
  - `metrics_inference.py` — LLM parses Jira paste natively (math then runs in `metrics_calculator.py`)
  - `gap_reporter.py` — LLM aggregates `⚠️ MISSING` markers inline + into `run_metadata.json`
  - `subject_completeness_checker.py` — duplicate of `subject_line_validator`
  - `date_format_validator.py` — LLM `<thinking>` self-check
  - `recipient_validator.py` — LLM `<thinking>` self-check
  - `fresh_email_checker.py` — LLM `<thinking>` self-check
  - `section_order_validator.py` — LLM `<thinking>` self-check
  - `forbidden_header_scanner.py` — LLM `<thinking>` self-check
- **KEPT 9 scripts:** 6 format validators (subject_line, status_format, british_spelling auto-fix, metric_name, numeric_format, body_structure) + 1 HTML builder + 2 calculators (days, metrics)
- **BUNDLE 6 → 4 files:** dropped `email_body.txt` (preview now inline) and `gap_report.md` (gap list now inline + captured in `run_metadata.json gaps[]`)
- **HTML send instruction clarified:** open `email_body.html` in browser → Cmd+A Cmd+C → paste into Gmail. Never instruct chat-paste-to-Gmail (Gmail strips chat-pasted formatting).

**Rule File Updated:** All 5 rule files + INDEX.md + README.md + ARCHITECTURE.md updated to v1.2; `templates/wsr-section-specs.yaml` `parser_script` and `inference_script` set to null; `output_artifacts.files` reduced to 4 with `chat_only` block added.

**Validator Added:** None (10 scripts removed).

**v1.1 → v1.2 Reduction Summary:**
| | v1.1 | v1.2 | Δ |
|--|--|--|--|
| Phases | 3 | 3 | 0 |
| Stop points | 2 | 2 | 0 |
| Scripts | 19 | **9** | **−10 (−53%)** |
| Validators | 12 | **6** | **−6** |
| Output bundle files | 6 | **4** | **−2** |
| Inline chat artifacts | 0 | **2** (preview + gap list) | +2 |
| LLM `<thinking>` self-checks | 0 | **5** (date, recipient, fresh-email, section order, forbidden headers) | +5 |

**v1.0 → v1.2 Cumulative Reduction:**
| | v1.0 | v1.2 | Δ |
|--|--|--|--|
| Phases | 8 | 3 | **−5 (−63%)** |
| Stop points | 8 | 2 | **−6 (−75%)** |
| Scripts | 16 | 9 | **−7 (−44%)** |

---

### 2026-04-22 — v1.1 Tuning: 8→2 Stop Points, Infer-First Design

**Context:** Initial production usage of v1.0 revealed that the 8-phase / 8-stop-point flow was perceived as more time-consuming than typing the email manually. Users requested a streamlined flow where the agent extracts everything possible from a prior WSR email or screenshot, asks for only the genuine weekly updates, and produces a final draft for one approval.

**What Happened:** v1.0 asked the user for data already present in their prior reference (project name, region, sender, status colors, section content, metrics). It also asked for the date despite the date always being today. Per-section approvals (6 of them) made the flow feel like a survey rather than a co-author.

**Root Cause:** v1.0 was designed as a "guided composition" pattern (good for first-time users) but users running the agent weekly already have a prior email and want it as a starting point, not an endpoint.

**Fix / Pattern:**
- Added Mode A (reference) auto-detection in Phase 0; runs `prior_email_parser.py` silently to extract subject, sender, CC, status, all 6 sections, metric values, per-phase days, team labels, workstream names
- Auto-injected today's date via `date "+%d-%b-%y"` — never asked
- Consolidated 6 per-section approvals into a single Phase 1 batch (1 stop point) — leaves + Jira paste + free-form
- Added `days_calculator.py` with `team-roster.yaml` (3 teams × 14 members) — formula `prior + members×5×weeks − leaves`
- Added `metrics_inference.py` to parse Jira pastes / free-text metric descriptions into structured numbers
- Final approval consolidated into a single Phase 2 stop point with silent 12-validator run + gap report
- Bidirectional sycophancy guard upgraded to also catch Amber/Red-with-no-blockers (Direction B)
- Each run writes to a timestamped folder `{YYYY-MM-DD-HHmm}_{project-slug}/` with `run_metadata.json` audit

**Rule File Updated:** All 5 rule files + INDEX.md + README.md + ARCHITECTURE.md rewritten to v1.1; templates/wsr-section-specs.yaml extended with `inference_policy`, `days_calculation`, `metrics_inference`, `output_artifacts` blocks.

**Validator Added:** None. (3 new lib scripts added under `parsers/` and `calculators/`.)

**Stop-Point Reduction Summary:**
| | v1.0 | v1.1 | Δ |
|--|--|--|--|
| Phases | 8 | 3 | −5 |
| Stop points | 8 | 2 | −6 |
| User prompts in typical Mode A run | ~12 | 1 batch + 1 approval | ~−10 |
| Scripts | 16 | 19 | +3 |
| Output artifacts per run | 5 | 6 (added run_metadata.json) | +1 |

---

## Candidate Learning Topics

Observations from initial design that MAY become learnings once seen in production:

- **Region variations:** Users may supply regions like `EMEA North (New)` or `APJ` — confirm regex tolerates these without breaking subject compliance
- **Multi-sprint WSRs:** Some projects report on two sprints simultaneously — may need a decision matrix for choosing primary sprint for metrics
- **Metric exception phases:** PROD = 0 days / 0 defects is common in pre-release projects — confirm scripts handle gracefully
- **Prior-email drift:** If a user reuses a prior email as template, the agent may pick up outdated team names — confirm the mismatch-detection logic activates
- **Large Summary bullets:** For projects with 10+ workstreams, 2-level hierarchy may not be enough — consider 3-level nesting pattern
- **Status escalation:** When Red is picked, should the agent auto-suggest specific Ask items? (currently no; user-driven)
- **Screenshot fidelity:** If users transcribe screenshot numbers incorrectly, the agent has no way to catch it — document as a known limitation

---

## Known Limitations (Initial Release)

1. **Agent does not read screenshot image data** — user must describe contents. This is an intentional design choice (no visual API dependency), but may be revisited.
2. **No JIRA API integration** — raw JIRA data must be pasted; the agent does not fetch.
3. **Single-project per session** — multi-project WSR bundles are refused; user must run the agent per project.
4. **English output only** — no translation or localization.
5. **Calendar-agnostic** — agent does not check the current week's Friday or sprint calendar; user specifies dates.

---

## Performance Notes

*(Populated after first production runs.)*

- Average completion time per WSR: TBD
- Most frequent validator failure: TBD
- Most frequent gap: TBD
- User satisfaction signal: TBD

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-17
> 🔧 Tuned by sohail via R-GENIE Agent Tuner | v1.1.0 → v1.2.0 → v1.2.1 | 2026-04-22
