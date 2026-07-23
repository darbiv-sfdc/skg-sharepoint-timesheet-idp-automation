# Verification Checklist — VenOracle._ChangePO

> Phase 5. File-by-file reconciliation against the Phase 0 inventory baseline.

## File-by-file reconciliation

| File | Elements found | Documented | Status |
|------|----------------|------------|--------|
| `ProcessChangePOIncoming.odx` | 13 shapes, 1 port, 3 messages, 4 variables, 0 correlations | 13/13 shapes, 1/1 port, 3/3 msgs, 4/4 vars | ✅ |
| `Map_ORAChgPO_to_Email.btm` | 1 visual link + CustomXSLT decl (superseded) | 1/1 + divergence flagged | ✅ |
| `Map_ORAChgPO_to_Email.xsl` | 10 effective links | 10/10 | ✅ |
| `CHANGE_PO_006.xsd` | 1 root element + 1 import (external) | 1/1 + 6 fields-in-use recovered | ✅ (body 🔴 GAP) |
| `VenOracle._ChangePO.btproj` | 6 assembly refs (3 external) | 6/6 | ✅ |
| `Maps/Map_ORAChgPO_to_Email.btm.cs` | generated | not documented (by rule) | ✅ |
| `Schemas/CHANGE_PO_006.xsd.cs` | generated | not documented (by rule) | ✅ |
| `Properties/AssemblyInfo.cs` | no business logic | noted | ✅ |

## Count summary

| Metric | Inventory (Phase 0) | Documented | Match |
|--------|---------------------|------------|-------|
| Orchestrations | 1 | 1 | ✅ |
| Orchestration shapes | 13 | 13 | ✅ |
| Maps | 1 | 1 | ✅ |
| Map links (effective, XSL) | 10 | 10 | ✅ |
| Schemas (present) | 1 | 1 | ✅ |
| Pipelines | 0 | 0 (N/A) | ✅ |
| Helpers (referenced) | 3 | 3 (🔴 GAP) | ✅ |
| Replication gaps | 8 | 8 | ✅ |

## Quality checklist

- [x] Every orchestration shape documented (13/13, count verified)
- [x] Every map link documented (10/10), `.btm` + `.xsl` both consulted; divergence flagged
- [x] Schema field tree documented (wrapper + fields-in-use; external body flagged 🔴)
- [x] Every referenced `.cs` helper documented OR flagged 🔴 GAP (3/3)
- [x] Every artifact has a replication verdict (🟢/🟡/🔴)
- [x] All 🟡/🔴 captured in `replication-gap-report.md` with reasons + actions
- [x] Every claim cites a source file (+ OID/LinkID where available)
- [x] UTF-16 files (`.btm`, `.xsl`, `.xsd`) read correctly (no garbled text)
- [x] Env/config values marked `[ENV]`, never guessed
- [x] One Mermaid flow for the orchestration; render self-checked
- [x] Conciseness benchmarked against the canonical example
- [x] Certification reconciles documented counts against Phase 0 inventory

## Certification

```
╔══════════════════════════════════════════════════════════════╗
║  BIZTALK DOCUMENTATION — COVERAGE CERTIFICATION                ║
║  App: VenOracle._ChangePO                                      ║
║  ✅ All present artifacts documented                            ║
║     (shapes 13/13, map links 10/10, schema 1/1, helpers 3/3)  ║
║  🔴 8 external/binding dependencies flagged as replication gaps ║
║  RESULT: COMPLETE for provided source. Rebuild requires the    ║
║          BizTalk team to supply: OAGIS-057 CHANGE_PO_006 XSD,  ║
║          Venture.Utilities + Venture.Utilities.Email behavior, ║
║          and the receive port binding/config.                  ║
╚══════════════════════════════════════════════════════════════╝
```
