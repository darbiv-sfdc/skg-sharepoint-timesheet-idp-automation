# Artifact Inventory — VenOracle._ChangePO

> Phase 0 baseline (the verification mind-map). Source root: `biztalk/Simple/VenOracle/VenOracle._ChangePO/`

## 1. Files in export (8)

| # | File | Type | Encoding | Notes |
|---|------|------|----------|-------|
| 1 | `VenOracle._ChangePO.btproj` | Project | UTF-8 | Project + assembly references |
| 2 | `Orchestrations/ProcessChangePOIncoming.odx` | Orchestration | UTF-8 | 1 service, 1 port type, 1 receive port |
| 3 | `Maps/Map_ORAChgPO_to_Email.btm` | Map (functoid graph) | **UTF-16** | Declares `CustomXSLT` → logic in `.xsl` |
| 4 | `Maps/xsl/Map_ORAChgPO_to_Email.xsl` | Map (transform) | **UTF-16** | Actual transform logic |
| 5 | `Maps/Map_ORAChgPO_to_Email.btm.cs` | Generated | UTF-8 | BizTalk-generated; not documented |
| 6 | `Schemas/CHANGE_PO_006.xsd` | Schema | **UTF-16** | Imports external `_057_change_po_006` type |
| 7 | `Schemas/CHANGE_PO_006.xsd.cs` | Generated | UTF-8 | BizTalk-generated; not documented |
| 8 | `Properties/AssemblyInfo.cs` | Assembly metadata | UTF-8 | No business logic |

## 2. Artifact-type counts

| Artifact type | Present | Referenced-but-absent |
|---------------|---------|------------------------|
| Orchestrations (.odx) | 1 | 0 |
| Maps (.btm/.xsl) | 1 | 0 |
| Schemas (.xsd) | 1 (wrapper only) | 1 (external `_057_change_po_006` type body) |
| Pipelines (.btp) | 0 | binding/adapter not in export |
| Helpers (.cs business logic) | 0 | 2 (`ConfigHelper`, `SendEmail`) |

## 3. Assembly-reference graph

```
ProcessChangePOIncoming.odx
├── uses message type  Venture.Utilities.Email.Email           → Venture.Utilities.Email      (🔴 absent)
├── calls              Venture.Utilities.Email.SendEmail        → Venture.Utilities.Email      (🔴 absent)
├── calls              Venture.Utilities.ConfigHelper.GetNameValueFileSectionHandlerKey
│                                                               → Venture.Utilities           (🔴 absent)
├── uses message type  VenOracle._ChangePO.Schemas.CHANGE_PO_006 → CHANGE_PO_006.xsd          (✅ present, wrapper)
└── transform          Map_ORAChgPO_to_Email                    → Map_ORAChgPO_to_Email.btm/.xsl (✅ present)

CHANGE_PO_006.xsd
└── xs:import          VenOracle.Schemas._057_change_po_006      → VenOracle.dll               (🔴 absent)

Map_ORAChgPO_to_Email.btm
├── SrcTree            ..\Schemas\CHANGE_PO_006.xsd              (✅ present)
├── TrgTree            Venture.Utilities.Email.Email            (🔴 absent)
└── CustomXSLT         xsl\Map_ORAChgPO_to_Email.xsl            (✅ present)
```

## 4. Referenced-but-absent (replication gaps — detail in `replication-gap-report.md`)

| Reference | Kind | Referenced by |
|-----------|------|---------------|
| `VenOracle.Schemas._057_change_po_006` | External schema type (OAGIS 057) | `CHANGE_PO_006.xsd`, used by map `SrcTree` + XSL XPaths |
| `Venture.Utilities.ConfigHelper` | Config-reader helper | orchestration shapes "RuntimeEnv and ver", "MessageAssignment_1" |
| `Venture.Utilities.Email.Email` | Email message type (target schema) | orchestration `msgEmail`, map `TrgTree` |
| `Venture.Utilities.Email.SendEmail` | Email-send helper | orchestration shape "Call SendEmail" |
