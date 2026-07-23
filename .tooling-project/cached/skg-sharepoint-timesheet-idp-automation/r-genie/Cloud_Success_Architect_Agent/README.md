# Cloud Success Architect Agent

> **Senior MuleSoft Cloud Success Architect for your customer use cases.**
> Takes a customer use case and produces an executive-ready HLD plus a supporting rationale doc — leveraging the latest MuleSoft and Agentforce 360 capabilities, with **live web research against official sources** baked into the workflow.

**Version:** 1.7.1 | **Author:** Cheppali Shaik Sohail

---

## Why This Agent

Solution Consultants and Solution Architects repeatedly face the same problem: a customer drops a use case prompt, there's a panel of 3–4 executives waiting, and the clock is ticking on a 40-minute presentation. Hand-building an HLD that's genuinely **panel-ready** (not a slideware dump) requires three hard skills done together:

1. **Discovery discipline** — ask the right questions, don't jump to architecture
2. **Breadth of the latest MuleSoft + Agentforce capability surface**
3. **Narrative craft** — speak to the panel in "you" terms, present alternatives, land an ask

This agent externalizes all three as a conversational workflow with hard human-in-the-loop checkpoints.

---

## RISEN at a Glance

| Element | Summary |
|---------|---------|
| **Role** | Senior MuleSoft Cloud Success Architect |
| **Input** | Customer use case brief + panel composition + optional current-state context |
| **Steps** | 9-phase conversational workflow (Intake → Deep-Dive → Capabilities → Brainstorm → Finalize 4A/4B/4C → **Adversarial Persona Refinement** → HLD → Supporting Doc → Panel Prep) |
| **Expectation** | HLD for panel + Supporting Doc for reviewer + Refinement Log for audit |
| **Narrowing** | Anypoint, AI Chain (Inference + Vector), Topic Center, IDP, Managed Flex Gateway, Accelerators (Consumer Goods / Data Cloud / FS / Healthcare / Life Sciences / Manufacturing / Retail / Salesforce OMS / SAP), Agentforce 360 (Builder, Script, Voice, Atlas, Intelligent Context, Multi-Agent Orchestration, Observability), Data 360 / Data Cloud, Einstein Trust Layer. Excludes low-level code, commercial terms. |

Full RISEN: `rules/Cloud_Success_Architect.mdc`

---

## Quick Start

```bash
# 1) Activate via workflow
/use-cloud-success-architect

# 2) Drop your use case in input folder (or paste in chat)
project/input_cloud_success_architect/my-usecase.txt

# 3) Share panel composition when asked
# 4) Agent runs 9 phases with stops between each (Phase 2 includes live web research; Phase 5 includes persona stress-test)
```

Outputs land in `project/output_cloud_success_architect/{slug}/`.

---

## Workflow Overview

| Phase | Name | What You Get |
|-------|------|--------------|
| 0 | Use Case Intake | Parsed summary, panel personas, gaps identified |
| 1 | Problem Deep-Dive | Pains, drivers, success metrics, constraints |
| 2 | Capability Discovery + 3-Tier Research | Current-state footprint + refreshed capability catalog via indexed `@Docs` (Tier 1) → live web (Tier 2) → catalog (Tier 3 last-resort) (`research_log.md` with `source-mode` per area) |
| 3 | Solution Brainstorming | 2–3 architecture options with tradeoffs (Tree of Thought) |
| 4 | Solution Finalization (4A/4B/4C) | Selected finalist + Feasibility Matrix + Coverage Matrix + KPI table |
| **5** | **Adversarial Persona Refinement** | **`Refinement_Log.md` — Phase-0 panel + industry overlay + 5 generic adversarial personas × 5 tiered questions; Solution v1→v2 with Phase 4 deltas** |
| 6 | HLD Consolidate & Polish (v1.7.0) | `HLD.md` consolidated (4 progressive sections from Phases 1/2B/4B/4C + 6 newly-generated sections + polish pass) + **`diagrams.md` per-flow Mermaid drill-downs** (when ≥2 capability flows) |
| 7 | Supporting Doc Consolidate & Polish (v1.7.0) | `Supporting.md` consolidated (7 progressive sections from Phases 1/2/3/4/5 + 9 newly-generated sections + polish pass) + finalized `KPI_Baselines_v1.md` + optional Appendix C if diagrams overflowed |
| 8 | Panel Rehearsal Prep | `Panel_QA.md` — 15-question Q&A bank + objection handlers |

---

## What Makes This Agent Different

- **Conversational, not a template filler** — ask-first, brainstorm-widely, propose-with-evidence
- **3-branch brainstorming mandatory** — never converges on one option without showing alternatives
- **Evidence citation on every recommendation** — cites the exact customer fact that drove each choice
- **Separation of audience** — HLD for the panel, Supporting Doc for the internal reviewer, Refinement Log for audit (never merged)
- **Adversarial persona stress-test (v1.3.0)** — Phase 5 simulates Phase-0 panel personas + industry overlay + 5 generic adversarial personas (CFO/CISO/Skeptic-Architect/Vendor-Burned-Buyer/Compliance-Officer), each asking 5 tiered questions (Basic→Adversarial). Improvements applied with HITL approval and Phase 4 delta re-validation
- **Latest-capability aware via 3-tier indexed research (v1.4.0)** — Phase 2B queries 18 indexed `@Docs` first (`mulesoft-docs`, `agentforce-whatsnew`, `agentforce-platform`, `salesforce-hyperforce`, `agent-exchange`, `salesforce-architect`, etc.), falls back to live web for gaps, baked-in catalog as last resort with `⚠️ STALE` marker. Every recommendation traces to `source-mode` + dated URL in `research_log.md`. Stale-Index Escape Hatch (>30d) auto-routes 2026 features (Agent Fabric / LLM Gateway / Trusted Agent Identity / Hyperforce regional / AgentExchange roster) to live-fetch. Phase 5 triggers on-demand research when persona questions surface uncertainty. Setup: see "Cursor @Docs Indexing" section below.
- **Current capability surface (v1.4.0)** — MuleSoft AI Chain (Inference + Vector), Topic Center, **Agent Fabric** (governance umbrella), **Agent Visualizer**, **LLM Gateway**, **Trusted Agent Identity** (⚠️ Preview/Regional), Agentforce 360 (Builder, Script, Voice, Atlas, Intelligent Context, Multi-Agent Orchestration, Observability, Testing Center, AgentExchange), **Hyperforce** (substrate — 17+ regions, sovereign clouds, FedRAMP), Data 360 / Data Cloud, Einstein Trust Layer, Managed Flex Gateway; preview features explicitly marked with `⚠️ PREVIEW` + date
- **Diagram syntax/layout standards + worked examples (v1.6.0)** — `01_Guidance.mdc` §7.6 codifies 8 Mermaid syntax/layout best practices (D1-D8: `<br/>` enforcement, `curve: linear` init mandate, layout order discipline, action `-->` vs governance/grounding `-.->` edge semantics, multi-target action labels, async fire-and-forget no-return-arrow, event-bus as explicit intermediary, no-dangling-System-API rule). §7.7 provides 4 reusable recipes (Architecture HLD with subgraph dashed-borders + 4-class minimal palette mapped to 18-class brand subset, Per-Flow Drill-Down with numbered step labels, Async/Event-Bus, Round-Trip Return-Path). §7.8 cross-references the new worked examples. Phase 6 self-check enforces all 5 syntax/layout gates. Worked examples (`examples/retail-personalized-offerings_HLD.md` + `_diagrams.md`) provide canonical reference output — `<br>`→`<br/>` (22 instances) and `curve: linear` directive normalizations applied and documented inline. HLD-template §5 skeleton refined with inline layout-order/node-shape/linebreak/edge-semantics comments + subgraph dashed-border styling examples
- **Verbosity discipline + Salesforce brand palette (v1.5.0 — v1.7.0 reformed)** — Critical Rule #15 enforces panel-friendly density via explicit per-section structural budgets (§1 ≤80w, §2 = 3-row "Why Now" table, §3 ≤6 verbatim quotes ≤25w each, §4 = future-state table only, §5 = 5 single-sentence bullets, §6 = 3-bullet format ≤30w each); Refinement Log frame-locked to 6 lines per tier (Q+A+V+C+VERDICT), per-persona round ≤30 lines, total ≤500 lines for 10 personas. **v1.7.0 reform:** the hard "HLD ≤ 250 lines" total cap is **superseded** by example-anchored conciseness — benchmark against `examples/retail-personalized-offerings_HLD.md` (~190 lines for 4-capability use case); total HLD line count is a soft signal with advisory threshold ~380 lines (2× retail example). Per-section structural budgets + Forbidden Phrases gate are the primary controls. See Production Learning #1.2 for rationale. Forbidden-phrase grep blocks marketing prose ("racing N clocks" / "three forces have converged" / "the math has changed" / "transformation"-without-KPI). Mandatory Salesforce + MuleSoft + Agentforce brand `classDef` palette in every Mermaid architecture diagram (Agentforce purple `#7F3CFF`, MuleSoft blue `#1A6CD7`, Service Cloud orange `#FF9A3C`, Data Cloud cobalt `#0070D2`, Einstein Trust dark navy `#032E61`, Salesforce Core SF-blue `#00A1E0`); cross-referenced with `01_Technical_Design_Agent/examples/05_mermaid_diagram_examples.md` for sequence-diagram patterns
- **Progressive Documentation v2 + Per-Flow Drill-Down Diagrams (v1.7.0)** — Phase 0 creates both HLD and Supporting Doc skeletons from templates with `<!-- SECTION: X -->` markers preserved; every phase 1-5 writes its content to corresponding sections BEFORE checkpoint approval (Phase 1 → HLD §3 + Supporting §1.2; Phase 2B → HLD §2 + research_log; Phase 4A → Supporting §3.5; Phase 4B → HLD §6.5 + Supporting Appendix A; Phase 4C → HLD §11 + Supporting §10; Phase 5 → Refinement_Log + deltas). Phase 6/7 are now **consolidate-and-polish**, not from-scratch — by Phase 6 the HLD already has 4 sections written, Phase 6 generates only the 6 missing sections + per-flow drill-downs. **New `diagrams.md` artifact** produced in Phase 6 when finalist has ≥2 distinct capability flows; one Mermaid drill-down per flow (cap 4); follows Per-Flow Drill-Down recipe (`01_Guidance.mdc` §7.7.2) and worked example (`examples/retail-personalized-offerings_diagrams.md`). Closes Gap #2 (context-window exhaustion when first writes happen at Phase 5+) and Gap #1 (per-flow diagrams not produced) from healthcare-personalized-recommendations production run. New `templates/diagrams-template.md` + new Per-Phase Write Self-Check in `02_Mandatory_Stop_Points.mdc` (Phases 0-7). See Production Learnings #1.0 and #1.1
- **Multi-session resume** — state persisted so you can iterate over days. **v1.7.0 enhancement:** with Progressive Documentation v2, mid-session crashes / context-window resets lose at most the current phase's analytical work — all prior phases' content is durably on disk in HLD/Supporting sections

---

## Cursor `@Docs` Indexing (One-Time Setup, ~15 min)

Phase 2B's 3-Tier Research Protocol prefers Cursor's indexed `@Docs` over live web fetches for speed (10–40× lower token cost), reliability (bypasses Cloudflare/SPA blocks), and reusability across all R-GENIE agents.

**Required (Tier 1 — must-add):**

| Doc Name | Base URL |
|----------|----------|
| `mulesoft-docs` | `https://docs.mulesoft.com/` |
| `agentforce-whatsnew` | `https://www.salesforce.com/agentforce/what-is-new/` |
| `salesforce-architect` | `https://architect.salesforce.com/` |
| `mulesoft-news` | `https://blogs.mulesoft.com/news/` |

**Strongly Recommended (Tier 2 + Q1 2026 capability coverage):**

| Doc Name | Base URL |
|----------|----------|
| `mulesoft-platform` | `https://www.mulesoft.com/platform/` |
| `agentforce-product` | `https://www.salesforce.com/agentforce/` |
| `salesforce-release-notes` | `https://help.salesforce.com/s/articleView?id=release-notes.htm` |
| `salesforce-trust-ai` | `https://www.salesforce.com/artificial-intelligence/trusted-ai/` |
| `mulesoft-for-agentforce` | `https://www.salesforce.com/mulesoft/agentforce/` |
| `salesforce-hyperforce` | `https://www.salesforce.com/platform/what-is-hyperforce/` |
| `agentforce-platform` | `https://www.salesforce.com/platform/agentforce-platform` |
| `agent-exchange` | `https://www.salesforce.com/agentforce/agentexchange/` |

**Optional (Tier 3 — educational / industry deep-dive):** `trailhead-agentforce`, `salesforce-engineering`, `salesforce-developer`, `salesforce-admin`, `salesforce-resources-docs`, `salesforce-news` — see `lib/docs/research-sources-and-protocol.md` §3 for full inventory.

**Setup Steps:**
1. Cursor → Settings (`Cmd+,`) → **Features** → **Docs**
2. Click **`+ Add new doc`**
3. Paste **Base URL** + set **Name** EXACTLY as shown above (the agent's tuned `@Docs:<name>` references depend on these names)
4. Wait for crawl (1–10 min depending on site; `mulesoft-docs` largest at ~5K pages)

**Re-sync cadence:**
- Weekly for Tier 1 (`mulesoft-docs`, `agentforce-whatsnew`, `mulesoft-news`)
- Bi-weekly for Tier 2 marketing pages
- Per-release for `salesforce-release-notes`
- Stale-Index Escape Hatch (>30d for 2026 features) auto-falls to Tier 2 live-fetch

**Routing per capability area:** `lib/docs/research-sources-and-protocol.md` §2.

---

## Tips for Best Results

1. **Share the panel names if known** — personalizing the HLD in "you" terms is dramatically better than generic role references
2. **Be honest about your current MuleSoft footprint** — the agent tailors recommendations very differently for greenfield vs. mature Anypoint customers
3. **Push back in Phase 3** — if none of the 3 branches feel right, ask the agent to re-brainstorm with new constraints
4. **Review the HLD in your IDE** — it uses progressive documentation, so you can see each section as it's built
5. **Use a premium model (Claude Opus) for Phase 6 HLD generation** — the narrative quality gap vs. Sonnet is visible at exec level
6. **Don't skip Phase 5** — `lock now` requires a 1-line rationale; the discipline is the value. The personas exist to surface what the panel will surface in the actual room

---

## Directory Structure

```
r-genie/Cloud_Success_Architect_Agent/
├── rules/                                                # 4 rule files + INDEX.md
│   ├── Cloud_Success_Architect.mdc
│   ├── 00_Phase_Orchestration.mdc
│   ├── 01_Guidance.mdc                                   # Incl. §12 Research, §13-16 Enterprise Patterns, §17-19 Persona Refinement
│   ├── 02_Mandatory_Stop_Points.mdc
│   └── INDEX.md
├── templates/
│   ├── HLD-template.md                                   # HLD canonical structure
│   ├── Supporting-Doc-template.md                        # Supporting doc canonical structure (incl. Appendix B Refinement Summary)
│   └── Refinement-Log-template.md                        # Phase 5 refinement log canonical structure
├── lib/
│   └── docs/
│       ├── mulesoft-agentforce-capability-catalog.md     # Extended capability reference
│       ├── phase-4-enterprise-gates-spec.md              # Phase 4A/4B/4C operational spec
│       ├── phase-5-persona-refinement-spec.md            # Phase 5 operational spec (persona library, tiers, schema, delta rules)
│       ├── enterprise-validation-patterns.md             # NFR / Feasibility / Coverage / KPI patterns
│       ├── research-sources-and-protocol.md              # Phase 2B live research protocol
│       └── state-schema-reference.md                     # Full state schema + per-phase update protocol
├── examples/
│   ├── README.md
│   └── example-usecase-session.md                        # Sample session transcript (9 phases)
├── README.md                                             # This file
├── ARCHITECTURE.md                                       # Technical architecture
└── Production_Learnings.md                               # Lessons learned (evolves)
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-23 | Initial release — 8-phase conversational workflow, HLD + Supporting Doc output |
| 1.2.0 | 2026-05-02 | Added Phase 4 sub-stops 4A/4B/4C (Feasibility / Coverage / KPI gates), 8-NFR validation in Supporting Doc §4.5, 3-tier KPI framework in HLD §11 |
| 1.3.0 | 2026-05-05 | Added **Phase 5 Adversarial Persona Refinement** — per-persona stress-test loop with Phase-0 panel + industry overlay + 5 generic adversarial personas × 5-tier question taxonomy; Improvement Opportunity schema; Phase 4 delta re-validation; new `Refinement_Log.md` artifact; `templates/Refinement-Log-template.md`; `lib/docs/phase-5-persona-refinement-spec.md`; Supporting Doc Appendix B Refinement Summary |
| 1.4.0 | 2026-05-06 | **Phase 2B 3-Tier Research Protocol** — indexed `@Docs:<name>` (Tier 1) → live web (Tier 2) → catalog (Tier 3 last-resort with `⚠️ STALE` marker); 20-row Routing Table mapping capability areas to 18 indexed docs; Stale-Index Escape Hatch (>30d for 2026 features); `source-mode` field added to `research_log.md`. **New 2026 capabilities cataloged**: Agent Fabric, Agent Visualizer, LLM Gateway, Trusted Agent Identity (⚠️ Preview/Regional), Hyperforce (substrate), AgentExchange (partner marketplace) — incl. NFR Profile rows in §9.1/9.2/9.3. Cursor @Docs setup section added |
| 1.5.0 | 2026-05-06 | **Verbosity Discipline + Salesforce Brand Palette** — Critical Rule #15 enforces panel-friendly density (HLD ≤250 lines with explicit per-section budgets); Refinement Log frame-locked to 6 lines per tier × ≤30 lines per persona × ≤500 lines for 10 personas; forbidden-phrase grep blocks marketing prose; mandatory Salesforce + MuleSoft + Agentforce brand `classDef` palette in every Mermaid architecture diagram (Agentforce purple, MuleSoft blue, Service Cloud orange, Data Cloud cobalt, Einstein Trust dark navy, Salesforce Core SF-blue) |
| 1.6.0 | 2026-05-12 | **Diagram Standards Consolidation** — added 2 worked examples (`examples/retail-personalized-offerings_HLD.md` + `_diagrams.md`) with `<br>`→`<br/>` (22 instances) and `curve: linear` init normalizations applied; codified `01_Guidance.mdc` §7.6 (8 Mermaid syntax/layout rules D1-D8 from Boomi flow-map + MuleSoft API-Led HLD prompts) + §7.7 (4 diagram pattern recipes: Architecture-HLD, Per-Flow Drill-Down, Async/Event-Bus, Round-Trip Return-Path) + §7.8 (worked-examples cross-reference); added 5 Phase 6 self-check items in `02_Mandatory_Stop_Points.mdc` (br/ linter, curve:linear init, layout order, edge semantics, no dangling nodes); refined `templates/HLD-template.md` §5 skeleton with inline comments + subgraph dashed-border styling examples; collateral fix: stale `v1.4.0` markers in Main Entry display block + README version field updated to `v1.6.0` |
| 1.7.1 | 2026-05-13 | **Output filename hygiene** — dropped redundant `{slug}_` prefix from all artifact filenames since the parent folder already encodes the slug. Files now ship as `HLD.md`, `Supporting.md`, `diagrams.md`, `Refinement_Log.md`, `Panel_QA.md`, `KPI_Baselines_v1.md`, `research_log.md` (folder remains `project/output_cloud_success_architect/{slug}/`). 14 active CSA files updated (rules, templates, lib/docs, README, ARCHITECTURE, Production_Learnings); 0 `{slug}_*.md` references remain in active rules. Companion to v1.7.0 Bucket B Progressive Documentation v2 — same artifacts, cleaner names. Source: user feedback on the healthcare-personalized-recommendations production run output. |
| 1.7.0 | 2026-05-12 | **Triple-bucket release closing 3 production gaps from healthcare-personalized-recommendations run.** **Bucket A — Diagrams Artifact Wiring (Learning #1.0):** new `templates/diagrams-template.md`; Phase 6 Step 7 in `00_Phase_Orchestration.mdc` produces `diagrams.md` when `finalist.capabilityFlows.length >= 2` (one Mermaid drill-down per flow, cap 4, deferring overflow to Supporting Doc Appendix C); Phase 6 self-check enforces; RISEN.Expectations + Output Structure + Mandatory Behavior #15 updated. **Bucket B — Progressive Documentation v2 (Learning #1.1):** Phase 0 creates both HLD and Supporting skeletons from templates; per-phase Artifact Writes block added to every phase task list mapping phase → section; Phase 6/7 redefined as *consolidate-and-polish* (Phase 6 generates 6 missing HLD sections on top of 4 already-written; Phase 7 generates 9 missing Supporting sections on top of 7 already-written); new Per-Phase Write Self-Check in `02_Mandatory_Stop_Points.mdc` (Phases 0-7); `01_Guidance.mdc` §10 expanded from 4-line summary to 5-subsection treatment (§10.1-§10.5); Critical Rule #16 + Mandatory Behavior #14 added to `Cloud_Success_Architect.mdc`. **Bucket C — Hard-Cap → Example-Anchored Conciseness (Learning #1.2):** 11 references to "HLD ≤ 250 lines" softened across Cloud_Success_Architect.mdc / 01_Guidance.mdc / 02_Mandatory_Stop_Points.mdc / HLD-template.md / README.md; per-section structural budgets remain binding; advisory threshold = ~380 lines (2× retail example); Refinement Log (≤500 lines for 10 personas) + Appendix B (≤80 lines) caps retained as frame-locked-format rules. |

---

## Disclaimer

AI-generated outputs. Always validate capability recommendations against current product documentation before customer delivery. Preview/beta capabilities are flagged with `⚠️ PREVIEW` but availability may shift.

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-23
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.5.0 | 2026-05-06
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.6.0 | 2026-05-12
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.7.0 | 2026-05-12
