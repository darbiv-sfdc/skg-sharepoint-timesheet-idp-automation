# {Customer Name} — High-Level Design

> **Prepared for:** {Panel composition}
> **Presented by:** {SA / Success Architect name}
> **Date:** YYYY-MM-DD
> **Duration:** 40-minute presentation + 20-minute Q&A

---

## Skeleton — Section Map (Progressive Documentation v2)

> **Progressive Documentation v2 (v1.7.0):** This template is filled **progressively across Phases 0-6**, not just in Phase 6. The agent creates this skeleton in **Phase 0** and writes section-by-section as each phase's content locks. Phase 6 is **consolidate-and-polish**, not first-draft. Each section's placeholder marker (`<!-- SECTION: name -->`) is the target for the corresponding phase's `edit`. Per-phase write contract is in `@00_Phase_Orchestration.mdc` (Phase 0 task list onwards).
>
> **🎯 CONCISENESS DISCIPLINE (Critical Rule #15 — v1.7.0 reform):** Conciseness is **example-anchored**, not line-count-bound. Reference: `examples/retail-personalized-offerings_HLD.md` (~190 lines for a 4-capability retail use case). The **binding constraint** is the per-section structural budget below (§1 ≤80w, §2 ≤120w, §3 ≤25w/quote ×6 max, §4 table-only ≤5 rows, §5 = 5 bullets ≤25w each, §6 = 3-bullet format ≤30w each, §6.5 = panel-friendly table, §11 = 3-tier KPI table). Total HLD line count is a **soft signal** — advisory threshold is ~380 lines (2× retail example); above that flag for review but do not auto-fail. The **Forbidden Phrases gate** (`@02_Mandatory_Stop_Points.mdc`) and **per-section structural budgets** are the primary anti-verbosity enforcement. See `@01_Guidance.mdc` §11 (verbosity checklist) and §6.3 (BAD/GOOD verbose-vs-tight examples).

---

## 1. Executive Summary

<!-- SECTION: executive-summary -->
_(Phase 6 Step 2 — **BUDGET: ≤80 words / 3 sentences.** Format: Sentence 1 = who you are + one stated pain quoted. Sentence 2 = what we propose in 12-18 words (capability list, not narrative). Sentence 3 = the measured outcome at 12 months.)_
<!-- END SECTION -->

---

## 2. Why Now — The Agentic Moment

<!-- SECTION: why-now -->
_(Phase 6 Step 2 — **BUDGET: ≤120 words.** Required format = a 3-row table titled "What changed in the last 6 months that changes the math for you" with columns `Force | Status (with date/version) | What it means for you`. Each row ≤25 words. NO prose paragraphs. NO "the clock is ticking" / "racing N clocks" / "three forces have converged" framings — see `@02_Mandatory_Stop_Points.mdc` Forbidden Phrases.)_

| Force | Status (date/version) | What it means for you |
|-------|----------------------|-----------------------|
| {force 1 — e.g., "MuleSoft for Agentforce GA"} | {e.g., "Vector v1.0 GA Jan 2026; Agent Fabric GA Q1 2026"} | {≤25 words tying force → customer fact} |
| {force 2} | {status with date} | {≤25 words} |
| {force 3} | {status with date} | {≤25 words} |
<!-- END SECTION -->

---

## 3. What We Heard From You

<!-- SECTION: what-we-heard -->
_(Phase 6 Step 3 — **BUDGET: ≤25 words per quote, ≤6 quotes total.** Required format = bullet list, one per persona quoted. NO grouping prose. NO paraphrasing into sentences — quote the customer verbatim where possible.)_

- **{Persona name, role}:** _"{≤25-word verbatim or near-verbatim quote from Phase 1 input}"_
- **{Persona name, role}:** _"{quote}"_
- **{Persona name, role}:** _"{quote}"_
<!-- END SECTION -->

---

## 4. Aspirational Future State

<!-- SECTION: future-state -->
_(Phase 6 Step 3 — **BUDGET: TABLE ONLY, ≤5 rows.** No prose intro. No prose outro. Each row = one measurable shift the customer wants.)_

| Today (from Phase 1) | 12-18 Months From Now | Stakeholder Who Cares |
|----------------------|----------------------|----------------------|
| {current state — quoted fact or measurement} | {target state — measurable, verb-led} | {exec name + role} |
| {current state} | {target state} | {exec name + role} |
| {current state} | {target state} | {exec name + role} |
<!-- END SECTION -->

---

## 5. Proposed Architecture

<!-- SECTION: architecture -->
_(Phase 6 Step 4 — Mermaid diagram ≤12 primary nodes. Left-to-right: Channels → Agentforce → MuleSoft → Data 360 → Systems of Record. **MANDATORY: apply Salesforce brand `classDef` palette from `01_Guidance.mdc` §7.1.** Every node assigned to a class — `class A,B,C agentforce` syntax. Then 5 single-sentence bullets ≤25 words each in "you" language.)_

> **Worked example reference:** `examples/retail-personalized-offerings_HLD.md` §5 (full HLD architecture with subgraph dashed-borders + governance edges) and `examples/retail-personalized-offerings_diagrams.md` (per-flow drill-downs with numbered step labels). Best practices: `01_Guidance.mdc` §7.6 (Mermaid syntax + layout) and §7.7 (Diagram pattern recipes).

```mermaid
%%{ init: { 'flowchart': { 'curve': 'linear' }, 'themeVariables': { 'fontSize': '16px' } } }%%
flowchart LR
    %% LAYOUT ORDER (per §7.6): (1) source/channel nodes → (2) subgraphs with components → (3) target/SoR nodes → (4) connections → (5) styles & class assignments
    %% NODE SHAPES (per §7.7): [(...)] = data store · ([...]) = persona/channel · {{...}} = gateway/policy · [...] = service/component
    %% LINE BREAKS: use <br/> always — never <br> (renders as literal) or \n (per §7.6 D1)
    %% EDGES: --> action/data-flow (solid) · -.-> governance / grounding / response-return (dashed)

    %% TO BE GENERATED — MUST include all class assignments + classDef block below

    %% Example node assignment skeleton (DELETE comment, keep structure):
    %% class A,B engagement
    %% class D,E,F agentforce
    %% class TL einstein
    %% class G,H,I mulesoft
    %% class DC dataCloud
    %% class N serviceCloud
    %% class O,P systemsOfRecord

    %% Example subgraph dashed-border styling (no fill, dashed stroke — per §7.7 retail HLD pattern):
    %% style Agentic     fill:none,stroke:#7F3CFF,stroke-width:2px,stroke-dasharray:5 5
    %% style Integration fill:none,stroke:#1A6CD7,stroke-width:2px,stroke-dasharray:5 5

    classDef agentforce       fill:#7F3CFF,stroke:#5A1FBF,color:#fff
    classDef einstein         fill:#032E61,stroke:#021F42,color:#fff
    classDef serviceCloud     fill:#FF9A3C,stroke:#C66B1B,color:#000
    classDef salesCloud       fill:#19A0C6,stroke:#0F6F8B,color:#fff
    classDef marketingCloud   fill:#FF5C35,stroke:#C13E1F,color:#fff
    classDef commerceCloud    fill:#FFB75D,stroke:#C68427,color:#000
    classDef dataCloud        fill:#0070D2,stroke:#0050A0,color:#fff
    classDef salesforceCore   fill:#00A1E0,stroke:#0079A8,color:#fff
    classDef hyperforce       fill:#005EB8,stroke:#003E7A,color:#fff
    classDef mulesoft         fill:#1A6CD7,stroke:#0F4A99,color:#fff
    classDef mulesoftAI       fill:#005EB8,stroke:#003E7A,color:#fff
    classDef tableau          fill:#1F77B4,stroke:#155989,color:#fff
    classDef slack            fill:#4A154B,stroke:#2E0D2F,color:#fff
    classDef heroku           fill:#430098,stroke:#2D0066,color:#fff
    classDef systemsOfRecord  fill:#5E6E82,stroke:#3C4858,color:#fff
    classDef customerInfra    fill:#3C4858,stroke:#1F2937,color:#fff
    classDef engagement       fill:#F4F6F9,stroke:#9CA3AF,color:#000
    classDef governance       fill:#0B5394,stroke:#063562,color:#fff,stroke-dasharray:4 2
```

**How this works for you** _(5 single-sentence bullets ≤25 words each — no narrative paragraphs):_
- {bullet 1: entry point — channel/persona → first agent surface}
- {bullet 2: governance — Trust Layer / API Manager handle PII + policy}
- {bullet 3: integration — MuleSoft mediates SoR; cite specific connector or accelerator}
- {bullet 4: data — Data Cloud unifies what you already have; cite a customer fact}
- {bullet 5: outcome — what the user feels in 90 days}
<!-- END SECTION -->

---

## 6. Key Design Choices & Business Alignment

<!-- SECTION: design-choices -->
_(Phase 6 Step 5 — 3-5 design choices. **BUDGET: each bullet ≤30 words. Total section ≤45 lines.** Use the rigid 3-bullet format below — no preamble, no rationale paragraphs, no "alternatives considered" sub-blocks (those live in Supporting Doc).)_

### Choice {N}: {Name}
- **What we chose:** {capability/pattern — ≤20 words}
- **Why for you:** {customer-fact citation — quote or evidence ID — ≤30 words}
- **Business benefit:** {one measurable outcome with KPI link — ≤25 words}

_(Repeat for each major choice. Keep to 3-5 max. Depth goes into Supporting Doc Appendix.)_
<!-- END SECTION -->

---

## 6.5 How This Solves Your Problems

<!-- SECTION: problem-solution-coverage -->
_(Phase 6 Step 5 — concise bidirectional coverage table generated from the Phase 4B Coverage Matrix. Panel-facing version: only top customer pains, 1-2 line answers in "you" terms. Full matrix with gap analysis lives in Supporting Doc Appendix.)_

| Your Pain (from Phase 1) | Persona | How We Solve It | Components Involved |
|--------------------------|---------|-----------------|---------------------|
| _"{customer pain quote}"_ | {persona name/role} | {1-2 line answer in "you" terms — what changes for them} | {component refs from §5/§6} |
| _"{pain 2}"_ | {persona} | {answer 2} | {components} |
| _"{pain 3}"_ | {persona} | {answer 3} | {components} |

**Coverage:** {N}/{M} stated pains addressed by the proposed architecture.
**🎯 Future-enablers:** {N} components ({list}) — investments without direct pain mapping but unlock the next horizon. _Capped at 20% of total components per project standard._

> Full coverage matrix (incl. component-to-pain reverse mapping and any uncovered pains) → Supporting Doc Appendix A.
<!-- END SECTION -->

---

## 7. Data Flows

<!-- SECTION: data-flows -->
_(Phase 6 Step 5 — **BUDGET: max 2 flows in HLD itself, each ≤8 numbered steps, each step ≤15 words.** Sequence diagrams optional; if used, cross-reference `01_Technical_Design_Agent/examples/05_mermaid_diagram_examples.md` Essential 1 patterns: `autonumber`, `activate`/`deactivate`, `[(db)]`. Defer additional flows to Supporting Doc §6.)_

> **Per-flow drill-down diagrams (v1.7.0):** When the architecture has ≥2 distinct capability flows, the agent ALSO produces a companion **`diagrams.md`** file (Phase 6 Step 7) — one Mermaid drill-down per capability (cap 4), built from the Per-Flow Drill-Down recipe in `01_Guidance.mdc` §7.7.2. Worked example: `examples/retail-personalized-offerings_diagrams.md`. The HLD §7 text below carries the **summary** for the panel; the visual drill-downs are in `diagrams.md`.

**Flow 1: {Name}** _(short text summary — the visual diagram is in `diagrams.md` §1)_
1. {Step ≤15 words}
2. {Step ≤15 words}
3. {Step ≤15 words}

**Flow 2: {Name}** _(text summary — visual in `diagrams.md` §2)_
1. {Step ≤15 words}
2. {Step ≤15 words}
<!-- END SECTION -->

---

## 8. Accelerators We'll Leverage

<!-- SECTION: accelerators -->
_(Phase 6 Step 5 — **BUDGET: ≤6 rows, each cell ≤15 words.** Table only — no per-accelerator paragraphs. Depth → Supporting Doc.)_

| Accelerator | What You Get | Time Compression |
|-------------|--------------|------------------|
| {accelerator} | {≤15-word value} | {weeks/months saved} |
<!-- END SECTION -->

---

## 9. Roadmap at a Glance

<!-- SECTION: roadmap -->
_(Phase 6 Step 6 — 90 / 180 / 365-day bands. One-line outcomes per band. This IS the panel-friendly view; detailed roadmap lives in Supporting Doc.)_

| Horizon | Outcome |
|---------|---------|
| **90 days** | {outcome} |
| **180 days** | {outcome} |
| **365 days** | {outcome} |
<!-- END SECTION -->

---

## 10. Your Ask of Us / Our Ask of You

<!-- SECTION: your-ask -->
_(Phase 6 Step 6 — close the presentation with a concrete, decisional, time-boxed ask. See Guidance Section 9 for patterns.)_

**Our ask of you today:**
1. {Decisional, time-boxed, role-assigned ask 1}
2. {Ask 2}
3. {Ask 3}

**What we commit to in return:**
- {Commitment 1}
- {Commitment 2}
<!-- END SECTION -->

---

## 11. Success Metrics & KPIs

<!-- SECTION: kpis -->
_(Phase 6 Step 6 — **BUDGET: 3 tables of ≤4 rows each.** Pull from Phase 4C KPI Definition. NO commentary between tables. Detailed instrumentation → Supporting Doc §10.)_

> Every KPI traces to a Phase 1 customer fact. Default windows: 30-day rolling (ops/technical), 90-day rolling (business).

### 11.1 Business KPIs (board-facing — what the panel takes back)

| KPI | Baseline (today) | Target (12 mo) | Measurement Window | Owner |
|-----|------------------|----------------|--------------------|-------|
| {Outcome metric — e.g., service call deflection %} | {value from Phase 1 fact} | {value from ambition} | 90-day rolling | {role — e.g., VP Service Ops} |
| {KPI 2} | | | | |
| {KPI 3} | | | | |

### 11.2 Operational KPIs (the architect's pulse)

| KPI | Baseline | Target | Window | Owner |
|-----|----------|--------|--------|-------|
| {e.g., agent containment rate} | | | 30-day rolling | {role} |
| {e.g., MTTR for prod incidents} | | | 30-day rolling | {role} |
| {KPI 3} | | | | |

### 11.3 Technical KPIs (platform health)

| KPI | Baseline | Target | Window | Owner |
|-----|----------|--------|--------|-------|
| {e.g., API success rate} | | | 30-day rolling | Platform Eng |
| {e.g., p95 latency MuleSoft → SoR} | | | 30-day rolling | Platform Eng |
| {e.g., agent action latency p95} | | | 30-day rolling | Agentforce CoE |

> **Instrumentation, data sources, alert thresholds, and dashboard ownership** → Supporting Doc §10 Measurement & Observability Strategy.
> **Baseline capture protocol** → 90 days of pre-launch instrumentation per Supporting Doc §10.4.
<!-- END SECTION -->

---

## Appendix — Legend

_(Optional — include only if architecture diagram uses non-obvious notation)_

---

> **For the technical reviewers:** full design rationale, accelerator selection matrix, risk register, assumption log, and **Phase 5 Refinement Summary (Appendix B)** are in the companion `Supporting.md` document. The full Phase-5 audit trail (every persona × tier Q/A, verdict, opportunity) is in `Refinement_Log.md`.
> **For the per-capability deep-dive:** see `diagrams.md` for Mermaid drill-downs of each promised capability (≥2 flows → mandatory artifact; <2 flows → omitted; see `01_Guidance.mdc` §7.7.2 recipe).

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Authored with: Cloud Success Architect Agent v1.7.0 | {generation-date}
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.7.0 | 2026-05-12
