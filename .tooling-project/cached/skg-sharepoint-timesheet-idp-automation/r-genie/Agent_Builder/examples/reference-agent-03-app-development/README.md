# Reference Agent: App Development (03) — Code Generator Archetype

**Purpose:** Compact reference for the Agent Builder to study when generating **Code Generator** agents.

---

## Archetype: Code Generator

**Key Characteristics:**
- **4-file** lean architecture (no Template_Configuration)
- Produces **code artifacts** (files written to disk), not documents
- Phases emphasize: discover → plan → generate → build/validate → deliver
- Output is a complete project structure, not a single file
- Critical rules focus on **production safety** (no hardcoded values, error handling, secure properties)

## What to Study in `rules/03_App_Development.mdc`

| Section | Code Generator Pattern |
|---------|----------------------|
| **RISEN** | R focuses on code quality ("Production-ready applications"). E specifies project output path + build format ("Maven build-ready"). N excludes testing (separate agent) |
| **Phase Workflow** | 6 phases with build optimization (Phase 3) and deployment prep (Phase 4) — unique to code generators |
| **Critical Rules** | Production Safety section — domain-specific coding standards |
| **Output Structure** | Full project tree with `src/main/`, `src/test/`, `pom.xml` — code generators define directory layout |
| **Execution Protocol** | File discovery patterns for different input types |

## Code Generator vs Document Generator Differences

| Aspect | Document Generator (01) | Code Generator (03) |
|--------|------------------------|---------------------|
| Files | 5 (with Template_Config) | 4 |
| Output | Single markdown document | Multi-file project |
| Templates | Style YAML + template guide | Project structure + pom.xml |
| Phases | Discover → section-by-section generation | Discover → plan → generate → build → deploy |
| Quality | Scoring rubric | Build success + code standards |
| Critical Rules | Document structure compliance | Production safety (security, error handling) |

## Files Included

| File | Purpose |
|------|---------|
| `rules/03_App_Development.mdc` | Main Entry — RISEN, 6-phase workflow, critical rules, output structure |

> **Full agent** available at `r-genie/03_App_Development_Agent/` for deeper study.
