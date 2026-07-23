# Architecture — WSR Email Composer Agent (v1.2.1)

---

## Overview

The WSR Email Composer is a **Document Generator archetype** R-GENIE agent that transforms a prior WSR email (or screenshot description) plus a single batch of weekly updates into a strictly-compliant Salesforce GDC Collab App Weekly Status Report. Its core value remains eliminating the **silent-failure risk** of the Collab App parser — non-compliant emails are rejected without user notification, so the agent enforces every format rule via deterministic scripts AND the LLM's `<thinking>` self-checks BEFORE the user sends.

**v1.2 design principle**: keep ONLY scripts for what LLMs are unreliable at. The LLM reads prior references natively, parses Jira pastes natively, aggregates gaps natively, and self-checks trivial format rules in `<thinking>`. The 9 retained scripts cover what LLMs genuinely drift on: HTML/CSS rendering, multi-step arithmetic, exact-phrase format compliance with auto-fix.

The agent is built on R-GENIE's **three-pillar architecture**: (1) **Scripts** — 9 lean tools for HTML rendering, math, and format-compliance enforcement; (2) **AI + Rules + LLM** — 5 rule files plus LLM-native parsing/inference/gap aggregation/trivial-format checks; (3) **Human** — 2 mandatory checkpoints (single batch reply + final approval). The 4-file output bundle (down from 6 in v1.1) is `subject.txt` + `email_body.html` + `validation_report.md` + `run_metadata.json`. Plain-text preview and gap list are rendered inline in chat at SP2.

---

## Workflow Steps (v1.2 — 3 phases, 2 stop points, LLM-native)

### Phase 0 — Ingest & Infer (SILENT — no stop point)
- **What:** Detect mode (A=reference / B=fresh), LLM-natively read any prior reference, auto-set today's date, build maximally-populated draft state
- **How:** If `.eml` / pasted email / screenshot description provided, the LLM reads the content directly within its `<thinking>` block — no parser script invocation. Extracts subject components, sender, CC, status colors, all 6 sections, metric values, per-phase Days/Defects/DpD, team labels, workstream names. Auto-injects today via `date "+%d-%b-%y"`; loads `team-roster.yaml`.
- **Why (v1.2 change):** Modern LLMs read structured/semi-structured email text far more flexibly than regex. The dropped `prior_email_parser.py` only handled the specific Heineken-like format; the LLM handles arbitrary formats and is the natural fit for natural-language extraction.
- **Approach:** No user prompts. Phase completes silently and proceeds to Phase 1 with a populated draft state. LLM self-assesses confidence (HIGH/MEDIUM/LOW); only LOW is surfaced to the user (in Phase 1).

### Phase 1 — Per-Section Updates (Stop #1 — single batch)
- **What:** Present the full inferred draft + ask the user a SINGLE batch of updates
- **How:** Render all 6 inferred sections with `[from reference]` markers; ask leaves (`Akshay=2,...`), Jira paste or metric description, free-form section updates/additions/removals; bidirectional sycophancy preview if status–blockers conflict in either direction
- **Why:** Replaces 6 per-section approvals from v1.0 with 1 consolidated review. The user sees everything at once and can edit any section, set leaves, paste Jira — all in one reply.
- **Approach:** Inferred fields are NEVER posed as new questions; they are shown with `[from reference]` so the user can override but is not asked. The user replies once.

### Phase 2 — Draft, Validate, Approve (Stop #2 — final approval)
- **What:** Apply user updates, compute days + metrics (script-backed math), LLM parses Jira paste + does trivial format checks, run 6 validators silently, render inline preview + gap list, write 4-file bundle
- **How (v1.2 changes):**
  - LLM parses leaves dict from batch reply natively
  - LLM parses Jira/free-text into `metrics_calculator.py`-consumable dict natively
  - `days_calculator.py` runs (formula `prior + members×5×weeks − leaves`)
  - `metrics_calculator.py` runs (capacity %, story %, DpD)
  - LLM `<thinking>` self-check: date format, recipient, fresh-email, section order, forbidden headers
  - Re-run bidirectional sycophancy check on the updated state
  - 6 validators execute silently with auto-fixes
  - LLM aggregates `⚠️ MISSING` markers into an inline gap list (also captured in `run_metadata.json`)
  - LLM renders plain-text preview inline in chat (using `wsr-email-template.txt` as structural reference)
  - `html_email_builder.py` produces `email_body.html`
  - 4-file bundle written
- **Why (v1.2 change):** Only kept the deterministic scripts that matter — HTML correctness, math correctness, format compliance with auto-fix. Everything else the LLM does as well or better.
- **Approach:** Single approval at the end. User sees subject + plain-text preview (inline) + validation summary (`✅ 6/6 PASS` typical) + gap list (inline; `none` typical) + open-in-browser send instructions.

---

## Flow Diagram (v1.2)

```mermaid
flowchart TD
    Start([User invokes /use-wsr-email-composer]) --> P0[Phase 0<br/>Ingest & Infer<br/>SILENT · LLM-native]

    P0 --> Mode{Mode?}
    Mode -->|A: reference provided| LLMRead[LLM reads reference natively<br/>extracts subject, status,<br/>sections, metrics, days]
    Mode -->|B: no reference| Fresh[Skeletal draft state]
    LLMRead --> AutoDate
    Fresh --> AutoDate
    AutoDate[Auto-inject today's date<br/>via date +%d-%b-%y]

    AutoDate --> Roster[Load team-roster.yaml]
    Roster --> P1[Phase 1<br/>Single Batch Prompt]

    P1 --> SycoPreview{Bidirectional<br/>Sycophancy Preview}
    SycoPreview --> SP1{SP1: Single Batch Reply<br/>leaves + Jira + free-form}

    SP1 -->|reply received| LLMParse[LLM parses leaves<br/>+ Jira → metrics dict<br/>+ section edits]
    LLMParse --> DaysCalc[days_calculator.py<br/>prior + members×5×weeks − leaves]
    DaysCalc --> MetricsCalc[metrics_calculator.py]
    MetricsCalc --> SycoRecheck{Bidirectional<br/>Sycophancy Re-check}
    SycoRecheck --> LLMSelfCheck[LLM <thinking> self-check:<br/>date · recipient · fresh-email<br/>· section order · forbidden headers]
    LLMSelfCheck --> Val[6 validators<br/>SILENT with auto-fixes]
    Val --> Build[html_email_builder<br/>--bundle-dir]
    Build --> Inline[LLM renders inline:<br/>plain-text preview<br/>+ gap list]
    Inline --> Meta[run_metadata.json<br/>incl. gaps[]]

    Meta --> SP2{SP2: Final Draft Approval}
    SP2 -->|approved| Done([4-file bundle written:<br/>subject.txt · email_body.html<br/>validation_report.md · run_metadata.json])
    SP2 -->|edit section| P1
    SP2 -->|abort| Aborted([Draft preserved, exit])
```

---

## Key Patterns (v1.2)

### 1. Evidence-Bound Content (Constitutional Principle #1)
Every bullet, metric, and statement must trace to (a) an LLM inference from the user-provided reference OR (b) a value in the user's batch reply. The LLM's in-context draft keeps the `inferences` block (extracted reference data) and the `inputs` block (user batch reply) distinct so evidence is always attributable. If neither sources a field → `⚠️ MISSING — please provide {detail}`.

### 2. LLM-Native Inference Where LLMs Are Strong (NEW v1.2)
Mode A reference reading, Jira paste parsing, gap aggregation, plain-text preview rendering, and trivial format checks (date / recipient / fresh-email / section order / forbidden headers) are all LLM-native. No script invocation. The LLM is genuinely better than regex for natural-language extraction and does these tasks reliably with `<thinking>`.

### 3. Scripts Only Where LLMs Are Weak (NEW v1.2)
The 9 retained scripts cover three categories: **(a) HTML rendering** (`html_email_builder` — Gmail-compatible inline-styled tables that LLMs drift on); **(b) auditable math** (`days_calculator`, `metrics_calculator` — multi-step arithmetic with deterministic outputs for delivery reporting); **(c) exact-phrase format compliance with auto-fix** (`british_spelling_linter`, `metric_name_validator`, `numeric_format_validator`, `subject_line_validator`, `status_format_validator`, `body_structure_validator` — silent-parser-rejection failure modes that LLMs occasionally miss).

### 4. Single-Batch Updates
What was 6 per-section approvals in v1.0 is ONE consolidated reply in Phase 1. The agent presents all inferred sections + 4 prompts in a single message; the user replies once.

### 5. Deterministic Days Calculation
`days_calculator.py` consumes `team-roster.yaml` (3 teams × 14 members) + leaves dict from the user's reply. Formula: `new_total = prior_total + (active_members × 5 × weeks_elapsed) − sum(leaves)`. Per-phase: Build/SIT/UAT all increment by the same amount; PROD stays at 0 in pre-release projects; "Over All Delivery" mirrors the highest active phase.

### 6. LLM-Parsed Metrics + Script-Backed Math
The LLM extracts capacity, story counts, and per-phase defects from the user's Jira paste / free-text natively (more flexible than regex). The structured dict is then handed to `metrics_calculator.py` for the actual math (capacity %, story %, DpD = defects/days).

### 7. Bidirectional Sycophancy Guard
v1.0 caught only "feel-good Green with blockers" (Direction A). v1.1+ also catches "pessimistic Amber/Red with all blockers cleared" (Direction B). Both surface ONCE in Phase 1 batch preview; re-checked after batch reply integration in Phase 2; user override accepted, never re-prompted.

### 8. Silent Validation, Surfaced Failures
All 6 validators run in Phase 2 background. Auto-fixes applied silently. Only FAILures surface to the user, with specific remediation asks. Typical run shows `✅ 6/6 PASS`.

### 9. Template-First Approach
`templates/wsr-section-specs.yaml` remains the single source of truth — extended with `inference_policy`, `days_calculation`, `metrics_inference`, and `output_artifacts` blocks (v1.2: `parser_script: null` + `inference_script: null` to reflect LLM-native handling; bundle reduced to 4 files + chat-only artifacts list).

### 10. Inline Chat Artifacts (NEW v1.2)
The plain-text preview and gap list are rendered **inline in chat** at SP2 — not written to disk. This eliminates 2 redundant files (`email_body.txt`, `gap_report.md`) and keeps the user's review surface in one place. The gap list is captured into `run_metadata.json`'s `gaps[]` array for audit.

### 11. Timestamped Output Bundles
Each run writes to `project/output_wsr/{YYYY-MM-DD-HHmm}_{project-slug}/` — fresh folder per run. Same-day re-runs never overwrite. `run_metadata.json` audits mode, inferences, inputs, gaps, timestamp, and tuner attribution.

### 12. HTML Is the Deliverable, Plain-Text Is Preview Only (NEW v1.2)
`email_body.html` is what the user pastes into Gmail (open in browser → Cmd+A → Cmd+C → paste). The chat plain-text preview is for visual review only — Gmail strips inline styles when pasting from a chat console; only browser-rendered HTML preserves formatting.

### 13. Forensic Input Processing (conditional)
Triggered when the Phase 1 batch reply includes a very large Jira paste (>500 lines): inventory → section-by-section RGV → positional bias scan (middle 30-70%) → completeness check → cross-section coherence.

---

## Session Management (v1.2.1 — stateless)

**No runtime state file.** The WSR composition is a short, single-session flow (3 phases, 2 stops, minutes of wall-clock). The LLM's 200k-token context window comfortably holds the entire run: user reference + Phase 0 inferences + Phase 1 batch reply + Phase 2 draft + silent validation results. Persisting a parallel `.wsr-state.json` schema to disk adds write/read I/O and schema-drift risk without practical benefit for this use case.

The agent carries the following **in-context** draft shape during a run (no file written):
- **Inferences block** — source, LLM confidence (HIGH/MEDIUM/LOW), extracted fields, missing list
- **Project metadata** (name, region, date = today, sender, CC)
- **Status decisions** (color + rationale for Overall + GDC)
- **Section content** with evidence attribution per bullet
- **User inputs** — leaves, weeks, Jira paste, free-form updates
- **Metric inputs + computed values** (raw numbers preserved for audit)
- **Gaps list** — `⚠️ MISSING` markers accumulated across phases
- **Validation report** from the Phase 2 silent 6-validator run
- **Sycophancy nudges shown** — prevents re-prompting within the session

**Enables (in-session only):**
- **Backward navigation** — `edit {section}` re-enters Phase 1 focused; draft retained in context
- **Silent validation + auto-fix** — Phase 2 operates on in-context draft

**On-disk artifacts** — written **once** at SP2 (post-approval):
- The 4-file bundle (`subject.txt`, `email_body.html`, `validation_report.md`, `run_metadata.json`)
- `run_metadata.json` serves as the **post-hoc audit snapshot** (mode, inferences, inputs summary, gaps, timestamp, tuner attribution) — captures what the runtime draft looked like at completion

**Not supported:**
- Cross-session resume. If a session is interrupted mid-flow, the user re-activates and restarts from Phase 0 — the cost of pasting the prior reference + a single batch reply is lower than maintaining a runtime-state schema.

---

## Error Recovery (v1.2.1)

| Situation | Recovery |
|-----------|----------|
| LLM struggles to read reference (Mode A) | Surface `⚠️ Reference unclear — please confirm essentials` in Phase 1 batch; continue with what was extracted |
| `days_calculator.py` missing | Compute inline using formula; show math explicitly in Phase 2 |
| `metrics_calculator.py` missing | Compute inline (capacity %, story %, DpD); show formulas explicitly |
| `html_email_builder.py` missing | Generate HTML inline using template; flag `⚠️ BUILDER-INLINE` |
| Required user input missing in batch reply | Stay at SP1; offer "type 'minimal' to render with all gaps marked MISSING" |
| Critical validator FAIL after batch reply | Return to Phase 1 with focused ask for the failing field |
| Validator script unavailable | Log; run remaining validators; flag `⚠️ VALIDATION-SKIPPED` in validation_report.md |
| File write error during bundle | Report error; offer retry; no runtime state to corrupt |
| Session interrupted mid-flow | No state to recover — user re-activates and restarts from Phase 0 (fast: reference paste + batch reply) |
| User insists on a format violation | Refuse per Constitutional Principle #2; cite guideline line reference |
| Status–blockers contradict in either direction | Bidirectional sycophancy guard; flag once; accept user override |

---

## Prompt Engineering Techniques Applied (v1.2)

| Technique | Where |
|-----------|-------|
| **RISEN** | Main Entry (Role / Input / Steps / Expectation / Narrowing — v1.2 LLM-native) |
| **Chain of Thought (`<thinking>`)** | Every phase — now does LLM-native parsing + trivial format checks |
| **Few-Shot (BAD → GOOD)** | Guidance §2-§5 (subject, summary, ask/attention, metrics) |
| **Decision Matrices** | Guidance §6-§8 (status, summary grouping, ask vs attention) |
| **Constitutional AI** | Stop Points (4 ranked principles) |
| **RGV (Read-Generate-Verify)** | Phase Orchestration (Phases 1, 2) |
| **ReAct (reasoning + action)** | Bidirectional sycophancy guard, contradiction handling |
| **Forensic Processing** | Phase 2 when batch reply includes >500-line Jira paste |
| **Anti-Autopilot** | Stop Points (semantic anti-autopilot table) |
| **Evidence-Bound Output** | All generation phases + in-context evidence attribution per bullet + distinct `inferences` / `inputs` blocks |
| **LLM-Native Inference (NEW v1.2)** | Phase 0 silent ingest + LLM `<thinking>` reads reference + parses Jira |
| **LLM `<thinking>` Self-Checks (NEW v1.2)** | Date format, recipient, fresh-email, section order, forbidden headers — replaces 5 dropped validators |
| **Template-First** | Template Config + builder using YAML as single source |
| **Explicit Stop Points** | **2** mandatory HITL checkpoints |
| **Watermark + Dual-Author + Tuner Attribution** | Every `.mdc` frontmatter + footer (v1.2 chains v1.1.0 → v1.2.0) |
| **Single-Batch Disclosure** | Phase 1 |
| **Deterministic Auto-Inject** | Today's date never asked; team roster auto-loaded |
| **Inline Chat Artifacts (NEW v1.2)** | Plain-text preview + gap list rendered inline at SP2 (not files) |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-17
> 🔧 Tuned by sohail via R-GENIE Agent Tuner | v1.1.0 → v1.2.0 → v1.2.1 | 2026-04-22
