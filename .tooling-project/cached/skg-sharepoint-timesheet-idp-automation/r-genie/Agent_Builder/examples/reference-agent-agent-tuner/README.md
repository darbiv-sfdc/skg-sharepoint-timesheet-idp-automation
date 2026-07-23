# Reference Agent: Agent Tuner — Conversational Archetype

**Purpose:** Compact reference for the Agent Builder to study when generating **Conversational** agents.

---

## Archetype: Conversational

**Key Characteristics:**
- **4-file** lean architecture (may have 5 if agent produces templated output like charters/reports)
- Primary interaction is **dialogue-driven** — questions, discovery, gathering, planning
- Produces **modified artifacts or structured outputs** based on conversation
- Phases emphasize: discover → gather → process → apply → validate → deliver
- Critical rules focus on **study-first, user-control, and safety protocols**
- Often includes **agent-specific protection overrides** (e.g., permission to modify protected files)

## What to Study in `rules/Agent_Tuner.mdc`

| Section | Conversational Pattern |
|---------|----------------------|
| **RISEN** | R focuses on specialist expertise ("Agent Customization Specialist"). I lists multiple input types the user can provide. S emphasizes conversational flow with STOP at each phase. N clearly scopes include/exclude |
| **Available Agents Table** | Conversational agents often present a menu of options — the user selects what to work on |
| **Phase Workflow** | 7 phases with discovery-first approach — Phase 0 is study, Phase 1 is safety/backup, Phases 2-4 are conversational gathering+applying |
| **Backup Protocol** | Safety-first pattern — unique to agents that modify existing state |
| **Protection Override** | Explicit permission section for agents that need to bypass workspace protections |
| **Critical Rules** | "Study First, Edit Second" + "Rules/Templates Decoupling" — conversational agents need deep understanding before acting |

## Conversational vs Other Archetype Differences

| Aspect | Document Generator (01) | Code Generator (03) | Analyzer (04) | Conversational (10) |
|--------|------------------------|---------------------|---------------|---------------------|
| Files | 5 (with Template_Config) | 4 | 4 | 4-5 |
| Output | Structured document | Multi-file project | Analysis report | Modified artifacts or plans |
| Phases | 6 (section-by-section) | 6 (build pipeline) | 10 (think-first) | 7 (discover → gather → apply) |
| Quality | Document scoring | Build success | Quantitative metrics | Architecture compliance |
| Primary Mode | Generate sections | Generate code | Analyze input | Dialogue + selective modification |
| Critical Rules | Document structure | Production safety | Accuracy/verification | Study-first, safety, user control |
| Unique Pattern | Template-driven | File discovery + build | Chat-first → file output | Menu selection, backup, protection override |

## Files Included

| File | Purpose |
|------|---------|
| `rules/Agent_Tuner.mdc` | Main Entry — RISEN, 7-phase workflow, backup protocol, protection override, critical rules |

> **Full agent** available at `r-genie/Agent_Tuner/` for deeper study.
