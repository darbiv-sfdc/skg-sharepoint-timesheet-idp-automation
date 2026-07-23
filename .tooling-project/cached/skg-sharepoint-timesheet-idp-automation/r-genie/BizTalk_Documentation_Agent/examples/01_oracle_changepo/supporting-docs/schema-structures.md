# Schema Structures — VenOracle._ChangePO

> Phase 2. Source schema: `Schemas/CHANGE_PO_006.xsd` (UTF-16).

## CHANGE_PO_006.xsd (wrapper)

| Property | Value |
|----------|-------|
| Target namespace | `http://VenOracle._ChangePO.CHANGE_PO_006` |
| Imported namespace | `http://www.openapplications.org/057_change_po_006` (prefix `ns0`) |
| Import `schemaLocation` | `VenOracle.Schemas._057_change_po_006` (🔴 external assembly — not in export) |
| Root element | `CHANGE_PO_006` of type `ns0:CHANGE_PO_006Type` |
| BizTalk annotation | `b:references` → targetNamespace `http://www.openapplications.org/057_change_po_006` |

**Structure (as present):**
```
xs:schema (tns: http://VenOracle._ChangePO.CHANGE_PO_006)
├── xs:import  ns0 = http://www.openapplications.org/057_change_po_006
│              schemaLocation = VenOracle.Schemas._057_change_po_006   🔴 absent
└── xs:element name="CHANGE_PO_006"  type="ns0:CHANGE_PO_006Type"      (body in absent import)
```

> 🔴 **GAP:** The element body / full field tree of `CHANGE_PO_006Type` is defined in the external OAGIS-057 schema (`VenOracle.Schemas._057_change_po_006`), which is **not in this export**. The `.xsd` here is only a namespaced wrapper that imports it. The full tree (all elements/types/occurrence) cannot be reproduced from the provided source.

## Fields-in-use (recovered from `Map_ORAChgPO_to_Email.xsl` XPaths)

Although the full schema is absent, the transform tells us exactly which source nodes are consumed (all relative to root `CHANGE_PO_006`):

| Source XPath (relative to `CHANGE_PO_006`) | Used in |
|--------------------------------------------|---------|
| `DATAAREA/CHANGE_PO/POHEADER/POID` | Subject, Body |
| `DATAAREA/CHANGE_PO/POHEADER/USERAREA/REVISIONNUM` | Subject, Body |
| `DATAAREA/CHANGE_PO/POHEADER/BUYERID` | Body |
| `DATAAREA/CHANGE_PO/POLINE` (repeating — `xsl:for-each`) | Body (line loop) |
| `DATAAREA/CHANGE_PO/POLINE/POLINENUM` | Body (per line) |
| `DATAAREA/CHANGE_PO/POLINE/ITEM` | Body (per line) |
| `DATAAREA/CHANGE_PO/POLINE/ITEMX` | Body (per line) |

> ⚠️ ASSUMPTION: `POLINE` is repeating (the XSL uses `xsl:for-each`). Cardinality/types of all nodes are not confirmable without the external schema.

## Target schema — `Venture.Utilities.Email.Email`

🔴 **GAP:** target message type `Venture.Utilities.Email.Email` is an external .NET class (assembly `Venture.Utilities.Email`, source absent). Structure used by the map + orchestration (recovered from `.xsl` + orchestration xpath):
```
Email (ns: http://Venture.Utilities.Email.Email)
├── Subject
├── Body
├── SendToList
│   └── SendTo
└── SendCcList
    └── SendCc
```
