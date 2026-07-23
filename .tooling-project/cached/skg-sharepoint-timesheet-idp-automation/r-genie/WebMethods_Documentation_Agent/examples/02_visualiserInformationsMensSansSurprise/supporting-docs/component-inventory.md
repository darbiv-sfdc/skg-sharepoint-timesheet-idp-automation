# Component Inventory — Psc0270visualiserInformationsMensSansSurpriseV2

**Package:** Psc0270visualiserInformationsMensSansSurpriseV2
**Scan Date:** 2026-04-13
**Pattern:** Multi-package orchestration (1 main + 3 sub-packages + 2 API Gateway exports)

---

## Main Package: psc0270visualiserinformationsmenssanssurprisev2-master

### Flow Services (FLOW)

| # | File Path | Name | Role | Notes |
|---|-----------|------|------|-------|
| 1 | restServices/_post/flow.xml | restServices:_post | REST Resource Handler | Delegates to frmkcommon.restUtil:postXmlService; ACL: PscWS |
| 2 | services/pub/visualiserInformationsMensSansSurpriseREST/flow.xml | pub:visualiserInformationsMensSansSurpriseREST | REST Entry Point | Dual entry — REST variant |
| 3 | services/pub/visualiserInformationsMensSansSurpriseSOAP/flow.xml | pub:visualiserInformationsMensSansSurpriseSOAP | SOAP Entry Point | Dual entry — SOAP variant |
| 4 | services/priv/visualiserInformationsMensSansSurprise/flow.xml | priv:visualiserInformationsMensSansSurprise | Private Orchestrator | Invokes 3 etape services |
| 5 | services/priv/etapes/visualiserAccordCommercial/flow.xml | priv.etapes:visualiserAccordCommercial | Etape — Accord Commercial | Calls partsimmvisualisationaccordcommercialv120 |
| 6 | services/priv/etapes/visualiserCalendrierDePaiement/flow.xml | priv.etapes:visualiserCalendrierDePaiement | Etape — Calendrier Paiement | Calls partsimmvisualisercalendrierpaiementv72 |
| 7 | services/priv/etapes/visualiserCasMetier/flow.xml | priv.etapes:visualiserCasMetier | Etape — Cas Metier | Calls partsimmvisualisercasmetierv112 |
| 8 | services/utils/serviceSetNameSpace/flow.xml | utils:serviceSetNameSpace | Utility | Namespace manipulation |

**Backup files (`.bak`) noted:** 8 `flow.xml.bak` files — duplicates of above, not processed.

### NDF Artifacts

| # | File Path | Subtype | Classification Evidence | Fields/Properties |
|---|-----------|---------|------------------------|-------------------|
| 1 | restServices/_post/node.ndf | Flow Service (REST Resource) | `svc_type="flow"`, `allowedHTTPMethods` array present | 3 input fields, 11 runtime properties |
| 2 | schema/docTypeRef_tns_BornesElecType/node.ndf | DocType (Schema-derived) | `rec_fields` present, `schemaType`, `schemaDomain`, no `svc_type` | 2 fields |
| 3 | schema/docTypeRef_tns_BornesGazType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 4 | schema/docTypeRef_tns_CasMetierAjustAutoElecType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 5 | schema/docTypeRef_tns_CasMetierAjustAutoGazType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 6 | schema/docTypeRef_tns_CasMetierDPBElecType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 7 | schema/docTypeRef_tns_CasMetierDPBGazType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 8 | schema/docTypeRef_tns_DonneesCommunesElecType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 9 | schema/docTypeRef_tns_DonneesCommunesGazType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 10 | schema/docTypeRef_tns_DonneesComplementairesType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 11 | schema/docTypeRef_tns_DonneesGeneralesType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 12 | schema/docTypeRef_tns_DonneesRetourType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |
| 13 | schema/docTypeRef_tns_EtatServiceType/node.ndf | DocType (Schema-derived) | Same pattern | N fields |

**schemasWithoutPrefixes/:** 12 equivalent NDF files with identical structure but field names without `tns:` prefix. Noted as duplicates — not double-counted.

### IDF Entries

| # | File Path | Namespace | Type |
|---|-----------|-----------|------|
| 1 | node.idf | psc0270visualiserinformationsmenssanssurprisev2 | Package root |
| 2 | restServices/node.idf | restServices | REST services folder |
| 3 | schema/node.idf | schema | Schema folder |
| 4 | schemasWithoutPrefixes/node.idf | schemasWithoutPrefixes | Schema duplicate folder |
| 5 | services/node.idf | services | Services root |
| 6 | services/priv/node.idf | services.priv | Private services |
| 7 | services/priv/etapes/node.idf | services.priv.etapes | Step services |
| 8 | services/pub/node.idf | services.pub | Public services |
| 9 | services/utils/node.idf | services.utils | Utility services |
| 10 | ws/node.idf | ws | Web services |
| 11 | ws/visualiserInformationsMensSansSurprise_/node.idf | ws connector root | WS connector |
| 12 | ws/visualiserInformationsMensSansSurprise_/docTypes/node.idf | ws docTypes | WS document types |
| 13 | ws/visualiserInformationsMensSansSurprise_/services/node.idf | ws services | WS connector services |

### ACL

| File | Entries |
|------|--------|
| acl/Psc0270visualiserInformationsMensSansSurpriseV2_nodesACL.xml | 9 node-to-ACL mappings |

### Config

| File | Type |
|------|------|
| manifest.v3 | Package manifest |

---

## Sub-Package: partsimmvisualisercasmetierv112-master

| Type | Count | Key Artifacts |
|------|-------|---------------|
| FLOW | 7 | pub/v112/visualiserCasMetier, WS connectors (×2 — normal + useDigest), responseServices (×2 + genericFault ×2) |
| NDF | Multiple | Service NDFs, docType NDFs, WS connector NDFs |
| ACL | 1 | ACL file |
| Config | 1 | manifest.v3 |

**Pattern notes:** Versioned namespace (`v112/`), `useDigest` authentication variant, `ZCSS_*` connector naming (SAP-influenced).

---

## Sub-Package: partsimmvisualisationaccordcommercialv120-master

| Type | Count | Key Artifacts |
|------|-------|---------------|
| FLOW | 4 | pub/v120/visualisationAccordCommercial, WS connector, responseServices (×1 + genericFault) |
| NDF | Multiple | Service and docType NDFs |
| ACL | 1 | ACL file |
| Config | 1 | manifest.v3 |

**Pattern notes:** Versioned namespace (`v120/`), `ZCSS_VISU_ACCORD_CO_V120_*` connector naming.

---

## Sub-Package: partsimmvisualisercalendrierpaiementv72-master

| Type | Count | Key Artifacts |
|------|-------|---------------|
| FLOW | TBD | Similar pattern to other sub-packages |
| NDF | TBD | Similar |
| ACL | 1 | ACL file |
| Config | 1 | manifest.v3 + manifest.bak |

**Pattern notes:** Legacy structure with `.svn/` directory, empty placeholder folders (code/, config/, doc/, lib/, resources/, templates/, web/).

---

## API Gateway Exports

### visualiserInformationsMensSansSurprise_V2-0 (SOAP)

| File | Type |
|------|------|
| APIGatewayAssets.acdl | SOAP API Gateway export |
| ExportReport.json | Export metadata |
| API/API.80c7aa6b-.../ | UUID-based API definition (7 items) |
| Alias/ | 4 alias items |

### visualiserInformationsMensSansSurprise_rest_V2-0 (REST)

| File | Type |
|------|------|
| APIGatewayAssets.acdl | REST API Gateway export |
| ExportReport.json | Export metadata |
| API/API.2ee74fab-.../ | UUID-based API definition (7 items) |
| Alias/ | 4 alias items |

---

## Summary

| Category | Main Package | Sub-Packages (3) | API GW (2) | Total |
|----------|-------------|-------------------|------------|-------|
| Flows | 8 | ~15 | — | ~23 |
| NDFs | 14+ | Multiple | — | 50+ |
| IDFs | 13 | Multiple | — | 30+ |
| ACLs | 1 (9 entries) | 3 | — | 4 |
| API GW | — | — | 2 (SOAP+REST) | 2 |
| Config | 1 | 3 | — | 4 |

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: MuleSoft PS EMEA | v1.0.0 | 2026-04-13
