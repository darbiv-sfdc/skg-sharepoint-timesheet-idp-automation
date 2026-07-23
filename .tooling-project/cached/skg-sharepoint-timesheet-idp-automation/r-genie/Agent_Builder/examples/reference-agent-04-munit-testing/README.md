# Reference Agent: MUnit Testing (04) — Analyzer Archetype

**Purpose:** Compact reference for the Agent Builder to study when generating **Analyzer** agents.

---

## Archetype: Analyzer

**Key Characteristics:**
- **4-file** lean architecture (no Template_Configuration)
- Produces **analysis results** — scores, reports, classifications, findings
- Phases emphasize: discover → analyze → score/classify → validate → report
- Often has **more phases** (8-10) because analysis is iterative
- Critical rules focus on **accuracy and verification** (think-first approach)
- Typically has **quantitative success criteria** (coverage %, behavior scores, thresholds)

## What to Study in `rules/04_Munit.mdc`

| Section | Analyzer Pattern |
|---------|-----------------|
| **RISEN** | R focuses on analysis expertise ("85%+ coverage with behavior verification"). E specifies output path + quality metrics. N clearly scopes what IS and ISN'T analyzed |
| **Critical Output Rule** | Analyzer-specific: early phases output TO CHAT (analysis), later phases output TO FILES (results) |
| **Phase Workflow** | 10 phases with Think-First approach — discovery phases (0-3) are conversational, generation phases (4+) produce files |
| **Success Criteria** | Quantitative targets (85% coverage, 70+ behavior score) with scoring rubric — unique to Analyzer archetype |
| **Stop Points** | 5 stops at key analysis junctures, NOT at every phase — stops where human judgment validates analysis correctness |
| **Core Principles** | Think-First + Behavior Verification with BAD/GOOD examples — domain-specific quality patterns |

## Analyzer vs Other Archetype Differences

| Aspect | Document Generator (01) | Code Generator (03) | Analyzer (04) |
|--------|------------------------|---------------------|---------------|
| Files | 5 (with Template_Config) | 4 | 4 |
| Output | Structured document | Multi-file project | Analysis report + scored findings |
| Phases | 6 (section-by-section) | 6 (build pipeline) | 10 (think-first iterative) |
| Quality | Document scoring rubric | Build success | Quantitative metrics (%, scores) |
| Critical Rules | Document structure | Production safety | Accuracy, verification, think-first |
| Stop Points | After each section | After each build stage | After analysis validation |
| Unique Pattern | Template-driven sections | File discovery + build | Chat-first analysis → file output |

## Files Included

| File | Purpose |
|------|---------|
| `rules/04_Munit.mdc` | Main Entry — RISEN, 10-phase workflow, success criteria, core principles |

> **Full agent** available at `r-genie/04_Munit_Agent/` for deeper study.
