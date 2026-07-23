# Salesforce Solution Architect Agent — Examples Index

**Purpose**: Canonical reference outputs that serve BOTH as worked examples for new users AND as **verbosity anchors** for the agent itself (Pattern #20 v2 §10.5 Example-Anchored Conciseness).

---

## Available Examples

| # | Folder | Scenario | Industry Cloud | Integration Partner | Lines | Verbosity Anchor? |
|---|--------|----------|----------------|---------------------|-------|-------------------|
| 01 | `01_fnol_insurance_guidewire/` | First Notice of Loss (FNOL) — 50K claims/day async to Guidewire ClaimsCenter | FSC Insurance | Guidewire ClaimsCenter | ~520 | ✅ **YES — primary anchor** |

---

## How Examples Are Used

### As a Verbosity Anchor (by the agent at runtime)

Each example is referenced in the agent's `02_Guidance.mdc` Example-Anchored Conciseness section. When generating a new HLD, the agent benchmarks length, structure, and depth against the closest-matching example — NOT against hard line caps.

**Selection rule**: agent picks the example whose Industry Cloud + Integration Partner + scale tier most closely matches the input scenario. If no close match exists, it uses `01_fnol_insurance_guidewire/` as the default anchor.

### As a Worked Reference (by users)

Open the example file alongside your in-progress deliverable to see:
- How a real 12-section HLD reads end-to-end
- Concrete trade-off table format
- Mermaid architecture diagram conventions
- Lucidchart instruction style
- Arithmetic block format (Section 9)
- Risk register row pattern

---

## Adding New Examples

When the agent has been used to produce a high-quality HLD for a new domain (e.g., Service Cloud + Genesys, Loyalty + Marketing Cloud), copy the polished output here as a new example:

```
examples/
├── 01_fnol_insurance_guidewire/
│   └── solution_architecture_fnol_guidewire.md
├── 02_{next-scenario-slug}/                    ← future
│   └── solution_architecture_{slug}.md
└── ...
```

**Naming convention**: `NN_{scenario-slug}/` where NN is sequential (01, 02, ...) and `{scenario-slug}` is the kebab-case scenario name.

**After adding**, update:
- The table at the top of this README
- The `verbosity_anchor` field in `templates/solution-architecture-style.yaml` if the new example is a better fit for a specific Industry Cloud + scale combination
- The `exampleAnchorPath` reference in `02_Guidance.mdc` Example-Anchored Conciseness if the default anchor changes

---

## Example #01 — FNOL Insurance + Guidewire (Primary Anchor)

**Scenario**: Design an FNOL (First Notice of Loss) process on Salesforce Insurance Cloud (FSC) that integrates asynchronously with Guidewire ClaimsCenter and scales to 50,000 claims per day.

**Why this is the primary anchor**:
- Demonstrates ALL 12 sections at full depth
- Showcases async event-driven pattern (the "right" answer for high-volume scenarios)
- Shows arithmetic block + sizing math for the 50K/day target
- Includes Lucidchart instructions for FSC data model
- Risk register covers Technical, Operational, Security, Vendor, Scope categories
- Validates clean against `validate-solution-doc.js`

**Open**: `01_fnol_insurance_guidewire/solution_architecture_fnol_guidewire.md`

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-05-13
