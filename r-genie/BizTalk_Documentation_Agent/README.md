# R-GENIE BizTalk Documentation Agent V1

**Forensic, Zero-Assumption Technical Design from BizTalk Exports — built for MuleSoft migration**

**Author:** Cheppali Shaik Sohail
**Version:** 1.1.0

---

## Overview

The BizTalk Documentation Agent generates **zero-assumption, developer-focused** technical design documents from exported Microsoft BizTalk applications, using a **6-phase workflow** with **per-section RGV (Read-Generate-Verify) loops**. The documentation is detailed enough that a developer can **re-build the integration in MuleSoft** without opening the original BizTalk artifacts — and it **explicitly flags anything that cannot be replicated** from the provided source.

### Core Principle

> **Document what EXISTS in the source, not what you ASSUME — and flag what cannot be replicated.**

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Assumption** | Documents only what the artifacts contain — no inference |
| **Replication-Gap Report** | Names exactly what cannot be rebuilt (absent assemblies, encrypted values) and why |
| **BizTalk→MuleSoft Mapping** | Construct-by-construct equivalence table with per-artifact verdicts (🟢/🟡/🔴) |
| **Count Verification** | Shape/link/field counts verified at every section (N/N) |
| **`.btm` + `.xsl`** | Reads both the functoid graph and the compiled transform for true map logic |
| **UTF-16 Aware** | Correctly decodes BizTalk's UTF-16/BOM artifacts |
| **Forensic Input Processing** | Mind map + section-level RGV + positional-bias re-scan |
| **Stateful / Resumable** | `.biztalk-state.json` supports resume across phases |
| **Progressive Doc v2** | Skeleton-first, per-phase section writes, consolidate-and-polish |

---

## Supported Artifacts

| Artifact | Extension | Extracted |
|----------|-----------|-----------|
| Orchestration | `.odx` | Shapes, ports, messages, variables, correlations, DNF filters, inline expressions |
| Map | `.btm` (+`.xsl`) | All links (source→target XPaths), functoid logic, constants, custom XSLT |
| Schema | `.xsd` | Field tree, types, occurrence, namespaces |
| Pipeline | `.btp` | Stages → components |
| Helper | `.cs` | Class, methods, logic, call-sites |
| Project/Solution | `.btproj`/`.sln` | Project list, assembly references |

---

## Quick Start

### 1. Activate
```
/use-biztalk-documentation
```

### 2. Provide Input
```
Document this BizTalk app: @biztalk/Medium/VenHPEdi._824/
```
Or place an exported app under `project/input_biztalk/{your-app}/`.

### 3. Agent Processes (6 Phases)
1. **Phase 0:** Inventory all artifacts, build reading plan + assembly-reference graph
2. **Phase 1:** Document every orchestration (shapes, ports, expressions) — per-`.odx` RGV
3. **Phase 2:** Document every schema + map (all links) — per-map RGV (`.btm`+`.xsl`)
4. **Phase 3:** Document pipelines + `.cs` helpers + assembly refs
5. **Phase 4:** Replication-readiness verdicts + gap report
6. **Phase 5:** File-by-file reconciliation + certification

---

## Output Structure

```
project/output_biztalk/{app_name}/
├── biztalk_design_{app_name}.md         # Main document (7 sections)
├── supporting-docs/
│   ├── artifact-inventory.md
│   ├── orchestration-flows.md
│   ├── schema-structures.md
│   ├── map-mappings.md
│   ├── pipeline-helper-reference.md
│   ├── replication-gap-report.md
│   └── verification-checklist.md
└── .biztalk-state.json
```

---

## System Structure

```
r-genie/BizTalk_Documentation_Agent/
├── README.md
├── ARCHITECTURE.md
├── Production_Learnings.md
├── rules/
│   ├── INDEX.md
│   ├── BizTalk_Documentation.mdc          # MAIN ENTRY
│   ├── 00_Template_Configuration.mdc
│   ├── 01_Phase_Orchestration.mdc
│   ├── 02_Guidance.mdc
│   └── 03_Mandatory_Stop_Points.mdc
├── templates/
│   ├── documentation-style.yaml
│   └── documentation-template-guide.md
└── examples/
    ├── README.md
    └── 01_oracle_changepo/          # Canonical full anchor (main + 7 supporting docs)
```

---

## Enterprise Safety

- ✅ No external packages, no network calls — fully offline
- ✅ No scripts (LLM + HITL only); reads artifacts via native tools
- ✅ Never executes `.cs`/console projects
- ✅ Secrets marked `[ENCRYPTED]`/`[ENV]`, never exposed or guessed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-26 | Initial release — 6-phase forensic BizTalk→MuleSoft documentation (Analyzer + Document Generator hybrid, RGV, stateful, progressive doc v2, replication-gap report) |
| 1.1.0 | 2026-06-26 | **Consistency overhaul** — MANDATORY template contract with locked table columns, icon reference convention, EXACT certification box; literal per-section/per-doc templates + per-shape-type formats + Content Patterns; template-enforcement guard in Stop Points; single canonical full example `01_oracle_changepo/` (main + 7 supporting docs) so every app yields a structurally identical document |

---

## Related Agents

- **08 Boomi Documentation Agent** — the sibling pattern for Boomi XML exports
- **01 Technical Design Agent** — MuleSoft technical design
- **03-01 DataWeave Agent** — DataWeave transformations (the rebuild target for maps)

---

**R-GENIE BizTalk Documentation Agent V1.1.0 — Zero Assumption, Replication-Gap Aware, RGV Enforced, Template-Consistent**
