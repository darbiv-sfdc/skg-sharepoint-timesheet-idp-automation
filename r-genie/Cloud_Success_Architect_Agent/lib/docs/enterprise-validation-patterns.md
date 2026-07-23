# Enterprise Validation Patterns — Cloud Success Architect Agent

> **Purpose:** Detailed reference for Phase 4A (Feasibility), Phase 4B (Coverage), Phase 4C (KPIs), and Phase 7 (NFR Compliance + Measurement). Extracted from `rules/01_Guidance.mdc` to keep the rule file lean (per `AGENT_ARCHITECTURE_STANDARD.md` size limits).
>
> **Used by:** `rules/00_Phase_Orchestration.mdc` (Phase 4 + Phase 7 task lists), `rules/01_Guidance.mdc` (§13-§16 cross-references), `templates/HLD-template.md` (§6.5 + §11), `templates/Supporting-Doc-template.md` (§3.5 + §4.5 + §10 + Appendix A). **Phase 5 delta re-entry triggers:** see `lib/docs/phase-5-persona-refinement-spec.md` §8.
>
> **Maintainer:** Cheppali Shaik Sohail | v1.0.0 | 2026-05-02

---

## 1. ENTERPRISE NFR PATTERNS (Used by Supporting Doc §4.5)

### 1.1 The 8 NFR Categories + Project Defaults

| NFR Category | Project Default Target | Common Customer Override Triggers |
|--------------|------------------------|-----------------------------------|
| **Availability + DR** | 99.9% (3 nines); RPO ≤ 15 min; RTO ≤ 1 hr (Tier-1). Pattern: active-passive with quarterly DR drills | Tier-0 services → 99.99% + active-active; cost-sensitive → 99.5% acceptable |
| **Scalability** | Autoscaling enabled; design assumes 3× peak headroom; horizontal scale preferred | Customer-stated TPS or records-per-day from Phase 1 |
| **Security + Compliance** | TLS 1.2+ everywhere; mTLS for service-to-service; secrets in Anypoint Secrets Manager; per-industry regimes auto-mapped (Healthcare → HIPAA; FS → PCI-DSS + SOC2; Public Sector → FedRAMP; EU customers → GDPR; global → ISO 27001) | Customer-named regimes from Phase 1 constraints |
| **Observability** | E2E distributed trace; 1-min metric cadence; alerting on SLO breach with PagerDuty / Slack routing | Customer's existing tooling (Splunk / Datadog / New Relic) |
| **Data Residency** | Region-pinned per customer's legal entity location; cross-region replication only with explicit approval | EU residency, FedRAMP Govt Cloud, country-specific (DE, IN, AU sovereignty) |
| **Performance** | p95 < 500ms for sync APIs; p95 < 1.5s for agent actions; async/event-driven for long-running ops | Customer-stated SLA from Phase 1 |
| **Cost-awareness** | Consumption-aware design (Anypoint Flex credits, Agentforce conversations, Data Cloud rows); idempotent retries; agent topic guardrails to prevent runaway consumption | Customer's stated budget envelope or commercial ceiling |
| **Maintainability** | API-led with Anypoint Exchange reuse; IaC for environments (Terraform / Anypoint CLI); CI/CD via Anypoint Code Builder + Salesforce DevOps Center; automated MUnit + Agentforce Testing Center gates | Customer's existing DevOps maturity (greenfield → adopt; mature → integrate) |

### 1.2 Per-Industry Compliance Auto-Mapping

| Industry | Mandatory Regimes | Common Add-ons |
|----------|-------------------|----------------|
| Healthcare / Life Sciences | HIPAA | HITRUST, FDA 21 CFR Part 11 (life sciences) |
| Financial Services / Banking / Wealth / Insurance | PCI-DSS, SOC2 | NYDFS, GLBA, MiFID II (EU) |
| Public Sector / Federal | FedRAMP Moderate/High | FISMA, StateRAMP, ITAR |
| Retail / Commerce | PCI-DSS | GDPR (EU customers), CCPA (California) |
| Manufacturing | ISO 27001 | NIST CSF (defense supply chain) |
| Utilities / Energy | NERC CIP (NA) | ISO 27019 (energy sector) |
| Cross-vertical with EU footprint | GDPR | Schrems II data transfer assessments |

### 1.3 NFR Gap Handling

| Gap Severity | Action |
|--------------|--------|
| **Showstopper** (e.g., FedRAMP-required + no Govt Cloud capability available) | Halt — escalate to Phase 4A as ❌ NO-GO; propose alternative or descope |
| **Material** (e.g., 99.9% required + capability is single-region only) | Risk Register entry + design adjustment in Supporting Doc §4.5 + Coverage Matrix flag if pain-impacting |
| **Minor** (e.g., observability cadence 5-min vs requested 1-min) | Risk Register entry; mitigation as roadmap item |

---

## 2. FEASIBILITY VALIDATION PATTERNS (Phase 4A)

> **Operational guidance for Phase 4A.** Feasibility = "do-able for THIS customer" (not just "exists in the market").

### 2.1 The 8 Mandatory Dimensions

| Dimension | Source of Truth | Pass Criteria | Fail Trigger |
|-----------|-----------------|---------------|--------------|
| **GA Status** | `research_log.md` (Phase 2B) + `docs.mulesoft.com` / `help.salesforce.com` release notes | GA per official docs | Roadmap-only with no committed date |
| **Geography** | Capability catalog §9 NFR Profile + customer's deployment regions (Phase 2A) | Customer regions ⊆ capability regions | Region mismatch with no near-term GA |
| **Edition Entitlement** | Capability catalog §9 (Edition Floor column) + customer's licensed edition (Phase 2A) | Customer edition ≥ capability floor | Requires upsell — flag for commercial discussion |
| **Footprint Compatibility** | Customer Phase 2A current state + capability dependencies | Compatible with current runtime / identity / networking | Requires platform upgrade not in scope (e.g., needs CloudHub 2.0; customer on 1.0 with no migration plan) |
| **Timeline Fit** | Customer velocity (Phase 1 fact: e.g., "6 weeks per API") + customer-stated horizon | `requested_days < customer_velocity × component_count × 1.3` | Exceeds buffer — propose phased delivery |
| **Skill Envelope** | Customer team profile (Phase 2A: team size, skills) + capability complexity | `team_size ≥ 2 OR partner-augmentation flagged` | Single-person dependency = key-person risk |
| **Commercial Signal** | Customer-stated budget signal or PO status (Phase 1 / 2A) | Consumption headroom OR additional purchase signaled | Hard budget freeze — mark CONDITIONAL with PO precondition |
| **Data Residency** | Customer's legal/regulatory residency (Phase 1) + capability catalog §9 (Data Residency Options) | Capability supports customer residency | Cross-border restriction (e.g., FedRAMP-only customer + non-Govt-Cloud capability) |

### 2.2 Verdict Decision Tree

```
For each capability:
  Score 8 dimensions
  If ANY score = ❌ → Verdict = NO-GO
    → Action: propose alternative OR descope OR escalate
  Elif ANY score = ⚠️ → Verdict = CONDITIONAL
    → Action: log in Assumption Log §5 with validation path
  Else (all ✅) → Verdict = GO
```

### 2.3 Common Feasibility Anti-Patterns

| Anti-Pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| Skipping a dimension because customer "didn't mention it" | Silence ≠ assent; default = ⚠️ until confirmed | Mark dimension N/A only if truly inapplicable; else default ⚠️ ASSUMPTION |
| Stamping all 8 dimensions ✅ without evidence | Specification-gaming the gate | Cite source per dimension (research_log entry, customer fact, capability catalog row) |
| Treating Preview as GA "because it'll be GA by go-live" | Roadmaps slip | Mark Preview ⚠️, conditional GO, validation path = "confirm GA in next 2 release cycles" |
| Removing a NO-GO capability without proposing alternative | Leaves a coverage gap downstream | Always propose: substitute / phased deferral / descope-with-customer-agreement |

### 2.4 Feasibility Validation RGV Template

```
1. READ:
   - Draft capabilities (N from Phase 4 preliminary)
   - Customer footprint (Phase 2A — runtime, edition, region, team)
   - research_log.md (Phase 2B — GA status, sources, dates)
   - lib/docs/mulesoft-agentforce-capability-catalog.md §9 (NFR Profile per Capability)
2. GENERATE:
   - 8-dim feasibility matrix (N capabilities × 8 dimensions = N×8 cells)
   - Verdict per capability
   - Alternative proposals for NO-GO entries
3. VERIFY:
   - Every cell has a citation (source ref or "⚠️ ASSUMPTION — {what missing}")
   - Every NO-GO has a proposed alternative
   - Every CONDITIONAL has a validation path
4. FIX: Any uncited cell → either cite or mark ⚠️ ASSUMPTION
```

---

## 3. PROBLEM-SOLUTION COVERAGE MATRIX PATTERN (Phase 4B)

> Verifies the architecture genuinely addresses customer pains, bidirectionally. Catches "solution looking for a problem" and "pain without a solution".

### 3.1 Coverage Construction Algorithm

```
1. List all Phase 1 customer pains (P1, P2, ... Pm) with persona + severity
2. List all Phase 4A finalist components (post-Feasibility) (C1, C2, ... Cn)
3. Build Pain → Component mapping:
   For each pain Pi:
     Identify components Cj that address it (cite the mechanism, not just claim)
     If no component → Pi is UNCOVERED (❌)
4. Build Component → Pain mapping (reverse check):
   For each component Cj:
     Identify pains Pi that it addresses
     If addresses no pain:
       Is Cj a future-enabler? → tag 🎯 FUTURE-ENABLER + rationale
       Else → flag SOLUTION-WITHOUT-PROBLEM (⚠️) for removal-or-justification
5. Compute future-enabler ratio = (count of FE) / (total components)
6. If ratio > 20% → escalate to user (project standard cap)
7. If any UNCOVERED pains → return to Phase 4 for design adjustment OR de-scope with customer
```

### 3.2 Severity-Coverage Cross-Check

For each customer pain, severity (H/M/L) drives expected coverage depth:

| Severity | Expected Coverage |
|----------|-------------------|
| **H** (named in customer's stated ambition or top-3 pain) | At least 1 component per phase horizon (90/180/365); explicit walkthrough in HLD §6.5 |
| **M** (named in Phase 1 but not top-3) | At least 1 component; HLD §6.5 row |
| **L** (implicit / inferred) | Component or roadmap entry; mention in Supporting Doc Coverage Appendix only |

### 3.3 Future-Enabler Discipline

Future-enablers are valuable (they signal architectural foresight) but must be:

- **Tagged explicitly** in both HLD §6.5 and Supporting Doc Appendix A (`🎯 FUTURE-ENABLER`)
- **Justified** with explicit next-horizon value statement ("Data Cloud here positions you for the eligibility agent + PA agent in the 180-day horizon")
- **Capped** at 20% of total components (project standard) — exceedance requires explicit customer endorsement

### 3.4 Common Coverage Anti-Patterns

| Anti-Pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| Unidirectional check (pain → component only) | Misses solution-without-problem bloat | Always do reverse check too |
| Vague mappings ("Agentforce addresses customer experience") | Untestable, untraceable | Cite mechanism: "Agentforce Service deflects claims status calls via MuleSoft action on FHIR API" |
| Hidden future-enablers (no explicit tag) | Architectural bloat masquerading as need-driven | Always tag 🎯 with rationale; cap at 20% |
| Marking all H pains "covered" without testable success criterion | Coverage without measurement | Every H pain must have a corresponding KPI in Phase 4C |

---

## 4. KPI & MEASUREMENT PATTERNS (Phase 4C + Phase 7 §10)

> Make every solution outcome measurable. Anchor every recommendation to a baseline + target + instrumentation.

### 4.1 The 3-Tier Hybrid Framework

| Tier | Audience | Examples | Default Window |
|------|----------|----------|----------------|
| **Business KPIs** | Board / executive sponsor / panel | Service call deflection %, conversion rate, NPS delta, revenue lift, cost-to-serve reduction, time-to-market | 90-day rolling |
| **Operational KPIs** | Architecture review board / business unit ops | Agent containment rate, MTTR, time-to-resolution, deflection % per topic, backlog depth, accelerator-driven schedule compression | 30-day rolling |
| **Technical KPIs** | Platform engineering / on-call | API success rate, p95 latency (per layer), agent action latency, queue depth, error rate by code, SLO burn rate | 30-day rolling |

### 4.2 KPI Definition Template (Per KPI)

| Field | Required? | Notes |
|-------|-----------|-------|
| Metric name | ✅ | Specific and measurable |
| Tier (Business/Op/Tech) | ✅ | Drives audience and cadence |
| Baseline | ✅ | Phase 1 customer fact OR "TBD pre-launch capture" |
| Target | ✅ | Phase 1 customer ambition OR project default; never invented |
| Measurement Window | ✅ | Default 30/90 day rolling |
| Owner | ✅ | Role (e.g., "VP Service Ops"), not individual |
| Instrumentation Tool | ✅ | One of: Anypoint Monitoring / Visualizer / Agentforce Observability / Agentforce Testing Center / Data Cloud Calculated Insights / Salesforce Reports & Dashboards / Event Monitoring / Shield Audit Trail |
| Data Source | ✅ | The system of record for the underlying data |
| Alert Threshold | (when applicable) | What triggers operational action |
| Pre-launch Baseline Capture? | ✅ | Boolean — drives `KPI_Baselines_v1.md` artifact in Phase 7 §10.4 |

### 4.3 Recurring Project KPIs (Always Consider Seeding)

Per project standards, consider these KPIs as starter set during Phase 4C:

| KPI | Tier | Default Instrumentation |
|-----|------|------------------------|
| API success rate | Tech | Anypoint Monitoring |
| p95 API latency | Tech | Anypoint Monitoring |
| Agent containment rate (no human handoff) | Op | Agentforce Observability |
| Agent action p95 latency | Tech | Agentforce Observability + Anypoint Monitoring (cross-trace) |
| Topic routing accuracy | Op | Agentforce Testing Center + Observability |
| Hallucination signal rate | Op | Agentforce Observability + Einstein Trust Layer audit |
| Deflection % (target task) | Op or Bus | Salesforce Reports + Service Cloud |
| CSAT delta on agent-handled vs human | Bus | Salesforce CSAT survey |
| Time-to-first-value (from approval to first prod use) | Bus | Project tracking + delivery log |
| Accelerator-driven schedule compression | Bus | Plan-vs-actual tracking; baseline = "if hand-built" estimate |
| Data Cloud activation success rate | Tech | Data Cloud activation logs |
| Calculated insight freshness | Tech | Data Cloud + Salesforce Reports |

### 4.4 Measurement & Observability Strategy (Phase 7 §10) Construction

For each KPI defined in Phase 4C, the Supporting Doc §10 Measurement & Observability Strategy must include:

1. **§10.1 Per-KPI Instrumentation Plan** — one row per KPI from Phase 4C; columns: KPI / Tier / Data Source / Tool / Cadence / Dashboard Owner / Alert Threshold
2. **§10.2 Observability Architecture** — by layer: MuleSoft (Anypoint Monitoring + Visualizer + MQ metrics), Agentforce (Observability + Testing Center + Atlas traces), Data (Data Cloud Calculated Insights + Activations + Salesforce Reports), Salesforce (Standard Reports + Event Monitoring + Shield), Cross-cutting (distributed trace ID propagation)
3. **§10.3 Reporting Cadence** — by audience: Executive monthly, Architecture bi-weekly, Operations real-time, Architect weekly
4. **§10.4 Baseline Capture (90-Day Pre-Launch Window)** — non-negotiable; produces `KPI_Baselines_v1.md` artifact signed off by executive sponsor
5. **§10.5 Owner & Accountability Map** — role → KPI ownership

### 4.5 Common KPI Anti-Patterns

| Anti-Pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| Vanity metrics ("improved customer experience") | Unmeasurable | Specific metric with numeric baseline and target |
| Targets invented by agent | Untraceable to customer ambition | Cite Phase 1 customer fact for target; mark `⚠️ ASSUMPTION` if defaulting |
| KPIs without owners | No accountability | Always assign role (not individual) |
| Skipping pre-launch baseline | Improvement claims unverifiable at 12-mo review | Mandatory `KPI_Baselines_v1.md` artifact for any KPI with TBD baseline |
| Instrumentation hand-waving ("we'll figure out reporting later") | Operational gap | Name the tool per KPI in §10.1 row |
| Mixing tiers (business KPI in technical table) | Confused audience | Strict tier separation; cross-tier KPIs go in Business with technical drilldowns in §10 |

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Maintainer: Cheppali Shaik Sohail | v1.0.0 | 2026-05-02
> 🔧 Created by Cheppali Shaik Sohail via R-GENIE Agent Tuner | 2026-05-02
