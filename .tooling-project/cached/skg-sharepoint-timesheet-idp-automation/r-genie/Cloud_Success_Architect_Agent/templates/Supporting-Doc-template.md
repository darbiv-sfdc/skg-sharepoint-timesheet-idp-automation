# {Customer Name} — Supporting Design Document

> **Companion to:** `HLD.md`
> **Audience:** Technical reviewers, internal Success Architect peers, deal-team technical leads
> **Purpose:** Depth and rationale that the HLD intentionally omits for panel clarity
> **Date:** YYYY-MM-DD

---

## Skeleton — Section Map (Progressive Documentation v2)

> **Progressive Documentation v2 (v1.7.0):** This template is **created as a skeleton in Phase 0** (alongside the HLD skeleton) and filled progressively across Phases 1-7: Phase 1 → §1.2 BD/Pains; Phase 2A → §3 Current State; Phase 3 → §2 Design Rationale (ToT branches + tradeoffs); Phase 4A → §3.5 Feasibility Matrix; Phase 4B → Appendix A Coverage Full; Phase 4C → §10 Measurement skeleton; Phase 5 → Appendix B Refinement Summary + delta appends; Phase 7 → consolidate/polish + complete remaining sections (§4 Risk Register, §4.5 NFR, §5-§9). Uses Solution **v2** (Phase 5 exit) as the source of truth. Per-phase write contract: `@00_Phase_Orchestration.mdc`.

---

## 1. Executive Summary for Reviewers

<!-- SECTION: reviewer-summary -->
_(Phase 7 Step 1 — 1-paragraph restatement targeting the reviewer: what the HLD proposes, what assumptions underpin it, what risks are managed where.)_
<!-- END SECTION -->

---

## 2. Design Rationale — Component by Component

<!-- SECTION: design-rationale -->
_(Phase 7 Step 2 — for every component in the HLD architecture, answer: why this, why not alternatives, what customer fact drove the choice, what tradeoff was accepted.)_

### Component: {Name}
- **Role in architecture:** {responsibility}
- **Why chosen:** {evidence citation — "you stated..."}
- **Alternatives considered:** {list 2-3 and why they were rejected}
- **Tradeoff accepted:** {what we give up by choosing this}

_(Repeat for each component — typically 8-12 components.)_
<!-- END SECTION -->

---

## 3. Accelerator Selection Matrix

<!-- SECTION: accelerator-matrix -->
_(Phase 7 Step 3 — every accelerator evaluated, chosen or rejected, with rationale. This is where the reviewer validates the shortcut logic.)_

| Accelerator | Considered? | Chosen? | Rationale | Customization Ratio (Reuse / Customize / Build) |
|-------------|-------------|---------|-----------|-----------------------------------------------|
| Accelerator for Salesforce Industries | Y/N | Y/N | {why} | {60/20/20 or similar} |
| Accelerator for Healthcare | Y/N | Y/N | {why} | |
| Accelerator for Financial Services | Y/N | Y/N | {why} | |
| Accelerator for Retail | Y/N | Y/N | {why} | |
| Accelerator for Utilities | Y/N | Y/N | {why} | |
<!-- END SECTION -->

---

## 3.5 Feasibility Validation Matrix

<!-- SECTION: feasibility-matrix -->
_(Phase 7 Step 3 — generated from Phase 4A Feasibility Validation. Every recommended capability evaluated against 8 mandatory dimensions. Verdicts: GO = all dimensions ✅; CONDITIONAL = ≥1 ⚠️ but no ❌; NO-GO = ≥1 ❌. NO-GO capabilities must be removed from the architecture or escalated.)_

> ✅ = verified against research_log.md / customer fact  ⚠️ = conditional / assumption (logged in §5)  ❌ = blocker

### 3.5.1 Capability Feasibility Scores

| Capability | GA Status | Geography | Edition Entitlement | Footprint Compat | Timeline Fit | Skill Envelope | Commercial Signal | Data Residency | Verdict |
|------------|-----------|-----------|---------------------|------------------|--------------|----------------|-------------------|----------------|---------|
| {Capability 1} | ✅ GA ({date}) | ✅ {regions} | ✅ {edition} | ✅ {note} | ✅ {req days vs velocity} | ✅ {team gap} | N/A or ⚠️ | ✅ {geo} | **GO** |
| {Capability 2} | ⚠️ Preview | ✅ | ⚠️ {edition gap} | ✅ | ⚠️ {tight} | ⚠️ {skills gap} | N/A | ✅ | **CONDITIONAL** |
| {Capability 3} | ❌ Roadmap | — | — | — | — | — | — | — | **NO-GO** |

### 3.5.2 Feasibility Calculation Rules

| Dimension | Pass Criteria | Fail Trigger |
|-----------|---------------|--------------|
| **GA Status** | GA per docs.mulesoft.com / help.salesforce.com release notes (research_log.md) | Roadmap-only |
| **Geography** | Customer's deployment regions ⊆ capability's available regions | Region mismatch with no near-term GA |
| **Edition Entitlement** | Customer's Anypoint/Salesforce edition includes the capability | Requires upsell |
| **Footprint Compat** | Compatible with customer's current runtime, identity provider, networking | Requires platform upgrade not in scope |
| **Timeline Fit** | `requested_days < customer_velocity × component_count × 1.3` (project formula) | Exceeds buffer |
| **Skill Envelope** | `team_size ≥ 2 OR partner-augmentation flagged` (project formula) | Single-person dependency |
| **Commercial Signal** | Customer has consumption headroom OR additional purchase signaled | Hard budget freeze |
| **Data Residency** | Capability supports customer's required residency (FedRAMP, EU, etc.) | Cross-border restriction |

### 3.5.3 Blockers & Mitigations

**Blockers (❌):** {count}

| Blocker | Capability | Affected Pains | Mitigation Option |
|---------|-----------|----------------|-------------------|
| {what blocked} | {cap} | {pain refs from §6.5} | {alternative capability or phased approach} |

**Conditionals (⚠️):** {count} — converted to entries in §5 Assumption Log with validation paths.
<!-- END SECTION -->

---

## 4. Risk Register

<!-- SECTION: risk-register -->
_(Phase 7 Step 4 — 3-5 risks per category. Include likelihood, impact, and mitigation.)_

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

### Delivery Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

### Organizational Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

### Security / Compliance Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |

### Commercial Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | | | |
<!-- END SECTION -->

---

## 4.5 NFR Compliance Matrix

<!-- SECTION: nfr-matrix -->
_(Phase 7 Step 4 — validates the proposed architecture against 8 enterprise NFR categories. Defaults: 99.9% availability, RPO ≤ 15min, RTO ≤ 1hr for Tier-1; project-specific overrides come from Phase 1 customer constraints. Any cell marked ❌ must escalate to a Risk Register entry in §4.)_

| NFR Category | Target (default or customer-stated) | How the Architecture Meets It | Components Responsible | Gap (if any) |
|--------------|--------------------------------------|-------------------------------|------------------------|--------------|
| **Availability + DR** | 99.9% (3 nines); RPO ≤ 15 min; RTO ≤ 1 hr (Tier-1). Pattern: active-passive with quarterly DR drills (active-active called out as upgrade option) | {how — e.g., CloudHub 2.0 multi-region failover, Anypoint MQ dual-region replication} | {component refs} | {gap or "none"} |
| **Scalability** | {customer TPS / records-per-day target from Phase 1} | {how — autoscaling policies, Runtime Fabric horizontal scale, Data Cloud streaming partitions} | | |
| **Security + Compliance** | {regimes per industry — HIPAA / PCI-DSS / SOC2 / GDPR / ISO 27001 / FedRAMP} | {how — Einstein Trust Layer, Flex Gateway policies, Anypoint Secrets Manager, mTLS, WAF integration} | | |
| **Observability** | E2E distributed trace; 1-min metric cadence; alerting on SLO breach | {how — Anypoint Monitoring + Visualizer + Agentforce Observability + Data Cloud Calculated Insights} | | |
| **Data Residency** | {target geography — US / EU / APAC / Govt-restricted} | {how — region-pinned CloudHub workers, Data Cloud regional instance, Salesforce data residency add-on} | | |
| **Performance** | {p95 latency target from customer NFRs; default p95 < 500ms for sync APIs} | {how — caching layer, async/event-driven for long ops, CDN for read-heavy} | | |
| **Cost-awareness** | Consumption-aware design (Anypoint Flex credits, Agentforce conversations, Data Cloud rows) | {how — async batching, idempotent retries, agent topic guardrails to prevent runaway consumption} | | |
| **Maintainability** | API-led with Anypoint Exchange reuse; IaC for environments; CI/CD via Anypoint Code Builder + Salesforce DevOps Center | {how — Exchange-published assets, Terraform/Anypoint CLI, branching strategy, automated MUnit + Agentforce Testing Center gates} | | |

**Gaps requiring escalation:** {count} — referenced in §4 Risk Register and surfaced in HLD §6.5 if customer-pain-impacting.
<!-- END SECTION -->

---

## 5. Assumption Log

<!-- SECTION: assumption-log -->
_(Phase 7 Step 4 — every ⚠️ ASSUMPTION flagged across Phases 0-5, with impact assessment.)_

| # | Assumption | Impact if Wrong | Validation Path |
|---|------------|----------------|-----------------|
| 1 | {what we assumed} | {HIGH/MED/LOW + what breaks} | {how to confirm with customer} |
<!-- END SECTION -->

---

## 6. Gap Register

<!-- SECTION: gap-register -->
_(Phase 7 Step 4 — items we could not confirm after 3 attempts.)_

| # | Gap | Impact | Proposed Resolution |
|---|-----|--------|---------------------|
| GAP-1 | {what we couldn't confirm} | {HIGH/MED/LOW} | {workshop / follow-up question / data request} |
<!-- END SECTION -->

---

## 7. Phased Roadmap — Detailed

<!-- SECTION: detailed-roadmap -->
_(Phase 7 Step 5 — expand the HLD's high-level roadmap into workstream detail.)_

### Horizon 1 — 0 to 90 Days (Foundation)
**Outcomes:** {specific outcomes}
**Workstreams:**
- WS1: {name} — {deliverable} — {owner}
- WS2: {name} — {deliverable} — {owner}

**Key decisions required in this horizon:**
- {decision 1}

### Horizon 2 — 90 to 180 Days (First Value)
**Outcomes:** {specific outcomes}
**Workstreams:**
- WS1: {name} — {deliverable} — {owner}

### Horizon 3 — 180 to 365 Days (Scale)
**Outcomes:** {specific outcomes}
**Workstreams:**
- WS1: {name} — {deliverable} — {owner}
<!-- END SECTION -->

---

## 8. Talk Track Tips for the HLD Presenter

<!-- SECTION: talk-track -->
_(Phase 7 Step 6 — per HLD section, 1-2 lines of guidance: what to emphasize, what question to invite, when to pause.)_

| HLD Section | Talk Track Tip |
|-------------|----------------|
| Executive Summary | Pause for 2 seconds after stating the proposal — let it land |
| Why Now | Watch CDO's reaction — this section targets them |
| What We Heard | Name each persona explicitly — if they are in the room, look at them |
| Future State | Invite reactions before moving on — "does this match your ambition?" |
| Proposed Architecture | Walk the diagram left-to-right; don't dwell on any single box |
| Design Choices | Be ready to defend each choice with the customer fact |
| Data Flows | Pick the flow most tied to the panel's top pain |
| Accelerators | Emphasize time compression, not technical detail |
| Roadmap | Use horizons to pace — "in 90 days..." creates urgency |
| Your Ask | Slow down, state each ask clearly, make eye contact with the decision-maker |
<!-- END SECTION -->

---

## 9. Cross-Reference to HLD

<!-- SECTION: cross-reference -->
_(Phase 7 Step 6 — map which Supporting Doc section supports which HLD section, for the reviewer.)_

| HLD Section | Backed by Supporting Doc Section(s) |
|-------------|-------------------------------------|
| Proposed Architecture | §2 Design Rationale, §4 Risk Register (Technical) |
| Accelerators | §3 Accelerator Selection Matrix |
| Roadmap | §7 Phased Roadmap Detailed |
| Your Ask | §4 Risk Register (Delivery, Organizational) |
| §6.5 How This Solves Your Problems (HLD) | Appendix A Coverage Matrix (Full) |
| §11 Success Metrics & KPIs (HLD) | §10 Measurement & Observability Strategy |
<!-- END SECTION -->

---

## 10. Measurement & Observability Strategy

<!-- SECTION: measurement-observability -->
_(Phase 7 Step 6 — implementation plan for the KPIs defined in HLD §11. Every KPI gets a data source, instrumentation tool, collection cadence, dashboard owner, and alert threshold. Without this section, KPIs in HLD §11 are aspirations, not measurable outcomes.)_

### 10.1 Per-KPI Instrumentation Plan

> Cross-references HLD §11 Business / Operational / Technical KPI tables. Every KPI in HLD §11 MUST have a row here.

| KPI (from HLD §11) | Tier (Bus/Op/Tech) | Data Source | Instrumentation Tool | Collection Cadence | Dashboard Owner | Alert Threshold |
|---------------------|--------------------|-------------|-----------------------|---------------------|-----------------|------------------|
| {KPI name} | Bus / Op / Tech | {system of record} | Anypoint Monitoring / Visualizer / Agentforce Observability / Agentforce Testing Center / Data Cloud Calculated Insights / Salesforce Reports & Dashboards | Real-time / Hourly / Daily / Weekly | {role / team} | {threshold value + action} |

### 10.2 Observability Architecture

| Layer | Tooling | What It Captures |
|-------|---------|------------------|
| **MuleSoft (Integration)** | Anypoint Monitoring, Anypoint Visualizer, Anypoint MQ metrics, Flow Designer alerts | Flow throughput, error rate, p50/p95/p99 latency, queue depth, dependency graph |
| **Agentforce (Agentic)** | Agentforce Observability, Agentforce Testing Center, Atlas Reasoning traces | Agent invocation count, action latency, topic routing accuracy, hallucination signals, regression test pass rate |
| **Data (Grounding)** | Data Cloud Calculated Insights, Data Cloud Activations, Salesforce Reports | Identity resolution rate, vector retrieval recall, activation success, calculated insight freshness |
| **Salesforce (CRM)** | Standard Reports & Dashboards, Event Monitoring, Shield Audit Trail | User adoption, page performance, security events, audit compliance |
| **Cross-cutting** | Distributed trace ID propagation across MuleSoft → Agentforce → Salesforce; project-standard alert routing (Slack / PagerDuty / ITSM) | E2E request correlation; on-call routing |

### 10.3 Reporting Cadence

| Audience | Cadence | Surface | KPIs Included |
|----------|---------|---------|---------------|
| **Executive sponsor / Panel** | Monthly | Salesforce Dashboard + 1-page exec summary | Business KPIs (HLD §11.1) |
| **Architecture review board** | Bi-weekly | Anypoint Visualizer + Agentforce Observability dashboards | Operational + Technical KPIs (§11.2 + §11.3) |
| **Operations / On-call** | Real-time | Anypoint Monitoring alerts + PagerDuty / Slack | Threshold breaches across all tiers |
| **Architect (you)** | Weekly | Custom dashboard combining all sources | Full KPI set + leading indicators |

### 10.4 Baseline Capture (90-Day Pre-Launch Window)

> **Non-negotiable:** Capture baseline values for every KPI in HLD §11 over a 90-day window **before** any solution component goes live.

**Why this matters:** Without baseline, "improvement" claims at the 12-month review are unverifiable. The panel will (rightly) discount the entire program.

**Baseline capture protocol:**
1. **Identify pre-launch data sources** (existing CRM reports, current MuleSoft Monitoring dashboards, manual sampling if no instrumentation exists)
2. **Define collection windows** (90-day rolling for business KPIs, 30-day rolling for operational/technical)
3. **Document assumptions** for KPIs where pre-launch data does not exist (mark as `⚠️ ASSUMPTION` in §5)
4. **Lock baseline values** in a versioned document — `KPI_Baselines_v1.md` — signed off by the executive sponsor

### 10.5 Owner & Accountability Map

| Role | Accountable For |
|------|-----------------|
| Executive sponsor | Business KPI outcomes; quarterly review |
| Platform Engineering lead | Technical KPI thresholds; alerting integrity |
| Agentforce CoE lead | Agent containment, hallucination, topic routing accuracy |
| Integration CoE lead | API success rate, p95 latency, MuleSoft Monitoring health |
| Data engineering lead | Data Cloud activation success, calculated insight freshness |
<!-- END SECTION -->

---

## Appendix A. Problem-Solution Coverage Matrix (Full)

<!-- SECTION: coverage-matrix-full -->
_(Phase 7 Step 6 — generated from Phase 4B Coverage Matrix. The HLD §6.5 shows the panel-friendly summary; this Appendix has the full bidirectional matrix including any uncovered pains and any future-enabler components.)_

### A.1 Pain → Component Mapping (every pain MUST have ≥1 component)

| # | Customer Pain (Phase 1 fact) | Persona | Severity (H/M/L) | Components Addressing | Coverage Status |
|---|------------------------------|---------|------------------|----------------------|------------------|
| P1 | _"{quote}"_ | {persona} | H/M/L | {component refs} | ✅ Covered / ⚠️ Partial / ❌ Uncovered |
| P2 | | | | | |

**Uncovered pains (❌):** {count} — must be addressed before HLD finalization OR explicitly de-scoped with customer agreement (logged in §6 Gap Register).

### A.2 Component → Pain Mapping (every component MUST address ≥1 pain OR be tagged future-enabler)

| Component | Addresses Pain(s) | Tag |
|-----------|-------------------|-----|
| {Component 1} | P1, P3 | ✅ Pain-driven |
| {Component 2} | — | 🎯 Future-enabler — _{rationale}_ |

**🎯 Future-enabler count:** {N} of {M} total components ({N/M %}). Project standard caps future-enablers at **20%** — exceedance requires explicit customer endorsement.

**Solution-without-problem detection:** {count} components flagged for removal-or-justification.
<!-- END SECTION -->

---

## Appendix B. Refinement Summary (from Phase 5)

<!-- SECTION: refinement-summary -->
_(Phase 7 Step 6 — generated from `Refinement_Log.md`. Reviewer-facing summary of the Phase 5 Adversarial Persona Refinement: which personas were engaged, what improvements were applied, what was deferred. The full log is the audit trail; this is the "what reviewers need to know" digest.)_

### B.1 Personas Engaged

| Persona | Source | Rounds | Improvements Applied | Discarded | Top-3 Mattering Improvements |
|---------|--------|--------|---------------------|-----------|------------------------------|
| {CFO} | Generic Library | {1 or 2} | {N} | {M} | {OPP-id 1: 1-line delta} / {OPP-id 2} / {OPP-id 3} |
| {CISO} | Generic Library | | | | |
| {Phase-0 panel persona} | Phase 0 Panel | | | | |
| {Industry overlay} | Industry Auto | | | | |
| ... | | | | | |
| **Totals** | | | **{X}** | **{Y}** | |

### B.2 Solution v1 → v2 Diff Highlights

| Aspect | v1 (Phase 4C exit) | v2 (Phase 5 exit) | Driver (OPP-id) |
|--------|--------------------|--------------------|-----------------|
| Component count | {N} | {N+/-Δ} ({list of ✚added / ✖removed / ↻replaced}) | {OPP-ids} |
| Pain coverage | {N}/{M} | {N'}/{M} | {OPP-ids} |
| NFR posture (per category) | {summary} | {summary} | {OPP-ids} |
| KPIs | {count, by tier} | {count, by tier} | {OPP-ids} |
| Risk Register entries | {count} | {count + net new from deferrals} | {OPP-ids deferred} |

### B.3 Phase 4 Delta Re-Validation Outcomes

| Sub-Gate | Triggered? | Components Re-Validated | New Verdict | Net Effect |
|----------|-----------|-------------------------|-------------|------------|
| 4A Feasibility (delta) | yes/no | {list} | GO/CONDITIONAL/NO-GO summary | {pass/conditional/blocker} |
| 4B Coverage (delta) | yes/no | {pain coverage shifts} | {N'/M'} | {pass/uncovered escalation} |
| 4C KPI (delta) | yes/no | {KPIs added/edited} | {n new baselines TBD} | {pass} |

### B.4 Termination & Confidence

| Field | Value |
|-------|-------|
| Termination trigger | Normal / Max-rounds / User-locked-early ("lock now") |
| User rationale (if early-lock) | _{1-line reason captured at lock-now event}_ |
| Final round count | 1 / 2 |
| Confidence at lock | HIGH / MEDIUM / LOW |

> **Full audit trail:** `Refinement_Log.md` — every Q/A across personas × tiers, every verdict, every deferral target.
<!-- END SECTION -->

---

> **Companion HLD:** `HLD.md`
> **Companion Refinement Log (audit):** `Refinement_Log.md` (Phase 5)
> **Panel Q&A bank:** `Panel_QA.md` (Phase 8)

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Authored with: Cloud Success Architect Agent v1.7.0 | {generation-date}
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.7.0 | 2026-05-12
