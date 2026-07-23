# Psc0136visualiserPartenaireV4 — Component Inventory

**Referenced from:** `../webmethods_specification_visualiserPartenaireREST.md` Section 1.3
**Generated:** 2026-04-13

---

## Artifact Inventory

| # | File Path | Type | Subtype | Name | Elements |
|---|-----------|------|---------|------|----------|
| 1 | `ns/.../pub/visualiserPartenaireREST/flow.xml` | FLOW | Flow Service | pub.visualiserPartenaireREST | 14 steps |
| 2 | `ns/.../priv/lookupPartenaire/flow.xml` | FLOW | Flow Service | priv.lookupPartenaire | 8 steps |
| 3 | `ns/.../priv/transformResponse/flow.xml` | FLOW | Flow Service | priv.transformResponse | 6 steps |
| 4–13 | *(10 additional flow.xml files)* | FLOW | Flow Service | *(qualified names)* | *(step counts)* |
| 14 | `ns/.../pub/requestDocType/node.ndf` | NDF | DocType | pub.requestDocType | 3 fields |
| 15 | `ns/.../pub/responseDocType/node.ndf` | NDF | DocType | pub.responseDocType | 8 fields |
| 16 | `ns/.../ws/visualiserPartenaire/node.ndf` | NDF | WS Connector | ws.visualiserPartenaire | 3 operations |
| 17–107 | *(91 additional node.ndf files)* | NDF | *(classified per content)* | *(qualified names)* | *(field/prop counts)* |
| 108–133 | *(26 node.idf files)* | IDF | Namespace Descriptor | *(namespace paths)* | *(child counts)* |
| 134 | `acl/Psc0136visualiserPartenaireV4_nodesACL.xml` | ACL | Access Control | nodesACL | *(mapping count)* |
| 135 | *(second ACL file)* | ACL | Access Control | *(name)* | *(mapping count)* |
| 136 | `ns/.../ws/visualiserPartenaire/wsdl0` | WSDL | Extensionless | visualiserPartenaire | 3 operations |
| 137+ | *(API Gateway: .acdl, ExportReport.json, policy files)* | API GW | Config/Policy | *(names)* | *(element counts)* |

---

## Summary

| Type | Count | Total Elements |
|------|-------|---------------|
| **FLOW** | 13 | *(total steps)* |
| **NDF** | 94 | *(total fields/properties)* |
| **IDF** | 26 | *(total namespace entries)* |
| **ACL** | 2 | *(total mappings)* |
| **WSDL** | 1+ | 3 operations |
| **JAVA** | 0 | Not present |
| **API Gateway** | Multiple | *(policy/config elements)* |
| **Config** | Multiple | manifest.v3, properties |

> **Note:** This is a TEMPLATE example. In actual agent output, every row would contain exact file paths, fully qualified names, and precise element counts — no placeholders or abbreviations.

> **📄 Complete signatures:** See [`service-signatures.md`](service-signatures.md) for all NDF details.
> **📄 Complete field structures:** See [`mapping-tables.md`](mapping-tables.md) for all field mappings.

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: MuleSoft PS EMEA | v1.0.0 | 2026-04-13
