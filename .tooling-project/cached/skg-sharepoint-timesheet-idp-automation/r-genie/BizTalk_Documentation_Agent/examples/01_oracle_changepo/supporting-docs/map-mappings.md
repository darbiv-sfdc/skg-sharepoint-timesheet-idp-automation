# Map Mappings — VenOracle._ChangePO

> Phase 2. Map `Map_ORAChgPO_to_Email`. Sources: `Maps/Map_ORAChgPO_to_Email.btm` (UTF-16) + `Maps/xsl/Map_ORAChgPO_to_Email.xsl` (UTF-16).

## ⚠️ .btm ↔ .xsl divergence (CustomXSLT)

The `.btm` functoid graph is **NOT** the effective logic:
- `.btm` declares `<CustomXSLT XsltPath="xsl\Map_ORAChgPO_to_Email.xsl" />` → BizTalk uses the custom XSLT and ignores the visual link graph.
- `.btm` contains only **1** link (`POID → Subject`) and `<Functoids />` is **empty**.
- Per agent rule (*prefer the `.xsl` for transform logic*), the authoritative mapping below is extracted from the `.xsl`.

```
.btm SrcTree  = ..\Schemas\CHANGE_PO_006.xsd          (RootNode CHANGE_PO_006)
.btm TrgTree  = Venture.Utilities.Email.Email          (RootNode Email)   🔴 absent
.btm Link 1   = POHEADER/POID  →  Email/Subject        (superseded by CustomXSLT)
```

## Effective mapping (from `.xsl`) — 10/10 links

Source XPaths relative to `CHANGE_PO_006`; target relative to `ns0:Email`.

| Link | Source | Target | Logic |
|------|--------|--------|-------|
| 1 | `DATAAREA/CHANGE_PO/POHEADER/POID` | `Email/Subject` | Concatenated into literal: `":OracleB2B] Order change request: PO#" + POID` |
| 2 | `DATAAREA/CHANGE_PO/POHEADER/USERAREA/REVISIONNUM` | `Email/Subject` | Appended: `" REV: " + REVISIONNUM` |
| 3 | `DATAAREA/CHANGE_PO/POHEADER/POID` | `Email/Body` | Line: `PO#: <POID>` |
| 4 | `DATAAREA/CHANGE_PO/POHEADER/USERAREA/REVISIONNUM` | `Email/Body` | Same line: `REV: <REVISIONNUM>` |
| 5 | `DATAAREA/CHANGE_PO/POHEADER/BUYERID` | `Email/Body` | Line: `Buyer: <BUYERID>` |
| 6 | `DATAAREA/CHANGE_PO/POLINE/POLINENUM` | `Email/Body` | Inside `xsl:for-each POLINE`, tab-separated, col 1 |
| 7 | `DATAAREA/CHANGE_PO/POLINE/ITEM` | `Email/Body` | Inside loop, tab-separated, col 2 |
| 8 | `DATAAREA/CHANGE_PO/POLINE/ITEMX` | `Email/Body` | Inside loop, tab-separated, col 3 |
| 9 | _constant_ | `Email/SendToList/SendTo` | `xsl:text` literal: `andrew_ong@venture.com.sg; rachel.loo-sl@venture.com.sg; jenny.lee-cn@venture.com.sg; angeline.tan-hy@venture.com.sg` |
| 10 | _constant_ | `Email/SendCcList/SendCc` | `xsl:text` literal: `pengkit.sam@venture.com.sg; kokchoon.ling@venture.com.sg; benjamin.chia-my@venture.com.sg` |

### Body template (literal structure, from `.xsl`)
```
PO#: <POID> REV: <REVISIONNUM>
Buyer: <BUYERID>

POLINE	ITEM	ITEMX
  [for each POLINE]  <POLINENUM>	<ITEM>	<ITEMX>

Please log in to iSupplier portal for detail: https://gsiau-suppliers.oracle.com/OA_HTML/AppsLogin
```

### Header / control
- `xsl:output omit-xml-declaration="yes" method="xml" indent="yes"`.
- Template matches `/` → `apply-templates select="CHANGE_PO_006"` → builds `ns0:Email`.
- Output namespace `ns0 = http://Venture.Utilities.Email.Email`.

> ⚠️ Links 9 & 10 are **constants in the map** but are **overwritten at runtime** by the orchestration (shape `MessageAssignment_1`, OID `7a8e888d`) using `ConfigHelper` values `EmailRecipientTo` / `EmailRecipientCc`. The Subject (links 1-2) is additionally prefixed with `"[" + RuntimeEnv` by the orchestration. See `orchestration-flows.md`.
