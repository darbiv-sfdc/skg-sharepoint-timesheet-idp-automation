# Phase 5 Persona Refinement — Operational Spec

> **Purpose:** Authoritative operational specification for **Phase 5 — Adversarial Persona Refinement**. Stress-tests the Phase-4-finalized solution against simulated panel personas BEFORE HLD generation, surfaces improvement opportunities with HITL approval, and produces a hardened Solution v2 with full audit trail.
>
> **Used by:** `rules/00_Phase_Orchestration.mdc` Phase 5 (operational "how"), `rules/01_Guidance.mdc` §17–§19 + §6.7 (pattern reference), `rules/02_Mandatory_Stop_Points.mdc` Stops 9–10 (HITL enforcement), `templates/Refinement-Log-template.md` (output structure).
>
> **Maintainer:** Cheppali Shaik Sohail | v1.0.0 | 2026-05-05

---

## §1. Activation Contract & Entry State

**Pre-conditions (must all be true to enter Phase 5):**
- Phase 4C `phaseStatus = "COMPLETED"`
- `feasibilityMatrix`, `coverageMatrix`, `kpis` all populated and approved
- `finalist.components[]` populated; every component has an evidence citation

**Entry artifact:** Solution **v1** = Phase 4 finalist + 4A feasibility verdicts + 4B coverage matrix + 4C KPI table.

**Exit artifact:** Solution **v2** = v1 + applied improvements + Phase 4 delta re-validation outputs + `Refinement_Log.md`.

**Version naming:** v1 (entry) → v_n (after persona n applies an IMPROVE) → v_final / v2 (after consolidation).

---

## §2. Persona Library

### §2.1 Generic Adversarial Library (always engaged, in order)

| # | Persona | Focus | Signature Concern | Why "Adversarial" |
|---|---------|-------|-------------------|--------------------|
| 1 | **CFO** | TCO / ROI / payback period | "Cost over 3 years and break-even month?" | Forces financial defensibility |
| 2 | **CISO** | Security posture / data exposure / blast radius | "Where is data and who reads it?" | Forces security-by-design proof |
| 3 | **Skeptic-Architect** | Buy-vs-build / lock-in / technical debt | "Why MuleSoft+Agentforce vs. open-source / native?" | Forces alternative justification |
| 4 | **Vendor-Burned-Buyer** | Past failures / switching cost / support quality | "What stops this from being shelfware?" | Forces trust friction |
| 5 | **Compliance-Officer** | Regulatory / audit / retention / residency | "Show audit trail and right-to-erasure flow." | Forces governance proof |

### §2.2 Industry Overlay Map

Auto-activated when `industryVertical` matches. Engaged AFTER Phase-0 panel personas, BEFORE generic library.

| Industry | Persona | Focus | Signature Concern |
|----------|---------|-------|-------------------|
| `healthcare` | **CMIO** | PHI / HIPAA / EHR integration | "Where does PHI sit in the inference path?" |
| `financial-services` | **CRO** | Model risk / market data latency / SOX | "What's the model governance and audit story?" |
| `retail` | **VP Merchandising / Digital** | OMS lag / abandoned cart / omnichannel inventory | "How does inventory accuracy improve at the SKU level?" |
| `manufacturing` | **Plant Operations Director** | OT/IT bridge / MES / SCADA telemetry | "How does this bridge the OT gap without breaking ISA-95?" |
| `public-sector` | **Procurement / FedRAMP Officer** | ATO / contract vehicles / data residency | "What's the path to ATO and which contract vehicle?" |

> **No match:** Skip industry overlay; log `industryOverlay: "none-applicable"` in state.

### §2.3 Phase-0 Panel Persona Derivation

Engaged FIRST. Sourced from `state.panelPersonas[]`. Each gets:
- Name (if captured in Phase 0) used in question framing for realism
- Pains list (from Phase 1 deep-dive) used to weight tier focus
- Role (CDO/VP Integration/Director Architecture/VP Business Apps) used to flavor question domain

> **Personalization rule:** if Phase-0 captured persona's name AND a stated pain, the Tier 1 question MUST reference at least one of them.

### §2.4 Engagement Order Algorithm

```
1. Engage every Phase-0 panel persona (deterministic order from state)
2. Engage industry overlay persona (if applicable)
3. Engage generic library in fixed order: CFO → CISO → Skeptic-Architect → Vendor-Burned-Buyer → Compliance-Officer
4. Round 2 (if triggered): re-engage ONLY personas whose Round 1 surfaced a HIGH-impact IMPROVE that changed dependent components/KPIs
```

---

## §3. 5-Tier Question Taxonomy

### §3.1 Tier Definitions (full)

| Tier | Definition | Mandatory Output |
|------|------------|------------------|
| **1 — Basic** | Confirms understanding of a SINGLE component. Plain language. No assumptions. | One concrete component reference |
| **2 — Intermediate** | Probes ONE design choice. Reference persona's domain (CFO→cost, CISO→blast radius, etc.) | One alternative path identified |
| **3 — Advanced** | Tests cross-cutting behavior — what happens when {dependency degrades / volume spikes / regulator inspects}. | One specific failure mode named |
| **4 — Expert** | Probes a quantitative NFR or scale boundary. | One specific number (10×, p99, 90-day window) |
| **5 — Adversarial** | Counter-narrative — strongest objection or worst-case the solution does NOT yet address. | One real gap (or `no-gap-found` with confidence) |

### §3.2 Per-Tier Prompt Templates (verbatim — used by agent to GENERATE persona questions)

> Substitute `{persona role}`, `{persona name if available}`, `{component from v_n}`, `{capability A}`, `{capability B}`, `{NFR}`, `{number}` per persona context.

**Tier 1 Basic:**
```
As {persona role}, ask the architect ONE basic clarifying question about the proposed solution.
Frame it as if you are hearing this for the first time. Reference one specific component
({component from v_n}) from the architecture. Plain language only. One sentence.
```

**Tier 2 Intermediate:**
```
As {persona role}, probe a SINGLE design choice — pick one component and ask why it was
chosen over alternatives. Reference your domain (e.g., CFO → cost; CISO → blast radius;
Compliance → audit; Skeptic-Architect → lock-in; Vendor-Burned-Buyer → past failures).
One sentence.
```

**Tier 3 Advanced:**
```
As {persona role}, ask about cross-cutting behavior — what happens when {dependency
degrades / volume spikes 5× / regulator inspects / outage hits identity provider}.
Identify a specific failure mode. One sentence.
```

**Tier 4 Expert:**
```
As {persona role}, probe an NFR or scale boundary. Ask about a specific number —
10× volume, p99 latency, 90-day audit window, conversation budget overrun, etc.
Force a quantitative answer. One sentence.
```

**Tier 5 Adversarial:**
```
As {persona role}, raise the strongest counter-narrative or worst-case scenario the
solution does NOT yet address. Be a bad-faith reviewer in good faith — point out a
real gap, not a hypothetical. One sentence.
```

### §3.3 Persona-Flavor Overrides

Some personas have mandatory question shapes at specific tiers:

| Persona | Tier | Override |
|---------|------|----------|
| CFO | 4 | MUST force a numerical answer (TCO / break-even / consumption budget) |
| CISO | 3 | MUST name a specific failure mode (e.g., credential leak, prompt injection, data exfiltration path) |
| Compliance-Officer | 5 | MUST frame as a regulator-ask ("the auditor sits down and asks you...") |
| Vendor-Burned-Buyer | 5 | MUST reference a generic past-failure pattern (shelfware, integration drift, vendor pivot) |
| Skeptic-Architect | 2 | MUST name a specific alternative (open-source / native cloud / build-it-yourself) |
| CMIO (healthcare overlay) | 5 | MUST frame as a PHI-leak worst case |
| CRO (FinServ overlay) | 4 | MUST probe model governance or SOX boundary |

---

## §4. Improvement Opportunity Schema (YAML, full)

```yaml
opportunity_id: OPP-{persona-id}-T{tier}-{seq}    # e.g., OPP-CISO-T4-1
raised_at: {ISO-8601 timestamp}
raised_by_persona:
  type: panel | industry-overlay | generic
  name: {persona name or role}
  round: 1 | 2
raised_by_tier: 1 | 2 | 3 | 4 | 5
question: |
  {verbatim question text}
architect_answer_v: {n}                            # which solution version answered
gap_identified: |
  {what was missing or weak in v_n}
proposed_change:
  type: ADD | REPLACE | REMOVE | TUNE_NFR | TIGHTEN_KPI
  delta: |
    {1-3 line description of the change}
  affected_components: [{component refs}]
  affected_pains: [{pain refs from §6.5}]          # populated if 4B re-entry
  affected_kpis: [{KPI refs from §11}]             # populated if 4C re-entry
  affected_nfrs: [{NFR refs from §4.5}]            # populated if NFR change
evidence:
  customer_fact: "{Phase-N fact reference}"
  research_source: "{URL + ISO date OR catalog §X}"
  capability_catalog_ref: "lib/docs/mulesoft-agentforce-capability-catalog.md §{x}"
  confidence: HIGH | MEDIUM | LOW
phase_4_reentry:
  required: yes | no
  sub_gates: [4A, 4B, 4C]                          # which subset
user_decision: KEEP | IMPROVE | DISCARD
decision_rationale: |
  {1-2 lines from user response or auto-derived}
deferral:                                           # populated only if DISCARD-WITH-NOTE
  target: risk-register | roadmap-h3 | out-of-scope
  reason: {1 line}
applied_at: {ISO-8601 if IMPROVE}
solution_version_post: v{n+1}                       # version after applying
```

---

## §5. Verdict Decision Tree

### §5.1 Threshold Rules (locked from Phase 2 Standard S7)

```
START verdict-decision

  IF agent_verification_confidence == HIGH
     AND v_n_answer is best-in-class against catalog/research
     AND no superior alternative surfaced
  THEN
     verdict = ✅ KEEP
     EXIT

  IF agent_verification_confidence >= MEDIUM
     AND ( gap blocks a Phase-4B uncovered pain
           OR gap violates an NFR default (8 categories)
           OR gap tightens a Phase-4C KPI baseline materially )
  THEN
     verdict = ⚠️ IMPROVE
     populate Improvement Opportunity Schema (§4)
     determine phase_4_reentry per §8
     EXIT

  IF agent_verification_confidence == LOW
     OR proposed_change scope-creeps beyond use case
     OR cost-impact > customer's stated envelope
  THEN
     verdict = ❌ DISCARD-WITH-NOTE
     populate deferral.target ∈ {risk-register, roadmap-h3, out-of-scope}
     populate deferral.reason
     EXIT

END
```

### §5.2 Worked Examples

**Example 1 — KEEP**
- Q (CFO Tier 1): "What does Anypoint MQ do for us?"
- A (v1): "Decouples Salesforce → claims-system writes via durable queue."
- Verification: catalog §3.2 confirms; customer's Phase-1 fact mentions current sync-write timeouts.
- Confidence: HIGH. **Verdict: ✅ KEEP**.

**Example 2 — IMPROVE**
- Q (CISO Tier 4): "At 10× call volume, where does PII sit during inference?"
- A (v1): "Einstein Trust Layer masks PII."
- Verification: live research confirms Trust Layer GA + masking, BUT cross-member context isolation requires explicit per-member Data Cloud segment scoping which v1 omits. Confidence HIGH (real gap).
- **Verdict: ⚠️ IMPROVE** — add per-member Data Cloud segment isolation as an explicit component. `phase_4_reentry: 4B` (component count changes).

**Example 3 — DISCARD-WITH-NOTE**
- Q (Vendor-Burned-Buyer Tier 5): "What if Salesforce deprecates Atlas Reasoning in 18 months?"
- A (v1): "Architecture is decoupled — could swap to MuleSoft AI Chain Inference."
- Verification: speculative future event, no current signal. Confidence LOW.
- **Verdict: ❌ DISCARD-WITH-NOTE** — `deferral.target: risk-register`; `reason: speculative product roadmap risk; current GA stable; revisit at quarterly review`.

---

## §6. Per-Persona RGV Cycle

```
1. READ:
   - Solution v_n components, capability catalog refs, research_log entries
   - Persona profile (role, focus, signature concern, flavor overrides §3.3)
2. GENERATE:
   - 5 questions (one per tier 1-5) using §3.2 templates + §3.3 overrides
   - For each: architect answer using v_n + verification block + verdict + opportunity if IMPROVE
3. VERIFY:
   - 5 questions across 5 distinct tiers (no skipping)
   - Each verification has confidence score
   - Each verification has at least one cross-reference (catalog / research_log / customer fact)
   - Every IMPROVE has Improvement Opportunity Schema fully populated
   - Every DISCARD has deferral target
4. FIX before checkpoint: any tier coverage gap, missing confidence, missing cross-ref
```

---

## §7. Final Consolidation RGV

```
1. READ:
   - All Round 1 + Round 2 opportunities (applied + discarded)
   - Phase 4 delta re-validation outputs
   - Solution v_final
2. GENERATE:
   - v1 → v_final diff table (component delta, NFR delta, KPI delta)
   - Refinement_Log §0 Summary Dashboard
   - Refinement_Log §7 Solution Diff
   - Refinement_Log §8 Termination Trigger
3. VERIFY:
   - Every IMPROVE has applied_at timestamp
   - Every Δ in v_final traces to an OPP-id
   - Round count ≤ 2
   - All deferrals have target + reason
   - Phase 4 delta outputs reconciled into respective state objects
4. FIX before final checkpoint
```

---

## §8. Phase 4 Delta Re-Validation Rules

### §8.1 Trigger Matrix

| Improvement Type | Triggers Delta |
|------------------|----------------|
| Component **added** | 4B (new pain↔component edges) + 4A (new capability scoring if not previously scored) |
| Component **removed** | 4B (orphan pain check) + 4C (KPIs dependent on removed component) |
| Component **replaced** | 4A (new capability scoring) + 4B (edge update) + possibly 4C |
| Capability change (e.g., GA→Preview, edition shift) | 4A (re-score affected dim) |
| Geography / data-residency change | 4A (Geography + Data Residency dims) |
| NFR target tightened | 4A (re-check Footprint/Edition) + Supporting Doc §4.5 update |
| KPI added / baseline shifted | 4C (only) |

### §8.2 4A Delta Procedure (single-capability re-score)

1. Re-score the affected capability across all 8 dims (do NOT re-score unaffected capabilities)
2. Update `feasibilityMatrix.capabilities[?name=={cap}].scores` and `verdict`
3. If new verdict == NO-GO → escalate (block Phase 5 exit; user must replace or descope)
4. Update `feasibilityMatrix.summary` counts
5. Log in `refinementLog.deltaRuns[]`

### §8.3 4B Delta Procedure (affected edges only)

1. For each added component: compute `painsAddressed[]`; add edges to `coverageMatrix.componentToPain[]`
2. For each removed component: remove its edges; check `coverageMatrix.painToComponent[]` for orphaned pains → if any, flag uncovered
3. Re-compute future-enabler ratio; if > 20% → flag (block exit)
4. Re-compute pain coverage %; if < 100% → flag (block exit)
5. Update `coverageMatrix.summary`
6. Log in `refinementLog.deltaRuns[]`

### §8.4 4C Delta Procedure (KPI add/edit only)

1. For each added KPI: validate 5 mandatory fields (Baseline + Target + Window + Owner + Instrumentation)
2. For each edited KPI: validate same fields after edit
3. If any baseline = TBD → add to `KPI_Baselines_v1.md`
4. Update `kpis` state object
5. Log in `refinementLog.deltaRuns[]`

> **Delta runs do NOT trigger their own user checkpoints.** Outputs are inline in `Refinement_Log.md` §6 and reconciled at Final Consolidation Stop.

---

## §9. Termination Logic

### §9.1 Triggers

| Trigger | Detection | Action |
|---------|-----------|--------|
| **Normal** | All scheduled personas processed in Round 1; no HIGH-impact IMPROVE pending → Round 2 unnecessary | Proceed to Final Consolidation |
| **Round-2-completed** | Round 2 personas processed | Proceed to Final Consolidation |
| **Max-rounds-reached** | Round 2 ends with remaining IMPROVE candidates | Auto-defer remaining to Risk Register; proceed |
| **User-locked-early** | User typed `lock now` at any Per-Persona Stop | Capture rationale (mandatory); record in `terminationTrigger.rationale`; skip remaining personas; proceed to Consolidation |

### §9.2 `lock now` Rationale Capture

When user types `lock now`:
1. Agent prompts: `Lock-now requires a 1-line rationale. Why are you ending Phase 5 early?`
2. Agent records the response verbatim into `terminationTrigger.rationale`
3. If user provides no rationale or types "skip" → agent refuses lock-now and continues persona engagement
4. Record `terminationTrigger.lockedAt` (ISO-8601 timestamp)

### §9.3 Round-2 Selection Algorithm

```
candidates = [persona for persona in personasEngaged
              if persona.round1.improvementsApplied
              .any(impact == HIGH AND affects_other_personas_question_set)]

IF len(candidates) == 0:
   skip Round 2; proceed to Consolidation
ELSE:
   re-engage candidates only (NOT all personas) with v_current
   max 2 rounds total
```

---

## §10. State File Updates

> Cross-reference: `lib/docs/state-schema-reference.md` §refinementLog (full schema).

**New top-level keys (added in v1.3.0):**

```json
{
  "refinementLog": {
    "startedAt": null,
    "endedAt": null,
    "currentRound": 0,
    "personasEngaged": [
      {
        "type": "panel|industry-overlay|generic",
        "name": "",
        "rounds": [
          {
            "round": 1,
            "questions": [{ "tier": 1, "q": "", "a": "", "verification": {}, "verdict": "", "oppId": null }],
            "checkpointApprovedAt": null
          }
        ]
      }
    ],
    "improvementsApplied": [/* OPP entries with user_decision == IMPROVE */],
    "improvementsRejected": [/* OPP entries with user_decision == DISCARD */],
    "deltaRuns": [
      { "trigger": "OPP-...", "subGate": "4A|4B|4C", "summary": "", "newVerdict": "", "ranAt": null }
    ],
    "terminationTrigger": {
      "type": "normal|max-rounds|user-locked-early",
      "rationale": null,
      "lockedAt": null
    },
    "solutionVersionPre": "v1",
    "solutionVersionPost": "v2"
  }
}
```

**Per-phase update protocol additions:**
- After every Per-Persona Stop approval → append to `personasEngaged[?name].rounds[?round].questions[]`; update `currentRound` if needed
- After delta run → append to `deltaRuns[]`; update affected `feasibilityMatrix` / `coverageMatrix` / `kpis`
- After Final Consolidation approval → set `endedAt`, `solutionVersionPost`, `phaseStatuses.phase5 = COMPLETED`

---

## §11. Failure Modes & Recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| **Catalog/research conflict** | Verification finds catalog says GA, research_log says Preview | Trust research_log (more recent); update catalog gap-list; mark capability `⚠️ PREVIEW` |
| **User pushback on verdict** | User says "not really" / "you're wrong" | Re-check evidence; do NOT auto-reverse (Anti-Sycophancy from Stops); request a specific counter-fact |
| **Persona returns "no questions"** | Agent generates fewer than 5 questions | FORBIDDEN — agent must regenerate using §3.2 templates; raise self-check failure |
| **Phase 4 delta detects new NO-GO** | 4A delta verdict flips to NO-GO | Block Phase 5 exit; require user to replace capability or descope; log as new GAP |
| **`lock now` without rationale** | User types `lock now` and refuses to provide rationale | Refuse lock-now; continue persona engagement |
| **Round 2 cycle (>2 rounds)** | Round counter > 2 | Force terminate as `max-rounds-reached`; defer remaining IMPROVE to Risk Register |

---

## §12. Cross-References

| Need | Reference |
|------|-----------|
| Phase 5 workflow integration | `rules/00_Phase_Orchestration.mdc` Phase 5 section |
| Persona library summary table | `rules/01_Guidance.mdc` §17 |
| Question taxonomy summary | `rules/01_Guidance.mdc` §18 |
| Improvement Decision Matrix summary | `rules/01_Guidance.mdc` §19 |
| Few-shot BAD/GOOD persona engagement | `rules/01_Guidance.mdc` §6.7 |
| Per-persona + consolidation stop point format | `rules/02_Mandatory_Stop_Points.mdc` Stops 9–10 |
| Output template (instance structure) | `templates/Refinement-Log-template.md` |
| State schema additions | `lib/docs/state-schema-reference.md` §refinementLog |
| Phase 4 delta re-validation entry points | `lib/docs/phase-4-enterprise-gates-spec.md` §"Phase 5 Delta Triggers" |
| Capability catalog (cross-checked during verification) | `lib/docs/mulesoft-agentforce-capability-catalog.md` |
| Research sources (used during on-demand live research) | `lib/docs/research-sources-and-protocol.md` |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-23
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.3.0 | 2026-05-05
