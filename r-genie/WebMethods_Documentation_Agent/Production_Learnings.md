# webMethods Documentation Agent (09) — Production Learnings

**Version:** 1.1.0
**Last Updated:** 2026-04-13
**Tuner:** Mike Jakeman

---

## Tuning Log

### 2026-04-13 — Tuning Session 1 (Mike Jakeman)

**Scope:** Guidance Patterns (3), Examples (6), Documentation (7)
**Sample Project:** `Orchestration_Psc0270visualiserInformationsMensSansSurpriseV2`
**Backup:** `.backup-2026-04-13-131353/`

#### New Patterns Added

| # | Pattern | Guidance Section | Example Coverage |
|---|---------|-----------------|-----------------|
| 1 | REST Resource Handler (`restServices/_post/`) | §2 NDF Subtype + §3.7 Extraction + §6 Few-Shot | Example 02 §3.1 |
| 2 | Schema-derived DocType (`docTypeRef_tns_*`) | §2 NDF Subtype + §3.8 Extraction + §6 Few-Shot | Example 02 §4.2 |
| 3 | Duplicate Detection (`schemasWithoutPrefixes/`, `.bak`) | §2 Duplicate Detection | Example 02 §4 note |
| 4 | Multi-Package Orchestration (etapes pattern) | §2 Multi-Package + §3.9 Extraction | Example 02 §1.3, §3.4, §7.1 |
| 5 | Dual SOAP + REST Entry Points | — (pattern-level, not new guidance section) | Example 02 §2.1, §3.2–3.3 |
| 6 | Custom ACL Names (`PscWS`) | §2 Custom ACL + §6 Few-Shot | Example 02 §6.1 |
| 7 | Complex WS Connector (docTypes/services sub-folders) | — (existing WS patterns sufficient) | Example 02 §5.1 |
| 8 | Framework Service GAP Detection | §3.7 Rule (REST handlers) | Example 02 §3.1 GAP note |

#### Files Modified

| File | Change | Lines |
|------|--------|-------|
| `rules/01_Guidance.mdc` | +158 lines: 2 NDF subtypes, 3 new §2 subsections, 3 new §3 extraction patterns, 3 new §6 few-shots, 5 new §7 checklist items | 430 → 588 |
| `rules/INDEX.md` | Updated §09-01 description, +7 Quick Lookup entries | 120 → 127 |
| `README.md` | Added Example 02 to table, added Pattern column | 96 → 97 |

#### Files Created

| File | Purpose |
|------|---------|
| `examples/02_visualiserInformationsMensSansSurprise/webmethods_specification_*.md` | Multi-package orchestration reference example (442 lines) |
| `examples/02_visualiserInformationsMensSansSurprise/supporting-docs/component-inventory.md` | Multi-package component inventory (153 lines) |
| `Production_Learnings.md` | This file |

#### Key Decisions

1. **REST Resource Handler as NDF subtype** — Classified as Flow Service NDF variant with `allowedHTTPMethods` as distinguishing signal, rather than creating a new top-level artifact type
2. **Schema-derived DocType as NDF subtype** — Distinguished from standard DocType by presence of `schemaType` + `schemaDomain` + `originURI`
3. **schemasWithoutPrefixes as duplicates** — Noted in inventory but not double-counted in certification totals
4. **Custom ACL names** — Added explicit guidance to not assume Anonymous/Internal/Default; document actual ACL name with bold formatting
5. **Multi-package as detection pattern** — Added to §2 Classification rather than changing the phase workflow, maintaining backward compatibility

---

### 2026-04-20 — Tuning Session 2 (Sheroze Joomun)

**Scope:** Guidance Patterns (3), Documentation (7)
**Source Documentation:** `project/webmethod/webMethods Code Interpretation and Mapping to Common JSON.md`
**Backup:** `.backup-2026-04-20-143953/`

#### New Patterns Added

| # | Pattern | Guidance Section | Coverage |
|---|---------|-----------------|----------|
| 1 | `java.frag` — base64-encoded Java service source | §2 java.frag Detection + §3.6 JAVA | File extension table, §3.6 source note |
| 2 | MAP sub-operations: mapcopy, mapset, mapdelete, mapmove, mapinsert | §3.1 MAP Sub-Operations | Per-operation table with extraction focus |
| 3 | MAP modes: input/output/standalone/invokeinput/invokeoutput | §3.1 MAP Modes | Per-mode table with context and extraction focus |
| 4 | mapsource/maptarget concepts — linking pipeline vars to sig_in/sig_out | §3.1 mapsource/maptarget | Table with sig_in/sig_out linkage rule |
| 5 | Transformer — service call embedded inside MAP step | §3.1 Transformer Rule | Embedded service call documentation rule |
| 6 | Trigger artifact type (`ns/.../triggers/`) | §2 NDF Subtype + §2 Extension table + §3.11 | New §3.11 Trigger Extraction |
| 7 | `irtnode_property` base64 decode for adapter type identification | §3.2 irtnode_property Rule | Adapter NDF extraction enhancement |
| 8 | `apigateway.cnf` explicit call-out in ns/ folder | §2 Extension table | File extension table |

#### Files Modified

| File | Change |
|------|--------|
| `rules/WebMethods_Documentation.mdc` | Updated JAVA row (java.frag), added TRIGGER artifact type, updated Config row (apigateway.cnf) |
| `rules/01_Guidance.mdc` | +java.frag detection subsection (§2), +Trigger NDF subtype row, +3 extension table rows, +MAP sub-ops/modes/mapsource/maptarget/Transformer (§3.1), +irtnode_property rule (§3.2), +java.frag note (§3.6), +§3.11 Trigger Extraction, +6 compliance checklist items (§7) |
| `Production_Learnings.md` | This entry |

#### Key Decisions

1. **MAP modes as §3.1 sub-section** — Placed inside FLOW extraction (§3.1) rather than creating a standalone section, since MAP modes only apply within flow.xml context
2. **Transformer as extraction rule, not new artifact type** — Transformers are flow.xml constructs, not separate files; documented as a rule within MAP modes
3. **java.frag as JAVA subtype, not new artifact type** — Same extraction output as .java; distinguished only by encoding; backward compatible
4. **Triggers as new artifact type in §C** — Triggers are distinct entry points (async); added to main entry artifact types table and §3.11 extraction pattern
5. **irtnode_property as rule within §3.2** — Enhances existing Adapter Service extraction without restructuring the section

---

## Observations & Future Improvements

### Potential Enhancements for Future Sessions

1. **Sub-package versioning patterns** — `v112/`, `v120/` namespace conventions could benefit from dedicated extraction guidance
2. **WS connector `useDigest` variants** — Authentication mode variant detection could be expanded
3. **`ZCSS_*` naming convention** — SAP-influenced connector naming pattern could be documented
4. **API Gateway detailed extraction** — UUID-based API folder structure, ACDL content, policy details
5. **`genericFault_Response` pattern** — Common fault handling service pattern in WS connectors

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: MuleSoft PS EMEA | v1.0.0 | 2026-04-13
> 🔧 Tuned by: Mike Jakeman | v1.1.0 | 2026-04-13

> 🔧 Tuned by Sheroze Joomun via R-GENIE Agent Tuner | 2026-04-20
