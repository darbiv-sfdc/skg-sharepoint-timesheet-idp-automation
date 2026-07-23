# Cloud Success Architect Agent — Production Learnings

> **Purpose**: Capture lessons learned across real customer use cases. Append new learnings as they emerge.
> **Author**: Cheppali Shaik Sohail | **Version**: 1.7.0 | **Tuner**: Cheppali Shaik Sohail (2026-05-12)

---

## How to Use This File

Each learning entry follows this structure:

```markdown
## Learning #{N} — {One-line title}
**Date:** YYYY-MM-DD
**Context:** {Which use case / industry / panel composition surfaced this}
**Problem Observed:** {What went wrong or suboptimal}
**Root Cause:** {Why it happened}
**Fix Applied:** {What was changed in rules / templates / catalog}
**Verification:** {How we confirmed the fix}
**Prevents Regression Of:** {Gap / anti-pattern / customer-trust issue}
```

Add entries chronologically. Link to updated rule files by path.

---

## Initial Learnings (Pre-Production)

These were baked in from designing the agent and should be treated as architectural guardrails:

### Learning #0.1 — Discovery Discipline Beats Capability Dumping
**Context:** Common failure mode in SA work — jumping from use case to architecture slide in 10 minutes.
**Problem Observed:** Architecture looks generic, customer says "you didn't understand us."
**Fix Applied:** Phase 0, 1, 2 made mandatory before any Phase 3 brainstorming. Stop points block advancement.
**Prevents Regression Of:** Sycophancy (Gap #8) — agent agreeing with customer's own framing without probing.

### Learning #0.2 — Three Branches Is the Minimum for Panel Trust
**Context:** Panels instinctively distrust single-option presentations.
**Problem Observed:** Presenting one architecture feels prescriptive; panels push back on "why not X?"
**Fix Applied:** Phase 3 requires 3 distinct branches (not minor variations). RGV checks that each branch cites ≥3 customer facts.
**Prevents Regression Of:** Shallow Reasoning (Gap #4) — stopping at the first plausible answer.

### Learning #0.3 — HLD and Supporting Doc Are Different Audiences
**Context:** Merged documents either overwhelm panels or undersell to reviewers.
**Problem Observed:** Single document serves neither audience well.
**Fix Applied:** Two separate artifacts. HLD caps Mermaid at 12 nodes, writes in "you" terms. Supporting Doc holds all rationale, matrices, risks.
**Prevents Regression Of:** Verbosity Bias (Gap #12) in HLD; Completeness gaps in Supporting Doc.

### Learning #0.4 — Every Recommendation Needs a Customer Fact
**Context:** Generic "we recommend X" language fails under exec scrutiny.
**Problem Observed:** Panel asks "why do you think we need that?" → SA stalls.
**Fix Applied:** Evidence-Bound pattern mandatory. Format: `Recommend {X} because you stated '{fact}' in Phase {N}`.
**Prevents Regression Of:** Hallucination (Gap #3) — capabilities appearing with no grounding.

### Learning #0.5 — Preview Features Need Explicit Markers
**Context:** Agentforce and Data Cloud ship features frequently; "currently in preview" status shifts.
**Problem Observed:** Committing to a preview feature as GA in an HLD damages customer trust when they later hit a limitation.
**Fix Applied:** `⚠️ PREVIEW` marker mandatory for any non-GA capability, with assumption date.
**Prevents Regression Of:** Overconfidence (Gap #7) — stating uncertain capability availability as fact.

### Learning #0.6 — Persona-Driven Refinement Catches Solution-Without-Problem Better than Static Validation
**Date:** 2026-05-05 (pre-production, baked in at v1.3.0)
**Context:** Phase 4B Coverage Matrix catches uncovered pains and capped future-enabler ratio. But static validation can miss components that PASS coverage but fail panel scrutiny on Tier-4/Tier-5 questions (NFR boundary, worst-case scenario, cost defensibility, regulator audit, vendor trust).
**Problem Observed:** Architectures pass 4A/4B/4C but get torn apart in actual panels on cost / failure-mode / regulator / lock-in questions. The "static gates green" feels like done; the panel reveals it isn't.
**Fix Applied:** Phase 5 Adversarial Persona Refinement inserted BEFORE HLD generation. 5 generic adversarial personas (CFO, CISO, Skeptic-Architect, Vendor-Burned-Buyer, Compliance-Officer) + Phase-0 panel personas + industry overlay (auto-activated by `industryVertical`) × 5-tier question taxonomy (Basic→Adversarial). Improvements applied with HITL approval per persona; Phase 4 delta re-validation (not full re-run) when components/capabilities/KPIs change. Termination: all-personas-complete OR max-2-rounds OR `lock now` with mandatory 1-line rationale.
**Verification:** Solution v2 has fewer post-panel revisions; `Refinement_Log.md` gives auditable trail of every improvement decision (KEEP/IMPROVE/DISCARD), every Phase 4 delta run, and every deferred opportunity (Risk Register / Roadmap H3 / Out-of-scope).
**Prevents Regression Of:** Specification Gaming (passing static gates while missing panel realism); Shallow Reasoning Gap #4 (stopping at first plausible architecture); Sycophancy Gap #8 (architect agreeing with own framing without adversarial probing).

### Learning #0.7 — Indexed Research Beats Live Web for Phase 2 Throughput
**Date:** 2026-05-06 (pre-production, baked in at v1.4.0)
**Context:** Phase 2B's previous "live web for every capability area" approach had 3 chronic failure modes: (1) `www.salesforce.com/*` and `architect.salesforce.com` deep links frequently 403 / Cloudflare-blocked, forcing graceful-degradation paths and `⚠️ RESEARCH UNAVAILABLE` flags on Phase 3 recommendations; (2) 5–8 capability areas × 1–3 URLs each = ~10–25 web fetches per use case, each returning 5–20K tokens of nav/footer/marketing → high token + latency cost; (3) Same canonical URLs re-fetched for every customer engagement — no shared cache.
**Problem Observed:** Phase 2 routinely took 5–10 minutes wall-clock with 2–3 retries per blocked URL; recommendations often had to be marked `⚠️ RESEARCH UNAVAILABLE` for Cloudflare-blocked sources. Same `docs.mulesoft.com/healthcare/latest/` page fetched in full for every healthcare engagement — pure waste.
**Root Cause:** Direct URL fetch is incompatible with modern Cloudflare/SPA-rendered marketing pages and pays full-page token cost for narrow capability questions.
**Fix Applied:** 3-Tier Research Protocol introduced in `lib/docs/research-sources-and-protocol.md` §1. Indexed `@Docs:<name>` queried first against 18 pre-crawled, semantically-indexed sources covering MuleSoft + Agentforce + Data 360 + Hyperforce + AgentExchange + Industry Cloud + Trailhead. Live web fallback only when indexed lookup is empty/stale. Catalog last-resort with explicit `⚠️ STALE` marker. New `source-mode` field in `research_log.md` makes the tier explicit per area. Stale-Index Escape Hatch (>30d for 2026 features: Agent Fabric / Agent Visualizer / LLM Gateway / Trusted Agent Identity / Hyperforce regional / AgentExchange roster) prevents indexed-but-pre-2026 sources from confidently returning outdated info. Routing Table (lib doc §2) maps every capability area to a primary `@Docs` + secondary fallback + live URL.
**Verification:** Phase 2 token cost ~10–40× lower per query (passage retrieval vs. full-page fetch). Cloudflare/SPA failures handled by Tier-2 fallback. Source-mode ratio in research_log.md gives auditable breakdown (e.g., "12 of 14 areas resolved via @Docs; 2 via live-fetch"). Example session shows wall-clock for Phase 2B reduced from 5–10 min to ~90 seconds typical.
**Prevents Regression Of:** Hallucination Gap #3 (capabilities cited without grounding); Overconfidence Gap #7 (claiming GA from a stale catalog); Verbosity Bias Gap #12 (full-page fetches polluting `<thinking>` blocks with irrelevant marketing content); Research-Unavailable cascading (Cloudflare blocks no longer block the entire phase).

### Learning #0.8 — Verbosity Creep Emerges from Marketing-Prose Patterns; Explicit Per-Section Budgets + Forbidden-Phrase List Are the Countermeasure
**Date:** 2026-05-06 (pre-production, baked in at v1.5.0)
**Context:** First end-to-end Phase 0–8 run on a real customer scenario (NorthStar retail / personalized offerings) produced a 329-line HLD and a 769-line Refinement Log for 11 personas. Both exceeded panel-friendly density. Architecture diagrams used arbitrary colors (light-blue MuleSoft, generic-grey nodes) — no brand consistency.
**Problem Observed:** (1) HLD §2 ("Why Now") contained "racing two clocks at once" / "three forces have converged" / "the math has changed" — editorial marketing prose that obscured the actual 3 facts the panel needed. (2) Refinement Log per-tier blocks expanded from the template's 7-line frame to 12–18 lines each (added "Alternative considered" / "Cross-references" sub-blocks not in the template), pushing total file >2× target. (3) Diagrams used `style A fill:#cccccc` (default-grey) for ~40% of nodes — panel had no visual cue that "purple = Agentforce, blue = MuleSoft".
**Root Cause:** Three drivers — (a) LLM bias toward narrative coherence ("smooth flow") over panel-friendly density when no explicit budget exists; (b) absence of forbidden-phrase enforcement allows marketing flourishes to slip in despite "you-terms" rule; (c) per-node `style` syntax lets the agent invent colors per HLD instead of inheriting a brand palette.
**Fix Applied:** Critical Rule #15 added to Main Entry. Per-section line/word budgets baked into `templates/HLD-template.md` (§1 ≤80w, §2 = table of 3 forces, §3 ≤6 quotes ≤25w each, §4 = table only, §5 = 5 single-sentence bullets, §6 = 3-bullet format ≤30w each, total HLD ≤250 lines). Refinement Log frame-locked to exactly 6 lines per tier (Q+A+V+C+VERDICT) — no sub-blocks; per-persona round ≤30 lines, total ≤500 lines for 10 personas. Forbidden-phrases list expanded in `02_Mandatory_Stop_Points.mdc` ("racing N clocks" / "the clock matters" / "three forces have converged" / "the math has changed" / "compound that advantage" / "those who wait" / "transformation"-without-KPI). Salesforce + MuleSoft + Agentforce brand `classDef` palette mandated in `01_Guidance.mdc` §7.1 with class-assignment rules in §7.2 — every node assigned via `class A,B,C agentforce` syntax; default-grey nodes FAIL the Phase 6 self-check. Cross-referenced `01_Technical_Design_Agent/examples/05_mermaid_diagram_examples.md` for sequence-diagram patterns (autonumber, activate/deactivate, [(db)]) so the agent suite shares Mermaid conventions.
**Verification:** Phase 6 self-check now fails on >250-line HLD and on diagrams missing the classDef block. Phase 5 self-check fails on >30-line per-persona rounds. Forbidden-phrase grep is part of pre-output verification (every flourish caught at the gate). Brand palette is defined once in §7.1 and reused — no per-HLD color invention.
**Prevents Regression Of:** Verbosity Bias Gap #12 (output length not tied to information density); Sycophancy Gap #8 (marketing-prose framings that flatter rather than inform); Specification Gaming (passing line-budget gates by splitting paragraphs into bullets without compressing content); Brand Inconsistency (different HLDs with different color schemes, undermining the agent suite's visual coherence).

### Learning #0.9 — Diagram Standards Consolidation: Worked-Example Examples + Codified Mermaid Syntax/Layout Best Practices
**Date:** 2026-05-12 (pre-production, baked in at v1.6.0)
**Context:** v1.5.0 added the Salesforce brand `classDef` palette (§7.1) but left the *syntax-level* and *layout-level* Mermaid best practices implicit. Real production HLDs (retail / personalized-offerings) demonstrated proven patterns — subgraph dashed-border styling, node-shape vocabulary (`[(...)]` / `([...])` / `{{...}}`), action vs governance edge semantics — that were not codified anywhere the agent could reference. Separately, two domain-specific HLD prompts (`generate-boomi-hld-flow-map.md` for Boomi flow maps, `generate-mulesoft-api-led-hld.md` for MuleSoft API-Led HLDs) had encoded high-leverage rules — `curve: linear` init directive, `<br/>` vs `<br>` Mermaid-safe linebreak, layout order discipline, multi-target action-label rule, async fire-and-forget no-return-arrow rule, event-bus as explicit intermediary — that the CSA agent did not yet enforce.
**Problem Observed:** (1) The agent's HLD-template §5 contained the classDef palette but no syntax/layout guidance, so each generation re-discovered (or skipped) the proven patterns. (2) Without `curve: linear`, Mermaid auto-curves arrows, producing visually noisier architecture diagrams than the proven retail HLD output. (3) Without `<br/>` enforcement, the legacy retail diagrams output used `<br>` (no slash) — which renders as literal text in some Mermaid renderers — an undetected production bug (22 instances in the retail diagrams file). (4) Without recipe documentation, agents had no template for async patterns (Solace as intermediary, fire-and-forget no-return-arrow, round-trip dashed return) — so they were either omitted or invented inconsistently.
**Root Cause:** v1.5.0 focused on color/palette discipline but stopped at the visual layer. The structural and syntactic layers (how to declare nodes, how to order them for clean layout, how to distinguish edge semantics, how to write valid Mermaid that renders identically across all renderers) were left as tribal knowledge inside specific HLD prompts (Boomi/MuleSoft API-Led) rather than promoted to agent-wide best practices.
**Fix Applied:** (a) Added two **worked examples** to `examples/`: `retail-personalized-offerings_HLD.md` (architecture-HLD recipe) and `retail-personalized-offerings_diagrams.md` (per-flow drill-down recipe), with `<br>` → `<br/>` (22 instances) and `curve: linear` init directive normalizations applied — both documented in an example header note. (b) Codified 8 Mermaid syntax/layout rules (D1-D8) in `01_Guidance.mdc §7.6` — `<br/>` enforcement, `curve: linear` init mandate, layout order discipline, edge semantics (action `-->` vs governance/grounding/response `-.->`), multi-target action-label rule, async fire-and-forget no-return-arrow, event-bus as explicit intermediary, no-dangling-System-API rule. (c) Added 4 diagram pattern recipes in §7.7 — Architecture HLD (with subgraph dashed-border styling and 4-class minimal palette mapped to 18-class brand subset), Per-Flow Drill-Down, Async/Event-Bus, Round-Trip Return-Path. (d) Added §7.8 worked-examples cross-reference. (e) Added 5 Phase 6 self-check items in `02_Mandatory_Stop_Points.mdc` — `<br/>` linter, init-directive check, layout-order check, edge-semantics check, no-dangling-nodes check. (f) Refined `templates/HLD-template.md §5` to embed init directive + layout-order/node-shape/linebreak/edge-semantics inline comments in the skeleton, plus subgraph dashed-border styling examples.
**Verification:** Phase 6 self-check now fails on any HLD with `<br>` (no slash), missing `curve: linear` init, declaration-order violations, mixed edge semantics, or dangling System API nodes. The retail HLD example is the canonical reference — agents can compare their output against it section-by-section. The 4-class minimal palette (`sf` / `ms` / `backend` / `user`) is documented as a recipe alongside the 18-class brand palette so simpler diagrams have an explicit blessed shortcut. Inline comments in the HLD-template §5 skeleton make the rules visible at point-of-generation, not just at the self-check stage.
**Prevents Regression Of:** Renderer-Compatibility Bug (`<br>` rendering as literal text); Visual Inconsistency (auto-curved arrows when `curve:linear` is the convention); Layout Drift (non-deterministic auto-layout when node declaration order isn't disciplined); Edge-Semantics Confusion (governance, grounding, response collapsed onto same arrow style); Dangling-Node Bug (System APIs declared without target-side arrows); Tribal Knowledge Loss (best practices encoded in domain-specific prompts but not promoted to agent-wide guidance).

### Learning #1.0 — Diagrams Artifact Wiring (Gap #1 from Healthcare Production Run)
**Date:** 2026-05-12 (post-production diagnostic from healthcare-personalized-recommendations use case, baked in at v1.7.0)
**Context:** v1.6.0 added the Per-Flow Drill-Down recipe (`01_Guidance.mdc §7.7.2`) and a worked example (`examples/retail-personalized-offerings_diagrams.md`) but never wired the agent to actually produce the `diagrams.md` artifact. The recipe sat in Guidance as referenced-only documentation; Phase 6 task list in `00_Phase_Orchestration.mdc` had no instruction to produce the file; no `templates/diagrams-template.md` existed; state-schema's `generatedArtifacts[]` didn't expect it.
**Problem Observed:** Healthcare HLD run completed with only the §5 architecture Mermaid (one big diagram) and §7 Data Flows as text-only numbered steps. NO per-capability drill-down diagrams were produced — despite the retail reference example having 4 such diagrams covering distinct customer-promised capabilities (Personalized Recommendations · Real-Time Inventory · Automated Order Fulfillment · Real-Time Customer Support). The agent *knew* the pattern (§7.7.2 in Guidance referenced from the §5 template instruction) but had no instruction to *apply* it as a separate artifact.
**Root Cause:** Recipe-without-wiring. v1.6.0 documented the pattern at the *guidance* layer but didn't connect it to the *orchestration* layer (Phase 6 tasks), the *artifact* layer (template), or the *enforcement* layer (Stop Points self-check). The agent had everything to *understand* but nothing to *execute*.
**Fix Applied:** (a) Created `templates/diagrams-template.md` — per-flow drill-down skeleton with 4-class minimal palette + numbered-step-label conventions + Strategy Summary structure, modeled directly on the retail reference. (b) Added Phase 6 Step 7 in `00_Phase_Orchestration.mdc` — conditional production: if `finalist.capabilityFlows[].length >= 2` per state, produce `diagrams.md` (cap 4 flows; defer remainder to Supporting Doc Appendix C). (c) Added `diagrams.md` self-check to Phase 6 Stop Points in `02_Mandatory_Stop_Points.mdc`. (d) Updated `Cloud_Success_Architect.mdc` RISEN.Expectations to list the artifact as a canonical deliverable + added Mandatory Behavior #15 + updated Output Structure tree. (e) Capability flow count is now recorded in state during Phase 4 prelim (`finalist.capabilityFlows[]`) so Phase 6 decision is deterministic.
**Verification:** Phase 6 self-check now fails if `capabilityFlows.length >= 2` AND `diagrams.md` is missing — OR if the file exists but doesn't apply the Per-Flow Drill-Down recipe (init directive, numbered step labels, 4-class palette, Strategy Summary bullets). Decision is logged in state so the artifact's absence in single-flow use cases is intentional, not a bug.
**Prevents Regression Of:** Recipe-Without-Wiring bug (best practice documented but not produced); Capability-Coverage Diagram Drift (architecture HLD shows the big picture but per-promise visuals are missing); Late-Phase Diagram Burden (deferring all per-flow visuals to Supporting Doc Appendix loses panel impact); Inconsistency Between Reference and Reality (retail example exists but new use cases don't reproduce its output structure).

### Learning #1.1 — Progressive Documentation v2: All-Phases Write Contract (Gap #2 from Healthcare Production Run)
**Date:** 2026-05-12 (post-production diagnostic, baked in at v1.7.0)
**Context:** v1.6.0 had Pattern #20 Progressive Documentation but scoped only to Phases 6 and 7 (HLD and Supporting Doc skeleton-first then section-group appends). Phases 0-5 produced ZERO durable file output except `research_log.md` at Phase 2B. All problem-deep-dive analysis (Phase 1), current-state scanning (Phase 2A), ToT brainstorming (Phase 3), finalist component lists (Phase 4 prelim), 24-row feasibility matrices (Phase 4A), coverage matrices (Phase 4B), and 3-tier KPI tables (Phase 4C) lived in chat context only.
**Problem Observed:** Healthcare run state file `generatedArtifacts[]` confirmed: 5 of 6 listed artifacts were written at Phase 5 or later. By Phase 6, context window was near-exhausted (user explicitly reported: "I was about to exhaust context window by then"). The agent had to regenerate the entire HLD from chat memory — losing fidelity (Phase 1 quotes paraphrased instead of verbatim; Phase 4B coverage entries dropped). Transcript timeline analysis (130-line jsonl): lines 16-27 = `research_log.md` writes; lines 28-51 = NOTHING WRITTEN (Phases 3, 4, 4A, 4B, 4C); lines 52+ = first real solution doc writes began.
**Root Cause:** Pattern #20 was *under-scoped* — applied only to large output files (HLD ≥250 lines, Supporting ≥500 lines) but not to *the analytical work that feeds them*. Phases 0-5 were treated as discovery (chat-only) instead of as content-producing phases that should persist their work. Compare TDA's `01-01_Phase_Orchestration.mdc`: Phase 0 explicitly creates the document skeleton; every subsequent phase writes its content section into the file BEFORE checkpoint approval ("preview-in-chat → approve → write-clean-to-file").
**Fix Applied:** (a) Added new "Progressive Documentation v2" master section in `00_Phase_Orchestration.mdc` between the Phase Definitions table and Phase 0 — codifies the Per-Phase Write Contract as a 10-row table (Phase 0 through Phase 8 mapping to specific HLD/Supporting sections). (b) Added "**Artifact Writes (Phase N — Progressive Documentation v2):**" block to every phase task list — specifies exactly which markers get written. (c) Phase 0 now creates BOTH `HLD.md` and `Supporting.md` skeletons from templates, with all `<!-- SECTION: X -->` markers preserved and intake metadata filled. (d) Redefined Phase 6 from "HLD Generation" to "HLD Consolidate & Polish + Per-Flow Diagrams" — Phase 6 now generates only the 6 sections not already written (§1, §4, §5, §6, §7, §8-§10), polishes the 4 progressive sections (§2, §3, §6.5, §11), and produces `diagrams.md`. (e) Same redefinition for Phase 7. (f) Added Per-Phase Write Self-Check block to `02_Mandatory_Stop_Points.mdc` covering Phases 0-7. (g) Added Critical Rule #16 + Mandatory Behavior #14 to `Cloud_Success_Architect.mdc` making the rule binding. (h) Expanded `01_Guidance.mdc §10` Progressive Documentation Pattern from 4-line summary to 5-subsection treatment (10.1 Five Mechanics · 10.2 Skeleton Convention · 10.3 Why Per-Phase Beats Wait-Until-Phase-6 · 10.4 Consolidate-Mode Discipline · 10.5 What Stays in Chat).
**Verification:** Per-Phase Write Self-Check (12 items) in Stop Points now blocks checkpoint approval if any phase's expected sections aren't on disk. State file is updated after every write with `generatedArtifacts[]` entries showing sections-filled. The healthcare-style failure mode (all writes deferred) is structurally impossible — Phase 1 cannot present checkpoint without HLD §3 written + Supporting §1.2 written; Phase 2B cannot present checkpoint without HLD §2 + research_log written; etc.
**Prevents Regression Of:** Context-Window Exhaustion (writes deferred until late phases when budget is depleted); Fidelity Loss (chat-memory regeneration drops quotes, citations, evidence refs); Crash-Loss (session ends pre-Phase-6 → all analytical work lost); Phase 5 Delta Mis-Application (OPPs applied to chat-only spec instead of already-written sections — auditability broken); Late-Phase Burden (Phase 6 having to generate 11 sections from scratch under high context pressure instead of polishing 4 + generating 6).

### Learning #1.2 — Hard Line-Cap → Example-Anchored Conciseness (User-Requested Reform in v1.7.0)
**Date:** 2026-05-12 (user-flagged in healthcare run state file as `tuningCandidates[].TC-1`, formalized in v1.7.0)
**Context:** v1.5.0 introduced Critical Rule #15 with **"Total HLD ≤ 250 lines"** as a hard cap to enforce panel-friendly density. The rule appeared in 11 distinct locations across the agent — Cloud_Success_Architect.mdc (Rule #15 text + Mandatory Behavior #12), 01_Guidance.mdc (§6.3 + §11 checklist), 02_Mandatory_Stop_Points.mdc (Phase 6 self-check + 250-line absolute), HLD-template.md (banner + per-section directives), README.md (feature + version history).
**Problem Observed:** Healthcare HLD landed at **265 lines** despite the agent attempting to compress to budget — the use case was 4-capability + 4-persona + Phase-5-improved (added T6 Trust Health Index, B6 Clinician Adoption, B7 Clinician NPS, T2a/T2b latency split) with materially more substance than the retail reference. User overrode the cap manually and state file logged: *"hard 250-line cap retired per user direction (logged as tuning candidate)"*. The 250-line cap created the **wrong incentive**: the agent would either (a) drop important information to meet the cap, OR (b) compress past clarity (forbidden-phrase rule was designed to prevent this exact failure mode in v1.5.0 — but the hard cap re-introduced the risk).
**Root Cause:** Hard absolute caps create binary pass/fail incentives that don't track quality. The 250-line number was invented at v1.5.0 to anchor against the then-current 4-capability retail example; it had no relationship to use-case complexity. A 1-capability use case could legitimately need 120 lines; a 6-capability use case with 5 personas legitimately needs 300+. The forbidden-phrase rule + per-section structural budgets (≤80 words §1, ≤120 words §2, ≤25 words/quote, etc.) were the REAL quality lever; the line count was incidental.
**Fix Applied:** Replaced hard 250-line cap with **example-anchored conciseness guidance** across all 11 locations: (a) Critical Rule #15 in `Cloud_Success_Architect.mdc` reworded — per-section structural budgets remain BINDING; total HLD line count is now a SOFT signal with advisory threshold ~380 lines (2× retail example) flagged for review but not auto-fail. (b) `templates/HLD-template.md` banner replaced with example-anchored language pointing to `examples/retail-personalized-offerings_HLD.md` (~190 lines for a 4-capability use case). (c) `02_Mandatory_Stop_Points.mdc` Phase 6 self-check replaced "HLD ≤ 250 total lines?" with the new example-anchored check. (d) `01_Guidance.mdc` lines 286 + 578 updated. (e) Mandatory Behavior #12 in `Cloud_Success_Architect.mdc` softened. (f) README.md v1.5.0 feature description annotated with v1.7.0 reform note. (g) The 250-line absolute in Stop Points "❌ Never produce HLD > 250 lines" replaced with the new advisory-threshold rule. **Retained as hard caps:** Refinement Log ≤500 lines (10 personas) AND per-persona round ≤30 lines AND Supporting Appendix B ≤80 lines — these are *frame-locked-format* rules tied to audit-trail constraints, not content-verbosity rules; they remain valid.
**Verification:** New Phase 6 self-check passes when (1) all per-section structural budgets are met, (2) no Forbidden Phrases present, (3) HLD length is within or below the advisory threshold OR if >380 lines, the use-case complexity justifies it (number of capabilities × personas × Phase 5 OPP additions). Manual override available with rationale logged in state.
**Prevents Regression Of:** Wrong-Incentive Bug (compress past clarity to meet arbitrary cap); Over-Generic Output (artificially-capped HLDs read as compressed marketing rather than panel-grade analysis); Information Loss (dropping Phase 5 OPP integrations because they push line count); Reform-Without-Audit-Trail (changing v1.5.0 rules without documenting why the original was wrong).

---

## Learning #1.3 — Filename-Prefix Redundancy

**Date:** 2026-05-13 (user-flagged after observing healthcare-personalized-recommendations output)
**Context:** Since v1.0, artifact filenames carried the use-case slug as a prefix: `{slug}_HLD.md`, `{slug}_Supporting.md`, `{slug}_diagrams.md`, `{slug}_Refinement_Log.md`, `{slug}_Panel_QA.md`, `{slug}_KPI_Baselines_v1.md`. The container folder is also named `{slug}/` (e.g., `project/output_cloud_success_architect/healthcare-personalized-recommendations/`). The slug therefore appeared **twice** in every full path: once in the folder, once in the file. Inside the folder the prefix added 35-45 visual characters per filename without disambiguating anything (every file in the folder shared the prefix).
**Problem Observed:** User feedback on the healthcare run: *"I don't want the `healthcare-personalized-recommendations` prefix in each file name since it is already part of folder name."* The redundancy made IDE file trees noisier and copy-paste of filenames longer. No functional benefit — the slug-prefix never provided additional information when the folder context was preserved.
**Root Cause:** v1.0 inherited a "self-describing filename" convention from earlier non-foldered output patterns. When v1.0 introduced per-slug folders, the prefix was retained out of habit. No design pressure ever pushed for its removal until panel-grade filenames were inspected in production.
**Fix Applied:** Global rename across 14 active CSA files (rules/, templates/, lib/docs/, README, ARCHITECTURE, Production_Learnings):
- `{slug}_HLD.md` → `HLD.md`
- `{slug}_Supporting.md` → `Supporting.md`
- `{slug}_diagrams.md` → `diagrams.md`
- `{slug}_Refinement_Log.md` → `Refinement_Log.md`
- `{slug}_Panel_QA.md` → `Panel_QA.md`
- `{slug}_KPI_Baselines_v1.md` → `KPI_Baselines_v1.md`

`research_log.md` was already prefix-free. State file (`.success-architect-state.json`) and folder name (`{slug}/`) remain unchanged. Frontmatter versions bumped: rules/Cloud_Success_Architect.mdc, rules/00_Phase_Orchestration.mdc, rules/01_Guidance.mdc, rules/02_Mandatory_Stop_Points.mdc, rules/INDEX.md, README.md → 1.7.0 → **1.7.1**.
**Verification:** `grep -r "\{slug\}_" --exclude-dir='.backup-*'` returns zero matches across active CSA files. Existing v1.7.0 Per-Phase Write Self-Check (Bucket B) and `diagrams.md` self-check (Bucket A) continue to fire — they reference the filenames-without-prefix semantics now.
**Prevents Regression Of:** Path Verbosity (long full paths with redundant slug); IDE Tree Noise (visual repetition obscures the unique part of the filename, e.g., `_HLD` vs `_Supporting`); Copy-Paste Friction in panel-day workflows where reviewers grab filenames into emails/tickets.

---

## Learnings from Live Use Cases

_(No production runs yet — will populate as real customer use cases are processed.)_

---

## Common Patterns to Watch For

As the agent is used across industries, watch for these emerging patterns and capture them here:

- **Healthcare + Agentforce**: Einstein Trust Layer coverage for PHI — is masking sufficient, or does customer need zero-retention?
- **Financial Services + Data Cloud**: Identity resolution for customer 360 vs. regulated data residency
- **Retail + MuleSoft RPA**: When UI automation makes sense vs. pushing for API-first
- **Utilities + Accelerator for Utilities**: CIS integration patterns vs. custom build
- **Manufacturing (no accelerator)**: How to apply Salesforce Industries patterns without the specific accelerator

---

## Change Log

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-23 | Initial Production Learnings template with 5 pre-production architectural learnings |
| 1.3.0 | 2026-05-05 | Added Learning #0.6 (Persona-Driven Refinement) accompanying the v1.3.0 Phase 5 introduction |
| 1.4.0 | 2026-05-06 | Added Learning #0.7 (Indexed Research Beats Live Web) accompanying the v1.4.0 Phase 2B 3-Tier Research Protocol |
| 1.5.0 | 2026-05-06 | Added Learning #0.8 (Verbosity Discipline + Brand Palette) accompanying the v1.5.0 Critical Rule #15, per-section budgets, forbidden-phrase list, Salesforce brand classDef palette, and cross-reference to `01_Technical_Design_Agent/examples/05_mermaid_diagram_examples.md` |
| 1.6.0 | 2026-05-12 | Added Learning #0.9 (Diagram Standards Consolidation): added `examples/retail-personalized-offerings_HLD.md` + `_diagrams.md` worked examples; codified `01_Guidance.mdc` §7.6 (8 Mermaid syntax/layout rules D1-D8) + §7.7 (4 diagram pattern recipes) + §7.8 (worked-examples cross-reference) from Boomi flow-map and MuleSoft API-Led HLD prompts; added 5 Phase 6 self-check items in `02_Mandatory_Stop_Points.mdc` (br/, curve:linear init, layout order, edge semantics, no dangling nodes); refined `templates/HLD-template.md` §5 skeleton with inline comments and subgraph dashed-border styling examples |
| 1.7.1 | 2026-05-13 | Added Learning #1.3 (Filename-Prefix Redundancy). Output artifact filenames dropped the redundant `{slug}_` prefix across 14 active CSA files (rules, templates, lib/docs, README, ARCHITECTURE, this file). Folder structure `project/output_cloud_success_architect/{slug}/` already encodes the slug; prefix added noise without information. Files now: `HLD.md`, `Supporting.md`, `diagrams.md`, `Refinement_Log.md`, `Panel_QA.md`, `KPI_Baselines_v1.md`, `research_log.md`. Frontmatter versions bumped to 1.7.1 across the 4 rule files + INDEX + README. 0 `{slug}_*.md` references remain in active rules (validated via grep). |
| 1.7.0 | 2026-05-12 | Triple-bucket release post healthcare-personalized-recommendations production run: **Bucket A (Learning #1.0 — Diagrams Artifact Wiring):** new `templates/diagrams-template.md`; Phase 6 Step 7 in `00_Phase_Orchestration.mdc` produces `diagrams.md` when `capabilityFlows.length >= 2`; Phase 6 self-check enforces; RISEN.Expectations + Output Structure updated. **Bucket B (Learning #1.1 — Progressive Documentation v2):** Phase 0 creates HLD + Supporting skeletons; per-phase Artifact Writes block added to every phase task list; Phase 6/7 redefined as *consolidate-and-polish* not from-scratch; new Per-Phase Write Self-Check in Stop Points; `01_Guidance.mdc` §10 expanded from 4 lines to 5-subsection treatment (§10.1-§10.5); Critical Rule #16 + Mandatory Behavior #14 added. **Bucket C (Learning #1.2 — Hard-Cap → Example-Anchored Conciseness):** 11 references to "HLD ≤ 250 lines" softened across 5 files (Cloud_Success_Architect.mdc, 01_Guidance.mdc, 02_Mandatory_Stop_Points.mdc, HLD-template.md, README.md); per-section structural budgets remain binding; advisory threshold = ~380 lines (2× retail example); Refinement Log and Appendix B hard caps retained as frame-locked-format rules. |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-23
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.5.0 | 2026-05-06
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.6.0 | 2026-05-12
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.7.0 | 2026-05-12
