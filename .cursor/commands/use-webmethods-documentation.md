---
description: Reverse-engineer AS-IS specifications from webMethods Integration Server projects with zero data loss
---

# webMethods Documentation Agent

Comprehensive AS-IS specification generation from webMethods IS projects via 7-phase RGV (Read-Generate-Verify) workflow.

## Steps to Activate

**Step 1: Setup** *(Run exactly as-is — do not make any other updates to .cursorignore)*
```bash
mkdir -p project/output_webmethods && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/WebMethods_Documentation_Agent/.*|#/r-genie/WebMethods_Documentation_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/WebMethods_Documentation_Agent/rules/WebMethods_Documentation.mdc`

**Step 3: Provide Inputs (User Action)**
- Place your webMethods IS project folder(s) anywhere in the workspace
- Or reference the folder directly: `@path/to/webmethods-package-folder`
- The agent reads artifacts in place — no input folder required

## Display
```
WEBMETHODS DOCUMENTATION AGENT V1.0 - ACTIVATED

✅ Ready | 🔄 Continuous Processing with Per-Section RGV Micro-Checkpoints
📂 Out: project/output_webmethods/{package_name}/

📥 HOW TO USE:
  • Reference: @path/to/webmethods-package-folder
  • Folder: Drop the IS package/project folder anywhere in the workspace
  • Artifacts: flow.xml, node.ndf, node.idf, *_nodesACL.xml, WSDL/wsdl0, XSD, .java, API GW

💡 WHAT IT DOES (7 Phases — RGV per section):
  • Phase 0: Discovery & Planning - Inventory ALL artifacts, classify NDF subtypes
  • Phase 1: Flow Documentation - Per-FLOW RGV: steps, invocations, pipeline effects
  • Phase 2: Mapping & Signatures - Per-NDF RGV: signatures, field mappings, adapters
  • Phase 3: Profile & Contract Docs - Per-WSDL/XSD/DocType RGV: schemas, IDF hierarchy
  • Phase 4: Security & Supporting - ACL, JAVA, config/policy artifacts
  • Phase 5: Cross-Artifact Synthesis - End-to-end call chain, consolidated contracts
  • Phase 6: Validation & Certification - File-by-file reconciliation, zero data loss cert

🎯 OUTPUT:
  • Main AS-IS specification (8 sections) + 6 supporting docs + state file
  • Component inventory, flow configs, service signatures, mapping tables
  • Contract schemas, security summary, verification checklist
  • Every element + attribute documented and count-verified

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Provide your webMethods package folder to begin AS-IS documentation.
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Data Loss** | Every element AND attribute documented and count-verified |
| **RGV Loop** | Read → Inventory → Generate → Verify → Fix → Checkpoint per section |
| **Evidence-Bound** | Every extraction cites source file and element — no assumptions |
| **Content-Based Classification** | NDF subtypes and extensionless WSDLs (`wsdl0`) classified from content |
| **Per-Section Micro-Checkpoints** | `✅ 3.1: ServiceName — 12/12 flow steps` after each section |
| **Complete Mapping Tables** | ALL field mappings individually documented — never summarized |

## Supported Artifact Types

| Type | File Pattern | Captures |
|------|-------------|----------|
| FLOW | `flow.xml` | Steps, invocations, pipeline effects, control flow (MAP, INVOKE, BRANCH, SEQUENCE, LOOP, EXIT, REPEAT, TRY/CATCH) |
| NDF | `node.ndf` | Service/docType/schema/connector metadata, signatures, references |
| IDF | `node.idf` | Namespace/folder hierarchy and organization |
| ACL | `*_nodesACL.xml` | Security permissions per service node |
| WSDL | `.wsdl`, `.wsd`, extensionless `wsdl0` | SOAP contract definitions |
| XSD | `.xsd` | XML schema structures |
| JAVA | `.java`, `java.frag` | Java Service code, pipeline manipulation |
| Config | `.xml`, `.json`, `.properties`, `.yaml`, `.cnf`, `.frg` | Runtime-relevant settings |
| API Gateway | `.acdl`, `ExportReport.json`, policy files | API exposure and policies |

## Output Structure

```
project/output_webmethods/{package_name}/
├── webmethods_specification_{service_name}.md   # Main AS-IS spec (8 sections)
├── supporting-docs/
│   ├── component-inventory.md                   # Phase 0: All artifacts classified
│   ├── flow-configuration.md                    # Phase 1: ALL flow step configs
│   ├── service-signatures.md                    # Phase 2: NDF-derived signatures
│   ├── mapping-tables.md                        # Phase 2: ALL field mappings
│   ├── contract-schemas.md                      # Phase 3: WSDL/XSD/DocType structures
│   ├── security-summary.md                      # Phase 4: ACL analysis
│   └── verification-checklist.md                # Phase 6: Counts, reconciliation, cert
└── .webmethods-state.json                       # Resume state (7 phases)
```

## Use Cases

- **Migration projects** — webMethods → MuleSoft (or other targets): produces the source-side specification needed for target design
- **Documentation & audit** — forensic-level documentation of existing webMethods integrations
