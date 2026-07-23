# Pipelines, Ports & Helpers — VenOracle._ChangePO

> Phase 3. Sources: `.btproj`, `ProcessChangePOIncoming.odx`. No `.btp` or helper `.cs` business-logic source is present in the export.

## Pipelines

**None custom.** No `.btp` files in the project. The receive adapter/pipeline binding is not part of the export (defined in the BizTalk app binding file at deploy time).
> ⚠️ ASSUMPTION: a standard XML receive pipeline (e.g., `XMLReceive`) is used to deliver `CHANGE_PO_006` XML to the orchestration. Not confirmable from source.

## Ports

| Port | Kind | Binding | Notes |
|------|------|---------|-------|
| `ReceiveOracleDoc_Port` | Logical receive (one-way) | PortType `ReceiveOracleDoc_PortType`, `Operation_1`, message `System.Xml.XmlDocument` | Activates the orchestration. Physical adapter (File/SFTP/HTTP/Oracle) not in export — ⚠️ ASSUMPTION. |
| _(no send port)_ | — | — | Outbound email goes through a direct `Call` to `SendEmail`, not a logical send port. |

## Helpers (referenced, source absent → 🔴 GAP)

All three live in external assemblies referenced by the `.btproj`; **no source is in the export** — signatures and call-sites documented from usage only. Logic must not be invented.

### 1. `Venture.Utilities.ConfigHelper.GetNameValueFileSectionHandlerKey`
- **Assembly:** `Venture.Utilities` (🔴 source absent)
- **Signature (as called):** `static string GetNameValueFileSectionHandlerKey(string key, string sectionName)`
- **Behavior (from call-site only):** returns a config value from a name/value config section. Calls read section `"VenOracleSettings"` with keys `"RuntimeEnv"`, `"EmailRecipientTo"`, `"EmailRecipientCc"`.
- **Call-sites:** `ProcessChangePOIncoming.odx` shape "RuntimeEnv and ver" (OID `54d0336f`) and "MessageAssignment_1" (OID `7a8e888d`).
- ⚠️ Config values (`VenOracleSettings`) are environment-specific → mark `[ENV]`. Not in export.

### 2. `Venture.Utilities.Email.Email`
- **Assembly:** `Venture.Utilities.Email` (🔴 source absent)
- **Kind:** message/data type used as `msgEmail` and as the map's target tree. Namespace `http://Venture.Utilities.Email.Email`.
- **Shape (from usage):** `Email{ Subject, Body, SendToList{ SendTo }, SendCcList{ SendCc } }`.
- **Call-sites:** message declaration `msgEmail` (OID `40de7521`); map `TrgTree`.

### 3. `Venture.Utilities.Email.SendEmail`
- **Assembly:** `Venture.Utilities.Email` (🔴 source absent)
- **Signature (as called):** invokable taking `Venture.Utilities.Email.Email` In — sends the email via SMTP (inferred from name; **logic not in export**).
- **Call-site:** `ProcessChangePOIncoming.odx` shape "Call SendEmail" (OID `a16286f8`).

### Framework calls (replicable, not gaps)
- `System.Diagnostics.EventLog.WriteEntry(source, message)` — Windows EventLog writes for diagnostics (3 call-sites). Maps to standard MuleSoft logging.
- `xpath(...)` / `System.Convert.ToDouble(...)` — BizTalk/.NET inline expressions.
