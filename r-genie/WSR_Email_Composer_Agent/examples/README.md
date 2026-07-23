# Examples

Reference materials used by the WSR Email Composer agent for inference (Mode A) and style anchoring.

---

## Files

### `reference_wsr_heineken.eml`

A canonical, real-world WSR email (Heineken Legacy Migration Project, 10-Apr-26, EMEA North).

**Why this is the reference example:**

- Subject line follows the exact required format: `WSR | 10-Apr-26 | MS - PS - Heineken Legacy Migration-Project | Status - GREEN | EMEA North`
- All 6 required body sections present in correct order
- Hierarchical Summary with workstreams (Build / Design / UAT Support / Business Go live)
- Team-by-team updates (Team 1, Team 2, Team 3)
- Platform Team update with Completed + In Progress sub-sections
- Ask = `None as of now` (explicit "None" when nothing asked)
- Attention item with specifics: count, stakeholder, mitigation date
- Sprint Metrics table with exact British spelling `Capacity utilisation`
- Release table across Build / SIT / UAT / PROD / Over All Delivery
- DpD column in decimal format (no `%`)
- Brief professional sign-off

---

## How the Agent Uses Examples (v1.2 — Mode A, LLM-Native)

The lean 3-phase workflow uses any prior reference (`.eml` file OR pasted text OR a described screenshot) as the primary inference source. The user does not type the same data twice.

### Auto-extracted by the LLM (v1.2 — no parser script)

The LLM reads the reference content directly within its `<thinking>` block during Phase 0. v1.2 dropped `lib/parsers/prior_email_parser.py` because LLMs read structured/semi-structured email text far more flexibly than regex.

| Field group | What gets extracted |
|-------------|---------------------|
| Subject | prefix, date, project name, status color, region |
| Sender | Name from "Thanks\\n{name}" sign-off |
| CC | Recipient list from .eml headers (when available) |
| Status | Overall Delivery + GDC project colors |
| Sections | Summary, Completed, In Progress, Ask, Attention |
| Metrics | Capacity Utilisation %, User Story Delivered %, per-phase Days/Defects/DpD |
| Team labels | "Team 1", "Team 2", "Team 3" detected from body |
| Workstreams | Build / Design / UAT Support / Business Go live (when present) |

### What the Agent Still Asks (single batch prompt — Phase 1)

Even with a strong reference, these are always asked once:
1. **Leaves/holidays this week** — needed for `days_calculator.py` (e.g., `Akshay=2, Bhawna=1` or `none`)
2. **Jira paste or metrics description** — for fresh metric numbers (LLM parses natively → `metrics_calculator.py` does the math)
3. **Free-form updates** — anything new, removed, or corrected per section
4. **Sycophancy nudge (only if triggered)** — if inferred status is Green and your update mentions blockers, OR if inferred status is Amber/Red and your update clears blockers

### What the Agent NEVER Asks Again

- Date/time → always today's date
- Project name → reused from reference
- Sender name → reused from reference
- Region, CC list → reused from reference

---

## Mode B (No Reference)

If the user starts without any prior reference, the agent falls back to a minimal essentials prompt: project name, sender, region, sprint number. Everything else is requested in the single batch (same as Mode A).

---

## Adding Your Own Reference

To anchor the agent to your project's style:

1. Drop your prior `.eml` (export from Gmail/Outlook) into this folder, OR
2. Paste your email body into the chat when the agent starts

The agent will treat the most recent reference you provide as the inference source for that run. The Heineken example remains the fallback when no other reference is supplied.

---

## Session Output Examples (v1.2 — 4-file bundle)

Each agent run produces a 4-file bundle in a timestamped folder:

```
project/output_wsr/2026-04-22-1130_acme-cloud/
├── subject.txt              # WSR | dd-mmm-yy | Project | Status - Color | Region
├── email_body.html          # Gmail-compatible HTML — THE deliverable
├── validation_report.md     # 6 validators (down from 12) PASS/FAIL
└── run_metadata.json        # mode, inferences, inputs, gaps[], timestamp, tuner attribution
```

**Inline in chat at SP2 (NOT files in v1.2):**
- Plain-text preview of the email body (visual review only)
- Gap list — `⚠️ MISSING` items consolidated for the user

See `README.md` (agent root) and `ARCHITECTURE.md` for full v1.2 architecture.
