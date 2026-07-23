# webMethods Documentation Agent (09)

**Reverse-engineer AS-IS specifications from webMethods Integration Server projects.**

---

## Purpose

Analyzes webMethods IS project exports and generates comprehensive AS-IS flow specifications. Designed for:

- **Migration projects** — webMethods → MuleSoft (or other targets): produces the source-side specification needed for target design
- **Documentation & audit** — generate forensic-level documentation of existing webMethods integrations

## Supported Artifact Types

| Type | File Pattern | What It Captures |
|------|-------------|------------------|
| FLOW | `flow.xml` | Flow Service logic — steps, invocations, pipeline effects, control flow |
| NDF | `node.ndf` | Service/docType/schema/connector metadata — signatures, fields, references |
| IDF | `node.idf` | Namespace/folder hierarchy and organization |
| ACL | `*_nodesACL.xml` | Security permissions per service node |
| WSDL | `.wsdl`, `.wsd`, extensionless `wsdl0` | SOAP contract definitions |
| XSD | `.xsd` | XML schema structures |
| JAVA | `.java` | Java Service code and pipeline manipulation |
| Config | `.xml`, `.json`, `.properties`, `.yaml`, `.cnf`, `.frg` | Runtime-relevant settings |
| API Gateway | `.acdl`, `ExportReport.json`, policy files | API exposure and policies |

## How to Use

### Windsurf
```
/use-webmethods-documentation
```

### Cursor
```
/use-webmethods-documentation
```

### Input
Place your webMethods project folder(s) in the workspace. The agent reads artifacts directly using the Read tool — no pre-processing needed.

### Output
```
project/output_webmethods/{package_name}/
├── webmethods_specification_{service_name}.md   # Main AS-IS specification (8 sections)
├── supporting-docs/
│   ├── component-inventory.md                   # All artifacts classified with counts
│   ├── flow-configuration.md                    # Detailed flow step configs
│   ├── service-signatures.md                    # NDF-derived signatures
│   ├── mapping-tables.md                        # ALL field mappings (never summarized)
│   ├── contract-schemas.md                      # WSDL/XSD/DocType structures
│   ├── security-summary.md                      # ACL analysis + runtime impact
│   └── verification-checklist.md                # Counts, reconciliation, certification
└── .webmethods-state.json                       # Resume state
```

## Architecture

- **Archetype:** Analyzer
- **Workflow:** 7 phases with per-section RGV (Read-Generate-Verify) loops
- **Rule files:** 4 (Main Entry + Phase Orchestration + Guidance + Mandatory Stop Points)
- **Quality:** Zero data loss certification — every element documented and count-verified

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design.

## Key Design Principles

1. **RGV Loop** — Read artifact fresh → Inventory elements → Generate → Verify count → Fix gaps → Checkpoint
2. **Evidence-Bound** — Every extraction cites source file and element. No assumptions.
3. **Complete Mapping Tables** — ALL field mappings documented individually. Never summarized or abbreviated.
4. **Content-Based Classification** — NDF subtypes and extensionless files classified from content, not file paths.
5. **Continuous Processing** — 7 phases execute automatically with micro-checkpoints. User stops only at scope confirmation and synthesis review.

## Rule Files

| File | Purpose | Priority |
|------|---------|----------|
| `WebMethods_Documentation.mdc` | Main entry — RISEN, artifact types, critical rules | HIGHEST |
| `00_Phase_Orchestration.mdc` | 7-phase workflow, RGV loops, checkpoints, state file | HIGH |
| `01_Guidance.mdc` | RGV loop (DRY), extraction patterns, few-shot examples | HIGH |
| `02_Mandatory_Stop_Points.mdc` | Anti-patterns, self-check, constitutional principles | HIGHEST |

See [rules/INDEX.md](rules/INDEX.md) for detailed cross-references.

## Examples

| Example | Package | Artifacts | Pattern |
|---------|---------|-----------|---------|
| [01_visualiserPartenaire](examples/01_visualiserPartenaire/) | Psc0136visualiserPartenaireV4 | 13 flows, 94 NDFs, 26 IDFs, 2 ACLs, WSDL, API GW | Single-package |
| [02_visualiserInformationsMensSansSurprise](examples/02_visualiserInformationsMensSansSurprise/) | Psc0270visualiserInformationsMensSansSurpriseV2 | 8+ flows, 14+ NDFs, 12 schema DocTypes, REST resource, dual API GW | Multi-package orchestration |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: MuleSoft PS EMEA | v1.0.0 | 2026-04-13
