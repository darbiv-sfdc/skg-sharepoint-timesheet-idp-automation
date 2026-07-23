# State File Schema Reference — Cloud Success Architect Agent

> **Purpose:** Full JSON schema for `.success-architect-state.json`, including the v1.2.0 enterprise objects (`feasibilityMatrix`, `coverageMatrix`, `kpis`, `nfrCompliance`). Extracted from `rules/00_Phase_Orchestration.mdc` to keep the rule file lean (per `AGENT_ARCHITECTURE_STANDARD.md` size limits).
>
> **Used by:** `rules/00_Phase_Orchestration.mdc` (state file overview + per-phase update protocol).
>
> **Maintainer:** Cheppali Shaik Sohail | v1.0.0 | 2026-05-02

---

## Location

`project/output_cloud_success_architect/{slug}/.success-architect-state.json`

---

## Full Schema (v1.2.0)

```json
{
  "useCaseSlug": "",
  "useCaseSummary": "",
  "industryVertical": "",
  "panelPersonas": [
    { "role": "CDO", "name": null, "pains": [] },
    { "role": "VP_Integration", "name": null, "pains": [] },
    { "role": "Director_Architecture", "name": null, "pains": [] },
    { "role": "VP_Business_Apps", "name": null, "pains": [] }
  ],
  "problemDeepDive": {
    "businessDrivers": [],
    "topPains": [],
    "successMetrics": [],
    "constraints": [],
    "apiLedMaturity": ""
  },
  "currentState": {
    "mulesoftFootprint": {},
    "salesforceFootprint": {},
    "agentforceReadiness": {},
    "dataEstate": {},
    "talentOperatingModel": {}
  },
  "brainstorming": {
    "branches": [],
    "tradeoffMatrix": {},
    "recommendation": ""
  },
  "finalist": {
    "selectedBranch": "",
    "components": [],
    "accelerators": [],
    "dataFlows": [],
    "capabilityFlows": [
      {
        "name": "",
        "comment": "v1.7.0 — drives Phase 6 Step 7 diagrams.md decision. If length >= 2, diagrams.md is mandatory. Cap 4 flows in diagrams.md; overflow goes to Supporting Doc Appendix C.",
        "drillDownIncluded": true,
        "drillDownDeferredTo": null
      }
    ],
    "yourAsk": "",
    "decisionLog": []
  },
  "feasibilityMatrix": {
    "scoredAt": null,
    "capabilities": [
      {
        "name": "",
        "scores": {
          "gaStatus": "",
          "geography": "",
          "edition": "",
          "footprintCompat": "",
          "timelineFit": "",
          "skillEnvelope": "",
          "commercialSignal": "",
          "dataResidency": ""
        },
        "verdict": "",
        "alternatives": []
      }
    ],
    "summary": { "go": 0, "conditional": 0, "noGo": 0 }
  },
  "coverageMatrix": {
    "computedAt": null,
    "painToComponent": [],
    "componentToPain": [],
    "uncoveredPains": [],
    "futureEnablers": [],
    "futureEnablerRatio": null,
    "solutionWithoutProblem": []
  },
  "kpis": {
    "definedAt": null,
    "business": [
      { "name": "", "baseline": "", "target": "", "window": "", "owner": "", "instrumentation": "" }
    ],
    "operational": [],
    "technical": [],
    "preLaunchBaselineCaptureRequired": []
  },
  "refinementLog": {
    "startedAt": null,
    "endedAt": null,
    "currentRound": 0,
    "solutionVersionPre": "v1",
    "solutionVersionPost": null,
    "personasEngaged": [
      {
        "type": "panel|industry-overlay|generic",
        "name": "",
        "rounds": [
          {
            "round": 1,
            "questions": [
              {
                "tier": 1,
                "q": "",
                "a": "",
                "verification": { "confidence": "HIGH|MEDIUM|LOW", "crossRef": "" },
                "verdict": "KEEP|IMPROVE|DISCARD",
                "oppId": null
              }
            ],
            "checkpointApprovedAt": null
          }
        ]
      }
    ],
    "improvementsApplied": [
      {
        "oppId": "",
        "raisedByPersona": "",
        "raisedByTier": 0,
        "proposedChange": { "type": "ADD|REPLACE|REMOVE|TUNE_NFR|TIGHTEN_KPI", "delta": "" },
        "evidence": { "customerFact": "", "researchSource": "", "confidence": "" },
        "phase4Reentry": { "required": false, "subGates": [] },
        "appliedAt": null
      }
    ],
    "improvementsRejected": [
      {
        "oppId": "",
        "deferral": { "target": "risk-register|roadmap-h3|out-of-scope", "reason": "" }
      }
    ],
    "deltaRuns": [
      {
        "trigger": "",
        "subGate": "4A|4B|4C",
        "summary": "",
        "newVerdict": "",
        "ranAt": null
      }
    ],
    "terminationTrigger": {
      "type": "normal|max-rounds|user-locked-early",
      "rationale": null,
      "lockedAt": null
    }
  },
  "nfrCompliance": {
    "validatedAt": null,
    "categories": {
      "availabilityDR": { "target": "", "met": false, "components": [], "gap": "" },
      "scalability": { "target": "", "met": false, "components": [], "gap": "" },
      "securityCompliance": { "target": "", "met": false, "components": [], "gap": "" },
      "observability": { "target": "", "met": false, "components": [], "gap": "" },
      "dataResidency": { "target": "", "met": false, "components": [], "gap": "" },
      "performance": { "target": "", "met": false, "components": [], "gap": "" },
      "costAwareness": { "target": "", "met": false, "components": [], "gap": "" },
      "maintainability": { "target": "", "met": false, "components": [], "gap": "" }
    }
  },
  "assumptionLog": [],
  "gapRegister": [],
  "generatedArtifacts": {
    "hld": null,
    "supportingDoc": null,
    "diagrams": null,
    "refinementLog": null,
    "panelQA": null,
    "kpiBaselines": null,
    "researchLog": null,
    "_v1_7_0_notes": "Progressive Documentation v2: hld and supportingDoc skeleton paths are set at end of Phase 0; subsequent phases append per-section content. diagrams is set ONLY in Phase 6 if finalist.capabilityFlows.length >= 2. kpiBaselines may be stubbed in Phase 4C, finalized in Phase 7."
  },
  "currentPhase": 0,
  "phaseStatuses": {
    "phase0": "PENDING",
    "phase1": "PENDING",
    "phase2": "PENDING",
    "phase3": "PENDING",
    "phase4": "PENDING",
    "phase4A": "PENDING",
    "phase4B": "PENDING",
    "phase4C": "PENDING",
    "phase5": "PENDING",
    "phase6": "PENDING",
    "phase7": "PENDING",
    "phase8": "PENDING"
  }
}
```

---

## Object Reference

| Object | Populated By | Notes |
|--------|--------------|-------|
| `useCaseSlug` | Phase 0 | kebab-case from use case summary; drives output folder name |
| `panelPersonas[]` | Phase 0 | 4 personas (CDO, VP_Integration, Director_Architecture, VP_Business_Apps) |
| `problemDeepDive` | Phase 1 | 5 themes; pains carry severity (H/M/L) |
| `currentState` | Phase 2A | 5 footprint dimensions |
| `brainstorming` | Phase 3 | 3 branches + tradeoff + recommendation |
| `finalist` | Phase 4 (preliminary) | Branch chosen + draft components |
| **`feasibilityMatrix`** | **Phase 4A** | 8-dim scores + verdict per capability + summary counts |
| **`coverageMatrix`** | **Phase 4B** | Bidirectional pain↔component mapping + future-enabler ratio |
| **`kpis`** | **Phase 4C** | 3-tier (business/operational/technical) with baseline+target+window+owner+instrumentation |
| **`refinementLog`** | **Phase 5** | Personas engaged + per-persona Q/A (5 tiers) + improvements applied/rejected + delta runs + termination trigger; v1→v2 audit trail |
| **`nfrCompliance`** | **Phase 7 (§4.5 generation)** | 8 NFR categories validated against project defaults |
| `assumptionLog` | All phases (append) | Every `⚠️ ASSUMPTION` with source + validation path |
| `gapRegister` | Phase 4B + Phase 5 + Phase 7 | Uncovered pains; deferred Phase 5 opportunities; NFR gaps |
| `generatedArtifacts` | **Phase 0** (skeleton hld + supportingDoc) → Phase 2B (researchLog) → Phase 4C (kpiBaselines stub) → Phase 5 (refinementLog) → Phase 6 (diagrams when ≥2 flows) → Phase 7 (kpiBaselines finalized) → Phase 8 (panelQA). **v1.7.0:** under Progressive Documentation v2, `hld` and `supportingDoc` paths are set at Phase 0 (skeleton creation) — NOT Phase 6/7. Subsequent phases write to sections within those files. |
| `phaseStatuses` | All phases | `PENDING` → `IN_PROGRESS` → `COMPLETED` (or `NEEDS_REVIEW` after backward navigation) |

---

## Per-Phase Update Protocol (After User Approval)

| After Phase | Update These Keys |
|-------------|-------------------|
| 0 | `useCaseSlug`, `useCaseSummary`, `industryVertical`, `panelPersonas[]`, **`generatedArtifacts.hld=path` (skeleton)**, **`generatedArtifacts.supportingDoc=path` (skeleton)** _(v1.7.0 Progressive Documentation v2)_, `currentPhase=1`, `phaseStatuses.phase0="COMPLETED"` |
| 1 | `problemDeepDive.*`, append to `assumptionLog` if pains/metrics/constraints had ⚠️ markers, **HLD §3 written + Supporting §1.2 written** _(v1.7.0)_, `currentPhase=2`, `phaseStatuses.phase1="COMPLETED"` |
| 2 | `currentState.*`, `generatedArtifacts.researchLog=path`, **HLD §2 written + Supporting §3 written + extended** _(v1.7.0)_, `currentPhase=3`, `phaseStatuses.phase2="COMPLETED"` |
| 3 | `brainstorming.*`, **Supporting §2 written (ToT branches + tradeoff matrix + recommendation)** _(v1.7.0)_, `currentPhase=4`, `phaseStatuses.phase3="COMPLETED"` |
| 4 (prelim) | `finalist.selectedBranch`, `finalist.components[]` (draft), **`finalist.capabilityFlows[]`** _(v1.7.0 — drives Phase 6 Step 7 diagrams.md decision)_, `finalist.decisionLog[]`, **Supporting §2.3 written**, then enter Phase 4A |
| 4A | `feasibilityMatrix.scoredAt=now`, `feasibilityMatrix.capabilities[]`, `feasibilityMatrix.summary`, append CONDITIONAL entries to `assumptionLog`, `phaseStatuses.phase4A="COMPLETED"` |
| 4B | `coverageMatrix.computedAt=now`, `coverageMatrix.*`, append uncovered pains to `gapRegister`, `phaseStatuses.phase4B="COMPLETED"` |
| 4C | `kpis.definedAt=now`, `kpis.business[]`, `kpis.operational[]`, `kpis.technical[]`, `kpis.preLaunchBaselineCaptureRequired[]`, `phaseStatuses.phase4C="COMPLETED"`, `phaseStatuses.phase4="COMPLETED"`, `currentPhase=5`, `refinementLog.startedAt=now`, `refinementLog.solutionVersionPre="v1"` |
| 5 (per-persona stop) | Append to `refinementLog.personasEngaged[?name].rounds[?round].questions[]` (5 entries), set `checkpointApprovedAt=now`; for IMPROVE: append entry to `improvementsApplied[]`; for DISCARD: append to `improvementsRejected[]` |
| 5 (delta run) | Append to `refinementLog.deltaRuns[]` AND update affected `feasibilityMatrix` / `coverageMatrix` / `kpis` per spec §8 |
| 5 (final consolidation) | `refinementLog.endedAt=now`, `refinementLog.solutionVersionPost="v2"`, `refinementLog.terminationTrigger.*`, `generatedArtifacts.refinementLog=path`, `currentPhase=6`, `phaseStatuses.phase5="COMPLETED"` |
| 6 | _(skeleton hld path was set at Phase 0)_ HLD §1, §4, §5, §6, §7, §8-§10 written (consolidate-and-polish), §3/§6.5/§11 polished, **`generatedArtifacts.diagrams=path`** _(v1.7.0 — set only if `finalist.capabilityFlows.length >= 2`)_, `currentPhase=7`, `phaseStatuses.phase6="COMPLETED"` |
| 7 | _(skeleton supportingDoc path was set at Phase 0)_ Supporting §1, §3 accelerator-matrix, §4, §4.5, §5, §6, §7, §8, §9 written (consolidate-and-polish), §1.2/§2/§3/§3.5/§10/App-A/App-B polished, optional Appendix C if diagrams overflowed, **`generatedArtifacts.kpiBaselines=path` (finalized)**, `nfrCompliance.validatedAt=now`, `nfrCompliance.categories.*` (set met + gap per category), append NFR gaps to `gapRegister`, `currentPhase=8`, `phaseStatuses.phase7="COMPLETED"` |
| 8 | `generatedArtifacts.panelQA=path`, `phaseStatuses.phase8="COMPLETED"` |

---

## Backward Navigation Cascade

When the user requests backward navigation, mark downstream phases as `"NEEDS_REVIEW"`:

| User Says | Cascade |
|-----------|---------|
| "revise phase N" | phases N+1…8 → `NEEDS_REVIEW` |
| "switch finalist" | phases 4A, 4B, 4C, 5–8 → `NEEDS_REVIEW` |
| "re-run feasibility" | phases 4B, 4C, 5–8 → `NEEDS_REVIEW` |
| "re-run coverage" | phases 4C, 5–8 → `NEEDS_REVIEW` |
| "revise KPIs" | phases 5–8 → `NEEDS_REVIEW` |
| "re-run refinement" | re-engage Phase 5 with current solution; phases 6–8 → `NEEDS_REVIEW` |
| "revert improvement {oppId}" | move `improvementsApplied[?oppId]` to `improvementsRejected[]`; re-run affected Phase 4 deltas; phases 6–8 → `NEEDS_REVIEW` |
| "edition / entitlement changed" | phases 4B, 4C, 5–8 → `NEEDS_REVIEW` (Edition dim of 4A re-checked) |

---

## `<thinking>` Block Templates Per Phase

> Required before each phase generation step. Templates inlined here for reference; the same templates appear in-context within each phase's section in `00_Phase_Orchestration.mdc`.

### Phase 0
```
1. Key inputs received: {use case text, panel composition, any stated tech context}
2. Decisions I am making: {domain classification, industry vertical, archetype of problem}
3. Evidence from source: {cite specific sentences / sections}
4. Risks/gaps identified: {what's missing, what's ambiguous}
5. Confidence: HIGH / MEDIUM / LOW {with justification}
6. Production learnings applicable: {check Production_Learnings.md}
```

### Phase 3
```
Branch A: {description} — fits because {evidence}. Risk: {risk}. Score: {x/10}
Branch B: {description} — fits because {evidence}. Risk: {risk}. Score: {x/10}
Branch C: {description} — fits because {evidence}. Risk: {risk}. Score: {x/10}
Recommended: {choice} — Confidence: {HIGH/MEDIUM/LOW}
```

### Phase 4A
```
For each finalist capability:
- Capability: {name}
- 8-dim scores: {table}
- Verdict: {GO/CONDITIONAL/NO-GO}
- If NO-GO: alternative = {what}
Confidence: {HIGH/MEDIUM/LOW}
```

### Phase 4B
```
- Total pains (Phase 1): {M}
- Total components (post-4A): {N}
- Pain coverage: {covered}/{M}
- Component justification: {pain-driven}/{future-enabler}/{unjustified}
- Future-enabler ratio: {N_FE / N_total}
Confidence: {HIGH/MEDIUM/LOW}
```

### Phase 4C
```
For each tier:
- Business: {3-5 KPIs from customer's stated success metrics}
- Operational: {3-5 KPIs from architectural patterns chosen}
- Technical: {3-5 KPIs grounded in Phase 2 footprint}
Baselines available: {count} / KPIs requiring pre-launch capture: {count}
Confidence: {HIGH/MEDIUM/LOW}
```

### Phase 5 (Per-Persona)
```
Persona: {name + type: panel|industry-overlay|generic}
- Tier 1 Basic: Q/A/Verification(crossRef, confidence)/Verdict
- Tier 2 Intermediate: Q/A/Verification/Verdict
- Tier 3 Advanced: Q/A/Verification/Verdict
- Tier 4 Expert: Q/A/Verification/Verdict
- Tier 5 Adversarial: Q/A/Verification/Verdict (must find real gap or no-gap-found+confidence)
Improvements raised this persona: {count} (KEEP / IMPROVE / DISCARD breakdown)
Phase 4 delta triggered: {yes/no} → sub-gates: {4A|4B|4C}
Confidence (overall persona round): {HIGH/MEDIUM/LOW}
```

### Phase 5 (Final Consolidation)
```
Personas engaged: {N panel + M overlay + 5 generic = T total}
Round count: {1 or 2}
Improvements applied: {count} → v2 component delta: {summary}
Improvements deferred: {count} → Risk Register({n}) / Roadmap({m}) / Out-of-scope({k})
Phase 4 delta runs: 4A({n}) / 4B({n}) / 4C({n}) — all reconciled?
Termination trigger: {normal | max-rounds | user-locked-early(rationale="...")}
Confidence at lock: {HIGH/MEDIUM/LOW}
```

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Maintainer: Cheppali Shaik Sohail | v1.3.0 | 2026-05-05
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | 2026-05-05
